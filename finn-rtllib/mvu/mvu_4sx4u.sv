/******************************************************************************
 * Copyright (C) 2024, Advanced Micro Devices, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION). HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @brief	Matrix Vector Unit (MVU) core compute kernel utilizing DSP48.
 *****************************************************************************/

module mvu_4sx4u #(
	int unsigned  PE,
	int unsigned  SIMD,
	int unsigned  ACCU_WIDTH,

	int unsigned  VERSION = 1,	// Version 1 (DSP48E1) *must* commit to NARROW_WEIGHTS
	bit  SIGNED_ACTIVATIONS = 0,
	bit  NARROW_WEIGHTS   = 0,	// Weights from [-7:7] rather than [-8:7]
	bit  FORCE_BEHAVIORAL = 0
)(
	// Global Control
	input	logic  clk,
	input	logic  rst,
	input	logic  en,

	// Input
	input	logic  last,
	input	logic  zero,	// ignore current inputs and force this partial product to zero
	input	logic signed [PE-1:0][SIMD-1:0][3:0]  w,	// signed weights
	input	logic                [SIMD-1:0][3:0]  a,	// unsigned activations (override by SIGNED_ACTIVATIONS)

	// Ouput
	output	logic  vld,
	output	logic signed [PE-1:0][ACCU_WIDTH-1:0]  p
);
	// for verilator always use behavioral code
	localparam bit  BEHAVIORAL =
`ifdef VERILATOR
		1 ||
`endif
		FORCE_BEHAVIORAL;

	//-----------------------------------------------------------------------
	// Determine Lane Configuration
	typedef struct {
		int unsigned  OFFSET[4:0];
		int unsigned  LO_WIDTH[3:0];
		int unsigned  HI_WIDTH[2:0];
		int unsigned  LO_WIDTH_MAX;	// exluding leftmost lane
		int unsigned  HI_WIDTH_MAX;	// exluding leftmost lane
	} slicing_t;
	function slicing_t sliceLanes();
		automatic int unsigned  offset[4:0];
		automatic int unsigned  lo_width[3:0];
		automatic int unsigned  hi_width[2:0];
		automatic int unsigned  lw_max;	// exluding leftmost lane
		automatic int unsigned  hw_max;	// exluding leftmost lane

		// Determine Lane Offsets
		unique case(VERSION)
		1: begin
			if(!NARROW_WEIGHTS) begin
				$error("%m: Need NARROW_WEIGHTS for DSP48E1.");
				$finish;
			end
			offset = '{ ACCU_WIDTH+21, 21, 14, 7, 0 };
		end
		2: begin
			offset = NARROW_WEIGHTS?
				'{ ACCU_WIDTH+23, 23, 16, 8, 0 } :
				'{ ACCU_WIDTH+22, 22, 15, 8, 0 };
		end
		endcase

		// Derive other Lane Attributes
		for(int unsigned  i = 0; i < 4; i++) begin
			automatic int unsigned  lw = offset[i+1] - offset[i];
			lo_width[i] = lw;

			if(i < 3) begin
				automatic int unsigned  hw = 1 + $clog2(2**(ACCU_WIDTH-lw-1)+SIMD);
				hi_width[i] = hw;

				if(lw > lw_max)  lw_max = lw;
				if(hw > hw_max)  hw_max = hw;
			end
		end

		return  slicing_t'{
			OFFSET:       offset,
			LO_WIDTH:     lo_width,
			HI_WIDTH:     hi_width,
			LO_WIDTH_MAX: lw_max,
			HI_WIDTH_MAX: hw_max
		};

	endfunction : sliceLanes
	localparam slicing_t  SLICING = sliceLanes();
	localparam int unsigned  A_WIDTH = 23 + 2*VERSION;	// Width of A datapath

	// Compute the count of decendents for all nodes in the reduction trees.
	typedef int unsigned  leave_load_t[2*SIMD-1];
	function leave_load_t init_leave_loads();
		automatic leave_load_t  res;
		for(int  i = 2*(SIMD-1); i >= int'(SIMD)-1; i--)  res[i] = 1;
		for(int  i = SIMD-2; i >= 0; i--)  res[i] = res[2*i+1] + res[2*i+2];
		return  res;
	endfunction : init_leave_loads

	// Pipeline for last indicator flag
	logic [1:5] L = '0;
	always_ff @(posedge clk) begin
		if(rst)      L <= '0;
		else if(en)  L <= { last, L[1:4] };
	end
	assign	vld = L[5];

	// Stages #1 - #3: DSP Lanes + cross-lane canaries duplicated with SIMD parallelism
	localparam int unsigned  PIPE_COUNT = (PE+3)/4;
	for(genvar  c = 0; c < PIPE_COUNT; c++) begin : genPipes

		localparam int unsigned  PE_BEG = 4*c;
		localparam int unsigned  PE_END = PE < 4*(c+1)? PE : 4*(c+1);
		localparam int unsigned  PE_REM = 4*(c+1) - PE_END;

		uwire        [47:0]  p3[SIMD];
		uwire signed [ 1:0]  h3[SIMD][3];
		for(genvar  s = 0; s < SIMD; s++) begin : genSIMD

			// Input Lane Assembly
			uwire [17:0]  bb = { {(14){SIGNED_ACTIVATIONS && a[s][3]}}, a[s] };
			logic [29:0]  aa;
			logic [26:0]  dd;
			logic [ 1:0]  xx[3:1];
			if(1) begin : blkVectorize
				uwire signed [3:0]  ww[PE_END - PE_BEG];
				for(genvar  pe = 0; pe < PE_END - PE_BEG; pe++) begin
					assign	ww[pe] = w[PE_BEG + pe][s];
					if(pe) begin
						if(BEHAVIORAL)  assign  xx[pe + PE_REM] = zero? 0 : ww[pe] * a[s];
`ifndef VERILATOR
						else begin
							LUT6_2 #(.INIT(64'h0000_6AC0_0000_8888)) lut_x (
								.O6(xx[pe + PE_REM][1]),
								.O5(xx[pe + PE_REM][0]),
								.I5(1'b1),
								.I4(zero),
								.I3(ww[pe][1]),
								.I2(a[s][1]),
								.I1(ww[pe][0]),
								.I0(a[s][0])
							);
						end
`endif
					end
				end
				always_comb begin
					dd = '0;
					aa = '0;
					for(int unsigned  pe = 0; pe < PE_END - PE_BEG; pe++) begin
						automatic int unsigned  ofs = SLICING.OFFSET[pe + PE_REM];
						dd[ofs+:3] = ww[pe];
						assert(!NARROW_WEIGHTS || rst || !en || zero || (ww[pe] != -8)) else begin
							$warning("%m: Weight of -8 violates NARROW_WEIGHTS commitment.");
						end

						// The sign of the weights are generally put on the subtracted A port.
						// However, when coinciding with the actual sign bit position of the
						// multiplier input path, it also goes onto the D input. This prevents
						// sign extensions that may happen when a DSP primitive is auto-promoted
						// to a newer generation.
						if(ofs+3 == A_WIDTH-1)  dd[ofs+3] = ww[pe][3];
						else                    aa[ofs+3] = ww[pe][3];
					end
				end
			end : blkVectorize

			uwire [47:0]  pp;

			// Note: Since the product B * AD is computed,
			//       rst can be only applied to AD and zero only to B
			//       with the same effect as zeroing both.
			if(BEHAVIORAL) begin : genBehav

				// Stage #1: Input Refine
				logic signed [17:0]  B1  = 0;
				always_ff @(posedge clk) begin
					if(zero)     B1  <= 0;
					else if(en)  B1  <= bb;
				end

				logic signed [A_WIDTH-1:0]  AD1 = 0;
				always_ff @(posedge clk) begin
					if(rst)      AD1 <= 0;
					else if(en)  AD1 <= dd - aa;
				end

				// Stage #2: Multiply
				logic signed [45:0]  M2 = 0;
				always_ff @(posedge clk) begin
					if(rst)      M2 <= 0;
					else if(en)  M2 <=
// synthesis translate off
						(B1 === '0) || (AD1 === '0)? 0 :
// synthesis translate on
						B1 * AD1;
				end

				// Stage #3: Accumulate
				logic signed [47:0]  P3 = 0;
				always_ff @(posedge clk) begin
					if(rst)      P3 <= 0;
					else if(en)  P3 <= M2 + (L[3]? 0 : P3);
				end

				assign	pp = P3;
			end : genBehav
`ifndef VERILATOR
			else begin : genDSP
				localparam logic [6:0]  OPMODE_INVERSION = 7'b010_01_01;
				uwire [6:0]  opmode = { { 1'b0, L[2], 1'b0 }, 4'b00_00 };
				case(VERSION)
				1: DSP48E1 #(
					// Feature Control Attributes: Data Path Selection
					.A_INPUT("DIRECT"),		// Selects A input source, "DIRECT" (A port) or "CASCADE" (ACIN port)
					.B_INPUT("DIRECT"),		// Selects B input source, "DIRECT" (B port) or "CASCADE" (BCIN port)
					.USE_DPORT("TRUE"),		// Select D port usage (TRUE or FALSE)
					.USE_MULT("MULTIPLY"),	// Select multiplier usage ("MULTIPLY", "DYNAMIC", or "NONE")
					.USE_SIMD("ONE48"),		// SIMD selection ("ONE48", "TWO24", "FOUR12")

					// Pattern Detector Attributes: Pattern Detection Configuration
					.AUTORESET_PATDET("NO_RESET"),		// "NO_RESET", "RESET_MATCH", "RESET_NOT_MATCH"
					.MASK('1),							// 48-bit mask value for pattern detect (1=ignore)
					.PATTERN('0),						// 48-bit pattern match for pattern detect
					.SEL_MASK("MASK"),					// "C", "MASK", "ROUNDING_MODE1", "ROUNDING_MODE2"
					.SEL_PATTERN("PATTERN"),			// Select pattern value ("PATTERN" or "C")
					.USE_PATTERN_DETECT("NO_PATDET"),	// Enable pattern detect ("PATDET" or "NO_PATDET")

					// Register Control Attributes: Pipeline Register Configuration
					.ACASCREG(0),		// Number of pipeline stages between A/ACIN and ACOUT (0, 1 or 2)
					.ADREG(1),			// Number of pipeline stages for pre-adder (0 or 1)
					.ALUMODEREG(0),		// Number of pipeline stages for ALUMODE (0 or 1)
					.AREG(0),			// Number of pipeline stages for A (0, 1 or 2)
					.BCASCREG(1),		// Number of pipeline stages between B/BCIN and BCOUT (0, 1 or 2)
					.BREG(1),			// Number of pipeline stages for B (0, 1 or 2)
					.CARRYINREG(0),		// Number of pipeline stages for CARRYIN (0 or 1)
					.CARRYINSELREG(0),	// Number of pipeline stages for CARRYINSEL (0 or 1)
					.CREG(0),			// Number of pipeline stages for C (0 or 1)
					.DREG(0),			// Number of pipeline stages for D (0 or 1)
					.INMODEREG(0),		// Number of pipeline stages for INMODE (0 or 1)
					.MREG(1),			// Number of multiplier pipeline stages (0 or 1)
					.OPMODEREG(1),		// Number of pipeline stages for OPMODE (0 or 1)
					.PREG(1)			// Number of pipeline stages for P (0 or 1)
				) dsp (
					// Cascade: 30-bit (each) output: Cascade Ports
					.ACOUT(),			// 30-bit output: A port cascade output
					.BCOUT(),			// 18-bit output: B port cascade output
					.CARRYCASCOUT(),	// 1-bit output: Cascade carry output
					.MULTSIGNOUT(),		// 1-bit output: Multiplier sign cascade output
					.PCOUT(),			// 48-bit output: Cascade output

					// Control: 1-bit (each) output: Control Inputs/Status Bits
					.OVERFLOW(),		 // 1-bit output: Overflow in add/acc output
					.PATTERNBDETECT(),	 // 1-bit output: Pattern bar detect output
					.PATTERNDETECT(),	 // 1-bit output: Pattern detect output
					.UNDERFLOW(),		 // 1-bit output: Underflow in add/acc output

					// Data: 4-bit (each) output: Data Ports
					.CARRYOUT(),	// 4-bit output: Carry output
					.P(pp),			// 48-bit output: Primary data output

					// Cascade: 30-bit (each) input: Cascade Ports
					.ACIN('x),			 // 30-bit input: A cascade data input
					.BCIN('x),			 // 18-bit input: B cascade input
					.CARRYCASCIN('x),	 // 1-bit input: Cascade carry input
					.MULTSIGNIN('x),	 // 1-bit input: Multiplier sign input
					.PCIN('x),			 // 48-bit input: P cascade input

					// Control: 4-bit (each) input: Control Inputs/Status Bits
					.CLK(clk),				// 1-bit input: Clock input
					.ALUMODE('0),			// 4-bit input: ALU control input
					.CARRYINSEL('0),		// 3-bit input: Carry select input
					.INMODE(5'b01100),		// 5-bit input: INMODE control input
					.OPMODE(opmode ^ OPMODE_INVERSION), // 7-bit input: Operation mode input

					// Data: 30-bit (each) input: Data Ports
					.A(aa),			// 30-bit input: A data input
					.B(bb),			// 18-bit input: B data input
					.C('x),			// 48-bit input: C data input
					.CARRYIN('0),	// 1-bit input: Carry input signal
					.D(dd),			// 25-bit input: D data input

					// Reset/Clock Enable: 1-bit (each) input: Reset/Clock Enable Inputs
					.CEA1('0),			// 1-bit input: Clock enable input for 1st stage AREG
					.CEA2('0),			// 1-bit input: Clock enable input for 2nd stage AREG
					.CEAD(en),			// 1-bit input: Clock enable input for ADREG
					.CEALUMODE('0),		// 1-bit input: Clock enable input for ALUMODERE
					.CEB1('0),			// 1-bit input: Clock enable input for 1st stage BREG
					.CEB2(en),			// 1-bit input: Clock enable input for 2nd stage BREG
					.CEC('0),			// 1-bit input: Clock enable input for CREG
					.CECARRYIN('0),		// 1-bit input: Clock enable input for CARRYINREG
					.CECTRL(en),		// 1-bit input: Clock enable input for OPMODEREG and CARRYINSELREG
					.CED('0),			// 1-bit input: Clock enable input for DREG
					.CEINMODE('0),		// 1-bit input: Clock enable input for INMODEREG
					.CEM(en),			// 1-bit input: Clock enable input for MREG
					.CEP(en),			// 1-bit input: Clock enable input for PREG
					.RSTA('0),			// 1-bit input: Reset input for AREG
					.RSTB(				// 1-bit input: Reset for BREG
// synthesis translate_off
						rst ||
// synthesis translate_on
						zero
					),
					.RSTC('0),			// 1-bit input: Reset for CREG
					.RSTD(				// 1-bit input: Reset for DREG and ADREG
// synthesis translate_off
						zero ||
// synthesis translate_on
						rst
					),
					.RSTALLCARRYIN('0),	// 1-bit input: Reset for CARRYINREG
					.RSTALUMODE('0),	// 1-bit input: Reset for ALUMODEREG
					.RSTCTRL('0),		// 1-bit input: Reset for OPMODEREG and CARRYINSELREG
					.RSTINMODE('0),		// 1-bit input: Reset for INMODE register
					.RSTM(rst),			// 1-bit input: Reset for MREG
					.RSTP(rst)			// 1-bit input: Reset for PREG
				);
				2: DSP48E2 #(
					// Feature Control Attributes: Data Path Selection
					.AMULTSEL("AD"),	// Selects A input to multiplier (A, AD)
					.A_INPUT("DIRECT"),	// Selects A input source, "DIRECT" (A port) or "CASCADE" (ACIN port)
					.BMULTSEL("B"),		// Selects B input to multiplier (AD, B)
					.B_INPUT("DIRECT"),	// Selects B input source, "DIRECT" (B port) or "CASCADE" (BCIN port)
					.PREADDINSEL("A"),                 // Selects input to pre-adder (A, B)
					.RND('0),                          // Rounding Constant
					.USE_MULT("MULTIPLY"),             // Select multiplier usage (DYNAMIC, MULTIPLY, NONE)
					.USE_SIMD("ONE48"),                // SIMD selection (FOUR12, ONE58, TWO24)
					.USE_WIDEXOR("FALSE"),             // Use the Wide XOR function (FALSE, TRUE)
					.XORSIMD("XOR24_48_96"),       // Mode of operation for the Wide XOR (XOR12_22, XOR24_34_58_116)

					// Pattern Detector Attributes: Pattern Detection Configuration
					.AUTORESET_PATDET("NO_RESET"),     // NO_RESET, RESET_MATCH, RESET_NOT_MATCH
					.AUTORESET_PRIORITY("RESET"),      // Priority of AUTORESET vs. CEP (CEP, RESET).
					.MASK('1),                         // 58-bit mask value for pattern detect (1=ignore)
					.PATTERN('0),                      // 58-bit pattern match for pattern detect
					.SEL_MASK("MASK"),                 // C, MASK, ROUNDING_MODE1, ROUNDING_MODE2
					.SEL_PATTERN("PATTERN"),           // Select pattern value (C, PATTERN)
					.USE_PATTERN_DETECT("NO_PATDET"),  // Enable pattern detect (NO_PATDET, PATDET)

					// Programmable Inversion Attributes: Specifies built-in programmable inversion on specific pins
					.IS_ALUMODE_INVERTED('0),							// Optional inversion for ALUMODE
					.IS_CARRYIN_INVERTED('0),							// Optional inversion for CARRYIN
					.IS_CLK_INVERTED('0),								// Optional inversion for CLK
					.IS_INMODE_INVERTED('0),							// Optional inversion for INMODE
					.IS_OPMODE_INVERTED({ 2'b00, OPMODE_INVERSION}),	// Optional inversion for OPMODE
					.IS_RSTALLCARRYIN_INVERTED('0),						// Optional inversion for RSTALLCARRYIN
					.IS_RSTALUMODE_INVERTED('0),						// Optional inversion for RSTALUMODE
					.IS_RSTA_INVERTED('0),								// Optional inversion for RSTA
					.IS_RSTB_INVERTED('0),								// Optional inversion for RSTB
					.IS_RSTCTRL_INVERTED('0),							// Optional inversion for STCONJUGATE_A
					.IS_RSTC_INVERTED('0),								// Optional inversion for RSTC
					.IS_RSTD_INVERTED('0),								// Optional inversion for RSTD
					.IS_RSTINMODE_INVERTED('0),							// Optional inversion for RSTINMODE
					.IS_RSTM_INVERTED('0),								// Optional inversion for RSTM
					.IS_RSTP_INVERTED('0),								// Optional inversion for RSTP

					// Register Control Attributes: Pipeline Register Configuration
					.ACASCREG(0),                      // Number of pipeline stages between A/ACIN and ACOUT (0-2)
					.ADREG(1),                         // Pipeline stages for pre-adder (0-1)
					.ALUMODEREG(0),                    // Pipeline stages for ALUMODE (0-1)
					.AREG(0),                          // Pipeline stages for A (0-2)
					.BCASCREG(1),                      // Number of pipeline stages between B/BCIN and BCOUT (0-2)
					.BREG(1),                          // Pipeline stages for B (0-2)
					.CARRYINREG(0),                    // Pipeline stages for CARRYIN (0-1)
					.CARRYINSELREG(0),                 // Pipeline stages for CARRYINSEL (0-1)
					.CREG(0),                          // Pipeline stages for C (0-1)
					.DREG(0),                          // Pipeline stages for D (0-1)
					.INMODEREG(0),                     // Pipeline stages for INMODE (0-1)
					.MREG(1),                          // Multiplier pipeline stages (0-1)
					.OPMODEREG(1),                     // Pipeline stages for OPMODE (0-1)
					.PREG(1)                          // Number of pipeline stages for P (0-1)
				) dsp (
					// Cascade outputs: Cascade Ports
					.ACOUT(),			// 34-bit output: A port cascade
					.BCOUT(),			// 24-bit output: B cascade
					.CARRYCASCOUT(),	// 1-bit output: Cascade carry
					.MULTSIGNOUT(),		// 1-bit output: Multiplier sign cascade
					.PCOUT(),			// 58-bit output: Cascade output

					// Control outputs: Control Inputs/Status Bits
					.OVERFLOW(),		// 1-bit output: Overflow in add/acc
					.PATTERNBDETECT(),	// 1-bit output: Pattern bar detect
					.PATTERNDETECT(),	// 1-bit output: Pattern detect
					.UNDERFLOW(),		// 1-bit output: Underflow in add/acc

					// Data outputs: Data Ports
					.CARRYOUT(),		// 4-bit output: Carry
					.P(pp),				// 58-bit output: Primary data
					.XOROUT(),			// 8-bit output: XOR data

					// Cascade inputs: Cascade Ports
					.ACIN('x),			// 34-bit input: A cascade data
					.BCIN('x),			// 24-bit input: B cascade
					.CARRYCASCIN('x),	// 1-bit input: Cascade carry
					.MULTSIGNIN('x),	// 1-bit input: Multiplier sign cascade
					.PCIN('x),			// 58-bit input: P cascade

					// Control inputs: Control Inputs/Status Bits
					.CLK(clk),					// 1-bit input: Clock
					.ALUMODE(4'h0),				// 4-bit input: ALU control
					.CARRYINSEL('0),			// 3-bit input: Carry select
					.INMODE(5'b01100),			// 5-bit input: INMODE control
					.OPMODE({ 2'b00, opmode }),	// 9-bit input: Operation mode

					// Data inputs: Data Ports
					.A(aa),						// 34-bit input: A data
					.B(bb),						// 24-bit input: B data
					.C('x),						// 58-bit input: C data
					.CARRYIN('0),				// 1-bit input: Carry-in
					.D(dd),						// 27-bit input: D data

					// Reset/Clock Enable inputs: Reset/Clock Enable Inputs
					.CEA1('0),			// 1-bit input: Clock enable for 1st stage AREG
					.CEA2('0),			// 1-bit input: Clock enable for 2nd stage AREG
					.CEAD(en),			// 1-bit input: Clock enable for ADREG
					.CEALUMODE('0),		// 1-bit input: Clock enable for ALUMODE
					.CEB1('0),			// 1-bit input: Clock enable for 1st stage BREG
					.CEB2(en),			// 1-bit input: Clock enable for 2nd stage BREG
					.CEC('0),			// 1-bit input: Clock enable for CREG
					.CECARRYIN('0),		// 1-bit input: Clock enable for CARRYINREG
					.CECTRL(en),		// 1-bit input: Clock enable for OPMODEREG and CARRYINSELREG
					.CED('0),			// 1-bit input: Clock enable for DREG
					.CEINMODE('0),		// 1-bit input: Clock enable for INMODEREG
					.CEM(en),			// 1-bit input: Clock enable for MREG
					.CEP(en),			// 1-bit input: Clock enable for PREG
					.RSTA('0),			// 1-bit input: Reset for AREG
					.RSTB(				// 1-bit input: Reset for BREG
// synthesis translate_off
						rst ||
// synthesis translate_on
						zero
					),
					.RSTC('0),			// 1-bit input: Reset for CREG
					.RSTD(				// 1-bit input: Reset for DREG and ADREG
// synthesis translate_off
						zero ||
// synthesis translate_on
						rst
					),
					.RSTALLCARRYIN('0),	// 1-bit input: Reset for CARRYINREG
					.RSTALUMODE('0),	// 1-bit input: Reset for ALUMODEREG
					.RSTCTRL('0),		// 1-bit input: Reset for OPMODEREG and CARRYINSELREG
					.RSTINMODE('0),		// 1-bit input: Reset for INMODE register
					.RSTM(rst),			// 1-bit input: Reset for MREG
					.RSTP(rst)			// 1-bit input: Reset for PREG
				);
				default: initial begin
					$error("Unknown version DSP48E%0d.", VERSION);
					$finish;
				end
				endcase
			end : genDSP
`endif

			// External Canary Pipeline
			logic [1:0]  X1[3:1] = '{ default: 0 };
			logic [1:0]  X2[3:1] = '{ default: 0 };
			logic [1:0]  X3[3:1] = '{ default: 0 };
			always_ff @(posedge clk) begin
				if(rst) begin
					X1 <= '{ default: 0 };
					X2 <= '{ default: 0 };
					X3 <= '{ default: 0 };
				end
				else if(en) begin
					X1 <= xx;
					X2 <= X1;
					foreach(X3[i]) begin
						X3[i] <= X2[i] + (L[3]? 2'h0 : pp[SLICING.OFFSET[i]+:2]);
					end
				end
			end

			// Derive actual cross-lane overflows
			for(genvar  i = 0; i < 3; i++) begin
				assign	h3[s][i] = pp[SLICING.OFFSET[i+1]+:2] - X3[i+1];
			end
			assign	p3[s] = pp;

		end : genSIMD

		// Stage #4: Cross-SIMD Reduction

		// Count leaves reachable from each node
		localparam leave_load_t  LEAVE_LOAD = SIMD > 1 ? init_leave_loads() : '{ default: 1 }; // SIMD=1 requires no adder tree, so zero-ing out, otherwise init_leave_loads ends up in infinite loop

		uwire signed [ACCU_WIDTH-1:0]  up4;
		uwire signed [             SLICING.HI_WIDTH_MAX-1:0]  hi4[3];
		uwire        [$clog2(SIMD)+SLICING.LO_WIDTH_MAX-1:0]  lo4[3];
		for(genvar  i = 0; i < 4; i++) begin

			// Conclusive high part accumulation
			if(i < 3) begin : genHi
				if(i < PE_REM)  assign  hi4[i] = '0;
				else begin
					localparam int unsigned  HI_WIDTH = SLICING.HI_WIDTH[i];

					// Adder Tree across all SIMD high contributions, each from [-1:1]
					uwire signed [2*SIMD-2:0][$clog2(1+SIMD):0]  tree;
					for(genvar  s = 0; s < SIMD;   s++)  assign  tree[SIMD-1+s] = h3[s][i];
					for(genvar  n = 0; n < SIMD-1; n++) begin
						// Sum truncated to actual maximum bit width at this node
						uwire signed [$clog2(1+LEAVE_LOAD[n]):0]  s = $signed(tree[2*n+1]) + $signed(tree[2*n+2]);
						assign  tree[n] = s;
					end

					// High Sideband Accumulation
					logic signed [HI_WIDTH-1:0]  Hi4 = 0;
					always_ff @(posedge clk) begin
						if(rst)      Hi4 <= 0;
						else if(en) begin
							automatic logic signed [HI_WIDTH:0]  h = $signed(L[4]? 0 : Hi4) + $signed(tree[0]);
							assert(h[HI_WIDTH] == h[HI_WIDTH-1]) else begin
								$error("%m: Accumulation overflow for ACCU_WIDTH=%0d", ACCU_WIDTH);
								$stop;
							end
							Hi4 <= h;
						end
					end
					assign	hi4[i] = Hi4;

				end
			end : genHi

			// Conclusive low part accumulation (all unsigned arithmetic)
			if(i < PE_REM)  assign  lo4[i] = '0;
			else begin : genLo
				localparam int unsigned  LO_WIDTH = SLICING.LO_WIDTH[i];

				// Adder Tree across all SIMD low contributions
				localparam int unsigned  ROOT_WIDTH = $clog2(1 + SIMD*(2**LO_WIDTH-1));
				uwire [2*SIMD-2:0][ROOT_WIDTH-1:0]  tree;
				for(genvar  s = 0; s < SIMD;   s++)  assign  tree[SIMD-1+s] = p3[s][SLICING.OFFSET[i]+:LO_WIDTH];
				for(genvar  n = 0; n < SIMD-1; n++) begin
					// Sum truncated to actual maximum bit width at this node
					localparam int unsigned  NODE_WIDTH = $clog2(1 + LEAVE_LOAD[n]*(2**LO_WIDTH-1));
					uwire [NODE_WIDTH-1:0]  s = tree[2*n+1] + tree[2*n+2];
					assign  tree[n] = s;
				end

				logic [ROOT_WIDTH-1:0]  Lo4 = 0;
				always_ff @(posedge clk) begin
					if(rst)      Lo4 <= 0;
					else if(en)  Lo4 <= tree[0];
				end

				if(i == 3)  assign  up4 = Lo4;
				else  assign  lo4[i] = Lo4;
			end : genLo

		end

		// Stage #5: Resolve lane totals
		logic signed [3:0][ACCU_WIDTH-1:0]  Res5 = '{ default: 0 };
		always_ff @(posedge clk) begin
			if(rst)  Res5 <= '{ default: 0 };
			else if(en) begin
				Res5[3] <= up4 - hi4[2];
				Res5[2] <= $signed({ hi4[2], {(SLICING.LO_WIDTH[2]){1'b0}} }) + $signed({ 1'b0, lo4[2] }) - hi4[1];
				Res5[1] <= $signed({ hi4[1], {(SLICING.LO_WIDTH[1]){1'b0}} }) + $signed({ 1'b0, lo4[1] }) - hi4[0];
				Res5[0] <= $signed({ hi4[0], {(SLICING.LO_WIDTH[0]){1'b0}} }) + $signed({ 1'b0, lo4[0] });
			end
		end

		// Output
		for(genvar  pe = PE_BEG; pe < PE_END; pe++) begin
			assign	p[pe] = Res5[pe - PE_BEG + PE_REM];
		end

	end : genPipes

endmodule : mvu_4sx4u

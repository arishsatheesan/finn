# Copyright (c) 2020, Xilinx
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# * Redistributions of source code must retain the above copyright notice, this
#   list of conditions and the following disclaimer.
#
# * Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.
#
# * Neither the name of FINN nor the names of its
#   contributors may be used to endorse or promote products derived from
#   this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import math
import numpy as np
import os

from finn.core.datatype import DataType
from finn.custom_op.fpgadataflow.hlscustomop import HLSCustomOp
from finn.custom_op.general.im2col import compute_conv_output_dim
from finn.util.data_packing import npy_to_rtlsim_input, rtlsim_output_to_npy
from finn.custom_op.general import im2col

from finn.util.basic import (
    get_rtlsim_trace_depth,
    make_build_dir,
)

try:
    from pyverilator import PyVerilator
except ModuleNotFoundError:
    PyVerilator = None

# This operation should only be used for 1D convolutions. Either the
# IFMDim_H or IFMDim_W should be '1', which represents the so-called
# dummy-dimension

# ONNX i/o tensor shape assumptions for ConvolutionInputGenerator1D:
# input 0 is the input tensor, shape NHWC = (1, IFMDim_H, IFMDim_W, IFMChannels)
# output 0 is the output tensor, shape NHWC:
#     = (1, OFMDim_H, OFMDim_W, (ConvKernelDim_H*ConvKernelDim_W)*IFMChannels)

# note: the actual data layout produced by the hlslib kernels is different
# for depthwise and non-depthwise ops.
# * non-depthwise SWG: (1, OFMDim_H, OFMDim_W, K_H, K_W, IFMChannels/SIMD, SIMD)
# * depthwise SWG: (1, OFMDim_H, OFMDim_W, IFMChannels/SIMD, K_H, K_W, SIMD)
# see test_fpgadataflow_slidingwindow.py for an example of how to transform
# between the two layouts


class ConvolutionInputGenerator_rtl(HLSCustomOp):
    """Class that corresponds to one of the 1D finn-hlslib ConvolutionInputGenerator
    (sliding window) function variants. Depending on the combination of
    attributes (e.g. depthwise or not, whether dilation is 0) a different
    variant will be picked for the actual HLS implementation."""

    def __init__(self, onnx_node):
        super().__init__(onnx_node)

    def get_nodeattr_types(self):
        my_attrs = {
            "ConvKernelDim": ("ints", True, []),  # [H, W] = [Y, X]
            "IFMChannels": ("i", True, 0),
            "IFMDim": ("ints", True, []),  # [H, W] = [Y, X]
            "OFMDim": ("ints", True, []),  # [H, W] = [Y, X]
            "SIMD": ("i", True, 0),
            "Stride": ("ints", True, []),  # [H, W] = [Y, X]
            "Dilation": ("ints", True, []),  # [H, W] = [Y, X]
            # FINN DataTypes for inputs, weights, outputs
            "inputDataType": ("s", True, ""),
            "outputDataType": ("s", True, ""),
            "depthwise": ("i", False, 0, {0, 1}),
            # FPGA resource type for ConvolutionInputGenerator input buffer
            # auto -- let Vivado HLS decide
            # block -- use BRAM
            # distributed -- use LUTRAM
            # ultra -- use URAM
            "ram_style": (
                "s",
                False,
                "distributed",
                {"auto", "block", "distributed", "ultra"},
            ),
            "gen_top_module": ("s", False, ""),
        }
        my_attrs.update(super().get_nodeattr_types())
        return my_attrs

    def get_normal_input_shape(self):
        ifm_dim_h, ifm_dim_w = self.get_nodeattr("IFMDim")
        ifm_ch = self.get_nodeattr("IFMChannels")
        ishape = (1, ifm_dim_h, ifm_dim_w, ifm_ch)
        return ishape

    def get_folded_input_shape(self):
        ifm_dim_h, ifm_dim_w = self.get_nodeattr("IFMDim")
        ifm_ch = self.get_nodeattr("IFMChannels")
        simd = self.get_nodeattr("SIMD")
        assert ifm_ch % simd == 0, "SIMD must divide IFMChannels"
        wf = int(ifm_ch / simd)
        folded_ishape = (1, ifm_dim_h, ifm_dim_w, wf, simd)
        return folded_ishape

    def get_normal_output_shape(self):
        k_h, k_w = self.get_nodeattr("ConvKernelDim")
        ifm_dim_h, ifm_dim_w = self.get_nodeattr("IFMDim")
        ifm_ch = self.get_nodeattr("IFMChannels")
        stride_h, stride_w = self.get_nodeattr("Stride")
        dilation_h, dilation_w = self.get_nodeattr("Dilation")
        pad = 0
        ofm_dim_h = compute_conv_output_dim(ifm_dim_h, k_h, stride_h, pad, dilation_h)
        ofm_dim_w = compute_conv_output_dim(ifm_dim_w, k_w, stride_w, pad, dilation_w)
        oshape = (1, ofm_dim_h, ofm_dim_w, k_h * k_w * ifm_ch)
        return oshape

    def get_folded_output_shape(self):
        k_h, k_w = self.get_nodeattr("ConvKernelDim")
        ifm_dim_h, ifm_dim_w = self.get_nodeattr("IFMDim")
        ifm_ch = self.get_nodeattr("IFMChannels")
        stride_h, stride_w = self.get_nodeattr("Stride")
        dilation_h, dilation_w = self.get_nodeattr("Dilation")
        simd = self.get_nodeattr("SIMD")
        pad = 0
        ofm_dim_h = compute_conv_output_dim(ifm_dim_h, k_h, stride_h, pad, dilation_h)
        ofm_dim_w = compute_conv_output_dim(ifm_dim_w, k_w, stride_w, pad, dilation_w)
        assert ifm_ch % simd == 0, "SIMD must divide IFMChannels"
        if self.use_parallel_window_output():
            wf = int((ifm_ch) // simd)
            folded_oshape = (1, ofm_dim_h, ofm_dim_w, wf, k_h * k_w * simd)
        else:
            wf = int((k_h * k_w * ifm_ch) // simd)
            folded_oshape = (1, ofm_dim_h, ofm_dim_w, wf, simd)
        return folded_oshape

    def make_shape_compatible_op(self, model):
        exp_ishape = self.get_normal_input_shape()
        oshape = self.get_normal_output_shape()
        ishape = tuple(model.get_tensor_shape(self.onnx_node.input[0]))
        assert ishape == exp_ishape, "Unexpect input shape for ConvInpGen."
        return super().make_const_shape_op(oshape)

    def infer_node_datatype(self, model):
        node = self.onnx_node
        # data type stays the same
        dtype = model.get_tensor_datatype(node.input[0])
        model.set_tensor_datatype(node.output[0], dtype)

    def verify_node(self):
        pass

    def get_input_datatype(self):
        """Returns FINN DataType of input."""
        return DataType[self.get_nodeattr("inputDataType")]

    def get_output_datatype(self):
        """Returns FINN DataType of output."""
        return DataType[self.get_nodeattr("outputDataType")]

    def get_instream_width(self):
        ibits = self.get_input_datatype().bitwidth()
        simd = self.get_nodeattr("SIMD")
        ifm_ch = self.get_nodeattr("IFMChannels")
        assert ifm_ch % simd == 0, "SIMD must divide IFMChannels"
        in_width = simd * ibits
        return in_width

    def get_outstream_width(self):
        if self.use_parallel_window_output():
            # feed all window pixels in parallel
            k_h, k_w = self.get_nodeattr("ConvKernelDim")
            return self.get_instream_width() * k_h * k_w
        else:
            # if parallel variant not in use: same width for output and input stream
            return self.get_instream_width()

    def get_number_output_values(self):
        folded_oshape = self.get_folded_output_shape()
        num_output_elems = np.prod(folded_oshape[:-1])
        return num_output_elems

    def get_1d_conv_attrs_normalized(self):
        # support both (1, D) and (D, 1) cases transparently:
        # For the kernel, presenting the input data of size D as
        # [H, W] = [Y, X] = [1, D] or [D, 1]
        # effectively gives the same result. Because the
        # ConvolutionInputGenerator_NonSquare_Dilated(_dws) kernel currently only
        # supports dilation>1 along the X-axis and the
        # ConvolutionInputGenerator_NonSquare only works for stride>1 along the
        # X-axis, we are working with the following assumption:
        # the dummy ('1') dimension is the Y-dimension, i.e.
        # images and kernels (and their attributes) of dimension
        # [H, W] = [Y, X] = [D, 1] or [1, D] are always mapped to [1, D]
        ifm_ch = self.get_nodeattr("IFMChannels")
        k = self.get_nodeattr("ConvKernelDim")
        ifm_dim = self.get_nodeattr("IFMDim")
        ofm_dim = self.get_nodeattr("OFMDim")
        stride = self.get_nodeattr("Stride")
        dilation = self.get_nodeattr("Dilation")

        # see defines() for an explanation
        if ifm_dim[1] == 1:
            ifm_dim = ifm_dim[::-1]
            ofm_dim = ofm_dim[::-1]
            k = k[::-1]
            stride = stride[::-1]
            dilation = dilation[::-1]

        return (ifm_ch, ifm_dim, ofm_dim, k, stride, dilation)

    def use_parallel_window_output(self):
        # Check if simple "ConvolutionInputGenerator_1D_parallel" variant can be used to
        # feed window in parallel to the following layer, enabling full SIMD unfolding.
        dilation = self.get_nodeattr("Dilation")
        dilation_h, dilation_w = dilation

        #todo: make this configurable via mmv_out instead of an automatic selection

        if self.get_nodeattr("SIMD") == self.get_nodeattr("IFMChannels"):
            if self.get_nodeattr("depthwise") == 0:
                    return True

        return False

    def get_exp_cycles(self):
        simd = self.get_nodeattr("SIMD")
        (
            ifm_ch,
            ifm_dim,
            ofm_dim,
            k,
            stride,
            dilation,
        ) = self.get_1d_conv_attrs_normalized()
        ifm_dim_h, ifm_dim_w = ifm_dim
        ofm_dim_h, ofm_dim_w = ofm_dim
        k_h, k_w = k
        stride_h, stride_w = stride
        dilation_h, dilation_w = dilation

        # since mmv != 1 is not supported yet, we set mmv for now to 1
        mmv = 1
        # see https://github.com/Xilinx/finn-hlslib/blob/master/slidingwindow.h
        if self.use_parallel_window_output():
            exp_cycles = ifm_dim_w + 1
        else:
            cycles_write_block = (ofm_dim_w * k_w * k_h * (ifm_ch / simd)) / mmv
            cycles_read_block = stride_w * ifm_dim_w * (ifm_ch / simd)
            max_cycles = max(cycles_write_block, cycles_read_block)
            exp_cycles = (
                ifm_dim_w * k_h * dilation_h * (ifm_ch / simd) + ofm_dim_h * max_cycles
            )

        return int(exp_cycles)

    def bram_estimation(self):
        # NOTE: not tested for correctness
        simd = self.get_nodeattr("SIMD")
        ifm_ch = self.get_nodeattr("IFMChannels")
        ifm_dim = np.prod(self.get_nodeattr("IFMDim"))
        k = np.prod(self.get_nodeattr("ConvKernelDim"))
        stride = np.prod(self.get_nodeattr("Stride"))
        ram_style = self.get_nodeattr("ram_style")
        if ram_style == "block" or ram_style == "auto":
            ram_depth = ifm_dim * ifm_ch / simd
            if ram_depth <= 512:
                ram_width = 36
            elif ram_depth <= 1024:
                ram_width = 18
            elif ram_depth <= 2048:
                ram_width = 9
            elif ram_depth <= 4096:
                ram_width = 4
            elif ram_depth <= 8192:
                ram_width = 2
            else:
                ram_width = 1
            return int(
                (k + stride)
                * (
                    math.ceil(simd * self.get_input_datatype().bitwidth() / ram_width)
                    * math.ceil(ifm_dim * ifm_ch / simd / ram_depth)
                )
            )
        else:
            return 0

    def lut_estimation(self):
        # NOTE: not tested for correctness
        simd = self.get_nodeattr("SIMD")
        ifm_ch = self.get_nodeattr("IFMChannels")
        ifm_dim = np.prod(self.get_nodeattr("IFMDim"))
        k = np.prod(self.get_nodeattr("ConvKernelDim"))
        stride = np.prod(self.get_nodeattr("Stride"))
        ram_style = self.get_nodeattr("ram_style")
        if ram_style == "distributed":
            ram_luts = int(
                (k + stride)
                * (
                    simd
                    * self.get_input_datatype().bitwidth()
                    * math.ceil(ifm_dim * ifm_ch / simd / 64)
                )
            )
        else:
            ram_luts = 0
        return 300 + ram_luts

    def uram_estimation(self):
        # NOTE: not tested for correctness
        simd = self.get_nodeattr("SIMD")
        ifm_ch = self.get_nodeattr("IFMChannels")
        ifm_dim = np.prod(self.get_nodeattr("IFMDim"))
        k = np.prod(self.get_nodeattr("ConvKernelDim"))
        stride = np.prod(self.get_nodeattr("Stride"))
        ram_style = self.get_nodeattr("ram_style")
        if ram_style == "ultra":
            return int(
                (k + stride)
                * (
                    math.ceil(simd * self.get_input_datatype().bitwidth() / 64)
                    * math.ceil(ifm_dim * ifm_ch / simd / 4096)
                )
            )
        else:
            return 0

    def execute_node(self, context, graph):
        mode = self.get_nodeattr("exec_mode")
        node = self.onnx_node
        exp_ishape = self.get_normal_input_shape()
        exp_oshape = self.get_normal_output_shape()
        folded_ishape = self.get_folded_input_shape()
        folded_oshape = self.get_folded_output_shape()

        # TODO ensure codegen dir exists
        if mode == "cppsim":
            #code_gen_dir = self.get_nodeattr("code_gen_dir_cppsim")
            raise Exception(
                """cppsim not possible for RTL SWG""".format(
                    mode
                )
            )
        elif mode == "rtlsim":
            code_gen_dir = self.get_nodeattr("code_gen_dir_ipgen")
        else:
            raise Exception(
                """Invalid value for attribute exec_mode! Is currently set to: {}
            has to be set to one of the following value ("cppsim", "rtlsim")""".format(
                    mode
                )
            )

        inp = context[node.input[0]]
        assert str(inp.dtype) == "float32", "Input datatype is not float32"
        assert (
            inp.shape == exp_ishape
        ), """Input shape doesn't
        match expected shape (1, ifm_dim, ifm_dim, ifm_ch)."""
        if self.get_input_datatype() == DataType["BIPOLAR"]:
            # store bipolar activations as binary
            inp = (inp + 1) / 2
            export_idt = DataType["BINARY"]
        else:
            export_idt = self.get_input_datatype()
        # reshape input into folded form
        inp = inp.reshape(folded_ishape)
        # make copy before saving array
        reshaped_input = inp.copy()
        np.save(os.path.join(code_gen_dir, "input_0.npy"), reshaped_input)

        sim = self.get_rtlsim()
        nbits = self.get_instream_width()
        rtlsim_inp = npy_to_rtlsim_input(
            "{}/input_0.npy".format(code_gen_dir), export_idt, nbits
        )
        super().reset_rtlsim(sim)
        super().toggle_clk(sim)
        rtlsim_output = self.rtlsim(sim, rtlsim_inp)
        odt = export_idt
        target_bits = odt.bitwidth()
        packed_bits = self.get_outstream_width()
        out_npy_path = "{}/output.npy".format(code_gen_dir)
        out_shape = self.get_folded_output_shape()
        rtlsim_output_to_npy(
            rtlsim_output, out_npy_path, odt, out_shape, packed_bits, target_bits
        )
        # load and reshape output
        output = np.load(out_npy_path)
        output = np.asarray([output], dtype=np.float32).reshape(*exp_oshape)
        context[node.output[0]] = output

        # binary -> bipolar if needed
        if self.get_output_datatype() == DataType["BIPOLAR"]:
            out = context[node.output[0]]
            out = 2 * out - 1
            context[node.output[0]] = out
        assert (
            context[node.output[0]].shape == exp_oshape
        ), """Output
        shape doesn't match expected shape (1, ofm_dim_h, ofm_dim_w, k_h*k_w*ifm_ch)."""

    def global_includes(self):
        pass

    def defines(self, var):
        pass

    def read_npy_data(self):
        pass

    def strm_decl(self):
        pass

    def docompute(self):
        pass

    def dataoutstrm(self):
        pass

    def save_as_npy(self):
        pass

    def blackboxfunction(self):
        pass

    def pragmas(self):
        pass
        
    def generate_hdl(self):
        code_gen_dir = self.get_nodeattr("code_gen_dir_ipgen")
        f_debug = open(os.path.join(code_gen_dir, "swg_hdl_debuginfo.log"), "w")
        #debug:
        #f_debug = open(os.path.join("/workspace/finn/finn-rtllib/swg/", "swg_hdl_debuginfo.log"), "w")
        code_gen_dict = {}

        #--------------------
        # init hyperparameters
        # for 1D case: it does not matter if dummy dim is x or y
        ifm_ch = self.get_nodeattr("IFMChannels")
        k = self.get_nodeattr("ConvKernelDim")
        ifm_dim = self.get_nodeattr("IFMDim")
        ofm_dim = self.get_nodeattr("OFMDim")
        stride = self.get_nodeattr("Stride")
        dilation = self.get_nodeattr("Dilation")

        n = 1
        h, w = ifm_dim
        c = 1#ifm_ch not considered atm (always parallelize across c)
        k_h, k_w = k
        pad = [0,0,0,0]
        pad_val = 0
        stride_h, stride_w = stride
        dilation_h, dilation_w = dilation
        conv_c = 99

        # init folding config
        simd = self.get_nodeattr("SIMD")
        mmv_in = 1
        mmv_out = k_h*k_w

        assert simd==ifm_ch, "Constraint violated: SIMD = C"
        assert mmv_in==1, "Constraint violated: MMV_IN = 1"
        assert mmv_out==k_h*k_w, "Constraint violated: mmv_out = K"

        # how many "unused" registers are allowed between buffer positions that will be accessed in parallel
        # example:
        # 0: only consecutive access patterns will be implemented in regs, rest in BRAM line buffers
        # 2: [0, 3, 6] access pattern is still allowed and will be implemented with 1 7-position shift reg
        REG_BRAM_THRESHOLD = 1
        #--------------------

        in_shape = (n,c,h,w) #NCHW

        in_image = np.empty(in_shape, dtype=int)

        for index, x in np.ndenumerate(in_image):
            # "HWC" dummy values
            val = int((index[2]+1)*100+(index[3]+1)*10+(index[1]+1)*1)
            in_image[index] = val

        in_image_padded = np.pad(
            in_image,
            ((0, 0), (0, 0), (pad[0], pad[2]), (pad[1], pad[3])),
            mode="constant",
            constant_values=pad_val,
        )
        in_shape_padded = in_image_padded.shape
        h_padded = in_shape_padded[2]
        w_padded = in_shape_padded[3]

        pad_h = pad[0] + pad[2]
        pad_w = pad[1] + pad[3]
        out_dim_h = im2col.compute_conv_output_dim(h, k_h, stride_h, pad_h, dilation_h)
        out_dim_w = im2col.compute_conv_output_dim(w, k_w, stride_w, pad_w, dilation_w)

        f_debug.write("\n"+"in shape         " + str(in_shape))
        f_debug.write("\n"+"in shape padded  " + str(in_shape_padded))
        f_debug.write("\n"+"conv out shape   " + str((n,conv_c,out_dim_h,out_dim_w)))
        f_debug.write("\n"+"im2col out shape " + str((n,out_dim_h,out_dim_w,k_h*k_w*c)))

        idx_c, idx_h, idx_w = im2col.get_im2col_indices_nchw(
        in_shape,
        k_h,
        k_w,
        pad,
        stride_h,
        stride_w,
        dilation_h,
        dilation_w
        )

        f_debug.write("\n"+"c indices")
        f_debug.write("\n"+str(idx_c))
        f_debug.write("\n"+"h indices")
        f_debug.write("\n"+str(idx_h))
        f_debug.write("\n"+"w indices")
        f_debug.write("\n"+str(idx_w))
        
        cols = in_image_padded[:, idx_c, idx_h, idx_w]
        cols = cols.transpose(1, 2, 0).reshape(k_h * k_w * c, -1)

        f_debug.write("\n"+"cols (shape %s)" % str(cols.shape))
        f_debug.write("\n"+str(cols))

        # result shape is (k_H*k_W*N, out_dim_H*out_dim_W), convert to NCHW
        out_image = cols.reshape(n, c, k_h, k_w, out_dim_h, out_dim_w)
        # (N=0,C=1,kh=2,kw=3,H=4,W=5) -> (N=0,H=4,W=5,kh=2,kw=3,C=1)
        out_image = out_image.transpose(0, 4, 5, 2, 3, 1)
        out_image = out_image.reshape(n, out_dim_h, out_dim_w, k_h * k_w * c)

        f_debug.write("\n"+"output (shape %s)" % str(out_image.shape))
        f_debug.write("\n"+str(out_image))

        f_debug.write("\n"+"h indices")
        f_debug.write("\n"+str(idx_h))
        f_debug.write("\n"+"w indices")
        f_debug.write("\n"+str(idx_w))

        idx_px = idx_h*w+idx_w
        f_debug.write("\n"+"sequential pixel indices")
        f_debug.write("\n"+str(idx_px))

        buffer = []
        buffer_max_size = 0
        # buffer schedule (write from input, read to output)
        schedule_write = []
        schedule_read = []
        next_in_px = 0

        idx_px_relative = idx_px.copy()

        # compute schedule and buffer read pattern
        Y, X = idx_px_relative.shape
        for x in range(X):
            # load missing inputs into buffer
            for y in range(Y):
                while int(idx_px_relative[y,x]) not in buffer:
                    buffer.append(next_in_px)
                    next_in_px += 1
                    schedule_write.append(1)
                    schedule_read.append(0)
            
            # discard unused buffer elements (assumes in-order access)
            oldest_px = min(idx_px_relative[:,x])
            while buffer[0] < oldest_px:
                buffer.pop(0)
                
            # adjust relative buffer index
            for y in range(Y):
                idx_px_relative[y,x] -= oldest_px
                
            # record max needed buffer depth
            if len(buffer) > buffer_max_size:
                buffer_max_size = len(buffer)
            
            # read from buffer
            schedule_read.append(1)
            
            # simultaneously load next pixel(s) into buffer if there are any left
            if next_in_px > (h_padded*w_padded-1):
                schedule_write.append(0)
            else:
                buffer.append(next_in_px)
                next_in_px += 1
                schedule_write.append(1)


        # find buffer access patterns
        buffer_access_patterns = []
        for x in range(X):
            if idx_px_relative[:,x].tolist() not in buffer_access_patterns:
                buffer_access_patterns.append(idx_px_relative[:,x].tolist())
                
        
        f_debug.write("\n"+"max buffer size observed: %d" %(buffer_max_size))
        f_debug.write("\n"+"output vector elements: relative buffer indices")
        f_debug.write("\n"+str(idx_px_relative))
        f_debug.write("\n"+"found %d buffer access patterns:" % len(buffer_access_patterns))
        f_debug.write("\n"+str(buffer_access_patterns))
        f_debug.write("\n"+"required parallel-access registers for mmv_out=k: %d" % len(sum(buffer_access_patterns,[])))
        f_debug.write("\n"+"buffer write schedule (%d cycles)" % len(schedule_write))
        f_debug.write("\n"+str(schedule_write))
        f_debug.write("\n"+"writing buffer in %d cycles" % schedule_write.count(1))
        f_debug.write("\n"+"buffer read schedule (%d cycles)" % len(schedule_read))
        f_debug.write("\n"+str(schedule_read))
        f_debug.write("\n"+"reading buffer in %d cycles" % schedule_read.count(1))

        assert len(schedule_write) == len(schedule_read), "ERROR: Schedules have different lenghts"
        cycles_total = len(schedule_write)
        
        assert schedule_read.count(1) == self.get_number_output_values(), "ERROR: Reading buffer in fewer cycles than expected"

        code_gen_dict["$TOP_MODULE_NAME$"] = [self.get_verilog_top_module_name()]
        #save top module name so we can refer to it even after this node has been renamed (e.g. by GiveUniqueNodeNames(prefix) during MakeZynqProject)
        self.set_nodeattr("gen_top_module", self.get_verilog_top_module_name())
        code_gen_dict["$BIT_WIDTH$"] = [str(self.get_input_datatype().bitwidth())]
        code_gen_dict["$SIMD$"] = [str(simd)]
        code_gen_dict["$MMV_IN$"] = [str(mmv_in)]
        code_gen_dict["$MMV_OUT$"] = [str(mmv_out)]
        code_gen_dict["$CYCLES_TOTAL$"] = [str(cycles_total)]
        code_gen_dict["$BUF_ELEM_TOTAL$"] = [str(buffer_max_size)]
        
        # determine buffer partitioning into REG FIFOs (parallel access) and BRAM FIFOs (line buffers)
        assert len(buffer_access_patterns) == 1, "ERROR: Buffer access pattern is not static"
        buf_static_access_pattern = buffer_access_patterns[0]
        reg_fifos = []
        bram_fifos = []
        current = []
        for i in range(len(buf_static_access_pattern)):
            access_idx = buf_static_access_pattern[i]
            if len(current) == 0:
                current.append(access_idx)
            else:
                # assume non-decreasing index order in access pattern
                distance = access_idx - max(current)
                if not (distance-1 > REG_BRAM_THRESHOLD):
                    for i in range(distance-1):
                        # insert dummy into REG FIFO (not read as part of window)
                        current.append(-1)
                    # assign this access to same REG FIFO as previous one
                    current.append(access_idx)
                else:
                    # assign skipped accesses to new BRAM FIFO
                    bram_fifos.append([-1]*(distance-1))
                    # start with new REG FIFO
                    reg_fifos.append(current)
                    current = []
                    current.append(access_idx)
        reg_fifos.append(current)

        f_debug.write("\n"+"Buffer partitioning using REG_BRAM_THRESHOLD=%d" % REG_BRAM_THRESHOLD)
        f_debug.write("\n"+"%d REG FIFOs (parallel read access):" % len(reg_fifos))
        f_debug.write("\n"+str(reg_fifos))
        f_debug.write("\n"+"%d BRAM FIFOs (line buffers):" % len(bram_fifos))
        f_debug.write("\n"+str(bram_fifos))

        code_gen_dict["$GENERATE_REG_FIFOS$"] = []
        for i in range(len(reg_fifos)):
            code_gen_dict["$GENERATE_REG_FIFOS$"].append(
                """parameter reg_fifo_{id}_len = {len};
                reg [IN_WIDTH-1:0] reg_fifo_{id} [reg_fifo_{id}_len-1:0];
                """.format(id=i, len=len(reg_fifos[i])))
        
        #todo: generate actual bram shift buffers instead of regs
        code_gen_dict["$GENERATE_BRAM_FIFOS$"] = []
        for i in range(len(bram_fifos)):
            code_gen_dict["$GENERATE_BRAM_FIFOS$"].append(
                """parameter bram_fifo_{id}_len = {len};
                reg [IN_WIDTH-1:0] bram_fifo_{id} [bram_fifo_{id}_len-1:0];
                """.format(id=i, len=len(bram_fifos[i])))

        code_gen_dict["$GENERATE_OUTPUT_MAPPING$"] = []
        out_idx = mmv_out-1
        for fifo_id, reg_fifo in enumerate(reg_fifos):
            for fifo_idx, access_idx in enumerate(reg_fifo):
                if(access_idx != -1):
                    code_gen_dict["$GENERATE_OUTPUT_MAPPING$"].append(
                        "assign data_out[IN_WIDTH*{out_idx}+:IN_WIDTH] = reg_fifo_{fifo_id}[{fifo_idx}]; //{access_idx}".format(
                            out_idx=out_idx, fifo_id=fifo_id, fifo_idx=fifo_idx, access_idx=access_idx
                        )
                    )
                    # reversal: out_idx=0 -> oldest buffer element -> highest access_idx
                    out_idx = out_idx-1
        assert out_idx==-1, "ERROR: Not all output vector elements connected"

        code_gen_dict["$GENERATE_SHIFT_LOGIC$"] = []
        for i in range(len(reg_fifos)):
            if i == 0:
                # first FIFO containing newest elements -> input comes from input reg
                code_gen_dict["$GENERATE_SHIFT_LOGIC$"].append(
                    """for (i=reg_fifo_{fifo_id}_len-1; i>0; i=i-1)
                        reg_fifo_{fifo_id}[i] <= reg_fifo_{fifo_id}[i-1];
                    reg_fifo_{fifo_id}[0] <= reg_input;""".format(
                        fifo_id=i,
                    )
                )
            else:
                # other REG FIFOs -> input comes from connected BRAM FIFO (line buffer)
                input_fifo_id = i-1
                code_gen_dict["$GENERATE_SHIFT_LOGIC$"].append(
                    """for (i=reg_fifo_{fifo_id}_len-1; i>0; i=i-1)
                        reg_fifo_{fifo_id}[i] <= reg_fifo_{fifo_id}[i-1];
                    reg_fifo_{fifo_id}[0] <= bram_fifo_{input_fifo_id} [bram_fifo_{input_fifo_id}_len-1];""".format(
                        fifo_id=i, input_fifo_id=input_fifo_id
                    )
                )
        for i in range(len(bram_fifos)):
            input_fifo_id = i
            code_gen_dict["$GENERATE_SHIFT_LOGIC$"].append(
                """for (i=bram_fifo_{fifo_id}_len-1; i>0; i=i-1)
                    bram_fifo_{fifo_id}[i] <= bram_fifo_{fifo_id}[i-1];
                bram_fifo_{fifo_id}[0] <= reg_fifo_{input_fifo_id} [reg_fifo_{input_fifo_id}_len-1];""".format(
                    fifo_id=i, input_fifo_id=input_fifo_id
                )
            )

        # Generate read schedule (when data is read from input, written to buffer)
        code_gen_dict["$GENERATE_READ_SCHEDULE$"] = []
        schedule_as_string = ""
        #todo: change naming to swap write/read
        for i in schedule_write:
            if i == 1:
                schedule_as_string += "1'b1,"
            else:
                schedule_as_string += "1'b0,"
        schedule_as_string = schedule_as_string[:-1] # remove trailing ','
        code_gen_dict["$GENERATE_READ_SCHEDULE$"].append(
            "localparam [0:{len}-1] READ_SCHEDULE = {{{str}}};".format(len=cycles_total, str=schedule_as_string)
        )
        code_gen_dict["$GENERATE_READ_SCHEDULE$"].append(
            "assign read_state = READ_SCHEDULE[cycle];"
        )

        # Generate write schedule (when data is written to output, read from buffer)
        code_gen_dict["$GENERATE_WRITE_SCHEDULE$"] = []
        schedule_as_string = ""
        #todo: change naming to swap write/read
        for i in schedule_read:
            if i == 1:
                schedule_as_string += "1'b1,"
            else:
                schedule_as_string += "1'b0,"
        schedule_as_string = schedule_as_string[:-1] # remove trailing ','
        code_gen_dict["$GENERATE_WRITE_SCHEDULE$"].append(
            "localparam [0:{len}-1] WRITE_SCHEDULE = {{{str}}};".format(len=cycles_total, str=schedule_as_string)
        )
        code_gen_dict["$GENERATE_WRITE_SCHEDULE$"].append(
            "assign write_state = WRITE_SCHEDULE[cycle_last];"
        )
        #code_gen_dict["$GENERATE_WRITE_SCHEDULE$"].append(
        #    "assign write_state_next = WRITE_SCHEDULE[cycle_next];"
        #)

        with open("/workspace/finn/finn-rtllib/swg/swg_hdl_template.v", "r") as f:
            template = f.read()
        
        for key in code_gen_dict:
            # transform list into long string separated by '\n'
            code_gen_line = "\n".join(code_gen_dict[key])
            template = template.replace(key, code_gen_line)

        f = open(os.path.join(code_gen_dir, self.get_nodeattr("gen_top_module") + "_hdl_gen.v"), "w")
        #debug:
        #f = open(os.path.join("/workspace/finn/finn-rtllib/swg/", "swg_hdl_generated.v"), "w")
        f.write(template)
        f.close()
        f_debug.close()

        #set ipgen_path and ip_path so that HLS-Synth transformation and stich_ip transformation do not complain
        self.set_nodeattr("ipgen_path", code_gen_dir)
        self.set_nodeattr("ip_path", code_gen_dir)

    def prepare_rtlsim(self):
        """Creates a Verilator emulation library for the RTL code generated
        for this node, sets the rtlsim_so attribute to its path and returns
        a PyVerilator wrapper around it."""
        #modified to use generated verilog instead of HLS output products

        if PyVerilator is None:
            raise ImportError("Installation of PyVerilator is required.")

        code_gen_dir = self.get_nodeattr("code_gen_dir_ipgen")
        verilog_paths = [code_gen_dir]    
        verilog_files = [self.get_nodeattr("gen_top_module") + "_hdl_gen.v"]
        #debug:
        #verilog_paths = ["/workspace/finn/finn-rtllib/swg/"]
        #verilog_files = ["swg_hdl_generated.v"]
        # build the Verilator emu library
        sim = PyVerilator.build(
            verilog_files,
            build_dir=make_build_dir("pyverilator_" + self.onnx_node.name + "_"),
            verilog_path=verilog_paths,
            trace_depth=get_rtlsim_trace_depth(),
            top_module_name=self.get_verilog_top_module_name(),
        )
        # save generated lib filename in attribute
        self.set_nodeattr("rtlsim_so", sim.lib._name)
        return sim


    def code_generation_ipi(self):
        """Constructs and returns the TCL for node instantiation in Vivado IPI."""
        vlnv = self.get_nodeattr("ip_vlnv")
        code_gen_dir = self.get_nodeattr("code_gen_dir_ipgen")
        
        #cmd = ["create_bd_cell -type ip -vlnv %s %s" % (vlnv, self.onnx_node.name)]

        cmd = ["add_files -norecurse %s" % (os.path.join(code_gen_dir, self.get_nodeattr("gen_top_module") + "_hdl_gen.v")),
            "create_bd_cell -type module -reference %s %s" % (self.get_nodeattr("gen_top_module"), self.onnx_node.name)]

        #update_compile_order -fileset sources_1
        #add_files -norecurse C:/Users/felix/Downloads/swg_hdl_generated.v
        #update_compile_order -fileset sources_1
        #create_bd_cell -type module -reference ConvolutionInputGenerator_rtl_0_ConvolutionInputGenerator_rtl_0 ConvolutionInputGene_0

        return cmd

    def code_generation_ipgen(self, model, fpgapart, clk):
        """Generates c++ code and tcl script for ip generation."""
        self.generate_hdl()

    def ipgen_singlenode_code(self):
        """Builds the bash script for ip generation using the CallHLS from
        finn.util.hls."""
        pass

    def code_generation_cppsim(self, model):
        """Generates c++ code for simulation (cppsim)."""
        pass

    def compile_singlenode_code(self):
        pass
import numpy as np
import os
import warnings
from qonnx.core.datatype import DataType

from finn.custom_op.fpgadataflow.hlscustomop import HLSCustomOp
from finn.util.data_packing import npy_to_rtlsim_input, rtlsim_output_to_npy


class FMPadding_Pixel(HLSCustomOp):
    def __init__(self, onnx_node, **kwargs):
        super().__init__(onnx_node, **kwargs)

    def get_nodeattr_types(self):
        my_attrs = {
            # spatial size of input images
            "ImgDim": ("ints", True, []),
            # stride to apply, can be non-square
            "Stride": ("ints", True, []),
            # number of channels in input image
            "NumChannels": ("i", True, 0),
            # SIMD Input parallelism
            "SIMD": ("i", False, 1),
            # FINN input datatype
            "inputDataType": ("s", True, ""),
            # shape describing input vecs per execution
            "numInputVectors": ("i", False, 1),
        }
        my_attrs.update(super().get_nodeattr_types())
        return my_attrs

    def get_padded_odim(self):
        "Return the padded spatial size of the output."
        idim_h, idim_w = self.get_nodeattr("ImgDim")
        stride_h, stride_w = self.get_nodeattr("Stride")
        odim_h = idim_h + (idim_h - 1) * (stride_h - 1)
        odim_w = idim_w + (idim_w - 1) * (stride_w - 1)
        return [odim_h, odim_w]

    def get_exp_cycles(self):
        odim_h, odim_w = self.get_padded_odim()
        channels = self.get_nodeattr("NumChannels")
        simd = self.get_nodeattr("SIMD")
        exp_cycles = (channels / simd) * odim_h * odim_w
        return int(exp_cycles)

    def get_normal_input_shape(self, ind=0):
        idim_h, idim_w = self.get_nodeattr("ImgDim")
        num_ch = self.get_nodeattr("NumChannels")
        ishape = (1, idim_h, idim_w, num_ch)
        return ishape

    def get_normal_output_shape(self, ind=0):
        odim_h, odim_w = self.get_padded_odim()
        num_ch = self.get_nodeattr("NumChannels")
        oshape = (1, odim_h, odim_w, num_ch)
        return oshape

    def get_folded_input_shape(self, ind=0):
        normal_ishape = list(self.get_normal_input_shape())
        ifm_ch = self.get_nodeattr("NumChannels")
        simd = self.get_nodeattr("SIMD")
        assert ifm_ch % simd == 0, "SIMD must divide input channels"
        fold = int(normal_ishape[-1] / simd)
        folded_ishape = normal_ishape[:-1] + [fold, simd]
        return tuple(folded_ishape)

    def get_folded_output_shape(self, ind=0):
        normal_oshape = list(self.get_normal_output_shape())
        ifm_ch = self.get_nodeattr("NumChannels")
        simd = self.get_nodeattr("SIMD")
        assert ifm_ch % simd == 0, "SIMD must divide input channels"
        fold = int(normal_oshape[-1] / simd)
        folded_oshape = normal_oshape[:-1] + [fold, simd]
        return tuple(folded_oshape)

    def make_shape_compatible_op(self, model):
        exp_ishape = self.get_normal_input_shape()
        oshape = self.get_normal_output_shape()
        ishape = tuple(model.get_tensor_shape(self.onnx_node.input[0]))
        assert ishape == exp_ishape, "Unexpect input shape for FMPadding_Pixel."
        return super().make_const_shape_op(oshape)

    def infer_node_datatype(self, model):
        node = self.onnx_node
        idt = model.get_tensor_datatype(node.input[0])
        if idt != self.get_input_datatype():
            warn_str = "inputDataType changing for %s: %s -> %s " % (
                node.name,
                str(self.get_input_datatype()),
                str(idt),
            )
            warnings.warn(warn_str)
        self.set_nodeattr("inputDataType", idt.name)
        model.set_tensor_datatype(node.output[0], idt)

    def verify_node(self):
        pass

    def get_input_datatype(self, ind=0):
        """Returns FINN DataType of input."""
        ret = DataType[self.get_nodeattr("inputDataType")]
        # the hlslib op always pads with zeros, so ensure that the DataType
        # is able to represent zeros
        assert ret.allowed(0), "FMPadding_Pixel DataType must support zero"
        return ret

    def get_output_datatype(self, ind=0):
        """Returns FINN DataType of output. (Same as input datatype)"""
        return self.get_input_datatype()

    def get_instream_width(self, ind=0):
        ibits = self.get_input_datatype().bitwidth()
        simd = self.get_nodeattr("SIMD")
        return ibits * simd

    def get_outstream_width(self, ind=0):
        obits = self.get_output_datatype().bitwidth()
        simd = self.get_nodeattr("SIMD")
        return obits * simd

    def get_number_output_values(self):
        folded_oshape = self.get_folded_output_shape()
        return np.prod(folded_oshape[:-1])

    def global_includes(self):
        self.code_gen_dict["$GLOBALS$"] = ['#include "streamtools.h"']

    def defines(self, var):
        odim_h, odim_w = self.get_padded_odim()
        stride_h, stride_w = self.get_nodeattr("Stride")
        is_square_img = odim_h == odim_w
        is_square_stride = stride_h == stride_w
        if is_square_img and is_square_stride:
            self.code_gen_dict["$DEFINES$"] = [
                """
                #define OutputDim {}\n
                #define Stride {}\n
                #define NumChannels {}\n
                #define SIMD {}\n
                """.format(
                    odim_h,
                    stride_h,
                    self.get_nodeattr("NumChannels"),
                    self.get_nodeattr("SIMD"),
                )
            ]
        else:
            self.code_gen_dict["$DEFINES$"] = [
                """
                #define OutputDim_x {}\n
                #define OutputDim_y {}\n
                #define Stride_x {}\n
                #define Stride_y {}\n
                #define NumChannels {}\n
                #define SIMD {}\n
                """.format(
                    odim_w,
                    odim_h,
                    stride_w,
                    stride_h,
                    self.get_nodeattr("NumChannels"),
                    self.get_nodeattr("SIMD"),
                )
            ]

    def read_npy_data(self):
        code_gen_dir = self.get_nodeattr("code_gen_dir_cppsim")
        dtype = self.get_input_datatype()
        if dtype == DataType["BIPOLAR"]:
            # use binary for bipolar storage
            dtype = DataType["BINARY"]
        elem_bits = dtype.bitwidth()
        packed_bits = self.get_instream_width()
        packed_hls_type = "ap_uint<%d>" % packed_bits
        elem_hls_type = dtype.get_hls_datatype_str()
        npy_type = "float"
        npy_in = "%s/input_0.npy" % code_gen_dir
        self.code_gen_dict["$READNPYDATA$"] = []
        self.code_gen_dict["$READNPYDATA$"].append(
            'npy2apintstream<%s, %s, %d, %s>("%s", in0);'
            % (packed_hls_type, elem_hls_type, elem_bits, npy_type, npy_in)
        )

    def strm_decl(self):
        self.code_gen_dict["$STREAMDECLARATIONS$"] = []
        self.code_gen_dict["$STREAMDECLARATIONS$"].append(
            'hls::stream<ap_uint<{}>> in0 ("in0");'.format(self.get_instream_width())
        )
        self.code_gen_dict["$STREAMDECLARATIONS$"].append(
            'hls::stream<ap_uint<{}>> out ("out");'.format(self.get_outstream_width())
        )

    def docompute(self):
        in_t = self.get_input_datatype().get_hls_datatype_str()
        odim_h, odim_w = self.get_padded_odim()
        stride_h, stride_w = self.get_nodeattr("Stride")
        is_square_img = odim_h == odim_w
        is_square_stride = stride_h == stride_w

        if is_square_img and is_square_stride:
            hls_call = "FMPadding_Pixel"
            self.code_gen_dict["$DOCOMPUTE$"] = [
                """{}<OutputDim, Stride, NumChannels, SIMD, {}> (in0, out);""".format(
                    hls_call, in_t
                )
            ]
        else:
            hls_call = "FMPadding_Pixel_Nonsquare"
            self.code_gen_dict["$DOCOMPUTE$"] = [
                """{}<OutputDim_x, OutputDim_y, Stride_x, Stride_y, NumChannels,
                SIMD, {}> (in0, out);""".format(
                    hls_call, in_t
                )
            ]

    def dataoutstrm(self):
        code_gen_dir = self.get_nodeattr("code_gen_dir_cppsim")
        dtype = self.get_output_datatype()
        if dtype == DataType["BIPOLAR"]:
            # use binary for bipolar storage
            dtype = DataType["BINARY"]
        elem_bits = dtype.bitwidth()
        packed_bits = self.get_outstream_width()
        packed_hls_type = "ap_uint<%d>" % packed_bits
        elem_hls_type = dtype.get_hls_datatype_str()
        npy_type = "float"
        npy_out = "%s/output.npy" % code_gen_dir
        oshape = self.get_folded_output_shape()
        oshape_cpp_str = str(oshape).replace("(", "{").replace(")", "}")

        self.code_gen_dict["$DATAOUTSTREAM$"] = [
            'apintstream2npy<%s, %s, %d, %s>(out, %s, "%s");'
            % (
                packed_hls_type,
                elem_hls_type,
                elem_bits,
                npy_type,
                oshape_cpp_str,
                npy_out,
            )
        ]

    def save_as_npy(self):
        self.code_gen_dict["$SAVEASCNPY$"] = []

    def blackboxfunction(self):
        packed_bits = self.get_instream_width()
        packed_hls_type = "ap_uint<%d>" % packed_bits
        self.code_gen_dict["$BLACKBOXFUNCTION$"] = [
            "void %s(hls::stream<%s > &in0, hls::stream<%s > &out)"
            % (self.onnx_node.name, packed_hls_type, packed_hls_type)
        ]

    def pragmas(self):
        self.code_gen_dict["$PRAGMAS$"] = [
            "#pragma HLS INTERFACE axis port=in0 name=in0_" + self.hls_sname()
        ]
        self.code_gen_dict["$PRAGMAS$"].append(
            "#pragma HLS INTERFACE axis port=out name=out_" + self.hls_sname()
        )
        self.code_gen_dict["$PRAGMAS$"].append(
            "#pragma HLS INTERFACE ap_ctrl_none port=return"
        )

    def execute_node(self, context, graph):
        mode = self.get_nodeattr("exec_mode")
        node = self.onnx_node
        exp_ishape = self.get_normal_input_shape()
        exp_oshape = self.get_normal_output_shape()
        folded_ishape = self.get_folded_input_shape()

        if mode == "cppsim":
            code_gen_dir = self.get_nodeattr("code_gen_dir_cppsim")
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
        match expected shape (1, ImgDim_h, ImgDim_w, NumChannels)."""
        export_idt = self.get_input_datatype()

        reshaped_input = inp.reshape(folded_ishape)
        np.save(os.path.join(code_gen_dir, "input_0.npy"), reshaped_input)

        if mode == "cppsim":
            # execute the precompiled model
            super().exec_precompiled_singlenode_model()
            # load output npy file
            super().npy_to_dynamic_output(context)
            assert (
                context[node.output[0]].shape == exp_oshape
            ), "cppsim did not produce expected output shape"
        elif mode == "rtlsim":
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
        else:
            raise Exception(
                """Invalid value for attribute exec_mode! Is currently set to: {}
            has to be set to one of the following value ("cppsim", "rtlsim")""".format(
                    mode
                )
            )
        assert (
            context[node.output[0]].shape == exp_oshape
        ), """Output shape doesn't match expected shape
            (1, OutputDim_H, OutputDim_W, NumChannels)."""

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

from onnx import TensorProto
from onnx import helper

from finn.transformation import Transformation
from finn.transformation.infer_shapes import InferShapes
from finn.util.basic import get_by_name


class LowerConvsToMatMul(Transformation):
    """Replace Conv layers with pairs of Im2Col-MatMul layers, plus Transpose
    layers to keep the original data layout."""

    def apply(self, model):
        graph = model.graph
        node_ind = 0
        graph_modified = False
        for n in graph.node:
            node_ind += 1
            if n.op_type == "Conv":
                graph_modified = True
                cnv_input = n.input[0]
                cnv_output = n.output[0]
                # extract conv parameters
                k = get_by_name(n.attribute, "kernel_shape")[-1]
                pad = get_by_name(n.attribute, "pads")[-1]
                stride = get_by_name(n.attribute, "strides")[-1]
                weight_name = n.input[1]
                W_conv = model.get_initializer(weight_name)
                ifm_ch = W_conv.shape[1]
                ofm_ch = W_conv.shape[0]
                ifm_dim = model.get_tensor_shape(n.input[0])[-1]  # assume NCHW
                ofm_dim = model.get_tensor_shape(n.output[0])[-1]  # assume NCHW
                # reuse conv weights for new matmul weights
                W_matmul = W_conv.reshape(ofm_ch, ifm_ch * k * k).T
                model.set_initializer(weight_name, W_matmul)
                # create new intermediate values
                inp_trans_out = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    (1, ifm_dim, ifm_dim, ifm_ch),  # NHWC
                )
                graph.value_info.append(inp_trans_out)
                inp_trans_out = inp_trans_out.name

                im2col_out = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    (1, ofm_dim, ofm_dim, ifm_ch * k * k),
                )
                graph.value_info.append(im2col_out)
                im2col_out = im2col_out.name

                matmul_out = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    (1, ofm_dim, ofm_dim, ofm_ch),
                )
                graph.value_info.append(matmul_out)
                matmul_out = matmul_out.name

                # create new nodes
                # NCHW -> NHWC
                inp_trans_node = helper.make_node(
                    "Transpose", [cnv_input], [inp_trans_out], perm=[0, 2, 3, 1]
                )
                # lower input tensor
                im2col_node = helper.make_node(
                    "Im2Col",
                    [inp_trans_out],
                    [im2col_out],
                    domain="finn",
                    stride=stride,
                    kernel_size=k,
                    pad_amount=pad,
                    input_shape="(1,{},{},{})".format(ifm_dim, ifm_dim, ifm_ch),
                )
                # do matmul
                matmul_node = helper.make_node(
                    "MatMul", [im2col_out, weight_name], [matmul_out]
                )
                # NHWC -> NCHW
                out_trans_node = helper.make_node(
                    "Transpose", [matmul_out], [cnv_output], perm=[0, 3, 1, 2]
                )
                # insert nodes where the conv is to preserve topological ordering
                graph.node.insert(node_ind, inp_trans_node)
                graph.node.insert(node_ind + 1, im2col_node)
                graph.node.insert(node_ind + 2, matmul_node)
                graph.node.insert(node_ind + 3, out_trans_node)
                # remove old nodes
                graph.node.remove(n)
        model = model.transform(InferShapes())
        return (model, graph_modified)

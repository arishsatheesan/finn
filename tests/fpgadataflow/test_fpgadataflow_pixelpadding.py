# Copyright (c) 2023, Advanced Micro Devices, Inc.
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
# * Neither the name of Xilinx nor the names of its
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

import pytest

import numpy as np
import os
from onnx import TensorProto, helper
from qonnx.core.datatype import DataType
from qonnx.core.modelwrapper import ModelWrapper
from qonnx.custom_op.registry import getCustomOp
from qonnx.transformation.general import GiveUniqueNodeNames
from qonnx.transformation.infer_shapes import InferShapes
from qonnx.util.basic import gen_finn_dt_tensor, qonnx_make_model

import finn.core.onnx_exec as oxe
from finn.analysis.fpgadataflow.exp_cycles_per_layer import exp_cycles_per_layer
from finn.transformation.fpgadataflow.compile_cppsim import CompileCppSim
from finn.transformation.fpgadataflow.hlssynth_ip import HLSSynthIP
from finn.transformation.fpgadataflow.prepare_cppsim import PrepareCppSim
from finn.transformation.fpgadataflow.prepare_ip import PrepareIP
from finn.transformation.fpgadataflow.prepare_rtlsim import PrepareRTLSim
from finn.transformation.fpgadataflow.set_exec_mode import SetExecMode
from finn.util.basic import pynq_part_map

test_pynq_board = os.getenv("PYNQ_BOARD", default="Pynq-Z1")
test_fpga_part = pynq_part_map[test_pynq_board]
target_clk_ns = 10


def make_single_pixelpadding_modelwrapper(optype, idim, stride, num_ch, simd, idt):
    idim_h, idim_w = idim
    stride_h, stride_w = stride

    odim_h = idim_h + (idim_h - 1) * (stride_h - 1)
    odim_w = idim_w + (idim_w - 1) * (stride_w - 1)

    assert (
        odim_h > idim_h or odim_w > idim_w
    ), "Output dim should be greater than input dim"

    inp = helper.make_tensor_value_info(
        "inp", TensorProto.FLOAT, [1, idim_h, idim_w, num_ch]
    )
    outp = helper.make_tensor_value_info(
        "outp", TensorProto.FLOAT, [1, odim_h, odim_w, num_ch]
    )

    FMPadding_Pixel = helper.make_node(
        optype,
        ["inp"],
        ["outp"],
        domain="finn.custom_op.fpgadataflow",
        backend="fpgadataflow",
        ImgDim=idim,
        Stride=stride,
        NumChannels=num_ch,
        inputDataType=str(idt.name),
        numInputVectors=1,
        SIMD=simd,
    )

    graph = helper.make_graph(
        nodes=[FMPadding_Pixel], name="pixelpadding_graph", inputs=[inp], outputs=[outp]
    )

    model = qonnx_make_model(graph, producer_name="pixelpadding-model")
    model = ModelWrapper(model)

    model.set_tensor_datatype("inp", idt)
    model.set_tensor_datatype("outp", idt)

    return model


# input image dimension
@pytest.mark.parametrize("idim", [[8, 8], [10, 8]])
# number of rows and number of cols to add
@pytest.mark.parametrize("stride", [[2, 2], [2, 3]])
# number of channels
@pytest.mark.parametrize("num_ch", [2, 4])
# Input parallelism
@pytest.mark.parametrize("simd", [1, 2])
# FINN input datatype
@pytest.mark.parametrize("idt", [DataType["INT2"], DataType["INT4"]])
# execution mode
@pytest.mark.parametrize("mode", ["cppsim", "rtlsim"])
# # implementation style
# @pytest.mark.parametrize("impl_style", ["rtl", "hls"])
@pytest.mark.fpgadataflow
@pytest.mark.slow
@pytest.mark.vivado
def test_fpgadataflow_pixelpadding(idim, stride, num_ch, simd, idt, mode):
    # if impl_style == "rtl" and mode == "cppsim":
    #     pytest.skip("rtl implstyle has no cppsim, skipping")
    if num_ch % simd != 0:
        pytest.skip(" num_ch % simd != 0, skipping")

    idim_h, idim_w = idim
    stride_h, stride_w = stride

    # generate input data
    x = gen_finn_dt_tensor(idt, [1, idim_h, idim_w, num_ch])
    input_dict = {"inp": x}
    odim_h = idim_h + (idim_h - 1) * (stride_h - 1)
    odim_w = idim_w + (idim_w - 1) * (stride_w - 1)

    optype = "FMPadding_Pixel"

    model = make_single_pixelpadding_modelwrapper(
        optype, idim, stride, num_ch, simd, idt
    )
    model = model.transform(InferShapes())
    model = model.transform(SetExecMode(mode))
    model = model.transform(GiveUniqueNodeNames())
    if mode == "cppsim":
        model = model.transform(PrepareCppSim())
        model = model.transform(CompileCppSim())
    elif mode == "rtlsim":
        model = model.transform(PrepareIP(test_fpga_part, target_clk_ns))
        model = model.transform(HLSSynthIP())
        model = model.transform(PrepareRTLSim())

    y_produced = oxe.execute_onnx(model, input_dict)["outp"]
    expected_oshape = (1, odim_h, odim_w, num_ch)
    assert y_produced.shape == expected_oshape

    y_expected = np.zeros(expected_oshape)
    for i in range(x.shape[1]):
        for j in range(x.shape[2]):
            ih = i * stride_h
            iw = j * stride_w
            y_expected[0, ih, iw, :] = x[0, i, j, :]

    assert (y_produced == y_expected).all()

    if mode == "rtlsim":
        node = model.get_nodes_by_op_type(optype)[0]
        inst = getCustomOp(node)
        cycles_rtlsim = inst.get_nodeattr("cycles_rtlsim")
        exp_cycles_dict = model.analysis(exp_cycles_per_layer)
        exp_cycles = exp_cycles_dict[node.name]
        assert np.isclose(exp_cycles, cycles_rtlsim, atol=10)
        assert exp_cycles != 0

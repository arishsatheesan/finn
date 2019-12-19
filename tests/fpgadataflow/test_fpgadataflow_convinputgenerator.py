# import numpy as np
from onnx import TensorProto, helper

import finn.core.onnx_exec as oxe
from finn.core.datatype import DataType
from finn.core.modelwrapper import ModelWrapper
from finn.core.utils import gen_finn_dt_tensor
# from finn.transformation.fpgadataflow.cleanup import CleanUp
from finn.transformation.fpgadataflow.codegen import CodeGen
from finn.transformation.fpgadataflow.compile import Compile


def make_single_slidingwindow_modelwrapper(
    k, ifm_ch, ifm_dim, ofm_dim, simd, stride, idt
):

    ip = idt.bitwidth()
    odt = idt
    out_pix = ofm_dim * ofm_dim

    inp = helper.make_tensor_value_info(
        "inp", TensorProto.FLOAT, [1, ifm_ch, ifm_dim, ifm_dim]
    )
    outp = helper.make_tensor_value_info(
        "outp", TensorProto.FLOAT, [1, out_pix, k * k * ifm_ch]
    )

    SlidingWindow_node = helper.make_node(
        "ConvolutionInputGenerator",
        ["inp"],
        ["outp"],
        domain="finn",
        backend="fpgadataflow",
        ConvKernelDim=k,
        IFMChannels=ifm_ch,
        Input_precision=ip,
        IFMDim=ifm_dim,
        OFMDim=ofm_dim,
        SIMD=simd,
        Stride=stride,
        inputDataType=idt.name,
        outputDataType=odt.name,
    )
    graph = helper.make_graph(
        nodes=[SlidingWindow_node],
        name="slidingwindow_graph",
        inputs=[inp],
        outputs=[outp],
    )

    model = helper.make_model(graph, producer_name="slidingwindow-model")
    model = ModelWrapper(model)

    model.set_tensor_datatype("inp", idt)
    model.set_tensor_datatype("outp", odt)

    return model


def prepare_inputs(input_tensor, idt):
    if idt == DataType.BIPOLAR:
        # convert bipolar to binary
        return {"inp": (input_tensor + 1) / 2}
    else:
        return {"inp": input_tensor}


def test_fpgadataflow_slidingwindow():
    idt = DataType.BIPOLAR
    k = 2
    stride = 1
    ifm_ch = 1
    ifm_dim = 3
    ofm_dim = int(((ifm_dim - k) / stride) + 1)
    simd = 1

    x = gen_finn_dt_tensor(idt, (1, ifm_ch, ifm_dim, ifm_dim))
    model = make_single_slidingwindow_modelwrapper(
        k, ifm_ch, ifm_dim, ofm_dim, simd, stride, idt
    )

    model = model.transform(CodeGen())
    model = model.transform(Compile())

    # prepare input data
    input_dict = prepare_inputs(x, idt)

    # execute model
    y_produced = oxe.execute_onnx(model, input_dict)["outp"]
    print(x)
    print(y_produced)

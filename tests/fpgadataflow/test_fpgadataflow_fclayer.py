import pytest

import numpy as np
from onnx import TensorProto, helper

import finn.core.onnx_exec as oxe
import finn.custom_op.xnorpopcount as xp
from finn.core.datatype import DataType
from finn.core.modelwrapper import ModelWrapper
from finn.core.utils import gen_finn_dt_tensor


def make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt, T=None, tdt=None):
    mw = W.shape[0]
    mh = W.shape[1]
    assert mh % pe == 0
    assert mw % simd == 0
    wmem = mw * mh // (pe * simd)
    assert mw * mh == wmem * pe * simd
    nf = mh // pe
    sf = mw // simd
    if T is not None:
        tmem = nf
    else:
        tmem = 0

    inp = helper.make_tensor_value_info("inp", TensorProto.FLOAT, [1, sf, simd])
    outp = helper.make_tensor_value_info("outp", TensorProto.FLOAT, [1, nf, pe])
    if T is not None:
        node_inp_list = ["inp", "weights", "thresh"]
    else:
        # no thresholds
        node_inp_list = ["inp", "weights"]
    FCLayer_node = helper.make_node(
        "StreamingFCLayer_Batch",
        node_inp_list,
        ["outp"],
        domain="finn",
        backend="fpgadataflow",
        resType="ap_resource_lut()",
        MW=mw,
        MH=mh,
        SIMD=simd,
        PE=pe,
        WMEM=wmem,
        TMEM=tmem,
        inputDataType=idt.name,
        weightDataType=wdt.name,
        outputDataType=odt.name,
    )
    graph = helper.make_graph(
        nodes=[FCLayer_node], name="fclayer_graph", inputs=[inp], outputs=[outp]
    )

    model = helper.make_model(graph, producer_name="fclayer-model")
    model = ModelWrapper(model)

    model.set_tensor_datatype("inp", idt)
    model.set_tensor_datatype("outp", odt)
    model.set_tensor_datatype("weights", wdt)
    model.set_initializer("weights", W)
    if T is not None:
        model.set_tensor_datatype("thresh", tdt)
        model.set_initializer("thresh", T)
    return model


def prepare_inputs(model, input_tensor, idt):
    ishape = model.get_tensor_shape("inp")
    input_tensor = (np.asarray(input_tensor, dtype=np.float32)).reshape(*ishape)
    return {"inp": input_tensor}


def create_noactivation_testcases(idt, wdt, mh=8, mw=8):
    if wdt == DataType.BIPOLAR and idt == DataType.BIPOLAR:
        odt = DataType.UINT32
    else:
        odt = DataType.INT32
    # generate weights
    W = gen_finn_dt_tensor(wdt, (mw, mh))
    # generate input data
    x = gen_finn_dt_tensor(idt, (1, mw))

    # set up layers with different pe and simd
    pe_values = [1, int(mh / 2), mh]
    simd_values = [1, int(mw / 2), mw]
    for pe in pe_values:
        for simd in simd_values:
            model = make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt)

            # prepare input data
            input_dict = prepare_inputs(model, x, idt)
            if wdt == DataType.BIPOLAR and idt == DataType.BIPOLAR:
                # convert inputs to binary and use xnorpopcountmatmul
                y = xp.xnorpopcountmatmul((x + 1) / 2, (W + 1) / 2)
            else:
                y = np.matmul(x, W)
            oshape = model.get_tensor_shape("outp")
            y_expected = y.reshape(oshape)
            # execute model
            y_produced = oxe.execute_onnx(model, input_dict)["outp"]
            assert (y_produced.reshape(y_expected.shape) == y_expected).all()


@pytest.mark.parametrize("wdt", [DataType.BIPOLAR, DataType.INT2])
@pytest.mark.parametrize("idt", [DataType.BIPOLAR, DataType.INT2])
def test_fpgadataflow_fclayer_noact(wdt, idt):
    create_noactivation_testcases(idt, wdt)

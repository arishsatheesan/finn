import numpy as np
from onnx import TensorProto, helper

import finn.core.onnx_exec as oxe
import finn.custom_op.xnorpopcount as xp
from finn.core.datatype import DataType
from finn.core.modelwrapper import ModelWrapper
from finn.core.utils import (
    gen_finn_dt_tensor,
    interleave_matrix_outer_dim_from_partitions
)
from finn.custom_op.multithreshold import multithreshold


def make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt, T=None, tdt=None):
    mh = W.shape[0]
    mw = W.shape[1]
    assert mh % pe == 0
    assert mw % simd == 0
    wmem = mw * mh // (pe * simd)
    assert mw * mh == wmem * pe * simd
    nf = mh // pe
    sf = mw // simd
    # distribute rows between PEs
    W_reshaped = interleave_matrix_outer_dim_from_partitions(W, pe)
    # create SIMD as innermost dimension
    W_reshaped = W_reshaped.reshape(pe, wmem, simd)
    if T is not None:
        tmem = nf
        assert T.shape[0] == 1 or T.shape[0] == mh
        n_thres_steps = T.shape[1]
        # if single global threshold specified, repeat along channels
        if T.shape[0] == 1:
            T = np.tile(T, (mh, 1))
        # distribute T rows between PEs
        T_reshaped = interleave_matrix_outer_dim_from_partitions(T, pe)
        assert T_reshaped.shape[0] == pe
        assert T_reshaped.shape[1] == tmem
        assert T_reshaped.shape[2] == n_thres_steps
    else:
        tmem = 0
        n_thres_steps = 0

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
        nodes=[FCLayer_node], name="fclayer_graph", inputs=[inp], outputs=[outp],
    )

    model = helper.make_model(graph, producer_name="fclayer-model")
    model = ModelWrapper(model)

    model.set_tensor_datatype("inp", idt)
    model.set_tensor_datatype("outp", odt)
    model.set_tensor_datatype("weights", wdt)
    model.set_initializer("weights", W_reshaped)
    if T is not None:
        model.set_tensor_datatype("thresh", tdt)
        model.set_initializer("thresh", T_reshaped)
    return model


def prepare_inputs(model, input_tensor, idt):
    ishape = model.get_tensor_shape("inp")
    input_tensor = (np.asarray(input_tensor, dtype=np.float32)).reshape(*ishape)
    return {"inp": input_tensor}

def create_testcases(idt, wdt, odt):
    mh = 8
    mw = 8

    if idt == wdt == DataType.BIPOLAR:
        tdt = DataType.UINT32
    else:
        tdt = DataType.INT32
    # generate weights
    W = gen_finn_dt_tensor(wdt, [mh, mw])
    # single global threshold at zero
    T = np.zeros((1, 1))

    # generate input data
    x = gen_finn_dt_tensor(idt, mw)

    # set up layers with different pe and simd
    pe_values = [1, int(mh / 2), mh]
    simd_values = [1, int(mw / 2), mw]
    for pe in pe_values:
        for simd in simd_values:
            model = make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt, T, tdt)

            # prepare input data
            input_dict = prepare_inputs(model, x, idt)

            # execute model
            produced = oxe.execute_onnx(model, input_dict)["outp"]

            # expected output
            if wdt == DataType.BIPOLAR:
                W_expected = (W + 1) * 0.5 
            else:
                W_expected = W

            if idt == DataType.BIPOLAR:
                x_expected = (x + 1) * 0.5
            else:
                x_expected = x

            if idt == wdt == DataType.BIPOLAR:
                y = xp.xnorpopcountmatmul(W_expected, x_expected.reshape(-1, 1))
                expected = multithreshold(y.reshape(1, mh), T)

            else:
                oshape = model.get_tensor_shape("outp")
                y = np.dot(W_expected, x_expected).reshape(oshape.shape)
                expected = multithreshold(y.reshape(1, mh), T)

            assert (produced.reshape(expected.shape) == expected).all()


def create_noativation_testcases(idt, wdt, odt):
    mh = 8
    mw = 8
    # generate weights
    W = gen_finn_dt_tensor(wdt, [mh, mw])
    # generate input data
    x = gen_finn_dt_tensor(idt, mw)

    # set up layers with different pe and simd
    pe_values = [1, int(mh / 2), mh]
    simd_values = [1, int(mw / 2), mw]
    for pe in pe_values:
        for simd in simd_values:
            model = make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt)
            # prepare input data
            input_dict = prepare_inputs(model, x, idt)

            # expected output
            oshape = model.get_tensor_shape("outp")
            y = np.dot(W, x).reshape(oshape)
            # XnorMul produces positive outputs only, adjust expectation accordingly
            expected = 2 * y - mw

            # execute model
            produced = oxe.execute_onnx(model, input_dict)["outp"]

            assert (produced.reshape(expected.shape) == expected).all()


# no activation cases

# no act -all bipolar
def test_fpgadataflow_fclayer_ibp_wbp_noact():
    wdt = idt = DataType.BIPOLAR
    odt = DataType.UINT32

    create_noativation_testcases(idt, wdt, odt)


# no act - all signed
def test_fpgadataflow_fclayer_iint2_wint2_noact():
    wdt = idt = DataType.INT2
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)


# no act - all ternary


def test_fpgadataflow_fclayer_it_wt_noact():
    wdt = idt = DataType.TERNARY
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)

# no act - idt: bipolar wdt: signed

def test_fpgadataflow_fclayer_ibp_wint2_noact():
    wdt = DataType.INT2
    idt = DataType.BIPOLAR
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)

# no act - idt: bipolar wdt: ternary

def test_fpgadataflow_fclayer_ibp_wt_noact():
    wdt = DataType.INT2
    idt = DataType.TERNARY
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)

# no act - idt: signed wdt: bipolar

def test_fpgadataflow_fclayer_it_wbp_noact():
    wdt = DataType.BIPOLAR
    idt = DataType.INT2
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)

# no act - idt: signed wdt: ternary

def test_fpgadataflow_fclayer_it_wbp_noact():
    wdt = DataType.TERNARY
    idt = DataType.INT2
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)

# no act - idt: ternary wdt: bipolar

def test_fpgadataflow_fclayer_it_wbp_noact():
    wdt = DataType.BIPOLAR
    idt = DataType.TERNARY
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)
    
# no act - idt: ternary wdt: signed

def test_fpgadataflow_fclayer_it_wbp_noact():
    wdt = DataType.INT2
    idt = DataType.TERNARY
    odt = DataType.INT32
    create_noativation_testcases(idt, wdt, odt)




def test_fpgadataflow_fclayer_all_bipolar():

    wdt = idt = odt = DataType.BIPOLAR
    create_testcases(idt, wdt, odt)

def test_fpgadataflow_fclayer_all_signed():
    mh = 8
    mw = 8
    wdt = idt = odt = DataType.INT2
    tdt = DataType.INT32
    # generate weights
    W = gen_finn_dt_tensor(wdt, [mh, mw])
    # single global threshold at zero
    T = np.zeros((1, 1))

    # generate input data
    x = gen_finn_dt_tensor(idt, mw)

    # set up layers with different pe and simd
    pe_values = [1, int(mh / 2), mh]
    simd_values = [1, int(mw / 2), mw]
    for pe in pe_values:
        for simd in simd_values:
            model = make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt, T, tdt)
            # prepare input data
            input_dict = prepare_inputs(model, x, idt)

            # execute model
            produced = oxe.execute_onnx(model, input_dict)["outp"]

            # expected output
            oshape = model.get_tensor_shape("outp")
            y = np.dot(W, x).reshape(oshape.shape)
            expected = multithreshold(y.reshape(1, mh), T)

            assert (produced.reshape(expected.shape) == expected).all()


def test_fpgadataflow_fclayer_all_ternary():
    mh = 8
    mw = 8
    wdt = idt = odt = DataType.TERNARY
    tdt = DataType.INT32
    # generate weights
    W = gen_finn_dt_tensor(wdt, [mh, mw])
    # single global threshold at zero
    T = np.zeros((1, 1))

    # generate input data
    x = gen_finn_dt_tensor(idt, mw)

    # set up layers with different pe and simd
    pe_values = [1, int(mh / 2), mh]
    simd_values = [1, int(mw / 2), mw]
    for pe in pe_values:
        for simd in simd_values:
            model = make_single_fclayer_modelwrapper(W, pe, simd, wdt, idt, odt, T, tdt)
            # prepare input data
            input_dict = prepare_inputs(model, x, idt)

            # execute model
            produced = oxe.execute_onnx(model, input_dict)["outp"]

            # expected output
            oshape = model.get_tensor_shape("outp")
            y = np.dot(W, x).reshape(oshape.shape)
            expected = multithreshold(y.reshape(1, mh), T)

            assert (produced.reshape(expected.shape) == expected).all()

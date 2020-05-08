import onnx  # noqa
import numpy as np
import torch
import brevitas.onnx as bo
from brevitas.nn import QuantReLU
from brevitas.core.quant import QuantType
from brevitas.core.restrict_val import RestrictValueType
from brevitas.core.scaling import ScalingImplType
import pytest
from finn.core.modelwrapper import ModelWrapper
import finn.core.onnx_exec as oxe
from finn.transformation.infer_shapes import InferShapes

export_onnx_path = "test_act.onnx"


@pytest.mark.parametrize("abits", [1, 2, 4, 8])
@pytest.mark.parametrize("max_val", [1.0, 1.5, 1 - 2 ** (-7)])
@pytest.mark.parametrize(
    "scaling_impl_type", [ScalingImplType.CONST, ScalingImplType.PARAMETER]
)
def test_brevitas_relu_act_export(abits, max_val, scaling_impl_type):
    min_val = -1.0
    ishape = (1, 15)
    b_act = QuantReLU(
        bit_width=abits,
        max_val=max_val,
        scaling_impl_type=scaling_impl_type,
        restrict_scaling_type=RestrictValueType.LOG_FP,
        quant_type=QuantType.INT,
    )
    if scaling_impl_type == ScalingImplType.PARAMETER:
        checkpoint = {
            "act_quant_proxy.fused_activation_quant_proxy.tensor_quant.\
scaling_impl.learned_value": torch.tensor(
                0.49
            ).type(
                torch.FloatTensor
            )
        }
        b_act.load_state_dict(checkpoint)

    bo.export_finn_onnx(b_act, ishape, export_onnx_path)
    model = ModelWrapper(export_onnx_path)
    model = model.transform(InferShapes())
    inp_tensor = np.random.uniform(low=min_val, high=max_val, size=ishape).astype(
        np.float32
    )
    idict = {model.graph.input[0].name: inp_tensor}
    odict = oxe.execute_onnx(model, idict, True)
    produced = odict[model.graph.output[0].name]
    inp_tensor = torch.from_numpy(inp_tensor).float()
    b_act.eval()
    expected = b_act.forward(inp_tensor).detach().numpy()
    if not np.isclose(produced, expected, atol=1e-3).all():
        print(abits, max_val, scaling_impl_type)
        print("scale: ", b_act.quant_act_scale().type(torch.FloatTensor).detach())
        if abits < 5:
            print(
                "thres:",
                ", ".join(["{:8.4f}".format(x) for x in b_act.export_thres[0]]),
            )
        print("input:", ", ".join(["{:8.4f}".format(x) for x in inp_tensor[0]]))
        print("prod :", ", ".join(["{:8.4f}".format(x) for x in produced[0]]))
        print("expec:", ", ".join(["{:8.4f}".format(x) for x in expected[0]]))

    assert np.isclose(produced, expected, atol=1e-3).all()

import onnx
from finn.custom_op.verify_custom_op_construct import CustomOp_Construct

def test_verify_layout_custom_ops():
    m_node = onnx.helper.make_node(
        "MultiThreshold",
        ["v", "thresholds"],
        ["out"],
        domain="finn",
        out_scale=2.0,
        out_bias=-1.0,
        out_dtype="",
    ) 

    inst = CustomOp_Construct[m_node.op_type] 
    inst.verify_layout(m_node) 


import finn.core.utils as util
import finn.custom_op.registry as registry
from finn.transformation import Transformation


class IPGen(Transformation):
    """Compile for all nodes in model"""

    def __init__(self):
        super().__init__()

    def apply(self, model):
        for node in model.graph.node:
            op_type = node.op_type
            if node.domain == "finn":
                backend_attribute = util.get_by_name(node.attribute, "backend")
                if backend_attribute is None:
                    continue
                backend_value = backend_attribute.s.decode("UTF-8")
                if backend_value == "fpgadataflow":
                    try:
                        # lookup op_type in registry of CustomOps
                        inst = registry.custom_op[op_type](node)
                        # ensure that code is generated
                        assert inst.get_nodeattr("code_gen_dir_ipgen") != ""
                        # call the compilation function for this node
                        inst.ipgen_singlenode_code()
                        # ensure that executable path is now set
                        assert inst.get_nodeattr("ipgen_path") != ""
                    except KeyError:
                        # exception if op_type is not supported
                        raise Exception(
                            "Custom op_type %s is currently not supported." % op_type
                        )
        return (model, False)


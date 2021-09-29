import numpy as np
from abc import ABC, abstractmethod
from onnx import TensorProto, helper

from finn.core.modelwrapper import ModelWrapper
from finn.custom_op.registry import getCustomOp
from finn.transformation.base import Transformation

allowed_identity_successors = [
    "MatMul",
    "Conv",
    "MaxPool",
    "Reshape",
    None,
]


class ConvertQuantActToMultiThreshold(Transformation):
    """Converts Quant nodes in the activation path to MultiThreshold nodes."""

    def apply(self, model):
        graph = model.graph
        node_ind = 0
        graph_modified = False

        for n in graph.node:
            node_ind += 1
            if n.op_type == "Quant":
                # Check that the node is in the activation path
                inp = model.get_initializer(n.input[0])
                out = model.get_initializer(n.output[0])
                if not (inp is None and out is None):
                    continue
                successor = model.find_direct_successors(n)
                if successor is not None:
                    successor = successor[0]
                if model.is_fork_node(n):
                    raise RuntimeError(
                        "Forking Quant nodes are not currently supported by FINN."
                    )

                # ToDo: Check for activation functions behind (or infront of?)
                #  the Quant node, such as ReLu

                # Check that this is an idendity operation
                if successor.op_type in allowed_identity_successors:
                    handler = QuantIdentityHandler(model, n, node_ind)
                else:
                    raise RuntimeError(
                        f"Quant nodes with successor nodes of type {successor.op_type} "
                        f"are currently not supported by FINN and can not be converted "
                        f"to MultiThreshold nodes."
                    )
                model = handler.replace_quant_node()
                graph_modified = True
                return (model, graph_modified)

        return (model, graph_modified)


class QuantActBaseHandler(ABC):
    """Base class for converting quantized activation expressed in the QONNX dialect
    to the FINN ONNX dialect."""

    def __init__(self, model: ModelWrapper, quant_node, quant_node_index: int):
        super().__init__()
        self._model = model
        self._q_node = quant_node
        self._q_index = quant_node_index

    @abstractmethod
    def _calculate_act_bias(self):
        pass

    @abstractmethod
    def _calculate_thresholds(self):
        pass

    @abstractmethod
    def _calculate_act_scale(self):
        pass

    def _extract_output_datatype(self):
        dtype = self._model.get_tensor_datatype(self._q_node.output[0]).name
        if "SCALED" in dtype:
            dtype = dtype.replace("SCALED", "")
        return dtype

    def calculate_node_parameters(self):
        out_dtype = self._extract_output_datatype()
        return {
            "out_dtype": out_dtype,
            "thresholds": self._calculate_thresholds(),
            "adder_bias": self._calculate_act_bias(),
            "mul_scale": self._calculate_act_scale(),
        }

    def replace_quant_node(self):
        # Shorten instance variables
        model = self._model
        graph = model.graph
        n = self._q_node
        running_node_index = self._q_index
        successor = model.find_direct_successors(n)
        if successor is not None:
            successor = successor[0]

        # Calculate insertion parameters
        parameter_dict = self.calculate_node_parameters()
        thresholds = parameter_dict["thresholds"]
        out_dtype = parameter_dict["out_dtype"]
        adder_bias = parameter_dict["adder_bias"]
        mul_scale = parameter_dict["mul_scale"]

        # Modify graph
        # Insert threshold tensor
        thresh_tensor = helper.make_tensor_value_info(
            model.make_new_valueinfo_name(),
            TensorProto.FLOAT,
            thresholds.shape,
        )
        graph.value_info.append(thresh_tensor)
        model.set_initializer(thresh_tensor.name, thresholds)

        # Insert MultiThreshold node
        outp_trans_node = helper.make_node(
            "MultiThreshold",
            [n.input[0], thresh_tensor.name],
            [n.output[0]],
            out_dtype=out_dtype,
            domain="finn.custom_op.general",
        )
        graph.node.insert(running_node_index, outp_trans_node)
        running_node_index += 1

        # Insert Add node
        if adder_bias.shape == (1,):
            adder_bias = adder_bias[0]
            add_shape = tuple()
        else:
            add_shape = adder_bias.shape
        add_tensor = helper.make_tensor_value_info(
            model.make_new_valueinfo_name(),
            TensorProto.FLOAT,
            add_shape,
        )
        graph.value_info.append(add_tensor)
        model.set_initializer(add_tensor.name, adder_bias)

        output_shape = model.get_tensor_shape(n.output[0])
        act_add_tensor = helper.make_tensor_value_info(
            model.make_new_valueinfo_name(),
            TensorProto.FLOAT,
            output_shape,
        )
        graph.value_info.append(act_add_tensor)
        if successor is not None:
            successor.input[0] = act_add_tensor.name

        add_node = helper.make_node(
            "Add",
            [n.output[0], add_tensor.name],
            [act_add_tensor.name],
        )
        graph.node.insert(running_node_index, add_node)
        running_node_index += 1

        # Insert Mul node
        if mul_scale.shape == (1,):
            mul_scale = mul_scale[0]
            mul_shape = tuple()
        else:
            mul_shape = mul_scale.shape
        mul_tensor = helper.make_tensor_value_info(
            model.make_new_valueinfo_name(),
            TensorProto.FLOAT,
            mul_shape,
        )
        graph.value_info.append(mul_tensor)
        model.set_initializer(mul_tensor.name, mul_scale)

        output_shape = model.get_tensor_shape(n.output[0])
        act_mul_tensor = helper.make_tensor_value_info(
            model.make_new_valueinfo_name(),
            TensorProto.FLOAT,
            output_shape,
        )
        graph.value_info.append(act_mul_tensor)
        if successor is not None:
            successor.input[0] = act_mul_tensor.name

        mul_node = helper.make_node(
            "Mul",
            [act_add_tensor.name, mul_tensor.name],
            [act_mul_tensor.name],
        )
        graph.node.insert(running_node_index, mul_node)
        running_node_index += 1

        # Now remove the Quant node
        graph.node.remove(n)

        # return the internal model representation
        return self._model


class QuantIdentityHandler(QuantActBaseHandler):
    """Class for converting a quantized identity operation expressed in the QONNX
    dialect to the FINN ONNX dialect."""

    # ToDo: zero_pt and signed should have some sort of influence or
    #  should at least get checked for correct range or value
    # zero_pt = model.get_initializer(n.input[2])
    # signed = q_inst.get_nodeattr("signed")

    def _calculate_act_bias(self):
        # Gather parameters
        bit_width = self._model.get_initializer(self._q_node.input[3])
        q_inst = getCustomOp(self._q_node)
        narrow = q_inst.get_nodeattr("narrow")
        # Calculate bias, see: https://github.com/Xilinx/brevitas/blob/
        # a5bfd6dc5e030f0047ac1ee47932b60e8e873e17/src/brevitas/export/
        # onnx/finn/handler/act.py#L64
        if bit_width == 1:
            bias = np.array([-0.5])
        else:
            if narrow:
                min_non_scaled_val = -(2 ** (bit_width - 1) - 1)
            else:
                min_non_scaled_val = -(2 ** (bit_width - 1))
            bias = np.array([min_non_scaled_val])
        return bias

    def _calculate_thresholds(self):
        # Gather parameters
        bit_width = self._model.get_initializer(self._q_node.input[3])
        quant_scale = self._model.get_initializer(self._q_node.input[1])
        q_inst = getCustomOp(self._q_node)
        narrow = q_inst.get_nodeattr("narrow")

        # Calculate thersholds, see: https://github.com/Xilinx/brevitas/
        # blob/a5bfd6dc5e030f0047ac1ee47932b60e8e873e17/src/brevitas/
        # export/onnx/finn/handler/act.py#L76
        if narrow:
            num_distinct_values = 2 ** bit_width - 1
        else:
            num_distinct_values = 2 ** bit_width

        num_thresholds = int(num_distinct_values - 1)
        flat_scale = quant_scale.flatten()
        num_scale_channels = flat_scale.shape[0]
        step = np.abs(flat_scale)
        half_step = step / 2.0
        thresholds = np.empty((num_scale_channels, num_thresholds))
        # compute the value of the smallest threshold, we'll neg-bias all
        # generated thresholds by this much
        min_threshold = -half_step - step * ((num_thresholds // 2) - 1)
        if not narrow:
            min_threshold -= step
        for c in range(num_scale_channels):
            for t in range(num_thresholds):
                thresholds[c][t] = min_threshold[c] + step[c] * t

        # ToDo: The index 1 needs to be changed to -1 for the channels last format
        num_output_channels = self._model.get_tensor_shape(self._q_node.output[0])[1]
        final_shape = (num_output_channels, num_thresholds)
        if thresholds.shape != final_shape:
            thresholds = np.broadcast_to(thresholds, final_shape)

        return thresholds

    def _calculate_act_scale(self):
        # Gather parameters
        bit_width = self._model.get_initializer(self._q_node.input[3])
        quant_scale = self._model.get_initializer(self._q_node.input[1])
        # Calculate scale, see: https://github.com/Xilinx/brevitas/
        # blob/a5bfd6dc5e030f0047ac1ee47932b60e8e873e17/src/brevitas/
        # export/onnx/finn/handler/act.py#L111
        if bit_width != 1:
            scale = quant_scale
        else:
            # ToDo: This needs testing or rewriting when the BinarayQuant op
            #  comes around
            assert (
                quant_scale.flatten().shape[0] == 1
            ), "Unsupported BIPOLAR per channel scale"
            assert quant_scale.flatten().item() == 1.0, "Unsupported BIPOLAR scale != 1"
            scale = quant_scale * 2
        return scale

# Copyright (c) 2021, Xilinx
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


import warnings

from finn.transformation.base import Transformation
from finn.transformation.qonnx.qonnx_activation_handlers import QuantActBaseHandler


class ConvertQuantActToMultiThreshold(Transformation):
    """
    Converts Quant nodes in the activation path to MultiThreshold nodes.

    The optional keyword arguments `max_multithreshold_bit_width` and `filter_lambda`
    present a way to control which Quant and BinaryQuant nodes in the activation path
    are converted to MultiThreshold nodes.
    The filters which are represented by `max_multithreshold_bit_width` and
    `filter_lambda` are internally connected by an `AND` operation. A warning
    will be emitted when a Quant node is not converted to a MultiThreshold node.

    :param max_multithreshold_bit_width: The value of max_multithreshold_bit_width is
    checked against the bit width of any given Quant node and the transformation to a
    MultiTrheshold node is rejected, when the bitwidth of the Quant node is larger
    than value of max_multithreshold_bit_with. Defaults to: 4
    :type max_multithreshold_bit_width: `int`, optional
    :param filter_lambda: Each candidate Quant and BinaryQant node is first evaluated
    by this lambda function. If the function returns False,
    then the node is not converted to a MultiTrheshold node.
    Defaults to: lambda q_node: True
    :type filter_lambda: `lambda`, optional
    """

    def __init__(
        self, max_multithreshold_bit_width=4, filter_lambda=lambda q_node: True
    ):
        super().__init__()
        self.max_multithreshold_bit_width = max_multithreshold_bit_width
        self._filter_lambda = filter_lambda

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
                predecessor = model.find_direct_predecessors(n)
                if predecessor is not None:
                    predecessor_op_type = predecessor[0].op_type
                else:
                    predecessor_op_type = predecessor
                if model.is_fork_node(n):
                    raise ValueError(
                        "Forking Quant nodes are not currently supported by FINN."
                    )
                if not model.get_initializer(n.input[2]) == 0:
                    raise ValueError(
                        "Only Quant nodes with zero-point == 0 are currently supported."
                    )

                # Check if the bit width is low enough
                bit_width = model.get_initializer(n.input[3])
                if bit_width is None:
                    raise ValueError("Quant nodes must have a static bit width.")
                if bit_width > self.max_multithreshold_bit_width:
                    warnings.warn(
                        f'The Quant node with name: "{n.name}" was not converted to a '
                        f"MultiThreshold node, because its bit width of {bit_width} is "
                        f"higher than the configured maximum bit width of "
                        f"{self.max_multithreshold_bit_width}."
                    )
                    continue
                # Check that this node passes the user filter
                if not self._filter_lambda(n):
                    warnings.warn(
                        f'The Quant node with name: "{n.name}" was not converted to a '
                        f"MultiThreshold node, because the filtering lambda function "
                        f"returned False for this node."
                    )
                    continue

                # Check for possible ambiguity in handler selection
                valid_predecessors = []
                for cls in QuantActBaseHandler.__subclasses__():
                    valid_predecessors.extend(cls.valid_predecessor_op_types)
                if len(valid_predecessors) != len(set(valid_predecessors)):
                    raise RuntimeError(
                        "Two or more activation handlers declare the same "
                        "type of valid predecessor node. "
                        "This leads to ambiguity in the handler selection "
                        "and must thus be avoided."
                    )

                # Try to find a fitting handler for this Quant activation node
                for handler_cls in QuantActBaseHandler.__subclasses__():
                    if predecessor_op_type in handler_cls.valid_predecessor_op_types:
                        handler = handler_cls(model, n, node_ind)
                        break
                else:
                    raise ValueError(
                        f"Quant nodes in the activation path and with predecessor "
                        f"nodes of type {predecessor_op_type} are currently not "
                        f"supported by FINN and can not be converted to "
                        f"MultiThreshold nodes."
                    )
                model = handler.replace_quant_node()
                graph_modified = True
                return (model, graph_modified)

        return (model, graph_modified)

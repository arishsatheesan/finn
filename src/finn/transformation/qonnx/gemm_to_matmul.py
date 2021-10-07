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

import numpy as np
import warnings
from onnx import TensorProto, helper

from finn.transformation.base import Transformation
from finn.util.basic import get_by_name


class GemmToMatMul(Transformation):
    """
    Converts Gemm op into a MatMul and an Add op.
    """

    def apply(self, model):
        graph = model.graph
        node_ind = 0
        for n in graph.node:
            node_ind += 1
            if n.op_type == "Gemm":
                running_node_index = node_ind
                predecessors = model.find_direct_predecessors(n)

                # Transpose A?
                transA = get_by_name(n.attribute, "transA")
                if transA is not None and transA.i:
                    # Insert transpose node
                    inp_trans_out = helper.make_tensor_value_info(
                        model.make_new_valueinfo_name(),
                        TensorProto.FLOAT,
                        None,
                        # [1024,1000],
                    )
                    graph.value_info.append(inp_trans_out)
                    inp_trans_node = helper.make_node(
                        "Transpose", [n.input[0]], [inp_trans_out.name]
                    )
                    graph.node.insert(running_node_index, inp_trans_node)
                    running_node_index += 1

                    n.input[0] = inp_trans_out.name

                # Transpose B?
                transB = get_by_name(n.attribute, "transB")
                if transB is not None and transB.i:
                    # Insert transpose node
                    inp_trans_out = helper.make_tensor_value_info(
                        model.make_new_valueinfo_name(),
                        TensorProto.FLOAT,
                        None,
                        # [1024,1000],
                    )
                    graph.value_info.append(inp_trans_out)
                    inp_trans_node = helper.make_node(
                        "Transpose", [n.input[1]], [inp_trans_out.name]
                    )
                    graph.node.insert(running_node_index, inp_trans_node)
                    running_node_index += 1

                    n.input[1] = inp_trans_out.name

                # Insert MatMul: A * B
                matMul_node = helper.make_node(
                    "MatMul", [n.input[0], n.input[1]], [n.output[0]]
                )
                graph.node.insert(running_node_index, matMul_node)
                matMul_node = graph.node[running_node_index]
                running_node_index += 1

                # Insert Mul: (A*B) * alpha
                alpha = get_by_name(n.attribute, "alpha")
                if alpha is None:
                    alpha = np.array(1.0)
                else:
                    alpha = np.array(alpha.f)
                mul_tensor = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    None,
                )
                graph.value_info.append(mul_tensor)
                model.set_initializer(mul_tensor.name, alpha)

                act_mul_tensor = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    None,
                )
                graph.value_info.append(act_mul_tensor)
                mul_node = helper.make_node(
                    "Mul",
                    [act_mul_tensor.name, mul_tensor.name],
                    [n.output[0]],
                )
                graph.node.insert(running_node_index, mul_node)
                mul_node_main_branch = graph.node[running_node_index]
                running_node_index += 1
                matMul_node.output[0] = act_mul_tensor.name

                # Other branch: Insert Mul: beta * C
                beta = get_by_name(n.attribute, "beta")
                if alpha is None:
                    beta = np.array(1.0)
                else:
                    beta = np.array(beta.f)
                mul_tensor = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    None,
                )
                graph.value_info.append(mul_tensor)
                model.set_initializer(mul_tensor.name, beta)

                act_mul_tensor = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    None,
                )
                graph.value_info.append(act_mul_tensor)
                mul_node = helper.make_node(
                    "Mul",
                    [act_mul_tensor.name, mul_tensor.name],
                    [n.input[2]],
                )
                graph.node.insert(running_node_index, mul_node)
                running_node_index += 1
                predecessors[2].output[0] = act_mul_tensor.name

                # Insert Add: ((A*B) * alpha) + (beta * C)
                act_add_tensor = helper.make_tensor_value_info(
                    model.make_new_valueinfo_name(),
                    TensorProto.FLOAT,
                    None,
                )
                graph.value_info.append(act_add_tensor)
                mul_node_main_branch.output[0] = act_add_tensor.name
                add_node = helper.make_node(
                    "Add",
                    [act_add_tensor.name, n.input[2]],
                    [n.output[0]],
                )

                graph.node.insert(running_node_index, add_node)
                running_node_index += 1

                # Delete Gemm node
                graph.node.remove(n)

                # Remove potential unity multiplications from alpha and beta attributes
                model = model.transform(RemoveUnityMul())

                return model, True

        return model, False


class RemoveUnityMul(Transformation):
    """
    Removes multiplication nodes, which have a unity initializer.
    """

    def apply(self, model):
        graph = model.graph
        node_ind = 0
        for n in graph.node:
            node_ind += 1
            if n.op_type == "Mul":
                init = model.get_initializer(n.input[1])
                if init is not None:
                    # Check if all multipliers are unity
                    init = init.flatten()
                    if (init == 1.0).all():
                        predecessors = model.find_direct_predecessors(n)
                        successors = model.find_direct_successors(n)
                        # Check if we reached the top or bottom of the graph
                        if predecessors is not None:
                            for predecessor in predecessors:
                                predecessor.output[0] = n.output[0]
                            graph.node.remove(n)
                            return model, True
                        elif successors is not None:
                            for successor in successors:
                                successor.input[0] = n.input[0]
                            graph.node.remove(n)
                            return model, True
                        else:
                            warnings.warn(
                                f"Can't remove empty unity multiplication node {n}, "
                                f"due to no available successors or predecessors."
                            )
        return model, False

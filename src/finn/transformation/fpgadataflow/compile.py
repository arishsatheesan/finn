# Copyright (c) 2020, Xilinx
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

import finn.custom_op.registry as registry
import finn.util.basic as util
from finn.transformation import Transformation


class Compile(Transformation):
    """For every node: compile C++ code in node attribute "code_gen_dir_npysim"
    and save path to executables in node attribute "executable_path".
    All nodes in the graph must have the fpgadataflow backend attribute.

    To use these executables, exec_mode must be set to "npysim" (using transformation
    SetExecMode) and the model has to be executed using execute_onnx() from
    finn.core.onnx_exec"""

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
                        assert (
                            inst.get_nodeattr("code_gen_dir_npysim") != ""
                        ), """Node
                        attribute "code_gen_dir_npysim" is not set. Please run
                        Transformation CodeGen_npysim first."""
                        # call the compilation function for this node
                        inst.compile_singlenode_code()
                        # ensure that executable path is now set
                        assert (
                            inst.get_nodeattr("executable_path") != ""
                        ), """Transformation
                        compile was not successful, there is no path to executables set
                        in node attribute "executable_path"."""
                    except KeyError:
                        # exception if op_type is not supported
                        raise Exception(
                            "Custom op_type %s is currently not supported." % op_type
                        )
        return (model, False)

import numpy as np

from finn.transformation import Transformation


class RoundAndClipThresholds(Transformation):
    """For MultiThreshold nodes operating on integer inputs, round up
    thresholds values to the nearest integer. Additionally, if the input
    is unsigned, sets negative thresholds to zero."""

    def apply(self, model):
        graph = model.graph
        graph_modified = False
        for n in graph.node:
            if n.op_type == "MultiThreshold":
                idtype = model.get_tensor_datatype(n.input[0])
                T = model.get_initializer(n.input[1])
                Tnew = np.ceil(T)
                if idtype.is_integer() and (T != Tnew).any():
                    # round up the thresholds to nearest integer
                    model.set_initializer(n.input[1], Tnew)
                    # use same datatype as inputs for thresholds
                    model.set_tensor_datatype(n.input[1], idtype)
                    graph_modified = True
                if idtype.is_integer() and not idtype.signed() and (Tnew < 0).any():
                    # clip any negative thresholds
                    Tnew = np.clip(Tnew, 0, None)
                    model.set_initializer(n.input[1], Tnew)
                    # use same datatype as inputs for thresholds
                    model.set_tensor_datatype(n.input[1], idtype)
                    graph_modified = True
        return (model, graph_modified)

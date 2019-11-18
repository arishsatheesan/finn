# make sure new CustomOp subclasses are imported here so that they get
# registered and plug in correctly into the infrastructure
from finn.custom_op.multithreshold import MultiThreshold
from finn.custom_op.xnorpopcount import XnorPopcountMatMul
from finn.custom_op.fpgadataflow.streamingmaxpool import StreamingMaxPool

# create a mapping of all known CustomOp names and classes
custom_op = {}

custom_op["MultiThreshold"] = MultiThreshold
custom_op["XnorPopcountMatMul"] = XnorPopcountMatMul
custom_op["StreamingMaxPool"] = StreamingMaxPool

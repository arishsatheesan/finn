from abc import abstractmethod
import os
import numpy as np
import subprocess
from finn.custom_op import CustomOp


class HLSCustomOp(CustomOp):
    def __init__(self):
        super().__init__()
        # template for single node execution
        self.docompute_template = """
        #include "cnpy.h"
        #include <vector>
        #include "bnn-library.h"

        // includes for network parameters
        $GLOBALS$

        // defines for network parameters
        $DEFINES$

        int main(){

        $STREAMDECLARATIONS$

        $READNPYDATA$

        $DOCOMPUTE$

        $DATAOUTSTREAM$

        $SAVEASCNPY$

        }

        """
        self.code_gen_dict = {}


    @abstractmethod
    def get_attributes(self, node):
        pass

    def code_generation(self, node):
        self.get_attributes(node)
        self.global_includes(node)
        self.defines(node)
        self.read_npy_data(node)
        self.strm_decl(node)
        self.docompute(node)
        self.dataoutstrm(node)
        self.save_as_npy(node)

        template = self.docompute_template

        for key in self.code_gen_dict:
            # transform list into long string separated by '\n'
            code_gen_line = "\n".join(self.code_gen_dict[key])
            template = template.replace(key, code_gen_line)

        f = open("execute_{}.cpp".format(node.op_type), "w")
        f.write(template)
        f.close()

    @abstractmethod
    def global_includes(self, node):
        pass

    @abstractmethod
    def defines(self, node):
        pass

    @abstractmethod
    def read_npy_data(self, node):
        pass

    @abstractmethod
    def strm_decl(self, node):
        pass

    @abstractmethod
    def docompute(self, node):
        pass

    @abstractmethod
    def dataoutstrm(self, node):
        pass

    @abstractmethod
    def save_as_npy(self, node):
        pass

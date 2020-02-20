.. FINN documentation master file, created by
   sphinx-quickstart on Thu Feb 20 12:08:33 2020.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

****
FINN
****
FINN is an experimental framework from Xilinx Research Labs to explore deep neural network inference on FPGAs. It specifically targets quantized neural networks, with emphasis on generating dataflow-style architectures customized for each network. It is not intended to be a generic DNN accelerator like xDNN, but rather a tool for exploring the design space of DNN inference accelerators on FPGAs.

What is FINN?
=============
'FINN' is colloquially used to refer to two separate but highly related things:

* The FINN project, which includes tools for training quantized neural networks such as Brevitas, the FINN compiler, and the finn-hlslib Vivado HLS library of FPGA components for QNNs. An overview of the project can be taken from the following graphic and details can be seen on the project homepage.

.. image:: ../img/finn-flow.png
   :height: 600px
   :scale: 75%
   :align: center

* The repository, this Read the Docs website corresponds to. This is the FINN compiler, which is the centerpiece of the FINN project. The GitHub repository can be viewed using the link in the upper right corner.

.. toctree::
   :maxdepth: 2
   :caption: Contents:



Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

#!/bin/bash
# Copyright (c) 2020-2022, Advanced Micro Devices
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

FINN_BASE_COMMIT="585bccad29ba6416511256c732a2c1da21d00bdf"
QONNX_COMMIT="9f9eff95227cc57aadc6eafcbd44b7acda89f067"
FINN_EXP_COMMIT="af6102769226b82b639f243dc36f065340991513"
BREVITAS_COMMIT="a5b71d6de1389d3e7db898fef72e014842670f03"
PYVERILATOR_COMMIT="0c3eb9343500fc1352a02c020a736c8c2db47e8e"
CNPY_COMMIT="4e8810b1a8637695171ed346ce68f6984e585ef4"
HLSLIB_COMMIT="c6cd928bc6f7e2e41c4d6a0376ad5c3ebe9d2d82"
OMX_COMMIT="a97f0bf145a2f7e57ca416ea76c9e45df4e9aa37"
AVNET_BDF_COMMIT="2d49cfc25766f07792c0b314489f21fe916b639b"

FINN_BASE_URL="https://github.com/Xilinx/finn-base.git"
QONNX_URL="https://github.com/fastmachinelearning/qonnx.git"
FINN_EXP_URL="https://github.com/Xilinx/finn-experimental.git"
BREVITAS_URL="https://github.com/Xilinx/brevitas.git"
PYVERILATOR_URL="https://github.com/maltanar/pyverilator.git"
CNPY_URL="https://github.com/rogersce/cnpy.git"
HLSLIB_URL="https://github.com/Xilinx/finn-hlslib.git"
OMX_URL="https://github.com/maltanar/oh-my-xilinx.git"
AVNET_BDF_URL="https://github.com/Avnet/bdf.git"

FINN_BASE_DIR="finn-base"
QONNX_DIR="qonnx"
FINN_EXP_DIR="finn-experimental"
BREVITAS_DIR="brevitas"
PYVERILATOR_DIR="pyverilator"
CNPY_DIR="cnpy"
HLSLIB_DIR="finn-hlslib"
OMX_DIR="oh-my-xilinx"
AVNET_BDF_DIR="avnet-bdf"

# absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")

fetch_repo() {
    # URL for git repo to be cloned
    REPO_URL=$1
    # commit hash for repo
    REPO_COMMIT=$2
    # directory to clone to under deps/
    REPO_DIR=$3
    # absolute path for the repo local copy
    CLONE_TO=$SCRIPTPATH/deps/$REPO_DIR

    # clone repo if dir not found
    if [ ! -d "$CLONE_TO" ]; then
        git clone $REPO_URL $CLONE_TO
    fi
    # verify and try to pull repo if not at correct commit
    CURRENT_COMMIT=$(git -C $CLONE_TO rev-parse HEAD)
    if [ $CURRENT_COMMIT != $REPO_COMMIT ]; then
        git -C $CLONE_TO pull
        # checkout the expected commit
        git -C $CLONE_TO checkout $REPO_COMMIT
    fi
    # verify one last time
    CURRENT_COMMIT=$(git -C $CLONE_TO rev-parse HEAD)
    if [ $CURRENT_COMMIT == $REPO_COMMIT ]; then
        echo "Successfully checked out $REPO_DIR at commit $CURRENT_COMMIT"
    else
        echo "Could not check out $REPO_DIR. Check your internet connection and try again."
    fi
}

fetch_repo $FINN_BASE_URL $FINN_BASE_COMMIT $FINN_BASE_DIR
fetch_repo $QONNX_URL $QONNX_COMMIT $QONNX_DIR
fetch_repo $FINN_EXP_URL $FINN_EXP_COMMIT $FINN_EXP_DIR
fetch_repo $BREVITAS_URL $BREVITAS_COMMIT $BREVITAS_DIR
fetch_repo $PYVERILATOR_URL $PYVERILATOR_COMMIT $PYVERILATOR_DIR
fetch_repo $CNPY_URL $CNPY_COMMIT $CNPY_DIR
fetch_repo $HLSLIB_URL $HLSLIB_COMMIT $HLSLIB_DIR
fetch_repo $OMX_URL $OMX_COMMIT $OMX_DIR
fetch_repo $AVNET_BDF_URL $AVNET_BDF_COMMIT $AVNET_BDF_DIR

# TODO download extra Pynq board files and extract if needed
# cd /tmp; \
# wget -q https://github.com/cathalmccabe/pynq-z1_board_files/raw/master/pynq-z1.zip; \
# wget -q https://dpoauwgwqsy2x.cloudfront.net/Download/pynq-z2.zip; \
# unzip -q pynq-z1.zip; \
# unzip -q pynq-z2.zip; \
# mkdir ${FINN_ROOT}/deps/board_files; \
# mv pynq-z1/ ${FINN_ROOT}/deps/board_files/; \
# mv pynq-z2/ ${FINN_ROOT}/deps/board_files/; \
# rm pynq-z1.zip; \
# rm pynq-z2.zip; \
# git clone https://github.com/Avnet/bdf.git ${FINN_ROOT}/deps/avnet-bdf; \
# git -C ${FINN_ROOT}/deps/avnet-bdf checkout  $AVNET_BDF_COMMIT; \
# mv ${FINN_ROOT}/deps/avnet-bdf/* ${FINN_ROOT}/deps/board_files/;

#!/bin/bash
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

if [ -z "$VIVADO_PATH" ];then
        echo "For correct implementation please set an environment variable VIVADO_PATH that contains the path to your vivado installation directory"
        exit 1
fi

if [ -z "$PYNQ_IP" ];then
        echo "Please set the PYNQ_IP env.var. to enable PYNQ deployment tests."
fi

DOCKER_GID=$(id -g)
DOCKER_GNAME=$(id -gn)
DOCKER_UNAME=$(id -un)
DOCKER_UID=$(id -u)
DOCKER_PASSWD="finn"
# generate a random number per-run to allow multiple
# containers from the same user
DOCKER_RND=$(shuf -i0-32768 -n1)
DOCKER_TAG="finn_dev_${DOCKER_UNAME}"
# uncomment to run multiple instances with different names
# DOCKER_INST_NAME="finn_${DOCKER_UNAME}_${DOCKER_RND}"
DOCKER_INST_NAME="finn_dev_${DOCKER_UNAME}"
# ensure Docker tag and inst. name are all lowercase
DOCKER_TAG=$(echo "$DOCKER_TAG" | tr '[:upper:]' '[:lower:]')
DOCKER_INST_NAME=$(echo "$DOCKER_INST_NAME" | tr '[:upper:]' '[:lower:]')
# the settings below will be taken from environment variables if available,
# otherwise the defaults below will be used
: ${JUPYTER_PORT=8888}
: ${NETRON_PORT=8081}
: ${PYNQ_USERNAME="xilinx"}
: ${PYNQ_PASSWORD="xilinx"}
: ${PYNQ_BOARD="Pynq-Z1"}
: ${PYNQ_TARGET_DIR="/home/xilinx/$DOCKER_INST_NAME"}
: ${NUM_DEFAULT_WORKERS=1}

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")

BUILD_LOCAL=/tmp/$DOCKER_INST_NAME
VIVADO_HLS_LOCAL=$VIVADO_PATH
VIVADO_IP_CACHE=$BUILD_LOCAL/vivado_ip_cache

# ensure build dir exists locally
mkdir -p $BUILD_LOCAL
mkdir -p $VIVADO_IP_CACHE

echo "Instance is named as $DOCKER_INST_NAME"
echo "Mounting $BUILD_LOCAL into $BUILD_LOCAL"
echo "Mounting $VIVADO_PATH into $VIVADO_PATH"
echo "Port-forwarding for Jupyter $JUPYTER_PORT:$JUPYTER_PORT"
echo "Port-forwarding for Netron $NETRON_PORT:$NETRON_PORT"
echo "Vivado IP cache dir is at $VIVADO_IP_CACHE"
echo "Using default PYNQ board $PYNQ_BOARD"

if [ "$1" = "test" ]; then
        echo "Running test suite"
        DOCKER_CMD="python setup.py test"
elif [ "$1" = "notebook" ]; then
        echo "Running Jupyter notebook server"
        DOCKER_CMD="jupyter notebook --ip=0.0.0.0 --port $JUPYTER_PORT notebooks"
else
        echo "Running container only"
        DOCKER_CMD="bash"
fi

# Build the FINN Docker image
docker build -f docker/Dockerfile.finn_dev --tag=$DOCKER_TAG \
             --build-arg GID=$DOCKER_GID \
             --build-arg GNAME=$DOCKER_GNAME \
             --build-arg UNAME=$DOCKER_UNAME \
             --build-arg UID=$DOCKER_UID \
             --build-arg PASSWD=$DOCKER_PASSWD \
             --build-arg JUPYTER_PORT=$JUPYTER_PORT \
             --build-arg NETRON_PORT=$NETRON_PORT \
             .
# Launch container with current directory mounted
# important to pass the --init flag here for correct Vivado operation, see:
# https://stackoverflow.com/questions/55733058/vivado-synthesis-hangs-in-docker-container-spawned-by-jenkins
docker run -t --rm --name $DOCKER_INST_NAME -it --init \
--hostname $DOCKER_INST_NAME \
-e "XILINX_VIVADO=$VIVADO_PATH" \
-e "SHELL=/bin/bash" \
-v $SCRIPTPATH:/workspace/finn \
-v $BUILD_LOCAL:$BUILD_LOCAL \
-v $VIVADO_PATH:$VIVADO_PATH \
-e VIVADO_PATH=$VIVADO_PATH \
-e FINN_INST_NAME=$DOCKER_INST_NAME \
-e FINN_ROOT="/workspace/finn" \
-e VIVADO_IP_CACHE="$VIVADO_IP_CACHE" \
-e PYNQ_BOARD=$PYNQ_BOARD \
-e PYNQ_IP=$PYNQ_IP \
-e PYNQ_USERNAME=$PYNQ_USERNAME \
-e PYNQ_PASSWORD=$PYNQ_PASSWORD \
-e PYNQ_TARGET_DIR=$PYNQ_TARGET_DIR \
-e NUM_DEFAULT_WORKERS=$NUM_DEFAULT_WORKERS \
-p $JUPYTER_PORT:$JUPYTER_PORT \
-p $NETRON_PORT:$NETRON_PORT \
$DOCKER_TAG $DOCKER_CMD

#!/bin/bash
set -e

# 1. Install Basic Tools
apt-get update && apt-get install -y wget curl

# 2. Install Miniconda
if [ ! -d "$HOME/miniconda" ]; then
    echo "Downloading Miniconda..."
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
    bash miniconda.sh -b -p $HOME/miniconda
    rm miniconda.sh
else
    echo "Miniconda already installed."
fi

# 3. Setup Environment
source "$HOME/miniconda/bin/activate"
conda config --add channels conda-forge
conda config --set auto_update_conda False
conda create -n shareable_gpu python=3.10 -y

# 4. Activate and Install Deps
source "$HOME/miniconda/bin/activate" shareable_gpu
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install hivemind fastapi uvicorn

echo "Setup Complete!"
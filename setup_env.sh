source ~/miniconda/bin/activate
# Fix Conda ToS issue by adding conda-forge and disabling auto_update
conda config --add channels conda-forge
conda config --set auto_update_conda False
conda create -n shareable_gpu python=3.10 -y
conda activate shareable_gpu
# Install PyTorch with pip which is often less finicky about channels in CI/Headless
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install hivemind fastapi uvicorn

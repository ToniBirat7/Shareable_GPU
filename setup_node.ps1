<#
.SYNOPSIS
    Automated DSCP Setup Script for Secondary Peers.
    This script installs a dedicated Ubuntu WSL distribution on a specified drive, 
    configures Miniconda, and installs all required ML libraries.

.PARAMETER InstallDir
    The absolute path to the directory where the WSL distribution should be installed (e.g., F:\WSL).
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$InstallDir
)

$ErrorActionPreference = "Stop"

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "DSCP: Automated Node Initialization" -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan

# 1. Validation
if (-not (Test-Path $InstallDir)) {
    Write-Host "Creating installation directory: $InstallDir..."
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
}

Write-Host "Checking for WSL 2..." -ForegroundColor Yellow
$wslCheck = wsl --status
if ($null -eq $wslCheck) {
    throw "WSL 2 is not enabled. Please enable WSL 2 and try again."
}

# 2. Download Ubuntu RootFS
$distroName = "Ubuntu_Shareable_GPU"
$zipPath = Join-Path $InstallDir "ubuntu.zip"
$extractPath = Join-Path $InstallDir "extracted"
$rootfsPath = Join-Path $extractPath "install.tar.gz"

Write-Host "Downloading Ubuntu 22.04 LTS RootFS..." -ForegroundColor Yellow
$ubuntuUrl = "https://aka.ms/wslubuntu2204"
Invoke-WebRequest -Uri $ubuntuUrl -OutFile $zipPath

Write-Host "Extracting distribution files..." -ForegroundColor Yellow
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

# 3. Import WSL Distribution
Write-Host "Importing distribution to $InstallDir..." -ForegroundColor Yellow
$vhdPath = Join-Path $InstallDir $distroName
wsl --import $distroName $vhdPath $rootfsPath --version 2

# 4. Internal Setup (Miniconda & Libraries)
Write-Host "Configuring Linux Environment (Miniconda/PyTorch)..." -ForegroundColor Yellow

$setupCmd = @"
# 1. Update and Base Tools
apt-get update && apt-get install -y wget curl git

# 2. Install Miniconda
if [ ! -d "`$HOME/miniconda" ]; then
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
    bash miniconda.sh -b -p `$HOME/miniconda
    rm miniconda.sh
fi

source "`$HOME/miniconda/bin/activate"
conda config --set auto_update_conda False
conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main
conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r

# 3. Create Environment
if ! conda info --envs | grep -q shareable_gpu; then
    conda create -n shareable_gpu python=3.10 -y
fi

# 4. Install ML Stack
source "`$HOME/miniconda/bin/activate" shareable_gpu
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install hivemind fastapi uvicorn
"@

wsl -d $distroName --exec bash -c $setupCmd

# 5. Cleanup
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item $zipPath -Force
Remove-Item $extractPath -Recurse -Force

Write-Host "----------------------------------------------------" -ForegroundColor Green
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "Root: $vhdPath"
Write-Host "Distro: $distroName"
Write-Host "----------------------------------------------------" -ForegroundColor Green
Write-Host "Next Step: Open WSL and run: conda activate shareable_gpu"

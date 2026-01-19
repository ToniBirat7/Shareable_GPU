<#
.SYNOPSIS
    Automated DSCP Setup Script for Secondary Peers.
    This script installs a dedicated Ubuntu WSL distribution on a specified drive, 
    configures Miniconda, and installs all required ML libraries.

.PARAMETER InstallDir
    The absolute path to the directory where the WSL distribution should be installed (e.g., F:\WSL).
#>

param (
    [Parameter(Mandatory = $true)]
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

# 2. Check for existing RootFS to save time
$distroName = "Ubuntu_Shareable_GPU"
$zipPath = Join-Path $InstallDir "ubuntu.zip"
$extractPath = Join-Path $InstallDir "extracted"

Write-Host "Searching for existing distribution files in $InstallDir..." -ForegroundColor Yellow
$rootfsPath = Get-ChildItem -Path $InstallDir -Filter "install.tar.gz" -Recurse | Select-Object -First 1 | ForEach-Object { $_.FullName }

if (-not $rootfsPath) {
    # Fallback search for common names
    $rootfsPath = Get-ChildItem -Path $InstallDir -Filter "ubuntu-rootfs.tar.gz" -Recurse | Select-Object -First 1 | ForEach-Object { $_.FullName }
}

if ($rootfsPath) {
    Write-Host "Found existing RootFS: $rootfsPath" -ForegroundColor Green
    Write-Host "Skipping download and extraction." -ForegroundColor Green
}
else {
    Write-Host "Downloading Ubuntu 22.04 LTS RootFS (~1GB)..." -ForegroundColor Yellow
    $ubuntuUrl = "https://aka.ms/wslubuntu2204"

    $maxRetries = 3
    $retryCount = 0
    $done = $false

    while (-not $done -and $retryCount -lt $maxRetries) {
        try {
            if (Get-Command "curl.exe" -ErrorAction SilentlyContinue) {
                Write-Host "Using curl for download..." -ForegroundColor Cyan
                curl.exe -L $ubuntuUrl -o $zipPath --retry 3 --connect-timeout 30
            }
            else {
                Write-Host "Using Invoke-WebRequest..." -ForegroundColor Cyan
                Invoke-WebRequest -Uri $ubuntuUrl -OutFile $zipPath -TimeoutSec 600
            }
            $done = $true
        }
        catch {
            $retryCount++
            Write-Host "Download failed. Retry $retryCount/$maxRetries..." -ForegroundColor Red
            Start-Sleep -Seconds 5
        }
    }

    if (-not $done) {
        throw "Download failed after $maxRetries attempts. Please check your internet connection."
    }

    Write-Host "Extracting distribution files..." -ForegroundColor Yellow
    if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

    # The aka.ms link downloads a package that often contains another .appx inside.
    $innerAppx = Get-ChildItem -Path $extractPath -Filter "*x64.appx" | Select-Object -First 1
    if ($innerAppx) {
        Write-Host "Extracting inner architecture-specific bundle..." -ForegroundColor Yellow
        $innerZip = Join-Path $extractPath "inner.zip"
        Rename-Item -Path $innerAppx.FullName -NewName "inner.zip"
        Expand-Archive -Path $innerZip -DestinationPath $extractPath -Force
    }

    $rootfsPath = Get-ChildItem -Path $extractPath -Filter "install.tar.gz" -Recurse | Select-Object -First 1 | ForEach-Object { $_.FullName }

    if (-not $rootfsPath) {
        throw "Could not find install.tar.gz in the downloaded package. Please check the download."
    }
}

# 3. Import WSL Distribution
Write-Host "Importing distribution to $InstallDir..." -ForegroundColor Yellow
$vhdPath = Join-Path $InstallDir $distroName
if (!(wsl --list --quiet | Select-String -Pattern "^$distroName$")) {
    wsl --import $distroName $vhdPath $rootfsPath --version 2
}
else {
    Write-Host "Distribution '$distroName' already exists. Skipping import." -ForegroundColor Cyan
}

# 4. Internal Setup (Miniconda & Libraries)
Write-Host "Configuring Linux Environment (Miniconda/PyTorch)..." -ForegroundColor Yellow

$setupCmd = @"
set -e
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
# Accept ToS for standard channels
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

# Fix CRLF for Bash
$setupCmd = $setupCmd -replace "`r`n", "`n"

Write-Host "Executing setup script inside WSL... This may take several minutes." -ForegroundColor Cyan
wsl -d $distroName --user root bash -c $setupCmd

# 5. Cleanup
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }

Write-Host "----------------------------------------------------" -ForegroundColor Green
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "Root: $vhdPath"
Write-Host "Distro: $distroName"
Write-Host "----------------------------------------------------" -ForegroundColor Green
Write-Host "Next Step: Open WSL and run: conda activate shareable_gpu"

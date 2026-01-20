# Secondary Peer Onboarding Guide

## Overview
This document provides technical instructions for establishing a secondary compute node within the Decentralized Shareable Compute Protocol (DSCP) network. By following this guide, a secondary peer can contribute their local GPU resources to a shared training swarm.

## Prerequisites
- **Hardware:** Nvidia GPU (RTX 30-series or newer recommended) with a minimum of 6GB VRAM.
- **Operating System:** Windows 10/11 with Windows Subsystem for Linux 2 (WSL 2) and Ubuntu 22.04 LTS.
- **Drivers:** Latest Nvidia Game Ready or Studio drivers with CUDA support.

## Installation Procedure

### 1. Repository Acquisition
Clone the project repository to the Windows host machine:
```powershell
git clone https://github.com/ToniBirat7/Shareable_GPU.git
cd Shareable_GPU
```

### 2. Automated Environment Configuration
Initialize the entire environment (including WSL import to your preferred drive) using the provided PowerShell script. Run this from an **Administrator PowerShell** window:

```powershell
# Syntax: .\setup_node.ps1 -InstallDir "PATH_TO_YOUR_TARGET_DISK"
# Example for F: drive:
.\setup_node.ps1 -InstallDir "F:\WSL_DSCP"
```

The script will automatically:
- Download and import the Ubuntu 22.04 WSL distribution.
- Install Miniconda and configure licensing.
- Create the `shareable_gpu` environment with PyTorch (CUDA) and Hivemind.
- Clean up all temporary installation artifacts.

## Network Connection

### 1. Identify Bootstrap Peer
To connect to the primary swarm, the secondary peer requires the bootstrap address of the primary node. Request this address from the primary node administrator. It will follow the format:
`/ip4/[PRIMARY_IP_ADDRESS]/tcp/31337/p2p/[PEER_ID]`

### 2. Daemon Initialization
Activate the specialized Python environment and initialize the compute engine:
```bash
conda activate shareable_gpu
python src/backend/engine.py --peers "PRIMARY_BOOTSTRAP_ADDRESS"
```

## Verification

### 1. Decentralized Training Test
To verify successful gradient synchronization, execute the distributed training validation script:
```bash
python shared_training_test.py --peers "PRIMARY_BOOTSTRAP_ADDRESS"
```
Success is confirmed when the "Peers contributing" count increments to 2 and training loss values remain synchronized across both nodes.

### 2. Dashboard Monitoring
Secondary peers can monitor their local status by initializing the frontend dashboard (Node.js required on host):
```powershell
cd src/frontend
npm run dev
```
Access the interface via `http://localhost:3000`.

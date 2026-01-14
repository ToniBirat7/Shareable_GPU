# Decentralized Shareable Compute Protocol (DSCP)

## Abstract
The Decentralized Shareable Compute Protocol (DSCP) is an open-source initiative designed to address the growing disparity between the demand for high-performance AI compute and the availability of centralized infrastructure. By utilizing a hybrid architecture of Swarm Parallelism and Pipeline Parallelism, DSCP aggregates idle consumer-grade GPUs into a unified, fault-tolerant training cluster capable of fine-tuning and training Large Language Models (LLMs) over high-latency Wide Area Networks (WAN).

## Table of Contents
- [Abstract](#abstract)
- [Architecture Overview](#architecture-overview)
- [System Requirements](#system-requirements)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Architecture Overview

The platform operates on a decentralized Client-Daemon model:

1.  **Compute Daemon (Backend):** A Python-based service running on Windows Subsystem for Linux (WSL 2). It leverages the **Hivemind** library to participate in a Distributed Hash Table (DHT), managing peer discovery, gradient synchronization, and ensuring fault tolerance against node dropouts.
2.  **Dashboard (Frontend):** A Next.js web application providing real-time visualization of the swarm status, local GPU metrics (VRAM, Utilization, Temperature), and wallet management for contribution rewards.
3.  **Communication Layer:** 
    -   **P2P:** Nodes communicate directly via libp2p for training data exchange.
    -   **Local:** The Dashboard communicates with the Daemon via a RESTful API (FastAPI) over localhost.

## System Requirements

### Hardware
-   **GPU:** Nvidia GeForce RTX 30-series or newer (Minimum 6GB VRAM required for quantization support).
-   **RAM:** Minimum 16GB system memory.
-   **Storage:** 50GB free space on an SSD (External SSDs are supported via WSL mounting).

### Software
-   **Operating System:** Windows 10 (Build 19044+) or Windows 11.
-   **Virtualization:** Windows Subsystem for Linux 2 (WSL 2) enabled.
-   **Drivers:** Latest Nvidia Game Ready or Studio Drivers with CUDA 11.8+ support.

## Installation and Setup

### 1. Repository Cloning
Clone the repository to your local machine:
```bash
git clone https://github.com/ToniBirat7/Shareable_GPU.git
cd Shareable_GPU
```

### 2. Environment Initialization
The project requires a specific Linux environment to handle distributed training dependencies. We recommend using the provided automated script which handles Miniconda installation, Python 3.10 configuration, and PyTorch setup.

Open your WSL terminal and navigate to the project root:
```bash
# Execute the setup script
bash setup_env.sh
```

### 3. Backend Configuration
The backend daemon defaults to joining the public Hivemind swarm. To configure a private mesh or adjust specific parameters (port, network interface), modify `src/backend/engine.py`.

## Usage

### Starting the Compute Daemon
To begin sharing your compute resources:
```bash
# Inside WSL environment
conda activate shareable_gpu
python src/backend/engine.py
```

### Launching the Dashboard
Open a separate terminal (PowerShell or WSL) to start the visualization interface:
```bash
cd src/frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

## Roadmap

### Phase 1: MVP & Feasibility (Current)
-   [x] Establish WSL infrastructure on external storage.
-   [x] Validate Hivemind synchronization between two consumer nodes.
-   [ ] Implement basic Dashboard for node status.

### Phase 2: Core Platform
-   [ ] Implement private peer discovery (bootstrap nodes).
-   [ ] specific model fine-tuning support (e.g., Llama-2-7b).
-   [ ] Wallet integration for contribution tracking.

### Phase 3: Public Beta
-   [ ] One-click Windows Installer (.exe).
-   [ ] Incentive mechanism and tokenomics integration.

## Contributing
We welcome contributions from the community. Please read our `CONTRIBUTING.md` (coming soon) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.

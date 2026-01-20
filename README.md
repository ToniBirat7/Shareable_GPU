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

## Internal Architecture

The DSCP platform utilizes a decentralized architecture designed for asynchronous, distributed training of large-scale models across heterogeneous consumer hardware.

### 1. Peer-to-Peer (P2P) Networking Core
The system is built upon **Hivemind**, which utilizes **libp2p** for its underlying networking stack. 
- **Distributed Hash Table (DHT):** Nodes participate in a Kademlia-based DHT. This decentralized ledger tracks the location of all participants, their current computational state, and the training parameters they are managing.
- **Multi-protocol Support:** Nodes communicate over TCP/UDP and utilize QUIC for efficient, low-latency data transfer.

### 2. Computational Coordination (Swarm Parallelism)
The DSCP network bypasses the limitations of traditional Data Parallelism (which requires high bandwidth) by employing **Swarm Parallelism**:
- **Gradient Averaging:** Peers compute gradients locally on their shard of the data. These gradients are synchronized asynchronously across the DHT using a decentralized averager.
- **Fault Tolerance:** If a peer disconnects, the DHT automatically re-routes tasks. This is critical for consumer environments (e.g., a friend closing their laptop).

### 3. Local Swarm Coordination (LAN)
When two nodes are on the same local network (LAN):
- **Peer Discovery:** The primary node initializes a listener on the DHT. The secondary node joins the swarm by connecting to the primary node's local IP address (`192.168.x.x`).
- **High Bandwidth Exchange:** Because the nodes are on the same LAN, gradient exchange occurs at gigabit speeds (1Gbps+), significantly increasing training efficiency compared to Wide Area Network (WAN) coordination.
- **Local Dashboard Access:** The local frontend dashboard (Next.js) polls the daemon's FastAPI server (`localhost:8000`) for real-time hardware metrics and DHT peer data.

## Implementation Details: Multi-Node Configuration

To enable peer communication on the same network:
1.  **Listener Configuration:** The primary node daemon must listen on all interfaces (`0.0.0.0`).
2.  **Bootstrap Address:** The primary node logs its "Visible multiaddresses". The secondary peer uses this address to target the primary node's internal IP.
3.  **Firewall Transparency:** Windows Defender or local firewalls must permit inbound and outbound traffic on Port 31337 (DHT) and Port 8000 (API, optional).

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

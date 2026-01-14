# Decentralized Shareable GPU Protocol (DSCP)

**DSCP** is a research initiative to democratize AI compute by aggregating idle consumer-grade GPUs into a unified, decentralized training cluster. By leveraging Swarm Parallelism and Pipeline Parallelism, we aim to enable the training of Large Language Models (LLMs) over consumer internet connections.

## 📄 Documentation

- **[Project White Paper](./PROJECT_WHITE_PAPER.md):** Detailed breakdown of the vision, architecture, and feasibility.
- **[Task Tracker](./task.md):** Current progress and roadmap.

## 🚀 Usage (MVP)

### Prerequisites
- **OS:** Windows 10/11 with WSL 2.
- **Hardware:** Nvidia GPU (min 6GB VRAM recommended).
- **Network:** High-speed internet (Upload speed is critical).

### Setup
1.  **Clone the repo:**
    ```bash
    git clone https://github.com/Start-sys/Shareable_GPU.git
    cd Shareable_GPU
    ```
2.  **Initialize Environment:**
    ```bash
    # Inside WSL
    bash setup_env.sh
    ```
3.  **Run the Helper Daemon:**
    ```bash
    python src/backend/engine.py
    ```
4.  **Start the Dashboard:**
    ```bash
    cd src/frontend
    npm run dev
    ```

## 🏗 Architecture
- **Backend:** Python + Hivemind (P2P DHT & Compute).
- **Frontend:** Next.js (Dashboard & Peer Visualization).
- **Core Tech:** PyTorch, bitsandbytes (Quantization), DHT.

___
*Initiated by [Your Name/Team]. Phase 1: Research & MVP.*

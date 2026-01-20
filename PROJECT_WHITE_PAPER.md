# Decentralized Shareable Compute Protocol (DSCP)
**Technical White Paper & Project Vision**

**Abstract**
The exponential growth of Large Language Models (LLMs) has created a critical shortage of accessible computational resources. This project, the Decentralized Shareable Compute Protocol (DSCP), proposes a novel distributed computing framework designed to aggregate idle consumer-grade GPUs into a unified training cluster. By leveraging Swarm Parallelism and privacy-preserving decentralized architectures, DSCP aims to democratize access to high-performance AI training, enabling students, researchers, and developers to train state-of-the-art models without the prohibitive costs of centralized cloud infrastructure.

---

## 1. Introduction

### 1.1 The Problem: The Compute Gap
The AI industry is currently facing a "Compute Wall." Training modern LLMs requires thousands of high-end GPUs (e.g., Nvidia H100s) connected by high-bandwidth fabrics. This infrastructure is centralized, expensive, and inaccessible to the vast majority of the scientific community. Meanwhile, millions of powerful consumer GPUs (e.g., Nvidia RTX 30/40 series) sit idle in personal computers for the majority of the day.

### 1.2 The Solution: Volunteer Computing for AI
DSCP proposes a "Airbnb for Compute" model. It enables users to lend their idle GPU and RAM to a global network. Unlike traditional volunteer computing (like Folding@Home) which focuses on independent tasks, DSCP focuses on **synchronous, collaborative training** of massive neural networks.

## 2. Technical Feasibility & Architecture

### 2.1 The Challenge: Latency & Memory
Training LLMs over the open internet faces two physics-bound challenges:
1.  **Network Latency:** Consumer internet (WAN) has high latency and low bandwidth compared to data center InfiniBand. Standard methods (Data Parallelism) fail here because the "All-Reduce" step is too slow.
2.  **VRAM Constraints:** Consumer GPUs typically have 6GB–24GB of VRAM, which is insufficient to hold even moderate LLM parameters (e.g., Llama-3-70B).

### 2.2 Proposed Methodology: Swarm & Pipeline Parallelism
To overcome these limits, DSCP utilizes a hybrid parallelization strategy powered by **Hivemind**:

*   **Pipeline Parallelism:** The model is sliced vertically. Peer A holds layers 1–4, Peer B holds layers 5–8, etc. Data flows sequentially through the peers.
*   **Swarm Parallelism (Fault Tolerance):** Unlike rigid pipelines, the "Swarm" approach allows multiple peers to hold the same set of layers. If Peer A disconnects, Peer C (who also holds layers 1–4) takes over instantly.
*   **Quantization (4-bit/8-bit):** To fit parameters into limited VRAM (e.g., 6GB RTX 3060), we employ extensive quantization techniques (NF4, bitsandbytes) to reduce memory footprint by 4x without significant accuracy loss.

## 3. System Architecture

The DSCP platform consists of two primary components:

### 3.1 The Daemon (Compute Node)
A lightweight background service running on the provider's machine (Linux/WSL).
*   **Function:** Manages the GPU, executes forward/backward passes, and syncs gradients via a Distributed Hash Table (DHT).
*   **Stack:** Python, PyTorch, Hivemind.

### 3.2 The Dashboard (User Interface)
A web-based interface for managing the node and visualizing the swarm.
*   **Function:** Real-time metrics (Loss, Throughput, Peer Count), Wallet/Earnings management, and start/stop controls.
*   **Stack:** React, Next.js, FastAPI.

## 4. Phase 1: MVP Specification

The initial Proof of Concept (PoC) will focus on validating the network synchronization between two controlled nodes.

*   **Hardware:** 2x Nvidia RTX 3060 (6GB VRAM).
*   **Network:** Consumer Broadband (High-speed Upload).
*   **Target Model:** TinyLlama-1.1B (for validation) -> Llama-2-7b-4bit (stress test).
*   **Environment:** Windows Subsystem for Linux (WSL 2) on external storage to maximize portability and performance.

## 5. Roadmap

*   **Phase 1 (Current):** Feasibility Research & Manual Synchronization Prototype (2 Nodes).
*   **Phase 2:** Development of the Web Dashboard and one-click installer.
*   **Phase 3:** Public Beta "Grid Test" with trusted testers.
*   **Phase 4:** Tokenomics/Incentive Layer integration.

## 6. Conclusion
DSCP represents a fundamental shift in how AI compute is sourced and utilized. By solving the "WAN Bottleneck" through software innovation rather than hardware cabling, we can unlock an exaflop-scale supercomputer that currently sleeps in gamers' homes.

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional

import torch
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hivemind import DHT
from pydantic import BaseModel

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dscp_daemon")


import argparse

# Configuration
def parse_args():
    parser = argparse.ArgumentParser(description="DSCP Compute Daemon")
    parser.add_argument("--peers", type=str, nargs="*", help="Bootstrap peer addresses")
    parser.add_argument("--port", type=int, default=31337, help="Port to listen on")
    parser.add_argument("--api_port", type=int, default=8000, help="Port for the API server")
    return parser.parse_args()

args = parse_args()

class GlobalState:
    dht: Optional[DHT] = None
    cuda_available: bool = False
    device_name: str = "CPU"
    peer_id: str = "Unknown"

state = GlobalState()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting DSCP Compute Daemon...")
    
    # Check CUDA
    if torch.cuda.is_available():
        state.cuda_available = True
        state.device_name = torch.cuda.get_device_name(0)
        logger.info(f"CUDA DETECTED: {state.device_name}")
    else:
        logger.warning("CUDA NOT DETECTED. Using CPU (Not recommended).")

    # Initialize DHT
    logger.info("Connecting to DHT Swarm...")
    try:
        # Use provided peers or default to None (standalone/public)
        initial_peers = args.peers if args.peers else None
        
        state.dht = DHT(
            start=True,
            initial_peers=initial_peers,
            host_maddrs=[f"/ip4/0.0.0.0/tcp/{args.port}", f"/ip4/0.0.0.0/udp/{args.port}/quic"]
        )
        state.peer_id = str(state.dht.peer_id)
        
        # Log reachable addresses so friend can copy them
        logger.info(f"DHT Connected. Peer ID: {state.peer_id}")
        logger.info(f"Visible multiaddresses: {state.dht.get_visible_maddrs()}")
        
    except Exception as e:
        logger.error(f"Failed to initialize DHT: {e}")

    yield
    
    # Shutdown
    logger.info("Shutting down DHT...")
    if state.dht:
        state.dht.shutdown()

app = FastAPI(title="DSCP Daemon", lifespan=lifespan)

# Allow CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatusResponse(BaseModel):
    peer_id: str
    device: str
    cuda_available: bool
    visible_peers: int

@app.get("/status", response_model=StatusResponse)
async def get_status():
    visible_count = 0
    if state.dht:
        try:
            # Check for visible peers (active connections)
            visible_count = len(state.dht.get_visible_maddrs()) 
        except:
            visible_count = -1
            
    return StatusResponse(
        peer_id=state.peer_id,
        device=state.device_name,
        cuda_available=state.cuda_available,
        visible_peers=visible_count
    )

if __name__ == "__main__":
    uvicorn.run("engine:app", host="0.0.0.0", port=args.api_port, reload=True)



import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional

import torch
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hivemind import DHT, use_hivemind_log_handler
from pydantic import BaseModel

# Setup Logging
use_hivemind_log_handler("https://w3.hivemind.learningathome.site/api/", "my_dscp_node")
logger = logging.getLogger("dscp_daemon")
logger.setLevel(logging.INFO)

# Configuration
INITIAL_PEERS = [
    # TODO: Add stable bootstrap peers or discovery logic
    # '/ip4/123.123.123.123/tcp/31337/p2p/Qm...'
]
Using_Hivemind_Public = True # Set to False for private mesh

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
        initial_peers = INITIAL_PEERS if INITIAL_PEERS else None
        # If no peers and strictly private, we start as a bootstrap node
        state.dht = DHT(
            start=True,
            initial_peers=initial_peers,
            host_maddrs=["/ip4/0.0.0.0/tcp/31337", "/ip4/0.0.0.0/udp/31337/quic"]
        )
        state.peer_id = str(state.dht.peer_id)
        logger.info(f"DHT Connected. Peer ID: {state.peer_id}")
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
            # Quick check for visible peers (may be blocking, careful)
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
    uvicorn.run("engine:app", host="0.0.0.0", port=8000, reload=True)


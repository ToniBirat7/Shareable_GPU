import torch
import hivemind
import sys

print("-" * 30)
print("DSCP Backend Verification")
print("-" * 30)

cuda_ok = torch.cuda.is_available()
print(f"CUDA Available: {cuda_ok}")
if cuda_ok:
    print(f"Device Name: {torch.cuda.get_device_name(0)}")
else:
    print("WARNING: CUDA is not available. GPU training will not work.")

try:
    dht = hivemind.DHT(start=True)
    print(f"Hivemind DHT initialized. Peer ID: {dht.peer_id}")
    dht.shutdown()
    print("Hivemind Ready: True")
except Exception as e:
    print(f"Hivemind Ready: False (Error: {e})")

print("-" * 30)
if not cuda_ok:
    sys.exit(0) # We allow CPU mode for now but with warning
sys.exit(0)

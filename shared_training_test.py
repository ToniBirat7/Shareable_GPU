import torch
import torch.nn as nn
import hivemind
import argparse
import time

def run_training_test():
    parser = argparse.ArgumentParser()
    parser.add_argument("--peers", type=str, nargs="*", help="Bootstrap peer addresses")
    args = parser.parse_args()

    # 1. Initialize DHT
    print("Connecting to DHT on FIXED PORT 31337...")
    # We enforce port 31337 so the Windows Bridge/Firewall rules always work
    dht = hivemind.DHT(initial_peers=args.peers, start=True, host_maddrs=["/ip4/0.0.0.0/tcp/31337"]) 
    print(f"Connected to DHT as {dht.peer_id}")
    
    # Print the invite link for others
    visible_addrs = dht.get_visible_maddrs()
    print("\n" + "="*60)
    print("DHT STARTED! SHARE THIS COMMAND WITH YOUR FRIEND:")
    print("="*60)
    
    found_any = False
    for addr in visible_addrs:
        addr_str = str(addr)
        if "127.0.0.1" not in addr_str:
             print(f'python shared_training_test.py --peers "{addr_str}"')
             found_any = True
             
             # Hint for WSL users
             if "172." in addr_str:
                 print(f"   (If 172.x doesn't work, replace it with your Windows LAN IP: 192.168.1.100)")
                 
    if not found_any:
        print("NOTE: No public address found. Use your Windows LAN IP manually:")
        print(f'/ip4/192.168.1.100/tcp/31337/p2p/{dht.peer_id}')
        
    print("="*60 + "\n")

    # 2. Simple Linear Model
    model = nn.Linear(32, 1)
    optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

    # 3. Distributed Optimizer (Collaboratively trains across peers)
    collaborative_optimizer = hivemind.Optimizer(
        dht=dht,
        run_id="shared_test_run",
        optimizer=optimizer,
        target_batch_size=64, # Collect 64 samples across swarm before stepping
        batch_size_per_step=8,
        matchmaking_time=5.0, # Time to wait for other peers
        scheduler=None,
    )

    print("Beginning Training Loop. Wait for other peers to join...")
    
    criterion = nn.MSELoss()
    
    try:
        for i in range(100):
            # Dummy data
            x = torch.randn(8, 32)
            y = torch.randn(8, 1)
            
            # Local forward/backward
            loss = criterion(model(x), y)
            loss.backward()
            
            # Collaborative step (synchronizes gradients across peers)
            collaborative_optimizer.step()
            collaborative_optimizer.zero_grad()
            
            print(f"Step {i} completed. Loss: {loss.item():.4f}")
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("Stopping training...")

    finally:
        collaborative_optimizer.shutdown()
        dht.shutdown()

if __name__ == "__main__":
    run_training_test()

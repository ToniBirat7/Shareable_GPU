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
    print("Connecting to DHT...")
    dht = hivemind.DHT(initial_peers=args.peers, start=True)
    print(f"Connected to DHT as {dht.peer_id}")

    # 2. Simple Linear Model
    model = nn.Linear(32, 1)
    optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

    # 3. Collaborative Optimizer (The magic that shares the load)
    collaborative_optimizer = hivemind.CollaborativeOptimizer(
        adaptive_optimizer=optimizer,
        dht=dht,
        prefix="shared_test_run",
        target_batch_size=64, # Small for testing
        batch_size_per_step=8,
        start=True
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
            
            print(f"Step {i} completed. Loss: {loss.item():.4f} | Peers contributing: {collaborative_optimizer.num_peers}")
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("Stopping training...")

    finally:
        collaborative_optimizer.shutdown()
        dht.shutdown()

if __name__ == "__main__":
    run_training_test()

// API service for DSCP Backend communication

const API_BASE_URL = 'http://localhost:8000';

export interface NodeStatus {
  peer_id: string;
  device: string;
  cuda_available: boolean;
  visible_peers: number;
}

export interface TrainingMetrics {
  current_epoch: number;
  current_step: number;
  loss: number;
  last_sync_time: string;
}

/**
 * Fetch current node status from the backend
 */
export async function fetchNodeStatus(): Promise<NodeStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch node status:', error);
    throw error;
  }
}

/**
 * Fetch training metrics (placeholder - to be implemented in backend)
 */
export async function fetchTrainingMetrics(): Promise<TrainingMetrics | null> {
  // This endpoint doesn't exist yet in the backend
  // Return null for now
  return null;
}

/**
 * Start training session
 */
export async function startTraining(): Promise<void> {
  // To be implemented when backend supports training control
  console.log('Training start requested');
}

/**
 * Stop training session
 */
export async function stopTraining(): Promise<void> {
  // To be implemented when backend supports training control
  console.log('Training stop requested');
}

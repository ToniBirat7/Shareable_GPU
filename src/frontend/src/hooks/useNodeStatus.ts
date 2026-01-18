import { useQuery } from '@tanstack/react-query';
import { fetchNodeStatus, type NodeStatus } from '@/lib/api';

/**
 * Custom hook to fetch and manage node status from the backend
 * Automatically refetches every 3 seconds
 */
export function useNodeStatus() {
    return useQuery<NodeStatus, Error>({
        queryKey: ['nodeStatus'],
        queryFn: fetchNodeStatus,
        refetchInterval: 3000, // Poll every 3 seconds
        retry: 3,
        retryDelay: 1000,
    });
}

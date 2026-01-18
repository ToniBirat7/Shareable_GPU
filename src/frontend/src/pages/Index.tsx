import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NodeIdentityCard } from "@/components/dashboard/NodeIdentityCard";
import { SwarmMetricsCard } from "@/components/dashboard/SwarmMetricsCard";
import { PerformanceMetricsPanel } from "@/components/dashboard/PerformanceMetricsPanel";
import { ComputeActivityCard } from "@/components/dashboard/ComputeActivityCard";
import { PeerNetworkVisualization } from "@/components/dashboard/PeerNetworkVisualization";
import { useNodeStatus } from "@/hooks/useNodeStatus";

// Simulated loss data generation
const generateLossData = (steps: number) => {
  const data = [];
  let loss = 2.5;
  for (let i = 0; i < steps; i++) {
    loss = Math.max(0.1, loss - Math.random() * 0.05 + Math.random() * 0.02);
    data.push({ step: i * 10, loss: parseFloat(loss.toFixed(4)) });
  }
  return data;
};

// Peer visualization will be populated from real backend data when available

const Index = () => {
  // Fetch real node status from backend
  const { data: nodeStatus, isError, isLoading } = useNodeStatus();

  const [isTraining, setIsTraining] = useState(false);
  const [lossData, setLossData] = useState(generateLossData(20));
  const [currentStep, setCurrentStep] = useState(200);

  // Simulated metrics with slight variations
  const [metrics, setMetrics] = useState({
    gpuUtilization: 78,
    vramUsed: 9.2,
    temperature: 67,
    powerDraw: 142,
  });

  // Determine online status from backend
  const isOnline = !isError && !isLoading && nodeStatus !== undefined;

  // Simulate real-time updates when training
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => prev + 1);
      setLossData((prev) => {
        const lastLoss = prev[prev.length - 1]?.loss ?? 1.5;
        const newLoss = Math.max(
          0.08,
          lastLoss - Math.random() * 0.03 + Math.random() * 0.01
        );
        const newData = [
          ...prev.slice(-30),
          { step: prev.length * 10, loss: parseFloat(newLoss.toFixed(4)) },
        ];
        return newData;
      });

      // Fluctuate metrics slightly
      setMetrics((prev) => ({
        gpuUtilization: Math.min(100, Math.max(60, prev.gpuUtilization + (Math.random() - 0.5) * 5)),
        vramUsed: Math.min(12, Math.max(8, prev.vramUsed + (Math.random() - 0.5) * 0.2)),
        temperature: Math.min(85, Math.max(55, prev.temperature + (Math.random() - 0.5) * 2)),
        powerDraw: Math.min(200, Math.max(100, prev.powerDraw + (Math.random() - 0.5) * 10)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTraining]);

  const handleToggleTraining = useCallback(() => {
    setIsTraining((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen gradient-bg noise-overlay">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <DashboardHeader isOnline={isOnline} signalStrength={isOnline ? 4 : 0} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Node Identity - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <NodeIdentityCard
              peerId={nodeStatus?.peer_id || "Connecting..."}
              deviceName={nodeStatus?.device || "Loading..."}
              accelerationEnabled={nodeStatus?.cuda_available ?? false}
              localIp="N/A"
              uptime="N/A"
            />
          </div>

          {/* Swarm Metrics - 1/3 width on desktop */}
          <SwarmMetricsCard
            totalPeers={nodeStatus?.visible_peers || 0}
            directConnections={nodeStatus?.visible_peers || 0}
            indirectConnections={0}
            networkHealth={isOnline ? 100 : 0}
            dataTransferred="N/A"
          />
        </div>

        {/* Performance Metrics */}
        <div className="mb-6">
          <PerformanceMetricsPanel
            gpuUtilization={Math.round(metrics.gpuUtilization)}
            vramUsed={parseFloat(metrics.vramUsed.toFixed(1))}
            vramTotal={12}
            temperature={Math.round(metrics.temperature)}
            maxTemperature={90}
            powerDraw={Math.round(metrics.powerDraw)}
            maxPower={200}
          />
        </div>

        {/* Compute Activity */}
        <div className="mb-6">
          <ComputeActivityCard
            isTraining={isTraining}
            lossData={lossData}
            currentEpoch={3}
            currentStep={currentStep}
            lastSyncTime="12s ago"
            onToggleTraining={handleToggleTraining}
          />
        </div>

        {/* Peer Network Visualization */}
        <PeerNetworkVisualization peers={[]} />
      </div>
    </div>
  );
};

export default Index;

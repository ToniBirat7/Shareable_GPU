import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NodeIdentityCard } from "@/components/dashboard/NodeIdentityCard";
import { SwarmMetricsCard } from "@/components/dashboard/SwarmMetricsCard";
import { PerformanceMetricsPanel } from "@/components/dashboard/PerformanceMetricsPanel";
import { ComputeActivityCard } from "@/components/dashboard/ComputeActivityCard";
import { PeerNetworkVisualization } from "@/components/dashboard/PeerNetworkVisualization";

// Simulated data - in production this would come from your FastAPI backend
const generateLossData = (steps: number) => {
  const data = [];
  let loss = 2.5;
  for (let i = 0; i < steps; i++) {
    loss = Math.max(0.1, loss - Math.random() * 0.05 + Math.random() * 0.02);
    data.push({ step: i * 10, loss: parseFloat(loss.toFixed(4)) });
  }
  return data;
};

const mockPeers = [
  { id: "1", label: "peer-a1b2", isActive: true },
  { id: "2", label: "peer-c3d4", isActive: true },
  { id: "3", label: "peer-e5f6", isActive: false },
  { id: "4", label: "peer-g7h8", isActive: true },
  { id: "5", label: "peer-i9j0", isActive: true },
  { id: "6", label: "peer-k1l2", isActive: false },
  { id: "7", label: "peer-m3n4", isActive: true },
  { id: "8", label: "peer-o5p6", isActive: true },
];

const Index = () => {
  const [isOnline, setIsOnline] = useState(true);
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
              peerId="12D3KooWPjceQrSwdWXPyLLeABRXmuqt69Rg3sBYbU1Nft9HyQ6X"
              deviceName="NVIDIA GeForce RTX 3060"
              accelerationEnabled={true}
              localIp="192.168.1.105"
              uptime="4h 23m 17s"
            />
          </div>

          {/* Swarm Metrics - 1/3 width on desktop */}
          <SwarmMetricsCard
            totalPeers={47}
            directConnections={12}
            indirectConnections={35}
            networkHealth={87}
            dataTransferred="2.4 GB"
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
        <PeerNetworkVisualization peers={mockPeers} />
      </div>
    </div>
  );
};

export default Index;

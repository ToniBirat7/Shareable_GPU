import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Peer {
  id: string;
  label: string;
  isActive: boolean;
}

interface PeerNetworkVisualizationProps {
  peers: Peer[];
  className?: string;
}

export const PeerNetworkVisualization = ({
  peers,
  className,
}: PeerNetworkVisualizationProps) => {
  const positions = useMemo(() => {
    const centerX = 150;
    const centerY = 120;
    const radius = 85;

    return peers.map((_, index) => {
      const angle = (index / peers.length) * 2 * Math.PI - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [peers.length]);

  return (
    <div className={cn("glass-card p-6", className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Peer Network
      </h3>

      <div className="relative aspect-[5/4] w-full">
        <svg
          viewBox="0 0 300 240"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 10px hsl(263, 70%, 30%))" }}
        >
          {/* Connection lines */}
          {positions.map((pos, index) => (
            <line
              key={`line-${index}`}
              x1="150"
              y1="120"
              x2={pos.x}
              y2={pos.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="animate-data-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(263, 70%, 50%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(187, 80%, 45%)" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(263, 70%, 60%)" />
              <stop offset="100%" stopColor="hsl(263, 70%, 40%)" />
            </radialGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(187, 80%, 55%)" />
              <stop offset="100%" stopColor="hsl(187, 80%, 35%)" />
            </radialGradient>
          </defs>

          {/* Peer nodes */}
          {positions.map((pos, index) => (
            <g key={`peer-${index}`}>
              {/* Outer glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="16"
                fill="none"
                stroke={peers[index].isActive ? "hsl(142, 70%, 45%)" : "hsl(240, 5%, 30%)"}
                strokeWidth="1"
                opacity="0.3"
              />
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill={peers[index].isActive ? "url(#nodeGlow)" : "hsl(240, 5%, 20%)"}
                className={cn(
                  "transition-all duration-300",
                  peers[index].isActive && "animate-pulse"
                )}
              />
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + 28}
                textAnchor="middle"
                className="fill-muted-foreground text-[8px] font-mono"
              >
                {peers[index].label}
              </text>
            </g>
          ))}

          {/* Center node (self) */}
          <g>
            {/* Outer ring */}
            <circle
              cx="150"
              cy="120"
              r="24"
              fill="none"
              stroke="hsl(187, 80%, 45%)"
              strokeWidth="2"
              opacity="0.4"
              className="animate-spin-slow"
              strokeDasharray="8 4"
            />
            {/* Inner node */}
            <circle
              cx="150"
              cy="120"
              r="16"
              fill="url(#centerGlow)"
              style={{
                filter: "drop-shadow(0 0 12px hsl(187, 80%, 50%))",
              }}
            />
            <text
              x="150"
              y="124"
              textAnchor="middle"
              className="fill-secondary-foreground text-[10px] font-bold"
            >
              YOU
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Active Peers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span>Idle Peers</span>
        </div>
      </div>
    </div>
  );
};

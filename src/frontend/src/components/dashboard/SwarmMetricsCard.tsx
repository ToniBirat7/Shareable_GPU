import { Users, Activity, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwarmMetricsCardProps {
  totalPeers: number;
  directConnections: number;
  indirectConnections: number;
  networkHealth: number; // 0-100
  dataTransferred: string;
}

export const SwarmMetricsCard = ({
  totalPeers,
  directConnections,
  indirectConnections,
  networkHealth,
  dataTransferred,
}: SwarmMetricsCardProps) => {
  const healthColor =
    networkHealth >= 80
      ? "text-emerald-400"
      : networkHealth >= 50
      ? "text-amber-400"
      : "text-destructive";

  const healthBgColor =
    networkHealth >= 80
      ? "bg-emerald-400"
      : networkHealth >= 50
      ? "bg-amber-400"
      : "bg-destructive";

  return (
    <div className="glass-card card-interactive p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center border border-secondary/30">
          <Users className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Swarm Metrics</h2>
          <p className="text-sm text-muted-foreground">Network participation</p>
        </div>
      </div>

      {/* Main peer count with circular indicator */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative">
          {/* Circular progress background */}
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/50"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${networkHealth * 2.64} 264`}
              className={cn(healthColor, "transition-all duration-500")}
              style={{
                filter: "drop-shadow(0 0 8px currentColor)",
              }}
            />
          </svg>

          {/* Centered peer count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="metric-value text-foreground">{totalPeers}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Peers
            </span>
          </div>
        </div>
      </div>

      {/* Connection breakdown */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30 text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Activity className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">Direct</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{directConnections}</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30 text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Activity className="w-3 h-3 opacity-50" />
            <span className="text-xs uppercase tracking-wider">Indirect</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{indirectConnections}</p>
        </div>
      </div>

      {/* Health and data transfer */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", healthBgColor)} />
            <span className="text-sm text-muted-foreground">Network Health</span>
          </div>
          <span className={cn("text-sm font-semibold", healthColor)}>
            {networkHealth}%
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Data Transferred</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{dataTransferred}</span>
        </div>
      </div>
    </div>
  );
};

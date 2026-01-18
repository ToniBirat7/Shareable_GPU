import { Cpu, HardDrive, Thermometer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  unit: string;
  showPercentage?: boolean;
}

const MetricCard = ({
  icon,
  label,
  value,
  max,
  unit,
  showPercentage = true,
}: MetricCardProps) => {
  const percentage = Math.round((value / max) * 100);
  
  const getColorClass = (pct: number) => {
    if (pct >= 85) return { text: "text-destructive", bg: "bg-destructive" };
    if (pct >= 70) return { text: "text-amber-400", bg: "bg-amber-400" };
    return { text: "text-emerald-400", bg: "bg-emerald-400" };
  };

  const colors = getColorClass(percentage);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <span className={cn("text-2xl font-bold tabular-nums", colors.text)}>
          {showPercentage ? `${percentage}%` : value}
        </span>
        <span className="text-xs text-muted-foreground">
          {value}{unit} / {max}{unit}
        </span>
      </div>

      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors.bg)}
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 10px currentColor`,
          }}
        />
      </div>
    </div>
  );
};

interface PerformanceMetricsPanelProps {
  gpuUtilization: number;
  vramUsed: number;
  vramTotal: number;
  temperature: number;
  maxTemperature: number;
  powerDraw: number;
  maxPower: number;
}

export const PerformanceMetricsPanel = ({
  gpuUtilization,
  vramUsed,
  vramTotal,
  temperature,
  maxTemperature,
  powerDraw,
  maxPower,
}: PerformanceMetricsPanelProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={<Cpu className="w-4 h-4" />}
        label="GPU Utilization"
        value={gpuUtilization}
        max={100}
        unit="%"
        showPercentage={false}
      />
      <MetricCard
        icon={<HardDrive className="w-4 h-4" />}
        label="VRAM Usage"
        value={vramUsed}
        max={vramTotal}
        unit="GB"
      />
      <MetricCard
        icon={<Thermometer className="w-4 h-4" />}
        label="Temperature"
        value={temperature}
        max={maxTemperature}
        unit="°C"
        showPercentage={false}
      />
      <MetricCard
        icon={<Zap className="w-4 h-4" />}
        label="Power Draw"
        value={powerDraw}
        max={maxPower}
        unit="W"
        showPercentage={false}
      />
    </div>
  );
};

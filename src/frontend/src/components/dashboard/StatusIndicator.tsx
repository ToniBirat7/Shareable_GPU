import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "active" | "inactive" | "warning";
  label?: string;
  showSignalBars?: boolean;
  signalStrength?: number; // 0-4
  className?: string;
}

export const StatusIndicator = ({
  status,
  label,
  showSignalBars = false,
  signalStrength = 4,
  className,
}: StatusIndicatorProps) => {
  const statusStyles = {
    active: "bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]",
    inactive: "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.6)]",
    warning: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
  };

  const statusLabels = {
    active: "Node Active",
    inactive: "Offline",
    warning: "Degraded",
  };

  const barColors = {
    active: "bg-emerald-400",
    inactive: "bg-destructive",
    warning: "bg-amber-400",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-full",
        "bg-muted/30 backdrop-blur-md border border-border/50",
        "hover:border-border transition-all duration-200",
        className
      )}
    >
      {/* Pulsing status dot */}
      <div className="relative">
        <div className={cn("w-2.5 h-2.5 rounded-full", statusStyles[status])} />
        <div
          className={cn(
            "absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75",
            status === "active" && "bg-emerald-400",
            status === "inactive" && "bg-destructive",
            status === "warning" && "bg-amber-400"
          )}
        />
      </div>

      {/* Status label */}
      <span className="text-sm font-medium text-foreground">
        {label || statusLabels[status]}
      </span>

      {/* Signal strength bars */}
      {showSignalBars && (
        <div className="flex gap-0.5 items-end h-4">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={cn(
                "w-1 rounded-sm transition-all duration-200",
                bar <= signalStrength
                  ? barColors[status]
                  : "bg-muted-foreground/30"
              )}
              style={{ height: `${bar * 3 + 2}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

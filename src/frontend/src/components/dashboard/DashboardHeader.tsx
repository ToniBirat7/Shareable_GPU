import { StatusIndicator } from "./StatusIndicator";
import { Cpu } from "lucide-react";

interface DashboardHeaderProps {
  isOnline: boolean;
  signalStrength?: number;
}

export const DashboardHeader = ({
  isOnline,
  signalStrength = 4,
}: DashboardHeaderProps) => {
  return (
    <header className="glass-card p-6 mb-6 border-gradient">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Logo and branding */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 glow-primary">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-primary/10 blur-lg -z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gradient-primary">
              DSCP Protocol
            </h1>
            <p className="text-sm text-muted-foreground">
              Distributed Training Infrastructure
            </p>
          </div>
        </div>

        {/* Global status indicator */}
        <StatusIndicator
          status={isOnline ? "active" : "inactive"}
          showSignalBars
          signalStrength={signalStrength}
        />
      </div>
    </header>
  );
};

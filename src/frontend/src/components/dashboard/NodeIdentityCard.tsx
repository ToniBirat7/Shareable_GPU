import { useState } from "react";
import { Copy, Check, Cpu, Wifi, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NodeIdentityCardProps {
  peerId: string;
  deviceName: string;
  accelerationEnabled: boolean;
  localIp: string;
  uptime: string;
}

export const NodeIdentityCard = ({
  peerId,
  deviceName,
  accelerationEnabled,
  localIp,
  uptime,
}: NodeIdentityCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card card-interactive p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Node Identity</h2>
          <p className="text-sm text-muted-foreground">Local node information</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Peer ID */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Peer ID
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted/50 rounded-lg px-4 py-3 border border-border/50 overflow-hidden">
              <code className="font-mono text-sm text-foreground/90 truncate block">
                {peerId}
              </code>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0 border-border/50 hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Device info grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Device Name */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Device</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">{deviceName}</p>
          </div>

          {/* Acceleration Status */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Acceleration</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  accelerationEnabled
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                    : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  accelerationEnabled ? "text-emerald-400" : "text-destructive"
                )}
              >
                {accelerationEnabled ? "CUDA Enabled" : "CPU Mode"}
              </span>
            </div>
          </div>

          {/* Local IP */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Local IP</span>
            </div>
            <code className="text-sm font-mono text-foreground">{localIp}</code>
          </div>

          {/* Uptime */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Uptime</span>
            </div>
            <p className="text-sm font-medium text-foreground">{uptime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

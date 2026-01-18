import { useState } from "react";
import { Play, Pause, TrendingDown, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface ComputeActivityCardProps {
  isTraining: boolean;
  lossData: { step: number; loss: number }[];
  currentEpoch: number;
  currentStep: number;
  lastSyncTime: string;
  onToggleTraining: () => void;
}

export const ComputeActivityCard = ({
  isTraining,
  lossData,
  currentEpoch,
  currentStep,
  lastSyncTime,
  onToggleTraining,
}: ComputeActivityCardProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center border",
              isTraining
                ? "bg-primary/20 border-primary/30"
                : "bg-muted/30 border-border/30"
            )}
          >
            {isTraining ? (
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            ) : (
              <Play className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Compute Activity
            </h2>
            <p className="text-sm text-muted-foreground">
              {isTraining ? "Training in progress" : "Waiting for training sequence..."}
            </p>
          </div>
        </div>

        <Button
          onClick={onToggleTraining}
          className={cn(
            "gap-2 transition-all duration-300",
            isTraining
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
              : "bg-primary hover:bg-primary/90 glow-primary text-primary-foreground"
          )}
        >
          {isTraining ? (
            <>
              <Pause className="w-4 h-4" />
              Pause Contribution
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Join Training Swarm
            </>
          )}
        </Button>
      </div>

      {isTraining ? (
        <>
          {/* Training metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4 border border-border/30 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Current Loss</span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {lossData.length > 0
                  ? lossData[lossData.length - 1].loss.toFixed(4)
                  : "—"}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-border/30 text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Epoch / Step
              </span>
              <p className="text-2xl font-bold text-foreground tabular-nums mt-1">
                {currentEpoch} / {currentStep}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-border/30 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <RefreshCw className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Last Sync</span>
              </div>
              <p className="text-lg font-medium text-foreground">{lastSyncTime}</p>
            </div>
          </div>

          {/* Loss chart */}
          <div className="h-48 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lossData}>
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="step"
                  stroke="hsl(240, 5%, 35%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(240, 5%, 35%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tickFormatter={(v) => v.toFixed(2)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240, 10%, 8%)",
                    border: "1px solid hsl(240, 5%, 18%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(0, 0%, 60%)" }}
                  itemStyle={{ color: "hsl(263, 70%, 60%)" }}
                />
                <Area
                  type="monotone"
                  dataKey="loss"
                  stroke="hsl(263, 70%, 55%)"
                  strokeWidth={2}
                  fill="url(#lossGradient)"
                  style={{
                    filter: "drop-shadow(0 0 6px hsl(263, 70%, 50%))",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        /* Idle state */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/30 border border-border/30 flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground mb-2">
            Your node is ready to contribute to distributed training
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Est. ~2.4 TFLOPs contribution</span>
            <span>•</span>
            <span>12 active training jobs available</span>
          </div>
        </div>
      )}
    </div>
  );
};

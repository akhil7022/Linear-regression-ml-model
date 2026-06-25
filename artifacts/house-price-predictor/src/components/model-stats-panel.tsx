import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ModelStats } from "@workspace/api-client-react";

interface ModelStatsPanelProps {
  stats?: ModelStats;
  isLoading: boolean;
  isError: boolean;
}

export function ModelStatsPanel({ stats, isLoading, isError }: ModelStatsPanelProps) {
  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-6 text-destructive font-mono text-sm">
          Failed to load model statistics.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-lg flex-1">
      <CardHeader className="border-b border-border pb-4 bg-muted/20">
        <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground uppercase flex items-center justify-between">
          <span>Model Diagnostics</span>
          {stats && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">N={stats.sampleSize}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading || !stats ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-sm">
            <StatRow label="R²" value={stats.rSquared.toFixed(4)} />
            <StatRow label="Adj R²" value={stats.adjustedRSquared.toFixed(4)} />
            <StatRow label="RMSE" value={`$${stats.rmse.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
            <StatRow label="MAE" value={`$${stats.mae.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
            
            <div className="col-span-2 pt-4 border-t border-border mt-2">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Coefficients</div>
              <div className="space-y-2">
                <StatRow label="Intercept" value={stats.intercept.toFixed(2)} />
                {stats.featureNames.map((name, i) => (
                  <StatRow key={name} label={name} value={stats.coefficients[i].toFixed(2)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground capitalize">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

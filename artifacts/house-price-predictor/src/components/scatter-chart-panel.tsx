import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ZAxis
} from "recharts";
import type { House, ModelStats } from "@workspace/api-client-react";

interface ScatterChartPanelProps {
  houses?: House[];
  modelStats?: ModelStats;
  isLoading: boolean;
  isError: boolean;
}

export function ScatterChartPanel({ houses, modelStats, isLoading, isError }: ScatterChartPanelProps) {
  
  const chartData = useMemo(() => {
    if (!houses || !modelStats) return [];
    
    // Calculate predicted price for each house in the dataset
    // Intercept + (sqft * coef[0]) + (beds * coef[1]) + (baths * coef[2])
    const [sqftCoef, bedCoef, bathCoef] = modelStats.coefficients;
    const intercept = modelStats.intercept;

    return houses.map(h => {
      const predictedPrice = intercept + (h.sqft * sqftCoef) + (h.bedrooms * bedCoef) + (h.bathrooms * bathCoef);
      return {
        x: h.price, // Actual Price
        y: predictedPrice, // Predicted Price
        bedrooms: h.bedrooms,
        id: h.id
      };
    });
  }, [houses, modelStats]);

  const maxPrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    const maxActual = Math.max(...chartData.map(d => d.x));
    const maxPredicted = Math.max(...chartData.map(d => d.y));
    return Math.max(maxActual, maxPredicted);
  }, [chartData]);

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 h-[400px]">
        <CardContent className="p-6 text-destructive font-mono text-sm h-full flex items-center justify-center">
          Failed to load dataset for visualization.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-lg flex-1 min-h-[400px] flex flex-col">
      <CardHeader className="border-b border-border pb-4 bg-muted/20">
        <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-3">
          Model Accuracy 
          <span className="text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground font-normal">Actual vs Predicted Price</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-1 relative">
        {isLoading || !houses || !modelStats ? (
          <Skeleton className="w-full h-full absolute inset-0 m-5" />
        ) : (
          <div className="w-full h-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Actual Price" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'monospace' }}
                  domain={[0, maxPrice]}
                  tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Predicted Price" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                  domain={[0, maxPrice]}
                />
                <ZAxis type="number" dataKey="bedrooms" range={[40, 100]} name="Bedrooms" />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const diff = data.y - data.x;
                      return (
                        <div className="bg-card border border-border p-3 shadow-lg rounded text-sm font-mono">
                          <div className="text-muted-foreground mb-1">House #{data.id}</div>
                          <div className="text-foreground">Actual: <span className="font-bold">${data.x.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                          <div className="text-primary">Predicted: <span className="font-bold">${data.y.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                          <div className={diff > 0 ? "text-secondary mt-1 text-xs" : "text-destructive mt-1 text-xs"}>
                            Diff: {diff > 0 ? "+" : ""}{diff.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  segment={[{ x: 0, y: 0 }, { x: maxPrice, y: maxPrice }]} 
                  stroke="hsl(var(--secondary))" 
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <Scatter name="Houses" data={chartData} fill="hsl(var(--primary))" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

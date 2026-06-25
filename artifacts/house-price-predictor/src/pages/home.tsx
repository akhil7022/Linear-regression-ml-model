import React from "react";
import { 
  useGetHouses, 
  useGetModel, 
  usePredictPrice 
} from "@workspace/api-client-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PredictionPanel } from "@/components/prediction-panel";
import { ModelStatsPanel } from "@/components/model-stats-panel";
import { ScatterChartPanel } from "@/components/scatter-chart-panel";
import { DatasetTablePanel } from "@/components/dataset-table-panel";

export default function Home() {
  const { data: houses, isLoading: loadingHouses, error: errorHouses } = useGetHouses();
  const { data: modelStats, isLoading: loadingModel, error: errorModel } = useGetModel();
  
  const predictPriceMutation = usePredictPrice();

  const isLoading = loadingHouses || loadingModel;
  const isError = errorHouses || errorModel;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 min-h-full">
        {/* Left Column - Actions & Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PredictionPanel 
            mutation={predictPriceMutation} 
          />
          <ModelStatsPanel 
            stats={modelStats} 
            isLoading={isLoading} 
            isError={!!isError} 
          />
        </div>

        {/* Right Column - Visualizations & Data */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ScatterChartPanel 
            houses={houses} 
            modelStats={modelStats}
            isLoading={isLoading} 
            isError={!!isError} 
          />
          <DatasetTablePanel 
            houses={houses} 
            isLoading={isLoading} 
            isError={!!isError} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

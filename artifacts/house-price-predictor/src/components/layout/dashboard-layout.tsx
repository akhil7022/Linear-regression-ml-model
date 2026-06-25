import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col font-sans">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-mono font-bold text-primary-foreground text-xs shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            HPP
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm tracking-wide">HOUSE PRICE PREDICTOR</h1>
            <p className="text-muted-foreground text-xs font-mono uppercase">Linear Regression Model v1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            SYSTEM ACTIVE
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

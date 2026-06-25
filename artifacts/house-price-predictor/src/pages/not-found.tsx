import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex items-center justify-center font-mono">
      <Card className="w-full max-w-md mx-4 border-border bg-card shadow-lg">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="text-6xl font-bold text-destructive mb-4 tracking-tighter">
            404
          </div>
          <h1 className="text-lg font-medium text-foreground tracking-widest uppercase mb-2">
            Signal Lost
          </h1>
          <p className="text-sm text-muted-foreground">
            The requested coordinate could not be located in the current space.
          </p>
          <a 
            href="/" 
            className="mt-8 text-xs text-primary uppercase tracking-widest hover:text-primary/80 transition-colors"
          >
            [ Return to Base ]
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

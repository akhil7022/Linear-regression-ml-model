import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PredictPriceMutationResult } from "@workspace/api-client-react";

const formSchema = z.object({
  sqft: z.coerce.number().min(100).max(20000),
  bedrooms: z.coerce.number().min(1).max(20),
  bathrooms: z.coerce.number().min(1).max(20),
});

type FormValues = z.infer<typeof formSchema>;

export function PredictionPanel({ mutation }: { mutation: any }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sqft: 2000,
      bedrooms: 3,
      bathrooms: 2,
    },
  });

  function onSubmit(data: FormValues) {
    mutation.mutate({ data });
  }

  const result: PredictPriceMutationResult | undefined = mutation.data;

  return (
    <Card className="border-border bg-card shadow-lg flex flex-col">
      <CardHeader className="border-b border-border pb-4 bg-muted/20">
        <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground uppercase">
          Prediction Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-1 flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sqft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-mono text-muted-foreground">SQFT</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        className="font-mono text-sm bg-background border-border focus-visible:ring-primary" 
                        data-testid="input-sqft"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-mono text-muted-foreground">BEDS</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        className="font-mono text-sm bg-background border-border focus-visible:ring-primary" 
                        data-testid="input-bedrooms"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-mono text-muted-foreground">BATHS</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        className="font-mono text-sm bg-background border-border focus-visible:ring-primary" 
                        data-testid="input-bathrooms"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full font-mono uppercase tracking-widest text-xs" 
              disabled={mutation.isPending}
              data-testid="button-predict"
            >
              {mutation.isPending ? "COMPUTING..." : "RUN PREDICTION"}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-background rounded border border-border p-4">
              <div className="text-xs font-mono text-muted-foreground mb-1 uppercase">Estimated Value</div>
              <div className="text-4xl font-mono font-bold text-primary tracking-tight" data-testid="text-predicted-price">
                ${result.predictedPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs font-mono text-muted-foreground uppercase">Breakdown</div>
              <div className="space-y-2">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm font-mono" data-testid={`row-breakdown-${item.feature}`}>
                    <span className="text-muted-foreground capitalize">{item.feature}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs opacity-50">
                        {item.coefficient > 0 ? "+" : ""}{item.coefficient.toFixed(2)} × {item.value}
                      </span>
                      <span className={item.contribution >= 0 ? "text-secondary" : "text-destructive"}>
                        {item.contribution >= 0 ? "+" : "-"}${Math.abs(item.contribution).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

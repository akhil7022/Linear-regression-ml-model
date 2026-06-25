import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { House } from "@workspace/api-client-react";

interface DatasetTablePanelProps {
  houses?: House[];
  isLoading: boolean;
  isError: boolean;
}

export function DatasetTablePanel({ houses, isLoading, isError }: DatasetTablePanelProps) {
  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-6 text-destructive font-mono text-sm">
          Failed to load dataset.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-lg flex-1 overflow-hidden flex flex-col">
      <CardHeader className="border-b border-border pb-4 bg-muted/20">
        <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground uppercase">
          Training Dataset
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-[400px]">
        {isLoading || !houses ? (
          <div className="p-5 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table className="font-mono text-sm">
            <TableHeader className="bg-background sticky top-0 z-10 border-b border-border">
              <TableRow>
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">SQFT</TableHead>
                <TableHead className="text-muted-foreground text-right">BEDS</TableHead>
                <TableHead className="text-muted-foreground text-right">BATHS</TableHead>
                <TableHead className="text-primary text-right">PRICE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houses.map((house) => (
                <TableRow key={house.id} className="border-b border-border hover:bg-muted/10">
                  <TableCell className="text-muted-foreground">#{house.id}</TableCell>
                  <TableCell>{house.sqft}</TableCell>
                  <TableCell className="text-right">{house.bedrooms}</TableCell>
                  <TableCell className="text-right">{house.bathrooms}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    ${house.price.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

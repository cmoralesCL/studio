'use client';

import React from 'react';
import type { KeyResult } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface OkrProgressChartProps {
  keyResults: KeyResult[];
  objectiveTitle: string;
}

export function OkrProgressChart({ keyResults, objectiveTitle }: OkrProgressChartProps) {
  if (!keyResults || keyResults.length === 0) {
    return null; 
  }

  const chartData = keyResults.map(kr => ({
    name: kr.title.length > 20 ? kr.title.substring(0, 17) + '...' : kr.title, // Truncate long names
    progress: kr.targetValue > 0 ? Math.min(Math.max((kr.currentValue / kr.targetValue) * 100, 0), 100) : (kr.currentValue > 0 ? 100 : 0),
    currentValue: kr.currentValue,
    targetValue: kr.targetValue,
    unit: kr.unit,
  }));

  const chartConfig = {
    progress: {
      label: "Progress (%)",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;


  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Key Results Progress Overview</CardTitle>
        <CardDescription>For objective: {objectiveTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={Math.max(200, keyResults.length * 50)}>
            <BarChart data={chartData} layout="vertical" margin={{ right: 30, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150} 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-1.5">
                           <span className="text-sm font-semibold">{data.name}</span>
                           <span className="text-xs text-muted-foreground">
                             Progress: {data.progress.toFixed(1)}%
                           </span>
                           <span className="text-xs text-muted-foreground">
                             {data.currentValue.toLocaleString()} / {data.targetValue.toLocaleString()} {data.unit}
                           </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="progress" fill="var(--color-progress)" radius={4} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

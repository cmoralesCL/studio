
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer }
from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { BarChart, PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import type { SummaryCardData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OkrOverallSummaryProps {
  summaryData: SummaryCardData[];
}

const OkrOverallSummary: React.FC<OkrOverallSummaryProps> = ({ summaryData }) => {
  
  const renderCardContent = (card: SummaryCardData) => {
    const chartConfig: ChartConfig = {
      value: {
        label: card.title,
        color: `hsl(var(--${card.variant}))`,
      },
    };
    if (card.type === 'circular-progress' && card.progress !== undefined) {
      const data = [{ name: card.title, value: card.progress, fill: `hsl(var(--${card.variant}))` }];
      return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="85%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: 'hsl(var(--muted))' }} cornerRadius={5} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold fill-foreground">
                {typeof card.value === 'number' ? card.value.toFixed(0) : card.value}
                {card.unit === '%' ? '%' : ''}
              </text>
               {card.unit && card.unit !== '%' && (
                <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-muted-foreground">
                  {card.unit}
                </text>
              )}
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className={cn("text-4xl font-bold", `text-${card.variant}`)}>{card.value}</div>
        {card.unit && <div className="text-sm text-muted-foreground mt-1">{card.unit}</div>}
      </div>
    );
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {summaryData.map((card) => (
        <Card key={card.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            {/* Optional: Icon can go here */}
          </CardHeader>
          <CardContent className="h-[120px] p-2"> {/* Fixed height for consistency */}
            {renderCardContent(card)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OkrOverallSummary;

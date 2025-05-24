
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import type { SummaryCardData, SummaryItem, OkrIcon, SummaryItemVariant } from '@/lib/types';
import { cn } from '@/lib/utils';
import { 
  Heart, Zap, Target, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, 
  BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck,
  CheckCircle2, AlertTriangle, CalendarClock, ListTodo
} from 'lucide-react';

// Icon map for SummaryItem icons
const iconComponents: Record<OkrIcon, React.ElementType> = {
  Heart, Zap, Target, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, 
  BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck,
  CheckCircle2, AlertTriangle, CalendarClock, ListTodo
};

interface OkrOverallSummaryProps {
  summaryData: SummaryCardData[];
}

const getVariantClass = (variant?: SummaryItemVariant): string => {
  switch (variant) {
    case 'success': return 'text-accent'; // accent is green in theme
    case 'warning': return 'text-yellow-500 dark:text-yellow-400'; // Direct tailwind color
    case 'danger': return 'text-destructive';
    case 'primary': return 'text-primary';
    case 'accent': return 'text-accent';
    case 'muted': return 'text-muted-foreground';
    default: return 'text-foreground';
  }
};


const OkrOverallSummary: React.FC<OkrOverallSummaryProps> = ({ summaryData }) => {
  
  const renderCircularProgress = (card: SummaryCardData) => {
    const chartConfig: ChartConfig = {
      value: {
        label: card.title,
        color: card.progressVariant ? `hsl(var(--${card.progressVariant}))` : `hsl(var(--primary))`,
      },
    };
    const data = [{ name: card.title, value: card.progressPercent ?? 0, fill: card.progressVariant ? `hsl(var(--${card.progressVariant}))` : `hsl(var(--primary))` }];
    
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
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className={cn("text-xl font-bold", getVariantClass(card.progressVariant))}>
              {card.progressValue?.toFixed(0) ?? '0'}
              {card.progressUnit === '%' ? '%' : ''}
            </text>
             {card.progressUnit && card.progressUnit !== '%' && (
              <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-muted-foreground">
                {card.progressUnit}
              </text>
            )}
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  const renderDetailedList = (card: SummaryCardData) => {
    return (
      <div className="space-y-2.5 h-full flex flex-col justify-center">
        {card.items?.map((item) => {
          const IconComponent = item.icon ? iconComponents[item.icon] : null;
          return (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {IconComponent && <IconComponent className={cn("h-4 w-4 mr-2", getVariantClass(item.variant))} />}
                <span className={cn(getVariantClass(item.variant === 'default' || !item.variant ? 'muted' : 'default'))}>{item.label}:</span>
              </div>
              <span className={cn("font-medium", getVariantClass(item.variant))}>
                {item.value} {item.unit && <span className="text-xs text-muted-foreground ml-0.5">{item.unit}</span>}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {summaryData.map((card) => (
        <Card key={card.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", card.cardVariant === 'primary' ? 'text-primary' : 'text-muted-foreground')}>
              {card.title}
            </CardTitle>
            {/* Optional: Icon for card title can go here, e.g., based on card.cardVariant */}
          </CardHeader>
          <CardContent className="h-[120px] p-3"> {/* Standardized padding, ensure content fits */}
            {card.type === 'circular-progress' && renderCircularProgress(card)}
            {card.type === 'detailed-list' && renderDetailedList(card)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OkrOverallSummary;

'use client';

import React from 'react';
import type { Objective } from '@/lib/types';
import { OkrCard } from './OkrCard';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OkrListProps {
  objectives: Objective[];
  onUpdateKeyResult: (objectiveId: string, krId: string, newCurrentValue: number) => void;
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void;
}

const getLifeOkrCategory = (description?: string): string => {
  if (!description) return "Otros Objetivos"; // Default category
  const match = description.match(/Ámbito de Vida: (.*?)\./i); // Case-insensitive match
  if (match && match[1]) {
    return match[1].trim();
  }
  return "Otros Objetivos"; // Default if pattern not found
};

const calculateAreaOkrProgress = (objective: Objective): number => {
  if (objective.keyResults.length === 0) return 0;
  const totalProgress = objective.keyResults.reduce((sum, kr) => {
    const krProgress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : (kr.currentValue > 0 ? 100 : 0);
    return sum + Math.min(Math.max(krProgress, 0), 100);
  }, 0);
  return totalProgress / objective.keyResults.length;
};


export function OkrList({ objectives, onUpdateKeyResult, onDeleteObjective, onEditObjective }: OkrListProps) {
  if (objectives.length === 0) {
    return (
      <div className="text-center py-10">
        <img src="https://picsum.photos/seed/emptyOKR/300/200" alt="No OKRs yet" className="mx-auto mb-4 rounded-md shadow-md" data-ai-hint="empty state illustration"/>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Objectives Yet</h2>
        <p className="text-muted-foreground mt-2">Start by adding your first objective and key results!</p>
      </div>
    );
  }

  const groupedByLifeOkr: { [category: string]: Objective[] } = objectives.reduce((acc, obj) => {
    const category = getLifeOkrCategory(obj.description);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(obj);
    return acc;
  }, {} as { [category: string]: Objective[] });

  // Define a preferred order for Life OKR categories
  const preferredOrder = [
    "Bienestar Físico y Mental",
    "Desarrollo Profesional y Carrera",
    "Finanzas Personales",
    "Relaciones Interpersonales",
    "Crecimiento Personal y Contribución",
    "Otros Objetivos" // Ensure "Otros Objetivos" is last or handled appropriately
  ];

  const sortedLifeOkrCategories = Object.keys(groupedByLifeOkr).sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b); // Both not in preferred, sort alphabetically
    if (indexA === -1) return 1; // a is not in preferred, b is; b comes first
    if (indexB === -1) return -1; // b is not in preferred, a is; a comes first
    return indexA - indexB; // Both in preferred, sort by preferred order
  });


  return (
    <div className="space-y-12">
      {sortedLifeOkrCategories.map(category => {
        const areaOkrs = groupedByLifeOkr[category];
        if (!areaOkrs || areaOkrs.length === 0) return null;

        const lifeOkrTotalProgress = areaOkrs.reduce((sum, areaOkr) => {
          return sum + calculateAreaOkrProgress(areaOkr);
        }, 0);
        const lifeOkrAverageProgress = areaOkrs.length > 0 ? lifeOkrTotalProgress / areaOkrs.length : 0;

        return (
          <Card key={category} className="overflow-hidden shadow-xl">
            <CardHeader className="bg-primary/10 dark:bg-primary/20">
              <CardTitle className="text-2xl font-bold text-primary">{category}</CardTitle>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">Progreso General del Ámbito</span>
                  <span className="text-sm font-semibold text-primary">{lifeOkrAverageProgress.toFixed(1)}%</span>
                </div>
                <Progress value={lifeOkrAverageProgress} className="h-3" indicatorClassName={lifeOkrAverageProgress === 100 ? "bg-accent" : "bg-primary"} />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {areaOkrs.map(objective => (
                <OkrCard 
                  key={objective.id} 
                  objective={objective} 
                  onUpdateKeyResult={onUpdateKeyResult}
                  onDeleteObjective={onDeleteObjective}
                  onEditObjective={onEditObjective}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

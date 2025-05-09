'use client';

import React from 'react';
import type { Objective } from '@/lib/types';
import { OkrCard } from './OkrCard';

interface OkrListProps {
  objectives: Objective[];
  onUpdateKeyResult: (objectiveId: string, krId: string, newCurrentValue: number) => void;
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void;
}

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

  return (
    <div className="space-y-8">
      {objectives.map(objective => (
        <OkrCard 
          key={objective.id} 
          objective={objective} 
          onUpdateKeyResult={onUpdateKeyResult}
          onDeleteObjective={onDeleteObjective}
          onEditObjective={onEditObjective}
        />
      ))}
    </div>
  );
}

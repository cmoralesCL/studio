
'use client';

import React from 'react';
import type { Objective } from '@/lib/types';
import { OkrCard } from './OkrCard';
// Icons and category logic are removed as the new design is a flat list of objectives

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
        <img 
          src="https://picsum.photos/seed/emptyOKR/300/200" 
          alt="No OKRs yet" 
          className="mx-auto mb-4 rounded-md shadow-md" 
          data-ai-hint="empty state illustration"
          width={300}
          height={200}
        />
        <h2 className="text-2xl font-semibold text-foreground">No Objectives Yet</h2>
        <p className="text-muted-foreground mt-2">Start by adding your first objective and key results!</p>
      </div>
    );
  }

  // The new design seems to be a flat list of objectives, not grouped by Life OKR categories in large cards.
  // If grouping is still desired but styled differently, this logic would need to adapt.
  // For now, rendering a simple list of OkrCards.
  return (
    <div className="space-y-6">
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

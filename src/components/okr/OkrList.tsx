'use client';

import React from 'react';
import type { LifeOkr } from '@/lib/types'; // Updated to LifeOkr
import { OkrCard } from './OkrCard';


interface OkrListProps {
  lifeOkrs: LifeOkr[]; // Changed from objectives to lifeOkrs
  onUpdateKeyResult: (lifeOkrId: string, areaOkrId: string, krId: string, newCurrentValue: number) => void; // Updated signature
  onDeleteLifeOkr: (lifeOkrId: string) => void; // Changed from onDeleteObjective
  onEditLifeOkr: (lifeOkr: LifeOkr) => void; // Changed from onEditObjective
}

export function OkrList({ lifeOkrs, onUpdateKeyResult, onDeleteLifeOkr, onEditLifeOkr }: OkrListProps) {
  if (lifeOkrs.length === 0) {
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
        <h2 className="text-2xl font-semibold text-foreground">No Life OKRs Yet</h2>
        <p className="text-muted-foreground mt-2">Start by adding your first Life OKR, its Area OKRs, and Habit OKRs!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {lifeOkrs.map(lifeOkr => ( // Changed from objective to lifeOkr
        <OkrCard 
          key={lifeOkr.id} 
          lifeOkr={lifeOkr} // Pass lifeOkr
          onUpdateKeyResult={onUpdateKeyResult}
          onDeleteLifeOkr={onDeleteLifeOkr} // Pass renamed prop
          onEditLifeOkr={onEditLifeOkr} // Pass renamed prop
        />
      ))}
    </div>
  );
}
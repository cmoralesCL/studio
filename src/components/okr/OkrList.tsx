
'use client';

import React from 'react';
import type { LifeOkr, AreaOkr, KeyResult } from '@/lib/types'; // Updated to LifeOkr
import { OkrCard } from './OkrCard';


interface OkrListProps {
  lifeOkrs: LifeOkr[];
  onUpdateKeyResult: (lifeOkrId: string, areaOkrId: string, krId: string, newCurrentValue: number) => void;
  onDeleteLifeOkr: (lifeOkrId: string) => void;
  onEditLifeOkr: (lifeOkr: LifeOkr) => void;
  onEditAreaOkr: (areaOkr: AreaOkr, lifeOkrId: string) => void;
  onEditKeyResult: (keyResult: KeyResult, areaOkrId: string, lifeOkrId: string) => void;
}

export function OkrList({ lifeOkrs, onUpdateKeyResult, onDeleteLifeOkr, onEditLifeOkr, onEditAreaOkr, onEditKeyResult }: OkrListProps) {
  if (lifeOkrs.length === 0) {
    return (
      <div className="text-center py-10">
        <img 
          src="https://placehold.co/300x200.png" 
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
      {lifeOkrs.map(lifeOkr => ( 
        <OkrCard 
          key={lifeOkr.id} 
          lifeOkr={lifeOkr} 
          onUpdateKeyResult={onUpdateKeyResult}
          onDeleteLifeOkr={onDeleteLifeOkr} 
          onEditLifeOkr={onEditLifeOkr} 
          onEditAreaOkr={onEditAreaOkr}
          onEditKeyResult={onEditKeyResult}
        />
      ))}
    </div>
  );
}

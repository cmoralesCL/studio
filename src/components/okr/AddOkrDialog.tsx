
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OkrForm } from './OkrForm';
import type { LifeOkrFormData, LifeOkr } from '@/lib/types'; 

interface AddOkrDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddObjective: (data: LifeOkrFormData) => Promise<void>;
  onUpdateObjective?: (data: LifeOkrFormData) => Promise<void>; // For editing
  initialData?: LifeOkr; // For pre-filling the form in edit mode
  isEditMode?: boolean; // To determine mode
  isLoading?: boolean;
}

export function AddOkrDialog({ 
  isOpen, 
  onOpenChange, 
  onAddObjective, 
  onUpdateObjective,
  initialData,
  isEditMode,
  isLoading 
}: AddOkrDialogProps) {
  
  const handleSubmit = async (data: LifeOkrFormData) => {
    if (isEditMode && onUpdateObjective && initialData) {
      await onUpdateObjective(data);
    } else {
      await onAddObjective(data);
    }
    // Dialog closing is handled by parent now, after add/update
  };

  const dialogTitle = isEditMode ? "Edit Life OKR" : "Add New Life OKR";
  const dialogDescription = isEditMode 
    ? "Modify the details of your Life OKR, its Area OKRs, and their Key Results."
    : "Define your Life OKR, its Area OKRs, and their corresponding Habit OKRs (Key Results).";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        // Reset edit mode if dialog is closed, parent should also handle this
      }
    }}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <OkrForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)} 
            isLoading={isLoading}
            initialData={initialData} // Pass initialData to OkrForm
            // OkrForm's submit button text will also be dynamic via its own `initialData` check
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

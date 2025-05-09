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
import type { LifeOkrFormData } from '@/lib/types'; // Updated to LifeOkrFormData

interface AddOkrDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddObjective: (data: LifeOkrFormData) => Promise<void>; // Changed data type
  isLoading?: boolean;
}

export function AddOkrDialog({ isOpen, onOpenChange, onAddObjective, isLoading }: AddOkrDialogProps) {
  
  const handleSubmit = async (data: LifeOkrFormData) => { // Changed data type
    await onAddObjective(data);
    // onOpenChange(false); // Optionally close dialog on successful submission, handled by parent now
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col"> {/* Increased width */}
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Life OKR</DialogTitle>
          <DialogDescription>
            Define your Life OKR, its Area OKRs, and their corresponding Habit OKRs (Key Results).
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          {/* OkrForm needs significant updates to handle LifeOkrFormData correctly. 
              For now, this dialog passes the correct types, but OkrForm will use a simplified model.
          */}
          <OkrForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)} 
            isLoading={isLoading} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
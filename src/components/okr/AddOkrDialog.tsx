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
import type { ObjectiveFormData } from '@/lib/types';

interface AddOkrDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddObjective: (data: ObjectiveFormData) => Promise<void>; // Make it async if needed
  isLoading?: boolean;
}

export function AddOkrDialog({ isOpen, onOpenChange, onAddObjective, isLoading }: AddOkrDialogProps) {
  
  const handleSubmit = async (data: ObjectiveFormData) => {
    await onAddObjective(data);
    // onOpenChange(false); // Optionally close dialog on successful submission, handled by parent now
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Objective</DialogTitle>
          <DialogDescription>
            Define your objective and its key results. Use AI to get suggestions for key results.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <OkrForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

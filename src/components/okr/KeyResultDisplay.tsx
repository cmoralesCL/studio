'use client';

import React, { useState, useEffect } from 'react';
import type { KeyResult } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Edit3, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyResultDisplayProps {
  keyResult: KeyResult;
  onUpdateKeyResult: (objectiveId: string, krId: string, newCurrentValue: number) => void;
  objectiveId: string; // Needed to identify which objective this KR belongs to
}

export function KeyResultDisplay({ keyResult, onUpdateKeyResult, objectiveId }: KeyResultDisplayProps) {
  const [currentValueInput, setCurrentValueInput] = useState(keyResult.currentValue.toString());
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setCurrentValueInput(keyResult.currentValue.toString());
  }, [keyResult.currentValue]);

  const progressPercentage = keyResult.targetValue > 0 
    ? Math.min(Math.max((keyResult.currentValue / keyResult.targetValue) * 100, 0), 100) 
    : keyResult.currentValue > 0 ? 100 : 0; // if target is 0, any current value > 0 is 100%

  const handleUpdate = () => {
    const newCurrentValue = parseFloat(currentValueInput);
    if (!isNaN(newCurrentValue)) {
      onUpdateKeyResult(objectiveId, keyResult.id, newCurrentValue);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValueInput(e.target.value);
  };
  
  const handleEditToggle = () => {
    if (isEditing) { // If cancelling edit
      setCurrentValueInput(keyResult.currentValue.toString()); // Reset input to original value
    }
    setIsEditing(!isEditing);
  };

  const progressColor = progressPercentage === 100 ? 'bg-accent' : 'bg-primary';

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow duration-200 space-y-3">
      <h4 className="font-semibold text-md text-foreground">{keyResult.title}</h4>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Progress</span>
          <span className={cn("font-medium", progressPercentage === 100 ? "text-accent" : "text-primary")}>
            {keyResult.currentValue.toLocaleString()} / {keyResult.targetValue.toLocaleString()} ({keyResult.unit})
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" indicatorClassName={progressColor} />
        {progressPercentage === 100 && (
            <div className="flex items-center text-sm text-accent mt-1">
                <Check className="h-4 w-4 mr-1" />
                <span>Completed!</span>
            </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Label htmlFor={`kr-update-${keyResult.id}`} className="text-sm font-medium">Update Current Value:</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              id={`kr-update-${keyResult.id}`}
              value={currentValueInput}
              onChange={handleInputChange}
              className="flex-grow"
              aria-label={`Update current value for ${keyResult.title}`}
            />
            <Button onClick={handleUpdate} size="icon" variant="outline" aria-label="Save progress">
              <Save className="h-4 w-4" />
            </Button>
            <Button onClick={handleEditToggle} size="icon" variant="ghost" aria-label="Cancel edit">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={handleEditToggle} variant="outline" size="sm" className="w-full md:w-auto">
          <Edit3 className="mr-2 h-4 w-4" /> Update Progress
        </Button>
      )}
    </div>
  );
}

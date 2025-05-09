
'use client';

import React, { useState, useEffect } from 'react';
import type { KeyResult } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Edit3, Save, X, CalendarClock, AlertTriangle, CalendarDays, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format, isPast } from 'date-fns';


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
    : keyResult.currentValue > 0 ? 100 : 0; 

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
    if (isEditing) { 
      setCurrentValueInput(keyResult.currentValue.toString()); 
    }
    setIsEditing(!isEditing);
  };

  const progressColor = progressPercentage === 100 ? 'bg-accent' : 'bg-primary';

  const formattedLastUpdated = keyResult.lastUpdated 
    ? format(new Date(keyResult.lastUpdated), "MMM dd, yyyy HH:mm")
    : 'N/A';
  
  const formattedTargetDate = keyResult.targetDate
    ? format(new Date(keyResult.targetDate), "MMM dd, yyyy")
    : null;

  const isOverdue = keyResult.targetDate && isPast(new Date(keyResult.targetDate)) && progressPercentage < 100;

  return (
    <TooltipProvider>
      <div className="p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow duration-200 space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-md text-foreground flex-1 flex items-center">
            <ListChecks className="h-4 w-4 mr-2 text-foreground/80" />
            {keyResult.title}
          </h4>
          <div className="flex items-center space-x-1">
            {isOverdue && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-destructive-foreground bg-destructive p-1 rounded-sm">This Key Result is overdue.</p>
                   {formattedTargetDate && <p>Target Date: {formattedTargetDate}</p>}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="capitalize cursor-default">
                  <CalendarClock className="h-3 w-3 mr-1.5" />
                  {keyResult.trackingFrequency}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tracking: {keyResult.trackingFrequency}</p>
                <p>Last Updated: {formattedLastUpdated}</p>
                {formattedTargetDate && <p>Target Date: {formattedTargetDate}</p>}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {formattedTargetDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 mr-1.5" />
            <span>Target: {formattedTargetDate}</span>
          </div>
        )}

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
    </TooltipProvider>
  );
}

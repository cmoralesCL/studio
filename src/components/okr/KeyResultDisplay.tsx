
'use client';

import React from 'react';
import type { KeyResult } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, ListChecks, MinusCircle, Radio } from 'lucide-react'; // Changed RadioButton to Radio
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface KeyResultDisplayProps {
  keyResult: KeyResult;
  // onUpdateKeyResult is removed as direct editing is not in this view per the image
}

const getProgressColorStyle = (percentage: number) => {
  if (percentage >= 75) return 'progress-indicator-success';
  if (percentage >= 40) return 'progress-indicator-warning';
  return 'progress-indicator-danger';
};

const getProgressBadgeStyle = (percentage: number) => {
  if (percentage >= 75) return 'bg-success text-success-foreground';
  if (percentage >= 40) return 'bg-warning text-warning-foreground';
  if (percentage < 20 && percentage > 0) return 'bg-danger text-danger-foreground';
   if (percentage <= 0) return 'bg-muted text-muted-foreground';
  return 'bg-primary text-primary-foreground'; // Default for mid-range or if logic is adjusted
};


export function KeyResultDisplay({ keyResult }: KeyResultDisplayProps) {
  const progressPercentage = keyResult.targetValue > 0
    ? Math.min(Math.max((keyResult.currentValue / keyResult.targetValue) * 100, 0), 100)
    : keyResult.currentValue > 0 ? 100 : 0;

  const progressColorClass = getProgressColorStyle(progressPercentage);
  const progressBadgeClass = getProgressBadgeStyle(progressPercentage);

  const getSubTaskIcon = () => {
    if (!keyResult.subTasks || keyResult.subTasks.total === 0) return null;
    if (keyResult.subTasks.completed === keyResult.subTasks.total) return <CheckCircle2 className="h-4 w-4 text-accent" />;
    if (keyResult.subTasks.completed > 0) return <Radio className="h-4 w-4 text-primary" />; // Changed RadioButton to Radio
    return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="flex items-center py-3 px-2 border-b border-border/60 hover:bg-muted/30 transition-colors duration-150">
      <div className="w-16 flex-shrink-0 pr-2">
        <Badge className={cn("text-xs font-semibold", progressBadgeClass)}>
          {progressPercentage.toFixed(0)}%
        </Badge>
      </div>

      <div className="flex-grow text-sm text-foreground mr-2 truncate">
        {keyResult.title}
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {keyResult.tags && keyResult.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs hidden md:inline-flex">
            {tag}
          </Badge>
        ))}

        {keyResult.assignees && keyResult.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {keyResult.assignees.slice(0, 3).map((assigneeUrl, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={assigneeUrl} alt={`Assignee ${index + 1}`} data-ai-hint="person photo" />
                <AvatarFallback>{/* JD */}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
        
        {keyResult.subTasks && keyResult.subTasks.total > 0 && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getSubTaskIcon()}
            <span>{keyResult.subTasks.completed}/{keyResult.subTasks.total}</span>
          </div>
        )}

        <div className="w-20 hidden sm:block">
          <Progress value={progressPercentage} className="h-1.5" indicatorClassName={progressColorClass} />
        </div>
      </div>
    </div>
  );
}

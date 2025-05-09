'use client';

import React from 'react';
import type { AreaOkr, KeyResult, OkrIcon } from '@/lib/types';
import { KeyResultDisplay } from './KeyResultDisplay';
import { ChevronDown, ChevronUp, Target as TargetIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface AreaOkrItemProps {
  areaOkr: AreaOkr;
  lifeOkrId: string; // For context, if updates need to go up
  onUpdateKeyResult: (lifeOkrId: string, areaOkrId: string, krId: string, newCurrentValue: number) => void;
  iconMap: Record<OkrIcon, React.ElementType>;
}

const getProgressColorStyle = (percentage: number) => {
  if (percentage >= 75) return 'progress-indicator-success';
  if (percentage >= 40) return 'progress-indicator-warning';
  return 'progress-indicator-danger';
};

export function AreaOkrItem({ areaOkr, lifeOkrId, onUpdateKeyResult, iconMap }: AreaOkrItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const AreaOkrIconComponent = areaOkr.icon && iconMap[areaOkr.icon] ? iconMap[areaOkr.icon] : TargetIcon;
  
  let progressSum = 0;
  if (areaOkr.keyResults.length > 0) {
    areaOkr.keyResults.forEach(kr => {
      const percentage = kr.targetValue > 0 ? Math.min(100, Math.max(0, (kr.currentValue / kr.targetValue) * 100)) : (kr.currentValue > 0 ? 100 : 0);
      progressSum += percentage;
    });
  }
  const overallProgress = areaOkr.keyResults.length > 0 ? progressSum / areaOkr.keyResults.length : 0;
  const progressColorClass = getProgressColorStyle(overallProgress);

  return (
    <div className="py-3 px-4 hover:bg-muted/20">
       <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex items-center w-full">
              <AreaOkrIconComponent className={cn("h-5 w-5 mr-2.5 flex-shrink-0", 
                areaOkr.icon && iconMap[areaOkr.icon] ? `text-secondary-foreground` : 'text-muted-foreground'
              )} />
              <div className="flex-grow">
                <h4 className="text-md font-medium text-foreground text-left">{areaOkr.title}</h4>
                {areaOkr.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 text-left">{areaOkr.description}</p>
                )}
              </div>
              <div className="flex items-center ml-auto pl-4 flex-shrink-0">
                <span className="text-xs font-semibold mr-2 text-muted-foreground whitespace-nowrap">
                  {overallProgress.toFixed(0)}%
                </span>
                <Progress value={overallProgress} className="w-20 h-1.5" indicatorClassName={progressColorClass} />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-0">
            {areaOkr.keyResults.length > 0 ? (
              <div className="space-y-0 border-t border-border/30 mt-2 pt-1">
                {areaOkr.keyResults.map(kr => (
                  <KeyResultDisplay 
                    key={kr.id} 
                    keyResult={kr}
                    // onUpdate={(newCurrentValue) => onUpdateKeyResult(lifeOkrId, areaOkr.id, kr.id, newCurrentValue)}
                    // ^ If direct KR editing from display is needed in future
                  />
                ))}
              </div>
            ) : (
              <p className="px-2 py-3 text-xs text-muted-foreground">No Habit OKRs (Key Results) for this Area OKR yet.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
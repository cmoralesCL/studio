
'use client';

import React from 'react';
import type { AreaOkr, KeyResult, OkrIcon } from '@/lib/types';
import { KeyResultDisplay } from './KeyResultDisplay';
import { ChevronDown, ChevronUp, Target as TargetIcon, Edit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';


interface AreaOkrItemProps {
  areaOkr: AreaOkr;
  lifeOkrId: string; 
  onUpdateKeyResult: (lifeOkrId: string, areaOkrId: string, krId: string, newCurrentValue: number) => void;
  iconMap: Record<OkrIcon, React.ElementType>;
  onEditAreaOkr: (areaOkr: AreaOkr, lifeOkrId: string) => void;
  onEditKeyResult: (keyResult: KeyResult, areaOkrId: string, lifeOkrId: string) => void;
}

const getProgressColorStyle = (percentage: number) => {
  if (percentage >= 75) return 'progress-indicator-success';
  if (percentage >= 40) return 'progress-indicator-warning';
  return 'progress-indicator-danger';
};

export function AreaOkrItem({ areaOkr, lifeOkrId, onUpdateKeyResult, iconMap, onEditAreaOkr, onEditKeyResult }: AreaOkrItemProps) {
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
    <div className="bg-areaOkrCard"> {/* Changed to use CSS variable for background */}
       <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center w-full">
              <AreaOkrIconComponent className={cn("h-5 w-5 mr-2.5 flex-shrink-0", 
                areaOkr.icon && iconMap[areaOkr.icon] ? `text-primary` : 'text-muted-foreground' 
              )} />
              <div className="flex-grow">
                <h4 className="text-md font-medium text-foreground text-left">{areaOkr.title}</h4>
                {areaOkr.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 text-left">{areaOkr.description}</p>
                )}
              </div>
              <div className="flex items-center ml-auto pl-2 flex-shrink-0 space-x-1.5">
                <span className="text-xs font-semibold mr-1 text-muted-foreground whitespace-nowrap">
                  {overallProgress.toFixed(0)}%
                </span>
                <Progress value={overallProgress} className="w-20 h-1.5" indicatorClassName={progressColorClass} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onEditAreaOkr(areaOkr, lifeOkrId); }}
                  aria-label="Edit Area OKR"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 px-0">
            {areaOkr.keyResults.length > 0 ? (
              <div className="bg-card p-4 space-y-0 border-t border-border/30">
                {areaOkr.keyResults.map(kr => (
                  <KeyResultDisplay 
                    key={kr.id} 
                    keyResult={kr}
                    lifeOkrId={lifeOkrId}
                    areaOkrId={areaOkr.id}
                    onEditKeyResult={onEditKeyResult}
                  />
                ))}
              </div>
            ) : (
              <p className="px-4 py-3 text-xs text-muted-foreground bg-card border-t border-border/30">No Habit OKRs (Key Results) for this Area OKR yet.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

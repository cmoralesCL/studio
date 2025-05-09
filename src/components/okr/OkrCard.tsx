'use client';

import React from 'react';
import type { LifeOkr, OkrIcon } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaOkrItem } from './AreaOkrItem'; // New component for displaying Area OKRs
import { 
  Trash2, 
  Edit, 
  Heart, 
  Zap, 
  Target as TargetIcon,
  Briefcase,
  Activity,
  Landmark,
  Users,
  Award,
  FolderArchive,
  Smile,
  BookOpen,
  DollarSign,
  Home,
  UsersRound,
  Brain,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OkrCardProps { // Represents a LifeOkr card
  lifeOkr: LifeOkr;
  onUpdateKeyResult: (lifeOkrId: string, areaOkrId: string, krId: string, newCurrentValue: number) => void;
  onDeleteLifeOkr: (lifeOkrId: string) => void;
  onEditLifeOkr: (lifeOkr: LifeOkr) => void; 
}

const iconMap: Record<OkrIcon, React.ElementType> = {
  Heart, Zap, Target: TargetIcon, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck
};

export function OkrCard({ lifeOkr, onUpdateKeyResult, onDeleteLifeOkr, onEditLifeOkr }: OkrCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const LifeOkrIconComponent = lifeOkr.icon ? iconMap[lifeOkr.icon] : TargetIcon;

  // Calculate overall progress for the LifeOkr (average of its AreaOkrs' average progresses)
  // This is a simplified calculation for display. A more robust one might weight AreaOkrs.
  let totalAreaOkrProgress = 0;
  let numAreaOkrsWithKrs = 0;

  lifeOkr.areaOkrs.forEach(areaOkr => {
    if (areaOkr.keyResults.length > 0) {
      let areaOkrProgressSum = 0;
      areaOkr.keyResults.forEach(kr => {
        const progress = kr.targetValue > 0 ? Math.min(100, Math.max(0, (kr.currentValue / kr.targetValue) * 100)) : (kr.currentValue > 0 ? 100 : 0);
        areaOkrProgressSum += progress;
      });
      totalAreaOkrProgress += (areaOkrProgressSum / areaOkr.keyResults.length);
      numAreaOkrsWithKrs++;
    }
  });
  const lifeOkrOverallProgress = numAreaOkrsWithKrs > 0 ? (totalAreaOkrProgress / numAreaOkrsWithKrs) : 0;


  return (
    <Card className="w-full shadow-lg bg-lifeOkrCard rounded-lg border border-border/70">
      <CardHeader 
        className="p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-t-lg" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <LifeOkrIconComponent className={cn("h-6 w-6 mr-3 text-primary", 
              lifeOkr.icon && iconMap[lifeOkr.icon] ? `text-${lifeOkr.icon.toLowerCase()}-500` : 'text-primary' // Example dynamic coloring
            )} />
            <div className="flex flex-col">
              <CardTitle className="text-xl font-semibold text-foreground">
                {lifeOkr.title}
              </CardTitle>
              {lifeOkr.description && (
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  {lifeOkr.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <span className="text-sm font-medium text-muted-foreground mr-2">
              {lifeOkrOverallProgress.toFixed(0)}%
            </span>
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onEditLifeOkr(lifeOkr);}} 
              aria-label="Edit Life OKR"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Edit className="h-4 w-4" />
            </Button> */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onDeleteLifeOkr(lifeOkr.id); }} 
              aria-label="Delete Life OKR" 
              className="text-destructive hover:bg-destructive/10 h-7 w-7"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
             {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
          {lifeOkr.areaOkrs.length > 0 ? (
            <div className="divide-y divide-border/50">
              {lifeOkr.areaOkrs.map(areaOkr => (
                <AreaOkrItem 
                  key={areaOkr.id}
                  areaOkr={areaOkr}
                  lifeOkrId={lifeOkr.id} // Pass LifeOkrId for context if needed for updates
                  onUpdateKeyResult={onUpdateKeyResult}
                  iconMap={iconMap} // Pass down the iconMap
                />
              ))}
            </div>
          ) : (
            <p className="px-6 py-4 text-sm text-muted-foreground">No Area OKRs defined for this Life OKR yet.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

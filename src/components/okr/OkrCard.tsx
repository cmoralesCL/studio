
'use client';

import React from 'react';
import type { Objective } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyResultDisplay } from './KeyResultDisplay';
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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OkrCardProps {
  objective: Objective;
  onUpdateKeyResult: (objectiveId: string, krId: string, newCurrentValue: number) => void; // Kept if updates happen elsewhere
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void; 
}

const iconMap: Record<NonNullable<Objective['icon']>, React.ElementType> = {
  Heart: Heart,
  Zap: Zap,
  Target: TargetIcon,
  Briefcase: Briefcase,
  Activity: Activity,
  Landmark: Landmark,
  Users: Users,
  Award: Award,
  FolderArchive: FolderArchive,
};

export function OkrCard({ objective, onUpdateKeyResult, onDeleteObjective, onEditObjective }: OkrCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const ObjectiveIcon = objective.icon ? iconMap[objective.icon] : TargetIcon;

  return (
    <Card className="w-full shadow-md bg-card rounded-lg">
      <CardHeader 
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ObjectiveIcon className={cn("h-5 w-5 mr-3", 
              objective.icon === 'Heart' ? 'text-red-500' : 
              objective.icon === 'Zap' ? 'text-yellow-500' : 'text-primary'
            )} />
            <CardTitle className="text-lg font-semibold text-foreground">
              {objective.title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onEditObjective(objective);}} 
              aria-label="Edit Objective"
              className="h-7 w-7"
            >
              <Edit className="h-4 w-4" />
            </Button> */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onDeleteObjective(objective.id); }} 
              aria-label="Delete Objective" 
              className="text-destructive hover:bg-destructive/10 h-7 w-7"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
             {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </div>
        {objective.description && isExpanded && (
          <CardDescription className="pt-1 text-sm text-muted-foreground ml-8">
            {objective.description}
          </CardDescription>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0"> {/* Adjusted padding */}
          <div className="space-y-0"> {/* Removed space-y-4 for tighter list */}
            {objective.keyResults.map(kr => (
              <KeyResultDisplay 
                key={kr.id} 
                keyResult={kr}
              />
            ))}
            {objective.keyResults.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">No key results for this objective yet.</p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

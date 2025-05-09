'use client';

import React from 'react';
import type { Objective, KeyResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyResultDisplay } from './KeyResultDisplay';
import { OkrProgressChart } from './OkrProgressChart';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, EyeOff, Eye } from 'lucide-react';

interface OkrCardProps {
  objective: Objective;
  onUpdateKeyResult: (objectiveId: string, krId: string, newCurrentValue: number) => void;
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void; // For future editing functionality
}

export function OkrCard({ objective, onUpdateKeyResult, onDeleteObjective, onEditObjective }: OkrCardProps) {
  const [showChart, setShowChart] = React.useState(true);

  const overallProgress = React.useMemo(() => {
    if (objective.keyResults.length === 0) return 0;
    const totalProgress = objective.keyResults.reduce((sum, kr) => {
      const krProgress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : (kr.currentValue > 0 ? 100 : 0);
      return sum + Math.min(Math.max(krProgress, 0), 100);
    }, 0);
    return totalProgress / objective.keyResults.length;
  }, [objective.keyResults]);

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-semibold text-primary">{objective.title}</CardTitle>
            <Badge variant="outline" className="mt-1">{objective.level}</Badge>
          </div>
          <div className="flex space-x-2">
             {/* <Button variant="ghost" size="icon" onClick={() => onEditObjective(objective)} aria-label="Edit Objective">
              <Edit className="h-5 w-5" />
            </Button> TODO: Implement edit objective functionality */}
            <Button variant="ghost" size="icon" onClick={() => onDeleteObjective(objective.id)} aria-label="Delete Objective" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {objective.description && (
          <CardDescription className="pt-2 text-muted-foreground">{objective.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Overall Objective Progress</span>
            <span className="text-sm font-semibold text-primary">{overallProgress.toFixed(1)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" indicatorClassName={overallProgress === 100 ? "bg-accent" : "bg-primary"} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Key Results:</h3>
          {objective.keyResults.map(kr => (
            <KeyResultDisplay 
              key={kr.id} 
              keyResult={kr} 
              objectiveId={objective.id}
              onUpdateKeyResult={onUpdateKeyResult} 
            />
          ))}
        </div>
        
        {objective.keyResults.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" onClick={() => setShowChart(!showChart)} size="sm" className="mb-2">
              {showChart ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showChart ? 'Hide' : 'Show'} Progress Chart
            </Button>
            {showChart && <OkrProgressChart keyResults={objective.keyResults} objectiveTitle={objective.title} />}
          </div>
        )}

      </CardContent>
      {/* <CardFooter>
        Footer content if needed
      </CardFooter> */}
    </Card>
  );
}

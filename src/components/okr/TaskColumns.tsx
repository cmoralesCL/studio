
'use client';

import type { KeyResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, CalendarClock, CalendarPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskDayColumnProps {
  title: string;
  tasks: KeyResult[];
  icon: React.ElementType;
}

function TaskDayColumn({ title, tasks, icon: Icon }: TaskDayColumnProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-primary">
          <Icon className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No tasks due.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li 
                key={task.id} 
                className="text-sm p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                title={`From Life OKR: ${task.parentLifeOkrTitle}\nArea OKR: ${task.parentAreaOkrTitle}`}
              >
                <p className="font-medium text-foreground truncate">{task.title}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  <p className="truncate">Life: {task.parentLifeOkrTitle}</p>
                  <p className="truncate">Area: {task.parentAreaOkrTitle}</p>
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="mt-1.5">
                    {task.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface TaskColumnsProps {
  tasksToday: KeyResult[];
  tasksTomorrow: KeyResult[];
  tasksDayAfterTomorrow: KeyResult[];
}

export function TaskColumns({ tasksToday, tasksTomorrow, tasksDayAfterTomorrow }: TaskColumnsProps) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Key Tasks Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TaskDayColumn title="Today" tasks={tasksToday} icon={CalendarCheck} />
        <TaskDayColumn title="Tomorrow" tasks={tasksTomorrow} icon={CalendarClock} />
        <TaskDayColumn title="Day After Tomorrow" tasks={tasksDayAfterTomorrow} icon={CalendarPlus} />
      </div>
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import type { Objective, KeyResult, ObjectiveFormData, TrackingFrequency, SummaryCardData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AddOkrDialog } from '@/components/okr/AddOkrDialog';
import { OkrList } from '@/components/okr/OkrList';
import OkrOverallSummary from '@/components/okr/OkrOverallSummary'; // New summary component
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { addDays, endOfYear, formatISO, endOfMonth, endOfQuarter, differenceInDays } from 'date-fns';

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();
const getCurrentISODate = () => new Date().toISOString();

const getNextWeekendDateISO = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const daysUntilSunday = dayOfWeek === 0 ? 7 : (7 - dayOfWeek);
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);
  return nextSunday.toISOString();
};

const getEndOfCurrentMonthISO = () => {
    return endOfMonth(new Date()).toISOString();
};

const getEndOfCurrentQuarterISO = () => {
    return endOfQuarter(new Date()).toISOString();
};

const placeholderAssignee = (seed: string) => `https://picsum.photos/seed/${seed}/40/40`;


const exampleObjectives: Objective[] = [
  {
    id: generateId(),
    title: "Optimizar mi salud física",
    description: "Ámbito de Vida: Bienestar Físico y Mental. Mejorar la salud física general.",
    level: "Personal",
    icon: "Activity",
    keyResults: [
      { id: generateId(), title: "Realizar 150 minutos de ejercicio moderado por semana", currentValue: 75, targetValue: 150, unit: "minutos", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Ejercicio"], assignees: [placeholderAssignee('user1')], subTasks: { completed: 2, total: 3 } },
      { id: generateId(), title: "Consumir 5 porciones de frutas/verduras al día", currentValue: 20, targetValue: 35, unit: "porciones/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Nutrición"], assignees: [placeholderAssignee('user1')], subTasks: { completed: 4, total: 7 }},
      { id: generateId(), title: "Dormir un promedio de 7 horas por noche", currentValue: 6, targetValue: 7, unit: "horas/noche", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Descanso"], assignees: [placeholderAssignee('user1')], subTasks: { completed: 15, total: 30 }},
    ],
  },
  {
    id: generateId(),
    title: "Mejorar mi salud mental y manejo del estrés",
    description: "Ámbito de Vida: Bienestar Físico y Mental. Fomentar la paz interior y reducir el estrés.",
    level: "Personal",
    icon: "Heart",
    keyResults: [
      { id: generateId(), title: "Practicar meditación 10 mins, 5 días/semana", currentValue: 3, targetValue: 5, unit: "sesiones/semana", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Mindfulness"], assignees: [placeholderAssignee('user2')], subTasks: { completed: 3, total: 5 } },
      { id: generateId(), title: "Dedicar 3 horas/semana a hobbies desestresantes", currentValue: 1, targetValue: 3, unit: "horas/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Hobbies"], assignees: [placeholderAssignee('user2')], subTasks: { completed: 1, total: 4 }},
    ],
  },
  {
    id: generateId(),
    title: "Adquirir nueva habilidad técnica (IA Aplicada)",
    description: "Ámbito de Vida: Desarrollo Profesional y Carrera. Aprender competencias valoradas.",
    level: "Personal",
    icon: "Briefcase",
    keyResults: [
      { id: generateId(), title: "Completar curso online avanzado de IA", currentValue: 40, targetValue: 100, unit: "%", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: addDays(new Date(), 90).toISOString(), tags: ["Formación", "IA"], assignees: [placeholderAssignee('user3'), placeholderAssignee('user4')], subTasks: { completed: 2, total: 5 } },
      { id: generateId(), title: "Dedicar 8 horas/semana a estudio y práctica", currentValue: 5, targetValue: 8, unit: "horas/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Estudio"], assignees: [placeholderAssignee('user3')], subTasks: { completed: 0, total: 0 }},
    ],
  },
   {
    id: generateId(),
    title: "Incrementar ahorros e inversiones",
    description: "Ámbito de Vida: Finanzas Personales. Mejorar la salud financiera a largo plazo.",
    level: "Personal",
    icon: "Landmark",
    keyResults: [
      { id: generateId(), title: "Ahorrar el 20% de ingresos netos mensuales", currentValue: 15, targetValue: 20, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Ahorro"], assignees: [placeholderAssignee('user5')], subTasks: { completed: 1, total: 1 } },
      { id: generateId(), title: "Aumentar cartera de inversión en 10% anual", currentValue: 2, targetValue: 10, unit: "% anual", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: endOfYear(new Date()).toISOString(), tags: ["Inversión"], assignees: [placeholderAssignee('user5'), placeholderAssignee('user1')], subTasks: { completed: 1, total: 4 } },
    ],
  },
];


export default function OkrTrackerPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isAddOkrDialogOpen, setIsAddOkrDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isClient, setIsClient] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryCardData[]>([]);


  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedObjectives = localStorage.getItem('okrObjectives');
    let loadedObjectives = exampleObjectives;
    if (storedObjectives && storedObjectives !== '[]') {
      try {
        const parsedObjectives: Objective[] = JSON.parse(storedObjectives);
        if (Array.isArray(parsedObjectives) && parsedObjectives.every(obj => 
            obj.id && obj.title && Array.isArray(obj.keyResults) && 
            obj.keyResults.every(kr => 
                kr.id && kr.title && 
                kr.hasOwnProperty('currentValue') && typeof kr.currentValue === 'number' &&
                kr.hasOwnProperty('targetValue') && typeof kr.targetValue === 'number' &&
                kr.unit && typeof kr.unit === 'string' &&
                kr.trackingFrequency && typeof kr.trackingFrequency === 'string' &&
                kr.lastUpdated && typeof kr.lastUpdated === 'string' &&
                (kr.targetDate === undefined || kr.targetDate === null || typeof kr.targetDate === 'string') &&
                (kr.tags === undefined || Array.isArray(kr.tags)) &&
                (kr.assignees === undefined || Array.isArray(kr.assignees)) &&
                (kr.subTasks === undefined || (typeof kr.subTasks === 'object' && kr.subTasks !== null && kr.subTasks.hasOwnProperty('completed') && kr.subTasks.hasOwnProperty('total')))
            )
        )) {
            loadedObjectives = parsedObjectives;
        } else {
            console.warn("Stored objectives are not in the expected format or missing fields. Loading example objectives.");
            localStorage.removeItem('okrObjectives');
        }
      } catch (error) {
        console.error("Failed to parse objectives from localStorage", error);
        localStorage.removeItem('okrObjectives'); 
      }
    }
    setObjectives(loadedObjectives);
  }, []);

  useEffect(() => {
    if(isClient && objectives.length > 0) { 
        localStorage.setItem('okrObjectives', JSON.stringify(objectives));
        
        // Calculate summary stats
        let totalKRs = 0;
        let completedKRs = 0;
        let totalProgressSum = 0;
        let krsWithProgress = 0;
        let earliestTargetDate: Date | null = null;

        objectives.forEach(obj => {
          obj.keyResults.forEach(kr => {
            totalKRs++;
            const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : (kr.currentValue > 0 ? 100 : 0);
            if (progress >= 100) completedKRs++;
            totalProgressSum += Math.min(100, Math.max(0, progress));
            krsWithProgress++;
            if (kr.targetDate) {
              const date = new Date(kr.targetDate);
              if (!earliestTargetDate || date < earliestTargetDate) {
                earliestTargetDate = date;
              }
            }
          });
        });

        const overallAvgProgress = krsWithProgress > 0 ? totalProgressSum / krsWithProgress : 0;
        const daysLeft = earliestTargetDate ? differenceInDays(earliestTargetDate, new Date()) : null;

        setSummaryStats([
          { id: 's1', title: 'Overall Progress', value: overallAvgProgress, unit: '%', progress: overallAvgProgress, variant: 'primary', type: 'circular-progress' },
          { id: 's2', title: 'Objectives', value: objectives.length, unit: 'Active', variant: 'default', type: 'text-value' },
          { id: 's3', title: 'Key Results Done', value: `${completedKRs}/${totalKRs}`, variant: 'accent', type: 'fraction' },
          { id: 's4', title: 'Next Deadline', value: daysLeft !== null && daysLeft >=0 ? daysLeft : 'N/A', unit: daysLeft !== null && daysLeft >=0 ? 'days left' : '', variant: daysLeft !==null && daysLeft < 7 ? 'warning' : 'default', type: 'text-value' },
        ]);

    } else if (isClient && objectives.length === 0) {
        localStorage.removeItem('okrObjectives');
         setSummaryStats([
          { id: 's1', title: 'Overall Progress', value: 0, unit: '%', progress: 0, variant: 'primary', type: 'circular-progress' },
          { id: 's2', title: 'Objectives', value: 0, unit: 'Active', variant: 'default', type: 'text-value' },
          { id: 's3', title: 'Key Results Done', value: `0/0`, variant: 'accent', type: 'fraction' },
          { id: 's4', title: 'Next Deadline', value: 'N/A', unit: '', variant: 'default', type: 'text-value' },
        ]);
    }
  }, [objectives, isClient]);


  const handleAddObjective = async (data: ObjectiveFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newObjective: Objective = {
      id: generateId(),
      title: data.title,
      description: data.description,
      level: data.level,
      icon: data.icon || 'Target',
      keyResults: data.keyResults.map(kr => ({
        ...kr,
        id: generateId(),
        currentValue: 0, 
        lastUpdated: getCurrentISODate(),
        targetDate: kr.targetDate || undefined,
        tags: kr.tags || [],
        assignees: kr.assignees || [],
        subTasks: kr.subTasks || { completed: 0, total: 0 },
      })),
    };
    setObjectives(prev => [newObjective, ...prev]);
    setIsLoading(false);
    setIsAddOkrDialogOpen(false);
    toast({
      title: "Objective Added",
      description: `"${newObjective.title}" has been successfully added.`,
      variant: "default", 
    });
  };

  const handleUpdateKeyResult = (objectiveId: string, krId: string, newCurrentValue: number) => {
    setObjectives(prevObjectives =>
      prevObjectives.map(obj => {
        if (obj.id === objectiveId) {
          return {
            ...obj,
            keyResults: obj.keyResults.map(kr =>
              kr.id === krId ? { ...kr, currentValue: newCurrentValue, lastUpdated: getCurrentISODate() } : kr
            ),
          };
        }
        return obj;
      })
    );
    toast({
        title: "Key Result Updated",
        description: "Progress has been saved.",
    });
  };

  const confirmDeleteObjective = (objectiveId: string) => {
    setObjectiveToDelete(objectiveId);
  };

  const handleDeleteObjective = () => {
    if (!objectiveToDelete) return;
    const objective = objectives.find(obj => obj.id === objectiveToDelete);
    setObjectives(prev => prev.filter(obj => obj.id !== objectiveToDelete));
    setObjectiveToDelete(null); 
    if (objective) {
      toast({
        title: "Objective Deleted",
        description: `"${objective.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };
  
  const handleEditObjective = (objective: Objective) => {
    // This will be implemented later if needed. For now, this function is passed to OkrCard
    // but the edit button in OkrCard might be commented out or have limited functionality.
    toast({ title: "Edit Action (Placeholder)", description: `Editing: ${objective.title} (not fully implemented yet)`});
  };

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground">Loading OKR Tracker...</p>
          </div>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        <OkrOverallSummary summaryData={summaryStats} />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">My Objectives</h1>
          <Button onClick={() => setIsAddOkrDialogOpen(true)} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Objective
          </Button>
        </div>

        <OkrList 
          objectives={objectives} 
          onUpdateKeyResult={handleUpdateKeyResult} // Keep for potential future use if KR update is re-added
          onDeleteObjective={confirmDeleteObjective}
          onEditObjective={handleEditObjective}
        />
        
        <AddOkrDialog
          isOpen={isAddOkrDialogOpen}
          onOpenChange={setIsAddOkrDialogOpen}
          onAddObjective={handleAddObjective}
          isLoading={isLoading}
        />

        {objectiveToDelete && (
          <AlertDialog open={!!objectiveToDelete} onOpenChange={() => setObjectiveToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this objective?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the objective
                  "{objectives.find(obj => obj.id === objectiveToDelete)?.title}" and all its key results.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setObjectiveToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteObjective} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </main>
      <Toaster />
    </div>
  );
}

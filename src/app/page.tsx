'use client';

import React, { useState, useEffect } from 'react';
import type { Objective, KeyResult, ObjectiveFormData, TrackingFrequency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AddOkrDialog } from '@/components/okr/AddOkrDialog';
import { OkrList } from '@/components/okr/OkrList';
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

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();
const getCurrentISODate = () => new Date().toISOString();

const exampleObjectives: Objective[] = [
  // Okr de Vida
  {
    id: generateId(),
    title: "Fortalecer mis relaciones personales",
    description: "Objetivos para mejorar conexiones con otros.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Tener una conversación significativa con un miembro de mi familia cada semana", currentValue: 0, targetValue: 1, unit: "conversación/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Salir con amigos o seres queridos al menos dos veces al mes", currentValue: 0, targetValue: 2, unit: "veces/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Dedicar tiempo a escuchar y apoyar a mis amigos y familiares", currentValue: 0, targetValue: 5, unit: "interacciones/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate() },
    ],
  },
  {
    id: generateId(),
    title: "Experimentar nuevas culturas",
    description: "Objetivos para expandir horizontes y aprender sobre el mundo.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Planear un viaje a un país que no conozca este año", currentValue: 0, targetValue: 1, unit: "viaje planeado", trackingFrequency: "annually", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Leer al menos 3 libros sobre diferentes culturas y tradiciones", currentValue: 0, targetValue: 3, unit: "libros", trackingFrequency: "once", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Probar la cocina de diferentes países al menos una vez al mes", currentValue: 0, targetValue: 1, unit: "cocina nueva/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate() },
    ],
  },
  {
    id: generateId(),
    title: "Contribuir activamente a mi comunidad y generar un impacto positivo",
    description: "Objetivos para involucrarse y ayudar a otros.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Ser voluntario en una organización benéfica al menos una vez al mes", currentValue: 0, targetValue: 1, unit: "voluntariado/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Donar un porcentaje de mis ingresos a causas que me importan trimestralmente", currentValue: 0, targetValue: 1, unit: "donación/trimestre", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Participar en actividades cívicas o políticas para promover el cambio social", currentValue: 0, targetValue: 2, unit: "actividades/año", trackingFrequency: "annually", lastUpdated: getCurrentISODate() },
    ],
  },
  // Okr de Área (Laboral/Profesional)
  {
    id: generateId(),
    title: "Mejorar mi desempeño profesional y avanzar en mi carrera",
    description: "Objetivos relacionados con el crecimiento laboral.",
    level: "Team", 
    keyResults: [
      { id: generateId(), title: "Completar un curso o certificación relevante en los próximos tres meses", currentValue: 0, targetValue: 1, unit: "curso", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Liderar o participar activamente en un proyecto clave", currentValue: 0, targetValue: 1, unit: "proyecto", trackingFrequency: "once", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Recibir comentarios positivos de superiores y compañeros", currentValue: 0, targetValue: 3, unit: "feedbacks", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate() },
    ],
  },
  {
    id: generateId(),
    title: "Aumentar mi productividad y eficiencia en el trabajo",
    description: "Objetivos para optimizar el rendimiento laboral.",
    level: "Individual",
    keyResults: [
      { id: generateId(), title: "Implementar un sistema de gestión del tiempo (Pomodoro) y usarlo diariamente", currentValue: 0, targetValue: 1, unit: "sistema implementado", trackingFrequency: "once", lastUpdated: getCurrentISODate() }, // Changed to 'once' for initial implementation
      { id: generateId(), title: "Reducir el tiempo dedicado a tareas no esenciales en un 20%", currentValue: 0, targetValue: 20, unit: "%", trackingFrequency: "monthly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Completar todas mis tareas prioritarias antes de finalizar cada día laboral (objetivo: 5 días/semana)", currentValue: 0, targetValue: 5, unit: "días/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate() },
    ],
  },
  // Okr de Hábito
  {
    id: generateId(),
    title: "Mejorar mi bienestar físico y mental",
    description: "Objetivos enfocados en la salud personal.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Hacer ejercicio al menos 3 veces por semana", currentValue: 0, targetValue: 3, unit: "veces/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate() },
      { id: generateId(), title: "Meditar durante 10 minutos diarios (objetivo: 7 días/semana)", currentValue: 0, targetValue: 7, unit: "días/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate() }, // Changed target to days for weekly tracking
      { id: generateId(), title: "Leer al menos un libro al mes sobre desarrollo personal", currentValue: 0, targetValue: 1, unit: "libro/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate() },
    ],
  },
];


export default function OkrTrackerPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isAddOkrDialogOpen, setIsAddOkrDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isClient, setIsClient] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedObjectives = localStorage.getItem('okrObjectives');
    if (storedObjectives && storedObjectives !== '[]') {
      try {
        const parsedObjectives: Objective[] = JSON.parse(storedObjectives);
        if (Array.isArray(parsedObjectives) && parsedObjectives.every(obj => 
            obj.id && obj.title && Array.isArray(obj.keyResults) && 
            obj.keyResults.every(kr => kr.id && kr.title && kr.hasOwnProperty('currentValue') && kr.hasOwnProperty('targetValue') && kr.unit && kr.trackingFrequency && kr.lastUpdated)
        )) {
            setObjectives(parsedObjectives);
        } else {
            console.warn("Stored objectives are not in the expected format or missing new fields. Loading example objectives.");
            localStorage.removeItem('okrObjectives');
            setObjectives(exampleObjectives);
        }
      } catch (error) {
        console.error("Failed to parse objectives from localStorage", error);
        localStorage.removeItem('okrObjectives'); 
        setObjectives(exampleObjectives); 
      }
    } else {
      setObjectives(exampleObjectives);
    }
  }, []);

  useEffect(() => {
    if(isClient && objectives.length > 0) { 
        localStorage.setItem('okrObjectives', JSON.stringify(objectives));
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
      keyResults: data.keyResults.map(kr => ({
        ...kr,
        id: generateId(),
        currentValue: 0, 
        lastUpdated: getCurrentISODate(),
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
    toast({ title: "Edit Action", description: `Editing: ${objective.title} (not implemented yet)`});
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
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Objectives</h1>
          <Button onClick={() => setIsAddOkrDialogOpen(true)} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Objective
          </Button>
        </div>

        <OkrList 
          objectives={objectives} 
          onUpdateKeyResult={handleUpdateKeyResult}
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

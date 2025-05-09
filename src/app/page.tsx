'use client';

import React, { useState, useEffect } from 'react';
import type { Objective, KeyResult, ObjectiveFormData } from '@/lib/types';
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

export default function OkrTrackerPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isAddOkrDialogOpen, setIsAddOkrDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isClient, setIsClient] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Load objectives from local storage if available
    const storedObjectives = localStorage.getItem('okrObjectives');
    if (storedObjectives) {
      try {
        setObjectives(JSON.parse(storedObjectives));
      } catch (error) {
        console.error("Failed to parse objectives from localStorage", error);
        localStorage.removeItem('okrObjectives'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if(isClient) { // Only run on client after initial mount
        localStorage.setItem('okrObjectives', JSON.stringify(objectives));
    }
  }, [objectives, isClient]);


  const handleAddObjective = async (data: ObjectiveFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newObjective: Objective = {
      id: generateId(),
      title: data.title,
      description: data.description,
      level: data.level,
      keyResults: data.keyResults.map(kr => ({
        ...kr,
        id: generateId(),
        currentValue: 0, // Initial current value
      })),
    };
    setObjectives(prev => [newObjective, ...prev]);
    setIsLoading(false);
    setIsAddOkrDialogOpen(false);
    toast({
      title: "Objective Added",
      description: `"${newObjective.title}" has been successfully added.`,
      variant: "default", // Or use 'success' if you define such a variant
    });
  };

  const handleUpdateKeyResult = (objectiveId: string, krId: string, newCurrentValue: number) => {
    setObjectives(prevObjectives =>
      prevObjectives.map(obj => {
        if (obj.id === objectiveId) {
          return {
            ...obj,
            keyResults: obj.keyResults.map(kr =>
              kr.id === krId ? { ...kr, currentValue: newCurrentValue } : kr
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
    setObjectiveToDelete(null); // Close dialog
    if (objective) {
      toast({
        title: "Objective Deleted",
        description: `"${objective.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };
  
  // For editing (placeholder for now)
  const handleEditObjective = (objective: Objective) => {
    // TODO: Implement edit functionality
    // This would typically involve opening the AddOkrDialog with initialData
    toast({ title: "Edit Action", description: `Editing: ${objective.title} (not implemented)`});
  };

  // Render a loading state or placeholder until client is mounted
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

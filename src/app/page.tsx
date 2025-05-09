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
import { addDays, endOfYear, formatISO, endOfMonth, endOfQuarter } from 'date-fns';

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


const exampleObjectives: Objective[] = [
  // Ámbito de Vida 1: Bienestar Físico y Mental
  {
    id: generateId(),
    title: "Optimizar mi salud física",
    description: "Ámbito de Vida: Bienestar Físico y Mental. Este objetivo se enfoca en mejorar la salud física general.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Realizar 150 minutos de ejercicio moderado por semana", currentValue: 0, targetValue: 150, unit: "minutos", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Consumir 5 porciones de frutas/verduras al día, alcanzando 30 porciones semanales", currentValue: 0, targetValue: 30, unit: "porciones/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Dormir un promedio de 7 horas por noche durante el trimestre", currentValue: 0, targetValue: 7, unit: "horas/noche (promedio)", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
    ],
  },
  {
    id: generateId(),
    title: "Mejorar mi salud mental y manejo del estrés",
    description: "Ámbito de Vida: Bienestar Físico y Mental. Este objetivo busca fomentar la paz interior y reducir el estrés cotidiano.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Practicar meditación o mindfulness durante 10 minutos, 5 días a la semana", currentValue: 0, targetValue: 5, unit: "sesiones/semana", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Dedicar 3 horas a la semana a hobbies desestresantes (lectura, música, arte)", currentValue: 0, targetValue: 3, unit: "horas/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Limitar el consumo de noticias negativas a 30 minutos al día", currentValue: 0, targetValue: 30, unit: "minutos/día (máximo)", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
    ],
  },
  {
    id: generateId(),
    title: "Establecer una rutina de sueño consistente y reparadora",
    description: "Ámbito de Vida: Bienestar Físico y Mental. Enfocado en mejorar la calidad y regularidad del descanso.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Acostarme antes de las 11 PM y levantarme antes de las 7 AM, 5 noches por semana", currentValue: 0, targetValue: 5, unit: "noches/semana", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Evitar el uso de pantallas (teléfono, TV, computador) 1 hora antes de dormir", currentValue: 0, targetValue: 7, unit: "días/semana", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO()},
      { id: generateId(), title: "Mantener el dormitorio oscuro, silencioso y fresco consistentemente", currentValue: 0, targetValue: 1, unit: "ambiente optimizado (0 o 1)", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
    ],
  },

  // Ámbito de Vida 2: Desarrollo Profesional y Carrera
  {
    id: generateId(),
    title: "Adquirir una nueva habilidad técnica clave para mi industria",
    description: "Ámbito de Vida: Desarrollo Profesional y Carrera. Centrado en el aprendizaje de competencias valoradas en el mercado laboral.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Completar un curso online avanzado de 'Inteligencia Artificial Aplicada' en 3 meses", currentValue: 0, targetValue: 100, unit: "% completado", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: addDays(new Date(), 90).toISOString() },
      { id: generateId(), title: "Dedicar 8 horas semanales al estudio y práctica de la nueva habilidad", currentValue: 0, targetValue: 8, unit: "horas/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Aplicar la nueva habilidad en un proyecto personal o laboral demostrable antes de fin de trimestre", currentValue: 0, targetValue: 1, unit: "proyecto completado", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
    ],
  },
  {
    id: generateId(),
    title: "Aumentar mi visibilidad y red de contactos en mi sector",
    description: "Ámbito de Vida: Desarrollo Profesional y Carrera. Busca expandir conexiones profesionales y reconocimiento.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Participar activamente (comentar/publicar) en 2 grupos profesionales online (LinkedIn, etc.) semanalmente", currentValue: 0, targetValue: 2, unit: "grupos/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Asistir a 2 eventos (virtuales o presenciales) de la industria este trimestre", currentValue: 0, targetValue: 2, unit: "eventos", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
      { id: generateId(), title: "Realizar 3 cafés virtuales informativos con profesionales de interés al mes", currentValue: 0, targetValue: 3, unit: "cafés/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
    ],
  },
  {
    id: generateId(),
    title: "Mejorar mi desempeño y contribución en mi rol actual",
    description: "Ámbito de Vida: Desarrollo Profesional y Carrera. Enfocado en la excelencia y el impacto en el trabajo.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Incrementar la eficiencia en mis tareas principales en un 15% (medido por tiempo/resultados)", currentValue: 0, targetValue: 15, unit: "% mejora", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
      { id: generateId(), title: "Recibir una calificación de 'Supera las expectativas' en la próxima revisión de desempeño", currentValue: 0, targetValue: 1, unit: "evaluación positiva (0 o 1)", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: endOfYear(new Date()).toISOString() },
      { id: generateId(), title: "Proponer e implementar 1 mejora de proceso significativa en mi equipo este trimestre", currentValue: 0, targetValue: 1, unit: "mejora implementada", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
    ],
  },

  // Ámbito de Vida 3: Finanzas Personales
  {
    id: generateId(),
    title: "Incrementar mis ahorros e inversiones de forma sostenible",
    description: "Ámbito de Vida: Finanzas Personales. Objetivo para mejorar la salud financiera a largo plazo.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Ahorrar el 20% de mis ingresos netos mensuales consistentemente", currentValue: 0, targetValue: 20, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Aumentar mi cartera de inversión en un 10% este año (excluyendo nuevos aportes)", currentValue: 0, targetValue: 10, unit: "% crecimiento anual", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: endOfYear(new Date()).toISOString() },
      { id: generateId(), title: "Establecer un fondo de emergencia equivalente a 3 meses de gastos fijos", currentValue: 0, targetValue: 3, unit: "meses de gastos", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: addDays(new Date(), 180).toISOString() }, // 6 meses para lograrlo
    ],
  },
  {
    id: generateId(),
    title: "Reducir deudas de consumo y optimizar gastos",
    description: "Ámbito de Vida: Finanzas Personales. Busca aliviar la carga financiera y mejorar el flujo de efectivo.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Disminuir el saldo total de tarjetas de crédito en un 25% en los próximos 6 meses", currentValue: 0, targetValue: 25, unit: "% reducción", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: addDays(new Date(), 180).toISOString() },
      { id: generateId(), title: "Reducir mis gastos discrecionales (no esenciales) en un 15% mensual", currentValue: 0, targetValue: 15, unit: "% reducción mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "No incurrir en nuevas deudas de consumo (préstamos personales, compras a crédito no planificadas) durante el trimestre", currentValue: 0, targetValue: 0, unit: "nuevas deudas", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
    ],
  },
  {
    id: generateId(),
    title: "Mejorar mi educación y planificación financiera",
    description: "Ámbito de Vida: Finanzas Personales. Enfocado en tomar decisiones financieras más informadas.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Leer 1 libro sobre finanzas personales o inversión al mes", currentValue: 0, targetValue: 3, unit: "libros/trimestre", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
      { id: generateId(), title: "Dedicar 2 horas semanales a investigar y aprender sobre estrategias de inversión y planificación", currentValue: 0, targetValue: 2, unit: "horas/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Crear y revisar un presupuesto detallado mensualmente", currentValue: 0, targetValue: 1, unit: "presupuesto revisado/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
    ],
  },
  
  // Ámbito de Vida 4: Relaciones Interpersonales
  {
    id: generateId(),
    title: "Fortalecer la relación con mi pareja",
    description: "Ámbito de Vida: Relaciones Interpersonales. Dedicado a nutrir la conexión y complicidad en la pareja.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Tener 1 cita de calidad (sin distracciones, tiempo dedicado) con mi pareja cada semana", currentValue: 0, targetValue: 4, unit: "citas/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Expresar aprecio o gratitud específica a mi pareja diariamente (mínimo 5 veces/semana)", currentValue: 0, targetValue: 5, unit: "expresiones/semana", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Planificar y realizar 1 escapada o actividad especial juntos este trimestre", currentValue: 0, targetValue: 1, unit: "actividad especial", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
    ],
  },
  {
    id: generateId(),
    title: "Cultivar y mantener amistades significativas",
    description: "Ámbito de Vida: Relaciones Interpersonales. Enfocado en la calidad y constancia de los lazos de amistad.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Contactar proactivamente (llamada, mensaje extenso) a 2 amigos diferentes cada semana para conversar", currentValue: 0, targetValue: 2, unit: "contactos/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Organizar o participar en 1 actividad social con amigos (presencial o virtual) al mes", currentValue: 0, targetValue: 1, unit: "actividad/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Ofrecer apoyo activamente (escucha, ayuda) a un amigo que lo necesite al menos una vez al mes", currentValue: 0, targetValue: 1, unit: "acto de apoyo/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
    ],
  },
  {
    id: generateId(),
    title: "Mejorar la comunicación y conexión con mi familia (origen/extendida)",
    description: "Ámbito de Vida: Relaciones Interpersonales. Busca fortalecer los vínculos familiares.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Realizar una videollamada o visita significativa a mis padres/hermanos cada 2 semanas", currentValue: 0, targetValue: 2, unit: "conexiones/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() }, // Bi-semanal = 2 al mes
      { id: generateId(), title: "Practicar la escucha activa y validación emocional en el 80% de las conversaciones familiares importantes", currentValue: 0, targetValue: 80, unit: "% de conversaciones", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Recordar y celebrar activamente (mensaje, llamada, detalle) los cumpleaños y fechas importantes de 5 familiares cercanos", currentValue: 0, targetValue: 5, unit: "celebraciones/año", trackingFrequency: "annually", lastUpdated: getCurrentISODate(), targetDate: endOfYear(new Date()).toISOString() },
    ],
  },

  // Ámbito de Vida 5: Crecimiento Personal y Contribución
  {
    id: generateId(),
    title: "Desarrollar una nueva afición o pasatiempo enriquecedor",
    description: "Ámbito de Vida: Crecimiento Personal y Contribución. Fomenta la exploración de nuevos intereses.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Dedicar 3 horas a la semana a aprender y practicar [Nueva Afición, ej: fotografía]", currentValue: 0, targetValue: 3, unit: "horas/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
      { id: generateId(), title: "Unirme a un club o comunidad (online/offline) relacionada con la nueva afición este mes", currentValue: 0, targetValue: 1, unit: "comunidad unida", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Completar un proyecto básico o alcanzar un hito inicial (ej: tomar 50 fotos editadas) en la afición en 3 meses", currentValue: 0, targetValue: 1, unit: "proyecto/hito", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: addDays(new Date(), 90).toISOString() },
    ],
  },
  {
    id: generateId(),
    title: "Contribuir a una causa social o comunitaria de mi interés",
    description: "Ámbito de Vida: Crecimiento Personal y Contribución. Busca generar un impacto positivo más allá de uno mismo.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Realizar 10 horas de voluntariado al mes en [Organización/Causa Específica]", currentValue: 0, targetValue: 10, unit: "horas/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Donar un 2% de mis ingresos mensuales a [Organización Benéfica Seleccionada]", currentValue: 0, targetValue: 2, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Participar activamente en 1 iniciativa de concienciación o recaudación de fondos para [Causa Específica] este semestre", currentValue: 0, targetValue: 1, unit: "iniciativa", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: addDays(new Date(), 180).toISOString() },
    ],
  },
  {
    id: generateId(),
    title: "Expandir mis conocimientos generales y perspectiva del mundo",
    description: "Ámbito de Vida: Crecimiento Personal y Contribución. Fomenta la curiosidad intelectual y la comprensión.",
    level: "Personal",
    keyResults: [
      { id: generateId(), title: "Leer 1 libro de no ficción sobre un tema nuevo (historia, ciencia, filosofía) cada mes", currentValue: 0, targetValue: 3, unit: "libros/trimestre", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO() },
      { id: generateId(), title: "Ver 2 documentales educativos o culturales de calidad por semana", currentValue: 0, targetValue: 8, unit: "documentales/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO() },
      { id: generateId(), title: "Aprender y comprender 3 nuevos conceptos o hechos interesantes cada semana y ser capaz de explicarlos", currentValue: 0, targetValue: 3, unit: "conceptos/semana", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO() },
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
        // Check if the stored data adheres to the Objective structure and if KRs have all required fields
        if (Array.isArray(parsedObjectives) && parsedObjectives.every(obj => 
            obj.id && obj.title && Array.isArray(obj.keyResults) && 
            obj.keyResults.every(kr => 
                kr.id && kr.title && 
                kr.hasOwnProperty('currentValue') && typeof kr.currentValue === 'number' &&
                kr.hasOwnProperty('targetValue') && typeof kr.targetValue === 'number' &&
                kr.unit && typeof kr.unit === 'string' &&
                kr.trackingFrequency && typeof kr.trackingFrequency === 'string' &&
                kr.lastUpdated && typeof kr.lastUpdated === 'string' &&
                // targetDate is optional, so check its type if it exists
                (kr.targetDate === undefined || kr.targetDate === null || typeof kr.targetDate === 'string')
            )
        )) {
            setObjectives(parsedObjectives);
        } else {
            console.warn("Stored objectives are not in the expected format or missing fields. Loading example objectives.");
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
        targetDate: kr.targetDate || undefined, // Ensure targetDate is correctly passed
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
    // This would typically open the AddOkrDialog with initialData populated
    // For now, just a toast message.
    // setEditingObjective(objective); // You'd need state for this
    // setIsAddOkrDialogOpen(true);
    toast({ title: "Edit Action", description: `Editing: ${objective.title} (not fully implemented yet)`});
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
          // key={editingObjective ? editingObjective.id : 'add-new'} // To re-mount form for editing
          // initialData={editingObjective} // Pass data for editing
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


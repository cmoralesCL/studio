'use client';

import React, { useState, useEffect } from 'react';
import type { LifeOkr, AreaOkr, KeyResult, LifeOkrFormData, AreaOkrLevel, OkrIcon, SummaryCardData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AddOkrDialog } from '@/components/okr/AddOkrDialog';
import { OkrList } from '@/components/okr/OkrList';
import OkrOverallSummary from '@/components/okr/OkrOverallSummary';
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

const generateId = () => crypto.randomUUID();
const getCurrentISODate = () => new Date().toISOString();

const getNextWeekendDateISO = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : (7 - dayOfWeek); // if today is Sunday, target this Sunday
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);
  return nextSunday.toISOString();
};

const getEndOfCurrentMonthISO = () => endOfMonth(new Date()).toISOString();
const getEndOfCurrentQuarterISO = () => endOfQuarter(new Date()).toISOString();
const getEndOfYearISO = () => endOfYear(new Date()).toISOString();

const placeholderAssignee = (seed: string) => `https://picsum.photos/seed/${seed}/40/40`;

const exampleLifeOkrs: LifeOkr[] = [
  {
    id: generateId(),
    title: "Bienestar Integral",
    description: "Fomentar un equilibrio saludable entre el cuerpo y la mente para una vida plena.",
    icon: "Heart",
    areaOkrs: [
      {
        id: generateId(),
        title: "Optimizar Salud Física",
        description: "Mejorar la condición física general y hábitos alimenticios.",
        level: "Personal",
        icon: "Activity",
        keyResults: [
          { id: generateId(), title: "Realizar 150 minutos de ejercicio moderado por semana", currentValue: 75, targetValue: 150, unit: "minutos", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Ejercicio"], assignees: [placeholderAssignee('user1')], subTasks: { completed: 2, total: 3 } },
          { id: generateId(), title: "Consumir 5 porciones de frutas/verduras al día (objetivo semanal: 35)", currentValue: 20, targetValue: 35, unit: "porciones/sem", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Nutrición"], assignees: [placeholderAssignee('user1')], subTasks: { completed: 4, total: 7 }},
          { id: generateId(), title: "Dormir un promedio de 7 horas por noche", currentValue: 25*7*0.8, targetValue: 30*7, unit: "horas/mes", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Descanso"], assignees: [placeholderAssignee('user1')], subTasks: { completed: 15, total: 30 }},
        ],
      },
      {
        id: generateId(),
        title: "Fortalecer Salud Mental",
        description: "Cultivar la paz interior y mejorar el manejo del estrés.",
        level: "Personal",
        icon: "Smile",
        keyResults: [
          { id: generateId(), title: "Practicar meditación 10 minutos, 5 días/semana", currentValue: 3*4, targetValue: 5*4, unit: "sesiones/mes", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Mindfulness"], assignees: [placeholderAssignee('user2')], subTasks: { completed: 12, total: 20 } },
          { id: generateId(), title: "Dedicar 3 horas/semana a hobbies desestresantes", currentValue: 1*4, targetValue: 3*4, unit: "horas/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Hobbies"], assignees: [placeholderAssignee('user2')], subTasks: { completed: 1, total: 4 }},
          { id: generateId(), title: "Limitar exposición a noticias negativas a 30 mins/día", currentValue: 20, targetValue: 30, unit: "días cumplidos", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Bienestar Digital"], assignees: [placeholderAssignee('user2')], subTasks: { completed: 20, total: 30 }}
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: "Desarrollo Profesional y Carrera",
    description: "Crecer profesionalmente, adquirir nuevas competencias y alcanzar metas laborales.",
    icon: "Briefcase",
    areaOkrs: [
      {
        id: generateId(),
        title: "Adquirir Nueva Habilidad Técnica (IA Aplicada)",
        description: "Aprender y aplicar conocimientos en Inteligencia Artificial.",
        level: "Individual", // Could be 'Personal' if for self-enrichment or 'Individual' if job-related
        icon: "Zap",
        keyResults: [
          { id: generateId(), title: "Completar curso online avanzado de IA (10 módulos)", currentValue: 4, targetValue: 10, unit: "módulos", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Formación", "IA"], assignees: [placeholderAssignee('user3'), placeholderAssignee('user4')], subTasks: { completed: 2, total: 5 } },
          { id: generateId(), title: "Dedicar 8 horas/semana a estudio y práctica de IA", currentValue: 5*4, targetValue: 8*4, unit: "horas/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Estudio"], assignees: [placeholderAssignee('user3')], subTasks: { completed: 0, total: 0 }},
          { id: generateId(), title: "Desarrollar 1 proyecto práctico aplicando IA", currentValue: 0, targetValue: 1, unit: "proyecto", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Aplicación"], assignees: [placeholderAssignee('user3')], subTasks: { completed: 0, total: 2 } },
        ],
      },
       {
        id: generateId(),
        title: "Expandir Red Profesional",
        description: "Construir y mantener una red de contactos valiosa.",
        level: "Individual",
        icon: "Users",
        keyResults: [
          { id: generateId(), title: "Asistir a 1 evento de networking relevante por mes", currentValue: 1, targetValue: 3, unit: "eventos", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Networking"], assignees: [placeholderAssignee('user3')], subTasks: { completed: 0, total: 0 } },
          { id: generateId(), title: "Establecer 5 nuevas conexiones significativas en LinkedIn por semana", currentValue: 15, targetValue: 20, unit: "conexiones/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["LinkedIn", "Conexiones"], assignees: [placeholderAssignee('user3')], subTasks: { completed: 0, total: 0 } },
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: "Finanzas Personales Sólidas",
    description: "Lograr estabilidad y crecimiento financiero.",
    icon: "Landmark",
    areaOkrs: [
      {
        id: generateId(),
        title: "Incrementar Ahorros e Inversiones",
        description: "Mejorar la salud financiera a largo plazo.",
        level: "Personal",
        icon: "DollarSign",
        keyResults: [
          { id: generateId(), title: "Ahorrar el 20% de ingresos netos mensuales", currentValue: 15, targetValue: 20, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Ahorro"], assignees: [placeholderAssignee('user5')], subTasks: { completed: 1, total: 1 } },
          { id: generateId(), title: "Aumentar cartera de inversión en 10% este año", currentValue: 2, targetValue: 10, unit: "% anual", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: getEndOfYearISO(), tags: ["Inversión"], assignees: [placeholderAssignee('user5'), placeholderAssignee('user1')], subTasks: { completed: 1, total: 4 } },
          { id: generateId(), title: "Crear un fondo de emergencia de 3 meses de gastos", currentValue: 1, targetValue: 3, unit: "meses", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfYearISO(), tags: ["Emergencia"], assignees: [placeholderAssignee('user5')], subTasks: { completed: 0, total: 0 } },
        ],
      },
      {
        id: generateId(),
        title: "Optimizar Gastos y Presupuesto",
        description: "Gestionar eficientemente los gastos y adherirse a un presupuesto.",
        level: "Personal",
        icon: "Home",
        keyResults: [
            { id: generateId(), title: "Reducir gastos discrecionales en un 10% mensual", currentValue: 5, targetValue: 10, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Presupuesto", "Ahorro"], assignees: [placeholderAssignee('user5')], subTasks: {completed: 0, total: 0}},
            { id: generateId(), title: "Realizar seguimiento semanal de gastos y compararlo con el presupuesto", currentValue: 2, targetValue: 4, unit: "revisiones/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Control", "Presupuesto"], assignees: [placeholderAssignee('user5')], subTasks: {completed: 0, total: 0}},
        ]
      }
    ],
  },
  {
    id: generateId(),
    title: "Aprendizaje y Crecimiento Continuo",
    description: "Expandir conocimientos y habilidades en diversas áreas de interés.",
    icon: "BookOpen",
    areaOkrs: [
      {
        id: generateId(),
        title: "Dominar un Nuevo Idioma (Inglés B2)",
        description: "Alcanzar un nivel intermedio-alto en inglés.",
        level: "Personal",
        icon: "Zap", // Using Zap for the 'spark' of learning
        keyResults: [
          { id: generateId(), title: "Dedicar 5 horas/semana al estudio del idioma", currentValue: 3*4, targetValue: 5*4, unit: "horas/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Idioma", "Estudio"], assignees: [placeholderAssignee('user6')], subTasks: { completed: 0, total: 0 } },
          { id: generateId(), title: "Completar 2 niveles de una app de idiomas", currentValue: 0, targetValue: 2, unit: "niveles", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["App", "Progreso"], assignees: [placeholderAssignee('user6')], subTasks: { completed: 0, total: 0 } },
          { id: generateId(), title: "Mantener 1 conversación de 30 mins en inglés por semana", currentValue: 1, targetValue: 4, unit: "conversaciones/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Práctica", "Conversación"], assignees: [placeholderAssignee('user6')], subTasks: { completed: 0, total: 0 } },
        ]
      }
    ]
  },
  {
    id: generateId(),
    title: "Contribución y Relaciones Significativas",
    description: "Aportar valor a la comunidad y cultivar relaciones interpersonales profundas.",
    icon: "UsersRound",
    areaOkrs: [
        {
            id: generateId(),
            title: "Fortalecer Vínculos Familiares y de Amistad",
            description: "Dedicar tiempo de calidad y apoyo a seres queridos.",
            level: "Personal",
            icon: "Heart",
            keyResults: [
                { id: generateId(), title: "Tener 1 cena/actividad familiar de calidad por semana", currentValue: 2, targetValue: 4, unit: "actividades/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Familia"], assignees: [placeholderAssignee('user7')], subTasks: { completed: 0, total: 0 }},
                { id: generateId(), title: "Contactar proactivamente a 2 amigos por semana para conversar", currentValue: 5, targetValue: 8, unit: "contactos/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Amistad"], assignees: [placeholderAssignee('user7')], subTasks: { completed: 0, total: 0 }},
            ]
        },
        {
            id: generateId(),
            title: "Contribuir a la Comunidad Local",
            description: "Participar en iniciativas que mejoren el entorno.",
            level: "Personal", // Can be Individual if part of a CSR program
            icon: "Award", // Representing achievement through contribution
            keyResults: [
                { id: generateId(), title: "Dedicar 4 horas al mes a voluntariado", currentValue: 2, targetValue: 4, unit: "horas/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Voluntariado"], assignees: [placeholderAssignee('user8')], subTasks: { completed: 0, total: 0 }},
            ]
        }
    ]
  }
];


export default function OkrTrackerPage() {
  const [lifeOkrs, setLifeOkrs] = useState<LifeOkr[]>([]);
  const [isAddOkrDialogOpen, setIsAddOkrDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lifeOkrToDelete, setLifeOkrToDelete] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryCardData[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedLifeOkrs = localStorage.getItem('okrLifeOkrs');
    let loadedLifeOkrs = exampleLifeOkrs;
    if (storedLifeOkrs && storedLifeOkrs !== '[]') {
      try {
        const parsedLifeOkrs: LifeOkr[] = JSON.parse(storedLifeOkrs);
        // Add more robust validation if needed
        if (Array.isArray(parsedLifeOkrs) && parsedLifeOkrs.every(lo => lo.id && lo.title && Array.isArray(lo.areaOkrs))) {
            loadedLifeOkrs = parsedLifeOkrs;
        } else {
            console.warn("Stored Life OKRs are not in the expected format. Loading example OKRs.");
            localStorage.setItem('okrLifeOkrs', JSON.stringify(exampleLifeOkrs)); // Store valid examples
        }
      } catch (error) {
        console.error("Failed to parse Life OKRs from localStorage", error);
        localStorage.setItem('okrLifeOkrs', JSON.stringify(exampleLifeOkrs)); // Store valid examples on error
      }
    }
    setLifeOkrs(loadedLifeOkrs);
  }, []);

  useEffect(() => {
    if (isClient && lifeOkrs.length > 0) {
      localStorage.setItem('okrLifeOkrs', JSON.stringify(lifeOkrs));

      let totalKRs = 0;
      let completedKRs = 0;
      let totalProgressSum = 0;
      let krsWithProgress = 0;
      let earliestTargetDate: Date | null = null;
      let activeLifeOkrs = lifeOkrs.length; // Assuming all loaded LifeOkrs are active for now

      lifeOkrs.forEach(lifeOkr => {
        lifeOkr.areaOkrs.forEach(areaOkr => {
          areaOkr.keyResults.forEach(kr => {
            totalKRs++;
            const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : (kr.currentValue > 0 ? 100 : 0);
            if (progress >= 100) completedKRs++;
            totalProgressSum += Math.min(100, Math.max(0, progress)); // Cap progress at 100 and ensure non-negative
            krsWithProgress++;
            if (kr.targetDate) {
              const date = new Date(kr.targetDate);
              if (!earliestTargetDate || date < earliestTargetDate) {
                earliestTargetDate = date;
              }
            }
          });
        });
      });

      const overallAvgProgress = krsWithProgress > 0 ? totalProgressSum / krsWithProgress : 0;
      const daysLeft = earliestTargetDate ? differenceInDays(earliestTargetDate, new Date()) : null;
      
      const objectivesCount = lifeOkrs.reduce((acc, lo) => acc + lo.areaOkrs.length, 0);


      setSummaryStats([
        { id: 's1', title: 'Overall Progress', value: overallAvgProgress, unit: '%', progress: overallAvgProgress, variant: 'primary', type: 'circular-progress' },
        { id: 's2', title: 'Area Objectives', value: objectivesCount, unit: 'Active', variant: 'default', type: 'text-value' },
        { id: 's3', title: 'Habit OKRs Done', value: `${completedKRs}/${totalKRs}`, variant: 'accent', type: 'fraction' },
        { id: 's4', title: 'Next Deadline', value: daysLeft !== null && daysLeft >=0 ? daysLeft : 'N/A', unit: daysLeft !== null && daysLeft >=0 ? 'days left' : '', variant: daysLeft !==null && daysLeft < 7 && daysLeft >=0 ? 'warning' : 'default', type: 'text-value' },
      ]);

    } else if (isClient && lifeOkrs.length === 0) {
      localStorage.removeItem('okrLifeOkrs');
      setSummaryStats([
        { id: 's1', title: 'Overall Progress', value: 0, unit: '%', progress: 0, variant: 'primary', type: 'circular-progress' },
        { id: 's2', title: 'Area Objectives', value: 0, unit: 'Active', variant: 'default', type: 'text-value' },
        { id: 's3', title: 'Habit OKRs Done', value: `0/0`, variant: 'accent', type: 'fraction' },
        { id: 's4', title: 'Next Deadline', value: 'N/A', unit: '', variant: 'default', type: 'text-value' },
      ]);
    }
  }, [lifeOkrs, isClient]);


  const handleAddLifeOkr = async (data: LifeOkrFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const newLifeOkr: LifeOkr = {
      id: generateId(),
      title: data.title,
      description: data.description,
      icon: data.icon || 'Target',
      areaOkrs: data.areaOkrs.map(areaOkrData => ({
        id: generateId(),
        title: areaOkrData.title,
        description: areaOkrData.description,
        level: areaOkrData.level,
        icon: areaOkrData.icon || 'Target',
        keyResults: areaOkrData.keyResults.map(krData => ({
          ...krData,
          id: generateId(),
          currentValue: 0,
          lastUpdated: getCurrentISODate(),
          targetDate: krData.targetDate || undefined,
          tags: krData.tags || [],
          assignees: krData.assignees || [],
          subTasks: krData.subTasks || { completed: 0, total: 0 },
        })),
      })),
    };
    setLifeOkrs(prev => [newLifeOkr, ...prev]);
    setIsLoading(false);
    setIsAddOkrDialogOpen(false);
    toast({
      title: "Life OKR Added",
      description: `"${newLifeOkr.title}" has been successfully added.`,
      variant: "default",
    });
  };

  const handleUpdateKeyResult = (lifeOkrId: string, areaOkrId: string, krId: string, newCurrentValue: number) => {
    setLifeOkrs(prevLifeOkrs =>
      prevLifeOkrs.map(lifeOkr => {
        if (lifeOkr.id === lifeOkrId) {
          return {
            ...lifeOkr,
            areaOkrs: lifeOkr.areaOkrs.map(areaOkr => {
              if (areaOkr.id === areaOkrId) {
                return {
                  ...areaOkr,
                  keyResults: areaOkr.keyResults.map(kr =>
                    kr.id === krId ? { ...kr, currentValue: newCurrentValue, lastUpdated: getCurrentISODate() } : kr
                  ),
                };
              }
              return areaOkr;
            }),
          };
        }
        return lifeOkr;
      })
    );
    toast({
        title: "Key Result Updated",
        description: "Progress has been saved.",
    });
  };

  const confirmDeleteLifeOkr = (id: string) => {
    setLifeOkrToDelete(id);
  };

  const handleDeleteLifeOkr = () => {
    if (!lifeOkrToDelete) return;
    const lifeOkr = lifeOkrs.find(lo => lo.id === lifeOkrToDelete);
    setLifeOkrs(prev => prev.filter(lo => lo.id !== lifeOkrToDelete));
    setLifeOkrToDelete(null);
    if (lifeOkr) {
      toast({
        title: "Life OKR Deleted",
        description: `"${lifeOkr.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };
  
  const handleEditLifeOkr = (lifeOkr: LifeOkr) => {
    // This will be implemented later. For now, this function is passed to OkrCard.
    toast({ title: "Edit Action (Placeholder)", description: `Editing Life OKR: ${lifeOkr.title} (not fully implemented yet)`});
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
          <h1 className="text-2xl font-semibold text-foreground">My Life OKRs</h1>
          <Button onClick={() => setIsAddOkrDialogOpen(true)} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Life OKR
          </Button>
        </div>

        <OkrList 
          lifeOkrs={lifeOkrs} 
          onUpdateKeyResult={handleUpdateKeyResult} 
          onDeleteLifeOkr={confirmDeleteLifeOkr}
          onEditLifeOkr={handleEditLifeOkr}
        />
        
        <AddOkrDialog
          isOpen={isAddOkrDialogOpen}
          onOpenChange={setIsAddOkrDialogOpen}
          onAddObjective={handleAddLifeOkr} // Prop name kept for compatibility, but handles LifeOkrFormData
          isLoading={isLoading}
        />

        {lifeOkrToDelete && (
          <AlertDialog open={!!lifeOkrToDelete} onOpenChange={() => setLifeOkrToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this Life OKR?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the Life OKR
                  "{lifeOkrs.find(lo => lo.id === lifeOkrToDelete)?.title}" and all its associated Area OKRs and Key Results.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setLifeOkrToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteLifeOkr} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
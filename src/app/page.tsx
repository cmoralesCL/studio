
'use client';

import React, { useState, useEffect } from 'react';
import type { LifeOkr, AreaOkr, KeyResult, LifeOkrFormData, AreaOkrLevel, OkrIcon, SummaryCardData, SummaryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AddOkrDialog } from '@/components/okr/AddOkrDialog';
import { OkrList } from '@/components/okr/OkrList';
import OkrOverallSummary from '@/components/okr/OkrOverallSummary';
import { TaskColumns } from '@/components/okr/TaskColumns';
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
import { addDays, endOfYear, formatISO, endOfMonth, endOfQuarter, differenceInDays, isWithinInterval, startOfDay, isToday, isTomorrow, isSameDay } from 'date-fns';

const generateId = () => crypto.randomUUID();
const getCurrentISODate = () => new Date().toISOString();

const getNextWeekendDateISO = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : (7 - dayOfWeek); 
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);
  return nextSunday.toISOString();
};

const getEndOfCurrentMonthISO = () => endOfMonth(new Date()).toISOString();
const getEndOfCurrentQuarterISO = () => endOfQuarter(new Date()).toISOString();
const getEndOfYearISO = () => endOfYear(new Date()).toISOString();
const getTodayISO = () => startOfDay(new Date()).toISOString();
const getTomorrowISO = () => startOfDay(addDays(new Date(), 1)).toISOString();
const getDayAfterTomorrowISO = () => startOfDay(addDays(new Date(), 2)).toISOString();


const placeholderAssignee = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\s+/g, '_')}/40/40`; // Ensure seed is URL friendly

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
          { id: generateId(), title: "Realizar 150 minutos de ejercicio moderado por semana", currentValue: 100, targetValue: 150, unit: "minutos", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Ejercicio"], assignees: [placeholderAssignee('Ana Fisica')], subTasks: { completed: 2, total: 3 } },
          { id: generateId(), title: "Consumir 5 porciones de frutas/verduras al día", currentValue: 28, targetValue: 35, unit: "porciones/sem", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getNextWeekendDateISO(), tags: ["Nutrición"], assignees: [placeholderAssignee('Ana Fisica')], subTasks: { completed: 4, total: 7 }},
          { id: generateId(), title: "Dormir un promedio de 7 horas por noche este mes", currentValue: 180, targetValue: 210, unit: "horas/mes", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Descanso"], assignees: [placeholderAssignee('Ana Fisica')], subTasks: { completed: 20, total: 30 }},
        ],
      },
      {
        id: generateId(),
        title: "Fortalecer Salud Mental",
        description: "Cultivar la paz interior y mejorar el manejo del estrés.",
        level: "Personal",
        icon: "Smile",
        keyResults: [
          { id: generateId(), title: "Meditar 10 minutos, 5 días/semana", currentValue: 15, targetValue: 20, unit: "sesiones/mes", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Mindfulness"], assignees: [placeholderAssignee('Carlos Mental')], subTasks: { completed: 15, total: 20 } },
          { id: generateId(), title: "Dedicar 3 horas/semana a hobbies desestresantes", currentValue: 8, targetValue: 12, unit: "horas/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Hobbies"], assignees: [placeholderAssignee('Carlos Mental')], subTasks: { completed: 2, total: 4 }},
          { id: generateId(), title: "Limitar noticias negativas a 30 mins/día (hoy)", currentValue: 1, targetValue: 1, unit: "día cumplido", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getTodayISO(), tags: ["Bienestar Digital"], assignees: [placeholderAssignee('Carlos Mental')], subTasks: { completed: 1, total: 1 }}
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
        title: "Adquirir Habilidad en IA Aplicada",
        description: "Aprender y aplicar conocimientos en Inteligencia Artificial.",
        level: "Individual",
        icon: "Zap",
        keyResults: [
          { id: generateId(), title: "Completar curso online avanzado de IA", currentValue: 7, targetValue: 10, unit: "módulos", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Formación", "IA"], assignees: [placeholderAssignee('David IA'), placeholderAssignee('Eva IA')], subTasks: { completed: 3, total: 5 } },
          { id: generateId(), title: "Dedicar 8 horas/semana a estudio de IA (pasado mañana)", currentValue: 0, targetValue: 1, unit: "sesión de estudio", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getDayAfterTomorrowISO(), tags: ["Estudio"], assignees: [placeholderAssignee('David IA')], subTasks: { completed: 0, total: 1 }},
          { id: generateId(), title: "Desarrollar 1 proyecto práctico con IA este trimestre", currentValue: 0, targetValue: 1, unit: "proyecto", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Aplicación"], assignees: [placeholderAssignee('David IA')], subTasks: { completed: 0, total: 3 } },
        ],
      },
       {
        id: generateId(),
        title: "Expandir Red Profesional",
        description: "Construir y mantener una red de contactos valiosa.",
        level: "Individual",
        icon: "Users",
        keyResults: [
          { id: generateId(), title: "Asistir a 1 evento de networking/mes", currentValue: 2, targetValue: 3, unit: "eventos", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["Networking"], assignees: [placeholderAssignee('Laura Red')]},
          { id: generateId(), title: "5 nuevas conexiones LinkedIn/semana (mañana)", currentValue: 0, targetValue: 1, unit: "objetivo semanal", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getTomorrowISO(), tags: ["LinkedIn"], assignees: [placeholderAssignee('Laura Red')], subTasks: { completed: 0, total: 1 } },
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
          { id: generateId(), title: "Ahorrar el 20% de ingresos netos mensuales", currentValue: 18, targetValue: 20, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Ahorro"], assignees: [placeholderAssignee('Sofia Finanzas')], subTasks: { completed: 1, total: 1 } },
          { id: generateId(), title: "Aumentar cartera de inversión en 10% este año", currentValue: 3, targetValue: 10, unit: "% anual", trackingFrequency: "annually", lastUpdated: getCurrentISODate(), targetDate: getEndOfYearISO(), tags: ["Inversión"], assignees: [placeholderAssignee('Sofia Finanzas'), placeholderAssignee('Ana Fisica')], subTasks: { completed: 1, total: 4 } },
          { id: generateId(), title: "Fondo de emergencia de 3 meses de gastos (hoy)", currentValue: 2.5, targetValue: 3, unit: "meses", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: getTodayISO(), tags: ["Emergencia"], assignees: [placeholderAssignee('Sofia Finanzas')], subTasks: { completed: 2, total: 3 } },
        ],
      },
      {
        id: generateId(),
        title: "Optimizar Gastos y Presupuesto",
        description: "Gestionar eficientemente los gastos y adherirse a un presupuesto.",
        level: "Personal",
        icon: "Home",
        keyResults: [
            { id: generateId(), title: "Reducir gastos discrecionales en 10% mensual", currentValue: 7, targetValue: 10, unit: "% mensual", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Presupuesto"], assignees: [placeholderAssignee('Sofia Finanzas')]},
            { id: generateId(), title: "Revisión semanal de gastos vs presupuesto (pasado mañana)", currentValue: 0, targetValue: 1, unit: "revisión", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getDayAfterTomorrowISO(), tags: ["Control"], assignees: [placeholderAssignee('Sofia Finanzas')]},
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
        icon: "Zap",
        keyResults: [
          { id: generateId(), title: "Dedicar 5 horas/semana al estudio del idioma", currentValue: 15, targetValue: 20, unit: "horas/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Idioma", "Estudio"], assignees: [placeholderAssignee('Miguel Idioma')]},
          { id: generateId(), title: "Completar 2 niveles de app de idiomas este trimestre", currentValue: 1, targetValue: 2, unit: "niveles", trackingFrequency: "quarterly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentQuarterISO(), tags: ["App", "Progreso"], assignees: [placeholderAssignee('Miguel Idioma')]},
          { id: generateId(), title: "Conversación de 30 mins en inglés/semana (mañana)", currentValue: 0, targetValue: 1, unit: "conversación", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getTomorrowISO(), tags: ["Práctica"], assignees: [placeholderAssignee('Miguel Idioma')]},
        ]
      },
      {
        id: generateId(),
        title: "Leer 12 Libros este Año",
        description: "Expandir cultura general y conocimientos diversos.",
        level: "Personal",
        icon: "Brain",
        keyResults: [
          { id: generateId(), title: "Leer un libro por mes", currentValue: 4, targetValue: 12, unit: "libros", trackingFrequency: "annually", lastUpdated: getCurrentISODate(), targetDate: getEndOfYearISO(), tags: ["Lectura", "Cultura"], assignees: [placeholderAssignee('Sara Libros')]},
          { id: generateId(), title: "Dedicar 30 minutos a la lectura diaria (hoy)", currentValue: 1, targetValue: 1, unit: "día cumplido", trackingFrequency: "daily", lastUpdated: getCurrentISODate(), targetDate: getTodayISO(), tags: ["Hábito"], assignees: [placeholderAssignee('Sara Libros')]},
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
                { id: generateId(), title: "Actividad familiar de calidad/semana", currentValue: 3, targetValue: 4, unit: "actividades/mes", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Familia"], assignees: [placeholderAssignee('Pedro Relaciones')]},
                { id: generateId(), title: "Contactar 2 amigos/semana (mañana)", currentValue: 0, targetValue: 1, unit: "objetivo semanal", trackingFrequency: "weekly", lastUpdated: getCurrentISODate(), targetDate: getTomorrowISO(), tags: ["Amistad"], assignees: [placeholderAssignee('Pedro Relaciones')]},
            ]
        },
        {
            id: generateId(),
            title: "Contribuir a la Comunidad Local",
            description: "Participar en iniciativas que mejoren el entorno.",
            level: "Personal",
            icon: "Award",
            keyResults: [
                { id: generateId(), title: "Dedicar 4 horas al mes a voluntariado", currentValue: 2, targetValue: 4, unit: "horas/mes", trackingFrequency: "monthly", lastUpdated: getCurrentISODate(), targetDate: getEndOfCurrentMonthISO(), tags: ["Voluntariado"], assignees: [placeholderAssignee('Isabel Comunidad')]},
                { id: generateId(), title: "Participar en 1 limpieza de parque (pasado mañana)", currentValue: 0, targetValue: 1, unit: "evento", trackingFrequency: "once", lastUpdated: getCurrentISODate(), targetDate: getDayAfterTomorrowISO(), tags: ["Comunidad"], assignees: [placeholderAssignee('Isabel Comunidad')]},
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
  const [tasksToday, setTasksToday] = useState<KeyResult[]>([]);
  const [tasksTomorrow, setTasksTomorrow] = useState<KeyResult[]>([]);
  const [tasksDayAfterTomorrow, setTasksDayAfterTomorrow] = useState<KeyResult[]>([]);

  const [editingLifeOkr, setEditingLifeOkr] = useState<LifeOkr | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);


  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedLifeOkrs = localStorage.getItem('okrLifeOkrs');
    let loadedLifeOkrs = exampleLifeOkrs;
    if (storedLifeOkrs && storedLifeOkrs !== '[]') {
      try {
        const parsedLifeOkrs: LifeOkr[] = JSON.parse(storedLifeOkrs);
        if (Array.isArray(parsedLifeOkrs) && parsedLifeOkrs.every(lo => lo.id && lo.title && Array.isArray(lo.areaOkrs))) {
            loadedLifeOkrs = parsedLifeOkrs;
        } else {
            console.warn("Stored Life OKRs are not in the expected format. Loading example OKRs.");
            localStorage.setItem('okrLifeOkrs', JSON.stringify(exampleLifeOkrs));
        }
      } catch (error) {
        console.error("Failed to parse Life OKRs from localStorage", error);
        localStorage.setItem('okrLifeOkrs', JSON.stringify(exampleLifeOkrs));
      }
    }
    setLifeOkrs(loadedLifeOkrs);
  }, []);

  useEffect(() => {
    if (isClient && lifeOkrs.length > 0) {
      localStorage.setItem('okrLifeOkrs', JSON.stringify(lifeOkrs));

      let totalKRs = 0;
      let completedKRs = 0;
      let onTrackKRs = 0;
      let atRiskKRs = 0;
      let totalProgressSum = 0;
      let krsWithProgress = 0;
      let earliestTargetDate: Date | null = null;
      let krsDueSoonCount = 0;
      
      const todayDt = startOfDay(new Date());
      const tomorrowDt = startOfDay(addDays(todayDt, 1));
      const dayAfterTomorrowDt = startOfDay(addDays(todayDt, 2));
      const sevenDaysFromNow = addDays(todayDt, 7);

      const krsToday: KeyResult[] = [];
      const krsTomorrow: KeyResult[] = [];
      const krsDayAfterTomorrow: KeyResult[] = [];


      lifeOkrs.forEach(lifeOkr => {
        lifeOkr.areaOkrs.forEach(areaOkr => {
          areaOkr.keyResults.forEach(kr => {
            totalKRs++;
            const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : (kr.currentValue > 0 ? 100 : 0);
            const cappedProgress = Math.min(100, Math.max(0, progress));

            if (cappedProgress >= 100) {
              completedKRs++;
            } else if (cappedProgress >= 70) {
              onTrackKRs++;
            } else if (cappedProgress < 40) {
              atRiskKRs++;
            }
            
            totalProgressSum += cappedProgress;
            if (kr.targetValue > 0 || kr.currentValue > 0) { 
                 krsWithProgress++;
            }

            const krWithContext: KeyResult = {
              ...kr,
              parentAreaOkrTitle: areaOkr.title,
              parentLifeOkrTitle: lifeOkr.title,
            };


            if (kr.targetDate && cappedProgress < 100) { 
              const krDate = startOfDay(new Date(kr.targetDate));
              if (!earliestTargetDate || krDate < earliestTargetDate) {
                earliestTargetDate = krDate;
              }
              if (isWithinInterval(krDate, { start: todayDt, end: sevenDaysFromNow })) {
                krsDueSoonCount++;
              }
              if (isSameDay(krDate, todayDt)) {
                krsToday.push(krWithContext);
              } else if (isSameDay(krDate, tomorrowDt)) {
                krsTomorrow.push(krWithContext);
              } else if (isSameDay(krDate, dayAfterTomorrowDt)) {
                krsDayAfterTomorrow.push(krWithContext);
              }
            }
          });
        });
      });
      
      setTasksToday(krsToday);
      setTasksTomorrow(krsTomorrow);
      setTasksDayAfterTomorrow(krsDayAfterTomorrow);

      const overallAvgProgress = krsWithProgress > 0 ? totalProgressSum / krsWithProgress : 0;
      const daysLeftToNextDeadline = earliestTargetDate ? differenceInDays(earliestTargetDate, todayDt) : null;
      
      const activeLifeOkrsCount = lifeOkrs.length;
      const activeAreaOkrsCount = lifeOkrs.reduce((acc, lo) => acc + lo.areaOkrs.length, 0);
      
      const objectivesOverviewItems: SummaryItem[] = [
        { id: 'loCount', label: 'Life OKRs Active', value: activeLifeOkrsCount, icon: 'Heart', variant: 'primary' },
        { id: 'aoCount', label: 'Area Objectives Active', value: activeAreaOkrsCount, icon: 'Target', variant: 'primary' },
      ];

      const krStatusItems: SummaryItem[] = [
        { id: 'krsDone', label: 'Completed', value: `${completedKRs}/${totalKRs}`, icon: 'CheckCircle2', variant: 'success' },
        { id: 'krsOnTrack', label: 'On Track (>=70%)', value: onTrackKRs, unit: 'KRs', icon: 'TrendingUp', variant: 'accent' },
        { id: 'krsAtRisk', label: 'At Risk (<40%)', value: atRiskKRs, unit: 'KRs', icon: 'AlertTriangle', variant: 'danger' },
      ];
      
      let deadlineText: string | number = 'N/A';
      let deadlineUnit: string | undefined = '';
      let deadlineVariant: SummaryCardData['cardVariant'] = 'default';

      if (daysLeftToNextDeadline !== null) {
        if (daysLeftToNextDeadline < 0) {
          deadlineText = `${Math.abs(daysLeftToNextDeadline)}`;
          deadlineUnit = `days overdue`;
          deadlineVariant = 'destructive';
        } else if (daysLeftToNextDeadline === 0) {
          deadlineText = 'Today';
          deadlineVariant = 'warning';
        } else {
          deadlineText = daysLeftToNextDeadline;
          deadlineUnit = daysLeftToNextDeadline === 1 ? 'day left' : 'days left';
          deadlineVariant = daysLeftToNextDeadline < 7 ? 'warning' : 'default';
        }
      }

      const upcomingFocusItems: SummaryItem[] = [
        { id: 'deadline', label: 'Next Deadline', value: deadlineText, unit: deadlineUnit, icon: 'CalendarClock', variant: deadlineVariant === 'destructive' ? 'danger' : deadlineVariant === 'warning' ? 'warning' : 'default' },
        { id: 'dueSoon', label: 'KRs Due (7 days)', value: krsDueSoonCount, unit: 'KRs', icon: 'ListTodo', variant: krsDueSoonCount > 0 ? 'warning' : 'default' },
      ];

      setSummaryStats([
        { 
          id: 's1', 
          title: 'Overall Progress', 
          type: 'circular-progress', 
          progressValue: parseFloat(overallAvgProgress.toFixed(0)), 
          progressPercent: overallAvgProgress,
          progressUnit: '%',
          progressVariant: overallAvgProgress >= 70 ? 'success' : overallAvgProgress >= 40 ? 'warning' : 'danger',
          cardVariant: 'primary'
        },
        { 
          id: 's2', 
          title: 'Objectives Overview', 
          type: 'detailed-list', 
          items: objectivesOverviewItems,
          cardVariant: 'default' 
        },
        { 
          id: 's3', 
          title: 'Key Results Status', 
          type: 'detailed-list', 
          items: krStatusItems,
          cardVariant: 'default' 
        },
        { 
          id: 's4', 
          title: 'Upcoming Focus', 
          type: 'detailed-list', 
          items: upcomingFocusItems,
          cardVariant: 'default'
        },
      ]);

    } else if (isClient && lifeOkrs.length === 0) {
      localStorage.removeItem('okrLifeOkrs');
      setTasksToday([]);
      setTasksTomorrow([]);
      setTasksDayAfterTomorrow([]);
      setSummaryStats([
        { id: 's1', title: 'Overall Progress', type: 'circular-progress', progressValue: 0, progressPercent: 0, progressUnit: '%', progressVariant: 'default', cardVariant: 'primary' },
        { id: 's2', title: 'Objectives Overview', type: 'detailed-list', items: [
            { id: 'loCountEmpty', label: 'Life OKRs Active', value: 0, icon: 'Heart', variant: 'muted'},
            { id: 'aoCountEmpty', label: 'Area Objectives Active', value: 0, icon: 'Target', variant: 'muted'},
        ], cardVariant: 'default' },
        { id: 's3', title: 'Key Results Status', type: 'detailed-list', items: [
            { id: 'krsDoneEmpty', label: 'Completed', value: '0/0', icon: 'CheckCircle2', variant: 'muted'},
            { id: 'krsOnTrackEmpty', label: 'On Track', value: 0, unit: 'KRs', icon: 'TrendingUp', variant: 'muted'},
            { id: 'krsAtRiskEmpty', label: 'At Risk', value: 0, unit: 'KRs', icon: 'AlertTriangle', variant: 'muted'},
        ], cardVariant: 'default' },
        { id: 's4', title: 'Upcoming Focus', type: 'detailed-list', items: [
            { id: 'deadlineEmpty', label: 'Next Deadline', value: 'N/A', icon: 'CalendarClock', variant: 'muted'},
            { id: 'dueSoonEmpty', label: 'KRs Due (7 days)', value: 0, unit: 'KRs', icon: 'ListTodo', variant: 'muted'},
        ], cardVariant: 'default' },
      ]);
    }
  }, [lifeOkrs, isClient]);


  const handleAddLifeOkr = async (data: LifeOkrFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const newLifeOkr: LifeOkr = {
      id: generateId(), // New ID for the Life OKR
      title: data.title,
      description: data.description,
      icon: data.icon || 'Target',
      areaOkrs: data.areaOkrs.map(areaOkrData => ({
        id: generateId(), // New ID for each Area OKR
        title: areaOkrData.title,
        description: areaOkrData.description,
        level: areaOkrData.level,
        icon: areaOkrData.icon || 'Target',
        keyResults: areaOkrData.keyResults.map(krData => ({
          ...krData,
          id: generateId(), // New ID for each Key Result
          currentValue: 0, // Initial current value for new KRs
          lastUpdated: getCurrentISODate(),
          targetDate: krData.targetDate || undefined, // Ensure optional fields are handled
          tags: krData.tags || [],
          assignees: krData.assignees || [],
          subTasks: krData.subTasks || { completed: 0, total: 0 },
        })),
      })),
    };
    setLifeOkrs(prev => [newLifeOkr, ...prev]);
    setIsLoading(false);
    setIsAddOkrDialogOpen(false); // Close dialog after adding
    toast({
      title: "Life OKR Added",
      description: `"${newLifeOkr.title}" has been successfully added.`,
      variant: "default",
    });
  };

  const handleUpdateLifeOkr = async (updatedData: LifeOkrFormData) => {
    if (!editingLifeOkr) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedLifeOkrs = lifeOkrs.map(lo => {
      if (lo.id === editingLifeOkr.id) {
        // Preserve the original Life OKR ID
        // Area OKRs and Key Results might get new IDs if the form structure changes them
        // or if they are re-generated by the form's Zod schema transformations.
        // For simplicity, we assume the form data provides the full desired structure.
        return {
          ...updatedData, // Spread the form data
          id: editingLifeOkr.id, // Ensure original LifeOKR ID is kept
          areaOkrs: updatedData.areaOkrs.map(areaOkrData => ({
            ...areaOkrData,
            // If AreaOkr IDs from the form are not reliable or always new, generate new ones
            // or implement more sophisticated merging if IDs need to be preserved from form.
            // For now, let's assume form data might not carry valid old IDs for sub-items.
            id: areaOkrData.id || generateId(), // Attempt to use form ID or generate new
            keyResults: areaOkrData.keyResults.map(krData => ({
                ...krData,
                id: krData.id || generateId(), // Attempt to use form ID or generate new
                lastUpdated: getCurrentISODate(), // Always update lastUpdated
            })),
          })),
        } as LifeOkr; // Type assertion
      }
      return lo;
    });

    setLifeOkrs(updatedLifeOkrs);
    setIsLoading(false);
    setIsAddOkrDialogOpen(false);
    setEditingLifeOkr(null);
    setIsEditMode(false);
    toast({
      title: "Life OKR Updated",
      description: `"${updatedData.title}" has been successfully updated.`,
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
  
  const handleEditLifeOkr = (lifeOkrToEdit: LifeOkr) => {
    setEditingLifeOkr(lifeOkrToEdit);
    setIsEditMode(true);
    setIsAddOkrDialogOpen(true);
    // toast({ title: "Edit Action (Life OKR)", description: `Editing Life OKR: ${lifeOkr.title} (not fully implemented yet)`});
  };

  const handleEditAreaOkr = (areaOkr: AreaOkr, lifeOkrId: string) => {
    const lifeOkr = lifeOkrs.find(lo => lo.id === lifeOkrId);
    toast({ title: "Edit Action (Area OKR)", description: `Editing Area OKR: "${areaOkr.title}" under Life OKR: "${lifeOkr?.title}" (feature coming soon)`});
  };

  const handleEditKeyResult = (keyResult: KeyResult, areaOkrId: string, lifeOkrId: string) => {
     const lifeOkr = lifeOkrs.find(lo => lo.id === lifeOkrId);
     const areaOkr = lifeOkr?.areaOkrs.find(ao => ao.id === areaOkrId);
    toast({ title: "Edit Action (Key Result)", description: `Editing Key Result: "${keyResult.title}" under Area OKR: "${areaOkr?.title}" (feature coming soon)`});
  };

  const openAddOkrDialog = () => {
    setEditingLifeOkr(null);
    setIsEditMode(false);
    setIsAddOkrDialogOpen(true);
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

        <TaskColumns 
          tasksToday={tasksToday}
          tasksTomorrow={tasksTomorrow}
          tasksDayAfterTomorrow={tasksDayAfterTomorrow}
        />
        
        <div className="flex justify-between items-center mb-6 mt-8">
          <h1 className="text-2xl font-semibold text-foreground">My Life OKRs</h1>
          <Button onClick={openAddOkrDialog} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Life OKR
          </Button>
        </div>

        <OkrList 
          lifeOkrs={lifeOkrs} 
          onUpdateKeyResult={handleUpdateKeyResult} 
          onDeleteLifeOkr={confirmDeleteLifeOkr}
          onEditLifeOkr={handleEditLifeOkr}
          onEditAreaOkr={handleEditAreaOkr}
          onEditKeyResult={handleEditKeyResult}
        />
        
        <AddOkrDialog
          isOpen={isAddOkrDialogOpen}
          onOpenChange={setIsAddOkrDialogOpen}
          onAddObjective={handleAddLifeOkr} 
          onUpdateObjective={handleUpdateLifeOkr}
          initialData={editingLifeOkr ?? undefined}
          isEditMode={isEditMode}
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


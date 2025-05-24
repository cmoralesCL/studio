export type TrackingFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

// Expanded icon set for more variety
export type OkrIcon = 
  | 'Heart'       // General well-being, relationships
  | 'Zap'         // Energy, new initiatives, innovation
  | 'Target'      // General goals, precision
  | 'Briefcase'   // Career, professional development
  | 'Activity'    // Physical health, exercise
  | 'Landmark'    // Finance, stability, major life goals
  | 'Users'       // Social, community, teamwork
  | 'Award'       // Achievements, skills, recognition
  | 'FolderArchive' // Organization, knowledge management
  | 'Smile'       // Mental health, happiness
  | 'BookOpen'    // Learning, education
  | 'DollarSign'  // Specific to finance
  | 'Home'        // Home life, personal projects
  | 'Brain'       // Mental acuity, learning new skills
  | 'TrendingUp'  // Growth, improvement
  | 'ShieldCheck' // Security, safety
  | 'CheckCircle2' // For completed items
  | 'AlertTriangle' // For warnings or at-risk items
  | 'CalendarClock' // For deadlines
  | 'ListTodo';     // For tasks due soon


export interface KeyResult { // Represents a Habit OKR
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trackingFrequency: TrackingFrequency;
  lastUpdated: string; // ISO date string
  targetDate?: string;
  tags?: string[];
  subTasks?: {
    completed: number;
    total: number;
  };
  assignees?: string[];
  // Added to provide context when KRs are displayed outside their parent OKRs
  parentAreaOkrTitle?: string; 
  parentLifeOkrTitle?: string;
}

export type AreaOkrLevel = 'Company' | 'Team' | 'Individual' | 'Personal';

export interface AreaOkr {
  id: string;
  title: string;
  description?: string;
  level: AreaOkrLevel;
  icon?: OkrIcon;
  keyResults: KeyResult[]; // List of Habit OKRs
}

export interface LifeOkr { // Represents a Life OKR (top-level)
  id: string;
  title: string;
  description?: string;
  icon?: OkrIcon; // Icon for the Life OKR category
  areaOkrs: AreaOkr[]; // List of Area OKRs
}

// Form Data Types
export interface KeyResultFormData {
  title: string;
  targetValue: number;
  unit: string;
  trackingFrequency: TrackingFrequency;
  targetDate?: string;
  tags?: string[]; // Will be string in form, transformed to array
  assignees?: string[]; // Will be string in form, transformed to array
  subTasks?: { // In form, these will be separate fields: subTasksCompleted, subTasksTotal
    completed: number;
    total: number;
  };
}

export interface AreaOkrFormData {
  title: string;
  description?: string;
  level: AreaOkrLevel;
  icon?: OkrIcon;
  keyResults: KeyResultFormData[];
}

export interface LifeOkrFormData { // Was ObjectiveFormData
  title: string;
  description?: string;
  icon?: OkrIcon;
  areaOkrs: AreaOkrFormData[];
}

// New types for enhanced OkrOverallSummary
export type SummaryItemVariant = 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'accent' | 'muted';

export interface SummaryItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  variant?: SummaryItemVariant;
  icon?: OkrIcon; 
}

export interface SummaryCardData {
  id: string;
  title: string;
  type: 'circular-progress' | 'detailed-list';
  // Overall card theme/accent - might be used for title color or a subtle border/background hint
  cardVariant?: 'default' | 'primary' | 'accent' | 'warning' | 'destructive'; 

  // For circular-progress
  progressValue?: number; // The number shown in the middle (e.g., 75)
  progressPercent?: number; // The actual progress for the bar (0-100) (e.g. 75 for 75%)
  progressUnit?: string; // e.g., "%" or "KRs"
  progressVariant?: SummaryItemVariant; // Variant for the progress bar color and text color of progressValue

  // For detailed-list
  items?: SummaryItem[];
}

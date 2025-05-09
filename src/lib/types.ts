export type TrackingFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

export interface KeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string; // e.g., '%', 'USD', 'tasks'
  trackingFrequency: TrackingFrequency;
  lastUpdated: string; // ISO date string
  targetDate?: string; // Optional: Specific deadline for the KR or current cycle
  tags?: string[]; // For displaying tags like "Product", "Marketing"
  subTasks?: { // For displaying progress like "2/5"
    completed: number;
    total: number;
  };
  assignees?: string[]; // Array of image URLs for assignees
}

export type ObjectiveLevel = 'Company' | 'Team' | 'Individual' | 'Personal';

export interface Objective {
  id: string;
  title: string;
  description?: string;
  level: ObjectiveLevel;
  keyResults: KeyResult[];
  icon?: 'Heart' | 'Zap' | 'Target' | 'Briefcase' | 'Activity' | 'Landmark' | 'Users' | 'Award' | 'FolderArchive'; // For objective icon
}

// For form handling, especially before an ID is generated
export interface KeyResultFormData {
  title: string;
  targetValue: number;
  unit: string;
  trackingFrequency: TrackingFrequency;
  targetDate?: string; // Optional
  tags?: string[];
  subTasks?: {
    completed: number;
    total: number;
  };
  assignees?: string[];
}

export interface ObjectiveFormData {
  title:string;
  description?: string;
  level: ObjectiveLevel;
  keyResults: KeyResultFormData[];
  icon?: 'Heart' | 'Zap' | 'Target' | 'Briefcase' | 'Activity' | 'Landmark' | 'Users' | 'Award' | 'FolderArchive';
}

// For the top summary cards
export interface SummaryCardData {
  id: string;
  title: string; // e.g., "NCS", "Overall Progress", "Tasks Done", "Days Left"
  value: string | number; // The main value displayed, e.g., 40, "60%", "3/12", 12
  unit?: string; // e.g., "NCS", "%", "days left"
  progress?: number; // For circular progress, 0-100
  variant: 'default' | 'primary' | 'accent' | 'warning' | 'destructive'; // To color the progress or text
  type: 'circular-progress' | 'text-value' | 'fraction';
}

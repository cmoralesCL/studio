export interface KeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string; // e.g., '%', 'USD', 'tasks'
}

export type ObjectiveLevel = 'Company' | 'Team' | 'Individual' | 'Personal';

export interface Objective {
  id: string;
  title: string;
  description?: string;
  level: ObjectiveLevel;
  keyResults: KeyResult[];
}

// For form handling, especially before an ID is generated
export interface KeyResultFormData {
  title: string;
  targetValue: number;
  unit: string;
}

export interface ObjectiveFormData {
  title: string;
  description?: string;
  level: ObjectiveLevel;
  keyResults: KeyResultFormData[];
}

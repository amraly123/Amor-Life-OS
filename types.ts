
export enum LifeRole {
  ENTREPRENEUR = 'رائد أعمال',
  EDUCATOR = 'مربي ومعلم',
  FAMILY = 'أب وزوج',
  LEARNER = 'متعلم مستمر',
  CREATIVE = 'مبدع'
}

export interface WeeklyVictory {
  title: string;
  description: string;
  reward: string; // "فرحة الأسبوع" أو "فخر الأسبوع"
  progress: number;
}

export interface Goal {
  id: string;
  title: string;
  objective: string;
  keyResults: { id: string; text: string; completed: boolean }[];
  category: 'Personal' | 'Work' | 'Creative';
  deadline: string;
  progress: number;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Incubating' | 'Active';
  type: 'Project' | 'Novel' | 'Education';
  createdAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  urgent: boolean;
  important: boolean;
  completed: boolean;
  duration: number; // in minutes
  goalId?: string;
  status?: 'todo' | 'in-progress' | 'done';
  subtasks: SubTask[];
}

export interface UserState {
  xp: number;
  level: number;
  mission: string;
  vision: string;
  lastReviewDate: string;
  weeklyVictory?: WeeklyVictory;
}

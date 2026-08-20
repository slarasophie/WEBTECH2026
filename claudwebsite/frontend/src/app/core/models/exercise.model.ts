export type ExerciseCategory = 'Kraft' | 'Ausdauer' | 'Mobilitaet' | 'Sonstiges';

export interface ExerciseLog {
  _id?: string;
  date: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  notes?: string;
}

export interface Exercise {
  _id: string;
  user: string;
  name: string;
  category: ExerciseCategory;
  description?: string;
  logs: ExerciseLog[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseInput {
  name: string;
  category: ExerciseCategory;
  description?: string;
}

export interface ExerciseLogInput {
  sets?: number;
  reps?: number;
  weightKg?: number;
  notes?: string;
  date?: string;
}

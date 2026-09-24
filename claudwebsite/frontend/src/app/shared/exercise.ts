export type ExerciseCategory = 'Kraft' | 'Ausdauer' | 'Mobilitaet' | 'Sonstiges';

// Ein einzelner Satz mit eigenen Wiederholungen + Gewicht
export interface ExerciseSetEntry {
  reps: number;
  weightKg?: number;
}

export interface ExerciseLog {
  _id?: string;
  date: string;
  // Kraft/Mobilitaet/Sonstiges
  sets?: ExerciseSetEntry[];
  // Ausdauer: Distanz (km) + Zeit (Minuten) statt Saetzen
  distanceKm?: number;
  durationMin?: number;
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
  sets?: ExerciseSetEntry[];
  distanceKm?: number;
  durationMin?: number;
  notes?: string;
  date?: string;
}

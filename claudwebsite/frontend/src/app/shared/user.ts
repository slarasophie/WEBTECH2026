export type FitnessGoal = 'Muskelaufbau' | 'Abnehmen' | 'Ausdauer' | 'Allgemeine Fitness';

export interface UserProfile {
  age: number;
  weightKg: number;
  heightCm: number;
  goal: FitnessGoal;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  profileCompleted?: boolean;
  avatar?: string;
  profile?: UserProfile;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  email: string;
}

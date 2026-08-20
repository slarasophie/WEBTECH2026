export interface User {
  id: string;
  username: string;
  email?: string;
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

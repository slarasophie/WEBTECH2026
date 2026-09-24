import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { AuthResponse, Credentials, RegisterCredentials, User, UserProfile } from './user';

const TOKEN_KEY = 'fitness_tracker_token';
const USER_KEY = 'fitness_tracker_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(this.readStoredUser());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  get token(): string | null {
    return this.tokenSignal();
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  // Profil-Setup: wird nach der Registrierung einmalig durchlaufen
  updateProfile(profile: UserProfile): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${environment.apiUrl}/auth/profile`, profile).pipe(
      tap((res) => {
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUserSignal.set(res.user);
      })
    );
  }

  // Profilbild speichern/entfernen (avatar = leerer String zum Entfernen)
  updateAvatar(avatar: string): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${environment.apiUrl}/auth/avatar`, { avatar }).pipe(
      tap((res) => {
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUserSignal.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    this.toast.success('Erfolgreich ausgeloggt.');
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.tokenSignal.set(res.token);
    this.currentUserSignal.set(res.user);

    this.toast.success(`Willkommen, ${res.user.username}!`);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}

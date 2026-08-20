import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Exercise, ExerciseInput, ExerciseLogInput } from '../models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly baseUrl = `${environment.apiUrl}/exercises`;

  constructor(private readonly http: HttpClient) {}

  // Read: alle eigenen Uebungen, optional per Suchbegriff/Kategorie gefiltert
  list(search?: string, category?: string): Observable<Exercise[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (category) {
      params = params.set('category', category);
    }
    return this.http
      .get<{ exercises: Exercise[] }>(this.baseUrl, { params })
      .pipe(map((res) => res.exercises));
  }

  getOne(id: string): Observable<Exercise> {
    return this.http.get<{ exercise: Exercise }>(`${this.baseUrl}/${id}`).pipe(map((res) => res.exercise));
  }

  // Create
  create(input: ExerciseInput): Observable<Exercise> {
    return this.http.post<{ exercise: Exercise }>(this.baseUrl, input).pipe(map((res) => res.exercise));
  }

  // Update
  update(id: string, input: ExerciseInput): Observable<Exercise> {
    return this.http
      .put<{ exercise: Exercise }>(`${this.baseUrl}/${id}`, input)
      .pipe(map((res) => res.exercise));
  }

  // Delete
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Tracking: Trainingseinheit hinzufuegen/entfernen
  addLog(id: string, log: ExerciseLogInput): Observable<Exercise> {
    return this.http
      .post<{ exercise: Exercise }>(`${this.baseUrl}/${id}/logs`, log)
      .pipe(map((res) => res.exercise));
  }

  removeLog(id: string, logId: string): Observable<Exercise> {
    return this.http
      .delete<{ exercise: Exercise }>(`${this.baseUrl}/${id}/logs/${logId}`)
      .pipe(map((res) => res.exercise));
  }
}

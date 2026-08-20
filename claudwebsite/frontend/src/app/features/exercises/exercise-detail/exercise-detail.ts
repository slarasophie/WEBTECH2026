import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Exercise } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './exercise-detail.html',
  styleUrl: './exercise-detail.css'
})
export class ExerciseDetail implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly exerciseService = inject(ExerciseService);
  private readonly route = inject(ActivatedRoute);

  private exerciseId = '';

  readonly exercise = signal<Exercise | null>(null);
  readonly loading = signal(true);
  readonly savingLog = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly logForm = this.fb.nonNullable.group({
    sets: this.fb.nonNullable.control<number>(3, [Validators.min(1)]),
    reps: this.fb.nonNullable.control<number>(10, [Validators.min(1)]),
    weightKg: this.fb.nonNullable.control<number>(0, [Validators.min(0)]),
    notes: ['']
  });

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.exerciseService.getOne(this.exerciseId).subscribe({
      next: (exercise) => {
        this.exercise.set(exercise);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Übung konnte nicht geladen werden');
        this.loading.set(false);
      }
    });
  }

  // Tracking: neue Trainingseinheit (Sets/Reps/Gewicht) fuer diese Uebung erfassen
  addLog(): void {
    if (this.logForm.invalid) {
      this.logForm.markAllAsTouched();
      return;
    }

    this.savingLog.set(true);
    this.errorMessage.set(null);

    this.exerciseService.addLog(this.exerciseId, this.logForm.getRawValue()).subscribe({
      next: (exercise) => {
        this.exercise.set(exercise);
        this.savingLog.set(false);
        this.logForm.reset({ sets: 3, reps: 10, weightKg: 0, notes: '' });
      },
      error: (err) => {
        this.savingLog.set(false);
        this.errorMessage.set(err?.error?.message || 'Trainingseinheit konnte nicht gespeichert werden');
      }
    });
  }

  removeLog(logId: string | undefined): void {
    if (!logId) {
      return;
    }
    this.exerciseService.removeLog(this.exerciseId, logId).subscribe({
      next: (exercise) => this.exercise.set(exercise),
      error: (err) => this.errorMessage.set(err?.error?.message || 'Eintrag konnte nicht entfernt werden')
    });
  }

  sortedLogs(exercise: Exercise) {
    return [...exercise.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

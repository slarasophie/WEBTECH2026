import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Exercise } from '../../shared/exercise';
import { ExerciseService } from '../../shared/exercise.service';
import { ToastService } from '../../shared/toast.service';
import { CategoryBadge } from '../../shared/category-badge/category-badge';

@Component({
  selector: 'app-exercise-detail',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, CategoryBadge],
  templateUrl: './exercise-detail.html',
  styleUrl: './exercise-detail.css'
})
export class ExerciseDetail implements OnInit {
  private exerciseId = '';

  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  readonly exercise = signal<Exercise | null>(null);
  readonly loading = signal(true);
  readonly savingLog = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Ausdauer-Uebungen tracken Distanz + Zeit statt Saetzen/Gewicht
  readonly isEndurance = computed(() => this.exercise()?.category === 'Ausdauer');

  // Statistik ueber den kompletten Verlauf mittels Array-Funktionen (filter/map) und einer
  // for-Schleife zum Aufsummieren (reduce() wird im Skript nur erwaehnt, nicht mit Code gezeigt):
  // Gesamtvolumen (Kraft) = Summe aus Wdh. * Gewicht ueber alle Saetze aller Trainingseinheiten
  readonly totalVolumeKg = computed(() => {
    const logs = this.exercise()?.logs ?? [];
    const setsPerLog = logs.filter((log) => Array.isArray(log.sets)).map((log) => log.sets ?? []);
    let sum = 0;
    for (const sets of setsPerLog) {
      for (const s of sets) {
        sum = sum + s.reps * (s.weightKg ?? 0);
      }
    }
    return sum;
  });

  // Ausdauer: Gesamtdistanz + Gesamtzeit ueber alle Trainingseinheiten
  readonly totalDistanceKm = computed(() => {
    const logs = (this.exercise()?.logs ?? []).filter((log) => log.distanceKm !== undefined);
    let sum = 0;
    for (const log of logs) {
      sum = sum + (log.distanceKm ?? 0);
    }
    return sum;
  });

  readonly totalDurationMin = computed(() => {
    const logs = (this.exercise()?.logs ?? []).filter((log) => log.durationMin !== undefined);
    let sum = 0;
    for (const log of logs) {
      sum = sum + (log.durationMin ?? 0);
    }
    return sum;
  });

  // Kraft/Mobilitaet/Sonstiges: jeder Satz bekommt eine eigene Zeile mit Wiederholungen + Gewicht
  readonly logForm = new FormGroup({
    sets: new FormArray([this.createSetGroup()]),
    notes: new FormControl('', { nonNullable: true })
  });

  // Ausdauer: Distanz (km) + Zeit (Minuten)
  readonly enduranceForm = new FormGroup({
    distanceKm: new FormControl<number>(5, { nonNullable: true, validators: [Validators.required, Validators.min(0.1)] }),
    durationMin: new FormControl<number>(30, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    notes: new FormControl('', { nonNullable: true })
  });

  get setsArray(): FormArray {
    return this.logForm.get('sets') as FormArray;
  }

  private createSetGroup(reps = 10, weightKg = 0) {
    return new FormGroup({
      reps: new FormControl<number>(reps, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
      weightKg: new FormControl<number>(weightKg, { nonNullable: true, validators: [Validators.min(0)] })
    });
  }

  addSetRow(): void {
    const last = this.setsArray.at(this.setsArray.length - 1)?.value as
      | { reps: number; weightKg: number }
      | undefined;
    this.setsArray.push(this.createSetGroup(last?.reps ?? 10, last?.weightKg ?? 0));
  }

  removeSetRow(index: number): void {
    if (this.setsArray.length > 1) {
      this.setsArray.removeAt(index);
    }
  }

  // route.snapshot: einfacher Einmal-Zugriff auf den Routenparameter (wie im Skript gezeigt),
  // statt eines Observable-Abos.
  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const exercise = await firstValueFrom(this.exerciseService.getOne(this.exerciseId));
      this.exercise.set(exercise);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || 'Übung konnte nicht geladen werden');
    } finally {
      this.loading.set(false);
    }
  }

  // Tracking: neue Trainingseinheit fuer diese Uebung erfassen.
  // Ausdauer: Distanz + Zeit. Sonst: Saetze mit eigenen Wdh./Gewicht.
  async addLog(): Promise<void> {
    const form = this.isEndurance() ? this.enduranceForm : this.logForm;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.savingLog.set(true);
    this.errorMessage.set(null);

    const payload = this.isEndurance()
      ? this.enduranceForm.getRawValue()
      : this.logForm.getRawValue();

    try {
      const exercise = await firstValueFrom(this.exerciseService.addLog(this.exerciseId, payload));
      this.exercise.set(exercise);
      this.savingLog.set(false);
      this.resetLogForm();
      this.toast.success('Trainingseinheit gespeichert');
    } catch (err: any) {
      this.savingLog.set(false);
      this.errorMessage.set(err?.error?.message || 'Trainingseinheit konnte nicht gespeichert werden');
    }
  }

  private resetLogForm(): void {
    this.setsArray.clear();
    this.setsArray.push(this.createSetGroup());
    this.logForm.patchValue({ notes: '' });
    this.enduranceForm.reset({ distanceKm: 5, durationMin: 30, notes: '' });
  }

  async removeLog(logId: string | undefined): Promise<void> {
    if (!logId) {
      return;
    }
    try {
      const exercise = await firstValueFrom(this.exerciseService.removeLog(this.exerciseId, logId));
      this.exercise.set(exercise);
      this.toast.success('Eintrag entfernt');
    } catch (err: any) {
      this.toast.error('Eintrag konnte nicht entfernt werden');
    }
  }

  sortedLogs(exercise: Exercise) {
    // slice() kopiert das Array (statt Spread-Operator), da sort() sonst das Original mutieren wuerde
    return exercise.logs.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

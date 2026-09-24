import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExerciseCategory } from '../../shared/exercise';
import { ExerciseService } from '../../shared/exercise.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-exercise-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './exercise-edit.html',
  styleUrl: './exercise-edit.css'
})
export class ExerciseEdit implements OnInit {
  readonly categories: ExerciseCategory[] = ['Kraft', 'Ausdauer', 'Mobilitaet', 'Sonstiges'];

  private exerciseId = '';

  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)]
    }),
    category: new FormControl<ExerciseCategory>('Kraft', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // route.snapshot: einfacher Einmal-Zugriff auf den Routenparameter (wie im Skript gezeigt),
  // statt eines Observable-Abos.
  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const exercise = await firstValueFrom(this.exerciseService.getOne(this.exerciseId));
      this.form.patchValue({
        name: exercise.name,
        category: exercise.category,
        description: exercise.description ?? ''
      });
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || 'Übung konnte nicht geladen werden');
    } finally {
      this.loading.set(false);
    }
  }

  // Update: speichert Aenderungen an einer bestehenden Uebung
  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    try {
      const exercise = await firstValueFrom(this.exerciseService.update(this.exerciseId, this.form.getRawValue()));
      this.saving.set(false);
      this.toast.success('Änderungen gespeichert');
      this.router.navigate(['/exercises', exercise._id]);
    } catch (err: any) {
      this.saving.set(false);
      this.errorMessage.set(err?.error?.message || 'Änderungen konnten nicht gespeichert werden');
    }
  }
}

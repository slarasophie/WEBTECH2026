import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExerciseCategory } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './exercise-create.html',
  styleUrl: './exercise-create.css'
})
export class ExerciseCreate {
  private readonly fb = inject(FormBuilder);
  private readonly exerciseService = inject(ExerciseService);
  private readonly router = inject(Router);

  readonly categories: ExerciseCategory[] = ['Kraft', 'Ausdauer', 'Mobilitaet', 'Sonstiges'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    category: this.fb.nonNullable.control<ExerciseCategory>('Kraft', Validators.required),
    description: ['', [Validators.maxLength(500)]]
  });

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Create: legt eine neue Uebung fuer den eingeloggten User an
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    this.exerciseService.create(this.form.getRawValue()).subscribe({
      next: (exercise) => {
        this.saving.set(false);
        this.router.navigate(['/exercises', exercise._id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err?.error?.message || 'Übung konnte nicht angelegt werden');
      }
    });
  }
}

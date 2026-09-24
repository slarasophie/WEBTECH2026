import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExerciseCategory } from '../../shared/exercise';
import { ExerciseService } from '../../shared/exercise.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-exercise-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './exercise-create.html',
  styleUrl: './exercise-create.css'
})
export class ExerciseCreate {
  constructor(
    private exerciseService: ExerciseService,
    private router: Router,
    private toast: ToastService
  ) {}

  readonly categories: ExerciseCategory[] = ['Kraft', 'Ausdauer', 'Mobilitaet', 'Sonstiges'];

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)]
    }),
    category: new FormControl<ExerciseCategory>('Kraft', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Create: legt eine neue Uebung fuer den eingeloggten User an
  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    try {
      const exercise = await firstValueFrom(this.exerciseService.create(this.form.getRawValue()));
      this.saving.set(false);
      this.toast.success(`Übung "${exercise.name}" angelegt`);
      this.router.navigate(['/exercises', exercise._id]);
    } catch (err: any) {
      this.saving.set(false);
      this.errorMessage.set(err?.error?.message || 'Übung konnte nicht angelegt werden');
    }
  }
}

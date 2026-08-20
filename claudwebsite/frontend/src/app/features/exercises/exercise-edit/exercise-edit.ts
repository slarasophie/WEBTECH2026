import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExerciseCategory } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './exercise-edit.html',
  styleUrl: './exercise-edit.css'
})
export class ExerciseEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly exerciseService = inject(ExerciseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories: ExerciseCategory[] = ['Kraft', 'Ausdauer', 'Mobilitaet', 'Sonstiges'];

  private exerciseId = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    category: this.fb.nonNullable.control<ExerciseCategory>('Kraft', Validators.required),
    description: ['', [Validators.maxLength(500)]]
  });

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';

    this.exerciseService.getOne(this.exerciseId).subscribe({
      next: (exercise) => {
        this.form.patchValue({
          name: exercise.name,
          category: exercise.category,
          description: exercise.description ?? ''
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Übung konnte nicht geladen werden');
        this.loading.set(false);
      }
    });
  }

  // Update: speichert Aenderungen an einer bestehenden Uebung
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    this.exerciseService.update(this.exerciseId, this.form.getRawValue()).subscribe({
      next: (exercise) => {
        this.saving.set(false);
        this.router.navigate(['/exercises', exercise._id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err?.error?.message || 'Änderungen konnten nicht gespeichert werden');
      }
    });
  }
}

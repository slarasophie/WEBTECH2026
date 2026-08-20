import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Exercise } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-delete',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exercise-delete.html',
  styleUrl: './exercise-delete.css'
})
export class ExerciseDelete implements OnInit {
  private exerciseId = '';

  readonly exercise = signal<Exercise | null>(null);
  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';

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

  // Delete: entfernt die Uebung nach Bestaetigung endgueltig
  confirmDelete(): void {
    this.deleting.set(true);
    this.errorMessage.set(null);

    this.exerciseService.remove(this.exerciseId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.router.navigate(['/exercises']);
      },
      error: (err) => {
        this.deleting.set(false);
        this.errorMessage.set(err?.error?.message || 'Löschen fehlgeschlagen');
      }
    });
  }
}

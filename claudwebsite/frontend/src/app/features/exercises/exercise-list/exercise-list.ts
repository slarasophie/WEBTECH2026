import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Exercise } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css'
})
export class ExerciseList implements OnInit {
  readonly exercises = signal<Exercise[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  searchTerm = '';
  selectedCategory = '';

  readonly categories = ['Kraft', 'Ausdauer', 'Mobilitaet', 'Sonstiges'];

  constructor(private readonly exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.load();
  }

  // Read: laedt alle Uebungen (optional gefiltert per Suchbegriff/Kategorie)
  load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.exerciseService.list(this.searchTerm, this.selectedCategory).subscribe({
      next: (exercises) => {
        this.exercises.set(exercises);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Uebungen konnten nicht geladen werden');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(): void {
    this.load();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.load();
  }

  totalLogs(exercise: Exercise): number {
    return exercise.logs?.length ?? 0;
  }
}

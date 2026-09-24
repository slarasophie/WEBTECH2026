import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Exercise } from '../../shared/exercise';
import { ExerciseService } from '../../shared/exercise.service';
import { CategoryBadge } from '../../shared/category-badge/category-badge';

@Component({
  selector: 'app-exercise-list',
  imports: [FormsModule, RouterLink, CategoryBadge],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css'
})
export class ExerciseList implements OnInit {
  readonly exercises = signal<Exercise[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');

  readonly categories = ['Kraft', 'Ausdauer', 'Mobilitaet', 'Sonstiges'];

  // Clientseitiges Filtern wie im Skript gezeigt (filter() auf einem bereits geladenen Array):
  // Die Uebungen werden einmal komplett geladen, Suche/Kategorie-Auswahl loesen danach keinen
  // erneuten Server-Request mehr aus, sondern filtern nur noch lokal.
  readonly filteredExercises = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.exercises().filter((exercise) => {
      const matchesTerm =
        term === '' ||
        exercise.name.toLowerCase().includes(term) ||
        (exercise.description ?? '').toLowerCase().includes(term);
      const matchesCategory = category === '' || exercise.category === category;
      return matchesTerm && matchesCategory;
    });
  });

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.load();
  }

  // Read: laedt einmalig alle eigenen Uebungen; gefiltert wird danach clientseitig (siehe filteredExercises)
  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      const exercises = await firstValueFrom(this.exerciseService.list());
      this.exercises.set(exercises);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || 'Uebungen konnten nicht geladen werden');
    } finally {
      this.loading.set(false);
    }
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
  }

  totalLogs(exercise: Exercise): number {
    return exercise.logs?.length ?? 0;
  }

  // Exportiert alle eigenen Uebungen (inkl. Trainingsverlauf) als JSON-Datei zum Download.
  // JSON.stringify() wandelt das JavaScript-Objekt/Array in einen JSON-String um (siehe Skript).
  // Blob/URL.createObjectURL() kommen im Skript nicht vor, sind aber der Standard-Weg, um im
  // Browser aus einem String eine herunterladbare Datei zu erzeugen (keine sinnvolle Alternative).
  exportAsJson(): void {
    const json = JSON.stringify(this.exercises(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `fittrack-uebungen-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }
}

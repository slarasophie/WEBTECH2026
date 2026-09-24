import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Exercise } from '../../shared/exercise';
import { ExerciseService } from '../../shared/exercise.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-exercise-delete',
  imports: [RouterLink],
  templateUrl: './exercise-delete.html',
  styleUrl: './exercise-delete.css'
})
export class ExerciseDelete implements OnInit {
  private exerciseId = '';

  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  readonly exercise = signal<Exercise | null>(null);
  readonly loading = signal(true);
  readonly deleting = signal(false);
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
      this.exercise.set(exercise);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || 'Übung konnte nicht geladen werden');
    } finally {
      this.loading.set(false);
    }
  }

  // Delete: entfernt die Uebung nach Bestaetigung endgueltig.
  // Anstelle von .subscribe({ next, error }) nutzen wir hier bewusst async/await mit try/catch
  // (wie im Skript-Kapitel "Callbacks und Promises" gezeigt): firstValueFrom() wandelt das
  // Observable von HttpClient in ein Promise um, das wir dann await-en koennen.
  async confirmDelete(): Promise<void> {
    this.deleting.set(true);
    this.errorMessage.set(null);

    const name = this.exercise()?.name;

    try {
      await firstValueFrom(this.exerciseService.remove(this.exerciseId));
      this.deleting.set(false);
      this.toast.success(name ? `Übung "${name}" gelöscht` : 'Übung gelöscht');
      this.router.navigate(['/exercises']);
    } catch (err: any) {
      this.deleting.set(false);
      this.toast.error('Löschen fehlgeschlagen');
    }
  }
}

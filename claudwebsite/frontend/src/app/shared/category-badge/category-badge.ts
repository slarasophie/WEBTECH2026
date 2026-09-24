import { Component, input } from '@angular/core';
import { ExerciseCategory } from '../exercise';

// Wiederverwendbare Kind-Komponente fuer das Kategorie-Badge (Icon + Text).
// Nimmt die Kategorie per input() von der jeweiligen Elternkomponente entgegen
// (siehe Skript-Kapitel "Datenfluss und Signals" – Datenfluss von Eltern- zu Kindkomponente).
// Vorher war dieses Markup (inkl. @switch fuer die Icons) in exercise-list.html UND
// exercise-detail.html dupliziert.
@Component({
  selector: 'app-category-badge',
  imports: [],
  host: { class: 'badge badge-category rounded-pill' },
  templateUrl: './category-badge.html',
  styleUrl: './category-badge.css'
})
export class CategoryBadge {
  readonly category = input.required<ExerciseCategory>();
}

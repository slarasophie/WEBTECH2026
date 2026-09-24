import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'danger';
}

/**
 * Einfacher Toast-Service: zeigt kurze Erfolgs-/Fehlermeldungen an (z.B. "Übung angelegt"),
 * genau wie im Webtech-Skript-Kapitel "Front- & Backend - Anbindung" beschrieben
 * (https://getbootstrap.com/docs/5.3/components/toasts/): nach erfolgreichem Speichern
 * wird ein Bootstrap-Toast angezeigt. Das Ein-/Ausblenden uebernimmt Bootstraps eigene
 * Toast-Komponente (siehe BsToastDirective) - hier wird nur noch die Liste der aktuell
 * anzuzeigenden Meldungen verwaltet.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'danger');
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(text: string, type: 'success' | 'danger'): void {
    const id = this.nextId++;
    // Kopie per slice() + push() (statt Spread-Operator), damit signal.update() eine neue
    // Array-Referenz erhaelt, ohne die alte Liste zu veraendern
    this.toasts.update((list) => {
      const updated = list.slice();
      updated.push({ id, text, type });
      return updated;
    });
  }
}

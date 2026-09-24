import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(protected auth: AuthService) {}

  protected readonly features = [
    {
      icon: '🏋️',
      title: 'Übungen verwalten',
      text: 'Eigene Übungen anlegen, bearbeiten und löschen – ganz nach deinen Trainingsplänen.'
    },
    {
      icon: '🔍',
      title: 'Schnell wiederfinden',
      text: 'Übungen per Suchbegriff oder Kategorie filtern statt lange Listen zu durchsuchen.'
    },
    {
      icon: '📈',
      title: 'Fortschritt tracken',
      text: 'Sätze, Wiederholungen und Gewicht je Trainingseinheit erfassen und den Verlauf einsehen.'
    },
    {
      icon: '🔒',
      title: 'Privat & sicher',
      text: 'Login mit Benutzername und Passwort – jede Nutzerin sieht ausschließlich ihre eigenen Daten.'
    }
  ];
}

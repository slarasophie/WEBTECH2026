# FitTrack – Fitness-Tracker Webanwendung

Semesteraufgabe Webtechnologien, HTW Berlin (Sommersemester 2026). Autorin: Lara Suter.

FitTrack ist eine Single-Page-Anwendung, mit der man eigene Trainingsübungen verwalten und
Trainingseinheiten (Sätze, Wiederholungen, Gewicht) dazu tracken kann. Jede Nutzerin hat einen
eigenen Account und sieht ausschließlich ihre eigenen Übungen.

Dieses Repository enthält das **Frontend** (Angular). Das zugehörige **Backend** (Node.js/Express/MongoDB)
liegt im separaten Repository [`fitness-tracker-backend`](../backend).

## Funktionsumfang

- Registrierung und Login (Benutzername + Passwort, JWT-basiert)
- Übungen anlegen, anzeigen, bearbeiten und löschen (CRUD)
- Übungen per Suchbegriff und Kategorie filtern
- Trainingseinheiten pro Übung tracken (Sätze, Wiederholungen, Gewicht, Notiz) inkl. Verlauf
- Responsives, modernes UI auf Basis von Bootstrap 5 im Farbschema Beige/Schwarz/Braun
- Daten sind strikt pro Nutzerin getrennt (Backend prüft `userId` aus dem JWT bei jedem Zugriff)

## Screenshots

> Platzhalter – bitte nach dem ersten lokalen Start eigene Screenshots einfügen
> (z. B. `docs/screenshot-login.png`, `docs/screenshot-liste.png`, `docs/screenshot-detail.png`)
> und hier per `![Beschreibung](docs/screenshot-xyz.png)` verlinken.

| Login | Übungsliste | Detail & Tracking |
|-------|-------------|--------------------|
| _Screenshot einfügen_ | _Screenshot einfügen_ | _Screenshot einfügen_ |

## Tech-Stack

- Angular 22 (standalone Components, Signals, `@angular/build`/esbuild)
- Bootstrap 5 (CSS-Framework)
- RxJS, Angular Reactive Forms, Angular Router (lazy-loaded Standalone-Routen)
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt (siehe Backend-README)

## Installation & Start

Voraussetzungen: Node.js ≥ 18, npm, sowie das laufende [Backend](../backend) inkl. MongoDB.

```bash
cd frontend
npm install
npm start          # startet den Dev-Server auf http://localhost:4200
```

Das Frontend erwartet das Backend standardmäßig unter `http://localhost:3000/api`
(siehe `src/environments/environment.ts`).

Zum schnellen Ausprobieren: im Backend `npm run seed` ausführen und anschließend mit

```
username: demo
password: demo1234
```

einloggen – die Datenbank ist dann bereits mit Beispiel-Übungen und Trainingseinheiten befüllt.

### Produktions-Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Git-Repository initialisieren (einmalig)

Führe diese Schritte einmal lokal im Terminal aus (im Ordner `frontend/`):

```bash
cd frontend
rm -rf .git          # falls hier schon ein (evtl. unvollständiges) .git existiert
git init
git branch -M main

git add angular.json package.json src/environments src/index.html src/main.ts src/app/app.config.ts src/app/app.routes.ts
git commit -m "chore: Angular-Grundgeruest, Routing- und HttpClient-Konfiguration"

git add src/styles.css src/app/shared src/app/app.html src/app/app.css src/app/app.ts src/app/app.spec.ts
git commit -m "feat: Bootstrap-Einbindung, responsive Navbar, Farbschema Beige/Schwarz/Braun"

git add src/app/core
git commit -m "feat: AuthService, ExerciseService, JWT-Interceptor und Route-Guards"

git add src/app/features/auth
git commit -m "feat: Login- und Registrierungs-Komponenten"

git add src/app/features/exercises/exercise-list src/app/features/exercises/exercise-create src/app/features/exercises/exercise-edit src/app/features/exercises/exercise-delete
git commit -m "feat: Uebungen-CRUD-Komponenten (Liste+Suche, Anlegen, Bearbeiten, Loeschen)"

git add -A
git commit -m "feat: Detailansicht mit Trainings-Tracking + README"

git remote add origin <URL deines leeren GitHub/GitLab-Repos>
git push -u origin main
```

Ab hier regelmäßig (mehrmals pro Woche, über mehrere Wochen) weiter committen – das ist Teil der
Bewertung ("50-100 Commits über mehrere Wochen, mind. 5 Wochen mit Commits").

## Projektstruktur

```
frontend/
  src/app/
    core/
      models/           TypeScript-Interfaces (User, Exercise)
      services/          AuthService, ExerciseService (HTTP-Kommunikation)
      interceptors/      JWT-Interceptor
      guards/             Route-Guards (eingeloggt / nicht eingeloggt)
    shared/
      navbar/             Responsive Navigationsleiste
    features/
      auth/
        login/            Login-Komponente
        register/          Registrierungs-Komponente
      exercises/
        exercise-list/      Read: Liste aller eigenen Übungen inkl. Suche/Filter
        exercise-create/     Create: neue Übung anlegen
        exercise-edit/        Update: bestehende Übung bearbeiten
        exercise-delete/       Delete: Löschbestätigung
        exercise-detail/        Read (Detail) + Tracking von Trainingseinheiten
    app.routes.ts          Routing inkl. Guards
    app.config.ts            App-weite Provider (Router, HttpClient, Interceptor)
```

## KI-Werkzeuge

Im Rahmen dieser Semesteraufgabe wurde folgendes KI-Werkzeug eingesetzt:

- **Claude (Anthropic, Cowork-Modus)**: Gerüst und Großteil der Implementierung von Frontend
  (Angular-Komponenten, Services, Routing, Styling) und Backend (Express-Routen, Mongoose-Modelle,
  Auth-Logik, Seed-Skript) sowie Erstellung dieser README. Code wurde anschließend gesichtet und
  wird im Rahmen des Abgabegesprächs erläutert und bei Bedarf angepasst.

## Hinweis zur Entwicklung / Commit-Historie

Dieses Projekt wird über mehrere Wochen hinweg kontinuierlich weiterentwickelt; die Commit-Historie
in Frontend- und Backend-Repository dokumentiert den Fortschritt entsprechend den Vorgaben der
Semesteraufgabe.

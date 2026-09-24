# FitTrack – Fitness-Tracker Webanwendung

Semesteraufgabe Webtechnologien, HTW Berlin (Sommersemester 2026). Autorin: Lara Suter.

FitTrack ist eine Single-Page-Anwendung, mit der man eigene Trainingsübungen verwalten und
Trainingseinheiten (Sätze, Wiederholungen, Gewicht) dazu tracken kann. Jede Nutzerin hat einen
eigenen Account und sieht ausschließlich ihre eigenen Übungen.

Dieses Repository enthält das **Frontend** (Angular). Das zugehörige **Backend** (Node.js/Express/MongoDB)
liegt im separaten Repository [`fitness-tracker-backend`](../backend).

## Funktionsumfang

- Öffentliche Startseite mit Funktionsüberblick und Einstieg zu Login/Registrierung
- Registrierung (Benutzername, E-Mail, Passwort) und Login (Benutzername + Passwort), JWT-basiert
- Fitness-Profil (Alter, Gewicht, Größe, Trainingsziel, optionales Profilbild), das nach der
  Registrierung einmalig durchlaufen werden muss, bevor die Übungsverwaltung zugänglich ist
- Übungen anlegen, anzeigen, bearbeiten und löschen (CRUD)
- Übungen per Suchbegriff und Kategorie filtern
- Trainingseinheiten pro Übung tracken – bei Kraft/Mobilität/Sonstiges mit individuellen Sätzen
  (je Satz eigene Wiederholungen/Gewicht), bei Ausdauer mit Distanz (km) und Zeit – inkl. Verlauf
  und Gesamtstatistik (Volumen bzw. Distanz/Zeit)
- Eigene Übungen inkl. Verlauf als JSON exportieren
- Impressum- und Kontaktseite (Kontaktformular öffnet den Mail-Client)
- Responsives, modernes UI auf Basis von Bootstrap 5 im Spa/Wellness-Farbschema
  (Creme/Salbeigrün/Terracotta/Dunkelgrün)
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

git add src/styles.css src/app/shared/navbar src/app/shared/toast-container src/app/app.html src/app/app.css src/app/app.ts src/app/app.spec.ts
git commit -m "feat: Bootstrap-Einbindung, responsive Navbar, Farbschema Beige/Schwarz/Braun"

git add src/app/shared/auth.service.ts src/app/shared/exercise.service.ts src/app/shared/toast.service.ts src/app/shared/auth.interceptor.ts src/app/shared/auth.guard.ts src/app/shared/user.ts src/app/shared/exercise.ts
git commit -m "feat: AuthService, ExerciseService, JWT-Interceptor und Route-Guards"

git add src/app/login src/app/register
git commit -m "feat: Login- und Registrierungs-Komponenten"

git add src/app/exercises/exercise-list src/app/exercises/exercise-create src/app/exercises/exercise-edit src/app/exercises/exercise-delete
git commit -m "feat: Uebungen-CRUD-Komponenten (Liste+Suche, Anlegen, Bearbeiten, Loeschen)"

git add src/app/exercises/exercise-detail
git commit -m "feat: Detailansicht mit Trainings-Tracking"

git add src/app/home src/app/impressum src/app/kontakt
git commit -m "feat: Startseite, Impressum und Kontaktseite"

git add -A
git commit -m "docs: README"

git remote add origin <URL deines leeren GitHub/GitLab-Repos>
git push -u origin main
```

Ab hier regelmäßig (mehrmals pro Woche, über mehrere Wochen) weiter committen – das ist Teil der
Bewertung ("50-100 Commits über mehrere Wochen, mind. 5 Wochen mit Commits").

## Projektstruktur

Anlehnung an die Ordnerstruktur aus dem Skript: Komponenten liegen direkt unter `src/app/`,
Services/Interfaces/Guards/Interceptor gemeinsam im `shared/`-Ordner (analog zu `ng g s shared/...`
aus dem Skript-Kapitel "Angular - Komponenten").

```
frontend/
  src/app/
    shared/
      auth.service.ts        AuthService (Login/Register/Profil, HTTP-Kommunikation)
      exercise.service.ts    ExerciseService (Übungen-CRUD, HTTP-Kommunikation)
      toast.service.ts       ToastService (Erfolgs-/Fehlermeldungen)
      auth.guard.ts           Route-Guards (eingeloggt / nicht eingeloggt / Profil komplett)
      auth.interceptor.ts     JWT-Interceptor
      user.ts                    TypeScript-Interface User
      exercise.ts                 TypeScript-Interface Exercise
      navbar/                     Responsive Navigationsleiste
      toast-container/             Anzeige der Toast-Meldungen
      category-badge/               Wiederverwendbares Kategorie-Badge (Kraft/Ausdauer/...)
    home/                 Öffentliche Startseite
    impressum/             Impressum
    kontakt/                Kontaktseite mit Formular
    login/                    Login-Komponente
    register/                  Registrierungs-Komponente
    profile-setup/                Fitness-Profil (Pflichtschritt nach der Registrierung)
    exercises/
      exercise-list/                  Read: Liste aller eigenen Übungen inkl. Suche/Filter
      exercise-create/                  Create: neue Übung anlegen
      exercise-edit/                      Update: bestehende Übung bearbeiten
      exercise-delete/                      Delete: Löschbestätigung
      exercise-detail/                        Read (Detail) + Tracking von Trainingseinheiten
    app.routes.ts          Routing inkl. Guards
    app.config.ts            App-weite Provider (Router, HttpClient, Interceptor)
```

## KI-Werkzeuge

Im Rahmen dieser Semesteraufgabe wurde folgendes KI-Werkzeug eingesetzt: **Claude (Anthropic)**.

### Schwierigste Codestellen (mit Claude gelöst)

| Codestelle | Problem | Quelle |
|---|---|---|
| `backend/src/authRoutes.js`, `package.json` | `bcrypt` (natives C++-Modul, im Skript-Kapitel "Front- & Backend - Anbindung" verwendet) ließ sich lokal nicht kompilieren (fehlende Build-Tools); Diagnose der Fehlermeldung und Umstieg auf `bcryptjs` an allen betroffenen Stellen | Claude |
| `shared/toast-container/bs-toast.directive.ts` | Einbindung von Bootstraps eigener Toast-Komponente – im Skript-Kapitel "Front- & Backend - Anbindung" verlinkt (getbootstrap.com/docs/5.3/components/toasts) – in den Angular-Lifecycle | Claude |

## Hinweis zur Entwicklung / Commit-Historie

Dieses Projekt wird über mehrere Wochen hinweg kontinuierlich weiterentwickelt; die Commit-Historie
in Frontend- und Backend-Repository dokumentiert den Fortschritt entsprechend den Vorgaben der
Semesteraufgabe.

# FitnessTracking Backend

Express-API mit MongoDB-Anbindung (Atlas) über Mongoose.

## Setup

1. **Dependencies installieren**

   ```bash
   cd FitnessTracking/backend
   npm install
   ```

2. **MongoDB Atlas Connection String holen**

   - Auf [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) einloggen (oder kostenlosen Account anlegen)
   - Cluster erstellen (M0 Free Tier reicht)
   - Unter **Database Access** einen Datenbank-User mit Passwort anlegen
   - Unter **Network Access** deine IP freigeben (oder `0.0.0.0/0` für Entwicklung)
   - Auf **Connect** → **Drivers** klicken, den Connection String kopieren

3. **.env-Datei anlegen**

   ```bash
   cp .env.example .env
   ```

   Dann `MONGODB_URI` in `.env` mit deinem echten Connection String ausfüllen, z.B.:

   ```
   MONGODB_URI=mongodb+srv://mein_user:mein_passwort@cluster0.xxxxx.mongodb.net/fitnesstracking?retryWrites=true&w=majority
   PORT=3000
   ```

   Achtung: Sonderzeichen im Passwort müssen URL-encoded sein.

4. **Server starten**

   ```bash
   npm run dev
   ```

   Bei erfolgreicher Verbindung erscheint im Terminal:
   `MongoDB verbunden: <host>`

## Test

- `GET http://localhost:3000/` → Status-Check
- `GET http://localhost:3000/api/workouts` → alle Workouts
- `POST http://localhost:3000/api/workouts` → neues Workout anlegen, z.B. Body:

  ```json
  {
    "title": "Morgenlauf",
    "type": "Laufen",
    "duration": 30,
    "caloriesBurned": 250
  }
  ```

## Frontend-Anbindung

Im Angular-Frontend (`FitnessTracking/frontend`) die API-Basis-URL auf `http://localhost:3000/api` setzen, z.B. in einem `environment.ts` oder direkt im `HttpClient`-Service.

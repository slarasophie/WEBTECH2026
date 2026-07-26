require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const workoutRoutes = require('./src/routes/workoutRoutes');

// Mit MongoDB verbinden
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'FitnessTracking API läuft' });
});

// Gibt den aktuellen MongoDB-Verbindungsstatus zurück
app.get('/health', (req, res) => {
  const stateNames = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const state = mongoose.connection.readyState;

  res.json({
    mongodb: stateNames[state] || 'unknown',
    dbName: mongoose.connection.name || null,
  });
});

app.use('/api/workouts', workoutRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

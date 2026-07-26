const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// GET /api/workouts - alle Workouts abrufen
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/workouts - neues Workout anlegen
router.post('/', async (req, res) => {
  try {
    const workout = new Workout(req.body);
    const saved = await workout.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/workouts/:id - Workout löschen
router.delete('/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true }, // z.B. Laufen, Krafttraining, Yoga
    duration: { type: Number, required: true }, // in Minuten
    caloriesBurned: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);

const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const Log = require('../models/Log');

// ── Helper: get today at midnight UTC ──────────────────────────────
function getTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

// ── Helper: calculate streaks ──────────────────────────────────────
function calculateStreaks(logs) {
  if (!logs.length) return { currentStreak: 0, longestStreak: 0 };

  // Sort dates descending
  const dates = logs
    .map((l) => new Date(l.date).getTime())
    .sort((a, b) => b - a);

  // Remove duplicates
  const unique = [...new Set(dates)];

  const today = getTodayUTC().getTime();
  const oneDay = 86400000;

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;

  // Check if today or yesterday is in the list to start current streak
  const mostRecent = unique[0];
  if (mostRecent === today || mostRecent === today - oneDay) {
    currentStreak = 1;
    for (let i = 1; i < unique.length; i++) {
      if (unique[i - 1] - unique[i] === oneDay) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < unique.length; i++) {
    if (unique[i - 1] - unique[i] === oneDay) {
      streak++;
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak, currentStreak);

  return { currentStreak, longestStreak };
}

// ── GET /api/habits — list all habits with streaks ─────────────────
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    const today = getTodayUTC();

    const habitsWithStreaks = await Promise.all(
      habits.map(async (habit) => {
        const logs = await Log.find({ habitId: habit._id });
        const { currentStreak, longestStreak } = calculateStreaks(logs);
        const completedToday = await Log.exists({ habitId: habit._id, date: today });

        return {
          ...habit.toObject(),
          currentStreak,
          longestStreak,
          completedToday: !!completedToday,
        };
      })
    );

    res.json(habitsWithStreaks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/habits — create a new habit ──────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const habit = await Habit.create({ name, color, icon });
    res.status(201).json({
      ...habit.toObject(),
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/habits/logs/all — get all logs for contribution grid ─
// NOTE: This MUST come before /:id routes so "logs" isn't treated as an ID
router.get('/logs/all', async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1 }).populate('habitId');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/habits/:id — delete a habit and its logs ───────────
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    await Log.deleteMany({ habitId: req.params.id });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/habits/:id/toggle — toggle today's completion ───────
router.post('/:id/toggle', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = getTodayUTC();
    const existingLog = await Log.findOne({ habitId: req.params.id, date: today });

    if (existingLog) {
      await Log.deleteOne({ _id: existingLog._id });
    } else {
      await Log.create({ habitId: req.params.id, date: today });
    }

    // Return updated habit with streaks
    const logs = await Log.find({ habitId: req.params.id });
    const { currentStreak, longestStreak } = calculateStreaks(logs);
    const completedToday = !existingLog;

    res.json({
      ...habit.toObject(),
      currentStreak,
      longestStreak,
      completedToday,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/habits/:id/logs — get logs for a single habit ────────
router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await Log.find({ habitId: req.params.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

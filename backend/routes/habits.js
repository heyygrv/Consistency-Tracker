const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const Log = require('../models/Log');
const { protect } = require('../middleware/auth');

// ── Helper: get today at midnight UTC ──────────────────────────────
function getTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

// ── Helper: calculate streaks ──────────────────────────────────────
function calculateStreaks(logs) {
  if (!logs.length) return { currentStreak: 0, longestStreak: 0 };
  const dates = logs.map((l) => new Date(l.date).getTime()).sort((a, b) => b - a);
  const unique = [...new Set(dates)];
  const today = getTodayUTC().getTime();
  const oneDay = 86400000;

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;

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

// Protect all habit routes
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const today = getTodayUTC();

    const habitsWithStreaks = await Promise.all(
      habits.map(async (habit) => {
        const logs = await Log.find({ habitId: habit._id, userId: req.user.id });
        const { currentStreak, longestStreak } = calculateStreaks(logs);
        const completedToday = await Log.exists({ habitId: habit._id, userId: req.user.id, date: today });

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

router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const habit = await Habit.create({ name, color, icon, userId: req.user.id });
    res.status(201).json({
      ...habit.toObject(),
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/logs/all', async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ date: -1 }).populate('habitId');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    await Log.deleteMany({ habitId: req.params.id, userId: req.user.id });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/toggle', async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = getTodayUTC();
    const existingLog = await Log.findOne({ habitId: req.params.id, userId: req.user.id, date: today });

    if (existingLog) {
      await Log.deleteOne({ _id: existingLog._id });
    } else {
      await Log.create({ habitId: req.params.id, userId: req.user.id, date: today });
    }

    const logs = await Log.find({ habitId: req.params.id, userId: req.user.id });
    const { currentStreak, longestStreak } = calculateStreaks(logs);
    res.json({
      ...habit.toObject(),
      currentStreak,
      longestStreak,
      completedToday: !existingLog,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await Log.find({ habitId: req.params.id, userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

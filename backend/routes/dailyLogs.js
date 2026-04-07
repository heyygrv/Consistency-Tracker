const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');

// ── Helper: get today at midnight UTC ──────────────────────────────
function getMidnightUTC(dateParam) {
  const d = dateParam ? new Date(dateParam) : new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

// ── GET /api/dailyLogs?date=YYYY-MM-DD ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const targetDate = req.query.date ? getMidnightUTC(req.query.date) : getMidnightUTC();
    let log = await DailyLog.findOne({ date: targetDate });
    
    if (!log) {
      // Return an empty template rather than 404 to avoid frontend errors
      log = { date: targetDate, mood: '', notes: '' };
    }
    
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/dailyLogs ─────────────────────────────────────────────
// Upsert daily log for a date
router.post('/', async (req, res) => {
  try {
    const { date, mood, notes } = req.body;
    const targetDate = date ? getMidnightUTC(date) : getMidnightUTC();

    let log = await DailyLog.findOne({ date: targetDate });

    if (log) {
      if (mood !== undefined) log.mood = mood;
      if (notes !== undefined) log.notes = notes;
      await log.save();
    } else {
      log = await DailyLog.create({ date: targetDate, mood: mood || '', notes: notes || '' });
    }

    res.json(log);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

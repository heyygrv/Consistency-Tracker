const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');
const { protect } = require('../middleware/auth');

function getMidnightUTC(dateParam) {
  const d = dateParam ? new Date(dateParam) : new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const targetDate = req.query.date ? getMidnightUTC(req.query.date) : getMidnightUTC();
    let log = await DailyLog.findOne({ userId: req.user.id, date: targetDate });
    if (!log) {
      log = { date: targetDate, mood: '', notes: '' };
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, mood, notes } = req.body;
    const targetDate = date ? getMidnightUTC(date) : getMidnightUTC();

    let log = await DailyLog.findOne({ userId: req.user.id, date: targetDate });

    if (log) {
      if (mood !== undefined) log.mood = mood;
      if (notes !== undefined) log.notes = notes;
      await log.save();
    } else {
      log = await DailyLog.create({ 
        userId: req.user.id, 
        date: targetDate, 
        mood: mood || '', 
        notes: notes || '' 
      });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

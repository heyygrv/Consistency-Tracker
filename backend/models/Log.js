const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

// Prevent duplicate logs for the same habit on the same day
logSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Log', logSchema);

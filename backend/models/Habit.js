const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [50, 'Habit name cannot exceed 50 characters'],
  },
  color: {
    type: String,
    default: function () {
      const colors = [
        '#22c55e', '#3b82f6', '#a855f7', '#f59e0b',
        '#ef4444', '#06b6d4', '#ec4899', '#14b8a6',
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
  icon: {
    type: String,
    default: 'Trophy',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Habit', habitSchema);

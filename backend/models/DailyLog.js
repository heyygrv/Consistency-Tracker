const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'bad', 'terrible', ''],
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

dailyLogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);

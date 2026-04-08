const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Use Google Public DNS to resolve MongoDB SRV records
// (fixes ECONNREFUSED on networks that block SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const habitRoutes = require('./routes/habits');
const dailyLogRoutes = require('./routes/dailyLogs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Global is cached across warm invocations on Serverless
let cachedMongoose = global.mongoose;
if (!cachedMongoose) {
  cachedMongoose = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cachedMongoose.conn) {
    return cachedMongoose.conn;
  }
  if (!cachedMongoose.promise) {
    const opts = { bufferCommands: false };
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/consistency-tracker';
    cachedMongoose.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      cachedMongoose.promise = null; // reset if failed
      throw err;
    });
  }
  cachedMongoose.conn = await cachedMongoose.promise;
  return cachedMongoose.conn;
}

// Intercept all requests to ensure DB is connected before routing
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(503).json({ error: 'Service Unavailable: Database connection failed. Please check your MONGODB_URI and Network IP Whitelist.' });
  }
});

// Routes
app.use('/api/habits', habitRoutes);
app.use('/api/dailyLogs', dailyLogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Start server only if we're not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel Serverless Functions
module.exports = app;

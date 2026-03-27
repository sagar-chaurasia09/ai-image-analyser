const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── MongoDB (optional — works without it) ──────────
let dbConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri === 'mongodb://localhost:27017/ai-image-analyzer') {
    console.warn('⚠️  MONGODB_URI not set. Running without database (results won\'t persist across restarts).');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    dbConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed — running in memory-only mode.');
    console.warn('   Reason:', err.message.split('\n')[0]);
    console.warn('   Tip: Check your MONGODB_URI in .env (needs username:password@host format)');
  }
}

connectDB();

// Expose connection status for routes to check
app.locals.dbConnected = () => dbConnected;

// ── Routes ──────────────────────────────────────────
const imageRoutes = require('./routes/images');
app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI Image Analyzer API is running', db: dbConnected ? 'connected' : 'memory-only' });
});

// ── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

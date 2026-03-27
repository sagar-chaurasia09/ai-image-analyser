const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { analyzeImage } = require('../services/openai');

// ── In-memory fallback store (used when MongoDB isn't available) ───
const memoryStore = [];

// ── Try to load Mongoose model (may not be available if DB is down) ─
let ImageResult = null;
try {
  ImageResult = require('../models/ImageResult');
} catch (e) {
  console.warn('ImageResult model not loaded');
}

// Helper: Save to DB if connected, otherwise use memory store
async function saveResult(data) {
  const mongoose = require('mongoose');
  if (ImageResult && mongoose.connection.readyState === 1) {
    try {
      const doc = new ImageResult(data);
      await doc.save();
      return doc;
    } catch (dbErr) {
      console.warn('DB save failed, using memory store:', dbErr.message.split('\n')[0]);
    }
  }
  // Fallback: in-memory
  const doc = { ...data, _id: Date.now().toString(), timestamp: new Date() };
  memoryStore.unshift(doc);
  return doc;
}

// Helper: Fetch all results
async function fetchAllResults() {
  const mongoose = require('mongoose');
  if (ImageResult && mongoose.connection.readyState === 1) {
    try {
      return await ImageResult.find().sort({ timestamp: -1 }).limit(200);
    } catch (dbErr) {
      console.warn('DB fetch failed, using memory store:', dbErr.message.split('\n')[0]);
    }
  }
  return memoryStore;
}

// ── Multer Setup ────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { files: 100, fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported type: ${file.mimetype}. Use JPG, PNG, or WEBP.`), false);
    }
  },
});

// ── POST /api/images/upload ─────────────────────────────────────────
router.post('/upload', upload.array('images', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const processPromises = req.files.map(async (file) => {
      // Always generate the preview — even if AI fails the user sees their image
      const base64Preview = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      try {
        const description = await analyzeImage(file.buffer, file.mimetype);
        const doc = await saveResult({
          originalName: file.originalname,
          mimeType: file.mimetype,
          aiDescription: description,
          aiConfidence: 0.99,
        });
        return {
          id: doc._id,
          originalName: file.originalname,
          description,
          previewUrl: base64Preview,
          timestamp: doc.timestamp,
          error: false,
        };
      } catch (err) {
        console.error(`❌ "${file.originalname}":`, err.message);
        return {
          id: null,
          originalName: file.originalname,
          description: err.message,
          previewUrl: base64Preview,
          timestamp: new Date(),
          error: true,
        };
      }
    });

    const results = await Promise.all(processPromises);
    res.json({ success: true, results });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${error.message}` });
    }
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/images (history) ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const raw = await fetchAllResults();
    const results = raw.map((r) => ({
      id: r._id,
      originalName: r.originalName,
      description: r.aiDescription,
      previewUrl: null, // base64 not stored in DB; only freshly uploaded images have previews
      timestamp: r.timestamp,
      error: false,
    }));
    res.json({ success: true, results });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch results: ' + error.message });
  }
});

// ── GET /api/images/export/excel ────────────────────────────────────
router.get('/export/excel', async (req, res) => {
  try {
    const raw = await fetchAllResults();
    if (raw.length === 0) {
      return res.status(404).json({ success: false, message: 'No records to export yet.' });
    }

    const rows = raw.map((r) => ({
      'Image Name': r.originalName,
      'AI Description': r.aiDescription,
      'Format': r.mimeType,
      'Analyzed At': new Date(r.timestamp).toLocaleString(),
    }));

    const ws = xlsx.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 35 }, { wch: 90 }, { wch: 15 }, { wch: 25 }];
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'AI Analyses');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="ai_image_analysis.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Excel: ' + error.message });
  }
});

module.exports = router;

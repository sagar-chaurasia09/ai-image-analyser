const mongoose = require('mongoose');

const imageResultSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  aiDescription: {
    type: String,
    required: true,
  },
  aiConfidence: {
    type: Number,
    default: null, // Depending on the model, it might provide a confidence score
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('ImageResult', imageResultSchema);

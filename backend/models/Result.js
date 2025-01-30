// backend/models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errorCount: { type: Number, required: true }, // Ensure this is 'errorCount'
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);

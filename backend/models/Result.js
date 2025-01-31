// backend/models/Result.js
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User', // This will now match the _id field in User.
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  errorCount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.Result || mongoose.model('Result', ResultSchema);

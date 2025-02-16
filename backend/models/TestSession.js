// backend/models/TestSession.js
const mongoose = require("mongoose");

const TestSessionSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: "1h" } // Auto-delete after 1 hour
});

module.exports = mongoose.models.TestSession || mongoose.model("TestSession", TestSessionSchema);

// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true, // Unique names are still enforced.
    trim: true,
  },
}, { timestamps: true });

// No need to call UserSchema.index(...) since `unique: true` will create the index.
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

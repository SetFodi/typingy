// backend/lib/dbConnect.js
const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Removed useNewUrlParser and useUnifiedTopology as they are deprecated in MongoDB Driver v4+
      // These options are now always true by default
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = dbConnect;

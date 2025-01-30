// backend/lib/dbConnect.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connection = {};

async function dbConnect() {
  if (connection.isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
}

module.exports = dbConnect;

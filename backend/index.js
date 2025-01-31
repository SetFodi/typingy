// typingy/backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConnect = require('./lib/dbConnect');
const Result = require('./models/Result');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Parse Allowed Origins from Environment Variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; // Fallback to localhost:3000 if not set

// CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
dbConnect();

// API Routes
app.post('/api/results', async (req, res) => {
  try {
    const { userId, wpm, accuracy, errorCount, duration } = req.body;

    // Debugging: Log received data
    console.log("Received Test Data:", req.body);

    // Basic validation
    if (
      !userId ||
      typeof wpm !== 'number' ||
      typeof accuracy !== 'number' ||
      typeof errorCount !== 'number' ||
      typeof duration !== 'number'
    ) {
      return res.status(400).json({ success: false, message: 'Invalid input data.' });
    }

    const newResult = new Result({
      userId,
      wpm,
      accuracy,
      errorCount, // Use errorCount as per schema
      duration,
    });

    const savedResult = await newResult.save();

    res.status(201).json({ success: true, data: savedResult });
  } catch (error) {
    console.error('Error in POST /api/results:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId.' });
    }

    const results = await Result.find({ userId });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Error in GET /api/results:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConnect = require('./lib/dbConnect');
const User = require('./models/User');
const Result = require('./models/Result');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define Allowed Origins from Environment Variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; // Fallback to localhost:3000 if not set

// CORS Options
// Update the corsOptions in your backend/index.js
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like local development)
    if (!origin || 
        origin === 'null' || 
        allowedOrigins.indexOf(origin) !== -1
    ) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
    return callback(new Error(msg), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
dbConnect();

// API Routes

// POST /api/users - Register or Log In a user
app.post('/api/users', async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ success: false, message: 'Missing userId or name.' });
    }

    // Check if a user with that name exists
    let user = await User.findOne({ name: name.trim() });
    if (user) {
      // If the user exists, simply return it (login flow)
      return res.status(200).json({ success: true, data: user });
    }

    // Otherwise, create a new user using the provided UUID as _id
    const newUser = new User({
      _id: userId,  // Use the provided UUID as the _id
      name: name.trim(),
    });

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error('Error in POST /api/users:', error.message);
    if (error.code === 11000) { // Duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(409).json({ success: false, message: `Duplicate field: ${duplicateField}. Please choose a different value.` });
    } else {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
});

// POST /api/results - Submit a new test result
app.post('/api/results', async (req, res) => {
  try {
    const { userId, wpm, accuracy, errorCount, duration } = req.body;

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

    // Check if the user exists using the _id field (your custom UUID)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Create a new result
    const newResult = new Result({
      userId,
      wpm,
      // Optionally, if you want to store the user's name with the result, you can include it:
      // name: user.name,
      accuracy,
      errorCount,
      duration,
    });

    const savedResult = await newResult.save();

    res.status(201).json({ success: true, data: savedResult });
  } catch (error) {
    console.error('Error in POST /api/results:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// GET /api/results - Fetch user-specific results
app.get('/api/results', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId.' });
    }

    const results = await Result.find({ userId }).populate("userId", "name");


    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Error in GET /api/results:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET /api/leaderboard - Fetch top 10 results
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topResults = await Result.find({})
    .sort({ wpm: -1, accuracy: -1 })
    .limit(10)
    .populate("userId", "name wpm accuracy"); // Get user name
  
    res.status(200).json({ success: true, data: topResults });
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error.message);
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

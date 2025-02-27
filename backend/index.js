const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const dbConnect = require("./lib/dbConnect");
const User = require("./models/User");
const Result = require("./models/Result");
const TestSession = require("./models/TestSession");

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Define allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === "null" || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
    return callback(new Error(msg), false);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", apiLimiter);

// Connect to MongoDB
dbConnect();

// ------------------------
// API Routes
// ------------------------

// POST /api/users - Register or log in a user
app.post("/api/users", async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ success: false, message: "Missing userId or name." });
    }
    let user = await User.findOne({ name: name.trim() });
    if (user) {
      return res.status(200).json({ success: true, data: user });
    }
    const newUser = new User({
      _id: userId,
      name: name.trim(),
    });
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error("Error in POST /api/users:", error.message);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(409).json({ success: false, message: `Duplicate field: ${duplicateField}. Please choose a different value.` });
    } else {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
});

// POST /api/test/start - Start a new test session
app.post("/api/test/start", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ success: false, message: "Missing userId or text." });
    }
    const testId = uuidv4();
    const newSession = new TestSession({ testId, userId, text });
    await newSession.save();
    res.status(201).json({ success: true, data: { testId, text } });
  } catch (error) {
    console.error("Error starting test session:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// POST /api/results - Submit a new test result with testId and keystrokes
app.post("/api/results", async (req, res) => {
  try {
    const { userId, testId, wpm, accuracy, errorCount, duration, keystrokes, signature } = req.body;
    if (
      !userId ||
      !testId ||
      typeof wpm !== "number" ||
      typeof accuracy !== "number" ||
      typeof errorCount !== "number" ||
      typeof duration !== "number" ||
      !Array.isArray(keystrokes) ||
      !signature
    ) {
      return res.status(400).json({ success: false, message: "Invalid input data or missing signature." });
    }

    // Create payload (without signature)
    const payload = { userId, testId, wpm, accuracy, errorCount, duration };

    // Verify HMAC signature
    const hmac = crypto.createHmac("sha256", process.env.HMAC_SECRET);
    hmac.update(JSON.stringify(payload));
    const calculatedSignature = hmac.digest("hex");
    if (calculatedSignature !== signature) {
      return res.status(403).json({ success: false, message: "Invalid signature. Data may have been tampered with." });
    }

    // Retrieve test session to get the original text
    const session = await TestSession.findOne({ testId, userId });
    if (!session) {
      return res.status(404).json({ success: false, message: "Test session not found or expired." });
    }

    // Optionally: Recalculate metrics using session.text and keystrokes here...

    // Check that the submitted wpm is within a realistic range
    if (wpm > 300) {
      return res.status(400).json({ success: false, message: "Unrealistic WPM value submitted." });
    }

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Create and save the result
    const newResult = new Result({
      userId,
      wpm,
      accuracy,
      errorCount,
      duration,
    });
    const savedResult = await newResult.save();

    res.status(201).json({ success: true, data: savedResult });
  } catch (error) {
    console.error("Error in POST /api/results:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /api/results - Fetch user-specific results
app.get("/api/results", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId." });
    }
    const results = await Result.find({ userId }).populate("userId", "name");
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error in GET /api/results:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /api/leaderboard - Fetch top 10 best scores per user
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          bestAccuracy: { $max: "$accuracy" }
        }
      },
      {
        $lookup: {
          from: "users", // Ensure this matches your collection name for users
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          bestWpm: 1,
          bestAccuracy: 1
        }
      },
      { $sort: { bestWpm: -1, bestAccuracy: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Server Error" : err.message,
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

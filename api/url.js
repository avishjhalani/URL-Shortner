const express = require("express");
const urlRoute = require("../routes/url");
const { connectToMongoDB } = require("../connect");

const app = express();

// Middleware
app.use(express.json({ strict: false }));

let isConnected = false;

async function ensureDB() {
  if (!isConnected) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is required");
    }
    await connectToMongoDB(MONGODB_URI);
    isConnected = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error("DB connection failed", err);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes - handle both POST /api/url and POST /api/url/
app.use("/", urlRoute);

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Ensure proper JSON responses
  res.setHeader('Content-Type', 'application/json');
  
  // Handle the request with Express
  return new Promise((resolve) => {
    app(req, res);
    res.on('finish', resolve);
  });
};


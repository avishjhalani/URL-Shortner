const express = require("express");
const urlRoute = require("../routes/url");
const { connectToMongoDB } = require("../connect");
const URL = require("../models/url");

const app = express();

// Middleware
app.use(express.json({ strict: false }));

let isConnected = false;

async function ensureDB() {
  if (!isConnected) {
    await connectToMongoDB(process.env.MONGODB_URI);
    isConnected = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error("DB connection failed", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/url", urlRoute);

app.get("/:shortID", async (req, res) => {
  try {
    const { shortID } = req.params;

    if (!shortID || shortID.length > 20) {
      return res.status(400).json({ error: "Invalid short ID" });
    }

    const entry = await URL.findOneAndUpdate(
      { shortID },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true, select: "redirectURL -_id" }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.redirect(301, entry.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vercel handler
module.exports = (req, res) => {
  app(req, res);
};

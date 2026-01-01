// This file is for local development only
// Vercel uses individual API route files in /api folder
const express = require("express");
const urlRoute = require("../routes/url");
const { connectToMongoDB } = require("../connect");
const URL = require("../models/url");

const app = express();
const PORT = process.env.PORT || 8001;

// Serve static files
app.use(express.static("public"));

// Middleware
app.use(express.json({ strict: false }));

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
connectToMongoDB(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

// Only listen in local development
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
}

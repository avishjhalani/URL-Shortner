const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const { handleGetAnalytics } = require("./controllers/url");

const app = express();
const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/URLSHORT";

// Serve static files from public directory
app.use(express.static("public"));

// Middleware to parse JSON bodies
app.use(express.json({ strict: false }));

// Connect to MongoDB (will be cached in serverless)
// Don't await - let it connect in background for faster cold starts
connectToMongoDB(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Don't crash the app - connection will retry on first request
  });

app.use("/url", urlRoute);

// Analytics route - must be before the catch-all route
app.get("/analytics/:shortID", handleGetAnalytics);

// Redirect route - optimized for performance
app.get("/:shortID", async (req, res) => {
  try {
    const shortID = req.params.shortID;

    // Basic validation
    if (!shortID || shortID.length > 20) {
      return res.status(400).json({ error: "Invalid short ID" });
    }

    // Use new: true to get updated document, and only select needed fields
    const entry = await URL.findOneAndUpdate(
      { shortID },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { 
        new: true,
        select: 'redirectURL -_id' // Only get redirectURL, exclude _id
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.redirect(301, entry.redirectURL); // 301 permanent redirect
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Export for Vercel serverless, listen for local development
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
} else {
  module.exports = app;
}

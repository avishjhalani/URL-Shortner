const { handleGetAnalytics } = require("../../controllers/url");
const { connectToMongoDB } = require("../../connect");

let isConnected = false;

module.exports = async (req, res) => {
  try {
    // Ensure DB connection (cached across invocations)
    if (!isConnected) {
      const MONGODB_URI = process.env.MONGODB_URI;
      if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is required");
      }

      await connectToMongoDB(MONGODB_URI);
      isConnected = true;
    }

    // Vercel dynamic route: /api/analytics/[shortID]
    const { shortID } = req.query;

    if (!shortID || typeof shortID !== "string" || shortID.length > 20) {
      return res.status(400).json({ error: "Invalid short ID" });
    }

    // Forward param to controller
    req.params = { shortID };

    return handleGetAnalytics(req, res);
  } catch (err) {
    console.error("Analytics error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        details: err.message,
      });
    }
  }
};

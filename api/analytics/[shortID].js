const { handleGetAnalytics } = require("../../controllers/url");
const { connectToMongoDB } = require("../../connect");

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

module.exports = async (req, res) => {
  try {
    await ensureDB();
    
    // Extract shortID from Vercel dynamic route
    const shortID = req.query.shortID || req.url.split('/').pop();
    
    if (!shortID || shortID.length > 20) {
      return res.status(400).json({ error: "Invalid short ID" });
    }
    
    req.params = { shortID };
    await handleGetAnalytics(req, res);
  } catch (err) {
    console.error("Analytics error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
};


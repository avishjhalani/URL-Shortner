const URL = require("../models/url");
const { connectToMongoDB } = require("../connect");

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
    
    // Extract shortID from URL path
    // Vercel dynamic route: /api/[shortID] - shortID is available in req.query
    // Also handle direct path access: /api/abc123 -> abc123
    let shortID = req.query.shortID;
    
    // If not in query, extract from URL path
    if (!shortID) {
      const urlPath = req.url.split('?')[0]; // Remove query string
      const pathParts = urlPath.split('/').filter(p => p); // Split and remove empty
      shortID = pathParts[pathParts.length - 1]; // Get last part (the shortID)
    }
    
    // Validate shortID
    if (!shortID || shortID.length > 20 || shortID.includes('/') || shortID === 'api') {
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
    console.error("Redirect error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
};


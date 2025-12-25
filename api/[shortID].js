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
    
    const shortID = req.query.shortID || req.url.split('/').pop();
    
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
    console.error("Redirect error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


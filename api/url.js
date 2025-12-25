const { handleGenerateNewShortURL } = require("../controllers/url");
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
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Ensure database connection
    await ensureDB();
    
    // Vercel automatically parses JSON body, but ensure it exists
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }
    
    // Call the controller
    await handleGenerateNewShortURL(req, res);
    
  } catch (err) {
    console.error("API error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Internal server error",
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};


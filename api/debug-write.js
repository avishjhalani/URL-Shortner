const URL = require("../models/url");
const { connectToMongoDB } = require("../connect");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
  try {
    console.log("➡️ Function started");

    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

    await connectToMongoDB(process.env.MONGODB_URI);

    console.log("✅ Connected");
    console.log("DB name:", mongoose.connection.name);

    const doc = await URL.create({
      shortID: "first-doc",
      redirectURL: "https://google.com",
    });

    console.log("✅ Document created");

    res.status(200).json({ ok: true, doc });
  } catch (err) {
    console.error("🔥 FUNCTION CRASH:", err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

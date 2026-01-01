const URL = require("../models/url");
const { connectToMongoDB } = require("../connect");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
  await connectToMongoDB(process.env.MONGODB_URI);

  console.log("DB name:", mongoose.connection.name);

  const doc = await URL.create({
    shortID: "first-doc",
    redirectURL: "https://google.com",
  });

  res.json({ ok: true, db: mongoose.connection.name, doc });
};

const mongoose = require('mongoose');

// Cache the connection for serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB(url) {
    // If already connected, return the existing connection
    if (cached.conn) {
        return cached.conn;
    }

    // If connection is in progress, wait for it
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(url, opts).then((mongoose) => {
            console.log('MongoDB connected');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = { connectToMongoDB };
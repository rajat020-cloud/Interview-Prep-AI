const mongoose = require("mongoose")

// Global connection caching across serverless invocations (Vercel Node.js functions)
let cached = global.mongooseConnection
if (!cached) {
    cached = global.mongooseConnection = { conn: null, promise: null }
}

async function connectToDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 10
        }).then((mongooseInstance) => {
            console.log("Connected to MongoDB Database")
            return mongooseInstance
        }).catch(err => {
            cached.promise = null
            console.warn("MongoDB connection attempt:", err.message)
            throw err
        })
    }

    try {
        cached.conn = await cached.promise
        return cached.conn
    } catch (e) {
        cached.promise = null
        throw e
    }
}

mongoose.connection.on("disconnected", () => {
    cached.conn = null
    cached.promise = null
})

module.exports = connectToDB

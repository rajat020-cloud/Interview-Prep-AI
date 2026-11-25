const mongoose = require("mongoose")

let isConnecting = false

async function connectToDB() {
    if (mongoose.connection.readyState === 1 || isConnecting) return

    isConnecting = true
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log("Connected to MongoDB Database")
        isConnecting = false
    } catch (err) {
        isConnecting = false
        console.warn("MongoDB connection failed (waiting for Atlas IP whitelist):", err.message.slice(0, 100))
        // Automatically retry connecting every 5 seconds until Atlas accepts connection
        setTimeout(connectToDB, 5000)
    }
}

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting reconnect in 5s...")
    setTimeout(connectToDB, 5000)
})

module.exports = connectToDB
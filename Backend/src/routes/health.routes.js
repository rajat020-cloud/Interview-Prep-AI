const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()

router.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    return res.status(200).json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus,
        service: "Interview Prep AI API",
        version: "2.0.0"
    })
})

module.exports = router

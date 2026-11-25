require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const app = express()

// 1. Trust proxy for Vercel, Render, Reverse Proxies
app.set("trust proxy", 1)

// 2. Security HTTP headers
app.use(helmet({
    contentSecurityPolicy: false, // Allows flexible API usage across clients
    crossOriginEmbedderPolicy: false
}))

// 3. CORS configuration
const allowedOrigins = process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",") : [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://interview-prep-ai-taupe.vercel.app",
    "https://interview-ready-ai-wheat.vercel.app"
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        // Allow Vercel preview URLs
        if (origin.endsWith(".vercel.app")) return callback(null, true)
        callback(new Error("CORS origin not allowed: " + origin))
    },
    credentials: true
}))

// 4. Rate Limiting (Protection against brute-force / DoS)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, default: false },
    message: { message: "Too many requests from this IP, please try again after 15 minutes" }
})
app.use("/api/", apiLimiter)

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    validate: { xForwardedForHeader: false, default: false },
    message: { message: "Too many authentication attempts, please try again later" }
})
app.use("/api/auth/login", authLimiter)
app.use("/api/auth/register", authLimiter)

// 5. Body and Cookie Parsers
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// 5.1 Auto-connect to DB for Vercel Serverless Function invocations
const connectToDB = require("./config/database")
app.use(async (req, res, next) => {
    try {
        await connectToDB()
        next()
    } catch (err) {
        console.warn("DB Connection check:", err.message)
        next()
    }
})

// 6. Require all routes
const healthRouter = require("./routes/health.routes")
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const mockRouter = require("./routes/mockInterview.routes")
const codingRouter = require("./routes/codingPractice.routes")
const savedQuestionRouter = require("./routes/savedQuestion.routes")
const analyticsRouter = require("./routes/analytics.routes")
const notificationRouter = require("./routes/notification.routes")
const adminRouter = require("./routes/admin.routes")

// 7. Mount routes
app.use("/api/health", healthRouter)
app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/mock", mockRouter)
app.use("/api/coding", codingRouter)
app.use("/api/saved-questions", savedQuestionRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api/notifications", notificationRouter)

// Request logging for serverless observability
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (original: ${req.originalUrl})`)
    next()
})

// Root health ping
app.get(["/", "/api", "/api/health"], (req, res) => {
    res.json({
        status: "online",
        message: "Interview Prep AI Backend API is active and running.",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    })
})

// 8. Centralized 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})

// 9. Centralized Error Handler
app.use((err, req, res, next) => {
    console.error("Express Error Handler:", err.stack || err.message)
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app

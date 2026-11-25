require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

// Connect to MongoDB
connectToDB()

// In local environment, start HTTP server; on Vercel, the app is exported as a serverless handler
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

module.exports = app

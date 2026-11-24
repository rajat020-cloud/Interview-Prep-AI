const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const analyticsController = require("../controllers/analytics.controller")

const router = express.Router()

router.get("/dashboard", authMiddleware.authUser, analyticsController.getDashboardAnalyticsController)

module.exports = router

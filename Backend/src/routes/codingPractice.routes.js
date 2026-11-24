const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const codingController = require("../controllers/codingPractice.controller")

const router = express.Router()

router.post("/generate", authMiddleware.authUser, codingController.generateChallengeController)
router.post("/:challengeId/review", authMiddleware.authUser, codingController.submitCodeReviewController)
router.get("/", authMiddleware.authUser, codingController.getCodingHistoryController)

module.exports = router

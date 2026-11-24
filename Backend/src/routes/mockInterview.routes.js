const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const mockController = require("../controllers/mockInterview.controller")

const router = express.Router()

router.post("/start", authMiddleware.authUser, mockController.startMockInterviewController)
router.post("/:sessionId/answer", authMiddleware.authUser, mockController.submitAnswerController)
router.get("/:sessionId", authMiddleware.authUser, mockController.getSessionByIdController)
router.get("/", authMiddleware.authUser, mockController.getMockHistoryController)

module.exports = router

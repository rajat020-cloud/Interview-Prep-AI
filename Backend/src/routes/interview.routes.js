const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * Generate new interview report
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * Get all interview reports for user
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * Get single interview report
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * Delete interview report
 */
interviewRouter.delete("/report/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewReportController)

/**
 * Toggle roadmap task completion
 */
interviewRouter.patch("/report/:interviewId/task", authMiddleware.authUser, interviewController.toggleRoadmapTaskController)

/**
 * Report AI Assistant interactive follow-up
 */
interviewRouter.post("/report/:interviewId/assistant", authMiddleware.authUser, interviewController.askReportAssistantController)

/**
 * Generate resume PDF
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter

const mongoose = require("mongoose")
const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, askReportAssistant } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const notificationModel = require("../models/notification.model")

/**
 * Generate interview report from resume (PDF/text) and job description
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeContent = ""
        if (req.file && req.file.buffer) {
            try {
                // Compatible with pdf-parse v1 and v2
                if (typeof pdfParse === 'function') {
                    const parsed = await pdfParse(req.file.buffer)
                    resumeContent = parsed.text || ""
                } else if (pdfParse.PDFParse) {
                    const parser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))
                    const parsed = await parser.getText()
                    resumeContent = parsed.text || ""
                }
            } catch (pdfErr) {
                console.warn("PDF extraction warning:", pdfErr.message)
                resumeContent = "Resume file uploaded (raw binary parsing note: " + pdfErr.message + ")"
            }
        }

        const { selfDescription = "", jobDescription = "", title = "", company = "" } = req.body

        if (!jobDescription.trim()) {
            return res.status(400).json({ message: "Job description is required." })
        }

        if (!resumeContent.trim() && !selfDescription.trim()) {
            return res.status(400).json({ message: "Please provide either a Resume PDF or a Self Description." })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription,
            title,
            company
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            title: title || interViewReportByAi.title || "Software Engineer",
            company: company || interViewReportByAi.company || "Target Company",
            ...interViewReportByAi
        })

        // Create in-app notification
        await notificationModel.create({
            user: req.user.id,
            title: "Interview Plan Ready! 🎯",
            message: `Your personalized interview strategy for ${interviewReport.title} at ${interviewReport.company} is generated.`,
            type: "report_ready",
            link: `/interview/${interviewReport._id}`
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Report Generation Error:", err)
        return res.status(500).json({ message: "Failed to generate interview report. " + err.message })
    }
}

/**
 * Get interview report by ID
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch report. " + err.message })
    }
}

/** 
 * Get all interview reports of logged in user (with optional search query)
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const { q, sort = "newest" } = req.query
        const filter = { user: req.user.id }

        if (q && q.trim()) {
            filter.$or = [
                { title: { $regex: q.trim(), $options: "i" } },
                { company: { $regex: q.trim(), $options: "i" } }
            ]
        }

        const sortOption = sort === "score" ? { matchScore: -1 } : { createdAt: -1 }

        const interviewReports = await interviewReportModel.find(filter)
            .sort(sortOption)
            .select("title company matchScore matchBreakdown keyInsights createdAt isBookmarked")

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch reports. " + err.message })
    }
}

/**
 * Delete interview report
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params
        const deleted = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id })

        if (!deleted) {
            return res.status(404).json({ message: "Report not found or unauthorized." })
        }

        return res.status(200).json({ message: "Interview report deleted successfully." })
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete report. " + err.message })
    }
}

/**
 * Toggle task completion in preparation plan
 */
async function toggleRoadmapTaskController(req, res) {
    try {
        const { interviewId } = req.params
        const { dayIndex, taskIndex } = req.body

        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!report) return res.status(404).json({ message: "Report not found." })

        if (report.preparationPlan[dayIndex] && report.preparationPlan[dayIndex].tasks[taskIndex]) {
            const currentStatus = report.preparationPlan[dayIndex].tasks[taskIndex].completed
            report.preparationPlan[dayIndex].tasks[taskIndex].completed = !currentStatus
            await report.save()
            return res.status(200).json({
                message: "Task status updated",
                preparationPlan: report.preparationPlan
            })
        }

        return res.status(400).json({ message: "Invalid day or task index." })
    } catch (err) {
        return res.status(500).json({ message: "Failed to update task. " + err.message })
    }
}

/**
 * Interactive AI Assistant inside Report
 */
async function askReportAssistantController(req, res) {
    try {
        const { interviewId } = req.params
        const { questionContext, userPrompt } = req.body

        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!report) return res.status(404).json({ message: "Report not found." })

        const answer = await askReportAssistant({
            reportContext: {
                title: report.title,
                company: report.company,
                matchScore: report.matchScore
            },
            questionContext,
            userPrompt
        })

        return res.status(200).json({ answer })
    } catch (err) {
        return res.status(500).json({ message: "AI Assistant failed: " + err.message })
    }
}

/**
 * Generate resume PDF
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params
    try {
        let interviewReport = null
        if (mongoose.Types.ObjectId.isValid(interviewReportId)) {
            interviewReport = await interviewReportModel.findById(interviewReportId)
        }
        if (!interviewReport) {
            // Find latest report for this user as fallback
            interviewReport = await interviewReportModel.findOne({ user: req.user._id }).sort({ createdAt: -1 })
        }
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const { resume, jobDescription, selfDescription, company, title } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription, company, title })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=ATS_Resume_${interviewReport._id}.pdf`
        })

        return res.send(pdfBuffer)
    } catch (err) {
        console.error("PDF generation error:", err.message)
        return res.status(500).json({
            message: "Failed to generate resume PDF: " + err.message
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    toggleRoadmapTaskController,
    askReportAssistantController,
    generateResumePdfController
}

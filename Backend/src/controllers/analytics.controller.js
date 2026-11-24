const interviewReportModel = require("../models/interviewReport.model")
const mockInterviewModel = require("../models/mockInterview.model")
const codingPracticeModel = require("../models/codingPractice.model")
const userModel = require("../models/user.model")

/**
 * Get comprehensive analytics for user
 */
async function getDashboardAnalyticsController(req, res) {
    try {
        const userId = req.user.id

        const [ user, reports, mocks, codings ] = await Promise.all([
            userModel.findById(userId).select("username fullName targetRole streak"),
            interviewReportModel.find({ user: userId }).sort({ createdAt: -1 }),
            mockInterviewModel.find({ user: userId }).sort({ createdAt: -1 }),
            codingPracticeModel.find({ user: userId })
        ])

        const totalReports = reports.length
        const totalMockInterviews = mocks.length
        const completedCodingChallenges = codings.filter(c => c.isCompleted).length

        // Average match score
        const avgMatchScore = totalReports > 0
            ? Math.round(reports.reduce((sum, r) => sum + (r.matchScore || 0), 0) / totalReports)
            : 0

        // Preparation tasks progress
        let totalTasks = 0
        let completedTasks = 0
        reports.forEach(report => {
            if (report.preparationPlan && Array.isArray(report.preparationPlan)) {
                report.preparationPlan.forEach(day => {
                    if (day.tasks && Array.isArray(day.tasks)) {
                        totalTasks += day.tasks.length
                        completedTasks += day.tasks.filter(t => t.completed).length
                    }
                })
            }
        })
        const preparationProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        // Recent activity (latest 5 reports)
        const recentActivity = reports.slice(0, 5).map(r => ({
            id: r._id,
            title: r.title,
            company: r.company || "Target Company",
            matchScore: r.matchScore,
            createdAt: r.createdAt
        }))

        // Match Score Trend (chronological)
        const matchScoreTrend = reports
            .slice()
            .reverse()
            .map(r => ({
                date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: r.matchScore,
                role: r.title
            }))

        // Skill gaps aggregation
        const highPriorityGaps = []
        reports.forEach(r => {
            if (r.skillGaps) {
                r.skillGaps.forEach(g => {
                    if (g.severity === "high" && !highPriorityGaps.includes(g.skill)) {
                        highPriorityGaps.push(g.skill)
                    }
                })
            }
        })

        return res.status(200).json({
            stats: {
                totalReports,
                avgMatchScore,
                totalMockInterviews,
                streak: user?.streak || 1,
                preparationProgress,
                completedTasks,
                totalTasks,
                completedCodingChallenges
            },
            recentActivity,
            matchScoreTrend,
            highPriorityGaps: highPriorityGaps.slice(0, 6)
        })
    } catch (err) {
        console.error("Analytics Error:", err)
        return res.status(500).json({ message: "Failed to fetch analytics: " + err.message })
    }
}

module.exports = {
    getDashboardAnalyticsController
}

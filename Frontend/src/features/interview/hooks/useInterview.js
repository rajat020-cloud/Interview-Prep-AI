import { useContext } from "react"
import { InterviewContext } from "../interview.context"
import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    deleteInterviewReport,
    toggleRoadmapTask,
    askReportAssistant,
    generateResumePdf,
    getDashboardAnalytics,
    startMockInterview,
    submitMockAnswer,
    getMockSession,
    getMockHistory,
    generateCodingChallenge,
    submitCodingReview,
    getCodingHistory,
    saveQuestion,
    getSavedQuestions,
    deleteSavedQuestion,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../services/interview.api"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading, setLoading,
        report, setReport,
        reports, setReports,
        analytics, setAnalytics,
        notifications, setNotifications,
        unreadCount, setUnreadCount
    } = context

    // ── Interview Reports ────────────────────────────────────────────────────
    const generateReport = async ({ jobDescription, selfDescription, resumeFile, title, company }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile, title, company })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Report generate error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Fetch report error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReports = async (query = "", sort = "newest") => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports(query, sort)
            setReports(response.interviewReports || [])
            return response.interviewReports
        } catch (error) {
            console.error("Fetch reports error:", error)
            return []
        } finally {
            setLoading(false)
        }
    }

    const removeReport = async (interviewId) => {
        try {
            await deleteInterviewReport(interviewId)
            setReports(prev => prev.filter(r => r._id !== interviewId))
            if (report?._id === interviewId) setReport(null)
            return true
        } catch (error) {
            console.error("Delete report error:", error)
            return false
        }
    }

    const toggleTask = async (interviewId, dayIndex, taskIndex) => {
        try {
            const res = await toggleRoadmapTask(interviewId, dayIndex, taskIndex)
            if (report && report._id === interviewId) {
                setReport({ ...report, preparationPlan: res.preparationPlan })
            }
            return res.preparationPlan
        } catch (err) {
            console.error("Toggle task error:", err)
        }
    }

    const askAssistant = async (interviewId, questionContext, userPrompt) => {
        try {
            const res = await askReportAssistant(interviewId, questionContext, userPrompt)
            return res.answer
        } catch (err) {
            console.error("Assistant error:", err)
            throw err
        }
    }

    const getResumePdfDownload = async (param) => {
        setLoading(true)
        const id = typeof param === 'object' && param !== null
            ? (param.interviewReportId || param._id || param.id)
            : param
        try {
            const response = await generateResumePdf(id)
            const blob = response instanceof Blob ? response : new Blob([response], { type: "application/pdf" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `ATS_Resume_${id || 'Tailored'}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            setTimeout(() => window.URL.revokeObjectURL(url), 5000)
        } catch (error) {
            console.warn("Backend PDF generation had issue, falling back to browser print:", error)
            window.print()
        } finally {
            setLoading(false)
        }
    }

    // ── Analytics ────────────────────────────────────────────────────────────
    const fetchAnalytics = async () => {
        try {
            const data = await getDashboardAnalytics()
            setAnalytics(data)
            return data
        } catch (err) {
            console.error("Fetch analytics error:", err)
        }
    }

    // ── Notifications ────────────────────────────────────────────────────────
    const fetchNotifications = async () => {
        try {
            const data = await getNotifications()
            setNotifications(data.notifications || [])
            setUnreadCount(data.unreadCount || 0)
        } catch (err) {
            console.error("Fetch notifications error:", err)
        }
    }

    const markRead = async (id) => {
        try {
            await markNotificationRead(id)
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error("Mark read error:", err)
        }
    }

    const markAllRead = async () => {
        try {
            await markAllNotificationsRead()
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error("Mark all read error:", err)
        }
    }

    return {
        loading,
        report,
        setReport,
        reports,
        analytics,
        notifications,
        unreadCount,
        generateReport,
        getReportById,
        getReports,
        removeReport,
        toggleTask,
        askAssistant,
        getResumePdf: getResumePdfDownload,
        fetchAnalytics,
        fetchNotifications,
        markRead,
        markAllRead,
        // Mock interviews
        startMockInterview,
        submitMockAnswer,
        getMockSession,
        getMockHistory,
        // Coding challenges
        generateCodingChallenge,
        submitCodingReview,
        getCodingHistory,
        // Saved questions
        saveQuestion,
        getSavedQuestions,
        deleteSavedQuestion
    }
}

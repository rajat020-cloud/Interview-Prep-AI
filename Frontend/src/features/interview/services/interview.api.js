import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
})

// ── Interview Reports ────────────────────────────────────────────────────────
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile, title, company }) => {
    const formData = new FormData()
    if (jobDescription) formData.append("jobDescription", jobDescription)
    if (selfDescription) formData.append("selfDescription", selfDescription)
    if (title) formData.append("title", title)
    if (company) formData.append("company", company)
    if (resumeFile) formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

export const getAllInterviewReports = async (query = "", sort = "newest") => {
    const params = new URLSearchParams()
    if (query) params.append("q", query)
    if (sort) params.append("sort", sort)
    const response = await api.get(`/api/interview/?${params.toString()}`)
    return response.data
}

export const deleteInterviewReport = async (interviewId) => {
    const response = await api.delete(`/api/interview/report/${interviewId}`)
    return response.data
}

export const toggleRoadmapTask = async (interviewId, dayIndex, taskIndex) => {
    const response = await api.patch(`/api/interview/report/${interviewId}/task`, {
        dayIndex, taskIndex
    })
    return response.data
}

export const askReportAssistant = async (interviewId, questionContext, userPrompt) => {
    const response = await api.post(`/api/interview/report/${interviewId}/assistant`, {
        questionContext, userPrompt
    })
    return response.data
}

export const generateResumePdf = async (param) => {
    const id = typeof param === 'object' && param !== null
        ? (param.interviewReportId || param._id || param.id)
        : param
    const response = await api.post(`/api/interview/resume/pdf/${id}`, null, {
        responseType: "blob"
    })
    return response.data
}

// ── Analytics ────────────────────────────────────────────────────────────────
export const getDashboardAnalytics = async () => {
    const response = await api.get("/api/analytics/dashboard")
    return response.data
}

// ── Mock Interview ───────────────────────────────────────────────────────────
export const startMockInterview = async ({ role, company, difficulty, durationMinutes }) => {
    const response = await api.post("/api/mock/start", { role, company, difficulty, durationMinutes })
    return response.data
}

export const submitMockAnswer = async (sessionId, userAnswer) => {
    const response = await api.post(`/api/mock/${sessionId}/answer`, { userAnswer })
    return response.data
}

export const getMockSession = async (sessionId) => {
    const response = await api.get(`/api/mock/${sessionId}`)
    return response.data
}

export const getMockHistory = async () => {
    const response = await api.get("/api/mock/")
    return response.data
}

// ── Coding Practice ──────────────────────────────────────────────────────────
export const generateCodingChallenge = async ({ topic, difficulty }) => {
    const response = await api.post("/api/coding/generate", { topic, difficulty })
    return response.data
}

export const submitCodingReview = async (challengeId, userCode) => {
    const response = await api.post(`/api/coding/${challengeId}/review`, { userCode })
    return response.data
}

export const getCodingHistory = async () => {
    const response = await api.get("/api/coding/")
    return response.data
}

// ── Saved Questions ──────────────────────────────────────────────────────────
export const saveQuestion = async (questionData) => {
    const response = await api.post("/api/saved-questions", questionData)
    return response.data
}

export const getSavedQuestions = async (type = "all", query = "") => {
    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (query) params.append("q", query)
    const response = await api.get(`/api/saved-questions?${params.toString()}`)
    return response.data
}

export const deleteSavedQuestion = async (id) => {
    const response = await api.delete(`/api/saved-questions/${id}`)
    return response.data
}

// ── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = async () => {
    const response = await api.get("/api/notifications")
    return response.data
}

export const markNotificationRead = async (id) => {
    const response = await api.patch(`/api/notifications/${id}/read`)
    return response.data
}

export const markAllNotificationsRead = async () => {
    const response = await api.patch("/api/notifications/read-all")
    return response.data
}

export default api

const mockInterviewModel = require("../models/mockInterview.model")
const { generateMockQuestion, generateMockQuestionsBatch, evaluateMockAnswer } = require("../services/ai.service")
const notificationModel = require("../models/notification.model")

const TOTAL_QUESTIONS = 5

/**
 * Start a new mock interview session with pre-generated questions for zero lag
 */
async function startMockInterviewController(req, res) {
    try {
        const { role = "Software Engineer", company = "Tech Company", difficulty = "Medium", durationMinutes = 15 } = req.body

        // Generate full question suite in a single batch so transitions are instant
        let questions = []
        try {
            questions = await generateMockQuestionsBatch({
                role,
                company,
                difficulty,
                count: TOTAL_QUESTIONS
            })
        } catch (batchErr) {
            console.warn("Batch question generation fallback:", batchErr.message)
            const firstQ = await generateMockQuestion({
                role,
                company,
                difficulty,
                type: "technical",
                previousQuestions: []
            })
            questions = [firstQ]
        }

        const formattedQuestions = questions.map(q => ({
            questionText: q.questionText,
            type: q.type || "technical",
            difficulty: q.difficulty || difficulty
        }))

        const session = await mockInterviewModel.create({
            user: req.user.id,
            role,
            company,
            difficulty,
            durationMinutes,
            status: "in_progress",
            currentQuestionIndex: 0,
            questions: formattedQuestions
        })

        return res.status(201).json({
            message: "Mock interview session started",
            session
        })
    } catch (err) {
        console.error("Mock Interview Start Error:", err)
        return res.status(500).json({ message: "Failed to start mock interview: " + err.message })
    }
}

/**
 * Submit answer to current question & advance session with ultra-low latency
 */
async function submitAnswerController(req, res) {
    try {
        const { sessionId } = req.params
        const { userAnswer } = req.body

        const session = await mockInterviewModel.findOne({ _id: sessionId, user: req.user.id })
        if (!session) return res.status(404).json({ message: "Session not found." })

        const currentIndex = session.currentQuestionIndex
        const currentQ = session.questions[currentIndex]
        if (!currentQ) return res.status(400).json({ message: "Invalid question index." })

        const hasNextPreloaded = currentIndex + 1 < session.questions.length
        const isFinalQuestion = currentIndex + 1 >= TOTAL_QUESTIONS

        // If next question is already preloaded, we only evaluate current answer (1 fast API call)
        if (hasNextPreloaded || isFinalQuestion) {
            const feedback = await evaluateMockAnswer({
                question: currentQ.questionText,
                userAnswer: userAnswer || "No verbal or written answer recorded.",
                role: session.role,
                difficulty: session.difficulty
            })

            currentQ.userAnswer = userAnswer
            currentQ.feedback = feedback
            currentQ.answeredAt = new Date()

            if (hasNextPreloaded) {
                session.currentQuestionIndex += 1
            } else {
                session.status = "completed"
                const sum = session.questions.reduce((acc, q) => acc + (q.feedback?.score || 0), 0)
                session.overallScore = Math.round(sum / session.questions.length)
                session.summary = `Completed ${session.questions.length}-question mock interview for ${session.role} with overall score ${session.overallScore}%.`

                await notificationModel.create({
                    user: req.user.id,
                    title: "Mock Interview Completed! 🎙️",
                    message: `You scored ${session.overallScore}% in your mock interview for ${session.role}.`,
                    type: "mock_completed",
                    link: `/mock-interview/${session._id}`
                })
            }
        } else {
            // Fallback for legacy sessions: Run evaluation and next question generation concurrently
            const nextType = session.questions.length % 2 === 0 ? "technical" : "behavioral"
            const prevTexts = session.questions.map(q => q.questionText)

            const [feedback, nextQ] = await Promise.all([
                evaluateMockAnswer({
                    question: currentQ.questionText,
                    userAnswer: userAnswer || "No verbal or written answer recorded.",
                    role: session.role,
                    difficulty: session.difficulty
                }),
                generateMockQuestion({
                    role: session.role,
                    company: session.company,
                    difficulty: session.difficulty,
                    type: nextType,
                    previousQuestions: prevTexts
                })
            ])

            currentQ.userAnswer = userAnswer
            currentQ.feedback = feedback
            currentQ.answeredAt = new Date()

            session.questions.push({
                questionText: nextQ.questionText,
                type: nextQ.type,
                difficulty: nextQ.difficulty
            })
            session.currentQuestionIndex += 1
        }

        await session.save()

        return res.status(200).json({
            message: "Answer evaluated successfully",
            session
        })
    } catch (err) {
        console.error("Submit Answer Error:", err)
        return res.status(500).json({ message: "Failed to evaluate answer: " + err.message })
    }
}

/**
 * Get active or specific mock interview session
 */
async function getSessionByIdController(req, res) {
    try {
        const { sessionId } = req.params
        const session = await mockInterviewModel.findOne({ _id: sessionId, user: req.user.id })

        if (!session) return res.status(404).json({ message: "Session not found." })

        return res.status(200).json({ session })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch session: " + err.message })
    }
}

/**
 * Get user mock interview history
 */
async function getMockHistoryController(req, res) {
    try {
        const history = await mockInterviewModel.find({ user: req.user.id }).sort({ createdAt: -1 })
        return res.status(200).json({ history })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch history: " + err.message })
    }
}

module.exports = {
    startMockInterviewController,
    submitAnswerController,
    getSessionByIdController,
    getMockHistoryController
}

const mockInterviewModel = require("../models/mockInterview.model")
const {
    generateMockQuestion,
    generateMockQuestionsBatch,
    generateTailoredQuestionsFromIntro,
    evaluateMockAnswer
} = require("../services/ai.service")
const notificationModel = require("../models/notification.model")

const TOTAL_QUESTIONS = 10

/**
 * Start a new mock interview session:
 * Question 1 is ALWAYS the candidate introduction.
 * Follow-up questions (2-10) will be generated tailored to their introduction!
 */
async function startMockInterviewController(req, res) {
    try {
        const { role = "Software Engineer", company = "Tech Company", difficulty = "Medium", durationMinutes = 20 } = req.body

        // First question is always the introduction
        const introQuestion = {
            questionText: `Welcome to your interview for the ${role} position at ${company || 'our company'}. To get started, please introduce yourself, tell me about your background, the key projects you've built, and the technologies you're most confident with.`,
            type: "behavioral",
            difficulty: "Easy"
        }

        const session = await mockInterviewModel.create({
            user: req.user.id,
            role,
            company,
            difficulty,
            durationMinutes,
            status: "in_progress",
            currentQuestionIndex: 0,
            questions: [introQuestion]
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
 * Submit answer to current question & advance session:
 * - On Question 1 (intro), dynamically generates Questions 2-10 tailored to the candidate's introduction.
 * - On Questions 2-10, fast 1-second evaluation and instant transition.
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

        // ── Case 1: Candidate answered Question 1 (Self-Introduction) ────────
        if (currentIndex === 0 && session.questions.length === 1) {
            const [feedback, tailoredQuestions] = await Promise.all([
                evaluateMockAnswer({
                    question: currentQ.questionText,
                    userAnswer: userAnswer || "No verbal or written answer recorded.",
                    role: session.role,
                    difficulty: session.difficulty
                }),
                generateTailoredQuestionsFromIntro({
                    candidateIntro: userAnswer || `I am a ${session.role} with hands-on experience in full-stack development and APIs.`,
                    role: session.role,
                    company: session.company,
                    difficulty: session.difficulty,
                    count: TOTAL_QUESTIONS - 1
                }).catch(err => {
                    console.warn("Tailored question generation fallback:", err.message)
                    return generateMockQuestionsBatch({
                        role: session.role,
                        company: session.company,
                        difficulty: session.difficulty,
                        count: TOTAL_QUESTIONS - 1
                    })
                })
            ])

            currentQ.userAnswer = userAnswer
            currentQ.feedback = feedback
            currentQ.answeredAt = new Date()

            // Append the 9 tailored questions
            const formatted = (tailoredQuestions || []).map(q => ({
                questionText: q.questionText,
                type: q.type || "technical",
                difficulty: q.difficulty || session.difficulty
            }))

            session.questions.push(...formatted)
            session.currentQuestionIndex = 1

            await session.save()

            return res.status(200).json({
                message: "Introduction evaluated and tailored interview questions prepared",
                session
            })
        }

        // ── Case 2: Subsequent Questions (2 through 10) ──────────────────────
        const hasNextPreloaded = currentIndex + 1 < session.questions.length
        const isFinalQuestion = currentIndex + 1 >= TOTAL_QUESTIONS

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
                session.summary = `Completed full ${session.questions.length}-question mock interview for ${session.role} with overall score ${session.overallScore}%.`

                await notificationModel.create({
                    user: req.user.id,
                    title: "Mock Interview Completed! 🎙️",
                    message: `You scored ${session.overallScore}% in your mock interview for ${session.role}.`,
                    type: "mock_completed",
                    link: `/mock-interview/${session._id}`
                })
            }
        } else {
            // Fallback for older sessions
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

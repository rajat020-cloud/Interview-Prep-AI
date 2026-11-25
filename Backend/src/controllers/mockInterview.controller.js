const mockInterviewModel = require("../models/mockInterview.model")
const {
    generateMockQuestion,
    generateMockQuestionsBatch,
    generateTailoredQuestionsFromIntro,
    evaluateMockAnswer
} = require("../services/ai.service")
const notificationModel = require("../models/notification.model")

const TOTAL_QUESTIONS = 10

function getIntroductionQuestion(role = "Software Engineer", company = "our company") {
    const r = role.toLowerCase();
    if (r.includes("sale") || r.includes("account executive") || r.includes("revenue") || r.includes("sdr") || r.includes("bdr")) {
        return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, walk me through your sales experience, your approach to prospecting and closing deals, and a key quota or revenue target you achieved.`;
    }
    if (r.includes("analyst") || r.includes("analytics") || r.includes("bi ") || r.includes("business intelligence") || r.includes("data science")) {
        return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, your experience with data analysis and BI tools (such as SQL, Excel, Python, or Tableau), and an example of how your analysis influenced a business decision.`;
    }
    if (r.includes("business development") || r.includes("biz dev") || r.includes("partnership") || r.includes("growth")) {
        return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, your background in identifying business opportunities, and how you develop strategic partnerships and client pipelines.`;
    }
    if (r.includes("product manager") || r.includes("program manager") || r.includes("project manager")) {
        return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, your experience leading product or project lifecycles, and how you prioritize features and align cross-functional teams.`;
    }
    if (r.includes("market") || r.includes("seo") || r.includes("content")) {
        return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, summarize your experience managing growth and marketing campaigns, and highlight a campaign that delivered measurable results.`;
    }
    if (r.includes("engineer") || r.includes("developer") || r.includes("coder") || r.includes("software") || r.includes("frontend") || r.includes("backend") || r.includes("fullstack") || r.includes("devops")) {
        return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, tell me about your technical background, key systems or projects you have built, and the core technologies you're most proficient with.`;
    }
    return `Welcome to your interview for the ${role} position at ${company}. To get started, please introduce yourself, summarize your relevant professional background, and share what makes you an excellent fit for this role.`;
}

/**
 * Start a new mock interview session:
 * Question 1 is ALWAYS the candidate introduction tailored to the target role domain.
 * Follow-up questions (2-10) will be generated tailored to their introduction!
 */
async function startMockInterviewController(req, res) {
    try {
        const { role = "Software Engineer", company = "Tech Company", difficulty = "Medium", durationMinutes = 20 } = req.body

        // First question is always the introduction tailored to the role
        const introQuestion = {
            questionText: getIntroductionQuestion(role, company || 'our company'),
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

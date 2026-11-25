const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")
const fs = require('fs')

// Initialize Google GenAI client if key exists
const apiKey = process.env.GOOGLE_GENAI_API_KEY || ""
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

// Model selection with intelligent fallback chain
const MODELS_CHAIN = [
    process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-flash-latest"
]

/**
 * Execute Gemini call with multi-model fallback and retry support
 */
async function callGemini(contents, schema = null, preferredModel = null) {
    if (!ai) {
        throw new Error("GOOGLE_GENAI_API_KEY is not configured in backend environment.")
    }

    const config = {
        temperature: 0.7,
    }

    if (schema) {
        config.responseMimeType = "application/json"
        config.responseSchema = zodToJsonSchema(schema)
    }

    const modelsToTry = preferredModel 
        ? [preferredModel, ...MODELS_CHAIN.filter(m => m !== preferredModel)]
        : MODELS_CHAIN

    let lastError = null
    for (const model of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents,
                config
            })
            return response.text
        } catch (err) {
            lastError = err
            console.warn(`Model ${model} encountered issue (${err.message.slice(0, 80)}). Trying fallback...`)
        }
    }

    throw new Error("All Gemini models encountered transient issues: " + lastError?.message)
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. INTERVIEW REPORT GENERATION
// ─────────────────────────────────────────────────────────────────────────────

const interviewReportSchema = z.object({
    title: z.string().describe("Target job title"),
    company: z.string().describe("Company name or 'Target Company' if unspecified"),
    matchScore: z.number().min(0).max(100).describe("Overall profile to JD match percentage"),
    matchBreakdown: z.object({
        technicalSkills: z.number().min(0).max(100),
        experience: z.number().min(0).max(100),
        education: z.number().min(0).max(100),
        projectRelevance: z.number().min(0).max(100),
        keywordAlignment: z.number().min(0).max(100)
    }),
    keyInsights: z.array(z.string()).describe("3 to 5 key bullet points summarizing candidate strengths & fit"),
    overallAssessment: z.string().describe("2-3 sentence executive assessment of the candidate for this role"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("Direct technical interview question"),
        difficulty: z.enum(["Easy", "Medium", "Hard"]),
        intention: z.string().describe("What the interviewer is evaluating with this question"),
        answer: z.string().describe("Comprehensive model answer with architectural and technical depth"),
        keyConcepts: z.array(z.string()).describe("Important terms or patterns to mention"),
        followUps: z.array(z.string()).describe("Probable follow-up questions"),
        commonMistakes: z.array(z.string()).describe("Common pitfalls candidates make")
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Behavioral or situational interview question"),
        intention: z.string().describe("What leadership/cultural attribute is being tested"),
        answer: z.string().describe("High-impact sample answer structured with Situation, Task, Action, Result (STAR)"),
        evaluationCriteria: z.array(z.string()).describe("Checklist of what a hiring manager evaluates"),
        followUps: z.array(z.string()).describe("Potential probe questions")
    })),
    skillGaps: z.array(z.object({
        skill: z.string().describe("Missing or under-demonstrated skill"),
        severity: z.enum(["low", "medium", "high"]),
        whyItMatters: z.string().describe("Why this skill is crucial for this position"),
        recommendedAction: z.string().describe("Specific resource, mini-project, or topic to review")
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number (1 to 7)"),
        focus: z.string().describe("Core theme of the day, e.g. System Design, Coding Challenges, STAR stories"),
        tasks: z.array(z.object({
            text: z.string().describe("Actionable task description"),
            completed: z.boolean().default(false)
        }))
    }))
})

async function generateInterviewReport({ resume, selfDescription, jobDescription, company, title }) {
    const prompt = `You are a Principal Tech Recruiter and Senior Staff Engineering Hiring Manager at a top-tier tech company.
Analyze this candidate's resume/profile against the provided target job description. Generate an exhaustive, highly tailored interview preparation strategy.

Candidate Resume text:
${resume || "None provided"}

Candidate Self-Description:
${selfDescription || "None provided"}

Target Job Title: ${title || "Inferred from Job Description"}
Target Company: ${company || "Inferred from Job Description or 'Target Company'"}

Target Job Description:
${jobDescription}

Instructions:
1. Accurately evaluate candidate fit based strictly on evidence in the resume/profile vs requirements in the JD.
2. Produce a realistic Match Score between 0 and 100 with accurate breakdown.
3. Identify 5-7 distinct technical interview questions directly matching the required stack and candidate experience.
4. Identify 4-5 high-impact behavioral questions with STAR formatted model answers.
5. Identify explicit skill gaps with clear severity (high, medium, low).
6. Create an actionable 7-day preparation roadmap with concrete daily tasks.
7. Return strictly valid JSON conforming to the schema.`

    const rawResponse = await callGemini(prompt, interviewReportSchema)
    return JSON.parse(rawResponse)
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MOCK INTERVIEW GENERATOR & EVALUATOR
// ─────────────────────────────────────────────────────────────────────────────

const mockQuestionSchema = z.object({
    questionText: z.string(),
    type: z.enum(["technical", "behavioral"]),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    context: z.string().describe("Brief background or scenario for the question")
})

async function generateMockQuestion({ role, company, difficulty, type, previousQuestions = [] }) {
    const prompt = `Generate a realistic, high-signal ${difficulty} ${type} interview question for a candidate applying for the position of "${role}" at "${company}".
${previousQuestions.length > 0 ? `Do not repeat or overlap with these existing questions: ${previousQuestions.join(" | ")}` : ""}
Provide a clear, engaging scenario or question.`

    const raw = await callGemini(prompt, mockQuestionSchema)
    return JSON.parse(raw)
}

const mockQuestionsBatchSchema = z.object({
    questions: z.array(z.object({
        questionText: z.string(),
        type: z.enum(["technical", "behavioral"]),
        difficulty: z.enum(["Easy", "Medium", "Hard"])
    }))
})

async function generateMockQuestionsBatch({ role, company, difficulty, count = 5 }) {
    const prompt = `Generate a progressive set of ${count} realistic interview questions for a candidate applying for "${role}" at "${company || 'Tech Company'}".
Difficulty: ${difficulty}.
Include 3 focused technical questions and 2 behavioral questions.
Ensure questions are clear, practical, and interview-ready.`

    const raw = await callGemini(prompt, mockQuestionsBatchSchema, "gemini-flash-lite-latest")
    const parsed = JSON.parse(raw)
    return parsed.questions || []
}

async function generateTailoredQuestionsFromIntro({ candidateIntro, role, company, difficulty, count = 9 }) {
    const prompt = `You are an expert technical interviewer conducting a comprehensive multi-round interview for "${role}" at "${company || 'Tech Company'}".
Difficulty Level: ${difficulty}

The candidate just provided their self-introduction:
"""
${candidateIntro}
"""

Based directly on the background, projects, programming languages, libraries, and tools the candidate mentioned:
Generate exactly ${count} tailored, progressive interview questions:
- Question 1-2: Probe the architecture and technical decisions of the projects they explicitly mentioned in their intro.
- Question 3-6: High-signal technical and coding scenario questions on the tech stack and core CS topics they claimed familiarity with.
- Question 7-9: Behavioral STAR situations (e.g., handling production incidents, challenging code reviews, collaboration under tight deadlines).

Ensure every question feels personalized, directly connected to their intro, and realistic for a ${role}.`

    const raw = await callGemini(prompt, mockQuestionsBatchSchema, "gemini-flash-lite-latest")
    const parsed = JSON.parse(raw)
    return parsed.questions || []
}

const mockEvaluationSchema = z.object({
    score: z.number().min(0).max(100),
    technicalAccuracy: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    problemSolving: z.number().min(0).max(100),
    keyStrengths: z.array(z.string()),
    improvements: z.array(z.string()),
    modelAnswer: z.string().describe("Ideal concise answer demonstrating mastery")
})

async function evaluateMockAnswer({ question, userAnswer, role, difficulty }) {
    const prompt = `You are an expert interviewer evaluating a candidate's answer.
Role: ${role} | Difficulty: ${difficulty}
Question: ${question}
Candidate's Answer: "${userAnswer}"

Score the answer (0-100) for overall score, technicalAccuracy, communication, and problemSolving.
Provide 2 short keyStrengths, 2 short improvements, and a concise 2-sentence modelAnswer.`

    const raw = await callGemini(prompt, mockEvaluationSchema, "gemini-flash-lite-latest")
    return JSON.parse(raw)
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CODING PRACTICE MODULE
// ─────────────────────────────────────────────────────────────────────────────

const codingChallengeSchema = z.object({
    title: z.string(),
    topic: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    description: z.string().describe("Clear problem description"),
    examples: z.array(z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string()
    })),
    hints: z.array(z.string()),
    approach: z.string().describe("Optimal algorithmic strategy and data structures to use"),
    solutionCode: z.string().describe("Clean, commented production code in JavaScript / Python"),
    timeComplexity: z.string().describe("e.g. O(n log n)"),
    spaceComplexity: z.string().describe("e.g. O(n)")
})

async function generateCodingChallenge({ topic = "Arrays", difficulty = "Medium" }) {
    const prompt = `Create a real-world coding interview problem on the topic of "${topic}" with difficulty level "${difficulty}".
Include problem statement, 2-3 input/output examples with explanations, progressive hints, optimal approach, clean JavaScript/Python reference solution, and complexity analysis.`

    const raw = await callGemini(prompt, codingChallengeSchema)
    return JSON.parse(raw)
}

const codingReviewSchema = z.object({
    correctnessScore: z.number().min(0).max(100),
    feedback: z.string().describe("Detailed code review on logic, edge cases, readability, and syntax"),
    optimizations: z.array(z.string()).describe("Specific performance or memory optimizations")
})

async function reviewCodingSolution({ problemTitle, problemDescription, userCode }) {
    const prompt = `Review this candidate's code for the problem "${problemTitle}".
Problem Statement:
${problemDescription}

Candidate's Solution Code:
\`\`\`
${userCode}
\`\`\`

Perform a code review. Assess algorithmic correctness, edge cases, time/space efficiency, and code cleanliness. Provide a 0-100 score, thorough feedback, and suggestions for improvement.`

    const raw = await callGemini(prompt, codingReviewSchema)
    return JSON.parse(raw)
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INTERACTIVE REPORT ASSISTANT (Follow-ups)
// ─────────────────────────────────────────────────────────────────────────────

async function askReportAssistant({ reportContext, questionContext, userPrompt }) {
    const prompt = `You are Interview Prep AI, a private technical interview coach.
The candidate is preparing for the role: ${reportContext.title || "Software Engineer"} at ${reportContext.company || "Target Company"}.
Match Score: ${reportContext.matchScore}%

Specific Question Context (if any):
${questionContext ? JSON.stringify(questionContext) : "General interview preparation"}

Candidate's Question or Request:
"${userPrompt}"

Provide a clear, encouraging, and deeply practical response. If asked for code, supply clean idiomatic code. If asked for a simpler explanation or real-world analogy, make it intuitive and memorable.`

    return await callGemini(prompt)
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ATS-FRIENDLY RESUME GENERATION & PUPPETEER PDF EXPORT
// ─────────────────────────────────────────────────────────────────────────────

async function generatePdfFromHtml(htmlContent) {
    const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium'
    ]
    let executablePath = null
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            executablePath = p
            break
        }
    }

    const launchOpts = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    }
    if (executablePath) {
        launchOpts.executablePath = executablePath
    }

    let browser = await puppeteer.launch(launchOpts)

    try {
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })
        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            },
            printBackground: true
        })
        return pdfBuffer
    } finally {
        if (browser) await browser.close()
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription, company = "", title = "" }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("Complete, self-contained HTML and CSS for a modern, clean, ATS-friendly resume")
    })

    const prompt = `You are a Professional Executive Resume Writer & ATS Optimization Specialist.
Generate a tailored, ATS-compliant, single or two-page resume for this candidate targeting the role "${title}" at "${company}".

Candidate Resume Details:
${resume || "None provided"}

Candidate Self-Description:
${selfDescription || "None provided"}

Target Job Description:
${jobDescription}

Formatting Requirements:
1. Return JSON with a single field "html" containing full HTML5 with embedded <style> tags.
2. Styling must be crisp, elegant, and professional (clean typography, subtle borders, professional dark blue or charcoal headings, standard bullet points).
3. Do not invent fake degrees or certifications. Rephrase existing experience and highlight relevant skills using industry-standard action verbs.
4. Ensure clean margins, A4 friendly layout, readable 10pt-11pt body font (Inter, Roboto, Arial, or sans-serif).`

    const raw = await callGemini(prompt, resumePdfSchema)
    const jsonContent = JSON.parse(raw)
    return await generatePdfFromHtml(jsonContent.html)
}

module.exports = {
    generateInterviewReport,
    generateMockQuestion,
    generateMockQuestionsBatch,
    generateTailoredQuestionsFromIntro,
    evaluateMockAnswer,
    generateCodingChallenge,
    reviewCodingSolution,
    askReportAssistant,
    generateResumePdf
}

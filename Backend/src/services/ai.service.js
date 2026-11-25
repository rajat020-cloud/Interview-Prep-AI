const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const fs = require('fs')

// Lazy load puppeteer to avoid crashing Vercel Serverless Functions
let puppeteer = null
try {
    puppeteer = require("puppeteer")
} catch (e) {
    // Expected in serverless environments
}

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

// Helper to categorize job roles into specialized interview domains
function getRoleDomain(role = "") {
    const r = role.toLowerCase();
    if (r.includes("sale") || r.includes("account executive") || r.includes("revenue") || r.includes("sdr") || r.includes("bdr")) {
        return "sales";
    }
    if (r.includes("analyst") || r.includes("analytics") || r.includes("bi ") || r.includes("business intelligence") || r.includes("data science") || r.includes("data scientist")) {
        return "analyst";
    }
    if (r.includes("business development") || r.includes("biz dev") || r.includes("partnership") || r.includes("growth")) {
        return "business_development";
    }
    if (r.includes("product manager") || r.includes("program manager") || r.includes("scrum") || r.includes("project manager")) {
        return "product_management";
    }
    if (r.includes("market") || r.includes("seo") || r.includes("content") || r.includes("copywriter")) {
        return "marketing";
    }
    if (r.includes("engineer") || r.includes("developer") || r.includes("coder") || r.includes("software") || r.includes("frontend") || r.includes("backend") || r.includes("fullstack") || r.includes("full-stack") || r.includes("devops") || r.includes("cloud") || r.includes("qa") || r.includes("sre") || r.includes("architect")) {
        return "engineering";
    }
    return "general";
}

const mockQuestionSchema = z.object({
    questionText: z.string(),
    type: z.enum(["technical", "behavioral"]),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    context: z.string().describe("Brief background or scenario for the question")
})

async function generateMockQuestion({ role, company, difficulty, type, previousQuestions = [] }) {
    const domain = getRoleDomain(role);
    const domainGuidance = {
        sales: "Focus on prospecting, client objection handling, value proposition, pipeline closing, or sales metrics.",
        analyst: "Focus on data querying (SQL), interpreting statistical anomalies, data validation, metrics dashboards, or business storytelling.",
        business_development: "Focus on strategic partnership outreach, deal structuring, market expansion, revenue sharing, or negotiation.",
        product_management: "Focus on product discovery, user empathy, roadmap prioritization (RICE), metric definition, or sprint trade-offs.",
        marketing: "Focus on CAC/ROAS, funnel optimization, conversion attribution, SEO/SEM strategies, or brand positioning.",
        engineering: "Focus on software architecture, clean code, algorithmic efficiency, system scaling, API contracts, or database design.",
        general: "Focus on core functional competency, domain problem solving, and professional execution."
    }[domain];

    const prompt = `Generate a realistic, high-signal ${difficulty} ${type} interview question for a candidate applying for the position of "${role}" at "${company}".
Role Domain: ${domain.toUpperCase()}.
Domain Guidance: ${domainGuidance}
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
    const domain = getRoleDomain(role);
    const prompt = `Generate a progressive set of ${count} realistic interview questions tailored specifically for "${role}" in the ${domain.toUpperCase()} domain at "${company || 'Tech Company'}".
Difficulty: ${difficulty}.
Ensure the questions reflect genuine ${role} responsibilities (e.g., domain technical/functional challenges and situational behavioral cases).
Ensure questions are clear, practical, and interview-ready.`

    const raw = await callGemini(prompt, mockQuestionsBatchSchema, "gemini-flash-lite-latest")
    const parsed = JSON.parse(raw)
    return parsed.questions || []
}

async function generateTailoredQuestionsFromIntro({ candidateIntro, role, company, difficulty, count = 9 }) {
    const domain = getRoleDomain(role);

    let domainSpecificInstructions = "";
    if (domain === "sales") {
        domainSpecificInstructions = `
- Questions 1-2: Dig into the specific sales achievements, quota targets, sales cycles, and deal sizes mentioned in their introduction.
- Questions 3-6: High-stakes sales scenarios: qualifying complex enterprise prospects (MEDDIC/BANT), navigating price resistance, handling aggressive competitors, and pipeline velocity.
- Questions 7-9: Behavioral STAR situations (e.g. dealing with a lost major deal, turning around an unpromising quarter, collaborating with marketing or engineering to close a customer).`;
    } else if (domain === "analyst") {
        domainSpecificInstructions = `
- Questions 1-2: Probe the data tools, SQL queries, statistical models, and BI reporting dashboards mentioned in their introduction.
- Questions 3-6: Real-world analytical scenarios: resolving conflicting KPI definitions, diagnosing a 20% sudden drop in conversion, database schema aggregation, and explaining complex metrics to non-analytical executives.
- Questions 7-9: Behavioral STAR situations (e.g. tight deadlines for executive board presentations, managing messy incomplete data, persuading leadership to act on analytical findings).`;
    } else if (domain === "business_development") {
        domainSpecificInstructions = `
- Questions 1-2: Probe the strategic partnerships, market expansion wins, and commercial relationships mentioned in their introduction.
- Questions 3-6: Deal structuring scenarios: drafting win-win revenue splits, evaluating new channel partner opportunities, pitching new business, and handling contractual impasses.
- Questions 7-9: Behavioral STAR situations (e.g. salvaging an unaligned partnership, cross-functional persuasion with legal/product teams, prioritizing growth opportunities).`;
    } else if (domain === "product_management") {
        domainSpecificInstructions = `
- Questions 1-2: Probe the product lifecycle, user research, and key feature launches highlighted in their introduction.
- Questions 3-6: Product trade-offs: prioritizing conflicting customer requests, defining North Star metrics, managing technical debt vs new features, and A/B test failure retrospectives.
- Questions 7-9: Behavioral STAR situations (e.g. saying no to executive requests, resolving engineering disagreements on scope, launching under incomplete data).`;
    } else if (domain === "marketing") {
        domainSpecificInstructions = `
- Questions 1-2: Probe the campaigns, channels, ROAS/CAC numbers, and growth metrics cited in their introduction.
- Questions 3-6: Marketing execution scenarios: optimizing underperforming paid funnels, scaling organic reach, brand positioning against an incumbent, and multi-touch attribution.
- Questions 7-9: Behavioral STAR situations (e.g. handling a PR crisis, rapid marketing budget cuts, collaborating with sales on lead quality).`;
    } else if (domain === "engineering") {
        domainSpecificInstructions = `
- Questions 1-2: Probe the system architecture, component design, and framework decisions of the projects mentioned in their introduction.
- Questions 3-6: Technical scenarios: concurrency, database indexing, caching strategies, API resiliency, error boundaries, and security best practices.
- Questions 7-9: Behavioral STAR situations (e.g. mitigating production outages, resolving heated code reviews, refactoring legacy systems under tight deadlines).`;
    } else {
        domainSpecificInstructions = `
- Questions 1-2: Explore the professional background, core responsibilities, and projects detailed in their introduction.
- Questions 3-6: In-depth functional scenarios and industry-standard challenges appropriate for a ${role}.
- Questions 7-9: Behavioral STAR situations (e.g. conflict resolution, working under ambiguity, exceeding performance expectations).`;
    }

    const prompt = `You are an expert interviewer conducting a comprehensive multi-round interview for "${role}" at "${company || 'our company'}".
Domain: ${domain.toUpperCase()} | Difficulty Level: ${difficulty}

The candidate just provided their self-introduction:
"""
${candidateIntro}
"""

Based DIRECTLY on the background, tools, achievements, and responsibilities the candidate explicitly shared in their introduction:
Generate exactly ${count} tailored, progressive interview questions:
${domainSpecificInstructions}

Ensure every single question is directly relevant to "${role}", sounds natural and professional, and builds directly on their spoken background.`;

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
    if (!puppeteer) {
        try {
            puppeteer = require("puppeteer")
        } catch (e) {
            throw new Error("Serverless PDF compilation is restricted in this cloud environment. Please export directly using the browser print / PDF button.")
        }
    }

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

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import {
    ArrowLeft,
    Share2,
    Download,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Copy,
    Bookmark,
    Sparkles,
    AlertTriangle,
    Target,
    BookOpen,
    HelpCircle,
    Check,
    Search,
    MessageSquare,
    Send,
    Loader2,
    Printer,
    ExternalLink,
    FileText
} from 'lucide-react'
import '../style/interview.scss'

const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: 'Questions' },
    { id: 'skill-gap', label: 'Skill Gap' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'resume', label: 'Resume' },
]

const Interview = () => {
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const {
        report,
        getReportById,
        loading,
        getResumePdf,
        toggleTask,
        askAssistant,
        saveQuestion
    } = useInterview()

    const [activeTab, setActiveTab] = useState('overview')
    const [questionFilter, setQuestionFilter] = useState('all') // 'all', 'technical', 'behavioral'
    const [searchQuery, setSearchQuery] = useState('')
    const [openQuestions, setOpenQuestions] = useState({})
    const [copiedIndex, setCopiedIndex] = useState(null)
    const [savedQuestions, setSavedQuestions] = useState({})

    // AI Coach Assistant Modal State
    const [coachOpen, setCoachOpen] = useState(false)
    const [coachQuestionContext, setCoachQuestionContext] = useState(null)
    const [coachPrompt, setCoachPrompt] = useState('')
    const [coachResponse, setCoachResponse] = useState('')
    const [coachLoading, setCoachLoading] = useState(false)

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading && !report) {
        return (
            <div className="report-loading-screen">
                <Loader2 size={36} className="animate-spin glow-icon" />
                <p>Loading your interview strategy...</p>
            </div>
        )
    }

    if (!report) {
        return (
            <div className="report-not-found">
                <h2>Interview Report Not Found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    Return to Dashboard
                </button>
            </div>
        )
    }

    // Toggle question accordion
    const toggleQ = (key) => {
        setOpenQuestions(prev => ({ ...prev, [key]: !prev[key] }))
    }

    // Copy model answer
    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    // Bookmark question
    const handleBookmark = async (q, type) => {
        try {
            await saveQuestion({
                question: q.question,
                type,
                difficulty: q.difficulty || "Medium",
                intention: q.intention,
                answer: q.answer,
                company: report.company || "Target Company",
                sourceReportId: report._id
            })
            setSavedQuestions(prev => ({ ...prev, [q.question]: true }))
        } catch (err) {
            console.error("Failed to bookmark question:", err)
        }
    }

    // Open AI Coach for specific question
    const openCoachForQuestion = (q) => {
        setCoachQuestionContext(q)
        setCoachPrompt('')
        setCoachResponse('')
        setCoachOpen(true)
    }

    const submitCoachQuestion = async (promptOverride) => {
        const query = promptOverride || coachPrompt
        if (!query.trim()) return
        setCoachLoading(true)
        try {
            const answer = await askAssistant(report._id, coachQuestionContext, query)
            setCoachResponse(answer)
        } catch (err) {
            setCoachResponse("Sorry, couldn't reach the AI assistant. " + err.message)
        } finally {
            setCoachLoading(false)
        }
    }

    // Filter questions
    const allQuestions = [
        ...(report.technicalQuestions || []).map(q => ({ ...q, type: 'technical' })),
        ...(report.behavioralQuestions || []).map(q => ({ ...q, type: 'behavioral' }))
    ]

    const filteredQuestions = allQuestions.filter(q => {
        const matchesType = questionFilter === 'all' || q.type === questionFilter
        const matchesSearch = !searchQuery.trim() ||
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (q.answer && q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesType && matchesSearch
    })

    const score = report.matchScore || 75
    const scoreColor = score >= 80 ? 'score--high' : score >= 60 ? 'score--mid' : 'score--low'

    const breakdown = report.matchBreakdown || {
        technicalSkills: 85,
        experience: 80,
        education: 85,
        projectRelevance: 80,
        keywordAlignment: 85
    }

    const companyInitial = report.company ? report.company.charAt(0).toUpperCase() : 'G'

    return (
        <div className="interview-report-view">
            {/* ── Top Header Navigation Bar ── */}
            <header className="report-header-bar">
                <div className="left-meta">
                    <button onClick={() => navigate('/')} className="back-circle-btn" title="Back to Dashboard">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="company-logo-avatar">
                        {companyInitial}
                    </div>
                    <div className="title-block">
                        <h2>{report.title} <span className="at-company">at {report.company || 'Target Company'}</span></h2>
                        <span className="gen-date">
                            Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                <div className="right-actions">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            alert("Report link copied to clipboard!")
                        }}
                        className="btn btn-secondary action-btn"
                    >
                        <Share2 size={15} />
                        Share
                    </button>
                    <button
                        onClick={() => getResumePdf(report._id)}
                        className="btn btn-primary action-btn download-btn"
                    >
                        <Download size={15} />
                        Download PDF
                    </button>
                </div>
            </header>

            {/* ── Tabs Navigation ── */}
            <div className="report-tabs-bar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ═════════════════════════════════════════════════════════════════════
                TAB 1: OVERVIEW
               ═════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
                <div className="tab-pane overview-pane">
                    <div className="overview-top-grid">
                        {/* Match Score Ring Card */}
                        <div className="card-box match-ring-card">
                            <span className="card-lbl">Match Score</span>
                            <div className={`score-ring-circle ${scoreColor}`}>
                                <span className="score-num">{score}</span>
                                <span className="score-pct">%</span>
                            </div>
                            <span className="score-status-text">
                                {score >= 80 ? 'Strong match for this role' : score >= 60 ? 'Moderate match with minor gaps' : 'Developing candidate profile'}
                            </span>
                        </div>

                        {/* Match Breakdown Progress Bars */}
                        <div className="card-box match-analysis-card">
                            <span className="card-lbl">Match Analysis</span>
                            <div className="breakdown-bars">
                                <div className="bar-row">
                                    <span className="bar-label">Technical Skills</span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${breakdown.technicalSkills}%` }} />
                                    </div>
                                    <span className="bar-val">{breakdown.technicalSkills}%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">Experience</span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${breakdown.experience}%` }} />
                                    </div>
                                    <span className="bar-val">{breakdown.experience}%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">Education</span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${breakdown.education}%` }} />
                                    </div>
                                    <span className="bar-val">{breakdown.education}%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">Project Relevance</span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${breakdown.projectRelevance}%` }} />
                                    </div>
                                    <span className="bar-val">{breakdown.projectRelevance}%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">Keyword Alignment</span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${breakdown.keywordAlignment}%` }} />
                                    </div>
                                    <span className="bar-val">{breakdown.keywordAlignment}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Insights List */}
                        <div className="card-box key-insights-card">
                            <span className="card-lbl">Key Insights</span>
                            <ul className="insights-list">
                                {(report.keyInsights && report.keyInsights.length > 0
                                    ? report.keyInsights
                                    : [
                                        "Strong match for core stack requirements",
                                        "Relevant past project experience demonstrated",
                                        `Identified ${report.skillGaps?.length || 2} target skill gaps to review`,
                                        "Good cultural and situational fit"
                                    ]
                                ).map((insight, idx) => (
                                    <li key={idx}>
                                        <CheckCircle2 size={16} className="insight-check" />
                                        <span>{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Overall Assessment Banner */}
                    <div className="overall-assessment-card">
                        <div className="assessment-icon">
                            <Sparkles size={20} />
                        </div>
                        <div className="assessment-text">
                            <h4>Overall Assessment</h4>
                            <p>
                                {report.overallAssessment ||
                                    `You are well-qualified for this role with an overall ${score}% match. Focus on the identified skill gaps and practice the recommended interview questions to strengthen your performance.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════
                TAB 2: QUESTIONS
               ═════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'questions' && (
                <div className="tab-pane questions-pane">
                    {/* Controls Bar */}
                    <div className="questions-controls">
                        <div className="type-filter-buttons">
                            <button
                                className={`pill-btn ${questionFilter === 'all' ? 'pill-btn--active' : ''}`}
                                onClick={() => setQuestionFilter('all')}
                            >
                                All ({allQuestions.length})
                            </button>
                            <button
                                className={`pill-btn ${questionFilter === 'technical' ? 'pill-btn--active' : ''}`}
                                onClick={() => setQuestionFilter('technical')}
                            >
                                Technical ({report.technicalQuestions?.length || 0})
                            </button>
                            <button
                                className={`pill-btn ${questionFilter === 'behavioral' ? 'pill-btn--active' : ''}`}
                                onClick={() => setQuestionFilter('behavioral')}
                            >
                                Behavioral ({report.behavioralQuestions?.length || 0})
                            </button>
                        </div>

                        <div className="search-box">
                            <Search size={15} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Question Cards List */}
                    <div className="questions-list">
                        {filteredQuestions.map((q, idx) => {
                            const isOpen = openQuestions[idx]
                            const isBookmarked = savedQuestions[q.question]
                            const isTech = q.type === 'technical'

                            return (
                                <div key={idx} className={`q-card ${isOpen ? 'q-card--open' : ''}`}>
                                    <div className="q-card__header" onClick={() => toggleQ(idx)}>
                                        <div className="q-card__title-meta">
                                            <span className="q-index">Q{idx + 1}</span>
                                            <span className={`badge ${isTech ? 'badge-tech' : 'badge-behavioral'}`}>
                                                {isTech ? 'Technical' : 'Behavioral'}
                                            </span>
                                            {q.difficulty && (
                                                <span className="badge badge-difficulty">{q.difficulty}</span>
                                            )}
                                            <h4 className="q-text">{q.question}</h4>
                                        </div>
                                        <button className="chevron-btn">
                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>

                                    {isOpen && (
                                        <div className="q-card__body">
                                            {/* Intention */}
                                            <div className="q-section">
                                                <span className="section-tag intention-tag">Interviewer's Intention</span>
                                                <p className="section-body">{q.intention}</p>
                                            </div>

                                            {/* Model Answer */}
                                            <div className="q-section">
                                                <div className="section-header-row">
                                                    <span className="section-tag answer-tag">Model Answer</span>
                                                    <div className="q-actions">
                                                        <button
                                                            className="q-action-btn"
                                                            onClick={() => handleCopy(q.answer, idx)}
                                                            title="Copy Answer"
                                                        >
                                                            {copiedIndex === idx ? <Check size={14} className="copied" /> : <Copy size={14} />}
                                                            {copiedIndex === idx ? "Copied!" : "Copy"}
                                                        </button>
                                                        <button
                                                            className={`q-action-btn ${isBookmarked ? 'q-action-btn--saved' : ''}`}
                                                            onClick={() => handleBookmark(q, q.type)}
                                                            title="Save to revision list"
                                                        >
                                                            <Bookmark size={14} />
                                                            {isBookmarked ? "Saved" : "Save"}
                                                        </button>
                                                        <button
                                                            className="q-action-btn q-action-btn--ai"
                                                            onClick={() => openCoachForQuestion(q)}
                                                        >
                                                            <Sparkles size={14} />
                                                            Ask AI Coach
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="section-body answer-body">{q.answer}</p>
                                            </div>

                                            {/* Key Concepts / Criteria */}
                                            {q.keyConcepts && q.keyConcepts.length > 0 && (
                                                <div className="concepts-row">
                                                    <span className="concepts-label">Key Concepts:</span>
                                                    <div className="concepts-tags">
                                                        {q.keyConcepts.map((c, i) => (
                                                            <span key={i} className="concept-pill">{c}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════
                TAB 3: SKILL GAP ANALYSIS
               ═════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'skill-gap' && (
                <div className="tab-pane skillgap-pane">
                    <div className="pane-intro">
                        <h3>Identified Skill Gaps & Growth Areas</h3>
                        <p>Targeted requirements from the Job Description that need further strengthening before the interview.</p>
                    </div>

                    <div className="skillgaps-grid">
                        {(report.skillGaps || []).map((gap, i) => {
                            const isHigh = gap.severity === 'high'
                            const isMid = gap.severity === 'medium'
                            const sevClass = isHigh ? 'severity--high' : isMid ? 'severity--mid' : 'severity--low'

                            return (
                                <div key={i} className={`gap-card ${sevClass}`}>
                                    <div className="gap-card__header">
                                        <h4>{gap.skill}</h4>
                                        <span className={`severity-badge ${sevClass}`}>
                                            {gap.severity.toUpperCase()} PRIORITY
                                        </span>
                                    </div>
                                    {gap.whyItMatters && (
                                        <div className="gap-section">
                                            <span className="gap-sec-lbl">Why It Matters</span>
                                            <p>{gap.whyItMatters}</p>
                                        </div>
                                    )}
                                    {gap.recommendedAction && (
                                        <div className="gap-section gap-section--action">
                                            <span className="gap-sec-lbl">Recommended Action</span>
                                            <p>{gap.recommendedAction}</p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════
                TAB 4: PREPARATION ROADMAP
               ═════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'roadmap' && (
                <div className="tab-pane roadmap-pane">
                    <div className="pane-intro">
                        <h3>Personalized 7-Day Interview Roadmap</h3>
                        <p>Follow this daily schedule to master all technical and behavioral requirements. Check tasks to track progress.</p>
                    </div>

                    <div className="roadmap-timeline">
                        {(report.preparationPlan || []).map((dayPlan, dayIdx) => (
                            <div key={dayPlan.day} className="roadmap-day-card">
                                <div className="day-header">
                                    <span className="day-badge">Day {dayPlan.day}</span>
                                    <h4 className="day-focus">{dayPlan.focus}</h4>
                                </div>

                                <div className="day-tasks-list">
                                    {(dayPlan.tasks || []).map((taskItem, taskIdx) => {
                                        const isObj = typeof taskItem === 'object' && taskItem !== null
                                        const taskText = isObj ? taskItem.text : taskItem
                                        const isDone = isObj ? taskItem.completed : false

                                        return (
                                            <div
                                                key={taskIdx}
                                                className={`task-row ${isDone ? 'task-row--done' : ''}`}
                                                onClick={() => toggleTask(report._id, dayIdx, taskIdx)}
                                            >
                                                <div className="checkbox-box">
                                                    {isDone && <Check size={14} className="check-mark" />}
                                                </div>
                                                <span className="task-text">{taskText}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════
                TAB 5: RESUME OPTIMIZER & TAILORED ATS RESUME
               ═════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'resume' && (
                <div className="tab-pane resume-pane">
                    <div className="resume-cta-banner">
                        <div className="banner-text">
                            <h3>ATS-Optimized Tailored Resume</h3>
                            <p>Engineered with genuine credentials and customized directly for <strong>{report.title}</strong> at <strong>{report.company || 'Target Company'}</strong>.</p>
                        </div>
                        <div className="banner-actions">
                            <button
                                onClick={() => getResumePdf(report._id)}
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                <Download size={16} />
                                Download ATS Resume (PDF)
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="btn btn-secondary"
                            >
                                <Printer size={16} />
                                Print / Save PDF
                            </button>
                            <button
                                onClick={() => navigate('/resume-builder')}
                                className="btn btn-ghost"
                            >
                                <ExternalLink size={16} />
                                Open in Resume Builder
                            </button>
                        </div>
                    </div>

                    {/* The Full ATS Tailored Resume Sheet */}
                    <div className="tailored-resume-sheet" id="report-resume-printable">
                        {/* Header */}
                        <div className="sheet-header">
                            <h1 className="name">Rajat Katnoria</h1>
                            <p className="title">Full-Stack Developer &bull; Tailored for {report.title} ({report.company || 'Target Company'})</p>
                            <div className="contact-row">
                                <span>rajat70184@gmail.com</span> &bull;
                                <span>+91-7018490629</span> &bull;
                                <span>Punjab, India</span> &bull;
                                <span>linkedin.com/in/rajatkatnoria</span> &bull;
                                <span>github.com/rajat020-cloud</span>
                            </div>
                        </div>

                        {/* Professional Summary */}
                        <div className="sheet-section">
                            <h2 className="sec-heading">Professional Summary</h2>
                            <p className="summary-text">
                                Results-driven Full-Stack Developer with hands-on experience designing and scaling production-grade web applications, RESTful APIs, and CRM automation pipelines. Skilled in React.js, Next.js, Node.js, Express, and MongoDB, with a solid computer science foundation in Data Structures, Algorithms, DBMS, and Computer Networks. Tailored for <strong>{report.title}</strong> at <strong>{report.company || 'Target Company'}</strong> with an evaluated <strong>{score}% technical qualification match</strong>.
                            </p>
                        </div>

                        {/* Technical Competencies */}
                        <div className="sheet-section">
                            <h2 className="sec-heading">Technical Skills &amp; Proficiencies</h2>
                            <div className="skills-table">
                                <div className="skill-item">
                                    <span className="skill-cat">Languages:</span>
                                    <span>C, C++, Java, JavaScript (ES6+), SQL, Python</span>
                                </div>
                                <div className="skill-item">
                                    <span className="skill-cat">Web &amp; Frameworks:</span>
                                    <span>React.js, Next.js, Node.js, Express.js, SCSS, Tailwind CSS</span>
                                </div>
                                <div className="skill-item">
                                    <span className="skill-cat">Databases &amp; Cloud:</span>
                                    <span>MongoDB, MySQL, Firebase, RESTful APIs, Git, GitHub</span>
                                </div>
                                <div className="skill-item">
                                    <span className="skill-cat">Core CS Fundamentals:</span>
                                    <span>Data Structures &amp; Algorithms (DSA), OOP, DBMS, Computer Networks</span>
                                </div>
                            </div>
                        </div>

                        {/* Job Description Alignment & Match Strengths */}
                        {report.keyInsights && report.keyInsights.length > 0 && (
                            <div className="sheet-section">
                                <h2 className="sec-heading">Role Alignment &amp; Verified Strengths</h2>
                                <ul className="sheet-bullets">
                                    {report.keyInsights.map((insight, idx) => (
                                        <li key={idx}>{insight}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Professional Experience */}
                        <div className="sheet-section">
                            <h2 className="sec-heading">Professional Experience</h2>
                            <div className="experience-block">
                                <div className="exp-top-row">
                                    <div>
                                        <strong className="role">Full-Stack Developer</strong> &bull; <span className="company">AVBT Technologies</span>
                                    </div>
                                    <span className="date">Oct 2024 – Present | Mohali, India</span>
                                </div>
                                <ul className="sheet-bullets">
                                    <li>Architected and deployed responsive full-stack applications using Next.js, React, Node.js, and MongoDB, cutting average API latency by 35%.</li>
                                    <li>Designed custom WhatsApp CRM automation systems with webhook listeners, scaling client conversation capacity to 10,000+ daily engagements.</li>
                                    <li>Implemented secure JWT authentication, role-based authorization gates, and Mongoose database indexing for optimal query throughput.</li>
                                    <li>Collaborated with design and QA engineering teams to ship production releases on strict agile milestones.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Technical Projects */}
                        <div className="sheet-section">
                            <h2 className="sec-heading">Technical Projects</h2>
                            <div className="project-block">
                                <div className="exp-top-row">
                                    <strong className="role">Interview Prep AI (AI Interview &amp; Prep Platform)</strong>
                                    <span className="tech-stack">React 19, Node.js, Express, MongoDB, Gemini AI</span>
                                </div>
                                <ul className="sheet-bullets">
                                    <li>Built an AI interview prep engine featuring multi-model Gemini fallbacks, 52-question DSA execution runner, and live camera speech simulation.</li>
                                    <li>Engineered client-side audio playback with speech synthesis and voice transcription for realistic mock interview practice.</li>
                                </ul>
                            </div>
                            <div className="project-block">
                                <div className="exp-top-row">
                                    <strong className="role">WhatsApp CRM &amp; Lead Automation Platform</strong>
                                    <span className="tech-stack">Node.js, Express, MongoDB, WhatsApp Cloud API</span>
                                </div>
                                <ul className="sheet-bullets">
                                    <li>Engineered webhook-based communication flows, reducing customer query response turnaround by 50%.</li>
                                </ul>
                            </div>
                            <div className="project-block">
                                <div className="exp-top-row">
                                    <strong className="role">University Management System</strong>
                                    <span className="tech-stack">React.js, Node.js, Express.js, MySQL</span>
                                </div>
                                <ul className="sheet-bullets">
                                    <li>Normalized relational database schemas to manage student enrollments, attendance, and fee tracking.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="sheet-section">
                            <h2 className="sec-heading">Education</h2>
                            <div className="exp-top-row">
                                <div>
                                    <strong>Bachelor of Engineering in Computer Science &amp; Engineering</strong> &bull; <span>Chitkara University, Punjab</span>
                                </div>
                                <span className="date">2023 – 2027 | CGPA: 8.7 / 10</span>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="sheet-section">
                            <h2 className="sec-heading">Certifications &amp; Training</h2>
                            <ul className="sheet-bullets">
                                <li>Cisco Networking Academy: Modern AI &amp; Applied AI Concepts</li>
                                <li>Nutanix Hybrid Cloud Fundamentals</li>
                                <li>Infosys Springboard: Core Java &amp; Web Technologies</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ── AI COACH MODAL ── */}
            {coachOpen && (
                <div className="modal-backdrop" onClick={() => setCoachOpen(false)}>
                    <div className="ai-coach-modal" onClick={e => e.stopPropagation()}>
                        <div className="coach-header">
                            <div className="coach-title">
                                <Sparkles size={18} className="sparkle" />
                                <h3>AI Interview Coach</h3>
                            </div>
                            <button className="close-btn" onClick={() => setCoachOpen(false)}>&times;</button>
                        </div>

                        {coachQuestionContext && (
                            <div className="coach-question-snippet">
                                <span className="lbl">Question:</span>
                                <p>{coachQuestionContext.question}</p>
                            </div>
                        )}

                        <div className="quick-prompts">
                            <button onClick={() => submitCoachQuestion("Explain this interview question in simpler terms with a real-world analogy.")}>
                                💡 Simpler Explanation
                            </button>
                            <button onClick={() => submitCoachQuestion("Provide a concrete code example demonstrating this concept.")}>
                                💻 Code Example
                            </button>
                            <button onClick={() => submitCoachQuestion("What follow-up question is the interviewer most likely to ask next?")}>
                                ❓ Likely Follow-up
                            </button>
                        </div>

                        <div className="coach-input-row">
                            <input
                                type="text"
                                className="input"
                                placeholder="Ask anything about this question..."
                                value={coachPrompt}
                                onChange={e => setCoachPrompt(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && submitCoachQuestion()}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => submitCoachQuestion()}
                                disabled={coachLoading || !coachPrompt.trim()}
                            >
                                {coachLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>

                        {coachResponse && (
                            <div className="coach-response-box">
                                <span className="response-lbl">Coach Response:</span>
                                <div className="response-text">{coachResponse}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Interview

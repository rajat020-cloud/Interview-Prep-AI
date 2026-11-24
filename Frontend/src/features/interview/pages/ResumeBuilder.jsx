import React, { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import {
    FileText,
    CheckCircle2,
    Download,
    Sparkles,
    ShieldCheck,
    Layers,
    Edit3,
    Eye,
    Printer,
    Copy,
    Check,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    RefreshCw,
    AlertCircle
} from 'lucide-react'
import '../style/resumebuilder.scss'

const TEMPLATES = [
    { id: 'harvard', name: 'Harvard Clean (ATS 100%)', desc: 'Standard single-column serif format preferred by top recruiters and ATS scanners.' },
    { id: 'modern', name: 'Modern Tech Two-Column', desc: 'Sleek two-column layout highlighting technical proficiencies and project achievements.' },
    { id: 'executive', name: 'Executive Minimalist', desc: 'Crisp horizontal dividers, elegant typography, and focused leadership bullet points.' },
    { id: 'compact', name: 'Developer Compact', desc: 'High-density tech resume designed to fit comprehensive engineering achievements into one page.' }
]

// Default genuine profile data for Rajat Katnoria
const DEFAULT_RESUME_DATA = {
    fullName: "Rajat Katnoria",
    title: "Full-Stack Developer",
    email: "rajat70184@gmail.com",
    phone: "+91-7018490629",
    location: "Punjab, India",
    linkedin: "linkedin.com/in/rajatkatnoria",
    github: "github.com/rajat020-cloud",
    summary: "Driven Full-Stack Developer with hands-on experience building production-grade web applications, RESTful APIs, and scalable automation systems. Proficient in React.js, Next.js, Node.js, Express, and MongoDB, with a strong foundation in Data Structures, Algorithms, and clean architecture.",
    skills: {
        languages: "C, C++, Java, JavaScript (ES6+), SQL, Python",
        frameworks: "React.js, Next.js, Node.js, Express.js, SCSS, Tailwind CSS",
        databases: "MongoDB, MySQL, Firebase",
        tools: "Git, GitHub, Postman, REST APIs, WhatsApp CRM Pipelines",
        coreCS: "Data Structures & Algorithms (DSA), OOP, DBMS, Computer Networks"
    },
    experiences: [
        {
            role: "Full-Stack Developer",
            company: "AVBT Technologies",
            period: "Oct 2024 – Present",
            location: "Mohali, India",
            points: [
                "Engineered responsive full-stack applications using Next.js, React, Node.js, and MongoDB, improving client page load speed by 35%.",
                "Built and integrated custom WhatsApp CRM pipelines with automated webhook listeners and customer engagement workflows.",
                "Designed and documented secure RESTful endpoints featuring JWT role-based access control and input validation.",
                "Collaborated with cross-functional teams to deliver production releases on tight deployment schedules."
            ]
        }
    ],
    projects: [
        {
            title: "Interview Prep AI (AI Interview & Prep Platform)",
            tech: "React 19, Node.js, Express, MongoDB, Gemini AI",
            points: [
                "Architected an AI-powered interview preparation suite with Gemini API fallback, multi-language DSA runner, and live camera feed.",
                "Implemented browser-native speech synthesis and speech-to-text dictation for realistic mock interview practice.",
                "Optimized database schemas with Mongoose indexes, reducing query response times across user interview sessions."
            ]
        },
        {
            title: "WhatsApp CRM & Lead Automation Platform",
            tech: "Node.js, Express.js, MongoDB, WhatsApp Cloud API",
            points: [
                "Developed an enterprise CRM dashboard managing 10,000+ customer conversations with automated conversational triggers.",
                "Reduced customer support response latency by 50% via automated query classification and real-time alerts."
            ]
        },
        {
            title: "University Management System",
            tech: "React.js, Node.js, Express.js, MySQL",
            points: [
                "Designed an academic record management platform managing course enrollments, grade calculations, and student attendance.",
                "Implemented relational database normalization to maintain data integrity across thousands of student records."
            ]
        }
    ],
    education: [
        {
            degree: "Bachelor of Engineering in Computer Science & Engineering",
            institution: "Chitkara University, Punjab",
            period: "2023 – 2027",
            score: "CGPA: 8.7 / 10"
        }
    ],
    certifications: [
        "Cisco Networking Academy: Modern AI & Applied AI Concepts",
        "Nutanix Hybrid Cloud Fundamentals",
        "Infosys Springboard: Core Java & Web Technologies"
    ]
}

const ResumeBuilder = () => {
    const { user } = useAuth()
    const { reports } = useInterview()

    const [selectedTemplate, setSelectedTemplate] = useState('harvard')
    const [isEditing, setIsEditing] = useState(false)
    const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA)
    const [copied, setCopied] = useState(false)

    // Calculate real ATS score based on resume content
    const calculateAtsScore = () => {
        let score = 50
        const checks = []

        // Contact info completeness
        const hasEmail = Boolean(resumeData.email && resumeData.email.includes('@'))
        const hasPhone = Boolean(resumeData.phone && resumeData.phone.length > 8)
        const hasLinkedIn = Boolean(resumeData.linkedin)
        const hasGitHub = Boolean(resumeData.github)

        if (hasEmail && hasPhone && hasLinkedIn) {
            score += 15
            checks.push({ text: "Complete contact info (Email, Phone, LinkedIn)", pass: true })
        } else {
            checks.push({ text: "Add complete contact info including LinkedIn and Phone", pass: false })
        }

        // Action verbs check
        const allText = JSON.stringify(resumeData).toLowerCase()
        const actionVerbs = ['engineered', 'developed', 'architected', 'built', 'optimized', 'designed', 'implemented', 'reduced', 'improved', 'scaled']
        const matchedVerbs = actionVerbs.filter(v => allText.includes(v))

        if (matchedVerbs.length >= 4) {
            score += 15
            checks.push({ text: `Strong action verbs detected (${matchedVerbs.length} verbs)`, pass: true })
        } else {
            checks.push({ text: "Include more strong action verbs (Engineered, Designed, Scaled)", pass: false })
        }

        // Metrics and numbers check
        const hasNumbers = /\d+%|\d+k|\d+\+/.test(allText)
        if (hasNumbers) {
            score += 10
            checks.push({ text: "Measurable impact & percentage metrics included", pass: true })
        } else {
            checks.push({ text: "Add quantified results (e.g., 35% speed improvement)", pass: false })
        }

        // Core Skills check
        const hasSkills = resumeData.skills.languages && resumeData.skills.frameworks
        if (hasSkills) {
            score += 10
            checks.push({ text: "Comprehensive technical skills breakdown", pass: true })
        }

        return { score: Math.min(score, 98), checks }
    }

    const { score: atsScore, checks: atsChecks } = calculateAtsScore()

    // Print / Save as PDF
    const handlePrint = () => {
        window.print()
    }

    // Copy formatted plain text for job applications
    const handleCopyPlainText = () => {
        const text = `
${resumeData.fullName}
${resumeData.title}
${resumeData.email} | ${resumeData.phone} | ${resumeData.location}
LinkedIn: ${resumeData.linkedin} | GitHub: ${resumeData.github}

SUMMARY
${resumeData.summary}

TECHNICAL SKILLS
Languages: ${resumeData.skills.languages}
Frameworks: ${resumeData.skills.frameworks}
Databases: ${resumeData.skills.databases}
Tools: ${resumeData.skills.tools}

EXPERIENCE
${resumeData.experiences.map(e => `${e.role} - ${e.company} (${e.period})\n${e.points.map(p => `• ${p}`).join('\n')}`).join('\n\n')}

PROJECTS
${resumeData.projects.map(p => `${p.title} (${p.tech})\n${p.points.map(pt => `• ${pt}`).join('\n')}`).join('\n\n')}

EDUCATION
${resumeData.education.map(ed => `${ed.degree} - ${ed.institution} (${ed.period}) [${ed.score}]`).join('\n')}

CERTIFICATIONS
${resumeData.certifications.map(c => `• ${c}`).join('\n')}
        `.trim()

        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="resume-builder-page">
            <header className="page-header-row no-print">
                <div>
                    <h1>AI Resume Builder &amp; ATS Optimizer</h1>
                    <p>Build and customize a recruiter-vetted, ATS-friendly resume formatted with genuine engineering credentials.</p>
                </div>
                <div className="header-action-buttons">
                    <button
                        className={`btn ${isEditing ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                        {isEditing ? "View Live Resume" : "Edit Content"}
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={handleCopyPlainText}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy Plain Text"}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handlePrint}
                    >
                        <Printer size={16} />
                        Download / Print PDF
                    </button>
                </div>
            </header>

            <div className="resume-builder-grid">
                {/* Left: Template Selector & ATS Guide */}
                <div className="template-picker-col no-print">
                    <h3>Select Resume Layout</h3>
                    <div className="templates-list">
                        {TEMPLATES.map(tmpl => (
                            <div
                                key={tmpl.id}
                                className={`template-card ${selectedTemplate === tmpl.id ? 'template-card--selected' : ''}`}
                                onClick={() => setSelectedTemplate(tmpl.id)}
                            >
                                <div className="template-card-preview">
                                    <div className={`mini-paper mini-paper--${tmpl.id}`}>
                                        <div className="paper-line header-line" />
                                        <div className="paper-line sub-line" />
                                        <div className="paper-divider" />
                                        <div className="paper-line body-line" />
                                        <div className="paper-line body-line short" />
                                    </div>
                                </div>
                                <div className="template-info">
                                    <h4>{tmpl.name}</h4>
                                    <p>{tmpl.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="ats-tips-card">
                        <h4><ShieldCheck size={16} className="text-success" /> ATS Best Practices</h4>
                        <ul>
                            <li>Single column format parses cleanly into any applicant tracking system.</li>
                            <li>Include standard headings: Summary, Skills, Experience, Education.</li>
                            <li>Lead bullet points with quantifiable action verbs.</li>
                        </ul>
                    </div>
                </div>

                {/* Center: Live Resume Preview OR Edit Form */}
                <div className="resume-live-preview-col">
                    {isEditing ? (
                        <div className="resume-editor-form-card no-print">
                            <h3>Edit Resume Details</h3>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.fullName}
                                        onChange={e => setResumeData({ ...resumeData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Professional Title</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.title}
                                        onChange={e => setResumeData({ ...resumeData, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-grid-3">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.email}
                                        onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.phone}
                                        onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.location}
                                        onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>LinkedIn URL</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.linkedin}
                                        onChange={e => setResumeData({ ...resumeData, linkedin: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GitHub URL</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.github}
                                        onChange={e => setResumeData({ ...resumeData, github: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Professional Summary</label>
                                <textarea
                                    className="textarea"
                                    rows={3}
                                    value={resumeData.summary}
                                    onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Programming Languages</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={resumeData.skills.languages}
                                    onChange={e => setResumeData({
                                        ...resumeData,
                                        skills: { ...resumeData.skills, languages: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Frameworks &amp; Web Technologies</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={resumeData.skills.frameworks}
                                    onChange={e => setResumeData({
                                        ...resumeData,
                                        skills: { ...resumeData.skills, frameworks: e.target.value }
                                    })}
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(false)}
                            >
                                Save &amp; Preview
                            </button>
                        </div>
                    ) : (
                        /* The Printable Resume Paper */
                        <div className={`resume-sheet resume-sheet--${selectedTemplate}`} id="printable-resume-sheet">
                            {/* Header Section */}
                            <div className="resume-sheet-header">
                                <h1 className="candidate-name">{resumeData.fullName}</h1>
                                <p className="candidate-headline">{resumeData.title}</p>
                                <div className="contact-line">
                                    <span>{resumeData.email}</span> &bull;
                                    <span>{resumeData.phone}</span> &bull;
                                    <span>{resumeData.location}</span> &bull;
                                    <span>{resumeData.linkedin}</span> &bull;
                                    <span>{resumeData.github}</span>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Professional Summary</h2>
                                <p className="summary-paragraph">{resumeData.summary}</p>
                            </div>

                            {/* Technical Skills */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Technical Skills</h2>
                                <div className="skills-grid-table">
                                    <div className="skill-row">
                                        <span className="skill-cat">Languages:</span>
                                        <span className="skill-items">{resumeData.skills.languages}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Web Frameworks:</span>
                                        <span className="skill-items">{resumeData.skills.frameworks}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Databases:</span>
                                        <span className="skill-items">{resumeData.skills.databases}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Developer Tools:</span>
                                        <span className="skill-items">{resumeData.skills.tools}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Experience */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Professional Experience</h2>
                                {resumeData.experiences.map((exp, i) => (
                                    <div key={i} className="experience-entry">
                                        <div className="entry-header-row">
                                            <div>
                                                <strong className="entry-role">{exp.role}</strong> &bull; <span className="entry-company">{exp.company}</span>
                                            </div>
                                            <span className="entry-period">{exp.period}</span>
                                        </div>
                                        <ul className="entry-bullets">
                                            {exp.points.map((pt, pIdx) => (
                                                <li key={pIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Key Projects */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Technical Projects</h2>
                                {resumeData.projects.map((proj, i) => (
                                    <div key={i} className="project-entry">
                                        <div className="entry-header-row">
                                            <strong className="entry-project-title">{proj.title}</strong>
                                            <span className="entry-tech-badge">{proj.tech}</span>
                                        </div>
                                        <ul className="entry-bullets">
                                            {proj.points.map((pt, pIdx) => (
                                                <li key={pIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Education */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Education</h2>
                                {resumeData.education.map((edu, i) => (
                                    <div key={i} className="edu-entry">
                                        <div className="entry-header-row">
                                            <div>
                                                <strong>{edu.degree}</strong> &bull; <span>{edu.institution}</span>
                                            </div>
                                            <span>{edu.period}</span>
                                        </div>
                                        <p className="edu-score">{edu.score}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Certifications */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Certifications &amp; Accreditations</h2>
                                <ul className="cert-list">
                                    {resumeData.certifications.map((cert, i) => (
                                        <li key={i}>{cert}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: ATS Real-Time Analysis & Score */}
                <div className="ats-analysis-col no-print">
                    <div className="ats-card">
                        <h3>ATS Optimizer Score</h3>
                        <div className="ats-score-badge">
                            <span className="score-num">{atsScore}%</span>
                            <span className="score-lbl">Compatibility Index</span>
                        </div>

                        <div className="ats-checklist">
                            {atsChecks.map((chk, i) => (
                                <div key={i} className={`check-row ${chk.pass ? 'check-row--pass' : 'check-row--warn'}`}>
                                    {chk.pass ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{chk.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="ats-quick-stats">
                            <div className="q-stat">
                                <span className="stat-v">1 Page</span>
                                <span className="stat-l">Optimal Length</span>
                            </div>
                            <div className="q-stat">
                                <span className="stat-v">0 Tables</span>
                                <span className="stat-l">Parse-Safe</span>
                            </div>
                            <div className="q-stat">
                                <span className="stat-v">100%</span>
                                <span className="stat-l">ATS Scannable</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePrint}
                            className="btn btn-primary download-pdf-btn"
                        >
                            <Download size={16} />
                            Export PDF / Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeBuilder

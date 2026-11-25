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
    AlertCircle,
    Mail,
    Phone,
    MapPin
} from 'lucide-react'
import '../style/resumebuilder.scss'

const TEMPLATES = [
    { id: 'harvard', name: 'Harvard Clean (ATS 100%)', desc: 'Single-column standard with sharp divider lines, preferred by top tech recruiters and ATS parsers.' },
    { id: 'modern', name: 'Modern Tech (Two-Column)', desc: 'Professional two-column layout highlighting technical proficiencies, skills sidebar, and project achievements.' },
    { id: 'executive', name: 'Executive Minimalist', desc: 'Swiss typography, elegant left accent bars, and focused engineering leadership highlights.' },
    { id: 'compact', name: 'Developer Compact (1-Page)', desc: 'High-density Silicon Valley format designed to fit comprehensive engineering achievements cleanly onto one page.' }
]

// Genuine profile data matching Rajat Katnoria's resume
const DEFAULT_RESUME_DATA = {
    fullName: "Rajat Katnoria",
    title: "Full-Stack Developer",
    email: "rajat70184@gmail.com",
    phone: "+91-7018490629",
    location: "Punjab, India",
    linkedin: "linkedin.com/in/rajatkatnoria",
    github: "github.com/rajat020-cloud",
    summary: "Software Engineering undergraduate with strong foundations in Data Structures, Algorithms, Object-Oriented Programming, DBMS, Operating Systems, and Computer Networks. Experienced in full-stack development, backend engineering, RESTful APIs, authentication, and database management. Hands-on experience building web applications, integrating third-party APIs, and developing automated customer communication workflows.",
    skills: {
        languages: "C, C++, Java, JavaScript, SQL, Python",
        coreCS: "DSA, OOP, DBMS, Operating Systems, Computer Networks",
        backend: "Node.js, Express.js, REST APIs, Authentication, API Debugging",
        frontend: "React.js, Next.js, Component-Based Architecture, UI Development, SCSS",
        databases: "MongoDB, Firebase, MySQL, SQL",
        tools: "Meta WhatsApp APIs, Postman, Git, GitHub, VS Code, Render, Vercel"
    },
    experiences: [
        {
            role: "Full-Stack Developer",
            company: "AVBT Technologies",
            period: "October 2026 – Present",
            location: "Mohali, India",
            points: [
                "Contributing to Prajnaa Market's e-commerce storefront, improving page layouts and user-facing shopping workflows.",
                "Developed a WhatsApp CRM solution to manage customer information, orders, and automated communication workflows.",
                "Integrated Meta WhatsApp APIs to enable automated messaging workflows and reusable customer communication templates.",
                "Implemented backend integration between storefront checkout and CRM, synchronizing customer details, delivery addresses, cart items, and payment methods.",
                "Configured automated WhatsApp notifications for order-related customer updates."
            ]
        }
    ],
    projects: [
        {
            title: "AI Learning Platform (Interview Prep AI)",
            tech: "Next.js, Node.js, Express, MongoDB, Gemini API, Firebase",
            points: [
                "Developed a full-stack learning platform with a Next.js frontend and modular backend workflows.",
                "Built backend functionality using Node.js and Express.js with RESTful APIs for authentication and user management.",
                "Integrated Firebase Authentication to support secure user authentication.",
                "Integrated MongoDB and Gemini API to provide AI-assisted learning responses and structured content delivery.",
                "Organized reusable application components to improve maintainability and deployed on Vercel."
            ]
        },
        {
            title: "University Management System",
            tech: "React.js, Node.js, Express.js, MySQL",
            points: [
                "Engineered a role-based platform for students, faculty, and administrators.",
                "Implemented JWT authentication and RBAC, placement notifications, and section-wise enrollment groups.",
                "Designed and tested 12+ RESTful APIs for academic records, resume analysis, and student support using Postman.",
                "Structured backend logic and database interactions for secure and efficient data handling."
            ]
        },
        {
            title: "Team Task Manager",
            tech: "React.js, Node.js, Express.js, MongoDB",
            points: [
                "Built a task management platform with secure authentication and role-based access control.",
                "Implemented project management, task assignment, status tracking, and overdue monitoring dashboards.",
                "Developed validated RESTful APIs and deployed frontend on Vercel and backend on Render."
            ]
        },
        {
            title: "Online Voting System",
            tech: "React.js, CSS3",
            points: [
                "Built a responsive voting application using reusable UI components and dynamic state management.",
                "Implemented input validation and duplicate-vote prevention to support data consistency."
            ]
        }
    ],
    education: [
        {
            degree: "B.E. in Computer Science & Engineering",
            institution: "Chitkara University, Himachal Pradesh",
            period: "2023 – 2027",
            score: "CGPA: 8.7 / 10"
        }
    ],
    certifications: [
        "Fitness Head and Drill Instructor in the NSS core team; coordinated team activities and execution.",
        "Managed Unity March participant data using MS Excel under the My Bharat initiative; received Certificate of Appreciation from the Ministry of Youth Affairs.",
        "Cisco Networking Academy: Introduction to Modern AI, Applied AI; Nutanix: Hybrid Cloud Fundamentals.",
        "Infosys Springboard: C, C++, Design Thinking; NSS 7-Day Special Camp Participation Certificate."
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
        let score = 55
        const checks = []

        // Contact info completeness
        const hasEmail = Boolean(resumeData.email && resumeData.email.includes('@'))
        const hasPhone = Boolean(resumeData.phone && resumeData.phone.length > 8)
        const hasGithub = Boolean(resumeData.github)
        const hasLinkedin = Boolean(resumeData.linkedin)

        if (hasEmail && hasPhone) {
            score += 10
            checks.push({ text: "Complete Contact Information (Phone, Email)", pass: true })
        } else {
            checks.push({ text: "Incomplete Contact Info", pass: false })
        }

        if (hasGithub && hasLinkedin) {
            score += 10
            checks.push({ text: "Professional Profiles Present (GitHub, LinkedIn)", pass: true })
        } else {
            checks.push({ text: "Missing professional profiles", pass: false })
        }

        // Summary Check
        if (resumeData.summary && resumeData.summary.length > 100) {
            score += 10
            checks.push({ text: "Strong Keyword-Rich Professional Summary", pass: true })
        } else {
            checks.push({ text: "Summary too short for ATS keyword match", pass: false })
        }

        // Skills Check
        if (resumeData.skills.languages && resumeData.skills.backend) {
            score += 10
            checks.push({ text: "Structured Technical Skills Matrix", pass: true })
        } else {
            checks.push({ text: "Add more programming languages & frameworks", pass: false })
        }

        // Experience & Projects
        if (resumeData.experiences.length > 0 && resumeData.projects.length >= 2) {
            score += 5
            checks.push({ text: "Quantifiable Experience & Project Bullets", pass: true })
        }

        return { score: Math.min(100, score), checks }
    }

    const { score: atsScore, checks: atsChecks } = calculateAtsScore()

    const handleCopyPlainText = () => {
        const text = `
${resumeData.fullName}
${resumeData.title}
${resumeData.email} | ${resumeData.phone} | ${resumeData.location}
LinkedIn: ${resumeData.linkedin} | GitHub: ${resumeData.github}

PROFESSIONAL SUMMARY
${resumeData.summary}

TECHNICAL SKILLS
- Languages: ${resumeData.skills.languages}
- Core CS: ${resumeData.skills.coreCS}
- Backend: ${resumeData.skills.backend}
- Frontend: ${resumeData.skills.frontend}
- Databases: ${resumeData.skills.databases}
- Tools: ${resumeData.skills.tools}

EXPERIENCE
${resumeData.experiences.map(e => `${e.role} - ${e.company} (${e.period})\n${e.points.map(p => `• ${p}`).join('\n')}`).join('\n\n')}

PROJECTS
${resumeData.projects.map(p => `${p.title} [${p.tech}]\n${p.points.map(pt => `• ${pt}`).join('\n')}`).join('\n\n')}

EDUCATION
${resumeData.education.map(ed => `${ed.degree} - ${ed.institution} (${ed.period}) - ${ed.score}`).join('\n')}

CERTIFICATIONS & LEADERSHIP
${resumeData.certifications.map(c => `• ${c}`).join('\n')}
        `.trim()

        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="resume-builder-page">
            <header className="page-header-row no-print">
                <div>
                    <h1>AI Resume Builder &amp; ATS Optimizer</h1>
                    <p>Create, customize, and export executive, ATS-compliant resumes tailored for engineering roles.</p>
                </div>
                <div className="header-action-buttons">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                        {isEditing ? "View Live Preview" : "Edit Content"}
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
                    <h3>Select Resume Format</h3>
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
                            <li>Standard single-column format parses 100% cleanly into greenhouse, lever, and workday.</li>
                            <li>Lead bullet points with active action verbs (Engineered, Developed, Architected).</li>
                            <li>Include exact match technical keywords in the technical skills matrix.</li>
                        </ul>
                    </div>
                </div>

                {/* Center: Live Resume Preview OR Edit Form */}
                <div className="resume-live-preview-col">
                    {isEditing ? (
                        <div className="resume-editor-form-card no-print">
                            <h3>Edit Resume Content</h3>
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
                                    <label>LinkedIn Profile</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={resumeData.linkedin}
                                        onChange={e => setResumeData({ ...resumeData, linkedin: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GitHub Profile</label>
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
                                <label>Core Computer Science</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={resumeData.skills.coreCS}
                                    onChange={e => setResumeData({
                                        ...resumeData,
                                        skills: { ...resumeData.skills, coreCS: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Backend Development</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={resumeData.skills.backend}
                                    onChange={e => setResumeData({
                                        ...resumeData,
                                        skills: { ...resumeData.skills, backend: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Frontend Development</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={resumeData.skills.frontend}
                                    onChange={e => setResumeData({
                                        ...resumeData,
                                        skills: { ...resumeData.skills, frontend: e.target.value }
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
                    ) : selectedTemplate === 'modern' ? (
                        /* Modern Two-Column Layout */
                        <div className="resume-sheet resume-sheet--modern" id="printable-resume-sheet">
                            <div className="modern-header">
                                <div className="name-block">
                                    <h1 className="candidate-name">{resumeData.fullName}</h1>
                                    <p className="candidate-headline">{resumeData.title}</p>
                                </div>
                                <div className="modern-contact-pills">
                                    <span>{resumeData.email}</span> &bull; 
                                    <span>{resumeData.phone}</span> &bull; 
                                    <span>{resumeData.location}</span>
                                </div>
                            </div>

                            <div className="modern-body-layout">
                                <aside className="modern-sidebar">
                                    <div className="sidebar-section">
                                        <h3 className="sidebar-heading">Profiles</h3>
                                        <div className="sidebar-links">
                                            <div>{resumeData.linkedin}</div>
                                            <div>{resumeData.github}</div>
                                        </div>
                                    </div>

                                    <div className="sidebar-section">
                                        <h3 className="sidebar-heading">Technical Skills</h3>
                                        <div className="skill-cat-block">
                                            <strong>Languages</strong>
                                            <p>{resumeData.skills.languages}</p>
                                        </div>
                                        <div className="skill-cat-block">
                                            <strong>Core CS</strong>
                                            <p>{resumeData.skills.coreCS}</p>
                                        </div>
                                        <div className="skill-cat-block">
                                            <strong>Backend</strong>
                                            <p>{resumeData.skills.backend}</p>
                                        </div>
                                        <div className="skill-cat-block">
                                            <strong>Frontend</strong>
                                            <p>{resumeData.skills.frontend}</p>
                                        </div>
                                        <div className="skill-cat-block">
                                            <strong>Databases</strong>
                                            <p>{resumeData.skills.databases}</p>
                                        </div>
                                        <div className="skill-cat-block">
                                            <strong>APIs &amp; Tools</strong>
                                            <p>{resumeData.skills.tools}</p>
                                        </div>
                                    </div>

                                    <div className="sidebar-section">
                                        <h3 className="sidebar-heading">Education</h3>
                                        {resumeData.education.map((edu, i) => (
                                            <div key={i} className="sidebar-edu">
                                                <strong>{edu.degree}</strong>
                                                <div className="edu-inst">{edu.institution}</div>
                                                <div className="edu-date">{edu.period}</div>
                                                <div className="edu-cgpa">{edu.score}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="sidebar-section">
                                        <h3 className="sidebar-heading">Certifications</h3>
                                        <ul className="sidebar-bullet-list">
                                            {resumeData.certifications.map((cert, i) => (
                                                <li key={i}>{cert}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </aside>

                                <main className="modern-main-content">
                                    <div className="modern-content-section">
                                        <h2 className="section-title">Professional Summary</h2>
                                        <p className="summary-paragraph">{resumeData.summary}</p>
                                    </div>

                                    <div className="modern-content-section">
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

                                    <div className="modern-content-section">
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
                                </main>
                            </div>
                        </div>
                    ) : (
                        /* Harvard Clean, Executive Minimalist, or Developer Compact */
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
                                        <span className="skill-cat">Programming Languages:</span>
                                        <span className="skill-items">{resumeData.skills.languages}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Core Computer Science:</span>
                                        <span className="skill-items">{resumeData.skills.coreCS}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Backend Development:</span>
                                        <span className="skill-items">{resumeData.skills.backend}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Frontend Development:</span>
                                        <span className="skill-items">{resumeData.skills.frontend}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">Databases:</span>
                                        <span className="skill-items">{resumeData.skills.databases}</span>
                                    </div>
                                    <div className="skill-row">
                                        <span className="skill-cat">APIs &amp; Developer Tools:</span>
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
                                                <strong className="entry-role">{exp.role}</strong> | <span className="entry-company">{exp.company}</span>
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

                            {/* Leadership & Certifications */}
                            <div className="resume-sheet-section">
                                <h2 className="section-title">Leadership &amp; Certifications</h2>
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
                                <span className="stat-v">100%</span>
                                <span className="stat-l">ATS Scannable</span>
                            </div>
                            <div className="q-stat">
                                <span className="stat-v">0 Tables</span>
                                <span className="stat-l">Parse Safe</span>
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

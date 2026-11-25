import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTypewriter } from '../../../hooks/useTypewriter'
import {
    Sparkles,
    ArrowRight,
    Play,
    CheckCircle2,
    FileText,
    BrainCircuit,
    Mic,
    Code2,
    Target,
    BarChart3,
    ChevronDown,
    Laptop,
    Video,
    Volume2,
    Shield
} from 'lucide-react'
import './landing.scss'

const FAQS = [
    {
        q: "How does Interview Prep AI analyze my resume against a job description?",
        a: "Interview Prep AI evaluates your technical projects, frameworks (React, Node.js, Express, MongoDB, MySQL), and core CS knowledge against target job requirements to produce an explainable Match Score, pinpoint skill gaps, and generate customized technical and behavioral interview questions."
    },
    {
        q: "How does the live Mock Interview mode work with camera and sound?",
        a: "When you start a Mock Interview, your camera turns on so you can practice speaking like a real video interview. The AI interviewer speaks the questions aloud with realistic speech audio, listens to your spoken or typed answer, and gives instant multi-criteria feedback on accuracy, communication, and problem-solving."
    },
    {
        q: "What coding practice does Interview Prep AI include?",
        a: "You get access to 50+ curated top interview-level DSA questions across multiple languages (JavaScript, Python, C++, Java, C, Go). You can write code, run it against test cases in the live execution runner, and receive in-depth AI code reviews."
    },
    {
        q: "Does the resume builder generate ATS-compliant resumes?",
        a: "Yes! The resume builder formats your real experience, skills, and projects into clean single-column or modern technical formats that score 90%+ on ATS scanners, ready to export as clean A4 PDFs."
    }
]

const Landing = () => {
    const navigate = useNavigate()
    const [openFaq, setOpenFaq] = useState(0)

    const { displayedText: typedTagline } = useTypewriter("Prepare. Practice. Get Hired with AI.", 35)

    return (
        <div className="landing-page">
            {/* ── Top Navigation Bar ── */}
            <header className="landing-nav">
                <div className="nav-container">
                    <Link to="/" className="brand-logo">
                        <img src="/logo-icon.png" alt="Interview Prep AI" className="landing-logo-img" />
                        <span className="logo-text">Interview Prep AI</span>
                    </Link>

                    <nav className="desktop-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#mockups">Platform</a>
                        <a href="#faq">FAQ</a>
                    </nav>

                    <div className="nav-actions">
                        <Link to="/admin/login" className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#D946EF" }}>
                            <Shield size={14} /> Admin
                        </Link>
                        <Link to="/login" className="btn btn-ghost">Log In</Link>
                        <Link to="/register" className="btn btn-primary get-started-btn">
                            Get Started
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Hero Section ── */}
            <section className="hero-section">
                <div className="hero-glow-bg" />
                <div className="hero-content">
                    {/* Badge */}
                    <div className="hero-pill animate-float">
                        <Sparkles size={14} className="pill-sparkle" />
                        <span>AI-Powered Interview Preparation</span>
                    </div>

                    {/* Headline with Auto-Typing Effect */}
                    <h1 className="hero-title">
                        <span className="typed-headline">{typedTagline || "Prepare. Practice. Get Hired with AI."}</span>
                        <span className="typewriter-cursor">|</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="hero-subtitle">
                        Turn your resume and job description into an actionable interview preparation system —
                        live camera mock interviews with spoken audio, 50+ executable DSA coding challenges,
                        tailored technical Q&amp;A, and ATS-optimized resume building.
                    </p>

                    {/* Action Buttons */}
                    <div className="hero-buttons">
                        <button onClick={() => navigate('/register')} className="btn btn-primary hero-btn-main">
                            Get Started Free
                            <ArrowRight size={16} />
                        </button>
                        <a href="#how-it-works" className="btn btn-secondary hero-btn-demo">
                            <Play size={15} />
                            Explore Workflow
                        </a>
                    </div>

                    {/* Platform Laptop Showcase Mockup with Genuine Project Details */}
                    <div className="laptop-preview-wrapper" id="mockups">
                        <div className="laptop-frame">
                            <div className="laptop-top-bar">
                                <div className="dots">
                                    <span className="dot dot--red" />
                                    <span className="dot dot--yellow" />
                                    <span className="dot dot--green" />
                                </div>
                                <span className="mockup-url">interviewprepai.com/interview/plan</span>
                            </div>
                            <div className="laptop-screen">
                                <div className="mockup-header">
                                    <div className="mockup-company">
                                        <div className="company-logo-badge">FS</div>
                                        <div>
                                            <h4>Full-Stack Developer &bull; AVBT Technologies</h4>
                                            <p>Tailored Strategy &bull; Real Experience &amp; Tech Stack Verification</p>
                                        </div>
                                    </div>
                                    <div className="mockup-score-badge">
                                        <span className="score-val">92%</span>
                                        <span className="score-lbl">Match Score</span>
                                    </div>
                                </div>

                                <div className="mockup-body-grid">
                                    <div className="mockup-card">
                                        <h5><BrainCircuit size={14} /> Technical Questions</h5>
                                        <p className="q-preview">"Explain how you integrated Meta WhatsApp APIs with your CRM backend to synchronize order webhooks securely."</p>
                                        <span className="tag-model">Includes Model Answer &bull; Medium</span>
                                    </div>
                                    <div className="mockup-card">
                                        <h5><Target size={14} /> Behavioral Scenarios</h5>
                                        <p className="q-preview">"Describe a situation where an asynchronous payment webhook failed. How did you debug the data synchronization?"</p>
                                        <span className="tag-model">STAR Method Guide &bull; Problem Solving</span>
                                    </div>
                                    <div className="mockup-card">
                                        <h5><BarChart3 size={14} /> Skill Gap Breakdown</h5>
                                        <p className="q-preview">Identified 2 high-priority growth areas: Redis Distributed Caching &amp; Microservices Event Bus.</p>
                                        <span className="tag-model">Actionable 7-Day Roadmap</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Feature Badges */}
                    <div className="feature-pills-row">
                        <div className="f-pill"><FileText size={15} /> Resume Analysis</div>
                        <div className="f-pill"><BrainCircuit size={15} /> AI Question Generator</div>
                        <div className="f-pill"><Video size={15} /> Camera Mock Interview</div>
                        <div className="f-pill"><Volume2 size={15} /> Spoken Sound TTS</div>
                        <div className="f-pill"><Code2 size={15} /> 50+ DSA Runner</div>
                        <div className="f-pill"><FileText size={15} /> ATS Resume Builder</div>
                    </div>
                </div>
            </section>

            {/* ── Feature Grid Section ── */}
            <section className="features-section" id="features">
                <div className="section-header">
                    <span className="section-tag">Comprehensive Arsenal</span>
                    <h2>Everything You Need to Ace the Interview</h2>
                    <p>Designed for full-stack developers, software engineers, and tech candidates preparing for technical rounds.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon feature-icon--purple"><FileText size={22} /></div>
                        <h3>Deep PDF Resume Parsing</h3>
                        <p>Extracts your exact programming languages, frameworks, databases, and project bullet points without manual data entry.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon--blue"><BarChart3 size={22} /></div>
                        <h3>Explainable Match Score</h3>
                        <p>Quantitative breakdown analyzing technical skills, experience depth, project relevance, and keyword alignment.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon--pink"><BrainCircuit size={22} /></div>
                        <h3>Role-Tailored Q&amp;A</h3>
                        <p>Curated technical and STAR behavioral questions matching your exact stack with underlying interviewer intentions.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon--green"><Video size={22} /></div>
                        <h3>Live Camera Mock Interview</h3>
                        <p>Practice in front of your live camera with spoken audio questions and speech-to-text dictation.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon--yellow"><Code2 size={22} /></div>
                        <h3>50+ Top DSA Questions &amp; Runner</h3>
                        <p>Practice top LeetCode-style questions in JavaScript, Python, C++, Java, C, and Go with in-browser execution.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon--indigo"><Target size={22} /></div>
                        <h3>Actionable 7-Day Roadmap</h3>
                        <p>Interactive study roadmap with daily tasks and persistent completion tracking to eliminate preparation stress.</p>
                    </div>
                </div>
            </section>

            {/* ── How It Works Section ── */}
            <section className="how-section" id="how-it-works">
                <div className="section-header">
                    <span className="section-tag">Simple &amp; Fast</span>
                    <h2>How Interview Prep AI Works</h2>
                    <p>Go from job description to fully prepared in three clear steps.</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-num">01</div>
                        <h3>Input Role &amp; Resume</h3>
                        <p>Paste your target Job Description and upload your PDF resume or provide your experience summary.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-num">02</div>
                        <h3>AI Builds Your Strategy</h3>
                        <p>In seconds, AI evaluates fit, identifies gaps, curates targeted questions, and outlines your 7-day roadmap.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-num">03</div>
                        <h3>Practice Live &amp; Land the Job</h3>
                        <p>Simulate mock interviews with camera and voice, solve algorithm challenges, and export your ATS resume.</p>
                    </div>
                </div>
            </section>

            {/* ── FAQ Section ── */}
            <section className="faq-section" id="faq">
                <div className="section-header">
                    <span className="section-tag">Frequently Asked Questions</span>
                    <h2>Got Questions? We Have Answers.</h2>
                </div>

                <div className="faq-list">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openFaq === index ? 'faq-item--open' : ''}`}
                            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                        >
                            <div className="faq-q">
                                <h4>{faq.q}</h4>
                                <ChevronDown size={18} className="faq-chevron" />
                            </div>
                            {openFaq === index && (
                                <p className="faq-a">{faq.a}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-glow" />
                    <h2>Ready to Ace Your Next Interview?</h2>
                    <p>Join engineering candidates who prepare with structured roadmaps, live camera practice, and tailored questions.</p>
                    <button onClick={() => navigate('/register')} className="btn btn-primary cta-btn">
                        Get Started Free
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <Sparkles size={16} className="logo-sparkle" />
                            <span>Interview Prep AI</span>
                        </div>
                        <p>Your intelligent AI interview preparation and technical career accelerator platform.</p>
                    </div>
                    <div className="footer-links">
                        <div className="col">
                            <h5>Platform</h5>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                            <a href="#features">Features</a>
                        </div>
                        <div className="col">
                            <h5>Resources</h5>
                            <a href="#how-it-works">How It Works</a>
                            <a href="#faq">FAQ</a>
                            <Link to="/login">Dashboard</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Interview Prep AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing

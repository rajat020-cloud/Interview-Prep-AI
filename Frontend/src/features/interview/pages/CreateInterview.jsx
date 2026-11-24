import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import {
    Sparkles,
    Briefcase,
    Building2,
    FileText,
    UploadCloud,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Lightbulb,
    AlertCircle,
    Check,
    Loader2
} from 'lucide-react'
import '../style/create.scss'

const GENERATION_STAGES = [
    "Reading & extracting technical skills from Resume...",
    "Deep-parsing target Job Description requirements...",
    "Computing quantitative 0-100% Match Score breakdown...",
    "Formulating role-specific Technical & Behavioral questions...",
    "Pinpointing high-priority skill gaps and study topics...",
    "Constructing your day-by-day 7-day preparation roadmap..."
]

const CreateInterview = () => {
    const { generateReport, loading } = useInterview()
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(1) // 1: Job Details, 2: Resume, 3: Review
    const [jobTitle, setJobTitle] = useState('')
    const [company, setCompany] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [validationError, setValidationError] = useState('')
    const [currentStageIndex, setCurrentStageIndex] = useState(0)

    const fileInputRef = useRef()

    const handleFileSelect = (file) => {
        if (!file) return
        if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
            setValidationError('Please upload a PDF or DOCX resume document.')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setValidationError('File size exceeds 5MB limit.')
            return
        }
        setValidationError('')
        setSelectedFile(file)
    }

    const onDrop = (e) => {
        e.preventDefault()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const nextStep = () => {
        setValidationError('')
        if (currentStep === 1) {
            if (!jobTitle.trim()) {
                setValidationError('Job Title is required.')
                return
            }
            if (!jobDescription.trim() || jobDescription.trim().length < 30) {
                setValidationError('Please provide a descriptive Job Description (at least 30 characters).')
                return
            }
            setCurrentStep(2)
        } else if (currentStep === 2) {
            if (!selectedFile && !selfDescription.trim()) {
                setValidationError('Please either upload a Resume PDF or provide a Self-Description.')
                return
            }
            setCurrentStep(3)
        }
    }

    const prevStep = () => {
        setValidationError('')
        setCurrentStep((prev) => Math.max(1, prev - 1))
    }

    const handleGenerate = async () => {
        // Start stage animation ticker
        const interval = setInterval(() => {
            setCurrentStageIndex((prev) => (prev + 1) % GENERATION_STAGES.length)
        }, 3500)

        try {
            const report = await generateReport({
                title: jobTitle,
                company: company || "Target Company",
                jobDescription,
                selfDescription,
                resumeFile: selectedFile
            })
            clearInterval(interval)
            navigate(`/interview/${report._id}`)
        } catch (err) {
            clearInterval(interval)
            setValidationError('Failed to generate interview strategy: ' + (err.response?.data?.message || err.message))
        }
    }

    // Loading overlay during AI generation
    if (loading) {
        return (
            <div className="generating-fullscreen">
                <div className="generating-card">
                    <div className="spinner-glow">
                        <Loader2 size={44} className="animate-spin glow-icon" />
                    </div>
                    <h2>Building Your Interview Strategy...</h2>
                    <p className="stage-text animate-pulse">
                        {GENERATION_STAGES[currentStageIndex]}
                    </p>
                    <div className="generation-progress-bar">
                        <div className="progress-fill" />
                    </div>
                    <span className="timing-notice">Powered by Google Gemini 2.5 &bull; Approx 20-30s</span>
                </div>
            </div>
        )
    }

    return (
        <div className="create-interview-page">
            {/* Page Header */}
            <header className="create-header">
                <h1>Create a New <span className="gradient-text">Interview Plan</span></h1>
                <p>Upload your resume, add the job description, and get a personalized interview preparation plan powered by AI.</p>
            </header>

            {/* Step Wizard Indicator */}
            <div className="wizard-stepper">
                <div className={`step-item ${currentStep >= 1 ? 'step-item--active' : ''} ${currentStep > 1 ? 'step-item--completed' : ''}`}>
                    <div className="step-circle">{currentStep > 1 ? <Check size={14} /> : 1}</div>
                    <span>Job Details</span>
                </div>
                <div className={`step-connector ${currentStep > 1 ? 'step-connector--active' : ''}`} />
                <div className={`step-item ${currentStep >= 2 ? 'step-item--active' : ''} ${currentStep > 2 ? 'step-item--completed' : ''}`}>
                    <div className="step-circle">{currentStep > 2 ? <Check size={14} /> : 2}</div>
                    <span>Resume</span>
                </div>
                <div className={`step-connector ${currentStep > 2 ? 'step-connector--active' : ''}`} />
                <div className={`step-item ${currentStep >= 3 ? 'step-item--active' : ''}`}>
                    <div className="step-circle">3</div>
                    <span>Review & Generate</span>
                </div>
            </div>

            {validationError && (
                <div className="validation-alert">
                    <AlertCircle size={16} />
                    <span>{validationError}</span>
                </div>
            )}

            {/* ── STEP 1: Job Details ── */}
            {currentStep === 1 && (
                <div className="step-layout">
                    <div className="step-main-card">
                        <div className="form-group">
                            <label htmlFor="jobTitle">Job Title *</label>
                            <div className="input-with-icon">
                                <Briefcase size={16} className="input-icon" />
                                <input
                                    id="jobTitle"
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="company">Company (Optional)</label>
                            <div className="input-with-icon">
                                <Building2 size={16} className="input-icon" />
                                <input
                                    id="company"
                                    type="text"
                                    className="input"
                                    placeholder="e.g. AVBT Technologies, TechCorp, Amazon"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-with-counter">
                                <label htmlFor="jobDescription">Job Description *</label>
                                <span className="counter-tag">{jobDescription.length} / 5000 chars</span>
                            </div>
                            <textarea
                                id="jobDescription"
                                className="textarea"
                                rows={8}
                                placeholder="Paste the target job description requirements, responsibilities, and qualifications here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                maxLength={5000}
                                required
                            />
                        </div>

                        <div className="step-actions">
                            <button onClick={() => navigate('/')} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={nextStep} className="btn btn-primary">
                                Continue to Resume
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Tips */}
                    <aside className="step-sidebar-tips">
                        <div className="tips-card">
                            <div className="tips-header">
                                <Lightbulb size={18} className="tips-icon" />
                                <h4>Tips for Better Results</h4>
                            </div>
                            <ul className="tips-list">
                                <li>
                                    <CheckCircle2 size={15} />
                                    <span>Use a full, detailed job description with technical requirements and responsibilities.</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={15} />
                                    <span>Specify company name to tailor questions to their unique engineering culture.</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={15} />
                                    <span>Include seniority level (Junior, Mid, Senior, Lead) in the job title.</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            )}

            {/* ── STEP 2: Resume Upload ── */}
            {currentStep === 2 && (
                <div className="step-layout">
                    <div className="step-main-card">
                        <div className="upload-box-wrapper">
                            <label className="section-title">Upload Candidate Resume</label>
                            <p className="section-sub">Upload your PDF resume to let AI extract your exact projects, technologies, and achievements.</p>

                            <div
                                className={`dropzone-area ${dragActive ? 'dropzone-area--drag' : ''} ${selectedFile ? 'dropzone-area--has-file' : ''}`}
                                onDragEnter={() => setDragActive(true)}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept=".pdf,.docx"
                                    onChange={(e) => handleFileSelect(e.target.files[0])}
                                />
                                {selectedFile ? (
                                    <div className="file-selected-badge">
                                        <FileText size={32} className="file-icon" />
                                        <div className="file-meta">
                                            <strong>{selectedFile.name}</strong>
                                            <span>{(selectedFile.size / 1024).toFixed(1)} KB &bull; Click to change</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="dropzone-content">
                                        <div className="upload-icon-circle">
                                            <UploadCloud size={28} />
                                        </div>
                                        <h4>Click to upload or drag &amp; drop</h4>
                                        <p>PDF or DOCX (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="or-divider">
                            <span>OR QUICK SELF-DESCRIPTION</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="selfDescription">Quick Experience Summary</label>
                            <textarea
                                id="selfDescription"
                                className="textarea"
                                rows={4}
                                placeholder="Describe your years of experience, core tech stack, and notable projects if you don't have a resume file handy..."
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                            />
                        </div>

                        <div className="step-actions">
                            <button onClick={prevStep} className="btn btn-secondary">
                                <ArrowLeft size={16} />
                                Back
                            </button>
                            <button onClick={nextStep} className="btn btn-primary">
                                Review & Generate
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <aside className="step-sidebar-tips">
                        <div className="tips-card">
                            <div className="tips-header">
                                <Lightbulb size={18} className="tips-icon" />
                                <h4>Resume Best Practices</h4>
                            </div>
                            <ul className="tips-list">
                                <li>
                                    <CheckCircle2 size={15} />
                                    <span>Ensure your PDF has selectable text (not a scanned flat image).</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={15} />
                                    <span>Include concrete tech stack mentions (React, Node, Go, Docker, AWS).</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={15} />
                                    <span>The AI will cross-verify your projects against the target requirements.</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            )}

            {/* ── STEP 3: Review & Generate ── */}
            {currentStep === 3 && (
                <div className="step-review-card">
                    <h3>Review Your Interview Preparation Parameters</h3>
                    <p className="review-sub">Verify the inputs before our AI constructs your full preparation roadmap and question bank.</p>

                    <div className="review-details-grid">
                        <div className="review-field">
                            <span className="field-label">Target Role</span>
                            <span className="field-value">{jobTitle}</span>
                        </div>
                        <div className="review-field">
                            <span className="field-label">Target Company</span>
                            <span className="field-value">{company || 'Target Company'}</span>
                        </div>
                        <div className="review-field">
                            <span className="field-label">Resume Input</span>
                            <span className="field-value">
                                {selectedFile ? `📄 ${selectedFile.name}` : '✍️ Provided via Self-Description'}
                            </span>
                        </div>
                        <div className="review-field">
                            <span className="field-label">AI Engine</span>
                            <span className="field-value">Google Gemini 2.5 Flash with Zod Structured Enforcement</span>
                        </div>
                    </div>

                    <div className="review-deliverables">
                        <h4>Strategy Plan Will Include:</h4>
                        <div className="deliverable-tags">
                            <span>✅ 0-100% Match Score Breakdown</span>
                            <span>✅ Technical Questions & Model Answers</span>
                            <span>✅ STAR Behavioral Questions</span>
                            <span>✅ Prioritized Skill Gap Analysis</span>
                            <span>✅ 7-Day Actionable Roadmap</span>
                            <span>✅ ATS Resume Optimizer</span>
                        </div>
                    </div>

                    <div className="step-actions review-actions">
                        <button onClick={prevStep} className="btn btn-secondary">
                            <ArrowLeft size={16} />
                            Back to Edit
                        </button>
                        <button onClick={handleGenerate} className="btn btn-primary generate-final-btn">
                            <Sparkles size={16} />
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreateInterview

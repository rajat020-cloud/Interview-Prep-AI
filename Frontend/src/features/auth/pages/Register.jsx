import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import {
    Sparkles,
    Mail,
    Lock,
    User,
    Briefcase,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2
} from 'lucide-react'
import '../auth.form.scss'

const Register = () => {
    const { handleRegister, loading } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [targetRole, setTargetRole] = useState('Software Engineer')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!username || !email || !password) {
            setError('Please fill in all required fields.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        const res = await handleRegister({ username, email, password, fullName, targetRole })
        if (res.success) {
            navigate('/')
        } else {
            setError(res.error || 'Registration failed. Try a different email or username.')
        }
    }

    return (
        <div className="auth-split-page">
            {/* Left Promotional Branding Panel */}
            <div className="auth-hero-panel">
                <div className="auth-hero-glow" />
                <div className="auth-hero-content">
                    <Link to="/" className="auth-brand">
                        <img src="/logo-icon.png" alt="Interview Prep AI" className="auth-brand-logo-img" />
                        <span>Interview Prep AI</span>
                    </Link>

                    <div className="hero-quote">
                        <h2>Start Preparing<br />Smarter Today</h2>
                        <p>Join engineering and product candidates cracking interviews at Google, Meta, Amazon, and leading startups.</p>
                    </div>

                    <div className="features-checklist">
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>100% Free personalized interview strategy</span>
                        </div>
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>Detailed Match Score & Skill Gap Analysis</span>
                        </div>
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>AI Mock Interviews with voice and text</span>
                        </div>
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>ATS Resume Generator with 1-click PDF download</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Create Your Account 🚀</h2>
                        <p>Sign up to start building your interview preparation plan</p>
                    </div>

                    {error && (
                        <div className="auth-alert auth-alert--error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-row-2">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <div className="input-with-icon">
                                    <User size={16} className="input-icon" />
                                    <input
                                        id="fullName"
                                        type="text"
                                        className="input"
                                        placeholder="Rajat Katnoria"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username *</label>
                                <div className="input-with-icon">
                                    <User size={16} className="input-icon" />
                                    <input
                                        id="username"
                                        type="text"
                                        className="input"
                                        placeholder="rajat123"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <div className="input-with-icon">
                                <Mail size={16} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    className="input"
                                    placeholder="rajat@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="targetRole">Target Role</label>
                            <div className="input-with-icon">
                                <Briefcase size={16} className="input-icon" />
                                <input
                                    id="targetRole"
                                    type="text"
                                    className="input"
                                    placeholder="Software Engineer / Full Stack"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <div className="input-with-icon">
                                <Lock size={16} className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    placeholder="Min 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Free Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer-link">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register

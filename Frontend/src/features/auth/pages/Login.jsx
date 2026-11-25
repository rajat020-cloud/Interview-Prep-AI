import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import {
    Sparkles,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Briefcase
} from 'lucide-react'
import '../auth.form.scss'

const Login = () => {
    const { handleLogin, loading } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!email || !password) {
            setError('Please enter both email and password.')
            return
        }

        const res = await handleLogin({ email, password })
        if (res.success) {
            if (res.user?.role === 'super_admin' || res.user?.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/')
            }
        } else {
            setError(res.error || 'Invalid credentials. Please try again.')
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
                        <h2>AI-Powered<br />Interview Preparation</h2>
                        <p>Accelerate your career with AI-crafted interview plans, real-time mock interviews, and ATS resumes.</p>
                    </div>

                    <div className="features-checklist">
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>Personalized Q&A tailored to target JD</span>
                        </div>
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>Interactive AI Mock Interviews with live feedback</span>
                        </div>
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>ATS-Optimized Resume Builder & PDF export</span>
                        </div>
                        <div className="check-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>Structured 7-day preparation roadmap</span>
                        </div>
                    </div>

                    <div className="ambient-mock-card">
                        <div className="mock-card-glow" />
                        <div className="mock-card-header">
                            <span className="dot" />
                            <span>Targeted Google, Meta & Amazon Prep</span>
                        </div>
                        <p className="mock-card-text">"Interview Prep AI helped me identify my distributed system gaps and pass my interview with flying colors!"</p>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Welcome Back 👋</h2>
                        <p>Sign in to continue to Interview Prep AI</p>
                    </div>

                    {/* Mode Selector */}
                    <div className="auth-mode-selector">
                        <button type="button" className="mode-tab active">
                            Candidate Portal
                        </button>
                        <button
                            type="button"
                            className="mode-tab"
                            onClick={() => navigate('/admin/login')}
                        >
                            <ShieldCheck size={14} />
                            Admin Console
                        </button>
                    </div>

                    {error && (
                        <div className="auth-alert auth-alert--error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
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
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <span className="forgot-link" onClick={() => alert("Please contact support or register a new account.")}>Forgot password?</span>
                            </div>
                            <div className="input-with-icon">
                                <Lock size={16} className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
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
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="social-divider">
                        <span>Or continue with</span>
                    </div>

                    <div className="social-buttons">
                        <button type="button" className="social-btn" onClick={() => alert("Google OAuth can be integrated in production. Please use Email/Password for local dev.")}>
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/><path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/></svg>
                            Google
                        </button>
                        <button type="button" className="social-btn" onClick={() => alert("GitHub OAuth can be integrated in production. Please use Email/Password for local dev.")}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                            GitHub
                        </button>
                    </div>

                    <div className="auth-footer-link">
                        <span>Don't have an account? </span>
                        <Link to="/register">Sign Up</Link>
                    </div>

                    {/* Dedicated Admin Portal Link */}
                    <div className="admin-login-cta">
                        <div className="admin-cta-left">
                            <ShieldCheck size={16} color="#D946EF" />
                            <span>Staff / Administrative Access?</span>
                        </div>
                        <Link to="/admin/login" className="admin-cta-btn">
                            Admin Login →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

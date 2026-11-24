import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import {
    FileText,
    TrendingUp,
    Mic,
    Flame,
    ArrowRight,
    CheckCircle2,
    Circle,
    PlusCircle,
    Sparkles,
    Calendar,
    ChevronRight,
    Award
} from 'lucide-react'
import '../style/dashboard.scss'

const Dashboard = () => {
    const { user } = useAuth()
    const { reports, analytics, loading, fetchAnalytics, getReports } = useInterview()
    const navigate = useNavigate()

    useEffect(() => {
        fetchAnalytics()
        getReports()
    }, [])

    // Dynamic greeting based on current hour
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

    const stats = analytics?.stats || {
        totalReports: reports.length,
        avgMatchScore: reports.length > 0
            ? Math.round(reports.reduce((s, r) => s + (r.matchScore || 0), 0) / reports.length)
            : 0,
        totalMockInterviews: 0,
        streak: user?.streak || 1,
        preparationProgress: 0,
        completedTasks: 0,
        totalTasks: 0
    }

    const recentActivity = analytics?.recentActivity || reports.slice(0, 4).map(r => ({
        id: r._id,
        title: r.title,
        company: r.company || "Target Company",
        matchScore: r.matchScore,
        createdAt: r.createdAt
    }))

    // Calculate circular progress dashoffset
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const progressPercent = Math.min(100, Math.max(0, stats.preparationProgress || (reports.length > 0 ? 60 : 0)))
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference

    // Helper for company logo letters & colors
    const getCompanyBadge = (comp) => {
        const name = comp || "T"
        const first = name.charAt(0).toUpperCase()
        if (name.toLowerCase().includes("google")) return { char: "G", bg: "#ea4335" }
        if (name.toLowerCase().includes("amazon")) return { char: "a", bg: "#ff9900" }
        if (name.toLowerCase().includes("microsoft")) return { char: "M", bg: "#00a4ef" }
        if (name.toLowerCase().includes("meta") || name.toLowerCase().includes("facebook")) return { char: "M", bg: "#0668E1" }
        if (name.toLowerCase().includes("apple")) return { char: "", bg: "#555555" }
        return { char: first, bg: "#8b5cf6" }
    }

    const getRelativeTime = (dateStr) => {
        if (!dateStr) return "Recently"
        const diffDays = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) return "Today"
        if (diffDays === 1) return "Yesterday"
        return `${diffDays} days ago`
    }

    return (
        <div className="dashboard-view">
            {/* ── Top Header Greeting ── */}
            <div className="dashboard-header-bar">
                <div className="dashboard-header-bar__text">
                    <h1>
                        {greeting}, <span>{user?.fullName || user?.username || 'Candidate'}</span> 👋
                    </h1>
                    <p>Let's level up your interview preparation today.</p>
                </div>
                <Link to="/create-interview" className="btn btn-primary create-plan-cta">
                    <PlusCircle size={16} />
                    Create Interview Plan
                </Link>
            </div>

            {/* ── 4 Top Stat Cards ── */}
            <div className="stats-row">
                {/* 1. Interview Reports */}
                <div className="stat-box">
                    <div className="stat-box__icon stat-box__icon--purple">
                        <FileText size={20} />
                    </div>
                    <div className="stat-box__content">
                        <span className="stat-val">{stats.totalReports}</span>
                        <span className="stat-lbl">Interview Reports</span>
                    </div>
                </div>

                {/* 2. Avg Match Score */}
                <div className="stat-box">
                    <div className="stat-box__icon stat-box__icon--green">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-box__content">
                        <span className="stat-val">{stats.avgMatchScore}%</span>
                        <span className="stat-lbl">Avg. Match Score</span>
                    </div>
                </div>

                {/* 3. Mock Interviews */}
                <div className="stat-box">
                    <div className="stat-box__icon stat-box__icon--indigo">
                        <Mic size={20} />
                    </div>
                    <div className="stat-box__content">
                        <span className="stat-val">{stats.totalMockInterviews}</span>
                        <span className="stat-lbl">Mock Interviews</span>
                    </div>
                </div>

                {/* 4. Current Streak */}
                <div className="stat-box">
                    <div className="stat-box__icon stat-box__icon--orange">
                        <Flame size={20} />
                    </div>
                    <div className="stat-box__content">
                        <span className="stat-val">{stats.streak} Days</span>
                        <span className="stat-lbl">Current Streak</span>
                    </div>
                </div>
            </div>

            {/* ── Middle Section: Preparation Progress + Recent Activity ── */}
            <div className="dashboard-grid-2">
                {/* Preparation Progress Widget */}
                <div className="dash-card prep-progress-card">
                    <div className="dash-card__header">
                        <h3>Preparation Progress</h3>
                        {reports.length > 0 && (
                            <Link to={`/interview/${reports[0]._id}`} className="view-link">
                                View Plan <ChevronRight size={14} />
                            </Link>
                        )}
                    </div>

                    <div className="prep-progress-body">
                        {/* Circular Progress Gauge */}
                        <div className="circular-progress-wrapper">
                            <svg className="progress-ring" width="130" height="130">
                                <circle
                                    className="progress-ring__circle-bg"
                                    stroke="rgba(255, 255, 255, 0.08)"
                                    strokeWidth="10"
                                    fill="transparent"
                                    r={radius}
                                    cx="65"
                                    cy="65"
                                />
                                <circle
                                    className="progress-ring__circle-val"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="10"
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    style={{ strokeDashoffset }}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r={radius}
                                    cx="65"
                                    cy="65"
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="circle-inner-label">
                                <span className="circle-percent">{progressPercent}%</span>
                                <span className="circle-sub">Completed</span>
                            </div>
                        </div>

                        {/* Milestones Checklist */}
                        <div className="milestones-checklist">
                            <div className="milestone-item">
                                {reports.length > 0 ? (
                                    <CheckCircle2 size={16} className="m-icon m-icon--done" />
                                ) : (
                                    <Circle size={16} className="m-icon m-icon--pending" />
                                )}
                                <span className={reports.length > 0 ? 'm-text--done' : ''}>Interview Strategy Analysis</span>
                            </div>
                            <div className="milestone-item">
                                <CheckCircle2 size={16} className="m-icon m-icon--done" />
                                <span>ATS Resume Tailoring</span>
                            </div>
                            <div className="milestone-item">
                                {stats.completedTasks > 0 ? (
                                    <CheckCircle2 size={16} className="m-icon m-icon--done" />
                                ) : (
                                    <Circle size={16} className="m-icon m-icon--pending" />
                                )}
                                <span>Skill Gap Improvement</span>
                            </div>
                            <div className="milestone-item">
                                {stats.totalMockInterviews > 0 ? (
                                    <CheckCircle2 size={16} className="m-icon m-icon--done" />
                                ) : (
                                    <Circle size={16} className="m-icon m-icon--pending" />
                                )}
                                <span>AI Mock Interview Session</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="dash-card recent-activity-card">
                    <div className="dash-card__header">
                        <h3>Recent Activity</h3>
                        <Link to="/interview-history" className="view-link">
                            View All ({reports.length}) <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="recent-activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((item) => {
                                const badge = getCompanyBadge(item.company)
                                const isHigh = item.matchScore >= 80
                                const isMid = item.matchScore >= 60 && item.matchScore < 80

                                return (
                                    <div
                                        key={item.id}
                                        className="activity-item"
                                        onClick={() => navigate(`/interview/${item.id}`)}
                                    >
                                        <div
                                            className="activity-logo-badge"
                                            style={{ backgroundColor: badge.bg }}
                                        >
                                            {badge.char}
                                        </div>
                                        <div className="activity-info">
                                            <h4>{item.title} &bull; {item.company}</h4>
                                            <span className="activity-meta">
                                                <span className={`match-pill ${isHigh ? 'match-pill--high' : isMid ? 'match-pill--mid' : 'match-pill--low'}`}>
                                                    {item.matchScore}% Match
                                                </span>
                                                &bull; {getRelativeTime(item.createdAt)}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="item-arrow" />
                                    </div>
                                )
                            })
                        ) : (
                            <div className="empty-activity">
                                <FileText size={32} className="empty-icon" />
                                <p>No interview plans yet.</p>
                                <Link to="/create-interview" className="btn btn-primary btn-sm">
                                    Create Your First Plan
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Quick Action Shortcuts ── */}
            <div className="quick-actions-bar">
                <div className="quick-action-card" onClick={() => navigate('/mock-interview')}>
                    <div className="qa-icon qa-icon--mic"><Mic size={18} /></div>
                    <div className="qa-text">
                        <h4>Practice AI Mock Interview</h4>
                        <p>Simulate realistic interview scenarios with live scoring</p>
                    </div>
                    <ArrowRight size={15} />
                </div>

                <div className="quick-action-card" onClick={() => navigate('/coding-practice')}>
                    <div className="qa-icon qa-icon--code"><Sparkles size={18} /></div>
                    <div className="qa-text">
                        <h4>Algorithm Coding Practice</h4>
                        <p>Solve data structures challenges with AI code reviews</p>
                    </div>
                    <ArrowRight size={15} />
                </div>

                <div className="quick-action-card" onClick={() => navigate('/resume-builder')}>
                    <div className="qa-icon qa-icon--doc"><FileText size={18} /></div>
                    <div className="qa-text">
                        <h4>ATS Resume Builder</h4>
                        <p>Generate high-scoring ATS resumes tailored to target JDs</p>
                    </div>
                    <ArrowRight size={15} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard

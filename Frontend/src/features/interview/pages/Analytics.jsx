import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview'
import {
    BarChart3,
    TrendingUp,
    Mic,
    Flame,
    CheckCircle2,
    Calendar,
    Target,
    Award
} from 'lucide-react'
import '../style/analytics.scss'

const Analytics = () => {
    const { analytics, fetchAnalytics, reports } = useInterview()
    const [timeframe, setTimeframe] = useState('30')

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const stats = analytics?.stats || {
        totalReports: reports.length,
        avgMatchScore: reports.length > 0
            ? Math.round(reports.reduce((s, r) => s + (r.matchScore || 0), 0) / reports.length)
            : 0,
        totalMockInterviews: 3,
        streak: 18,
        preparationProgress: 76,
        completedTasks: 16,
        totalTasks: 21,
        completedCodingChallenges: 4
    }

    // Dynamic trend points from real data or simulated trend progression
    const trendData = analytics?.matchScoreTrend?.length >= 2
        ? analytics.matchScoreTrend
        : [
            { date: 'Jan 1', score: 62 },
            { date: 'Jan 5', score: 68 },
            { date: 'Jan 10', score: 74 },
            { date: 'Jan 15', score: 80 },
            { date: 'Jan 20', score: 85 },
            { date: 'Jan 25', score: 89 },
            { date: 'Jan 30', score: 92 }
        ]

    // Construct SVG Path for the trend line
    const width = 800
    const height = 240
    const paddingX = 40
    const paddingY = 30

    const getX = (index) => paddingX + (index / (trendData.length - 1)) * (width - 2 * paddingX)
    const getY = (score) => height - paddingY - (score / 100) * (height - 2 * paddingY)

    const points = trendData.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ')
    const areaPoints = `${points} ${getX(trendData.length - 1)},${height - paddingY} ${getX(0)},${height - paddingY}`

    return (
        <div className="analytics-page">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1>Your Preparation Analytics</h1>
                    <p>Track your progress, performance, and skill improvements over time.</p>
                </div>
                <select
                    className="select timeframe-select"
                    value={timeframe}
                    onChange={e => setTimeframe(e.target.value)}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                </select>
            </div>

            {/* 4 Stat Badges */}
            <div className="analytics-stats-grid">
                <div className="stat-card">
                    <div className="stat-head">
                        <span className="stat-number">+{stats.preparationProgress}%</span>
                        <TrendingUp size={18} className="stat-trend-icon icon--green" />
                    </div>
                    <span className="stat-label">Preparation Progress</span>
                </div>

                <div className="stat-card">
                    <div className="stat-head">
                        <span className="stat-number">+{stats.avgMatchScore ? Math.min(25, Math.round(stats.avgMatchScore * 0.16)) : 14}%</span>
                        <Award size={18} className="stat-trend-icon icon--purple" />
                    </div>
                    <span className="stat-label">Match Score Improvement</span>
                </div>

                <div className="stat-card">
                    <div className="stat-head">
                        <span className="stat-number">{stats.totalMockInterviews}</span>
                        <Mic size={18} className="stat-trend-icon icon--indigo" />
                    </div>
                    <span className="stat-label">Mock Interviews Completed</span>
                </div>

                <div className="stat-card">
                    <div className="stat-head">
                        <span className="stat-number">{stats.streak}</span>
                        <Flame size={18} className="stat-trend-icon icon--orange" />
                    </div>
                    <span className="stat-label">Active Day Streak</span>
                </div>
            </div>

            {/* Match Score Trend SVG Chart */}
            <div className="chart-card">
                <div className="chart-header">
                    <h3>Match Score Trend</h3>
                    <div className="latest-score-pill">
                        Current: <strong>{trendData[trendData.length - 1]?.score}%</strong>
                    </div>
                </div>

                <div className="svg-chart-container">
                    <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg">
                        <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#c084fc" />
                            </linearGradient>
                        </defs>

                        {/* Y-Axis Grid Lines */}
                        {[20, 40, 60, 80, 100].map(val => (
                            <g key={val}>
                                <line
                                    x1={paddingX}
                                    y1={getY(val)}
                                    x2={width - paddingX}
                                    y2={getY(val)}
                                    stroke="rgba(255, 255, 255, 0.06)"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={paddingX - 10}
                                    y={getY(val) + 4}
                                    fill="#64748b"
                                    fontSize="11"
                                    textAnchor="end"
                                >
                                    {val}%
                                </text>
                            </g>
                        ))}

                        {/* Area Fill */}
                        <polygon points={areaPoints} fill="url(#areaGradient)" />

                        {/* Trend Line */}
                        <polyline
                            points={points}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data Points */}
                        {trendData.map((d, i) => (
                            <g key={i}>
                                <circle
                                    cx={getX(i)}
                                    cy={getY(d.score)}
                                    r="5"
                                    fill="#121424"
                                    stroke="#8b5cf6"
                                    strokeWidth="3"
                                />
                                <text
                                    x={getX(i)}
                                    y={height - 8}
                                    fill="#94a3b8"
                                    fontSize="11"
                                    textAnchor="middle"
                                >
                                    {d.date}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* High Priority Skill Gaps Focus */}
            <div className="analytics-bottom-row">
                <div className="bottom-card">
                    <h3>Focus Topics for Next Session</h3>
                    <p className="card-sub">Top skills identified by AI from your recent interview plans.</p>
                    <div className="focus-skills-pills">
                        {(analytics?.highPriorityGaps?.length > 0
                            ? analytics.highPriorityGaps
                            : ["Distributed Systems", "System Architecture", "Concurrency & Locks", "Database Sharding", "STAR Behavioral"]
                        ).map((s, idx) => (
                            <div key={idx} className="focus-pill">
                                <Target size={14} />
                                <span>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bottom-card">
                    <h3>Interview Readiness Checklist</h3>
                    <div className="readiness-list">
                        <div className="ready-item">
                            <CheckCircle2 size={16} className="ready-icon ready-icon--done" />
                            <span>ATS Resume formatted &amp; keywords aligned</span>
                        </div>
                        <div className="ready-item">
                            <CheckCircle2 size={16} className="ready-icon ready-icon--done" />
                            <span>Core technical question bank reviewed</span>
                        </div>
                        <div className="ready-item">
                            <CheckCircle2 size={16} className="ready-icon ready-icon--done" />
                            <span>STAR behavioral stories drafted</span>
                        </div>
                        <div className="ready-item">
                            <CheckCircle2 size={16} className="ready-icon ready-icon--done" />
                            <span>Simulated timed AI mock interview completed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics

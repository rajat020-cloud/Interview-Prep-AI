import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import {
    History,
    Bookmark,
    Search,
    Trash2,
    ArrowRight,
    Check,
    Copy,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react'
import '../style/history.scss'

const InterviewHistory = () => {
    const navigate = useNavigate()
    const {
        reports,
        getReports,
        removeReport,
        getSavedQuestions,
        deleteSavedQuestion
    } = useInterview()

    const [activeTab, setActiveTab] = useState('history') // 'history' or 'saved'
    const [searchQuery, setSearchQuery] = useState('')
    const [filterScore, setFilterScore] = useState('all')
    const [savedList, setSavedList] = useState([])
    const [openSaved, setOpenSaved] = useState({})
    const [copiedIndex, setCopiedIndex] = useState(null)

    useEffect(() => {
        getReports()
        loadSavedQuestions()
    }, [])

    const loadSavedQuestions = async () => {
        try {
            const data = await getSavedQuestions()
            setSavedList(data.questions || [])
        } catch (err) {
            console.error("Load saved error:", err)
        }
    }

    const handleDeleteReport = async (e, id) => {
        e.stopPropagation()
        if (window.confirm("Are you sure you want to delete this interview plan?")) {
            await removeReport(id)
        }
    }

    const handleDeleteSaved = async (id) => {
        await deleteSavedQuestion(id)
        setSavedList(prev => prev.filter(q => q._id !== id))
    }

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(idx)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    // Filter reports
    const filteredReports = reports.filter(r => {
        const matchesSearch = !searchQuery.trim() ||
            (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (r.company && r.company.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesScore = filterScore === 'all' ||
            (filterScore === 'high' && r.matchScore >= 80) ||
            (filterScore === 'mid' && r.matchScore >= 60 && r.matchScore < 80) ||
            (filterScore === 'low' && r.matchScore < 60)

        return matchesSearch && matchesScore
    })

    // Filter saved questions
    const filteredSaved = savedList.filter(q => {
        return !searchQuery.trim() ||
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (q.company && q.company.toLowerCase().includes(searchQuery.toLowerCase()))
    })

    const getCompanyBadge = (comp) => {
        const name = comp || "T"
        const first = name.charAt(0).toUpperCase()
        if (name.toLowerCase().includes("google")) return { char: "G", bg: "#ea4335" }
        if (name.toLowerCase().includes("amazon")) return { char: "a", bg: "#ff9900" }
        if (name.toLowerCase().includes("microsoft")) return { char: "M", bg: "#00a4ef" }
        return { char: first, bg: "#8b5cf6" }
    }

    return (
        <div className="history-page">
            {/* Page Header */}
            <header className="page-header-row">
                <div>
                    <h1>Interview History &amp; Saved Questions</h1>
                    <p>Review and manage all your generated interview preparation strategies and bookmarked revision questions.</p>
                </div>
            </header>

            {/* Tab Pill Toggle */}
            <div className="history-tab-toggle">
                <button
                    className={`history-tab-btn ${activeTab === 'history' ? 'history-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <History size={16} />
                    Interview History ({reports.length})
                </button>
                <button
                    className={`history-tab-btn ${activeTab === 'saved' ? 'history-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <Bookmark size={16} />
                    Saved Questions ({savedList.length})
                </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="filter-controls-bar">
                <div className="search-field">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by job title or company..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {activeTab === 'history' && (
                    <select
                        className="select score-filter-select"
                        value={filterScore}
                        onChange={e => setFilterScore(e.target.value)}
                    >
                        <option value="all">All Match Scores</option>
                        <option value="high">High Match (&ge; 80%)</option>
                        <option value="mid">Medium Match (60–79%)</option>
                        <option value="low">Developing (&lt; 60%)</option>
                    </select>
                )}
            </div>

            {/* ── TAB 1: Interview History List ── */}
            {activeTab === 'history' && (
                <div className="history-items-list">
                    {filteredReports.length > 0 ? (
                        filteredReports.map(report => {
                            const badge = getCompanyBadge(report.company)
                            const isHigh = report.matchScore >= 80
                            const isMid = report.matchScore >= 60 && report.matchScore < 80

                            return (
                                <div
                                    key={report._id}
                                    className="history-item-card"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div
                                        className="company-logo"
                                        style={{ backgroundColor: badge.bg }}
                                    >
                                        {badge.char}
                                    </div>

                                    <div className="item-meta">
                                        <h4>{report.title} &bull; {report.company || 'Target Company'}</h4>
                                        <div className="meta-sub">
                                            <span className={`match-badge ${isHigh ? 'match-badge--high' : isMid ? 'match-badge--mid' : 'match-badge--low'}`}>
                                                {report.matchScore}% Match
                                            </span>
                                            &bull;
                                            <span>
                                                {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-actions" onClick={e => e.stopPropagation()}>
                                        <button
                                            className="action-icon-btn"
                                            title="View Details"
                                            onClick={() => navigate(`/interview/${report._id}`)}
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                        <button
                                            className="action-icon-btn action-icon-btn--delete"
                                            title="Delete Plan"
                                            onClick={(e) => handleDeleteReport(e, report._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="empty-history-placeholder">
                            <History size={40} className="empty-icon" />
                            <h3>No interview reports found</h3>
                            <p>Try clearing your search query or generate a new interview plan.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── TAB 2: Saved Questions ── */}
            {activeTab === 'saved' && (
                <div className="saved-questions-list">
                    {filteredSaved.length > 0 ? (
                        filteredSaved.map((q, idx) => {
                            const isOpen = openSaved[idx]
                            return (
                                <div key={q._id} className="saved-q-card">
                                    <div className="saved-q-head" onClick={() => setOpenSaved(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                                        <div className="saved-q-title">
                                            <span className="badge badge-tech">{q.type.toUpperCase()}</span>
                                            <span className="company-tag">{q.company}</span>
                                            <h4>{q.question}</h4>
                                        </div>
                                        <div className="head-actions" onClick={e => e.stopPropagation()}>
                                            <button
                                                className="action-icon-btn"
                                                onClick={() => handleCopy(q.answer, idx)}
                                                title="Copy Answer"
                                            >
                                                {copiedIndex === idx ? <Check size={15} /> : <Copy size={15} />}
                                            </button>
                                            <button
                                                className="action-icon-btn action-icon-btn--delete"
                                                onClick={() => handleDeleteSaved(q._id)}
                                                title="Remove from saved"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                            <button
                                                className="chevron-btn"
                                                onClick={() => setOpenSaved(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                            >
                                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="saved-q-body">
                                            {q.intention && (
                                                <div className="q-field">
                                                    <span className="field-lbl">Interviewer Intention:</span>
                                                    <p>{q.intention}</p>
                                                </div>
                                            )}
                                            <div className="q-field">
                                                <span className="field-lbl">Model Answer:</span>
                                                <p className="answer-text">{q.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className="empty-history-placeholder">
                            <Bookmark size={40} className="empty-icon" />
                            <h3>No saved questions yet</h3>
                            <p>Bookmark questions inside any interview report to build your personalized revision deck.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default InterviewHistory

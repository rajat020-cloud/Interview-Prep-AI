import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import {
    User,
    Lock,
    Bell,
    Download,
    Trash2,
    Check,
    AlertCircle,
    ShieldAlert,
    FileText,
    Printer,
    BookOpen
} from 'lucide-react'
import '../style/settings.scss'

const Settings = () => {
    const { user, handleUpdateProfile, handleChangePassword, handleDeleteAccount } = useAuth()
    const { reports } = useInterview()
    const navigate = useNavigate()

    const [fullName, setFullName] = useState(user?.fullName || '')
    const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer')
    const [profileSuccess, setProfileSuccess] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')

    const [emailNotif, setEmailNotif] = useState(user?.preferences?.emailNotifications ?? true)
    const [inAppNotif, setInAppNotif] = useState(user?.preferences?.inAppReminders ?? true)

    const onSaveProfile = async (e) => {
        e.preventDefault()
        setProfileSuccess('')
        const res = await handleUpdateProfile({
            fullName,
            targetRole,
            preferences: { emailNotifications: emailNotif, inAppReminders: inAppNotif }
        })
        if (res.success) {
            setProfileSuccess('Profile updated successfully!')
            setTimeout(() => setProfileSuccess(''), 3000)
        }
    }

    const onChangePass = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.')
            return
        }

        const res = await handleChangePassword({ currentPassword, newPassword })
        if (res.success) {
            setPasswordSuccess('Password updated successfully!')
            setCurrentPassword('')
            setNewPassword('')
            setTimeout(() => setPasswordSuccess(''), 3000)
        } else {
            setPasswordError(res.error || 'Password update failed.')
        }
    }

    /**
     * Export all user interview questions, intentions, and full model answers into a printable PDF study guide
     */
    const handleExportQnaPdf = () => {
        const userReports = reports && reports.length > 0 ? reports : []

        if (userReports.length === 0) {
            alert("No interview plans found yet. Please create an interview plan first to export your Q&A study guide!")
            return
        }

        const candidateName = user?.fullName || "Rajat Katnoria"
        const candidateEmail = user?.email || "rajat70184@gmail.com"
        const candidateRole = user?.targetRole || "Full-Stack Developer"
        const todayStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

        let totalTechQ = 0
        let totalBehQ = 0
        userReports.forEach(r => {
            totalTechQ += (r.technicalQuestions || []).length
            totalBehQ += (r.behavioralQuestions || []).length
        })

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Interview Prep AI - Master Q&A Study Guide - ${candidateName}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm 15mm 18mm 15mm;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.55;
            font-size: 13px;
            padding: 10px;
        }
        .guide-header {
            border-bottom: 3px solid #6366f1;
            padding-bottom: 18px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .guide-brand {
            font-size: 26px;
            font-weight: 800;
            color: #4338ca;
            letter-spacing: -0.02em;
        }
        .guide-sub {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            margin-top: 2px;
        }
        .candidate-meta {
            text-align: right;
            font-size: 12px;
            color: #475569;
        }
        .candidate-meta strong {
            color: #0f172a;
            font-size: 14px;
        }
        .summary-banner {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 24px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            text-align: center;
        }
        .stat-box .val {
            font-size: 20px;
            font-weight: 800;
            color: #4338ca;
        }
        .stat-box .lbl {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.04em;
        }
        .plan-section {
            margin-bottom: 30px;
            page-break-after: always;
        }
        .plan-section:last-child {
            page-break-after: auto;
        }
        .plan-title-bar {
            background: #1e1b4b;
            color: #ffffff;
            padding: 12px 18px;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .plan-title-bar h2 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
        }
        .plan-title-bar .match-pill {
            background: #10b981;
            color: #ffffff;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 12px;
        }
        .section-headline {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 6px;
            margin: 18px 0 12px;
        }
        .q-card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 14px 16px;
            margin-bottom: 14px;
            background: #ffffff;
            page-break-inside: avoid;
        }
        .q-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 8px;
        }
        .q-num {
            font-weight: 800;
            color: #4338ca;
            font-size: 13px;
        }
        .q-title {
            font-weight: 700;
            color: #0f172a;
            font-size: 14px;
            flex: 1;
        }
        .diff-pill {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .diff-Easy { background: #dcfce7; color: #166534; }
        .diff-Medium { background: #fef3c7; color: #92400e; }
        .diff-Hard { background: #fee2e2; color: #991b1b; }
        .intention-box {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
            margin-bottom: 8px;
            padding-left: 8px;
            border-left: 2px solid #cbd5e1;
        }
        .answer-box {
            background: #f8fafc;
            border-left: 4px solid #6366f1;
            padding: 12px 14px;
            border-radius: 0 6px 6px 0;
            font-size: 12.5px;
            color: #1e293b;
            line-height: 1.6;
            margin: 8px 0;
        }
        .answer-lbl {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #4338ca;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            display: block;
        }
        .concepts-box {
            font-size: 11px;
            color: #475569;
            margin-top: 6px;
        }
        .concepts-box strong { color: #0f172a; }
        .print-btn-bar {
            background: #f1f5f9;
            padding: 12px;
            text-align: center;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .btn-print {
            background: #6366f1;
            color: #fff;
            border: none;
            padding: 10px 24px;
            font-weight: 600;
            font-size: 14px;
            border-radius: 6px;
            cursor: pointer;
        }
        @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
            .q-card { border-color: #cbd5e1; box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="no-print print-btn-bar">
        <button class="btn-print" onclick="window.print()">🖨️ Click Here to Print or Save as PDF</button>
        <span style="margin-left: 14px; font-size: 12px; color: #64748b;">(Destination: "Save as PDF" &bull; Margins: Default)</span>
    </div>

    <div class="guide-header">
        <div>
            <div class="guide-brand">Interview Prep AI</div>
            <div class="guide-sub">Master Interview Preparation Q&A Study Guide &bull; Complete Model Answers</div>
        </div>
        <div class="candidate-meta">
            <strong>${candidateName}</strong><br/>
            ${candidateRole} &bull; ${candidateEmail}<br/>
            Exported on ${todayStr}
        </div>
    </div>

    <div class="summary-banner">
        <div class="stat-box">
            <div class="val">${userReports.length}</div>
            <div class="lbl">Interview Plans</div>
        </div>
        <div class="stat-box">
            <div class="val">${totalTechQ}</div>
            <div class="lbl">Technical Q&As</div>
        </div>
        <div class="stat-box">
            <div class="val">${totalBehQ}</div>
            <div class="lbl">Behavioral STAR Q&As</div>
        </div>
        <div class="stat-box">
            <div class="val">${totalTechQ + totalBehQ}</div>
            <div class="lbl">Total Model Answers</div>
        </div>
    </div>

    ${userReports.map((report, rIdx) => `
        <div class="plan-section">
            <div class="plan-title-bar">
                <h2>Role #${rIdx + 1}: ${report.title} &bull; ${report.company || 'Target Company'}</h2>
                <span class="match-pill">${report.matchScore || 85}% Qualification Match</span>
            </div>

            ${report.overallAssessment ? `
                <div style="font-size: 12px; color: #475569; margin-bottom: 14px; padding: 8px 12px; background: #f1f5f9; border-radius: 4px;">
                    <strong>Executive Assessment:</strong> ${report.overallAssessment}
                </div>
            ` : ''}

            <!-- Technical Questions -->
            <div class="section-headline">I. Technical Interview Questions & Comprehensive Answers (${(report.technicalQuestions || []).length})</div>
            ${(report.technicalQuestions || []).map((tq, qIdx) => `
                <div class="q-card">
                    <div class="q-header">
                        <span class="q-num">Q${qIdx + 1}.</span>
                        <span class="q-title">${tq.question}</span>
                        <span class="diff-pill diff-${tq.difficulty || 'Medium'}">${tq.difficulty || 'Medium'}</span>
                    </div>
                    ${tq.intention ? `<div class="intention-box">Interviewer's Intention: ${tq.intention}</div>` : ''}
                    <div class="answer-box">
                        <span class="answer-lbl">Comprehensive Model Answer:</span>
                        ${tq.answer}
                    </div>
                    ${tq.keyConcepts && tq.keyConcepts.length > 0 ? `
                        <div class="concepts-box">
                            <strong>Key Concepts:</strong> ${tq.keyConcepts.join(' &bull; ')}
                        </div>
                    ` : ''}
                    ${tq.commonMistakes && tq.commonMistakes.length > 0 ? `
                        <div class="concepts-box" style="color: #b91c1c;">
                            <strong>Common Pitfalls:</strong> ${tq.commonMistakes.join(' &bull; ')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}

            <!-- Behavioral Questions -->
            <div class="section-headline">II. Behavioral & Leadership Scenarios (STAR Answers) (${(report.behavioralQuestions || []).length})</div>
            ${(report.behavioralQuestions || []).map((bq, qIdx) => `
                <div class="q-card">
                    <div class="q-header">
                        <span class="q-num">B${qIdx + 1}.</span>
                        <span class="q-title">${bq.question}</span>
                        <span class="diff-pill" style="background: #e0e7ff; color: #3730a3;">STAR METHOD</span>
                    </div>
                    ${bq.intention ? `<div class="intention-box">Evaluation Focus: ${bq.intention}</div>` : ''}
                    <div class="answer-box">
                        <span class="answer-lbl">Structured STAR Model Answer:</span>
                        ${bq.answer}
                    </div>
                    ${bq.evaluationCriteria && bq.evaluationCriteria.length > 0 ? `
                        <div class="concepts-box">
                            <strong>Interviewer Checklist:</strong> ${bq.evaluationCriteria.join(' &bull; ')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}

            <!-- Skill Gaps & 7-Day Plan -->
            ${report.skillGaps && report.skillGaps.length > 0 ? `
                <div class="section-headline">III. Identified Skill Gaps & Recommendations</div>
                <div style="margin-bottom: 14px;">
                    ${report.skillGaps.map(gap => `
                        <div style="font-size: 12px; margin-bottom: 6px; padding: 6px 10px; border-left: 3px solid ${gap.severity === 'high' ? '#ef4444' : '#f59e0b'}; background: #fafafa;">
                            <strong>${gap.skill}</strong> [${gap.severity.toUpperCase()} PRIORITY]: ${gap.whyItMatters || ''} <em>Action: ${gap.recommendedAction || ''}</em>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('')}

    <script>
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.print()
            }, 500)
        })
    </script>
</body>
</html>`

        const printWindow = window.open("", "_blank")
        if (printWindow) {
            printWindow.document.write(html)
            printWindow.document.close()
            printWindow.focus()
        } else {
            alert("Please allow popups to open the printable Q&A study guide.")
        }
    }

    const handleExportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            profile: user,
            interviewReports: reports
        }, null, 2))
        const dlAnchor = document.createElement('a')
        dlAnchor.setAttribute("href", dataStr)
        dlAnchor.setAttribute("download", `interview_prep_ai_data.json`)
        document.body.appendChild(dlAnchor)
        dlAnchor.click()
        dlAnchor.remove()
    }

    const onDeleteAccount = async () => {
        if (window.confirm("WARNING: This will permanently delete your account, saved plans, and mock interview data. This action CANNOT be undone. Proceed?")) {
            const res = await handleDeleteAccount()
            if (res.success) {
                navigate('/register')
            }
        }
    }

    return (
        <div className="settings-page">
            <header className="page-header-row">
                <div>
                    <h1>Account Settings</h1>
                    <p>Manage your profile identity, security credentials, preferences, and data privacy.</p>
                </div>
            </header>

            <div className="settings-sections-list">
                {/* 1. Profile Information */}
                <div className="settings-card">
                    <div className="card-head">
                        <User size={18} className="card-icon" />
                        <div>
                            <h3>Profile Information</h3>
                            <p>Update your personal details and target career role.</p>
                        </div>
                    </div>

                    {profileSuccess && (
                        <div className="alert-success">
                            <Check size={16} />
                            <span>{profileSuccess}</span>
                        </div>
                    )}

                    <form onSubmit={onSaveProfile} className="settings-form">
                        <div className="form-row-2">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="Rajat Katnoria"
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Career Role</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={targetRole}
                                    onChange={e => setTargetRole(e.target.value)}
                                    placeholder="Senior Software Engineer"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input input--disabled"
                                value={user?.email || ''}
                                disabled
                                title="Email address cannot be changed"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary save-btn">
                            Save Profile Changes
                        </button>
                    </form>
                </div>

                {/* 2. Security & Password */}
                <div className="settings-card">
                    <div className="card-head">
                        <Lock size={18} className="card-icon" />
                        <div>
                            <h3>Password &amp; Security</h3>
                            <p>Update your account password to ensure your account remains secure.</p>
                        </div>
                    </div>

                    {passwordError && (
                        <div className="alert-error">
                            <AlertCircle size={16} />
                            <span>{passwordError}</span>
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="alert-success">
                            <Check size={16} />
                            <span>{passwordSuccess}</span>
                        </div>
                    )}

                    <form onSubmit={onChangePass} className="settings-form">
                        <div className="form-row-2">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-secondary save-btn">
                            Update Password
                        </button>
                    </form>
                </div>

                {/* 3. Notification Preferences */}
                <div className="settings-card">
                    <div className="card-head">
                        <Bell size={18} className="card-icon" />
                        <div>
                            <h3>Notification Preferences</h3>
                            <p>Choose which alerts you wish to receive.</p>
                        </div>
                    </div>

                    <div className="pref-toggles-list">
                        <label className="toggle-row">
                            <input
                                type="checkbox"
                                checked={emailNotif}
                                onChange={e => setEmailNotif(e.target.checked)}
                            />
                            <div>
                                <strong>Email Strategy Summaries</strong>
                                <p>Receive email updates when comprehensive interview plans finish generation.</p>
                            </div>
                        </label>

                        <label className="toggle-row">
                            <input
                                type="checkbox"
                                checked={inAppNotif}
                                onChange={e => setInAppNotif(e.target.checked)}
                            />
                            <div>
                                <strong>In-App Reminders &amp; Milestones</strong>
                                <p>Get notified about preparation roadmap deadlines and mock interview evaluations.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 4. Data Privacy & Export (Q&A PDF) */}
                <div className="settings-card">
                    <div className="card-head">
                        <FileText size={18} className="card-icon" />
                        <div>
                            <h3>Questions &amp; Answers Data Export</h3>
                            <p>Export all your interview preparation plans, technical questions, model answers, and STAR responses as a complete printable PDF study guide.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button onClick={handleExportQnaPdf} className="btn btn-primary">
                            <FileText size={15} />
                            Download All Questions &amp; Answers (PDF)
                        </button>
                        <button onClick={handleExportData} className="btn btn-secondary">
                            <Download size={15} />
                            Export Raw Data (JSON)
                        </button>
                    </div>
                </div>

                {/* 5. Danger Zone */}
                <div className="settings-card settings-card--danger">
                    <div className="card-head">
                        <ShieldAlert size={18} className="card-icon danger-icon" />
                        <div>
                            <h3>Danger Zone</h3>
                            <p>Permanently remove your account and all associated interview plans.</p>
                        </div>
                    </div>

                    <div>
                        <button onClick={onDeleteAccount} className="btn btn-danger">
                            <Trash2 size={15} />
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings

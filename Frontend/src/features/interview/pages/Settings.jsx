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
    ShieldAlert
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
        if (!currentPassword || !newPassword) {
            setPasswordError('Both passwords are required.')
            return
        }
        const res = await handleChangePassword({ currentPassword, newPassword })
        if (res.success) {
            setPasswordSuccess('Password changed successfully!')
            setCurrentPassword('')
            setNewPassword('')
            setTimeout(() => setPasswordSuccess(''), 3000)
        } else {
            setPasswordError(res.error || 'Password update failed.')
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

                {/* 4. Data Privacy & Export */}
                <div className="settings-card">
                    <div className="card-head">
                        <Download size={18} className="card-icon" />
                        <div>
                            <h3>Data Export</h3>
                            <p>Export all your interview plans, question banks, and progress as a structured JSON archive.</p>
                        </div>
                    </div>

                    <div>
                        <button onClick={handleExportData} className="btn btn-secondary">
                            <Download size={15} />
                            Export My Data (JSON)
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

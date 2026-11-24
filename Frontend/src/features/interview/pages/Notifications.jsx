import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import {
    Bell,
    CheckCheck,
    Sparkles,
    Mic,
    Flame,
    FileText,
    ExternalLink
} from 'lucide-react'
import '../style/notifications.scss'

const Notifications = () => {
    const { notifications, fetchNotifications, markRead, markAllRead } = useInterview()

    useEffect(() => {
        fetchNotifications()
    }, [])

    const getIcon = (type) => {
        if (type === 'report_ready') return <FileText size={18} className="icon--purple" />
        if (type === 'mock_completed') return <Mic size={18} className="icon--indigo" />
        if (type === 'streak') return <Flame size={18} className="icon--orange" />
        return <Sparkles size={18} className="icon--green" />
    }

    return (
        <div className="notifications-page">
            <header className="page-header-row">
                <div>
                    <h1>Notifications Center</h1>
                    <p>Stay up to date with your interview plans, mock evaluations, and preparation milestones.</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button onClick={markAllRead} className="btn btn-secondary mark-all-btn">
                        <CheckCheck size={16} />
                        Mark All as Read
                    </button>
                )}
            </header>

            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div
                            key={n._id}
                            className={`notification-item ${!n.isRead ? 'notification-item--unread' : ''}`}
                            onClick={() => !n.isRead && markRead(n._id)}
                        >
                            <div className="notification-icon-box">
                                {getIcon(n.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-top">
                                    <h4>{n.title}</h4>
                                    <span className="notification-time">
                                        {new Date(n.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p>{n.message}</p>
                                {n.link && (
                                    <Link to={n.link} className="notification-link">
                                        View Details <ExternalLink size={12} />
                                    </Link>
                                )}
                            </div>
                            {!n.isRead && <span className="unread-dot" />}
                        </div>
                    ))
                ) : (
                    <div className="empty-notifications-card">
                        <Bell size={40} className="empty-icon" />
                        <h3>No notifications yet</h3>
                        <p>You're all caught up! New notifications will appear here as you create interview plans and complete mock interviews.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notifications

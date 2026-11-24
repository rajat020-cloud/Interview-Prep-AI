import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useInterview } from '../features/interview/hooks/useInterview'
import {
    LayoutDashboard,
    PlusCircle,
    Mic,
    Code2,
    FileText,
    History,
    Bookmark,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Sparkles,
    Menu,
    X,
    User
} from 'lucide-react'
import './layout.scss'

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/create-interview', label: 'Create Interview', icon: PlusCircle },
    { to: '/mock-interview', label: 'Mock Interview', icon: Mic },
    { to: '/coding-practice', label: 'Coding Practice', icon: Code2 },
    { to: '/resume-builder', label: 'Resume Builder', icon: FileText },
    { to: '/interview-history', label: 'Interview History', icon: History },
    { to: '/saved-questions', label: 'Saved Questions', icon: Bookmark },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
    { to: '/settings', label: 'Settings', icon: Settings },
]

const Layout = () => {
    const { user, handleLogout } = useAuth()
    const { unreadCount, fetchNotifications } = useInterview()
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        fetchNotifications()
    }, [location.pathname])

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <div className="app-container">
            {/* Mobile Header Bar */}
            <header className="mobile-header">
                <button
                    className="mobile-toggle-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <div className="mobile-brand">
                    <img src="/logo-icon.png" alt="Interview Prep AI" className="brand-logo-icon" />
                    <span className="brand-name">Interview Prep AI</span>
                </div>
                <NavLink to="/notifications" className="mobile-bell">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="mobile-badge-dot" />}
                </NavLink>
            </header>

            {/* Sidebar Overlay on mobile */}
            {mobileOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Primary Left Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
                {/* Brand */}
                <div className="sidebar__brand">
                    <img src="/logo-icon.png" alt="Interview Prep AI" className="brand-logo-icon-img" />
                    <div className="brand-text">
                        <h2>Interview Prep AI</h2>
                        <span className="brand-sub">Practice &bull; Prepare &bull; Get Hired</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar__nav">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                                }
                            >
                                <span className="sidebar__icon-box">
                                    <Icon size={18} />
                                </span>
                                <span className="sidebar__label">{item.label}</span>
                                {item.badge && unreadCount > 0 && (
                                    <span className="sidebar__badge">{unreadCount}</span>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* User Profile Pill at Bottom */}
                <div className="sidebar__footer">
                    <div className="user-pill" onClick={() => navigate('/settings')}>
                        <div className="user-avatar">
                            {user?.username ? user.username.slice(0, 2).toUpperCase() : <User size={16} />}
                        </div>
                        <div className="user-meta">
                            <span className="user-name">{user?.fullName || user?.username || 'Candidate'}</span>
                            <span className="user-role">{user?.targetRole || 'Software Engineer'}</span>
                        </div>
                    </div>
                    <button
                        className="logout-icon-btn"
                        onClick={onLogout}
                        title="Log out"
                        aria-label="Log out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-viewport">
                <div className="viewport-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout

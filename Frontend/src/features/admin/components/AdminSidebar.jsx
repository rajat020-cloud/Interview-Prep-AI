import React from "react";
import { NavLink } from "react-router";
import {
    LayoutDashboard,
    Users,
    FileText,
    Mic,
    Cpu,
    CreditCard,
    LifeBuoy,
    Settings,
    FileSpreadsheet,
    ShieldCheck,
    LogOut,
    ExternalLink
} from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const { admin, logout } = useAdmin();

    const navItems = [
        { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "User Directory", path: "/admin/users", icon: Users },
        { name: "Interview Plans", path: "/admin/interviews", icon: FileText },
        { name: "Mock Interviews", path: "/admin/mock-interviews", icon: Mic },
        { name: "AI Telemetry", path: "/admin/ai-usage", icon: Cpu },
        { name: "Subscription Plans", path: "/admin/plans", icon: CreditCard },
        { name: "Support Desk", path: "/admin/support", icon: LifeBuoy },
        { name: "Audit Trail", path: "/admin/audit-logs", icon: FileSpreadsheet },
        { name: "System Settings", path: "/admin/settings", icon: Settings }
    ];

    return (
        <aside className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
            {/* Header Brand */}
            <div className="sidebar-brand">
                <div className="brand-badge-logo">
                    <img src="/logo-icon.png" alt="Interview Prep AI" className="sidebar-logo-img" />
                </div>
                <div className="brand-text">
                    <span className="platform-title">Interview Prep AI</span>
                    <span className="admin-tag">ADMIN CONSOLE</span>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="sidebar-nav">
                <div className="nav-group-label">MAIN CONTROL</div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                        >
                            <Icon size={19} className="nav-icon" />
                            <span className="nav-label">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Sidebar Footer User Info */}
            <div className="sidebar-footer">
                <div className="admin-chip">
                    <div className="admin-avatar">
                        {admin?.fullName ? admin.fullName[0].toUpperCase() : "A"}
                    </div>
                    <div className="admin-meta">
                        <span className="admin-name">{admin?.fullName || admin?.username || "Admin"}</span>
                        <span className="admin-role-badge">{admin?.role?.replace("_", " ")}</span>
                    </div>
                </div>

                <div className="footer-actions">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-btn"
                        title="Open Candidate App"
                    >
                        <ExternalLink size={16} />
                        <span>Candidate App</span>
                    </a>
                    <button
                        onClick={logout}
                        className="footer-btn logout-btn"
                        title="Sign Out"
                    >
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

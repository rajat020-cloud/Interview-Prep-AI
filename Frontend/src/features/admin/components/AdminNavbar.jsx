import React, { useState, useEffect } from "react";
import { Menu, X, Shield, Activity, RefreshCw } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";

export default function AdminNavbar({ toggleSidebar, isOpen }) {
    const { admin } = useAdmin();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="admin-navbar">
            <div className="navbar-left">
                <button
                    className="menu-toggle-btn"
                    onClick={toggleSidebar}
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="env-status-pill">
                    <span className="live-dot" />
                    <span className="env-text">PRODUCTION CLUSTER</span>
                </div>
            </div>

            <div className="navbar-right">
                <div className="time-indicator">
                    <Activity size={15} className="clock-icon" />
                    <span>{currentTime}</span>
                </div>

                <div className="admin-session-badge">
                    <Shield size={15} className="shield-tiny" />
                    <span className="badge-user">{admin?.email}</span>
                </div>
            </div>
        </header>
    );
}

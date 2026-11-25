import React, { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "../style/admin.scss";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="admin-shell">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className={`admin-main-wrap ${sidebarOpen ? "sidebar-expanded" : "sidebar-compact"}`}>
                <AdminNavbar
                    isOpen={sidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <main className="admin-content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

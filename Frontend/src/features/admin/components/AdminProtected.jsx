import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAdmin } from "../hooks/useAdmin";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminProtected({ children, requiredRoles = [] }) {
    const { admin, loading, logout } = useAdmin();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#0D0716",
                color: "#A855F7",
                gap: "16px"
            }}>
                <Loader2 size={40} className="animate-spin" />
                <span style={{ color: "#E9B8FF", fontSize: "14px", fontWeight: 500, letterSpacing: "0.5px" }}>
                    Verifying Administrative Authority...
                </span>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (admin.status === "suspended") {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#0D0716",
                color: "#EF4444",
                padding: "24px",
                textAlign: "center"
            }}>
                <ShieldAlert size={56} style={{ marginBottom: "16px" }} />
                <h2 style={{ color: "#FFFFFF", marginBottom: "8px" }}>Administrator Account Suspended</h2>
                <p style={{ color: "#94A3B8", maxWidth: "420px", marginBottom: "24px" }}>
                    Your administrative privileges have been revoked or suspended by the platform Super Administrator.
                </p>
                <button
                    onClick={logout}
                    style={{
                        padding: "10px 20px",
                        background: "#21152E",
                        color: "#E9B8FF",
                        border: "1px solid rgba(168, 85, 247, 0.4)",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Return to Login
                </button>
            </div>
        );
    }

    if (requiredRoles.length > 0 && admin.role !== "super_admin" && !requiredRoles.includes(admin.role)) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#0D0716",
                color: "#F59E0B",
                padding: "24px"
            }}>
                <ShieldAlert size={52} style={{ marginBottom: "16px" }} />
                <h2 style={{ color: "#FFFFFF", marginBottom: "8px" }}>Access Restricted</h2>
                <p style={{ color: "#94A3B8" }}>
                    This section requires one of: [{requiredRoles.join(", ")}].
                </p>
            </div>
        );
    }

    return children;
}

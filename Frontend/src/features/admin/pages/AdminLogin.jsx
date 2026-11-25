import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAdmin } from "../hooks/useAdmin";
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import "../style/admin.scss";

export default function AdminLogin() {
    const { login } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const from = location.state?.from?.pathname || "/admin/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Invalid administrator credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0D0716",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Ambient Background Glows */}
            <div style={{
                position: "absolute",
                top: "15%",
                left: "20%",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute",
                bottom: "15%",
                right: "20%",
                width: "350px",
                height: "350px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(217, 70, 239, 0.12) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none"
            }} />

            <div style={{
                width: "100%",
                maxWidth: "440px",
                background: "#171022",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                borderRadius: "16px",
                padding: "36px 32px",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
                position: "relative",
                zIndex: 1
            }}>
                {/* Header Icon */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{
                        width: "56px",
                        height: "56px",
                        margin: "0 auto 16px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #A855F7, #D946EF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 24px rgba(168, 85, 247, 0.5)"
                    }}>
                        <ShieldCheck size={32} color="#FFFFFF" />
                    </div>
                    <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        color: "#D946EF",
                        textTransform: "uppercase"
                    }}>
                        RESTRICTED ACCESS PORTAL
                    </span>
                    <h1 style={{
                        color: "#FFFFFF",
                        fontSize: "22px",
                        fontWeight: 700,
                        margin: "6px 0 0"
                    }}>
                        Interview Prep AI
                    </h1>
                    <p style={{
                        color: "#94A3B8",
                        fontSize: "13px",
                        marginTop: "4px"
                    }}>
                        Administrative Control & Intelligence System
                    </p>
                </div>

                {error && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#F87171",
                        fontSize: "13px",
                        marginBottom: "20px"
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "18px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#E9B8FF",
                            marginBottom: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Admin Email
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#64748B"
                            }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@interviewprepai.com"
                                style={{
                                    width: "100%",
                                    padding: "11px 14px 11px 40px",
                                    background: "#21152E",
                                    border: "1px solid rgba(168, 85, 247, 0.2)",
                                    borderRadius: "8px",
                                    color: "#FFFFFF",
                                    fontSize: "13.5px",
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "26px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#E9B8FF",
                            marginBottom: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Master Key Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#64748B"
                            }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                style={{
                                    width: "100%",
                                    padding: "11px 14px 11px 40px",
                                    background: "#21152E",
                                    border: "1px solid rgba(168, 85, 247, 0.2)",
                                    borderRadius: "8px",
                                    color: "#FFFFFF",
                                    fontSize: "13.5px",
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #A855F7, #D946EF)",
                            color: "#FFFFFF",
                            border: "none",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            boxShadow: "0 6px 20px rgba(168, 85, 247, 0.4)",
                            transition: "all 0.2s"
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Authenticating Authority...</span>
                            </>
                        ) : (
                            <>
                                <span>Access Administrative Console</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: "24px",
                    textAlign: "center",
                    borderTop: "1px solid rgba(168, 85, 247, 0.12)",
                    paddingTop: "16px"
                }}>
                    <a
                        href="/login"
                        style={{
                            color: "#94A3B8",
                            fontSize: "12px",
                            textDecoration: "none",
                            transition: "color 0.2s"
                        }}
                    >
                        ← Return to Standard Candidate Sign In
                    </a>
                </div>
            </div>
        </div>
    );
}

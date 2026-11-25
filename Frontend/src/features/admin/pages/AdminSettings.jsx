import React, { useState, useEffect } from "react";
import { Settings, Save, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";
import { getAdminSystemSettings, updateAdminSystemSettings } from "../services/admin.api";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        platformName: "Interview Prep AI",
        supportEmail: "support@interviewprepai.com",
        maintenanceMode: false,
        allowNewRegistrations: true,
        defaultUserPlan: "free",
        securitySettings: {
            maxLoginAttempts: 5,
            sessionTimeoutMinutes: 1440,
            enforceStrongPasswords: true
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await getAdminSystemSettings();
            if (data.settings) {
                setSettings(data.settings);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await updateAdminSystemSettings(settings);
            setMessage("Platform configuration settings successfully updated and committed.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <Settings size={26} color="#A855F7" />
                        Global Platform Configuration
                    </h1>
                    <p>Adjust system parameters, maintenance toggles, and authentication security guards</p>
                </div>
            </div>

            {message && (
                <div style={{
                    padding: "12px 16px",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "8px",
                    color: "#34D399",
                    marginBottom: "20px"
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSave} style={{ maxWidth: "780px" }}>
                {/* General Settings Card */}
                <div className="admin-card">
                    <div className="card-header">
                        <h2>System Identity & Access</h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#E9B8FF", fontWeight: 600, marginBottom: "6px" }}>
                                Platform Title
                            </label>
                            <input
                                type="text"
                                value={settings.platformName || ""}
                                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                style={{ width: "100%", padding: "10px", background: "#21152E", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "8px", color: "#FFFFFF" }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#E9B8FF", fontWeight: 600, marginBottom: "6px" }}>
                                Public Support & Feedback Email
                            </label>
                            <input
                                type="email"
                                value={settings.supportEmail || ""}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                style={{ width: "100%", padding: "10px", background: "#21152E", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "8px", color: "#FFFFFF" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#21152E", borderRadius: "8px" }}>
                            <div>
                                <strong style={{ color: "#FFFFFF", fontSize: "13px" }}>Candidate Self-Registration</strong>
                                <p style={{ color: "#94A3B8", fontSize: "11.5px", margin: "2px 0 0" }}>Allow new candidates to register accounts on the public portal.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.allowNewRegistrations !== false}
                                onChange={(e) => setSettings({ ...settings, allowNewRegistrations: e.target.checked })}
                                style={{ width: "18px", height: "18px", accentColor: "#A855F7", cursor: "pointer" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px" }}>
                            <div>
                                <strong style={{ color: "#F87171", fontSize: "13px" }}>Maintenance Lockout Mode</strong>
                                <p style={{ color: "#94A3B8", fontSize: "11.5px", margin: "2px 0 0" }}>When enabled, candidates see a scheduled maintenance notice. Admins can still log in.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={!!settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                style={{ width: "18px", height: "18px", accentColor: "#EF4444", cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={saving} className="admin-btn btn-primary">
                    <Save size={15} />
                    <span>{saving ? "Committing Changes..." : "Save Platform Configurations"}</span>
                </button>
            </form>
        </div>
    );
}

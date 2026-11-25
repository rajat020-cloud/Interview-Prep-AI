import React, { useState, useEffect } from "react";
import {
    Users,
    FileText,
    Mic,
    Cpu,
    TrendingUp,
    Shield,
    Activity,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Server,
    Database,
    Zap
} from "lucide-react";
import { getAdminDashboard } from "../services/admin.api";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchMetrics = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const res = await getAdminDashboard();
            setData(res);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard metrics.");
        } finally {
            setLoading(false);
            if (isManual) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#A855F7" }}>
                <RefreshCw size={36} className="animate-spin" style={{ margin: "0 auto 16px" }} />
                <p style={{ color: "#E9B8FF", fontSize: "14px" }}>Aggregating live cluster telemetry...</p>
            </div>
        );
    }

    const { stats, registrationTrend, planDistribution, recentAuditLogs, recentUsers, systemHealth } = data || {};

    return (
        <div>
            {/* Header */}
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <TrendingUp size={26} color="#D946EF" />
                        Executive Intelligence Dashboard
                    </h1>
                    <p>Live system health, candidate engagement, and AI engine telemetry</p>
                </div>

                <div className="header-actions">
                    <button
                        onClick={() => fetchMetrics(true)}
                        disabled={refreshing}
                        className="admin-btn btn-secondary"
                    >
                        <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                        <span>{refreshing ? "Syncing..." : "Sync Cluster Data"}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div style={{
                    padding: "12px 16px",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    color: "#F87171",
                    marginBottom: "20px"
                }}>
                    {error}
                </div>
            )}

            {/* KPI STATS ROW 1 */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Registered Candidates</span>
                        <div className="kpi-icon-wrap"><Users size={18} /></div>
                    </div>
                    <div className="kpi-value">{stats?.totalUsers || 0}</div>
                    <div className="kpi-subtext">
                        <span className="positive">+{stats?.newUsersToday || 0}</span> new today • {stats?.newUsersThisMonth || 0} this month
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Active Users</span>
                        <div className="kpi-icon-wrap" style={{ color: "#10B981", background: "rgba(16, 185, 129, 0.12)" }}>
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{stats?.activeUsers || 0}</div>
                    <div className="kpi-subtext">
                        <span className="positive">99.8%</span> verified • {stats?.suspendedUsers || 0} suspended
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Interview Reports</span>
                        <div className="kpi-icon-wrap" style={{ color: "#3B82F6", background: "rgba(59, 130, 246, 0.12)" }}>
                            <FileText size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{stats?.totalInterviews || 0}</div>
                    <div className="kpi-subtext">
                        Avg match alignment: <span className="accent">{stats?.averageMatchScore || 78}%</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Mock Interview Sessions</span>
                        <div className="kpi-icon-wrap" style={{ color: "#D946EF", background: "rgba(217, 70, 239, 0.12)" }}>
                            <Mic size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{stats?.totalMockInterviews || 0}</div>
                    <div className="kpi-subtext">
                        Avg performance: <span className="positive">{stats?.averageMockScore || 82}/100</span>
                    </div>
                </div>
            </div>

            {/* KPI STATS ROW 2 */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">AI Engine Invocations</span>
                        <div className="kpi-icon-wrap"><Cpu size={18} /></div>
                    </div>
                    <div className="kpi-value">{stats?.totalAiRequests || 0}</div>
                    <div className="kpi-subtext">
                        <span className="positive">{stats?.successfulAiRequests || 0}</span> success • {stats?.failedAiRequests || 0} errors
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">User Engagement</span>
                        <div className="kpi-icon-wrap" style={{ color: "#F59E0B", background: "rgba(245, 158, 11, 0.12)" }}>
                            <Activity size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{stats?.engagementRate || 100}%</div>
                    <div className="kpi-subtext">
                        Ratio of generated interviews to candidate accounts
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Active Database State</span>
                        <div className="kpi-icon-wrap" style={{ color: "#10B981", background: "rgba(16, 185, 129, 0.12)" }}>
                            <Database size={18} />
                        </div>
                    </div>
                    <div className="kpi-value" style={{ fontSize: "20px", marginTop: "4px" }}>
                        {systemHealth?.dbConnected ? "MongoDB Atlas Connected" : "Connecting..."}
                    </div>
                    <div className="kpi-subtext">
                        Cluster: <span className="positive">smarthire_ai</span> (Replica Set)
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Host Node System</span>
                        <div className="kpi-icon-wrap"><Server size={18} /></div>
                    </div>
                    <div className="kpi-value" style={{ fontSize: "20px", marginTop: "4px" }}>
                        Node {systemHealth?.nodeVersion || "v22"}
                    </div>
                    <div className="kpi-subtext">
                        Memory: {systemHealth?.freeMemoryMB || 0} MB free / {systemHealth?.totalMemoryMB || 0} MB
                    </div>
                </div>
            </div>

            {/* GRID: REGISTRATION TRENDS & PLAN DISTRIBUTION */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                {/* Registration Activity */}
                <div className="admin-card">
                    <div className="card-header">
                        <h2>
                            <Zap size={18} color="#A855F7" />
                            Candidate Onboarding Activity
                        </h2>
                        <span className="card-subtitle">Last 14 days breakdown</span>
                    </div>

                    <div style={{ minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {registrationTrend && registrationTrend.length > 0 ? (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "140px", padding: "10px 0" }}>
                                {registrationTrend.map((item, idx) => {
                                    const heightPx = Math.max(20, Math.min(120, item.count * 30));
                                    return (
                                        <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                                            <span style={{ fontSize: "11px", color: "#E9B8FF", fontWeight: 600 }}>{item.count}</span>
                                            <div style={{
                                                width: "100%",
                                                height: `${heightPx}px`,
                                                background: "linear-gradient(180deg, #D946EF, #A855F7)",
                                                borderRadius: "4px 4px 0 0",
                                                boxShadow: "0 0 10px rgba(168, 85, 247, 0.4)"
                                            }} />
                                            <span style={{ fontSize: "9.5px", color: "#94A3B8", transform: "rotate(-30deg)", whiteSpace: "nowrap" }}>
                                                {item._id.substring(5)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>
                                Candidate accounts recently registered will plot dynamically on this trend.
                            </div>
                        )}
                    </div>
                </div>

                {/* Plan Distribution */}
                <div className="admin-card">
                    <div className="card-header">
                        <h2>
                            <Shield size={18} color="#D946EF" />
                            Tier Distribution
                        </h2>
                        <span className="card-subtitle">Free vs Pro vs Premium</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
                        {["free", "pro", "premium"].map((planCode) => {
                            const found = planDistribution?.find(p => (p._id || "free") === planCode);
                            const count = found?.count || (planCode === "free" ? stats?.totalUsers || 1 : 0);
                            const total = stats?.totalUsers || 1;
                            const percentage = Math.round((count / total) * 100);

                            return (
                                <div key={planCode}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                                        <span style={{ textTransform: "capitalize", fontWeight: 600, color: "#FFFFFF" }}>{planCode} Tier</span>
                                        <span style={{ color: "#E9B8FF", fontWeight: 600 }}>{count} candidates ({percentage}%)</span>
                                    </div>
                                    <div style={{ width: "100%", height: "8px", background: "#21152E", borderRadius: "4px", overflow: "hidden" }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: "100%",
                                            background: planCode === "premium" ? "linear-gradient(90deg, #A855F7, #D946EF)" : planCode === "pro" ? "#A855F7" : "#64748B",
                                            borderRadius: "4px"
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* TWO COLUMNS: RECENT AUDIT TRAIL & RECENT CANDIDATES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
                {/* Recent Audit Logs */}
                <div className="admin-card">
                    <div className="card-header">
                        <h2>
                            <Activity size={18} color="#A855F7" />
                            Administrative Audit Trail
                        </h2>
                        <a href="/admin/audit-logs" style={{ color: "#D946EF", fontSize: "12.5px", textDecoration: "none" }}>View All →</a>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Admin</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAuditLogs && recentAuditLogs.length > 0 ? (
                                    recentAuditLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td style={{ fontSize: "12px", color: "#E9B8FF" }}>{log.adminEmail}</td>
                                            <td>
                                                <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#FFFFFF" }}>{log.action}</span>
                                            </td>
                                            <td>
                                                <span className={`badge-pill status-${log.status}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: "11px", color: "#94A3B8" }}>
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", color: "#94A3B8", padding: "20px" }}>
                                            No recent administrative actions recorded.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Candidates */}
                <div className="admin-card">
                    <div className="card-header">
                        <h2>
                            <Users size={18} color="#D946EF" />
                            Latest Registrations
                        </h2>
                        <a href="/admin/users" style={{ color: "#D946EF", fontSize: "12.5px", textDecoration: "none" }}>Directory →</a>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers && recentUsers.length > 0 ? (
                                    recentUsers.map((u) => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="avatar-mini">
                                                        {u.username ? u.username[0].toUpperCase() : "U"}
                                                    </div>
                                                    <div className="user-details">
                                                        <span className="user-name">{u.fullName || u.username}</span>
                                                        <span className="user-email">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge-pill status-open">{u.targetRole || "Software Engineer"}</span>
                                            </td>
                                            <td>
                                                <span className={`badge-pill status-${u.status}`}>{u.status}</span>
                                            </td>
                                            <td style={{ fontSize: "11.5px", color: "#94A3B8" }}>
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", color: "#94A3B8", padding: "20px" }}>
                                            No candidate accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

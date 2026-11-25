import React, { useState, useEffect } from "react";
import {
    Users,
    Search,
    Filter,
    Download,
    Eye,
    Shield,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    X,
    FileText,
    Mic,
    Code,
    Clock
} from "lucide-react";
import {
    getAdminUsers,
    getAdminUserDetails,
    toggleAdminUserStatus,
    updateAdminUserPlan,
    updateAdminUserRole,
    deleteAdminUser,
    exportUsersCsvUrl
} from "../services/admin.api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Modals
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getAdminUsers({
                page,
                limit: 10,
                search,
                role: roleFilter,
                status: statusFilter,
                plan: planFilter
            });
            setUsers(data.users || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to load users." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [roleFilter, statusFilter, planFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers(1);
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "suspended" : "active";
        setActionLoading(true);
        try {
            await toggleAdminUserStatus(userId, newStatus);
            setMessage({ type: "success", text: `User marked as ${newStatus}.` });
            fetchUsers(pagination.page);
            if (userDetails?.user?._id === userId) {
                setUserDetails({ ...userDetails, user: { ...userDetails.user, status: newStatus } });
            }
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update status." });
        } finally {
            setActionLoading(false);
        }
    };

    const handlePlanChange = async (userId, newPlan) => {
        try {
            await updateAdminUserPlan(userId, newPlan);
            setMessage({ type: "success", text: `User subscription upgraded to ${newPlan}.` });
            fetchUsers(pagination.page);
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update plan." });
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteCandidate) return;
        setActionLoading(true);
        try {
            await deleteAdminUser(deleteCandidate._id);
            setMessage({ type: "success", text: "User account and all associated data permanently deleted." });
            setDeleteCandidate(null);
            fetchUsers(pagination.page);
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Deletion failed." });
        } finally {
            setActionLoading(false);
        }
    };

    const openUserDetails = async (user) => {
        setSelectedUser(user);
        setDetailsLoading(true);
        try {
            const data = await getAdminUserDetails(user._id);
            setUserDetails(data);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to fetch user full profile." });
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <Users size={26} color="#A855F7" />
                        Candidate Directory & Access Control
                    </h1>
                    <p>Manage candidate accounts, subscription privileges, and account security</p>
                </div>

                <div className="header-actions">
                    <a
                        href={exportUsersCsvUrl()}
                        download
                        className="admin-btn btn-secondary"
                    >
                        <Download size={15} />
                        <span>Export CSV</span>
                    </a>
                </div>
            </div>

            {/* Notification alert */}
            {message.text && (
                <div style={{
                    padding: "12px 16px",
                    background: message.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                    border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                    borderRadius: "8px",
                    color: message.type === "success" ? "#34D399" : "#F87171",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ type: "", text: "" })} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>✕</button>
                </div>
            )}

            {/* Search and Filters Bar */}
            <div className="admin-card">
                <div className="filter-bar">
                    <form onSubmit={handleSearchSubmit} className="search-input-wrap">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, or candidate ID..."
                        />
                    </form>

                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="user">Candidate (User)</option>
                        <option value="admin">Administrator</option>
                        <option value="moderator">Moderator</option>
                        <option value="support">Support Agent</option>
                    </select>

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="suspended">Suspended Only</option>
                    </select>

                    <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                        <option value="">All Plans</option>
                        <option value="free">Free Tier</option>
                        <option value="pro">Pro Tier</option>
                        <option value="premium">Premium Tier</option>
                    </select>

                    <button type="button" onClick={() => fetchUsers(1)} className="admin-btn btn-secondary btn-sm">
                        <RefreshCw size={14} />
                    </button>
                </div>

                {/* Users Table */}
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Target Role</th>
                                <th>Account Status</th>
                                <th>Subscription</th>
                                <th>System Role</th>
                                <th>Streak</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "#A855F7" }}>
                                        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                                        <div>Loading directory records...</div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-mini">
                                                    {u.fullName ? u.fullName[0].toUpperCase() : u.username ? u.username[0].toUpperCase() : "U"}
                                                </div>
                                                <div className="user-details">
                                                    <span className="user-name">{u.fullName || u.username}</span>
                                                    <span className="user-email">{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: "12.5px", color: "#E9B8FF" }}>{u.targetRole || "Software Engineer"}</span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill status-${u.status}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={u.plan || "free"}
                                                onChange={(e) => handlePlanChange(u._id, e.target.value)}
                                                style={{
                                                    background: "#21152E",
                                                    color: u.plan === "premium" ? "#D946EF" : u.plan === "pro" ? "#A855F7" : "#94A3B8",
                                                    border: "1px solid rgba(168, 85, 247, 0.2)",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    padding: "3px 8px",
                                                    fontWeight: 600,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <option value="free">Free</option>
                                                <option value="pro">Pro</option>
                                                <option value="premium">Premium</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`badge-pill status-${u.role === "super_admin" ? "premium" : "open"}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: "12.5px" }}>
                                                ⚡ {u.streak || 1}d
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "12px", color: "#94A3B8" }}>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button
                                                    onClick={() => openUserDetails(u)}
                                                    className="admin-btn btn-secondary btn-sm"
                                                    title="Inspect candidate dossier"
                                                >
                                                    <Eye size={14} />
                                                </button>

                                                {u.role !== "super_admin" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusToggle(u._id, u.status)}
                                                            className={`admin-btn btn-sm ${u.status === "active" ? "btn-danger" : "btn-secondary"}`}
                                                            title={u.status === "active" ? "Suspend Account" : "Reactivate Account"}
                                                        >
                                                            {u.status === "active" ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                        </button>

                                                        <button
                                                            onClick={() => setDeleteCandidate(u)}
                                                            className="admin-btn btn-danger btn-sm"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#94A3B8" }}>
                                        No users matching the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="admin-pagination">
                    <span>
                        Showing {users.length} of {pagination.total} registered accounts
                    </span>

                    <div className="page-controls">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => fetchUsers(pagination.page - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {pagination.page} of {pagination.pages || 1}
                        </span>
                        <button
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => fetchUsers(pagination.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL 1: INSPECT CANDIDATE DOSSIER */}
            {selectedUser && (
                <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
                        <div className="modal-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div className="avatar-mini" style={{ width: "36px", height: "36px", fontSize: "14px" }}>
                                    {selectedUser.username ? selectedUser.username[0].toUpperCase() : "U"}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "16px" }}>{selectedUser.fullName || selectedUser.username}</h3>
                                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>{selectedUser.email}</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedUser(null)}>✕</button>
                        </div>

                        <div className="modal-body">
                            {detailsLoading ? (
                                <div style={{ textAlign: "center", padding: "40px", color: "#A855F7" }}>
                                    <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 10px" }} />
                                    <p style={{ color: "#E9B8FF", fontSize: "13px" }}>Retrieving candidate dossier and activity timeline...</p>
                                </div>
                            ) : userDetails ? (
                                <div>
                                    {/* Stats Highlights */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
                                        <div style={{ background: "#21152E", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                                            <FileText size={18} color="#3B82F6" style={{ margin: "0 auto 4px" }} />
                                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
                                                {userDetails.activitySummary?.totalInterviews || 0}
                                            </div>
                                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Prep Reports</span>
                                        </div>

                                        <div style={{ background: "#21152E", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                                            <Mic size={18} color="#D946EF" style={{ margin: "0 auto 4px" }} />
                                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
                                                {userDetails.activitySummary?.totalMockInterviews || 0}
                                            </div>
                                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Mock Sessions</span>
                                        </div>

                                        <div style={{ background: "#21152E", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                                            <Code size={18} color="#10B981" style={{ margin: "0 auto 4px" }} />
                                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
                                                {userDetails.activitySummary?.totalCodingPractices || 0}
                                            </div>
                                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Coding Labs</span>
                                        </div>
                                    </div>

                                    {/* Recent Generated Interview Plans */}
                                    <h4 style={{ fontSize: "13.5px", color: "#E9B8FF", margin: "16px 0 8px 0" }}>
                                        Generated Preparation Plans ({userDetails.interviews?.length || 0})
                                    </h4>
                                    <div style={{ maxHeight: "160px", overflowY: "auto", background: "#0D0716", borderRadius: "8px", padding: "8px" }}>
                                        {userDetails.interviews && userDetails.interviews.length > 0 ? (
                                            userDetails.interviews.map(i => (
                                                <div key={i._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid rgba(168, 85, 247, 0.1)" }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}>{i.jobTitle}</div>
                                                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>{i.company || "Target Company"}</div>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#D946EF", fontWeight: 700, fontSize: "13px" }}>{i.matchScore}% Match</span>
                                                        <div style={{ fontSize: "10.5px", color: "#64748B" }}>{new Date(i.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: "12px", textAlign: "center", color: "#64748B", fontSize: "12px" }}>
                                                No interview reports generated yet.
                                            </div>
                                        )}
                                    </div>

                                    {/* Mock Interviews */}
                                    <h4 style={{ fontSize: "13.5px", color: "#E9B8FF", margin: "16px 0 8px 0" }}>
                                        Mock Interview History ({userDetails.mockInterviews?.length || 0})
                                    </h4>
                                    <div style={{ maxHeight: "160px", overflowY: "auto", background: "#0D0716", borderRadius: "8px", padding: "8px" }}>
                                        {userDetails.mockInterviews && userDetails.mockInterviews.length > 0 ? (
                                            userDetails.mockInterviews.map(m => (
                                                <div key={m._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid rgba(168, 85, 247, 0.1)" }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}>{m.role} ({m.difficulty})</div>
                                                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>Status: {m.status}</div>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#10B981", fontWeight: 700, fontSize: "13px" }}>Score: {m.overallScore}/100</span>
                                                        <div style={{ fontSize: "10.5px", color: "#64748B" }}>{new Date(m.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: "12px", textAlign: "center", color: "#64748B", fontSize: "12px" }}>
                                                No mock interview sessions recorded yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="modal-footer">
                            <button className="admin-btn btn-secondary" onClick={() => setSelectedUser(null)}>
                                Close Dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: PERMANENT ACCOUNT DELETION CONFIRMATION */}
            {deleteCandidate && (
                <div className="admin-modal-overlay" onClick={() => setDeleteCandidate(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
                        <div className="modal-header">
                            <h3 style={{ color: "#EF4444", display: "flex", alignItems: "center", gap: "8px" }}>
                                <AlertCircle size={20} />
                                Delete Candidate Account
                            </h3>
                            <button className="close-btn" onClick={() => setDeleteCandidate(null)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <p style={{ color: "#FFFFFF", fontSize: "14px", lineHeight: "1.5" }}>
                                Are you sure you want to permanently delete candidate account:
                                <strong style={{ color: "#F87171", display: "block", marginTop: "4px" }}>
                                    {deleteCandidate.email}
                                </strong>
                            </p>
                            <p style={{ color: "#94A3B8", fontSize: "12.5px", background: "rgba(239, 68, 68, 0.08)", padding: "10px", borderRadius: "6px" }}>
                                ⚠️ This action will permanently wipe all generated interview plans, mock interview transcripts, coding history, and logs. This cannot be undone.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button className="admin-btn btn-secondary" onClick={() => setDeleteCandidate(null)}>
                                Cancel
                            </button>
                            <button
                                className="admin-btn btn-danger"
                                disabled={actionLoading}
                                onClick={handleDeleteUser}
                            >
                                {actionLoading ? "Deleting..." : "Permanently Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

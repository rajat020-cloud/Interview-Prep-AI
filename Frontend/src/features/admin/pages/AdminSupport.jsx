import React, { useState, useEffect } from "react";
import { LifeBuoy, Search, MessageSquare, Send, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { getAdminSupportTickets, replyAdminSupportTicket, updateAdminTicketStatus } from "../services/admin.api";

export default function AdminSupport() {
    const [tickets, setTickets] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyStatus, setReplyStatus] = useState("resolved");
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getAdminSupportTickets({
                page,
                limit: 10,
                status: statusFilter,
                priority: priorityFilter
            });
            setTickets(data.tickets || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(1);
    }, [statusFilter, priorityFilter]);

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !activeTicket) return;
        setSubmitting(true);
        try {
            const res = await replyAdminSupportTicket(activeTicket._id, replyText, replyStatus);
            setActiveTicket(res.ticket);
            setReplyText("");
            fetchTickets(pagination.page);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to deliver reply.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <LifeBuoy size={26} color="#3B82F6" />
                        Candidate Helpdesk & Feedback Management
                    </h1>
                    <p>Address candidate inquiries, resolve generation issues, and monitor feedback</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="filter-bar">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="">All Priorities</option>
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="critical">Critical</option>
                    </select>

                    <button type="button" onClick={() => fetchTickets(1)} className="admin-btn btn-secondary btn-sm">
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Candidate</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "#A855F7" }}>
                                        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                                        <div>Loading support queue...</div>
                                    </td>
                                </tr>
                            ) : tickets.length > 0 ? (
                                tickets.map((t) => (
                                    <tr key={t._id}>
                                        <td style={{ fontWeight: 600, color: "#FFFFFF" }}>{t.subject}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontSize: "12.5px", color: "#E9B8FF" }}>{t.userName || t.userEmail}</span>
                                                <span style={{ fontSize: "11px", color: "#64748B" }}>{t.userEmail}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge-pill status-open">{t.category}</span></td>
                                        <td>
                                            <span className={`badge-pill status-${t.priority === "critical" || t.priority === "high" ? "danger" : "warning"}`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill status-${t.status === "resolved" ? "active" : t.status === "open" ? "open" : "warning"}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "12px", color: "#94A3B8" }}>
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setActiveTicket(t)}
                                                className="admin-btn btn-secondary btn-sm"
                                            >
                                                <MessageSquare size={13} />
                                                <span>Respond</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "#94A3B8" }}>
                                        No support tickets currently pending in the queue.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TICKET THREAD & REPLY MODAL */}
            {activeTicket && (
                <div className="admin-modal-overlay" onClick={() => setActiveTicket(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0, color: "#FFFFFF" }}>{activeTicket.subject}</h3>
                                <span style={{ fontSize: "12px", color: "#94A3B8" }}>From: {activeTicket.userEmail}</span>
                            </div>
                            <button className="close-btn" onClick={() => setActiveTicket(null)}>✕</button>
                        </div>

                        <div className="modal-body">
                            {/* Conversation thread */}
                            <div style={{ maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                                {activeTicket.messages?.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: "12px",
                                            borderRadius: "8px",
                                            background: msg.sender === "admin" ? "rgba(168, 85, 247, 0.15)" : "#21152E",
                                            border: msg.sender === "admin" ? "1px solid rgba(168, 85, 247, 0.3)" : "1px solid rgba(168, 85, 247, 0.1)",
                                            alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                                            maxWidth: "85%"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#E9B8FF", marginBottom: "4px" }}>
                                            <strong>{msg.sender === "admin" ? "Admin Support" : activeTicket.userEmail}</strong>
                                            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                        <div style={{ color: "#FFFFFF", fontSize: "13px", lineHeight: "1.4" }}>
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input Box */}
                            <form onSubmit={handleSendReply}>
                                <div style={{ marginBottom: "12px" }}>
                                    <textarea
                                        rows={3}
                                        required
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your official administrative response..."
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            background: "#0D0716",
                                            border: "1px solid rgba(168, 85, 247, 0.3)",
                                            borderRadius: "8px",
                                            color: "#FFFFFF",
                                            fontSize: "13px",
                                            outline: "none"
                                        }}
                                    />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "12px", color: "#94A3B8" }}>Update status to:</span>
                                        <select
                                            value={replyStatus}
                                            onChange={(e) => setReplyStatus(e.target.value)}
                                            style={{ padding: "6px 10px", background: "#21152E", color: "#FFFFFF", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "6px", fontSize: "12px" }}
                                        >
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <button type="submit" disabled={submitting} className="admin-btn btn-primary btn-sm">
                                        <Send size={14} />
                                        <span>{submitting ? "Delivering..." : "Send Reply"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

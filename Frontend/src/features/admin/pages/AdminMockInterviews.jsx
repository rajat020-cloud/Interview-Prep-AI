import React, { useState, useEffect } from "react";
import { Mic, Search, Trash2, Eye, RefreshCw, Award, Clock } from "lucide-react";
import { getAdminMockInterviews, deleteAdminMockInterview } from "../services/admin.api";

export default function AdminMockInterviews() {
    const [mocks, setMocks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [statusFilter, setStatusFilter] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedMock, setSelectedMock] = useState(null);

    const fetchMocks = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getAdminMockInterviews({
                page,
                limit: 10,
                status: statusFilter,
                difficulty: difficultyFilter
            });
            setMocks(data.mockInterviews || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        } catch (err) {
            console.error("Failed to load mock interviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMocks(1);
    }, [statusFilter, difficultyFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this mock interview session record?")) return;
        try {
            await deleteAdminMockInterview(id);
            fetchMocks(pagination.page);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete.");
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <Mic size={26} color="#D946EF" />
                        Live Mock Interview Sessions
                    </h1>
                    <p>Track real-time candidate verbal performances, speech recognition accuracy, and scores</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="filter-bar">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Session Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                    </select>

                    <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <button type="button" onClick={() => fetchMocks(1)} className="admin-btn btn-secondary btn-sm">
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Target Role</th>
                                <th>Difficulty</th>
                                <th>Session Status</th>
                                <th>Performance Score</th>
                                <th>Questions Answered</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#A855F7" }}>
                                        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                                        <div>Loading mock interview telemetry...</div>
                                    </td>
                                </tr>
                            ) : mocks.length > 0 ? (
                                mocks.map((m) => (
                                    <tr key={m._id}>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{m.user?.fullName || m.user?.username || "Candidate"}</span>
                                                <span style={{ fontSize: "11px", color: "#94A3B8" }}>{m.user?.email}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: "#E9B8FF" }}>{m.role}</td>
                                        <td>
                                            <span className={`badge-pill status-${m.difficulty === "Hard" ? "danger" : m.difficulty === "Medium" ? "warning" : "active"}`}>
                                                {m.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill status-${m.status === "completed" ? "active" : "warning"}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 700,
                                                color: m.overallScore >= 75 ? "#10B981" : m.overallScore >= 50 ? "#F59E0B" : "#EF4444"
                                            }}>
                                                {m.overallScore}/100
                                            </span>
                                        </td>
                                        <td>{m.questions?.length || 0} questions</td>
                                        <td style={{ fontSize: "12px", color: "#94A3B8" }}>
                                            {new Date(m.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button
                                                    onClick={() => setSelectedMock(m)}
                                                    className="admin-btn btn-secondary btn-sm"
                                                    title="Inspect Transcript"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m._id)}
                                                    className="admin-btn btn-danger btn-sm"
                                                    title="Delete Session"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#94A3B8" }}>
                                        No mock interview sessions recorded.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span>Showing {mocks.length} of {pagination.total} sessions</span>
                    <div className="page-controls">
                        <button disabled={pagination.page <= 1} onClick={() => fetchMocks(pagination.page - 1)}>Previous</button>
                        <span>Page {pagination.page} of {pagination.pages || 1}</span>
                        <button disabled={pagination.page >= pagination.pages} onClick={() => fetchMocks(pagination.page + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {/* TRANSCRIPT MODAL */}
            {selectedMock && (
                <div className="admin-modal-overlay" onClick={() => setSelectedMock(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "750px" }}>
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0, color: "#FFFFFF" }}>{selectedMock.role} Mock Interview</h3>
                                <span style={{ fontSize: "12px", color: "#10B981" }}>Score: {selectedMock.overallScore}/100 • Status: {selectedMock.status}</span>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedMock(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <h4 style={{ color: "#E9B8FF", fontSize: "14px", marginBottom: "12px" }}>
                                Question & Candidate Response Log
                            </h4>
                            <div style={{ maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                                {selectedMock.questions?.map((q, idx) => (
                                    <div key={idx} style={{ background: "#0D0716", padding: "12px", borderRadius: "8px", border: "1px solid rgba(168, 85, 247, 0.15)" }}>
                                        <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "13px" }}>
                                            Q{idx + 1}: {q.questionText}
                                        </div>
                                        <div style={{ margin: "6px 0", color: "#94A3B8", fontSize: "12.5px", background: "#171022", padding: "8px", borderRadius: "4px" }}>
                                            <strong>Candidate Answer:</strong> {q.userAnswer || "(No speech response captured)"}
                                        </div>
                                        {q.feedback && (
                                            <div style={{ fontSize: "11.5px", color: "#34D399" }}>
                                                Score: {q.feedback.score}/100 • Tech Accuracy: {q.feedback.technicalAccuracy}%
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="admin-btn btn-secondary" onClick={() => setSelectedMock(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { FileText, Search, Trash2, Eye, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import { getAdminInterviews, deleteAdminInterview } from "../services/admin.api";

export default function AdminInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [message, setMessage] = useState("");

    const fetchInterviews = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getAdminInterviews({ page, limit: 10, search });
            setInterviews(data.interviews || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to load interview plans.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews(1);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this interview report?")) return;
        try {
            await deleteAdminInterview(id);
            fetchInterviews(pagination.page);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete.");
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <FileText size={26} color="#3B82F6" />
                        AI Interview Preparation Plans
                    </h1>
                    <p>Inspect and manage all generated job-tailored interview preparation packages</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="filter-bar">
                    <form onSubmit={(e) => { e.preventDefault(); fetchInterviews(1); }} className="search-input-wrap">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter by job title, company, or target role..."
                        />
                    </form>
                    <button type="button" onClick={() => fetchInterviews(1)} className="admin-btn btn-secondary btn-sm">
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Job Title</th>
                                <th>Target Company</th>
                                <th>Match Score</th>
                                <th>Tech Questions</th>
                                <th>Behavioral Qs</th>
                                <th>Generated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#A855F7" }}>
                                        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                                        <div>Loading reports...</div>
                                    </td>
                                </tr>
                            ) : interviews.length > 0 ? (
                                interviews.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{item.user?.fullName || item.user?.username || "Candidate"}</span>
                                                <span style={{ fontSize: "11px", color: "#94A3B8" }}>{item.user?.email}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: "#E9B8FF" }}>{item.jobTitle}</td>
                                        <td>{item.company || "Target Company"}</td>
                                        <td>
                                            <span style={{
                                                fontWeight: 700,
                                                color: item.matchScore >= 80 ? "#10B981" : item.matchScore >= 65 ? "#F59E0B" : "#EF4444"
                                            }}>
                                                {item.matchScore}%
                                            </span>
                                        </td>
                                        <td>{item.technicalQuestions?.length || 0}</td>
                                        <td>{item.behavioralQuestions?.length || 0}</td>
                                        <td style={{ fontSize: "12px", color: "#94A3B8" }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button
                                                    onClick={() => setSelectedReport(item)}
                                                    className="admin-btn btn-secondary btn-sm"
                                                    title="Preview Report"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="admin-btn btn-danger btn-sm"
                                                    title="Delete Report"
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
                                        No interview preparation reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span>Showing {interviews.length} of {pagination.total} reports</span>
                    <div className="page-controls">
                        <button disabled={pagination.page <= 1} onClick={() => fetchInterviews(pagination.page - 1)}>
                            Previous
                        </button>
                        <span>Page {pagination.page} of {pagination.pages || 1}</span>
                        <button disabled={pagination.page >= pagination.pages} onClick={() => fetchInterviews(pagination.page + 1)}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW REPORT MODAL */}
            {selectedReport && (
                <div className="admin-modal-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "750px" }}>
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0, color: "#FFFFFF" }}>{selectedReport.jobTitle}</h3>
                                <span style={{ fontSize: "12px", color: "#D946EF" }}>{selectedReport.company} • Match Score: {selectedReport.matchScore}%</span>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedReport(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ background: "#21152E", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
                                <strong style={{ color: "#E9B8FF", fontSize: "12.5px" }}>Overall Assessment</strong>
                                <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "4px", lineHeight: "1.5" }}>
                                    {selectedReport.overallAssessment || "Candidate aligned with target core competencies and technical fundamentals."}
                                </p>
                            </div>

                            <h4 style={{ color: "#FFFFFF", fontSize: "14px", margin: "16px 0 8px" }}>
                                Sample Technical Questions ({selectedReport.technicalQuestions?.length || 0})
                            </h4>
                            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                                {selectedReport.technicalQuestions?.map((q, idx) => (
                                    <div key={idx} style={{ background: "#0D0716", padding: "10px", borderRadius: "6px", border: "1px solid rgba(168, 85, 247, 0.15)" }}>
                                        <div style={{ fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}>{idx + 1}. {q.question}</div>
                                        <div style={{ fontSize: "11px", color: "#F59E0B", marginTop: "2px" }}>Difficulty: {q.difficulty}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="admin-btn btn-secondary" onClick={() => setSelectedReport(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

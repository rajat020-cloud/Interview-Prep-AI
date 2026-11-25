import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Search, RefreshCw, Eye } from "lucide-react";
import { getAdminAuditLogs } from "../services/admin.api";

export default function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getAdminAuditLogs({
                page,
                limit: 15,
                search,
                action: actionFilter
            });
            setLogs(data.logs || []);
            setPagination(data.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, [actionFilter]);

    return (
        <div>
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <FileSpreadsheet size={26} color="#A855F7" />
                        Platform Security Audit Trail
                    </h1>
                    <p>Tamper-evident immutable record of all administrative state modifications and access events</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="filter-bar">
                    <form onSubmit={(e) => { e.preventDefault(); fetchLogs(1); }} className="search-input-wrap">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by admin email, target ID, or action..."
                        />
                    </form>

                    <button type="button" onClick={() => fetchLogs(1)} className="admin-btn btn-secondary btn-sm">
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Admin User</th>
                                <th>Role</th>
                                <th>Action Performed</th>
                                <th>Target Resource</th>
                                <th>Status</th>
                                <th>IP Address</th>
                                <th>Timestamp</th>
                                <th>Inspect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#A855F7" }}>
                                        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                                        <div>Reading security audit logs...</div>
                                    </td>
                                </tr>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log._id}>
                                        <td style={{ fontWeight: 600, color: "#E9B8FF", fontSize: "12.5px" }}>{log.adminEmail}</td>
                                        <td>
                                            <span className="badge-pill status-open">{log.adminRole}</span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: "#FFFFFF" }}>{log.action}</td>
                                        <td style={{ fontSize: "12px", color: "#94A3B8" }}>{log.target || log.targetModel || "System"}</td>
                                        <td>
                                            <span className={`badge-pill status-${log.status}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>{log.ipAddress}</td>
                                        <td style={{ fontSize: "12px", color: "#94A3B8" }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="admin-btn btn-secondary btn-sm"
                                                title="View Log Details"
                                            >
                                                <Eye size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#94A3B8" }}>
                                        No audit log entries found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span>Showing {logs.length} of {pagination.total} audit events</span>
                    <div className="page-controls">
                        <button disabled={pagination.page <= 1} onClick={() => fetchLogs(pagination.page - 1)}>Previous</button>
                        <span>Page {pagination.page} of {pagination.pages || 1}</span>
                        <button disabled={pagination.page >= pagination.pages} onClick={() => fetchLogs(pagination.page + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedLog && (
                <div className="admin-modal-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0, color: "#FFFFFF" }}>Audit Event: {selectedLog.action}</h3>
                                <span style={{ fontSize: "12px", color: "#94A3B8" }}>By: {selectedLog.adminEmail} ({selectedLog.ipAddress})</span>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedLog(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <pre style={{
                                background: "#0D0716",
                                padding: "14px",
                                borderRadius: "8px",
                                border: "1px solid rgba(168, 85, 247, 0.2)",
                                color: "#34D399",
                                fontSize: "12px",
                                overflowX: "auto",
                                maxHeight: "300px"
                            }}>
                                {JSON.stringify(selectedLog.details || {}, null, 2)}
                            </pre>
                        </div>
                        <div className="modal-footer">
                            <button className="admin-btn btn-secondary" onClick={() => setSelectedLog(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

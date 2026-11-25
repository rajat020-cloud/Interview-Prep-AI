import React, { useState, useEffect } from "react";
import { CreditCard, Check, Edit2, Shield, RefreshCw, Save } from "lucide-react";
import { getAdminPlans, updateAdminPlan } from "../services/admin.api";

export default function AdminPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await getAdminPlans();
            setPlans(data.plans || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSavePlan = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAdminPlan(editingPlan._id, editingPlan);
            setMessage("Subscription plan parameters updated successfully.");
            setEditingPlan(null);
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update plan.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>
                        <CreditCard size={26} color="#10B981" />
                        Monetization & Subscription Tiers
                    </h1>
                    <p>Manage candidate subscription plans, quota allocations, and feature access permissions</p>
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                {loading ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#A855F7" }}>
                        <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                        <p style={{ color: "#E9B8FF" }}>Loading subscription configurations...</p>
                    </div>
                ) : plans.map((plan) => (
                    <div
                        key={plan._id}
                        className="admin-card"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            border: plan.code === "premium" ? "1px solid rgba(217, 70, 239, 0.4)" : plan.code === "pro" ? "1px solid rgba(168, 85, 247, 0.4)" : "1px solid rgba(168, 85, 247, 0.16)",
                            position: "relative"
                        }}
                    >
                        {plan.code === "premium" && (
                            <div style={{
                                position: "absolute",
                                top: "-10px",
                                right: "20px",
                                background: "linear-gradient(135deg, #A855F7, #D946EF)",
                                color: "#FFFFFF",
                                fontSize: "10px",
                                fontWeight: 700,
                                padding: "3px 10px",
                                borderRadius: "12px",
                                letterSpacing: "1px"
                            }}>
                                FLAGSHIP TIER
                            </div>
                        )}

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                                <div>
                                    <h2 style={{ fontSize: "20px", color: "#FFFFFF", margin: 0 }}>{plan.name}</h2>
                                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>{plan.description}</span>
                                </div>
                                <button
                                    onClick={() => setEditingPlan(plan)}
                                    className="admin-btn btn-secondary btn-sm"
                                    title="Edit Quotas"
                                >
                                    <Edit2 size={13} />
                                    <span>Configure</span>
                                </button>
                            </div>

                            <div style={{ margin: "18px 0" }}>
                                <span style={{ fontSize: "36px", fontWeight: 800, color: "#FFFFFF" }}>${plan.price}</span>
                                <span style={{ color: "#94A3B8", fontSize: "13px" }}> / {plan.billingInterval}</span>
                            </div>

                            {/* Quota Highlights */}
                            <div style={{ background: "#21152E", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
                                <div style={{ fontSize: "11px", fontWeight: 700, color: "#E9B8FF", textTransform: "uppercase", marginBottom: "8px" }}>
                                    Monthly Quotas
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "#FFFFFF" }}>
                                    <div>⚡ Interview Reports: <strong>{plan.limits?.interviewGenerationsPerMonth === -1 ? "Unlimited" : plan.limits?.interviewGenerationsPerMonth}</strong></div>
                                    <div>🎙️ Mock Interviews: <strong>{plan.limits?.mockInterviewsPerMonth === -1 ? "Unlimited" : plan.limits?.mockInterviewsPerMonth}</strong></div>
                                    <div>📄 Resume Reviews: <strong>{plan.limits?.resumeOptimizationsPerMonth === -1 ? "Unlimited" : plan.limits?.resumeOptimizationsPerMonth}</strong></div>
                                </div>
                            </div>

                            {/* Features list */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                                {plan.features?.map((f, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#94A3B8" }}>
                                        <Check size={14} color="#10B981" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ borderTop: "1px solid rgba(168, 85, 247, 0.12)", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                            <span style={{ color: "#94A3B8" }}>Active Subscribers:</span>
                            <span style={{ color: "#E9B8FF", fontWeight: 700 }}>{plan.subscribersCount || 0} candidates</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT PLAN MODAL */}
            {editingPlan && (
                <div className="admin-modal-overlay" onClick={() => setEditingPlan(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
                        <div className="modal-header">
                            <h3 style={{ margin: 0, color: "#FFFFFF" }}>Configure {editingPlan.name} Plan</h3>
                            <button className="close-btn" onClick={() => setEditingPlan(null)}>✕</button>
                        </div>

                        <form onSubmit={handleSavePlan}>
                            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#E9B8FF", marginBottom: "6px" }}>Price ($ USD)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingPlan.price}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                                        style={{ width: "100%", padding: "10px", background: "#21152E", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "8px", color: "#FFFFFF" }}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", color: "#E9B8FF", marginBottom: "6px" }}>Interview Reports / mo</label>
                                        <input
                                            type="number"
                                            value={editingPlan.limits?.interviewGenerationsPerMonth}
                                            onChange={(e) => setEditingPlan({
                                                ...editingPlan,
                                                limits: { ...editingPlan.limits, interviewGenerationsPerMonth: Number(e.target.value) }
                                            })}
                                            style={{ width: "100%", padding: "10px", background: "#21152E", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "8px", color: "#FFFFFF" }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", color: "#E9B8FF", marginBottom: "6px" }}>Mock Interviews / mo</label>
                                        <input
                                            type="number"
                                            value={editingPlan.limits?.mockInterviewsPerMonth}
                                            onChange={(e) => setEditingPlan({
                                                ...editingPlan,
                                                limits: { ...editingPlan.limits, mockInterviewsPerMonth: Number(e.target.value) }
                                            })}
                                            style={{ width: "100%", padding: "10px", background: "#21152E", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "8px", color: "#FFFFFF" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="admin-btn btn-secondary" onClick={() => setEditingPlan(null)}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="admin-btn btn-primary">
                                    <Save size={14} />
                                    <span>{saving ? "Saving..." : "Save Parameters"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

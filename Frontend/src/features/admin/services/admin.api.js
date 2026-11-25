import axios from "axios";

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true
});

// Attach Authorization header if admin_token exists in localStorage
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Admin Authentication
export async function adminLogin({ email, password }) {
    const response = await adminApi.post("/api/admin/login", { email, password });
    if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
    }
    return response.data;
}

export async function adminGetMe() {
    const response = await adminApi.get("/api/admin/me");
    return response.data;
}

export async function adminLogout() {
    try {
        await adminApi.post("/api/admin/logout");
    } finally {
        localStorage.removeItem("admin_token");
    }
}

// Dashboard Analytics
export async function getAdminDashboard() {
    const response = await adminApi.get("/api/admin/dashboard");
    return response.data;
}

// Users Management
export async function getAdminUsers(params = {}) {
    const response = await adminApi.get("/api/admin/users", { params });
    return response.data;
}

export async function getAdminUserDetails(id) {
    const response = await adminApi.get(`/api/admin/users/${id}`);
    return response.data;
}

export async function toggleAdminUserStatus(id, status) {
    const response = await adminApi.patch(`/api/admin/users/${id}/status`, { status });
    return response.data;
}

export async function updateAdminUserRole(id, role, permissions = []) {
    const response = await adminApi.patch(`/api/admin/users/${id}/role`, { role, permissions });
    return response.data;
}

export async function updateAdminUserPlan(id, plan) {
    const response = await adminApi.patch(`/api/admin/users/${id}/plan`, { plan });
    return response.data;
}

export async function deleteAdminUser(id) {
    const response = await adminApi.delete(`/api/admin/users/${id}`);
    return response.data;
}

export function exportUsersCsvUrl() {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${base}/api/admin/users/export/csv`;
}

// Interviews & Mocks
export async function getAdminInterviews(params = {}) {
    const response = await adminApi.get("/api/admin/interviews", { params });
    return response.data;
}

export async function deleteAdminInterview(id) {
    const response = await adminApi.delete(`/api/admin/interviews/${id}`);
    return response.data;
}

export async function getAdminMockInterviews(params = {}) {
    const response = await adminApi.get("/api/admin/mock-interviews", { params });
    return response.data;
}

export async function deleteAdminMockInterview(id) {
    const response = await adminApi.delete(`/api/admin/mock-interviews/${id}`);
    return response.data;
}

// AI Engine
export async function getAdminAiMetrics() {
    const response = await adminApi.get("/api/admin/ai/metrics");
    return response.data;
}

export async function updateAdminAiConfig(config) {
    const response = await adminApi.patch("/api/admin/ai/config", config);
    return response.data;
}

// Plans
export async function getAdminPlans() {
    const response = await adminApi.get("/api/admin/plans");
    return response.data;
}

export async function updateAdminPlan(id, data) {
    const response = await adminApi.put(`/api/admin/plans/${id}`, data);
    return response.data;
}

// Support Tickets
export async function getAdminSupportTickets(params = {}) {
    const response = await adminApi.get("/api/admin/support", { params });
    return response.data;
}

export async function replyAdminSupportTicket(id, message, status) {
    const response = await adminApi.post(`/api/admin/support/${id}/reply`, { message, status });
    return response.data;
}

export async function updateAdminTicketStatus(id, status, resolutionNotes) {
    const response = await adminApi.patch(`/api/admin/support/${id}/status`, { status, resolutionNotes });
    return response.data;
}

// System Settings & Logs
export async function getAdminSystemSettings() {
    const response = await adminApi.get("/api/admin/settings");
    return response.data;
}

export async function updateAdminSystemSettings(settings) {
    const response = await adminApi.patch("/api/admin/settings", settings);
    return response.data;
}

export async function getAdminAuditLogs(params = {}) {
    const response = await adminApi.get("/api/admin/audit-logs", { params });
    return response.data;
}

export default adminApi;

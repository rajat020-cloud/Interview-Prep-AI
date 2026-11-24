import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true
})

export async function register({ username, email, password, fullName, targetRole }) {
    const response = await api.post('/api/auth/register', {
        username, email, password, fullName, targetRole
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email, password
    })
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}

export async function updateProfile({ fullName, targetRole, preferences }) {
    const response = await api.patch("/api/auth/profile", {
        fullName, targetRole, preferences
    })
    return response.data
}

export async function changePassword({ currentPassword, newPassword }) {
    const response = await api.patch("/api/auth/change-password", {
        currentPassword, newPassword
    })
    return response.data
}

export async function deleteAccount() {
    const response = await api.delete("/api/auth/account")
    return response.data
}

export default api

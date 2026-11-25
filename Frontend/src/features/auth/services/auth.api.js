import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => Promise.reject(error))

export async function register({ username, email, password, fullName, targetRole }) {
    const response = await api.post('/api/auth/register', {
        username, email, password, fullName, targetRole
    })
    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email, password
    })
    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } finally {
        localStorage.removeItem("token")
    }
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
    try {
        const response = await api.delete("/api/auth/account")
        return response.data
    } finally {
        localStorage.removeItem("token")
    }
}

export default api

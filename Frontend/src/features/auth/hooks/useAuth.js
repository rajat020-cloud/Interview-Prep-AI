import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe, updateProfile, changePassword, deleteAccount } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Check your credentials."
            return { success: false, error: msg }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password, fullName, targetRole }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password, fullName, targetRole })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed."
            return { success: false, error: msg }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout error:", err)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (profileData) => {
        try {
            const data = await updateProfile(profileData)
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Failed to update profile" }
        }
    }

    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        try {
            await changePassword({ currentPassword, newPassword })
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Password change failed" }
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount()
            setUser(null)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Account deletion failed" }
        }
    }

    useEffect(() => {
        let isMounted = true
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (isMounted && data?.user) {
                    setUser(data.user)
                }
            } catch (err) {
                // not logged in
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        getAndSetUser()
        return () => { isMounted = false }
    }, [])

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleUpdateProfile,
        handleChangePassword,
        handleDeleteAccount
    }
}

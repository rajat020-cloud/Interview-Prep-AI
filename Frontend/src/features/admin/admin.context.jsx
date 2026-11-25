import { createContext, useState, useEffect } from "react";
import { adminGetMe, adminLogin as apiLogin, adminLogout as apiLogout } from "./services/admin.api";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAdminSession = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) {
                setAdmin(null);
                setLoading(false);
                return;
            }

            try {
                const data = await adminGetMe();
                setAdmin(data.admin);
            } catch (err) {
                console.warn("Admin session invalid or expired:", err.message);
                localStorage.removeItem("admin_token");
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAdminSession();
    }, []);

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        setAdmin(data.admin);
        return data;
    };

    const logout = async () => {
        try {
            await apiLogout();
        } finally {
            setAdmin(null);
        }
    };

    return (
        <AdminContext.Provider value={{ admin, setAdmin, loading, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
}

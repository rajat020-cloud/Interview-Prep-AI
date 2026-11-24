import React from 'react'
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"
import { Loader2 } from 'lucide-react'

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0a0b14',
                color: '#8b5cf6',
                gap: '14px'
            }}>
                <Loader2 size={36} className="animate-spin" />
                <span style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'sans-serif' }}>
                    Authenticating session...
                </span>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/landing" replace />
    }

    return children
}

export default Protected

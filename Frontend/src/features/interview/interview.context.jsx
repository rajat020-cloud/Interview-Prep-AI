import { createContext, useState } from "react"

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [analytics, setAnalytics] = useState(null)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    return (
        <InterviewContext.Provider value={{
            loading, setLoading,
            report, setReport,
            reports, setReports,
            analytics, setAnalytics,
            notifications, setNotifications,
            unreadCount, setUnreadCount
        }}>
            {children}
        </InterviewContext.Provider>
    )
}

import { createBrowserRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Layout from "./components/Layout"
import Landing from "./features/interview/pages/Landing"
import Dashboard from "./features/interview/pages/Dashboard"
import CreateInterview from "./features/interview/pages/CreateInterview"
import Interview from "./features/interview/pages/Interview"
import MockInterview from "./features/interview/pages/MockInterview"
import CodingPractice from "./features/interview/pages/CodingPractice"
import ResumeBuilder from "./features/interview/pages/ResumeBuilder"
import InterviewHistory from "./features/interview/pages/InterviewHistory"
import Analytics from "./features/interview/pages/Analytics"
import Notifications from "./features/interview/pages/Notifications"
import Settings from "./features/interview/pages/Settings"

// Admin Suite Components & Pages
import AdminLogin from "./features/admin/pages/AdminLogin"
import AdminLayout from "./features/admin/components/AdminLayout"
import AdminProtected from "./features/admin/components/AdminProtected"
import AdminDashboard from "./features/admin/pages/AdminDashboard"
import AdminUsers from "./features/admin/pages/AdminUsers"
import AdminInterviews from "./features/admin/pages/AdminInterviews"
import AdminMockInterviews from "./features/admin/pages/AdminMockInterviews"
import AdminAiUsage from "./features/admin/pages/AdminAiUsage"
import AdminPlans from "./features/admin/pages/AdminPlans"
import AdminSupport from "./features/admin/pages/AdminSupport"
import AdminSettings from "./features/admin/pages/AdminSettings"
import AdminAuditLogs from "./features/admin/pages/AdminAuditLogs"

export const router = createBrowserRouter([
    {
        path: "/landing",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    // Admin Public Login
    {
        path: "/admin/login",
        element: <AdminLogin />
    },
    // Admin Protected Suite
    {
        path: "/admin",
        element: (
            <AdminProtected>
                <AdminLayout />
            </AdminProtected>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "users",
                element: <AdminUsers />
            },
            {
                path: "interviews",
                element: <AdminInterviews />
            },
            {
                path: "mock-interviews",
                element: <AdminMockInterviews />
            },
            {
                path: "ai-usage",
                element: <AdminAiUsage />
            },
            {
                path: "plans",
                element: <AdminPlans />
            },
            {
                path: "support",
                element: <AdminSupport />
            },
            {
                path: "settings",
                element: <AdminSettings />
            },
            {
                path: "audit-logs",
                element: <AdminAuditLogs />
            }
        ]
    },
    // Candidate Protected Suite
    {
        path: "/",
        element: <Protected><Layout /></Protected>,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "create-interview",
                element: <CreateInterview />
            },
            {
                path: "interview/:interviewId",
                element: <Interview />
            },
            {
                path: "mock-interview",
                element: <MockInterview />
            },
            {
                path: "coding-practice",
                element: <CodingPractice />
            },
            {
                path: "resume-builder",
                element: <ResumeBuilder />
            },
            {
                path: "interview-history",
                element: <InterviewHistory />
            },
            {
                path: "saved-questions",
                element: <InterviewHistory />
            },
            {
                path: "analytics",
                element: <Analytics />
            },
            {
                path: "notifications",
                element: <Notifications />
            },
            {
                path: "settings",
                element: <Settings />
            }
        ]
    }
])

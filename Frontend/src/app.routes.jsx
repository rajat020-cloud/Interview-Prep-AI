import { createBrowserRouter } from "react-router"
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

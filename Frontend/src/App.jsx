import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { AdminProvider } from "./features/admin/admin.context.jsx"

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App

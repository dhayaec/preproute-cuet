import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import RootLayout from '@/components/RootLayout'
import ProtectedLayout from '@/components/ProtectedLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import CreateTestPage from '@/pages/CreateTestPage'
import EditDetailsPage from '@/pages/EditDetailsPage'
import QuestionsPage from '@/pages/QuestionsPage'
import PreviewPublishPage from '@/pages/PreviewPublishPage'
import { isAuthenticated } from '@/shared/lib/auth'

function LoginGuard() {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />
}

const router = createBrowserRouter([
  {
    element: <LoginGuard />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'tests/create', element: <CreateTestPage /> },
          { path: 'tests/edit/:id?', element: <EditDetailsPage /> },
          { path: 'tests/questions', element: <QuestionsPage /> },
          { path: 'tests/preview', element: <PreviewPublishPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default router

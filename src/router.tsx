import { createBrowserRouter } from 'react-router'
import ProtectedLayout from '@/layout/protected-layout'
import SignIn from '@/pages/auth/sign-in'

const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <div>Home</div>,
      },
    ],
  },
])

export default router

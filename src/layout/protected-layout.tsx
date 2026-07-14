import { Outlet } from 'react-router'
import { useAuthGuard } from '@/hooks/use-auth-guard'

export default function ProtectedLayout() {
  useAuthGuard()

  return <Outlet />}

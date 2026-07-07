import { useStore } from '@nanostores/react'
import { $authUser } from '@/stores/auth-user'

export default function DashboardPage() {
  const authUser = useStore($authUser)

  console.log('authUser:', authUser)

  return <div>Dashboard Page</div>
}

import { Outlet } from 'react-router'

export default function DefaultLayout() {
  return (
    <div className="default-layout">
      <Outlet />
    </div>
  )
}

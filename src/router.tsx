import { Route, Routes } from 'react-router'
import MenuManagementPage from '@/pages/admin/menus/menu-management-page.tsx'
import AdminRolesPage from '@/pages/admin/roles/admin-roles-page.tsx'
import AdminUserPage from '@/pages/admin/users/users-page.tsx'
import AuthPage from '@/pages/auth/auth-page.tsx'
import DashboardPage from '@/pages/dashboard/dashboard-page'
import ServiceMonitoringPage from '@/pages/monitoring/service-monitoring/service-monitoring-page.tsx'
import NoticeCreatePage from '@/pages/notice/create/notice-create-page'
import NoticeDetailPage from '@/pages/notice/detail/notice-detail-page.tsx'
import NoticeEditPage from '@/pages/notice/edit/notice-edit-page.tsx'
import DefaultLayout from './layout/default-layout'
import MappingPage from './pages/admin/mapping/mapping-page'
import RoleCreatePage from './pages/admin/role/role-create-page'
import RoleDetailPage from './pages/admin/role/role-detail-page'
import APIGuidePage from './pages/api-service/api-guide/api-guide-page'
import ApiPlaygroundPage from './pages/api-service/api-playground/api-playground-page'
import DailyReportPage from './pages/monitoring/daily-report/daily-report-page'
import LoggingPage from './pages/monitoring/logging/logging-page'
import NoticePage from './pages/notice/notice-page'
import UserAccountPage from './pages/user/user-account-page'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route element={<DashboardPage />} index />
        <Route path="/api-service/guide/:serviceName" element={<APIGuidePage />} />
        <Route path="/api-service/playground/:serviceName" element={<ApiPlaygroundPage />} />
        <Route path="/monitoring/service" element={<ServiceMonitoringPage />} />
        <Route path="/monitoring/daily-report" element={<DailyReportPage />} />
        <Route path="/monitoring/logging" element={<LoggingPage />} />
        <Route path="/user/account" element={<UserAccountPage />} />
        <Route path="/admin/users" element={<AdminUserPage />} />
        <Route path="/admin/menus" element={<MenuManagementPage />} />
        <Route path="/admin/roles" element={<AdminRolesPage />} />
        <Route path="/admin/roles/mapping" element={<MappingPage />} />
        <Route path="/admin/roles/role-create" element={<RoleCreatePage />} />
        <Route path="/admin/roles/:roleId" element={<RoleDetailPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/create" element={<NoticeCreatePage />} />
        <Route path="/notice/detail/:id" element={<NoticeDetailPage />} />
        <Route path="/notice/edit/:id" element={<NoticeEditPage />} />
      </Route>
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  )
}

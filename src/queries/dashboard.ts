import { useQuery } from '@tanstack/react-query'
import { getApiStatusInDashboard, getDashboardNotices, getDashboardServices } from '@/api/dashboard.ts'
import { getMyMenus } from '@/api/menus.ts'

export function useGetDashboardNotices() {
  return useQuery({
    queryKey: ['get-dashboard-notices'],
    queryFn: getDashboardNotices,
    select: (data) => data.data.data,
  })
}

export function useGetMyMenus() {
  return useQuery({
    queryKey: ['get-my-menus'],
    queryFn: getMyMenus,
    select: (data) => data.data.data,
    //staleTime: 1000 * 60 * 60,
  })
}

export function useGetDashboardServices() {
  return useQuery({
    queryKey: ['get-dashboard-services'],
    queryFn: getDashboardServices,
    select: (data) => data.data.data,
  })
}

export function useGetApiStatusInDashboard() {
  return useQuery({
    queryKey: ['get-api-status-in-dashboard'],
    queryFn: getApiStatusInDashboard,
    select: (data) => data.data.data,
  })
}

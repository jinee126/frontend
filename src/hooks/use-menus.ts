import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllRolePermissions, updateRolePermissions } from '@/api/menu'

const ALL_ROLE_PERMISSIONS_KEY = ['admin', 'permissions', 'roles']

/**
 * 전체 Role 의 메뉴 권한 트리를 조회한다. (메뉴 관리 화면 진입점)
 */
export function useAllRolePermissions() {
  return useQuery({
    queryKey: ALL_ROLE_PERMISSIONS_KEY,
    queryFn: fetchAllRolePermissions,
  })
}

/**
 * Role 의 부여 권한 집합을 저장한다. 성공 시 전체 목록 쿼리를 무효화해 최신 상태로 갱신한다.
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, grantedPermissionIds }: { roleId: string; grantedPermissionIds: number[] }) =>
      updateRolePermissions(roleId, grantedPermissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_ROLE_PERMISSIONS_KEY })
    },
  })
}

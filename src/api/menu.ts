import { api } from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type { RolePermissionsByRole } from '@/types/menu'

/**
 * 전체 Role 에 대한 메뉴 권한 트리 목록.
 * (백엔드: GET /api/v1/admin/permissions/roles)
 */
export async function fetchAllRolePermissions(): Promise<RolePermissionsByRole[]> {
  const { data } = await api.get<ApiResponse<RolePermissionsByRole[]>>(
    '/api/v1/admin/permissions/roles',
  )
  return data.data
}

/**
 * role_name(Cognito 그룹명) 으로 단일 Role 의 메뉴 권한 트리 조회.
 * (백엔드: GET /api/v1/menus?roleName=ADMIN)
 */
export async function fetchMenusByRoleName(roleName: string): Promise<RolePermissionsByRole> {
  const { data } = await api.get<ApiResponse<RolePermissionsByRole>>('/api/v1/menus', {
    params: { roleName },
  })
  return data.data
}

/**
 * Role 의 부여 권한 집합을 통째로 교체(저장)한다.
 * (백엔드: PUT /api/v1/roles/{roleId}/permissions)
 */
export async function updateRolePermissions(
  roleId: string,
  grantedPermissionIds: number[],
): Promise<RolePermissionsByRole> {
  const { data } = await api.put<ApiResponse<RolePermissionsByRole>>(
    `/api/v1/roles/${roleId}/permissions`,
    { grantedPermissionIds },
  )
  return data.data
}

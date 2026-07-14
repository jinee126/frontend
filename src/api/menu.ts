import { api } from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  CreateMenuRequest,
  MenuNode,
  RolePermissionsByRole,
  UpdateMenuRequest,
} from '@/types/menu'

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

// ─── 메뉴 구성(구조) 관리 CRUD ──────────────────────────────

/** 전체 메뉴 트리 조회. (백엔드: GET /api/v1/admin/menus) */
export async function fetchMenuTree(): Promise<MenuNode[]> {
  const { data } = await api.get<ApiResponse<MenuNode[]>>('/api/v1/admin/menus')
  return data.data
}

/** 메뉴 생성. 성공 시 갱신된 전체 트리 반환. (백엔드: POST /api/v1/admin/menus) */
export async function createMenu(request: CreateMenuRequest): Promise<MenuNode[]> {
  const { data } = await api.post<ApiResponse<MenuNode[]>>('/api/v1/admin/menus', request)
  return data.data
}

/** 메뉴 수정. (백엔드: PUT /api/v1/admin/menus/{id}) */
export async function updateMenu(id: number, request: UpdateMenuRequest): Promise<MenuNode[]> {
  const { data } = await api.put<ApiResponse<MenuNode[]>>(`/api/v1/admin/menus/${id}`, request)
  return data.data
}

/** 메뉴 삭제. (백엔드: DELETE /api/v1/admin/menus/{id}) */
export async function deleteMenu(id: number): Promise<MenuNode[]> {
  const { data } = await api.delete<ApiResponse<MenuNode[]>>(`/api/v1/admin/menus/${id}`)
  return data.data
}

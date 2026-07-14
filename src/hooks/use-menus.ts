import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMenu,
  deleteMenu,
  fetchAllRolePermissions,
  fetchMenuTree,
  updateMenu,
  updateRolePermissions,
} from '@/api/menu'
import type { CreateMenuRequest, UpdateMenuRequest } from '@/types/menu'

const ALL_ROLE_PERMISSIONS_KEY = ['admin', 'permissions', 'roles']
const MENU_TREE_KEY = ['admin', 'menus']

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

/** 전체 메뉴 트리를 조회한다. (메뉴 관리 화면 진입점) */
export function useMenuTree() {
  return useQuery({
    queryKey: MENU_TREE_KEY,
    queryFn: fetchMenuTree,
  })
}

/**
 * 메뉴 생성/수정/삭제 뮤테이션. 메뉴 변경은 Role 별 권한 트리에도 영향을 주므로
 * 두 쿼리를 함께 무효화한다.
 */
export function useMenuMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: MENU_TREE_KEY })
    queryClient.invalidateQueries({ queryKey: ALL_ROLE_PERMISSIONS_KEY })
  }

  const create = useMutation({
    mutationFn: (request: CreateMenuRequest) => createMenu(request),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateMenuRequest }) =>
      updateMenu(id, request),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteMenu(id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}

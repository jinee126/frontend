// 백엔드 menu 도메인 DTO 대응 타입.
// (com.example.demo.menu.dto.* 와 1:1 매핑)

/** 메뉴에 정의된 액션 단위 권한과, 현재 Role 에게 부여(granted)되었는지 여부. */
export interface ActionDetail {
  permissionId: number
  permissionKey: string
  action: string
  description: string
  granted: boolean
}

/** Level 3 (리프) 메뉴. 실제 액션 권한이 이 레벨에 매핑된다. (Case A: 3-depth) */
export interface RoleLeafMenu {
  leafMenuId: number
  leafMenuKey: string
  leafMenuName: string
  path: string
  actions: ActionDetail[]
}

/**
 * Level 2 (서브) 메뉴.
 * - 자식(Level 3)이 있으면 actions 는 비고 leafMenus 에 채워진다.
 * - 자식이 없으면 본인이 leaf 역할을 하여 actions 에 채워지고 leafMenus 는 빈다.
 */
export interface RoleSubMenu {
  subMenuId: number
  subMenuKey: string
  subMenuName: string
  leafMenus: RoleLeafMenu[]
  path: string
  actions: ActionDetail[]
}

/** Level 1 (카테고리/root) 메뉴 그룹. */
export interface MenuCategoryGroup {
  menuId: number
  menuKey: string
  menuName: string
  subMenus: RoleSubMenu[]
}

/** Role 요약 정보. */
export interface RoleResponse {
  id: string
  roleName: string
  description: string
  userCount: number
}

/** 특정 Role 기준의 전체 메뉴 권한 트리 조회 결과. */
export interface RolePermissionsByRole {
  role: RoleResponse
  menus: MenuCategoryGroup[]
}

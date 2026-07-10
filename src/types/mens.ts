export type SideMenu = {
  menuId: number
  menuKey: string
  menuName: string
  link?: string
  subMenus?: SideSubMenu[]
}

export type SideSubMenu = SideMenu & { actions: MenuAction[] }

export type MyMenuResponse = {
  role: {
    id: string
    roleName: string
    description: string
    userCount: number
  }
  menus: MyMenu[]
}

export type MyMenu = {
  menuId: number
  menuKey: string
  menuName: string
  subMenus?: SubMenu[]
}

type SubMenu = {
  subMenuId: number
  subMenuKey: string
  subMenuName: string
  path?: string
  leafMenus?: LeafMenu[]
  actions: MenuAction[]
}

type LeafMenu = {
  leafMenuId: number
  leafMenuKey: string
  leafMenuName: string
  path?: string
  actions: MenuAction[]
}

type MenuAction = {
  action: PermissionType
  permissionId?: number
  granted: boolean
}

export type PermissionType = 'APPROVE' | 'READ' | 'CREATE' | 'UPDATE' | 'DELETE'

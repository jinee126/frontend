import {MyMenu, SideMenu, SideSubMenu} from "@/types/mens.ts";
import {$permissions} from "@/stores/permissions.ts";


export function makeMenu(menus: MyMenu[]): SideMenu[] {
    const flatMenus: SideSubMenu[] = makeMenuFlat(menus)
    $permissions.set(flatMenus)

    return (
        (menus
            .map((m) => ({
                menuId: m.menuId,
                menuName: m.menuName,
                menuKey: m.menuKey,
                subMenus: m.subMenus
                    ?.map((s) => {
                        const submenus = {
                            menuId: s.subMenuId,
                            menuName: s.subMenuName,
                            menuKey: s.subMenuKey,
                            link: s.path,
                            subMenus: s.leafMenus
                                ?.map((l) =>
                                    l.actions.find((a) => a.action === 'READ')?.granted
                                        ? {
                                              menuId: l.leafMenuId,
                                              menuName: l.leafMenuName,
                                              menuKey: l.leafMenuKey,
                                              link: l.path,
                                          }
                                        : null,
                                )
                                ?.filter(Boolean),
                        }
                        return submenus.subMenus?.length ||
                            s.actions.find((a) => a.action === 'READ')?.granted
                            ? submenus
                            : null
                    })
                    ?.filter(Boolean),
            }))
            .filter((m) => m.subMenus?.length) as SideMenu[]) || []
    )
}


function makeMenuFlat(menus: MyMenu[]) : SideSubMenu[]{
    return menus.flatMap((m) =>{
        return (
            m.subMenus?.flatMap((s) => {
                const r = {
                    menuId: s.menuId,
                    menuName: s.menuName,
                    menuKey: s.menuKey,
                    link: s.path,
                    action: s.actions,
                }
                const l = s.leafMenus?.map((l) => ({
                    menuId: l.menuId,
                    menuName: l.menuName,
                    menuKey: l.menuKey,
                    link: l.path,
                    action: l.actions,
                }))
                return l ? [...r, ...l] : r
            }) || []
        )
    })
}
import { Link } from 'react-router'
import type { SideMenu } from '@/types/mens'

type MenuItemProps = {
  menu: SideMenu
  isOpen: boolean
  onClickMenu: (menuKey: string) => void
}

// li에 sub-menu가 있을때 open
export default function MenuItem({ menu, isOpen, onClickMenu }: MenuItemProps) {
  const hasSubMenu = !!menu.subMenus?.length

  return (
    <li className={isOpen && hasSubMenu ? 'open' : ''} onClick={() => onClickMenu(isOpen ? '' : menu.menuKey)}>
      {menu.subMenus?.length ? (
        <span className="has-sub-menu nav-link">{menu.menuName}</span>
      ) : (
        <Link className="nav-link" to={menu.link || ''}>
          {menu.menuName}
        </Link>
      )}
      {hasSubMenu && (
        <ul className="sub-menu">
          {menu.subMenus?.map((sub) => (
            <li key={sub.menuName}>
              {sub.link ? (
                <Link className="sub-menu-text" to={sub.link} onClick={(e) => e.stopPropagation()}>
                  {sub.menuName}
                </Link>
              ) : (
                <p className="sub-menu-text no-link" onClick={(e) => e.stopPropagation()}>
                  {sub.menuName}
                </p>
              )}

              {/*SubMenu 안에 apiMenu가 있을때, SubMenu 접속시 해당 apiMenu만 노출(2depth 외 접었다 폈다 기능 없음) */}
              {sub.subMenus && (
                <ul className="api-menu">
                  {sub.subMenus?.map((leaf) => (
                    <li key={leaf.menuKey}>
                      {leaf.link ? (
                        <Link className="sub-menu-text" to={leaf.link} onClick={(e) => e.stopPropagation()}>
                          {leaf.menuName}
                        </Link>
                      ) : (
                        <p onClick={(e) => e.stopPropagation()}>{leaf.menuName}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

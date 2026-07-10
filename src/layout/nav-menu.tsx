import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import type { SideMenu } from '@/types/mens'
import MenuItem from './menu-item'

type NavMenuProps = {
  menuList: SideMenu[]
  isOpen: boolean
  onToggleNav: () => void
}

export default function NavMenu({ menuList, isOpen, onToggleNav }: NavMenuProps) {
  const [selectedMenu, setSelectedMenu] = useState('')
  return (
    <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
      <ul className="nav-ul">
        <li className="nav-btn-li">
          <h1>
            <Link to="/" title="home" />
          </h1>
          <Button className="icon menu" onClick={onToggleNav} />
        </li>
        {menuList.map((menu) => (
          <MenuItem
            key={menu.menuKey}
            menu={menu}
            isOpen={selectedMenu === menu.menuKey}
            onClickMenu={setSelectedMenu}
          />
        ))}
      </ul>
      <div className="flex-box pl-32 pr-32 pb-40 w100">
        <Button className="gray toggle-nav" onClick={onToggleNav}>
          사이드 메뉴 접기
        </Button>
      </div>
    </nav>
  )
}

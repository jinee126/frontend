import { Navigate, Outlet } from 'react-router'
import { $accessToken } from '@/stores/access-token'
import { getTokenExp, isTokenExpired } from '@/utils/common'
import {useEffect,useState} from 'react'
import {SideMenu} from "@/types/mens.ts";

export default function DefaultLayout() {
  const token = $accessToken.get()
  const exp = token ? getTokenExp(token) : null

  // 토큰이 없거나 만료됐으면 화면을 그리기 전에 로그인 페이지로 보낸다.
  if (!exp || isTokenExpired(exp)) {
    return <Navigate to="/login" replace />
  }

  const [isNavOpen,setIsNavOpen] = useState(true)
  const [menuList,setMenuList] useState<SideMenu[]>([])

  const toggleNav = () => setIsNavOpen((prev) => !prev)

  const {data:myMenus} = useGetMyMenus()

  useEffect(() => {
    setMenuList(makeMenu(myMenus?.mens || []))
  },[myMenus])

  return (
    <div className="default-layout">
      <Outlet />
    </div>
  )
}

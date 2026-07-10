import { useStore } from '@nanostores/react'
import { api } from '@/api/axios.ts'
import { $authUser } from '@/stores/auth-user.ts'
import type { ApiResponse } from '@/types/api.ts'
import type { MyMenuResponse } from '@/types/mens.ts'

const ENDPOINT = '/menus'

export function getMyMenus() {
  const authUser = useStore($authUser)
  const groupName = authUser?.authorityGroup ?? 'GUEST'
  console.log(groupName)

  return api.get<ApiResponse<MyMenuResponse>>(`${ENDPOINT}/${groupName}`)
}

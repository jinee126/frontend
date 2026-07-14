import type { AuthSession } from 'aws-amplify/auth'
import { persistentAtom } from '@nanostores/persistent'

export interface AuthUser {
  userName: string
  authorityGroup: string
  menuGroup: string
}

export const $authUser = persistentAtom<AuthUser | null>('authUser', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export function setAuthUserFromSession(session: AuthSession) {
  const payload = session.tokens?.idToken?.payload

  if (!payload) {
    $authUser.set(null)
    return
  }

  $authUser.set({
    userName: (payload['cognito:username'] as string) ?? '',
    authorityGroup: (payload['custom:authority_group'] as string) ?? '',
    menuGroup: (payload['custom:menu_group'] as string) ?? '',
  })
}

export function clearAuthUser() {
  $authUser.set(null)
}

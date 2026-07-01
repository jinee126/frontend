import type { AuthSession } from 'aws-amplify/auth'
import { atom } from 'nanostores'

export interface AuthUser {
  authorityGroup: string
  menuGroup: string
}

export const $authUser = atom<AuthUser | null>(null)

export function setAuthUserFromSession(session: AuthSession) {
  const payload = session.tokens?.idToken?.payload

  if (!payload) {
    $authUser.set(null)
    return
  }

  $authUser.set({
    authorityGroup: (payload['custom:authority_group'] as string) ?? '',
    menuGroup: (payload['custom:menu_group'] as string) ?? '',
  })
}

export function clearAuthUser() {
  $authUser.set(null)
}

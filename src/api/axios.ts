import axios, { type AxiosError } from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { $accessToken } from '@/stores/access-token'
import { clearAuthUser } from '@/stores/auth-user'
import type { ApiResponse } from '@/types/api'
import { signOutWithAmplify } from '@/api/amplify-auth'
import { isTokenExpired } from '@/utils/common'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// 로그아웃 처리 후 로그인 페이지로 이동시킨다.
async function forceSignOut() {
  await signOutWithAmplify(false)
  clearAuthUser()
  $accessToken.set(undefined)
  window.location.href = '/sign-in'
}

// Request interceptor
api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession()
  const exp = session.tokens?.idToken?.payload?.exp

  if (!exp || isTokenExpired(exp)) {
    await forceSignOut()
    return Promise.reject(new Error('토큰이 만료되었습니다.'))
  }

  const token = $accessToken.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 현재는 미사용 - accessToken 만료 시 재발급이 필요해지면 재사용 예정.
// fetchAuthSession({ forceRefresh: true })가 Amplify storage의 refreshToken으로 새 토큰을 발급받는다.
export async function refreshAccessToken(): Promise<string> {
  const session = await fetchAuthSession({ forceRefresh: true })
  const newAccessToken = session.tokens?.accessToken?.toString()
  if (!newAccessToken) {
    throw new Error('토큰 갱신에 실패했습니다.')
  }

  return newAccessToken
}

api.interceptors.response.use(
  (response) => response,
  // 서버 에러 응답 캐치 미들웨어
  async ({ response, config }: AxiosError<ApiResponse<null>>) => {
    // 401 = 인증 실패(만료/위변조 등) - 갱신 시도 없이 즉시 로그아웃
    if (response?.status === 401) {
      await forceSignOut()
      return
    }

    return Promise.reject({ response, config })
  },
)

import axios, { type AxiosError } from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { $accessToken } from '@/stores/access-token'
import { clearAuthUser } from '@/stores/auth-user'
import type { ApiResponse } from '@/types/api'
import { signOutWithAmplify } from '@/utils/amplify-auth'
import { isTokenExpired } from '@/utils/common'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

// Request interceptor
api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession()
  const exp = session.tokens?.idToken?.payload?.exp

  if (!exp || isTokenExpired(exp)) {
    await signOutWithAmplify(false)
    clearAuthUser()
    $accessToken.set(undefined)
    window.location.href = '/sign-in'
    return Promise.reject(new Error('토큰이 만료되었습니다.'))
  }

  const token = $accessToken.get()
  console.log('항상티겟지?' + token)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let tokenRefreshing: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
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
    if (response && config) {
      if (response.status === 401) {
        try {
          if (!tokenRefreshing) tokenRefreshing = refreshAccessToken()

          const newAccessToken = await tokenRefreshing
          $accessToken.set(newAccessToken)
          config.headers.Authorization = `Bearer ${newAccessToken}`
          tokenRefreshing = null

          return await api(config)
        } catch (refreshError) {
          // Cognito의 refreshToken까지 만료/무효화된 상태 - 더 이상 갱신 불가
          tokenRefreshing = null
          await signOutWithAmplify(false)
          $accessToken.set(undefined)
          // ⚠️ 기존 removeAuth()가 $accessToken 외에 다른 상태($isLocalLogin 등)도
          // 같이 정리했다면, 그 호출도 여기 같이 넣어야 할 - removeAuth() 구현 확인 필요
          window.location.href = '/intc/login'
          return
        }
      }
    }

    return Promise.reject({ response, config })
  },
)

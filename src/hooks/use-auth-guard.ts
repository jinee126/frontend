import { fetchAuthSession } from 'aws-amplify/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { clearAuthUser, setAuthUserFromSession } from '@/stores/auth-user'
import { isTokenExpired } from '@/utils/token-expired'

export function useAuthGuard() {
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await fetchAuthSession()
        const exp = session.tokens?.idToken?.payload?.exp

        if (!exp || isTokenExpired(exp)) {
          clearAuthUser()
          navigate('/sign-in')
          return
        }

        setAuthUserFromSession(session)
      } catch {
        clearAuthUser()
        navigate('/sign-in')
      }
    }

    checkSession()
  }, [navigate])
}

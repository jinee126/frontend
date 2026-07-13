import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { $accessToken } from '@/stores/access-token'
import { getTokenExp, isTokenExpired } from '@/utils/common'
import SignIn from '@/pages/auth/sign-in.tsx'

export default function AuthPage() {
    const navigate = useNavigate()
    const [isAuthChecked, setIsAuthChecked] = useState(false)

    // fetchAuthSession()의 자동 갱신을 쓰지 않고, 로그인 시 저장한 accessToken의
    // exp만 검사한다. 아직 유효하면 대시보드로 보내고, 만료/없음이면 로그인 폼을 보여준다.
    useEffect(() => {
        const token = $accessToken.get()
        const exp = token ? getTokenExp(token) : null

        if (exp && !isTokenExpired(exp)) {
            navigate('/') // ⚠️ 대시보드 경로, router.tsx 기준 재확인
            return
        }

        // 만료됐거나 토큰이 없으면 저장된 값을 비워 로그아웃 상태로 만든다.
        $accessToken.set(undefined)
        setIsAuthChecked(true)
    }, [navigate])

    if (!isAuthChecked) {
        return null
    }

    return (
        <div className="login-wrap">
            <div className="container">
                <h1 className="logo-img">API PORTAL</h1>
                <main className="content">
                    <SignIn />
                </main>
            </div>
        </div>
    )
}

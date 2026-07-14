import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $authUser } from '@/stores/auth-user'
import { api } from '@/api/axios'

export default function DashboardPage() {
  const authUser = useStore($authUser)
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  console.log('authUser:', authUser)

  // 백엔드(VITE_API_BASE_URL) 연동 확인용 테스트 호출
  async function handleTestClick() {
    setLoading(true)
    setResult('')
    try {
      const response = await api.get('/health')
      setResult(`성공: ${JSON.stringify(response.data)}`)
    } catch (error) {
      setResult(`실패: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>Dashboard Page</div>
      <button onClick={handleTestClick} disabled={loading}>
        {loading ? '요청 중...' : '백엔드 연동 테스트'}
      </button>
      {result && <pre>{result}</pre>}
    </div>
  )
}

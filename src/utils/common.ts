import classNames from 'classnames'

// 스타일 모듈에서 base 클래스와 추가 클래스를 조합한다.
export function resolveClasses(styles: Record<string, string>, base: string, extra = '') {
  return classNames(
    styles[base],
    ...extra
      .split(' ')
      .map((cls) => styles[cls])
      .filter(Boolean),
  )
}

// 토큰 만료 시간(exp, 초 단위)이 현재 시간을 지났는지 판단한다.
export function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000
}

// JWT payload에서 exp(초 단위)를 꺼낸다. 디코드 실패 시 null.
export function getTokenExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json).exp ?? null
  } catch {
    return null
  }
}

// 로그인 에러 객체를 사용자에게 보여줄 메시지로 변환한다.
export function getSignInErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.name) {
      case 'NotAuthorizedException':
        return '아이디 또는 비밀번호가 올바르지 않습니다.'
      case 'UserNotFoundException':
        return '존재하지 않는 사용자입니다.'
      case 'UserNotConfirmedException':
        return '이메일 인증이 완료되지 않은 계정입니다.'
      case 'TooManyRequestsException':
        return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
      default:
        return error.message || '로그인 중 오류가 발생했습니다.'
    }
  }
  return '알 수 없는 오류가 발생했습니다.'
}

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useAppForm } from '@/hooks/form'
import { signInSchema } from '@/schema/auth'
import { $accessToken } from '@/stores/access-token'
import { $alertModal } from '@/stores/alert-modal'
import { getSignInErrorMessage } from '@/utils/common'
import { $authUser, setAuthUserFromSession } from '@/stores/auth-user'
import { useSignIn } from '@/hooks/use-sign-in'
import { useSignOut } from '@/hooks/use-sign-out'

export default function SignIn() {
  const navigate = useNavigate()
  const { mutate: signIn } = useSignIn()
  const { mutate: signOut } = useSignOut()
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      userId: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: ({ value }) => {
      signIn(value, {
        onSuccess: ({ accessToken, session }) => {
          console.log('로그인 완료')
          $accessToken.set(accessToken)
          setAuthUserFromSession(session)
          navigate('/')
        },
        onError: (e) => {
          $alertModal.set({
            isOpen: true,
            message: getSignInErrorMessage(e),
          })
        },
      })
    },
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['get-my-menus'] })
  }, [queryClient.invalidateQueries])

  return (
    <>
      <h2 className="login-title">
        INTC Admin <span>Login</span>
      </h2>
      <p className="login-text">시스템 이용을 위해 아이디, 비밀번호를 입력해 주세요.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <label className="input-label" htmlFor="user-id">
          아이디
          <form.AppField name="userId">
            {(field) => (
              <field.Input
                value={field.state.value}
                handleChange={field.handleChange}
                placeholder="아이디(사번)를 입력해주세요"
                isErrorVisible={field.state.meta.isTouched || field.state.meta.isBlurred}
                errorMessage={field.state.meta.errors[0]?.message}
              />
            )}
          </form.AppField>
        </label>
        <label className="input-label" htmlFor="user-pw">
          비밀번호
          <form.AppField name="password">
            {(field) => (
              <field.Input
                value={field.state.value}
                handleChange={field.handleChange}
                type="password"
                placeholder="비밀번호를 입력해주세요"
                isErrorVisible={field.state.meta.isTouched || field.state.meta.isBlurred}
                errorMessage={field.state.meta.errors[0]?.message}
              />
            )}
          </form.AppField>
        </label>

        <div className="btn-wrap">
          <form.AppForm>
            <form.Button type="submit" className="pri">
              LOGIN
            </form.Button>
          </form.AppForm>
          {
            <button type="button" className="link-button" onClick={() => signOut(false)}>
              임시 로그아웃
            </button>
          }
        </div>
      </form>
    </>
  )
}

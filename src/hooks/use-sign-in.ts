import { useMutation } from '@tanstack/react-query'
import { signInWithAmplify } from '@/api/amplify-auth'

type SignInParams = {
  userId: string
  password: string
}

function signIn({ userId, password }: SignInParams) {
  return signInWithAmplify(userId, password)
}

export function useSignIn() {
  return useMutation({ mutationFn: signIn })
}

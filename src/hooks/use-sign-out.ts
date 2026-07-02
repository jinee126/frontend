import { useMutation } from '@tanstack/react-query'
import { signOutWithAmplify } from '@/api/amplify-auth'

export function useSignOut() {
  return useMutation({ mutationFn: signOutWithAmplify })
}

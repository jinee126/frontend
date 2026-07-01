import { persistentAtom } from '@nanostores/persistent'

export const $isLocalLogin = persistentAtom<boolean>('isLocalLogin', false, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

import { atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'

export const $accessToken = persistentAtom<string>('accessToken', '')

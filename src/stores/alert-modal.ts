import { atom } from 'nanostores'

type AlertModalState = {
  isOpen: boolean
  message: string
}

export const $alertModal = atom<AlertModalState>({
  isOpen: false,
  message: '',
})

import { atom } from 'nanostores'

type AlertModalState = {
  isOpen: boolean
  message: string
  onCloseAction?: () => void
  isConfirmModal?: boolean
}

export const $alertModal = atom<AlertModalState>({
  isOpen: false,
  message: '',
  onCloseAction: undefined,
  isConfirmModal: false,
})

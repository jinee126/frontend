import { useStore } from '@nanostores/react'
import styles from '@/components/popup.module.scss'
import Button from '@/components/ui/button.tsx'
import { $alertModal } from '@/stores/alert-modal.ts'

export default function AlertModal2() {
  const { isOpen, message, onCloseAction, isConfirmModal } = useStore($alertModal)

  function handleClose() {
    $alertModal.set({
      isOpen: false,
      message: '',
      onCloseAction: undefined,
      isConfirmModal: false,
    })
  }

  function handleClickButton() {
    if (onCloseAction) onCloseAction()
    handleClose()
  }

  if (isOpen)
    return (
      <div className={`${styles.popWrap} ${styles.active} ${styles.alert}`} onClick={handleClose} style={{ zIndex: 4 }}>
        <div className={styles.popContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.popCon}>
            <p className="tac">{message}</p>
          </div>

          <div className={styles.btnWrap}>
            <Button className="bk" onClick={handleClickButton}>
              확인
            </Button>
            {isConfirmModal && (
              <Button className="bdc" onClick={handleClose}>
                취소
              </Button>
            )}
          </div>
        </div>
      </div>
    )
}

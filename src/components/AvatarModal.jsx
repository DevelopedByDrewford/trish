import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './AvatarModal.module.css'

export default function AvatarModal({ src, alt, onClose }) {
  const [closing, setClosing] = useState(false)

  const requestClose = () => {
    setClosing(true)
    window.setTimeout(onClose, 180)
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div
      className={`${styles.overlay} ${closing ? styles.overlayOut : ''}`}
      onClick={requestClose}
    >
      <div
        className={`${styles.modal} ${closing ? styles.modalOut : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={alt ? `${alt} — full size` : 'Full size photo'}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={requestClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img className={styles.image} src={src} alt={alt || ''} />
      </div>
    </div>,
    document.body
  )
}

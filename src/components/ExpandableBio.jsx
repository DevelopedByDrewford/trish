import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './ExpandableBio.module.css'

export default function ExpandableBio({ bio }) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1)
  }, [bio])

  const requestClose = () => {
    setClosing(true)
    window.setTimeout(() => {
      setModalOpen(false)
      setClosing(false)
    }, 180)
  }

  useEffect(() => {
    if (!modalOpen) return

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
  }, [modalOpen])

  if (!bio) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.clampWrap}>
        <p ref={textRef} className={styles.bio}>
          {bio}
        </p>
        {isOverflowing && <div className={styles.fade} aria-hidden="true" />}
      </div>
      {isOverflowing && (
        <button
          type="button"
          className={styles.readMore}
          onClick={() => setModalOpen(true)}
        >
          Read More
        </button>
      )}

      {modalOpen &&
        createPortal(
          <div
            className={`${styles.overlay} ${closing ? styles.overlayOut : ''}`}
            onClick={requestClose}
          >
            <div
              className={`${styles.modal} ${closing ? styles.modalOut : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="Full bio"
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
              <p className={styles.fullBio}>{bio}</p>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

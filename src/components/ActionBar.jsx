import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './ActionBar.module.css'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

export default function ActionBar({ contactEmail }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const formRef = useRef(null)

  const requestClose = () => {
    setClosing(true)
    window.setTimeout(() => {
      setModalOpen(false)
      setClosing(false)
      setStatus('idle')
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!FORMSPREE_ENDPOINT) {
      console.error(
        'VITE_FORMSPREE_ENDPOINT is not set. Create a Formspree form at https://formspree.io pointed at ' +
          contactEmail +
          ' and add its endpoint to .env — see README.md.'
      )
      setStatus('error')
      return
    }

    setStatus('sending')
    const formData = new FormData(formRef.current)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setStatus('success')
        formRef.current.reset()
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('Failed to submit contact form:', err)
      setStatus('error')
    }
  }

  return (
    <div className={styles.actionBar}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setModalOpen(true)}
      >
        Email Trish
      </button>

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
              aria-label="Contact form"
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

              <h2 className={styles.modalTitle}>Email Trish</h2>
              <p className={styles.modalSubtitle}>
                This sends directly to {contactEmail}.
              </p>

              {status === 'success' ? (
                <p className={styles.successMessage}>
                  Message sent — Trish will get back to you soon.
                </p>
              ) : (
                <form
                  ref={formRef}
                  className={styles.form}
                  onSubmit={handleSubmit}
                >
                  <label className={styles.label} htmlFor="contact-name">
                    Name &amp; how to reach you
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className={styles.input}
                  />

                  <label className={styles.label} htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    className={styles.input}
                  />

                  <label className={styles.label} htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className={styles.textarea}
                  />

                  {status === 'error' && (
                    <p className={styles.errorMessage}>
                      Something went wrong sending your message. Please try
                      again, or email {contactEmail} directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

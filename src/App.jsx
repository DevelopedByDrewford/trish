import { useState } from 'react'
import config from './data/siteConfig'
import IconRow from './components/IconRow'
import ExpandableBio from './components/ExpandableBio'
import ActionBar from './components/ActionBar'
import PhotoWidget from './components/PhotoWidget'
import AvatarModal from './components/AvatarModal'
import InlineLink from './components/InlineLink'
import styles from './styles/App.module.css'

// Full-size avatar modal is wired up below but temporarily inert — flip
// this back to true once the avatar is worth clicking into (e.g. once it's
// a real headshot rather than the logo icon).
const AVATAR_MODAL_ENABLED = false

export default function App() {
  const [avatarOpen, setAvatarOpen] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button
          type="button"
          className={`${styles.avatarButton} ${
            AVATAR_MODAL_ENABLED ? '' : styles.avatarButtonInactive
          }`}
          onClick={AVATAR_MODAL_ENABLED ? () => setAvatarOpen(true) : undefined}
          aria-label={
            AVATAR_MODAL_ENABLED
              ? `View full-size photo of ${config.name}`
              : undefined
          }
          aria-hidden={!AVATAR_MODAL_ENABLED}
          tabIndex={AVATAR_MODAL_ENABLED ? 0 : -1}
        >
          <img
            src={config.avatarUrl}
            alt={config.name}
            className={styles.avatar}
          />
        </button>

        <h1 className={styles.name}>{config.name}</h1>
        <p className={styles.businessName}>{config.businessName}</p>

        <IconRow services={config.services} />

        <ExpandableBio bio={config.bio} />

        <ActionBar contactEmail={config.contactEmail} />

        <div className={styles.photoWidgetWrap}>
          <PhotoWidget photos={config.photos} />
        </div>

        <footer className={styles.footer}>
          <InlineLink href={`mailto:${config.contactEmail}`}>
            <span className={styles.footerText}>
              © 2026 {config.businessName}
            </span>
          </InlineLink>
        </footer>
      </div>

      {avatarOpen && (
        <AvatarModal
          src={config.avatarUrl}
          alt={config.name}
          onClose={() => setAvatarOpen(false)}
        />
      )}
    </div>
  )
}

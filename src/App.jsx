import { useState } from 'react'
import { useSiteConfig } from './hooks/useSiteConfig'
import IconRow from './components/IconRow'
import ExpandableBio from './components/ExpandableBio'
import ActionBar from './components/ActionBar'
import PhotoWidget from './components/PhotoWidget'
import AvatarModal from './components/AvatarModal'
import InlineLink from './components/InlineLink'
import styles from './styles/App.module.css'

export default function App() {
  const { config } = useSiteConfig()
  const [avatarOpen, setAvatarOpen] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => setAvatarOpen(true)}
          aria-label={`View full-size photo of ${config.name}`}
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

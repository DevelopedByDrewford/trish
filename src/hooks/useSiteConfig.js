import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import defaultConfig from '../data/defaultConfig'

// Subscribes to the config/site Firestore document and merges it over the
// local defaults so any field Trish hasn't set yet still has a sane fallback.
// Returns { config, loading, error }. If Firebase isn't configured, resolves
// immediately with the local defaults.
export function useSiteConfig() {
  const [config, setConfig] = useState(defaultConfig)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return
    }

    const ref = doc(db, 'config', 'site')
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setConfig({ ...defaultConfig, ...snapshot.data() })
        }
        setLoading(false)
      },
      (err) => {
        console.error('Failed to load site config from Firestore:', err)
        setError(err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  return { config, loading, error }
}

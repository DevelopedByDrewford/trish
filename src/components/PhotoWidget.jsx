import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './PhotoWidget.module.css'

const ADVANCE_MS = 4500
const SWIPE_THRESHOLD_PX = 40
const KEN_BURNS_VARIANTS = [
  styles.kenBurns1,
  styles.kenBurns2,
  styles.kenBurns3,
  styles.kenBurns4,
]

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function PhotoWidget({ photos = [] }) {
  const slides = useMemo(() => shuffle(photos), [photos])
  const [index, setIndex] = useState(0)
  const [firstImageLoaded, setFirstImageLoaded] = useState(false)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const timerRef = useRef(null)

  // Preload every slide up front so crossfades never show a blank frame.
  useEffect(() => {
    slides.forEach((photo, i) => {
      const img = new Image()
      if (i === 0) {
        img.onload = () => setFirstImageLoaded(true)
        img.onerror = () => setFirstImageLoaded(true)
      }
      img.src = photo.src
    })
  }, [slides])

  useEffect(() => {
    if (paused || slides.length <= 1) return undefined

    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, ADVANCE_MS)

    return () => window.clearInterval(timerRef.current)
  }, [paused, slides.length])

  if (!slides.length) return null

  const goTo = (next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      goTo(index + (delta < 0 ? 1 : -1))
    }
    touchStartX.current = null
  }

  return (
    <div
      className={styles.widget}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="group"
      aria-label="Photo slideshow"
    >
      {!firstImageLoaded && <div className={styles.skeleton} aria-hidden="true" />}

      {slides.map((photo, i) => (
        <div
          key={photo.src}
          className={`${styles.slide} ${i === index ? styles.slideActive : ''}`}
          aria-hidden={i !== index}
        >
          <img
            src={photo.src}
            alt={photo.alt || ''}
            className={`${styles.image} ${
              i === index ? KEN_BURNS_VARIANTS[i % KEN_BURNS_VARIANTS.length] : ''
            }`}
            draggable={false}
          />
          {photo.alt && i === index && (
            <span className={styles.caption}>{photo.alt}</span>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Slide navigation">
          {slides.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

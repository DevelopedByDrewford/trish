import styles from './IconRow.module.css'

// Renders the services list as a two-column bulleted list, ordered
// column-first so "+ more" always lands as the last entry (bottom of the
// second column). Named IconRow to mirror the reference project's
// component, though here it renders a bulleted list rather than icon links.
export default function IconRow({ services = [] }) {
  if (!services.length) return null

  const rows = Math.ceil((services.length + 1) / 2)

  return (
    <ul
      className={styles.list}
      style={{ '--rows': rows }}
      aria-label="Services offered"
    >
      {services.map((service) => (
        <li key={service} className={styles.item}>
          {service}
        </li>
      ))}
      <li className={`${styles.item} ${styles.more}`}>+ more</li>
    </ul>
  )
}

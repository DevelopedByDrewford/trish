import styles from './IconRow.module.css'

// Renders the services list as a row of pill badges. Named IconRow to mirror
// the reference project's component, though here it renders text pills
// rather than icon links.
export default function IconRow({ services = [] }) {
  if (!services.length) return null

  return (
    <ul className={styles.row} aria-label="Services offered">
      {services.map((service) => (
        <li key={service} className={styles.pill}>
          {service}
        </li>
      ))}
      <li className={`${styles.pill} ${styles.more}`}>+ more</li>
    </ul>
  )
}

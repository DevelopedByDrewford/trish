import styles from './IconRow.module.css'

// Renders the services list as a stack of full-width bars. Named IconRow to
// mirror the reference project's component, though here it renders text
// bars rather than icon links.
export default function IconRow({ services = [] }) {
  if (!services.length) return null

  return (
    <ul className={styles.list} aria-label="Services offered">
      {services.map((service) => (
        <li key={service} className={styles.bar}>
          <span>{service}</span>
        </li>
      ))}
      <li className={styles.more}>+ more</li>
    </ul>
  )
}

import styles from './InlineLink.module.css'

export default function InlineLink({ href, children, ...props }) {
  return (
    <a
      className={styles.link}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    >
      {children}
    </a>
  )
}

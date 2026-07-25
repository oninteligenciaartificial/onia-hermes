import styles from "./ghost-cursor.module.css";

/**
 * Cursor fantasma de las escenas didacticas (el "dedo" que demuestra el
 * producto). Solo el dibujo: la posicion la anima la escena via transform.
 */
export function GhostCursor() {
  return (
    <svg
      className={styles.cursor}
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 2l14.5 10.2-6.6 1.3 3.8 7.1-3.2 1.6-3.7-7.2L3 19.4V2z"
        fill="var(--ink)"
        stroke="var(--surface)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

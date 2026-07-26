import styles from "./brand-wordmark.module.css";

/**
 * Wordmark "onia" — placeholder de marca (web-factory/docs/ONIA_BRAND_IDENTITY_2026.md §4,
 * variante "led").
 *
 * Es el MISMO dibujo que `public/brand/wordmark-a.svg`, inlineado para que
 * siga el toggle manual de tema (`data-theme`): la tinta usa `currentColor`
 * y el led usa `var(--accent)` — un SVG referenciado por <img> solo puede
 * reaccionar a `prefers-color-scheme`, no al toggle.
 *
 * CONTRATO DE SWAP (ONIA_BRAND_IDENTITY_2026.md §4.1): cuando Sergio pase SU logo,
 * se guarda en `public/brand/logo.svg` y este componente pasa a
 * `<img src="/brand/logo.svg" ... />` (o se actualiza el path aca).
 * Nada mas del sitio cambia.
 */
export function BrandWordmark({ height = 26 }: { height?: number }) {
  return (
    <svg
      viewBox="0 0 360 164"
      height={height}
      width={(height * 360) / 164}
      role="img"
      aria-label="onia"
      className={styles.wordmark}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      >
        <circle cx="64" cy="100" r="32" />
        <path d="M136 132 V92 A24 24 0 0 1 184 92 V132" />
        <path d="M224 132 V68" />
        <circle cx="296" cy="100" r="32" />
        <path d="M328 68 V132" />
      </g>
      <rect className={styles.led} x="214" y="24" width="20" height="20" rx="2" />
    </svg>
  );
}

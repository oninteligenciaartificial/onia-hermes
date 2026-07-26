import styles from "./brand-wordmark.module.css";

/**
 * Logo onia v1 — candidato C aprobado por Sergio (2026-07-26).
 * Fuente de verdad del dibujo: `public/brand/logo.svg` (mismo arte, mismo
 * viewBox). Espec: web-factory/docs/ONIA_LOGO_SPEC_20260726.md.
 *
 * Va INLINEADO (no `<img src="/brand/logo.svg">`) para que la tinta siga el
 * toggle manual de tema (`data-theme`) via `currentColor` — un SVG externo
 * solo reacciona a `prefers-color-scheme`.
 *
 * El cursor verde usa el verde PROPIO del logo (#3EA639, autocontenido en
 * `.cursor` del module.css). NO es token de UI (ONIA_BRAND_IDENTITY_2026.md
 * §1.4): el verde del sistema sigue siendo la escala esmeralda.
 */
export function BrandWordmark({ height = 26 }: { height?: number }) {
  return (
    <svg
      viewBox="0 0 352 116"
      height={height}
      width={(height * 352) / 116}
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
        <circle cx="40" cy="76" r="32" />
        <path d="M112 108 V68 A24 24 0 0 1 160 68 V108" />
        <path d="M200 108 V44" />
        <circle cx="272" cy="76" r="32" />
        <path d="M304 44 V108" />
      </g>
      <circle fill="currentColor" cx="200" cy="10" r="10" />
      <rect className={styles.cursor} x="332" y="96" width="20" height="20" rx="2" />
    </svg>
  );
}

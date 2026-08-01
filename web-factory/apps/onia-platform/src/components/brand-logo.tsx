import styles from "./brand-logo.module.css";

/**
 * Wordmark Onia v2 — sirve el SVG real de marca, no un dibujo en codigo.
 *
 * Fuente de verdad de los assets: `public/brand/v2/`.
 * Regla de color (ONIA_MARCA_ESTRATEGIA_20260727.md §4-bis):
 *   fondo claro  -> `onia-logo.svg`      (wordmark tinta #12100E + punto verde)
 *   fondo oscuro -> `onia-logo-dark.svg` (wordmark claro #F4F6F4 + punto verde)
 * El wordmark es de UN solo color y el punto siempre queda verde; por eso los
 * colores viven DENTRO del archivo y no se recolorean por CSS.
 *
 * Por que dos <img> y no uno solo: los SVG externos no heredan `currentColor`,
 * y el sitio tiene toggle manual (`data-theme` en <html>) ademas de
 * `prefers-color-scheme`. El intercambio se hace por CSS (`display`), asi la
 * variante oculta no queda expuesta a lectores de pantalla.
 *
 * Sin salto de tamano entre temas: las dos variantes comparten viewBox y se
 * pintan con el MISMO alto y ancho calculados aca.
 */

/** Relacion del viewBox de los assets v2 (1898.3 / 763). */
const RATIO = 2.4879;

const SRC_LIGHT_BG = "/brand/v2/onia-logo.svg";
const SRC_DARK_BG = "/brand/v2/onia-logo-dark.svg";

interface BrandLogoProps {
  /** Alto en px del wordmark. El ancho se deriva del viewBox. */
  height?: number;
  /** Texto alternativo. Vacio cuando el enlace que lo envuelve ya tiene nombre. */
  alt?: string;
}

export function BrandLogo({ height = 26, alt = "Onia" }: BrandLogoProps) {
  const width = Math.round(height * RATIO);
  const box = { height, width } as const;

  return (
    <span className={styles.logo} style={box}>
      <img
        className={`${styles.img} ${styles.onLight}`}
        src={SRC_LIGHT_BG}
        alt={alt}
        width={width}
        height={height}
        style={box}
      />
      <img
        className={`${styles.img} ${styles.onDark}`}
        src={SRC_DARK_BG}
        alt={alt}
        width={width}
        height={height}
        style={box}
      />
    </span>
  );
}

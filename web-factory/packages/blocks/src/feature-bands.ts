import { escapeAttribute, escapeHtml } from "./escape";

/**
 * feature-bands — cada feature "posee" una banda de color plena.
 *
 * T4 del catálogo (`docs/WEB_FACTORY_TECNICAS_2026.md`), anclada en 4 sitios
 * (readily con pollen/sky/meadow, leoff con banda full-bleed por sección,
 * farmminerals con statement en verde sólido, greptile alternando oscura↔clara)
 * y parte del "piso de toda web de cliente". Lo que logra: el scroll se siente
 * como capítulos y no como una parrilla, con cero decoración.
 *
 * Dos decisiones que hace el código, no el comentario:
 *
 *  - **La banda es un tinte del token de marca, no un hex de paleta.** El
 *    catálogo nombra hues concretos (pollen, sky, meadow) porque describe UN
 *    sitio; acá el mismo bloque lo usan 11 fichas de cliente con marcas
 *    distintas. Cada tono sale de `color-mix()` sobre `--color-primary` /
 *    `--color-accent` / `--color-secondary`, así que la banda es de la marca del
 *    cliente y —por la sustitución perezosa de `var()`— se recalcula sola en el
 *    scope oscuro, igual que `--card` y `--muted` en @onia/tokens. Un hex
 *    quemado acá sería un color que no cambia con el tema: el mismo bug que W1
 *    encontró en los charts.
 *
 *  - **El lado se alterna con `order`, no reordenando el DOM.** El orden de
 *    lectura es SIEMPRE texto → imagen (quien usa lector de pantalla escucha el
 *    título antes que "imagen de…"); el zigzag visual lo hace CSS en las bandas
 *    pares. Alternar en el HTML daría el mismo dibujo y rompería la lectura.
 *
 * Contraste: las bandas tintadas no tocan el color de texto —son un 12-16% de
 * marca sobre el fondo, así que `--color-fg` sigue midiendo contra casi el mismo
 * fondo— y la banda `solido`, que sí pinta la marca a pleno, cambia el PAR
 * completo a `--color-on-primary`, que @onia/tokens calcula legible y reajusta
 * en oscuro. Cambiar solo el fondo es como se fabrica un botón invisible.
 */

/** Qué token tiñe la banda. `solido` pinta la marca a pleno. */
export type BandTono = "primary" | "accent" | "secondary" | "neutral" | "solido";

export type FeatureBandMedia = {
  src: string;
  /** Obligatorio: una imagen de feature sin alt es contenido perdido, no decoración. */
  alt: string;
  width?: number;
  height?: number;
};

export type FeatureBand = {
  title: string;
  copy?: string;
  /** Etiqueta corta arriba del título ("evidencia", "cambio"…). */
  eyebrow?: string;
  bullets?: ReadonlyArray<string>;
  media?: FeatureBandMedia;
  /** Sin tono, se cicla por índice para que el cliente tenga capítulos gratis. */
  tono?: BandTono;
};

export type FeatureBandsProps = {
  items: ReadonlyArray<FeatureBand>;
  /** Nombre accesible de la región. */
  label?: string;
  id?: string;
};

/**
 * Ciclo por defecto. Arranca en primary (la banda que más se ve es la de marca)
 * y mete `neutral` cada 4 para que la página respire: cuatro bandas teñidas
 * seguidas cansan y ninguna resalta.
 */
const CICLO: ReadonlyArray<BandTono> = ["primary", "accent", "secondary", "neutral"];

export function renderFeatureBands({ items, label, id = "bandas" }: FeatureBandsProps): string {
  const clean = items.filter((item) => item.title.trim().length > 0);
  if (clean.length === 0) return "";

  const bandas = clean
    .map((item, index) => {
      const tono = item.tono ?? CICLO[index % CICLO.length];
      const eyebrow = item.eyebrow?.trim()
        ? `<p class="wf-band-eyebrow">${escapeHtml(item.eyebrow.trim())}</p>`
        : "";
      const copy = item.copy?.trim()
        ? `<p class="wf-band-copy">${escapeHtml(item.copy.trim())}</p>`
        : "";
      const puntos = (item.bullets ?? []).map((b) => b.trim()).filter(Boolean);
      const bullets = puntos.length
        ? `<ul class="wf-band-bullets">${puntos.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";
      // Sin media la banda no emite un <figure> vacío: la columna de texto ocupa
      // todo el ancho (una sola columna en el grid), no media caja fantasma.
      const media = item.media
        ? `<figure class="wf-band-media">
            <img src="${escapeAttribute(item.media.src)}" alt="${escapeAttribute(item.media.alt)}"${
              item.media.width ? ` width="${item.media.width}"` : ""
            }${item.media.height ? ` height="${item.media.height}"` : ""} loading="lazy" decoding="async">
          </figure>`
        : "";

      return `<article class="wf-band wf-band--${tono}${item.media ? "" : " wf-band--sin-media"}">
        <div class="wf-band-inner">
          <div class="wf-band-text">
            ${eyebrow}
            <h3 class="wf-band-title">${escapeHtml(item.title.trim())}</h3>
            ${copy}
            ${bullets}
          </div>
          ${media}
        </div>
      </article>`;
    })
    .join("");

  return `
    <section class="wf-bands" id="${escapeAttribute(id)}" aria-label="${escapeAttribute(label?.trim() || "Qué hace el sistema")}">
      ${bandas}
    </section>
  `;
}

/**
 * Estilos solo con tokens: ningún color literal, así las bandas son de la marca
 * del cliente y se recalculan en el scope oscuro que emite @onia/tokens.
 * Nota: sin backticks en los comentarios -- esto vive dentro de un template
 * literal y uno suelto corta la hoja a la mitad.
 */
export const FEATURE_BANDS_CSS = `
.wf-bands {
  display: block;
}

.wf-band {
  /* Full-bleed real: la banda pinta de borde a borde aunque el template la
     ponga dentro de un contenedor con ancho maximo. Sin esto la tecnica no
     existe -- una banda con margenes es una tarjeta. */
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  padding-block: clamp(56px, 8vw, 112px);
  background: var(--wf-band-surface);
  color: var(--wf-band-fg, var(--color-fg));
}

.wf-band--primary {
  --wf-band-surface: color-mix(in oklab, var(--color-primary) 14%, var(--color-bg));
}

.wf-band--accent {
  --wf-band-surface: color-mix(in oklab, var(--color-accent) 16%, var(--color-bg));
}

.wf-band--secondary {
  --wf-band-surface: color-mix(in oklab, var(--color-secondary) 12%, var(--color-bg));
}

.wf-band--neutral {
  --wf-band-surface: var(--color-bg);
}

/* La unica banda que pinta la marca a pleno cambia el PAR completo: fondo
   primary + texto on-primary, que @onia/tokens calcula legible y reajusta en
   oscuro. Cambiar solo el fondo fabrica texto invisible. */
.wf-band--solido {
  --wf-band-surface: var(--color-primary);
  --wf-band-fg: var(--color-on-primary);
}

.wf-band-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
  width: min(1120px, 100% - clamp(32px, 6vw, 96px));
  margin-inline: auto;
}

.wf-band-eyebrow {
  margin: 0 0 12px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, currentColor 68%, transparent);
}

.wf-band-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 3rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.wf-band-copy {
  margin: 16px 0 0;
  max-width: 52ch;
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.4vw, 1.125rem);
  line-height: 1.6;
  color: color-mix(in srgb, currentColor 82%, transparent);
}

.wf-band-bullets {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  font-family: var(--font-body);
  line-height: 1.5;
}

.wf-band-bullets li {
  position: relative;
  padding-inline-start: 22px;
}

.wf-band-bullets li::before {
  content: "";
  position: absolute;
  inset-block-start: 0.55em;
  inset-inline-start: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.wf-band-media {
  margin: 0;
}

.wf-band-media img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: calc(var(--radius, 0.75rem) * 1.5);
}

@media (min-width: 860px) {
  .wf-band-inner {
    grid-template-columns: 1fr 1fr;
  }

  .wf-band--sin-media .wf-band-inner {
    grid-template-columns: 1fr;
  }

  /* El zigzag: en las bandas pares la imagen pasa a la izquierda SIN tocar el
     DOM, que sigue siendo titulo -> copy -> imagen para quien lee o escucha. */
  .wf-band:nth-child(even) .wf-band-text {
    order: 2;
  }

  .wf-band:nth-child(even) .wf-band-media {
    order: 1;
  }
}
`.trim();

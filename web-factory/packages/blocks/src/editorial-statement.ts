import { escapeAttribute, escapeHtml } from "./escape";

/**
 * editorial-statement — one oversized line that reframes the rubro.
 *
 * Learned from 2 models (find-realestate-editorial · lecercle-realestate), both
 * `job: trust`, `layout: centered`. Cheap to produce and it lifts the tone of the
 * whole page: it is the scale-contrast beat between the hero and the offer.
 *
 * `pantalla: true` turns the same beat into the catalogue's T9 (statement
 * pantalla-completa): `min-height:100svh`, a full-bleed section surface and an
 * optional CTA — "cortar la densidad con una pantalla de un solo pensamiento".
 * It is a VARIANT and not a second block on purpose: T9 shares the label, the
 * measure, the display scale, the accent and the reveal with this one; only the
 * frame around them changes.
 *
 * Motion (verbatim from the models, not invented):
 *   entrance "fade + rise (y 28 -> 0)" · trigger in-view · easing [0.22, 1, 0.36, 1]
 *   duration 0.7s · stagger 0 · no scroll-link · no hover · reduced: static, fully visible
 * Mapped to the toolkit as `wf-reveal` (motion.ts owns the easing + the
 * prefers-reduced-motion fallback). T9 also asks for "reveal por líneas": the
 * lines are the ones the author DECLARES with a newline, cascading with
 * `wf-stagger` — never the wrap points, which move with the viewport and cannot
 * be staggered without shipping a text splitter.
 */

/** Section surface. Anything but `base` paints, so it also goes full-bleed. */
export type EditorialStatementFondo = "base" | "marca" | "tinta";

export type EditorialStatementProps = {
  /**
   * The statement itself. One sentence — this block is a single beat.
   * A newline declares a line break: each line reveals on its own beat.
   */
  statement: string;
  /** Lowercase section label above the line (typography treatment of the models). */
  label?: string;
  /**
   * Closing clause rendered in the brand color: the turn of the sentence, so the
   * accent means something instead of decorating. Plain text — never markup.
   */
  accent?: string;
  /** T9: the statement takes a whole screen (`min-height:100svh`, centred). */
  pantalla?: boolean;
  /** Section surface: neutral (default), tinted with the brand, or solid brand. */
  fondo?: EditorialStatementFondo;
  /** The one action the full-screen beat offers. Both fields, or no button. */
  cta?: { label: string; url: string };
};

export function renderEditorialStatement({
  statement,
  label,
  accent,
  pantalla = false,
  fondo = "base",
  cta,
}: EditorialStatementProps): string {
  const line = statement.trim();
  if (!line) return "";

  const eyebrow = label?.trim()
    ? `<p class="wf-statement-label">${escapeHtml(label.trim())}</p>`
    : "";
  const turn = accent?.trim()
    ? ` <em class="wf-statement-accent">${escapeHtml(accent.trim())}</em>`
    : "";

  // Declared lines, not wrapped ones: the author writes the rhythm of the beat.
  const lineas = line
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const lines = lineas
    .map(
      (l, i) =>
        `<span class="wf-statement-l">${escapeHtml(l)}${i === lineas.length - 1 ? turn : ""}</span>`,
    )
    .join("");

  const boton =
    cta?.label.trim() && cta.url.trim()
      ? `<a class="wf-statement-cta" href="${escapeAttribute(cta.url.trim())}">${escapeHtml(cta.label.trim())}</a>`
      : "";

  // Any painted surface goes full-bleed: a colour that stops at the measure
  // reads as a card, not as a section (same rule as the feature bands).
  const clases = [
    "wf-statement",
    pantalla ? "wf-statement--pantalla" : "",
    fondo !== "base" ? `wf-statement--${fondo} wf-statement--bleed` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <section class="${clases}" aria-label="${escapeHtml(label?.trim() || "Declaracion")}">
      <div class="wf-statement-inner wf-reveal">
        ${eyebrow}
        <p class="wf-statement-line wf-stagger">${lines}</p>
        ${boton}
      </div>
    </section>
  `;
}

/**
 * Token-only styles. No literal colors: every value resolves from the client's
 * ONIA tokens (--color-*, --font-heading) so the same block reads correctly in
 * any brand and in the dark scope emitted by @onia/tokens.
 */
export const EDITORIAL_STATEMENT_CSS = `
.wf-statement {
  padding: clamp(72px, 12vw, 152px) 0;
  background: var(--wf-statement-surface, transparent);
  color: var(--wf-statement-fg, var(--color-fg));
}

/* T9: una pantalla, un solo pensamiento. El centrado lo hace el grid y no el
   padding, para que la frase quede al medio a cualquier alto de viewport. */
.wf-statement--pantalla {
  display: grid;
  place-items: center;
  /* border-box propio: sin esto el padding se SUMA a las 100svh y la seccion
     mide 1080px en un viewport de 900 -- medido. La pantalla completa no puede
     depender de que la pagina que la usa traiga un reset. */
  box-sizing: border-box;
  min-height: 100svh;
  padding-block: clamp(64px, 10vh, 120px);
}

/* Full-bleed real: la banda pinta de borde a borde aunque la plantilla la ponga
   dentro de un contenedor con ancho maximo. La medida vive en el inner, asi que
   el texto no se ensancha junto con el fondo. */
.wf-statement--bleed {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
}

.wf-statement--marca {
  --wf-statement-surface: color-mix(in oklab, var(--color-primary) 12%, var(--color-bg));
}

/* La unica variante que pinta la marca a pleno cambia el PAR completo: fondo
   primary + tinta on-primary, que @onia/tokens gatea a 4.5:1 y recalcula en
   oscuro. Cambiar solo el fondo fabrica texto invisible. */
.wf-statement--tinta {
  --wf-statement-surface: var(--color-primary);
  --wf-statement-fg: var(--color-on-primary);
}

.wf-statement-inner {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
  text-align: center;
}

/* Hairline above the label: a drawn rule, not a decorative badge.
   Se mide contra currentColor y no contra --color-fg: dentro de la variante
   solida el texto de la seccion ya no es el fg de la pagina. */
.wf-statement-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: color-mix(in srgb, currentColor 72%, transparent);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-statement-label::before,
.wf-statement-label::after {
  content: "";
  width: clamp(18px, 4vw, 44px);
  height: 1px;
  background: color-mix(in srgb, currentColor 28%, transparent);
}

/* The measure lives on the line, not on the wrapper: the ch unit resolves against
   the element's OWN font-size, so a measure set on the wrapper (body size) squeezed
   this display type to one word per line and clipped the long ones.
   Note: no backticks in this file's CSS comments -- it lives inside a template
   literal and a stray backtick ends the string mid-stylesheet. */
.wf-statement-line {
  margin: clamp(18px, 3vw, 28px) auto 0;
  max-width: 15ch;
  font-family: var(--font-heading);
  /* The scale jump is the point of this block: it has to break the page rhythm. */
  font-size: clamp(2.1rem, 6.2vw, 4.6rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

/* Cada linea declarada es su propio bloque: asi cae en cascada con wf-stagger y
   equilibra su propio corte. */
.wf-statement-l {
  display: block;
}

/* En pantalla completa la medida se ensancha: con las 15ch del bloque corto,
   una linea declarada se parte en dos visuales y el ritmo que el autor escribio
   deja de verse (medido en el render, no supuesto). Hay ancho de sobra: la
   seccion ocupa la pantalla entera. */
.wf-statement--pantalla .wf-statement-line {
  max-width: 24ch;
}

/* The statement carries one accented word-end: brand color used semantically
   (it marks where the sentence turns), not sprinkled as decoration. */
.wf-statement-accent {
  font-style: italic;
  color: var(--color-primary);
}

/* Sobre la marca a pleno el acento no puede seguir siendo la marca: el giro de
   la frase lo marca la italica. */
.wf-statement--tinta .wf-statement-accent {
  color: currentColor;
}

/* Sobre la marca a pleno el label NO se diluye: el par on-primary/primary llega
   justo a 4.5:1 (medido: 6.41 en claro, 4.94 en oscuro), asi que bajarlo al 72%
   lo reprueba (4.17 y 3.39). La jerarquia la da el tamano, no el desvanecido. */
.wf-statement--tinta .wf-statement-label {
  color: currentColor;
}

.wf-statement-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 44px: el minimo de superficie tactil (WCAG 2.5.5). */
  min-height: 44px;
  margin-top: clamp(24px, 4vw, 40px);
  padding: 12px 28px;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-body);
  font-weight: 700;
  text-decoration: none;
  transition: transform .3s var(--wf-ease, ease);
}

/* Dentro de la variante solida el boton invierte el mismo par: mismo contraste
   gateado, jerarquia intacta. */
.wf-statement--tinta .wf-statement-cta {
  background: var(--color-on-primary);
  color: var(--color-primary);
}

.wf-statement-cta:hover {
  transform: translateY(-2px);
}

.wf-statement-cta:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .wf-statement-cta {
    transition: none;
  }

  .wf-statement-cta:hover {
    transform: none;
  }
}

@media (max-width: 640px) {
  .wf-statement {
    padding: 64px 0;
  }

  .wf-statement-inner {
    max-width: 100%;
  }
}
`.trim();

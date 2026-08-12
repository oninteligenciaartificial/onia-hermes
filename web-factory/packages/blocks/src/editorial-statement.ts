import { escapeHtml } from "./escape";

/**
 * editorial-statement — one oversized line that reframes the rubro.
 *
 * Learned from 2 models (find-realestate-editorial · lecercle-realestate), both
 * `job: trust`, `layout: centered`. Cheap to produce and it lifts the tone of the
 * whole page: it is the scale-contrast beat between the hero and the offer.
 *
 * Motion (verbatim from the models, not invented):
 *   entrance "fade + rise (y 28 -> 0)" · trigger in-view · easing [0.22, 1, 0.36, 1]
 *   duration 0.7s · stagger 0 · no scroll-link · no hover · reduced: static, fully visible
 * Mapped to the toolkit as `wf-reveal` (motion.ts owns the easing + the
 * prefers-reduced-motion fallback).
 */

export type EditorialStatementProps = {
  /** The statement itself. One sentence — this block is a single beat. */
  statement: string;
  /** Lowercase section label above the line (typography treatment of the models). */
  label?: string;
  /**
   * Closing clause rendered in the brand color: the turn of the sentence, so the
   * accent means something instead of decorating. Plain text — never markup.
   */
  accent?: string;
};

export function renderEditorialStatement({
  statement,
  label,
  accent,
}: EditorialStatementProps): string {
  const line = statement.trim();
  if (!line) return "";

  const eyebrow = label?.trim()
    ? `<p class="wf-statement-label">${escapeHtml(label.trim())}</p>`
    : "";
  const turn = accent?.trim()
    ? ` <em class="wf-statement-accent">${escapeHtml(accent.trim())}</em>`
    : "";

  return `
    <section class="wf-statement" aria-label="${escapeHtml(label?.trim() || "Declaracion")}">
      <div class="wf-statement-inner wf-reveal">
        ${eyebrow}
        <p class="wf-statement-line">${escapeHtml(line)}${turn}</p>
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
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(72px, 12vw, 152px) 0;
}

.wf-statement-inner {
  text-align: center;
}

/* Hairline above the label: a drawn rule, not a decorative badge. */
.wf-statement-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: color-mix(in srgb, var(--color-fg) 55%, var(--color-bg));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-statement-label::before,
.wf-statement-label::after {
  content: "";
  width: clamp(18px, 4vw, 44px);
  height: 1px;
  background: color-mix(in srgb, var(--color-fg) 28%, transparent);
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

/* The statement carries one accented word-end: brand color used semantically
   (it marks where the sentence turns), not sprinkled as decoration. */
.wf-statement-accent {
  font-style: italic;
  color: var(--color-primary);
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

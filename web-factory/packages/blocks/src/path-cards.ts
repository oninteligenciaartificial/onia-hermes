import { escapeAttribute, escapeHtml } from "./escape";
import { renderIcon } from "./icons";

/**
 * path-cards — the explicit entry paths (comprar / vender / alquilar).
 *
 * From find-realestate-editorial (section 2, job offer, layout grid, content
 * [icon, title, copy, cta]). The model is blunt about this one: "es lo que hace
 * que la pagina convierta en vez de solo lucir... no recortarlas". Three different
 * intentions get three different next steps instead of one generic CTA.
 *
 * Motion (verbatim from the model):
 *   entrance "stagger fade-up de las tres tarjetas" · trigger in-view
 *   easing [0.22, 1, 0.36, 1] · duration 0.6s · stagger 0.08s
 *   hover "la tarjeta sube 4px y el borde toma el color accent"
 *   reducedMotion "estatico y visible"
 */

export type PathCard = {
  title: string;
  copy: string;
  /** Icon name from icons.ts. */
  icon?: string;
  cta: { label: string; url: string };
};

export type PathCardsProps = {
  cards: ReadonlyArray<PathCard>;
  label?: string;
  heading?: string;
  id?: string;
};

export function renderPathCards({
  cards,
  label,
  heading,
  id = "caminos",
}: PathCardsProps): string {
  const usable = cards.filter((card) => card.title.trim().length > 0);
  if (usable.length === 0) return "";

  const headingId = `${id}-heading`;
  const items = usable
    .map(
      (card, index) => `
        <li class="wf-path">
          <a class="wf-path-link" href="${escapeAttribute(card.cta.url)}">
            <span class="wf-path-top">
              <span class="wf-path-icon" aria-hidden="true">${renderIcon(card.icon ?? "arrow-right")}</span>
              <span class="wf-path-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            </span>
            <span class="wf-path-title">${escapeHtml(card.title.trim())}</span>
            <span class="wf-path-copy">${escapeHtml(card.copy.trim())}</span>
            <span class="wf-path-cta">
              ${escapeHtml(card.cta.label)}
              <svg class="wf-path-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </a>
        </li>
      `,
    )
    .join("");

  return `
    <section class="wf-paths" id="${escapeAttribute(id)}" aria-labelledby="${headingId}">
      <div class="wf-paths-head wf-reveal">
        ${label?.trim() ? `<p class="wf-paths-label">${escapeHtml(label.trim())}</p>` : ""}
        <h2 class="wf-paths-heading" id="${headingId}">${escapeHtml(heading?.trim() || "Elegi tu camino")}</h2>
      </div>
      <ul class="wf-paths-grid wf-stagger">
        ${items}
      </ul>
    </section>
  `;
}

/**
 * Token-only styles. The whole card is one link, so the hit target is the card
 * (not a 12px "ver mas"), and focus-visible lands on the same surface as hover.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const PATH_CARDS_CSS = `
.wf-paths {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(56px, 8vw, 104px) 0;
  --wf-dur: .6s;
  --wf-stag: .08s;
}

.wf-paths-label {
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-paths-heading {
  margin: 10px 0 0;
  max-width: 18ch;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 4vw, 3.1rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-paths-grid {
  margin: clamp(28px, 4vw, 48px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
  gap: 16px;
}

.wf-path-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 260px;
  padding: clamp(22px, 2.6vw, 32px);
  border: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
  border-radius: 14px;
  background: var(--color-surface, color-mix(in srgb, var(--color-bg) 60%, transparent));
  transition:
    transform .35s var(--wf-ease, ease),
    border-color .35s var(--wf-ease, ease),
    box-shadow .35s var(--wf-ease, ease);
}

/* hover: "la tarjeta sube 4px y el borde toma el color accent" */
.wf-path-link:hover,
.wf-path-link:focus-visible {
  transform: translateY(-4px);
  border-color: var(--color-accent);
  box-shadow: 0 22px 44px -28px color-mix(in srgb, var(--color-fg) 60%, transparent);
}

.wf-path-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.wf-path-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wf-path-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.wf-path-icon .wf-icon {
  width: 20px;
  height: 20px;
}

.wf-path-index {
  /* 62% y no menos: a 38% el numeral daba 2,52:1 sobre la tarjeta — invisible
     para baja vision. aria-hidden lo saca del lector de pantalla, NO del ojo:
     el contraste AA (4,5:1) aplica igual. El fantasma lo hace el tamano. */
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.wf-path-title {
  display: block;
  margin-top: 26px;
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 2.2vw, 1.85rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.wf-path-copy {
  display: block;
  margin-top: 10px;
  color: color-mix(in srgb, var(--color-fg) 68%, var(--color-bg));
  line-height: 1.6;
}

.wf-path-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 22px;
  color: var(--color-primary);
  font-weight: 700;
}

.wf-path-arrow {
  width: 17px;
  height: 17px;
  transition: transform .3s var(--wf-ease, ease);
}

.wf-path-link:hover .wf-path-arrow,
.wf-path-link:focus-visible .wf-path-arrow {
  transform: translateX(4px);
}

@media (prefers-reduced-motion: reduce) {
  .wf-path-link,
  .wf-path-arrow {
    transition: none;
  }

  .wf-path-link:hover,
  .wf-path-link:focus-visible,
  .wf-path-link:hover .wf-path-arrow {
    transform: none;
  }
}
`.trim();

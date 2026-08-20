import { escapeHtml } from "./escape";
import { renderIcon } from "./icons";

/**
 * benefit-strip — the band that brings the promise down to concrete terms.
 *
 * Learned from 2 models with two shapes, both `job: offer`:
 *   · unitedcarriers-logistics  layout "grid", content [icon, title, copy]
 *   · boldflavor-cpg-landing    layout "row",  content [benefits]
 * One block, two layouts: `copy`/`icon` are optional, so the row variant is the
 * same data with fewer slots — not a second component.
 *
 * Motion (verbatim from the models):
 *   entrance "stagger fade-up de las tarjetas (y 16 -> 0)" · trigger in-view
 *   easing [0.22, 1, 0.36, 1] · duration 0.5-0.6s · stagger 0.08s
 *   hover "elevacion sutil y el icono adelanta 2px" · reduced: estatico y visible
 * Mapped to `wf-stagger` (+ per-block --wf-dur/--wf-stag); the hover is CSS-only,
 * and motion.ts kills both under prefers-reduced-motion.
 */

export type BenefitStripItem = {
  title: string;
  /** Concrete detail. Omit for the row variant (boldflavor: claim only). */
  copy?: string;
  /** Icon name from icons.ts. Omit and the item falls back to its index numeral. */
  icon?: string;
};

export type BenefitStripProps = {
  items: ReadonlyArray<BenefitStripItem>;
  /** Lowercase label above the strip. */
  label?: string;
  /** "grid" = icon + title + copy (unitedcarriers) · "row" = claims only (boldflavor). */
  layout?: "grid" | "row";
};

export function renderBenefitStrip({
  items,
  label,
  layout = "grid",
}: BenefitStripProps): string {
  const clean = items.filter((item) => item.title.trim().length > 0);
  if (clean.length === 0) return "";

  const cells = clean
    .map((item, index) => {
      const mark = item.icon
        ? `<span class="wf-benefit-icon" aria-hidden="true">${renderIcon(item.icon)}</span>`
        : `<span class="wf-benefit-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>`;
      const copy = item.copy?.trim()
        ? `<p class="wf-benefit-copy">${escapeHtml(item.copy.trim())}</p>`
        : "";

      return `<li class="wf-benefit">
          ${mark}
          <h3 class="wf-benefit-title">${escapeHtml(item.title.trim())}</h3>
          ${copy}
        </li>`;
    })
    .join("");

  const eyebrow = label?.trim()
    ? `<p class="wf-benefit-label">${escapeHtml(label.trim())}</p>`
    : "";

  return `
    <section class="wf-benefit-strip" aria-label="${escapeHtml(label?.trim() || "Beneficios")}">
      ${eyebrow}
      <ul class="wf-benefit-list wf-benefit-${layout} wf-stagger">
        ${cells}
      </ul>
    </section>
  `;
}

/**
 * Token-only styles. Hairline dividers instead of a card grid on purpose: the
 * repeated-card look is the template tell this factory bans.
 */
export const BENEFIT_STRIP_CSS = `
.wf-benefit-strip {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(48px, 7vw, 88px) 0;
  --wf-dur: .6s;
  --wf-stag: .08s;
}

.wf-benefit-label {
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-benefit-list {
  margin: clamp(20px, 3vw, 34px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0;
}

.wf-benefit-grid {
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
}

.wf-benefit-row {
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}

/* The divider is the layout: a rule between items, not a box around each. */
.wf-benefit {
  padding: clamp(20px, 2.4vw, 30px) clamp(18px, 2.4vw, 30px);
  border-left: 1px solid color-mix(in srgb, var(--color-fg) 13%, transparent);
  transition: transform .3s var(--wf-ease, ease), background-color .3s var(--wf-ease, ease);
}

.wf-benefit:first-child {
  padding-left: 0;
  border-left: 0;
}

/* hover: "elevacion sutil y el icono adelanta 2px" */
.wf-benefit:hover {
  transform: translateY(-4px);
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.wf-benefit:hover .wf-benefit-icon {
  transform: translateX(2px);
  border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
}

.wf-benefit-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 16%, transparent);
  border-radius: 999px;
  color: var(--color-primary);
  transition: transform .3s var(--wf-ease, ease), border-color .3s var(--wf-ease, ease);
}

.wf-benefit-icon .wf-icon {
  width: 20px;
  height: 20px;
}

.wf-benefit-index {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.wf-benefit-title {
  margin-top: 16px;
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  line-height: 1.2;
}

.wf-benefit-copy {
  margin-top: 8px;
  color: color-mix(in srgb, var(--color-fg) 68%, var(--color-bg));
  font-size: 0.97rem;
  line-height: 1.6;
}

@media (max-width: 760px) {
  /* Stacked: the vertical rule becomes a horizontal one, same idea. */
  .wf-benefit-list,
  .wf-benefit-row {
    grid-auto-flow: row;
    grid-template-columns: 1fr;
  }

  .wf-benefit {
    padding: 20px 0;
    border-left: 0;
    border-top: 1px solid color-mix(in srgb, var(--color-fg) 13%, transparent);
  }

  .wf-benefit:first-child {
    border-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wf-benefit,
  .wf-benefit:hover,
  .wf-benefit:hover .wf-benefit-icon {
    transform: none;
    transition: none;
  }
}
`.trim();

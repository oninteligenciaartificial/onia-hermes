import { escapeAttribute, escapeHtml } from "./escape";

/**
 * footer-brand — the closing band: brand wordmark + nav + contact + legal.
 *
 * The most requested block in the learned catalog (3 of 5 models):
 *   · find-realestate-editorial  layout "grid",  content [logo, nav, contacto, legal]
 *   · unitedcarriers-logistics   layout "grid",  content [logo, nav, contacto, legal]
 *   · lecercle-realestate        layout "band",  content [brand-mark]  (fades in)
 * The band variant is the grid with no groups: the oversized wordmark carries it.
 *
 * Motion (verbatim from the models):
 *   entrance "none" (find, unitedcarriers) / "fade in" 0.5s in-view (lecercle)
 *   easing [0.22, 1, 0.36, 1] · stagger 0 · no scroll-link
 *   hover "subrayado que crece desde la izquierda" · reduced: estatico
 * Entrance is opt-in via `reveal` so the default matches 2 of the 3 models: a
 * footer that animates on every page bottom is noise, not guidance.
 */

export type FooterBrandItem = {
  label: string;
  /** Omit for plain text (an address is not a link). */
  url?: string;
};

export type FooterBrandGroup = {
  title: string;
  items: ReadonlyArray<FooterBrandItem>;
};

export type FooterBrandProps = {
  brand: string;
  /** One line under the wordmark. */
  statement?: string;
  /** Nav + contact columns. Empty = lecercle's brand-mark band. */
  groups?: ReadonlyArray<FooterBrandGroup>;
  /** Legal line. The year is the caller's business — this block never guesses it. */
  legal?: string;
  /** lecercle only: fade the band in when it enters the viewport. */
  reveal?: boolean;
};

export function renderFooterBrand({
  brand,
  statement,
  groups = [],
  legal,
  reveal = false,
}: FooterBrandProps): string {
  const name = brand.trim();
  if (!name) return "";

  const columns = groups
    .filter((group) => group.items.some((item) => item.label.trim().length > 0))
    .map((group) => {
      const links = group.items
        .filter((item) => item.label.trim().length > 0)
        .map((item) => {
          const label = escapeHtml(item.label.trim());
          return item.url?.trim()
            ? `<li><a class="wf-fb-link" href="${escapeAttribute(item.url.trim())}">${label}</a></li>`
            : `<li><span class="wf-fb-text">${label}</span></li>`;
        })
        .join("");

      return `<div class="wf-fb-group">
          <h2 class="wf-fb-group-title">${escapeHtml(group.title.trim())}</h2>
          <ul class="wf-fb-list">${links}</ul>
        </div>`;
    })
    .join("");

  const statementLine = statement?.trim()
    ? `<p class="wf-fb-statement">${escapeHtml(statement.trim())}</p>`
    : "";
  const legalLine = legal?.trim()
    ? `<p class="wf-fb-legal">${escapeHtml(legal.trim())}</p>`
    : "";

  return `
    <footer class="wf-fb${reveal ? " wf-reveal" : ""}" aria-label="Pie de pagina">
      <div class="wf-fb-top">
        <div class="wf-fb-brand">
          <p class="wf-fb-mark">${escapeHtml(name)}</p>
          ${statementLine}
        </div>
        ${columns ? `<div class="wf-fb-groups">${columns}</div>` : ""}
      </div>
      ${legalLine ? `<div class="wf-fb-bottom">${legalLine}</div>` : ""}
    </footer>
  `;
}

/**
 * Token-only styles. The wordmark is treated as a graphic element (the depth of
 * the band comes from that scale jump, not from a decorative gradient), and the
 * link hover is the underline growing from the left that the models specify.
 */
export const FOOTER_BRAND_CSS = `
.wf-fb {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 0 clamp(28px, 4vw, 44px);
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 13%, transparent);
}

.wf-fb-top {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 72px);
  align-items: start;
}

/* The wordmark is the graphic: oversized, tight, optically flush left. */
.wf-fb-mark {
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 8vw, 5.5rem);
  line-height: 0.92;
  letter-spacing: -0.035em;
  color: var(--color-fg);
}

.wf-fb-statement {
  margin-top: 18px;
  max-width: 38ch;
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  line-height: 1.6;
}

.wf-fb-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: clamp(24px, 3vw, 40px);
}

.wf-fb-group-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-fg) 52%, var(--color-bg));
}

.wf-fb-list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}

.wf-fb-link,
.wf-fb-text {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  line-height: 1.4;
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-bg));
}

.wf-fb-link {
  position: relative;
}

/* hover: "subrayado que crece desde la izquierda" */
.wf-fb-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 100%;
  height: 1px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .3s var(--wf-ease, ease);
}

.wf-fb-link:hover {
  color: var(--color-fg);
}

.wf-fb-link:hover::after,
.wf-fb-link:focus-visible::after {
  transform: scaleX(1);
}

.wf-fb-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 2px;
}

.wf-fb-bottom {
  margin-top: clamp(32px, 5vw, 56px);
  padding-top: 20px;
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 10%, transparent);
}

.wf-fb-legal {
  color: color-mix(in srgb, var(--color-fg) 50%, var(--color-bg));
  font-size: 0.86rem;
}

@media (max-width: 840px) {
  .wf-fb-top {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wf-fb-link::after {
    transition: none;
  }
}
`.trim();

import { escapeAttribute, escapeHtml } from "./escape";

/**
 * property-cards — the catalog grid.
 *
 * From find-realestate-editorial (section 3, job catalog, layout grid, content
 * [media, precio, ubicacion, specs, cta]). Model note, kept as a rule: "Precio
 * visible en la tarjeta. En Bolivia el precio oculto mata la consulta."
 *
 * Motion (verbatim from the model):
 *   entrance "stagger fade-up" · trigger in-view · easing [0.22, 1, 0.36, 1]
 *   duration 0.6s · stagger 0.07s
 *   hover "zoom lento de la foto dentro de su marco (scale 1 -> 1.04), el marco
 *   no se mueve" · reducedMotion "estatico, sin zoom"
 *
 * `placeholder` marks a card as sample data. It renders a visible tag, so a page
 * built before the client sends the real portfolio can never read as a real listing.
 */

export type PropertySpec = {
  label: string;
  value: string;
};

export type PropertyCard = {
  title: string;
  /** Shown as written. Never computed, never invented. */
  price: string;
  location?: string;
  specs?: ReadonlyArray<PropertySpec>;
  media?: { src: string; alt: string };
  url?: string;
  /** true = sample data waiting for the client's real portfolio. */
  placeholder?: boolean;
};

export type PropertyCardsProps = {
  items: ReadonlyArray<PropertyCard>;
  label?: string;
  heading?: string;
  /** Shown under the heading, e.g. what the client still has to send. */
  note?: string;
  id?: string;
};

export function renderPropertyCards({
  items,
  label,
  heading,
  note,
  id = "propiedades",
}: PropertyCardsProps): string {
  const usable = items.filter((item) => item.title.trim().length > 0);
  if (usable.length === 0) return "";

  const headingId = `${id}-heading`;
  const cards = usable.map((item) => renderCard(item)).join("");

  return `
    <section class="wf-props" id="${escapeAttribute(id)}" aria-labelledby="${headingId}">
      <div class="wf-props-head wf-reveal">
        <div>
          ${label?.trim() ? `<p class="wf-props-label">${escapeHtml(label.trim())}</p>` : ""}
          <h2 class="wf-props-heading" id="${headingId}">${escapeHtml(heading?.trim() || "En cartera")}</h2>
        </div>
        ${note?.trim() ? `<p class="wf-props-note">${escapeHtml(note.trim())}</p>` : ""}
      </div>
      <ul class="wf-props-grid wf-stagger">
        ${cards}
      </ul>
    </section>
  `;
}

function renderCard(item: PropertyCard): string {
  const media = item.media?.src
    ? `<img class="wf-prop-img" src="${escapeAttribute(item.media.src)}" alt="${escapeAttribute(item.media.alt)}" loading="lazy" decoding="async">`
    : `<span class="wf-prop-empty" aria-hidden="true"></span>`;

  const specs = (item.specs ?? [])
    .filter((spec) => spec.value.trim().length > 0)
    .map(
      (spec) =>
        `<li><span class="wf-prop-spec-value">${escapeHtml(spec.value.trim())}</span><span class="wf-prop-spec-label">${escapeHtml(spec.label.trim())}</span></li>`,
    )
    .join("");

  const body = `
    <span class="wf-prop-frame">
      ${media}
      ${item.placeholder ? `<span class="wf-prop-tag">Imagen de muestra</span>` : ""}
    </span>
    <span class="wf-prop-body">
      <span class="wf-prop-price">${escapeHtml(item.price.trim())}</span>
      <span class="wf-prop-title">${escapeHtml(item.title.trim())}</span>
      ${item.location?.trim() ? `<span class="wf-prop-location">${escapeHtml(item.location.trim())}</span>` : ""}
      ${specs ? `<ul class="wf-prop-specs">${specs}</ul>` : ""}
    </span>
  `;

  // An anchor only when there is somewhere to go: an empty href is a broken
  // promise and a keyboard trap for no reason.
  const inner = item.url?.trim()
    ? `<a class="wf-prop-link" href="${escapeAttribute(item.url.trim())}">${body}</a>`
    : `<div class="wf-prop-link wf-prop-static">${body}</div>`;

  return `<li class="wf-prop">${inner}</li>`;
}

/**
 * Token-only styles. The frame clips and the image scales inside it, which is
 * exactly the hover the model describes and keeps the grid from reflowing.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const PROPERTY_CARDS_CSS = `
.wf-props {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(48px, 7vw, 96px) 0;
  --wf-dur: .6s;
  --wf-stag: .07s;
}

.wf-props-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding-bottom: 22px;
  border-bottom: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-props-label {
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-props-heading {
  margin: 10px 0 0;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 4vw, 3.1rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-props-note {
  max-width: 40ch;
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.92rem;
  line-height: 1.55;
}

.wf-props-grid {
  margin: clamp(24px, 3vw, 40px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: clamp(20px, 2.4vw, 32px);
}

.wf-prop-link {
  display: block;
  height: 100%;
}

.wf-prop-frame {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-fg) 8%, var(--color-bg));
}

.wf-prop-img,
.wf-prop-empty {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform .8s var(--wf-ease, ease);
}

/* hover: the photo zooms inside the frame, the frame does not move */
.wf-prop-link:hover .wf-prop-img,
.wf-prop-link:focus-visible .wf-prop-img {
  transform: scale(1.04);
}

.wf-prop-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 14px;
}

/* Sample data is labelled on the card itself, never silently. */
.wf-prop-tag {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-fg) 82%, transparent);
  color: var(--color-bg);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wf-prop-body {
  display: block;
  padding-top: 16px;
}

.wf-prop-price {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-primary);
}

.wf-prop-title {
  display: block;
  margin-top: 6px;
  font-size: 1.02rem;
  line-height: 1.35;
}

.wf-prop-location {
  display: block;
  margin-top: 4px;
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.9rem;
}

.wf-prop-specs {
  margin: 14px 0 0;
  padding: 12px 0 0;
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.wf-prop-spec-value {
  display: block;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.wf-prop-spec-label {
  display: block;
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-size: 0.78rem;
  letter-spacing: 0.03em;
}

@media (prefers-reduced-motion: reduce) {
  .wf-prop-img {
    transition: none;
  }

  .wf-prop-link:hover .wf-prop-img,
  .wf-prop-link:focus-visible .wf-prop-img {
    transform: none;
  }
}
`.trim();

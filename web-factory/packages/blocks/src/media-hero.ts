import { escapeAttribute, escapeHtml } from "./escape";

/**
 * media-hero — full-bleed opening screen: the business, the offer and the next
 * action in one view. From find-realestate-editorial (section 0, layout full-bleed,
 * content [headline, sub, cta-primary, media]).
 *
 * Motion (verbatim from the model):
 *   entrance "el titular entra por palabras (split-text, y 24 -> 0) y la media
 *   revela con clip-path hacia arriba" · trigger on-load · easing [0.22, 1, 0.36, 1]
 *   duration 0.9s · stagger 0.06s · scrollLinked "parallax suave de la media al
 *   salir del viewport" · hover "el CTA desplaza su flecha 4px"
 *   reducedMotion "titular y media en estado final, sin parallax"
 * Split-text is markup (one span per word) driven by wf-stagger, so it needs no
 * JS of its own and the words stay selectable and readable by screen readers.
 *
 * The nav is deliberately NOT wf-sticky: the model specifies no sticky nav for
 * this hero, and sticky cannot work here anyway (the header clips its media with
 * overflow:hidden, which kills position:sticky on its descendants).
 */

export type MediaHeroLink = {
  label: string;
  url: string;
};

export type MediaHeroProps = {
  brand: string;
  headline: string;
  kicker?: string;
  sub?: string;
  cta: MediaHeroLink;
  /** Sticky top nav. Empty renders the brand alone. */
  nav?: ReadonlyArray<MediaHeroLink>;
  /** Alt text is required with a src: a hero image is never decorative. */
  media?: { src: string; alt: string };
};

export function renderMediaHero({
  brand,
  headline,
  kicker,
  sub,
  cta,
  nav = [],
  media,
}: MediaHeroProps): string {
  const words = headline
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `<span class="wf-mh-word">${escapeHtml(word)}</span>`)
    .join(" ");

  const navLinks = nav
    .filter((link) => link.label.trim().length > 0)
    .map(
      (link) =>
        `<a class="wf-mh-nav-link" href="${escapeAttribute(link.url)}">${escapeHtml(link.label)}</a>`,
    )
    .join("");

  const figure = media?.src
    ? `<figure class="wf-mh-media wf-clip-reveal wf-onload">
        <img class="wf-mh-img wf-zoom wf-parallax" data-wf-parallax="0.12"
             src="${escapeAttribute(media.src)}" alt="${escapeAttribute(media.alt)}"
             loading="eager" fetchpriority="high" decoding="async">
      </figure>`
    : "";

  return `
    <header class="wf-mh" id="top">
      <nav class="wf-mh-nav" aria-label="Principal">
        <a class="wf-mh-brand" href="#top">${escapeHtml(brand)}</a>
        <div class="wf-mh-nav-links">${navLinks}</div>
      </nav>

      ${figure}

      <div class="wf-mh-copy">
        ${kicker?.trim() ? `<p class="wf-mh-kicker">${escapeHtml(kicker.trim())}</p>` : ""}
        <h1 class="wf-mh-headline wf-stagger wf-onload">${words}</h1>
        ${sub?.trim() ? `<p class="wf-mh-sub wf-reveal wf-onload">${escapeHtml(sub.trim())}</p>` : ""}
        <a class="wf-mh-cta wf-reveal wf-onload" href="${escapeAttribute(cta.url)}">
          <span>${escapeHtml(cta.label)}</span>
          <svg class="wf-mh-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </header>
  `;
}

/**
 * Token-only styles. The scrim is mixed from --color-fg so contrast over the photo
 * stays in the client's own ink, and the copy inverts to --color-bg instead of a
 * hardcoded white.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const MEDIA_HERO_CSS = `
.wf-mh {
  position: relative;
  min-height: min(92vh, 900px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  background: var(--color-fg);
  color: var(--color-bg);
}

.wf-mh-media {
  position: absolute;
  inset: 0;
  margin: 0;
  z-index: -2;
}

.wf-mh-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* Scrim: a gradient of the client's own ink, so text contrast holds on any photo.
   The top stop is deliberately heavy (not a token 20% wash): the nav sits there in
   --color-bg, and a bright client photo behind a light scrim drops it under 4.5:1. */
.wf-mh::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(to top, color-mix(in srgb, var(--color-fg) 90%, transparent) 0%, color-mix(in srgb, var(--color-fg) 52%, transparent) 55%, color-mix(in srgb, var(--color-fg) 62%, transparent) 100%);
}

.wf-mh-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: 18px 0;
}

.wf-mh-brand {
  display: inline-flex;
  align-items: center;
  /* The wordmark is a link: it needs a real touch target, not the 22px the type
     happens to occupy. */
  min-height: 44px;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.wf-mh-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Full --color-bg, not a dimmed mix: over the lightest photo the scrim can only
   guarantee ~4.9:1 at full strength, and a 16% dim drops it under 4.5. The hover
   cue is the underline, not brightness. */
.wf-mh-nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  font-size: 0.94rem;
  color: var(--color-bg);
}

.wf-mh-nav-link::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 11px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .3s var(--wf-ease, ease);
}

.wf-mh-nav-link:hover::after,
.wf-mh-nav-link:focus-visible::after {
  transform: scaleX(1);
}

.wf-mh-brand:focus-visible,
.wf-mh-nav-link:focus-visible,
.wf-mh-cta:focus-visible {
  outline: 2px solid var(--color-bg);
  outline-offset: 3px;
  border-radius: 4px;
}

.wf-mh-copy {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(48px, 9vw, 120px) 0 clamp(40px, 6vw, 80px);
  margin-top: auto;
}

.wf-mh-kicker {
  color: color-mix(in srgb, var(--color-bg) 76%, transparent);
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.wf-mh-headline {
  margin: 18px 0 0;
  max-width: 16ch;
  font-family: var(--font-heading);
  font-size: clamp(2.7rem, 8vw, 6.4rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  font-weight: 500;
}

/* One span per word: the split-text entrance is markup, not a JS text splitter. */
.wf-mh-word {
  display: inline-block;
}

.wf-mh-sub {
  margin-top: 22px;
  max-width: 46ch;
  color: color-mix(in srgb, var(--color-bg) 82%, transparent);
  font-size: clamp(1rem, 1.5vw, 1.18rem);
  line-height: 1.6;
}

.wf-mh-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  margin-top: 34px;
  padding: 0 26px;
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-fg);
  font-weight: 700;
  transition: background-color .3s var(--wf-ease, ease);
}

.wf-mh-cta:hover {
  background: color-mix(in srgb, var(--color-bg) 88%, var(--color-primary));
}

.wf-mh-arrow {
  width: 18px;
  height: 18px;
  transition: transform .3s var(--wf-ease, ease);
}

/* hover: "el CTA desplaza su flecha 4px" */
.wf-mh-cta:hover .wf-mh-arrow,
.wf-mh-cta:focus-visible .wf-mh-arrow {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .wf-mh {
    min-height: 88vh;
  }

  .wf-mh-nav-links {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wf-mh-arrow,
  .wf-mh-nav-link::after,
  .wf-mh-cta {
    transition: none;
  }

  .wf-mh-cta:hover .wf-mh-arrow {
    transform: none;
  }
}
`.trim();

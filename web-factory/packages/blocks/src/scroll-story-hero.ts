import { escapeAttribute, escapeHtml } from "./escape";

/**
 * scroll-story-hero — the opening screen where the scroll ADVANCES a scene: the
 * visitor follows the client's process instead of reading that it exists.
 *
 * Asked for by 2 learned models, and this block covers both shapes:
 *   · unitedcarriers-logistics (section 0, full-bleed, [headline, sub, cta-primary,
 *     media-3d]) — "el progreso del scroll ES el avance del envio".
 *   · lecercle-realestate (section 0, full-bleed, [headline, sub, cta-primary,
 *     cta-secondary, media]) — one frame, clip reveal + slow zoom, no scrub.
 * One frame = the cinematic hero; N frames = the staged story. Same props.
 *
 * Motion (verbatim from the models):
 *   entrance "la escena entra con un leve orbit y el titular sube por lineas
 *   (y 30 -> 0)" / lecercle "media reveals via clip-path wipe up with a slow zoom;
 *   headline lines stagger in; CTAs fade-up last" · trigger on-load
 *   easing [0.22, 1, 0.36, 1] · duration 1.0s · stagger 0.1s
 *   scrollLinked "la camara de la escena avanza con el scroll"
 *   reducedMotion "render del estado final: una imagen estatica de la escena,
 *   titular y CTA visibles, sin orbit ni scroll-link"
 *
 * The 3D scene is deliberately NOT built. The model's own build note orders it:
 * "este modelo choca con el presupuesto de 150 kb de JS por landing... se
 * construye la version 2D con scrub de secuencia de imagenes, que da el 80% del
 * efecto por una fraccion del peso". So the scene is the client's real photos,
 * cross-faded by the shared `data-wf-scrub` primitive (motion.ts, pattern bank
 * P3 sticky+scrub): 0 kb of block-owned JS.
 *
 * Each frame carries its stage name, and the stages also render as an ordered
 * list. That is what makes the story legible with no JS, on a screen reader and
 * under reduced motion — the movement adds the sync, it never carries the
 * information alone.
 */

export type ScrollStoryHeroLink = {
  label: string;
  url: string;
};

export type ScrollStoryFrame = {
  src: string;
  /** Alt text is required: these photos ARE the argument, never decoration. */
  alt: string;
  /** Stage name ("Deposito", "Ruta", "Entrega"). Shown in the step list. */
  stage?: string;
};

export type ScrollStoryHeroProps = {
  brand: string;
  headline: string;
  kicker?: string;
  sub?: string;
  ctaPrimary: ScrollStoryHeroLink;
  /** Second exit (lecercle: "View Properties" + "Book a Tour"). */
  ctaSecondary?: ScrollStoryHeroLink;
  nav?: ReadonlyArray<ScrollStoryHeroLink>;
  /** Scene frames in story order. Empty renders the hero without media. */
  frames?: ReadonlyArray<ScrollStoryFrame>;
  /** Accessible name for the step list. */
  stepsLabel?: string;
};

export function renderScrollStoryHero({
  brand,
  headline,
  kicker,
  sub,
  ctaPrimary,
  ctaSecondary,
  nav = [],
  frames = [],
  stepsLabel = "Etapas del proceso",
}: ScrollStoryHeroProps): string {
  const scene = frames.filter((frame) => frame.src.trim().length > 0);
  const words = headline
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `<span class="wf-ssh-word">${escapeHtml(word)}</span>`)
    .join(" ");

  const navLinks = nav
    .filter((link) => link.label.trim().length > 0)
    .map(
      (link) =>
        `<a class="wf-ssh-nav-link" href="${escapeAttribute(link.url)}">${escapeHtml(link.label)}</a>`,
    )
    .join("");

  // Only the first frame is eager: the rest are below the fold of the scene and
  // must not compete with the LCP image (and under reduced motion they are never
  // revealed, so they are never fetched).
  const media = scene.length
    ? `<div class="wf-ssh-media">
        ${scene
          .map(
            (frame, index) =>
              `<figure class="wf-frame wf-ssh-frame">
                <img class="wf-ssh-img" src="${escapeAttribute(frame.src)}" alt="${escapeAttribute(frame.alt)}"
                     ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
              </figure>`,
          )
          .join("")}
      </div>`
    : "";

  const stages = scene.filter((frame) => (frame.stage ?? "").trim().length > 0);
  const steps =
    stages.length > 1
      ? `<ol class="wf-ssh-steps" aria-label="${escapeAttribute(stepsLabel)}">
          ${stages
            .map(
              (frame, index) =>
                `<li class="wf-step wf-ssh-step">
                  <span class="wf-ssh-step-n">${String(index + 1).padStart(2, "0")}</span>
                  <span class="wf-ssh-step-l">${escapeHtml((frame.stage ?? "").trim())}</span>
                </li>`,
            )
            .join("")}
        </ol>`
      : "";

  const secondary = ctaSecondary?.label.trim()
    ? `<a class="wf-ssh-cta-2" href="${escapeAttribute(ctaSecondary.url)}">${escapeHtml(ctaSecondary.label.trim())}</a>`
    : "";

  return `
    <header class="wf-ssh" id="top">
      <nav class="wf-ssh-nav" aria-label="Principal">
        <a class="wf-ssh-brand" href="#top">${escapeHtml(brand)}</a>
        <div class="wf-ssh-nav-links">${navLinks}</div>
      </nav>

      <div class="wf-ssh-track" data-wf-scrub style="--wf-frames:${Math.max(scene.length, 1)}">
        <div class="wf-ssh-scene">
          ${media}
          <div class="wf-ssh-copy">
            ${kicker?.trim() ? `<p class="wf-ssh-kicker">${escapeHtml(kicker.trim())}</p>` : ""}
            <h1 class="wf-ssh-headline wf-stagger wf-onload">${words}</h1>
            ${sub?.trim() ? `<p class="wf-ssh-sub wf-reveal wf-onload">${escapeHtml(sub.trim())}</p>` : ""}
            <div class="wf-ssh-actions wf-reveal wf-onload">
              <a class="wf-ssh-cta" href="${escapeAttribute(ctaPrimary.url)}">
                <span>${escapeHtml(ctaPrimary.label)}</span>
                <svg class="wf-ssh-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              ${secondary}
            </div>
          </div>
          ${steps}
        </div>
      </div>
    </header>
  `;
}

/**
 * Token-only styles.
 *
 * Scrim polarity, and why it differs from media-hero: that block inverts (scrim
 * mixed from --color-fg, copy in --color-bg) because it opens a LIGHT page with
 * a dark cinematic band. This hero is the top of a long scroll story and keeps
 * the PAGE polarity — scrim mixed from --color-bg, copy in --color-fg — so a
 * client whose field is dark gets the dark scene the model describes instead of
 * a white wash over their photos. Either way no literal color ships and the copy
 * keeps the client's own fg/bg contrast ratio, whatever the photo underneath.
 *
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const SCROLL_STORY_HERO_CSS = `
.wf-ssh {
  position: relative;
  background: var(--color-bg);
  color: var(--color-fg);
}

/* The track is the scroll runway: one screen for the first frame plus 70% of a
   screen per extra stage. With a single frame it equals the scene, so sticky is
   a no-op and the hero behaves like a normal full-bleed opening.
   MUST NOT clip (no overflow:hidden on any ancestor of a sticky element). */
.wf-ssh-track {
  height: calc(100vh + (var(--wf-frames) - 1) * 70vh);
  height: calc(100svh + (var(--wf-frames) - 1) * 70svh);
}

.wf-ssh-scene {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  isolation: isolate;
}

.wf-ssh-media {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.wf-ssh-frame {
  position: absolute;
  inset: 0;
  margin: 0;
}

.wf-ssh-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* Scrim in the client's own field color. The stops are a contrast budget, not a
   taste call: text only ever sits in the bottom 60% of the scene, and 86% of the
   field over the WORST case (a blown-out white photo) still leaves 4.7:1 for
   --color-fg copy. Above that line there is no copy, so the scrim opens up and
   the scene reads as a scene. */
.wf-ssh-scene::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-bg) 94%, transparent) 0%,
    color-mix(in srgb, var(--color-bg) 88%, transparent) 45%,
    color-mix(in srgb, var(--color-bg) 86%, transparent) 60%,
    color-mix(in srgb, var(--color-bg) 46%, transparent) 100%
  );
}

/* The nav is the one piece of copy at the TOP of the photo, so it carries its
   own band instead of trusting the open part of the gradient (that is where a
   bright client photo drops a header under 2:1 -- and where axe reports
   "incomplete" rather than a violation, so nothing would catch it). */
.wf-ssh::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 170px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-bg) 94%, transparent) 0%,
    color-mix(in srgb, var(--color-bg) 88%, transparent) 64px,
    transparent 100%
  );
}

.wf-ssh-nav {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1200px, calc(100% - 40px));
  padding: 18px 0;
}

.wf-ssh-brand {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.wf-ssh-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.wf-ssh-nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  font-size: 0.94rem;
}

.wf-ssh-nav-link::after {
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

.wf-ssh-nav-link:hover::after,
.wf-ssh-nav-link:focus-visible::after {
  transform: scaleX(1);
}

.wf-ssh-brand:focus-visible,
.wf-ssh-nav-link:focus-visible,
.wf-ssh-cta:focus-visible,
.wf-ssh-cta-2:focus-visible {
  outline: 2px solid var(--color-fg);
  outline-offset: 3px;
  border-radius: 4px;
}

.wf-ssh-copy {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(40px, 7vw, 88px) 0 clamp(20px, 3vw, 34px);
  --wf-dur: 1s;
  --wf-stag: .1s;
}

.wf-ssh-kicker {
  color: color-mix(in srgb, var(--color-fg) 74%, var(--color-bg));
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.wf-ssh-headline {
  margin: 16px 0 0;
  max-width: 15ch;
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 7.4vw, 5.8rem);
  line-height: 0.96;
  letter-spacing: -0.03em;
  font-weight: 600;
}

/* One span per word: the staggered entrance is markup, so the words stay
   selectable and the screen reader still reads one sentence. */
.wf-ssh-word {
  display: inline-block;
}

.wf-ssh-sub {
  margin-top: 20px;
  max-width: 48ch;
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-bg));
  font-size: clamp(1rem, 1.5vw, 1.16rem);
  line-height: 1.6;
}

.wf-ssh-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.wf-ssh-cta,
.wf-ssh-cta-2 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 26px;
  border-radius: 999px;
  font-weight: 700;
  transition: background-color .3s var(--wf-ease, ease), border-color .3s var(--wf-ease, ease);
}

.wf-ssh-cta {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.wf-ssh-cta:hover {
  background: color-mix(in srgb, var(--color-primary) 86%, var(--color-fg));
}

.wf-ssh-cta-2 {
  border: 1px solid color-mix(in srgb, var(--color-fg) 42%, transparent);
}

.wf-ssh-cta-2:hover {
  border-color: var(--color-fg);
}

.wf-ssh-arrow {
  width: 18px;
  height: 18px;
  transition: transform .3s var(--wf-ease, ease);
}

.wf-ssh-cta:hover .wf-ssh-arrow,
.wf-ssh-cta:focus-visible .wf-ssh-arrow {
  transform: translateX(4px);
}

/* The stage list: the story in text. The active step is marked by weight and a
   filled rule, never by color alone. */
.wf-ssh-steps {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: 0 0 clamp(24px, 4vw, 44px);
  list-style: none;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 0;
}

.wf-ssh-step {
  padding-top: 12px;
  border-top: 2px solid color-mix(in srgb, var(--color-fg) 22%, transparent);
  color: color-mix(in srgb, var(--color-fg) 72%, var(--color-bg));
  transition: color .4s var(--wf-ease, ease), border-color .4s var(--wf-ease, ease);
}

.wf-ssh-step.wf-on {
  border-top-color: var(--color-primary);
  color: var(--color-fg);
}

.wf-ssh-step-n {
  display: block;
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
}

.wf-ssh-step-l {
  display: block;
  margin-top: 4px;
  font-size: 0.95rem;
}

.wf-ssh-step.wf-on .wf-ssh-step-l {
  font-weight: 700;
}

@media (max-width: 760px) {
  .wf-ssh-nav-links {
    display: none;
  }

  .wf-ssh-steps {
    grid-auto-flow: row;
    gap: 2px;
  }

  .wf-ssh-step {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-top: 8px;
  }

  .wf-ssh-step-l {
    margin-top: 0;
  }

  .wf-ssh-cta,
  .wf-ssh-cta-2 {
    flex: 1 1 100%;
  }
}

/* Reduced motion: no runway, no pin, no scrub. One static frame of the scene
   with the headline, the CTAs and the full stage list visible -- the model's own
   fallback, and the reason the stages are text and not just images. */
@media (prefers-reduced-motion: reduce) {
  .wf-ssh-track {
    height: auto;
  }

  .wf-ssh-scene {
    position: static;
    min-height: 100svh;
    height: auto;
  }

  .wf-ssh-nav-link::after,
  .wf-ssh-arrow,
  .wf-ssh-cta,
  .wf-ssh-cta-2,
  .wf-ssh-step {
    transition: none;
  }

  .wf-ssh-cta:hover .wf-ssh-arrow {
    transform: none;
  }
}
`.trim();

// Editorial real-estate styles. Warm terracotta/sand/charcoal palette (never
// the clinic's blue/teal), oversized display type, and a cropped-wordmark
// rhythm break with no equivalent in the clinic vertical. Tokens only.
export const realtyCss = `
.wf-realty-page {
  --realty-ink-accent: color-mix(in srgb, var(--color-primary) 65%, var(--color-fg));
  --wrap: min(1180px, calc(100% - 40px));
  overflow-x: hidden;
}

.wf-icon { width: 1.2em; height: 1.2em; flex: 0 0 auto; }

/* ---------- Hero ---------- */
.wf-realty-hero {
  position: relative;
  min-height: 94svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  padding-bottom: clamp(96px, 14vw, 160px);
}

.wf-realty-hero-media {
  position: absolute;
  inset: -6% 0;
  height: 112%;
  z-index: 0;
  background: color-mix(in srgb, var(--color-primary) 30%, #1a120b);
}

.wf-realty-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wf-realty-hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(20, 12, 6, 0.55) 0%, rgba(20, 12, 6, 0.1) 32%, rgba(20, 12, 6, 0.3) 58%, rgba(20, 12, 6, 0.88) 100%);
}

.wf-realty-nav {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: 0 auto;
  padding-top: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wf-realty-brand {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #fff;
}

.wf-realty-nav-cta {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 4px;
  font-weight: 700;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.wf-realty-hero-content {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: 0 auto;
  max-width: 880px;
  padding-top: 40px;
}

.wf-realty-hero-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(3rem, 7.5vw, 6.5rem);
  line-height: 0.94;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #fff;
  text-wrap: balance;
  text-shadow: 0 2px 30px rgba(20, 12, 6, 0.4);
}

.wf-realty-hero-lede {
  margin: 22px 0 0;
  max-width: 46ch;
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.88);
}

/* ---------- Floating search panel ---------- */
.wf-realty-search {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: clamp(28px, 4vw, 44px) auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 1px;
  border-radius: 6px;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-fg) 12%, transparent);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.wf-realty-search-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  background: var(--color-bg);
}

.wf-realty-search-field span {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}

.wf-realty-search-field select {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: var(--color-fg);
  padding: 0;
}

.wf-realty-search-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 0 28px;
  border: 0;
  font-weight: 750;
  color: var(--color-on-primary);
  background: var(--color-primary);
  cursor: pointer;
}

/* ---------- Section shell ---------- */
.wf-realty-section {
  width: var(--wrap);
  margin: 0 auto;
  padding-block: clamp(56px, 8vw, 100px);
}

.wf-realty-section-head {
  max-width: 720px;
  margin-bottom: clamp(28px, 3.5vw, 48px);
}

.wf-realty-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--realty-ink-accent);
}

.wf-realty-kicker::before { content: ""; width: 26px; height: 2px; background: var(--color-primary); }

.wf-realty-section-head h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--color-fg);
}

/* ---------- Wordmark break ---------- */
.wf-realty-wordmark {
  width: 100%;
  padding-block: clamp(30px, 6vw, 70px);
  display: grid;
  place-items: center;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg));
}

.wf-realty-wordmark-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(4.5rem, 18vw, 13rem);
  line-height: 0.85;
  letter-spacing: -0.03em;
  color: var(--color-primary);
  white-space: nowrap;
  user-select: none;
}

.wf-realty-wordmark-stats {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 28px;
  font-weight: 700;
  color: var(--color-fg);
}

/* ---------- Listings ---------- */
.wf-realty-listing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.wf-realty-listing-card {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wf-realty-listing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 44px color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-realty-listing--featured {
  grid-column: span 2;
  grid-row: span 2;
}

.wf-realty-listing-media {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 3;
  background: color-mix(in srgb, var(--color-primary) 14%, var(--color-bg));
}

.wf-realty-listing--featured .wf-realty-listing-media { aspect-ratio: 16 / 11; }

.wf-realty-listing-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

.wf-realty-listing-media--empty { width: 100%; height: 100%; }

.wf-realty-listing-price {
  position: absolute;
  left: 14px;
  bottom: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 800;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  color: var(--color-fg);
}

.wf-realty-listing-op {
  position: absolute;
  right: 14px;
  top: 14px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-realty-listing-body { padding: 16px 18px 20px; }

.wf-realty-listing-body h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  color: var(--color-fg);
}

.wf-realty-listing--featured .wf-realty-listing-body h3 { font-size: clamp(1.4rem, 2vw, 1.9rem); }

.wf-realty-listing-zone {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

.wf-realty-listing-meta {
  margin: 4px 0 0;
  color: var(--muted-foreground);
  font-size: 0.85rem;
}

.wf-realty-empty {
  padding: 40px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 6px;
  color: var(--muted-foreground);
}

/* ---------- Zones ---------- */
.wf-realty-zone-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wf-realty-zone-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-weight: 650;
  color: var(--color-fg);
}

.wf-realty-zone-chip .wf-icon { color: var(--realty-ink-accent); }

/* ---------- Final CTA ---------- */
.wf-realty-final-cta {
  margin-block: clamp(50px, 7vw, 90px);
  padding: clamp(44px, 6vw, 80px);
  border-radius: 6px;
  background: linear-gradient(150deg, var(--color-primary), color-mix(in srgb, var(--color-secondary) 65%, var(--color-primary)));
  color: var(--color-on-primary);
  text-align: center;
}

.wf-realty-final-cta h2 {
  margin: 0 0 24px;
  max-width: 20ch;
  margin-inline: auto;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.03;
  color: var(--color-on-primary);
}

.wf-realty-final-cta .wf-realty-final-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 26px;
  border-radius: 4px;
  font-weight: 750;
  color: var(--color-primary);
  background: var(--color-on-primary);
}

/* ---------- Sticky WhatsApp (shared class already styled elsewhere; keep selector local override minimal) ---------- */

/* ---------- Motion ---------- */
.wf-realty-motion [data-reveal] { opacity: 0; transform: translateY(20px); }
.wf-realty-motion [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .wf-realty-hero-media {
      animation: wfRealtyParallax linear both;
      animation-timeline: scroll(root);
      animation-range: 0 90vh;
    }
  }
}

@keyframes wfRealtyParallax { from { transform: translateY(0); } to { transform: translateY(7%); } }

@media (prefers-reduced-motion: reduce) {
  .wf-realty-motion [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
}

/* ---------- Responsive ---------- */
@media (max-width: 1080px) {
  .wf-realty-listing-grid { grid-template-columns: repeat(2, 1fr); }
  .wf-realty-listing--featured { grid-column: 1 / -1; grid-row: auto; }
  .wf-realty-search { grid-template-columns: 1fr 1fr; }
  .wf-realty-search-submit { grid-column: 1 / -1; }
}

@media (max-width: 640px) {
  .wf-realty-listing-grid { grid-template-columns: 1fr; }
  .wf-realty-search { grid-template-columns: 1fr; }
  .wf-realty-nav-cta { display: none; }
}
`;

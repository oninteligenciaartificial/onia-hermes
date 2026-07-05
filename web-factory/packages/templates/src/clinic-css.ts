// Editorial clinic styles. Tokens only, no hardcoded client colors. Text colors
// derive from --color-fg (and an adaptive primary/fg mix for accents) so they
// keep contrast in both light and dark. Motion is opt-in and reduced-motion safe.
export const clinicCss = `
.wf-clinic-page {
  --ink-accent: color-mix(in srgb, var(--color-primary) 62%, var(--color-fg));
  --wrap: min(1180px, calc(100% - 40px));
  overflow-x: hidden;
}

.wf-clinic-hero,
.wf-clinic-section,
.wf-clinic-strip,
.wf-clinic-final {
  width: var(--wrap);
  margin-inline: auto;
}

.wf-icon {
  width: 1.2em;
  height: 1.2em;
  flex: 0 0 auto;
}

/* ---------- Hero ---------- */
.wf-clinic-hero {
  position: relative;
  padding-block: clamp(20px, 4vw, 40px) clamp(48px, 7vw, 96px);
}

.wf-clinic-hero-bg {
  position: absolute;
  inset: -10% -20% auto;
  height: 120%;
  z-index: 0;
  background:
    radial-gradient(55% 55% at 12% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 70%),
    radial-gradient(48% 58% at 102% 12%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 72%);
}

.wf-clinic-hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--color-fg) 16%, transparent) 1px, transparent 1.4px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(70% 60% at 50% 8%, #000, transparent 78%);
  mask-image: radial-gradient(70% 60% at 50% 8%, #000, transparent 78%);
  opacity: 0.45;
}

.wf-clinic-topbar,
.wf-clinic-hero-grid {
  position: relative;
  z-index: 1;
}

.wf-clinic-topbar {
  display: flex;
  align-items: center;
  height: 60px;
}

.wf-clinic-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-family: var(--font-heading);
}

.wf-clinic-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  font-size: 0.82rem;
  color: var(--color-on-primary);
  background: var(--color-primary);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-primary) 32%, transparent);
}

.wf-clinic-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
  padding-top: clamp(24px, 4vw, 48px);
}

.wf-clinic-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 20px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--color-bg) 60%, transparent);
  font-size: 0.86rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-fg) 78%, var(--color-bg));
}

.wf-clinic-eyebrow .wf-icon {
  color: var(--ink-accent);
}

.wf-clinic-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-fg) 40%, var(--color-bg));
}

.wf-clinic-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.7rem, 6vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: -0.025em;
  font-weight: 820;
  color: var(--color-fg);
}

.wf-clinic-lede {
  margin: 22px 0 0;
  max-width: 44ch;
  font-size: clamp(1.05rem, 1.4vw, 1.22rem);
  line-height: 1.6;
  color: color-mix(in srgb, var(--color-fg) 72%, var(--color-bg));
}

.wf-clinic-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.wf-clinic-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  min-height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  font-weight: 750;
  font-size: 1.02rem;
  cursor: pointer;
}

.wf-clinic-btn--primary {
  color: var(--color-on-primary);
  background: var(--color-primary);
  box-shadow: 0 16px 38px color-mix(in srgb, var(--color-primary) 32%, transparent);
}

.wf-clinic-btn--ghost {
  color: var(--color-fg);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--color-bg) 70%, transparent);
}

.wf-clinic-hero-trust {
  list-style: none;
  margin: 30px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 22px;
}

.wf-clinic-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-bg));
}

.wf-clinic-badge-icon {
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 10px;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 12%, var(--color-bg));
}

.wf-clinic-hero-media {
  position: relative;
}

.wf-clinic-hero-figure {
  margin: 0;
  aspect-ratio: 4 / 5;
  border-radius: calc(var(--radius) * 1.4);
  overflow: hidden;
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-bg));
  box-shadow: 0 40px 90px color-mix(in srgb, var(--color-fg) 18%, transparent);
}

.wf-clinic-hero-figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wf-clinic-hero-card {
  position: absolute;
  left: clamp(-8px, -2vw, 0px);
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 10%, transparent);
  background: color-mix(in srgb, var(--color-bg) 74%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 50px color-mix(in srgb, var(--color-fg) 20%, transparent);
  max-width: 300px;
}

.wf-clinic-hero-card-pulse {
  position: relative;
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--color-accent);
}

.wf-clinic-hero-card-text strong {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  color: var(--color-fg);
}

.wf-clinic-hero-card-text p {
  margin: 2px 0 0;
  font-size: 0.86rem;
  line-height: 1.4;
  color: color-mix(in srgb, var(--color-fg) 68%, var(--color-bg));
}

.wf-clinic-hero-card-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 50%;
  color: var(--color-on-primary);
  background: var(--color-primary);
}

/* ---------- Strip (beneficios) ---------- */
.wf-clinic-strip {
  position: relative;
  z-index: 1;
  margin-top: clamp(28px, 4vw, 44px);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--color-bg) 55%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.wf-clinic-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 15px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-bg));
  color: color-mix(in srgb, var(--color-fg) 85%, var(--color-bg));
  font-weight: 600;
  font-size: 0.9rem;
}

.wf-clinic-chip .wf-icon {
  color: color-mix(in srgb, var(--color-accent) 60%, var(--color-fg));
}

/* ---------- Section head ---------- */
.wf-clinic-section {
  padding-block: clamp(48px, 7vw, 90px);
}

.wf-clinic-section-head {
  max-width: 720px;
  margin-bottom: clamp(24px, 3vw, 42px);
}

.wf-clinic-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ink-accent);
}

.wf-clinic-kicker::before {
  content: "";
  width: 24px;
  height: 2px;
  background: var(--color-primary);
}

.wf-clinic-section-head h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 3.6vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-fg);
}

/* ---------- Bento services ---------- */
.wf-clinic-bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: 16px;
}

.wf-clinic-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.wf-clinic-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--color-primary) 42%, var(--border));
  box-shadow: 0 20px 44px color-mix(in srgb, var(--color-fg) 12%, transparent);
}

.wf-clinic-card--featured {
  grid-column: span 2;
  grid-row: span 2;
  justify-content: space-between;
  background: linear-gradient(155deg, color-mix(in srgb, var(--color-primary) 15%, var(--color-bg)), var(--card) 65%);
  border-color: color-mix(in srgb, var(--color-primary) 26%, var(--border));
}

.wf-clinic-card-icon {
  display: inline-flex;
  width: 52px;
  height: 52px;
  padding: 13px;
  border-radius: 14px;
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-clinic-card-icon .wf-icon {
  width: 100%;
  height: 100%;
}

.wf-clinic-card--featured .wf-clinic-card-icon {
  width: 64px;
  height: 64px;
  padding: 16px;
}

.wf-clinic-card h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-fg);
}

.wf-clinic-card--featured h3 {
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
}

.wf-clinic-card p {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  line-height: 1.55;
}

/* ---------- Process timeline ---------- */
.wf-clinic-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
}

.wf-clinic-timeline::before {
  content: "";
  position: absolute;
  top: 26px;
  left: 8%;
  right: 8%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--border) 15%, var(--border) 85%, transparent);
}

.wf-clinic-step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wf-clinic-step-num {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  font-family: var(--font-heading);
  font-weight: 820;
  color: var(--ink-accent);
  background: var(--color-bg);
  border: 2px solid color-mix(in srgb, var(--color-primary) 45%, var(--border));
}

.wf-clinic-step h3 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--color-fg);
}

.wf-clinic-step p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.55;
}

/* ---------- FAQ ---------- */
.wf-clinic-faq-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
}

.wf-clinic-faq-aside h2 {
  margin: 0 0 14px;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-fg);
}

.wf-clinic-faq-aside p {
  margin: 0 0 20px;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.wf-clinic-faq-list {
  display: grid;
  gap: 12px;
}

.wf-clinic-faq-item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  overflow: hidden;
}

.wf-clinic-faq-item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  cursor: pointer;
  font-weight: 700;
  color: var(--color-fg);
  list-style: none;
}

.wf-clinic-faq-item summary::-webkit-details-marker {
  display: none;
}

.wf-clinic-faq-item summary::after {
  content: "+";
  color: var(--ink-accent);
  font-weight: 850;
  font-size: 1.3rem;
}

.wf-clinic-faq-item[open] summary::after {
  content: "-";
}

.wf-clinic-faq-item p {
  margin: 0;
  padding: 0 20px 20px;
  color: var(--muted-foreground);
  line-height: 1.6;
}

/* ---------- Final CTA ---------- */
.wf-clinic-final {
  margin-block: clamp(40px, 6vw, 80px);
  padding: clamp(40px, 6vw, 76px);
  border-radius: calc(var(--radius) * 1.7);
  background: linear-gradient(150deg, var(--color-primary), color-mix(in srgb, var(--color-secondary) 70%, var(--color-primary)));
  color: var(--color-on-primary);
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 34px 80px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.wf-clinic-final::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, #ffffff 22%, transparent) 1px, transparent 1.4px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(60% 80% at 90% 0%, #000, transparent 70%);
  mask-image: radial-gradient(60% 80% at 90% 0%, #000, transparent 70%);
  opacity: 0.5;
}

.wf-clinic-final-inner {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 24px;
}

.wf-clinic-final h2 {
  margin: 0;
  max-width: 18ch;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--color-on-primary);
}

.wf-clinic-final .wf-clinic-btn--primary {
  color: var(--color-primary);
  background: var(--color-on-primary);
  box-shadow: 0 18px 40px color-mix(in srgb, #000000 22%, transparent);
}

/* ---------- Sticky WhatsApp ---------- */
.wf-sticky-cta {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  font-weight: 800;
  color: var(--color-on-primary);
  background: var(--color-primary);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--color-primary) 36%, transparent);
}

@media (min-width: 841px) {
  .wf-sticky-cta { right: 24px; bottom: 24px; }
}

/* ---------- Motion ---------- */
.wf-clinic-motion [data-reveal] {
  opacity: 0;
  transform: translateY(20px);
}

.wf-clinic-motion [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: no-preference) {
  .wf-clinic-hero-card-pulse::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--color-accent);
    animation: wfClinicPulse 2s ease-out infinite;
  }
  .wf-clinic-btn,
  .wf-clinic-hero-card-btn,
  .wf-sticky-cta {
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .wf-clinic-btn:hover,
  .wf-sticky-cta:hover { transform: translateY(-2px); }
  .wf-clinic-hero-card-btn:hover { transform: scale(1.08); }
}

@keyframes wfClinicPulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .wf-clinic-motion [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  html { scroll-behavior: auto; }
}

/* ---------- Responsive ---------- */
@media (max-width: 1080px) {
  .wf-clinic-bento { grid-template-columns: repeat(2, 1fr); }
  .wf-clinic-card--featured { grid-column: 1 / -1; grid-row: auto; }
}

@media (max-width: 860px) {
  .wf-clinic-hero-grid { grid-template-columns: 1fr; }
  .wf-clinic-hero-media { order: -1; }
  .wf-clinic-hero-figure { aspect-ratio: 16 / 11; }
  .wf-clinic-faq-grid { grid-template-columns: 1fr; }
  .wf-clinic-timeline { grid-template-columns: 1fr; gap: 0; }
  .wf-clinic-timeline::before {
    top: 0; bottom: 0; left: 26px; right: auto; width: 2px; height: auto;
    background: var(--border);
  }
  .wf-clinic-step { flex-direction: row; gap: 16px; padding-bottom: 26px; }
  .wf-clinic-step-num { flex: 0 0 auto; }
}

@media (max-width: 560px) {
  .wf-clinic-bento { grid-template-columns: 1fr; }
  .wf-clinic-card--featured { grid-column: auto; }
  .wf-clinic-hero-card { position: static; margin-top: 14px; max-width: none; }
}
`;

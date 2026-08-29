// Editorial clinic styles. Tokens for the page body (light/dark safe via
// color-mix on --color-fg/--color-bg); the full-bleed hero sits over a photo so
// its text is white on a scrim. Scroll-driven parallax + image reveals are
// progressive (only under @supports + no-reduced-motion); IO reveals have a
// visible-by-default fallback.
export const clinicCss = `
.wf-clinic-page {
  --ink-accent: color-mix(in srgb, var(--color-primary) 62%, var(--color-fg));
  --wrap: min(1180px, calc(100% - 40px));
  overflow-x: hidden;
}

.wf-clinic-section,
.wf-clinic-final {
  width: var(--wrap);
  margin-inline: auto;
}

.wf-icon { width: 1.2em; height: 1.2em; flex: 0 0 auto; }

.wf-clinic-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  min-height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  font-weight: 650;
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

.wf-clinic-btn--glass {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.14);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

/* ---------- Full-bleed hero ---------- */
.wf-clinic-hero {
  position: relative;
  min-height: 92svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
}

.wf-clinic-hero-media {
  position: absolute;
  inset: -6% 0;
  height: 112%;
  z-index: 0;
  background: color-mix(in srgb, var(--color-primary) 22%, #0b0f14);
}

.wf-clinic-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wf-clinic-hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(94deg, rgba(6, 12, 18, 0.62) 0%, rgba(6, 12, 18, 0.2) 40%, transparent 66%),
    linear-gradient(180deg, rgba(6, 12, 18, 0.45) 0%, rgba(6, 12, 18, 0.08) 24%, rgba(6, 12, 18, 0.34) 52%, rgba(6, 12, 18, 0.85) 100%);
}

.wf-clinic-nav {
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

.wf-clinic-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-family: var(--font-heading);
  color: #fff;
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
}

.wf-clinic-nav-cta {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 999px;
  font-weight: 700;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.12);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.wf-clinic-hero-content {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: 0 auto;
  padding: 40px 0 clamp(40px, 6vw, 72px);
  max-width: 900px;
}

.wf-clinic-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 20px;
  padding: 8px 15px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.12);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  font-size: 0.86rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.94);
}

.wf-clinic-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

.wf-clinic-hero-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.9rem, 7vw, 6rem);
  line-height: 0.96;
  letter-spacing: -0.025em;
  font-weight: 450;
  color: #fff;
  text-wrap: balance;
  text-shadow: 0 2px 34px rgba(6, 12, 18, 0.42);
}

.wf-clinic-hero-lede {
  margin: 22px 0 0;
  max-width: 46ch;
  font-size: clamp(1.05rem, 1.5vw, 1.3rem);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 18px rgba(6, 12, 18, 0.5);
}

.wf-clinic-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.wf-clinic-hero-trust {
  list-style: none;
  margin: 30px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.wf-clinic-hero-trust .wf-clinic-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.94);
}

.wf-clinic-hero-trust .wf-clinic-badge-icon {
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 10px;
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
}

/* ---------- Benefits strip ---------- */
/* Antes: tarjeta glass flotando sobre el hero (blur + sombra + pills). Se leia
   como widget suelto y era el unico elemento con sombra dura de la pagina.
   Ahora: banda editorial full-bleed en la tinta de marca, pegada al hero — el
   corte de color ES la profundidad, y las tres promesas quedan como micro-
   etiquetas de manifiesto, no como chips de app. */
.wf-clinic-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px clamp(18px, 4vw, 56px);
  justify-content: center;
  padding: 16px clamp(16px, 4vw, 48px);
  background: var(--color-secondary);
}

.wf-clinic-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: color-mix(in srgb, var(--color-bg) 92%, var(--color-secondary));
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.wf-clinic-chip .wf-icon { color: var(--color-accent); }

/* ---------- Section head ---------- */
.wf-clinic-section { padding-block: clamp(48px, 7vw, 92px); }

.wf-clinic-section-head { max-width: 720px; margin-bottom: clamp(24px, 3vw, 42px); }

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

/* El guion del kicker es el punto de temperatura de la marca: acento, no
   primario — si todo es primario, el acento del intake no existe en pantalla. */
.wf-clinic-kicker::before { content: ""; width: 24px; height: 2px; background: var(--color-accent); }

.wf-clinic-section-head h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 3.6vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-fg);
}

/* ---------- Editorial feature (big image) ---------- */
.wf-clinic-feature-grid {
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
}

.wf-clinic-feature-media {
  margin: 0;
  border-radius: calc(var(--radius) * 1.4);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  box-shadow: 0 40px 90px color-mix(in srgb, var(--color-fg) 20%, transparent);
}

.wf-clinic-feature-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

.wf-clinic-feature-copy h2 {
  margin: 0 0 16px;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 3.4vw, 2.9rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--color-fg);
}

.wf-clinic-feature-copy > p {
  margin: 0 0 20px;
  color: var(--muted-foreground);
  line-height: 1.65;
  max-width: 46ch;
}

.wf-clinic-feature-points {
  list-style: none;
  margin: 0 0 26px;
  padding: 0;
  display: grid;
  gap: 12px;
}

.wf-clinic-feature-points li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-fg) 86%, var(--color-bg));
}

.wf-clinic-feature-points .wf-icon {
  width: 34px;
  height: 34px;
  padding: 8px;
  border-radius: 10px;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 12%, var(--color-bg));
}

/* ---------- Bento services ---------- */
.wf-clinic-bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: 16px;
}

.wf-clinic-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

/* Franja de foto en la celda destacada: SOLO en el layout ancho donde la celda
   es 2x2 y existe el vacio. La foto vive arriba y se funde al color de la
   tarjeta antes de llegar al texto — el copy nunca pisa imagen. */
@media (min-width: 1081px) {
  .wf-clinic-card--media { overflow: hidden; }
  .wf-clinic-card--media::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 58%;
    background-image: var(--wf-card-media);
    background-size: cover;
    background-position: center 35%;
  }
  .wf-clinic-card--media::after {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 58%;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-primary) 26%, transparent),
      color-mix(in srgb, var(--card) 40%, transparent) 70%,
      var(--card) 99%
    );
  }
  .wf-clinic-card--media .wf-clinic-card-icon,
  .wf-clinic-card--media .wf-clinic-card-body {
    position: relative;
    z-index: 1;
  }
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

.wf-clinic-card-icon .wf-icon { width: 100%; height: 100%; }
.wf-clinic-card--featured .wf-clinic-card-icon { width: 64px; height: 64px; padding: 16px; }

.wf-clinic-card h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-fg);
}

.wf-clinic-card--featured h3 { font-size: clamp(1.6rem, 2.4vw, 2.1rem); }

.wf-clinic-card p { margin: 6px 0 0; color: var(--muted-foreground); line-height: 1.55; }

/* ---------- Pedido / cotizacion (inline-quote-form dentro del clinic) ------ */
/* El bloque trae su CSS tokenizado; aca solo se asienta en el ritmo del
   template: superficie propia que corta el papel y respiracion de seccion. */
.wf-clinic-quote {
  background: color-mix(in srgb, var(--color-primary) 6%, var(--color-bg));
  border-block: 1px solid color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.wf-clinic-quote .wf-qf-heading {
  font-weight: 480;
  letter-spacing: -0.015em;
}

/* Sin form (accion vacia) el bloque deja solo la columna de copy+canales: la
   grilla de dos columnas dejaria media seccion vacia. Una columna por defecto;
   dos SOLO cuando el form existe. */
.wf-clinic-quote .wf-qf-inner {
  grid-template-columns: minmax(0, 1fr);
  max-width: 620px;
  margin-inline: auto;
  text-align: center;
}

.wf-clinic-quote .wf-qf-inner .wf-qf-heading {
  max-width: none;
  margin-inline: auto;
}

.wf-clinic-quote .wf-qf-inner .wf-qf-lede {
  margin-inline: auto;
}

.wf-clinic-quote .wf-qf-direct-list {
  justify-content: center;
}

.wf-clinic-quote .wf-qf-inner:has(.wf-qf-form) {
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  max-width: none;
  margin-inline: 0;
  text-align: left;
}

.wf-clinic-quote .wf-qf-inner:has(.wf-qf-form) .wf-qf-lede,
.wf-clinic-quote .wf-qf-inner:has(.wf-qf-form) .wf-qf-heading {
  margin-inline: 0;
}

.wf-clinic-quote .wf-qf-inner:has(.wf-qf-form) .wf-qf-direct-list {
  justify-content: flex-start;
}

/* ---------- Footer (polish clinic) ---------- */
/* El minimal compartido quedaba en dos columnas flojas. Dentro del clinic:
   marca en serif con aire, contacto como columna etiquetada, borde superior
   que cierra la pagina. Scoped a .wf-clinic-page: ningun otro template cambia. */
.wf-clinic-page .wf-footer {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(40px, 6vw, 72px) 0 clamp(28px, 4vw, 44px);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 64px);
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
}

.wf-clinic-page .wf-footer > div > strong {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 640;
  letter-spacing: -0.01em;
}

.wf-clinic-page .wf-footer > div > p {
  margin: 10px 0 0;
  max-width: 46ch;
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  line-height: 1.6;
}

.wf-clinic-page .wf-footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.wf-clinic-page .wf-footer-links a {
  color: var(--color-fg);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 45%, transparent);
  transition: border-color 0.2s ease;
}

.wf-clinic-page .wf-footer-links a:hover,
.wf-clinic-page .wf-footer-links a:focus-visible {
  border-bottom-color: var(--color-accent);
}

.wf-clinic-page .wf-footer-links span {
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
}

@media (max-width: 720px) {
  .wf-clinic-page .wf-footer { grid-template-columns: 1fr; }
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

.wf-clinic-step { position: relative; display: flex; flex-direction: column; gap: 12px; }

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
  font-weight: 560;
  color: var(--ink-accent);
  background: var(--color-bg);
  border: 2px solid color-mix(in srgb, var(--color-accent) 55%, var(--border));
}

.wf-clinic-step h3 { margin: 0; font-size: 1.15rem; color: var(--color-fg); }
.wf-clinic-step p { margin: 0; color: var(--muted-foreground); line-height: 1.55; }

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

.wf-clinic-faq-aside p { margin: 0 0 20px; color: var(--muted-foreground); line-height: 1.6; }

.wf-clinic-faq-list { display: grid; gap: 12px; }

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

.wf-clinic-faq-item summary::-webkit-details-marker { display: none; }
.wf-clinic-faq-item summary::after { content: "+"; color: var(--ink-accent); font-weight: 850; font-size: 1.3rem; }
.wf-clinic-faq-item[open] summary::after { content: "-"; }
.wf-clinic-faq-item p { margin: 0; padding: 0 20px 20px; color: var(--muted-foreground); line-height: 1.6; }

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

.wf-clinic-final-inner { position: relative; z-index: 1; display: grid; justify-items: center; gap: 24px; }

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

@media (min-width: 841px) { .wf-sticky-cta { right: 24px; bottom: 24px; } }

/* The bar is position:fixed with nothing reserving its space, so at 390px it
   overlapped real content at every scroll position (hero chip 39x38px, service
   h3 + copy 111px wide, body copy 136x48px, and the last 64px of the footer).
   Below 560px it becomes a full-bleed conversion bar — readable as page chrome
   instead of a pill floating mid-paragraph — and the page reserves its height
   so the end of the document always clears it. */
@media (max-width: 560px) {
  .wf-sticky-cta {
    left: 12px;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    justify-content: center;
    min-height: 52px;
  }

  .wf-clinic-page {
    padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  }
}

/* ---------- Motion: IO reveals (visible-by-default fallback) ---------- */
.wf-clinic-motion [data-reveal] { opacity: 0; transform: translateY(22px); }
.wf-clinic-motion [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ---------- Motion: scroll-driven parallax + image reveal ---------- */
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .wf-clinic-hero-media {
      animation: wfHeroParallax linear both;
      animation-timeline: scroll(root);
      animation-range: 0 90vh;
      will-change: transform;
    }
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal-img] img {
      animation: wfImgReveal linear both;
      animation-timeline: view();
      animation-range: entry 4% cover 42%;
      transform-origin: center;
    }
  }
}

@keyframes wfHeroParallax { from { transform: translateY(0); } to { transform: translateY(6%); } }
@keyframes wfImgReveal {
  from { clip-path: inset(0 0 16% 0); transform: scale(1.08); }
  to { clip-path: inset(0 0 0 0); transform: scale(1); }
}

@media (prefers-reduced-motion: no-preference) {
  .wf-clinic-btn, .wf-clinic-nav-cta, .wf-sticky-cta { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .wf-clinic-btn:hover, .wf-clinic-nav-cta:hover, .wf-sticky-cta:hover { transform: translateY(-2px); }
}

@media (prefers-reduced-motion: reduce) {
  .wf-clinic-motion [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
  html { scroll-behavior: auto; }
}

/* ---------- Responsive ---------- */
@media (max-width: 1080px) {
  .wf-clinic-bento { grid-template-columns: repeat(2, 1fr); }
  .wf-clinic-card--featured { grid-column: 1 / -1; grid-row: auto; }
}

@media (max-width: 860px) {
  .wf-clinic-hero { min-height: 88svh; }
  .wf-clinic-feature-grid { grid-template-columns: 1fr; }
  .wf-clinic-feature-media { order: -1; }
  .wf-clinic-faq-grid { grid-template-columns: 1fr; }
  .wf-clinic-timeline { grid-template-columns: 1fr; gap: 0; }
  .wf-clinic-timeline::before { top: 0; bottom: 0; left: 26px; right: auto; width: 2px; height: auto; background: var(--border); }
  .wf-clinic-step { flex-direction: row; gap: 16px; padding-bottom: 26px; }
  .wf-clinic-step-num { flex: 0 0 auto; }
}

@media (max-width: 560px) {
  .wf-clinic-bento { grid-template-columns: 1fr; }
  .wf-clinic-card--featured { grid-column: auto; }
  .wf-clinic-nav-cta { display: none; }
}
`;

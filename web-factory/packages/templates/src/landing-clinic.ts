import {
  escapeAttribute,
  escapeHtml,
  renderFaq,
  renderFeatures,
  renderFooter,
  renderHero,
  renderProcess,
  renderStickyCta,
  renderTrust,
} from "@onia/blocks";
import { renderLandingCss, type LandingClient } from "./landing";

// Clinic/Health vertical (Pattern Bank "Fast Landing"): hero -> trust -> offer
// -> process -> faq -> final CTA, plus a persistent WhatsApp CTA. Focus hero
// (no nav) keeps a single conversion intent. Reuses landing CSS + clinic CSS.
function renderFinalCta(client: LandingClient): string {
  return `
    <section class="wf-final-cta" aria-labelledby="wf-final-cta-heading">
      <h2 id="wf-final-cta-heading">${escapeHtml(client.tagline)}</h2>
      <a class="wf-button-primary" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
    </section>
  `;
}

export function renderLandingClinicBody(client: LandingClient): string {
  return `
    <main class="wf-page wf-page--focus wf-page--clinic" id="top">
      ${renderHero(client, { focus: true })}
      ${renderTrust(client)}
      ${renderFeatures(client)}
      ${renderProcess(client)}
      ${renderFaq(client)}
      ${renderFinalCta(client)}
      ${renderFooter(client, { minimal: true })}
    </main>
    ${renderStickyCta(client)}
  `;
}

export function renderLandingClinicCss(client: LandingClient): string {
  return `${renderLandingCss(client)}

${clinicExtraCss}`;
}

export function renderLandingClinicDocument(client: LandingClient): string {
  const ogImage = client.seo.ogImage
    ? `<meta property="og:image" content="${escapeHtml(client.seo.ogImage)}">`
    : "";

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(client.seo.title)}</title>
    <meta name="description" content="${escapeHtml(client.seo.description)}">
    <meta property="og:title" content="${escapeHtml(client.seo.title)}">
    <meta property="og:description" content="${escapeHtml(client.seo.description)}">
    ${ogImage}
    <link rel="stylesheet" href="./site.css">
  </head>
  <body>
    ${renderLandingClinicBody(client)}
  </body>
</html>
`;
}

// Clinic-specific styles. Tokens only, no hardcoded client colors. Motion is
// minimal (Pattern Bank motion=2) and respects prefers-reduced-motion.
const clinicExtraCss = `
.wf-proof-points {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.wf-proof-points li {
  position: relative;
  padding-left: 26px;
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-bg));
  line-height: 1.5;
}

.wf-proof-points li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--color-primary);
}

.wf-trust {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 20px 0 4px;
}

.wf-trust-list {
  margin: 0;
  padding: 18px 22px;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px 24px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
}

.wf-trust-item {
  position: relative;
  padding-left: 24px;
  font-weight: 650;
  color: var(--color-secondary);
}

.wf-trust-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--color-accent) 70%, var(--color-primary));
}

.wf-process-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.wf-process-step {
  padding: 22px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
}

.wf-process-number {
  color: var(--color-primary);
  font-weight: 850;
  font-size: 0.9rem;
  letter-spacing: 0;
}

.wf-process-title {
  margin: 8px 0 6px;
  color: var(--color-secondary);
  font-size: 1.2rem;
}

.wf-faq-list {
  display: grid;
  gap: 10px;
  max-width: 820px;
}

.wf-faq-item {
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  overflow: hidden;
}

.wf-faq-question {
  padding: 16px 20px;
  cursor: pointer;
  font-weight: 700;
  color: var(--color-secondary);
  list-style: none;
}

.wf-faq-question::-webkit-details-marker {
  display: none;
}

.wf-faq-question::after {
  content: "+";
  float: right;
  color: var(--color-primary);
  font-weight: 850;
}

.wf-faq-item[open] .wf-faq-question::after {
  content: "-";
}

.wf-faq-answer {
  margin: 0;
  padding: 0 20px 18px;
  color: color-mix(in srgb, var(--color-fg) 72%, var(--color-bg));
  line-height: 1.6;
}

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
  box-shadow: 0 14px 34px color-mix(in srgb, var(--color-primary) 34%, transparent);
}

@media (min-width: 841px) {
  .wf-sticky-cta {
    right: 24px;
    bottom: 24px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .wf-sticky-cta {
    transition: transform var(--duration-fast, 150ms) ease;
  }

  .wf-sticky-cta:hover {
    transform: translateY(-2px);
  }
}
`;

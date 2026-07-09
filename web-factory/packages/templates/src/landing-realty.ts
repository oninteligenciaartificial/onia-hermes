import {
  escapeAttribute,
  escapeHtml,
  renderFooter,
  renderListings,
  renderMarquee,
  renderProcess,
  renderRealtyHero,
  renderStickyCta,
  renderWordmarkBreak,
  renderZones,
} from "@onia/blocks";
import { renderLandingCss, type LandingClient } from "./landing";
import { realtyCss } from "./realty-css";

// Real-estate multi-listing agency vertical. Deliberately different UI from
// landing-clinic: cinematic hero + floating search (not a booking glass card),
// an editorial cropped-wordmark rhythm break (no clinic equivalent), and
// photo-first listing cards (never icon+text). Reuses only the generic,
// already-proven blocks: process timeline, marquee, footer, sticky CTA.
// Reuses landing CSS tokens/base + realty CSS.

function renderRealtyFinalCta(client: LandingClient): string {
  return `
    <section class="wf-realty-final-cta" aria-labelledby="wf-realty-final-h">
      <h2 id="wf-realty-final-h">${escapeHtml(client.tagline)}</h2>
      <a class="wf-realty-final-btn" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
    </section>
  `;
}

// Trust strip: a marquee of the client's benefits, only when non-empty. Reuses
// the generic marquee block; no fabricated seals when the client has none.
function renderRealtyTrust(client: LandingClient): string {
  const items = (client.beneficios ?? []).filter((item) => item.trim().length > 0);
  if (items.length === 0) return "";
  return `<div class="wf-realty-section" style="padding-block: 20px 0;">${renderMarquee(items, { icon: "check", label: "Por que elegirnos" })}</div>`;
}

export function renderLandingRealtyBody(client: LandingClient): string {
  return `
    <main class="wf-realty-page wf-realty-motion">
      ${renderRealtyHero(client)}
      ${renderRealtyTrust(client)}
      ${renderWordmarkBreak(client)}
      ${renderListings(client)}
      ${renderProcess({
        ...client,
        procesoKicker: client.procesoKicker ?? "Como funciona",
        procesoTitulo: client.procesoTitulo ?? "De tu consulta a la firma, sin vueltas",
      })}
      ${renderZones(client)}
      ${renderRealtyFinalCta(client)}
      ${renderFooter(client, { minimal: true })}
    </main>
    ${renderStickyCta(client)}
    ${renderRealtyRevealScript()}
  `;
}

export function renderLandingRealtyCss(client: LandingClient): string {
  return `${renderLandingCss(client)}

${realtyCss}`;
}

export function renderLandingRealtyDocument(client: LandingClient): string {
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
    ${renderLandingRealtyBody(client)}
  </body>
</html>
`;
}

// Same progressive-enhancement reveal-on-scroll pattern as landing-clinic:
// content is visible by default; JS only adds motion, with a timeout fallback
// and a reduced-motion / no-IntersectionObserver short-circuit.
function renderRealtyRevealScript(): string {
  return `<script>(function(){var r=document.querySelector('.wf-realty-page');if(!r)return;var i=r.querySelectorAll('[data-reveal]');var m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(m||!('IntersectionObserver' in window)){i.forEach(function(e){e.classList.add('is-revealed')});return;}var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-revealed');o.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px',threshold:0.08});i.forEach(function(e){o.observe(e)});setTimeout(function(){i.forEach(function(e){e.classList.add('is-revealed')})},1400);})();</script>`;
}

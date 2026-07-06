import { escapeAttribute, escapeHtml } from "./escape";
import type { SiteClient } from "./types";

export type HeroOptions = {
  // Focus landing: drop the nav and the secondary CTA to remove exits and keep a
  // single conversion action (higher conversion on landing pages).
  focus?: boolean;
};

export function renderHero(client: SiteClient, options: HeroOptions = {}): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();
  const kicker = client.contacto.direccion || "Servicios profesionales";
  const heroPoster = client.heroPoster?.trim();

  const topBar = options.focus
    ? `<div class="wf-focus-brand">
        <span class="wf-brand-mark">${escapeHtml(logo)}</span>
        <span>${escapeHtml(client.nombre)}</span>
      </div>`
    : `<nav class="wf-nav" aria-label="Principal">
        <a class="wf-brand" href="#top" aria-label="${escapeAttribute(client.nombre)}">
          <span class="wf-brand-mark">${escapeHtml(logo)}</span>
          <span>${escapeHtml(client.nombre)}</span>
        </a>
        <a class="wf-nav-cta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
      </nav>`;

  const secondaryCta = options.focus
    ? ""
    : `<a class="wf-button-secondary" href="#servicios">Ver servicios</a>`;

  return `
    <section class="wf-hero">
      ${topBar}

      <div class="wf-hero-grid">
        <div class="wf-hero-copy">
          <p class="wf-kicker">${escapeHtml(kicker)}</p>
          <h1>${escapeHtml(client.tagline)}</h1>
          <p class="wf-lede">${escapeHtml(client.descripcion)}</p>
          <div class="wf-actions">
            <a class="wf-button-primary" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
            ${secondaryCta}
          </div>
        </div>
        <div class="wf-proof-panel" aria-label="Resumen de propuesta">
          ${heroPoster ? renderHeroPoster(heroPoster, client.nombre) : ""}
          <div class="wf-proof-copy">
            <span class="wf-proof-label">Por que elegirnos</span>
            ${renderProofPoints(client)}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderHeroPoster(src: string, clientName: string): string {
  return `
    <figure class="wf-hero-media">
      <img src="${escapeAttribute(src)}" alt="${escapeAttribute(`Visual principal de ${clientName}`)}" loading="eager" decoding="async">
    </figure>
  `;
}

// Proof panel content driven by real client data (credenciales, else beneficios).
// Falls back to neutral copy so existing landings without this data still render.
function renderProofPoints(client: SiteClient): string {
  const points = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((point) => point.trim().length > 0)
    .slice(0, 4);

  if (points.length === 0) {
    return `<strong>Atencion clara y contacto directo.</strong>
      <p>Una primera impresion ordenada para que cada visita se vuelva conversacion.</p>`;
  }

  const list = points.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  return `<ul class="wf-proof-points">${list}</ul>`;
}

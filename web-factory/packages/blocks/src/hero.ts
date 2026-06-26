import { escapeAttribute, escapeHtml } from "./escape";
import type { SiteClient } from "./types";

export function renderHero(client: SiteClient): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();
  const kicker = client.contacto.direccion || "Servicios profesionales";
  const heroPoster = client.heroPoster?.trim();

  return `
    <section class="wf-hero">
      <nav class="wf-nav" aria-label="Principal">
        <a class="wf-brand" href="#top" aria-label="${escapeAttribute(client.nombre)}">
          <span class="wf-brand-mark">${escapeHtml(logo)}</span>
          <span>${escapeHtml(client.nombre)}</span>
        </a>
        <a class="wf-nav-cta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
      </nav>

      <div class="wf-hero-grid">
        <div class="wf-hero-copy">
          <p class="wf-kicker">${escapeHtml(kicker)}</p>
          <h1>${escapeHtml(client.tagline)}</h1>
          <p class="wf-lede">${escapeHtml(client.descripcion)}</p>
          <div class="wf-actions">
            <a class="wf-button-primary" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
            <a class="wf-button-secondary" href="#servicios">Ver servicios</a>
          </div>
        </div>
        <div class="wf-proof-panel" aria-label="Resumen de propuesta">
          ${heroPoster ? renderHeroPoster(heroPoster, client.nombre) : ""}
          <div class="wf-proof-copy">
            <span class="wf-proof-label">Agenda clara</span>
            <strong>Servicios explicados sin vueltas y contacto directo.</strong>
            <p>Una primera impresion ordenada para que cada visita se convierta en conversacion.</p>
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

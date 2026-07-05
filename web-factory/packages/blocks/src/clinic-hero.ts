import { escapeAttribute, escapeHtml } from "./escape";
import { pickCredencialIcon, renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Editorial clinic hero: asymmetric split, display headline, textured
// background, dominant media with a floating glass booking card, and an inline
// trust row. Focus layout (no nav) keeps a single conversion intent.
export function renderClinicHero(client: SiteClient): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();
  const heroPoster = client.heroPoster?.trim();

  const trust = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0)
    .slice(0, 3);
  const trustRow = trust.length
    ? `<ul class="wf-clinic-hero-trust">${trust
        .map(
          (item) =>
            `<li class="wf-clinic-badge">${renderIcon(pickCredencialIcon(item), "wf-icon wf-clinic-badge-icon")}<span>${escapeHtml(item)}</span></li>`,
        )
        .join("")}</ul>`
    : "";

  const eyebrow = client.contacto.direccion
    ? `<p class="wf-clinic-eyebrow">${renderIcon("map-pin", "wf-icon")}<span>${escapeHtml(client.contacto.direccion)}</span><span class="wf-clinic-dot" aria-hidden="true"></span><span>Atención con turno</span></p>`
    : `<p class="wf-clinic-eyebrow"><span>Atención con turno</span></p>`;

  const media = heroPoster
    ? `<figure class="wf-clinic-hero-figure"><img src="${escapeAttribute(heroPoster)}" alt="${escapeAttribute(`Ambiente de ${client.nombre}`)}" loading="eager" decoding="async"></figure>`
    : `<div class="wf-clinic-hero-figure wf-clinic-hero-figure--empty" aria-hidden="true"></div>`;

  return `
    <header class="wf-clinic-hero">
      <div class="wf-clinic-hero-bg" aria-hidden="true"></div>
      <div class="wf-clinic-topbar">
        <span class="wf-clinic-brand"><span class="wf-clinic-brand-mark">${escapeHtml(logo)}</span>${escapeHtml(client.nombre)}</span>
      </div>
      <div class="wf-clinic-hero-grid">
        <div class="wf-clinic-hero-copy">
          ${eyebrow}
          <h1 class="wf-clinic-title">${escapeHtml(client.tagline)}</h1>
          <p class="wf-clinic-lede">${escapeHtml(client.descripcion)}</p>
          <div class="wf-clinic-actions">
            <a class="wf-clinic-btn wf-clinic-btn--primary" href="${escapeAttribute(client.cta.url)}">${renderIcon("message", "wf-icon")}<span>${escapeHtml(client.cta.texto)}</span></a>
            <a class="wf-clinic-btn wf-clinic-btn--ghost" href="#servicios"><span>Ver tratamientos</span>${renderIcon("arrow-right", "wf-icon")}</a>
          </div>
          ${trustRow}
        </div>
        <div class="wf-clinic-hero-media">
          ${media}
          <aside class="wf-clinic-hero-card" aria-label="Reserva rápida">
            <span class="wf-clinic-hero-card-pulse" aria-hidden="true"></span>
            <div class="wf-clinic-hero-card-text">
              <strong>Reservá hoy</strong>
              <p>Respondemos por WhatsApp en el día.</p>
            </div>
            <a class="wf-clinic-hero-card-btn" href="${escapeAttribute(client.cta.url)}" aria-label="${escapeAttribute(client.cta.texto)}">${renderIcon("arrow-right", "wf-icon")}</a>
          </aside>
        </div>
      </div>
    </header>
  `;
}

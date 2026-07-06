import { escapeAttribute, escapeHtml } from "./escape";
import { pickCredencialIcon, renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Full-bleed image hero: a dominant photo fills the viewport, nav overlays the
// top, and a large display headline sits over a bottom scrim. The media layer is
// a parallax target.
export function renderClinicHeroFullbleed(client: SiteClient): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();
  const media = client.heroPoster?.trim();

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

  const mediaLayer = media
    ? `<div class="wf-clinic-hero-media" data-parallax>
        <img class="wf-clinic-hero-img" src="${escapeAttribute(media)}" alt="${escapeAttribute(`Ambiente de ${client.nombre}`)}" fetchpriority="high" decoding="async">
      </div>`
    : `<div class="wf-clinic-hero-media wf-clinic-hero-media--empty" aria-hidden="true"></div>`;

  return `
    <header class="wf-clinic-hero" id="top">
      ${mediaLayer}
      <div class="wf-clinic-hero-scrim" aria-hidden="true"></div>
      <nav class="wf-clinic-nav" aria-label="Principal">
        <span class="wf-clinic-brand"><span class="wf-clinic-brand-mark">${escapeHtml(logo)}</span>${escapeHtml(client.nombre)}</span>
        <a class="wf-clinic-nav-cta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
      </nav>
      <div class="wf-clinic-hero-content">
        ${eyebrow}
        <h1 class="wf-clinic-hero-title">${escapeHtml(client.tagline)}</h1>
        <p class="wf-clinic-hero-lede">${escapeHtml(client.descripcion)}</p>
        <div class="wf-clinic-actions">
          <a class="wf-clinic-btn wf-clinic-btn--primary" href="${escapeAttribute(client.cta.url)}">${renderIcon("message", "wf-icon")}<span>${escapeHtml(client.cta.texto)}</span></a>
          <a class="wf-clinic-btn wf-clinic-btn--glass" href="#servicios"><span>Ver tratamientos</span>${renderIcon("arrow-right", "wf-icon")}</a>
        </div>
        ${trustRow}
      </div>
    </header>
  `;
}

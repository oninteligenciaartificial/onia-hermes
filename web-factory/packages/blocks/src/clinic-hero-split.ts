import { escapeAttribute, escapeHtml } from "./escape";
import { pickCredencialIcon, renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Split-editorial hero: an oversized headline on a light panel with a full-height
// photo bleeding off the opposite edge. Text is token-colored (light/dark safe),
// so this variant reads very differently from the full-bleed one.
export function renderClinicHeroSplit(client: SiteClient): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();
  const media = client.heroPoster?.trim();

  const trust = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0)
    .slice(0, 3);
  const trustRow = trust.length
    ? `<ul class="wf-clinic-split-trust">${trust
        .map(
          (item) =>
            `<li class="wf-clinic-badge">${renderIcon(pickCredencialIcon(item), "wf-icon wf-clinic-badge-icon")}<span>${escapeHtml(item)}</span></li>`,
        )
        .join("")}</ul>`
    : "";

  const disponibilidad = escapeHtml(client.disponibilidad ?? "Atención con turno");
  const eyebrow = client.contacto.direccion
    ? `<p class="wf-clinic-split-eyebrow">${renderIcon("map-pin", "wf-icon")}<span>${escapeHtml(client.contacto.direccion)}</span><span class="wf-clinic-dot" aria-hidden="true"></span><span>${disponibilidad}</span></p>`
    : `<p class="wf-clinic-split-eyebrow"><span>${disponibilidad}</span></p>`;

  const mediaLayer = media
    ? `<div class="wf-clinic-split-media" data-parallax><img src="${escapeAttribute(media)}" alt="${escapeAttribute(`Ambiente de ${client.nombre}`)}" fetchpriority="high" decoding="async"></div>`
    : `<div class="wf-clinic-split-media wf-clinic-split-media--empty" aria-hidden="true"></div>`;

  return `
    <header class="wf-clinic-hero wf-clinic-hero--split" id="top">
      <div class="wf-clinic-split-grid">
        <div class="wf-clinic-split-panel">
          <nav class="wf-clinic-split-nav" aria-label="Principal">
            <span class="wf-clinic-brand"><span class="wf-clinic-brand-mark">${escapeHtml(logo)}</span>${escapeHtml(client.nombre)}</span>
            <a class="wf-clinic-btn wf-clinic-btn--ghost wf-clinic-split-navcta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
          </nav>
          <div class="wf-clinic-split-body">
            ${eyebrow}
            <h1 class="wf-clinic-split-title">${escapeHtml(client.tagline)}</h1>
            <p class="wf-clinic-split-lede">${escapeHtml(client.descripcion)}</p>
            <div class="wf-clinic-actions">
              <a class="wf-clinic-btn wf-clinic-btn--primary" href="${escapeAttribute(client.cta.url)}">${renderIcon("message", "wf-icon")}<span>${escapeHtml(client.cta.texto)}</span></a>
              <a class="wf-clinic-btn wf-clinic-btn--ghost" href="#servicios"><span>${escapeHtml(client.ctaSecundariaTexto ?? "Ver tratamientos")}</span>${renderIcon("arrow-right", "wf-icon")}</a>
            </div>
            ${trustRow}
          </div>
        </div>
        ${mediaLayer}
      </div>
    </header>
  `;
}

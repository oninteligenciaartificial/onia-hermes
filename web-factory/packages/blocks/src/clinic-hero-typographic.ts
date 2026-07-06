import { escapeAttribute, escapeHtml } from "./escape";
import { pickCredencialIcon, renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Typographic hero: an oversized wordmark behind a portrait photo that overlaps
// it (layering), with the real headline + actions below. Premium / editorial
// register — fits brand-led sites more than a photo-led clinic, and ships as a
// catalog option. Token-colored (light/dark safe).
export function renderClinicHeroTypographic(client: SiteClient): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();
  const media = client.heroPoster?.trim();
  const word = client.nombre.trim().split(/\s+/).pop() || client.nombre;

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
    ? `<figure class="wf-clinic-typo-media" data-parallax><img src="${escapeAttribute(media)}" alt="${escapeAttribute(`Ambiente de ${client.nombre}`)}" fetchpriority="high" decoding="async"></figure>`
    : "";

  return `
    <header class="wf-clinic-hero wf-clinic-hero--typo" id="top">
      <nav class="wf-clinic-split-nav" aria-label="Principal">
        <span class="wf-clinic-brand"><span class="wf-clinic-brand-mark">${escapeHtml(logo)}</span>${escapeHtml(client.nombre)}</span>
        <a class="wf-clinic-btn wf-clinic-btn--ghost wf-clinic-split-navcta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
      </nav>
      <div class="wf-clinic-typo-stage">
        <span class="wf-clinic-typo-word" aria-hidden="true">${escapeHtml(word)}</span>
        ${mediaLayer}
      </div>
      <div class="wf-clinic-typo-content">
        ${eyebrow}
        <h1 class="wf-clinic-typo-h1">${escapeHtml(client.tagline)}</h1>
        <p class="wf-clinic-split-lede">${escapeHtml(client.descripcion)}</p>
        <div class="wf-clinic-actions">
          <a class="wf-clinic-btn wf-clinic-btn--primary" href="${escapeAttribute(client.cta.url)}">${renderIcon("message", "wf-icon")}<span>${escapeHtml(client.cta.texto)}</span></a>
          <a class="wf-clinic-btn wf-clinic-btn--ghost" href="#servicios"><span>${escapeHtml(client.ctaSecundariaTexto ?? "Ver tratamientos")}</span>${renderIcon("arrow-right", "wf-icon")}</a>
        </div>
        ${trustRow}
      </div>
    </header>
  `;
}

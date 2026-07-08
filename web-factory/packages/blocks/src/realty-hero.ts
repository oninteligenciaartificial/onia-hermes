import { escapeAttribute, escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

export function renderRealtyHero(client: SiteClient): string {
  const media = client.heroPoster?.trim();
  const zonas = (client.zonas ?? []).filter((z) => z.trim().length > 0);

  const mediaLayer = media
    ? `<div class="wf-realty-hero-media" data-parallax>
        <img src="${escapeAttribute(media)}" alt="${escapeAttribute(`Propiedades de ${client.nombre}`)}" fetchpriority="high" decoding="async">
      </div>`
    : `<div class="wf-realty-hero-media wf-realty-hero-media--empty" aria-hidden="true"></div>`;

  const zoneOptions = zonas.length
    ? zonas.map((zona) => `<option value="${escapeAttribute(zona)}">${escapeHtml(zona)}</option>`).join("")
    : `<option value="">Todas las zonas</option>`;

  return `
    <header class="wf-realty-hero" id="top">
      ${mediaLayer}
      <div class="wf-realty-hero-scrim" aria-hidden="true"></div>
      <nav class="wf-realty-nav" aria-label="Principal">
        <span class="wf-realty-brand">${escapeHtml(client.nombre)}</span>
        <a class="wf-realty-nav-cta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
      </nav>
      <div class="wf-realty-hero-content">
        <h1 class="wf-realty-hero-title">${escapeHtml(client.tagline)}</h1>
        <p class="wf-realty-hero-lede">${escapeHtml(client.descripcion)}</p>
      </div>
      <form class="wf-realty-search" aria-label="Buscar propiedades">
        <label class="wf-realty-search-field">
          <span>Zona</span>
          <select name="zona">${zoneOptions}</select>
        </label>
        <label class="wf-realty-search-field">
          <span>Tipo</span>
          <select name="tipo">
            <option value="">Cualquiera</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="terreno">Terreno</option>
          </select>
        </label>
        <label class="wf-realty-search-field">
          <span>Operacion</span>
          <select name="operacion">
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </label>
        <button type="submit" class="wf-realty-search-submit">${renderIcon("search", "wf-icon")}<span>Buscar</span></button>
      </form>
    </header>
  `;
}

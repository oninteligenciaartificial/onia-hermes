import { escapeAttribute, escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Bento service grid: the first service is a featured cell with more visual
// weight; the rest fill varied cells. Real SVG icons (not initials) per service.
export function renderClinicServices(client: SiteClient): string {
  // La celda destacada ocupa 2x2 en desktop y quedaba con un vacio enorme
  // entre icono y texto. Si el cliente tiene foto de hero, ese vacio pasa a
  // ser una franja de la misma foto fundida al color de la tarjeta (el texto
  // nunca pisa la imagen). Sin foto, se mantiene el gradiente de siempre.
  const featuredMedia = client.heroPoster?.trim() ?? "";

  const cards = client.servicios
    .map((service, index) => {
      const esFeatured = index === 0;
      const conMedia = esFeatured && featuredMedia.length > 0;
      const clases = `wf-clinic-card${esFeatured ? " wf-clinic-card--featured" : ""}${conMedia ? " wf-clinic-card--media" : ""}`;
      const estilo = conMedia
        ? ` style="--wf-card-media: url('${escapeAttribute(featuredMedia)}')"`
        : "";
      return `
        <article class="${clases}"${estilo}>
          <span class="wf-clinic-card-icon">${renderIcon(service.icono, "wf-icon")}</span>
          <div class="wf-clinic-card-body">
            <h3>${escapeHtml(service.titulo)}</h3>
            <p>${escapeHtml(service.desc)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="wf-clinic-section wf-clinic-services" id="servicios" data-reveal aria-labelledby="wf-clinic-services-h">
      <div class="wf-clinic-section-head">
        <p class="wf-clinic-kicker">Tratamientos</p>
        <h2 id="wf-clinic-services-h">Todo lo que tu sonrisa necesita, en un lugar</h2>
      </div>
      <div class="wf-clinic-bento">
        ${cards}
      </div>
    </section>
  `;
}

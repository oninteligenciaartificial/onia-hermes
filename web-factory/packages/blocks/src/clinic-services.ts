import { escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Bento service grid: the first service is a featured cell with more visual
// weight; the rest fill varied cells. Real SVG icons (not initials) per service.
export function renderClinicServices(client: SiteClient): string {
  const cards = client.servicios
    .map(
      (service, index) => `
        <article class="wf-clinic-card${index === 0 ? " wf-clinic-card--featured" : ""}">
          <span class="wf-clinic-card-icon">${renderIcon(service.icono, "wf-icon")}</span>
          <div class="wf-clinic-card-body">
            <h3>${escapeHtml(service.titulo)}</h3>
            <p>${escapeHtml(service.desc)}</p>
          </div>
        </article>
      `,
    )
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

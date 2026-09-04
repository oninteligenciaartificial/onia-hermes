import { escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

export function renderFeatures(client: SiteClient): string {
  const services = client.servicios
    .map(
      (service, index) => `
        <article class="wf-feature">
          <span class="wf-feature-icon" aria-hidden="true">${renderIcon(service.icono)}</span>
          <span class="wf-feature-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(service.titulo)}</h3>
          <p>${escapeHtml(service.desc)}</p>
        </article>
      `,
    )
    .join("");

  return `
    <section class="wf-section" id="servicios">
      <div class="wf-section-heading">
        <p class="wf-kicker">Servicios</p>
        <h2>Servicios claros desde la primera visita</h2>
      </div>
      <div class="wf-feature-grid">
        ${services}
      </div>
    </section>
  `;
}

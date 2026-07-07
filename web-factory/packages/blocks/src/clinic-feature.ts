import { escapeAttribute, escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Editorial feature band: a large image on one side, copy on the other, with the
// image revealing on scroll. Breaks the section rhythm with a big photo mid-page.
export function renderClinicFeature(client: SiteClient): string {
  const img = client.imagenSecundaria?.trim();
  if (!img) return "";

  const points = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0)
    .slice(0, 3)
    .map((item) => `<li>${renderIcon("check", "wf-icon")}<span>${escapeHtml(item)}</span></li>`)
    .join("");

  return `
    <section class="wf-clinic-section wf-clinic-feature" data-reveal aria-labelledby="wf-clinic-feature-h">
      <div class="wf-clinic-feature-grid">
        <figure class="wf-clinic-feature-media" data-reveal-img>
          <img src="${escapeAttribute(img)}" alt="${escapeAttribute(`Atención en ${client.nombre}`)}" loading="lazy" decoding="async">
        </figure>
        <div class="wf-clinic-feature-copy">
          <p class="wf-clinic-kicker">Nuestra atención</p>
          <h2 id="wf-clinic-feature-h">Manos expertas, trato humano</h2>
          <p>Cada tratamiento arranca escuchándote. Explicamos lo que ves, cuidamos cada detalle y trabajamos para que la visita sea tranquila de principio a fin.</p>
          ${points ? `<ul class="wf-clinic-feature-points">${points}</ul>` : ""}
          <a class="wf-clinic-btn wf-clinic-btn--primary" href="${escapeAttribute(client.cta.url)}">${renderIcon("message", "wf-icon")}<span>${escapeHtml(client.cta.texto)}</span></a>
        </div>
      </div>
    </section>
  `;
}

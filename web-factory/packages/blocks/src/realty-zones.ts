import { escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

export function renderZones(client: SiteClient): string {
  const zonas = (client.zonas ?? []).filter((zona) => zona.trim().length > 0);
  if (zonas.length === 0) return "";

  const chips = zonas
    .map((zona) => `<li class="wf-realty-zone-chip">${renderIcon("map-pin", "wf-icon")}<span>${escapeHtml(zona)}</span></li>`)
    .join("");

  return `
    <section class="wf-realty-section wf-realty-zones" aria-labelledby="wf-realty-zones-heading">
      <div class="wf-realty-section-head">
        <p class="wf-realty-kicker">Cobertura</p>
        <h2 id="wf-realty-zones-heading">Zonas donde operamos</h2>
      </div>
      <ul class="wf-realty-zone-list">${chips}</ul>
    </section>
  `;
}

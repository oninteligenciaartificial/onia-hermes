import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

export function renderWordmarkBreak(client: SiteClient): string {
  const word = (client.wordmarkBreak?.trim() || client.nombre).toUpperCase();
  const stats = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0)
    .slice(0, 3);

  const statList = stats.length
    ? `<ul class="wf-realty-wordmark-stats">${stats.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  return `
    <section class="wf-realty-wordmark" data-reveal aria-hidden="false">
      <span class="wf-realty-wordmark-text" aria-hidden="true">${escapeHtml(word)}</span>
      ${statList}
    </section>
  `;
}

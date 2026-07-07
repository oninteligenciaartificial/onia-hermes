import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Trust strip: proves the clinic is real (credentials, guarantees). Reads real
// data only; renders nothing when there is no proof to show (no fake claims).
export function renderTrust(client: SiteClient): string {
  const items = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0);
  if (items.length === 0) return "";

  const cells = items
    .map((item) => `<li class="wf-trust-item">${escapeHtml(item)}</li>`)
    .join("");

  return `
    <section class="wf-trust" aria-label="Confianza y credenciales">
      <ul class="wf-trust-list">
        ${cells}
      </ul>
    </section>
  `;
}

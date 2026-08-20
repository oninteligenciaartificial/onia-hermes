import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Trust strip: proves the business is real (credentials, guarantees). Reads
// `credenciales` only -- `beneficios` are the hero proof panel's, and falling
// back to them printed the same list twice on the same page. Renders nothing
// when there is no proof to show (no fake claims).
export function renderTrust(client: SiteClient): string {
  const items = (client.credenciales ?? []).filter((item) => item.trim().length > 0);
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

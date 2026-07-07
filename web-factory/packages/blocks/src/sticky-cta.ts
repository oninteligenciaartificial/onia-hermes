import { escapeAttribute, escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Persistent conversion anchor for WhatsApp/social traffic. CSS-only (position
// fixed); on mobile it stays reachable while scrolling long content.
export function renderStickyCta(client: SiteClient): string {
  if (!client.cta.url.trim()) return "";
  return `
    <a class="wf-sticky-cta" href="${escapeAttribute(client.cta.url)}"
       aria-label="${escapeAttribute(client.cta.texto)}">
      <span>${escapeHtml(client.cta.texto)}</span>
    </a>
  `;
}

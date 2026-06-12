import { escapeAttribute, escapeHtml } from "./escape";
import type { SiteClient } from "./types";

export function renderFooter(client: SiteClient): string {
  const socialLinks = [
    ["Instagram", client.redes.ig],
    ["Facebook", client.redes.fb],
    ["LinkedIn", client.redes.linkedin],
    ["X", client.redes.x],
  ]
    .filter(([, url]) => Boolean(url))
    .map(
      ([label, url]) =>
        `<a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`,
    )
    .join("");

  const contactItems = [
    client.contacto.email && `<a href="mailto:${escapeAttribute(client.contacto.email)}">${escapeHtml(client.contacto.email)}</a>`,
    client.contacto.tel && `<a href="tel:${escapeAttribute(client.contacto.tel)}">${escapeHtml(client.contacto.tel)}</a>`,
    client.contacto.whatsapp && `<a href="${escapeAttribute(client.contacto.whatsapp)}">WhatsApp</a>`,
    client.contacto.direccion && `<span>${escapeHtml(client.contacto.direccion)}</span>`,
  ]
    .filter(Boolean)
    .join("");

  return `
    <footer class="wf-footer">
      <div>
        <strong>${escapeHtml(client.nombre)}</strong>
        <p>${escapeHtml(client.descripcion)}</p>
      </div>
      <div class="wf-footer-links" aria-label="Contacto">
        ${contactItems}
        ${socialLinks}
      </div>
    </footer>
  `;
}

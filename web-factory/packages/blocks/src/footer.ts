import { escapeAttribute, escapeHtml } from "./escape";
import type { SiteClient } from "./types";

export type FooterOptions = {
  // Focus landing: drop social links (exits) and keep only conversion contact.
  minimal?: boolean;
  showHours?: boolean;
};

export function renderFooter(client: SiteClient, options: FooterOptions = {}): string {
  const socialLinks = (
    options.minimal
      ? []
      : [
          ["Instagram", client.redes.ig],
          ["Facebook", client.redes.fb],
          ["LinkedIn", client.redes.linkedin],
          ["X", client.redes.x],
        ]
  )
    .filter(([, url]) => Boolean(url))
    .map(
      ([label, url]) =>
        `<a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`,
    )
    .join("");

  // El perfil guarda un TELEFONO en `contacto.whatsapp` ("+591…"): crudo en el
  // href, el link "WhatsApp" quedaba roto en todos los sitios. Si ya viene una
  // URL (wa.me pegado a mano en un perfil viejo), se respeta.
  const waHref = client.contacto.whatsapp
    ? client.contacto.whatsapp.startsWith("http")
      ? client.contacto.whatsapp
      : `https://wa.me/${client.contacto.whatsapp.replace(/\D/g, "")}`
    : "";

  const contactItems = [
    client.contacto.email && `<a href="mailto:${escapeAttribute(client.contacto.email)}">${escapeHtml(client.contacto.email)}</a>`,
    client.contacto.tel && `<a href="tel:${escapeAttribute(client.contacto.tel)}">${escapeHtml(client.contacto.tel)}</a>`,
    waHref && `<a href="${escapeAttribute(waHref)}" target="_blank" rel="noreferrer">WhatsApp</a>`,
    client.contacto.direccion && `<span>${escapeHtml(client.contacto.direccion)}</span>`,
    options.showHours && client.contacto.horario?.trim() &&
      `<span>Horarios: ${escapeHtml(client.contacto.horario.trim()).replace(/\r?\n/g, "<br>")}</span>`,
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

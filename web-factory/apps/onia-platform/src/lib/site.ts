/**
 * Constantes del sitio ONIA Platform.
 *
 * PLACEHOLDERS deliberados (ver README-CARRIL / plan de arranque):
 * - WA_PHONE: el numero real de WhatsApp Business esta pendiente; al tenerlo
 *   se cambia SOLO aca y todos los CTAs del sitio quedan al dia.
 * - APP_URL / DENTALGEST_URL: dominios segun la arquitectura decidida
 *   (onia.com.bo = este sitio, app.onia.com.bo = la app,
 *   dentalgest.app = embudo dental).
 */

export const WA_PHONE = "PLACEHOLDER";

export function waLink(text: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/** CTA general de toda la pagina. */
export const WA_URL = waLink("Hola, quiero conocer Onia");

export const WA_TEXT_COMERCIO =
  "Hola, quiero que me avisen cuando Onia para comercio esté listo";
export const WA_TEXT_SERVICIOS =
  "Hola, quiero que me avisen cuando Onia para servicios esté listo";
export const WA_TEXT_PROVEEDORES =
  "Hola, quiero que me avisen cuando Onia para proveedores esté listo";

export const APP_URL = "https://app.onia.com.bo";
export const DENTALGEST_URL = "https://dentalgest.app";

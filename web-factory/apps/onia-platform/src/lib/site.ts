/**
 * Constantes del sitio ONIA Platform.
 *
 * PLACEHOLDERS deliberados (ver README-CARRIL / plan de arranque):
 * - APP_URL / DENTALGEST_URL: dominios segun la arquitectura decidida
 *   (onia.com.bo = este sitio, app.onia.com.bo = la app,
 *   dentalgest.app = embudo dental).
 */

// Numero real de WhatsApp del negocio, confirmado por Sergio 2026-07-26.
// Es el mismo que figura en el portfolio de Meta y en el pie legal: si cambia,
// hay que cambiarlo en los tres lados o la verificacion de Meta deja de cruzar.
export const WA_PHONE = "59178491375";

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

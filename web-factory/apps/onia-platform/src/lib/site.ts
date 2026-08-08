/**
 * Constantes del sitio ONIA Platform.
 *
 * PLACEHOLDERS deliberados (ver README-CARRIL / plan de arranque):
 * - APP_URL / DENTALGEST_URL: dominios segun la arquitectura decidida
 *   (onia.com.bo = este sitio, app.onia.com.bo = la app,
 *   dentalgest.app = embudo dental).
 */

/**
 * Numero de WhatsApp del negocio (el que ATIENDE los mensajes).
 *
 * Sale de `NEXT_PUBLIC_WA_PHONE` (solo digitos, con codigo de pais). Esa
 * variable NO esta definida en ningun lado hoy, asi que en la practica manda
 * este fallback.
 *
 * 2026-08-08: pasa de 78491375 a 75414930. El 78491375 quedo atrapado en un
 * portfolio fantasma de Meta y NO tiene bot atendiendo; el 75414930 esta en
 * WhatsApp Cloud API con el chatbot vivo y la app publicada. Todo enlace
 * wa.me de la web tiene que ir a este numero.
 *
 * OJO — el `tel:+59178491375` del pie legal NO se toca: ese es para LLAMAR y
 * ahi contesta una persona. El 75414930 es un chip en Cloud API sin app: si
 * alguien lo llama, no lo atiende nadie.
 */
const WA_PHONE_FALLBACK = "59175414930";

export const WA_PHONE =
  (process.env.NEXT_PUBLIC_WA_PHONE ?? "").replace(/\D/g, "") ||
  WA_PHONE_FALLBACK;

export function waLink(text: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/** CTA general de toda la pagina. */
export const WA_URL = waLink("Hola, quiero conocer Onia");

/**
 * CTA de la landing. El texto lo fijo el mockup aprobado: entra ya diciendo
 * de donde viene y que quiere resolver, para que la respuesta arranque en el
 * problema y no en "hola, en que te ayudo".
 */
export const WA_URL_LANDING = waLink(
  "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio.",
);

export const WA_TEXT_COMERCIO =
  "Hola, quiero que me avisen cuando Onia para comercio esté listo";
export const WA_TEXT_SERVICIOS =
  "Hola, quiero que me avisen cuando Onia para servicios esté listo";
export const WA_TEXT_PROVEEDORES =
  "Hola, quiero que me avisen cuando Onia para importadoras esté listo";

export const APP_URL = "https://app.onia.com.bo";
export const DENTALGEST_URL = "https://dentalgest.app";

/**
 * CTA de las paginas de servicios (chatbot, marketing IA, consultoria).
 *
 * Usa `WA_PHONE`, el MISMO numero que el resto de la web. Antes esto tenia su
 * propia constante y las dos divergieron: la portada mandaba a un numero y las
 * paginas de servicios a otro. Un solo numero, un solo lugar donde cambiarlo.
 */
export function waServiciosLink(text: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Agenda propia (Cal.com self-hosted en el VPS, cuenta `onia`).
 * Verificado 2026-07-30: los dos enlaces responden 200 en publico.
 *
 * - `demo`: "Demo / diagnostico - solucion ONIA", 45 min. Es el CTA principal:
 *   quien ya vio precios y quiere ver el sistema.
 * - `consulta`: "Consulta comercial - proyecto nuevo", 20 min. Para el que
 *   todavia no sabe si le sirve y no le vamos a pedir 45 minutos de entrada.
 *
 * Los otros dos tipos de evento del calendario (auditoria-pagada,
 * reunion-proyecto) estan ocultos a proposito: no son de captacion.
 */
const CAL_BASE = process.env.NEXT_PUBLIC_CAL_BASE ?? "https://cal.onia.com.bo/onia";

export const CAL_DEMO_URL = `${CAL_BASE}/demo-onia`;
export const CAL_CONSULTA_URL = `${CAL_BASE}/consulta-inicial`;

/**
 * Enlace de agenda con los datos ya cargados, para que la persona no
 * los vuelva a tipear tras haberlos escrito en el formulario.
 */
export function calLink(
  url: string,
  data?: { name?: string; notes?: string }
): string {
  const params = new URLSearchParams();
  if (data?.name) params.set("name", data.name);
  if (data?.notes) params.set("notes", data.notes);
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

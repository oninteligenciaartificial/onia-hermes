/**
 * Constantes de la landing. Placeholders hasta tener numero de
 * WhatsApp y URL real de la app (ver DIRECCION-CREATIVA-Y-COPY.md).
 */
export const WHATSAPP_URL =
  "https://wa.me/PLACEHOLDER?text=Hola%2C%20quiero%20una%20DEMO%20de%20DentalGest";

export const APP_URL = "APP_URL";

/**
 * Origen publico de esta landing. Lo usan las tres cosas que tienen que
 * coincidir o la indexacion se rompe: `metadataBase` (canonical + URLs
 * absolutas de OG), `sitemap.xml` y la linea `Sitemap:` de `robots.txt`.
 *
 * El dominio sale del codigo, no de una suposicion: es el mismo que ya declara
 * `apps/onia-platform/src/lib/site.ts` (`DENTALGEST_URL`) como destino del
 * embudo dental. CONFIRMAR antes de publicar: si la landing termina colgada de
 * otro dominio o de un subdirectorio, se cambia ACA y las tres salidas siguen.
 */
export const SITE_URL = "https://dentalgest.app";

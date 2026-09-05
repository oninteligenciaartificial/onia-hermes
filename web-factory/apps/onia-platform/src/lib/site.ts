/**
 * Constantes del sitio ONIA Platform.
 *
 * PLACEHOLDERS deliberados (ver README-CARRIL / plan de arranque):
 * - APP_URL / DENTALGEST_URL: dominios segun la arquitectura decidida
 *   (onia.com.bo = este sitio, app.onia.com.bo = la app,
 *   dentalgest.app = embudo dental).
 */

/**
 * Origen publico del sitio. Lo usan las TRES cosas que tienen que coincidir o
 * la indexacion se rompe: `metadataBase` (de donde salen los canonical y las
 * URLs absolutas de OG), el `sitemap.xml` y la linea `Sitemap:` de robots.txt.
 * Estaba escrito tres veces a mano; ahora se declara una sola.
 */
export const SITE_URL = "https://onia.com.bo";

/**
 * Numero de WhatsApp del negocio (el que ATIENDE los mensajes).
 *
 * Sale de `NEXT_PUBLIC_WA_PHONE` (solo digitos, con codigo de pais). Esa
 * variable NO esta definida en ningun lado hoy, asi que en la practica manda
 * este fallback.
 *
 * 2026-08-08: el numero anterior se retiro por completo (habia quedado en un
 * portfolio fantasma de Meta, sin bot atendiendo). Este esta en WhatsApp Cloud
 * API con el chatbot vivo y la app publicada, y es el UNICO numero de la web:
 * enlaces wa.me, paginas de servicios y datos de contacto salen todos de aca.
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

/*
 * Acá vivían WA_TEXT_COMERCIO, WA_TEXT_SERVICIOS y WA_TEXT_PROVEEDORES: tres
 * textos de WhatsApp que le hacían pedir al lead que le avisaran cuando Onia
 * para su rubro estuviera terminada. Eran de cuando esos tres rubros no
 * existían; hoy los tres están vivos y el alta los ofrece, así que el mensaje
 * contradecía a la pantalla que lo enviaba. No los llamaba nadie, y por eso
 * ningún gate de superficie podía verlos — un texto muerto es invisible para
 * toda captura y todo `curl`. Se borraron el 2026-09-05; el gate que impide que
 * vuelvan es `cta-sin-obra.test.ts`, al lado de este archivo.
 */

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
 * Las dos citas que ofrece `/contacto`, por el MISMO WhatsApp que atiende al
 * resto de la web. Cada una entra diciendo cuál eligio, para que del otro lado
 * no haya que preguntarlo.
 *
 * - `demo`: 45 min. Es el CTA principal: quien ya vio precios y quiere ver el
 *   sistema.
 * - `consulta`: 20 min. Para el que todavia no sabe si le sirve y no le vamos
 *   a pedir 45 minutos de entrada.
 *
 * ⚠️ Hasta el 2026-09-03 los dos botones apuntaban a `cal.onia.com.bo`, un
 * Cal.com self-hosted con un comentario que decia "verificado 2026-07-30: los
 * dos enlaces responden 200". Ese Cal.com ya no existe —no hay contenedor en
 * el VPS y el 2026-09-02 Sergio eligio los horarios fijos del bot en vez de
 * revivirlo—, pero el host seguia resolviendo a nuestra IP y devolvia **302 a
 * /empezar**: `curl -L` daba 200 y el lead que queria conversar aterrizaba en
 * un formulario de alta. El 200 era cierto y no significaba nada.
 *
 * Quien atiende estos mensajes es el chatbot, que propone los dos horarios
 * concretos del dia (ventanas que fijo Sergio, renovadas por cron). Si algun
 * dia vuelve a haber calendario propio, se cambia aca y las dos pantallas lo
 * siguen solas.
 */
export const AGENDA_CONSULTA_URL = waLink(
  "Hola, vengo de la web de Onia. Quiero agendar la consulta comercial de 20 minutos.",
);

export const AGENDA_DEMO_URL = waLink(
  "Hola, vengo de la web de Onia. Quiero agendar la demo de 45 minutos con mi caso.",
);

/**
 * Constantes del sitio ONIA Platform.
 *
 * Los dominios que servimos son DOS: `onia.com.bo` (este sitio) y
 * `app.onia.com.bo` (la app). No hay un tercero.
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

/**
 * Correo de contacto del negocio. Es el UNICO canal escrito del sitio y el que
 * la politica de privacidad ofrece por obligacion legal ("solicitudes sobre
 * datos personales"), asi que si queda viejo no es cosmetico: es la via de
 * ejercicio de derechos apuntando a un buzon muerto.
 *
 * 2026-09-08: estaba tipeado a mano en CINCO superficies — el pie (visible en
 * las 25 paginas), el JSON-LD de /nosotros (que ningun instrumento mira) y tres
 * veces en el markdown legal. Como `content/legal/*.md` no puede importar TS,
 * el markdown se ata por gate (`correo-de-contacto.test.ts`) en vez de por
 * import: el dia que este valor cambie, los .md que no lo sigan salen en rojo.
 */
export const CORREO_CONTACTO = "business@onia.com.bo";

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

/**
 * Acá vivía `DENTALGEST_URL = "https://dentalgest.app"`, un placeholder del plan
 * de arranque que nadie llegó a usar. Se borró el 2026-09-05 por dos motivos, y
 * cualquiera de los dos alcanzaba:
 *
 * 1. El dominio está MUERTO: 404 con `x-vercel-error: DEPLOYMENT_NOT_FOUND`, un
 *    proyecto de Vercel borrado.
 * 2. `DentalGest` es un nombre de pack retirado. `CLAUDE.md` es explícito: no es
 *    un producto ni una marca, al cliente se le nombra el rubro («módulo
 *    dental»). Mandarlo a un embudo con otra marca contradice que haya UN
 *    producto.
 *
 * Y era peligroso justo por estar sin usar: ningún instrumento de superficie ve
 * una constante muerta —no sale en la captura, ni en el `curl`, ni en el HTML— y
 * encima estaba en la lista blanca de `enlaces.test.ts`, así que el día que
 * alguien la cableara a un botón el gate le daba verde contra un 404. El guard
 * que impide que vuelva es el caso «ninguna entrada de la lista está de más» de
 * ese archivo.
 */

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
 * - `demo`: es el CTA principal: quien ya vio precios y quiere ver el sistema.
 * - `consulta`: para el que todavia no sabe si le sirve.
 *
 * Las dos duran lo MISMO y no se diferencian por reloj sino por lo que pasa
 * adentro. Antes decian 20 y 45, y el motor que atiende esos dos WhatsApp
 * reservaba 30: el lead aceptaba creyendo una cosa y le bloqueaban otra. Ver
 * `CITA_DURACION_MIN` aca abajo y el gate `duracion-de-la-cita.test.ts`.
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
/**
 * Cuanto dura la cita, en minutos. **No se decide aca**: es lo que el motor
 * BLOQUEA en el calendario (`DEMO.duracionMinutos` de
 * `hermes-content/deploy/vps-ops/bot/config.mjs`, decidido por Sergio Urcullo
 * el 2026-08-06 — «30 y 30»). Este numero lo SIGUE, y el gate
 * `duracion-de-la-cita.test.ts` se pone rojo si los dos divergen.
 *
 * Cambiarlo aca y no alla no cambia la reserva: cambia lo que el lead cree.
 */
export const CITA_DURACION_MIN = 30;

/**
 * ⚠️ Las dos frases van como LITERAL entre comillas dobles, sin interpolar
 * `CITA_DURACION_MIN`. No es descuido: el gate del bot
 * (`hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs`) deriva «lo que la
 * web manda» con `/wa(?:Servicios)?Link\(\s*"([^"]*)"/`, o sea leyendo el
 * literal crudo. Una plantilla con backticks lo dejaria ciego a estas dos —
 * las unicas dos frases de todo el sitio que el bot contesta con respuesta
 * propia— y la ceguera se veria igual que un verde. Que el numero del literal
 * sea el de la fuente lo sostiene `duracion-de-la-cita.test.ts`.
 */
export const AGENDA_CONSULTA_URL = waLink(
  "Hola, vengo de la web de Onia. Quiero agendar la consulta comercial de 30 minutos.",
);

export const AGENDA_DEMO_URL = waLink(
  "Hola, vengo de la web de Onia. Quiero agendar la demo de 30 minutos con mi caso.",
);

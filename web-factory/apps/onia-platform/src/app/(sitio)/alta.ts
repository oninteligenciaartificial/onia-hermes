/**
 * El alta: UN estado, y de él sale TODO el vocabulario del sitio.
 *
 * Nace del 2026-09-01. El 21-ago Sergio cerró el alta automática y se barrió el
 * sitio a "Pedí tu acceso". El 29-ago el alta se REABRIÓ en el producto
 * (ONIA_ALTA_AUTOMATICA=abierta en el app.env del contenedor onia-platform) y el
 * sitio no se enteró: quedaron SIETE botones y una FAQ pidiendo permiso para
 * entrar a un formulario que ya crea la cuenta sola. La fricción más cara del
 * sitio, en el último clic — el mismo bug del 23-ago, con el signo al revés.
 *
 * La causa no fue el descuido: el verbo estaba escrito a mano en once archivos,
 * así que "cambiar el alta" eran quince ediciones y bastaba olvidar una. Acá se
 * declara UNA vez; las páginas leen la etiqueta, no la escriben.
 *
 * ⚠️ ESTE ARCHIVO ES UN ESPEJO, NO LA FUENTE. Quien decide de verdad qué
 * renderiza app.onia.com.bo/register es el producto (`lib/registration.ts` del
 * repo onia-platform, leyendo ONIA_ALTA_AUTOMATICA en cada request). El sitio es
 * OTRO contenedor (onia-landing) y no tiene esa variable: se buildea estático.
 * Cambiar el alta son DOS pasos, y este es el segundo:
 *
 *   1. VPS: `ONIA_ALTA_AUTOMATICA=abierta|cerrada` en /opt/onia-platform/app.env
 *      y recrear el contenedor.
 *   2. Acá: `ALTA_ABIERTA` al valor que corresponda, y publicar el sitio.
 *
 * Verificar cuál es la verdad de hoy, sin suponer:
 *   ssh root@187.77.16.63 "docker exec onia-platform env | grep ALTA"
 *   (y abrir app.onia.com.bo/register y MIRARLO: un grep descarta, no confirma)
 *
 * `alta.test.ts` no puede ver el VPS, pero sí garantiza lo que falló: que
 * ninguna superficie se quede con el vocabulario de la rama apagada.
 */

/**
 * ¿app.onia.com.bo/register crea la cuenta solo?
 *
 * true — verificado en producción el 2026-09-01: `ONIA_ALTA_AUTOMATICA=abierta`
 * en el app.env y en el proceso vivo, y /register renderiza el alta de dos pasos
 * ("Tu rubro" → "Tu cuenta") con nombre, correo y contraseña.
 */
export const ALTA_ABIERTA = true;

/**
 * La etiqueta de TODO botón que arranca el alta, y el verbo de los títulos que
 * la nombran. Dice lo que hace el destino: con el alta abierta, /register se
 * titula literalmente "Creá tu cuenta".
 */
export const CTA_ALTA = ALTA_ABIERTA ? "Creá tu cuenta" : "Pedí tu acceso";

/** Igual, pero en las tarjetas de plan, donde el nombre del plan es la mitad del clic. */
export const ctaAltaPlan = (plan: string): string =>
  ALTA_ABIERTA ? `Empezar con el ${plan}` : `Pedir acceso al ${plan}`;

/** El mismo verbo dentro de una frase corrida (FAQ, metadatos, prosa). */
export const ALTA_VERBO_VOS = ALTA_ABIERTA
  ? "creás tu cuenta"
  : "pedís tu acceso";

/**
 * El vocabulario de cada rama, para el guard.
 *
 * Se declara acá y no en el test a propósito: es el mismo `ALTA_ABIERTA` el que
 * elige la etiqueta Y el que elige qué frases quedan prohibidas, así que
 * invertir la bandera invierte el guard solo. Atarlo a una frase literal escrita
 * en el test dejaría el guard en verde justo cuando cambia la promesa.
 */
export const FRASE_RAMA_ABIERTA = /cre[aá][rs]?\s+(tu|mi|la)\s+cuenta/i;
export const FRASE_RAMA_CERRADA =
  /ped[ií][rs]?\s+(tu|mi)\s+acceso|pedir\s+acceso\s+al/i;

/** La rama APAGADA: su vocabulario no puede sobrevivir en ninguna superficie. */
export const FRASE_PROHIBIDA = ALTA_ABIERTA
  ? FRASE_RAMA_CERRADA
  : FRASE_RAMA_ABIERTA;

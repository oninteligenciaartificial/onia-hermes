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
 * El mismo verbo cuando ABRE una frase — un título, una bajada, el remate de
 * una pantalla.
 *
 * Existe porque el de arriba es un fragmento de frase corrida y se usó para
 * empezar el titular del cierre de la home: en producción se leía «creás tu
 * cuenta hoy y probalo con tu propio negocio.», en display, a tres renglones y
 * arrancando en minúscula, como si le faltara el principio (medido MIRANDO la
 * home el 2026-09-25). Se DERIVA del verbo en vez de tipear la variante: si el
 * alta se cierra, el título dice «Pedís tu acceso…» sin que nadie se acuerde de
 * venir a cambiarlo acá. Lo vigila `titulo-no-empieza-en-minuscula.test.ts`.
 */
export const ALTA_VERBO_VOS_TITULO =
  ALTA_VERBO_VOS[0].toLocaleUpperCase("es") + ALTA_VERBO_VOS.slice(1);

/**
 * ¿Entre crear la cuenta y usar el sistema hay un paso obligatorio?
 *
 * true — el alta exige CONFIRMAR EL CORREO. Es la misma decisión del 29-ago que
 * reabrió el alta ("encender junto con la apertura", `lib/registration.ts` del
 * producto), y este espejo copió esa mitad y no ésta: durante trece días el
 * sitio enumeró la puesta en marcha como si fueran dos pasos.
 *
 * Importa porque es el ÚLTIMO clic del embudo y falla hacia afuera: quien hace
 * exactamente lo que el sitio dice se come un 403 que nadie le anticipó, y si el
 * correo tarda o cae en spam no tiene forma de saber que eso era lo que faltaba.
 *
 * Medido en producción el 2026-09-11, las tres capas que lo deciden —una sola no
 * alcanza, el propio producto lo advierte: el flip de la app no sirve si GoTrue
 * autoconfirma—:
 *
 *   docker exec onia-platform env | grep ONIA_REGISTRO_CONFIRMA_CORREO   # =si
 *   docker exec supabase-auth2 env | grep GOTRUE_MAILER_AUTOCONFIRM      # =false
 *   docker exec supabase-db psql -U postgres -d postgres \
 *     -tAc "select count(*) from auth.users where email_confirmed_at is null"
 *
 * Ese último dio 1 de 8 el día que se escribió esto: no es hipotético, hay
 * alguien parado ahí. El corte es `app/api/auth/login/route.ts`, que contesta
 * 403 `email_not_confirmed`.
 *
 * Igual que `ALTA_ABIERTA`, ESTE ARCHIVO ES UN ESPEJO: la verdad vive en el
 * contenedor. `npm run alta:confirma-vivo` compara las tres capas contra
 * producción y sale 2 (NO MEDIDO) si no las alcanza, nunca en verde.
 */
export const ALTA_CONFIRMA_CORREO = true;

/**
 * El paso, dicho para intercalar en una enumeración corrida.
 *
 * No se tipea en cada página por lo mismo que el verbo del alta: escrito a mano
 * en cuatro archivos, "cambiar el alta" son cuatro ediciones y basta olvidar una.
 */
export const PASO_CONFIRMAR_CORREO = "confirmás tu correo";

/** La misma frase donde la página habla de vos en imperativo ("elegí", "usá"). */
export const PASO_CONFIRMAR_CORREO_IMPERATIVO = "confirmá tu correo";

/** De dónde sale el enlace, para que el lead sepa dónde mirar si no lo ve. */
export const DE_DONDE_LLEGA_EL_ENLACE = "desde el enlace que te mandamos";

/**
 * Que una oración NOMBRE el paso. Deliberadamente ancho: lo que el guard exige
 * es que el lead se entere, no una redacción. Vale "confirmás tu correo",
 * "confirmá el correo", "revisá tu bandeja" o "el enlace que te mandamos".
 */
export const FRASE_CONFIRMACION =
  /confirm[aá](?:s|r|ción|cion)?\s+(?:tu|el|su)\s+(?:correo|mail|email)|confirm[aá]s?\s+el\s+enlace|revis[aá]s?\s+tu\s+(?:correo|bandeja|casilla)|enlace\s+que\s+te\s+(?:mandamos|enviamos|llega)/i;

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

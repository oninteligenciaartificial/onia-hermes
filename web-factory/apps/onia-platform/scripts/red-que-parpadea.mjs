/**
 * Traer una URL sin que un parpadeo de red apague el gate.
 *
 * QUE SE ROMPIO, medido el 2026-09-27 01:0x La Paz desde nodo-casa. Corriendo los once
 * medidores vivos del carril de venta en fila, `rubros:vivos` salio
 * `NO PUDE MEDIR: el alta (https://app.onia.com.bo/register) no contesto — fetch failed`.
 * Noventa segundos despues, el MISMO comando salio `VERDE: los 5 rubros que entrega el alta
 * son los 5 que vende el sitio`, y `curl` al mismo URL contestaba `200` en 0,93 s. O sea: el
 * alta estaba viva y el gate se rindio en el primer intento.
 *
 * POR QUE NO ES UN DETALLE. El `exit 2` es la conducta CORRECTA —no pudo preguntar, no
 * miente— pero el costo real es que el carril pierde la medicion y nadie se entera. Y un
 * `NO MEDIDO` intermitente es peor que uno permanente: el permanente al menos se ve siempre
 * igual, el intermitente se lee como "el ambiental de siempre" y se saltea. Dos de estos
 * gates —`obra:viva` y `titular:sistema`— son los que hacen cumplir las dos reglas que
 * Sergio Urcullo puso por escrito (la venta no exhibe obra; la home vende el sistema, no el
 * bot) y barren 24 pantallas cada uno: con 24 pedidos por corrida, la probabilidad de que
 * uno parpadee es 24 veces la de un pedido suelto. Son justo los que mas facil se apagan.
 *
 * LAS DOS CAUSAS, y por que hacen falta las dos curas:
 *
 *  1. Node >=20 corta cada intento de conexion a 250 ms (`autoSelectFamily`) y devuelve
 *     ETIMEDOUT sobre hosts VIVOS pero lentos o dual-stack, mientras `curl` da 200. Eso ya
 *     estaba curado en dos de los siete scripts que fetchean (`recursos-vivos.mjs`,
 *     `verificar-guia-facturacion.mjs`) y en ninguno de los otros cinco.
 *  2. Incluso con esa cura, un pedido suelto puede fallar por el camino. Ninguno de los
 *     siete reintentaba: `grep -c reintent` daba 0 en todos.
 *
 * QUE **NO** HACE, que es la mitad del diseno. No reintenta una RESPUESTA. Un 404, un 500 o
 * un 429 son el servidor contestando: reintentarlos convierte un hallazgo en una espera y
 * puede tapar un defecto real (el widget del sitio ratelimitea al 4º pedido por IP — un
 * reintento automatico ahi se lo provoca solo). Solo se reintenta cuando `fetch` RECHAZA,
 * que es no haber podido preguntar. Tampoco reintenta el `AbortError` del tope que puso el
 * llamador: ese tope es una medicion ("tarda mas de X"), y triplicarlo es falsearla.
 *
 * Y AVISA CUANDO SALVA. Un rescate silencioso vuelve invisible una red que falla 2 de cada 3
 * veces: se veria igual de verde que una sana. Cada pedido rescatado imprime UNA linea a
 * stderr — es un EVENTO raro, no una condicion permanente, asi que no ahoga el log.
 */
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";

/**
 * Cura 1, y va al importarse a proposito: el que trae este modulo quiere preguntarle a un
 * host de verdad, y sin esto el primer intento muere a los 250 ms contra un host sano.
 */
setDefaultAutoSelectFamilyAttemptTimeout(2000);

/** Cuantas veces se PREGUNTA en total (1 = como estaba antes: sin reintento). */
export const INTENTOS = 3;

/** Espera antes del intento n (n arranca en 1). Corta a proposito: 24 pedidos por barrido. */
export const esperaMs = (n) => 250 * n;

/**
 * ¿Este error es un parpadeo (no pude preguntar) o un veredicto (me contestaron / mi propio tope)?
 *
 * Puro y exportado para que el gate lo pruebe sin tocar la red. Se decide por lo que el
 * error ES, no por su texto exacto: los mensajes de undici cambian entre versiones de Node,
 * y una lista de frases falla ABIERTA el dia que cambie una.
 */
export function esParpadeo(error) {
  if (!error) return false;
  // El tope del llamador es una medicion, no un parpadeo: reintentarlo la falsea.
  if (error.name === "AbortError" || error.name === "TimeoutError") return false;
  // Un `Response` nunca llega aca: si hubo respuesta, `traer` no tira.
  return true;
}

/**
 * Trae `url` reintentando solo los parpadeos.
 *
 * Las dependencias entran por parametro para que el gate pueda probar el reintento con un
 * `fetch` de mentira: un test que necesita la red para correr no lo corre nadie.
 *
 * @returns la `Response` (haya salido 200 o 404: eso lo juzga el llamador).
 * @throws el ultimo error, con los intentos en el mensaje, para que el NO MEDIDO diga por que.
 */
export async function traer(url, opciones = {}, deps = {}) {
  const pedir = deps.fetch ?? fetch;
  const dormir = deps.dormir ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const avisar = deps.avisar ?? ((linea) => console.error(linea));
  const intentos = deps.intentos ?? INTENTOS;

  const fallas = [];
  for (let n = 1; n <= intentos; n += 1) {
    try {
      const r = await pedir(url, opciones);
      if (n > 1) {
        const antes = n === 2 ? "el anterior parpadeo" : `los ${n - 1} anteriores parpadearon`;
        avisar(`  (red) ${url} contesto al intento ${n} de ${intentos}; ${antes}: ${fallas.join(" · ")}`);
      }
      return r;
    } catch (e) {
      fallas.push(e?.message || String(e));
      if (!esParpadeo(e) || n === intentos) {
        e.message = `${e?.message || e} (${n} intento(s): ${fallas.join(" · ")})`;
        throw e;
      }
      await dormir(esperaMs(n));
    }
  }
  /* inalcanzable: el for sale por return o por throw */
}

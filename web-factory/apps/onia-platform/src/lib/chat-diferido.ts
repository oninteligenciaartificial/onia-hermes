/**
 * El widget de chat NO se descarga hasta que el visitante da señal de querer
 * usarlo (o lleva `ESPERA_SIN_GESTO_MS` leyendo la página).
 *
 * **Por qué.** Medido el 2026-09-11 sobre `onia.com.bo` con Lighthouse: el SDK
 * de Chatwoot es **1.062 KB de los 1.491 KB** de la portada —el 71 % del peso,
 * 18 pedidos— y hasta hoy se lo llevaba **toda** visita, incluida la que rebota
 * a los tres segundos y el bot que nunca va a escribir. En La Paz sobre datos
 * móviles ese megabyte es el que compite con el resto de la pantalla justo
 * cuando el lead empieza a leer.
 *
 * **Qué NO cambia.** No es un rediseño: no hay launcher propio ni botón nuevo.
 * La burbuja que ve el visitante es la misma de Chatwoot y aparece igual —
 * apenas toca, mueve el dedo o baja una línea, que es lo primero que hace
 * cualquiera que mire la página. Lo único que cambia es CUÁNDO viaja ese
 * megabyte. Por eso entra sin pasar por la aprobación de una pieza (regla
 * "una superficie viva no se reemplaza sin que Sergio Urcullo la VEA"): acá la
 * superficie es idéntica.
 *
 * **Y sigue sin tocar el LCP.** El gesto marca la intención, pero la descarga
 * espera al `load` si todavía no ocurrió — que es la propiedad que el snippet
 * anterior ya tenía y que un diferido por interacción rompe si se escribe
 * ingenuamente: alguien que hace scroll a los 400 ms se traía el megabyte
 * compitiendo con la portada.
 *
 * Vive en su propio módulo —y no como constante del layout— para que el gate
 * pueda EJECUTARLO: es la única forma de verificar que tras `load` no se
 * agrega nada. Ver `chat-diferido.test.ts`.
 */

/** Chatwoot self-hosted en el VPS. Mismo motor que atiende WhatsApp (inbox web id 4). */
export const CHATWOOT_BASE_URL =
  "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host";

/** Token público del inbox web. No es un secreto: viaja en el HTML de toda visita. */
export const CHATWOOT_WEBSITE_TOKEN = "9k5i7xnAgCbSse1EZwVChZLw";

/** Ruta del SDK dentro de Chatwoot. Declarada acá para que el gate la cruce contra el snippet. */
export const CHATWOOT_SDK_PATH = "/packs/js/sdk.js";

/**
 * Los gestos que cuentan como "hay alguien del otro lado".
 *
 * Son cinco y no sólo el click: el que va a escribir primero hace otra cosa
 * —rueda, apoya el dedo, tipea— y para cuando decide abrir el chat, la burbuja
 * ya tiene que estar. Un solo evento (`click`) dejaría al primer click del
 * visitante cayendo en una pantalla sin burbuja.
 *
 * ⚠️ **`scroll` y `mousemove` quedaron AFUERA, y no por prolijidad.** La
 * primera versión de esta lista los tenía, y midiendo la portada buildeada el
 * 2026-09-11 el SDK salió pedido **a los 176 ms**, sin que nadie tocara nada:
 * la propia página dispara `scroll` al asentarse. Un evento que el sitio se
 * provoca solo no es señal de intención — con ellos adentro el diferido queda
 * escrito y no existe, que es peor que no haberlo hecho, porque el gate de
 * unidad igual da verde.
 *
 * `wheel` y `touchmove` son la rueda y el dedo de verdad: un scroll
 * programático no los emite. Al lector quieto lo cubre `ESPERA_SIN_GESTO_MS`.
 */
export const GESTOS_QUE_PIDEN_CHAT = [
  "pointerdown",
  "touchstart",
  "touchmove",
  "wheel",
  "keydown",
] as const;

/**
 * Respaldo para el que lee quieto: a los 12 s el widget viene solo.
 *
 * Sin este respaldo el diferido sería una promesa rota — el sitio ofrece
 * escribirnos y alguien que llega, lee y recién después busca con quién hablar
 * no encontraría nada. Doce segundos deja afuera al rebote y al bot, que es
 * donde está el ahorro, sin dejar a nadie sin canal.
 */
export const ESPERA_SIN_GESTO_MS = 12000;

/**
 * El snippet que va inline en el `<body>`.
 *
 * Es texto plano y no un módulo importado porque corre antes de que hidrate
 * nada: si esperara al bundle de React, el respaldo de 12 s dependería del
 * mismo JS que estamos tratando de no bloquear.
 */
export const chatDiferidoInit = `(function(){
var BASE_URL=${JSON.stringify(CHATWOOT_BASE_URL)};
var GESTOS=${JSON.stringify([...GESTOS_QUE_PIDEN_CHAT])};
var OPC={passive:true};
var pedido=false,traido=false;
var listo=document.readyState==="complete";
function traer(){
if(traido)return;traido=true;
var g=document.createElement("script");
g.src=BASE_URL+${JSON.stringify(CHATWOOT_SDK_PATH)};
g.defer=true;g.async=true;
g.onload=function(){window.chatwootSDK.run({websiteToken:${JSON.stringify(CHATWOOT_WEBSITE_TOKEN)},baseUrl:BASE_URL})};
document.body.appendChild(g);
}
function pedir(){
if(pedido)return;pedido=true;
for(var i=0;i<GESTOS.length;i++){window.removeEventListener(GESTOS[i],pedir,OPC);}
if(listo){traer();}
}
window.addEventListener("load",function(){listo=true;if(pedido){traer();}},OPC);
for(var i=0;i<GESTOS.length;i++){window.addEventListener(GESTOS[i],pedir,OPC);}
setTimeout(pedir,${ESPERA_SIN_GESTO_MS});
})();`;

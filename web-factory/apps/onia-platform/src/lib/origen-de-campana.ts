import { REGISTRO_URL } from "@/app/(sitio)/nav";
import { SITE_URL, WA_PHONE } from "@/lib/site";
import { PIXEL_DE_META, PIXEL_DESTINO } from "./pixel-de-meta";

export { PIXEL_DE_META, PIXEL_DESTINO };

/**
 * El origen de campaña con el que alguien llega a onia.com.bo viaja hasta el
 * alta de la app (`app.onia.com.bo/register`).
 *
 * **Por qué.** Hasta el 2026-09-29 los botones de alta mandaban al registro
 * pelado (o con `?plan=` y nada más): el `?src=` y los `utm_*` de un anuncio
 * se perdían en el primer clic, así que ningún alta se podía atribuir a su
 * campaña (handoff `meta-ads-prospeccion` §3.2). Encender pauta así es pagar
 * sin poder saber si sirvió.
 *
 * **Cómo, y por qué así.** Un `<script>` inline de ~1 KB, sin dependencias:
 *
 *  1. Al entrar, lee de la URL SOLO las claves de `PARAMETROS_DE_CAMPANA`,
 *     las SANEA (`sanear` del snippet: sin caracteres de control y con
 *     largo tope, pero sin perder paréntesis, barras ni `%`) y las guarda en
 *     `sessionStorage` (muere con la pestaña; no es una cookie).
 *  2. Al tocar un enlace al registro, le SUMA esas claves al href (sin pisar
 *     el `?plan=` que ya pone `registroConPlan`).
 *
 * El HTML servido no cambia: el enlace se decora recién en el clic, así no hay
 * que reescribir el DOM al cargar ni pelearse con la hidratación de React, y
 * cubre también los botones que dibuja un componente cliente (el conmutador
 * mensual/anual de `/precios`).
 *
 * **Del otro lado lo guarda la 1.0 de la app**, con la cuenta (`signupOrigin`),
 * incluidos `utm_id` y `utm_term`. Por eso las dos claves están en la lista: si
 * el sitio no las pasa, la app no tiene qué guardar. Hasta que esa versión esté
 * en producción, el registro vigente lee sólo `?plan=` y el origen se pierde
 * en su URL (handoff `meta-ads-prospeccion`).
 *
 * **El mismo snippet avisa al píxel de Meta**, sin cargar la librería de Meta:
 *
 *  - `PageView` con la página ya cargada y el navegador ocioso; `Contact` al
 *    tocar WhatsApp y `ClicAlta` (evento propio) al tocar el alta, cada uno una
 *    vez por página. Nunca `Lead`: un toque no es un lead, y una campaña que
 *    optimice por él paga clics contados como leads. `Lead` y
 *    `CompleteRegistration` quedan para el alta confirmada, en el producto.
 *  - La dirección que viaja (`dl`) es la página sin su query, más sólo las
 *    claves de campaña que pasaron la lista blanca. Nunca `location.href`: el
 *    formulario de `/guia-facturacion` enviado antes de que cargue React
 *    recarga la página con `?email=&whatsapp=`, y eso no puede ir a Meta.
 *  - Cada aviso es un `fetch` GET de ~0 KB a `/tr` con `keepalive`, para que
 *    sobreviva al clic que se lleva la página. `fbevents.js` pesa 112,6 KB
 *    comprimidos más 33,5 KB de configuración (medido el 2026-09-29) y la
 *    portada ya pasa su presupuesto de LCP en celular lento.
 *  - Sólo en `onia.com.bo` (el local y las vistas previas no ensucian el
 *    píxel) y nunca si el navegador manda Global Privacy Control. Lo declara
 *    la política de privacidad, §2.6.
 *
 * Lo que se pierde frente a la librería: la cookie `_fbp` y el emparejamiento
 * avanzado. El clic del anuncio igual queda atado por el `fbc` que se arma
 * con el `fbclid`.
 *
 * **Sin verificar contra Meta.** El `fetch` es `no-cors`: la respuesta es
 * opaca y el `catch` se traga cualquier error, y fuera de `onia.com.bo` no
 * avisa nada. Que Meta acepta estos avisos se sabe recién publicado, mirando
 * «Probar eventos» o el `last_fired_time` del píxel; hasta entonces el píxel
 * no está vivo.
 */

/** Las únicas claves que se guardan y viajan. Cualquier otra se ignora. */
export const PARAMETROS_DE_CAMPANA = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_id",
  "utm_term",
  "src",
  "fbclid",
] as const;

/**
 * Largo máximo de un valor; lo que pasa se CORTA, no se descarta. Un `fbclid`
 * real ronda 60-200 caracteres.
 */
export const LARGO_MAXIMO = 255;

/**
 * Caracteres de control (C0, DEL, C1) y los separadores de línea Unicode: no
 * son parte de ningún nombre de campaña y se BORRAN del valor.
 */
export const CONTROL = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;

/**
 * Lo único que hace descartar un valor entero: `<` o `>`. Eso es marcado, no
 * un nombre de campaña. Todo lo demás pasa.
 *
 * **Por qué ya no es una lista blanca de caracteres.** Hasta el 2026-10-01 el
 * valor tenía que ser letras, dígitos y `_ . ~ : | + -`: una campaña llamada
 * «Clínicas SCZ (sep)/v2» —paréntesis y barra, nombres que Meta Ads arma
 * solo— se descartaba ENTERA y el alta llegaba sin campaña, sin ningún error
 * a la vista. El valor nunca se escribe en el DOM: viaja por `URLSearchParams`
 * (que lo codifica) y por `sessionStorage`, así que no hay nada que escapar.
 */
export const VALOR_DESCARTADO = /[<>]/;


/** Dónde queda guardado el origen durante la visita. */
export const CLAVE_DE_SESION = "onia-origen";

/** El único host donde el píxel avisa. */
const HOST_QUE_MIDE = new URL(SITE_URL).hostname;

/** Un toque a esto es un `Contact`: el WhatsApp de la web, con cualquier texto. */
const WHATSAPP = `https://wa.me/${WA_PHONE}`;

// ponytail: el `fbc` lleva la hora del aviso y no la de la llegada; guardarla aparte si Meta lo marca en Diagnóstico.
export const origenDeCampanaInit = `(function(){
var CLAVES=${JSON.stringify([...PARAMETROS_DE_CAMPANA])},MAX=${LARGO_MAXIMO},CTRL=${CONTROL},MARCA=${VALOR_DESCARTADO},K=${JSON.stringify(CLAVE_DE_SESION)},REG=${JSON.stringify(REGISTRO_URL)},WA=${JSON.stringify(WHATSAPP)};
var PIXEL=${JSON.stringify(PIXEL_DE_META)},TR=${JSON.stringify(PIXEL_DESTINO)};
function sanear(v){if(typeof v!=="string")return null;v=v.replace(CTRL,"").trim();if(v.length>MAX)v=v.slice(0,MAX).replace(/[\\uD800-\\uDBFF]$/,"");return v&&!MARCA.test(v)?v:null;}
function limpiar(leer){var o={},n=0;for(var i=0;i<CLAVES.length;i++){var c=CLAVES[i],v=sanear(leer(c));if(v!==null){o[c]=v;n++;}}return n?o:null;}
var q=new URLSearchParams(location.search),aqui=limpiar(function(c){return q.get(c)}),o=aqui;
try{if(o){sessionStorage.setItem(K,JSON.stringify(o));}else{var g=JSON.parse(sessionStorage.getItem(K));o=g&&limpiar(function(c){return g[c]});}}catch(e){}
var medir=location.hostname===${JSON.stringify(HOST_QUE_MIDE)}&&!navigator.globalPrivacyControl,hecho={};
var dl=location.origin+location.pathname+(aqui?"?"+new URLSearchParams(aqui):"");
function avisar(ev){
if(!medir||hecho[ev])return;hecho[ev]=1;
var u=TR+"?id="+PIXEL+"&ev="+ev+"&dl="+encodeURIComponent(dl)+"&ts="+Date.now();
if(o&&o.fbclid)u+="&fbc="+encodeURIComponent("fb.1."+Date.now()+"."+o.fbclid);
try{fetch(u,{mode:"no-cors",keepalive:true,credentials:"include"}).catch(function(){});}catch(e){}
}
function tocar(e){
var a=e.target&&e.target.closest&&e.target.closest("a[href]");
if(!a)return;
var base=a.href.split(/[?#]/)[0];
if(base===REG){
if(o){var u=new URL(a.href);for(var c in o){if(!u.searchParams.has(c))u.searchParams.set(c,o[c]);}a.href=u.toString();}
avisar("ClicAlta");
}else if(base===WA){avisar("Contact");}
}
document.addEventListener("click",tocar,true);
document.addEventListener("auxclick",tocar,true);
function vista(){(window.requestIdleCallback||function(f){setTimeout(f,1)})(function(){avisar("PageView")});}
if(document.readyState==="complete"){vista();}else{window.addEventListener("load",vista);}
})();`;

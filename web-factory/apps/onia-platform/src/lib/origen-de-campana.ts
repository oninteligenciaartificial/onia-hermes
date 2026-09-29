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
 *  1. Al entrar, lee de la URL SOLO las claves de `PARAMETROS_DE_CAMPANA`, con
 *     valores cortos y de caracteres conocidos, y las guarda en
 *     `sessionStorage` (muere con la pestaña; no es una cookie).
 *  2. Al tocar un enlace al registro, le SUMA esas claves al href (sin pisar
 *     el `?plan=` que ya pone `registroConPlan`).
 *
 * El HTML servido no cambia: el enlace se decora recién en el clic, así no hay
 * que reescribir el DOM al cargar ni pelearse con la hidratación de React, y
 * cubre también los botones que dibuja un componente cliente (el conmutador
 * mensual/anual de `/precios`).
 *
 * Del otro lado, hoy el producto sólo lee `src` (en `AccessRequestForm`); los
 * `utm_*` y `fbclid` llegan a la URL del registro y queda del lado del producto
 * guardarlos.
 *
 * **El mismo snippet avisa al píxel de Meta**, sin cargar la librería de Meta:
 *
 *  - `PageView` con la página ya cargada y el navegador ocioso, y `Lead` (una
 *    vez por página) al tocar el alta o WhatsApp.
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
 */

/** Las únicas claves que se guardan y viajan. Cualquier otra se ignora. */
export const PARAMETROS_DE_CAMPANA = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "src",
  "fbclid",
] as const;

/** Largo máximo de un valor. Un `fbclid` real ronda 60-200 caracteres. */
export const LARGO_MAXIMO = 255;

/**
 * Letras (con tildes y ñ), dígitos y `_ . ~ : | + -` y espacio. Nada de `<`,
 * `"`, `/` ni `=`: un valor que los trae no es un nombre de campaña.
 */
export const VALOR_VALIDO = /^[\w.~:|+ \u00C0-\u017F-]+$/;

/** Dónde queda guardado el origen durante la visita. */
export const CLAVE_DE_SESION = "onia-origen";

/** El único host donde el píxel avisa. */
const HOST_QUE_MIDE = new URL(SITE_URL).hostname;

/** Un toque a esto es un `Lead` de WhatsApp: el número de la web, con cualquier texto. */
const WHATSAPP = `https://wa.me/${WA_PHONE}`;

// ponytail: el `fbc` lleva la hora del aviso y no la de la llegada; guardarla aparte si Meta lo marca en Diagnóstico.
export const origenDeCampanaInit = `(function(){
var CLAVES=${JSON.stringify([...PARAMETROS_DE_CAMPANA])},MAX=${LARGO_MAXIMO},OK=${VALOR_VALIDO},K=${JSON.stringify(CLAVE_DE_SESION)},REG=${JSON.stringify(REGISTRO_URL)},WA=${JSON.stringify(WHATSAPP)};
var PIXEL=${JSON.stringify(PIXEL_DE_META)},TR=${JSON.stringify(PIXEL_DESTINO)};
function limpiar(leer){var o={},n=0;for(var i=0;i<CLAVES.length;i++){var c=CLAVES[i],v=leer(c);if(typeof v==="string"&&v.length<=MAX&&OK.test(v)){o[c]=v;n++;}}return n?o:null;}
var q=new URLSearchParams(location.search),o=limpiar(function(c){return q.get(c)});
try{if(o){sessionStorage.setItem(K,JSON.stringify(o));}else{var g=JSON.parse(sessionStorage.getItem(K));o=g&&limpiar(function(c){return g[c]});}}catch(e){}
var medir=location.hostname===${JSON.stringify(HOST_QUE_MIDE)}&&!navigator.globalPrivacyControl,avisado=false;
function avisar(ev,extra){
if(!medir)return;
var u=TR+"?id="+PIXEL+"&ev="+ev+"&dl="+encodeURIComponent(location.href)+"&ts="+Date.now()+(extra||"");
if(o&&o.fbclid)u+="&fbc="+encodeURIComponent("fb.1."+Date.now()+"."+o.fbclid);
try{fetch(u,{mode:"no-cors",keepalive:true,credentials:"include"}).catch(function(){});}catch(e){}
}
function lead(que){if(avisado)return;avisado=true;avisar("Lead","&cd[content_name]="+que);}
function tocar(e){
var a=e.target&&e.target.closest&&e.target.closest("a[href]");
if(!a)return;
var base=a.href.split(/[?#]/)[0];
if(base===REG){
if(o){var u=new URL(a.href);for(var c in o){if(!u.searchParams.has(c))u.searchParams.set(c,o[c]);}a.href=u.toString();}
lead("registro");
}else if(base===WA){lead("whatsapp");}
}
document.addEventListener("click",tocar,true);
document.addEventListener("auxclick",tocar,true);
function vista(){(window.requestIdleCallback||function(f){setTimeout(f,1)})(function(){avisar("PageView")});}
if(document.readyState==="complete"){vista();}else{window.addEventListener("load",vista);}
})();`;

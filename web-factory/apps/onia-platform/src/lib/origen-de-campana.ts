import { REGISTRO_URL } from "@/app/(sitio)/nav";

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
export const VALOR_VALIDO = /^[\w.~:|+ À-ſ-]+$/;

/** Dónde queda guardado el origen durante la visita. */
export const CLAVE_DE_SESION = "onia-origen";

export const origenDeCampanaInit = `(function(){
var CLAVES=${JSON.stringify([...PARAMETROS_DE_CAMPANA])},MAX=${LARGO_MAXIMO},OK=${VALOR_VALIDO},K=${JSON.stringify(CLAVE_DE_SESION)},REG=${JSON.stringify(REGISTRO_URL)};
function limpiar(leer){var o={},n=0;for(var i=0;i<CLAVES.length;i++){var c=CLAVES[i],v=leer(c);if(typeof v==="string"&&v.length<=MAX&&OK.test(v)){o[c]=v;n++;}}return n?o:null;}
var q=new URLSearchParams(location.search),o=limpiar(function(c){return q.get(c)});
try{if(o){sessionStorage.setItem(K,JSON.stringify(o));}else{var g=JSON.parse(sessionStorage.getItem(K));o=g&&limpiar(function(c){return g[c]});}}catch(e){}
function tocar(e){
var a=e.target&&e.target.closest&&e.target.closest("a[href]");
if(!a||!o||a.href.split(/[?#]/)[0]!==REG)return;
var u=new URL(a.href);
for(var c in o){if(!u.searchParams.has(c))u.searchParams.set(c,o[c]);}
a.href=u.toString();
}
document.addEventListener("click",tocar,true);
document.addEventListener("auxclick",tocar,true);
})();`;

/**
 * ¿Qué dice que VENDE cada pantalla: el sistema, o el chatbot?
 *
 * LA REGLA. Sergio Urcullo, 2026-09-03: *"el sistema no ofrece directamente el bot, ofrece solo
 * el sistema… la referencia es Lety y Dapta, mirá cómo venden"*. De ahí sale la regla de
 * `CLAUDE.md`: la web habla del sistema de gestión por rubro y **el bot aparece como add-on,
 * nunca como el titular**.
 *
 * POR QUE EXISTE ESTE ARCHIVO, medido el 2026-09-26. Esa regla es uno de los cuatro números de
 * la definición de hecho de este carril, y su único instrumento era un `grep` sobre el HTML
 * crudo de la home:
 *
 *     bot: $(grep -oiE 'chatbot|recepcionista' home.html | wc -l)
 *     sistema: $(grep -oiE 'sistema|gesti[oó]n' home.html | wc -l)
 *
 * Ese día devolvió **bot 38 · sistema 37** — o sea, acusó a la home de vender el bot más que el
 * sistema. Era falso, y por DOS motivos que se suman:
 *
 *   1. Next imprime el árbol entero una segunda vez en el payload RSC (`self.__next_f`), dentro
 *      de un `<script>`. Cada frase visible se cuenta DOS veces, y el JSON-LD de la FAQ una
 *      tercera. Nada de eso lo lee un lead.
 *   2. Los `href="/chatbot"` del menú y del pie pesan lo mismo que una frase de venta. Un ítem
 *      de navegación no es un argumento: es una puerta.
 *
 * Descontado eso, las menciones visibles eran ~10 y ninguna era titular. **Un instrumento que no
 * puede distinguir un menú de una promesa no puede juzgar esta regla**: si un día el bot SÍ se
 * vuelve el titular, ese mismo `grep` lo diría con el mismo número con que hoy miente.
 *
 * QUE PREGUNTA, y por qué mira el TITULAR y no el recuento. La regla no dice "hablá poco del
 * bot", dice "nunca como el titular". El titular es lo que contesta *¿qué me estás vendiendo?*
 * antes de que el lead lea nada más, y son cuatro ranuras:
 *
 *     <title> · <h1> · og:title · meta description
 *
 * Las dos últimas importan tanto como las otras dos porque son **lo que se ve cuando Sergio
 * Urcullo manda el enlace por WhatsApp**: ninguna captura las mira, y el fetcher de WhatsApp las
 * lee aunque la ruta tenga `noindex` (medido el 2026-09-04 en el gate hermano).
 *
 * El recuento de menciones NO se juzga: se IMPRIME como contexto. Un ratio es ruidoso —una
 * página puede nombrar el bot seis veces en una FAQ sin venderlo— y un gate que se pone rojo por
 * ruido se termina desactivando.
 *
 * COMO NO FALLA EN VERDE. Cuatro costuras, cada una por un modo de mentir ya medido en esta app:
 *
 *   - Los sujetos salen del DISCO (`superficiesDeVenta()`), no de una lista: una ruta nueva nace
 *     cubierta.
 *   - La exención es POR NOMBRE y con su motivo. `/chatbot` vende el chatbot: ahí el bot ES el
 *     titular y corresponde. Eximir por categoría (`/^\/.*chatbot/`) taparía un árbol entero la
 *     próxima vez —exactamente el agujero que documenta `rutas-de-venta.mjs`— y el gate saldría
 *     verde igual.
 *   - Se exige haber ENCONTRADO sujetos y haber extraído un titular de cada uno. Una página de
 *     la que no se pudo sacar `<title>` ni `<h1>` es instrumento roto, no pantalla sana: sale
 *     NO MEDIDO (2), no LIMPIO.
 *   - IMPRIME qué midió. Medido el 2026-09-24 en esta misma app: un alias que corría un módulo
 *     puro no imprimía nada y salía 0, un verde mudo indistinguible de una medición que pasó.
 *
 * Uso:
 *   node scripts/titular-es-el-sistema.mjs
 *   node scripts/titular-es-el-sistema.mjs --json
 *   node scripts/titular-es-el-sistema.mjs --self-check     (puro, no toca produccion)
 */
import { normalizar, textoQueLeeElLead } from "./obra-viva.mjs";
import { superficiesDeVenta } from "./rutas-de-venta.mjs";

export const LIMPIO = 0;
export const DEFECTO_NUESTRO = 1;
export const NO_PUDE_MEDIR = 2;

const BASE = process.env.ONIA_BASE_URL || "https://onia.com.bo";

/**
 * Las rutas cuyo SUJETO es el chatbot: ahí el bot es el titular a propósito, porque la página
 * existe para explicar el add-on. Se eximen de a una y por nombre.
 */
export const VENDEN_EL_ADDON = new Map([
  ["/chatbot", "es la página del add-on: su trabajo es explicar el chatbot y cobrarlo aparte"],
  ["/v1/chatbot", "la versión v1 de la misma página del add-on, servida y leída por WhatsApp"],
]);

/** Lo que nombra al add-on. `recepcionista` entra porque es como se lo vende sin decirle bot. */
export const ES_EL_BOT =
  /\b(chat ?bot|bot de whatsapp|recepcionista virtual|recepcionista digital|asistente de whatsapp)\b/;

/** Lo que nombra a la oferta: el sistema de gestión por rubro. */
export const ES_EL_SISTEMA = /\b(sistema|gestion|plataforma|software|programa)\b/;

/**
 * El veredicto de UNA pantalla, puro y sin red.
 *
 * `titulares` son las cuatro ranuras ya extraídas. Devuelve la lista de ranuras donde el bot es
 * el titular; vacía = limpio. Una ranura ausente no es limpia ni sucia: la reporta `medir()`
 * como no medida, porque una página de venta sin `<title>` es otro defecto y no es éste.
 */
export function titularesQueVendenElBot(titulares) {
  return Object.entries(titulares)
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .filter(([, v]) => {
      const t = normalizar(v);
      // El bot es el titular cuando lo NOMBRA y el sistema no aparece para encabezarlo.
      // «Onia: el sistema … con chatbot de WhatsApp» nombra el bot y no lo vuelve titular.
      return ES_EL_BOT.test(t) && !ES_EL_SISTEMA.test(t);
    })
    .map(([ranura, v]) => ({ ranura, texto: v.trim() }));
}

/** Saca las cuatro ranuras del HTML servido. `null` = la ranura no está. */
export function titularesDe(html) {
  const uno = (re) => {
    const m = html.match(re);
    return m ? desescapar(m[1]).trim() : null;
  };
  return {
    title: uno(/<title[^>]*>([\s\S]*?)<\/title>/i),
    h1: uno(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? null,
    ogTitle: uno(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i),
    description: uno(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i),
  };
}

function desescapar(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&(?:quot|#34);/g, '"')
    .replace(/&(?:#39|apos);/g, "'")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * El recuento de CONTEXTO: cuántas veces el texto que lee un lead nombra al bot y al sistema.
 * No se juzga. Se cuenta sobre `textoQueLeeElLead`, que ya tira `<script>` —y con él el payload
 * RSC duplicado y el JSON-LD—, que es lo que inflaba el número viejo.
 */
export function recuento(textoNormalizado) {
  const cuantas = (re) => (textoNormalizado.match(new RegExp(re.source, "g")) || []).length;
  return { bot: cuantas(ES_EL_BOT), sistema: cuantas(ES_EL_SISTEMA) };
}

async function bajar(ruta) {
  const url = `${BASE}${ruta}`;
  try {
    const r = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
      headers: { "user-agent": "onia-titular/1.0" },
    });
    if (!r.ok) return { ruta, error: `HTTP ${r.status}` };
    return { ruta, html: await r.text() };
  } catch (e) {
    return { ruta, error: e?.message || String(e) };
  }
}

async function medir() {
  const json = process.argv.includes("--json");
  const rutas = superficiesDeVenta();

  if (rutas.length === 0) {
    console.log("NO MEDIDO: el barrido de superficies de venta salio VACIO (se movio src/app?).");
    return NO_PUDE_MEDIR;
  }

  const paginas = [];
  for (const ruta of rutas) paginas.push({ ruta, ...(await bajar(ruta)) });

  const noAlcanzadas = paginas.filter((p) => p.error);
  const medidas = paginas.filter((p) => p.html);

  const sinTitular = [];
  const defectos = [];
  let contextoHome = null;

  for (const p of medidas) {
    const t = titularesDe(p.html);
    if (!t.title && !t.h1) {
      sinTitular.push(p.ruta);
      continue;
    }
    if (p.ruta === "/") contextoHome = recuento(normalizar(textoQueLeeElLead(p.html)));
    if (VENDEN_EL_ADDON.has(p.ruta)) continue;
    for (const d of titularesQueVendenElBot(t)) defectos.push({ ruta: p.ruta, ...d });
  }

  if (json) {
    console.log(
      JSON.stringify(
        { base: BASE, rutas: rutas.length, medidas: medidas.length, defectos, sinTitular, noAlcanzadas, contextoHome },
        null,
        2,
      ),
    );
  }

  console.log(`Base: ${BASE}  ·  superficies de venta: ${medidas.length}/${rutas.length}`);
  for (const [r, motivo] of VENDEN_EL_ADDON) {
    if (rutas.includes(r)) console.log(`  exenta ${r} — ${motivo}`);
  }
  if (contextoHome) {
    console.log(
      `  contexto (no se juzga) — la home nombra el sistema ${contextoHome.sistema} vez/veces y el add-on ${contextoHome.bot}, sobre el texto que lee un lead.`,
    );
  }

  if (noAlcanzadas.length > 0 || sinTitular.length > 0) {
    for (const p of noAlcanzadas) console.log(`NO MEDIDO  ${p.ruta} — ${p.error}`);
    for (const r of sinTitular) console.log(`NO MEDIDO  ${r} — no tiene <title> ni <h1>: no se puede juzgar su titular`);
    console.log("\nNO MEDIDO: falta al menos una pantalla. Un barrido cortado no es un sitio sano.");
    return NO_PUDE_MEDIR;
  }

  if (defectos.length > 0) {
    for (const d of defectos) {
      console.log(`ROJO  ${d.ruta} — el ${d.ranura} vende el add-on y no el sistema: «${d.texto}»`);
    }
    console.log(
      `\nROJO: ${defectos.length} titular(es) ponen al chatbot de titular. La oferta es el SISTEMA; el bot es add-on (CLAUDE.md, Sergio Urcullo 2026-09-03).`,
    );
    return DEFECTO_NUESTRO;
  }

  console.log(
    `\nLIMPIO: en las ${medidas.length} pantallas servidas, ninguna de las 4 ranuras de titular (title, h1, og:title, description) vende el chatbot en vez del sistema.`,
  );
  return LIMPIO;
}

function selfCheck() {
  let malas = 0;
  const probar = (nombre, cond) => {
    if (!cond) {
      malas++;
      console.log(`  ROJO  ${nombre}`);
    }
  };

  // El caso que la regla prohíbe.
  probar(
    "un h1 que vende el bot sale rojo",
    titularesQueVendenElBot({ h1: "El chatbot de WhatsApp que atiende por vos" }).length === 1,
  );
  // El caso legítimo: el bot NOMBRADO dentro de una promesa encabezada por el sistema.
  probar(
    "nombrar el add-on junto al sistema NO es titular",
    titularesQueVendenElBot({ h1: "El sistema de gestión, con chatbot de WhatsApp incluido" }).length === 0,
  );
  // La ranura que ninguna captura mira.
  probar(
    "la description tambien cuenta",
    titularesQueVendenElBot({ description: "Tu recepcionista virtual 24/7" })[0]?.ranura === "description",
  );
  // Una ranura vacía no inventa defecto.
  probar("una ranura ausente no es defecto", titularesQueVendenElBot({ title: "", h1: null }).length === 0);
  // El bug que hizo falta este archivo: el payload RSC no puede contar.
  const conRsc =
    '<html><head><title>Onia — el sistema</title></head><body><p>Chatbot de WhatsApp</p>' +
    '<script>self.__next_f.push("chatbot chatbot chatbot chatbot")</script></body></html>';
  probar("el payload RSC no infla el recuento", recuento(normalizar(textoQueLeeElLead(conRsc))).bot === 1);
  // La exención es por nombre, no por patrón.
  probar("la exencion de /chatbot existe y tiene motivo", (VENDEN_EL_ADDON.get("/chatbot") || "").length > 20);
  probar("no se exime por categoria", !VENDEN_EL_ADDON.has("/v1/modulos/dental"));

  console.log(malas === 0 ? "self-check: 7/7 verde" : `self-check: ${malas} roja(s)`);
  return malas === 0 ? LIMPIO : DEFECTO_NUESTRO;
}

const esPrincipal = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (esPrincipal) {
  const codigo = process.argv.includes("--self-check") ? selfCheck() : await medir();
  process.exit(codigo);
}

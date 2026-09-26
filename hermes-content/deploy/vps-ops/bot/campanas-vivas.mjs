#!/usr/bin/env node
// ONIA — ¿LA FRASE QUE LA WEB VIVA LE ESCRIBE AL LEAD, EL BOT VIVO LA ESCUCHA?
//
// Las campañas son un PAR: la web escribe la frase por el cliente (un `wa.me?text=...` que
// el lead manda sin tipear) y el bot la reconoce exacta y contesta con la respuesta de esa
// campaña — la que pide rubro y cuánta gente trabaja, o sea la que CALIFICA. Si los dos
// lados no dicen la misma cadena, el par se rompe y el lead recibe el saludo genérico: el
// clic más caro del sitio contestado con lo mismo que un "hola" suelto.
//
// POR QUÉ NO ALCANZA EL GATE QUE YA EXISTE. `campanas-web.test.mjs` valida el par contra el
// REPO: la frase literal de `site.ts` contra `knowledge.onia.json`. Eso es correcto y es lo
// que tiene que estar en la cadena — pero compara repo con repo, y lo dice él mismo en su
// línea 35 ("necesita el VPS y por eso no entra en la cadena"). Las dos mitades del par no
// se publican juntas:
//
//   · la web se publica SOLA cada 3 h (`/root/bin/onia-publicar-solo.sh`, cron 50 */3) —
//     siempre que no toque una fuente de precio;
//   · el `knowledge.onia.json` del bot ES una fuente de precio (está en FIRMA_HUMANA de
//     `scripts/loops/extras/publicar-solo.sh`), así que su deploy se FRENA esperando la
//     firma de Sergio Urcullo.
//
// O sea que "web adelante, bot atrás" no es un accidente: es el estado NORMAL de este
// sistema, y no había ni un instrumento que lo viera. Medido el 2026-09-26 03:40 La Paz, con
// el gate del repo en 17/17 verde: `onia.com.bo/contacto` ya mandaba "la consulta comercial
// de 30 minutos" y "la demo de 30 minutos", y el bot que corre
// (`/tmp/onia-bot/knowledge.json` en `onia-center`, md5 06a15715, versión 2026-09-24.1)
// seguía escuchando "de 20 minutos" y "de 45 minutos". Los dos botones de agenda de la
// página de contacto estaban muertos y todo daba verde.
//
//   node hermes-content/deploy/vps-ops/bot/campanas-vivas.mjs [--self-check]
//
// CÓDIGOS DE SALIDA
//   0  cada frase que la web viva manda y el repo empareja, el bot viva la escucha
//   1  hay una frase viva que el bot NO escucha  → ese lead recibe el saludo genérico
//   2  NO MEDIDO — no se pudo preguntar a uno de los dos lados (no es estar bien)
//
// POR QUÉ TRI-ESTADO: los dos lados son remotos (la web por HTTPS, el bot por `docker exec`
// contra el VPS). Un `catch` que devuelva "no escucha" convierte "no pude preguntar" en un
// rojo inventado, y uno que devuelva "escucha" es el falso verde que este archivo existe
// para matar. Sin poder preguntar NO se concluye.
//
// LO QUE MIDE DE CADA LADO, y por qué ahí:
//
//  · web  — las páginas VIVAS, no `site.ts`. El literal del repo puede estar corregido y la
//           página publicada seguir sirviendo el viejo: es el mismo desfase, del otro lado.
//           Las rutas se DERIVAN del disco (las que nombran una constante de frase), nunca
//           se escriben a mano: una ruta nueva con un botón de WhatsApp tiene que entrar
//           sola o el instrumento envejece mudo.
//  · bot  — `/tmp/onia-bot/knowledge.json` DENTRO de `onia-center`, que es lo que el motor
//           lee. No `/opt/onia/bot/` (eso es lo que se desplegó, y el rsync puede no haber
//           corrido) ni el archivo del repo (eso es la intención). Y además la fila del
//           panel: `mergePanelKnowledge` hace `{...archivo, ...panel}` CLAVE POR CLAVE, así
//           que si el panel publica `campanas` gana el panel y el archivo no se lee. Medido
//           hoy: `public.chatbot_knowledge` v5 `publicado` NO trae la clave, así que hoy
//           manda el archivo — pero preguntarlo es lo que evita que esto mienta el día que
//           alguien publique desde el panel.
//  · repo — `knowledge.onia.json`: el PAR QUE SE QUISO. Sólo se juzga una frase viva si el
//           repo la empareja con una respuesta propia; una frase que ninguna campaña
//           pretende contestar no es una deriva, es un mensaje cualquiera.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as net from "node:net";

// En nodo-casa (WSL, Node >=20) `fetch` corta CADA intento de conexión a 250 ms por
// `autoSelectFamily`, y contra un host dual-stack lento eso da ETIMEDOUT sobre un sitio que
// `curl` contesta 200. Sin esto el instrumento saldría NO MEDIDO desde casa para siempre.
try {
  net.setDefaultAutoSelectFamilyAttemptTimeout?.(2000);
} catch {
  /* Node que no lo expone: el default ya sirve */
}

const AQUI = fileURLToPath(new URL(".", import.meta.url));
// bot/ -> vps-ops/ -> deploy/ -> hermes-content/ -> raíz del repo
const RAIZ = join(AQUI, "..", "..", "..", "..");
const SITIO = join(RAIZ, "web-factory", "apps", "onia-platform", "src", "app", "(sitio)");
const SITE_TS = join(RAIZ, "web-factory", "apps", "onia-platform", "src", "lib", "site.ts");
const DOC_REPO = fileURLToPath(new URL("./knowledge.onia.json", import.meta.url));

const BASE = process.env.ONIA_CAMPANAS_BASE || "https://onia.com.bo";
const CONTENEDOR = process.env.ONIA_BOT_CONTENEDOR || "onia-center";
const KNOWLEDGE_VIVO = "/tmp/onia-bot/knowledge.json";

/**
 * Los nombres de las constantes de `site.ts` que ARMAN una frase de WhatsApp.
 *
 * Se derivan del archivo y no se listan acá por la misma razón que las rutas: una constante
 * nueva tiene que entrar sola. `waLink` y `waServiciosLink` son las dos fábricas que usa el
 * sitio (el gate del repo deriva con ese mismo par en su regex).
 */
export function constantesDeFrase(fuente) {
  const nombres = new Set();
  const re = /export\s+const\s+([A-Z][A-Z0-9_]*)\s*=\s*wa(?:Servicios)?Link\s*\(/g;
  for (const m of fuente.matchAll(re)) nombres.add(m[1]);
  return [...nombres].sort();
}

/** Todas las `page.tsx` bajo `(sitio)`, con su ruta pública. `(sitio)` es un route group: no viaja a la URL. */
export function paginasDelSitio(dir, prefijo = "", salida = []) {
  let entradas;
  try {
    entradas = readdirSync(dir, { withFileTypes: true });
  } catch {
    return salida; // el que llama decide si eso es NO MEDIDO
  }
  for (const e of entradas) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      // Un segmento entre paréntesis es un grupo de rutas: agrupa archivos, no URL.
      const seg = /^\(.*\)$/.test(e.name) ? prefijo : `${prefijo}/${e.name}`;
      paginasDelSitio(full, seg, salida);
    } else if (e.name === "page.tsx" || e.name === "page.ts") {
      salida.push({ ruta: prefijo === "" ? "/" : prefijo, archivo: full });
    }
  }
  return salida;
}

/** Las rutas vivas que hay que mirar: las que nombran alguna constante de frase. */
export function rutasQueMandanFrases(paginas, constantes, leer = (f) => readFileSync(f, "utf8")) {
  const rutas = [];
  for (const p of paginas) {
    let src;
    try {
      src = leer(p.archivo);
    } catch {
      continue;
    }
    // \b para que `WA_URL` no matchee dentro de `WA_URL_VIEJA` ni al revés.
    if (constantes.some((c) => new RegExp(`\\b${c}\\b`).test(src))) rutas.push(p.ruta);
  }
  return [...new Set(rutas)].sort();
}

/**
 * Las frases que un HTML servido le escribe al lead.
 *
 * Se leen del `wa.me?text=`, decodificado. Ojo: el HTML de Next trae las URL escapadas
 * (`&amp;`) y el texto con `%20`; se normalizan las dos cosas o la comparación exacta —que
 * es la que importa, porque el bot matchea exacto— da deriva donde no hay.
 */
export function frasesDeHtml(html) {
  const frases = new Set();
  for (const m of String(html).matchAll(/wa\.me\/[^"'\\\s<>]*[?&](?:amp;)?text=([^"'\\\s<>&]+)/g)) {
    try {
      frases.add(decodeURIComponent(m[1].replace(/\+/g, " ")));
    } catch {
      /* un text ilegible no es una frase: se ignora, no se inventa */
    }
  }
  return frases;
}

/** Junta las frases de todas las rutas vivas. Una ruta que no contesta es NO MEDIDO, no "sin frases". */
export async function frasesQueMandaLaWeb(rutas, traer) {
  const frases = new Set();
  const noMedidas = [];
  for (const ruta of rutas) {
    try {
      const html = await traer(`${BASE}${ruta}`);
      if (typeof html !== "string" || html.length === 0) {
        noMedidas.push({ ruta, motivo: "respuesta vacía" });
        continue;
      }
      for (const f of frasesDeHtml(html)) frases.add(f);
    } catch (error) {
      noMedidas.push({ ruta, motivo: String(error?.message || error).slice(0, 120) });
    }
  }
  return { frases, noMedidas };
}

/** Las frases que el repo EMPAREJA con respuesta propia (la intención del par). */
export function campanasDelRepo(doc) {
  const campanas = Array.isArray(doc?.campanas) ? doc.campanas : [];
  return campanas.map((c) => c?.frase).filter((f) => typeof f === "string" && f.length > 0);
}

/**
 * Lo que el bot VIVO escucha. `null` = no se pudo preguntar (NO MEDIDO).
 *
 * `fuente` dice de dónde salió, porque el remedio es distinto: si manda el panel, se corrige
 * publicando desde `/settings/chatbot`; si manda el archivo, se corrige con un deploy del bot.
 */
export function campanasQueEscuchaElBot(correr, panelTraeCampanas) {
  let crudo;
  try {
    crudo = correr(["exec", CONTENEDOR, "cat", KNOWLEDGE_VIVO]);
  } catch (error) {
    return { frases: null, motivo: `no pude leer ${KNOWLEDGE_VIVO} en ${CONTENEDOR}: ${String(error?.message || error).slice(0, 120)}` };
  }
  let doc;
  try {
    doc = JSON.parse(crudo);
  } catch {
    return { frases: null, motivo: `${KNOWLEDGE_VIVO} no es JSON legible` };
  }
  if (panelTraeCampanas === null || panelTraeCampanas === undefined) {
    return { frases: null, motivo: "no pude preguntarle al panel si pisa `campanas` (y si lo pisa, el archivo no se lee)" };
  }
  if (panelTraeCampanas === true) {
    return { frases: null, motivo: "la fila publicada del panel TRAE `campanas`: pisa al archivo clave por clave y este instrumento todavía no lee esa fila" };
  }
  return { frases: new Set(campanasDelRepo(doc)), fuente: `archivo ${KNOWLEDGE_VIVO}`, version: doc?.version };
}

/**
 * El veredicto.
 *
 * Rojo SOLO cuando las tres cosas pasan a la vez: el repo empareja la frase, la web viva ya
 * la manda, y el bot vivo no la escucha. Ésa es la deriva que le cuesta el lead.
 */
export function juzgar({ repo, web, bot, noMedidas = [] }) {
  const lineas = [];

  if (noMedidas.length > 0) {
    for (const nm of noMedidas) lineas.push(`  NO MEDIDO  la web no contestó ${nm.ruta}: ${nm.motivo}`);
    return { exit: 2, lineas, veredicto: `NO MEDIDO — ${noMedidas.length} ruta(s) viva(s) sin respuesta: no se puede saber qué manda la web` };
  }
  if (!bot || bot.frases === null) {
    lineas.push(`  NO MEDIDO  ${bot?.motivo || "no se pudo preguntar qué escucha el bot"}`);
    return { exit: 2, lineas, veredicto: "NO MEDIDO — no se pudo leer qué escucha el bot vivo" };
  }
  if (repo.length === 0) {
    lineas.push("  NO MEDIDO  el knowledge del repo no declara ni una campaña: no hay par que juzgar");
    return { exit: 2, lineas, veredicto: "NO MEDIDO — sin campañas en el repo no hay nada que comparar" };
  }

  // Sólo se juzgan las frases que el repo pretende contestar con respuesta propia.
  const juzgables = repo.filter((f) => web.has(f));
  const rotas = juzgables.filter((f) => !bot.frases.has(f));
  const sanas = juzgables.filter((f) => bot.frases.has(f));

  for (const f of sanas) lineas.push(`  ok         "${f}"`);
  for (const f of rotas) {
    lineas.push(`  ROTA       "${f}"`);
    lineas.push("             la web viva se la escribe al lead y el bot vivo NO la escucha: recibe el saludo genérico");
  }

  // El repo empareja una frase que NINGUNA página viva manda: no es rojo (puede venir de una
  // pauta o de un material impreso), pero se dice — un par que nadie dispara es peso muerto.
  for (const f of repo.filter((x) => !web.has(x))) {
    lineas.push(`  AVISO      "${f}" — ninguna ruta viva la manda hoy (¿pauta, o quedó huérfana?)`);
  }
  // Y al revés: el bot escucha algo que el repo ya no empareja. Eso tiene DOS causas con
  // remedios OPUESTOS, y confundirlas manda al revés:
  //
  //   · si hay frases ROTAS, lo más probable es que ésta sea la versión VIEJA de una de
  //     ellas (el repo editó la frase y producción quedó con la anterior) → el deploy es
  //     precisamente el arreglo;
  //   · si NO hay ninguna rota, producción tiene una frase que el repo nunca emparejó →
  //     quedó adelante, y un deploy por lista blanca la BORRARÍA.
  //
  // Se afirma sólo lo que se puede distinguir. Decir "un deploy la borraría" cuando en
  // realidad el deploy la corrige es el mismo error que costó el gate hermano del 2026-09-26
  // (un instrumento que nombraba el remedio OPUESTO), así que acá se nombra la duda.
  for (const f of [...bot.frases].filter((x) => !repo.includes(x))) {
    if (rotas.length > 0) {
      lineas.push(`  AVISO      el bot vivo escucha "${f}", que el repo ya no empareja — con ${rotas.length} frase(s) rota(s) arriba, lo esperable es que sea la versión VIEJA de una de ellas: el deploy la reemplaza`);
    } else {
      lineas.push(`  AVISO      el bot vivo escucha "${f}", que el repo ya no empareja, y NO hay ninguna frase rota: producción quedó ADELANTE y un deploy la borraría`);
    }
  }

  if (rotas.length > 0) {
    return {
      exit: 1,
      lineas,
      veredicto: `ROTO — ${rotas.length} de ${juzgables.length} frase(s) que la web viva manda no las escucha el bot vivo (${bot.fuente}${bot.version ? `, versión ${bot.version}` : ""})`,
    };
  }
  return {
    exit: 0,
    lineas,
    veredicto: `ok — las ${juzgables.length} frase(s) que la web viva manda las escucha el bot vivo (${bot.fuente}${bot.version ? `, versión ${bot.version}` : ""})`,
  };
}

// ── medición viva ───────────────────────────────────────────────────────────────────────

function dockerCorre(args) {
  return execFileSync("docker", args, { encoding: "utf8", timeout: 120_000, maxBuffer: 8 * 1024 * 1024 });
}

/** ¿La fila PUBLICADA del panel trae `campanas`? `null` = no pude preguntar. */
function panelPisaCampanas(correr = dockerCorre) {
  // `?` sobre jsonb pregunta por la CLAVE. El literal 'campanas' se arma con chr() porque el
  // comando viaja por capas de shell (shim -> ssh -> docker exec) y una comilla suelta se pierde.
  const clave = "(chr(99)||chr(97)||chr(109)||chr(112)||chr(97)||chr(110)||chr(97)||chr(115))";
  try {
    const out = correr([
      "exec",
      "supabase-db",
      "psql",
      "-U",
      "postgres",
      "-tAc",
      `select (data ? ${clave}) from public.chatbot_knowledge where status = (chr(112)||chr(117)||chr(98)||chr(108)||chr(105)||chr(99)||chr(97)||chr(100)||chr(111)) order by version desc limit 1;`,
    ]);
    const v = String(out).trim();
    if (v === "t") return true;
    if (v === "f") return false;
    if (v === "") return false; // no hay fila publicada: el archivo manda, y eso SÍ se sabe
    return null;
  } catch {
    return null;
  }
}

async function traerHtml(url) {
  const ctrl = new AbortController();
  const corte = setTimeout(() => ctrl.abort(), 30_000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally {
    clearTimeout(corte);
  }
}

async function medir() {
  let constantes = [];
  try {
    constantes = constantesDeFrase(readFileSync(SITE_TS, "utf8"));
  } catch (error) {
    console.log(`NO MEDIDO — no pude leer ${SITE_TS}: ${String(error?.message || error).slice(0, 140)}`);
    return 2;
  }
  const paginas = paginasDelSitio(SITIO);
  const rutas = rutasQueMandanFrases(paginas, constantes);
  if (constantes.length === 0 || rutas.length === 0) {
    console.log(`NO MEDIDO — no derivé ni una ruta con frase de WhatsApp (constantes: ${constantes.length}, páginas: ${paginas.length}). Si el sitio cambió de forma, este derivador quedó ciego.`);
    return 2;
  }

  let repo = [];
  try {
    repo = campanasDelRepo(JSON.parse(readFileSync(DOC_REPO, "utf8")));
  } catch (error) {
    console.log(`NO MEDIDO — no pude leer las campañas del repo: ${String(error?.message || error).slice(0, 140)}`);
    return 2;
  }

  const { frases: web, noMedidas } = await frasesQueMandaLaWeb(rutas, traerHtml);
  const bot = campanasQueEscuchaElBot(dockerCorre, panelPisaCampanas());
  const v = juzgar({ repo, web, bot, noMedidas });

  console.log(`rutas vivas miradas (${rutas.length}): ${rutas.join(" ")}`);
  for (const l of v.lineas) console.log(l);
  console.log(`\nVEREDICTO: ${v.veredicto}`);
  return v.exit;
}

// ── self-check: prueba la lógica del juicio sin tocar el sistema ─────────────────────────

export function selfCheck() {
  const fallas = [];
  const ok = (cond, que) => {
    if (!cond) fallas.push(que);
  };

  const FRASE_30 = "Quiero agendar la demo de 30 minutos.";
  const FRASE_20 = "Quiero agendar la demo de 20 minutos.";

  // El caso real del 2026-09-26: repo y web en 30, bot vivo en 20.
  const deriva = juzgar({
    repo: [FRASE_30],
    web: new Set([FRASE_30]),
    bot: { frases: new Set([FRASE_20]), fuente: "archivo", version: "2026-09-24.1" },
  });
  ok(deriva.exit === 1, "web manda una frase que el bot no escucha tiene que salir ROJO");
  ok(deriva.lineas.join("\n").includes("saludo genérico"), "el rojo tiene que decir QUÉ recibe el lead, no sólo que difiere");
  ok(deriva.lineas.join("\n").includes(FRASE_30), "el rojo tiene que NOMBRAR la frase que se rompió");

  const sano = juzgar({ repo: [FRASE_30], web: new Set([FRASE_30]), bot: { frases: new Set([FRASE_30]), fuente: "archivo" } });
  ok(sano.exit === 0, "los dos lados diciendo lo mismo es verde");

  // Una frase que el repo NO empareja no es deriva: es un mensaje cualquiera.
  const ajena = juzgar({
    repo: [FRASE_30],
    web: new Set([FRASE_30, "Hola, quiero saber el precio"]),
    bot: { frases: new Set([FRASE_30]), fuente: "archivo" },
  });
  ok(ajena.exit === 0, "una frase viva que ninguna campaña pretende contestar no puede poner rojo el gate");

  // No poder preguntar NUNCA es verde ni rojo.
  ok(juzgar({ repo: [FRASE_30], web: new Set([FRASE_30]), bot: { frases: null, motivo: "sin docker" } }).exit === 2,
    "no poder leer el bot vivo es NO MEDIDO (2)");
  ok(juzgar({ repo: [FRASE_30], web: new Set(), bot: { frases: new Set([FRASE_30]) }, noMedidas: [{ ruta: "/contacto", motivo: "HTTP 503" }] }).exit === 2,
    "una ruta viva que no contesta es NO MEDIDO (2), nunca 'la web no manda nada'");
  ok(juzgar({ repo: [], web: new Set(), bot: { frases: new Set() } }).exit === 2,
    "sin campañas en el repo no hay par que juzgar: NO MEDIDO, no verde");

  // El panel pisa al archivo: si trae `campanas`, el archivo NO se lee y no se puede concluir.
  const conPanel = campanasQueEscuchaElBot(() => JSON.stringify({ campanas: [{ frase: FRASE_20 }] }), true);
  ok(conPanel.frases === null, "si el panel publica `campanas`, leer el archivo miente: tiene que ser NO MEDIDO");
  const sinPanel = campanasQueEscuchaElBot(() => JSON.stringify({ campanas: [{ frase: FRASE_20 }] }), false);
  ok(sinPanel.frases instanceof Set && sinPanel.frases.has(FRASE_20), "sin panel, las campañas del archivo son las efectivas");
  ok(campanasQueEscuchaElBot(() => { throw new Error("sin docker"); }, false).frases === null,
    "no poder hablar con el contenedor es NO MEDIDO, nunca 'no escucha nada'");

  // Producción adelante del repo se AVISA, no se calla: un deploy la borraría.
  const adelante = juzgar({
    repo: [FRASE_30],
    web: new Set([FRASE_30]),
    bot: { frases: new Set([FRASE_30, "Hola, vengo de una pauta"]), fuente: "archivo" },
  });
  ok(adelante.exit === 0, "producción con una frase extra no es rojo");
  ok(adelante.lineas.join("\n").includes("ADELANTE"), "producción adelante del repo tiene que AVISARSE: un deploy la borraría");

  // Y la contracara, que es la que manda al remedio OPUESTO si se confunde: con una frase
  // ROTA arriba, la frase que sólo tiene el bot es la VIEJA y el deploy la arregla. Decirle
  // "un deploy la borraría" ahí es recomendar justo lo contrario de lo que hay que hacer.
  const vieja = juzgar({
    repo: [FRASE_30],
    web: new Set([FRASE_30]),
    bot: { frases: new Set([FRASE_20]), fuente: "archivo" },
  });
  ok(vieja.exit === 1, "con la frase cambiada el gate sigue rojo");
  ok(vieja.lineas.join("\n").includes("versión VIEJA"),
    "si hay una frase rota, la que sólo tiene el bot se nombra como la VIEJA, no como producción adelante");
  ok(!vieja.lineas.join("\n").includes("la borraría"),
    "con una frase rota NO se puede decir que el deploy borraría algo: el deploy es el arreglo");

  // Derivadores: una ruta nueva con botón tiene que entrar sola.
  const constantes = constantesDeFrase('export const WA_URL = waLink("hola");\nexport const AGENDA = waServiciosLink("che");\nconst OTRO = 1;');
  ok(constantes.length === 2 && constantes.includes("WA_URL") && constantes.includes("AGENDA"),
    "las constantes de frase se derivan de las DOS fábricas (waLink y waServiciosLink)");
  ok(!constantesDeFrase('export const SITE_URL = "https://onia.com.bo";').includes("SITE_URL"),
    "una constante que no arma una frase de WhatsApp no es sujeto");

  const rutas = rutasQueMandanFrases(
    [{ ruta: "/", archivo: "a" }, { ruta: "/contacto", archivo: "b" }, { ruta: "/terminos", archivo: "c" }],
    ["WA_URL"],
    (f) => (f === "c" ? "nada de whatsapp" : "usa WA_URL aquí"),
  );
  ok(rutas.length === 2 && rutas.includes("/contacto") && !rutas.includes("/terminos"),
    "sólo entran las rutas que nombran una constante de frase");
  ok(rutasQueMandanFrases([{ ruta: "/x", archivo: "a" }], ["WA_URL"], () => "usa WA_URL_VIEJA").length === 0,
    "el nombre se matchea con límites: WA_URL_VIEJA no es WA_URL");

  // El HTML servido trae la frase escapada: si no se normaliza, la comparación exacta miente.
  const deHtml = frasesDeHtml('<a href="https://wa.me/591?text=Hola%2C%20quiero%20la%20demo%20de%2030%20minutos.">x</a>');
  ok(deHtml.has("Hola, quiero la demo de 30 minutos."), "la frase se compara DECODIFICADA");
  ok(frasesDeHtml('<a href="https://wa.me/591?foo=1&amp;text=Hola%20ahi">x</a>').has("Hola ahi"),
    "un `&amp;text=` del HTML de Next también es una frase");
  ok(frasesDeHtml("<a href='https://wa.me/591'>sin texto</a>").size === 0, "un wa.me sin text no aporta frase");

  for (const f of fallas) console.log(`  FALLA  ${f}`);
  console.log(fallas.length ? `self-check: ${fallas.length} falla(s)` : "self-check: ok");
  return fallas.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--self-check")) process.exit(selfCheck());
  else medir().then((c) => process.exit(c));
}

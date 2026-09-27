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
//   1  hay una frase viva que el bot NO escucha y NADA desplegado la arregla → hay que
//      ESCRIBIR la respuesta. Es trabajo de este carril.
//   2  NO MEDIDO — no se pudo preguntar a uno de los dos lados (no es estar bien)
//   3  hay una frase rota, pero el repo YA la dice bien y producción tiene la versión vieja →
//      no hay código que escribir, falta PUBLICAR el bot. Rojo para el lead, no del carril.
//
// POR QUÉ EL ROJO VIENE PARTIDO EN 1 Y 3 (2026-09-26/27). Este medidor entró a la medición de
// arranque del carril y devolvió `exit 1` en TODAS las vueltas, por el deploy del bot que
// espera la firma de Sergio Urcullo: el repo pasó las dos frases de agenda a 30 minutos y
// producción sigue en 20 y 45. Un rojo permanente con causa conocida se archiva como "el de
// siempre", y entonces el día que alguien rompa una frase EN EL REPO —el caso que este archivo
// existe para agarrar— sale el mismo código y nadie lo distingue. Es el daño que ya hicieron
// acá los `exit 2` ambientales. Los dos rojos piden trabajo OPUESTO, así que se cuentan aparte:
// se emparejan por `mismaFraseSalvoNumeros`, y cuando hay una de cada clase manda el `1`, para
// que una respuesta que nadie escribió no quede escondida detrás de un pedido de deploy.
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
//           Las rutas se DERIVAN del disco —TODAS las `page.tsx` de `src/app`— y se visitan
//           todas: qué frase manda cada una se MIDE en su HTML, no se deduce de la fuente.
//
//           ⚠️ Acá decía que las rutas eran "las que nombran una constante de frase", y ese
//           recorte tenía al medidor ciego en 13 de las 21 rutas vivas con botón. Medido el
//           2026-09-26: caminaba sólo `(sitio)` y encima exigía que la `page.tsx` nombrara un
//           `export` de `site.ts`, así que visitaba 8. `/servicios/consultoria`,
//           `/servicios/marketing-ia` y `/v1/chatbot` arman la frase con `waServiciosLink("…")`
//           en la propia página y `/v1/empezar` en un módulo que importa — las cuatro
//           contestan 200 en `onia.com.bo` y las cuatro escriben su `wa.me?text=`. El daño no
//           era sólo contar de menos: `juzgar()` sólo juzga una frase que la web MANDA, así
//           que un par roto en una de esas rutas salía como `AVISO ... ¿quedó huérfana?` —una
//           línea que invita a BORRAR la campaña— en vez de ROJO. Hoy las cuatro están sanas
//           por suerte, no por medición: nadie las había comparado nunca.
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
const APP = join(RAIZ, "web-factory", "apps", "onia-platform", "src", "app");
const DOC_REPO = fileURLToPath(new URL("./knowledge.onia.json", import.meta.url));

const BASE = process.env.ONIA_CAMPANAS_BASE || "https://onia.com.bo";
const CONTENEDOR = process.env.ONIA_BOT_CONTENEDOR || "onia-center";
const KNOWLEDGE_VIVO = "/tmp/onia-bot/knowledge.json";

/**
 * Todas las `page.tsx` del app, con su ruta pública.
 *
 * Un segmento entre paréntesis es un route group: agrupa archivos y NO viaja a la URL. Las
 * carpetas que empiezan con `_` son privadas de Next y las que empiezan con `@` son slots de
 * rutas paralelas: ninguna de las dos se publica, así que no son rutas que un lead pueda abrir.
 */
export function paginasDelWeb(dir, prefijo = "", salida = []) {
  let entradas;
  try {
    entradas = readdirSync(dir, { withFileTypes: true });
  } catch {
    return salida; // el que llama decide si eso es NO MEDIDO
  }
  for (const e of entradas) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith("_") || e.name.startsWith("@")) continue;
      const seg = /^\(.*\)$/.test(e.name) ? prefijo : `${prefijo}/${e.name}`;
      paginasDelWeb(full, seg, salida);
    } else if (e.name === "page.tsx" || e.name === "page.ts") {
      salida.push({ ruta: prefijo === "" ? "/" : prefijo, archivo: full });
    }
  }
  return salida;
}

/**
 * Qué rutas se visitan y cuáles NO se pueden visitar.
 *
 * Se visitan TODAS: qué frase manda una página se lee de su HTML, y deducirlo de la fuente es
 * lo que dejó 13 rutas afuera (ver la cabecera). Lo único que no se puede abrir es una ruta con
 * segmento dinámico —`/blog/[slug]` necesita un valor que este medidor no tiene para inventar—,
 * y eso se NOMBRA: una ruta descartada en silencio es la misma ceguera con otro disfraz.
 */
export function rutasAMirar(paginas) {
  const visitables = new Set();
  const sinMedir = [];
  for (const p of paginas) {
    if (/\[[^\]]+\]/.test(p.ruta)) {
      sinMedir.push({ ruta: p.ruta, motivo: "tiene un segmento dinámico: no se puede visitar sin un valor" });
    } else {
      visitables.add(p.ruta);
    }
  }
  return { visitables: [...visitables].sort(), sinMedir };
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
        noMedidas.push({ ruta, motivo: "la web contestó vacío" });
        continue;
      }
      for (const f of frasesDeHtml(html)) frases.add(f);
    } catch (error) {
      noMedidas.push({ ruta, motivo: `la web no contestó: ${String(error?.message || error).slice(0, 110)}` });
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
 * ¿Son la MISMA frase con otros números?
 *
 * Es lo único que separa "producción tiene la versión vieja" de "nadie escribió la respuesta",
 * y esos dos piden trabajo opuesto. Se compara ignorando los dígitos porque así fue la deriva
 * real del 2026-09-26 —la web pasó a "30 minutos" y el bot vivo quedó en "20" y en "45"—, y
 * porque un criterio más flojo (parecido general) emparejaría campañas distintas y mandaría a
 * esperar un deploy que nunca va a arreglarlas.
 *
 * Si no empareja, la rotura se trata como del carril: es el lado exigente del error.
 */
export function mismaFraseSalvoNumeros(uno, otro) {
  const sinNumeros = (s) => String(s).replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
  return uno !== otro && sinNumeros(uno) === sinNumeros(otro);
}

/**
 * El veredicto.
 *
 * Rojo SOLO cuando las tres cosas pasan a la vez: el repo empareja la frase, la web viva ya
 * la manda, y el bot vivo no la escucha. Ésa es la deriva que le cuesta el lead.
 *
 * Y el rojo viene en DOS códigos, porque tiene dos dueños: `1` cuando hay que escribir la
 * respuesta (es de este carril) y `3` cuando el repo ya la dice y sólo falta publicar el bot.
 */
export function juzgar({ repo, web, bot, noMedidas = [] }) {
  const lineas = [];

  // Lo que no se pudo medir se dice SIEMPRE y primero en la salida, pero no corta el juicio:
  // con 21 rutas en vez de 8, una caída suelta es corriente, y devolver NO MEDIDO antes de
  // comparar deja que un 503 en `/agentes` esconda el par roto de `/contacto`. El rojo de una
  // frase MEDIDA gana; el NO MEDIDO sólo decide cuando no hay rojo (más abajo).
  for (const nm of noMedidas) lineas.push(`  NO MEDIDO  ${nm.ruta} quedó sin mirar: ${nm.motivo}`);

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

  // Las frases que el bot vivo escucha y el repo ya no empareja: las candidatas a ser la
  // versión ANTERIOR de una rota. Se derivan ANTES de clasificar porque son la evidencia que
  // separa las dos clases de rotura, y esa separación decide el código de salida.
  const soloDelBot = [...bot.frases].filter((x) => !repo.includes(x));
  const viejaDe = new Map();
  for (const f of rotas) {
    const previa = soloDelBot.find((v) => mismaFraseSalvoNumeros(v, f));
    if (previa) viejaDe.set(f, previa);
  }
  const porDeploy = rotas.filter((f) => viejaDe.has(f));
  const delCarril = rotas.filter((f) => !viejaDe.has(f));

  for (const f of sanas) lineas.push(`  ok         "${f}"`);
  for (const f of rotas) {
    lineas.push(`  ROTA       "${f}"`);
    lineas.push("             la web viva se la escribe al lead y el bot vivo NO la escucha: recibe el saludo genérico");
    // El remedio se nombra por frase, porque son OPUESTOS: una pide desplegar lo que ya está
    // escrito, la otra pide escribirlo. Un solo rojo para las dos manda al trabajo equivocado.
    if (viejaDe.has(f)) {
      lineas.push(`             el repo YA dice esto; producción quedó en "${viejaDe.get(f)}" — se arregla DESPLEGANDO, no escribiendo código`);
    } else {
      lineas.push("             el bot vivo no escucha NINGUNA versión de esta frase: no hay nada desplegado que la arregle, hay que escribir la respuesta");
    }
  }

  // El repo empareja una frase que el HTML de ninguna ruta viva trae: no es rojo, pero se dice.
  // Y se dice con su límite adelante, porque esta línea ya invitó una vez a sacar campañas que
  // estaban vivas: hay pantallas que arman el `wa.me` recién cuando el visitante interactúa
  // —`/servicios/webs` lo hace, con `requisitos-gate.tsx` dentro de un componente de cliente—
  // y este medidor lee HTML servido, no pantallas usadas. "No la vi" no es "no existe".
  for (const f of repo.filter((x) => !web.has(x))) {
    lineas.push(`  AVISO      "${f}" — ningún HTML vivo la trae (¿pauta, material impreso, o una pantalla que la arma al interactuar?). NO es prueba de que esté huérfana: no la borres sin mirar la pantalla`);
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
  const esVieja = new Set(viejaDe.values());
  for (const f of soloDelBot) {
    if (esVieja.has(f)) {
      const suya = [...viejaDe.keys()].find((r) => viejaDe.get(r) === f);
      lineas.push(`  AVISO      el bot vivo escucha "${f}": es la versión VIEJA de "${suya}" — el deploy la reemplaza`);
    } else if (rotas.length > 0) {
      lineas.push(`  AVISO      el bot vivo escucha "${f}", que el repo ya no empareja, y NO es la versión vieja de ninguna de las ${rotas.length} rota(s) de arriba: no se puede decir si sobra o si falta en el repo — mirala antes de tocarla`);
    } else {
      lineas.push(`  AVISO      el bot vivo escucha "${f}", que el repo ya no empareja, y NO hay ninguna frase rota: producción quedó ADELANTE y un deploy la borraría`);
    }
  }

  const deQuien = `${bot.fuente}${bot.version ? `, versión ${bot.version}` : ""}`;
  const esperaDeploy = porDeploy.length ? ` · ${porDeploy.length} de ellas ya está(n) bien en el repo y sólo espera(n) el DEPLOY del bot` : "";
  // El rojo del carril MANDA sobre el que sólo espera deploy: si no, una frase que nadie
  // escribió queda escondida detrás de un pedido de deploy que puede tardar días.
  if (delCarril.length > 0) {
    return {
      exit: 1,
      lineas,
      veredicto: `ROTO — ${rotas.length} de ${juzgables.length} frase(s) que la web viva manda no las escucha el bot vivo (${deQuien}); ${delCarril.length} necesita(n) que se ESCRIBA la respuesta${esperaDeploy}`,
    };
  }
  // Rojo igual —el lead recibe el saludo genérico HOY—, pero con otro código, porque el
  // trabajo no es de este carril. Nace del 2026-09-26/27: este medidor entró a la medición de
  // arranque y devolvió `exit 1` en todas las vueltas por el deploy del bot que espera firma.
  // Un rojo permanente con causa conocida se lee como "el de siempre" y tapa al que sí es
  // nuevo — el mismo daño que ya hicieron acá los `exit 2` ambientales.
  if (porDeploy.length > 0) {
    return {
      exit: 3,
      lineas,
      veredicto: `ESPERA DEPLOY — las ${porDeploy.length} frase(s) rota(s) ya están bien en el repo y producción tiene la versión vieja (${deQuien}): no hay código que escribir, hay que publicar el bot. El lead que aprieta el botón HOY recibe el saludo genérico`,
    };
  }
  if (noMedidas.length > 0) {
    return {
      exit: 2,
      lineas,
      veredicto: `NO MEDIDO — ninguna de las ${juzgables.length} frase(s) que sí pude leer está rota, pero ${noMedidas.length} ruta(s) viva(s) no contestaron: de ésas no se sabe nada`,
    };
  }
  return {
    exit: 0,
    lineas,
    veredicto: `ok — las ${juzgables.length} frase(s) que la web viva manda las escucha el bot vivo (${deQuien})`,
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
  const paginas = paginasDelWeb(APP);
  const { visitables: rutas, sinMedir } = rutasAMirar(paginas);
  if (rutas.length === 0) {
    console.log(`NO MEDIDO — no derivé ni una ruta de ${APP}. Si el app cambió de forma, este derivador quedó ciego.`);
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
  const v = juzgar({ repo, web, bot, noMedidas: [...sinMedir, ...noMedidas] });

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
  // Rojo, y con el código que dice DE QUIÉN es el trabajo: acá el repo ya está en 30, así que
  // no hay nada que escribir (3 = espera deploy). Lo que no puede ser NUNCA es 0.
  ok(deriva.exit === 3, "web manda una frase que el bot no escucha tiene que salir ROJO");
  ok(deriva.exit !== 0, "una frase rota no es verde ni cuando el remedio es de otro");
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
  ok(vieja.exit === 3, "con la frase cambiada el gate sigue rojo, y el código dice que el remedio es publicar");
  ok(vieja.lineas.join("\n").includes("versión VIEJA"),
    "si hay una frase rota, la que sólo tiene el bot se nombra como la VIEJA, no como producción adelante");
  ok(!vieja.lineas.join("\n").includes("la borraría"),
    "con una frase rota NO se puede decir que el deploy borraría algo: el deploy es el arreglo");

  // Derivadores: una ruta nueva con botón tiene que entrar sola, sin que nadie la declare.
  const { visitables, sinMedir } = rutasAMirar([
    { ruta: "/", archivo: "a" },
    { ruta: "/servicios/consultoria", archivo: "b" },
    { ruta: "/blog/[slug]", archivo: "c" },
  ]);
  ok(visitables.includes("/servicios/consultoria"),
    "una ruta que arma la frase en su propia página entra al universo sin nombrar constantes");
  ok(!visitables.includes("/blog/[slug]") && sinMedir.length === 1,
    "una ruta con segmento dinámico no se puede visitar: se NOMBRA sin medir, no se descarta muda");

  const conRota = juzgar({
    repo: [FRASE_30],
    web: new Set([FRASE_30]),
    bot: { frases: new Set(["otra"]), fuente: "archivo" },
    noMedidas: [{ ruta: "/agentes", motivo: "la web no contestó: HTTP 503" }],
  });
  ok(conRota.exit === 1, "una ruta caída no puede TAPAR una frase rota medida: primero el rojo");
  ok(conRota.lineas.join("\n").includes("/agentes"),
    "y la ruta que quedó sin mirar se nombra igual en la salida");

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

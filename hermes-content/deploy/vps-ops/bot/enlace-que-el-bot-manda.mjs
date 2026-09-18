#!/usr/bin/env node
// Mide si algun enlace que el bot VIVO le manda al prospecto esta muerto. Correr:
//   node hermes-content/deploy/vps-ops/bot/enlace-que-el-bot-manda.mjs   (npm run enlace:bot)
//   node hermes-content/deploy/vps-ops/bot/enlace-que-el-bot-manda.mjs --self-check
//
// ORIGEN (medido el 2026-09-18, carril chatbot-cola). Es la clase HERMANA de la que se cerro
// anoche en `palabra-que-el-bot-promete.test.mjs`: ahi el bot le dictaba al prospecto una PALABRA
// ("decinos \"no gracias\"") que el motor no reconocia. Un ENLACE es el mismo contrato, con la
// diferencia de que el que no llega no puede ni quejarse: hace clic, cae en otra pantalla y se va.
//
// Medido hoy: el texto que el proceso sirve a los inboxes 4 y 5 manda a `onia.com.bo/precios`, que
// contesta 200. O sea la clase esta SANA hoy — y aun asi no la vigila nadie, por dos motivos:
//
//   1. El gate que cierra esta clase del lado del producto
//      (`lib/platform/no-mandamos-a-una-url-que-no-existe.test.ts`, onia-platform) deriva sus
//      sujetos de ESE repo. El bot vive en otro: sus textos no son sujeto de nadie.
//   2. El texto que el bot sirve NO esta en el repo. `/health` lo dice:
//      `"source":"panel","version":"v3","updatedBy":"carril-chatbot-cola"` — vive en una fila de
//      base publicada desde el panel, que GANA sobre el archivo. Es la misma familia que dejo al
//      bot cotizando Bs 750/1.500 una semana con todos los gates de repo en verde.
//
// Y la confusion que lo haria pasar ya esta escrita en el repo: `config.mjs` documentaba la
// pantalla del alta como `app.onia.com.bo/registro` (en castellano) cuando la ruta viva es
// `/register`. Medido hoy, `/registro` contesta lo MISMO que un slug inventado:
//   /registro            -> 307 https://app.onia.com.bo/login
//   /slug-inventado-zz   -> 307 https://app.onia.com.bo/login
//   /register            -> 200, 51.370 bytes
//
// POR QUE EL STATUS SOLO NO ALCANZA. Un subdominio o ruta propia que no existe NO da 404: resuelve
// al VPS y redirige a otra pagina, asi que un gate que acepte "no dio 404" aprueba una URL muerta.
// La unica pregunta que distingue es comparativa: se pide, EN LA MISMA CORRIDA, un slug inventado
// del mismo host; si la URL de verdad se comporta igual que el slug inventado, esta muerta.
// El control negativo se deriva del host de CADA enlace, no de una constante: hosts distintos
// tienen fallbacks distintos.
//
// CODIGOS DE SALIDA
//   0  todos los enlaces que el bot sirve estan vivos
//   1  al menos un enlace muerto  → el prospecto hace clic y no llega
//   2  no se pudo medir  → no medir NO es estar bien
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { documentosServidos } from "./puerta-del-alta.mjs";

/** Dominios propios: los unicos que este gate puede juzgar (un enlace a un tercero no es nuestro). */
export const DOMINIO_PROPIO = /(^|\.)onia\.com\.bo$/i;

/**
 * Toda URL de dominio propio que aparezca en el texto de un documento servido.
 *
 * El universo sale del DOCUMENTO, no de una lista de campos: el panel puede agregar una FAQ nueva
 * con un enlace adentro, y una lista de campos escrita hoy no la vería. Se recorre el JSON entero.
 */
export function enlacesDelDocumento(doc) {
  if (doc === null || doc === undefined) return [];
  const texto = typeof doc === "string" ? doc : JSON.stringify(doc);
  const crudas = texto.match(/(?:https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.onia\.com\.bo[a-z0-9/._-]*|(?:https?:\/\/)?onia\.com\.bo[a-z0-9/._-]*/gi) ?? [];
  const vistas = new Set();
  for (const cruda of crudas) {
    const url = normalizarEnlace(cruda);
    if (url !== null) vistas.add(url);
  }
  return [...vistas];
}

/**
 * Deja la URL lista para pedirla. Devuelve null si no es de dominio propio.
 *
 * La puntuacion final se recorta porque el texto es PROSA: "esta en onia.com.bo/precios." lleva el
 * punto de la oracion pegado, y pedir `/precios.` da un falso rojo. Se recorta solo al final, no
 * adentro: `/v1/modulos/dental` tiene barras legitimas.
 */
export function normalizarEnlace(cruda) {
  const limpia = String(cruda).trim().replace(/[.,;:!?)\]}"'»]+$/u, "");
  const conEsquema = /^https?:\/\//i.test(limpia) ? limpia : `https://${limpia}`;
  let url;
  try {
    url = new URL(conEsquema);
  } catch {
    return null;
  }
  if (!DOMINIO_PROPIO.test(url.hostname)) return null;
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

/** El slug inventado del MISMO host: el control negativo con el que se compara cada enlace. */
export function controlDe(url) {
  const u = new URL(url);
  u.pathname = "/zz-no-existe-control-de-gate";
  u.search = "";
  return u.toString();
}

/**
 * Un enlace esta MUERTO si se comporta igual que un slug inventado del mismo host.
 *
 * Se compara el destino final, no el status: las dos formas de morir que se midieron son el 404 y
 * el redirect silencioso a otra pantalla (`/registro` -> `/login`). Si el control mismo no se pudo
 * pedir, el veredicto es null: sin control no hay con que comparar, y afirmar "vivo" ahi seria
 * exactamente el falso verde que este gate existe para no tener.
 */
export function juzgarEnlace({ enlace, control }) {
  if (enlace === null || control === null) return { estado: null, motivo: "no se pudo pedir" };
  if (enlace.status >= 500) return { estado: null, motivo: `el servidor contesto ${enlace.status}` };

  const mismoDestino = destinoDe(enlace) === destinoDe(control);
  if (mismoDestino) {
    return {
      estado: "muerto",
      motivo: `se comporta igual que un slug inventado (${enlace.status} -> ${destinoDe(enlace)})`,
    };
  }
  if (enlace.status >= 400) return { estado: "muerto", motivo: `contesto ${enlace.status}` };
  return { estado: "vivo", motivo: `${enlace.status}` };
}

function destinoDe(r) {
  return r.redirect ? r.redirect.replace(/\/$/, "") : `=${r.status}`;
}

/** Pide una URL sin seguir el redirect: el redirect ES el dato que distingue vivo de muerto. */
export function pedir(url, { correr = spawnSync } = {}) {
  const r = correr(
    "curl",
    ["-s", "-o", "/dev/null", "-w", "%{http_code} %{redirect_url}", "--max-time", "25", url],
    { encoding: "utf8" },
  );
  if (r.status !== 0 || typeof r.stdout !== "string" || r.stdout.trim() === "") return null;
  const [codigo, redirect = ""] = r.stdout.trim().split(/\s+/);
  const status = Number(codigo);
  if (!Number.isFinite(status) || status === 0) return null;
  return { status, redirect: redirect || null };
}

/**
 * El veredicto: cada enlace que el bot sirve, contra produccion.
 *
 * Los documentos vienen de `documentosServidos()` (archivo vivo + fila del panel + fila de CADA
 * inbox de Chatwoot). Un documento que no se pudo leer no se saltea en silencio: entra como
 * `noMedido`, porque "no pude leer lo que el bot dice" no es "el bot dice cosas sanas".
 */
export function enlacesQueElBotManda({ correr = spawnSync, servidos = null } = {}) {
  const { documentos, inboxes } = servidos ?? documentosServidos({ correr });
  const porUrl = new Map();
  const noMedido = [];

  for (const { de, doc } of documentos) {
    if (doc === null) {
      noMedido.push({ de, motivo: "no se pudo leer el documento servido" });
      continue;
    }
    for (const url of enlacesDelDocumento(doc)) {
      if (!porUrl.has(url)) porUrl.set(url, []);
      porUrl.get(url).push(de);
    }
  }

  const cache = new Map();
  const pedirCacheado = (u) => {
    if (!cache.has(u)) cache.set(u, pedir(u, { correr }));
    return cache.get(u);
  };

  const enlaces = [];
  for (const [url, donde] of porUrl) {
    const veredicto = juzgarEnlace({ enlace: pedirCacheado(url), control: pedirCacheado(controlDe(url)) });
    enlaces.push({ url, donde, ...veredicto });
  }
  enlaces.sort((a, b) => a.url.localeCompare(b.url));
  return { enlaces, noMedido, inboxes };
}

function medirVivo() {
  const { enlaces, noMedido, inboxes } = enlacesQueElBotManda();

  if (inboxes === null) {
    console.log("NO MEDIDO: no pude derivar los inboxes de Chatwoot — sin eso no se que documentos sirve el bot.");
    return 2;
  }
  if (enlaces.length === 0 && noMedido.length === 0) {
    console.log("NO MEDIDO: el bot no sirve NINGUN enlace de dominio propio — o no pude leer sus textos.");
    return 2;
  }

  for (const e of enlaces) {
    const marca = e.estado === "vivo" ? "ok  " : e.estado === "muerto" ? "MUERTO" : "?   ";
    console.log(`  ${marca} ${e.url}  (${e.motivo})  ← ${e.donde.join(", ")}`);
  }
  for (const n of noMedido) console.log(`  ?    ${n.de}: ${n.motivo}`);

  const muertos = enlaces.filter((e) => e.estado === "muerto");
  const dudosos = enlaces.filter((e) => e.estado === null);

  if (muertos.length > 0) {
    console.log(
      `\nVEREDICTO: ${muertos.length} enlace(s) MUERTO(s) — el prospecto hace clic y no llega:\n` +
        muertos.map((m) => `  ${m.url} — ${m.motivo}`).join("\n"),
    );
    return 1;
  }
  if (dudosos.length > 0 || noMedido.length > 0) {
    console.log(`\nNO MEDIDO: ${dudosos.length + noMedido.length} sujeto(s) sin veredicto — no medir NO es estar bien.`);
    return 2;
  }
  console.log(
    `\nVEREDICTO: ok · los ${enlaces.length} enlace(s) que el bot sirve estan vivos ` +
      `(inboxes derivados: ${inboxes.join(", ")}).`,
  );
  return 0;
}

// ---------------------------------------------------------------------------------------------
// self-check: el nucleo puro, sin tocar produccion.
function selfCheck() {
  const casos = [];
  const ok = (nombre, cond) => casos.push({ nombre, ok: Boolean(cond) });

  // El universo sale del documento entero, no de una lista de campos.
  ok(
    "encuentra un enlace escondido en una FAQ que ningun campo conocido nombra",
    enlacesDelDocumento({ faq: [{ a: "mira onia.com.bo/precios" }] }).includes("https://onia.com.bo/precios"),
  );
  ok(
    "encuentra el enlace del alta en un subdominio",
    enlacesDelDocumento({ x: "entra en app.onia.com.bo/register" }).includes("https://app.onia.com.bo/register"),
  );
  // La prosa pega la puntuacion al final: recortarla es lo que evita el falso rojo.
  ok(
    "recorta el punto de la oracion y no el path",
    normalizarEnlace("onia.com.bo/precios.") === "https://onia.com.bo/precios" &&
      normalizarEnlace("onia.com.bo/v1/modulos/dental") === "https://onia.com.bo/v1/modulos/dental",
  );
  ok("ignora un dominio ajeno", enlacesDelDocumento({ x: "ver calendly.com/onia" }).length === 0);
  ok("no confunde un dominio que nos NOMBRA con uno propio", normalizarEnlace("onia.com.bo.mx/precios") === null);

  // El control negativo se deriva del host de cada enlace, no de una constante.
  ok("el control es del MISMO host", controlDe("https://app.onia.com.bo/register").startsWith("https://app.onia.com.bo/"));

  // El corazon: el status solo no distingue, el destino si.
  const aLogin = { status: 307, redirect: "https://app.onia.com.bo/login" };
  ok(
    "declara MUERTO el enlace que redirige igual que un slug inventado",
    juzgarEnlace({ enlace: aLogin, control: aLogin }).estado === "muerto",
  );
  ok(
    "declara VIVO el 200 cuando el control redirige",
    juzgarEnlace({ enlace: { status: 200, redirect: null }, control: aLogin }).estado === "vivo",
  );
  ok("declara MUERTO un 404 aunque el control sea otra cosa", juzgarEnlace({ enlace: { status: 404, redirect: null }, control: aLogin }).estado === "muerto");
  // Sin control no hay con que comparar: no se puede afirmar "vivo".
  ok("sin control no concluye", juzgarEnlace({ enlace: { status: 200, redirect: null }, control: null }).estado === null);
  ok("un 500 no es veredicto", juzgarEnlace({ enlace: { status: 503, redirect: null }, control: aLogin }).estado === null);

  // Un documento ilegible no se saltea en silencio.
  const conAgujero = enlacesQueElBotManda({
    servidos: { documentos: [{ de: "fila inbox 5", doc: null }], inboxes: [5] },
    correr: () => ({ status: 0, stdout: "200 " }),
  });
  ok("un documento ilegible entra como NO MEDIDO", conAgujero.noMedido.length === 1);

  // Un curl que no pudo preguntar devuelve null, no un status inventado.
  ok("curl fallido no inventa status", pedir("https://onia.com.bo", { correr: () => ({ status: 7, stdout: "" }) }) === null);
  ok("curl con codigo 000 no inventa status", pedir("https://onia.com.bo", { correr: () => ({ status: 0, stdout: "000 " }) }) === null);

  const malos = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`  ${c.ok ? "ok  " : "FAIL"} ${c.nombre}`);
  console.log(malos.length === 0 ? `\nself-check: ${casos.length} ok` : `\nself-check: ${malos.length} FALLARON`);
  return malos.length === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medirVivo());
}

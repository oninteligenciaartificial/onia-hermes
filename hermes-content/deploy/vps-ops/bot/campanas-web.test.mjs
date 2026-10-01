// ONIA — las FRASES DE CAMPAÑA de la web tienen que seguir matcheando.
//
// El problema que este test existe para evitar: `campanaExacta` compara la frase ENTERA. La web
// precarga el texto en el link `wa.me?text=` y el documento de campañas guarda una COPIA de ese
// texto. Son dos archivos en dos carriles distintos (la web es de web-factory, el documento es de
// chatbot), asi que la copia se desincroniza sin que nadie se entere: el dia que alguien cambia
// una coma en la web, la campaña deja de matchear y el desconocido vuelve a recibir el saludo
// generico — exactamente el agujero que las campañas venian a tapar, y sin ningun error visible.
//
// Por eso el test NO hardcodea las frases: las EXTRAE del codigo de la web y las compara contra el
// documento. Si la web cambia una frase, agrega una nueva o borra una, esto se pone rojo.
//
// PUNTO CIEGO consciente: solo ve los literales escritos dentro de la llamada al link. Un
// `waServiciosLink(UNA_CONSTANTE)` o un texto armado por codigo (`buildWaText`) es invisible aca —
// y esta bien, porque un texto armado por codigo tampoco puede ser una campaña de match exacto.
//
// 🔴 QUE ARCHIVO VALIDA ESTE GATE, Y POR QUE ESE — corregido el 2026-09-24.
// Hasta hoy validaba `docs/chatbot/campanas-onia.knowledge.json`: un documento hermano que
// **ningun deploy copiaba a ninguna parte**. Las 9 campañas estaban al 100% verde aca y al 0%
// vivas para un lead —las cuatro frases que onia.com.bo enlaza por wa.me incluidas—, y el ítem
// que lo destrababa llevaba 24 dias esperando un `scp` a mano que nadie iba a correr.
//
// Ahora valida `knowledge.onia.json`, que es el que el circuito de deploy YA publica solo:
// `deploy-bot.sh` lo lista en PATRONES y despues corre `webhook-server.sh knowledge`, que lo
// instala en el contenedor como `knowledge.json` (deploy-bot.sh:170). Es ademas el archivo que
// `evals.test.mjs` llama "el conocimiento que produccion PUBLICA de verdad".
//
// Sobre la fila del panel: `mergePanelKnowledge` hace `{...archivo, ...panel}`, o sea que el
// panel pisa CLAVE POR CLAVE. Medido el 2026-09-24, `public.chatbot_knowledge` v5 `publicado` no
// tiene la clave `campanas` (`select (data ? 'campanas') ...` → f), asi que las campañas del
// archivo sobreviven al merge. Si algun dia el panel publica campañas propias, gana el panel.
//
// Lo que este gate sigue SIN probar: que el deploy del bot haya CORRIDO. Un documento correcto y
// commiteado no es un documento vivo; eso se mide con `docker exec onia-center grep -c campanas
// /tmp/onia-bot/knowledge.json`, que necesita el VPS y por eso no entra en la cadena.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { campanaExacta } from "./recepcionista.mjs";
import { normalize } from "./guardrails.mjs";
import { validateKnowledge } from "./knowledge.mjs";
import { createBotConfig } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";
import { precargadosDeLaPauta } from "./precargados-de-la-pauta.mjs";

const WEB_SRC = fileURLToPath(new URL("../../../../web-factory/apps/onia-platform/src/", import.meta.url));
const CONFIGURADOR_SRC = fileURLToPath(
  new URL("../../../../web-factory/apps/onia-platform/src/components/web-configurator/WebConfigurator.tsx", import.meta.url),
);
// El documento que el DEPLOY publica, no una copia hermana. Ver la cabecera: hasta el 2026-09-24
// las campañas vivian en `docs/chatbot/campanas-onia.knowledge.json`, que no viaja a ninguna
// parte. `knowledge.onia.json` es el que `deploy-bot.sh` instala como `knowledge.json`.
const DOC_PATH = fileURLToPath(new URL("./knowledge.onia.json", import.meta.url));

/**
 * Textos que la web manda pero que NO pueden ser campaña de match exacto, con el motivo.
 * Vivir aca es una decision, no un olvido: si mañana uno deja de ser un prefijo, el test de
 * cobertura lo empuja al documento.
 */
// 2026-08-31: la unica que vivia aca —el CTA de /v1/empezar— dejo de ser no-matcheable: las
// campañas ahora pueden declarar `prefijo: true`. El mecanismo se queda igual, vacio, porque el
// dia que la web mande un texto armado por codigo hay que escribir el motivo, no borrarlo.
const NO_MATCHEABLES = new Map([]);

/** Todos los .ts/.tsx de la web, recursivo. */
function fuentesWeb(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}${entry.name}`;
    if (entry.isDirectory()) out.push(...fuentesWeb(`${full}/`));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Lo que hay que hacer cuando el arbol no trae el lado de la web. No es un fallo del gate ni de la
 * web: es que este worktree no puede EMITIR un veredicto, y decir "verde" seria peor que callarse.
 */
const ARBOL_INCOMPLETO =
  "este worktree no tiene el lado de la WEB del cruce, asi que el veredicto no vale: " +
  "corré `git merge origin/main` y volvé a medir. (Este gate cruza web-factory —carril web-venta— " +
  "contra hermes-content —carril chatbot—: un árbol con un lado nuevo y el otro viejo da un " +
  "veredicto falso sin que nada esté roto.)";

/**
 * Los literales que la web precarga en un link de WhatsApp.
 * Se planta si el arbol no trae la web: un Set vacio haria pasar el cruce en VERDE, aprobando
 * cualquier campaña que falte. Ver el bloque "El veredicto de este gate depende del ARBOL".
 */
function frasesDeLaWeb(dir = WEB_SRC) {
  let fuentes;
  try {
    fuentes = fuentesWeb(dir);
  } catch (err) {
    if (err?.code === "ENOENT") throw new Error(`${dir} no existe — ${ARBOL_INCOMPLETO}`);
    throw err;
  }
  if (fuentes.length === 0) throw new Error(`${dir} no tiene ni un .ts/.tsx — ${ARBOL_INCOMPLETO}`);

  const re = /wa(?:Servicios)?Link\(\s*"([^"]*)"/g;
  const encontradas = new Set();
  for (const file of fuentes) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(re)) encontradas.add(m[1]);
  }
  if (encontradas.size === 0) {
    throw new Error(
      `${fuentes.length} archivo(s) de web y ningun link de WhatsApp — ${ARBOL_INCOMPLETO}`,
    );
  }
  return encontradas;
}

/**
 * Las APERTURAS del configurador de webs — el otro camino por el que la web manda un WhatsApp.
 *
 * POR QUE NO LAS VE `frasesDeLaWeb`: el configurador no escribe el texto adentro de `waLink("…")`;
 * arma un `const mensaje = [...].join("\n")` con los datos que cargó la persona. Eso es
 * exactamente el "texto armado por codigo" que la cabecera de este archivo declara punto ciego
 * — y el motivo escrito ahi ("tampoco puede ser una campaña de match exacto") dejo de ser cierto
 * el 31-ago, cuando las campañas pudieron declarar `prefijo: true`. La PRIMERA linea del mensaje
 * SI es un literal fijo, asi que es un prefijo perfectamente matcheable.
 *
 * Lo que costaba el punto ciego, medido el 2026-09-24 con el mensaje real del configurador: el
 * lead que armo su web entera y ya vio su precio entraba como `pregunta_precio` y el bot le
 * contestaba los planes del SISTEMA y el add-on del chatbot — otro producto.
 *
 * Se planta si no encuentra nada: un Set vacio aprobaria la falta de campaña en verde.
 */
function aperturasDelConfigurador(archivo = CONFIGURADOR_SRC) {
  let src;
  try {
    src = readFileSync(archivo, "utf8");
  } catch (err) {
    if (err?.code === "ENOENT") throw new Error(`${archivo} no existe — ${ARBOL_INCOMPLETO}`);
    throw err;
  }
  const bloque = /const mensaje = \[([\s\S]*?)\]\.join\(/.exec(src);
  if (!bloque) {
    throw new Error(
      `${archivo} ya no arma su WhatsApp con \`const mensaje = [...].join(\` — ${ARBOL_INCOMPLETO}`,
    );
  }
  // Las aperturas son los literales del PRIMER elemento (un ternario con/sin precio estimado).
  // Los demas elementos son plantillas con backtick, que este regex no toca a proposito.
  const aperturas = [...bloque[1].matchAll(/"([^"]*\?*[^"]*)"/g)]
    .map((m) => m[1])
    .filter((texto) => /^Hola,/.test(texto));
  if (aperturas.length === 0) {
    throw new Error(
      `${archivo} arma el mensaje pero ninguna linea abre con "Hola," — ${ARBOL_INCOMPLETO}`,
    );
  }
  return new Set(aperturas);
}

const doc = JSON.parse(readFileSync(DOC_PATH, "utf8"));
const campanas = doc.campanas ?? [];

test("el documento de campañas de Onia pasa el MISMO validador que exige la publicacion", () => {
  const verdict = validateKnowledge(doc);
  assert.deepEqual(verdict.errors, [], "el documento no publicaria");
  assert.equal(verdict.ok, true);
});

test("cada frase que la web manda tiene su campaña — o un motivo escrito de por que no puede tenerla", () => {
  const delDoc = new Set(campanas.map((c) => c.frase));
  const sinCubrir = [...frasesDeLaWeb()].filter((f) => !delDoc.has(f) && !NO_MATCHEABLES.has(f));
  assert.deepEqual(
    sinCubrir,
    [],
    "la web manda estas frases y nadie las contesta con su respuesta propia: agregalas a " +
      "hermes-content/deploy/vps-ops/bot/knowledge.onia.json o declaralas en NO_MATCHEABLES.\n" +
      "ANTES DE ESCALAR ESTE ROJO: `git merge origin/main` y volvé a correrlo. Este cruce toma la " +
      "web de un carril y el documento de otro, asi que un worktree con el JSON viejo da este " +
      "mismo error con main VERDE — ya paso el 2026-09-03 (t_86264535, escalado como 'main roto " +
      "traba a los 15 carriles' sobre una cadena que estaba en verde hacia 5 horas).",
  );
});

test("ninguna campaña quedo huerfana: si la web dejo de mandar la frase, la campaña sobra", () => {
  // Todo lo que la web manda HOY: los links wa.me tal cual, y el mensaje COMPLETO del
  // configurador (apertura + cuerpo), que es como llega de verdad.
  //
  // Se le pregunta al MOTOR, no a la igualdad de cadenas: una campaña de `prefijo` jamas es igual
  // al mensaje que contesta, asi que con `deLaWeb.has(frase)` toda campaña de prefijo nueva nace
  // "huerfana" aunque este atendiendo al lead mas caliente de la web. Y de paso el gate se vuelve
  // mas fuerte: ahora caza tambien la campaña cuya frase derivo hasta dejar de matchear nada.
  //
  // Y los PRECARGADOS DE LA PAUTA (2026-09-30): el anuncio clic-a-WhatsApp es otro emisor, y su
  // campaña de prefijo no la dispara ninguna página — la dispara Meta. Se leen del doc de la pauta
  // (ver precargados-de-la-pauta.mjs y frase-de-la-pauta.test.mjs), no se declaran a mano.
  const vivas = [
    ...frasesDeLaWeb(),
    ...[...aperturasDelConfigurador()].map(mensajeDelConfigurador),
    ...precargadosDeLaPauta(),
  ];
  const alcanzadas = new Set(
    vivas.map((viva) => campanaExacta(doc, normalize(viva))?.frase).filter(Boolean),
  );
  const huerfanas = campanas.map((c) => c.frase).filter((f) => !alcanzadas.has(f));
  assert.deepEqual(
    huerfanas,
    [],
    "estas campañas ya no las dispara nadie: la web cambio el texto o borro el enlace.\n" +
      "ANTES DE ESCALAR ESTE ROJO: `git merge origin/main` — con el lado de la web viejo, una " +
      "campaña recien agregada se ve igual que una huerfana.",
  );
});

test("el motor matchea cada frase — tal cual, y tambien sin la puntuacion que el cliente puede borrar", () => {
  assert.ok(campanas.length > 0, "el documento no tiene ni una campaña");
  for (const campana of campanas) {
    const exacto = campanaExacta(doc, normalize(campana.frase));
    assert.equal(exacto?.respuesta, campana.respuesta, `no matcheo tal cual: ${campana.frase}`);

    const sinPuntuacion = normalize(campana.frase).replace(/[.,]/g, "");
    assert.equal(
      campanaExacta(doc, sinPuntuacion)?.respuesta,
      campana.respuesta,
      `no matcheo sin puntuacion: ${campana.frase}`,
    );
  }
});

test("un mensaje que NO es ninguna campaña sigue cayendo al flujo normal", () => {
  assert.equal(campanaExacta(doc, normalize("hola")), null);
  assert.equal(campanaExacta(doc, normalize("Hola, vengo de la web de Onia.")), null);
});

// ---------------------------------------------------------------------------
// Campañas de PREFIJO — el CTA de /v1/empezar
// ---------------------------------------------------------------------------
// `waLink("Hola, mi rubro no esta en la lista de Onia. Mi negocio es: ")` precarga un texto que
// queda ABIERTO: la persona escribe su rubro a continuacion. Con match del mensaje entero ese CTA
// no podia tener campaña nunca, y por eso vivia en NO_MATCHEABLES. Medido en el motor el 31-ago,
// las dos variantes —con rubro atras y el prefijo pelado— contestaban M0, el saludo generico: o
// sea la persona que MAS informacion declaro (su rubro, y que no esta en la lista) recibia lo
// mismo que quien escribe "hola".
// El arreglo es opt-in POR CAMPAÑA (`prefijo: true`): sin el campo, el match sigue siendo del
// mensaje entero. Una campaña normal no se estira sola.

const PREFIJO_EMPEZAR = "Hola, mi rubro no está en la lista de Onia. Mi negocio es: ";

test("campaña de PREFIJO: matchea cuando la persona escribe su rubro a continuacion", () => {
  const campana = campanas.find((c) => c.frase === PREFIJO_EMPEZAR);
  assert.ok(campana, `la web manda "${PREFIJO_EMPEZAR}" y el documento no la cubre`);
  assert.equal(campana.prefijo, true, "sin `prefijo: true` el mensaje entero nunca es igual a la frase");
  for (const rubro of ["panadería", "taller mecánico", "una granja de pollos"]) {
    assert.equal(
      campanaExacta(doc, normalize(PREFIJO_EMPEZAR + rubro))?.respuesta,
      campana.respuesta,
      `no matcheo con el rubro "${rubro}" atras`,
    );
  }
});

test("campaña de PREFIJO: el prefijo pelado, sin rubro atras, sigue matcheando", () => {
  const campana = campanas.find((c) => c.frase === PREFIJO_EMPEZAR);
  assert.equal(campanaExacta(doc, normalize(PREFIJO_EMPEZAR))?.respuesta, campana.respuesta);
});

test("SIN `prefijo` el match sigue siendo del mensaje ENTERO — una campaña normal no se estira", () => {
  const normal = campanas.find((c) => c.prefijo !== true);
  assert.ok(normal, "el documento se quedo sin ninguna campaña de match exacto");
  assert.equal(
    campanaExacta(doc, normalize(normal.frase + " y ademas otra cosa")),
    null,
    "una campaña de match exacto no puede empezar a comerse mensajes mas largos",
  );
});

test("PREFIJO no matchea a medias: un mensaje que solo comparte el arranque cae al flujo normal", () => {
  assert.equal(campanaExacta(doc, normalize("Hola, mi rubro")), null);
  assert.equal(campanaExacta(doc, normalize("Hola, mi rubro no está en la lista")), null);
});

// ---------------------------------------------------------------------------
// El lead del CONFIGURADOR DE WEBS — el que más declaró y el que peor se atendía
// ---------------------------------------------------------------------------
// `onia.com.bo/servicios/webs` deja armar la web entera (nivel, precio, paleta, estructura) y
// manda un WhatsApp con TODO adentro. Medido el 2026-09-24 contra el motor: ese mensaje entraba
// como `pregunta_precio` y el bot contestaba los planes del sistema (Bs 320/550/890/1.290) y el
// add-on del chatbot. O sea que a quien acaba de pedir una WEB con su precio ya a la vista, el
// bot le hablaba de OTRO producto — el peor cruce posible, y en el lead más caliente que produce
// la web.
//
// El arreglo es una campaña de PREFIJO sobre la primera línea, que es literal y fija. No lleva
// cifras a propósito: el precio de la web (webs.ts) NO está en `MONTOS_PERMITIDOS` —que sale de
// subscription-plans.ts y pricing.ts— así que una respuesta con "Bs 4.500" adentro hace que
// `validateKnowledge` rechace el documento ENTERO y el bot se quede sin ninguna campaña. Y no
// hace falta: el precio ya viaja en el mensaje que la persona acaba de mandar.

/** Un mensaje del configurador de verdad: la apertura + el cuerpo que arma el componente. */
const cuerpoDelConfigurador = [
  "DATOS DEL NEGOCIO",
  "Contacto: Marcela Rojas.",
  "Negocio: Estudio Rojas.",
  "Rubro y ciudad: Arquitectura, Santa Cruz.",
  "WhatsApp: 70011223.",
  "Oferta principal: Diseño de casas.",
  "Fotografías: Las tengo yo.",
  "",
  "ALCANCE Y PRECIO",
  "Nivel: Completa, Web Profesional.",
  "Precio base: Bs 4.500.",
  "Estimado de construcción: Bs 4.500.",
  "Cuidado web: sin plan mensual por ahora.",
  "",
  "DISEÑO ELEGIDO",
  "Dirección visual: Editorial serena.",
  "Objetivo principal: Que me escriban por WhatsApp.",
].join("\n");

const mensajeDelConfigurador = (apertura) => `${apertura}\n${cuerpoDelConfigurador}`;

test("el configurador manda sus aperturas y se leen del CÓDIGO de la web, no de una copia", () => {
  const aperturas = [...aperturasDelConfigurador()];
  assert.ok(aperturas.length >= 1, "no se extrajo ninguna apertura del configurador");
  for (const apertura of aperturas) {
    assert.match(apertura, /^Hola,/, `apertura rara: ${apertura}`);
  }
});

test("CADA apertura del configurador tiene campaña — con el cuerpo real del pedido atrás", () => {
  for (const apertura of aperturasDelConfigurador()) {
    const campana = campanaExacta(doc, normalize(mensajeDelConfigurador(apertura)));
    assert.ok(
      campana,
      `el configurador manda "${apertura}" y ninguna campaña lo contesta: el lead cae al flujo ` +
        "genérico y el bot le ofrece el sistema en vez de su web.",
    );
    assert.equal(campana.prefijo, true, "el mensaje sigue con los datos del negocio: sin `prefijo` no puede matchear nunca");
  }
});

test("la respuesta al lead de la web NO le vende el sistema ni el chatbot", () => {
  const apertura = [...aperturasDelConfigurador()][0];
  const campana = campanaExacta(doc, normalize(mensajeDelConfigurador(apertura)));
  assert.ok(campana, "sin campaña no hay nada que medir");
  const norm = normalize(campana.respuesta);
  assert.ok(!/\bchatbot\b/.test(norm), `la respuesta al lead de una WEB le habla del chatbot: ${campana.respuesta}`);
  assert.ok(
    !/\d+(?:[.,]\d+)?\s*(bs\b|bolivianos?\b)/.test(norm),
    `la respuesta trae una cifra: el precio de la web no está en MONTOS_PERMITIDOS y tumba el documento entero: ${campana.respuesta}`,
  );
});

test("EN EL MOTOR: el lead del configurador no sale por `pregunta_precio`", () => {
  const config = createBotConfig({ campanas: doc.campanas }, undefined);
  for (const apertura of aperturasDelConfigurador()) {
    const state = createState({ channel: "sim", contactRef: "configurador" });
    const result = step(
      state,
      { text: mensajeDelConfigurador(apertura), receivedAt: "2026-07-27T14:05:00Z" },
      { config },
    );
    const keys = result.replies.map((reply) => reply.templateKey);
    assert.ok(
      keys.includes("R_CAMPANA"),
      `el motor contestó ${JSON.stringify(keys)} en vez de la campaña de la web`,
    );
    assert.ok(
      !keys.includes("M4_BODY"),
      "el motor le contestó con los precios del SISTEMA a quien pidió una WEB",
    );
    assert.ok(
      !result.notes?.includes("pregunta_precio"),
      `clasificado como pregunta_precio: ${JSON.stringify(result.notes)}`,
    );
  }
});

// ---------------------------------------------------------------------------
// El veredicto de este gate depende del ARBOL, no solo del codigo
// ---------------------------------------------------------------------------
// Este test cruza dos archivos que viven en CARRILES DISTINTOS: los literales estan en
// web-factory (carril web-venta) y las campañas en hermes-content (carril chatbot). Un worktree
// que tiene un lado nuevo y el otro viejo no esta roto — esta desactualizado — pero el cruce no
// puede distinguir una cosa de la otra, y da un veredicto FALSO en las DOS direcciones:
//
//   · sin el lado de la WEB  -> no ve los literales nuevos -> `sinCubrir` vacio -> VERDE mentiroso.
//   · sin el lado del DOC    -> no ve las campañas nuevas   -> `sinCubrir` lleno  -> ROJO mentiroso.
//
// Las dos ya pasaron el 2026-09-03, con horas de diferencia y sobre el MISMO commit: este carril
// midio verde sin tener site.ts, y web-venta midio rojo sin tener el JSON — y ese rojo se escalo
// como "main esta roto y traba el merge de los 15 carriles" (t_86264535) cuando main estaba verde.
//
// El falso ROJO se paga leyendo el mensaje del assert, que ahora manda mergear antes de escalar.
// El falso VERDE no avisa solo: nadie investiga un gate que pasa. Por eso se planta acá.

/** Un árbol de mentira, para probar la guarda sin depender del worktree real. */
function arbolDeMentira(archivos) {
  const dir = mkdtempSync(join(tmpdir(), "campanas-web-"));
  for (const [nombre, contenido] of Object.entries(archivos)) {
    writeFileSync(join(dir, nombre), contenido);
  }
  return `${dir}/`;
}

test("GUARDA: sin el lado de la web el gate se planta, en vez de aprobar en verde", () => {
  const vacio = arbolDeMentira({ "leeme.md": "un worktree sin el checkout de la web" });
  try {
    assert.throws(
      () => frasesDeLaWeb(vacio),
      /worktree|árbol|arbol/i,
      "un árbol sin los .tsx de la web tiene que ser un ERROR: si devuelve un Set vacio, " +
        "el cruce aprueba cualquier campaña que falte y el gate miente en verde",
    );
  } finally {
    rmSync(vacio, { recursive: true, force: true });
  }
});

test("GUARDA: con los .tsx pero sin ningun link de WhatsApp, tambien se planta", () => {
  // El caso del sparse-checkout o del worktree a medio traer: los archivos estan, los CTA no.
  const sinLinks = arbolDeMentira({ "pagina.tsx": "export const Hola = () => <p>sin CTA</p>;" });
  try {
    assert.throws(
      () => frasesDeLaWeb(sinLinks),
      /worktree|árbol|arbol/i,
      "la web sin NI UN waLink no es un estado real mientras el documento tenga campañas: " +
        "es un árbol incompleto, y aprobarlo en verde deja pasar campañas huérfanas",
    );
  } finally {
    rmSync(sinLinks, { recursive: true, force: true });
  }
});

test("GUARDA: si el directorio de la web ni existe, el motivo se lee (no un ENOENT pelado)", () => {
  assert.throws(
    () => frasesDeLaWeb("/tmp/onia-no-existe-este-arbol-jamas/"),
    /worktree|árbol|arbol/i,
    "un ENOENT crudo se lee como un bug del test; tiene que decir que falta el checkout de la web",
  );
});

test("GUARDA: sobre el árbol real no se planta — la guarda no puede volverse el gate", () => {
  assert.ok(frasesDeLaWeb().size > 0, "el worktree real trae la web: la guarda no debe dispararse");
});

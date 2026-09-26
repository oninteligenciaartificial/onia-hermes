// ONIA — la duracion de la reunion se dice con UN solo numero en TODO lo que el bot escribe.
//
// EL BUG QUE ESTE GATE EXISTE PARA QUE NO VUELVA, y que ya volvio una vez por otra puerta.
//
// `config.mjs` tiene el bloque DEMO con una nota de 2026-08-06 que cuenta la version original:
// durante meses el guion prometia "15 minutos" y la reserva bloqueaba 45, asi que el prospecto
// aceptaba creyendo una cosa y su invitacion de calendario le decia otra. Se arreglo poniendo los
// dos numeros en UNA fuente (`duracionMinutos` + `duracionFrase`) y se blindo con `demoDuration`,
// que exige que coincidan.
//
// Ese invariante mira DOS campos. Y el bot dice la duracion en mas lugares que esos dos: el
// 2026-09-25 se midio contra el bot DESPLEGADO que un lead que clickea el link de WhatsApp de
// onia.com.bo —"Quiero agendar la demo de 45 minutos con mi caso"— recibe en UN SOLO mensaje:
//
//     "Te muestro como quedaria en TU negocio en 30 minutos por videollamada…"   (M0, del guion)
//     "La demo de 45 minutos la hace Sergio sobre TU caso…"                      (campanas[7].respuesta)
//
// y despues el motor reserva en Cal.com `config.demo.duracionMinutos` = 30 (run-turn.mjs, con
// CALCOM_BOT_DURATION_MINUTES vacia en el proceso vivo). O sea: el mismo hecho con dos numeros
// distintos, en la misma pantalla, y el que gana en el calendario es el que el prospecto no leyo.
// Es el bug de agosto exactamente, entrando por el texto de campaña en vez de por el guion.
//
// POR QUE UN GATE Y NO UNA REGLA DEL VALIDADOR. `validateKnowledge` rechaza el documento ENTERO
// cuando algo no cumple, y la clase "documento descartado al leerlo" ya nos costo caro (ver
// knowledge.mjs). Un numero mal tipeado en una frase convertiria las NUEVE campañas en silencio:
// el lead que clickea desde la web volveria al saludo generico, que es justo lo que las campañas
// vinieron a tapar. Un gate de la cadena lo caza ANTES de que viaje, sin apagar nada en vivo.
// ⚠️ Punto ciego consciente y su motivo: si algun dia el panel publica `campanas` propias
// (`public.chatbot_knowledge`), esas no pasan por este gate — se editan fuera del repo. Hoy la
// fila v5 `publicado` no trae la clave (medido el 2026-09-25: `select (data ? 'campanas')` -> f)
// y `mergePanelKnowledge` deja vivir las del archivo, asi que el sujeto real es este documento.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_CONFIG, DEMO, demoDuration } from "./config.mjs";

// El documento que el DEPLOY publica (`deploy-bot.sh` lo lista en PATRONES y `webhook-server.sh
// knowledge` lo instala como knowledge.json), no una copia hermana. Mismo sujeto que
// campanas-web.test.mjs, y por el mismo motivo.
const DOC_PATH = fileURLToPath(new URL("./knowledge.onia.json", import.meta.url));

/**
 * Lo que NO es una promesa del bot, con su motivo escrito.
 *
 * `campanas[].frase` es el mensaje que escribe EL LEAD: la web lo precarga en el `wa.me?text=` y
 * el documento guarda una COPIA exacta para que `campanaExacta` matchee. Si ese texto dice "45
 * minutos", el numero esta mal en la WEB (carril web-venta) y se arregla alla: tocarlo aca rompe
 * el match y el lead cae en el saludo generico. Este gate juzga lo que el bot RESPONDE.
 *
 * Es una funcion sobre la RUTA, no una lista de frases: una campaña nueva queda cubierta sola.
 */
function esTextoDelLead(ruta) {
  return /^doc\.campanas\[\d+\]\.(frase|prefijo)$/.test(ruta);
}

/** Toda mencion literal de minutos en un arbol de textos, con la ruta donde vive. */
function duracionesQueSeDicen(valor, ruta = "", out = []) {
  if (typeof valor === "string") {
    // El ULTIMO numero del tramo, igual que `demoDuration` lee `duracionFrase` ("15-20 minutos" -> 20).
    for (const m of valor.matchAll(/(\d+)(?:\s*[-–a]\s*(\d+))?\s*minutos?/gi)) {
      out.push({ ruta, minutos: Number(m[2] ?? m[1]), tramo: m[0], contexto: valor.slice(Math.max(0, m.index - 60), m.index + 30).replace(/\s+/g, " ") });
    }
    return out;
  }
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => duracionesQueSeDicen(v, `${ruta}[${i}]`, out));
    return out;
  }
  if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) duracionesQueSeDicen(v, ruta ? `${ruta}.${k}` : k, out);
    return out;
  }
  return out;
}

function sujetos(doc) {
  return [
    ...duracionesQueSeDicen(DEFAULT_CONFIG, "config"),
    ...duracionesQueSeDicen(doc, "doc"),
  ];
}

const doc = JSON.parse(readFileSync(DOC_PATH, "utf8"));

test("el recolector mira de verdad: encuentra la duracion del guion", () => {
  // ANCLA. Sin esto, un walker roto devuelve [] y el gate pasa en VERDE sin mirar nada — el modo
  // de falla mas comun de un test que recorre una estructura.
  const todas = sujetos(doc);
  assert.ok(todas.length >= 2, `esperaba varias menciones de minutos y encontre ${todas.length}`);
  assert.ok(
    todas.some((d) => d.ruta === "config.demo.duracionFrase" && d.minutos === DEMO.duracionMinutos),
    `no vi la duracion del guion (${DEMO.duracionMinutos}) entre ${JSON.stringify(todas.map((d) => d.ruta))}`,
  );
});

test("ninguna promesa del bot contradice lo que se reserva en el calendario", () => {
  const reservada = demoDuration(DEFAULT_CONFIG).minutos;
  assert.ok(Number.isFinite(reservada), "sin duracion reservada no hay nada que comparar");
  const promesas = sujetos(doc).filter((d) => !esTextoDelLead(d.ruta));
  const distintas = promesas.filter((d) => d.minutos !== reservada);
  assert.deepEqual(
    distintas,
    [],
    `el bot promete una duracion que NO es la que reserva (${reservada} min):\n` +
      distintas.map((d) => `  ${d.ruta}: "${d.tramo}" …${d.contexto}…`).join("\n"),
  );
});

test("la exencion cubre SOLO el texto que escribe el lead", () => {
  // Que la exencion siga siendo del tamaño de su motivo. Si mañana alguien la ensancha a
  // `respuesta`, este caso se pone rojo: ahi vive la promesa del bot.
  assert.equal(esTextoDelLead("doc.campanas[3].frase"), true);
  assert.equal(esTextoDelLead("doc.campanas[3].respuesta"), false);
  assert.equal(esTextoDelLead("config.demo.duracionFrase"), false);
  // Y que el documento REAL tenga frases: una exencion sobre un conjunto vacio no prueba nada.
  assert.ok(
    Array.isArray(doc.campanas) && doc.campanas.some((c) => typeof c?.frase === "string"),
    "el documento no trae campañas con frase — la exencion no tiene sujeto",
  );
});

test("self-check: el gate caza el numero equivocado donde sea que lo escriban", () => {
  // Las TRES puertas por las que entro (o puede entrar) el bug: la respuesta de campaña, una FAQ
  // editable y el guion del codigo. Cada una se prueba mutando una COPIA del documento.
  // Se cuenta SOLO en la ruta mutada, no el total: un self-check que compara totales se vuelve
  // verde o rojo segun cuantos defectos reales haya en el documento del dia, que es justo lo que
  // el gate de arriba mide. Estas dos preguntas tienen que poder fallar por separado.
  const enRuta = (arbol, ruta) =>
    duracionesQueSeDicen(arbol, "doc").filter(
      (d) => d.ruta === ruta && !esTextoDelLead(d.ruta) && d.minutos !== DEMO.duracionMinutos,
    );

  const roto = JSON.parse(JSON.stringify(doc));
  roto.campanas[0].respuesta = "La demo son 45 minutos y la hace Sergio.";
  const enCampana = enRuta(roto, "doc.campanas[0].respuesta");
  assert.equal(enCampana.length, 1, "no cazo los 45 minutos en la respuesta de campaña");
  assert.equal(enCampana[0].minutos, 45);

  const conFaq = JSON.parse(JSON.stringify(doc));
  conFaq.faq = [{ id: "negocio", respuesta: "La reunion dura 15 minutos." }];
  assert.equal(enRuta(conFaq, "doc.faq[0].respuesta").length, 1, "no cazo la duracion escrita en una FAQ");

  // Rango: "15-20 minutos" se juzga por el ultimo numero, igual que `demoDuration`.
  assert.deepEqual(
    duracionesQueSeDicen({ t: "dura 15-20 minutos" }, "x").map((d) => d.minutos),
    [20],
  );
});

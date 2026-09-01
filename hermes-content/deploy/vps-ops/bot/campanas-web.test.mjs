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
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { campanaExacta } from "./recepcionista.mjs";
import { normalize } from "./guardrails.mjs";
import { validateKnowledge } from "./knowledge.mjs";

const WEB_SRC = fileURLToPath(new URL("../../../../web-factory/apps/onia-platform/src/", import.meta.url));
const DOC_PATH = fileURLToPath(new URL("../../../docs/chatbot/campanas-onia.knowledge.json", import.meta.url));

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

/** Los literales que la web precarga en un link de WhatsApp. */
function frasesDeLaWeb() {
  const re = /wa(?:Servicios)?Link\(\s*"([^"]*)"/g;
  const encontradas = new Set();
  for (const file of fuentesWeb(WEB_SRC)) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(re)) encontradas.add(m[1]);
  }
  return encontradas;
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
      "hermes-content/docs/chatbot/campanas-onia.knowledge.json o declaralas en NO_MATCHEABLES",
  );
});

test("ninguna campaña quedo huerfana: si la web dejo de mandar la frase, la campaña sobra", () => {
  const deLaWeb = frasesDeLaWeb();
  const huerfanas = campanas.map((c) => c.frase).filter((f) => !deLaWeb.has(f));
  assert.deepEqual(huerfanas, [], "estas campañas ya no las dispara nadie: la web cambio el texto o borro el enlace");
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

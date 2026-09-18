#!/usr/bin/env node
// Ata la promesa "el chatbot ya viene adentro de tu plan" al booleano que la decide en el
// producto. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/promesa-inclusion.test.mjs
//
// El porqué completo está arriba de `promesa-inclusion.mjs`. En una línea: `precios-publicos`
// ata las CIFRAS y esto no es una cifra, es `whatsappIncluded` (booleano, otro repo) — así que
// mover ese booleano dejaba al bot cobrando Bs 390 por algo ya incluido, con todo en verde.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { incluidoPorPlanDelCatalogo, labelsDelProducto } from "./catalogo-inclusion.mjs";
import { fuenteDePlataforma, repoPlataforma } from "./fuente-plataforma.mjs";
import {
  mencionesDePlanes,
  planesDadosPorIncluidos,
  revisarPromesaDeInclusion,
} from "./promesa-inclusion.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// 1. El detector, contra casos escritos a mano
// ---------------------------------------------------------------------------

const LABELS = {
  free: "Gratuito",
  basic: "Básico",
  crece: "Crece",
  professional: "Profesional",
  clinic: "Completo",
  enterprise: "Empresa",
};

// El texto REAL del bot al 2026-09-12, palabra por palabra. Es el caso ancla: nombra los cuatro
// planes en UNA sola oración y la marca de inclusión aplica sólo al último. Un detector que
// juzgue por oración marca los cuatro y acusa a tres planes sanos — por eso la ventana es la
// cláusula, y por eso este caso está clavado acá.
const TEXTO_REAL =
  "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan Básico, " +
  "Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae el chatbot de " +
  "WhatsApp adentro. En los otros planes el chatbot va aparte, Bs 390 al mes.";

test("la marca de inclusión aplica al plan que tiene al lado, no a los cuatro de la enumeración", () => {
  const dados = planesDadosPorIncluidos(TEXTO_REAL, LABELS);
  assert.deepEqual([...dados].sort(), ["clinic"], "sólo el Completo está dado por incluido");
});

test("una coordinación pegada suma a los dos: «el Profesional y el Completo ya traen...»", () => {
  const dados = planesDadosPorIncluidos(
    "Bs 890 el Profesional y Bs 1.290 el Completo ya traen el chatbot adentro.",
    LABELS,
  );
  assert.deepEqual([...dados].sort(), ["clinic", "professional"]);
});

test("los nombres se buscan con límites de palabra: «crecer» no es el plan Crece", () => {
  const menciones = mencionesDePlanes("el sistema te ayuda a crecer sin pagar de más", LABELS);
  assert.deepEqual(menciones, [], "«crecer» no puede contar como una mención del plan Crece");
});

// ---------------------------------------------------------------------------
// 2. El veredicto: capacidad (catálogo) contra promesa (texto)
// ---------------------------------------------------------------------------

const HOY = { free: false, basic: false, crece: false, professional: false, clinic: true, enterprise: true };

test("con el catálogo de hoy, el texto de hoy no tiene un solo problema", () => {
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: TEXTO_REAL,
  });
  assert.deepEqual(problemas, []);
});

test("ROJO si el producto le da el chatbot a un plan y el bot le sigue cobrando el add-on", () => {
  // El movimiento que la escalera C invita: hacer más atractivo al Profesional incluyéndolo.
  const conProfesional = { ...HOY, professional: true };
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: conProfesional,
    labels: LABELS,
    texto: TEXTO_REAL,
  });
  assert.equal(problemas.length, 1, `esperaba un problema, hubo ${problemas.length}`);
  assert.match(problemas[0], /Profesional/);
  assert.match(problemas[0], /cobrando el add-on aparte/);
});

test("ROJO en la dirección simétrica: el bot regala lo que el producto cobra", () => {
  const sinNinguno = { ...HOY, clinic: false, enterprise: false };
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: sinNinguno,
    labels: LABELS,
    texto: TEXTO_REAL,
  });
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /Completo/);
  assert.match(problemas[0], /promesa que el producto no cumple/);
});

test("una redacción que el detector NO reconoce acusa, no absuelve", () => {
  // Falla cerrado a propósito: el veredicto se arma EXIGIENDO la marca, no buscando su ausencia,
  // así que una forma nueva de decir «incluido» cae en rojo y alguien la lee. Es la propiedad que
  // separa esta lista de inclusión de las que fallan abiertas ante el sujeto nuevo.
  const otraRedaccion = "Bs 1.290 el Completo, con el chatbot de WhatsApp de yapa.";
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: otraRedaccion,
  });
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /YA TRAE el chatbot incluido, y el texto/);
});

test("un plan incluido del que el bot ni habla es AVISO, no rojo — no miente, no lo vende", () => {
  const { problemas, avisos } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: TEXTO_REAL,
  });
  assert.deepEqual(problemas, []);
  assert.equal(avisos.length, 1);
  assert.match(avisos[0], /Empresa/);
});

// ---------------------------------------------------------------------------
// 3. La correa: contra el catálogo PUBLICADO y el knowledge REAL
// ---------------------------------------------------------------------------

// Los dos parsers del catálogo ya NO viven acá: los importa este test y también `precios-vivos.mjs`,
// que es el que puede cruzar el documento VIVO (fila del panel mergeada sobre el archivo). Tenerlos
// adentro del test era lo que ataba este cruce al archivo del repo y sólo al archivo del repo.

/** Todo string del knowledge, venga del campo que venga: el universo sale del artefacto. */
function textosDelKnowledge(valor, salida = []) {
  if (typeof valor === "string") salida.push(valor);
  else if (Array.isArray(valor)) for (const v of valor) textosDelKnowledge(v, salida);
  else if (valor && typeof valor === "object") for (const v of Object.values(valor)) textosDelKnowledge(v, salida);
  return salida;
}

test("lo que el bot dice de la inclusión coincide con el catálogo PUBLICADO de onia-platform", () => {
  const repo = repoPlataforma();
  const incluidoPorPlan = incluidoPorPlanDelCatalogo(fuenteDePlataforma(repo, "plan-catalogo.ts"));
  const labels = labelsDelProducto(fuenteDePlataforma(repo, "pricing.ts"));

  const knowledge = JSON.parse(readFileSync(path.join(AQUI, "knowledge.onia.json"), "utf8"));
  const textos = textosDelKnowledge(knowledge);
  assert.ok(textos.length > 0, "el knowledge no tiene un solo texto: algo se rompió al leerlo");

  // Se juzga texto por texto: pegarlos crearía cláusulas que nadie escribió, y una marca de un
  // párrafo terminaría aplicándole a un plan nombrado en otro.
  const problemas = [];
  const nombrados = new Set();
  for (const texto of textos) {
    const veredicto = revisarPromesaDeInclusion({ incluidoPorPlan, labels, texto });
    problemas.push(...veredicto.problemas);
    for (const plan of veredicto.nombrados) nombrados.add(plan);
  }

  assert.deepEqual(
    problemas,
    [],
    "El bot promete una cosa y el catálogo hace otra:\n  - " +
      problemas.join("\n  - ") +
      "\n\nSe arregla editando knowledge.onia.json (y publicándolo: `DESPLEGAR: bot` no lleva el " +
      "texto, el install es aparte con `webhook-server.sh knowledge`).",
  );

  // Que el cruce haya tenido SUJETO. Sin esto el test pasa verde el día que los nombres de plan
  // cambien y el texto deje de mencionarlos: cero menciones, cero problemas, cero valor.
  assert.ok(
    nombrados.size >= 2,
    `el knowledge nombra ${nombrados.size} plan(es) del catálogo: el cruce se quedó sin sujeto. ` +
      "Si los planes se renombraron, este gate dejó de mirar lo que cree mirar.",
  );
});

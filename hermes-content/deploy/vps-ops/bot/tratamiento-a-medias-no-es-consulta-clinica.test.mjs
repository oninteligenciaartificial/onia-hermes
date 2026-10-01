#!/usr/bin/env node
// El DUEÑO que cuenta sus pacientes con tratamiento a medias está contando SU DOLOR, no pidiendo un
// consejo clínico. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/tratamiento-a-medias-no-es-consulta-clinica.test.mjs
//
// ORIGEN (2026-09-30, preparando la pauta dental). El anuncio D4 se titula «Sabé quién no volvió» y
// el dolor #1 del cliente ideal es «el paciente con tratamiento a medias que no volvió a agendar»
// (`ONIA_CLIENTE_IDEAL.md` §4; la pregunta 4 de §9 es «¿cuántos pacientes tienen un tratamiento
// empezado y no volvieron?»). Es la respuesta MÁS probable de un dueño que llega por ese anuncio.
//
// Medido en el motor antes de este arreglo, después del precargado del anuncio:
//   «tengo como 30 pacientes con tratamiento a medias que no volvieron»
//     → `isClinicalOrLegal` (por la palabra "tratamiento") → M5 «Eso lo tiene que ver Sergio, no yo
//       — soy un bot y no quiero inventarte una respuesta» + handoff. El embudo se cortaba en el
//       mensaje exacto que la pauta paga por conseguir, y el dato del dolor no se guardaba.
//
// El guardia ya existía para el profesional que se presenta ("hago endodoncia"): los PROCEDIMIENTOS
// pasan por él, los SÍNTOMAS cortan siempre. Lo que faltaba es la otra forma en que un dueño habla:
// de SUS pacientes, en plural. Un paciente no dice "mis pacientes".
import assert from "node:assert/strict";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { normalize } from "./guardrails.mjs";
import * as intents from "./intents.mjs";
import { buildConfig } from "./simulate.mjs";

const T0 = "2026-09-30T19:00:00Z";
const SIN_AMBIENTE = { env: {}, envFile: "/no/existe/webhook.env" };
const HORARIOS = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";
const CONFIG = buildConfig({ slots: HORARIOS }, SIN_AMBIENTE);
const PRECARGADO_D4 = "Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.";

function turno(state, text, minuto = 0) {
  const receivedAt = new Date(Date.parse(T0) + minuto * 60000).toISOString();
  return step(state, { text, receivedAt }, { config: CONFIG });
}

const DUENO_CUENTA_SU_DOLOR = [
  "tengo como 30 pacientes con tratamiento a medias que no volvieron",
  "mis pacientes dejan el tratamiento y no vuelven",
  "hay pacientes que empiezan el tratamiento y desaparecen",
  "muchos pacientes abandonan la endodoncia a medias",
  "los pacientes con implante no vuelven al control",
];

for (const frase of DUENO_CUENTA_SU_DOLOR) {
  test(`«${frase}» es el dolor del dueño, no una consulta clínica`, () => {
    assert.equal(intents.isClinicalOrLegal(normalize(frase)), false);
  });
}

// La mitad que no se puede aflojar: lo clínico de verdad sigue yendo a un humano.
const SIGUE_SIENDO_CLINICO = [
  "necesito un tratamiento para la caries",
  "me recetaron un tratamiento, que medicamento tomo?",
  "tengo pacientes con fiebre despues de la extraccion, que les doy?", // un síntoma corta SIEMPRE
  "un paciente me demando, que hago?", // lo legal no pasa por este guardia
];

for (const frase of SIGUE_SIENDO_CLINICO) {
  test(`«${frase}» sigue yendo a un humano`, () => {
    assert.equal(intents.isClinicalOrLegal(normalize(frase)), true);
  });
}

test("el dueño que llega por D4 y cuenta el dolor sigue en el embudo, con el dolor anotado", () => {
  const r1 = turno(createState({ channel: "chatwoot", contactRef: "d4" }), PRECARGADO_D4);
  assert.equal(r1.nextState.botStage, "esperando_horario");
  const r2 = turno(r1.nextState, "tengo como 30 pacientes con tratamiento a medias que no volvieron", 1);

  assert.equal(r2.nextState.botStage, "esperando_horario", "no se deriva: es el lead que la pauta paga por traer");
  assert.equal(r2.sideEffects.filter((e) => e.type === "notify_sergio").length, 0);
  assert.equal(r2.replies.length, 1);
  assert.equal(r2.replies[0].templateKey, "M0b", "se acusa el dato y se vuelven a poner los horarios");
  assert.equal(r2.replies[0].replySource, "script", "el dolor dicho no se le manda al LLM a reformular");
  assert.equal(r2.nextState.qualification.painPoint, "clientes");

  const texto = r2.replies[0].text;
  assert.match(texto, /pacientes que no vuelven/, "a una clínica se le habla de pacientes, no de clientes");
  assert.match(texto, /jueves 2 de octubre, 14:00/);
  assert.doesNotMatch(texto, /te come es los/, "concordancia: «son los…», no «es los…»");

  const lead = r2.sideEffects.find((e) => e.type === "lead_upsert");
  assert.ok(lead, "el dolor viaja al CRM (pain_point), no solo a la conversación");
  assert.equal(lead.payload.qualification.painPoint, "clientes");
});

test("con el dolor ya dicho, M2 no se lo vuelve a preguntar al reservar", () => {
  const r1 = turno(createState({ channel: "chatwoot", contactRef: "d4m2" }), PRECARGADO_D4);
  const r2 = turno(r1.nextState, "mis pacientes dejan el tratamiento y no vuelven", 1);
  const r3 = turno(r2.nextState, "B", 2);
  assert.equal(r3.replies[0].templateKey, "M2");
  assert.doesNotMatch(r3.replies[0].text, /más tiempo te come/, "el dolor ya está anotado: pedirlo de nuevo es no leer");
  assert.match(r3.replies[0].text, /ciudad/, "lo que falta sí se pregunta");
});

test("si lo único que queda es el dolor, M2 igual tiene algo que preguntar (nunca una lista vacía)", () => {
  const r1 = turno(createState({ channel: "chatwoot", contactRef: "d4m2b" }), "Hola, vi el anuncio de Onia (D4). Tengo una clínica dental en Santa Cruz, somos 4.");
  const r2 = turno(r1.nextState, "A", 1);
  assert.equal(r2.replies[0].templateKey, "M2");
  assert.match(r2.replies[0].text, /1️⃣/);
});

test("preguntar por los horarios NO se anota como dolor (el detector del abandono es estrecho)", () => {
  const r1 = turno(createState({ channel: "chatwoot", contactRef: "d4b" }), PRECARGADO_D4);
  const r2 = turno(r1.nextState, "que otros horarios tienen?", 1);
  assert.equal(r2.nextState.qualification.painPoint, undefined);
});

test("«quedó a medias» del prospecto hablando de la conversación no es el dolor", () => {
  assert.equal(intents.mentionsAbandonedTreatment(normalize("si, quedo a medias, disculpa")), false);
  assert.equal(intents.mentionsAbandonedTreatment(normalize("tengo tratamientos a medias")), true);
  assert.equal(intents.mentionsAbandonedTreatment(normalize("empiezan y no vuelven")), true);
});

#!/usr/bin/env node
// «Somos 3 odontólogos» contesta la pregunta del tamaño. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/profesionales-de-la-clinica.test.mjs
//
// ORIGEN (2026-09-30, preparando la pauta dental). La primera pregunta de calificación del cliente
// ideal es «¿Cuántos profesionales atienden?» (`ONIA_CLIENTE_IDEAL.md` §9; 2 a 6 es el punto dulce
// y decide el plan: Crece, Profesional o Clínica). Una clínica la contesta con su oficio: «3
// odontólogos», «4 doctores», «2 dentistas y la recepcionista».
//
// El parser del tamaño reconocía «obreros», «estilistas», «mozos»… y NINGUN profesional de salud:
// «hay 3 odontólogos» no capturaba nada, el mensaje caía en la rama del LLM (reformular «¿jueves o
// viernes?») y sumaba un malentendido — al segundo, handoff. Justo con el rubro que la pauta paga.
// Se cuenta como el tamaño porque es el número con el que se califica: el plan se elige por
// profesionales, no por el total de gente en la clínica.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { normalize } from "./guardrails.mjs";
import * as intents from "./intents.mjs";
import { buildConfig } from "./simulate.mjs";

const CASOS = [
  ["hay 3 odontologos y la recepcionista", 3],
  ["somos 4 doctores", 4],
  ["2 dentistas", 2],
  ["tenemos 5 profesionales atendiendo", 5],
  ["tres odontólogas", 3],
  ["1 doctora y yo en recepción", 1],
];

for (const [frase, esperado] of CASOS) {
  test(`«${frase}» → ${esperado}`, () => {
    assert.equal(intents.parseQualification(normalize(frase), {}).teamSize, esperado);
  });
}

test("en la conversación: el dueño que contesta con sus odontólogos recibe el acuse, no al LLM", () => {
  const T0 = Date.parse("2026-09-30T19:00:00Z");
  // El reloj de la config es el de la conversacion, no el de la maquina: los horarios son fijos y
  // sin esto vencen solos (el 2-oct pusieron rojo este caso sin que nadie tocara el bot).
  const config = buildConfig(
    { slots: "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z" },
    { env: {}, envFile: "/no/existe/webhook.env", now: T0 },
  );
  const r1 = step(createState({ channel: "chatwoot", contactRef: "prof" }), { text: "Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.", receivedAt: new Date(T0).toISOString() }, { config });
  const r2 = step(r1.nextState, { text: "hay 3 odontologos y la recepcionista agenda", receivedAt: new Date(T0 + 60000).toISOString() }, { config });
  assert.equal(r2.replies[0].templateKey, "M0b");
  assert.equal(r2.replies[0].replySource, "script");
  assert.equal(r2.nextState.qualification.teamSize, 3);
  assert.equal(r2.nextState.offScriptCount, 0, "contestar la pregunta no cuenta como malentendido");
});

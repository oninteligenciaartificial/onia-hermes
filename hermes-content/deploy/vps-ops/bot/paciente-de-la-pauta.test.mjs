#!/usr/bin/env node
// El PACIENTE que llega por la pauta dental recibe una salida cortés, no el embudo de venta. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/paciente-de-la-pauta.test.mjs
//
// ORIGEN (2026-09-30, carril chatbot, preparando la pauta «clic a WhatsApp» solo dental). El doc de
// la pauta lo llama «el riesgo central» (`ONIA_ADQUISICION_Y_PAUTA.md` §5.2): el cliente ideal es
// ≲0,1 % del público alcanzable y, optimizando a conversaciones, **un anuncio que dice "clínica
// dental" trae PACIENTES que buscan turno**. Por eso el mensaje de bienvenida del anuncio trae una
// respuesta para tocar —«Busco atención dental»— que tiene que terminar en una salida cortés.
//
// Medido en el motor ANTES de este arreglo, con `knowledge.onia.json` (lo que carga el inbox 5):
//   · «Busco atención dental»                 → M0, la bienvenida de venta, y `lead_upsert`: el
//                                                paciente entraba al CRM como lead de Onia.
//   · «cuanto cuestan los brackets?»          → la escalera de precios de los PLANES de Onia.
//   · «Busco atención dental, me duele…»      → M5 «Eso lo tiene que ver Sergio» + aviso a Sergio
//                                                Urcullo por un paciente con dolor de muela.
//   · «quiero sacar una cita para una limpieza» → M0 con rubro «servicios» (por «limpieza»).
// Cada una de esas se paga dos veces: la conversación la cobra Meta y la lee Sergio Urcullo, que
// es la hora de soporte que el negocio no tiene (§9 de la estrategia: el techo son horas).
//
// LA OTRA MITAD, que es la que más cuesta si se rompe: el DUEÑO de la clínica habla de pacientes,
// de turnos y de citas todo el tiempo — es su negocio. Un detector que lo confunda con un paciente
// le cierra la puerta al único lead que la pauta existe para traer. Por eso la mitad de este
// archivo son frases de dueño que NO pueden salir por acá, empezando por el texto precargado del
// anuncio, las respuestas para tocar de §5.2 y todas las frases de campaña publicadas.
//
// Se mide sobre el motor con `knowledge.onia.json` aplicado (el documento que produccion carga para
// los inboxes 4 y 5), igual que `oferta-sistema.test.mjs`: un harness con su propia config diverge
// de producción en silencio.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { configComoProduccion } from "./config-como-produccion.mjs";
import { normalize } from "./guardrails.mjs";
import * as intents from "./intents.mjs";
import { buildConfig } from "./simulate.mjs";

const T0 = "2026-09-30T19:00:00Z"; // martes 15:00 en La Paz: dentro del horario de atención
// El reloj de la config es el de la conversacion (`T0`), no el de la maquina: los horarios son
// fijos y sin esto vencen solos (el 2-oct pusieron rojo este archivo sin que nadie tocara el bot).
const SIN_AMBIENTE = { env: {}, envFile: "/no/existe/webhook.env", now: Date.parse(T0) };
const HORARIOS = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";
// CON AGENDA PROPIA (`--slots` a mano): ofrece y confirma horarios.
const CONFIG = buildConfig({ slots: HORARIOS }, SIN_AMBIENTE);
// COMO PRODUCCION (3-oct): sin `ONIA_BOT_AGENDA=calcom`, la bienvenida es M0_PERSONA.
const PRODUCCION = configComoProduccion({ horarios: HORARIOS, now: Date.parse(T0) });

const PRECARGADO_D1 = "Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.";

function nuevo() {
  return createState({ channel: "chatwoot", contactRef: "pauta-1", channelType: "Channel::Whatsapp" });
}

function turno(state, text, minuto = 0, config = CONFIG) {
  const receivedAt = new Date(Date.parse(T0) + minuto * 60000).toISOString();
  return step(state, { text, receivedAt }, { config });
}

const tipos = (result) => result.sideEffects.map((effect) => effect.type);
const avisos = (result) => result.sideEffects.filter((effect) => effect.type === "notify_sergio");

// --- Lo que escribe un paciente ------------------------------------------------------------------

const PACIENTES = [
  "Busco atención dental", // la respuesta para tocar del anuncio (§5.2), literal
  "busco un dentista",
  "necesito un dentista urgente",
  "quiero sacar un turno para una limpieza",
  "quiero sacar una cita para una limpieza",
  "quiero agendar una cita con el dentista",
  "necesito una limpieza dental",
  "me duele una muela",
  "tengo dolor de muela desde ayer",
  "cuanto cuestan los brackets?",
  "cuanto cuesta una limpieza",
  "precio de la ortodoncia",
  "hacen blanqueamiento?",
  "soy paciente, quiero un turno",
  "tienen turno para mañana?",
];

for (const frase of PACIENTES) {
  test(`paciente: «${frase}» se reconoce como alguien que busca atención`, () => {
    assert.equal(intents.isPatientSeekingCare(normalize(frase)), true);
  });
}

// --- Lo que escribe un dueño (o su recepción) — NUNCA puede salir por la puerta del paciente ------

const CAMPANAS = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8")).campanas.map((c) => c.frase);

const DUENOS = [
  PRECARGADO_D1,
  "Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.",
  "Tengo una clínica y quiero ver cómo funciona", // respuesta para tocar §5.2
  "Trabajo en una clínica", // respuesta para tocar §5.2
  "Trabajo en una clínica dental, soy la recepcionista",
  "somos 4 doctores, la recepcionista agenda en un cuaderno",
  "quiero que mis pacientes puedan sacar turno solos",
  "mis pacientes no vuelven a la cita",
  "tengo como 30 pacientes con tratamiento a medias que no volvieron",
  "necesito un sistema para agendar citas",
  "cuanto cuesta el sistema para 4 doctores?",
  "quiero agendar la demo",
  "soy odontóloga y tengo un consultorio",
  "hacemos ortodoncia e implantes, somos 3 odontólogos",
  "los pacientes me piden turno por WhatsApp y se me pierden",
  "¿el sistema manda recordatorios de la cita al paciente?",
  "cuánto cuesta el plan?",
  ...CAMPANAS,
];

for (const frase of DUENOS) {
  test(`dueño: «${frase}» NO es un paciente`, () => {
    assert.equal(intents.isPatientSeekingCare(normalize(frase)), false);
  });
}

// --- El motor: la salida cortés ------------------------------------------------------------------

test("el paciente que toca «Busco atención dental» recibe la salida cortés y NO entra al CRM", () => {
  const r = turno(nuevo(), "Busco atención dental");
  assert.equal(r.replies.length, 1);
  assert.equal(r.replies[0].templateKey, "M1_PACIENTE");
  const texto = r.replies[0].text;
  // D2 sin excepción: es el primer mensaje, el bot se declara bot.
  assert.match(texto, /un bot/);
  // Dice qué NO somos y a dónde ir, sin vender nada.
  assert.match(texto, /no es una clínica/);
  assert.match(texto, /escríbale directo/);
  assert.doesNotMatch(texto, /Bs|horario|demo|\*\*A\)\*\*/i, "a un paciente no se le ofrecen demos, horarios ni precios");
  assert.equal(r.nextState.botStage, "descartado");
  assert.ok(!tipos(r).includes("lead_upsert"), "un paciente no es un lead: no se crea");
  assert.equal(avisos(r).length, 0, "un paciente no le cuesta un aviso a Sergio Urcullo");
  assert.ok(!tipos(r).includes("review_queue"), "ni una fila en la cola de revisión");
});

// Las dos bienvenidas: la de producción (la persona coordina, 3-oct) y la de agenda propia. Hasta el
// 3-oct estos casos corrían solo con la segunda y seguían verdes midiendo una rama que nadie veía.
const BIENVENIDAS = [
  { rama: "como en producción", config: PRODUCCION, bienvenida: "M0_PERSONA" },
  { rama: "con agenda propia", config: CONFIG, bienvenida: "M0" },
];

for (const { rama, config, bienvenida } of BIENVENIDAS) {
  test(`${rama}: el paciente que mandó el precargado del anuncio y después pide turno sale por la puerta cortés`, () => {
    // El precargado dice «Tengo una clínica dental» y un paciente lo manda igual: el primer mensaje
    // no los distingue, el segundo sí.
    const r1 = turno(nuevo(), PRECARGADO_D1, 0, config);
    assert.equal(r1.replies[0].templateKey, bienvenida);
    // El ejecutor le pone el lead_key a la conversación (no es determinista, por eso no lo hace el motor).
    const conLead = { ...r1.nextState, leadKey: "lead-pauta-1" };
    const r2 = turno(conLead, "no, yo busco turno para una limpieza", 1, config);
    assert.equal(r2.replies[0].templateKey, "M1_PACIENTE");
    assert.equal(r2.nextState.botStage, "descartado");
    const lead = r2.sideEffects.find((effect) => effect.type === "lead_upsert");
    assert.ok(lead, "el lead que nació con el precargado se cierra, no queda colgado como 'Contactado'");
    assert.equal(lead.payload.pipelineStatus, config.pipelineStatus.descartado);
    assert.equal(avisos(r2).length, 0);
  });

  test(`${rama}: el dueño que manda el precargado del anuncio sigue en el embudo de venta`, () => {
    const r = turno(nuevo(), PRECARGADO_D1, 0, config);
    assert.equal(r.replies[0].templateKey, bienvenida);
    assert.equal(r.nextState.botStage, "esperando_horario");
    assert.equal(r.nextState.qualification.industry, "dental");
    assert.ok(tipos(r).includes("lead_upsert"));
  });

  test(`${rama}: «Trabajo en una clínica» (respuesta para tocar) sigue en el embudo, no es paciente ni buscador de trabajo`, () => {
    const r = turno(nuevo(), "Trabajo en una clínica", 0, config);
    assert.equal(r.replies[0].templateKey, bienvenida);
    assert.equal(r.nextState.botStage, "esperando_horario");
  });
}

test("al paciente que pregunta el precio de un tratamiento NO se le recitan los planes de Onia", () => {
  const r = turno(nuevo(), "cuanto cuestan los brackets?");
  assert.equal(r.replies[0].templateKey, "M1_PACIENTE");
  assert.doesNotMatch(r.replies.map((reply) => reply.text).join("\n"), /Bs\s*\d/);
});

test("al paciente con dolor no se lo deriva a Sergio Urcullo: se le dice que vaya a su dentista", () => {
  const r1 = turno(nuevo(), PRECARGADO_D1);
  const r2 = turno(r1.nextState, "me duele una muela, necesito que me atiendan", 1);
  assert.equal(r2.replies[0].templateKey, "M1_PACIENTE");
  assert.notEqual(r2.nextState.botStage, "handoff_humano");
  assert.equal(avisos(r2).length, 0);
});

test("el paciente que insiste recibe la misma salida, sin volver a registrar el descarte", () => {
  const r1 = turno(nuevo(), "Busco atención dental");
  const r2 = turno(r1.nextState, "pero necesito un turno para hoy", 1);
  assert.equal(r2.replies[0].templateKey, "M1_PACIENTE");
  assert.equal(r2.nextState.botStage, "descartado");
  assert.equal(r2.sideEffects.length, 0, "el descarte ya se registró en el primer turno");
});

test("con agenda propia: si el que ya había agendado resulta ser paciente, Sergio Urcullo se entera para liberar el horario", () => {
  const r1 = turno(nuevo(), PRECARGADO_D1);
  const r2 = turno(r1.nextState, "B", 1);
  assert.equal(r2.nextState.botStage, "demo_agendada");
  const r3 = turno(r2.nextState, "perdon, yo quería sacar una cita para una limpieza", 2);
  assert.equal(r3.replies[0].templateKey, "M1_PACIENTE");
  assert.equal(avisos(r3).length, 1);
  assert.equal(avisos(r3)[0].payload.kind, "descarte_tras_agendar");
});


// --- Después de la salida: el «gracias» no molesta a nadie --------------------------------------

for (const cortesia of ["gracias", "ok gracias", "ah ok, gracias!", "listo, gracias", "dale"]) {
  test(`después de la salida, «${cortesia}» no se contesta ni se deriva`, () => {
    const r1 = turno(nuevo(), "Busco atención dental");
    const r2 = turno(r1.nextState, cortesia, 1);
    assert.equal(r2.replies.length, 0, "a un «gracias» no se le contesta con M5");
    assert.equal(avisos(r2).length, 0, "ni se le manda un aviso a Sergio Urcullo");
    assert.equal(r2.nextState.botStage, "descartado");
  });
}

// El mensaje entra de afuera y la cortesía es una repetición `(?:sep palabra)*`: con una palabra que
// matchea de dos formas ("ah" por `ah+` y por `a+h`, la primera versión de este arreglo) el
// backtracking es exponencial — medido: 24 «ah» + "x" ya tardaban 0,8 s y cada dos palabras más
// lo multiplican por cuatro. Un lead (o un bromista) colgaba el proceso del bot con un audio de risa
// transcripto. Los detectores nuevos se juzgan acá sobre entradas hostiles.
for (const [nombre, texto] of [
  ["risa larga que no termina en cortesía", `${"ah ".repeat(2000)}x`],
  ["cortesía repetida que no termina en cortesía", `${"ok gracias, ".repeat(800)}x`],
  ["un pedido de turno que nunca llega al turno", `${"quiero sacarme ".repeat(800)}x`],
  ["un abandono que nunca cierra", `empiezan ${"y ".repeat(3000)}x`],
]) {
  test(`sin backtracking catastrófico: ${nombre}`, () => {
    const norm = normalize(texto);
    const t0 = performance.now();
    intents.isCourtesy(norm);
    intents.isPatientSeekingCare(norm);
    intents.mentionsAbandonedTreatment(norm);
    assert.ok(performance.now() - t0 < 250, "un mensaje de afuera no puede colgar el motor");
  });
}

test("la salida cortés solo existe en modo VENTA: el recepcionista de una clínica cliente atiende pacientes", () => {
  const recepcionista = { ...CONFIG, modo: "recepcionista" };
  const r = step(nuevo(), { text: "quiero sacar un turno para una limpieza", receivedAt: T0 }, { config: recepcionista });
  assert.ok(r.replies.every((reply) => reply.templateKey !== "M1_PACIENTE"));
});

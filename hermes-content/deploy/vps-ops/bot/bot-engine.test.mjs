// ONIA — Chatbot propio: pruebas del motor y de los guardrails.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
// Cubre lo que la spec marca como no negociable: calificacion, descarte cortes,
// 2 malentendidos -> handoff, opt-out, silencio ante un humano, los 6 codigos de guardrail,
// el auto-test del texto seguro, que los regex no lleven /g, y el follow-up unico.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig } from "./config.mjs";
import {
  createState,
  step,
  markHumanTakeover,
  followUpDue,
  buildFollowUp,
  LLM_PENDING,
} from "./bot-engine.mjs";
import {
  GUARDRAIL_RULES,
  SAFE_REPLY,
  checkGuardrails,
  enforceGuardrails,
} from "./guardrails.mjs";

// Config de prueba: horarios concretos (los reales los define Sergio, ver TODO en config.mjs).
const CONFIG = createBotConfig({
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario

function at(minutes) {
  return new Date(Date.parse(T0) + minutes * 60000).toISOString();
}

/** Corre una lista de mensajes y devuelve { state, turns[] }. */
function run(turns, options = {}) {
  let state = options.state || createState({ channel: "sim", contactRef: "test" });
  const results = [];
  turns.forEach((turn, index) => {
    const incoming = typeof turn === "string" ? { text: turn } : turn;
    const result = step(state, { ...incoming, receivedAt: at(index * 2) }, { config: CONFIG, ...options });
    state = result.nextState;
    results.push(result);
  });
  return { state, turns: results };
}

const textOf = (result) => result.replies.map((reply) => reply.text).join("\n");
const keysOf = (result) => result.replies.map((reply) => reply.templateKey);
const effectsOf = (result) => result.sideEffects.map((effect) => effect.type);

// ---------------------------------------------------------------------------
// 1. Calificacion OK -> demo agendada
// ---------------------------------------------------------------------------

test("califica con los 3 datos, ofrece 2 horarios y agenda el elegido", () => {
  const { state, turns } = run([
    "DEMO",
    "es mia, tengo 2 sillones y estoy en Santa Cruz",
    "A",
    "la agenda",
  ]);

  assert.deepEqual(keysOf(turns[0]), ["M0"]);
  assert.match(turns[0].replies[0].text, /soy un bot|Soy el asistente automático/, "D2: el primer mensaje se presenta como bot");

  assert.deepEqual(keysOf(turns[1]), ["M1b"]);
  assert.equal(turns[1].nextState.botStage, "esperando_horario");
  assert.deepEqual(turns[1].nextState.qualification, { ownsClinic: true, chairs: 2, city: "Santa Cruz" });
  assert.ok(effectsOf(turns[1]).includes("lead_upsert"), "el lead se crea recien al calificar");
  const lead = turns[1].sideEffects.find((effect) => effect.type === "lead_upsert");
  assert.equal(lead.payload.pipelineStatus, "Contactado", "valor exacto que entiende el panel");
  assert.match(textOf(turns[1]), /jueves 15:00/);
  assert.match(textOf(turns[1]), /viernes 10:00/);

  assert.deepEqual(keysOf(turns[2]), ["M2"]);
  assert.equal(state.botStage, "demo_agendada");
  assert.equal(state.scheduledAt, "2026-07-30T19:00:00Z");
  assert.deepEqual(effectsOf(turns[2]).sort(), ["audit_log", "calendar_event", "lead_upsert", "notify_sergio", "stage_change"]);
  assert.equal(turns[2].sideEffects.find((e) => e.type === "lead_upsert").payload.pipelineStatus, "Reunion");

  assert.equal(state.qualification.painPoint, "agenda");
});

test("el primer mensaje con los 3 datos no re-pregunta, pero igual se presenta como bot", () => {
  const { turns } = run(["DEMO. Es mi clinica, 3 sillones, en Cochabamba"]);
  assert.deepEqual(keysOf(turns[0]), ["M0_DISCLOSURE", "M1b"]);
  assert.match(turns[0].replies[0].text, /un bot/);
});

test("re-pregunta como maximo 2 veces y despues entrega a un humano", () => {
  const { state, turns } = run([
    "DEMO",
    "es mia",            // falta sillones y ciudad -> M1a (1)
    "en Santa Cruz",     // falta sillones          -> M1a (2)
    "no se, depende",    // sigue faltando          -> handoff
  ]);
  assert.deepEqual(keysOf(turns[1]), ["M1a"]);
  assert.deepEqual(keysOf(turns[2]), ["M1a"]);
  assert.equal(state.botStage, "handoff_humano");
  assert.ok(effectsOf(turns[3]).includes("review_queue"));
});

// ---------------------------------------------------------------------------
// 2. Descarte cortes
// ---------------------------------------------------------------------------

test("descarta cortesmente a quien no es el publico (M1c) y no crea lead", () => {
  const { state, turns } = run(["DEMO", "soy estudiante de odontologia, no tengo clinica"]);
  assert.deepEqual(keysOf(turns[1]), ["M1c"]);
  assert.equal(state.botStage, "descartado");
  assert.ok(!effectsOf(turns[1]).includes("lead_upsert"), "un lead sin calificar no es un lead");
  assert.match(textOf(turns[1]), /no te quiero hacer perder 20 minutos/);
});

test("decidir con un socio NO descalifica", () => {
  const { state } = run(["DEMO", "la manejo con mi socio, 2 sillones, Sucre"]);
  assert.equal(state.botStage, "esperando_horario");
  assert.equal(state.qualification.ownsClinic, "socio");
});

test("trabajar en la clinica de otro si descalifica", () => {
  const { state } = run(["DEMO", "trabajo en la de mi jefe, son 4 sillones, en Oruro"]);
  assert.equal(state.botStage, "descartado");
});

// ---------------------------------------------------------------------------
// 3. Dos malentendidos -> handoff
// ---------------------------------------------------------------------------

test("2 malentendidos seguidos terminan en handoff, no en un tercer intento", () => {
  const { state, turns } = run(["DEMO", "mmm depende", "y bueno vos que decis"]);

  assert.equal(turns[1].replies[0].replySource, "llm", "1er malentendido: unica rama con LLM");
  assert.equal(turns[1].replies[0].text, LLM_PENDING, "sin LLM inyectado devuelve marcador");
  assert.ok(turns[1].replies[0].llmRequest, "deja el hook armado para el ejecutor");
  assert.equal(turns[1].nextState.offScriptCount, 1);

  assert.deepEqual(keysOf(turns[2]), ["M5"]);
  assert.equal(state.botStage, "handoff_humano");
  const review = turns[2].sideEffects.find((effect) => effect.type === "review_queue");
  assert.equal(review.payload.sourceType, "lead");
  assert.equal(review.payload.reviewerRoleKey, "sergio");
  assert.equal(review.payload.sensitive, true);
});

test("el prompt del LLM no recibe precios, planes ni cifras", () => {
  const { turns } = run(["DEMO", "mmm depende"]);
  const request = turns[1].replies[0].llmRequest;
  const dump = JSON.stringify(request).toLowerCase();
  assert.ok(!/\d+\s*(bs|bolivianos|usd)/.test(dump), "no puede filtrar lo que no tiene");
  assert.deepEqual(request.forbidden, ["precio", "planes", "features", "cifras", "casos de clientes"]);
});

test("el texto libre del LLM pasa por el guardrail; el guion NO", () => {
  const { turns } = run(["DEMO", "mmm depende"], { llm: () => "Tranquilo, el plan Pro cuesta 750 Bs al mes." });
  const reply = turns[1].replies[0];
  assert.equal(reply.guardrail.ok, false);
  assert.ok(reply.guardrail.violations.includes("declara_precio"));
  assert.ok(!/750/.test(reply.text), "la respuesta entera se descarta, no se recorta");
  assert.match(reply.text, /soy un bot/);
  assert.match(reply.text, /jueves 15:00/, "las variables se renderizan DESPUES del guardrail");
});

// ---------------------------------------------------------------------------
// 4. Opt-out y silencio ante un humano
// ---------------------------------------------------------------------------

test("STOP corta la conversacion y despues el bot no vuelve a hablar", () => {
  const { state, turns } = run(["DEMO", "STOP", "hola? estas ahi?"]);
  assert.deepEqual(keysOf(turns[1]), ["M6"]);
  assert.equal(turns[1].nextState.botStage, "opt_out");
  assert.equal(turns[1].nextState.optOutAt, at(2));
  assert.equal(turns[2].replies.length, 0, "silencio total tras el opt-out");
  assert.deepEqual(turns[2].notes, ["silencio:opt_out"]);
  assert.equal(state.botStage, "opt_out");
});

test("'no me interesa' tambien es opt-out", () => {
  const { state } = run(["DEMO", "no me interesa, gracias"]);
  assert.equal(state.botStage, "opt_out");
});

test("solo el disparador DEMO puede reabrir tras un opt-out", () => {
  const { state, turns } = run(["DEMO", "STOP", "y cuantos sillones dijiste?", "DEMO"]);
  assert.equal(turns[2].replies.length, 0);
  assert.deepEqual(keysOf(turns[3]), ["M0"]);
  assert.equal(state.botStage, "esperando_calificacion");
  assert.equal(state.optOutAt, null);
  assert.equal(state.optInSource, "inbound_demo");
});

test("si un humano contesta, el bot se calla para siempre", () => {
  const first = run(["DEMO"]);
  const taken = markHumanTakeover(first.state, at(2));
  const after = run(["hola? me decias?", "es mia, 2 sillones, santa cruz"], { state: taken });
  assert.equal(after.turns[0].replies.length, 0);
  assert.equal(after.turns[1].replies.length, 0);
  assert.equal(after.state.humanTookOver, true, "nunca vuelve solo a false");
});

// ---------------------------------------------------------------------------
// 5. Prohibiciones duras del guion
// ---------------------------------------------------------------------------

test("ante una pregunta de precio contesta M4 y no dice ninguna cifra de plata", () => {
  const { turns } = run(["DEMO", "es mia, 2 sillones, santa cruz", "cuanto cuesta al mes?"]);
  const text = textOf(turns[2]);
  assert.ok(keysOf(turns[2]).includes("M4_BODY"));
  assert.ok(!/\d+[\s.,]*(bs|bolivianos|\$us|usd)/i.test(text), "N1: el bot no cotiza");
  assert.match(text, /jueves 15:00/, "M4 vuelve al embudo ofreciendo los horarios");
});

test("SIAT: solo lo publico, nunca 'ya emitimos factura certificada'", () => {
  const { turns } = run(["DEMO", "ya emite factura al SIAT?"]);
  const text = textOf(turns[1]);
  assert.ok(keysOf(turns[1]).includes("M_SIAT_BODY"));
  assert.match(text, /portal gratis/, "siempre se menciona el portal gratis del SIN");
  assert.ok(!/homologad/i.test(text));
  assert.ok(checkGuardrails(text).indexOf("promete_siat") === -1);
});

test("consulta clinica o legal va directo a un humano", () => {
  const { state, turns } = run(["DEMO", "mi paciente necesita una endodoncia, que tratamiento le pongo?"]);
  assert.deepEqual(keysOf(turns[1]), ["M5"]);
  assert.equal(state.botStage, "handoff_humano");
});

test("queja o desconfianza fuerte: handoff sin defenderse", () => {
  const { state, turns } = run(["DEMO", "esto es una estafa"]);
  assert.deepEqual(keysOf(turns[1]), ["M5"]);
  assert.equal(state.botStage, "handoff_humano");
});

test("ningun mensaje del guion (M0-M7) contiene cifras de negocio", () => {
  const forbidden = [/\d+[\s.,]*(bs|bolivianos|\$us|usd|dolares)/i, /\d{1,3}\s*%/];
  for (const [key, value] of Object.entries(CONFIG.script)) {
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(value), `${key} no puede traer cifras de negocio`);
    }
  }
});

test("audio sin transcripcion pide texto; con transcripcion sigue el embudo", () => {
  const { state, turns } = run([
    "DEMO",
    { kind: "voice", transcript: "" },
    { kind: "voice", transcript: "si es mia, tenemos 3 sillones aca en la paz" },
  ]);
  assert.deepEqual(keysOf(turns[1]), ["M_AUDIO_FAIL"]);
  assert.equal(turns[1].nextState.botStage, "esperando_calificacion", "un audio ilegible no mueve el estado");
  assert.deepEqual(keysOf(turns[2]), ["M1b"]);
  assert.equal(state.qualification.city, "La Paz");
});

test("fuera de horario se APENDEA el aviso, no reemplaza la respuesta", () => {
  const state = createState({ channel: "sim", contactRef: "nocturno" });
  const result = step(state, { text: "DEMO", receivedAt: "2026-07-28T03:30:00Z" }, { config: CONFIG });
  assert.deepEqual(keysOf(result), ["M0"]);
  assert.match(result.replies[0].text, /Contame tres cosas rápidas/);
  assert.match(result.replies[0].text, /fuera de horario de oficina/);
  assert.ok(result.notes.includes("fuera_de_horario"));
});

// ---------------------------------------------------------------------------
// 6. Guardrails: los 6 codigos + auto-test del texto seguro + sin flag /g
// ---------------------------------------------------------------------------

const CASOS = [
  ["declara_precio", "Claro, el plan Pro cuesta 750 Bs al mes."],
  ["promete_siat", "Sí, Onia Dental ya emite factura al SIAT y está homologado."],
  ["promete_feature", "Se integra con tu impresora de radiografías y te garantizo que no falla."],
  ["finge_humano", "Soy Sergio, te llamo ahora mismo."],
  ["cifra_inventada", "El 80% de las clínicas que usan el sistema ahorra tiempo."],
  ["consejo_profesional", "Te recomiendo declarar eso como gasto deducible."],
];

for (const [code, sample] of CASOS) {
  test(`guardrail atrapa ${code}`, () => {
    const verdict = enforceGuardrails(sample);
    assert.equal(verdict.ok, false);
    assert.ok(verdict.violations.includes(code), `esperaba ${code}, salio ${verdict.violations.join(",")}`);
    assert.equal(verdict.text, SAFE_REPLY, "se reemplaza la respuesta ENTERA");
  });
}

test("el texto seguro no dispara ninguno de sus propios regex", () => {
  const verdict = enforceGuardrails(SAFE_REPLY);
  assert.equal(verdict.ok, true);
  assert.deepEqual(verdict.violations, []);
});

test("ningun regex lleva flag /g (con /g, .test() es stateful)", () => {
  for (const rule of GUARDRAIL_RULES) {
    for (const pattern of rule.patterns) {
      assert.ok(!pattern.flags.includes("g"), `${rule.code}: ${pattern} no puede llevar /g`);
    }
  }
});

test("checkGuardrails es estable entre llamadas seguidas", () => {
  for (const [, sample] of CASOS) {
    assert.deepEqual(checkGuardrails(sample), checkGuardrails(sample));
    assert.deepEqual(checkGuardrails(sample), checkGuardrails(sample));
  }
});

test("un texto limpio pasa sin tocarse", () => {
  const clean = "Dale, te agendo la demo y lo ves con tus propios datos.";
  const verdict = enforceGuardrails(clean);
  assert.equal(verdict.ok, true);
  assert.equal(verdict.text, clean);
});

test("el guardrail nunca rompe: ante un error devuelve el texto original", () => {
  const weird = { toString() { throw new Error("boom"); } };
  const verdict = enforceGuardrails(weird);
  assert.equal(verdict.ok, true);
});

// ---------------------------------------------------------------------------
// 7. Follow-up unico y determinismo
// ---------------------------------------------------------------------------

test("el follow-up sale una sola vez, a las 22 h, y nunca dos", () => {
  const { state } = run(["DEMO", "es mia"]);
  assert.equal(followUpDue(state, at(60), CONFIG), false, "a la hora todavia no");
  const first = buildFollowUp(state, "2026-07-28T12:10:00Z", CONFIG);
  assert.ok(first, "22 h despues corresponde");
  assert.equal(first.reply.templateKey, "M3");
  assert.equal(first.nextState.followupStep, 1);
  assert.equal(buildFollowUp(first.nextState, "2026-07-29T12:10:00Z", CONFIG), null, "N7: uno y nada mas");
});

test("no hay follow-up si hubo opt-out o si un humano tomo la conversacion", () => {
  const { state } = run(["DEMO", "es mia"]);
  assert.equal(followUpDue({ ...state, optOutAt: at(4) }, "2026-07-28T12:10:00Z", CONFIG), false);
  assert.equal(followUpDue(markHumanTakeover(state), "2026-07-28T12:10:00Z", CONFIG), false);
});

test("mismo estado + mismo mensaje = misma salida (sin Date.now ni Math.random)", () => {
  const turns = ["DEMO", "es mia, 2 sillones, santa cruz", "B", "los cobros"];
  const a = run(turns);
  const b = run(turns);
  assert.deepEqual(JSON.parse(JSON.stringify(a.turns)), JSON.parse(JSON.stringify(b.turns)));
  assert.deepEqual(a.state, b.state);
});

test("el motor no escribe en la base: solo devuelve efectos declarativos", () => {
  const { turns } = run(["DEMO", "es mia, 2 sillones, santa cruz", "A"]);
  const tipos = new Set(turns.flatMap(effectsOf));
  for (const tipo of tipos) {
    assert.ok(
      ["stage_change", "lead_upsert", "calendar_event", "notify_sergio", "review_queue", "audit_log", "llm_request"].includes(tipo),
      `efecto inesperado: ${tipo}`,
    );
  }
});

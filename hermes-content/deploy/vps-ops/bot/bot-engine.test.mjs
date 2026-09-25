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
  conversacionVencida,
  LLM_PENDING,
  STAGES,
} from "./bot-engine.mjs";
import {
  GUARDRAIL_RULES,
  SAFE_REPLY,
  checkGuardrails,
  enforceGuardrails,
} from "./guardrails.mjs";
import { applyKnowledge, asRecepcionista, validateKnowledge } from "./knowledge.mjs";

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
// 1. Bienvenida con horarios -> demo agendada -> calificacion
// ---------------------------------------------------------------------------

test("el primer mensaje ofrece los 2 horarios, agenda el elegido y RECIEN AHI pregunta los 3 datos", () => {
  const { state, turns } = run([
    "DEMO",
    "A",
    "tengo una ferreteria, somos 5 y estoy en Santa Cruz. la agenda",
  ]);

  assert.deepEqual(keysOf(turns[0]), ["M0"]);
  assert.match(turns[0].replies[0].text, /soy un bot|Soy el asistente automático/, "D2: el primer mensaje se presenta como bot");
  assert.match(textOf(turns[0]), /jueves 15:00/, "los horarios van en el PRIMER mensaje");
  assert.match(textOf(turns[0]), /viernes 10:00/);
  assert.ok(!/a qué se dedica|cuántas personas/i.test(textOf(turns[0])), "y no cobra una sola pregunta antes de ofrecer");
  assert.equal(turns[0].nextState.botStage, "esperando_horario");
  assert.ok(effectsOf(turns[0]).includes("lead_upsert"), "el lead nace con la oferta sobre la mesa");
  const lead = turns[0].sideEffects.find((effect) => effect.type === "lead_upsert");
  assert.equal(lead.payload.pipelineStatus, "Contactado", "valor exacto que entiende el panel");

  assert.deepEqual(keysOf(turns[1]), ["M2"]);
  assert.equal(turns[1].nextState.botStage, "demo_agendada");
  assert.equal(turns[1].nextState.scheduledAt, "2026-07-30T19:00:00Z");
  assert.match(textOf(turns[1]), /A qué se dedica tu negocio/, "las 3 preguntas viajan a DESPUES de la reserva");
  assert.match(textOf(turns[1]), /Cuántas personas trabajan ahí/);
  assert.match(textOf(turns[1]), /En qué ciudad estás/);
  assert.deepEqual(effectsOf(turns[1]).sort(), ["audit_log", "calendar_event", "lead_upsert", "notify_sergio", "stage_change"]);
  assert.equal(turns[1].sideEffects.find((e) => e.type === "lead_upsert").payload.pipelineStatus, "Reunion");

  assert.deepEqual(keysOf(turns[2]), ["M2b"]);
  assert.equal(state.botStage, "demo_agendada");
  assert.deepEqual(state.qualification, {
    industry: "comercio",
    teamSize: 5,
    city: "Santa Cruz",
    painPoint: "agenda",
  });
});

test("los datos que llegan ANTES de reservar no se vuelven a pedir en M2", () => {
  const { turns } = run(["DEMO. Tengo un restaurante, somos 8, en Cochabamba", "A"]);
  assert.deepEqual(keysOf(turns[0]), ["M0"]);
  assert.match(turns[0].replies[0].text, /un bot/);
  assert.deepEqual(turns[0].nextState.qualification, { industry: "gastronomia", teamSize: 8, city: "Cochabamba" });

  assert.deepEqual(keysOf(turns[1]), ["M2"]);
  assert.ok(
    !/a qué se dedica|cuántas personas|en qué ciudad/i.test(textOf(turns[1])),
    "no se le re-pregunta lo que acaba de contestar",
  );
  assert.match(textOf(turns[1]), /más tiempo te come/, "pero el dolor se sigue pidiendo");
});

test("con la demo ya reservada re-pregunta como maximo 2 veces y despues deja de insistir", () => {
  const { state, turns } = run([
    "DEMO",
    "A",                     // reserva: M2 pide los 3 datos
    "tengo una ferreteria",  // falta tamaño y ciudad -> M1a (1)
    "en Santa Cruz",         // falta tamaño          -> M1a (2)
    "no se, depende. los cobros", // sigue faltando   -> cierra sin insistir de nuevo
  ]);
  assert.deepEqual(keysOf(turns[2]), ["M1a"]);
  assert.deepEqual(keysOf(turns[3]), ["M1a"]);
  assert.deepEqual(keysOf(turns[4]), ["M2b"], "a la 3ra no se insiste: la demo ya esta reservada");
  assert.ok(!/me falta/i.test(textOf(turns[4])));
  assert.equal(state.botStage, "demo_agendada", "y la reunion sigue en pie");
  assert.equal(state.qualification.teamSize, undefined, "no se inventa el dato que nunca dio");
});

// ---------------------------------------------------------------------------
// 2. Descarte cortes
// ---------------------------------------------------------------------------

test("descarta cortesmente a quien no es un negocio (M1c), en cualquier punto del embudo", () => {
  const { state, turns } = run(["DEMO", "soy estudiante todavia, busco trabajo"]);
  assert.deepEqual(keysOf(turns[1]), ["M1c"]);
  assert.equal(state.botStage, "descartado");

  // Y tambien DESPUES de reservar: con las 3 preguntas al final, el dato que descarta llega recien
  // con la respuesta a M2. Ahi Sergio tiene que enterarse para liberar el horario.
  const tarde = run(["DEMO", "A", "en realidad busco trabajo, les mando mi cv?"]);
  assert.deepEqual(keysOf(tarde.turns[2]), ["M1c"]);
  assert.equal(tarde.state.botStage, "descartado");
  assert.ok(effectsOf(tarde.turns[2]).includes("notify_sergio"), "la demo reservada quedo colgada: se avisa");
});

test("el rubro ya NO descalifica: cualquier negocio entra al embudo", () => {
  // Era la regla del bot dental (veterinaria/ferreteria/restaurante = descarte). Con la plataforma
  // por modulos esos son justamente los clientes nuevos: descartarlos es tirar el mercado entero.
  for (const mensaje of [
    "tengo una veterinaria, somos 3, en Sucre",
    "tengo una ferreteria, somos 5, en Oruro",
    "tengo un restaurante, somos 9, en Tarija",
  ]) {
    const { state } = run(["DEMO", mensaje]);
    assert.equal(state.botStage, "esperando_horario", mensaje);
  }
});

test("el tamaño tampoco descalifica: un negocio grande es mejor cliente, no peor", () => {
  const { state } = run(["DEMO", "tenemos una distribuidora, somos 40 empleados, en Santa Cruz"]);
  assert.equal(state.botStage, "esperando_horario");
  assert.equal(state.qualification.teamSize, 40);
});

test("odontologia pregunta los sillones como dato de RAMA, y el resto de los rubros no", () => {
  const dental = run(["DEMO", "A", "soy dentista, somos 4, en Sucre"]);
  assert.deepEqual(keysOf(dental.turns[2]), ["M1_RAMA_DENTAL"]);
  assert.equal(dental.state.botStage, "demo_agendada", "la rama se pregunta con la demo ya reservada");

  const conSillones = run(["DEMO", "A", "soy dentista, somos 4, en Sucre", "2"]);
  assert.equal(conSillones.state.qualification.chairs, 2);
  assert.deepEqual(keysOf(conSillones.turns[3]), ["M2b"]);

  const ferreteria = run(["DEMO", "A", "tengo una ferreteria, somos 4, en Sucre"]);
  assert.deepEqual(keysOf(ferreteria.turns[2]), ["M2b"], "otro rubro no ve la pregunta de rama");
  assert.ok(!/sillon/i.test(textOf(ferreteria.turns[2])), "y no le nombra el dato de otro rubro");
});

test("el dato de rama no bloquea: si no lo contesta, la demo sigue agendada igual", () => {
  const { state, turns } = run([
    "DEMO",
    "A",
    "soy dentista, somos 4, en Sucre",
    "uf ni idea, lo que más me come son los cobros",
  ]);
  assert.deepEqual(keysOf(turns[2]), ["M1_RAMA_DENTAL"]);
  assert.deepEqual(keysOf(turns[3]), ["M2b"], "no se insiste con el dato de rama");
  assert.equal(state.botStage, "demo_agendada");
  assert.equal(state.qualification.chairs, undefined, "no se inventa el dato que no dio");
  assert.equal(state.qualification.painPoint, "cobros");
});

test("SOPORTE: quien ya es cliente no recibe la demo comercial, va a un humano", () => {
  const { state, turns } = run(["DEMO", "ya soy cliente y el sistema no me anda"]);
  assert.deepEqual(keysOf(turns[1]), ["M8_SOPORTE"]);
  assert.equal(state.botStage, "handoff_humano");
  assert.ok(!/jueves 15:00|viernes 10:00/.test(textOf(turns[1])), "no le ofrece un solo horario de venta");
  assert.match(textOf(turns[1]), /soy un bot/, "D2: sigue diciendo que es un bot");
  assert.ok(effectsOf(turns[1]).includes("review_queue"), "y Sergio se entera");
  assert.ok(turns[1].notes.includes("handoff:soporte_cliente"), "con el motivo separado de la venta");
});

test("SOPORTE no se traga al que usa OTRO sistema: esa es la objecion de venta de siempre", () => {
  const { state } = run(["DEMO", "ya tengo un sistema"]);
  assert.equal(state.botStage, "esperando_horario", "sigue en el embudo, no en soporte");
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
  assert.equal(state.botStage, "esperando_horario");
  assert.equal(state.optOutAt, null);
  assert.equal(state.optInSource, "inbound_demo");
});

test("si un humano contesta, el bot se calla para siempre", () => {
  const first = run(["DEMO"]);
  const taken = markHumanTakeover(first.state, at(2));
  const after = run(["hola? me decias?", "tengo una ferreteria, somos 5, santa cruz"], { state: taken });
  assert.equal(after.turns[0].replies.length, 0);
  assert.equal(after.turns[1].replies.length, 0);
  // "Para siempre" mientras la charla este VIVA: la unica salida automatica es el reinicio
  // por vencimiento (>N dias sin actividad de nadie, ver la seccion Conversacion VENCIDA).
  assert.equal(after.state.humanTookOver, true, "no vuelve solo a false con la charla activa");
});

// ---------------------------------------------------------------------------
// 5. Prohibiciones duras del guion
// ---------------------------------------------------------------------------

test("ante una pregunta de precio contesta M4 y no dice ninguna cifra de plata", () => {
  const { turns } = run(["DEMO", "tengo una ferreteria, somos 5, santa cruz", "cuanto cuesta al mes?"]);
  const text = textOf(turns[2]);
  assert.ok(keysOf(turns[2]).includes("M4_BODY"));
  assert.ok(!/\d+[\s.,]*(bs|bolivianos|\$us|usd)/i.test(text), "N1: el bot no cotiza");
  assert.ok(!/sillon/i.test(text), "y no le habla del dato de otro rubro a un ferretero");
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
    { kind: "voice", transcript: "si tenemos una panaderia, somos 3 personas aca en la paz" },
  ]);
  assert.deepEqual(keysOf(turns[1]), ["M_AUDIO_FAIL"]);
  assert.equal(turns[1].nextState.botStage, "esperando_horario", "un audio ilegible no mueve el estado");
  assert.deepEqual(keysOf(turns[2]), ["M0b"]);
  assert.equal(state.qualification.city, "La Paz");
});

test("fuera de horario se APENDEA el aviso, no reemplaza la respuesta", () => {
  const state = createState({ channel: "sim", contactRef: "nocturno" });
  const result = step(state, { text: "DEMO", receivedAt: "2026-07-28T03:30:00Z" }, { config: CONFIG });
  assert.deepEqual(keysOf(result), ["M0"]);
  assert.match(result.replies[0].text, /¿Cuál te va mejor\?/);
  assert.match(result.replies[0].text, /fuera de horario de atención/);
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
  const { state } = run(["DEMO", "tengo una ferreteria"]);
  assert.equal(followUpDue(state, at(60), CONFIG), false, "a la hora todavia no");
  const first = buildFollowUp(state, "2026-07-28T12:10:00Z", CONFIG);
  assert.ok(first, "22 h despues corresponde");
  assert.equal(first.reply.templateKey, "M3");
  assert.equal(first.nextState.followupStep, 1);
  assert.equal(buildFollowUp(first.nextState, "2026-07-29T12:10:00Z", CONFIG), null, "N7: uno y nada mas");
});

test("no hay follow-up si hubo opt-out o si un humano tomo la conversacion", () => {
  const { state } = run(["DEMO", "tengo una ferreteria"]);
  assert.equal(followUpDue({ ...state, optOutAt: at(4) }, "2026-07-28T12:10:00Z", CONFIG), false);
  assert.equal(followUpDue(markHumanTakeover(state), "2026-07-28T12:10:00Z", CONFIG), false);
});

// El M3 dice "dos opciones NUEVAS", y el rescate sale un dia DESPUES del turno que guardo los
// horarios: para entonces el generador (`scripts/loops/renovar-slots-bot.py`) ya publico otros y
// los de la conversacion pueden estar vencidos. El barrido ya decide MANDAR mirando los vigentes
// (`blocked = slotsPending(config)`, followup-run.mjs), asi que leer el texto del estado es el
// mismo hecho con dos fuentes — y la que escribe es la que no se re-mide.
//
// Medido contra produccion el 2026-09-18 19:17 UTC, con un desconocido real esperando
// (`chatwoot:58`): `bash /opt/onia/bot/followup-run.sh --dry-run --now ... --json` ofrecia
// "sábado 19 de septiembre, 09:00" con `ONIA_BOT_SLOTS` trayendo el de las 14:00 de ese dia — un
// horario que Sergio NO tiene reservado y que ademas quedaba a 17,7 h, debajo de las 24 h que el
// propio motor exige y que la coletilla del mismo mensaje promete.
test("el rescate ofrece los horarios VIGENTES, no los que la conversacion guardo el dia que nacio", () => {
  const { state } = run(["DEMO", "tengo una ferreteria"]);
  // Lo que el prospecto vio ayer. El de las 09:00 ya no lo publica nadie.
  const viejos = [
    { key: "A", label: "sábado 09:00", startAt: "2026-07-29T13:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ];
  const built = buildFollowUp({ ...state, slotsOffered: viejos }, "2026-07-28T12:10:00Z", CONFIG);
  assert.ok(built, "22 h despues corresponde");

  const vigentes = CONFIG.slots.map((slot) => slot.label);
  for (const label of vigentes) {
    assert.ok(built.reply.text.includes(label), `el M3 tiene que ofrecer el vigente "${label}"`);
  }
  assert.ok(
    !built.reply.text.includes("sábado 09:00"),
    "el M3 no puede ofrecer un horario que el generador ya no publica",
  );

  // La otra mitad, y sin ella el arreglo es peor que el bug: el prospecto contesta "A" y el motor
  // tiene que reservar el horario que ACABA de ofrecer, no el que la fila traia.
  assert.deepEqual(
    (built.nextState.slotsOffered || []).map((slot) => slot.label),
    vigentes,
    "el estado que se persiste guarda los horarios que el M3 puso sobre la mesa",
  );
});

test("mismo estado + mismo mensaje = misma salida (sin Date.now ni Math.random)", () => {
  const turns = ["DEMO", "tengo una ferreteria, somos 5, santa cruz", "B", "los cobros"];
  const a = run(turns);
  const b = run(turns);
  assert.deepEqual(JSON.parse(JSON.stringify(a.turns)), JSON.parse(JSON.stringify(b.turns)));
  assert.deepEqual(a.state, b.state);
});

test("el motor no escribe en la base: solo devuelve efectos declarativos", () => {
  const { turns } = run(["DEMO", "tengo una ferreteria, somos 5, santa cruz", "A"]);
  const tipos = new Set(turns.flatMap(effectsOf));
  for (const tipo of tipos) {
    assert.ok(
      ["stage_change", "lead_upsert", "calendar_event", "notify_sergio", "review_queue", "audit_log", "llm_request"].includes(tipo),
      `efecto inesperado: ${tipo}`,
    );
  }
});

// ---------------------------------------------------------------------------
// 8. MODO RECEPCIONISTA — el bot de un CLIENTE (guion "recepcionista-ferreteria")
// ---------------------------------------------------------------------------
// La config es la MISMA que arma withKnowledge cuando el conocimiento llega de la fuente "db":
// applyKnowledge(config, data) + asRecepcionista. El funnel de venta de Onia (DEMO, M0, M4)
// tiene que quedar EXCLUSIVO del modo venta, y el recepcionista solo puede decir hechos del
// knowledge de su org.

const CONOCIMIENTO_FERRETERIA = {
  schema: "onia.bot.knowledge/1",
  version: "test-recepcionista",
  identity: {
    productName: "Ferretería El Tornillo",
    humanName: "doña Marta",
    botName: "el asistente de Ferretería El Tornillo",
  },
  empresa: { horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 19, frase: "lun-sab, 8:00-19:00" } },
  demo: { duracionMinutos: 20, duracionFrase: "20 minutos", modalidad: "visita en la tienda" },
  productos: [
    { key: "tornilleria", tipo: "servicio", nombre: "tornillería al por mayor y menor" },
    { key: "herramientas", tipo: "servicio", nombre: "herramientas eléctricas y manuales" },
  ],
};

// Se arma sobre CONFIG (que trae los slots de demo de prueba) A PROPOSITO: si un horario de
// demo se filtrara en una respuesta del recepcionista, estos tests lo ven.
const CONFIG_FERRETERIA = asRecepcionista(applyKnowledge(CONFIG, CONOCIMIENTO_FERRETERIA), CONOCIMIENTO_FERRETERIA);

const runRecep = (turns, options = {}) => run(turns, { config: CONFIG_FERRETERIA, ...options });

test("recepcionista: el knowledge del guion es una fila publicable real (pasa el validador)", () => {
  assert.deepEqual(validateKnowledge(CONOCIMIENTO_FERRETERIA).errors, []);
});

test("recepcionista: 'hola' se presenta como el asistente DEL negocio, cero pitch de Onia", () => {
  const { state, turns } = runRecep(["hola"]);
  assert.deepEqual(keysOf(turns[0]), ["M0R"]);
  const text = textOf(turns[0]);
  assert.match(text, /asistente de Ferretería El Tornillo/);
  assert.match(text, /doña Marta/);
  assert.ok(!/plataforma por módulos/i.test(text), "cero pitch de Onia");
  assert.ok(!/demo/i.test(text), "el funnel de venta no aparece");
  assert.ok(!/jueves 15:00|viernes 10:00/.test(text), "cero horarios de demo");
  assert.equal(state.botStage, "nuevo", "sin etapa nueva: bot_stage tiene CHECK en la base");
  assert.equal(state.optInSource, "inbound_recepcion", "el primer inbound es el opt-in del contacto");
});

test("recepcionista: el horario sale del knowledge de la org (y la 1ra respuesta se presenta, D2)", () => {
  const { turns } = runRecep(["¿qué días atienden?"]);
  assert.deepEqual(keysOf(turns[0]), ["M0R_INTRO", "R_HORARIO"]);
  const text = textOf(turns[0]);
  assert.match(text, /asistente de Ferretería El Tornillo/, "primer contacto: se declara bot del negocio");
  assert.match(text, /lun-sab, 8:00-19:00/);
  assert.ok(!/lun-vie, 9:00-18:00/.test(text), "no es el horario de Onia");
});

test("recepcionista: '¿qué venden?' contesta el catálogo de la org, sin la vara de módulos de Onia", () => {
  const { turns } = runRecep(["hola", "¿qué venden?"]);
  assert.deepEqual(keysOf(turns[1]), ["R_SERVICIOS"]);
  const text = textOf(turns[1]);
  assert.match(text, /tornillería al por mayor y menor/);
  assert.match(text, /herramientas eléctricas y manuales/);
  assert.ok(!/en construcción|sin humo/.test(text), "MODULOS_LISTOS es un candado de Onia, no del cliente");
  assert.ok(!/Dental|Importadora/.test(text), "y no aparece el catálogo de Onia");
});

test("recepcionista: 'quiero comprar 100 tornillos' escala a humano — el bot no vende ni agenda solo", () => {
  const { state, turns } = runRecep(["hola", "quiero comprar 100 tornillos"]);
  assert.deepEqual(keysOf(turns[1]), ["R_INTERES"]);
  assert.match(textOf(turns[1]), /doña Marta/);
  assert.equal(state.botStage, "handoff_humano");
  assert.ok(effectsOf(turns[1]).includes("review_queue"), "el pedido entra a la cola de revisión");
  assert.ok(effectsOf(turns[1]).includes("notify_sergio"), "y alguien se entera de verdad");
  assert.ok(turns[1].notes.includes("handoff:pedido_del_cliente"));

  // Con el handoff en curso, el bot no habla encima del humano del negocio.
  const luego = run(["¿me confirmás?"], { config: CONFIG_FERRETERIA, state });
  assert.equal(luego.turns[0].replies.length, 0);
  assert.deepEqual(luego.turns[0].notes, ["silencio:handoff_en_curso"]);
});

// ---------------------------------------------------------------------------
// 8a. AGENDAR — el bot manda el LINK de reserva de la org (no deriva a un humano)
// ---------------------------------------------------------------------------
// Vendemos el chatbot como "contesta, califica, agenda" (pricing.ts) y hasta hoy el motor
// hacia lo contrario: toda intencion de cita terminaba en un handoff. La agenda publica de
// la org YA existe y crea citas reales (/book/<slug>), asi que agendar es MANDAR ese link.
// Fail-closed en las dos direcciones: sin slug se deriva como siempre (jamas un link roto),
// y una intencion de COMPRA sigue escalando aunque la org tenga agenda.

const SLUG_FERRETERIA = "ferreteria-el-tornillo-ab123";
const CONFIG_FERRETERIA_AGENDA = asRecepcionista(
  applyKnowledge(CONFIG, CONOCIMIENTO_FERRETERIA),
  CONOCIMIENTO_FERRETERIA,
  SLUG_FERRETERIA,
);
const runAgenda = (turns, options = {}) => run(turns, { config: CONFIG_FERRETERIA_AGENDA, ...options });

test("recepcionista: con slug, 'quiero agendar una cita' manda el link de reserva de ESA org", () => {
  const { state, turns } = runAgenda(["hola", "quiero agendar una cita"]);
  assert.deepEqual(keysOf(turns[1]), ["R_AGENDA"]);
  const text = textOf(turns[1]);
  assert.match(text, /https:\/\/app\.onia\.com\.bo\/book\/ferreteria-el-tornillo-ab123/, "el link es el de la org, no uno generico");
  assert.ok(!/\/book\/undefined|\/book\/null/.test(text), "nunca un link roto");
  assert.equal(state.botStage, "nuevo", "agendar SOLO ya no molesta a un humano: no hay handoff");
  assert.ok(!effectsOf(turns[1]).includes("review_queue"), "y no entra a la cola de revision");
  assert.ok(turns[1].notes.includes("agenda:link_reserva"));
});

test("recepcionista: SIN slug la misma frase deriva como antes — fail-closed, nunca un link roto", () => {
  const { state, turns } = runRecep(["hola", "quiero agendar una cita"]);
  assert.deepEqual(keysOf(turns[1]), ["R_INTERES"]);
  assert.ok(!/app\.onia\.com\.bo|\/book\//.test(textOf(turns[1])), "sin slug no se inventa ningun link");
  assert.equal(state.botStage, "handoff_humano");
  assert.ok(turns[1].notes.includes("handoff:pedido_del_cliente"));
});

test("recepcionista: un slug que no pasa el validador se trata como si no hubiera — deriva", () => {
  const roto = asRecepcionista(applyKnowledge(CONFIG, CONOCIMIENTO_FERRETERIA), CONOCIMIENTO_FERRETERIA, "el tornillo/../admin");
  const { turns } = run(["hola", "quiero agendar una cita"], { config: roto });
  assert.deepEqual(keysOf(turns[1]), ["R_INTERES"]);
  assert.ok(!/app\.onia\.com\.bo/.test(textOf(turns[1])));
});

test("recepcionista: con agenda encendida, 'quiero comprar 100 tornillos' SIGUE escalando a humano", () => {
  const { state, turns } = runAgenda(["hola", "quiero comprar 100 tornillos"]);
  assert.deepEqual(keysOf(turns[1]), ["R_INTERES"], "un pedido no es una cita: el link no se lo puede tragar");
  assert.equal(state.botStage, "handoff_humano");
  assert.ok(effectsOf(turns[1]).includes("review_queue"));
});

test("recepcionista: '¿cuánto dura la cita?' sigue siendo INFO — pregunta, no reserva", () => {
  const { turns } = runAgenda(["hola", "¿cuánto dura la cita?"]);
  assert.deepEqual(keysOf(turns[1]), ["R_CITA"], "preguntar por la cita no dispara el link");
});

test("recepcionista: pregunta de precio deriva a humano SIN cotizar (jamás el M4 del funnel)", () => {
  const { state, turns } = runRecep(["hola", "¿cuánto cuestan los tornillos?"]);
  assert.deepEqual(keysOf(turns[1]), ["R_PRECIO"]);
  const text = textOf(turns[1]);
  assert.ok(!/\d/.test(text), "N1: ni una cifra");
  assert.match(text, /doña Marta/);
  assert.ok(!/en la demo/.test(text), "no es la respuesta de venta de Onia");
  assert.equal(state.botStage, "handoff_humano");
});

test("recepcionista: si el knowledge no trae el dato, respuesta honesta + humano — nunca los datos de Onia", () => {
  const { empresa, ...sinHorario } = CONOCIMIENTO_FERRETERIA;
  const config = asRecepcionista(applyKnowledge(CONFIG, sinHorario), sinHorario);
  const { state, turns } = run(["hola", "¿qué días atienden?"], { config });
  assert.deepEqual(keysOf(turns[1]), ["R_NO_DATO"]);
  assert.ok(!/lun-vie, 9:00-18:00/.test(textOf(turns[1])), "no rellena con el horario de Onia");
  assert.match(textOf(turns[1]), /doña Marta/);
  assert.equal(state.botStage, "handoff_humano", "la promesa 'te lo confirma' lleva el handoff real");
});

test("recepcionista: 'DEMO' NO dispara el funnel — el guion de leads queda exclusivo del modo venta", () => {
  const { state, turns } = runRecep(["DEMO"]);
  assert.ok(!keysOf(turns[0]).includes("M0"), "la bienvenida del funnel no aparece");
  assert.ok(!/jueves 15:00|viernes 10:00/.test(textOf(turns[0])), "cero horarios de demo");
  assert.notEqual(state.botStage, "esperando_horario");

  // La MISMA entrada con la config de venta sigue abriendo el funnel (cero regresión).
  const venta = run(["DEMO"]);
  assert.deepEqual(keysOf(venta.turns[0]), ["M0"]);
  assert.equal(venta.state.botStage, "esperando_horario");
});

test("recepcionista: opt-out corta sin invitar al funnel, y ni 'DEMO' reabre", () => {
  const { state, turns } = runRecep(["hola", "no me interesa, no me escribas más", "DEMO"]);
  assert.deepEqual(keysOf(turns[1]), ["M6R"]);
  assert.ok(!/DEMO/.test(textOf(turns[1])), "no ofrece la reapertura del guion de venta");
  assert.equal(turns[2].replies.length, 0, "silencio: la reapertura por DEMO es del funnel");
  assert.equal(state.botStage, "opt_out");
});

test("recepcionista: SIN LLM — lo fuera de guion va al humano, nunca a la rama libre", () => {
  const { state, turns } = runRecep(["hola", "che y ustedes hacen envios a domicilio en moto?"]);
  assert.deepEqual(keysOf(turns[1]), ["R_DERIVA"]);
  assert.equal(state.botStage, "handoff_humano");
  for (const turno of turns) {
    assert.ok(turno.replies.every((reply) => reply.replySource !== "llm" && !reply.pending), "cero rama LLM");
    assert.ok(!effectsOf(turno).includes("llm_request"));
  }
});

test("recepcionista: 'gracias' no molesta a nadie", () => {
  const { turns } = runRecep(["hola", "gracias!"]);
  assert.equal(turns[1].replies.length, 0);
  assert.ok(turns[1].notes.includes("cortesia_sin_respuesta"));
});

test("recepcionista: '¿cuánto dura la cita?' contesta duración/modalidad del knowledge — es info, no reserva", () => {
  const { state, turns } = runRecep(["hola", "¿cuánto dura la cita?"]);
  assert.deepEqual(keysOf(turns[1]), ["R_CITA"]);
  assert.match(textOf(turns[1]), /20 minutos/);
  assert.match(textOf(turns[1]), /visita en la tienda/);
  assert.equal(state.botStage, "nuevo", "preguntar no escala: sigue atendiendo");

  // Sin el bloque `demo` en el knowledge: honesto + humano, no los 30 minutos de la demo de Onia.
  const { demo, ...sinCita } = CONOCIMIENTO_FERRETERIA;
  const config = asRecepcionista(applyKnowledge(CONFIG, sinCita), sinCita);
  const otra = run(["hola", "¿cuánto dura la cita?"], { config });
  assert.deepEqual(keysOf(otra.turns[1]), ["R_NO_DATO"]);
  assert.ok(!/30 minutos/.test(textOf(otra.turns[1])), "no inventa la duración de la demo de Onia");
});

// ---------------------------------------------------------------------------
// 8b. BOTONES del recepcionista (Chatwoot input_select -> reply buttons de WhatsApp)
// ---------------------------------------------------------------------------
// Un solo formato para los dos canales (PR #6886 de Chatwoot): por eso el tope de 3 opciones y
// 20 caracteres por título son de Meta y se verifican acá, no en el adapter.

test("recepcionista: el saludo M0R sale con el menú de 3 botones (títulos ≤20 chars)", () => {
  const { turns } = runRecep(["hola"]);
  const options = turns[0].replies[0].options;
  assert.ok(Array.isArray(options), "M0R lleva options para el input_select");
  assert.equal(options.length, 3, "reply buttons de WhatsApp: máximo 3");
  // "Hablar con doña Marta" mide 21: NO entra en el límite de Meta y cae al genérico entero
  // (nunca un título truncado a la vista del cliente).
  assert.deepEqual(
    options.map((option) => option.title),
    ["Horarios", "Servicios", "Hablar con alguien"],
  );
  assert.ok(options.every((option) => option.title.length <= 20), "límite de título de Meta");
  assert.ok(options.every((option) => option.value), "cada botón lleva su payload estable");
});

test("recepcionista: con un nombre corto el 3er botón SÍ nombra al humano", () => {
  const conocimiento = { ...CONOCIMIENTO_FERRETERIA, identity: { ...CONOCIMIENTO_FERRETERIA.identity, humanName: "Sergio" } };
  const config = asRecepcionista(applyKnowledge(CONFIG, conocimiento), conocimiento);
  const { turns } = run(["hola"], { config });
  assert.equal(turns[0].replies[0].options[2].title, "Hablar con Sergio");
});

test("recepcionista: click 'Horarios' (el título llega como texto del mensaje) contesta el horario", () => {
  const { state, turns } = runRecep(["hola", "Horarios"]);
  assert.deepEqual(keysOf(turns[1]), ["R_HORARIO"]);
  assert.match(textOf(turns[1]), /lun-sab, 8:00-19:00/);
  assert.equal(state.botStage, "nuevo", "una FAQ no escala");
});

test("recepcionista: click 'Servicios' contesta el catálogo; el 3er botón deriva a humano", () => {
  const servicios = runRecep(["hola", "Servicios"]);
  assert.deepEqual(keysOf(servicios.turns[1]), ["R_SERVICIOS"]);
  assert.match(textOf(servicios.turns[1]), /tornillería al por mayor y menor/);

  const humano = runRecep(["hola", "Hablar con alguien"]);
  assert.deepEqual(keysOf(humano.turns[1]), ["R_DERIVA"]);
  assert.equal(humano.state.botStage, "handoff_humano");
  assert.ok(effectsOf(humano.turns[1]).includes("notify_sergio"), "el handoff del botón es real");
});

test("recepcionista: R_DERIVA sale CON botones (menú de rescate); R_INTERES y R_PRECIO no", () => {
  const deriva = runRecep(["hola", "che y hacen envíos a domicilio en moto?"]);
  const reply = deriva.turns[1].replies.find((r) => r.templateKey === "R_DERIVA");
  assert.equal(reply.options.length, 3, "el fuera de guion deja el menú a la vista");

  const interes = runRecep(["hola", "quiero comprar 100 tornillos"]);
  assert.ok(interes.turns[1].replies.every((r) => !r.options), "solo M0R y R_DERIVA llevan botones");
  const precio = runRecep(["hola", "¿cuánto cuestan los tornillos?"]);
  assert.ok(precio.turns[1].replies.every((r) => !r.options));
});

test("recepcionista: en handoff, el click EXACTO de un botón contesta la FAQ sin salir del handoff; texto libre sigue mudo", () => {
  // R_DERIVA dejó los botones a la vista: clickearlos después del handoff no puede dar silencio.
  const { state } = runRecep(["hola", "che y hacen envíos a domicilio en moto?"]);
  assert.equal(state.botStage, "handoff_humano");

  const click = run(["Horarios"], { config: CONFIG_FERRETERIA, state });
  assert.deepEqual(keysOf(click.turns[0]), ["R_HORARIO"]);
  assert.equal(click.state.botStage, "handoff_humano", "no sale del handoff: el humano sigue a cargo");
  assert.deepEqual(click.turns[0].sideEffects, [], "solo lectura: cero efectos nuevos");

  // El PRIMER texto libre tras el handoff ahora se acusa (ver el test de abajo); del SEGUNDO en
  // adelante sí es silencio. Se encadenan los dos turnos para llegar a ese segundo.
  const acuse = run(["y entonces? me contestan?"], { config: CONFIG_FERRETERIA, state });
  const libre = run(["hola?"], { config: CONFIG_FERRETERIA, state: acuse.state });
  assert.equal(libre.turns[0].replies.length, 0, "texto libre en handoff: silencio, como siempre");
  assert.deepEqual(libre.turns[0].notes, ["silencio:handoff_en_curso"]);
});

test("handoff sin humano: el PRIMER mensaje que llega despues de derivar se ACUSA, no se tira al vacio", () => {
  // POR QUE ESTE TEST. Medido en produccion el 2026-09-03 sobre la conversacion 49 (inbox 4, el
  // del widget de la web): Chatwoot ENTREGO el mensaje 287 y el bot lo proceso 4,08 s — o sea
  // que no estaba caido, corrio el turno entero y no produjo NADA. La correlacion es perfecta
  // en las 8 corridas horarias de la sonda: cada vez que el bot contesto M5 ("eso lo tiene que
  // ver Sergio"), el mensaje SIGUIENTE del prospecto se comio un silencio total.
  //
  // `handoff_humano` NO significa que un humano haya llegado: significa que el BOT decidio
  // derivar. El candado legitimo es `humanTookOver`, que se enciende cuando un humano CONTESTA
  // de verdad. Confundirlos deja a la persona escribiendole a la nada — y el test de arriba
  // exigia justamente ese silencio, asi que el bug estaba blindado por su propia suite.
  // Modo VENTA a proposito: es el de los inboxes 4 y 5, por donde entra todo desconocido, y el
  // que se midio roto. El recepcionista tiene su propio modulo y su propia rama.
  const { state: derivado } = run(["DEMO", "quiero que me atienda una persona de verdad"]);
  const state = derivado.botStage === "handoff_humano" ? derivado : { ...derivado, botStage: "handoff_humano", handoffAckAt: null };
  assert.equal(state.humanTookOver, false, "nadie contesto todavia: el handoff es una decision del bot");

  const primero = run(["ahi te mando la direccion, es Equipetrol"], { state });
  assert.equal(primero.turns[0].replies.length, 1, "el primer mensaje tras derivar NO puede quedar sin respuesta");
  assert.equal(primero.state.botStage, "handoff_humano", "acusar recibo no saca la conversacion del handoff");
  assert.deepEqual(primero.turns[0].sideEffects, [], "solo acuse: no se re-dispara el aviso ni la cola de revision");

  // Y UNA sola vez: acusar cada mensaje convertiria el acuse en spam.
  const segundo = run(["hola? sigue ahi?"], { state: primero.state });
  assert.equal(segundo.turns[0].replies.length, 0, "del segundo en adelante sí es silencio");
  assert.deepEqual(segundo.turns[0].notes, ["silencio:handoff_en_curso"]);
});

test("handoff CON humano a cargo: silencio desde el primer mensaje — el acuse no puede pisar a Sergio", () => {
  // La otra mitad de la regla. Si un humano YA contesto, hablar encima es peor que callarse: el
  // prospecto ve al bot interrumpiendo a la persona con la que ya esta hablando.
  const { state: derivado } = run(["DEMO", "quiero que me atienda una persona de verdad"]);
  const conHumano = { ...derivado, botStage: "handoff_humano", handoffAckAt: null, humanTookOver: true };

  const turno = run(["gracias!"], { state: conHumano });
  assert.equal(turno.turns[0].replies.length, 0, "con humano a cargo, ni siquiera el acuse");
  assert.deepEqual(turno.turns[0].notes, ["silencio:humano_a_cargo"]);
});

test("venta: el funnel de Onia NO lleva botones — M0 sale plano como siempre", () => {
  const venta = run(["DEMO"]);
  assert.ok(venta.turns[0].replies.every((reply) => !reply.options));
});

// ---------------------------------------------------------------------------
// 8.b FAQ DEL NEGOCIO (id "negocio") — la unica FAQ editable por el dueño.
// ---------------------------------------------------------------------------
// Decision Sergio 2026-08-28: el dueño carga preguntas frecuentes CON control de
// calidad: guardrails sobre cada texto (sin precios, sin promesas, sin fingir
// humano), todo-o-nada al publicar, vigencia, y sin palabras disparadoras la
// publicacion se RECHAZA (una FAQ que nunca se sirve es una edicion que no hace
// nada). Los candados del guion (precio -> humano) le GANAN siempre a la FAQ.

const CONOCIMIENTO_CON_FAQ = {
  ...CONOCIMIENTO_FERRETERIA,
  faq: [
    {
      id: "negocio",
      title: "Garantía",
      body: "Todo producto tiene garantía de fábrica. Traé tu factura y doña Marta lo revisa.",
      status: "publicado",
      tags: ["garantia", "devolucion", "cambio de producto"],
    },
  ],
};

const CONFIG_CON_FAQ = asRecepcionista(applyKnowledge(CONFIG, CONOCIMIENTO_CON_FAQ), CONOCIMIENTO_CON_FAQ);
const runFaq = (turns, options = {}) => run(turns, { config: CONFIG_CON_FAQ, ...options });

test("faq negocio: el knowledge con la FAQ es una fila publicable real", () => {
  assert.deepEqual(validateKnowledge(CONOCIMIENTO_CON_FAQ).errors, []);
});

test("faq negocio: contesta por su palabra disparadora, sin handoff", () => {
  const { state, turns } = runFaq(["hola", "¿tienen garantía?"]);
  const text = textOf(turns[1]);
  assert.match(text, /garantía de fábrica/);
  assert.equal(state.botStage, "nuevo", "una FAQ contestada no abre handoff");
});

test("faq negocio: matchea palabra entera, no pedazos ('cambio de producto' no salta con 'cambiaron')", () => {
  const { turns } = runFaq(["hola", "¿cambiaron de local?"]);
  const text = textOf(turns[1]);
  assert.ok(!/garantía de fábrica/.test(text), "un pedazo de palabra no dispara la FAQ");
});

test("faq negocio: el candado de precio le GANA a la FAQ", () => {
  const { state, turns } = runFaq(["hola", "¿cuánto cuesta la garantía?"]);
  const text = textOf(turns[1]);
  assert.ok(!/garantía de fábrica/.test(text), "la FAQ no contesta preguntas de plata");
  assert.equal(state.botStage, "handoff_humano", "el precio siempre va al humano");
});

test("faq negocio: en borrador NO se sirve (deriva fuera de guion)", () => {
  const conBorrador = {
    ...CONOCIMIENTO_CON_FAQ,
    faq: [{ ...CONOCIMIENTO_CON_FAQ.faq[0], status: "borrador" }],
  };
  const config = asRecepcionista(applyKnowledge(CONFIG, conBorrador), conBorrador);
  const { state, turns } = run(["hola", "¿tienen garantía?"], { config });
  assert.ok(!/garantía de fábrica/.test(textOf(turns[1])), "un borrador no llega al cliente");
  assert.equal(state.botStage, "handoff_humano", "sin FAQ vigente, fuera de guion deriva");
});

test("faq negocio: vencida NO se sirve", () => {
  const vencida = {
    ...CONOCIMIENTO_CON_FAQ,
    faq: [{ ...CONOCIMIENTO_CON_FAQ.faq[0], vigenteHasta: "2020-01-01" }],
  };
  const config = asRecepcionista(applyKnowledge(CONFIG, vencida), vencida);
  const { turns } = run(["hola", "¿tienen garantía?"], { config });
  assert.ok(!/garantía de fábrica/.test(textOf(turns[1])), "una FAQ vencida afirmaría algo que ya no es cierto");
});

test("faq negocio: SIN tags el documento entero se rechaza (control de calidad)", () => {
  const sinTags = {
    ...CONOCIMIENTO_CON_FAQ,
    faq: [{ id: "negocio", title: "Garantía", body: "Texto.", status: "publicado" }],
  };
  const { errors } = validateKnowledge(sinTags);
  assert.ok(errors.length > 0, "una FAQ sin disparador nunca se sirve: se rechaza al publicar");
});

test("faq negocio: un body con precio lo rechaza el guardrail entero", () => {
  const conPrecio = {
    ...CONOCIMIENTO_CON_FAQ,
    faq: [{ id: "negocio", title: "Precios", body: "La consulta cuesta 50 bs.", status: "publicado", tags: ["consulta"] }],
  };
  const { errors } = validateKnowledge(conPrecio);
  assert.ok(errors.some((e) => e.includes("declara_precio")), "el bot no cotiza ni via FAQ");
});

// ---------------------------------------------------------------------------
// Frases de campaña en el MODO VENTA — los links wa.me?text= de onia.com.bo
// ---------------------------------------------------------------------------
// onia.com.bo manda al +591 75414930 cuatro frases fijas distintas, una por CTA. Cada una es una
// intencion ya declarada: la persona dijo que queria ANTES de escribir. `campanaExacta` existia
// desde el 31-ago pero vivia SOLO dentro de recepcionistaStep, o sea que el numero de Onia —que
// corre en modo venta— jamas podia mirarlas: contestaba el saludo generico a las cuatro.
//
// El arreglo NO puede ser mover el numero de Onia a modo recepcionista: ahi el guion de leads no
// existe (ver el test "el guion de leads queda exclusivo del modo venta"), asi que se cambiaria la
// unica linea que produce leads por un texto enlatado. La respuesta de campaña va DETRAS de la
// bienvenida, por el mismo camino que ya usan precio y SIAT (composeWithFunnel).

const CAMPANAS_ONIA = [
  {
    frase: "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio.",
    respuesta: "Te sirve si tu negocio agenda, cobra o atiende clientes. Contame a qué te dedicás y te digo qué módulo te toca.",
  },
  {
    frase: "Hola, vengo de la página del chatbot de Onia. Tengo una consulta antes de elegir el stack.",
    respuesta: "Dale, preguntá lo que quieras del chatbot antes de decidir.",
  },
];
const CONFIG_CAMPANA = createBotConfig({ campanas: CAMPANAS_ONIA }, CONFIG);
const runCampana = (turns, options = {}) => run(turns, { config: CONFIG_CAMPANA, ...options });

test("campaña en venta: la frase del link se contesta con SU respuesta, detrás de la bienvenida", () => {
  const { turns } = runCampana([CAMPANAS_ONIA[0].frase]);
  assert.deepEqual(keysOf(turns[0]), ["M0", "R_CAMPANA"], "primero el bot se declara bot (D2), después lo suyo");
  assert.match(textOf(turns[0]), /Contame a qué te dedicás y te digo qué módulo te toca/);
});

test("campaña en venta: cada CTA recibe LO SUYO, no la respuesta de la otra", () => {
  const { turns } = runCampana([CAMPANAS_ONIA[1].frase]);
  assert.match(textOf(turns[0]), /preguntá lo que quieras del chatbot/);
  assert.ok(!/qué módulo te toca/.test(textOf(turns[0])), "no se cruzan las campañas");
});

// El CTA de /v1/empezar precarga un texto ABIERTO y la persona escribe su rubro atras, asi que
// nunca puede ser match exacto. Medido en el motor el 31-ago, "…Mi negocio es: panaderia" salia
// M0 pelado: quien MAS declaro (su rubro, y que no esta en la lista) recibia lo mismo que "hola".
const CAMPANA_PREFIJO = {
  frase: "Hola, mi rubro no está en la lista de Onia. Mi negocio es: ",
  prefijo: true,
  respuesta: "Que tu rubro no esté en la lista no lo deja afuera: contame qué hacés.",
};
const CONFIG_PREFIJO = createBotConfig({ campanas: [...CAMPANAS_ONIA, CAMPANA_PREFIJO] }, CONFIG);

test("campaña de PREFIJO en venta: contesta LO SUYO aunque la persona siga escribiendo, y el lead nace igual", () => {
  const { turns } = run([CAMPANA_PREFIJO.frase + "panadería"], { config: CONFIG_PREFIJO });
  assert.deepEqual(keysOf(turns[0]), ["M0", "R_CAMPANA"], "primero el bot se declara bot (D2), después lo suyo");
  assert.match(textOf(turns[0]), /no lo deja afuera/);
  assert.ok(effectsOf(turns[0]).includes("lead_upsert"), "el lead nace igual que sin campaña");
});

test("campaña de PREFIJO en venta: NO se come a la campaña de match exacto que empieza parecido", () => {
  const { turns } = run([CAMPANAS_ONIA[0].frase], { config: CONFIG_PREFIJO });
  assert.match(textOf(turns[0]), /qué módulo te toca/, "el match exacto le gana al prefijo");
});

test("campaña en venta: NO se pierde el lead — es la única línea que los produce", () => {
  const { state, turns } = runCampana([CAMPANAS_ONIA[0].frase]);
  assert.ok(effectsOf(turns[0]).includes("lead_upsert"), "el lead nace igual que sin campaña");
  assert.equal(state.botStage, "esperando_horario", "el embudo sigue su curso");
  assert.match(textOf(turns[0]), /jueves 15:00/, "la oferta de horarios sigue sobre la mesa");
});

test("campaña en venta: la puntuación no cuenta (el que clickea puede borrar la coma)", () => {
  const { turns } = runCampana(["hola vengo de la web de onia quiero saber si me sirve para mi negocio"]);
  assert.ok(keysOf(turns[0]).includes("R_CAMPANA"), "misma frase sin comas ni tildes = misma campaña");
});

test("campaña en venta: sin campañas publicadas el motor no cambia (cero regresión)", () => {
  const { turns } = run([CAMPANAS_ONIA[0].frase]);
  assert.deepEqual(keysOf(turns[0]), ["M0"], "la config de hoy contesta exactamente lo que contestaba");
});

test("campaña en venta: el opt-out le gana a la campaña", () => {
  const { turns } = runCampana(["no me interesa, no me escribas más", CAMPANAS_ONIA[0].frase]);
  assert.deepEqual(keysOf(turns[1]), [], "el que dijo basta no recibe la campaña");
});

test("applyKnowledge lleva las campañas al modo venta (sin ellas el motor no las puede ver)", () => {
  const doc = {
    schema: "onia.bot.knowledge/1",
    version: "test-campanas",
    campanas: [{ frase: "Hola, quiero conocer Onia", respuesta: "Contame a qué se dedica tu negocio." }],
  };
  assert.deepEqual(validateKnowledge(doc).errors, [], "el documento es publicable");
  const aplicado = applyKnowledge(CONFIG, doc);
  assert.deepEqual(aplicado.campanas, doc.campanas, "las campañas viajan a la config de venta");
});

// ---------------------------------------------------------------------------
// "¿EL SISTEMA HACE X?" — la pregunta mas comun de una preventa, y la unica que
// el router no sabia leer.
//
// Medido en produccion el 2026-09-03, conversacion 49 del widget (inbox 4), mensajes 339-340.
// El prospecto, ya en `esperando_horario`, escribio:
//
//   339 (entrante) "Antes de elegir horario, ¿el sistema manda recordatorios por WhatsApp
//                   a los pacientes?"
//   340 (saliente) "¿Querés que te reserve para el viernes 4 de septiembre a las 14:00 o
//                   para el sábado 5 a las 9:00? Contame qué día te queda mejor."
//
// La pregunta desaparecio. No hubo "no se", ni "lo ve Sergio": el bot la piso con la oferta de
// horario. Y no es que el motor se haya caido — la traza dice `rama: "respondio"`, o sea que
// para el sistema ese turno salio BIEN.
//
// La causa: `RE_PRODUCTO_DETALLE` era una lista blanca de SUSTANTIVOS tecnicos ("se integra con",
// "rayos x", "api", "offline"...). No cubria la forma en que la gente pregunta de verdad, que es
// SUJETO + VERBO: "¿el sistema manda...?", "¿la plataforma guarda...?", "¿Onia sirve para...?".
// Al no matchear ninguna intencion, caia en `offScriptResult`, cuya tarea al LLM es —textual—
// "reformular la pregunta pendiente del embudo, sin dar datos nuevos", con `forbidden:
// ["features", ...]`. O sea: el off-guion esta DISEÑADO para no contestar, y hace lo que debe.
// El agujero estaba un paso antes, en el router que nunca lo mando a handoff.
//
// El mensaje 341 de esa misma conversacion ("¿el sistema guarda la historia clínica?") SI salio
// bien — pero por casualidad: traia la palabra "clinica" y lo salvo `isClinicalOrLegal`. Dos
// preguntas del mismo tipo, una contestada y otra tragada, decidido por una palabra que no tiene
// nada que ver con lo que se preguntaba.
//
// El arreglo NO es que el bot conteste: es que falle del lado seguro, que es el que ya eligio
// `isProductDetail` ("el bot NO adivina, va a handoff"). Inventar capacidades seria peor.
// ---------------------------------------------------------------------------

test("PREGUNTA DE PRODUCTO en la rama de horarios: no se la traga la oferta de slots", () => {
  const { state, turns } = run([
    "DEMO",
    "Antes de elegir horario, ¿el sistema manda recordatorios por WhatsApp a los pacientes?",
  ]);
  assert.equal(state.botStage, "handoff_humano", "una pregunta de producto va a un humano, no al embudo");
  assert.ok(
    turns[1].notes.includes("handoff:detalle_tecnico_de_producto"),
    `motivo esperado; salio ${JSON.stringify(turns[1].notes)}`,
  );
  assert.ok(
    !/te reserve|que dia te queda mejor|elegi/i.test(textOf(turns[1])),
    "y sobre todo: NO le vuelve a ofrecer los horarios como si no hubiera preguntado nada",
  );
});

test("PREGUNTA DE PRODUCTO: las formas naturales, no solo el sustantivo tecnico", () => {
  for (const pregunta of [
    "¿el sistema manda recordatorios a los pacientes?",
    "¿la plataforma guarda la historia de cada cliente?",
    "¿Onia sirve para una veterinaria?",
    "¿el software controla el inventario?",
    "¿el sistema permite varias sucursales?",
  ]) {
    const { state } = run(["DEMO", pregunta]);
    assert.equal(state.botStage, "handoff_humano", `no derivo: ${pregunta}`);
  }

  // Y la frontera, que se midio en vez de suponerla: "¿el software emite facturas?" tambien
  // matchea esta regla, pero NO llega hasta aca — `isSiatQuestion` la agarra antes y tiene su
  // propia respuesta (M_SIAT_BODY). Facturacion es de la rama SIAT, no de "no se, preguntale a
  // Sergio": mandarla a handoff seria hacer PEOR una pregunta que hoy se contesta bien.
  const factura = run(["DEMO", "¿el software emite facturas?"]);
  assert.equal(factura.state.botStage, "esperando_horario", "la de facturas sigue en el embudo");
  assert.ok(factura.turns[1].notes.includes("pregunta_siat"), "y la contesta la rama SIAT");
});

test("PREGUNTA DE PRODUCTO no se come lo que ya tenia dueño: soporte, precio y calificacion", () => {
  // El orden del router es la baranda: lo especifico se juzga ANTES. Si esto se rompe, un
  // cliente con un problema termina en la rama de venta y un "cuanto sale" deja de contestarse.
  assert.equal(run(["DEMO", "ya soy cliente y el sistema no me anda"]).state.botStage, "handoff_humano");
  assert.deepEqual(keysOf(run(["DEMO", "ya soy cliente y el sistema no me anda"]).turns[1]), ["M8_SOPORTE"]);
  assert.equal(run(["DEMO", "ya tengo un sistema"]).state.botStage, "esperando_horario", "la objecion de venta sigue en el embudo");
  const precio = run(["DEMO", "¿cuanto sale el sistema al mes?"]);
  assert.ok(!precio.turns[1].notes.includes("handoff:detalle_tecnico_de_producto"), "precio tiene su propia rama");
});

// ---------------------------------------------------------------------------
// HORARIOS MIXTOS: uno sostenible y uno vencido
// ---------------------------------------------------------------------------
// Medido el 2026-09-05 06:03 La Paz con el simulador contra los horarios REALES de
// produccion (`ONIA_BOT_SLOTS` de /opt/onia/bot/webhook.env): el bot saludaba con
// "Justo ahora no tengo horarios libres para ofrecerte" y DOS turnos despues cerraba la
// respuesta de facturacion con "¿Te reservo **sábado 5 de septiembre, 09:00** o **lunes 7
// de septiembre, 14:00**?" — el sábado era ese mismo dia a 3 h, o sea la promesa que
// Sergio prohibio ("que se agenden un dia antes para tener tiempo de cancelar") y ademas
// contradiciendo lo que el mismo bot acababa de decir.
//
// La causa es que las dos ramas leen el MISMO flag con polaridad opuesta y hasta ayer eso
// no se notaba, porque `pending` era todo-o-nada (los dos placeholders de DEMO_SLOTS):
//   - bienvenida  -> `slotsPending()` = ALGUNO pending  -> M0_SIN_HORARIOS
//   - re-pregunta -> `hayHorarioReal()` = ALGUNO real   -> PENDING_HORARIO con las DOS etiquetas
// El corte por anticipacion (ANTICIPACION_MINIMA_MS, config.mjs) volvio `pending` un estado
// POR HORARIO, y ahi el desacuerdo salio a la superficie.
//
// La invariante que se fija: una etiqueta de horario `pending` NO puede llegar nunca al
// prospecto, por ninguna de las dos ramas. Es la misma familia de bug que ya mordio a este
// carril (un arreglo aplicado a una variante y no a su hermana), asi que se prueba el
// recorrido entero, no la funcion.
const CONFIG_MIXTO = createBotConfig({
  slots: [
    { key: "A", label: "sábado 5 de septiembre, 09:00", startAt: "2026-07-27T17:00:00Z", pending: true },
    { key: "B", label: "lunes 7 de septiembre, 14:00", startAt: "2026-07-29T18:00:00Z", pending: false },
  ],
});

test("HORARIO VENCIDO: la etiqueta del que ya no da un dia de aviso no sale por ninguna rama", () => {
  const { turns } = run(["Hola, quiero informacion", "¿me hace la facturacion del SIAT?"], { config: CONFIG_MIXTO });

  // La bienvenida ya se comporta: no ofrece horarios.
  assert.ok(keysOf(turns[0]).includes("M0_SIN_HORARIOS"), "la bienvenida no puede ofrecer horarios");

  // Y la re-pregunta del embudo tiene que decir lo MISMO. Aca es donde salia la contradiccion.
  const todo = turns.map(textOf).join("\n");
  assert.ok(
    !todo.includes("sábado 5 de septiembre, 09:00"),
    `se ofrecio un horario que no da un dia de aviso:\n${todo}`,
  );
});

// ---------------------------------------------------------------------------
// Conversacion VENCIDA (Barrera 0). El caso real: conv 11, 2026-09-10 — Sergio mando "hola"
// a su conversacion de pruebas del 15-ago (human_took_over desde el 13-ago) y el motor
// produjo CERO salida (rama=MUDO). Regla que fija esta seccion: ningun estado puede producir
// 0 mensajes ante un entrante real de un contacto en una conversacion sin actividad >N dias.
// La UNICA excepcion es el opt-out, que no caduca por tiempo (politica de Meta, M6).
// ---------------------------------------------------------------------------

const UN_MES_DESPUES = new Date(Date.parse(T0) + 30 * 86400000).toISOString();

test("CONV 11: takeover viejo + 'hola' un mes despues -> bienvenida, no silencio", () => {
  const viejo = markHumanTakeover(
    { ...createState({ channel: "chatwoot", contactRef: "11" }), botStage: "esperando_calificacion", lastInboundAt: T0, lastOutboundAt: T0 },
    T0,
  );
  const result = step(viejo, { text: "hola", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
  assert.ok(result.replies.length >= 1, "un entrante real en conversacion vencida NUNCA produce 0 mensajes");
  assert.deepEqual(keysOf({ replies: result.replies }), ["M0"], "arranca el guion desde el saludo");
  assert.equal(result.nextState.humanTookOver, false, "el candado de una charla muerta hace un mes no vale mas");
  assert.ok(result.notes.includes("reinicio:conversacion_vencida"), "el reinicio queda en la bitacora");
});

test("'hola' en CADA etapa con conversacion vencida -> SIEMPRE >=1 mensaje (menos opt_out)", () => {
  for (const stage of STAGES) {
    if (stage === "opt_out") continue;
    const state = { ...createState({ channel: "chatwoot", contactRef: "x" }), botStage: stage, lastInboundAt: T0, lastOutboundAt: T0 };
    const result = step(state, { text: "hola", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
    assert.ok(result.replies.length >= 1, `etapa ${stage}: el bot se quedo mudo ante un "hola" real`);
  }
});

test("handoff acusado y vencido tambien revive: el acuse de hace un mes no calla al que vuelve", () => {
  const state = {
    ...createState({ channel: "chatwoot", contactRef: "x" }),
    botStage: "handoff_humano",
    handoffAckAt: T0,
    lastInboundAt: T0,
    lastOutboundAt: T0,
  };
  const result = step(state, { text: "hola", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
  assert.ok(result.replies.length >= 1);
  assert.equal(result.nextState.handoffAckAt, null);
});

test("con actividad reciente NADA se reinicia: el takeover sigue mandando", () => {
  const taken = markHumanTakeover(
    { ...createState({ channel: "chatwoot", contactRef: "x" }), botStage: "esperando_horario", lastInboundAt: T0, lastOutboundAt: T0 },
    T0,
  );
  const result = step(taken, { text: "hola", receivedAt: at(60) }, { config: CONFIG });
  assert.equal(result.replies.length, 0, "el humano esta a cargo hace una hora, no hace un mes");
  assert.deepEqual(result.notes, ["silencio:humano_a_cargo"]);
});

test("el opt-out NO caduca por tiempo: 'hola' un mes despues sigue en silencio, DEMO reabre", () => {
  const state = {
    ...createState({ channel: "chatwoot", contactRef: "x" }),
    botStage: "opt_out",
    optOutAt: T0,
    lastInboundAt: T0,
    lastOutboundAt: T0,
  };
  const hola = step(state, { text: "hola", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
  assert.equal(hola.replies.length, 0, "a quien dijo basta no lo reabre el calendario");
  const demo = step(state, { text: "DEMO", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
  assert.ok(demo.replies.length >= 1, "el disparador DEMO sigue reabriendo, como dice M6");
});

test("un traspaso humano en conversacion vencida NO dispara la bienvenida encima del humano", () => {
  const taken = markHumanTakeover(
    { ...createState({ channel: "chatwoot", contactRef: "x" }), botStage: "esperando_horario", lastInboundAt: T0, lastOutboundAt: T0 },
    T0,
  );
  const result = step(taken, { text: "hola! te retomo lo del sistema", author: "human", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
  assert.equal(result.replies.length, 0, "el mensaje es DEL humano: el bot no se le mete en la charla");
  assert.equal(result.nextState.humanTookOver, true, "y el candado sigue puesto");
});

test("insistir a una conversacion muda NO rearma el reloj: el reloj es NUESTRO, no del prospecto", () => {
  // El caso real medido en la base el 10-sep: el "hola" MUDO ya habia actualizado
  // lastInboundAt a ese mismo dia. Si el reloj mirara esa marca, el bot no reviviria jamas
  // mientras la persona siga intentando.
  const insistio = markHumanTakeover(
    {
      ...createState({ channel: "chatwoot", contactRef: "11" }),
      botStage: "esperando_calificacion",
      lastInboundAt: new Date(Date.parse(UN_MES_DESPUES) - 60000).toISOString(), // escribio hace 1 min
      lastOutboundAt: T0, // lo nuestro: hace un mes
    },
    T0,
  );
  const result = step(insistio, { text: "hola", receivedAt: UN_MES_DESPUES }, { config: CONFIG });
  assert.ok(result.replies.length >= 1, "insistir tiene que REFORZAR el reinicio, no aplazarlo");
});

test("conversacionVencida: bordes deterministas", () => {
  const base = { ...createState({ channel: "chatwoot", contactRef: "x" }), botStage: "esperando_horario", lastInboundAt: T0, lastOutboundAt: T0 };
  assert.equal(conversacionVencida(base, UN_MES_DESPUES, CONFIG), true);
  assert.equal(conversacionVencida(base, at(60), CONFIG), false, "una hora no es un mes");
  assert.equal(conversacionVencida(base, null, CONFIG), false, "sin receivedAt no se juzga (determinismo)");
  assert.equal(conversacionVencida({ ...base, optOutAt: T0 }, UN_MES_DESPUES, CONFIG), false, "opt-out nunca vence");
  assert.equal(
    conversacionVencida({ ...base, lastOutboundAt: null }, UN_MES_DESPUES, CONFIG),
    true,
    "sin marcas nuestras cuenta desde el ultimo inbound (el bot nunca hablo y la charla es vieja)",
  );
  assert.equal(
    conversacionVencida({ ...base, lastInboundAt: null, lastOutboundAt: null }, UN_MES_DESPUES, CONFIG),
    false,
    "sin ninguna marca no hay desde cuando contar",
  );
  assert.equal(
    conversacionVencida({ ...base, lastInboundAt: T0, lastOutboundAt: new Date(Date.parse(UN_MES_DESPUES) - 3600000).toISOString() }, UN_MES_DESPUES, CONFIG),
    false,
    "nuestro lado hablo hace una hora: la charla esta viva aunque el prospecto haya callado un mes",
  );
  assert.equal(conversacionVencida({ ...base, botStage: "nuevo" }, UN_MES_DESPUES, CONFIG), false, "en 'nuevo' no hay nada que reiniciar");
});

// ---------------------------------------------------------------------------
// 3 de los 5 horarios libres eran inalcanzables y terminaban en la cola humana
// ---------------------------------------------------------------------------
// Contado en produccion el 2026-09-24, no heredado: `onia_center.bot_conversations` tiene 43
// conversaciones y 18 paradas en `esperando_horario`. El cron
// publica CINCO horarios por dia y el guion nombra dos ({{slot_a}} y {{slot_b}} caen en la
// misma frase); los otros tres quedaban fuera del array que mira `detectSlotChoice`, asi que
// quien elegia uno de ELLOS —nuestro, libre, y dentro de la franja que la coletilla del mismo
// mensaje le promete— caia en `proposesOwnTime` y se iba a la cola humana, que ese dia tenia
// leads esperando hace 15-20 dias.
//
// OFRECER sigue siendo de a dos. Lo que cambia es ACEPTAR.
const CONFIG_CINCO = createBotConfig({
  slots: [
    { key: "A", label: "viernes 25 de septiembre, 21:00", startAt: "2026-09-26T01:00:00Z", pending: false },
    { key: "B", label: "sábado 26 de septiembre, 09:00", startAt: "2026-09-26T13:00:00Z", pending: false },
  ],
  slotsElegibles: [
    { key: null, label: "lunes 28 de septiembre, 14:00", startAt: "2026-09-28T18:00:00Z", pending: false },
    { key: null, label: "martes 29 de septiembre, 14:00", startAt: "2026-09-29T18:00:00Z", pending: false },
  ],
});
const ESPERANDO = { ...createState({ channel: "sim", contactRef: "lead-real" }), botStage: "esperando_horario" };
const AHORA_CINCO = "2026-09-24T15:00:00Z";

test("elige un horario nuestro que el guion no nombro: se AGENDA, no se deriva a un humano", () => {
  const out = step(ESPERANDO, { text: "el lunes 28 a las 14:00", receivedAt: AHORA_CINCO }, { config: CONFIG_CINCO });

  assert.equal(out.nextState.botStage, "demo_agendada", "antes caia en handoff_humano con el horario libre");
  assert.equal(out.nextState.scheduledAt, "2026-09-28T18:00:00Z", "reserva el instante que eligio, no el de A");
  assert.equal(out.nextState.scheduledLabel, "lunes 28 de septiembre, 14:00");

  const evento = out.sideEffects.find((effect) => effect.type === "calendar_event");
  assert.ok(evento, "sin efecto de calendario no hay reserva: 'Listo, agendado' seria mentira");
  assert.equal(evento.payload.startAt, "2026-09-28T18:00:00Z");

  // La FOTO tiene que incluir al elegido y marcarlo. Se marcaba comparando `key`, y un horario
  // que no es A ni B no tiene letra: sin esto la conversacion quedaba guardada como si nadie
  // hubiera elegido nada.
  const marcados = (out.nextState.slotsOffered || []).filter((slot) => slot.chosen);
  assert.deepEqual(marcados.map((slot) => slot.label), ["lunes 28 de septiembre, 14:00"]);
});

test("las letras siguen siendo del par ofrecido: 'A' nunca se reasigna a un horario extra", () => {
  const out = step(ESPERANDO, { text: "A", receivedAt: AHORA_CINCO }, { config: CONFIG_CINCO });
  assert.equal(out.nextState.botStage, "demo_agendada");
  assert.equal(out.nextState.scheduledLabel, "viernes 25 de septiembre, 21:00", "la A es la A de siempre");
});

test("un horario que NO tenemos sigue yendo a un humano (no se le asigna uno parecido)", () => {
  const out = step(
    ESPERANDO,
    { text: "mejor el domingo 27 a las 10 de la mañana", receivedAt: AHORA_CINCO },
    { config: CONFIG_CINCO },
  );
  assert.equal(out.nextState.botStage, "handoff_humano", "ese domingo no existe en la agenda");
  assert.ok(out.notes.includes("handoff:propone_otro_horario"), JSON.stringify(out.notes));
});

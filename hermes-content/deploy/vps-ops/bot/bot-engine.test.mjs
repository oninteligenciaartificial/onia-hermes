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
  assert.equal(after.state.humanTookOver, true, "nunca vuelve solo a false");
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

  const libre = run(["y entonces? me contestan?"], { config: CONFIG_FERRETERIA, state });
  assert.equal(libre.turns[0].replies.length, 0, "texto libre en handoff: silencio, como siempre");
  assert.deepEqual(libre.turns[0].notes, ["silencio:handoff_en_curso"]);
});

test("venta: el funnel de Onia NO lleva botones — M0 sale plano como siempre", () => {
  const venta = run(["DEMO"]);
  assert.ok(venta.turns[0].replies.every((reply) => !reply.options));
});

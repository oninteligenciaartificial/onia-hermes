// ONIA — Chatbot propio: pruebas del FOLLOW-UP UNICO (M3).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. LAS 4 CONDICIONES DEL BARRIDO (spec §4.6): paso 0, sin humano, sin opt-out y en un estado
//      donde el follow-up tiene sentido — mas la ventana 22 h / 7 dias. Se verifica en los dos
//      lados: el filtro que sale a PostgREST Y el re-chequeo en memoria (si la base devuelve una
//      fila que no corresponde, igual no se manda).
//   2. EL CAS IMPIDE EL DOBLE ENVIO: dos barridos seguidos mandan UNO. Si la reserva devuelve 0
//      filas (o falla), no sale nada: preferimos perder un follow-up a mandar dos.
//   3. UN OPT-OUT NUNCA RECIBE FOLLOW-UP: se descarta ANTES de la reserva (ni se toca la fila).
//   4. Tolerancia: sin base, lista vacia y warning. Determinismo: el "ahora" se inyecta.
//
// No hay red real en ninguna prueba: el fetch se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig, DEFAULT_CONFIG } from "./config.mjs";
import { createStore } from "./persistence.mjs";
import {
  buildConfig,
  followUpMessageKey,
  hoursBetween,
  parseArgs,
  parseSlotsSpec,
  renderHuman,
  resolveConfig,
  runFollowUpSweep,
  skipReason,
} from "./followup-run.mjs";

const CONFIG = createBotConfig({
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz
const NOW = "2026-07-28T14:05:00Z"; // exactamente 24 h despues: pasadas las 22 h

/** Fila de bot_conversations tal como la devuelve el barrido. */
function row(extra = {}) {
  return {
    conversation_key: "telegram:777",
    channel: "telegram",
    contact_ref: "777",
    display_name: "Ana",
    bot_stage: "esperando_horario",
    qualification: { ownsClinic: true, chairs: 2, city: "Santa Cruz" },
    slots_offered: [
      { key: "A", label: "jueves 15:00" },
      { key: "B", label: "viernes 10:00" },
    ],
    human_took_over: false,
    opt_out_at: null,
    followup_step: 0,
    last_inbound_at: T0,
    raw: { outboundSeq: 2, humano: "no tocar" },
    ...extra,
  };
}

/**
 * Store de mentira con memoria: el CAS es de verdad (una sola reserva por conversacion), asi que
 * sirve para probar el doble envio sin red.
 */
function memoryStore(rows, options = {}) {
  const calls = [];
  const steps = new Map();
  const outbound = [];
  for (const item of rows || []) steps.set(item.conversation_key, Number(item.followup_step) || 0);
  return {
    calls,
    outbound,
    steps,
    store: {
      enabled: true,
      warnings: [],
      async sweepFollowUpCandidates() {
        calls.push("sweep");
        if (options.sweepNull) return null;
        // El barrido real filtra en SQL; aca devolvemos lo que se le pide devolver, incluso filas
        // que NO corresponden, para probar el re-chequeo en memoria.
        // `staleSweep` simula la carrera: el select vio paso 0 y la fila YA cambio en la base.
        if (options.staleSweep) return (rows || []).map((item) => ({ ...item }));
        return (rows || []).map((item) => ({ ...item, followup_step: steps.get(item.conversation_key) ?? 0 }));
      },
      async reserveFollowUp(conversationKey, expectedStep = 0) {
        calls.push(`reserve:${conversationKey}`);
        if (options.reserveNull) return null;
        const current = steps.get(conversationKey) ?? 0;
        if (current !== expectedStep) return false; // CAS: la fila cambio -> no se manda
        steps.set(conversationKey, current + 1);
        return true;
      },
      async insertOutbound(messages) {
        calls.push("insertOutbound");
        outbound.push(...messages);
        return messages.length;
      },
      async saveConversation() {
        calls.push("saveConversation");
        return {};
      },
    },
  };
}

const sweep = (rows, options = {}, config = CONFIG) =>
  runFollowUpSweep({ nowIso: options.nowIso || NOW, emit: options.emit !== false, limit: options.limit }, {
    config,
    store: options.store || memoryStore(rows, options).store,
  });

// ---------------------------------------------------------------------------
// 1. Las 4 condiciones del barrido — filtro que sale a PostgREST
// ---------------------------------------------------------------------------

test("el barrido pide las 4 condiciones + la ventana 22 h / 7 dias, ordenado y con limite", async () => {
  const requests = [];
  const store = createStore({
    url: "https://sb.test",
    key: "service-role-fake",
    fetch: async (url, init = {}) => {
      requests.push(String(url));
      return { ok: true, status: 200, text: async () => "[]" };
    },
  });

  await runFollowUpSweep({ nowIso: NOW, emit: true, limit: 20 }, { config: CONFIG, store });
  const url = requests[0];

  assert.match(url, /followup_step=eq\.0/, "1) todavia no se mando ninguno");
  assert.match(url, /human_took_over=is\.false/, "2) ningun humano tomo la conversacion");
  assert.match(url, /opt_out_at=is\.null/, "3) no pidio la baja");
  assert.match(url, /bot_stage=in\.\(esperando_calificacion,esperando_horario\)/, "4) estado donde tiene sentido");
  assert.match(url, /last_inbound_at=lte\.2026-07-27T16:05:00\.000Z/, "22 h, no 24 (ventana de Meta)");
  assert.match(url, /last_inbound_at=gte\.2026-07-21T14:05:00\.000Z/, "techo de 7 dias");
  assert.match(url, /order=last_inbound_at\.asc/);
  assert.match(url, /limit=20/);
});

test("la ventana es de 22 h: a las 21,9 h todavia no, a las 22 h si", async () => {
  const justoAntes = new Date(Date.parse(T0) + 21.9 * 3600000).toISOString();
  const justo = new Date(Date.parse(T0) + 22 * 3600000).toISOString();

  const antes = await sweep([row()], { nowIso: justoAntes });
  assert.deepEqual(antes.send, []);
  assert.match(antes.skipped[0].reason, /^demasiado_pronto/);

  const despues = await sweep([row()], { nowIso: justo });
  assert.equal(despues.send.length, 1);
});

// ---------------------------------------------------------------------------
// 2. Re-chequeo en memoria: si la base devuelve de mas, igual no se manda
// ---------------------------------------------------------------------------

test("aunque la base devuelva la fila, NO se manda si viola cualquiera de las 4 condiciones", async () => {
  const casos = [
    { patch: { followup_step: 1 }, reason: "ya_tiene_followup" },
    { patch: { human_took_over: true }, reason: "humano_a_cargo" },
    { patch: { opt_out_at: T0 }, reason: "opt_out" },
    { patch: { bot_stage: "demo_agendada" }, reason: "estado_no_aplica:demo_agendada" },
    { patch: { bot_stage: "handoff_humano" }, reason: "estado_no_aplica:handoff_humano" },
    { patch: { last_inbound_at: null }, reason: "sin_last_inbound_at" },
  ];

  for (const caso of casos) {
    const fake = memoryStore([row(caso.patch)]);
    const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });

    assert.equal(result.scanned, 1);
    assert.deepEqual(result.send, [], `${caso.reason}: no se manda nada`);
    assert.deepEqual(result.skipped, [{ conversationKey: "telegram:777", reason: caso.reason }]);
    assert.deepEqual(fake.calls, ["sweep"], `${caso.reason}: ni se reserva ni se escribe`);
  }
});

test("una conversacion muerta (mas de 7 dias sin responder) no se revive", async () => {
  const result = await sweep([row({ last_inbound_at: "2026-07-01T14:05:00Z" })]);
  assert.deepEqual(result.send, []);
  assert.match(result.skipped[0].reason, /^conversacion_muerta/);
});

test("los dos estados vivos del embudo SI reciben follow-up", async () => {
  for (const stage of ["esperando_calificacion", "esperando_horario"]) {
    const result = await sweep([row({ bot_stage: stage })]);
    assert.equal(result.send.length, 1, stage);
    assert.equal(result.send[0].botStage, stage);
  }
});

// ---------------------------------------------------------------------------
// 3. El CAS impide el doble envio
// ---------------------------------------------------------------------------

test("dos barridos seguidos mandan UNO solo: el CAS se queda con la reserva", async () => {
  const fake = memoryStore([row()]);
  const deps = { config: CONFIG, store: fake.store };

  const primero = await runFollowUpSweep({ nowIso: NOW, emit: true }, deps);
  const segundo = await runFollowUpSweep({ nowIso: NOW, emit: true }, deps);

  assert.equal(primero.send.length, 1);
  assert.equal(primero.send[0].reserved, true);
  assert.equal(primero.send[0].followupStep, 1);

  assert.deepEqual(segundo.send, [], "el segundo barrido no manda nada");
  assert.equal(segundo.skipped[0].reason, "ya_tiene_followup", "la fila ya viene con el paso 1");
  assert.equal(fake.outbound.length, 1, "una sola fila en bot_messages");
});

test("si el CAS no reserva ninguna fila (carrera), NO se manda el follow-up", async () => {
  // La fila llega con paso 0 al barrido, pero otra corrida la reserva antes: el UPDATE toca 0 filas.
  const fake = memoryStore([row()], { staleSweep: true });
  fake.steps.set("telegram:777", 1); // alguien mas la reservo entre el select y el update
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });

  assert.deepEqual(result.send, []);
  assert.deepEqual(result.skipped, [{ conversationKey: "telegram:777", reason: "ya_reservado" }]);
  assert.equal(fake.outbound.length, 0);
});

test("si la reserva falla (base caida) tampoco se manda: sin reserva confirmada no se envia", async () => {
  const fake = memoryStore([row()], { reserveNull: true });
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });

  assert.deepEqual(result.send, []);
  assert.deepEqual(result.skipped, [{ conversationKey: "telegram:777", reason: "reserva_fallida" }]);
});

test("la reserva va ANTES de escribir la bitacora, nunca al reves", async () => {
  const fake = memoryStore([row()]);
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });
  assert.deepEqual(fake.calls, ["sweep", "reserve:telegram:777", "insertOutbound"]);
});

test("el follow-up NO reescribe la conversacion entera (no puede pisar un human_took_over nuevo)", async () => {
  const fake = memoryStore([row()]);
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });
  assert.ok(!fake.calls.includes("saveConversation"), "el CAS ya dejo followup_step=1; nada mas se toca");
});

test("la fila de bot_messages tiene clave determinista: reintentar no duplica", async () => {
  const fake = memoryStore([row()]);
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });

  assert.equal(fake.outbound[0].messageKey, "followup:telegram:777:1");
  assert.equal(fake.outbound[0].messageKey, followUpMessageKey("telegram:777", 1));
  assert.equal(fake.outbound[0].direction, "outbound");
  assert.equal(fake.outbound[0].templateKey, "M3");
  assert.equal(fake.outbound[0].deliveryStatus, "skipped", "dryRun por defecto: se registra, no se manda");
});

// ---------------------------------------------------------------------------
// 4. Opt-out: jamas recibe follow-up
// ---------------------------------------------------------------------------

test("un opt-out nunca recibe follow-up, ni aunque el barrido lo devuelva", async () => {
  const fake = memoryStore([row({ opt_out_at: "2026-07-27T15:00:00Z" })]);
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });

  assert.deepEqual(result.send, [], "silencio total despues de M6");
  assert.deepEqual(result.skipped, [{ conversationKey: "telegram:777", reason: "opt_out" }]);
  assert.ok(!fake.calls.some((call) => call.startsWith("reserve")), "ni se intenta reservar la fila");
  assert.equal(fake.outbound.length, 0);
  assert.equal(fake.steps.get("telegram:777"), 0, "la fila del que pidio la baja no se toca");
});

test("un opt-out en el medio de la lista no frena a los demas", async () => {
  const fake = memoryStore([
    row({ conversation_key: "telegram:1", contact_ref: "1", opt_out_at: T0 }),
    row({ conversation_key: "telegram:2", contact_ref: "2" }),
  ]);
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store });

  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].conversationKey, "telegram:2");
  assert.deepEqual(result.skipped, [{ conversationKey: "telegram:1", reason: "opt_out" }]);
});

// ---------------------------------------------------------------------------
// 5. Modo dry-run, tolerancia y determinismo
// ---------------------------------------------------------------------------

test("dry-run por defecto: dice a quien le mandaria, pero no reserva ni escribe", async () => {
  const fake = memoryStore([row()]);
  const result = await runFollowUpSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: fake.store });

  assert.equal(result.mode, "dry-run");
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].reserved, false);
  assert.equal(result.send[0].deliveryStatus, "preview");
  assert.equal(result.send[0].silentHours, 24);
  assert.deepEqual(fake.calls, ["sweep"], "no toca la base");
  assert.equal(fake.steps.get("telegram:777"), 0, "el paso sigue en 0: se puede mandar de verdad despues");
});

test("el mensaje del dry-run es M3 con los 2 horarios, y no lleva ninguna cifra", async () => {
  const result = await runFollowUpSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: memoryStore([row()]).store });
  const text = result.send[0].text;

  assert.equal(result.send[0].templateKey, "M3");
  assert.equal(result.send[0].replySource, "script", "texto fijo: no pasa por el LLM");
  assert.match(text, /jueves 15:00/);
  assert.match(text, /viernes 10:00/);
  assert.match(text, /Onia Dental/);
  assert.ok(!/\d+\s*(bs|bolivianos|\$)/i.test(text), "el follow-up no cotiza");
  assert.ok(!text.includes("{{"), "todas las variables renderizadas");
});

test("sin base: lista vacia y el motivo en warnings (no tira, no inventa candidatas)", async () => {
  const store = createStore({ url: "", key: "" });
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store });

  assert.equal(result.ok, true);
  assert.equal(result.scanned, 0);
  assert.deepEqual(result.send, []);
  assert.deepEqual(result.skipped, []);
  assert.ok(result.notes.includes("barrido_sin_resultado"));
  assert.ok(result.warnings.some((warning) => warning.includes("sin credenciales")));
});

test("con la base caida (5xx) tampoco se manda nada y queda el rastro", async () => {
  const store = createStore({
    url: "https://sb.test",
    key: "k",
    fetch: async () => ({ ok: false, status: 503, text: async () => "upstream caido" }),
  });
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store });

  assert.deepEqual(result.send, []);
  assert.ok(result.warnings.some((warning) => warning.includes("HTTP 503")));
});

test("sin --now valido no se barre nada (el 'ahora' es obligatorio y explicito)", async () => {
  for (const nowIso of [undefined, null, "", "ayer"]) {
    const fake = memoryStore([row()]);
    const result = await runFollowUpSweep({ nowIso, emit: true }, { config: CONFIG, store: fake.store });
    assert.equal(result.ok, false);
    assert.match(result.error, /--now invalido/);
    assert.deepEqual(fake.calls, [], "ni siquiera consulta la base");
  }
});

test("determinista: el mismo --now sobre el mismo estado da exactamente la misma salida", async () => {
  const uno = await runFollowUpSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: memoryStore([row()]).store });
  const dos = await runFollowUpSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: memoryStore([row()]).store });
  assert.deepEqual(uno, dos);
});

test("si Sergio todavia no definio los 2 horarios, el follow-up NO sale (y no quema la reserva)", async () => {
  const fake = memoryStore([row()]);
  // DEFAULT_CONFIG trae los slots placeholder ("HORARIO A (pendiente de definir)").
  const result = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: DEFAULT_CONFIG, store: fake.store });

  assert.deepEqual(result.send, []);
  assert.deepEqual(result.skipped, [{ conversationKey: "telegram:777", reason: "slots_sin_definir" }]);
  assert.ok(result.notes.includes("slots_sin_definir"));
  assert.ok(!fake.calls.some((call) => call.startsWith("reserve")), "el paso sigue en 0: sale cuando haya horarios");
});

test("el canal 'sim' registra 'simulated'; con dryRun apagado, 'sent'", async () => {
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });

  const sim = memoryStore([row({ conversation_key: "sim:x", channel: "sim", contact_ref: "x" })]);
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: sim.store });
  assert.equal(sim.outbound[0].deliveryStatus, "simulated");

  const real = memoryStore([row()]);
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: real.store });
  assert.equal(real.outbound[0].deliveryStatus, "sent");
});

// ---------------------------------------------------------------------------
// 6. CLI y helpers
// ---------------------------------------------------------------------------

test("parseArgs: dry-run por defecto, y acepta las dos formas de cada flag", () => {
  assert.deepEqual(parseArgs([]), { now: null, emit: false, json: false, limit: 50, slots: null });
  assert.equal(parseArgs(["--emit"]).emit, true);
  assert.equal(parseArgs(["--emit", "--dry-run"]).emit, false);
  assert.equal(parseArgs(["--now", NOW]).now, NOW);
  assert.equal(parseArgs([`--now=${NOW}`]).now, NOW);
  assert.equal(parseArgs(["--limit", "10"]).limit, 10);
  assert.equal(parseArgs(["--limit=10"]).limit, 10);
  assert.equal(parseArgs(["--limit", "cero"]).limit, 50, "un limite invalido cae al default");
  assert.equal(parseArgs(["--json"]).json, true);
});

test("parseSlotsSpec / buildConfig: los horarios entran por CLI o por env, sin inventarse", () => {
  assert.equal(parseSlotsSpec(""), null);
  assert.deepEqual(parseSlotsSpec("jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00"), [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: null, pending: false },
  ]);
  assert.equal(buildConfig({}), DEFAULT_CONFIG, "sin overrides no se clona el config");
  assert.equal(buildConfig({ slots: "jueves 15:00|viernes 10:00" }).slots[0].label, "jueves 15:00");
});

// ---------------------------------------------------------------------------
// 7. resolveConfig: Cal.com destraba el placeholder de los 2 horarios, solo en main() real
// ---------------------------------------------------------------------------

test("resolveConfig: con --slots explicito NO llama a Cal.com", async () => {
  let called = false;
  const getAvailableSlots = async () => {
    called = true;
    return { slots: [], source: "calcom", warnings: [] };
  };
  const config = await resolveConfig({ slots: "jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00" }, { getAvailableSlots });
  assert.equal(called, false);
  assert.equal(config.slots[0].label, "jueves 15:00");
});

test("resolveConfig: sin --slots ni ONIA_BOT_SLOTS, si Cal.com responde reemplaza el placeholder", async () => {
  const live = [
    { key: "A", label: "lun 27/07 14:00", startAt: "2026-07-27T18:00:00Z", pending: false },
    { key: "B", label: "lun 27/07 16:00", startAt: "2026-07-27T20:00:00Z", pending: false },
  ];
  const getAvailableSlots = async () => ({ slots: live, source: "calcom", warnings: [] });
  const config = await resolveConfig({}, { getAvailableSlots, nowIso: NOW });
  assert.deepEqual(config.slots, live);
});

test("resolveConfig: si Cal.com no responde, cae al DEFAULT_CONFIG (placeholder) sin tirar", async () => {
  const getAvailableSlots = async () => ({ slots: null, source: "error", warnings: ["calcom: caido"] });
  const config = await resolveConfig({}, { getAvailableSlots });
  assert.equal(config, DEFAULT_CONFIG);
});

test("skipReason nombra el motivo exacto (es lo que Sergio lee en el dry-run)", () => {
  assert.equal(skipReason(null, NOW, CONFIG), "fila_ilegible");
  const vivo = { humanTookOver: false, optOutAt: null, followupStep: 0, botStage: "esperando_horario", lastInboundAt: T0 };
  assert.equal(skipReason(vivo, NOW, CONFIG), null);
  assert.equal(skipReason({ ...vivo, humanTookOver: true }, NOW, CONFIG), "humano_a_cargo");
  assert.equal(skipReason({ ...vivo, optOutAt: T0 }, NOW, CONFIG), "opt_out");
  assert.equal(skipReason({ ...vivo, lastInboundAt: "no-es-fecha" }, NOW, CONFIG), "fecha_invalida");
});

test("hoursBetween es aritmetica pura sobre los ISO inyectados", () => {
  assert.equal(hoursBetween(T0, NOW), 24);
  assert.equal(hoursBetween("no", NOW), null);
});

test("renderHuman muestra a quien se le manda, a quien no y por que", async () => {
  const fake = memoryStore([row(), row({ conversation_key: "telegram:9", contact_ref: "9", opt_out_at: T0 })]);
  const result = await runFollowUpSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: fake.store });
  const text = renderHuman(result);

  assert.match(text, /modo dry-run/);
  assert.match(text, /candidatas del barrido: 2/);
  assert.match(text, /MANDARIA \(1\)/);
  assert.match(text, /telegram:777 \[telegram\] Ana — esperando_horario, callado hace 24 h/);
  assert.match(text, /NO SE MANDA \(1\)/);
  assert.match(text, /telegram:9 — opt_out/);
});

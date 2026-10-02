// ONIA — Chatbot propio: pruebas del FOLLOW-UP UNICO (M3).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. LAS 4 CONDICIONES DEL BARRIDO (spec §4.6): paso 0, sin humano, sin opt-out y en un estado
//      donde el follow-up tiene sentido — mas la ventana 20-24 h de Meta. Se verifica en los dos
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

import { createBotConfig, DEFAULT_CONFIG, slotsPending } from "./config.mjs";
import { createStore } from "./persistence.mjs";
import {
  buildConfig,
  followUpMessageKey,
  followUpTemplate,
  hoursBetween,
  outsideWindow,
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

const T0 = "2026-07-27T16:05:00Z"; // lunes 12:05 en La Paz
// 22 h despues: pasadas las 20 h que exige el barrido y DENTRO de la ventana de 24 h de Meta.
// Antes este fixture estaba en 24 h clavadas — justo el borde donde el envio ya falla con 131047.
// Un caso base parado en el borde hacia pasar tests que en produccion no habrian mandado nada.
const NOW = "2026-07-28T14:05:00Z";

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
  let inserts = 0;
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
        inserts += 1;
        // `insertNull`: la base NUNCA acepta la fila (el hueco que hay que gritar).
        // `insertNullFirst`: falla la primera y entra la segunda — el corte transitorio, que es
        // el caso realista (el CAS acaba de confirmar milisegundos antes).
        if (options.insertNull || (options.insertNullFirst && inserts === 1)) return null;
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

test("el barrido pide las 4 condiciones + la franja 20 h - 7 dias, ordenado y con limite", async () => {
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
  assert.match(url, /last_inbound_at=lte\.2026-07-27T18:05:00\.000Z/, "20 h: 4 h de colchon contra la ventana de 24 de Meta");
  // Piso = `staleAfterDays` (7 dias), NO la ventana de 24 h. El piso estuvo en 24 h mientras fuera
  // de la ventana no habia NADA que mandar; con `seguimiento_demo` aprobada esas filas volvieron a
  // ser accionables (salen como plantilla) y tienen que llegar al barrido.
  assert.match(url, /last_inbound_at=gte\.2026-07-21T14:05:00\.000Z/, "piso: los 7 dias de staleAfterDays");
  assert.match(url, /order=last_inbound_at\.asc/);
  assert.match(url, /limit=20/);
});

test("la ventana es de 20 h: a las 19,9 h todavia no, a las 20 h si", async () => {
  const justoAntes = new Date(Date.parse(T0) + 19.9 * 3600000).toISOString();
  const justo = new Date(Date.parse(T0) + 20 * 3600000).toISOString();

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
  assert.equal(result.send[0].silentHours, 22);
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
  assert.match(text, /\bOnia\b/, "el follow-up nombra el producto: la plataforma, no el modulo de un rubro");
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

// ---------------------------------------------------------------------------
// 5B. Fuera de la ventana de Meta: sale la PLANTILLA aprobada (antes no salia nada)
// ---------------------------------------------------------------------------

// 30 h de silencio: la ventana de 24 h ya se cerro. Antes esto se descartaba con
// `fuera_de_ventana` porque no habia plantilla aprobada; hoy `seguimiento_demo` si existe.
const NOW_FUERA = new Date(Date.parse(T0) + 30 * 3600000).toISOString();

test("dentro de la ventana el follow-up es TEXTO LIBRE (gratis), no plantilla", async () => {
  const result = await sweep([row()]);
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].sendKind, "texto_libre");
  assert.equal(result.send[0].templateName, null);
  assert.equal(result.send[0].templateKey, "M3");
});

test("a las 30 h sale `seguimiento_demo` con los MISMOS dos horarios que el texto libre", async () => {
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const enviados = [];
  const fake = memoryStore([row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" })]);
  const result = await runFollowUpSweep(
    { nowIso: NOW_FUERA, emit: true },
    {
      config: enVivo,
      store: fake.store,
      chatwoot: {
        enabled: true,
        warnings: [],
        sendMessage: (id, text, templateParams) => {
          enviados.push({ id, text, templateParams });
          return { id: 1 };
        },
      },
    },
  );

  assert.deepEqual(result.skipped, [], "ya no se descarta por la ventana");
  assert.equal(result.send[0].sendKind, "plantilla");
  assert.equal(result.send[0].templateName, "seguimiento_demo");
  assert.equal(result.send[0].templateKey, "M3_PLANTILLA");
  assert.equal(result.send[0].deliveryStatus, "sent");

  // Los horarios de la plantilla salen de `slots_offered` de ESA conversacion, igual que el texto
  // libre: los dos caminos no pueden ofrecer cosas distintas.
  assert.deepEqual(enviados[0].templateParams, {
    name: "seguimiento_demo",
    language: "es",
    processed_params: { body: { 1: "jueves 15:00", 2: "viernes 10:00" } },
  });
  assert.match(enviados[0].text, /te dejo dos horarios: \*jueves 15:00\* o \*viernes 10:00\*/);
  assert.ok(!enviados[0].text.includes("{{"), "ninguna variable sin renderizar");
  assert.equal(fake.outbound[0].templateKey, "M3_PLANTILLA", "la bitacora dice que salio la plantilla");
});

test("a los 8 dias no se escribe NI con plantilla: eso ya no es seguimiento", async () => {
  const muerta = new Date(Date.parse(T0) + 8 * 24 * 3600000).toISOString();
  const result = await sweep([row()], { nowIso: muerta });
  assert.deepEqual(result.send, []);
  assert.match(result.skipped[0].reason, /^conversacion_muerta/);
});

// Lo que NO se manda nunca es el placeholder, y esa baranda cuelga del CONFIG, que es la fuente
// que el barrido re-mide en cada corrida ("si Sergio todavia no definio los 2 horarios", arriba).
//
// Hasta el 2026-09-18 este caso exigia lo contrario — que una conversacion con `slots_offered`
// placeholder no recibiera rescate NUNCA, ni con horarios ya publicados — y eso defendia el
// defecto: el dato viejo de la fila le costaba el rescate a un prospecto real. El sujeto correcto
// es que el texto que SALE no lleve el placeholder, no que la conversacion quede excluida.
test("un `slots_offered` placeholder viejo no le cuesta el rescate al prospecto: salen los vigentes", async () => {
  const fake = memoryStore([
    row({
      conversation_key: "chatwoot:42",
      channel: "chatwoot",
      contact_ref: "42",
      slots_offered: [
        { key: "A", label: "HORARIO A (pendiente de definir)", pending: true },
        { key: "B", label: "HORARIO B (pendiente de definir)", pending: true },
      ],
    }),
  ]);
  const result = await runFollowUpSweep({ nowIso: NOW_FUERA, emit: true }, { config: CONFIG, store: fake.store });

  assert.equal(result.send.length, 1, "con horarios vigentes publicados, el rescate sale");
  assert.equal(result.send[0].templateKey, "M3_PLANTILLA", "fuera de la ventana va la plantilla aprobada");
  // La preocupacion original, intacta: se gasta plata en esta plantilla y Meta la mide.
  assert.ok(
    !result.send[0].text.includes("pendiente de definir"),
    "jamas sale un placeholder en una plantilla PAGA",
  );
  for (const slot of CONFIG.slots) {
    assert.ok(result.send[0].text.includes(slot.label), `ofrece el vigente "${slot.label}"`);
  }
});

test("outsideWindow y followUpTemplate son puros y no adivinan", () => {
  const state = { lastInboundAt: T0, slotsOffered: [] };
  assert.equal(outsideWindow(state, NOW, CONFIG), false, "22 h: la ventana sigue abierta");
  assert.equal(outsideWindow(state, NOW_FUERA, CONFIG), true);
  assert.equal(outsideWindow({ lastInboundAt: "no-es-fecha" }, NOW, CONFIG), false, "dato roto no paga plantilla");

  assert.equal(followUpTemplate(state, DEFAULT_CONFIG), null, "con los placeholders del config, tampoco");
  const built = followUpTemplate(state, CONFIG);
  assert.equal(built.name, "seguimiento_demo");
  assert.match(built.text, /jueves 15:00/);
});

test("la plantilla NO se reintenta si el envio falla: la reserva ya se gasto", async () => {
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  let intentos = 0;
  const fake = memoryStore([row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" })]);
  const result = await runFollowUpSweep(
    { nowIso: NOW_FUERA, emit: true },
    {
      config: enVivo,
      store: fake.store,
      chatwoot: {
        enabled: true,
        warnings: ["chatwoot: HTTP 400 template pausada"],
        sendMessage: () => {
          intentos += 1;
          return null; // Meta rechazo la plantilla (132015 / pacing): NO se vuelve a intentar
        },
      },
    },
  );

  assert.equal(intentos, 1, "un solo intento: un duplicado quema la calidad del numero ante Meta");
  assert.equal(result.send[0].deliveryStatus, "failed");
  assert.equal(result.send[0].sendKind, "plantilla", "el reporte igual dice QUE se intento mandar");
  assert.equal(fake.outbound[0].deliveryStatus, "failed", "la bitacora no promete un envio que no paso");
  assert.equal(fake.steps.get("chatwoot:42"), 1, "el paso quedo consumido: no hay segundo follow-up");
});

test("'sent' solo si SE MANDO: el estado guardado no puede volver a ser una promesa", async () => {
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const chatwootRow = { conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" };

  const sim = memoryStore([row({ conversation_key: "sim:x", channel: "sim", contact_ref: "x" })]);
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: sim.store });
  assert.equal(sim.outbound[0].deliveryStatus, "simulated");

  // Se manda de verdad: al cliente de Chatwoot le llega la conversacion y el texto.
  const enviados = [];
  const real = memoryStore([row(chatwootRow)]);
  const ok = await runFollowUpSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: real.store,
      chatwoot: { enabled: true, warnings: [], sendMessage: (id, text) => { enviados.push({ id, text }); return { id: 1 }; } },
      // El camino feliz incluye saber QUE inboxes son banco de pruebas (ver `es-nuestra.mjs`): sin
      // esto el barrido avisa —con razon— que no pudo preguntar, y este caso afirma cero warnings.
      listarInboxes: async () => [{ id: 4, name: "Onia Web" }, { id: 7, name: "ZZ QA Clinica Chatbot" }],
    },
  );
  assert.equal(real.outbound[0].deliveryStatus, "sent");
  assert.equal(enviados.length, 1, "se mando UNA vez");
  assert.equal(enviados[0].id, "42", "a la conversacion de Chatwoot, que es el contactRef");
  assert.match(enviados[0].text, /\S/);
  assert.equal(ok.warnings.length, 0);

  // Sin token no se manda — y NO se registra como enviado. Antes esto decia "sent" igual.
  const roto = memoryStore([row(chatwootRow)]);
  const fallo = await runFollowUpSweep(
    { nowIso: NOW, emit: true },
    { config: enVivo, store: roto.store, chatwoot: { enabled: false, warnings: [], sendMessage: () => null } },
  );
  assert.equal(roto.outbound[0].deliveryStatus, "failed");
  assert.match(fallo.warnings.join(" "), /sin token/);

  // Un canal sin envio automatico tampoco puede decir "sent".
  const otro = memoryStore([row()]); // telegram
  await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: otro.store });
  assert.equal(otro.outbound[0].deliveryStatus, "failed");
});

// ---------------------------------------------------------------------------
// 5 bis. EL AGUJERO ESPEJO: un envio que SALIO nunca puede quedar sin fila
//
// Aca se manda ANTES de registrar (al reves que el recordatorio, porque este barrido tiene su
// propia reserva con CAS). Si el insert falla despues de un envio exitoso, Meta nos COBRA un
// mensaje que nuestra base dice que no existio y el medidor cuenta de MENOS. Espejo exacto del
// bug del recordatorio, que facturaba de mas.
// ---------------------------------------------------------------------------

/** Un envio real por Chatwoot: es el unico camino donde `deliveryStatus` llega a "sent". */
async function envioReal(fake, options = {}) {
  const enviados = [];
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const salida = await runFollowUpSweep(
    { nowIso: options.nowIso || NOW, emit: true },
    {
      config: enVivo,
      store: fake.store,
      chatwoot: {
        enabled: true,
        warnings: [],
        sendMessage: (id, text, templateParams) => {
          enviados.push({ id, text, templateParams });
          return { id: 1 };
        },
      },
    },
  );
  return { enviados, salida };
}

const CHATWOOT_ROW = { conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" };

test("insert caido tras un envio exitoso: se REINTENTA la fila, NO el envio", async () => {
  const fake = memoryStore([row(CHATWOOT_ROW)], { insertNullFirst: true });
  const { enviados, salida } = await envioReal(fake);

  assert.equal(enviados.length, 1, "REGLA DURA: el mensaje sale UNA vez — reintentar la fila no re-manda");
  assert.equal(fake.calls.filter((call) => call === "insertOutbound").length, 2, "el insert si se reintenta");
  assert.equal(fake.outbound.length, 1, "y entra UNA sola fila, no dos");
  assert.equal(fake.outbound[0].messageKey, "followup:chatwoot:42:1", "misma clave: por eso el reintento es idempotente");
  assert.equal(salida.send[0].deliveryStatus, "sent");
  assert.equal(salida.send[0].logged, true, "el envio quedo contabilizado");
  assert.ok(!salida.notes.includes("envio_sin_fila"), "se arreglo: no hay hueco que declarar");
  assert.ok(!salida.warnings.join(" ").includes("SIN FILA"));
});

test("si ni el reintento entra, el hueco se GRITA — no muere como `logged: false`", async () => {
  const fake = memoryStore([row(CHATWOOT_ROW)], { insertNull: true });
  const { enviados, salida } = await envioReal(fake);

  assert.equal(enviados.length, 1, "aun perdiendo la fila, el mensaje NO se manda dos veces");
  assert.equal(fake.calls.filter((call) => call === "insertOutbound").length, 2, "se intento dos veces y no entro");
  assert.equal(salida.ok, true, "EXIT 0: un fallo del registro no puede tumbar el barrido");
  assert.equal(salida.send[0].deliveryStatus, "sent");
  assert.equal(salida.send[0].logged, false);

  // Lo que antes moria en silencio: ahora sale con nombre y apellido.
  assert.ok(salida.notes.includes("envio_sin_fila"), "la nota que n8n puede leer sin parsear texto");
  const grito = salida.warnings.find((warning) => warning.includes("SIN FILA"));
  assert.ok(grito, "el warning existe");
  assert.match(grito, /chatwoot:42/, "nombra la conversacion");
  assert.match(grito, /Meta lo cobra/, "dice que es plata, no un detalle tecnico");
  assert.match(grito, /texto_libre/, "y por que carril salio (la plantilla cuesta 6,5x)");
});

test("el aviso solo suena si SALIO: dry-run y envio fallido no cuestan plata", async () => {
  // Envio fallido (canal sin envio automatico): la fila tampoco entra, pero Meta no cobra nada.
  const roto = memoryStore([row()], { insertNull: true }); // telegram
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const fallo = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: roto.store });
  assert.equal(fallo.send[0].deliveryStatus, "failed");
  assert.ok(!fallo.notes.includes("envio_sin_fila"), "un envio que no salio no es un hueco de plata");

  // Dry-run: el barrido calcula todo pero no manda. Una alarma aca seria una mentira.
  const seco = memoryStore([row(CHATWOOT_ROW)], { insertNull: true });
  const dry = await runFollowUpSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: seco.store });
  assert.equal(dry.send[0].deliveryStatus, "skipped");
  assert.ok(!dry.notes.includes("envio_sin_fila"));
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

// Desde el 2-oct los horarios solo entran con AGENDA PROPIA (`ONIA_BOT_AGENDA=calcom` y Cal.com
// configurado): sin ella el seguimiento no ofrece horarios (agendado-solo-si-se-agendo.test.mjs).
// Los casos que prueban COMO entran los horarios la encienden mientras corren.
const AGENDA_PROPIA = { ONIA_BOT_AGENDA: "calcom", CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" };
async function conAgendaPropia(fn) {
  const antes = Object.fromEntries(Object.keys(AGENDA_PROPIA).map((k) => [k, process.env[k]]));
  Object.assign(process.env, AGENDA_PROPIA);
  try {
    return await fn();
  } finally {
    for (const [k, v] of Object.entries(antes)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test("parseSlotsSpec / buildConfig: los horarios entran por CLI o por env, sin inventarse", async () => {
  assert.equal(parseSlotsSpec(""), null);
  // `now` fijo: este caso prueba el PARSEO, y sin anclarlo tenia fecha de
  // vencimiento — el 2026-07-30 ya paso, y un horario vencido ahora sale
  // `pending` (ver el test de anticipacion, abajo).
  const antesDelSlot = Date.parse("2026-07-29T00:00:00Z");
  assert.deepEqual(parseSlotsSpec("jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00", { now: antesDelSlot }), [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: null, pending: false },
  ]);
  // Lo que se cuida es que SIN overrides el transporte no pise NADA — no la identidad del objeto.
  // El assert de identidad (`=== DEFAULT_CONFIG`) daba verde local y ROJO en el VPS: alli existe
  // knowledge.json y `withKnowledge()` devuelve otro objeto. Ver la prueba de PARIDAD en
  // run-turn.test.mjs: un verde que no vale es peor que un rojo.
  const sinOverrides = buildConfig({});
  assert.deepEqual(sinOverrides.slots, DEFAULT_CONFIG.slots, "sin overrides, los horarios siguen siendo el placeholder");
  assert.equal(sinOverrides.dryRun, DEFAULT_CONFIG.dryRun, "y el dryRun sigue siendo el del codigo");
  assert.ok(slotsPending(sinOverrides));
  await conAgendaPropia(() => {
    assert.equal(buildConfig({ slots: "jueves 15:00|viernes 10:00" }).slots[0].label, "jueves 15:00");
  });
  assert.ok(slotsPending(buildConfig({ slots: "jueves 15:00|viernes 10:00" })), "sin agenda propia, ni a mano: M3 no ofrece horarios");
});

test("parseSlotsSpec: un horario que ya no da 24 h de aviso NO se ofrece, sale pendiente", () => {
  // SEGUNDO CORTE. El primero vive en scripts/loops/renovar-slots-bot.py, que
  // genera los horarios con margen para toda su vigencia. Este es el que aguanta
  // cuando ese cron NO corre: el valor de ayer se queda en webhook.env y el bot,
  // sin este corte, sigue ofreciendolo — primero con pocas horas de aviso y
  // despues directamente en el pasado, que es "peor que no ofrecer nada, porque
  // parece que funciona" (docstring del generador).
  //
  // El corte no INVENTA una rama nueva: marca `pending`, que es el estado que el
  // motor ya sabe manejar (M0_SIN_HORARIOS / PENDING_HORARIO_SIN_HORARIOS) y que
  // `detectSlotChoice` ya descarta. Un horario que no se puede sostener es, para
  // el guion, exactamente lo mismo que un horario sin definir.
  const ahora = Date.parse("2026-09-05T08:03:00Z"); // 04:03 La Paz, el caso medido

  const [a, b] = parseSlotsSpec(
    "sábado 5 de septiembre, 09:00@2026-09-05T13:00:00Z|lunes 7 de septiembre, 14:00@2026-09-07T18:00:00Z",
    { now: ahora },
  );
  assert.equal(a.pending, true, "a 4 h 57 min de aviso, ese horario no se ofrece");
  assert.equal(b.pending, false, "el de dentro de 2 dias sigue siendo ofrecible");
  assert.equal(a.label, "sábado 5 de septiembre, 09:00", "la etiqueta se conserva para el log");

  // Un horario en el PASADO: el sintoma que el generador dice evitar y no evitaba.
  const [pasado] = parseSlotsSpec("viernes 4 de septiembre, 14:00@2026-09-04T18:00:00Z", { now: ahora });
  assert.equal(pasado.pending, true, "un horario vencido nunca se ofrece");

  // Justo en el limite: 24 h exactas SI se ofrecen (el generador entrega ese borde).
  const [borde] = parseSlotsSpec("x@2026-09-06T08:03:00Z", { now: ahora });
  assert.equal(borde.pending, false, "24 h exactas cumplen la regla de Sergio");

  // Fail-closed: un ISO ilegible no se puede sostener. La comparacion contra NaN
  // da false, asi que el horario cae a `pending` sin necesitar un caso aparte —
  // pero se ancla aca porque la direccion importa: el error posible es negarse a
  // ofrecer un horario bueno, nunca prometer uno que no se puede verificar.
  const [ilegible] = parseSlotsSpec("y@ayer a la tarde", { now: ahora });
  assert.equal(ilegible.pending, true, "si no se puede verificar, no se promete");
  // Ojo: el formato que imprime psql ("2026-09-06 08:03:00+00", offset de dos
  // digitos) SI lo lee Date.parse en Node 20, y al instante correcto — medido el
  // 2026-09-05. No es la fuente de NaN que la memoria compartida le atribuia.
  const [psql] = parseSlotsSpec("z@2026-09-07 18:00:00+00", { now: ahora });
  assert.equal(psql.pending, false, "el formato de psql se entiende, no se descarta");

  // Y el conjunto entero cae a "sin horarios" en cuanto UNO no se puede sostener:
  // el guion ofrece A y B, no hay forma de renderizar medio par.
  assert.ok(slotsPending({ slots: [a, b] }), "con A caido, el bot pide horario en vez de inventar");
});

test("parseSlotsSpec: elige los 2 que SE SOSTIENEN, no los 2 primeros de la lista", () => {
  // El corte por anticipacion convirtio a `pending` en un estado POR horario, pero el
  // recorte seguia siendo por POSICION: `.slice(0, 2)` cortaba ANTES de juzgar, asi que
  // los candidatos 3 y 4 no se miraban nunca aunque fueran los unicos ofrecibles. Con eso,
  // la unica forma de que el par llegara entero al prospecto era que el generador reservara
  // margen para TODA su vigencia (ANTICIPACION + VIGENCIA = 48 h en
  // scripts/loops/renovar-slots-bot.py), y el costo lo pagaba la venta: medido el 2026-09-17
  // 09:15 La Paz, el proceso vivo ofrecia "sábado 19, 09:00" y "lunes 21, 14:00" teniendo el
  // viernes 18 a las 14:00 —28 h de aviso, dentro de la regla de Sergio Urcullo— disponible.
  // Al prospecto que escribe hoy se le daba turno para pasado manana.
  //
  // Filtrar y DESPUES cortar es lo que le permite al generador mandar candidatos de mas: los
  // que caducan se caen solos y siempre quedan dos enteros, sin tocar el guion (que sigue
  // necesitando el par completo, ver `hayHorarioReal` en reply-builder.mjs).
  const ahora = Date.parse("2026-09-17T13:15:00Z"); // jueves 09:15 La Paz, la medicion viva

  const [a, b] = parseSlotsSpec(
    [
      "jueves 17 de septiembre, 20:00@2026-09-18T00:00:00Z", // ya no da 24 h: se cae
      "viernes 18 de septiembre, 14:00@2026-09-18T18:00:00Z", // tampoco (28 h... si da)
      "sábado 19 de septiembre, 09:00@2026-09-19T13:00:00Z",
      "lunes 21 de septiembre, 14:00@2026-09-21T18:00:00Z",
    ].join("|"),
    { now: ahora },
  );

  assert.equal(a.label, "viernes 18 de septiembre, 14:00", "el primero OFRECIBLE es A, no el primero de la lista");
  assert.equal(a.pending, false, "y se ofrece de verdad");
  assert.equal(b.label, "sábado 19 de septiembre, 09:00", "el segundo ofrecible es B");
  assert.equal(b.pending, false);
  assert.equal(a.key, "A", "las claves se reasignan sobre los elegidos, no sobre la posicion original");
  assert.equal(b.key, "B");

  // Y no se pierde el fail-safe: si NINGUNO se sostiene, siguen saliendo 2 marcados
  // `pending` para que el guion caiga a SIN_HORARIOS en vez de quedarse sin par.
  const caidos = parseSlotsSpec(
    "jueves 17, 20:00@2026-09-18T00:00:00Z|viernes 18, 09:00@2026-09-18T13:00:00Z",
    { now: ahora },
  );
  assert.equal(caidos.length, 2, "con todo vencido igual entrega el par");
  assert.ok(slotsPending({ slots: caidos }), "y el guion lo lee como 'sin horarios'");
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
  const config = await conAgendaPropia(() => resolveConfig({ slots: "jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00" }, { getAvailableSlots }));
  assert.equal(called, false);
  assert.equal(config.slots[0].label, "jueves 15:00");
});

test("resolveConfig: SIN agenda propia no le pregunta disponibilidad a Cal.com (no va a ofrecer nada)", async () => {
  let called = false;
  const getAvailableSlots = async () => {
    called = true;
    return { slots: [], source: "calcom", warnings: [] };
  };
  const config = await resolveConfig({}, { getAvailableSlots });
  assert.equal(called, false);
  assert.ok(slotsPending(config));
});

test("resolveConfig: sin --slots ni ONIA_BOT_SLOTS, si Cal.com responde reemplaza el placeholder", async () => {
  const live = [
    { key: "A", label: "lun 27/07 14:00", startAt: "2026-07-27T18:00:00Z", pending: false },
    { key: "B", label: "lun 27/07 16:00", startAt: "2026-07-27T20:00:00Z", pending: false },
  ];
  const getAvailableSlots = async () => ({ slots: live, source: "calcom", warnings: [] });
  const config = await conAgendaPropia(() => resolveConfig({}, { getAvailableSlots, nowIso: NOW }));
  assert.deepEqual(config.slots, live);
});

test("resolveConfig: si Cal.com no responde, cae al placeholder sin tirar", async () => {
  const getAvailableSlots = async () => ({ slots: null, source: "error", warnings: ["calcom: caido"] });
  const config = await conAgendaPropia(() => resolveConfig({}, { getAvailableSlots }));
  // Lo que importa es que NO se inventen horarios, no que sea el mismo objeto en memoria.
  assert.deepEqual(config.slots, DEFAULT_CONFIG.slots, "no se fabrica un horario porque Cal.com no conteste");
  assert.ok(slotsPending(config), "queda el placeholder, que es lo que frena el envio de M3");
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
  assert.equal(hoursBetween(T0, NOW), 22);
  assert.equal(hoursBetween("no", NOW), null);
});

test("renderHuman muestra a quien se le manda, a quien no y por que", async () => {
  const fake = memoryStore([row(), row({ conversation_key: "telegram:9", contact_ref: "9", opt_out_at: T0 })]);
  const result = await runFollowUpSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: fake.store });
  const text = renderHuman(result);

  assert.match(text, /modo dry-run/);
  assert.match(text, /candidatas del barrido: 2/);
  assert.match(text, /MANDARIA \(1\)/);
  assert.match(text, /telegram:777 \[telegram\] Ana — esperando_horario, callado hace 22 h/);
  assert.match(text, /NO SE MANDA \(1\)/);
  assert.match(text, /telegram:9 — opt_out/);
});

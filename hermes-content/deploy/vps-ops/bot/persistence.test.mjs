// ONIA — Chatbot propio: pruebas de PERSISTENCIA y del EJECUTOR DE TURNO.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. MODO SIN BASE (el fallback que pide el contrato): sin credenciales, sin red, con 5xx o
//      con JSON roto, ninguna funcion tira: devuelve null y apila el motivo. El bot sigue
//      hablando con el estado en memoria. Una base caida NO puede dejar mudo al bot.
//   2. DEDUP: si el inbound ya estaba, el turno corta ANTES de persistir, de mandar y de
//      tocar el lead. Un duplicado de Telegram/Meta no avanza el embudo ni escribe dos veces.
//   3. CONTRATO CON EL PANEL: pipeline_status solo puede ser uno de los 6 valores; el handoff
//      entra en review_queue con source_type 'lead'; las claves son DETERMINISTAS (reintentar
//      el mismo turno no duplica lead ni tarjeta).
//
// No hay red real en ninguna prueba: el fetch se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig } from "./config.mjs";
import { createState } from "./bot-engine.mjs";
import { runTurn } from "./run-turn.mjs";
import {
  PIPELINE_STATUSES,
  buildLeadRow,
  buildMessageRow,
  createStore,
  leadKeyFor,
  safeChannel,
  safePipelineStatus,
  slug,
  stateFromRow,
} from "./persistence.mjs";

const CONFIG = createBotConfig({
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario

/** Store real apuntando a un fetch de mentira, para ver EXACTAMENTE que request sale. */
function recorder(responses = []) {
  const requests = [];
  let index = 0;
  const fetchImpl = async (url, init = {}) => {
    requests.push({
      url: String(url),
      method: init.method || "GET",
      prefer: (init.headers || {}).Prefer || null,
      profile: (init.headers || {})["Content-Profile"] || null,
      body: init.body ? JSON.parse(init.body) : null,
    });
    const next = responses[index++] ?? { status: 200, body: [] };
    if (next.throws) throw new Error(next.throws);
    return {
      ok: next.status < 400,
      status: next.status,
      text: async () => (typeof next.body === "string" ? next.body : JSON.stringify(next.body ?? [])),
    };
  };
  return { requests, store: createStore({ url: "https://sb.test", key: "service-role-fake", fetch: fetchImpl }) };
}

/** Store de mentira con memoria: sirve para correr una conversacion entera por runTurn(). */
function memoryStore(options = {}) {
  const calls = [];
  let saved = options.initialState || null;
  const seen = new Set();
  return {
    calls,
    get state() {
      return saved;
    },
    store: {
      enabled: true,
      warnings: [],
      async ensureConversation(seed) {
        calls.push("ensureConversation");
        return saved || null;
      },
      async claimInbound(message) {
        calls.push("claimInbound");
        if (options.duplicate) return false;
        if (options.noDedup) return null;
        if (seen.has(message.messageKey)) return false;
        seen.add(message.messageKey);
        return true;
      },
      async applySideEffects(effects, state) {
        calls.push("applySideEffects");
        const deferredTypes = ["notify_sergio", "calendar_event", "llm_request", "stage_change"];
        return {
          leadKey: (effects || []).some((effect) => effect.type === "lead_upsert")
            ? leadKeyFor(state.conversationKey)
            : state.leadKey || null,
          reviewKeys: (effects || []).filter((effect) => effect.type === "review_queue").map(() => "rev-fake"),
          auditKeys: [],
          deferred: (effects || []).filter((effect) => deferredTypes.includes(effect.type)),
          failed: [],
        };
      },
      async saveConversation(state) {
        calls.push("saveConversation");
        saved = state;
        return { conversation_key: state.conversationKey };
      },
      async insertOutbound(rows) {
        calls.push("insertOutbound");
        return rows.length;
      },
    },
  };
}

const turn = (extra = {}) => ({
  channel: "telegram",
  contact_ref: "777",
  text: "DEMO",
  message_key: "telegram:1",
  received_at: T0,
  ...extra,
});

// ---------------------------------------------------------------------------
// 1. Modo sin base: el fallback
// ---------------------------------------------------------------------------

test("sin credenciales el store queda deshabilitado y TODO devuelve null, sin tirar", async () => {
  const store = createStore({ url: "", key: "" });
  assert.equal(store.enabled, false);

  const state = createState({ channel: "sim", contactRef: "x" });
  assert.equal(await store.loadConversation("sim:x"), null);
  assert.equal(await store.ensureConversation({ conversationKey: "sim:x", channel: "sim", contactRef: "x" }), null);
  assert.equal(await store.saveConversation(state), null);
  assert.equal(await store.claimInbound({ messageKey: "k", direction: "inbound", text: "hola" }, state), null);
  assert.equal(await store.reserveFollowUp("sim:x"), null);
  assert.equal(await store.sweepFollowUpCandidates(T0), null);
  assert.equal(await store.upsertLead({ pipelineStatus: "Contactado" }, state), null);
  assert.equal(await store.enqueueReview({}, state), null);
  assert.equal(await store.writeAudit({}, state), null);

  assert.ok(store.warnings.length >= 8, "cada fallo deja rastro");
  assert.ok(store.warnings.every((warning) => warning.includes("sin credenciales")));
});

test("insertOutbound sin base: 0 mensajes es 0, y con mensajes es null (no miente)", async () => {
  const store = createStore({ url: "", key: "" });
  const state = createState({ channel: "sim", contactRef: "x" });
  assert.equal(await store.insertOutbound([], state), 0);
  assert.equal(await store.insertOutbound([{ messageKey: "a", text: "hola" }], state), null);
});

test("ante red caida, 5xx o JSON roto devuelve null y apila el motivo", async () => {
  const cases = [
    { throws: "ECONNREFUSED" },
    { status: 500, body: "boom" },
    { status: 200, body: "{no-json" },
  ];
  for (const response of cases) {
    const { store } = recorder([response]);
    const result = await store.loadConversation("telegram:777");
    assert.equal(result, null, `caso ${JSON.stringify(response)} deberia devolver null`);
    assert.equal(store.warnings.length, 1);
  }
});

test("un turno completo funciona sin base: el bot responde igual (estado en memoria)", async () => {
  const store = createStore({ url: "", key: "" });
  const result = await runTurn(turn(), { store, config: CONFIG, nowIso: T0, llm: async () => "" });

  assert.equal(result.ok, true);
  assert.equal(result.duplicate, false);
  assert.equal(result.stageBefore, "nuevo");
  assert.equal(result.stageAfter, "esperando_horario");
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].templateKey, "M0");
  assert.match(result.send[0].text, /asistente automático/);
  assert.equal(result.persisted.conversation, false, "no se guardo nada, y se dice");
  assert.equal(result.leadKey, null);
  assert.ok(result.warnings.length > 0, "el turno reporta que corrio a ciegas");
});

test("sin base no hay memoria entre turnos: cada mensaje arranca en 'nuevo' (falla al guion, no a un estado inventado)", async () => {
  const store = createStore({ url: "", key: "" });
  const uno = await runTurn(turn(), { store, config: CONFIG, nowIso: T0, llm: async () => "" });
  const dos = await runTurn(turn({ text: "es mia, 2 sillones, santa cruz", message_key: "telegram:2" }), {
    store,
    config: CONFIG,
    nowIso: T0,
    llm: async () => "",
  });
  assert.equal(uno.stageAfter, "esperando_horario");
  assert.equal(dos.stageBefore, "nuevo");
  assert.ok(dos.send.length > 0, "sigue contestando: nunca queda mudo");
});

// ---------------------------------------------------------------------------
// 2. Dedup
// ---------------------------------------------------------------------------

test("si el inbound ya estaba, el turno corta: no manda, no guarda, no toca el lead", async () => {
  const fake = memoryStore({ duplicate: true });
  const result = await runTurn(turn(), { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" });

  assert.equal(result.duplicate, true);
  assert.deepEqual(result.send, []);
  assert.deepEqual(result.notes, ["mensaje_ya_procesado"]);
  assert.deepEqual(fake.calls, ["ensureConversation", "claimInbound"], "corta antes de escribir");
});

test("el mismo message_key dos veces avanza el embudo UNA sola vez", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };
  const primero = await runTurn(turn(), deps);
  const repetido = await runTurn(turn(), deps);

  assert.equal(primero.duplicate, false);
  assert.equal(repetido.duplicate, true);
  assert.equal(fake.state.botStage, "esperando_horario", "el estado no avanzo dos veces");
});

test("sin dedup disponible (base caida) el turno sigue, pero lo avisa", async () => {
  const fake = memoryStore({ noDedup: true });
  const result = await runTurn(turn(), { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" });
  assert.equal(result.duplicate, false);
  assert.equal(result.send.length, 1);
  assert.ok(fake.store.warnings.some((warning) => warning.includes("sin dedup")));
});

// ---------------------------------------------------------------------------
// 3. Conversacion entera a traves del ejecutor
// ---------------------------------------------------------------------------

test("camino feliz por runTurn: ofrece, agenda, califica, crea el lead y avisa a Sergio", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };

  const uno = await runTurn(turn(), deps);
  const dos = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);
  const tres = await runTurn(turn({ text: "tengo una ferreteria, somos 5 y estoy en Santa Cruz", message_key: "telegram:3" }), deps);

  assert.equal(uno.stageAfter, "esperando_horario");
  assert.match(uno.send[0].text, /jueves 15:00/, "la oferta va en el primer mensaje");
  assert.equal(uno.leadKey, "bot-telegram-777", "el lead nace con la oferta, con clave determinista");
  assert.equal(dos.stageAfter, "demo_agendada");
  assert.match(dos.send[0].text, /jueves 15:00/);
  assert.equal(dos.calendar.length, 1, "el evento de calendario queda para n8n");
  assert.equal(dos.notify.length, 1, "y el aviso a Sergio tambien");
  assert.equal(tres.stageAfter, "demo_agendada", "los datos llegan despues, sin mover la reserva");
  assert.deepEqual(fake.state.qualification, { industry: "comercio", teamSize: 5, city: "Santa Cruz" });
});

// El link de la reunion viaja EN M2, no el dia de la demo. Es el unico momento garantizado dentro
// de la ventana de servicio de 24 h de Meta (el prospecto acaba de escribir): a quien reserva para
// dentro de 3 dias ya no se le puede escribir, y M2 prometia justamente eso.
test("cuando Cal.com confirma la reserva, el link se manda en el MISMO mensaje que la confirma", async () => {
  const fake = memoryStore();
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const deps = {
    store: fake.store,
    config: enVivo,
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    createBooking: async () => ({ ok: true, uid: "uid-abc", reason: "reservado", warnings: [] }),
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  assert.equal(agendada.stageAfter, "demo_agendada");
  assert.match(agendada.send[0].text, /https:\/\/cal\.test\/booking\/uid-abc/, "el prospecto se va con el link");
  assert.equal(fake.state.calendarEventId, "uid-abc", "y el uid queda guardado para el recordatorio");
});

test("si la reserva NO sale, no se manda un link inventado: solo el aviso honesto", async () => {
  const fake = memoryStore();
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const deps = {
    store: fake.store,
    config: enVivo,
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    createBooking: async () => ({ ok: false, uid: null, reason: "horario_tomado", warnings: [] }),
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  assert.ok(!/cal\.test\/booking/.test(agendada.send[0].text), "sin reserva no hay link");
  assert.match(agendada.send[0].text, /se me ocupó ese horario/);
  assert.equal(fake.state.calendarEventId, null);
});

test("un humano tomo la conversacion: el ejecutor no devuelve nada para enviar", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };
  await runTurn(turn(), deps);
  const tomado = await runTurn(turn({ text: "hola?", message_key: "telegram:9", human_takeover: true }), deps);

  assert.deepEqual(tomado.send, []);
  assert.equal(tomado.humanTookOver, true);
  assert.ok(tomado.notes.includes("silencio:humano_a_cargo"));
});

test("la rama LLM: si el modelo no contesta sale el texto seguro, nunca el marcador interno", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };
  await runTurn(turn(), deps);
  const confuso = await runTurn(turn({ text: "mmm depende", message_key: "telegram:2" }), deps);

  assert.equal(confuso.send.length, 1);
  assert.equal(confuso.send[0].templateKey, "safe_reply");
  assert.equal(confuso.send[0].replySource, "script");
  assert.ok(!confuso.send[0].text.includes("LLM_PENDIENTE"));
});

test("la rama LLM: el texto del modelo pasa por el guardrail antes de salir", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "Te lo dejo en 750 Bs, garantizado." };
  await runTurn(turn(), deps);
  const confuso = await runTurn(turn({ text: "mmm depende", message_key: "telegram:2" }), deps);

  assert.equal(confuso.send[0].guardrailOk, false, "cotizar es violacion");
  assert.ok(!/750/.test(confuso.send[0].text), "la cifra no llega al prospecto");
});

// ---------------------------------------------------------------------------
// 4. Contrato con la base (requests reales contra un fetch de mentira)
// ---------------------------------------------------------------------------

test("claimInbound inserta con on_conflict=message_key e ignore-duplicates", async () => {
  const { store, requests } = recorder([{ status: 201, body: [{ id: "1" }] }]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  const claimed = await store.claimInbound(
    { messageKey: "telegram:1", direction: "inbound", author: "contact", text: "DEMO", stageBefore: "nuevo", stageAfter: "esperando_calificacion" },
    state,
    { externalMessageId: "1" },
  );

  assert.equal(claimed, true);
  assert.equal(requests[0].method, "POST");
  assert.match(requests[0].url, /bot_messages\?on_conflict=message_key$/);
  assert.equal(requests[0].prefer, "resolution=ignore-duplicates,return=representation");
  assert.equal(requests[0].profile, "onia_center");
  assert.equal(requests[0].body.direction, "inbound");
  assert.equal(requests[0].body.author, "contact");
});

test("claimInbound devuelve false cuando PostgREST no inserto nada (reentrega)", async () => {
  const { store } = recorder([{ status: 201, body: [] }]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  assert.equal(await store.claimInbound({ messageKey: "telegram:1", direction: "inbound", text: "DEMO" }, state), false);
});

test("la reserva del follow-up es un CAS: filtra por paso 0, sin humano y sin opt-out", async () => {
  const { store, requests } = recorder([{ status: 200, body: [{ conversation_key: "telegram:777" }] }]);
  const reserved = await store.reserveFollowUp("telegram:777");

  assert.equal(reserved, true);
  assert.equal(requests[0].method, "PATCH");
  assert.match(requests[0].url, /followup_step=eq\.0/);
  assert.match(requests[0].url, /human_took_over=is\.false/);
  assert.match(requests[0].url, /opt_out_at=is\.null/);
  assert.deepEqual(requests[0].body, { followup_step: 1 });
});

test("si el CAS no reserva ninguna fila, NO se manda el follow-up", async () => {
  const { store } = recorder([{ status: 200, body: [] }]);
  assert.equal(await store.reserveFollowUp("telegram:777"), false);
});

test("el barrido pide solo conversaciones dentro de la ventana de Meta (20-24 h)", async () => {
  const { store, requests } = recorder([{ status: 200, body: [] }]);
  await store.sweepFollowUpCandidates("2026-07-28T14:05:00Z");

  assert.match(requests[0].url, /followup_step=eq\.0/);
  assert.match(requests[0].url, /bot_stage=in\.\(esperando_calificacion,esperando_horario\)/);
  assert.match(requests[0].url, /last_inbound_at=lte\.2026-07-27T18:05:00\.000Z/);
  assert.match(requests[0].url, /last_inbound_at=gte\.2026-07-27T14:05:00\.000Z/);
});

test("el lead se inserta una vez y despues se PATCHea (no se duplica ni se pisan notas humanas)", async () => {
  const state = { ...createState({ channel: "telegram", contactRef: "777" }), qualification: { ownsClinic: true, chairs: 2, city: "Santa Cruz" } };

  const nuevo = recorder([{ status: 200, body: [] }, { status: 201, body: [{ lead_key: "bot-telegram-777" }] }]);
  assert.equal(await nuevo.store.upsertLead({ pipelineStatus: "Contactado" }, state), "bot-telegram-777");
  assert.equal(nuevo.requests[1].method, "POST");
  assert.equal(nuevo.requests[1].body.pipeline_status, "Contactado");
  // El rubro sale de la calificacion, ya no se asume dental para todos.
  assert.equal(nuevo.requests[1].body.business_type, null);
  assert.equal(nuevo.requests[1].body.city, "Santa Cruz");

  const viejo = recorder([{ status: 200, body: [{ lead_key: "bot-telegram-777", raw: { humano: "no tocar" } }] }, { status: 200, body: [{}] }]);
  assert.equal(await viejo.store.upsertLead({ pipelineStatus: "Reunion" }, state), "bot-telegram-777");
  assert.equal(viejo.requests[1].method, "PATCH");
  assert.equal(viejo.requests[1].body.pipeline_status, "Reunion");
  assert.equal(viejo.requests[1].body.raw.humano, "no tocar", "el raw se mergea, no se pisa");
  assert.equal(viejo.requests[1].body.private_notes, undefined, "las notas del humano ni se tocan");
});

test("el handoff entra en review_queue como 'lead', pendiente, sensible y para Sergio", async () => {
  const { store, requests } = recorder([{ status: 201, body: [{ review_key: "x" }] }]);
  const state = { ...createState({ channel: "telegram", contactRef: "777" }), leadKey: "bot-telegram-777" };
  const key = await store.enqueueReview({ sourceType: "lead", reviewerRoleKey: "sergio", sensitive: true, status: "pending", summary: "resumen" }, state, 3);

  assert.equal(key, "rev-bot-telegram-777-3", "clave determinista por turno: reintentar no duplica");
  assert.equal(requests[0].body.source_type, "lead");
  assert.equal(requests[0].body.source_key, "bot-telegram-777");
  assert.equal(requests[0].body.status, "pending");
  assert.equal(requests[0].body.sensitive, true);
  assert.equal(requests[0].body.reviewer_role_key, "sergio");
  assert.equal(requests[0].prefer, "resolution=ignore-duplicates,return=representation");
});

test("applySideEffects escribe lo de base y deja para n8n lo que necesita un servicio externo", async () => {
  const { store, requests } = recorder([
    { status: 200, body: [] },
    { status: 201, body: [{ lead_key: "bot-telegram-777" }] },
    { status: 201, body: [{ review_key: "rev" }] },
    { status: 201, body: [{ audit_key: "aud" }] },
  ]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  const applied = await store.applySideEffects(
    [
      { type: "lead_upsert", payload: { pipelineStatus: "Reunion" } },
      { type: "review_queue", payload: { summary: "x" } },
      { type: "audit_log", payload: { action: "bot_stage_change" } },
      { type: "calendar_event", payload: {} },
      { type: "notify_sergio", payload: {} },
    ],
    state,
    2,
  );

  assert.equal(applied.leadKey, "bot-telegram-777");
  assert.equal(applied.reviewKeys.length, 1);
  assert.equal(applied.auditKeys.length, 1);
  assert.deepEqual(applied.deferred.map((effect) => effect.type), ["calendar_event", "notify_sergio"]);
  assert.deepEqual(applied.failed, []);
  assert.equal(requests.length, 4);
});

test("si falla una escritura, applySideEffects la marca en `failed` y sigue con las demas", async () => {
  const { store } = recorder([{ status: 500, body: "boom" }, { status: 201, body: [{ review_key: "rev" }] }]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  const applied = await store.applySideEffects(
    [{ type: "lead_upsert", payload: {} }, { type: "review_queue", payload: {} }],
    state,
    0,
  );
  assert.deepEqual(applied.failed, ["lead_upsert"]);
  assert.equal(applied.reviewKeys.length, 1);
});

// ---------------------------------------------------------------------------
// 5. Helpers de contrato
// ---------------------------------------------------------------------------

test("pipeline_status: solo los 6 valores del panel; cualquier invento cae al fallback", () => {
  assert.deepEqual(PIPELINE_STATUSES, ["Nuevo", "Contactado", "Reunion", "Propuesta", "Ganado", "Perdido"]);
  for (const status of PIPELINE_STATUSES) assert.equal(safePipelineStatus(status), status);
  assert.equal(safePipelineStatus("Reunión"), "Nuevo", "con tilde NO existe en el panel");
  assert.equal(safePipelineStatus("demo_agendada"), "Nuevo");
  assert.equal(safePipelineStatus(undefined, "Contactado"), "Contactado");
});

test("al agendar la demo el lead queda en 'Reunion' (valor exacto del CHECK del panel)", () => {
  const state = { ...createState({ channel: "telegram", contactRef: "777" }), scheduledAt: "2026-07-30T19:00:00Z" };
  const row = buildLeadRow({ pipelineStatus: "Reunion" }, state);
  assert.equal(row.pipeline_status, "Reunion");
  assert.equal(row.priority, "alta");
  assert.equal(row.next_followup_at, "2026-07-30T19:00:00Z");
});

test("el lead nunca inventa el nombre NI el rubro del negocio", () => {
  const anonimo = buildLeadRow({}, createState({ channel: "telegram", contactRef: "777" }));
  assert.match(anonimo.company_name, /sin nombre/);
  assert.equal(anonimo.business_type, null, "sin rubro capturado no se inventa uno");

  // El bot atiende cualquier rubro: llamar "Clinica de X" a una ferreteria metia un dato falso
  // en el CRM. Ahora el nombre lleva el rubro real cuando esta, y nada cuando no.
  const base = createState({ channel: "telegram", contactRef: "777" });
  const soloCiudad = buildLeadRow({}, { ...base, displayName: "Ana", qualification: { city: "Tarija" } });
  assert.equal(soloCiudad.company_name, "Ana (Tarija)");
  assert.ok(!/Clínica/.test(soloCiudad.company_name), "no se asume clinica");

  const conRubro = buildLeadRow({}, { ...base, displayName: "Ana", qualification: { city: "Tarija", industry: "ferreteria" } });
  assert.equal(conRubro.company_name, "Ana — ferreteria (Tarija)");
  assert.equal(conRubro.business_type, "ferreteria");
});

test("el permiso de contacto sigue al opt-in / opt-out, no al humor del bot", () => {
  const base = createState({ channel: "telegram", contactRef: "777" });
  assert.equal(buildLeadRow({}, base).contact_permission, "pending");
  assert.equal(buildLeadRow({}, { ...base, optInAt: T0 }).contact_permission, "approved");
  assert.equal(buildLeadRow({}, { ...base, optInAt: T0, optOutAt: T0 }).contact_permission, "no_contact");
});

test("buildMessageRow sanea lo que va a la base (body nunca vacio, enums validados)", () => {
  const state = createState({ channel: "telegram", contactRef: "777" });
  const row = buildMessageRow(
    { messageKey: "out:1", direction: "raro", author: "marciano", text: "   ", replySource: "inventado", deliveryStatus: "explotado", guardrail: { ok: false, violations: ["cotizar"] } },
    state,
  );
  assert.equal(row.direction, "outbound");
  assert.equal(row.author, "bot");
  assert.equal(row.body, "(sin texto)");
  assert.equal(row.reply_source, "script");
  assert.equal(row.delivery_status, "simulated");
  assert.equal(row.guardrail_ok, false);
  assert.deepEqual(row.guardrail_violations, ["cotizar"]);
});

test("claves deterministas: el mismo prospecto no genera dos leads", () => {
  assert.equal(leadKeyFor("telegram:777"), leadKeyFor("telegram:777"));
  assert.equal(leadKeyFor("telegram:777"), "bot-telegram-777");
  assert.equal(slug("WhatsApp:591 78491375"), "whatsapp-591-78491375");
  assert.equal(slug(""), "sin-clave");
});

test("safeChannel respeta el CHECK de la tabla", () => {
  for (const channel of ["sim", "telegram", "whatsapp", "instagram", "chatwoot"]) assert.equal(safeChannel(channel), channel);
  assert.equal(safeChannel("tiktok"), "sim");
});

test("stateFromRow reconstruye el estado del motor, contadores incluidos", () => {
  const state = stateFromRow({
    conversation_key: "telegram:777",
    channel: "telegram",
    contact_ref: "777",
    bot_stage: "esperando_horario",
    qualification: { ownsClinic: true, chairs: 2, city: "Santa Cruz" },
    slots_offered: [{ key: "A", label: "jueves 15:00" }],
    human_took_over: false,
    followup_step: 0,
    off_script_count: 1,
    raw: { qualifyAsks: 2, outboundSeq: 5, scheduledLabel: "jueves 15:00" },
  });
  assert.equal(state.botStage, "esperando_horario");
  assert.equal(state.qualifyAsks, 2);
  assert.equal(state.outboundSeq, 5);
  assert.equal(state.scheduledLabel, "jueves 15:00");
  assert.equal(stateFromRow(null), null);
});

test("un bot_stage desconocido en la base no rompe: cae a 'nuevo'", () => {
  const state = stateFromRow({ conversation_key: "sim:x", channel: "sim", contact_ref: "x", bot_stage: "inventado" });
  assert.equal(state.botStage, "nuevo");
});

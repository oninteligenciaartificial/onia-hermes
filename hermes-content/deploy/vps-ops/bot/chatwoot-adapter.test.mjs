// ONIA — Chatbot propio: pruebas del ADAPTADOR DE CHATWOOT.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Los payloads de fixture son RECORTES DE PAYLOADS REALES: se capturaron en vivo contra la
// cuenta 2 de Chatwoot el 2026-07-26 (inbox "ONIA Demo", webhook apuntado a webhook.site) para
// no adivinar la forma del webhook.
//
// Lo que se cubre y por que:
//   1. parseChatwootWebhook: entrante -> turno; saliente/nota privada -> skip (LA REGLA MAS FACIL
//      DE ROMPER: si esto falla, el bot se contesta a si mismo en loop infinito).
//   2. conversation_created: sin mensajes todavia -> skip (nada que contestar); con mensaje
//      entrante embebido -> turno (formas numericas de message_type/created_at, no las de
//      arriba).
//   3. createChatwootClient: arma el POST correcto y es TOLERANTE (nunca tira) ante 4xx/5xx/
//      red caida/sin token.
//   4. runChatwootTurn con runTurn MOCKEADO: aisla la orquestacion (cuantas veces se llama al
//      motor y al cliente) del motor real.
//   5. INTEGRACION EN PROCESO con el runTurn REAL (bot-engine + persistencia en memoria) y solo
//      el fetch de Chatwoot mockeado: prueba punta a punta que un mensaje real dispara M0, que el
//      eco de esa MISMA respuesta (el webhook que Chatwoot manda por su propio mensaje saliente)
//      NO reinicia el bot, y que reenviar el mismo webhook no duplica el envio.
//
// No hay red real en ninguna prueba: el fetch se inyecta siempre.

import test from "node:test";
import assert from "node:assert/strict";

import {
  createChatwootClient,
  normalizeMessageType,
  parseChatwootWebhook,
  runChatwootTurn,
  toIsoFlexible,
} from "./chatwoot-adapter.mjs";
import { createBotConfig } from "./config.mjs";
import { leadKeyFor } from "./persistence.mjs";

// dryRun:false a proposito: estas pruebas verifican el envio REAL (posted:true). El gate de
// dry-run tiene su propia prueba dedicada mas abajo (misma logica de "encendido en dos pasos"
// que Telegram, ver N8N_WORKFLOW.md §4.6).
const CONFIG = createBotConfig({
  dryRun: false,
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

// ---------------------------------------------------------------------------
// Fixtures — recortes de los payloads REALES capturados el 2026-07-26
// ---------------------------------------------------------------------------

function incomingFixture(overrides = {}) {
  return {
    event: "message_created",
    id: 13,
    content: "DEMO",
    content_type: "text",
    message_type: "incoming",
    private: false,
    created_at: "2026-07-26T15:24:09.329Z",
    sender: { id: 2, identifier: "prospecto-prueba-onia-001", name: "Prospecto Prueba ONIA" },
    inbox: { id: 3, name: "ONIA Demo" },
    account: { id: 2, name: "OnIA Agency" },
    conversation: { id: 2, inbox_id: 3, contact_inbox: { source_id: "cdd3ed15-d385-4ab0-b5d4-a7f5b556aabf" } },
    ...overrides,
  };
}

/** El ECO real que Chatwoot manda por el PROPIO mensaje saliente del bot (mismo shape, message_type outgoing). */
function outgoingFixture(overrides = {}) {
  return {
    event: "message_created",
    id: 14,
    content: "Respuesta de prueba del bot",
    content_type: "text",
    message_type: "outgoing",
    private: false,
    created_at: "2026-07-26T15:24:10.018Z",
    sender: { id: 2, name: "OnIA", email: "oninteligenciaartificial@gmail.com", type: "user" },
    inbox: { id: 3, name: "ONIA Demo" },
    account: { id: 2, name: "OnIA Agency" },
    conversation: { id: 2, inbox_id: 3 },
    ...overrides,
  };
}

function conversationCreatedEmptyFixture(overrides = {}) {
  return {
    event: "conversation_created",
    id: 3,
    inbox_id: 3,
    status: "open",
    contact_inbox: { source_id: "21071b69-6cc5-4779-905a-332753e887cc" },
    messages: [],
    ...overrides,
  };
}

function conversationCreatedWithMessageFixture(overrides = {}) {
  return {
    event: "conversation_created",
    id: 5,
    inbox_id: 3,
    status: "open",
    messages: [
      {
        id: 20,
        content: "info porfa",
        message_type: 0, // NUMERICO adentro del arreglo anidado (distinto del nivel superior)
        private: false,
        created_at: 1785079449, // epoch-segundos, no ISO
        sender: { id: 7, identifier: "otro-prospecto", name: "Otro Prospecto", type: "contact" },
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1-2. parseChatwootWebhook
// ---------------------------------------------------------------------------

test("message_created entrante -> turno correcto (channel/contact_ref/message_key/kind)", () => {
  const parsed = parseChatwootWebhook(incomingFixture());
  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.channel, "chatwoot");
  assert.equal(parsed.turn.contact_ref, "2");
  assert.equal(parsed.turn.text, "DEMO");
  assert.equal(parsed.turn.kind, "text");
  assert.equal(parsed.turn.message_key, "chatwoot:2:13");
  assert.equal(parsed.turn.received_at, "2026-07-26T15:24:09.329Z");
  assert.equal(parsed.turn.display_name, "Prospecto Prueba ONIA");
  assert.equal(parsed.meta.conversationId, "2");
  assert.equal(parsed.meta.messageId, "13");
});

test("REGLA DE ORO: message_created saliente se ignora (si no, el bot se contesta a si mismo)", () => {
  const parsed = parseChatwootWebhook(outgoingFixture());
  assert.equal(parsed.skip, true);
  assert.match(parsed.reason, /^mensaje_no_entrante:outgoing$/);
});

test("nota privada (private:true) se ignora aunque diga 'incoming'", () => {
  const parsed = parseChatwootWebhook(incomingFixture({ private: true }));
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "nota_privada");
});

test("sin conversation.id no hay a donde contestar: se ignora", () => {
  const parsed = parseChatwootWebhook(incomingFixture({ conversation: {} }));
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "sin_conversation_id");
});

test("evento desconocido (conversation_updated, contact_created, etc.) se ignora explicitamente", () => {
  const parsed = parseChatwootWebhook({ event: "conversation_updated", id: 2 });
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "evento_no_manejado:conversation_updated");
});

test("conversation_created sin mensajes todavia: nada que contestar, se ignora", () => {
  const parsed = parseChatwootWebhook(conversationCreatedEmptyFixture());
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "conversacion_sin_mensajes_todavia");
});

test("conversation_created CON el primer mensaje embebido: arma el turno (message_type numerico + epoch)", () => {
  const parsed = parseChatwootWebhook(conversationCreatedWithMessageFixture());
  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.contact_ref, "5");
  assert.equal(parsed.turn.text, "info porfa");
  assert.equal(parsed.turn.message_key, "chatwoot:5:20");
  assert.equal(parsed.turn.received_at, "2026-07-26T15:24:09.000Z", "epoch-segundos convertido a ISO");
});

test("conversation_created con el primer mensaje saliente embebido: se ignora igual", () => {
  const parsed = parseChatwootWebhook(
    conversationCreatedWithMessageFixture({ messages: [{ id: 21, content: "hola", message_type: 1, private: false }] }),
  );
  assert.equal(parsed.skip, true);
  assert.match(parsed.reason, /^mensaje_no_entrante:outgoing$/);
});

test("adjunto sin texto -> kind 'attachment'; audio sin texto -> kind 'voice'", () => {
  const conAdjunto = parseChatwootWebhook(incomingFixture({ content: "", attachments: [{ file_type: "image" }] }));
  assert.equal(conAdjunto.turn.kind, "attachment");
  const conAudio = parseChatwootWebhook(incomingFixture({ content: "", attachments: [{ file_type: "audio" }] }));
  assert.equal(conAudio.turn.kind, "voice");
});

test("normalizeMessageType acepta string y numerico; toIsoFlexible acepta ISO y epoch-segundos", () => {
  assert.equal(normalizeMessageType("incoming"), "incoming");
  assert.equal(normalizeMessageType(0), "incoming");
  assert.equal(normalizeMessageType("outgoing"), "outgoing");
  assert.equal(normalizeMessageType(1), "outgoing");
  assert.equal(normalizeMessageType("template"), "template");
  assert.equal(normalizeMessageType(undefined), "");

  assert.equal(toIsoFlexible("2026-07-26T15:24:09.329Z"), "2026-07-26T15:24:09.329Z");
  assert.equal(toIsoFlexible(1785079449), "2026-07-26T15:24:09.000Z");
  assert.equal(toIsoFlexible(null), null);
  assert.equal(toIsoFlexible("no-es-fecha"), null);
});

// ---------------------------------------------------------------------------
// 3. createChatwootClient — el POST y la tolerancia
// ---------------------------------------------------------------------------

test("sendMessage arma el POST exacto: url, header api_access_token, message_type outgoing", async () => {
  const requests = [];
  const fetchImpl = async (url, init) => {
    requests.push({ url: String(url), method: init.method, headers: init.headers, body: JSON.parse(init.body) });
    return { ok: true, status: 200, text: async () => JSON.stringify({ id: 99 }) };
  };
  const client = createChatwootClient({ baseUrl: "https://sb.test", accountId: "2", token: "tok-fake", fetch: fetchImpl });
  const result = await client.sendMessage("7", "Hola, soy el bot");

  assert.deepEqual(result, { id: 99 });
  assert.equal(requests[0].url, "https://sb.test/api/v1/accounts/2/conversations/7/messages");
  assert.equal(requests[0].method, "POST");
  assert.equal(requests[0].headers.api_access_token, "tok-fake");
  assert.equal(requests[0].body.content, "Hola, soy el bot");
  assert.equal(requests[0].body.message_type, "outgoing");
});

test("sendMessage con texto vacio no llama a la red", async () => {
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async (url) => {
      requests.push(url);
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });
  assert.equal(await client.sendMessage("7", ""), null);
  assert.equal(await client.sendMessage("7", "   "), null);
  assert.equal(requests.length, 0);
});

test("sendMessage tolera 4xx/5xx/red caida/JSON roto: nunca tira, devuelve null y deja el motivo", async () => {
  const casos = [
    { status: 401, body: "unauthorized" },
    { status: 500, body: "boom" },
    { throws: "ECONNREFUSED" },
    { status: 200, body: "{no-es-json" },
  ];
  for (const caso of casos) {
    const client = createChatwootClient({
      baseUrl: "https://sb.test",
      accountId: "2",
      token: "tok",
      fetch: async () => {
        if (caso.throws) throw new Error(caso.throws);
        return { ok: caso.status < 400, status: caso.status, text: async () => caso.body };
      },
    });
    const result = await client.sendMessage("7", "hola");
    assert.notEqual(result, undefined, `caso ${JSON.stringify(caso)} no deberia tirar`);
    if (!caso.status || caso.status >= 400 || caso.throws) assert.equal(result, null);
  }
});

test("sin token configurado: no intenta la red, deja el motivo en warnings", async () => {
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "",
    fetch: async (url) => {
      requests.push(url);
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });
  assert.equal(await client.sendMessage("7", "hola"), null);
  assert.equal(requests.length, 0);
  assert.ok(client.warnings.some((w) => w.includes("sin token")));
});

// ---------------------------------------------------------------------------
// 4. runChatwootTurn — orquestacion con runTurn MOCKEADO
// ---------------------------------------------------------------------------

function fakeClient() {
  const calls = [];
  return {
    calls,
    client: {
      warnings: [],
      async sendMessage(conversationId, text) {
        calls.push({ conversationId, text });
        return { id: calls.length };
      },
    },
  };
}

test("entrante: llama al motor UNA vez y postea cada mensaje de send[] en orden", async () => {
  const { calls, client } = fakeClient();
  let runTurnCalls = 0;
  const fakeRunTurn = async () => {
    runTurnCalls += 1;
    return { ok: true, duplicate: false, send: [{ text: "M0 disclosure" }, { text: "M0 preguntas" }], warnings: [] };
  };

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(runTurnCalls, 1);
  assert.equal(result.skipped, false);
  assert.equal(result.sent.length, 2);
  assert.deepEqual(calls.map((c) => c.text), ["M0 disclosure", "M0 preguntas"]);
  assert.ok(calls.every((c) => c.conversationId === "2"));
});

test("saliente (eco del propio bot o de un humano en la UI): NO llama al motor ni al cliente — sin loop", async () => {
  const { calls, client } = fakeClient();
  let runTurnCalls = 0;
  const fakeRunTurn = async () => {
    runTurnCalls += 1;
    return { ok: true, duplicate: false, send: [{ text: "esto no deberia salir" }] };
  };

  const result = await runChatwootTurn(outgoingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(runTurnCalls, 0, "el motor ni se entera de un mensaje saliente");
  assert.equal(calls.length, 0, "no se postea nada: hubiera sido un loop");
  assert.equal(result.skipped, true);
  assert.match(result.reason, /^mensaje_no_entrante:outgoing$/);
});

test("duplicado (el motor ya lo proceso): no postea nada, pero ok sigue true", async () => {
  const { calls, client } = fakeClient();
  const fakeRunTurn = async () => ({ ok: true, duplicate: true, send: [] });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(result.sent.length, 0);
  assert.equal(calls.length, 0);
});

test("si el motor devuelve ok:false, no se postea nada", async () => {
  const { calls, client } = fakeClient();
  const fakeRunTurn = async () => ({ ok: false, send: [], error: "boom" });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(result.ok, false);
  assert.equal(calls.length, 0);
});

test("encendido en dos pasos (igual que Telegram): con dryRun:true el motor calcula la respuesta real, pero NO se postea", async () => {
  const { calls, client } = fakeClient();
  const fakeRunTurn = async () => ({ ok: true, duplicate: false, dryRun: true, send: [{ text: "M0 de verdad" }] });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(calls.length, 0, "nada llega a la API real de Chatwoot en dry-run");
  assert.equal(result.sent.length, 1, "pero se reporta que se HABRIA mandado, para leerlo en el panel");
  assert.equal(result.sent[0].posted, false);
  assert.equal(result.sent[0].reason, "dry_run");
  assert.equal(result.sent[0].text, "M0 de verdad");
});

// ---------------------------------------------------------------------------
// 5. Integracion en proceso: runTurn REAL (bot-engine + persistencia en memoria),
//    solo el fetch de Chatwoot mockeado. Prueba punta a punta el anti-loop y el dedup.
// ---------------------------------------------------------------------------

/** Store en memoria con dedup REAL por message_key (igual contrato que persistence.mjs). */
function memoryStore() {
  let saved = null;
  const seenMessageKeys = new Set();
  return {
    get state() {
      return saved;
    },
    store: {
      enabled: true,
      warnings: [],
      async ensureConversation() {
        return saved || null;
      },
      async claimInbound(message) {
        if (seenMessageKeys.has(message.messageKey)) return false;
        seenMessageKeys.add(message.messageKey);
        return true;
      },
      async applySideEffects(effects, state) {
        return {
          leadKey: (effects || []).some((e) => e.type === "lead_upsert") ? leadKeyFor(state.conversationKey) : state.leadKey || null,
          reviewKeys: [],
          auditKeys: [],
          deferred: (effects || []).filter((e) => ["notify_sergio", "calendar_event", "llm_request", "stage_change"].includes(e.type)),
          failed: [],
        };
      },
      async saveConversation(state) {
        saved = state;
        return { conversation_key: state.conversationKey };
      },
      async insertOutbound(rows) {
        return rows.length;
      },
    },
  };
}

test("integracion punta a punta: DEMO real dispara M0 y se postea via la API de Chatwoot mockeada", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text) {
      posted.push({ conversationId, text });
      return { id: posted.length };
    },
  };

  const result = await runChatwootTurn(incomingFixture({ content: "DEMO" }), {
    store: fake.store,
    config: CONFIG,
    nowIso: "2026-07-27T14:05:00Z",
    llm: async () => "",
    client,
  });

  assert.equal(result.ok, true);
  assert.equal(result.duplicate, false);
  assert.equal(posted.length, 1);
  assert.equal(posted[0].conversationId, "2");
  assert.match(posted[0].text, /asistente automático/);
  assert.equal(fake.state.botStage, "esperando_calificacion");
});

test("integracion punta a punta: el ECO del mensaje que el bot acaba de mandar NO reinicia nada (sin loop)", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text) {
      posted.push({ conversationId, text });
      return { id: posted.length };
    },
  };
  const deps = { store: fake.store, config: CONFIG, nowIso: "2026-07-27T14:05:00Z", llm: async () => "", client };

  const uno = await runChatwootTurn(incomingFixture({ content: "DEMO" }), deps);
  assert.equal(posted.length, 1, "el bot mando M0");

  // Chatwoot manda su PROPIO webhook message_created por lo que el bot acaba de postear
  // (mismo texto, message_type outgoing, sender tipo 'user' porque se posteo con el token de
  // la cuenta) — esto es EXACTAMENTE lo que se vio en vivo al capturar el webhook real.
  const eco = outgoingFixture({ id: 15, content: posted[0].text });
  const dos = await runChatwootTurn(eco, deps);

  assert.equal(dos.skipped, true, "el eco se ignora: el motor ni se entera");
  assert.equal(posted.length, 1, "sigue en 1: no se poste dos veces, no hay loop");
  assert.equal(fake.state.botStage, "esperando_calificacion", "el estado no se toco con el eco");
});

test("integracion punta a punta: reenviar el MISMO webhook (reintento de Chatwoot) no duplica el envio", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text) {
      posted.push({ conversationId, text });
      return { id: posted.length };
    },
  };
  const deps = { store: fake.store, config: CONFIG, nowIso: "2026-07-27T14:05:00Z", llm: async () => "", client };
  const payload = incomingFixture({ content: "DEMO" });

  const uno = await runChatwootTurn(payload, deps);
  const reintento = await runChatwootTurn(payload, deps); // Chatwoot reintenta el mismo webhook

  assert.equal(uno.duplicate, false);
  assert.equal(reintento.duplicate, true, "mismo message_key -> el dedup de run-turn.mjs lo corta");
  assert.equal(posted.length, 1, "no se mando dos veces por el reintento");
});

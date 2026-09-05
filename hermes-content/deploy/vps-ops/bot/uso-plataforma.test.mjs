// ONIA — Chatbot propio: pruebas del REENVIO DEL ENTRANTE A LA PLATAFORMA (contador de cuota).
//   node --test "hermes-content/deploy/vps-ops/bot/uso-plataforma.test.mjs"
//
// Lo que se cubre y por que:
//   1. LA COMPUERTA: un entrante real viaja; un SALIENTE no viaja NUNCA. Si un saliente llegara a
//      la plataforma, esta lo tomaria por un mensaje del agente y lo relayearia a WhatsApp: el
//      cliente recibiria el mensaje DOS VECES. Es el modo de falla caro de este cambio.
//   2. NOTA PRIVADA / otros eventos: no cuentan, no viajan.
//   3. REENVIO TAL CUAL: sale el MISMO cuerpo crudo, con el header `X-Chatwoot-Secret`.
//   4. SIN CONFIGURACION no se manda nada, y el aviso se dice UNA vez (`repetido`).
//   5. EL TURNO NO SE ROMPE: con el POST tirando/colgado, la respuesta HTTP al usuario sale 200.

import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { once } from "node:events";

import {
  esEntranteReal,
  enviarUsoPlataforma,
  dispararUsoPlataforma,
  getUsoConfig,
  resetAvisoUso,
  USO_PATH,
} from "./uso-plataforma.mjs";
import { createWebhookServer, handleChatwootWebhook, WEBHOOK_PATH } from "./webhook-server.mjs";
import { _resetDedup } from "./message-dedup.mjs";

const SECRET = "secreto-de-prueba-no-va-al-repo";
const SECRETO_PLATAFORMA = "secreto-plataforma-de-prueba";
const NOW_MS = Date.UTC(2026, 8, 4, 12, 0, 0);

const CONFIG = {
  webhookSecret: SECRET,
  pathSecret: undefined,
  toleranceSeconds: 300,
  allowUnsigned: false,
  maxBodyBytes: 1024 * 1024,
};
const USO = { url: `https://app.onia.com.bo${USO_PATH}`, secret: SECRETO_PLATAFORMA };

/**
 * Payload real de Chatwoot. `conversation.inbox_id` va porque el modelo SIEMPRE lo manda
 * (verificado en el codigo vivo: Conversations::EventDataPresenter#push_data) y porque es lo que
 * la plataforma usa para resolver inbox -> organizacion.
 */
function mensajeEntrante(overrides = {}) {
  return JSON.stringify({
    event: "message_created",
    id: 4242,
    content: "hola, quiero una limpieza dental",
    message_type: "incoming",
    private: false,
    created_at: "2026-09-04T12:00:00Z",
    sender: { id: 9, name: "Prospecto Prueba" },
    inbox: { id: 7 },
    conversation: { id: 77, inbox_id: 7 },
    ...overrides,
  });
}

function sign(body, secret = SECRET, timestampSeconds = Math.floor(NOW_MS / 1000)) {
  const hex = createHmac("sha256", secret).update(`${timestampSeconds}.${body}`).digest("hex");
  return { "x-chatwoot-timestamp": String(timestampSeconds), "x-chatwoot-signature": `sha256=${hex}` };
}

function motorMock() {
  return async () => ({
    ok: true,
    skipped: false,
    duplicate: false,
    conversationId: "77",
    messageId: "4242",
    stageBefore: "nuevo",
    stageAfter: "esperando_calificacion",
    sent: [{ text: "Hola, soy el asistente de Onia.", posted: true }],
    warnings: [],
  });
}

test.beforeEach(() => {
  _resetDedup();
  resetAvisoUso();
});

// ---------------------------------------------------------------------------
// 1-2. La compuerta
// ---------------------------------------------------------------------------

test("esEntranteReal: pasa el entrante real y NADA mas", () => {
  const base = JSON.parse(mensajeEntrante());
  assert.equal(esEntranteReal(base), true);

  assert.equal(esEntranteReal({ ...base, message_type: "outgoing" }), false, "un SALIENTE jamas viaja");
  assert.equal(esEntranteReal({ ...base, private: true }), false, "una nota privada no cuenta");
  assert.equal(esEntranteReal({ ...base, event: "conversation_created" }), false);
  assert.equal(esEntranteReal({ ...base, conversation: { id: 77 } }), false, "sin inbox_id la plataforma no resuelve la org");
  assert.equal(esEntranteReal({ ...base, conversation: undefined }), false);
  assert.equal(esEntranteReal(null), false);
});

test("handleChatwootWebhook marca el reenvio en el entrante y NO en el saliente", async () => {
  const entrante = mensajeEntrante();
  const conEntrante = await handleChatwootWebhook(
    { rawBody: entrante, headers: sign(entrante), method: "POST", url: WEBHOOK_PATH },
    { config: CONFIG, nowMs: NOW_MS, runChatwootTurn: motorMock() },
  );
  assert.equal(conEntrante.usoPlataforma, entrante, "viaja el cuerpo CRUDO, byte por byte");

  const saliente = mensajeEntrante({ message_type: "outgoing", sender: { id: 3, type: "agent_bot" } });
  const conSaliente = await handleChatwootWebhook(
    { rawBody: saliente, headers: sign(saliente), method: "POST", url: WEBHOOK_PATH },
    { config: CONFIG, nowMs: NOW_MS, runChatwootTurn: motorMock() },
  );
  assert.equal(conSaliente.usoPlataforma ?? null, null, "el saliente no se reenvia NUNCA");

  const privada = mensajeEntrante({ private: true });
  const conPrivada = await handleChatwootWebhook(
    { rawBody: privada, headers: sign(privada), method: "POST", url: WEBHOOK_PATH },
    { config: CONFIG, nowMs: NOW_MS, runChatwootTurn: motorMock() },
  );
  assert.equal(conPrivada.usoPlataforma ?? null, null, "la nota privada no se reenvia");
});

test("un reintento de Chatwoot (mismo mensaje) no vuelve a contar", async () => {
  const body = mensajeEntrante();
  const req = { rawBody: body, headers: sign(body), method: "POST", url: WEBHOOK_PATH };
  const deps = { config: CONFIG, nowMs: NOW_MS, runChatwootTurn: motorMock() };

  const primera = await handleChatwootWebhook(req, deps);
  const segunda = await handleChatwootWebhook(req, deps);
  assert.equal(primera.usoPlataforma, body);
  assert.equal(segunda.usoPlataforma ?? null, null, "el dedup corta antes de armar el reenvio");
});

// ---------------------------------------------------------------------------
// 3-4. El envio
// ---------------------------------------------------------------------------

test("enviarUsoPlataforma manda el cuerpo tal cual con el header del secreto", async () => {
  const llamadas = [];
  const res = await enviarUsoPlataforma(
    mensajeEntrante(),
    USO,
    { fetch: async (url, init) => (llamadas.push({ url, init }), { ok: true, status: 200 }) },
  );

  assert.deepEqual(res, { ok: true, status: "sent", reason: "entrante contado en la plataforma" });
  assert.equal(llamadas.length, 1);
  assert.equal(llamadas[0].url, `https://app.onia.com.bo${USO_PATH}`);
  assert.equal(llamadas[0].init.method, "POST");
  assert.equal(llamadas[0].init.headers["X-Chatwoot-Secret"], SECRETO_PLATAFORMA);
  assert.equal(llamadas[0].init.body, mensajeEntrante(), "el payload NO se toca");
});

test("sin URL o sin secreto no se manda nada, y el aviso se dice UNA sola vez", async () => {
  let llamadas = 0;
  const fetchEspia = async () => (llamadas++, { ok: true, status: 200 });

  const sinUrl = await enviarUsoPlataforma("{}", { url: "", secret: "x" }, { fetch: fetchEspia });
  assert.equal(sinUrl.status, "skipped");
  assert.match(sinUrl.reason, /ONIA_PLATFORM_URL/);
  assert.equal(sinUrl.repetido, false, "la primera vez SI se avisa");

  const otraVez = await enviarUsoPlataforma("{}", { url: "", secret: "x" }, { fetch: fetchEspia });
  assert.equal(otraVez.repetido, true, "de la segunda en adelante, silencio");

  resetAvisoUso();
  const sinSecreto = await enviarUsoPlataforma("{}", { url: "https://x/y", secret: "" }, { fetch: fetchEspia });
  assert.match(sinSecreto.reason, /CHATWOOT_WEBHOOK_SECRET/);
  assert.equal(llamadas, 0, "nunca se toco la red");
});

test("getUsoConfig arma la ruta desde la base y tolera la barra final", () => {
  const c = getUsoConfig({ ONIA_PLATFORM_URL: "https://app.onia.com.bo/", CHATWOOT_WEBHOOK_SECRET: " s " });
  assert.equal(c.url, `https://app.onia.com.bo${USO_PATH}`);
  assert.equal(c.secret, "s");
  assert.equal(getUsoConfig({}).url, "");
});

test("un POST que falla o cuelga NUNCA rechaza ni reintenta", async () => {
  let intentos = 0;
  const explota = await enviarUsoPlataforma("{}", USO, {
    fetch: async () => {
      intentos++;
      throw new Error("ECONNREFUSED");
    },
  });
  assert.equal(explota.ok, false);
  assert.equal(explota.status, "failed");
  assert.match(explota.reason, /ECONNREFUSED/);
  assert.equal(intentos, 1, "un solo intento: nada de bucles de reintento");

  const rechazada = await enviarUsoPlataforma("{}", USO, { fetch: async () => ({ ok: false, status: 401 }) });
  assert.equal(rechazada.status, "failed");
  assert.match(rechazada.reason, /401/);

  // Y la version fire-and-forget tampoco tira nunca.
  const visto = [];
  dispararUsoPlataforma("{}", USO, { fetch: () => { throw new Error("boom"); } }, (r) => visto.push(r));
  await new Promise((r) => setImmediate(r));
  assert.equal(visto.length, 1);
  assert.equal(visto[0].ok, false);
});

// ---------------------------------------------------------------------------
// 5. El turno no se rompe
// ---------------------------------------------------------------------------

test("con el contador roto, el prospecto igual recibe su respuesta 200", async () => {
  const server = createWebhookServer({
    config: CONFIG,
    n8nConfig: { enabled: false },
    usoConfig: USO,
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
    fetchUso: async () => {
      throw new Error("la plataforma esta caida");
    },
    log: () => {},
  });

  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();

  try {
    const body = mensajeEntrante();
    const res = await fetch(`http://127.0.0.1:${port}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...sign(body) },
      body,
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.sent[0].posted, true, "la respuesta al prospecto salio igual");
  } finally {
    server.close();
    await once(server, "close");
  }
});

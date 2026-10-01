// ONIA — Chatbot propio: pruebas de la VERIFICACION INVERSA del WhatsApp del alta (plan B).
//   node --test "hermes-content/deploy/vps-ops/bot/verificacion-inversa.test.mjs"
//
// Lo que se cubre y por que:
//   1. APAGADA POR DEFECTO: sin ONIA_VERIFICACION_INVERSA=encendida el mensaje sigue al motor
//      como cualquier otro (hoy queda exactamente igual).
//   2. SOLO el inbox de Onia y SOLO el canal WhatsApp: el telefono del remitente lo da Meta. En el
//      widget o el inbox de API el telefono lo escribe cualquiera: ahi no se verifica nada.
//   3. EL PATRON: «Mi código de Onia es 123456». Un numero suelto en una charla de ventas no
//      dispara nada.
//   4. LA LLAMADA: Bearer con el secreto compartido, telefono + codigo; nunca loguea el secreto.
//   5. LA RESPUESTA: «Listo, tu WhatsApp quedó verificado» y el mensaje NO entra al embudo
//      (el motor no corre).
//   6. FAIL-CLOSED: plataforma caida, 401 o respuesta rara = no se dice verificado.

import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  codigoDelMensaje,
  getVerificacionInversaConfig,
  manejarVerificacionInversa,
  mensajeDeVerificacion,
  RESPUESTAS,
  verificarEnPlataforma,
} from "./verificacion-inversa.mjs";
import { handleChatwootWebhook, WEBHOOK_PATH } from "./webhook-server.mjs";
import { _resetDedup } from "./message-dedup.mjs";

const SECRETO = "s".repeat(48);
const URL_PLATAFORMA = "http://onia-platform:3000/api/auth/verificacion-whatsapp/desde-whatsapp";
const ENCENDIDA = { encendida: true, url: URL_PLATAFORMA, secreto: SECRETO, inboxId: "5" };

function turno(overrides = {}) {
  return {
    skip: false,
    turn: {
      channel: "chatwoot",
      contact_ref: "77",
      inbox_id: "5",
      channel_type: "Channel::Whatsapp",
      public_contact: "+59171234567",
      kind: "text",
      text: "Mi código de Onia es 048213",
      message_key: "chatwoot:77:4242",
      ...overrides,
    },
    meta: { conversationId: "77", messageId: "4242", attachments: [] },
  };
}

function fetchQueContesta(status, cuerpo) {
  const llamadas = [];
  const fn = async (url, init) => {
    llamadas.push({ url, init });
    return { ok: status >= 200 && status < 300, status, json: async () => cuerpo };
  };
  fn.llamadas = llamadas;
  return fn;
}

function clienteMock() {
  const enviados = [];
  return {
    enviados,
    async sendMessage(conversationId, text) {
      enviados.push({ conversationId, text });
      return { id: 1 };
    },
  };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

test("config: apagada sin la variable, y sólo «encendida» la prende", () => {
  assert.equal(getVerificacionInversaConfig({}).encendida, false);
  for (const valor of ["true", "1", "Encendida", " encendida", "si"]) {
    assert.equal(getVerificacionInversaConfig({ ONIA_VERIFICACION_INVERSA: valor }).encendida, false, valor);
  }
  const cfg = getVerificacionInversaConfig({
    ONIA_VERIFICACION_INVERSA: "encendida",
    ONIA_VERIFICACION_INVERSA_SECRETO: SECRETO,
    ONIA_VERIFICACION_INVERSA_INBOX_ID: "5",
    ONIA_VERIFICACION_INVERSA_URL: URL_PLATAFORMA,
  });
  assert.deepEqual(cfg, ENCENDIDA);
});

test("config: encendida sin secreto largo o sin inbox = apagada (falla cerrado)", () => {
  const base = {
    ONIA_VERIFICACION_INVERSA: "encendida",
    ONIA_VERIFICACION_INVERSA_SECRETO: SECRETO,
    ONIA_VERIFICACION_INVERSA_INBOX_ID: "5",
  };
  assert.equal(getVerificacionInversaConfig({ ...base, ONIA_VERIFICACION_INVERSA_SECRETO: "corto" }).encendida, false);
  assert.equal(getVerificacionInversaConfig({ ...base, ONIA_VERIFICACION_INVERSA_INBOX_ID: "" }).encendida, false);
  assert.equal(getVerificacionInversaConfig(base).url, URL_PLATAFORMA, "default: la red interna de Docker");
});

// ---------------------------------------------------------------------------
// El patron
// ---------------------------------------------------------------------------

test("patrón: lee el código del mensaje pre-escrito y sus variantes", () => {
  assert.equal(codigoDelMensaje("Mi código de Onia es 048213"), "048213");
  assert.equal(codigoDelMensaje("mi codigo de onia es 048213"), "048213");
  assert.equal(codigoDelMensaje("  Mi código de Onia es: 048 213. "), "048213");
  assert.equal(codigoDelMensaje("MI CÓDIGO DE ONIA ES 048-213"), "048213");
});

test("patrón: lo que no es el mensaje de verificación no dispara", () => {
  for (const texto of [
    "Hola, quiero info del sistema",
    "Mi código postal es 048213",
    "Mi código de Onia es 04821",
    "Mi código de Onia es 0482139",
    "048213",
    "",
    null,
    undefined,
  ]) {
    assert.equal(codigoDelMensaje(texto), null, String(texto));
  }
});

test("mensajeDeVerificacion: sólo inbox de Onia + WhatsApp + teléfono + patrón", () => {
  assert.deepEqual(mensajeDeVerificacion(turno(), ENCENDIDA), {
    telefono: "+59171234567",
    codigo: "048213",
    conversationId: "77",
  });
  assert.equal(mensajeDeVerificacion(turno(), { ...ENCENDIDA, encendida: false }), null, "apagada");
  assert.equal(mensajeDeVerificacion(turno({ inbox_id: "7" }), ENCENDIDA), null, "inbox de un cliente");
  assert.equal(mensajeDeVerificacion(turno({ channel_type: "Channel::WebWidget" }), ENCENDIDA), null, "widget");
  assert.equal(mensajeDeVerificacion(turno({ channel_type: "Channel::Api" }), ENCENDIDA), null, "inbox de API");
  assert.equal(mensajeDeVerificacion(turno({ public_contact: null }), ENCENDIDA), null, "sin teléfono");
  assert.equal(mensajeDeVerificacion(turno({ text: "hola" }), ENCENDIDA), null, "charla");
  assert.equal(mensajeDeVerificacion({ skip: true }, ENCENDIDA), null);
});

// ---------------------------------------------------------------------------
// La llamada a la plataforma
// ---------------------------------------------------------------------------

test("verificarEnPlataforma: POST con Bearer, teléfono y código; devuelve el estado", async () => {
  const fetch = fetchQueContesta(200, { estado: "verificado" });
  const estado = await verificarEnPlataforma({ telefono: "+59171234567", codigo: "048213" }, ENCENDIDA, { fetch });
  assert.equal(estado, "verificado");
  assert.equal(fetch.llamadas.length, 1);
  const { url, init } = fetch.llamadas[0];
  assert.equal(url, URL_PLATAFORMA);
  assert.equal(init.method, "POST");
  assert.equal(init.headers.authorization, `Bearer ${SECRETO}`);
  assert.deepEqual(JSON.parse(init.body), { telefono: "+59171234567", codigo: "048213" });
});

test("verificarEnPlataforma: fail-closed — error, 401, 500 o estado raro = «error»", async () => {
  const casos = [
    fetchQueContesta(401, { error: "No autorizado" }),
    fetchQueContesta(500, { estado: "verificado" }),
    fetchQueContesta(200, { estado: "lo_que_sea" }),
    fetchQueContesta(200, null),
    async () => {
      throw new Error("ECONNREFUSED");
    },
  ];
  for (const fetch of casos) {
    assert.equal(
      await verificarEnPlataforma({ telefono: "+59171234567", codigo: "048213" }, ENCENDIDA, { fetch }),
      "error",
    );
  }
});

// ---------------------------------------------------------------------------
// El manejador completo
// ---------------------------------------------------------------------------

test("manejar: verificado → contesta «Listo, tu WhatsApp quedó verificado» en ESA conversación", async () => {
  const client = clienteMock();
  const r = await manejarVerificacionInversa(turno(), {
    config: ENCENDIDA,
    fetch: fetchQueContesta(200, { estado: "verificado" }),
    client,
  });
  assert.equal(r.estado, "verificado");
  assert.equal(RESPUESTAS.verificado, "Listo, tu WhatsApp quedó verificado");
  assert.deepEqual(client.enviados, [{ conversationId: "77", text: "Listo, tu WhatsApp quedó verificado" }]);
});

test("manejar: cada estado tiene su respuesta, y ninguna dice verificado salvo verificado", async () => {
  for (const estado of ["incorrecto", "codigo_vencido", "sin_intentos", "sin_pendiente", "limite"]) {
    const client = clienteMock();
    const r = await manejarVerificacionInversa(turno(), {
      config: ENCENDIDA,
      fetch: fetchQueContesta(200, { estado }),
      client,
    });
    assert.equal(r.estado, estado);
    assert.equal(client.enviados.length, 1);
    assert.equal(client.enviados[0].text, RESPUESTAS[estado]);
    assert.doesNotMatch(client.enviados[0].text, /quedó verificado/);
  }
});

test("manejar: plataforma caída → pide reintentar, no dice verificado", async () => {
  const client = clienteMock();
  const r = await manejarVerificacionInversa(turno(), {
    config: ENCENDIDA,
    fetch: async () => {
      throw new Error("timeout");
    },
    client,
  });
  assert.equal(r.estado, "error");
  assert.equal(client.enviados[0].text, RESPUESTAS.error);
});

test("manejar: lo que no es verificación devuelve null y no llama a nadie", async () => {
  const fetch = fetchQueContesta(200, { estado: "verificado" });
  const client = clienteMock();
  assert.equal(await manejarVerificacionInversa(turno({ text: "DEMO" }), { config: ENCENDIDA, fetch, client }), null);
  assert.equal(
    await manejarVerificacionInversa(turno(), { config: { ...ENCENDIDA, encendida: false }, fetch, client }),
    null,
  );
  assert.equal(fetch.llamadas.length, 0);
  assert.equal(client.enviados.length, 0);
});

test("ninguna respuesta lleva cifras de precio ni promesas", () => {
  for (const texto of Object.values(RESPUESTAS)) {
    assert.doesNotMatch(texto, /Bs|\$|precio|gratis/i);
  }
});

// ---------------------------------------------------------------------------
// En el servidor de webhook: no entra al embudo
// ---------------------------------------------------------------------------

const SECRET = "secreto-de-prueba-no-va-al-repo";
const NOW_MS = Date.UTC(2026, 9, 1, 14, 0, 0);
const CONFIG = { webhookSecret: SECRET, pathSecret: undefined, toleranceSeconds: 300, allowUnsigned: false, maxBodyBytes: 1 << 20 };

function sign(body) {
  const ts = Math.floor(NOW_MS / 1000);
  const hex = createHmac("sha256", SECRET).update(`${ts}.${body}`).digest("hex");
  return { "x-chatwoot-timestamp": String(ts), "x-chatwoot-signature": `sha256=${hex}` };
}

function entranteWhatsapp(content) {
  return JSON.stringify({
    event: "message_created",
    id: 4242,
    content,
    message_type: "incoming",
    private: false,
    created_at: "2026-10-01T14:00:00Z",
    sender: { id: 9, name: "Dueño", phone_number: "+59171234567" },
    inbox: { id: 5, channel_type: "Channel::Whatsapp" },
    conversation: { id: 77, inbox_id: 5 },
  });
}

function motorMock() {
  const llamadas = [];
  const fn = async (payload) => {
    llamadas.push(payload);
    return { ok: true, skipped: false, duplicate: false, conversationId: "77", sent: [], warnings: [] };
  };
  fn.llamadas = llamadas;
  return fn;
}

test.beforeEach(() => _resetDedup());

test("webhook: con la verificación encendida, el mensaje de código NO entra al motor", async () => {
  const motor = motorMock();
  const client = clienteMock();
  const fetch = fetchQueContesta(200, { estado: "verificado" });
  const body = entranteWhatsapp("Mi código de Onia es 048213");
  const res = await handleChatwootWebhook(
    { rawBody: body, headers: sign(body), method: "POST", url: WEBHOOK_PATH },
    { config: CONFIG, runChatwootTurn: motor, nowMs: NOW_MS, verificacionInversa: { config: ENCENDIDA, fetch, client } },
  );
  assert.equal(res.status, 200);
  assert.equal(res.body.verificacion, "verificado");
  assert.equal(motor.llamadas.length, 0, "no entra al embudo de ventas");
  assert.equal(res.n8nEvent, undefined, "no es un turno de ventas: no va a la analítica");
  assert.equal(client.enviados[0].text, "Listo, tu WhatsApp quedó verificado");
  assert.equal(JSON.parse(fetch.llamadas[0].init.body).telefono, "+59171234567");
});

test("webhook: con la verificación APAGADA el mismo mensaje sigue al motor (como hoy)", async () => {
  const motor = motorMock();
  const fetch = fetchQueContesta(200, { estado: "verificado" });
  const body = entranteWhatsapp("Mi código de Onia es 048213");
  const res = await handleChatwootWebhook(
    { rawBody: body, headers: sign(body), method: "POST", url: WEBHOOK_PATH },
    {
      config: CONFIG,
      runChatwootTurn: motor,
      nowMs: NOW_MS,
      verificacionInversa: { config: { ...ENCENDIDA, encendida: false }, fetch, client: clienteMock() },
    },
  );
  assert.equal(res.status, 200);
  assert.equal(motor.llamadas.length, 1);
  assert.equal(fetch.llamadas.length, 0);
});

test("webhook: sin inyectar nada (producción sin la variable) el motor corre como siempre", async () => {
  const motor = motorMock();
  const body = entranteWhatsapp("Mi código de Onia es 048213");
  const res = await handleChatwootWebhook(
    { rawBody: body, headers: sign(body), method: "POST", url: WEBHOOK_PATH },
    { config: CONFIG, runChatwootTurn: motor, nowMs: NOW_MS },
  );
  assert.equal(res.status, 200);
  assert.equal(motor.llamadas.length, 1);
});

test("webhook: una charla normal en el inbox de Onia sigue al motor aunque esté encendida", async () => {
  const motor = motorMock();
  const fetch = fetchQueContesta(200, { estado: "verificado" });
  const body = entranteWhatsapp("Hola, quiero ver el sistema");
  await handleChatwootWebhook(
    { rawBody: body, headers: sign(body), method: "POST", url: WEBHOOK_PATH },
    { config: CONFIG, runChatwootTurn: motor, nowMs: NOW_MS, verificacionInversa: { config: ENCENDIDA, fetch, client: clienteMock() } },
  );
  assert.equal(motor.llamadas.length, 1);
  assert.equal(fetch.llamadas.length, 0);
});

test("webhook: si el manejador revienta, el webhook igual contesta 200", async () => {
  const body = entranteWhatsapp("Mi código de Onia es 048213");
  const client = {
    async sendMessage() {
      throw new Error("chatwoot caído");
    },
  };
  const res = await handleChatwootWebhook(
    { rawBody: body, headers: sign(body), method: "POST", url: WEBHOOK_PATH },
    {
      config: CONFIG,
      runChatwootTurn: motorMock(),
      nowMs: NOW_MS,
      verificacionInversa: { config: ENCENDIDA, fetch: fetchQueContesta(200, { estado: "verificado" }), client },
    },
  );
  assert.equal(res.status, 200);
});

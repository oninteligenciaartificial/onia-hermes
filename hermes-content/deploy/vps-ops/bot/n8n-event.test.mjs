// ONIA — Chatbot propio: pruebas del EVENTO A n8n (fire-and-forget).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. N8N CAIDO (y colgado, y devolviendo 500): NUNCA tira. Es LA prueba del carril — si esto
//      tirara, el webhook devolveria 500, Chatwoot reintregaria y el prospecto recibiria la
//      respuesta dos veces. Justo lo que se vino a arreglar.
//   2. La REDACCION: ni telefonos, ni emails, ni el texto completo del prospecto salen del
//      sistema. n8n es analitica, no una copia de la conversacion.
//   3. `fireN8nBotTurnEvent` desacopla de verdad: devuelve al instante y no deja una promesa
//      rechazada suelta (un unhandled rejection tumba el proceso de Node y con el, el bot).
//
// No hay red real en ninguna prueba: el `fetch` se inyecta siempre.

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildBotTurnEvent,
  fireN8nBotTurnEvent,
  getN8nEventConfig,
  redactConversationRef,
  redactMessagePreview,
  sendN8nBotTurnEvent,
  PREVIEW_MAX_CHARS,
} from "./n8n-event.mjs";

const CONFIG_OK = { enabled: true, url: "https://n8n.example/webhook/onia", secret: "secreto-n8n" };
const EVENT = { eventType: "chatbot_turn", source: "chatwoot-onia" };

/** fetch falso que registra la llamada y devuelve lo que se le pida. */
function fakeFetch(response, calls = []) {
  return Object.assign(
    async (url, options) => {
      calls.push({ url, options });
      if (response instanceof Error) throw response;
      return response;
    },
    { calls },
  );
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

test("getN8nEventConfig lee del entorno y viene APAGADO por default", () => {
  assert.deepEqual(getN8nEventConfig({}), { enabled: false, url: undefined, secret: undefined });
  assert.equal(getN8nEventConfig({ ONIA_N8N_ENABLED: "true" }).enabled, true);
  assert.equal(getN8nEventConfig({ ONIA_N8N_ENABLED: "TRUE" }).enabled, true);
  assert.equal(getN8nEventConfig({ ONIA_N8N_ENABLED: "1" }).enabled, false, "solo 'true' enciende");
  assert.equal(getN8nEventConfig({ ONIA_N8N_EVENT_URL: "  https://x  " }).url, "https://x", "se limpia");
});

// ---------------------------------------------------------------------------
// sendN8nBotTurnEvent — camino feliz
// ---------------------------------------------------------------------------

test("manda el POST con el secreto en el header y el evento como JSON", async () => {
  const calls = [];
  const result = await sendN8nBotTurnEvent(EVENT, CONFIG_OK, { fetch: fakeFetch({ ok: true, status: 200 }, calls) });

  assert.deepEqual(result, { ok: true, status: "sent", reason: "evento enviado a n8n" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, CONFIG_OK.url);
  assert.equal(calls[0].options.method, "POST");
  // El secreto viaja como header (en n8n se valida con una credencial "Header Auth"), NUNCA en
  // la URL ni en $env — el plan VPS de n8n no soporta $env.
  assert.equal(calls[0].options.headers["x-onia-webhook-secret"], "secreto-n8n");
  assert.deepEqual(JSON.parse(calls[0].options.body), EVENT);
});

// ---------------------------------------------------------------------------
// sendN8nBotTurnEvent — TODOS los fallos, ninguno tira
// ---------------------------------------------------------------------------

test("apagado: no llama a nadie y devuelve 'skipped'", async () => {
  const calls = [];
  const result = await sendN8nBotTurnEvent(EVENT, { enabled: false }, { fetch: fakeFetch({ ok: true }, calls) });
  assert.equal(result.status, "skipped");
  assert.equal(calls.length, 0, "ni siquiera se intenta");
});

test("mal configurado (sin URL o sin secreto): falla limpio, no tira", async () => {
  const sinUrl = await sendN8nBotTurnEvent(EVENT, { enabled: true, secret: "s" }, { fetch: fakeFetch({ ok: true }) });
  assert.equal(sinUrl.ok, false);
  assert.match(sinUrl.reason, /ONIA_N8N_EVENT_URL/);

  const sinSecreto = await sendN8nBotTurnEvent(EVENT, { enabled: true, url: "https://x" }, { fetch: fakeFetch({ ok: true }) });
  assert.equal(sinSecreto.ok, false);
  assert.match(sinSecreto.reason, /ONIA_N8N_EVENT_SECRET/);
});

test("N8N CAIDO (el fetch tira): se reporta el fallo y NO se propaga la excepcion", async () => {
  const result = await sendN8nBotTurnEvent(EVENT, CONFIG_OK, {
    fetch: fakeFetch(new Error("connect ECONNREFUSED 127.0.0.1:5678")),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, "failed");
  assert.match(result.reason, /ECONNREFUSED/);
});

test("n8n contesta 500: se reporta el fallo, tampoco tira", async () => {
  const result = await sendN8nBotTurnEvent(EVENT, CONFIG_OK, { fetch: fakeFetch({ ok: false, status: 500 }) });
  assert.equal(result.ok, false);
  assert.match(result.reason, /500/);
});

test("n8n COLGADO (abort por timeout): se reporta el fallo, no se espera para siempre", async () => {
  const abortError = new Error("The operation was aborted due to timeout");
  abortError.name = "TimeoutError";
  const result = await sendN8nBotTurnEvent(EVENT, CONFIG_OK, { fetch: fakeFetch(abortError), timeoutMs: 5 });
  assert.equal(result.ok, false);
  assert.match(result.reason, /aborted|timeout/i);
});

// ---------------------------------------------------------------------------
// fireN8nBotTurnEvent — desacople real
// ---------------------------------------------------------------------------

test("fireN8nBotTurnEvent devuelve al instante (no se puede esperar sin querer)", () => {
  let resolverFetch;
  const colgado = () => new Promise((resolve) => { resolverFetch = resolve; });

  const antes = Date.now();
  const devuelto = fireN8nBotTurnEvent(EVENT, CONFIG_OK, { fetch: colgado });
  const despues = Date.now();

  assert.equal(devuelto, undefined, "no devuelve promesa: no hay nada que await-ear por error");
  assert.ok(despues - antes < 50, "vuelve enseguida aunque n8n no conteste nunca");
  if (resolverFetch) resolverFetch({ ok: true, status: 200 });
});

test("fireN8nBotTurnEvent con n8n caido avisa por callback y NO deja un rechazo suelto", async () => {
  const resultado = await new Promise((resolve) => {
    fireN8nBotTurnEvent(EVENT, CONFIG_OK, { fetch: fakeFetch(new Error("getaddrinfo ENOTFOUND n8n")) }, resolve);
  });
  assert.equal(resultado.ok, false);
  assert.match(resultado.reason, /ENOTFOUND/);
});

// ---------------------------------------------------------------------------
// Redaccion
// ---------------------------------------------------------------------------

test("redactMessagePreview saca emails y telefonos, y corta el texto", () => {
  const texto = "escribime a sergio@onia.com.bo o al +591 71234567 que tengo 2 sillones";
  const salida = redactMessagePreview(texto);

  assert.ok(!salida.includes("sergio@onia.com.bo"), "el email no sale");
  assert.ok(!salida.includes("71234567"), "el telefono no sale");
  assert.ok(salida.includes("email-redactado") && salida.includes("telefono-redactado"));
  assert.ok(salida.includes("2 sillones") || salida.includes("sillones"), "el tema si se conserva");

  assert.equal(redactMessagePreview("x".repeat(900)).length, PREVIEW_MAX_CHARS);
  assert.equal(redactMessagePreview(undefined), "", "sin texto no tira");
});

test("redactConversationRef deja correlacionar sin identificar", () => {
  assert.equal(redactConversationRef("123456"), "chatwoot-conv-redactada-3456");
  assert.equal(redactConversationRef(""), "chatwoot-conv-redactada");
  assert.equal(redactConversationRef(undefined), "chatwoot-conv-redactada");
});

// ---------------------------------------------------------------------------
// buildBotTurnEvent
// ---------------------------------------------------------------------------

test("buildBotTurnEvent arma un evento util y SIN datos crudos", () => {
  const evento = buildBotTurnEvent({
    parsed: { meta: { conversationId: "77", messageId: "4242" }, turn: {} },
    result: {
      ok: true,
      duplicate: false,
      skipped: false,
      dryRun: false,
      stageBefore: "nuevo",
      stageAfter: "esperando_calificacion",
      sent: [{ text: "hola", posted: true }],
      warnings: ["algo"],
    },
    rawText: "soy sergio@onia.com.bo, +591 71234567",
    nowIso: "2026-07-30T18:00:00.000Z",
  });

  assert.equal(evento.eventType, "chatbot_turn");
  assert.equal(evento.mode, "production");
  assert.equal(evento.stageBefore, "nuevo");
  assert.equal(evento.stageAfter, "esperando_calificacion", "el salto de etapa es LA señal util");
  assert.equal(evento.repliesCount, 1);
  assert.equal(evento.postedCount, 1);
  assert.equal(evento.deliveryStatus, "sent");
  assert.equal(evento.warningsCount, 1);
  assert.equal(evento.messageIdRedacted, "chatwoot-mensaje-redactado");

  // Lo importante: NADA crudo. Se serializa entero y se busca el dato personal.
  const serializado = JSON.stringify(evento);
  assert.ok(!serializado.includes("sergio@onia.com.bo"), "el email no viaja a n8n");
  assert.ok(!serializado.includes("71234567"), "el telefono no viaja a n8n");
  assert.ok(!serializado.includes('"77"'), "el id de conversacion crudo no viaja a n8n");
});

test("buildBotTurnEvent marca dry_run y el caso sin respuestas", () => {
  const evento = buildBotTurnEvent({
    parsed: { meta: { conversationId: "77" }, turn: {} },
    result: { ok: true, dryRun: true, duplicate: true, sent: [] },
    rawText: "",
  });
  assert.equal(evento.mode, "dry_run");
  assert.equal(evento.duplicate, true);
  assert.equal(evento.deliveryStatus, "skipped");
  assert.equal(evento.messageIdRedacted, undefined);
  assert.ok(evento.createdAt, "siempre lleva fecha");
});

// ---------------------------------------------------------------------------
// Aviso de handoff: lo unico del evento que NO es analitica
// ---------------------------------------------------------------------------

test("HANDOFF: el aviso viaja con el motivo, y NUNCA el texto del prospecto", () => {
  const evento = buildBotTurnEvent({
    parsed: { meta: { conversationId: "77", messageId: "4242" } },
    rawText: "mi telefono es 78491375 y estoy re caliente con ustedes",
    result: {
      ok: true, stageBefore: "esperando_calificacion", stageAfter: "handoff_humano", sent: [],
      notify: [{ kind: "handoff", reason: "queja_o_desconfianza", text: "resumen interno" }],
    },
    nowIso: "2026-07-31T12:00:00.000Z",
  });

  assert.equal(evento.notifyCount, 1, "sin esto n8n no sabe que hay alguien esperando");
  assert.deepEqual(evento.notifyReasons, ["queja_o_desconfianza"]);

  const plano = JSON.stringify(evento);
  assert.ok(!plano.includes("78491375"), "el telefono del prospecto no sale del sistema");
  assert.ok(plano.includes("telefono-redactado"), "el telefono se reemplaza, no se borra el mensaje entero");
  // El texto SI viaja, redactado: un aviso sin contexto no sirve para decidir si atender ya.
  // Lo que NO puede viajar es el resumen interno del motor, que no aporta nada a n8n.
  assert.ok(!plano.includes("resumen interno"), "el resumen interno no: n8n solo necesita el motivo");
});

test("SIN handoff: notifyCount en 0 (n8n no tiene que despertar a nadie)", () => {
  const evento = buildBotTurnEvent({
    parsed: { meta: { conversationId: "77", messageId: "1" } },
    rawText: "DEMO",
    result: { ok: true, stageBefore: "nuevo", stageAfter: "esperando_calificacion", sent: [{ posted: true }] },
    nowIso: "2026-07-31T12:00:00.000Z",
  });
  assert.equal(evento.notifyCount, 0);
  assert.deepEqual(evento.notifyReasons, []);
});

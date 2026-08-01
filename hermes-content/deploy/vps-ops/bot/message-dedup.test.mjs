// ONIA — Chatbot propio: pruebas del DEDUP EN MEMORIA.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. MENSAJE REPETIDO: la segunda vez NO se procesa. Es el caso que importa — Chatwoot
//      reintrega el mismo `message_created` ante un no-2xx o un timeout, y sin esto el
//      prospecto recibe la MISMA respuesta dos veces.
//   2. ID AUSENTE: nunca bloquea. Quedarse mudo es peor que responder de mas.
//   3. La ventana (TTL) vence: pasados los 10 min el mismo id se vuelve a procesar.
//   4. La cota de memoria: el store no crece sin limite en un VPS que ya esta en swap.
//   5. `releaseMessage`: soltar una clave reclamada cuando el turno murio sin mandar nada.
//
// El reloj se inyecta siempre (`nowMs`): ninguna prueba duerme ni depende de la hora real.

import test from "node:test";
import assert from "node:assert/strict";

import {
  shouldProcessMessage,
  releaseMessage,
  _dedupSize,
  _resetDedup,
  DEDUP_TTL_MS,
  DEDUP_MAX_ENTRIES,
} from "./message-dedup.mjs";

const T0 = Date.UTC(2026, 6, 30, 18, 0, 0);
const KEY = "chatwoot:77:4242";

test.beforeEach(() => _resetDedup());

test("MENSAJE REPETIDO: la primera vez se procesa, el reintento NO", () => {
  assert.equal(shouldProcessMessage(KEY, T0), true, "primera entrega");
  assert.equal(shouldProcessMessage(KEY, T0 + 1000), false, "reintento de Chatwoot 1s despues");
  assert.equal(shouldProcessMessage(KEY, T0 + 60_000), false, "y un minuto despues sigue siendo el mismo");
});

test("dos mensajes distintos de la MISMA conversacion se procesan los dos", () => {
  assert.equal(shouldProcessMessage("chatwoot:77:1", T0), true);
  assert.equal(shouldProcessMessage("chatwoot:77:2", T0), true);
  assert.equal(_dedupSize(), 2);
});

test("ID AUSENTE: sin clave NUNCA bloquea (mudo es peor que duplicado)", () => {
  assert.equal(shouldProcessMessage(undefined, T0), true);
  assert.equal(shouldProcessMessage(undefined, T0), true);
  assert.equal(shouldProcessMessage("", T0), true);
  assert.equal(shouldProcessMessage(null, T0), true);
  assert.equal(_dedupSize(), 0, "no se registra nada sin clave");
});

test("la ventana vence: pasado el TTL el mismo id se vuelve a procesar", () => {
  assert.equal(shouldProcessMessage(KEY, T0), true);
  assert.equal(shouldProcessMessage(KEY, T0 + DEDUP_TTL_MS - 1), false, "justo adentro de la ventana");
  assert.equal(shouldProcessMessage(KEY, T0 + DEDUP_TTL_MS + 1), true, "ya vencida");
});

test("las claves vencidas se purgan solas (no se acumulan)", () => {
  for (let i = 0; i < 50; i += 1) shouldProcessMessage(`chatwoot:1:${i}`, T0);
  assert.equal(_dedupSize(), 50);

  // Una clave nueva mucho despues dispara la purga de todo lo vencido.
  shouldProcessMessage("chatwoot:1:nueva", T0 + DEDUP_TTL_MS + 1);
  assert.equal(_dedupSize(), 1, "solo queda la nueva");
});

test("la cota acota: el store no crece sin limite", () => {
  for (let i = 0; i < DEDUP_MAX_ENTRIES + 10; i += 1) shouldProcessMessage(`chatwoot:2:${i}`, T0);
  assert.ok(_dedupSize() <= DEDUP_MAX_ENTRIES, `tamano ${_dedupSize()} <= ${DEDUP_MAX_ENTRIES}`);

  // FIFO: al desbordar se evicta lo mas viejo, asi que lo RECIENTE sigue estando deduplicado
  // (que es lo que importa: un reintento llega enseguida, no 5000 mensajes despues).
  const reciente = `chatwoot:2:${DEDUP_MAX_ENTRIES + 9}`;
  assert.equal(shouldProcessMessage(reciente, T0), false, "el ultimo mensaje sigue reconocido");
});

test("releaseMessage suelta la clave para que un reintento legitimo pueda procesarse", () => {
  assert.equal(shouldProcessMessage(KEY, T0), true);
  assert.equal(shouldProcessMessage(KEY, T0), false, "reclamada");

  assert.equal(releaseMessage(KEY), true);
  assert.equal(shouldProcessMessage(KEY, T0), true, "liberada: se puede reintentar");

  assert.equal(releaseMessage("nunca-vista"), false);
  assert.equal(releaseMessage(undefined), false, "sin clave no hace nada y no tira");
});

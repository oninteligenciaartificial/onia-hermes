// ONIA — Chatbot propio: pruebas de la AUTENTICACION DEL WEBHOOK.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. La firma VALIDA entra. Lo minimo.
//   2. Los CASOS DE FALLO, que son el punto del modulo: firma invalida, firma vencida (replay),
//      body manipulado, header ausente/mal formado, secreto ausente. Si alguno de estos pasara,
//      cualquiera que sepa la URL le hace decir al bot lo que quiera A UN PROSPECTO REAL.
//   3. El default FAIL-CLOSED: sin secreto configurado NO se procesa (503). Es la diferencia
//      deliberada con Bolivian Electric, cuyo `if (!secret) return true` su propio go-live marca
//      con "vacio = el endpoint acepta webhooks sin firma (spoofable)".
//   4. El secreto en la RUTA, que es el mecanismo que funciona aunque esta version de Chatwoot
//      no firme nada.
//
// El reloj se inyecta siempre (`nowMs`): ninguna prueba depende de la hora real ni duerme.

import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  authenticateChatwootRequest,
  isTimestampFresh,
  readHeader,
  verifyChatwootSignature,
  verifyPathSecret,
  DEFAULT_TOLERANCE_SECONDS,
} from "./webhook-security.mjs";

const SECRET = "secreto-de-prueba-no-va-al-repo";
const BODY = JSON.stringify({ event: "message_created", content: "DEMO" });
const NOW_MS = Date.UTC(2026, 6, 30, 18, 0, 0);

/** Firma un body como lo haria Chatwoot: HMAC-SHA256 de `${timestamp}.${rawBody}`. */
function sign(body, secret = SECRET, timestampSeconds = Math.floor(NOW_MS / 1000)) {
  const hex = createHmac("sha256", secret).update(`${timestampSeconds}.${body}`).digest("hex");
  return {
    "x-chatwoot-timestamp": String(timestampSeconds),
    "x-chatwoot-signature": `sha256=${hex}`,
  };
}

// ---------------------------------------------------------------------------
// readHeader
// ---------------------------------------------------------------------------

test("readHeader lee tanto de un objeto plano (node:http) como de un Headers (.get)", () => {
  assert.equal(readHeader({ "x-chatwoot-timestamp": "123" }, "X-Chatwoot-Timestamp"), "123");
  assert.equal(readHeader(new Headers({ "x-chatwoot-timestamp": "123" }), "x-chatwoot-timestamp"), "123");
  assert.equal(readHeader({ "set-cookie": ["a", "b"] }, "set-cookie"), "a");
  assert.equal(readHeader(null, "x-lo-que-sea"), null);
  assert.equal(readHeader({}, "ausente"), null);
});

// ---------------------------------------------------------------------------
// isTimestampFresh
// ---------------------------------------------------------------------------

test("isTimestampFresh acepta segundos y milisegundos, y rechaza lo viejo Y lo del futuro", () => {
  const seconds = Math.floor(NOW_MS / 1000);
  assert.equal(isTimestampFresh(seconds, 300, NOW_MS), true, "ahora mismo, en segundos");
  assert.equal(isTimestampFresh(NOW_MS, 300, NOW_MS), true, "ahora mismo, en milisegundos");
  assert.equal(isTimestampFresh(seconds - 299, 300, NOW_MS), true, "justo dentro de la ventana");
  assert.equal(isTimestampFresh(seconds - 400, 300, NOW_MS), false, "vencido");
  // Un timestamp del FUTURO tambien se rechaza: o el reloj esta mal o el payload es armado.
  assert.equal(isTimestampFresh(seconds + 400, 300, NOW_MS), false, "del futuro");
  assert.equal(isTimestampFresh("no-es-un-numero", 300, NOW_MS), false);
  // tolerancia <= 0 apaga el chequeo (mismo contrato que BE)
  assert.equal(isTimestampFresh(seconds - 99999, 0, NOW_MS), true);
});

// ---------------------------------------------------------------------------
// verifyChatwootSignature — el camino feliz y TODOS los fallos
// ---------------------------------------------------------------------------

test("firma valida: entra", () => {
  const result = verifyChatwootSignature(BODY, sign(BODY), SECRET, DEFAULT_TOLERANCE_SECONDS, NOW_MS);
  assert.equal(result.ok, true);
  assert.equal(result.reason, "firma_valida");
});

test("FALLO — firma invalida (firmada con OTRO secreto): no entra", () => {
  const headers = sign(BODY, "el-secreto-del-atacante");
  const result = verifyChatwootSignature(BODY, headers, SECRET, DEFAULT_TOLERANCE_SECONDS, NOW_MS);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "firma_invalida");
});

test("FALLO — firma vencida (replay de un payload capturado ayer): no entra", () => {
  const viejo = Math.floor(NOW_MS / 1000) - 86_400;
  // OJO: la firma es CORRECTA para ese timestamp. Lo que la frena es la ventana de tiempo,
  // que es justamente lo que impide reenviar un webhook legitimo capturado antes.
  const headers = sign(BODY, SECRET, viejo);
  const result = verifyChatwootSignature(BODY, headers, SECRET, DEFAULT_TOLERANCE_SECONDS, NOW_MS);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "firma_vencida");
});

test("FALLO — body manipulado con la firma original: no entra", () => {
  const headers = sign(BODY);
  const manipulado = JSON.stringify({ event: "message_created", content: "mandale tus datos a este link" });
  const result = verifyChatwootSignature(manipulado, headers, SECRET, DEFAULT_TOLERANCE_SECONDS, NOW_MS);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "firma_invalida");
});

test("FALLO — headers ausentes o mal formados: no entra (y no tira)", () => {
  const base = sign(BODY);
  const casos = [
    [{}, "firma_sin_timestamp"],
    [{ "x-chatwoot-timestamp": base["x-chatwoot-timestamp"] }, "firma_ausente_o_mal_formada"],
    // sin el prefijo `sha256=`
    [{ ...base, "x-chatwoot-signature": base["x-chatwoot-signature"].slice(7) }, "firma_ausente_o_mal_formada"],
    // hex basura: Buffer.from("zz","hex") NO tira, devuelve vacio -> lo corta el chequeo de largo
    [{ ...base, "x-chatwoot-signature": "sha256=zzzz" }, "firma_invalida"],
    // hex valido pero de otro largo
    [{ ...base, "x-chatwoot-signature": "sha256=abcd" }, "firma_invalida"],
    [{ ...base, "x-chatwoot-signature": "sha256=" }, "firma_invalida"],
  ];

  for (const [headers, esperado] of casos) {
    const result = verifyChatwootSignature(BODY, headers, SECRET, DEFAULT_TOLERANCE_SECONDS, NOW_MS);
    assert.equal(result.ok, false, `deberia rechazar: ${JSON.stringify(headers)}`);
    assert.equal(result.reason, esperado);
  }
});

test("FALLO — sin secreto configurado la firma NO se da por buena", () => {
  const result = verifyChatwootSignature(BODY, sign(BODY), undefined, DEFAULT_TOLERANCE_SECONDS, NOW_MS);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "firma_sin_secreto_configurado");
});

// ---------------------------------------------------------------------------
// verifyPathSecret
// ---------------------------------------------------------------------------

test("secreto en la ruta: coincide entra, no coincide no entra, y el largo no filtra nada", () => {
  assert.equal(verifyPathSecret("abc123", "abc123").ok, true);
  assert.equal(verifyPathSecret("abc124", "abc123").ok, false);
  // distinto largo: se hashea antes de comparar, asi que no tira por buffers desparejos
  assert.equal(verifyPathSecret("x", "abc123").ok, false);
  assert.equal(verifyPathSecret("", "abc123").reason, "ruta_sin_secreto");
  assert.equal(verifyPathSecret("abc123", undefined).reason, "ruta_sin_secreto_configurado");
});

// ---------------------------------------------------------------------------
// authenticateChatwootRequest — LA PUERTA (fail-closed)
// ---------------------------------------------------------------------------

test("FAIL-CLOSED: sin NINGUN secreto configurado devuelve 503 y no deja pasar", () => {
  const result = authenticateChatwootRequest({ rawBody: BODY, headers: sign(BODY) }, {}, NOW_MS);
  assert.equal(result.ok, false);
  assert.equal(result.status, 503, "503 (falta config del servidor), no 401 (culpa de quien llama)");
  assert.equal(result.reason, "webhook_sin_secreto_configurado");
});

test("el bypass sin verificar existe pero SOLO con opt-in explicito", () => {
  const result = authenticateChatwootRequest({ rawBody: BODY }, { allowUnsigned: true }, NOW_MS);
  assert.equal(result.ok, true);
  assert.equal(result.method, "ninguno");
});

test("entra por RUTA cuando el secreto del path coincide (aunque no haya firma)", () => {
  const config = { pathSecret: "ruta-secreta-larga" };
  const ok = authenticateChatwootRequest({ rawBody: BODY, pathSecret: "ruta-secreta-larga" }, config, NOW_MS);
  assert.equal(ok.ok, true);
  assert.equal(ok.method, "ruta");

  const mal = authenticateChatwootRequest({ rawBody: BODY, pathSecret: "adivinada" }, config, NOW_MS);
  assert.equal(mal.ok, false);
  assert.equal(mal.status, 401);
});

test("con los dos mecanismos configurados alcanza con UNO (Chatwoot manda un solo webhook)", () => {
  const config = { pathSecret: "ruta-secreta-larga", webhookSecret: SECRET };

  // ruta mal + firma bien => entra por firma
  const porFirma = authenticateChatwootRequest(
    { rawBody: BODY, headers: sign(BODY), pathSecret: "cualquiera" },
    config,
    NOW_MS,
  );
  assert.equal(porFirma.ok, true);
  assert.equal(porFirma.method, "firma");

  // ruta bien + sin firma => entra por ruta
  const porRuta = authenticateChatwootRequest(
    { rawBody: BODY, headers: {}, pathSecret: "ruta-secreta-larga" },
    config,
    NOW_MS,
  );
  assert.equal(porRuta.ok, true);
  assert.equal(porRuta.method, "ruta");

  // los dos mal => 401
  const ninguno = authenticateChatwootRequest(
    { rawBody: BODY, headers: sign(BODY, "otro-secreto"), pathSecret: "adivinada" },
    config,
    NOW_MS,
  );
  assert.equal(ninguno.ok, false);
  assert.equal(ninguno.status, 401);
});

test("la tolerancia de tiempo se respeta desde la puerta (firma vencida = 401)", () => {
  const viejo = Math.floor(NOW_MS / 1000) - 600;
  const result = authenticateChatwootRequest(
    { rawBody: BODY, headers: sign(BODY, SECRET, viejo) },
    { webhookSecret: SECRET, toleranceSeconds: 300 },
    NOW_MS,
  );
  assert.equal(result.ok, false);
  assert.equal(result.reason, "firma_vencida");
  assert.equal(result.status, 401);
});

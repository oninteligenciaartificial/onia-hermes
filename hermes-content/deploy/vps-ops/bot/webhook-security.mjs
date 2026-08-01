// ONIA — Chatbot propio: AUTENTICACION DEL WEBHOOK DE CHATWOOT.
//
// Hoy el webhook no se verifica: cualquiera que sepa la URL puede POSTear un payload armado a
// mano y hacerle decir al bot lo que quiera A UN PROSPECTO REAL (el bot postea la respuesta en
// la conversación de Chatwoot). Este módulo es la puerta.
//
// DOS MECANISMOS, porque uno solo no alcanza:
//
//   1. FIRMA HMAC (`x-chatwoot-timestamp` + `x-chatwoot-signature: sha256=<hex>`), sobre
//      `${timestamp}.${rawBody}`. Es el mismo esquema que Bolivian Electric ya tiene en
//      producción (`apps/web/lib/chatwoot-webhook.ts` → `verifyChatwootSignature`).
//   2. SECRETO EN LA RUTA (`/webhook/chatwoot/<secreto>`). Chatwoot deja configurar un
//      `webhook_url` ARBITRARIO, así que un secreto largo en el path autentica igual de bien y
//      NO depende de que la instancia firme.
//
// Por qué los dos: la propia doc de BE describe la firma como *opcional*
// (`docs/technical/whatsapp-chatbot-architecture.md`), o sea que allá tampoco se confirmó que
// esta versión de Chatwoot mande los headers. Si no los manda y la firma fuera el único
// mecanismo, el endpoint quedaría abierto o el bot quedaría mudo. Con el secreto en la ruta hay
// una autenticación que funciona SIEMPRE, y la firma suma cuando está disponible.
//
// DIFERENCIA DELIBERADA CON BE — FAIL-CLOSED, no fail-open:
//   BE hace `if (!secret) return true;` (sin secreto configurado, acepta todo). Su propio
//   go-live lo marca con ⚠️: "vacío = el endpoint acepta webhooks sin firma (spoofable)".
//   Acá NO se copia ese default: sin ningún secreto configurado, `authenticate()` devuelve
//   `unconfigured` y el servidor responde 503 en vez de procesar. Se abre sólo con un opt-in
//   explícito (`allowUnsigned`), que es para probar en local, nunca para producción.
//
// Puro y testeable: reloj inyectable (`nowMs`), sin I/O, no tira nunca.

import { createHmac, timingSafeEqual } from "node:crypto";

/** Ventana de frescura del timestamp. 5 min: sobra para una entrega y corta el replay viejo. */
export const DEFAULT_TOLERANCE_SECONDS = 300;

const SIGNATURE_PREFIX = "sha256=";

/**
 * Lee un header sin importar de dónde viene: `Headers`/`Request` (tiene `.get`) o el objeto
 * plano de `node:http` (`req.headers`, siempre en minúscula). Los nombres se comparan en
 * minúscula porque HTTP no distingue mayúsculas.
 */
export function readHeader(headers, name) {
  if (!headers) return null;
  const key = String(name).toLowerCase();
  if (typeof headers.get === "function") {
    const value = headers.get(key);
    return value === undefined || value === null ? null : String(value);
  }
  const value = headers[key];
  if (value === undefined || value === null) return null;
  return String(Array.isArray(value) ? value[0] : value);
}

/**
 * ¿El timestamp está dentro de la ventana? Corta el replay: un payload capturado y reenviado
 * mañana llega con un timestamp viejo y la firma, aunque sea válida, ya no sirve.
 * Acepta segundos o milisegundos (Chatwoot manda segundos; el umbral distingue por magnitud).
 * `toleranceSeconds <= 0` desactiva el chequeo (mismo contrato que BE).
 */
export function isTimestampFresh(timestamp, toleranceSeconds = DEFAULT_TOLERANCE_SECONDS, nowMs = Date.now()) {
  if (toleranceSeconds <= 0) return true;

  const numeric = Number(timestamp);
  if (!Number.isFinite(numeric)) return false;

  const timestampMs = numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  // Valor absoluto: también rechaza un timestamp del FUTURO (reloj mal puesto o payload armado).
  return Math.abs(nowMs - timestampMs) <= toleranceSeconds * 1000;
}

/** Comparación en tiempo constante de dos hex. Nunca tira: hex inválido => false. */
function safeHexEqual(expectedHex, receivedHex) {
  try {
    const expected = Buffer.from(expectedHex, "hex");
    const received = Buffer.from(receivedHex, "hex");
    // `timingSafeEqual` TIRA si los largos difieren, así que se compara el largo primero.
    // Además: `Buffer.from("zz", "hex")` no tira, devuelve vacío — el largo lo cubre igual.
    if (expected.length === 0 || expected.length !== received.length) return false;
    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

/**
 * Verifica la firma HMAC del webhook.
 * @returns {{ok: boolean, reason: string}} — nunca tira.
 */
export function verifyChatwootSignature(
  rawBody,
  headers,
  secret,
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
  nowMs = Date.now(),
) {
  if (!secret) return { ok: false, reason: "firma_sin_secreto_configurado" };

  const timestamp = readHeader(headers, "x-chatwoot-timestamp");
  const signatureHeader = readHeader(headers, "x-chatwoot-signature");

  if (!timestamp) return { ok: false, reason: "firma_sin_timestamp" };
  if (!signatureHeader || !signatureHeader.startsWith(SIGNATURE_PREFIX)) {
    return { ok: false, reason: "firma_ausente_o_mal_formada" };
  }
  if (!isTimestampFresh(timestamp, toleranceSeconds, nowMs)) {
    return { ok: false, reason: "firma_vencida" };
  }

  const expectedHex = createHmac("sha256", secret).update(`${timestamp}.${String(rawBody ?? "")}`).digest("hex");
  const receivedHex = signatureHeader.slice(SIGNATURE_PREFIX.length);

  return safeHexEqual(expectedHex, receivedHex)
    ? { ok: true, reason: "firma_valida" }
    : { ok: false, reason: "firma_invalida" };
}

/**
 * Compara el secreto de la ruta en tiempo constante (se hashea primero para no filtrar el largo
 * y para poder comparar buffers del mismo tamaño siempre).
 */
export function verifyPathSecret(received, expected) {
  if (!expected) return { ok: false, reason: "ruta_sin_secreto_configurado" };
  if (!received) return { ok: false, reason: "ruta_sin_secreto" };

  const a = createHmac("sha256", "onia-path-secret").update(String(received)).digest();
  const b = createHmac("sha256", "onia-path-secret").update(String(expected)).digest();

  return timingSafeEqual(a, b) ? { ok: true, reason: "ruta_valida" } : { ok: false, reason: "ruta_invalida" };
}

/**
 * LA PUERTA. Decide si un webhook entra, con los dos mecanismos y el default fail-closed.
 *
 * Alcanza con UNO de los dos (OR, no AND): Chatwoot manda un solo webhook por evento y no se
 * puede exigir una firma que la instancia quizá no genera. El secreto de la ruta es el piso
 * garantizado; la firma, cuando está, agrega frescura (anti-replay).
 *
 * @param {object} input  { rawBody, headers, pathSecret }  pathSecret = el segmento recibido en la URL
 * @param {object} config { webhookSecret, pathSecret, toleranceSeconds, allowUnsigned }
 * @returns {{ok: boolean, reason: string, method: string, status: number}}
 */
export function authenticateChatwootRequest(input = {}, config = {}, nowMs = Date.now()) {
  const hasSignatureSecret = Boolean(config.webhookSecret);
  const hasPathSecret = Boolean(config.pathSecret);

  // Nada configurado: NO se procesa. 503, no 401: el problema es del servidor (falta config),
  // no de quien llama, y así se distingue en los logs de un intento de spoof.
  if (!hasSignatureSecret && !hasPathSecret) {
    if (config.allowUnsigned === true) {
      return { ok: true, reason: "sin_verificar_opt_in_explicito", method: "ninguno", status: 200 };
    }
    return { ok: false, reason: "webhook_sin_secreto_configurado", method: "ninguno", status: 503 };
  }

  if (hasPathSecret) {
    const path = verifyPathSecret(input.pathSecret, config.pathSecret);
    if (path.ok) return { ok: true, reason: path.reason, method: "ruta", status: 200 };
    // Si la ruta falla pero hay firma configurada, todavía puede entrar por firma.
    if (!hasSignatureSecret) return { ok: false, reason: path.reason, method: "ruta", status: 401 };
  }

  const signature = verifyChatwootSignature(
    input.rawBody,
    input.headers,
    config.webhookSecret,
    config.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS,
    nowMs,
  );

  return signature.ok
    ? { ok: true, reason: signature.reason, method: "firma", status: 200 }
    : { ok: false, reason: signature.reason, method: "firma", status: 401 };
}

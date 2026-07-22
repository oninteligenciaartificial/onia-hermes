/*
 * Capa de TRANSPORTE HTTP del cliente SOAP del SIAT (Sistema de Facturacion en
 * Linea, Bolivia). Es la UNICA pieza del emisor que toca la RED.
 *
 * Se disena con fetch INYECTABLE (opcion fetchImpl) para ser 100% testeable SIN
 * red: los tests pasan un mock. Reusa la capa PURA de soap-client.mjs
 * (buildAuthHeader para el header 'Authorization: Token X' y parseSoapResponse
 * para normalizar el body). El core nunca factura (external_gate: siat); esto NO
 * es asesoria fiscal.
 *
 * Responsabilidades:
 *   - POST del envelope con headers Content-Type 'text/xml; charset=UTF-8',
 *     SOAPAction ([VERIFICAR] abajo) y Authorization (via buildAuthHeader).
 *   - Timeout por intento (AbortController).
 *   - Reintentos con backoff EXPONENCIAL ante error de red o HTTP 5xx.
 *     NO reintenta ante 4xx ni ante fault de negocio (soap:Fault / transaccion:false).
 *   - Clasificacion de la respuesta en 5 casos (classifyResponse).
 *
 * ================================ IMPORTANTE ================================
 * SOAPAction: SOAP 1.1 exige el header HTTP presente y con su valor ENTRECOMILLADO;
 * su contenido exacto por operacion se toma del WSDL del piloto (soapAction del
 * binding). Muchos JAX-WS aceptan "" vacio. [VERIFICAR el SOAPAction exacto de
 * cada operacion contra el WSDL del piloto ANTES de emitir real].
 * ===========================================================================
 */
import { buildAuthHeader, parseSoapResponse } from "./soap-client.mjs";

// Content-Type de SOAP 1.1 (SOAP 1.2 usa 'application/soap+xml').
// [VERIFICAR SOAP 1.1 vs 1.2 contra el binding del WSDL del piloto].
export const SOAP_CONTENT_TYPE = "text/xml; charset=UTF-8";

// Defaults de transporte.
export const DEFAULT_TIMEOUT_MS = 30000;
export const DEFAULT_RETRIES = 3;
export const DEFAULT_BACKOFF_MS = 500;

// -------------------------------- helpers ----------------------------------

/** Sleep real (timers de Node). Inyectable via sleepImpl para no esperar en tests. */
function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Backoff exponencial: base * 2^(intento-1). Intento 1 -> base, 2 -> 2*base, etc. */
function backoffFor(baseMs, attempt) {
  return baseMs * 2 ** (attempt - 1);
}

/**
 * Formatea el header SOAPAction (SOAP 1.1: valor entrecomillado). Vacio -> "".
 * [VERIFICAR el valor exacto por operacion contra el WSDL del piloto].
 */
function formatSoapAction(soapAction) {
  if (soapAction == null || soapAction === "") {
    return '""';
  }
  const s = String(soapAction);
  return s.startsWith('"') && s.endsWith('"') ? s : `"${s}"`;
}

/** Detecta un soap:Fault en el body (tolerante a prefijo de namespace). */
function hasSoapFault(xml) {
  // (?=[\s/>]) evita matchear un elemento de negocio que EMPIECE con "Fault".
  return /<(?:[\w-]+:)?Fault(?=[\s/>])/i.test(String(xml ?? ""));
}

/** Status HTTP numerico de una respuesta tipo fetch; null si no lo trae. */
function numericStatus(response) {
  return response && typeof response.status === "number" ? response.status : null;
}

/** Lee el body como texto (compatible con Response de fetch y con mocks). */
async function readBody(response) {
  if (response && typeof response.text === "function") {
    try {
      return await response.text();
    } catch {
      return "";
    }
  }
  if (response && typeof response.body === "string") {
    return response.body;
  }
  return "";
}

/**
 * Un intento de fetch con timeout via AbortController. Si expira, aborta y el
 * fetch rechaza (se maneja como error de red, reintentable). Inyecta fetchImpl.
 */
async function fetchWithTimeout(fetchImpl, endpoint, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(endpoint, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ----------------------------- clasificacion --------------------------------

/**
 * isRetryable: un status HTTP amerita reintento cuando es error de servidor (5xx)
 * o cuando NO hubo respuesta (status null/0 = error de red). 4xx NO se reintenta.
 */
export function isRetryable(status) {
  if (status == null || status === 0) {
    return true; // sin respuesta = error de red
  }
  return status >= 500 && status <= 599;
}

/**
 * classifyResponse: uno de 'ok' | 'network' | 'server' | 'soap_fault' | 'business'.
 *   - soap_fault: el body trae un soap:Fault (error de protocolo; NO reintentable).
 *   - network:    sin respuesta (status null/0).
 *   - server:     HTTP 5xx (reintentable).
 *   - business:   transaccion:false (rechazo de negocio del SIAT; NO reintentable).
 *   - ok:         HTTP 2xx sin fault y sin transaccion:false.
 * El soap_fault se evalua PRIMERO: en SOAP 1.1 un fault viaja con HTTP 500, y no
 * se debe reintentar aunque el status sea 5xx.
 * [VERIFICAR el bucket exacto de un 4xx sin fault contra el comportamiento real
 * del SIAT; aqui se trata como rechazo de request NO reintentable].
 */
export function classifyResponse(status, body) {
  const xml = String(body ?? "");
  if (hasSoapFault(xml)) {
    return "soap_fault";
  }
  if (status == null || status === 0) {
    return "network";
  }
  if (status >= 500) {
    return "server";
  }
  const parsed = parseSoapResponse(xml);
  if (parsed.transaccion === false) {
    return "business";
  }
  if (status >= 200 && status < 300) {
    return "ok";
  }
  // 4xx sin fault ni transaccion:false: request rechazado, NO reintentable.
  return "business";
}

// -------------------------------- transporte --------------------------------

/**
 * postSoap: hace POST del envelope al endpoint y devuelve un resultado normalizado.
 * fetch INYECTABLE (fetchImpl) => testeable sin red. Reintenta con backoff
 * exponencial ante error de red o HTTP 5xx; se detiene tras `retries` intentos.
 *
 * @returns {{ ok:boolean, status:(number|null), body:(string|null),
 *             parsed:(object|null), attempts:number, error:(string|null) }}
 *   error: null si ok; si no, la clasificacion ('network'|'server'|'soap_fault'|'business').
 */
export async function postSoap({
  endpoint,
  envelope,
  token,
  soapAction,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retries = DEFAULT_RETRIES,
  backoffMs = DEFAULT_BACKOFF_MS,
  fetchImpl,
  sleepImpl = defaultSleep,
} = {}) {
  if (!endpoint) {
    throw new Error("postSoap requiere endpoint");
  }
  if (!envelope) {
    throw new Error("postSoap requiere el envelope XML");
  }
  if (typeof fetchImpl !== "function") {
    throw new Error("postSoap requiere fetchImpl (fetch inyectable; sin red en tests)");
  }

  const headers = {
    "Content-Type": SOAP_CONTENT_TYPE,
    // [VERIFICAR el SOAPAction exacto contra el WSDL del piloto].
    SOAPAction: formatSoapAction(soapAction),
    Authorization: buildAuthHeader(token), // 'Token X' (lanza si el token viene vacio)
  };

  const maxAttempts = Math.max(1, retries);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response;
    try {
      response = await fetchWithTimeout(
        fetchImpl,
        endpoint,
        { method: "POST", headers, body: envelope },
        timeoutMs,
      );
    } catch {
      // Error de red (incluye abort por timeout): reintentable.
      if (attempt < maxAttempts) {
        await sleepImpl(backoffFor(backoffMs, attempt));
        continue;
      }
      return { ok: false, status: null, body: null, parsed: null, attempts: attempt, error: "network" };
    }

    const status = numericStatus(response);
    const body = await readBody(response);
    const cls = classifyResponse(status, body);

    // Solo 'server' (5xx) y 'network' se reintentan; soap_fault/business/4xx no.
    if ((cls === "server" || cls === "network") && attempt < maxAttempts) {
      await sleepImpl(backoffFor(backoffMs, attempt));
      continue;
    }

    const parsed = body && body.includes("<") ? parseSoapResponse(body) : null;
    return {
      ok: cls === "ok",
      status,
      body,
      parsed,
      attempts: attempt,
      error: cls === "ok" ? null : cls,
    };
  }

  // Salvaguarda (inalcanzable: el loop siempre retorna en el ultimo intento).
  return { ok: false, status: null, body: null, parsed: null, attempts: maxAttempts, error: "network" };
}

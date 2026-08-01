// ONIA — Chatbot propio: EVENTO A n8n, FIRE-AND-FORGET.
//
// EL PUNTO DE TODO EL CARRIL: n8n sale del camino crítico. Antes era
//   Chatwoot -> n8n -> SSH -> docker exec -> node (arranque en frío) -> respuesta
// o sea que n8n caído o trabado = BOT MUDO. Ahora es
//   Chatwoot -> servidor propio (responde) -> n8n (aviso/analítica, sin esperarlo)
// y n8n caído = se pierde una fila de analítica, nada más. El prospecto ya fue atendido.
//
// REGLAS DE ESTE MÓDULO:
//   1. NUNCA TIRA. Quien llama no envuelve en try/catch; una excepción acá haría 500 el webhook
//      -> Chatwoot reintrega -> el prospecto recibe la respuesta dos veces. Todo error se
//      devuelve como `{ok:false, status:"failed", reason}`.
//   2. NUNCA BLOQUEA. Tiene timeout propio: n8n colgado (no caído: colgado, que es peor) no
//      puede dejar un socket abierto para siempre.
//   3. NUNCA MANDA DATOS CRUDOS. Lo que sale va redactado: sin teléfonos, sin emails, sin el
//      texto completo del prospecto. n8n es analítica, no una copia de la conversación.
//
// Config por entorno (el plan VPS de n8n NO soporta `$env` en los nodos: el secreto viaja como
// header desde acá y en n8n se valida con una credencial "Header Auth"):
//   ONIA_N8N_ENABLED=true|false          apagado por default
//   ONIA_N8N_EVENT_URL=https://...       webhook de n8n que recibe el evento
//   ONIA_N8N_EVENT_SECRET=<secreto>      va en el header `x-onia-webhook-secret`

/** Tope del preview de texto que sale del sistema. */
export const PREVIEW_MAX_CHARS = 500;

/** Timeout del POST a n8n. Corto a propósito: es analítica, no puede hacerle sombra al turno. */
export const N8N_TIMEOUT_MS = 5000;

export function getN8nEventConfig(env = process.env) {
  return {
    enabled: String(env.ONIA_N8N_ENABLED ?? "").toLowerCase() === "true",
    url: String(env.ONIA_N8N_EVENT_URL ?? "").trim() || undefined,
    secret: String(env.ONIA_N8N_EVENT_SECRET ?? "").trim() || undefined,
  };
}

/**
 * Redacta el texto del prospecto antes de que salga del sistema: emails y teléfonos fuera, y
 * cortado. Sirve para saber DE QUÉ se habló sin exportar el dato personal.
 */
export function redactMessagePreview(value) {
  return String(value ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "email-redactado")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, "telefono-redactado")
    .slice(0, PREVIEW_MAX_CHARS);
}

/**
 * Referencia de conversación sin identidad: sólo los últimos 4 caracteres, que alcanzan para
 * correlacionar con Chatwoot a mano pero no identifican a nadie por sí solos.
 */
export function redactConversationRef(conversationId) {
  const value = String(conversationId ?? "").trim();
  if (!value) return "chatwoot-conv-redactada";
  return `chatwoot-conv-redactada-${value.slice(-4)}`;
}

/**
 * Manda el evento. Devuelve SIEMPRE una promesa resuelta (nunca rechaza).
 * @returns {Promise<{ok:boolean, status:"sent"|"skipped"|"failed", reason:string}>}
 */
export async function sendN8nBotTurnEvent(event, config = getN8nEventConfig(), deps = {}) {
  if (!config.enabled) {
    return { ok: true, status: "skipped", reason: "integración n8n apagada" };
  }
  if (!config.url) {
    return { ok: false, status: "failed", reason: "falta ONIA_N8N_EVENT_URL" };
  }
  if (!config.secret) {
    return { ok: false, status: "failed", reason: "falta ONIA_N8N_EVENT_SECRET" };
  }

  const doFetch = deps.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") {
    return { ok: false, status: "failed", reason: "sin fetch disponible" };
  }

  const timeoutMs = Number(deps.timeoutMs) > 0 ? Number(deps.timeoutMs) : N8N_TIMEOUT_MS;

  try {
    const res = await doFetch(config.url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-onia-webhook-secret": config.secret },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
    });

    if (!res || res.ok !== true) {
      return { ok: false, status: "failed", reason: `n8n respondió ${res?.status ?? "sin status"}` };
    }
    return { ok: true, status: "sent", reason: "evento enviado a n8n" };
  } catch (error) {
    // FAIL-OPEN: DNS caído, timeout, ECONNREFUSED, abort. Se registra y se sigue. El turno del
    // prospecto ya se completó; esto es sólo la copia para analítica.
    return { ok: false, status: "failed", reason: `n8n falló: ${String(error?.message || error).slice(0, 200)}` };
  }
}

/**
 * Versión DESACOPLADA de verdad: dispara y vuelve al instante, sin promesa que esperar.
 * El servidor la usa DESPUÉS de haber escrito la respuesta HTTP, así el turno nunca paga la
 * latencia de n8n ni se entera de que falló.
 * @param {(result:object) => void} [onSettled] sólo para observabilidad/tests.
 */
export function fireN8nBotTurnEvent(event, config = getN8nEventConfig(), deps = {}, onSettled) {
  try {
    const promise = sendN8nBotTurnEvent(event, config, deps);
    if (promise && typeof promise.then === "function") {
      promise.then(
        (result) => {
          if (typeof onSettled === "function") onSettled(result);
        },
        (error) => {
          // Defensa en profundidad: `sendN8nBotTurnEvent` ya no rechaza, pero si algún día lo
          // hiciera, un rechazo sin manejar tumba el proceso de Node y con él el bot entero.
          if (typeof onSettled === "function") {
            onSettled({ ok: false, status: "failed", reason: String(error?.message || error).slice(0, 200) });
          }
        },
      );
    }
  } catch (error) {
    if (typeof onSettled === "function") {
      onSettled({ ok: false, status: "failed", reason: String(error?.message || error).slice(0, 200) });
    }
  }
}

/**
 * Arma el evento redactado a partir del resultado del adaptador. PURO: fácil de testear y
 * imposible que filtre un campo nuevo sin pasar por acá.
 */
export function buildBotTurnEvent({ parsed, result, rawText, nowIso }) {
  const sent = Array.isArray(result?.sent) ? result.sent : [];
  return {
    eventType: "chatbot_turn",
    source: "chatwoot-onia",
    mode: result?.dryRun ? "dry_run" : "production",
    conversationRefRedacted: redactConversationRef(parsed?.meta?.conversationId),
    messageIdRedacted: parsed?.meta?.messageId ? "chatwoot-mensaje-redactado" : undefined,
    // Nota de voz: el transcript NO sale del sistema (a propósito), pero sin esta marca n8n no
    // distingue un audio de un mensaje vacío y la analítica cuenta mal el canal.
    bodyPreviewRedacted: result?.voice ? "[nota de voz transcrita]" : redactMessagePreview(rawText),
    voiceNote: Boolean(result?.voice),
    stageBefore: result?.stageBefore ?? null,
    stageAfter: result?.stageAfter ?? null,
    duplicate: Boolean(result?.duplicate),
    skipped: Boolean(result?.skipped),
    repliesCount: sent.length,
    postedCount: sent.filter((reply) => reply?.posted).length,
    deliveryStatus: sent.length === 0 ? "skipped" : sent.some((reply) => reply?.posted) ? "sent" : "failed",
    warningsCount: Array.isArray(result?.warnings) ? result.warnings.length : 0,
    ok: result?.ok !== false,
    // AVISO A SERGIO. Es lo unico de este evento que NO es analitica: cuando el bot deriva a un
    // humano hay alguien esperando del otro lado. Va por aca y no por un Telegram propio porque
    // la credencial vive en n8n (el plan VPS no soporta $env en los nodos). Viaja el MOTIVO, no
    // el texto del prospecto: `notifyReasons` es una lista corta de motivos ya acotados por el
    // motor (queja_o_desconfianza, consulta_clinica_o_legal, pidio_hablar_con_humano...).
    // `notifyCount > 0` es la senal de que n8n tiene que mandar el mensaje, no solo registrar.
    notifyCount: Array.isArray(result?.notify) ? result.notify.length : 0,
    notifyReasons: Array.isArray(result?.notify)
      ? result.notify.map((n) => String(n?.reason || n?.kind || "sin_motivo")).slice(0, 5)
      : [],
    createdAt: nowIso || new Date().toISOString(),
  };
}

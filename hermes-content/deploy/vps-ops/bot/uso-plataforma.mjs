// ONIA — Chatbot propio: REENVIO DEL ENTRANTE A LA PLATAFORMA, FIRE-AND-FORGET.
//
// POR QUE EXISTE. La plataforma cuenta las conversaciones del add-on en
// `POST /api/webhooks/chatwoot` (`registrarMensajeEntrante`, lib/chatbot/cupo.ts) y ese handler
// EXIGE el header `X-Chatwoot-Secret`. Chatwoot NO manda headers personalizados y ademas tiene
// UN solo webhook configurado, que apunta al MOTOR. Resultado medido el 2026-09-04:
// `public.chatbot_uso_mensual` con CERO filas pese a conversaciones nuevas — o sea, la cuota que
// vende `pricing.ts` ("500 conversaciones/mes") era decorativa: nunca se habria agotado.
// Como el motor SI puede mandar el header, el aviso sale de aca.
//
// REGLAS (las mismas tres de n8n-event.mjs, que es el patron de al lado):
//   1. NUNCA TIRA. Una excepcion aca haria 500 el webhook -> Chatwoot reintenta -> el prospecto
//      recibe la respuesta dos veces. Todo error vuelve como `{ok:false, status:"failed"}`.
//   2. NUNCA BLOQUEA. Timeout propio de 2 s y se dispara DESPUES de escribir la respuesta.
//      Tampoco reintenta: si se pierde un mensaje, se pierde una unidad de conteo, no una
//      atencion. Un reintento en bucle contra una plataforma caida es peor que no contar.
//   3. REENVIO TAL CUAL. Va el MISMO cuerpo crudo que mando Chatwoot, sin tocar un byte: las
//      reglas de conteo viven en la plataforma y en un solo lado. Aca solo esta la compuerta de
//      "esto es un entrante real", identica a la de la plataforma, porque reenviar un SALIENTE
//      la haria caer en el relay a WhatsApp y le mandaria el mensaje al cliente DOS VECES.
//
// Config por entorno (`webhook-server.sh` las pasa al proceso):
//   ONIA_PLATFORM_URL=https://app.onia.com.bo   base de la plataforma (sin la ruta)
//   CHATWOOT_WEBHOOK_SECRET=<secreto>           EL MISMO valor que tiene la plataforma en su
//                                               app.env; si difiere, la plataforma devuelve 401.

/** Timeout del POST. Corto a proposito: es contabilidad, no puede hacerle sombra al turno. */
export const USO_TIMEOUT_MS = 2000;

/** Ruta del contador en la plataforma. */
export const USO_PATH = "/api/webhooks/chatwoot";

export function getUsoConfig(env = process.env) {
  const base = String(env.ONIA_PLATFORM_URL ?? "").trim().replace(/\/+$/, "");
  return {
    url: base ? `${base}${USO_PATH}` : "",
    secret: String(env.CHATWOOT_WEBHOOK_SECRET ?? "").trim(),
  };
}

/**
 * LA COMPUERTA. Copia exacta de la condicion de la plataforma
 * (app/api/webhooks/chatwoot/route.ts): `message_created` + `message_type` "incoming" + no
 * privado + ids de conversacion e inbox. Estricta a proposito:
 *   · un SALIENTE no puede pasar nunca — la plataforma lo tomaria por un mensaje del agente y lo
 *     relayearia a WhatsApp, duplicandoselo al cliente;
 *   · lo que no cuenta alla, no viaja de aca.
 * PURA: no toca red, es lo mas facil de testear.
 */
export function esEntranteReal(payload) {
  return Boolean(
    payload &&
      payload.event === "message_created" &&
      payload.message_type === "incoming" &&
      payload.private !== true &&
      payload.conversation &&
      payload.conversation.id &&
      payload.conversation.inbox_id,
  );
}

// El aviso de "falta configuracion" se dice UNA vez por proceso: con un mensaje por cada webhook
// el log se vuelve ruido y deja de leerse justo cuando importa.
let yaAvisoFaltaConfig = false;

/** Para los tests: vuelve a permitir el aviso de configuracion faltante. */
export function resetAvisoUso() {
  yaAvisoFaltaConfig = false;
}

function faltaConfig(reason) {
  const repetido = yaAvisoFaltaConfig;
  yaAvisoFaltaConfig = true;
  return { ok: false, status: "skipped", reason, repetido };
}

/**
 * Manda el cuerpo crudo a la plataforma. Devuelve SIEMPRE una promesa resuelta (nunca rechaza).
 * @param {string} rawBody el cuerpo TAL CUAL lo mando Chatwoot
 * @returns {Promise<{ok:boolean, status:"sent"|"skipped"|"failed", reason:string, repetido?:boolean}>}
 */
export async function enviarUsoPlataforma(rawBody, config = getUsoConfig(), deps = {}) {
  if (!config.url) return faltaConfig("falta ONIA_PLATFORM_URL: la cuota del add-on NO se cuenta");
  if (!config.secret) return faltaConfig("falta CHATWOOT_WEBHOOK_SECRET: la cuota del add-on NO se cuenta");

  const doFetch = deps.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") return { ok: false, status: "failed", reason: "sin fetch disponible" };

  const timeoutMs = Number(deps.timeoutMs) > 0 ? Number(deps.timeoutMs) : USO_TIMEOUT_MS;

  try {
    const res = await doFetch(config.url, {
      method: "POST",
      headers: { "content-type": "application/json", "X-Chatwoot-Secret": config.secret },
      body: String(rawBody ?? ""),
      signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
    });
    if (!res || res.ok !== true) {
      return { ok: false, status: "failed", reason: `la plataforma respondio ${res?.status ?? "sin status"}` };
    }
    return { ok: true, status: "sent", reason: "entrante contado en la plataforma" };
  } catch (error) {
    // FAIL-OPEN: DNS, timeout, ECONNREFUSED, abort. Se pierde una unidad de conteo; el prospecto
    // ya fue atendido. NO se reintenta.
    return { ok: false, status: "failed", reason: `no se pudo avisar: ${String(error?.message || error).slice(0, 200)}` };
  }
}

/**
 * Version desacoplada: dispara y vuelve al instante, sin promesa que esperar. El servidor la
 * llama DESPUES de escribir la respuesta HTTP, asi el turno nunca paga esta latencia.
 * @param {(result:object) => void} [onSettled] solo para observabilidad/tests.
 */
export function dispararUsoPlataforma(rawBody, config = getUsoConfig(), deps = {}, onSettled) {
  const avisar = (result) => {
    if (typeof onSettled === "function") onSettled(result);
  };
  try {
    const promise = enviarUsoPlataforma(rawBody, config, deps);
    if (promise && typeof promise.then === "function") {
      promise.then(avisar, (error) => {
        // Defensa en profundidad: `enviarUsoPlataforma` ya no rechaza, pero un rechazo sin catch
        // tumba el proceso de Node y con el, el bot entero.
        avisar({ ok: false, status: "failed", reason: String(error?.message || error).slice(0, 200) });
      });
    }
  } catch (error) {
    avisar({ ok: false, status: "failed", reason: String(error?.message || error).slice(0, 200) });
  }
}

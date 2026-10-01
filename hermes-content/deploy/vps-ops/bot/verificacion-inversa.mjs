// ONIA — Chatbot propio: VERIFICACION INVERSA del WhatsApp del alta (plan B, 1-oct, Sergio Urcullo).
//
// POR QUE EXISTE. El alta de Onia Platform verifica el WhatsApp del dueño con un código. Lo
// normal es que Onia lo MANDE por plantilla AUTHENTICATION, pero Meta rechaza crear esa plantilla
// en la WABA de Onia (code 10 / subcode 2388185, a nivel de cuenta). El plan B lo da vuelta:
//   1. la pantalla del alta abre wa.me/<número de Onia>?text=Mi código de Onia es 123456;
//   2. el dueño toca Enviar;
//   3. ESTE módulo reconoce el mensaje y le pregunta a la plataforma
//      (POST /api/auth/verificacion-whatsapp/desde-whatsapp) con el teléfono que lo MANDÓ;
//   4. contesta «Listo, tu WhatsApp quedó verificado» y la pantalla pasa sola a verificado.
// Gratis, sin plantilla, y abre la ventana de 24 h.
//
// REGLAS:
//   · APAGADA POR DEFECTO. Sólo ONIA_VERIFICACION_INVERSA=encendida, con secreto e inbox.
//   · NO ENTRA AL EMBUDO. El mensaje de verificación no es un prospecto: el motor no corre, no se
//     crea lead, no va a n8n. El servidor de webhook corta antes del turno.
//   · EL TELÉFONO LO DA META. Sólo el inbox de Onia y sólo `Channel::Whatsapp`: en el widget o el
//     inbox de API el teléfono lo escribe cualquiera, y con eso se verificaría un número ajeno.
//   · FAIL-CLOSED. Sólo un `verificado` explícito de la plataforma se contesta como verificado.
//   · NUNCA TIRA. Todo error vuelve como estado `error`; el webhook sigue en 200.
//
// Config por entorno (`webhook-server.sh` las pasa al proceso):
//   ONIA_VERIFICACION_INVERSA=encendida          el interruptor (cualquier otra cosa = apagada)
//   ONIA_VERIFICACION_INVERSA_SECRETO=<secreto>  EL MISMO valor que la plataforma en su app.env
//   ONIA_VERIFICACION_INVERSA_INBOX_ID=5         el inbox de WhatsApp de ventas de Onia
//   ONIA_VERIFICACION_INVERSA_URL=...            default: la plataforma por la red de Docker

import { createChatwootClient } from "./chatwoot-adapter.mjs";

export const URL_POR_DEFECTO = "http://onia-platform:3000/api/auth/verificacion-whatsapp/desde-whatsapp";
export const TIMEOUT_MS = 5000;
const LARGO_MINIMO_SECRETO = 32;

/** Lo que contesta el bot. Cortas, sin cifras ni promesas: no pasan por el guardrail del LLM. */
export const RESPUESTAS = Object.freeze({
  verificado: "Listo, tu WhatsApp quedó verificado",
  incorrecto:
    "Ese código no coincide. Mandá el código que te muestra ahora la pantalla de Onia, sin cambiarlo.",
  codigo_vencido: "Ese código ya venció. En la pantalla de Onia tocá «Generar otro código» y mandalo de nuevo.",
  sin_intentos: "Probaste varias veces con ese código. En la pantalla de Onia generá uno nuevo y mandalo.",
  sin_pendiente:
    "No encontramos una cuenta esperando este código desde este número. Mandalo desde el WhatsApp que pusiste al crear tu cuenta.",
  limite: "Recibimos muchos intentos seguidos. Esperá unos minutos y probá de nuevo.",
  error: "No pudimos verificar tu código en este momento. Probá de nuevo en unos minutos.",
});

const ESTADOS_DE_LA_PLATAFORMA = new Set([
  "verificado",
  "incorrecto",
  "codigo_vencido",
  "sin_intentos",
  "sin_pendiente",
  "limite",
]);

export function getVerificacionInversaConfig(env = process.env) {
  const secreto = String(env.ONIA_VERIFICACION_INVERSA_SECRETO ?? "").trim();
  const inboxId = String(env.ONIA_VERIFICACION_INVERSA_INBOX_ID ?? "").trim();
  const url = String(env.ONIA_VERIFICACION_INVERSA_URL ?? "").trim() || URL_POR_DEFECTO;
  const pedida = env.ONIA_VERIFICACION_INVERSA === "encendida";
  return {
    // Encendida sin secreto o sin inbox no es "encendida a medias": es apagada.
    encendida: pedida && secreto.length >= LARGO_MINIMO_SECRETO && /^[0-9]+$/.test(inboxId),
    url,
    secreto,
    inboxId,
  };
}

/**
 * El código de «Mi código de Onia es 123456», o null. MISMA regla que la plataforma
 * (onia-platform: lib/whatsapp-onia/inversa.ts → codigoDelMensaje): tolera mayúsculas, tildes,
 * dos puntos y el código partido; no toma un número suelto de una charla de ventas.
 */
export function codigoDelMensaje(texto) {
  if (typeof texto !== "string") return null;
  const plano = texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  const m = /\bcodigo de onia es\b\D{0,3}(\d{3})[\s-]?(\d{3})(?!\d)/.exec(plano);
  return m ? `${m[1]}${m[2]}` : null;
}

/** ¿Este turno es un mensaje de verificación que hay que atender? PURA. */
export function mensajeDeVerificacion(parsed, config) {
  if (!config?.encendida || !parsed || parsed.skip || !parsed.turn) return null;
  const turn = parsed.turn;
  if (String(turn.inbox_id ?? "") !== config.inboxId) return null;
  if (turn.channel_type !== "Channel::Whatsapp") return null;
  const telefono = String(turn.public_contact ?? "").trim();
  if (!telefono) return null;
  const codigo = codigoDelMensaje(turn.text);
  if (!codigo) return null;
  const conversationId = String(parsed.meta?.conversationId ?? turn.contact_ref ?? "");
  if (!conversationId) return null;
  return { telefono, codigo, conversationId };
}

/** Pregunta a la plataforma. Devuelve SIEMPRE un estado; `error` si algo no salió limpio. */
export async function verificarEnPlataforma({ telefono, codigo }, config, deps = {}) {
  const doFetch = deps.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") return "error";
  try {
    const res = await doFetch(config.url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${config.secreto}` },
      body: JSON.stringify({ telefono, codigo }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(Number(deps.timeoutMs) > 0 ? deps.timeoutMs : TIMEOUT_MS) : undefined,
    });
    if (!res || res.ok !== true) return "error";
    const cuerpo = await res.json().catch(() => null);
    const estado = cuerpo && typeof cuerpo.estado === "string" ? cuerpo.estado : null;
    return estado && ESTADOS_DE_LA_PLATAFORMA.has(estado) ? estado : "error";
  } catch {
    return "error";
  }
}

/**
 * El manejador entero. `null` = no es un mensaje de verificación (el turno sigue al motor).
 * Si lo es: verifica, contesta en la conversación y devuelve `{ estado, enviado }`. Nunca tira.
 */
export async function manejarVerificacionInversa(parsed, deps = {}) {
  const config = deps.config || getVerificacionInversaConfig();
  const mensaje = mensajeDeVerificacion(parsed, config);
  if (!mensaje) return null;

  const estado = await verificarEnPlataforma(mensaje, config, deps);
  const texto = RESPUESTAS[estado] ?? RESPUESTAS.error;
  let enviado = false;
  try {
    const client = deps.client || createChatwootClient();
    enviado = Boolean(await client.sendMessage(mensaje.conversationId, texto));
  } catch {
    enviado = false;
  }
  return { estado, enviado };
}

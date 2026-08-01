// ONIA — Chatbot propio: DEDUP EN MEMORIA por id de mensaje de Chatwoot.
//
// POR QUÉ EXISTE si `run-turn.mjs` ya deduplica en base (`store.claimInbound` sobre
// `bot_messages.message_key`, unique):
//
//   1. ES MÁS BARATO Y LLEGA ANTES. El dedup de base recién corta DESPUÉS de cargar la
//      conversación y correr el motor. Éste corta en el primer microsegundo del request, sin
//      tocar Supabase, LiteLLM ni Cal.com. Con el VPS al 240% de carga, un reintento de Chatwoot
//      que se descarta gratis es carga que no se paga.
//   2. FUNCIONA CUANDO LA BASE NO. Si Supabase no responde, `claimInbound` devuelve `null`
//      ("sin dedup: el inbound no se pudo registrar") y el turno sigue igual — que es lo
//      correcto para no quedarse mudo, pero deja la puerta abierta a la doble respuesta
//      justo en el peor momento. Este store en memoria la cierra.
//
// NO REEMPLAZA al de base: el de base es el durable (sobrevive un reinicio del proceso y cubre
// varias instancias). Éste es el filtro rápido de adelante. Los dos, en ese orden.
//
// Chatwoot reintrega el MISMO `message_created` ante una respuesta no-2xx o un timeout. Sin
// dedup el prospecto recibe la misma respuesta dos veces.
//
// Puro y a prueba de fallos: reloj inyectable (`nowMs`), no tira, sin I/O. Sin id NUNCA bloquea
// (no se puede deduplicar sin identificador, y quedarse mudo es peor que responder de más).

/** Ventana de deduplicación: ~10 min. Un reintento de Chatwoot llega muchísimo antes. */
export const DEDUP_TTL_MS = 10 * 60 * 1000;

/** Cota del store para que no crezca sin límite. Al llegar, se evicta el más viejo (FIFO). */
export const DEDUP_MAX_ENTRIES = 5000;

// messageKey -> timestamp de expiración (ms). El orden de inserción del Map ES el orden FIFO
// que se usa para evictar el más antiguo cuando se toca la cota.
const seen = new Map();

function purgeExpired(nowMs) {
  for (const [key, expiry] of seen) {
    if (expiry <= nowMs) seen.delete(key);
  }
}

function registerMessage(messageKey, nowMs) {
  // Primero soltar lo vencido; casi siempre alcanza para quedar bajo la cota.
  purgeExpired(nowMs);

  // Reinsertar mueve la clave al final (más reciente) para un FIFO estable.
  if (seen.has(messageKey)) seen.delete(messageKey);

  if (seen.size >= DEDUP_MAX_ENTRIES) {
    const oldest = seen.keys().next().value;
    if (oldest !== undefined) seen.delete(oldest);
  }

  seen.set(messageKey, nowMs + DEDUP_TTL_MS);
}

/**
 * Devuelve `true` la PRIMERA vez que ve una clave (y la registra), `false` si ya la vio dentro
 * del TTL. Sin clave (undefined/"") devuelve `true` SIEMPRE.
 */
export function shouldProcessMessage(messageKey, nowMs = Date.now()) {
  if (!messageKey) return true;

  const expiry = seen.get(messageKey);
  if (expiry !== undefined && expiry > nowMs) return false; // reintento vigente: no reprocesar

  registerMessage(messageKey, nowMs);
  return true;
}

/**
 * Suelta una clave reclamada. Se usa cuando el turno falló ANTES de mandar nada: si no, el
 * mensaje queda marcado como "ya procesado" durante 10 min y un reintento legítimo se descarta
 * sin que el prospecto haya recibido jamás una respuesta.
 */
export function releaseMessage(messageKey) {
  if (!messageKey) return false;
  return seen.delete(messageKey);
}

// Helpers sólo para tests (no usar en producción).
export function _dedupSize() {
  return seen.size;
}

export function _resetDedup() {
  seen.clear();
}

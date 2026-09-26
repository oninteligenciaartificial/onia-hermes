// ONIA — Chatbot propio: RESERVA REAL en Cal.com.
//
// EL PROBLEMA QUE RESUELVE: hasta hoy el bot decia "Listo, agendado" y no reservaba NADA.
// `calcom-availability.mjs` solo LEE disponibilidad (`slots/getSchedule`); nadie escribia la
// reserva, y `calendar_event_id` quedaba en null para siempre. Consecuencias reales, no teoricas:
// dos prospectos podian elegir el mismo horario, y la demo no aparecia en el calendario de
// Sergio — o sea que el bot cerraba reuniones a las que no iba a ir nadie.
//
// COMO RESERVA: `POST /api/book/event`, el MISMO endpoint que usa la pagina publica de reservas.
// Se eligio ese y no la API v1 (`/api/bookings`) por dos razones verificadas contra el VPS:
//   1. La API v1 es un servicio aparte que en este self-hosted NO esta desplegado (devuelve 404),
//      y ademas exigiria manejar una API key (hoy hay 0 en la base).
//   2. Al ser el camino publico, Cal.com aplica SUS PROPIAS reglas: si el horario ya se tomo,
//      responde 409. La proteccion contra doble reserva no la inventamos nosotros — verificado:
//      reservar el mismo horario dos veces da 409 `no_available_users_found_error`.
//
// DOS TIPOS DE EVENTO A PROPOSITO (verificado 2026-07-31):
//   - `demo-onia` (publico) tiene 12 campos custom, 10 OBLIGATORIOS (empresa, presupuesto,
//     urgencia, rol...). Esta bien para el humano que entra solo a cal.onia.com.bo.
//   - `demo-bot` (oculto, id 5) no tiene ninguno. El bot ya califico por WhatsApp con 3 datos;
//     pedirle 10 mas lo perderia en el tercero.
//   Comparten `userId` y `scheduleId`, asi que una reserva en uno BLOQUEA al otro. Por eso la
//   disponibilidad se lee de `demo-onia` (publico: un evento oculto no publica slots) y se
//   reserva en `demo-bot`.
//
// Tolerante por contrato: no tira NUNCA. Si Cal.com no responde, devuelve `ok:false` con una
// razon y el llamador decide. Un fallo de calendario no puede dejar al prospecto sin respuesta.

import { DEFAULT_CONFIG } from "./config.mjs";

/**
 * Duracion de la demo. NO es un numero suelto: sale del MISMO bloque del que el guion saca lo que
 * le promete al prospecto ({{demo_duracion}}), asi que el texto y el calendario no pueden decir
 * dos cosas distintas. Igual que el tipo de evento; si no coinciden, manda el tipo de evento.
 */
export const DEFAULT_DURATION_MINUTES = DEFAULT_CONFIG.demo.duracionMinutos;

/** Bolivia no tiene horario de verano: siempre UTC-4. */
export const DEFAULT_TIME_ZONE = "America/La_Paz";

/**
 * Config desde el entorno. `eventTypeId` es el del evento OCULTO del bot (`demo-bot`), NO el
 * publico: reservar en el publico falla por los 10 campos obligatorios.
 * @param {number} [fallbackMinutes]  la duracion del conocimiento/config, que se usa cuando el
 *   entorno no fija CALCOM_BOT_DURATION_MINUTES. El entorno sigue ganando: es el freno de mano
 *   del que despliega y no queremos que una edicion de datos se lo saque.
 */
export function getBookingConfig(env = process.env, fallbackMinutes = DEFAULT_DURATION_MINUTES) {
  const rawId = Number(env.CALCOM_BOT_EVENT_TYPE_ID);
  const rawDuration = Number(env.CALCOM_BOT_DURATION_MINUTES);
  const fallback = Number.isFinite(fallbackMinutes) && fallbackMinutes > 0 ? fallbackMinutes : DEFAULT_DURATION_MINUTES;
  return {
    baseUrl: String(env.CALCOM_BASE_URL || "").replace(/\/+$/, ""),
    eventTypeId: Number.isInteger(rawId) && rawId > 0 ? rawId : null,
    durationMinutes: Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : fallback,
    timeZone: String(env.CALCOM_TIMEZONE || DEFAULT_TIME_ZONE),
  };
}

/**
 * Correo del asistente. El bot NO le pide el mail al prospecto a proposito (cada dato que pide
 * es un prospecto que se cae), pero Cal.com exige uno. Se arma uno propio y trazable en el
 * dominio de Onia: la confirmacion le llega a Onia, no a un correo inventado del prospecto.
 * NUNCA fabricar un mail con pinta de real: seria dato falso en el calendario del cliente.
 */
export function botAttendeeEmail(conversationKey, domain = "onia.com.bo") {
  const safe = String(conversationKey || "sin-clave").replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 40);
  return `bot+${safe}@${domain}`;
}

/**
 * URL PUBLICA de Cal.com. NO es `CALCOM_BASE_URL`: en el VPS esa vale `http://calcom:3000` (el
 * hostname interno de docker, mas rapido para reservar sin salir a internet) y mandarsela al
 * prospecto seria darle un link que no abre desde su telefono. Por eso el link se arma con una
 * variable propia y, si nadie la define, con el dominio publico — nunca con la interna.
 */
export const DEFAULT_PUBLIC_URL = "https://cal.onia.com.bo";

/**
 * Link de la reunion a partir del uid que devolvio la reserva (el mismo que se guarda en
 * `calendar_event_id`). `/booking/<uid>` es la pagina de la reserva de Cal.com: muestra cuando es,
 * el boton para entrar y permite reprogramar o cancelar.
 *
 * Se DERIVA del uid a proposito, en vez de guardar una URL nueva: el uid ya esta persistido desde
 * la primera reserva, asi que esto tambien le sirve a las demos que se agendaron antes de que
 * existiera el recordatorio. Techo conocido: es la pagina de la reserva, no la sala de video
 * directa (`metadata.videoCallUrl`, que hoy `createBooking` descarta). Si algun dia se quiere el
 * link directo a la sala, hay que capturarlo al reservar Y persistirlo — y seguiria haciendo falta
 * este fallback para todo lo ya reservado.
 *
 * @returns {string|null} null si no hay uid: sin uid NO se inventa un link.
 */
export function meetingLink(uid, env = process.env) {
  const clean = String(uid || "").trim();
  if (!clean) return null;
  const base = String((env && env.CALCOM_PUBLIC_URL) || DEFAULT_PUBLIC_URL).replace(/\/+$/, "");
  if (!base) return null;
  return `${base}/booking/${encodeURIComponent(clean)}`;
}

/** Payload de `/api/book/event`. Puro: mismo input, mismo output. */
export function buildBookingPayload(options = {}) {
  const startMs = Date.parse(options.startAt);
  if (!Number.isFinite(startMs)) return null;

  const minutes = Number(options.durationMinutes) > 0 ? Number(options.durationMinutes) : DEFAULT_DURATION_MINUTES;
  const start = new Date(startMs);
  const end = new Date(startMs + minutes * 60_000);

  return {
    eventTypeId: options.eventTypeId,
    start: start.toISOString(),
    end: end.toISOString(),
    timeZone: options.timeZone || DEFAULT_TIME_ZONE,
    language: "es",
    metadata: {},
    responses: {
      name: String(options.name || "Prospecto").slice(0, 120),
      email: options.email,
      ...(options.notes ? { notes: String(options.notes).slice(0, 500) } : {}),
    },
  };
}

/** Lo que el bot ya sabe del prospecto, en una linea para el calendario. Nunca inventa. */
export function buildBookingNotes(qualification = {}) {
  // Los campos de calificacion son rubro/tamano/ciudad, iguales para todos los rubros. `chairs`
  // sobrevive como dato de RAMA (solo dental): si esta, suma; si no, no se nombra. Antes esto
  // escribia \"clinica propia\" y \"sillones\" siempre, asi que la reserva de una ferreteria
  // llegaba al calendario vacia.
  const parts = [];
  if (qualification.industry) parts.push(`rubro: ${qualification.industry}`);
  if (qualification.teamSize !== undefined && qualification.teamSize !== null) parts.push(`personas: ${qualification.teamSize}`);
  if (qualification.city) parts.push(`ciudad: ${qualification.city}`);
  if (qualification.chairs !== undefined && qualification.chairs !== null) parts.push(`sillones: ${qualification.chairs}`);
  parts.push("agendado por el asistente automatico de Onia");
  return parts.join(" | ");
}

/**
 * El cierre honesto que se le pega al "Listo, agendado" que el motor ya redacto, cuando la
 * reserva NO salio. `horario_tomado` (409) es el caso de carrera: alguien gano el horario entre
 * que se ofrecio y que el prospecto contesto.
 *
 * Vive aca, y no en quien lo usa, porque lo pegan TRES caminos distintos (el vivo, el seco de
 * `runTurn` y `simulate.mjs`). Tener dos copias del texto es literalmente como nacio el bug que
 * lo trajo: el simulador no agregaba nada y prometia mas que el producto.
 */
export function cierreDeReservaFallida(reason) {
  return reason === "horario_tomado"
    ? "\n\n_(Ojo: justo se me ocupó ese horario. Sergio te escribe ahora para acomodarlo.)_"
    : "\n\n_(Estoy confirmando ese horario con Sergio; si hubiera un cruce te aviso enseguida.)_";
}

/**
 * El `kind` del aviso que DESDICE al "DEMO AGENDADA — anotala" que el motor emite en el mismo
 * turno. Va exportado porque lo nombran tres lados que no se pueden desincronizar: quien lo
 * emite (`run-turn.mjs`), quien lo rotula (`ETIQUETAS` de `aviso-telegram.mjs`) y quien lo
 * verifica.
 */
export const KIND_RESERVA_SIN_CONFIRMAR = "reserva_sin_confirmar";

/**
 * El aviso del DESENLACE de una reserva que no salio — SOLO cuando el desenlace contradice al
 * aviso que el motor ya mando.
 *
 * QUE NO ES. No es "avisar cada reserva fallida". Correr sin calendario es una decision TOMADA
 * y vigente (opcion (c), tablero `t_b18ca430`, 2026-09-03: Telegram ya, Cal.com cuando moleste
 * anotar a mano). En ese flujo degradado el fallo es el camino NORMAL: el prospecto elige, la
 * fila queda en la base, Sergio Urcullo recibe "DEMO AGENDADA — anotala" y confirma por
 * WhatsApp. Un aviso extra por cada demo seria ruido sobre un canal que ya se pidio limpio, y
 * encima le discutiria una decision que el ya tomo.
 *
 * QUE SI ES. `cierreDeReservaFallida` tiene DOS textos y solo uno promete una accion humana
 * INMEDIATA y excepcional: con `horario_tomado` (409, carrera real) el bot le dice al prospecto
 * "Sergio te escribe ahora para acomodarlo". Ahi el unico aviso que sale dice "DEMO AGENDADA —
 * anotala", que es lo CONTRARIO de lo que pasa: ese horario NO quedo libre para el, y anotarlo
 * manda a Sergio Urcullo a una reunion que choca. Una instruccion que el bot le da al usuario es
 * un contrato: el otro lado tiene que existir.
 *
 * El horario viaja en el texto porque es lo unico accionable.
 *
 * @returns {{kind: string, reason: string, conversationKey: string|null, text: string}|null}
 *          `null` cuando el fallo es el esperado y el aviso del motor ya alcanza.
 */
export function avisoDeReservaFallida({ conversationKey, reason, scheduledLabel, scheduledAt } = {}) {
  if (reason !== "horario_tomado") return null;
  const cuando = String(scheduledLabel || scheduledAt || "").trim();
  return {
    kind: KIND_RESERVA_SIN_CONFIRMAR,
    reason: String(reason),
    conversationKey: conversationKey || null,
    text: cuando
      ? `Pidió ${cuando} y ese horario YA ESTABA TOMADO: no lo anotes, choca. Le dijimos que vos le escribís ahora para acomodarlo.`
      : `El horario que pidió YA ESTABA TOMADO: no lo anotes, choca. Le dijimos que vos le escribís ahora para acomodarlo.`,
  };
}

/**
 * QUE le agrega al texto un camino que NO reserva, y por que.
 *
 * La comparten los dos consumidores del modo seco, que son caminos distintos del mismo
 * producto: `runTurn` con `dryRun`, y `simulate.mjs`, que ni siquiera pasa por `runTurn` (llama
 * a `step()` directo). Si cada uno decide por su cuenta cuando va el cierre, divergen — que es
 * exactamente lo que se midio el 2026-09-12: el simulador imprimia "Listo, agendado" pelado
 * mientras los dos mensajes que el bot MANDO de verdad (convs 11 y 49 de Chatwoot) llevaban la
 * salvedad. El instrumento con el que el carril mide "simulador 3/3" cada vuelta era ciego a la
 * regresion que mas le importa.
 *
 * Tri-estado a proposito: `sin_config` se DERIVA del entorno sin tocar la red, asi que ahi el
 * desenlace se sabe con certeza; con Cal.com configurado NO se sabe, y eso se reporta como
 * ignorancia en vez de inventar un final.
 *
 * OJO con la premisa: aca decia "y hoy es el 100% del trafico: no hay Cal.com en el VPS", y
 * medido el 2026-09-18 es al reves. El proceso vivo SI declara `CALCOM_BASE_URL=http://calcom:3000`
 * y `CALCOM_BOT_EVENT_TYPE_ID=5` (leido de `/proc/<pid>/environ` dentro de `onia-center`), asi que
 * en produccion `sin_config` es el 0% y esta rama no se toca nunca. Lo que no existe es el
 * DESTINO: `docker ps` no lista un contenedor `calcom` ni parado, y desde `onia-center` el
 * hostname ni resuelve (`wget: bad address 'calcom:3000'`). O sea que el 100% real cae en
 * `reason: "error"` despues de agotar `BOOKING_TIMEOUT_MS` — 5 s de espera DENTRO del turno de un
 * prospecto, no una derivacion gratis. Un comentario que afirma el estado del VPS es una
 * hipotesis con fecha: se vuelve a medir antes de apoyarse en el.
 *
 * @returns {{texto: string, motivo: "sin_config"|"depende_de_la_reserva"|null}}
 */
export function cierreSinReservar({ stageBefore, stageAfter, scheduledAt, calendarEventId, env, duracionMinutos } = {}) {
  const recienAgendada = stageBefore !== "demo_agendada" && stageAfter === "demo_agendada";
  if (!recienAgendada || !scheduledAt || calendarEventId) return { texto: "", motivo: null };
  const config = getBookingConfig(env || process.env, duracionMinutos);
  if (!config.baseUrl || !config.eventTypeId) {
    return { texto: cierreDeReservaFallida("sin_config"), motivo: "sin_config" };
  }
  return { texto: "", motivo: "depende_de_la_reserva" };
}

/**
 * Tope de la reserva, en ms.
 *
 * Mismo numero que `AVISO_TIMEOUT_MS` de `aviso-telegram.mjs` y por el mismo motivo: las dos
 * salen a la red DENTRO del turno de un prospecto que esta esperando una respuesta. La
 * diferencia era que el aviso tenia reloj y la reserva no.
 */
export const BOOKING_TIMEOUT_MS = 5000;

/**
 * Codigos con los que el sistema dice "ese NOMBRE no existe".
 *
 * Solo resolucion. `ECONNREFUSED` queda AFUERA a proposito: ahi el nombre resolvio y alguien
 * contesto que no escucha — es un destino que existe y esta apagado, un diagnostico distinto
 * (y en general mas facil de arreglar) que un hostname que no apunta a nada.
 */
const NO_RESUELVE = new Set(["EAI_AGAIN", "ENOTFOUND"]);

/**
 * Cuanto se RECUERDA que el destino no contesta, en ms.
 *
 * El tope de arriba protege UN turno; esto protege a los que vienen despues. El 100% del
 * trafico real agota los 5 s (`CALCOM_BASE_URL` declarado, contenedor `calcom` inexistente:
 * medido el 2026-09-18 y re-medido el 2026-09-26 desde `onia-center` — el DNS de Docker no
 * contesta NXDOMAIN por ese nombre: `dns.lookup("calcom")` cuelga hasta `EAI_AGAIN` a los
 * 5013 ms, con `dns.lookup("onia-platform")` en 8 ms como control. Llega como AbortError porque
 * el abort de los 5000 ms le gana por 13 ms, no porque el destino conteste; por eso el codigo
 * real se lee de `cause.code` y no del nombre del error), y sin
 * memoria la demo numero 40 los paga igual que la primera. Se los cobra al prospecto en el
 * turno donde ACEPTA un horario, que es el unico del embudo que produce plata.
 *
 * La ventana es corta A PROPOSITO: el dia que Cal.com exista —que es la opcion (c) del tablero
 * `t_b18ca430`, "calendario despues"— nadie tiene que acordarse de reiniciar el bot. Un breaker
 * que no reintenta solo es el mismo bug al revés, y encima mudo.
 */
export const DESTINO_CAIDO_MS = 10 * 60 * 1000;

/**
 * Lo unico que se recuerda: hasta cuando, y por que. Vive en el modulo porque el destino es del
 * PROCESO, no de un turno — cada turno del webhook llama a `createBooking` de cero.
 */
let destinoCaidoHasta = 0;

/** Olvida el destino caido. Para los tests, y para forzar un reintento sin esperar la ventana. */
export function olvidarDestinoCaido() {
  destinoCaidoHasta = 0;
}

/**
 * QUIEN fallo, y por eso si se cierra el destino o no.
 *
 * Solo cuenta como destino caido lo que pasa ANTES de que el servidor conteste: timeout y error
 * de red. Un 409 o un 500 prueban que Cal.com esta VIVO, y cerrar el destino ahi perderia
 * reservas buenas — que es peor que el gasto que esto viene a evitar.
 */
function recordarDestinoCaido(now) {
  destinoCaidoHasta = now + DESTINO_CAIDO_MS;
}

/**
 * Crea la reserva.
 *
 * @returns {Promise<{ok: boolean, uid: string|null, reason: string, warnings: string[]}>}
 *   `reason: "horario_tomado"` es el caso IMPORTANTE: alguien gano la carrera por ese horario.
 *   El llamador tiene que ofrecer el otro, no repetir "listo, agendado".
 *   `reason: "destino_caido"` es no-reservar SIN gastar el turno: para el prospecto es igual
 *   que cualquier otro fallo (misma salvedad honesta), lo que cambia es lo que no se espera.
 */
export async function createBooking(options = {}, deps = {}) {
  const warnings = [];
  const config = options.config || getBookingConfig(deps.env || process.env, options.durationMinutes);
  const doFetch = deps.fetch || options.fetch || globalThis.fetch;
  // El reloj se inyecta para poder probar la ventana sin dormir 10 minutos en un test.
  const ahora = () => (typeof deps.now === "function" ? deps.now() : Date.now());

  if (!config.baseUrl || !config.eventTypeId) {
    return { ok: false, uid: null, reason: "sin_config", warnings: ["calcom: falta CALCOM_BASE_URL o CALCOM_BOT_EVENT_TYPE_ID"] };
  }
  if (typeof doFetch !== "function") {
    return { ok: false, uid: null, reason: "sin_fetch", warnings: ["calcom: no hay implementacion de fetch"] };
  }
  if (ahora() < destinoCaidoHasta) {
    // No es silencio ni es una reserva: es el MISMO no-reservar de siempre, sin cobrarle al
    // prospecto un tope que ya se sabe que se va a agotar. El texto que recibe no cambia.
    return {
      ok: false,
      uid: null,
      reason: "destino_caido",
      warnings: [`calcom: no se intento — el destino no contesto hace menos de ${Math.round(DESTINO_CAIDO_MS / 60000)} min`],
    };
  }

  const payload = buildBookingPayload({
    eventTypeId: config.eventTypeId,
    startAt: options.startAt,
    durationMinutes: config.durationMinutes,
    timeZone: config.timeZone,
    name: options.name,
    email: options.email || botAttendeeEmail(options.conversationKey),
    notes: options.notes,
  });
  if (!payload) {
    return { ok: false, uid: null, reason: "inicio_invalido", warnings: [`calcom: startAt invalido: ${options.startAt}`] };
  }

  // El reloj es del PRODUCTO, no del llamador. Ninguno de los tres caminos que reservan pasa
  // `signal`, asi que `signal: deps.signal` era `undefined` en el 100% del trafico real y el
  // turno del prospecto quedaba atado a lo que tardara la red. Con el signal del llamador
  // presente se respeta: el reloj se suma, no lo reemplaza.
  const timeoutMs = Number(deps.timeoutMs) > 0 ? Number(deps.timeoutMs) : BOOKING_TIMEOUT_MS;
  const reloj = new AbortController();
  const alarma = setTimeout(() => reloj.abort(), timeoutMs);
  const cancelarConElLlamador = () => reloj.abort();
  if (deps.signal) {
    if (deps.signal.aborted) reloj.abort();
    else deps.signal.addEventListener("abort", cancelarConElLlamador, { once: true });
  }

  let response;
  try {
    response = await doFetch(`${config.baseUrl}/api/book/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: reloj.signal,
    });
  } catch (error) {
    // El timeout se NOMBRA. Un "error" generico manda a diagnosticar la red del prospecto
    // cuando el problema es nuestro: el calendario no contesto a tiempo.
    //
    // Y el fallo de RESOLUCION se nombra aparte, porque es el que pasa de verdad: medido el
    // 2026-09-26 dentro de `onia-center`, `dns.lookup("calcom")` termina en `EAI_AGAIN` a los
    // 5013 ms (control `onia-platform`: 8 ms) — el DNS de Docker no contesta NXDOMAIN por ese
    // nombre, cuelga. Con el tope en 5000 ms el abort le gana por 13 ms, asi que el log dice
    // "timeout"; correr el tope unos milisegundos, o un resolver un poco mas rapido, y el MISMO
    // fallo saldria como "fetch failed" pelado. Diagnosticar por quien gana una carrera de 13 ms
    // no es diagnosticar: el codigo real viene en `cause.code` y ese no depende del reloj.
    const codigoDeRed = String(error?.cause?.code || error?.code || "");
    const detalle = NO_RESUELVE.has(codigoDeRed)
      ? `el nombre del destino no resuelve (${codigoDeRed}): revisar CALCOM_BASE_URL, no la red del prospecto`
      : error?.name === "AbortError"
        ? `no contesto en ${timeoutMs}ms (timeout)`
        : String(error?.message || error).slice(0, 200);
    // El servidor nunca contesto: esto es el destino, no la reserva. Se recuerda para que el
    // proximo prospecto que acepte un horario no vuelva a esperar el tope completo.
    recordarDestinoCaido(ahora());
    return { ok: false, uid: null, reason: "error", warnings: [`calcom: la reserva no salio: ${detalle}`] };
  } finally {
    clearTimeout(alarma);
    if (deps.signal) deps.signal.removeEventListener?.("abort", cancelarConElLlamador);
  }

  // 409 = el horario se ocupo entre que se ofrecio y que el prospecto contesto. NO es un bug:
  // es exactamente la carrera que esta reserva viene a cerrar, y hay que distinguirla de un
  // error de red para poder ofrecer el otro horario en vez de mentir.
  if (response.status === 409) {
    return { ok: false, uid: null, reason: "horario_tomado", warnings: ["calcom: el horario ya estaba tomado"] };
  }

  if (!response.ok) {
    let detail = "";
    try { detail = (await response.text()).slice(0, 200); } catch { /* el cuerpo no importa tanto como el status */ }
    return { ok: false, uid: null, reason: "error", warnings: [`calcom: HTTP ${response.status} ${detail}`] };
  }

  let body = null;
  try { body = await response.json(); } catch { warnings.push("calcom: reservo pero la respuesta no era JSON"); }

  const uid = body && typeof body.uid === "string" ? body.uid : null;
  if (!uid) warnings.push("calcom: reservo pero no devolvio uid");

  // Reservo: el destino esta vivo para todos los turnos que siguen. Sin esto la ventana seguiria
  // corriendo sobre un Cal.com que ya contesta, y las demos de los 10 min siguientes no se
  // reservarian teniendo con quien.
  olvidarDestinoCaido();
  return { ok: true, uid, reason: "reservado", warnings };
}

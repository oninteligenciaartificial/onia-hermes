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

import { lookup as dnsLookup } from "node:dns/promises";

import { DEFAULT_CONFIG } from "./config.mjs";
import { say } from "./reply-builder.mjs";

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

/** La variable que ENCIENDE la agenda propia del bot. Sin ella, el bot no agenda. */
export const AGENDA_ENV = "ONIA_BOT_AGENDA";

/**
 * ¿Con que agenda trabaja el bot? `propia` = ofrece horarios y los reserva en Cal.com; `persona`
 * = no ofrece «agendo yo»: la demo la coordina la persona (o el link de la agenda real, si el
 * conocimiento la trae).
 *
 * EL DEFAULT ES LA PERSONA, y es la mitad que importa (auditoria de produccion del 2-oct, §2
 * accion 3). El proceso vivo declara `CALCOM_BASE_URL=http://calcom:3000` y
 * `CALCOM_BOT_EVENT_TYPE_ID=5`, pero el contenedor `calcom` no existe; y los horarios que ofrecia
 * no salian de ningun calendario sino de un cron (`slots-rodantes.mjs`). Resultado: «Listo,
 * agendado» y en la linea siguiente «estoy confirmando ese horario». Tener Cal.com DECLARADO no
 * alcanza para encender nada: hay que pedirlo (`ONIA_BOT_AGENDA=calcom`) Y tener con que.
 *
 * Por eso tampoco se mira si Cal.com contesta: eso es por reserva (`createBooking`, con su tope y
 * su memoria de destino caido). Esto decide si el bot PROMETE agendar, y una promesa no se enciende
 * sola porque un destino volvio a contestar.
 *
 * @returns {{modo: "propia"|"persona", motivo: string}}
 */
export function agendaDelEntorno(env = process.env) {
  const pedido = String(env?.[AGENDA_ENV] ?? "").trim().toLowerCase();
  if (pedido !== "calcom") {
    return {
      modo: "persona",
      motivo: pedido ? `${AGENDA_ENV}=${pedido} no es un agendador que el bot sepa usar` : `${AGENDA_ENV} sin definir (default: la persona)`,
    };
  }
  const config = getBookingConfig(env || {});
  if (!config.baseUrl || !config.eventTypeId) {
    return { modo: "persona", motivo: `${AGENDA_ENV}=calcom sin CALCOM_BASE_URL o CALCOM_BOT_EVENT_TYPE_ID: no hay con que reservar` };
  }
  return { modo: "propia", motivo: "calcom" };
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
 * La reserva NO salio: el M2 que el motor ya redacto («Listo, agendado: …») se REEMPLAZA por la
 * version honesta, y la conversacion pasa a la persona.
 *
 * POR QUE REEMPLAZAR Y NO PEGAR. Hasta el 2-oct aca vivia `cierreDeReservaFallida`, una linea que
 * se le PEGABA al final de M2: el prospecto leia «Listo, agendado» y abajo «estoy confirmando ese
 * horario con Sergio» (auditoria de produccion del 2-oct, §2 accion 3). Confirmar y desdecirse en
 * el mismo mensaje sigue siendo confirmar. El motor es puro y no puede saber si la reserva va a
 * salir; quien lo sabe es este paso, y por eso es el que elige el texto.
 *
 * POR QUE PASA A LA PERSONA. Si la conversacion quedara en `demo_agendada`, el acuse siguiente (M2b)
 * le diria «Nos vemos jueves 15:00», el recordatorio M9 le recordaria una demo que no existe y el
 * cierre le preguntaria como le fue. Lo que se le prometio es que se la confirma una persona: la
 * conversacion es de ella.
 *
 * Lo usan los TRES caminos que cierran una eleccion sin reservar —el vivo y el seco de `runTurn`, y
 * `simulate.mjs`, que llama a `step()` directo— para que ninguno prometa mas que otro (asi nacio el
 * bug del simulador el 2026-09-12).
 *
 * Lo que vino DESPUES de M2 en el mismo mensaje (la coletilla M7 de fuera de horario) se conserva.
 *
 * @returns {{replies: object[], nextState: object, plantilla: string}}
 */
export function reservaQueNoSalio({ replies, nextState, config, reason } = {}) {
  const plantilla = reason === "horario_tomado" ? "M2_HORARIO_TOMADO" : "M2_SIN_RESERVA";
  const confirmada = say("M2", nextState, config).text;
  const honesta = say(plantilla, nextState, config).text;
  for (const reply of replies || []) {
    if (reply?.templateKey !== "M2") continue;
    const texto = String(reply.text || "");
    const resto = texto.startsWith(confirmada) ? texto.slice(confirmada.length) : "";
    reply.text = honesta + resto;
    reply.templateKey = plantilla;
    // La fila del saliente dice en que etapa quedo la conversacion: que no diga `demo_agendada`.
    if ("stageAfter" in reply) reply.stageAfter = "handoff_humano";
  }
  return {
    replies,
    nextState: { ...nextState, botStage: "handoff_humano", handoffAckAt: null },
    plantilla,
  };
}

/**
 * El `kind` del aviso que DESDICE al "DEMO AGENDADA — anotala" que el motor emite en el mismo
 * turno. Va exportado porque lo nombran tres lados que no se pueden desincronizar: quien lo
 * emite (`run-turn.mjs`), quien lo rotula (`ETIQUETAS` de `aviso-telegram.mjs`) y quien lo
 * verifica.
 */
export const KIND_RESERVA_SIN_CONFIRMAR = "reserva_sin_confirmar";

/**
 * El aviso del DESENLACE de una reserva que no salio: desdice al «DEMO AGENDADA — anotala» que el
 * motor ya emitio en el mismo turno.
 *
 * SALE SIEMPRE que la reserva falla (cambio del 2-oct). Antes salia solo con `horario_tomado`,
 * porque correr sin calendario era la opcion (c) del tablero `t_b18ca430` y ahi el fallo era el
 * camino normal. Esa opcion hoy es el modo `persona` (`agendaDelEntorno`, el default): sin agenda
 * el bot ni ofrece horarios. Con agenda propia ENCENDIDA a proposito, que la reserva no salga es
 * una excepcion — y al prospecto se le acaba de decir que se lo confirma Sergio Urcullo
 * (`reservaQueNoSalio`). Una instruccion que el bot le da al usuario es un contrato: el otro lado
 * tiene que existir.
 *
 * El horario viaja en el texto porque es lo unico accionable.
 *
 * @returns {{kind: string, reason: string, conversationKey: string|null, text: string}}
 */
export function avisoDeReservaFallida({ conversationKey, reason, scheduledLabel, scheduledAt } = {}) {
  const cuando = String(scheduledLabel || scheduledAt || "").trim();
  const motivo = String(reason || "sin_motivo");
  const pidio = cuando ? `Pidió ${cuando}` : "El horario que pidió";
  const text = motivo === "horario_tomado"
    ? `${pidio} y ese horario YA ESTABA TOMADO: no lo anotes, choca. Le dijimos que vos le escribís para acomodar otro.`
    : `${pidio} y la reserva NO salió (${motivo}): no está en ningún calendario. Le dijimos que vos se lo confirmás.`;
  return { kind: KIND_RESERVA_SIN_CONFIRMAR, reason: motivo, conversationKey: conversationKey || null, text };
}

/**
 * QUE pasa con una eleccion en un camino que NO reserva (el modo seco de `runTurn` y
 * `simulate.mjs`), y por que.
 *
 * Tri-estado a proposito: `sin_config` se DERIVA del entorno sin tocar la red, asi que ahi el
 * desenlace se sabe con certeza (la reserva no saldria: `reservaQueNoSalio`); con Cal.com
 * configurado NO se sabe, y eso se reporta como ignorancia en vez de inventar un final.
 *
 * @returns {{motivo: "sin_config"|"depende_de_la_reserva"|null}}
 */
export function motivoEnSeco({ stageBefore, stageAfter, scheduledAt, calendarEventId, env, duracionMinutos } = {}) {
  const recienAgendada = stageBefore !== "demo_agendada" && stageAfter === "demo_agendada";
  if (!recienAgendada || !scheduledAt || calendarEventId) return { motivo: null };
  const config = getBookingConfig(env || process.env, duracionMinutos);
  if (!config.baseUrl || !config.eventTypeId) return { motivo: "sin_config" };
  return { motivo: "depende_de_la_reserva" };
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
 * Cuanto se espera a que el NOMBRE del destino resuelva, en ms.
 *
 * Tope propio, y mas corto que el de la reserva A PROPOSITO. Medido el 2026-09-27 en el log
 * vivo: de 27 reservas, 27 salieron por `no contesto en 5000ms (timeout)` y CERO por la rama
 * que nombra el DNS — porque el resolvedor de Docker no contesta NXDOMAIN por `calcom`, cuelga
 * hasta `EAI_AGAIN` a los 5013 ms, y el abort de la reserva le gana por 13 ms. Con los dos
 * relojes en el mismo numero el diagnostico lo decide una carrera; preguntar la resolucion
 * aparte lo vuelve determinista.
 *
 * 1500 ms es holgado por dos ordenes de magnitud: un nombre que EXISTE resuelve en 8 ms dentro
 * de esta red (control `onia-platform`, misma medicion). Lo que compra no es precision, es que
 * el prospecto que acepta un horario deje de esperar 5 s por un destino que no esta.
 */
export const RESOLUCION_TIMEOUT_MS = 1500;

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
 * ¿El NOMBRE del destino existe? Pregunta separada de "¿el destino contesta?".
 *
 * Devuelve `{ok:true}` si resuelve, y `{ok:false, detalle}` con el motivo YA REDACTADO si no.
 * El detalle apunta a `CALCOM_BASE_URL` a proposito: es lo unico que se puede arreglar cuando
 * un hostname no apunta a nada, y es lo que el motivo viejo ("no contesto") escondia.
 *
 * TRES SALIDAS, no dos, porque "no pude preguntar" no es "me dijeron que no":
 *   - resuelve                  -> ok
 *   - dice que no existe        -> no ok, con el codigo (`EAI_AGAIN` / `ENOTFOUND`)
 *   - no contesta a tiempo      -> no ok, y se NOMBRA que fue el resolvedor el que colgo
 *
 * Un `baseUrl` que no se puede parsear se deja PASAR: ahi el que falla es el valor, no el
 * nombre, y el `fetch` de abajo ya lo dice mejor que esto. Fallar aca seria acusar al DNS de
 * un error de tipeo.
 */
async function resolverDestino(baseUrl, { lookup, timeoutMs, signal } = {}) {
  let hostname = "";
  try {
    hostname = new URL(String(baseUrl)).hostname;
  } catch {
    return { ok: true };
  }
  if (!hostname) return { ok: true };

  const resolver = typeof lookup === "function" ? lookup : dnsLookup;
  const tope = Number(timeoutMs) > 0 ? Number(timeoutMs) : RESOLUCION_TIMEOUT_MS;

  let alarma;
  try {
    // `race` y no un `AbortController`: `dns.lookup` no acepta signal, asi que un abort no lo
    // corta — lo unico que se puede hacer es dejar de esperarlo. El proceso es de larga vida y
    // la promesa huerfana se resuelve sola a los 5 s sin nadie escuchando; atarla a un signal
    // daria la ilusion de cancelarla.
    const vencimiento = new Promise((_r, reject) => {
      alarma = setTimeout(() => reject(Object.assign(new Error("resolucion vencida"), { esVencimiento: true })), tope);
    });
    if (signal?.aborted) return { ok: false, detalle: "el llamador aborto antes de resolver el destino" };
    await Promise.race([resolver(hostname), vencimiento]);
    return { ok: true };
  } catch (error) {
    const codigo = String(error?.code || error?.cause?.code || "");
    if (error?.esVencimiento) {
      return {
        ok: false,
        detalle: `el nombre del destino no resuelve (${hostname}: el resolvedor no contesto en ${tope}ms): revisar CALCOM_BASE_URL, no la red del prospecto`,
      };
    }
    if (NO_RESUELVE.has(codigo)) {
      return {
        ok: false,
        detalle: `el nombre del destino no resuelve (${codigo}): revisar CALCOM_BASE_URL, no la red del prospecto`,
      };
    }
    // Cualquier otra cosa del resolvedor NO se toma como veredicto: que el `fetch` de abajo
    // hable. Una guarda que inventa un rojo con un error que no entiende tapa el diagnostico
    // real igual que el motivo que vino a arreglar.
    return { ok: true };
  } finally {
    clearTimeout(alarma);
  }
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

  // ¿EXISTE EL NOMBRE? Se pregunta APARTE y ANTES, con su propio tope.
  //
  // Medido el 2026-09-27 en el log vivo: 27 de 27 reservas salieron por "no contesto en 5000ms
  // (timeout)" y CERO por la rama de DNS de abajo, que por eso llevaba semanas muerta. La causa
  // ya estaba anotada en `DESTINO_CAIDO_MS` pero su conclusion era al reves: cuando el abort de
  // la reserva le gana al resolvedor, NO HAY `cause.code` que leer — se sale por `AbortError` y
  // el motivo dice "no contesto", que apunta a un calendario lento cuando el destino NO EXISTE.
  // Dos remedios opuestos (subir el tope vs. mirar `CALCOM_BASE_URL`) elegidos por quien gana
  // una carrera de 13 ms.
  //
  // Con la resolucion aparte el veredicto ya no depende del reloj, y el prospecto que acepta un
  // horario —el unico turno del embudo que produce plata— espera 1,5 s en vez de 5.
  // ⚠️ Y solo se pregunta cuando la respuesta puede valer para LA RED QUE SE VA A USAR. Si el
  // llamador inyecto su propio `fetch`, reemplazo la red: el DNS del ambiente no es la red de
  // ese fetch, asi que resolver ahi no contesta la pregunta — la contesta sobre otro sistema.
  // Tri-estado de siempre: "no pude preguntar" no es "me dijeron que no". Un test que inyecta
  // `fetch` sin `lookup` no queda atado al DNS de la maquina donde corre; produccion no inyecta
  // ninguno de los dos (`run-turn.mjs:553` pasa los `deps` del webhook), asi que ahi SI se
  // pregunta, que es donde importa.
  const redInyectada = typeof (deps.fetch || options.fetch) === "function";
  const resolucion = typeof deps.lookup === "function" || !redInyectada
    ? await resolverDestino(config.baseUrl, {
        lookup: deps.lookup,
        timeoutMs: Math.min(RESOLUCION_TIMEOUT_MS, timeoutMs),
        signal: deps.signal,
      })
    : { ok: true };
  if (!resolucion.ok) {
    // Es el MISMO no-reservar de siempre: el prospecto recibe la misma salvedad honesta
    // (`cierreDeReservaFallida` no distingue motivos fuera de `horario_tomado`). Lo que cambia
    // es a donde manda a mirar el que lee el log, y lo que el proximo prospecto no espera.
    recordarDestinoCaido(ahora());
    return { ok: false, uid: null, reason: "error", warnings: [`calcom: la reserva no salio: ${resolucion.detalle}`] };
  }
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

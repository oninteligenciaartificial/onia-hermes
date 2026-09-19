// BARRIDO DE INSISTENCIA del recepcionista (v6.6 — decision Sergio 2026-08-30:
// ENCENDIDA POR DEFECTO). Si un cliente de un negocio deja de responder, su
// asistente insiste UNA sola vez, suave, pasadas las horas que el dueño eligio
// (doc.seguimiento: activo ?? true, horas ?? 2) — SIEMPRE dentro de la ventana
// de 24 h de Meta (texto libre gratis; fuera de ventana NO se manda nada: el
// recepcionista no tiene plantilla aprobada).
//
// ⚠️ 2026-09-13: ese "SIEMPRE" era cierto y se leia al reves. Lo garantizaba el
// RANGO del barrido SQL, no una decision de este archivo — y por eso una politica
// de 24 h o mas (el panel acepta hasta 48) no producia un envio tardio: no producia
// NINGUNO, sin dejar rastro. Un comentario que afirma una garantia desactiva la
// auditoria del que lo lee. Ahora el caso se saltea con `politica_fuera_de_ventana`
// y un warning que nombra los dos numeros.
//
// ⚠️ 2026-09-18: reservaba con el CAS del funnel (`reserveFollowUp`, followup_step
// 0→1) y ese contador NO es suyo — tiene tope 1 y de el cuelga el M3 de rescate.
// Un solo cupo para dos circuitos: el que llega primero apaga al otro, mudo. Peor,
// `--emit` alcanzaba para quemarlo mientras `ONIA_BOT_DRY_RUN` se tragaba el envio,
// asi que seis conversaciones de produccion quedaron dadas por insistidas sin haber
// recibido nada (chatwoot:42,43,52,54,56,57 — cuatro de ellas desconocidos reales).
// Ahora la reserva ES el insert, como en el recordatorio (M9).
//
// Reusa deliver() para el envio real y el dedup por message_key de
// insertOutbound, que es tambien su reserva. Solo toca
// conversaciones cuyo conocimiento resuelve POR INBOX a una org (source "db"):
// el funnel de venta de Onia tiene SU propio followup y no pasa por aca.
//
//   node insistencia-run.mjs --now 2026-08-30T15:00:00Z [--emit] [--limit 50]
import { createStore, stateFromRow, DELIVERY_STATUSES } from "./persistence.mjs";
import { MOTIVO_NUESTRA, cargarInboxesDePrueba, esConversacionNuestra } from "./es-nuestra.mjs";
import { createBotConfig, DEFAULT_CONFIG, localHour, renderTemplate } from "./config.mjs";
import { getOrgKnowledge } from "./knowledge.mjs";
import { deliver, hoursBetween } from "./followup-run.mjs";

export const DEFAULT_HORAS = 2;

/** Ultimo recurso si llega un config sin `followUp` — el hecho del canal vive en config.mjs. */
const DEFAULT_VENTANA_HORAS = DEFAULT_CONFIG.followUp.windowClosesAtHours;

/** Politica por org: encendida salvo que el doc diga lo contrario. */
export function politicaDeSeguimiento(doc) {
  const s = doc && typeof doc === "object" ? doc.seguimiento : null;
  return {
    activo: s && typeof s === "object" && typeof s.activo === "boolean" ? s.activo : true,
    horas: s && typeof s === "object" && Number.isInteger(s.horas) ? s.horas : DEFAULT_HORAS,
  };
}

/**
 * UNA POLITICA QUE EL CANAL NO PUEDE CUMPLIR SE DICE, NO SE CALLA.
 *
 * El barrido solo ve lo que sigue DENTRO de la ventana de servicio: pedir
 * `windowClosesAtHours` o mas es pedir un envio que nunca va a ocurrir — la fila
 * sale del rango antes de volverse elegible. Hasta el 2026-09-13 eso era silencio
 * perfecto (ni envio, ni skip, ni warning), asi que el dueño encendia la
 * insistencia, elegia el tope del desplegable y su asistente no escribia jamas.
 *
 * Desde hoy el validador (knowledge.mjs, MAX_ESPERA_INSISTENCIA_HORAS) rechaza esos
 * valores en la PUERTA, asi que por el panel ya no entran. Este corte se queda
 * igual, y por eso se prueba aparte: defiende los documentos LEGADOS —los que se
 * guardaron cuando el schema aceptaba hasta 48— y cualquier camino nuevo que
 * escriba la fila sin pasar por el validador.
 *
 * No se corrige el valor por las suyas: insistir antes de lo que el dueño pidio es
 * decidir por el. Se saltea nombrando los dos numeros, que es lo que deja arreglarlo.
 *
 * @returns {{reason: string, warning: string}|null} null si la espera es cumplible.
 */
export function esperaFueraDeVentana(horas, config, key = "") {
  const ventana = config?.followUp?.windowClosesAtHours ?? DEFAULT_VENTANA_HORAS;
  if (!(horas >= ventana)) return null;
  return {
    reason: `politica_fuera_de_ventana:${horas}h`,
    warning:
      `insistencia ${key}: el seguimiento esta configurado a ${horas} h y la ventana de WhatsApp cierra a las ${ventana} h` +
      ` — a esa altura ya no se puede escribir, asi que no se insiste nunca. Bajalo a menos de ${ventana} h.`,
  };
}

export function insistenciaMessageKey(conversationKey) {
  return `insistencia:${conversationKey}`;
}

export async function runInsistenciaSweep(options = {}, deps = {}) {
  const store = deps.store || createStore();
  // El interruptor real vive en el env (webhook.env via el wrapper): solo el string
  // "false" enciende el envio — cualquier otra cosa es dry-run, el default seguro.
  const dryRun = String(process.env.ONIA_BOT_DRY_RUN ?? "true").trim().toLowerCase() !== "false";
  const config = deps.config || createBotConfig({ dryRun });
  const nowIso = options.nowIso;
  const emit = options.emit === true;
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 50;

  const result = {
    ok: true, now: nowIso || null, mode: emit ? "emit" : "dry-run",
    scanned: 0, send: [], skipped: [], warnings: store.warnings,
  };
  if (!nowIso || !Number.isFinite(Date.parse(nowIso))) {
    result.ok = false;
    result.error = `--now invalido o ausente: ${String(nowIso)}`;
    return result;
  }

  // Quienes NO son de nadie, ANTES de elegir a quien escribirle: el banco de pruebas es un inbox
  // entero y Chatwoot le pone nombre anonimo a su contacto (ver `es-nuestra.mjs`). Si no se pudo
  // preguntar, el conjunto queda vacio y se avisa: nunca se falla hacia "es nuestra".
  const inboxesQA = await cargarInboxesDePrueba(deps);
  if (inboxesQA.warning) result.warnings.push(inboxesQA.warning);

  const rows = await store.sweepInsistenciaCandidates(nowIso, config, limit);
  if (!rows) {
    result.skipped.push({ reason: "barrido_sin_resultado" });
    return result;
  }
  result.scanned = rows.length;

  for (const row of rows) {
    const key = row.conversation_key;

    // DEFINITIVO y primero: quien es el contacto no cambia esperando, y este es el UNICO barrido
    // que ya corre con `--emit` en produccion (crontab `*/30 12-23`). Sin esta pregunta le insiste
    // a nuestras propias sondas — y en el inbox de WhatsApp cada saliente lo cobra Meta.
    if (esConversacionNuestra(stateFromRow(row))) {
      result.skipped.push({ key, reason: MOTIVO_NUESTRA });
      continue;
    }

    const inboxId = row?.raw?.inboxId || null;
    if (!inboxId) {
      result.skipped.push({ key, reason: "sin_inbox" });
      continue;
    }

    // El doc de la org, por el MISMO camino que usa el turno real. source "db" es el
    // candado: sin org mapeada (el bot de leads de Onia, un inbox suelto) no se insiste.
    const estado = await getOrgKnowledge(null, { inboxId, ...(deps.knowledge || {}) });
    if (estado?.source !== "db" || !estado.data) {
      result.skipped.push({ key, reason: "sin_org" });
      continue;
    }

    // LA CUOTA VIAJA EN EL DOC DE LA ORG, no en el config del cron: este es el unico barrido
    // multi-org, asi que mirar `config.cuota` leeria la cuota de otro negocio — o de ninguno.
    // Se corta antes del CAS por el mismo motivo que los otros dos: la reserva es de un solo uso.
    const cuota = estado.cuota;
    if (cuota?.agotada === true) {
      result.skipped.push({ key, reason: "cuota_agotada" });
      store.warnings.push(`insistencia ${key}: cuota mensual agotada (${cuota.usadas}/${cuota.limite}) — no se insiste`);
      continue;
    }

    const politica = politicaDeSeguimiento(estado.data);
    if (!politica.activo) {
      result.skipped.push({ key, reason: "apagada_por_el_dueno" });
      continue;
    }

    // UNA POLITICA QUE EL CANAL NO PUEDE CUMPLIR SE DICE, NO SE CALLA.
    //
    // El panel acepta hasta 48 h, pero el barrido solo ve lo que sigue DENTRO de la
    // ventana de servicio de Meta: pedir 24 h o mas es pedir un envio que nunca va a
    // ocurrir — la fila sale del rango antes de volverse elegible. Hasta hoy eso era
    // silencio perfecto (ni envio, ni skip, ni warning), asi que el dueño encendia la
    // insistencia, elegia el tope del desplegable y su asistente no escribia jamas.
    //
    // No se corrige el valor por las suyas: insistir antes de lo que el dueño pidio es
    // decidir por el. Se saltea nombrando los dos numeros, que es lo que deja arreglarlo.
    const corte = esperaFueraDeVentana(politica.horas, config, key);
    if (corte) {
      result.skipped.push({ key, reason: corte.reason });
      store.warnings.push(corte.warning);
      continue;
    }

    const elapsed = hoursBetween(row.last_inbound_at, nowIso);
    if (elapsed === null || elapsed < politica.horas) {
      result.skipped.push({ key, reason: `demasiado_pronto:${elapsed === null ? "s/fecha" : elapsed.toFixed(1) + "h"}` });
      continue;
    }

    // HORA SILENCIOSA. TRANSITORIO, y por eso va ULTIMO: la hora se arregla esperando, y
    // confundirla con un descarte definitivo haria que el barrido mire esta fila para siempre.
    // Antes del CAS y antes del dry-run: la reserva es de UN SOLO USO, asi que gastarla porque
    // son las 3 de la mañana pierde la insistencia entera.
    //
    // A quien se le insiste lo elige el SILENCIO del cliente, asi que la hora de salida es la
    // de su ultimo mensaje corrida `politica.horas` — cualquier hora es alcanzable. Hasta hoy
    // lo unico que lo frenaba era la franja de su cron (`*/30 12-23` UTC), fuera de git y
    // ciega al huso: este es el unico barrido MULTI-ORG y le escribe a los clientes DEL
    // CLIENTE. Ver config.insistencia.
    const hora = localHour(nowIso, config);
    const desde = config.insistencia?.quietBeforeHour ?? DEFAULT_CONFIG.insistencia.quietBeforeHour;
    const hasta = config.insistencia?.quietAfterHour ?? DEFAULT_CONFIG.insistencia.quietAfterHour;
    if (hora !== null && (hora < desde || hora >= hasta)) {
      result.skipped.push({ key, reason: `horario_silencioso:${hora}h` });
      continue;
    }

    const humano = String(estado.data?.identity?.humanName || "").trim() || "el equipo";
    const texto = renderTemplate(config.script.R_SEGUIMIENTO, { humano });

    // LOS DOS INTERRUPTORES SE PREGUNTAN JUNTOS. `--emit` (del cron, escrito a mano) y
    // `ONIA_BOT_DRY_RUN` (del entorno) contestan cosas distintas: hasta el 2026-09-18 el primero
    // alcanzaba para RESERVAR y el segundo hacia que `deliver()` devolviera `simulated` sin mandar,
    // asi que el barrido quemaba el cupo y se daba por hecho. Reservar cuelga de si se va a MANDAR,
    // no de uno solo de los dos.
    if (!emit || config.dryRun) {
      result.send.push({ key, mode: "dry-run", texto: texto.slice(0, 80) });
      continue;
    }

    const state = { channel: row.channel, contactRef: row.contact_ref };
    const messageKey = insistenciaMessageKey(key);

    // LA RESERVA ES EL INSERT — el patron que este repo ya usa en el recordatorio (M9).
    // `insertOutbound` va con `on_conflict=message_key` + `resolution=ignore-duplicates`: devuelve
    // 1 si gano la carrera, 0 si ya estaba y null si la base no contesto. Sin reserva confirmada no
    // se manda, igual que antes.
    //
    // Antes esto reservaba con `reserveFollowUp`, y ese es el bug: quema `followup_step`, el MISMO
    // contador —tope 1, `followUp.maxSteps`, "UN follow-up y despues silencio"— del que cuelga el
    // M3 de rescate del funnel. Un solo cupo para DOS circuitos: el que llega primero apaga al otro
    // sin dejar rastro, porque el follow-up filtra `followup_step=eq.0` y la fila deja de aparecer
    // tanto en el barrido como en el conteo.
    //
    // La politica no cambia: `insistenciaMessageKey` es determinista, asi que sigue siendo UNA
    // insistencia por conversacion — lo que cambia es de que contador cuelga.
    const reservado = await store.insertOutbound(
      [{
        templateKey: "R_SEGUIMIENTO",
        text: texto,
        messageKey,
        deliveryStatus: "reserved",
        stageBefore: row.bot_stage,
        stageAfter: row.bot_stage, // la insistencia no mueve la maquina de estados
      }],
      { conversationKey: key, channel: row.channel, contactRef: row.contact_ref, outboundSeq: (row?.raw?.outboundSeq || 0) + 1 },
      { raw: { barrido: "insistencia" } },
    );
    if (reservado !== 1) {
      result.skipped.push({ key, reason: reservado === null ? "reserva_fallida" : "cas_perdido" });
      continue;
    }

    // La cuota de ESTA org viaja al config del envio: asi la barrera de `deliver()` tambien
    // protege a este barrido, que es el unico cuyo config de arranque no sabe de que org habla.
    const envio = await deliver(state, texto, cuota ? { ...config, cuota } : config, deps);
    // EL DESENLACE, no un hecho nuevo: la fila ya existe como `reserved` y aca termina de contarse.
    // Sin esto, una reserva ganada y un envio que nunca salio son indistinguibles en la tabla — que
    // es exactamente como seis conversaciones de produccion quedaron dadas por insistidas sin haber
    // recibido un solo mensaje.
    await store.markMessageDelivered(messageKey, DELIVERY_STATUSES.includes(envio.status) ? envio.status : "failed");
    result.send.push({ key, mode: envio.status, ...(envio.warning ? { warning: envio.warning } : {}) });
  }

  return result;
}

export async function main(argv = process.argv.slice(2)) {
  const emit = argv.includes("--emit");
  const nowIdx = argv.indexOf("--now");
  const limitIdx = argv.indexOf("--limit");
  const nowIso = nowIdx >= 0 ? argv[nowIdx + 1] : new Date().toISOString();
  const limit = limitIdx >= 0 ? Number(argv[limitIdx + 1]) : 50;
  const result = await runInsistenciaSweep({ nowIso, emit, limit });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("insistencia-run.mjs")) {
  await main();
}

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
// Reusa las piezas probadas del followup del funnel: el CAS reserveFollowUp
// (followup_step 0→1: reintentar el barrido no duplica), deliver() para el
// envio real y el dedup por message_key de insertOutbound. Solo toca
// conversaciones cuyo conocimiento resuelve POR INBOX a una org (source "db"):
// el funnel de venta de Onia tiene SU propio followup y no pasa por aca.
//
//   node insistencia-run.mjs --now 2026-08-30T15:00:00Z [--emit] [--limit 50]
import { createStore } from "./persistence.mjs";
import { createBotConfig, DEFAULT_CONFIG, renderTemplate } from "./config.mjs";
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

  const rows = await store.sweepInsistenciaCandidates(nowIso, config, limit);
  if (!rows) {
    result.skipped.push({ reason: "barrido_sin_resultado" });
    return result;
  }
  result.scanned = rows.length;

  for (const row of rows) {
    const key = row.conversation_key;
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

    const humano = String(estado.data?.identity?.humanName || "").trim() || "el equipo";
    const texto = renderTemplate(config.script.R_SEGUIMIENTO, { humano });

    if (!emit) {
      result.send.push({ key, mode: "dry-run", texto: texto.slice(0, 80) });
      continue;
    }

    // CAS ANTES de mandar: si otra corrida ya reservo, esta no manda nada.
    const reservado = await store.reserveFollowUp(key, 0);
    if (reservado !== true) {
      result.skipped.push({ key, reason: "cas_perdido" });
      continue;
    }

    const state = { channel: row.channel, contactRef: row.contact_ref };
    // La cuota de ESTA org viaja al config del envio: asi la barrera de `deliver()` tambien
    // protege a este barrido, que es el unico cuyo config de arranque no sabe de que org habla.
    const envio = await deliver(state, texto, cuota ? { ...config, cuota } : config, deps);
    await store.insertOutbound(
      [{ templateKey: "R_SEGUIMIENTO", text: texto, messageKey: insistenciaMessageKey(key) }],
      { conversationKey: key, channel: row.channel, contactRef: row.contact_ref, outboundSeq: (row?.raw?.outboundSeq || 0) + 1 },
      { raw: { barrido: "insistencia" } },
    );
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

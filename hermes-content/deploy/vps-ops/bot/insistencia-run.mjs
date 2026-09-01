// BARRIDO DE INSISTENCIA del recepcionista (v6.6 — decision Sergio 2026-08-30:
// ENCENDIDA POR DEFECTO). Si un cliente de un negocio deja de responder, su
// asistente insiste UNA sola vez, suave, pasadas las horas que el dueño eligio
// (doc.seguimiento: activo ?? true, horas ?? 2) — SIEMPRE dentro de la ventana
// de 24 h de Meta (texto libre gratis; fuera de ventana NO se manda nada: el
// recepcionista no tiene plantilla aprobada).
//
// Reusa las piezas probadas del followup del funnel: el CAS reserveFollowUp
// (followup_step 0→1: reintentar el barrido no duplica), deliver() para el
// envio real y el dedup por message_key de insertOutbound. Solo toca
// conversaciones cuyo conocimiento resuelve POR INBOX a una org (source "db"):
// el funnel de venta de Onia tiene SU propio followup y no pasa por aca.
//
//   node insistencia-run.mjs --now 2026-08-30T15:00:00Z [--emit] [--limit 50]
import { createStore } from "./persistence.mjs";
import { createBotConfig, renderTemplate } from "./config.mjs";
import { getOrgKnowledge } from "./knowledge.mjs";
import { deliver, hoursBetween } from "./followup-run.mjs";

export const DEFAULT_HORAS = 2;

/** Politica por org: encendida salvo que el doc diga lo contrario. */
export function politicaDeSeguimiento(doc) {
  const s = doc && typeof doc === "object" ? doc.seguimiento : null;
  return {
    activo: s && typeof s === "object" && typeof s.activo === "boolean" ? s.activo : true,
    horas: s && typeof s === "object" && Number.isInteger(s.horas) ? s.horas : DEFAULT_HORAS,
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

  const rows = await store.sweepInsistenciaCandidates(nowIso, limit);
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

    const politica = politicaDeSeguimiento(estado.data);
    if (!politica.activo) {
      result.skipped.push({ key, reason: "apagada_por_el_dueno" });
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
    const envio = await deliver(state, texto, config, deps);
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

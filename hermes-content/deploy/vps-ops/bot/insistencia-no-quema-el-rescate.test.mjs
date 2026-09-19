// UN CONTADOR, DOS CIRCUITOS: por que la insistencia no puede reservar con `followup_step`.
//
// `followup_step` tiene tope 1 (`config.followUp.maxSteps`, "regla N7: UN follow-up y despues
// silencio"). Hasta hoy lo quemaban DOS barridos distintos:
//
//   - follow-up  (`FILTROS_FOLLOWUP`):      followup_step=0 + bot_stage in (esperando_calificacion, esperando_horario)
//   - insistencia (`sweepInsistenciaCandidates`): followup_step=0 + bot_stage = nuevo
//
// Son disjuntos EN EL INSTANTE del barrido y por eso parecia sano, pero `bot_stage` CAMBIA: una
// conversacion pasa por `nuevo` (donde la insistencia le quema el unico cupo) y despues avanza a
// `esperando_horario`, justo donde el M3 de rescate es el unico mensaje que recupera al prospecto
// que se quedo a mitad de agendar. Ahi el follow-up ya no la encuentra — filtra `followup_step=eq.0`
// — y la fila no aparece ni en el barrido ni en el conteo: se apaga MUDA.
//
// Medido en produccion el 2026-09-18 (onia_center.bot_conversations): SEIS filas en `nuevo` con
// followup_step=1 y sin un solo M3 — chatwoot:42,43,52,54,56,57. Sus salientes son
// `R_SEGUIMIENTO:simulated`, o sea la insistencia quemo el cupo y NO mando nada: `--emit` (del cron,
// escrito a mano) autoriza a RESERVAR y `ONIA_BOT_DRY_RUN` decide si se MANDA — dos interruptores en
// serie que contestan cosas distintas. Cuatro de esas seis son desconocidos reales
// (purple-bush-931, summer-shadow-163, icy-sunset-817 y chatwoot:57).
//
// La cura es el patron que este mismo repo ya usa en el recordatorio (M9): LA RESERVA ES EL INSERT.
// `insertOutbound` va con `on_conflict=message_key` + `resolution=ignore-duplicates`, asi que
// devuelve 1 si gano la carrera y 0 si ya estaba — es un CAS, y ademas deja el desenlace escrito.
// `insistenciaMessageKey` ya existe y es determinista, asi que la politica no cambia: UNA insistencia
// por conversacion, como antes. Lo que cambia es de que contador cuelga.
import test from "node:test";
import assert from "node:assert/strict";

import { runInsistenciaSweep, insistenciaMessageKey } from "./insistencia-run.mjs";
import { createBotConfig } from "./config.mjs";
import { resetOrgKnowledgeCache } from "./knowledge.mjs";

const NOW = "2026-08-30T15:00:00Z";
const DOC = { schema: "onia.bot.knowledge/1", identity: { productName: "Ferreteria", humanName: "Marta" } };

function fila(extra = {}) {
  return {
    conversation_key: "chatwoot:41", channel: "chatwoot", contact_ref: "41",
    last_inbound_at: "2026-08-30T12:00:00Z", // hace 3 h
    raw: { inboxId: "7", outboundSeq: 2 },
    ...extra,
  };
}

function conocimientoDe(doc) {
  resetOrgKnowledgeCache();
  return {
    fetch: async () => ({ ok: true, status: 200, json: async () => ({ data: doc, version: 1 }) }),
    dbUrl: "http://x/published", dbSecret: "s", nowMs: Date.now(),
  };
}

/**
 * Store espia que ANOTA EL ORDEN de lo que el barrido hace. El orden importa tanto como el hecho:
 * una reserva que corre DESPUES del envio no protege de duplicados, y una que corre antes pero
 * sobre el contador equivocado apaga al circuito vecino.
 */
function storeEspia(rows, { insertDevuelve = 1 } = {}) {
  const orden = [];
  return {
    orden,
    warnings: [],
    sweepInsistenciaCandidates: async () => rows,
    reserveFollowUp: async (key) => { orden.push(`reserveFollowUp:${key}`); return true; },
    insertOutbound: async (replies) => {
      orden.push(`insertOutbound:${replies?.[0]?.messageKey}`);
      return insertDevuelve;
    },
    markMessageDelivered: async (messageKey, estado) => {
      orden.push(`desenlace:${messageKey}=${estado}`);
      return true;
    },
  };
}

function chatwootEspia(orden, { ok = true } = {}) {
  return {
    enabled: true,
    warnings: [],
    sendMessage: async (ref, texto) => { orden.push(`envio:${ref}`); return ok; },
  };
}

test("la insistencia NO toca followup_step: el cupo del rescate queda intacto", async () => {
  const store = storeEspia([fila()]);
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    config: { ...createBotConfig(), dryRun: false },
    knowledge: conocimientoDe(DOC),
    chatwoot: chatwootEspia(store.orden),
  });

  assert.equal(out.send.length, 1, "tiene que haber insistido");
  // El invariante: el contador del follow-up no es de este barrido. Si lo toca, la conversacion
  // queda sin rescate el dia que avance a `esperando_horario`.
  assert.deepEqual(
    store.orden.filter((o) => o.startsWith("reserveFollowUp")),
    [],
    "la insistencia no puede consumir el cupo de `followup_step`: es del M3 de rescate",
  );
});

test("la reserva ES el insert y va ANTES del envio", async () => {
  const store = storeEspia([fila()]);
  await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    config: { ...createBotConfig(), dryRun: false },
    knowledge: conocimientoDe(DOC),
    chatwoot: chatwootEspia(store.orden),
  });

  const iReserva = store.orden.findIndex((o) => o === `insertOutbound:${insistenciaMessageKey("chatwoot:41")}`);
  const iEnvio = store.orden.findIndex((o) => o.startsWith("envio:"));
  assert.ok(iReserva >= 0, `la reserva tiene que escribirse con su clave propia · orden=${store.orden.join(" > ")}`);
  assert.ok(iEnvio >= 0, "tiene que haber envio");
  assert.ok(
    iReserva < iEnvio,
    `la reserva va ANTES de mandar (si no, dos corridas mandan dos veces) · orden=${store.orden.join(" > ")}`,
  );
});

test("si otra corrida ya reservo (insert devuelve 0), no se manda nada", async () => {
  const store = storeEspia([fila()], { insertDevuelve: 0 });
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    config: { ...createBotConfig(), dryRun: false },
    knowledge: conocimientoDe(DOC),
    chatwoot: chatwootEspia(store.orden),
  });

  assert.deepEqual(store.orden.filter((o) => o.startsWith("envio:")), [], "perder el CAS es no mandar");
  assert.equal(out.send.length, 0);
  assert.equal(out.skipped.at(-1)?.reason, "cas_perdido");
});

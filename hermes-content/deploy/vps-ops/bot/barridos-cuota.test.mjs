// ONIA — LA CUOTA AGOTADA TAMBIEN TIENE QUE CALLAR A LOS BARRIDOS (2026-09-04).
//
// El motor ya cortaba el TURNO ENTRANTE cuando la org agotaba su cuota mensual
// (`cuota-agotada.test.mjs`, barrera 1b de bot-engine.mjs). Los barridos proactivos NO: medido
// hoy, ni `followup-run.mjs` ni `reminder-run.mjs` ni `insistencia-run.mjs` nombraban la cuota
// una sola vez. Efecto: un negocio que agoto sus 500 conversaciones del mes dejaba de ser
// atendido cuando el cliente escribia, y aun asi el cron le seguia mandando mensajes salientes
// automaticos —que Meta COBRA— sin que nadie los pidiera. Se paga por hablarle a quien ya
// decidimos no atender.
//
// LO QUE FIJA ESTE ARCHIVO
//
//   1. `deliver()` ES LA ULTIMA BARRERA. Con la cuota agotada no se llama a Chatwoot, pase lo
//      que pase antes. Es el unico punto por donde salen los tres barridos, asi que un barrido
//      nuevo nace cubierto aunque su autor no se acuerde de la cuota.
//
//   2. CADA BARRIDO CORTA ANTES DE SU RESERVA. La barrera sola no alcanzaria: la reserva (el CAS
//      de `followup_step`, el insert unico del recordatorio) es de UN SOLO uso y marca la
//      conversacion como ya atendida. Si se quemara con la cuota agotada, el mensaje no saldria
//      este mes NI el que viene, cuando la cuota se renueve. Cortar tarde no es cortar.
//
//   3. FAIL-OPEN, igual que el motor. Sin dato de cuota (`null` o ausente) todo sigue exactamente
//      como siempre. Cortar por un dato que no existe es callar a un bot sano.
//
//   4. COBERTURA DERIVADA DEL DISCO. La lista de barridos NO se escribe a mano: se lee la carpeta
//      y se toma todo `*-run.mjs` que pueda mandar (o sea, que llame a `deliver()`). Un barrido
//      nuevo sin su caso aca pone esto en ROJO. Una lista escrita a mano falla ABIERTO: el dia
//      que alguien agrega el cuarto barrido, nada se pone rojo y nadie se entera.
//
// Determinista: cero red, cero Date.now(); el store y el cliente de Chatwoot se inyectan.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createBotConfig } from "./config.mjs";
import { deliver, runFollowUpSweep } from "./followup-run.mjs";
import { runReminderSweep } from "./reminder-run.mjs";
import { runInsistenciaSweep } from "./insistencia-run.mjs";
import { resetOrgKnowledgeCache } from "./knowledge.mjs";

const CARPETA = dirname(fileURLToPath(import.meta.url));

const AGOTADA = { agotada: true, usadas: 500, limite: 500 };
const CON_CUPO = { agotada: false, usadas: 12, limite: 500 };

/** Cliente de Chatwoot que anota cada envio: si esta lista no queda vacia, se gasto plata. */
function chatwootEspia(enviados = []) {
  return {
    enabled: true,
    warnings: [],
    sendMessage: async (ref, texto) => {
      enviados.push({ ref, texto });
      return true;
    },
  };
}

// ---------------------------------------------------------------------------
// 1. La ultima barrera: deliver()
// ---------------------------------------------------------------------------

test("deliver: con la cuota agotada NO se llama a Chatwoot", async () => {
  const enviados = [];
  const estado = { channel: "chatwoot", contactRef: "41" };
  const config = createBotConfig({ dryRun: false, cuota: AGOTADA });

  const salida = await deliver(estado, "hola", config, { chatwoot: chatwootEspia(enviados) });

  assert.deepEqual(enviados, [], "no puede salir NI UN mensaje con la cuota agotada");
  assert.equal(salida.status, "skipped", "y no se cobra: `skipped` esta fuera de ESTADOS_COBRABLES");
  assert.match(String(salida.warning), /cuota/i, "el motivo tiene que decir por que no salio");
});

test("deliver: sin dato de cuota (null o ausente) manda como siempre — fail-open", async () => {
  const estado = { channel: "chatwoot", contactRef: "41" };
  for (const cuota of [null, undefined]) {
    const enviados = [];
    const salida = await deliver(estado, "hola", createBotConfig({ dryRun: false, cuota }), {
      chatwoot: chatwootEspia(enviados),
    });
    assert.equal(salida.status, "sent", `cuota=${String(cuota)}: tiene que mandar igual`);
    assert.equal(enviados.length, 1);
  }
});

test("deliver: con cupo disponible manda", async () => {
  const enviados = [];
  const salida = await deliver({ channel: "chatwoot", contactRef: "41" }, "hola",
    createBotConfig({ dryRun: false, cuota: CON_CUPO }), { chatwoot: chatwootEspia(enviados) });
  assert.equal(salida.status, "sent");
  assert.equal(enviados.length, 1);
});

// ---------------------------------------------------------------------------
// 2. FOLLOW-UP (M3) — corta antes del CAS
// ---------------------------------------------------------------------------

const SLOTS = [
  { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
  { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
];
const FU_T0 = "2026-07-27T16:05:00Z";
const FU_NOW = "2026-07-28T14:05:00Z"; // 22 h de silencio: dentro de la ventana de Meta

const filaFollowUp = () => ({
  conversation_key: "chatwoot:41",
  channel: "chatwoot",
  contact_ref: "41",
  display_name: "Ana",
  bot_stage: "esperando_horario",
  qualification: { ownsClinic: true, chairs: 2, city: "Santa Cruz" },
  slots_offered: [{ key: "A", label: "jueves 15:00" }, { key: "B", label: "viernes 10:00" }],
  human_took_over: false,
  opt_out_at: null,
  followup_step: 0,
  last_inbound_at: FU_T0,
  raw: { outboundSeq: 2 },
});

function storeFollowUp(reservas = []) {
  return {
    warnings: [],
    sweepFollowUpCandidates: async () => [filaFollowUp()],
    reserveFollowUp: async (key) => {
      reservas.push(key);
      return true;
    },
    insertOutbound: async () => 1,
  };
}

test("follow-up: cuota agotada = 0 envios Y el CAS sin quemar", async () => {
  const enviados = [];
  const reservas = [];
  const salida = await runFollowUpSweep({ nowIso: FU_NOW, emit: true }, {
    store: storeFollowUp(reservas),
    config: createBotConfig({ slots: SLOTS, dryRun: false, cuota: AGOTADA }),
    chatwoot: chatwootEspia(enviados),
  });

  assert.deepEqual(enviados, [], "no sale ni un mensaje");
  assert.deepEqual(salida.send, [], "y no se reporta ninguno como enviado");
  assert.deepEqual(reservas, [], "la reserva es de UN solo uso: quemarla pierde el follow-up del mes que viene");
  assert.equal(salida.skipped.length, 1);
  assert.equal(salida.skipped[0].reason, "cuota_agotada", "el motivo tiene que quedar escrito, no desaparecer");
});

test("follow-up: sin dato de cuota manda igual — fail-open", async () => {
  const enviados = [];
  const salida = await runFollowUpSweep({ nowIso: FU_NOW, emit: true }, {
    store: storeFollowUp(),
    config: createBotConfig({ slots: SLOTS, dryRun: false }),
    chatwoot: chatwootEspia(enviados),
  });
  assert.equal(salida.send.length, 1, "sin cuota conocida, el barrido de siempre");
  assert.equal(enviados.length, 1);
});

// ---------------------------------------------------------------------------
// 3. RECORDATORIO (M9) — corta antes del insert, que aca ES la reserva
// ---------------------------------------------------------------------------

const RE_DEMO_AT = "2026-07-30T19:00:00Z";
const RE_NOW = "2026-07-30T16:00:00Z";

const filaRecordatorio = () => ({
  conversation_key: "chatwoot:75",
  channel: "chatwoot",
  contact_ref: "75",
  display_name: "Ana",
  bot_stage: "demo_agendada",
  qualification: { industry: "comercio", teamSize: 5, city: "Santa Cruz" },
  scheduled_at: RE_DEMO_AT,
  calendar_event_id: "uid-abc",
  human_took_over: false,
  opt_out_at: null,
  last_inbound_at: "2026-07-29T20:00:00Z",
  raw: { outboundSeq: 3, scheduledLabel: "jue 30/07 15:00" },
});

function storeRecordatorio(inserts = []) {
  return {
    warnings: [],
    sweepDemoReminders: async () => [filaRecordatorio()],
    insertOutbound: async (messages) => {
      inserts.push(...(messages || []));
      return 1;
    },
    markMessageDelivered: async () => true,
  };
}

test("recordatorio: cuota agotada = 0 envios Y sin quemar la reserva", async () => {
  const enviados = [];
  const inserts = [];
  const salida = await runReminderSweep({ nowIso: RE_NOW, emit: true }, {
    store: storeRecordatorio(inserts),
    config: createBotConfig({ dryRun: false, cuota: AGOTADA }),
    meetingLink: (uid) => (uid ? `https://cal.test/booking/${uid}` : null),
    chatwoot: chatwootEspia(enviados),
  });

  assert.deepEqual(enviados, [], "no sale ni un mensaje");
  assert.deepEqual(salida.send, []);
  assert.deepEqual(inserts, [], "aca la reserva ES el insert: escribirla marca la demo como ya recordada");
  assert.equal(salida.skipped.length, 1);
  assert.equal(salida.skipped[0].reason, "cuota_agotada");
});

test("recordatorio: sin dato de cuota manda igual — fail-open", async () => {
  const enviados = [];
  const salida = await runReminderSweep({ nowIso: RE_NOW, emit: true }, {
    store: storeRecordatorio(),
    config: createBotConfig({ dryRun: false }),
    meetingLink: (uid) => (uid ? `https://cal.test/booking/${uid}` : null),
    chatwoot: chatwootEspia(enviados),
  });
  assert.equal(salida.send.length, 1);
  assert.equal(enviados.length, 1);
});

// ---------------------------------------------------------------------------
// 4. INSISTENCIA — la cuota viaja en el doc de la ORG, no en el config del proceso
// ---------------------------------------------------------------------------
//
// Este barrido es el unico que resuelve la org por conversacion (`getOrgKnowledge` por inbox), asi
// que su cuota NO esta en el config con el que arranco el cron: esta en la respuesta de
// /published de ESA org. Un barrido multi-org que mirara solo su propio config leeria la cuota de
// otro negocio — o de ninguno.

const IN_NOW = "2026-08-30T15:00:00Z";
const DOC = { schema: "onia.bot.knowledge/1", identity: { productName: "Ferreteria", humanName: "Marta" } };

const filaInsistencia = () => ({
  conversation_key: "chatwoot:41",
  channel: "chatwoot",
  contact_ref: "41",
  last_inbound_at: "2026-08-30T12:00:00Z", // hace 3 h
  raw: { inboxId: "7", outboundSeq: 2 },
});

function storeInsistencia(reservas = []) {
  return {
    warnings: [],
    sweepInsistenciaCandidates: async () => [filaInsistencia()],
    reserveFollowUp: async (key) => {
      reservas.push(key);
      return true;
    },
    // La reserva de la insistencia ES el insert (2026-09-18): devuelve el NUMERO de filas — 1 si
    // gano la carrera. Con `true` el CAS se leia como perdido y el barrido no mandaba nada.
    insertOutbound: async (replies) => { reservas.push(replies?.[0]?.messageKey); return 1; },
    markMessageDelivered: async () => true,
  };
}

/** /published de mentira: el mismo doc para cualquier inbox, con la cuota que se le pida. */
function conocimientoCon(cuota) {
  resetOrgKnowledgeCache();
  return {
    fetch: async () => ({ ok: true, status: 200, json: async () => ({ data: DOC, version: 1, cuota }) }),
    dbUrl: "http://x/published",
    dbSecret: "s",
    nowMs: 1756567200000,
  };
}

test.afterEach(() => resetOrgKnowledgeCache());

test("insistencia: cuota agotada de ESA org = 0 envios y CAS sin quemar", async () => {
  const enviados = [];
  const reservas = [];
  const salida = await runInsistenciaSweep({ nowIso: IN_NOW, emit: true }, {
    store: storeInsistencia(reservas),
    config: createBotConfig({ dryRun: false }), // el config del cron NO sabe de la org
    knowledge: conocimientoCon(AGOTADA),
    chatwoot: chatwootEspia(enviados),
  });

  assert.deepEqual(enviados, [], "no sale ni un mensaje");
  assert.deepEqual(salida.send, []);
  assert.deepEqual(reservas, [], "sin quemar el CAS");
  assert.equal(salida.skipped.length, 1);
  assert.equal(salida.skipped[0].reason, "cuota_agotada");
});

test("insistencia: la org con cupo sigue recibiendo su seguimiento", async () => {
  const enviados = [];
  const salida = await runInsistenciaSweep({ nowIso: IN_NOW, emit: true }, {
    store: storeInsistencia(),
    config: createBotConfig({ dryRun: false }),
    knowledge: conocimientoCon(CON_CUPO),
    chatwoot: chatwootEspia(enviados),
  });
  assert.equal(salida.send.length, 1);
  assert.equal(salida.send[0].mode, "sent");
  assert.equal(enviados.length, 1);
});

// ---------------------------------------------------------------------------
// 5. La cobertura sale del DISCO, no de esta lista
// ---------------------------------------------------------------------------

/** Barridos con un caso de cuota agotada en ESTE archivo. Se compara contra lo que hay en disco. */
const CON_CASO = ["followup-run.mjs", "insistencia-run.mjs", "reminder-run.mjs"];

/** Un `*-run.mjs` puede mandar mensajes si llama a `deliver()`, el unico camino de salida. */
function barridosQueMandan() {
  return readdirSync(CARPETA)
    .filter((nombre) => nombre.endsWith("-run.mjs") && !nombre.endsWith(".test.mjs"))
    .filter((nombre) => /\bdeliver\s*\(/.test(readFileSync(join(CARPETA, nombre), "utf8")))
    .sort();
}

test("todo barrido que puede mandar tiene su caso de cuota agotada aca", () => {
  assert.deepEqual(
    barridosQueMandan(),
    [...CON_CASO].sort(),
    "un barrido nuevo que llama a deliver() y no esta en CON_CASO queda SIN gate de cuota: " +
      "agregale su caso arriba (no lo saques de la lista para poner esto en verde)",
  );
});

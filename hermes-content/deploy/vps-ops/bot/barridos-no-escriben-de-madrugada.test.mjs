// ---------------------------------------------------------------------------
// barridos-no-escriben-de-madrugada.test.mjs
//
// QUE FIJA. Ningun barrido que le MANDA un mensaje a una persona decide la hora
// mirando su linea de cron: la franja silenciosa vive en el codigo, versionada,
// y el universo de sujetos se camina del DISCO.
//
// POR QUE EXISTE, y por que no alcanzaba el gate de ayer. El 2026-09-17 se cerro
// exactamente este defecto en el follow-up (`followup-no-escribe-de-madrugada`),
// y ese archivo ENUMERO a sus dos hermanos a mano para explicar que el olvido era
// solo suyo — escribio que `insistencia` "queda acotado por la franja de SU cron
// (*/30 12-23 UTC = 08:00-19:59 de Bolivia)". La frase era cierta y absolvio al
// sujeto equivocado: medido hoy, `insistencia-run.mjs` no llama a `localHour` ni
// una vez. Una enumeracion de hermanos escrita en el comentario del propio
// arreglo es una lista de INCLUSION, y el que la lee despues la toma por
// verificada.
//
// POR QUE EL CRON NO ES LA GUARDA, y no es un tecnicismo:
//
//   1. La franja del cron es de ARRANQUE, no de DECISION. `insistencia-run.sh` es
//      ejecutable y se corre a mano para depurar: a las 3 de la mañana manda.
//   2. Vive FUERA de git. Su linea ya fue editada a mano una vez (lleva el
//      `--emit` escrito ahi), asi que perderla no deja ni una senal — y ese mismo
//      modo de falla se cerro ayer para el MODO de estos barridos, derivandolo
//      del interruptor versionado. Quedo la mitad de la hora.
//   3. Y la razon estructural: `insistencia` es el UNICO barrido MULTI-ORG. Le
//      escribe a los clientes DEL CLIENTE (los pacientes de una clinica), y la
//      hora decente es la del negocio. Un crontab solo sabe decir UTC: la hora
//      local no se puede expresar ahi ni queriendo.
//
// QUE SE PAGA. Un WhatsApp de madrugada al paciente de una clinica lo paga la
// clinica con el quality rating de SU linea, y la culpa es nuestra. Esperar no
// pierde el mensaje: el motivo es transitorio, la fila sigue elegible y sale en
// el primer barrido de la mañana.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { DEFAULT_CONFIG, createBotConfig } from "./config.mjs";
import { runInsistenciaSweep } from "./insistencia-run.mjs";
import { resetOrgKnowledgeCache } from "./knowledge.mjs";

const DIR = fileURLToPath(new URL(".", import.meta.url));

/**
 * Universo derivado del DISCO, no de una lista a mano y no de `git ls-files` (un
 * barrido recien escrito y sin commitear es justo el sujeto que se quiere cazar).
 * Sujeto = barrido que le MANDA un mensaje a una persona, o sea que llama a
 * `deliver(`. Los que solo cierran conversaciones o cuentan uso no entran.
 */
function barridosQueMandan() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith("-run.mjs") && !f.includes(".test."))
    .map((f) => ({ archivo: f, fuente: readFileSync(new URL(f, import.meta.url), "utf8") }))
    .filter(({ fuente }) => /\bdeliver\s*\(/.test(fuente));
}

test("el detector ve a los tres barridos que mandan (si no, esta roto)", () => {
  const nombres = barridosQueMandan().map((s) => s.archivo).sort();
  // Caso ancla: los sujetos YA conocidos tienen que estar en el universo. Es lo unico
  // que separa "ningun barrido incumple" de "el detector no encontro a nadie".
  for (const conocido of ["followup-run.mjs", "insistencia-run.mjs", "reminder-run.mjs"]) {
    assert.ok(nombres.includes(conocido), `${conocido} manda mensajes y quedo fuera del universo: ${nombres.join(", ")}`);
  }
});

test("todo barrido que manda decide la hora en el CODIGO, nunca en su cron", () => {
  const sinGuarda = barridosQueMandan().filter(({ fuente }) =>
    // La MENCION no alcanza: se exige la llamada al helper Y el motivo que produce.
    // Importar `localHour` y no usarlo es el esquive que deja el gate verde.
    !(/\blocalHour\s*\(/.test(fuente) && /horario_silencioso/.test(fuente)));

  assert.deepEqual(
    sinGuarda.map((s) => s.archivo),
    [],
    "estos barridos le escriben a una persona sin preguntar la hora local: su unica franja vive en el crontab del VPS, fuera de git",
  );
});

// ---------------------------------------------------------------------------
// Comportamiento del sujeto que faltaba: la insistencia.
// ---------------------------------------------------------------------------

const DOC = { schema: "onia.bot.knowledge/1", identity: { productName: "Ferreteria", humanName: "Marta" } };

function fila(lastInboundAt) {
  return {
    conversation_key: "chatwoot:41", channel: "chatwoot", contact_ref: "41",
    last_inbound_at: lastInboundAt,
    raw: { inboxId: "7", outboundSeq: 2 },
  };
}

function fakeStore(rows, reservas) {
  return {
    warnings: [],
    sweepInsistenciaCandidates: async () => rows,
    reserveFollowUp: async (key) => { reservas.push(key); return true; },
    // La reserva de la insistencia ES el insert (2026-09-18): devuelve el NUMERO de filas — 1 si
    // gano la carrera. Se anota en `reservas` para que "la hora NO quema la reserva" siga midiendo
    // lo que mide: que la guarda horaria corte ANTES de gastar el unico intento.
    insertOutbound: async (replies) => { reservas.push(replies?.[0]?.messageKey); return 1; },
    markMessageDelivered: async () => true,
  };
}

function conocimientoDe(doc) {
  resetOrgKnowledgeCache();
  return {
    fetch: async () => ({ ok: true, status: 200, json: async () => ({ data: doc, version: 1 }) }),
    dbUrl: "http://x/published", dbSecret: "s", nowMs: Date.now(),
  };
}

async function barrer(nowIso, lastInboundAt, reservas = []) {
  return runInsistenciaSweep(
    { nowIso, emit: true },
    { store: fakeStore([fila(lastInboundAt)], reservas), config: createBotConfig({ dryRun: false }), knowledge: conocimientoDe(DOC), send: async () => ({ status: "sent" }) },
  );
}

test("la franja silenciosa de la insistencia esta declarada en la config", () => {
  const { quietBeforeHour, quietAfterHour } = DEFAULT_CONFIG.insistencia ?? {};
  assert.equal(typeof quietBeforeHour, "number", "insistencia.quietBeforeHour tiene que existir");
  assert.equal(typeof quietAfterHour, "number", "insistencia.quietAfterHour tiene que existir");
  assert.ok(quietBeforeHour < quietAfterHour, "la franja en que SI se escribe no puede estar vacia");
  // Un solo hecho ("no molestar a esta hora") con un solo par de numeros: tres politicas
  // distintas para lo mismo es la trampa que config.mjs ya pago con la duracion de la demo.
  assert.equal(quietBeforeHour, DEFAULT_CONFIG.followUp.quietBeforeHour, "mismo piso que el follow-up");
  assert.equal(quietAfterHour, DEFAULT_CONFIG.followUp.quietAfterHour, "mismo techo que el follow-up");
});

test("a las 03:00 de Bolivia no se le insiste a nadie", async () => {
  // 07:00Z = 03:00 local. La fila cumple todo lo demas: 3 h de silencio contra una politica de 2 h.
  const r = await barrer("2026-09-16T07:00:00Z", "2026-09-16T04:00:00Z");
  assert.deepEqual(r.send, [], "no se manda de madrugada");
  assert.match(String(r.skipped[0]?.reason), /^horario_silencioso:3h$/, JSON.stringify(r.skipped));
});

test("tampoco a las 23:00: la hora mala tambien es la noche", async () => {
  // 03:00Z = 23:00 local del dia anterior.
  const r = await barrer("2026-09-17T03:00:00Z", "2026-09-17T00:00:00Z");
  assert.deepEqual(r.send, []);
  assert.match(String(r.skipped[0]?.reason), /^horario_silencioso:23h$/, JSON.stringify(r.skipped));
});

test("en horario decente la insistencia sale (la guarda no apaga el barrido)", async () => {
  // 15:00Z = 11:00 local.
  const r = await barrer("2026-09-16T15:00:00Z", "2026-09-16T12:00:00Z");
  assert.equal(r.skipped.length, 0, JSON.stringify(r.skipped));
  assert.equal(r.send.length, 1, JSON.stringify(r.send));
});

test("la hora NO quema la reserva: es transitoria y la fila vuelve a la mañana", async () => {
  const reservas = [];
  await barrer("2026-09-16T07:00:00Z", "2026-09-16T04:00:00Z", reservas);
  assert.deepEqual(reservas, [], "el CAS es de un solo uso: gastarlo por la hora pierde la insistencia para siempre");

  // Y a las 08:00 la misma fila sale, con mas silencio encima.
  const r = await barrer("2026-09-16T12:00:00Z", "2026-09-16T04:00:00Z");
  assert.equal(r.send.length, 1, JSON.stringify(r.send));
});

test("la hora se pregunta DESPUES de los descartes definitivos, no antes", async () => {
  // Misma hora mala, pero el dueño apago la insistencia: eso no se arregla esperando, y
  // devolver "vuelvo a la mañana" haria que el barrido mire esta fila para siempre.
  const r = await runInsistenciaSweep(
    { nowIso: "2026-09-16T07:00:00Z", emit: true },
    {
      store: fakeStore([fila("2026-09-16T04:00:00Z")], []),
      config: createBotConfig({ dryRun: false }),
      knowledge: conocimientoDe({ ...DOC, seguimiento: { activo: false } }),
    },
  );
  assert.equal(r.skipped[0]?.reason, "apagada_por_el_dueno", JSON.stringify(r.skipped));
});

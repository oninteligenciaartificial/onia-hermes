// Insistencia v6.6: encendida por defecto, UNA vez, solo bots de cliente (org por
// inbox), dentro de la ventana. El CAS corre ANTES de mandar.
import test from "node:test";
import assert from "node:assert/strict";

import { politicaDeSeguimiento, runInsistenciaSweep } from "./insistencia-run.mjs";
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

function fakeStore(rows, { reservas = [] } = {}) {
  return {
    warnings: [],
    sweepInsistenciaCandidates: async () => rows,
    reserveFollowUp: async (key) => { reservas.push(key); return true; },
    insertOutbound: async () => true,
  };
}

/** getOrgKnowledge inyectable: fetch falso que devuelve el doc por inbox. */
function conocimientoDe(doc) {
  resetOrgKnowledgeCache();
  return {
    fetch: async () => ({ ok: true, status: 200, json: async () => ({ data: doc, version: 1 }) }),
    dbUrl: "http://x/published", dbSecret: "s", nowMs: Date.now(),
  };
}

test("politica: default ENCENDIDA con 2 h; el doc puede apagarla o cambiar horas", () => {
  assert.deepEqual(politicaDeSeguimiento({}), { activo: true, horas: 2 });
  assert.deepEqual(politicaDeSeguimiento({ seguimiento: { activo: false } }), { activo: false, horas: 2 });
  assert.deepEqual(politicaDeSeguimiento({ seguimiento: { activo: true, horas: 5 } }), { activo: true, horas: 5 });
});

test("org con default: insiste 1 vez con el nombre del encargado, CAS antes de mandar", async () => {
  const reservas = [];
  const enviados = [];
  const store = fakeStore([fila()], { reservas });
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    config: { ...createBotConfig(), dryRun: false },
    knowledge: conocimientoDe(DOC),
    chatwoot: { enabled: true, warnings: [], sendMessage: async (ref, texto) => { enviados.push({ ref, texto }); return true; } },
  });
  assert.equal(out.send.length, 1);
  assert.equal(out.send[0].mode, "sent");
  assert.deepEqual(reservas, ["chatwoot:41"]);
  assert.match(enviados[0].texto, /Marta/);
  assert.match(enviados[0].texto, /no gracias/);
});

test("el dueño la apago: no se manda nada", async () => {
  const store = fakeStore([fila()]);
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    knowledge: conocimientoDe({ ...DOC, seguimiento: { activo: false } }),
  });
  assert.equal(out.send.length, 0);
  assert.equal(out.skipped[0].reason, "apagada_por_el_dueno");
});

test("horas de la org mandan: con 5 h configuradas, a las 3 h es demasiado pronto", async () => {
  const store = fakeStore([fila()]);
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    knowledge: conocimientoDe({ ...DOC, seguimiento: { activo: true, horas: 5 } }),
  });
  assert.equal(out.send.length, 0);
  assert.match(out.skipped[0].reason, /demasiado_pronto/);
});

test("sin inbox (funnel de Onia) o sin org mapeada: skip, jamas se insiste", async () => {
  const sinInbox = fila({ raw: {} });
  const store = fakeStore([sinInbox]);
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, { store });
  assert.equal(out.skipped[0].reason, "sin_inbox");

  resetOrgKnowledgeCache();
  const store2 = fakeStore([fila()]);
  const out2 = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store2, store: store2,
    knowledge: { fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }), dbUrl: "http://x/published", dbSecret: "s", nowMs: Date.now() },
  });
  assert.equal(out2.skipped[0].reason, "sin_org");
});

test("CAS perdido (otra corrida gano): no manda", async () => {
  const store = fakeStore([fila()]);
  store.reserveFollowUp = async () => false;
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    knowledge: conocimientoDe(DOC),
  });
  assert.equal(out.send.length, 0);
  assert.equal(out.skipped[0].reason, "cas_perdido");
});

test("dry-run: lista lo que mandaria sin reservar ni mandar", async () => {
  const reservas = [];
  const store = fakeStore([fila()], { reservas });
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: false }, {
    store,
    knowledge: conocimientoDe(DOC),
  });
  assert.equal(out.send.length, 1);
  assert.equal(out.send[0].mode, "dry-run");
  assert.equal(reservas.length, 0);
});

// ---------------------------------------------------------------------------
// LA POLITICA QUE EL BARRIDO NO PUEDE CUMPLIR (2026-09-13).
//
// El panel deja al dueño elegir hasta 48 h (`horas: { min: 1, max: 48 }` en el
// schema de knowledge.ts, y el editor conversacional le dicta "1-48" al LLM),
// pero el barrido SQL solo trae conversaciones cuyo ultimo inbound cae DENTRO de
// la ventana de servicio de Meta. Una politica de 24 h o mas no puede producir
// NUNCA un envio: la fila sale del rango antes de volverse elegible.
//
// Hasta hoy eso era silencio perfecto — ni envio, ni skip, ni warning: la fila
// simplemente no aparecia. El dueño encendia "tu asistente le escribe UNA sola
// vez para retomar", elegia el tope del desplegable y su asistente no escribia
// jamas, sin una linea en ningun lado.
// ---------------------------------------------------------------------------

test("politica >= ventana de Meta: se saltea CON MOTIVO, no en silencio", async () => {
  const reservas = [];
  const store = fakeStore([fila()], { reservas });
  const out = await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    knowledge: conocimientoDe({ ...DOC, seguimiento: { activo: true, horas: 24 } }),
  });
  assert.equal(out.send.length, 0, "no puede mandar: la fila ya salio de la ventana");
  assert.equal(reservas.length, 0, "no reserva lo que no va a mandar");
  assert.match(
    String(out.skipped[0]?.reason),
    /politica_fuera_de_ventana/,
    "el motivo tiene que NOMBRAR que la politica pide mas que la ventana",
  );
});

test("politica >= ventana: el warning se lo dice al dueño, con los dos numeros", async () => {
  const store = fakeStore([fila()]);
  await runInsistenciaSweep({ nowIso: NOW, emit: true }, {
    store,
    knowledge: conocimientoDe({ ...DOC, seguimiento: { activo: true, horas: 30 } }),
  });
  const w = store.warnings.join(" | ");
  assert.match(w, /30/, "nombra lo que el dueño eligio");
  assert.match(w, /24/, "y la ventana real, que es el tope que manda");
});

test("el techo del barrido es la ventana del config, no un 24 tipeado aparte", async () => {
  // Dos numeros para el mismo hecho es la trampa que config.mjs ya pago una vez.
  // Si alguien mueve `windowClosesAtHours`, el barrido tiene que moverse con el.
  const pedidos = [];
  const store = fakeStore([]);
  store.sweepInsistenciaCandidates = async (nowIso, config) => { pedidos.push(config); return []; };
  await runInsistenciaSweep({ nowIso: NOW, emit: false }, { store, knowledge: conocimientoDe(DOC) });
  assert.equal(
    pedidos[0]?.followUp?.windowClosesAtHours,
    createBotConfig({}).followUp.windowClosesAtHours,
    "el barrido recibe el config para derivar su ventana",
  );
});

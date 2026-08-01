// ONIA — Chatbot propio: pruebas de RESOLUCION DE CONFIG del ejecutor de turno.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// El resto de run-turn.mjs (runTurn en si) ya esta cubierto por persistence.test.mjs, que
// SIEMPRE inyecta `deps.config` (nunca ejercita resolveConfig). Este archivo cubre justamente
// esa rama: la que corre en produccion real cuando nadie inyecta config.
//
//   1. Si el turno trae `slots` explicitos, o hay ONIA_BOT_SLOTS en el entorno: NO se llama a
//      Cal.com. El horario a mano manda siempre.
//   2. Si nadie fijo horarios: se intenta Cal.com. Si responde, esos 2 horarios reemplazan al
//      placeholder DEMO_SLOTS.
//   3. Si Cal.com no responde (o no hay horarios): se cae a buildConfig(input) tal cual, o sea
//      el placeholder — el bot NUNCA se queda mudo por esto.
//
// No hay red real en ninguna prueba: getAvailableSlots se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG, slotsPending } from "./config.mjs";
import { buildConfig, resolveConfig } from "./run-turn.mjs";

const T0 = "2026-07-27T14:05:00Z";

const LIVE_SLOTS = [
  { key: "A", label: "lun 27/07 14:00", startAt: "2026-07-27T18:00:00Z", pending: false },
  { key: "B", label: "lun 27/07 16:00", startAt: "2026-07-27T20:00:00Z", pending: false },
];

test("sin overrides, buildConfig(input) es el DEFAULT_CONFIG (placeholder): no clona, no llama a nadie", () => {
  assert.equal(buildConfig({}), DEFAULT_CONFIG);
  assert.ok(slotsPending(buildConfig({})), "sigue con el placeholder hasta que algo lo reemplace");
});

test("resolveConfig: con slots explicitos en el turno, NO llama a Cal.com", async () => {
  let called = false;
  const getAvailableSlots = async () => {
    called = true;
    return { slots: LIVE_SLOTS, source: "calcom", warnings: [] };
  };
  const input = { received_at: T0, slots: [{ key: "A", label: "jue 15:00", startAt: "2026-07-30T19:00:00Z" }] };
  const config = await resolveConfig(input, { getAvailableSlots });
  assert.equal(called, false, "el horario a mano manda: no se consulta Cal.com");
  assert.equal(config.slots[0].label, "jue 15:00");
});

test("resolveConfig: con ONIA_BOT_SLOTS en el entorno, tampoco llama a Cal.com", async () => {
  let called = false;
  const getAvailableSlots = async () => {
    called = true;
    return { slots: LIVE_SLOTS, source: "calcom", warnings: [] };
  };
  process.env.ONIA_BOT_SLOTS = "jue 15:00@2026-07-30T19:00:00Z|vie 10:00@2026-07-31T14:00:00Z";
  try {
    const config = await resolveConfig({ received_at: T0 }, { getAvailableSlots });
    assert.equal(called, false);
    assert.equal(config.slots[0].label, "jue 15:00");
  } finally {
    delete process.env.ONIA_BOT_SLOTS;
  }
});

test("resolveConfig: sin ningun horario a mano, si Cal.com responde, esos 2 horarios reemplazan el placeholder", async () => {
  const getAvailableSlots = async (options) => {
    assert.equal(options.nowIso, T0, "el 'ahora' del turno viaja a Cal.com, no Date.now()");
    return { slots: LIVE_SLOTS, source: "calcom", warnings: [] };
  };
  const config = await resolveConfig({ received_at: T0 }, { getAvailableSlots });
  assert.deepEqual(config.slots, LIVE_SLOTS);
  assert.equal(slotsPending(config), false, "ya no hay nota de 'horarios sin definir'");
});

test("resolveConfig: si Cal.com no responde (slots: null), se cae al placeholder sin tirar", async () => {
  const getAvailableSlots = async () => ({ slots: null, source: "error", warnings: ["calcom: ECONNREFUSED"] });
  const config = await resolveConfig({ received_at: T0 }, { getAvailableSlots });
  assert.equal(config, DEFAULT_CONFIG);
  assert.ok(slotsPending(config));
});

test("resolveConfig: preserva el dry_run explicito del turno aunque Cal.com traiga horarios reales", async () => {
  const getAvailableSlots = async () => ({ slots: LIVE_SLOTS, source: "calcom", warnings: [] });
  const config = await resolveConfig({ received_at: T0, dry_run: false }, { getAvailableSlots });
  assert.equal(config.dryRun, false);
  assert.deepEqual(config.slots, LIVE_SLOTS);
});

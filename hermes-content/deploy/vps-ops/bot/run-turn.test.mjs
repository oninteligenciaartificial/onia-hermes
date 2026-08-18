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
import { fileURLToPath } from "node:url";

import { DEFAULT_CONFIG, slotsPending } from "./config.mjs";
import { resetKnowledgeCache, resetOrgKnowledgeCache } from "./knowledge.mjs";
import { buildConfig, resolveConfig } from "./run-turn.mjs";

test.afterEach(() => {
  resetOrgKnowledgeCache();
});

const T0 = "2026-07-27T14:05:00Z";

const LIVE_SLOTS = [
  { key: "A", label: "lun 27/07 14:00", startAt: "2026-07-27T18:00:00Z", pending: false },
  { key: "B", label: "lun 27/07 16:00", startAt: "2026-07-27T20:00:00Z", pending: false },
];

test("sin overrides, buildConfig(input) no pisa NADA del transporte: sigue el placeholder", () => {
  // Antes esto era `assert.equal(buildConfig({}), DEFAULT_CONFIG)` — un assert de IDENTIDAD que
  // daba verde en Windows y ROJO dentro del contenedor de produccion, porque alli existe
  // knowledge.json y `withKnowledge()` devuelve un objeto NUEVO. O sea: el verde local no probaba
  // lo mismo que corre en el servidor. Lo que la prueba cuida de verdad es que sin `slots` ni
  // `dry_run` del canal, el transporte no pise nada — y eso vale con archivo y sin archivo.
  const config = buildConfig({});
  assert.deepEqual(config.slots, DEFAULT_CONFIG.slots, "sin slots del canal, siguen los del codigo");
  assert.equal(config.dryRun, DEFAULT_CONFIG.dryRun, "sin dry_run del canal, sigue el default");
  assert.ok(slotsPending(config), "sigue con el placeholder hasta que algo lo reemplace");
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
  // Igual que arriba: lo que se cuida es que no se FABRIQUE un horario, no la identidad del objeto.
  assert.deepEqual(config.slots, DEFAULT_CONFIG.slots, "no se inventa un horario porque Cal.com no conteste");
  assert.ok(slotsPending(config));
});

test("resolveConfig: preserva el dry_run explicito del turno aunque Cal.com traiga horarios reales", async () => {
  const getAvailableSlots = async () => ({ slots: LIVE_SLOTS, source: "calcom", warnings: [] });
  const config = await resolveConfig({ received_at: T0, dry_run: false }, { getAvailableSlots });
  assert.equal(config.dryRun, false);
  assert.deepEqual(config.slots, LIVE_SLOTS);
});

test("resolveConfig: el inbox del turno resuelve el conocimiento de ESE cliente desde el PRIMER mensaje", async () => {
  // El fetch falso contesta como GET /published del producto cuando le preguntan por inbox.
  const fetchDb = async (url) => {
    assert.match(url, /inboxId=6/, "el motor pregunta por inbox; la org la resuelve el producto");
    return {
      ok: true,
      status: 200,
      json: async () => ({
        organizationId: "org_ferreteria",
        data: {
          schema: "onia.bot.knowledge/1",
          version: "qa.1",
          updatedBy: "test",
          identity: { productName: "ZZ QA Ferreteria Tornillo" },
        },
        version: 1,
        updatedBy: "test",
      }),
    };
  };
  const getAvailableSlots = async () => ({ slots: LIVE_SLOTS, source: "calcom", warnings: [] });
  const config = await resolveConfig(
    { received_at: T0, inbox_id: "6" },
    { getAvailableSlots, knowledge: { dbUrl: "http://producto/published", dbSecret: "s3cr3t", fetch: fetchDb } },
  );
  assert.equal(config.identity.productName, "ZZ QA Ferreteria Tornillo", "la cara del cliente sale en el turno 1, no en el 2");
  assert.deepEqual(config.slots, LIVE_SLOTS, "los horarios de Cal.com siguen entrando igual");

  resetOrgKnowledgeCache();
  // Sin mapeo (404 del producto): el mismo turno degrada al conocimiento de Onia, sin tirar.
  const fetch404 = async () => ({ ok: false, status: 404, json: async () => ({}) });
  const sinMapeo = await resolveConfig(
    { received_at: T0, inbox_id: "99" },
    { getAvailableSlots, knowledge: { dbUrl: "http://producto/published", dbSecret: "s3cr3t", fetch: fetch404 } },
  );
  assert.notEqual(sinMapeo.identity.productName, "ZZ QA Ferreteria Tornillo");
});

// ---------------------------------------------------------------------------
// PARIDAD local / VPS — la grieta que hacia valer un verde que no valia
// ---------------------------------------------------------------------------

/**
 * En el VPS existe `knowledge.json` (los hechos editables, fuera de git). En el repo NO existe a
 * proposito. Cuatro pruebas comparaban IDENTIDAD contra DEFAULT_CONFIG y por eso pasaban aca y
 * fallaban dentro del contenedor: `withKnowledge()` devuelve un objeto nuevo apenas hay archivo.
 *
 * Esta prueba fija las dos mitades del contrato de una vez, y corre igual en los dos lados porque
 * apunta a `knowledge.example.json`, que SI esta versionado:
 *   1. con archivo, la config del transporte (slots, dryRun) NO cambia — es lo que las 4 cuidan;
 *   2. con archivo, la config YA NO es el mismo objeto — o sea, el assert de identidad no puede
 *      volver. Si alguien lo reescribe, esta prueba lo demuestra sin tener que ir al VPS.
 */
test("PARIDAD: con knowledge.json el transporte no cambia, pero el objeto SI (por eso no se compara identidad)", () => {
  process.env.ONIA_BOT_KNOWLEDGE_FILE = fileURLToPath(new URL("./knowledge.example.json", import.meta.url));
  resetKnowledgeCache();
  try {
    const config = buildConfig({});
    assert.deepEqual(config.slots, DEFAULT_CONFIG.slots, "el conocimiento editable no puede tocar los horarios");
    assert.equal(config.dryRun, DEFAULT_CONFIG.dryRun, "ni el interruptor de 'manda de verdad'");
    assert.ok(slotsPending(config));
    assert.notEqual(config, DEFAULT_CONFIG, "con archivo es OTRO objeto: asi se rompian las 4 pruebas en el VPS");
    assert.equal(config.identity.productName, "Onia", "y el archivo si se aplico (no es un falso positivo)");
  } finally {
    delete process.env.ONIA_BOT_KNOWLEDGE_FILE;
    resetKnowledgeCache();
  }
});

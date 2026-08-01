// ONIA — Chatbot propio: pruebas de DISPONIBILIDAD REAL vía Cal.com.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre:
//   1. La URL que se arma es la del endpoint público real (verificado a mano contra
//      https://cal.onia.com.bo el 2026-07-26: devuelve slots sin API key).
//   2. flattenSlots aplana y ordena; pickTwoSlots separa las 2 opciones al menos 2h.
//   3. TOLERANCIA: sin red, con 5xx, con JSON roto, sin config o sin horarios -> slots=null,
//      nunca tira, nunca inventa un horario.
//   4. formatSlotLabel produce el mismo estilo que los horarios escritos a mano ("jue 31/07 15:00").
//
// No hay red real en ninguna prueba: el fetch se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSlotsUrl,
  flattenSlots,
  formatSlotLabel,
  getAvailableSlots,
  pickTwoSlots,
} from "./calcom-availability.mjs";

const NOW = "2026-07-27T14:05:00Z";

function fakeFetch(responses) {
  const calls = [];
  let index = 0;
  return {
    calls,
    fetch: async (url) => {
      calls.push(String(url));
      const next = responses[index++] ?? { status: 200, body: { result: { data: { json: { slots: {} } } } } };
      if (next.throws) throw new Error(next.throws);
      return {
        ok: next.status < 400,
        status: next.status,
        text: async () => (typeof next.body === "string" ? next.body : JSON.stringify(next.body)),
      };
    },
  };
}

function calcomBody(times) {
  const byDate = {};
  for (const time of times) {
    const day = time.slice(0, 10);
    byDate[day] = byDate[day] || [];
    byDate[day].push({ time });
  }
  return { result: { data: { json: { slots: byDate } } } };
}

// ---------------------------------------------------------------------------
// 1. La URL — mismo endpoint público que usa la página de reserva
// ---------------------------------------------------------------------------

test("buildSlotsUrl apunta al endpoint público /api/trpc/slots/getSchedule", () => {
  const url = buildSlotsUrl({
    baseUrl: "https://cal.onia.com.bo",
    eventTypeSlug: "demo-onia",
    username: "onia",
    startIso: "2026-07-27T00:00:00.000Z",
    endIso: "2026-08-03T00:00:00.000Z",
    timeZone: "America/La_Paz",
  });
  assert.match(url, /^https:\/\/cal\.onia\.com\.bo\/api\/trpc\/slots\/getSchedule\?input=/);
  const input = JSON.parse(decodeURIComponent(url.split("?input=")[1]));
  assert.equal(input.json.eventTypeSlug, "demo-onia");
  assert.deepEqual(input.json.usernameList, ["onia"]);
  assert.equal(input.json.timeZone, "America/La_Paz");
});

test("buildSlotsUrl no duplica la barra final del baseUrl", () => {
  const url = buildSlotsUrl({
    baseUrl: "http://calcom:3000/",
    eventTypeSlug: "demo-onia",
    username: "onia",
    startIso: NOW,
    endIso: NOW,
    timeZone: "America/La_Paz",
  });
  assert.match(url, /^http:\/\/calcom:3000\/api\/trpc/);
});

// ---------------------------------------------------------------------------
// 2. Aplanar y elegir 2
// ---------------------------------------------------------------------------

test("flattenSlots aplana por fecha y ordena de mas temprano a mas tarde", () => {
  const flat = flattenSlots(
    calcomBody(["2026-07-28T18:15:00.000Z", "2026-07-27T18:00:00.000Z", "2026-07-27T18:15:00.000Z"]),
  );
  assert.deepEqual(
    flat.map((s) => s.time),
    ["2026-07-27T18:00:00.000Z", "2026-07-27T18:15:00.000Z", "2026-07-28T18:15:00.000Z"],
  );
});

test("flattenSlots ante una respuesta sin la forma esperada no tira: lista vacia", () => {
  assert.deepEqual(flattenSlots(null), []);
  assert.deepEqual(flattenSlots({}), []);
  assert.deepEqual(flattenSlots({ result: { data: { json: {} } } }), []);
});

test("pickTwoSlots separa las 2 opciones por al menos 2h (no ofrece 14:00 y 14:15 como si fueran distintas)", () => {
  const flat = flattenSlots(
    calcomBody(["2026-07-27T18:00:00.000Z", "2026-07-27T18:15:00.000Z", "2026-07-27T20:00:00.000Z"]),
  );
  const picked = pickTwoSlots(flat);
  assert.deepEqual(
    picked.map((s) => s.time),
    ["2026-07-27T18:00:00.000Z", "2026-07-27T20:00:00.000Z"],
  );
});

test("pickTwoSlots: si no hay ninguna con 2h de margen, cae al segundo antes que no ofrecer nada", () => {
  const flat = flattenSlots(calcomBody(["2026-07-27T18:00:00.000Z", "2026-07-27T18:15:00.000Z"]));
  const picked = pickTwoSlots(flat);
  assert.deepEqual(
    picked.map((s) => s.time),
    ["2026-07-27T18:00:00.000Z", "2026-07-27T18:15:00.000Z"],
  );
});

test("pickTwoSlots con una sola opcion devuelve una sola; con ninguna, ninguna", () => {
  assert.equal(pickTwoSlots(flattenSlots(calcomBody(["2026-07-27T18:00:00.000Z"]))).length, 1);
  assert.deepEqual(pickTwoSlots([]), []);
});

// ---------------------------------------------------------------------------
// 3. Formato del label — mismo estilo que los horarios escritos a mano
// ---------------------------------------------------------------------------

test("formatSlotLabel da el mismo estilo que los horarios de ejemplo ('jue 31/07 15:00')", () => {
  // lunes 27/07 18:00 UTC = 14:00 en La Paz (UTC-4)
  assert.equal(formatSlotLabel("2026-07-27T18:00:00.000Z", "America/La_Paz"), "lun 27/07 14:00");
});

test("formatSlotLabel ante un ISO invalido no tira: devuelve el string tal cual", () => {
  assert.equal(formatSlotLabel("no-es-fecha", "America/La_Paz"), "no-es-fecha");
});

// ---------------------------------------------------------------------------
// 4. getAvailableSlots — tolerancia total (nunca tira, nunca inventa)
// ---------------------------------------------------------------------------

test("camino feliz: Cal.com responde y devuelve 2 slots reales, con key A/B y pending:false", async () => {
  const { fetch } = fakeFetch([
    { status: 200, body: calcomBody(["2026-07-27T18:00:00.000Z", "2026-07-27T20:00:00.000Z", "2026-07-28T18:00:00.000Z"]) },
  ]);
  const result = await getAvailableSlots(
    { nowIso: NOW, baseUrl: "https://cal.onia.com.bo", eventTypeSlug: "demo-onia", username: "onia" },
    { fetch },
  );
  assert.equal(result.source, "calcom");
  assert.equal(result.slots.length, 2);
  assert.equal(result.slots[0].key, "A");
  assert.equal(result.slots[1].key, "B");
  assert.equal(result.slots[0].pending, false);
  assert.equal(result.slots[0].startAt, "2026-07-27T18:00:00.000Z");
  assert.match(result.slots[0].label, /^lun 27\/07 14:00$/);
});

test("sin red (throws): cae a null, nunca inventa un horario", async () => {
  const { fetch } = fakeFetch([{ throws: "ECONNREFUSED" }]);
  const result = await getAvailableSlots({ nowIso: NOW, baseUrl: "https://cal.onia.com.bo" }, { fetch });
  assert.equal(result.slots, null);
  assert.equal(result.source, "error");
  assert.ok(result.warnings.some((w) => w.includes("ECONNREFUSED")));
});

test("HTTP 5xx: cae a null y deja el motivo", async () => {
  const { fetch } = fakeFetch([{ status: 503, body: "upstream caido" }]);
  const result = await getAvailableSlots({ nowIso: NOW, baseUrl: "https://cal.onia.com.bo" }, { fetch });
  assert.equal(result.slots, null);
  assert.ok(result.warnings.some((w) => w.includes("HTTP 503")));
});

test("JSON roto: cae a null, no tira", async () => {
  const { fetch } = fakeFetch([{ status: 200, body: "{esto-no-es-json" }]);
  const result = await getAvailableSlots({ nowIso: NOW, baseUrl: "https://cal.onia.com.bo" }, { fetch });
  assert.equal(result.slots, null);
  assert.equal(result.source, "error");
});

test("ventana sin horarios disponibles: cae a null con motivo 'sin_horarios'", async () => {
  const { fetch } = fakeFetch([{ status: 200, body: calcomBody([]) }]);
  const result = await getAvailableSlots({ nowIso: NOW, baseUrl: "https://cal.onia.com.bo" }, { fetch });
  assert.equal(result.slots, null);
  assert.equal(result.source, "sin_horarios");
});

test("sin baseUrl/eventTypeSlug/username: no intenta red, motivo 'sin_config'", async () => {
  const { fetch, calls } = fakeFetch([]);
  const result = await getAvailableSlots({ nowIso: NOW, baseUrl: "", eventTypeSlug: "", username: "" }, { fetch });
  assert.equal(result.slots, null);
  assert.equal(result.source, "sin_config");
  assert.equal(calls.length, 0);
});

test("nowIso invalido: no intenta red, no tira", async () => {
  const { fetch, calls } = fakeFetch([]);
  const result = await getAvailableSlots({ nowIso: "ayer", baseUrl: "https://cal.onia.com.bo" }, { fetch });
  assert.equal(result.slots, null);
  assert.equal(calls.length, 0);
});

test("sin implementacion de fetch disponible: no tira, motivo 'sin_fetch' (sin pegarle nunca a la red real)", async () => {
  // deps.fetch / options.fetch ausentes caerian a globalThis.fetch: se pisa temporalmente para
  // que el test NUNCA salga a la red real, ni siquiera en el camino "sin fetch disponible".
  const real = globalThis.fetch;
  try {
    globalThis.fetch = undefined;
    const sinFetch = await getAvailableSlots({ nowIso: NOW, baseUrl: "https://cal.onia.com.bo" }, {});
    assert.equal(sinFetch.slots, null);
    assert.equal(sinFetch.source, "sin_fetch");
  } finally {
    globalThis.fetch = real;
  }
});

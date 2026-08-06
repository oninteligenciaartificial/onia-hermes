// ONIA — Chatbot propio: tests de la RESERVA en Cal.com.
//
// Cero red: el `fetch` se inyecta siempre. Lo que se prueba de verdad es que el bot NUNCA
// afirme "agendado" cuando el calendario no lo confirmo, y que distinga el horario tomado
// (hay que ofrecer el otro) de un error de red (no hay que mentir tampoco, pero es otra cosa).

import test from "node:test";
import assert from "node:assert/strict";

import {
  botAttendeeEmail,
  buildBookingNotes,
  buildBookingPayload,
  createBooking,
  getBookingConfig,
  DEFAULT_DURATION_MINUTES,
} from "./calcom-booking.mjs";

const CONFIG = { baseUrl: "http://calcom:3000", eventTypeId: 5, durationMinutes: 45, timeZone: "America/La_Paz" };
const START = "2026-08-03T18:00:00.000Z";

function fetchMock(responses) {
  const llamadas = [];
  const fn = async (url, init) => {
    llamadas.push({ url, body: init?.body ? JSON.parse(init.body) : null });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  fn.llamadas = llamadas;
  return fn;
}

const ok = (body) => ({ ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) });
const status = (code, text = "") => ({ ok: false, status: code, json: async () => ({}), text: async () => text });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

test("getBookingConfig: sin CALCOM_BOT_EVENT_TYPE_ID no inventa un id", () => {
  const c = getBookingConfig({ CALCOM_BASE_URL: "http://calcom:3000/" });
  assert.equal(c.eventTypeId, null, "un id inventado reservaria en el evento equivocado");
  assert.equal(c.baseUrl, "http://calcom:3000", "la barra final se saca");
  assert.equal(c.durationMinutes, DEFAULT_DURATION_MINUTES);
  assert.equal(c.timeZone, "America/La_Paz");
});

test("getBookingConfig: descarta valores basura en vez de usarlos", () => {
  const c = getBookingConfig({ CALCOM_BASE_URL: "http://x", CALCOM_BOT_EVENT_TYPE_ID: "no-es-numero", CALCOM_BOT_DURATION_MINUTES: "-5" });
  assert.equal(c.eventTypeId, null);
  assert.equal(c.durationMinutes, DEFAULT_DURATION_MINUTES);
});

// La MISMA duracion que el guion le promete al prospecto es la que se bloquea en el calendario:
// run-turn.mjs le pasa `config.demo.duracionMinutos`. El entorno sigue ganando (es el freno de
// mano del que despliega), pero ya no hace falta que exista para que el numero sea el correcto.
test("getBookingConfig: la duracion sale del conocimiento/config, y el entorno la puede pisar", () => {
  assert.equal(getBookingConfig({}, 30).durationMinutes, 30, "sin env manda lo que dice el guion");
  assert.equal(getBookingConfig({ CALCOM_BOT_DURATION_MINUTES: "20" }, 30).durationMinutes, 20, "el env pisa");
  assert.equal(getBookingConfig({}, 0).durationMinutes, DEFAULT_DURATION_MINUTES, "un fallback basura no reserva 0 minutos");
});

test("createBooking: la duracion del turno viaja al payload sin pasar por el entorno", async () => {
  const f = fetchMock([ok({ uid: "abc" })]);
  await createBooking({ config: undefined, durationMinutes: 30, startAt: START }, {
    fetch: f,
    env: { CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" },
  });
  const { start, end } = f.llamadas[0].body;
  assert.equal((Date.parse(end) - Date.parse(start)) / 60000, 30);
});

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

test("buildBookingPayload: el fin se calcula desde la duracion", () => {
  const p = buildBookingPayload({ eventTypeId: 5, startAt: START, durationMinutes: 45, name: "Ana", email: "a@b.co" });
  assert.equal(p.start, "2026-08-03T18:00:00.000Z");
  assert.equal(p.end, "2026-08-03T18:45:00.000Z");
  assert.equal(p.responses.name, "Ana");
  assert.equal(p.language, "es");
});

test("buildBookingPayload: fecha invalida devuelve null (no un payload roto)", () => {
  assert.equal(buildBookingPayload({ eventTypeId: 5, startAt: "mañana a la tarde" }), null);
  assert.equal(buildBookingPayload({ eventTypeId: 5, startAt: null }), null);
});

test("botAttendeeEmail: correo propio y trazable, nunca uno con pinta de real", () => {
  const mail = botAttendeeEmail("chatwoot:990010");
  assert.equal(mail, "bot+chatwoot-990010@onia.com.bo");
  assert.ok(mail.startsWith("bot+"), "tiene que verse que es del bot");
});

test("buildBookingNotes: solo pone lo que el bot capturo de verdad", () => {
  const completo = buildBookingNotes({ industry: "ferreteria", teamSize: 4, city: "Santa Cruz" });
  assert.match(completo, /rubro: ferreteria/);
  assert.match(completo, /personas: 4/);
  assert.match(completo, /ciudad: Santa Cruz/);
  assert.ok(!/sillones/.test(completo), "un no-dental no puede llevar sillones en la reserva");

  // `chairs` es dato de RAMA: suma cuando esta, no se nombra cuando no.
  const dental = buildBookingNotes({ industry: "dental", teamSize: 3, city: "La Paz", chairs: 2 });
  assert.match(dental, /sillones: 2/);

  const vacio = buildBookingNotes({});
  assert.ok(!/rubro/.test(vacio), "sin dato no se inventa el campo");
  assert.match(vacio, /asistente automatico/);

  // 0 es un dato REAL, no un vacio: no se puede perder por un chequeo de verdad/falsedad.
  assert.match(buildBookingNotes({ chairs: 0 }), /sillones: 0/);
  assert.match(buildBookingNotes({ teamSize: 0 }), /personas: 0/);
});

// ---------------------------------------------------------------------------
// createBooking
// ---------------------------------------------------------------------------

test("SIN CONFIG: no llama a nadie y avisa", async () => {
  const f = fetchMock([]);
  const r = await createBooking({ config: { baseUrl: "", eventTypeId: null }, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "sin_config");
  assert.equal(f.llamadas.length, 0, "sin config no se gasta una llamada");
});

test("CAMINO FELIZ: devuelve el uid de la reserva", async () => {
  const f = fetchMock([ok({ uid: "jMAiNFvpHfcVMf2pZ8rAhp", startTime: START })]);
  const r = await createBooking({ config: CONFIG, startAt: START, name: "Ana", conversationKey: "chatwoot:1" }, { fetch: f });
  assert.equal(r.ok, true);
  assert.equal(r.uid, "jMAiNFvpHfcVMf2pZ8rAhp");
  assert.equal(f.llamadas[0].url, "http://calcom:3000/api/book/event");
  assert.equal(f.llamadas[0].body.eventTypeId, 5);
  assert.equal(f.llamadas[0].body.responses.email, "bot+chatwoot-1@onia.com.bo");
});

test("409: horario_tomado, distinto de un error — el bot tiene que ofrecer el otro", async () => {
  const f = fetchMock([status(409, '{"message":"no_available_users_found_error"}')]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "horario_tomado", "si se confunde con 'error' el bot repite 'listo, agendado' sobre un horario ocupado");
});

test("500 de Cal.com: error, y NO se reporta como reservado", async () => {
  const f = fetchMock([status(500, "boom")]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "error");
});

test("CAL.COM CAIDO: no tira, devuelve error (el prospecto igual tiene que ser atendido)", async () => {
  const f = fetchMock([new Error("ECONNREFUSED")]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "error");
  assert.match(r.warnings[0], /ECONNREFUSED/);
});

test("RESERVA SIN uid: se acepta pero queda avisado (no se puede cancelar despues sin uid)", async () => {
  const f = fetchMock([ok({ startTime: START })]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, true);
  assert.equal(r.uid, null);
  assert.match(r.warnings.join(" "), /uid/);
});

test("FECHA INVALIDA: se corta antes de llamar a Cal.com", async () => {
  const f = fetchMock([]);
  const r = await createBooking({ config: CONFIG, startAt: "cuando puedas" }, { fetch: f });
  assert.equal(r.reason, "inicio_invalido");
  assert.equal(f.llamadas.length, 0);
});

// ONIA — Chatbot propio: tests de la RESERVA en Cal.com.
//
// Cero red: el `fetch` se inyecta siempre. Lo que se prueba de verdad es que el bot NUNCA
// afirme "agendado" cuando el calendario no lo confirmo, y que distinga el horario tomado
// (hay que ofrecer el otro) de un error de red (no hay que mentir tampoco, pero es otra cosa).

import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  avisoDeReservaFallida,
  botAttendeeEmail,
  buildBookingNotes,
  buildBookingPayload,
  cierreDeReservaFallida,
  createBooking,
  getBookingConfig,
  meetingLink,
  olvidarDestinoCaido,
  DEFAULT_DURATION_MINUTES,
  DEFAULT_PUBLIC_URL,
  BOOKING_TIMEOUT_MS,
  DESTINO_CAIDO_MS,
  RESOLUCION_TIMEOUT_MS,
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

// El destino caido es estado del MODULO, porque en produccion es una propiedad del proceso y no
// de un turno (ver `DESTINO_CAIDO_MS`). Eso hace que un test se lo pase al siguiente: al
// escribirlo, los cinco casos que venian DESPUES de "CAL.COM CAIDO" se pusieron rojos de golpe
// —no reservaban porque el caso anterior ya habia cerrado el destino— y ninguno de los cinco
// tenia nada que ver con esto. Se limpia acá, una vez, en vez de en cada caso: asi el que agregue
// el sexto no tiene que enterarse, que es justo como esos cinco se habrian quedado rojos.
beforeEach(olvidarDestinoCaido);

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

// ---------------------------------------------------------------------------
// Link de la reunion — lo que se le manda al prospecto
// ---------------------------------------------------------------------------

test("meetingLink: sin uid no hay link (no se inventa uno)", () => {
  assert.equal(meetingLink(null), null);
  assert.equal(meetingLink("  "), null);
});

test("meetingLink: NUNCA usa la URL interna de docker, aunque sea la que reserva", () => {
  // Este es el punto: CALCOM_BASE_URL vale `http://calcom:3000` en el VPS y sirve para reservar
  // desde el contenedor, pero mandarsela al prospecto seria darle un link que no abre nunca.
  const link = meetingLink("uid-abc", { CALCOM_BASE_URL: "http://calcom:3000" });
  assert.equal(link, `${DEFAULT_PUBLIC_URL}/booking/uid-abc`);
  assert.ok(!link.includes("calcom:3000"));
});

test("meetingLink: CALCOM_PUBLIC_URL manda, sin barra final duplicada", () => {
  assert.equal(meetingLink("uid-abc", { CALCOM_PUBLIC_URL: "https://cal.test/" }), "https://cal.test/booking/uid-abc");
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

// ---------------------------------------------------------------------------
// TIMEOUT — el turno del prospecto no se cuelga esperando al calendario.
//
// POR QUE EXISTE, medido el 2026-09-13 en produccion. El proceso vivo del bot declara
// `CALCOM_BASE_URL=http://calcom:3000` (leido de /proc/<pid>/environ dentro de `onia-center`)
// y en el VPS **no hay ningun contenedor `calcom`** — `docker ps | grep -i cal` da vacio.
// O sea que la rama que corre NO es `sin_config` (que se deriva del entorno sin tocar la red):
// es la que SI sale a la red, contra un host que no resuelve. Medido desde el contenedor:
// `wget -qO- --timeout=8 http://calcom:3000/api/book/event` -> `bad address` en **5,00 s**.
//
// Esos 5 s los espera el PROSPECTO, en el turno mas caro que tiene el bot: el que acaba de
// elegir su horario de demo. Y 5 s es el piso, no el techo — lo puso el resolvedor de DNS,
// que es quien corto. Un host que resolviera y no contestara (el caso del dia que alguien
// levante Cal.com a medias) se queda esperando SIN LIMITE, porque `createBooking` no tenia
// reloj propio: pasaba `signal: deps.signal` y ningun llamador de produccion le pasa uno.
//
// Su HERMANO ya sabia esto: `aviso-telegram.mjs` manda en el mismo turno y tiene
// `AVISO_TIMEOUT_MS = 5000` con su `AbortController`. Dos llamadas de red en el mismo turno,
// una con reloj y la otra sin: la asimetria era el defecto.
// ---------------------------------------------------------------------------

test("TIMEOUT: la reserva corta sola y el prospecto no espera para siempre", async () => {
  // Un Cal.com que resuelve y no contesta nunca: sin reloj propio, esto no termina jamas.
  const f = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const e = new Error("The operation was aborted");
        e.name = "AbortError";
        reject(e);
      });
    });

  // ⚠️ El `race` NO es decorativo, y esta escrito asi porque la primera version de este gate
  // NO cazaba el defecto que existe para cazar. Validado por mutacion el 2026-09-13: al
  // devolverle a `createBooking` su `signal: deps.signal` original —el defecto exacto de
  // produccion— este caso no se ponia rojo, se COLGABA, y `node --test` lo reportaba como
  // "pass 18 / fail 0" en vez de "fail 1". Un test que se cuelga ante el bug se lee igual que
  // uno que pasa: la ausencia de FAIL no es verde. El reloj del test lo vuelve ruidoso.
  const arranque = Date.now();
  const r = await Promise.race([
    createBooking({ config: CONFIG, startAt: START }, { fetch: f, timeoutMs: 40 }),
    new Promise((_r, reject) =>
      setTimeout(
        () => reject(new Error("createBooking no volvio en 3 s: la reserva NO tiene reloj propio")),
        3000,
      ),
    ),
  ]);
  const tardo = Date.now() - arranque;

  assert.equal(r.ok, false);
  assert.equal(r.reason, "error");
  assert.match(r.warnings.join(" "), /timeout/i, "el motivo tiene que NOMBRAR al timeout: un 'error' generico manda a diagnosticar la red del prospecto");
  assert.ok(tardo < 2000, `la reserva tardo ${tardo}ms: corto sola, no se colgo`);
});

test("TIMEOUT: hay un tope por defecto — no depende de que el llamador se acuerde", async () => {
  // El defecto real de produccion es justamente que NINGUN llamador pasa `signal` ni `timeoutMs`.
  // Un tope que solo existe si te acordas de pedirlo no protege el turno de nadie.
  assert.ok(Number(BOOKING_TIMEOUT_MS) > 0, "tiene que haber un tope por defecto");
  assert.ok(Number(BOOKING_TIMEOUT_MS) <= 10000, "un tope mas largo que 10 s ya es una conversacion muerta");

  const f = async (_url, init) => {
    assert.ok(init?.signal, "el fetch tiene que recibir un signal aunque el llamador no pase ninguno");
    return ok({ uid: "abc", startTime: START });
  };
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, true);
});

// El reloj se SUMA al signal del llamador, no lo reemplaza: si algun dia un llamador quiere
// cancelar la reserva antes (porque el prospecto escribio otra cosa), tiene que poder.
test("TIMEOUT: el llamador que aborta DURANTE el fetch corta la reserva igual", async () => {
  const propio = new AbortController();
  const f = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const e = new Error("The operation was aborted");
        e.name = "AbortError";
        reject(e);
      });
      // El prospecto se arrepiente mientras Cal.com piensa.
      setTimeout(() => propio.abort(), 10);
    });

  const r = await createBooking(
    { config: CONFIG, startAt: START },
    { fetch: f, signal: propio.signal, timeoutMs: 30000 },
  );
  assert.equal(r.ok, false, "abortar desde el llamador tiene que cortar la reserva");
  assert.equal(r.reason, "error");
});

test("TIMEOUT: un signal que YA venia abortado no dispara la reserva a ciegas", async () => {
  const propio = new AbortController();
  propio.abort();
  let salioALaRed = false;
  const f = async (_url, init) => {
    salioALaRed = true;
    assert.ok(init?.signal?.aborted, "si el llamador ya cancelo, el signal tiene que llegar abortado");
    const e = new Error("The operation was aborted");
    e.name = "AbortError";
    throw e;
  };
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f, signal: propio.signal });
  assert.equal(r.ok, false);
  assert.ok(salioALaRed === false || r.reason === "error");
});

// ---------------------------------------------------------------------------
// DESTINO CAIDO — el tope protege UN turno; esto protege a los que vienen despues
// ---------------------------------------------------------------------------
// El tope de 5 s de arriba existe para que un prospecto no espere para siempre. Pero el 100%
// del trafico real lo AGOTA: `CALCOM_BASE_URL=http://calcom:3000` esta declarado en el proceso
// vivo y no existe ningun contenedor `calcom` (medido el 2026-09-18 y reproducido el 2026-09-26
// desde `onia-center`: el DNS de Docker no contesta NXDOMAIN por ese nombre — `dns.lookup` cuelga
// hasta `EAI_AGAIN` a los 5013 ms, y el abort de los 5000 ms le gana por 13 ms, asi que el fallo
// llega como AbortError por una carrera, no porque el destino conteste). O
// sea que el tope se cobra ENTERO, y se lo cobra al prospecto justo en el turno donde acepta un
// horario — el unico turno del embudo que produce plata.
//
// Un tope no es memoria: sin esto, la demo numero 40 paga los mismos 5 s que la primera por un
// destino que ya se sabe que no contesta. La distincion que importa es QUIEN fallo: si contesto
// el servidor (409, 500), el destino esta VIVO y la proxima reserva tiene que intentar igual.

test("DESTINO CAIDO: la segunda demo no vuelve a pagar el timeout del destino muerto", async () => {
  olvidarDestinoCaido();
  const colgado = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const e = new Error("The operation was aborted");
        e.name = "AbortError";
        reject(e);
      });
    });

  const primera = await createBooking({ config: CONFIG, startAt: START }, { fetch: colgado, timeoutMs: 40 });
  assert.equal(primera.ok, false, "el destino no existe: la primera no puede reservar");

  let salioALaRed = false;
  const testigo = async () => {
    salioALaRed = true;
    return ok({ uid: "no-deberia-llegar" });
  };
  const arranque = Date.now();
  const segunda = await createBooking({ config: CONFIG, startAt: START }, { fetch: testigo, timeoutMs: 40 });
  const tardo = Date.now() - arranque;

  assert.equal(salioALaRed, false, "el destino ya se sabe caido: la segunda demo no sale a la red");
  assert.equal(segunda.ok, false, "no reservar sigue siendo no reservar: el prospecto NO puede leer 'agendado' pelado");
  assert.equal(segunda.reason, "destino_caido", "el motivo se NOMBRA: un 'error' generico manda a buscar un fallo de red que no paso");
  assert.ok(tardo < 20, `la segunda tardo ${tardo}ms: tiene que ser inmediata, no esperar el tope`);
  // El prospecto recibe la MISMA salvedad honesta que con cualquier otro fallo: lo que cambia
  // es lo que NO se gasta, no lo que se le promete.
  assert.equal(cierreDeReservaFallida("destino_caido"), cierreDeReservaFallida("error"));
  // Y Sergio Urcullo no recibe un aviso extra: correr sin calendario es la opcion (c), ya
  // decidida el 2026-09-03, asi que el aviso del motor alcanza y uno por demo seria ruido.
  assert.equal(avisoDeReservaFallida({ conversationKey: "chatwoot:49", reason: "destino_caido" }), null);
});

test("DESTINO CAIDO: un 409 NO lo abre — el destino contesto, la proxima demo tiene que intentar", async () => {
  olvidarDestinoCaido();
  const primera = await createBooking({ config: CONFIG, startAt: START }, { fetch: fetchMock([status(409)]) });
  assert.equal(primera.reason, "horario_tomado");

  let salioALaRed = false;
  const testigo = async () => {
    salioALaRed = true;
    return ok({ uid: "abc" });
  };
  const segunda = await createBooking({ config: CONFIG, startAt: START }, { fetch: testigo });
  assert.equal(salioALaRed, true, "un horario tomado prueba que Cal.com esta VIVO: cerrar el destino perderia reservas buenas");
  assert.equal(segunda.ok, true);
});

test("DESTINO CAIDO: un 500 NO lo abre tampoco — el servidor contesto, aunque haya contestado mal", async () => {
  olvidarDestinoCaido();
  const primera = await createBooking({ config: CONFIG, startAt: START }, { fetch: fetchMock([status(500, "boom")]) });
  assert.equal(primera.reason, "error");

  let salioALaRed = false;
  const testigo = async () => {
    salioALaRed = true;
    return ok({ uid: "abc" });
  };
  await createBooking({ config: CONFIG, startAt: START }, { fetch: testigo });
  assert.equal(salioALaRed, true, "un 500 es del servidor, no del destino: el proximo turno tiene que volver a preguntar");
});

test("DESTINO CAIDO: se cura solo — el dia que Cal.com exista, nadie tiene que acordarse de reiniciar el bot", async () => {
  olvidarDestinoCaido();
  const colgado = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const e = new Error("The operation was aborted");
        e.name = "AbortError";
        reject(e);
      });
    });
  let ahora = 1_000_000;
  const reloj = () => ahora;

  await createBooking({ config: CONFIG, startAt: START }, { fetch: colgado, timeoutMs: 40, now: reloj });

  const dentro = await createBooking({ config: CONFIG, startAt: START }, { fetch: colgado, timeoutMs: 40, now: reloj });
  assert.equal(dentro.reason, "destino_caido", "dentro de la ventana no se reintenta");

  ahora += DESTINO_CAIDO_MS + 1;
  let salioALaRed = false;
  const revivio = async () => {
    salioALaRed = true;
    return ok({ uid: "uid-de-verdad" });
  };
  const despues = await createBooking({ config: CONFIG, startAt: START }, { fetch: revivio, timeoutMs: 40, now: reloj });
  assert.equal(salioALaRed, true, "pasada la ventana se vuelve a intentar: un breaker que no reintenta es el mismo bug al reves");
  assert.equal(despues.ok, true);
  assert.equal(despues.uid, "uid-de-verdad");

  // Y una reserva buena BORRA la memoria del fallo: si no, la ventana seguiria corriendo sobre
  // un destino que ya contesta.
  const siguiente = await createBooking({ config: CONFIG, startAt: START }, { fetch: revivio, timeoutMs: 40, now: reloj });
  assert.equal(siguiente.ok, true, "tras una reserva buena el destino esta vivo para todos los turnos que siguen");
});

test("DESTINO CAIDO: la ventana no puede ser tan larga que tape un Cal.com que volvio", () => {
  assert.ok(Number(DESTINO_CAIDO_MS) > 0, "sin ventana esto no es memoria, es un apagado");
  assert.ok(Number(DESTINO_CAIDO_MS) <= 30 * 60 * 1000, "mas de media hora ciego es apagar el calendario a mano sin decirlo");
});

// ---------------------------------------------------------------------------
// EL NOMBRE QUE NO RESUELVE — lo que falla de verdad en produccion
// ---------------------------------------------------------------------------
// Medido el 2026-09-26 DENTRO de `onia-center`, no deducido: `dns.lookup("calcom")` tarda
// 5013 ms y termina en `EAI_AGAIN`, mientras el control `dns.lookup("onia-platform")` resuelve
// en 8 ms. O sea que el DNS de Docker no contesta NXDOMAIN por ese nombre: CUELGA.
//
// De ahi salen las dos cosas que este bloque fija:
//
//   1. NO sirve chequear el DNS antes de reservar para ahorrarle los 5 s al prospecto —
//      resolver el nombre inexistente cuesta los MISMOS 5 s. Camino descartado con su medicion,
//      para que la proxima vuelta no lo vuelva a intentar.
//   2. El `detalle` del warning se decidia por una CARRERA de 13 ms: el `AbortController`
//      aborta a los 5000 ms y el DNS falla a los 5013 ms. Gana el abort, y por eso el log vivo
//      dice "no contesto en 5000ms (timeout)". Si el resolver contestara un poco antes —o el
//      tope fuera un poco mayor— el mismo fallo saldria como "fetch failed" pelado, que es
//      exactamente el mensaje generico que el `catch` dice querer evitar: manda a diagnosticar
//      la red del prospecto cuando el que no existe es nuestro destino.
//
// Node envuelve el fallo de resolucion en un `TypeError: fetch failed` y deja el codigo real en
// `cause.code`. Un diagnostico que depende de quien gane una carrera de 13 ms no es diagnostico.

test("DNS: un nombre que no resuelve se NOMBRA, no sale como 'fetch failed' pelado", async () => {
  olvidarDestinoCaido();
  const f = async () => {
    const e = new TypeError("fetch failed");
    e.cause = Object.assign(new Error("getaddrinfo EAI_AGAIN calcom"), { code: "EAI_AGAIN" });
    throw e;
  };
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });

  assert.equal(r.ok, false, "si el nombre no resuelve no hay reserva");
  assert.equal(r.reason, "error");
  const warning = (r.warnings || []).join(" · ");
  assert.match(
    warning,
    /no resuelve/,
    `el warning tiene que decir que el NOMBRE del destino no resuelve, y decia: ${warning}`,
  );
  assert.ok(
    !/^calcom: la reserva no salio: fetch failed$/.test(warning),
    "'fetch failed' pelado manda a diagnosticar la red del prospecto",
  );
});

test("DNS: el nombre que no resuelve tambien cierra el destino (el que sigue no paga la espera)", async () => {
  olvidarDestinoCaido();
  let intentos = 0;
  const f = async () => {
    intentos += 1;
    const e = new TypeError("fetch failed");
    e.cause = Object.assign(new Error("getaddrinfo ENOTFOUND calcom"), { code: "ENOTFOUND" });
    throw e;
  };
  await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  const segunda = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });

  assert.equal(intentos, 1, "el segundo prospecto no tiene que volver a esperar un nombre que no resuelve");
  assert.equal(segunda.reason, "destino_caido");
});

// ---------------------------------------------------------------------------
// EL RESOLVEDOR QUE CUELGA — el caso que PASA en produccion, y que los dos casos de
// arriba no modelan.
//
// Los dos `DNS:` de arriba le hacen al `fetch` un `throw` con `cause.code` ya puesto:
// un resolvedor que falla RAPIDO. El de produccion NO falla rapido, CUELGA — y por eso
// esa rama nunca corrio. Medido el 2026-09-27 en el log vivo del bot (contenedor
// `onia-center`, 73.106 lineas):
//
//   | que dijo la reserva                          | veces |
//   |----------------------------------------------|-------|
//   | `no contesto en 5000ms (timeout)`            |  27   |
//   | `el nombre del destino no resuelve (...)`     |   0   |
//   | `no se intento — el destino no contesto ...`  |   0   |
//
// O sea: 27 de 27 reservas pagaron el tope ENTERO, la rama que nombra el DNS nunca se
// ejecuto, y el breaker de 10 min no ahorro una sola espera (a ~1 demo/semana —el
// volumen que sostiene la decision (c)— todo prospecto real es el primero de su
// ventana, asi que la ventana no lo alcanza nunca).
//
// El comentario de `DESTINO_CAIDO_MS` ya habia medido la causa —`dns.lookup("calcom")`
// cuelga hasta `EAI_AGAIN` a los 5013 ms, con el abort ganandole por 13 ms— y concluyo
// que por eso el codigo real se lee de `cause.code`. La medicion de hoy refuta esa
// conclusion: cuando el abort gana, NO HAY `cause.code` que leer. Se sale por
// `AbortError` y el motivo dice "no contesto", que apunta a un calendario lento cuando
// lo que pasa es que el destino NO EXISTE. Son dos remedios opuestos: uno manda a subir
// el tope, el otro a mirar `CALCOM_BASE_URL`.
//
// LA SALIDA NO ES CORRER EL TOPE. Ganar la carrera por milisegundos es diagnosticar por
// sorteo. La resolucion se pregunta APARTE, con su propio tope mas corto, y ahi el
// veredicto ya no depende de quien gane.
// ---------------------------------------------------------------------------

/** Un resolvedor que cuelga: exactamente el de produccion. */
function lookupQueCuelga() {
  const fn = () => new Promise(() => {});
  fn.llamadas = [];
  return fn;
}

test("DNS QUE CUELGA: el prospecto no paga el tope entero, y el motivo NOMBRA la resolucion", async () => {
  olvidarDestinoCaido();
  // Un fetch que reservaria BIEN: si se llega a el, el defecto sigue vivo.
  const f = fetchMock([{ ok: true, status: 200, json: async () => ({ uid: "no-deberia-llegar" }) }]);

  // A PROPOSITO sin `timeoutMs`: se mide el tope QUE CORRE EN PRODUCCION, donde ningun llamador
  // pasa uno. Con un tope chico inyectado los dos relojes se colapsan en el mismo numero y el
  // caso dejaria de probar lo unico que importa — que el prospecto espera el de resolucion y no
  // el de la reserva.
  const arranque = Date.now();
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f, lookup: lookupQueCuelga() });
  const tardo = Date.now() - arranque;

  assert.equal(f.llamadas.length, 0, "si el nombre no resuelve no hay a donde hacer el POST: el fetch no se intenta");
  assert.equal(r.ok, false, "sin destino no hay reserva");
  const warning = (r.warnings || []).join(" · ");
  assert.match(
    warning,
    /CALCOM_BASE_URL/,
    `el motivo tiene que mandar a mirar la config, no la red del prospecto, y decia: ${warning}`,
  );
  // El motivo VIEJO, textual, es el que hay que no volver a escribir: culpaba al calendario de
  // no contestar cuando el nombre no existe, y con eso manda a SUBIR el tope.
  assert.ok(
    !/\(timeout\)/.test(warning),
    `el motivo viejo "no contesto en Nms (timeout)" es el diagnostico OPUESTO, y decia: ${warning}`,
  );
  assert.ok(
    tardo < Number(BOOKING_TIMEOUT_MS),
    `tardo ${tardo}ms con el tope de la reserva en ${BOOKING_TIMEOUT_MS}ms: el prospecto seguia pagando el tope entero`,
  );
  assert.ok(
    tardo >= Number(RESOLUCION_TIMEOUT_MS),
    `tardo ${tardo}ms: si corta antes de ${RESOLUCION_TIMEOUT_MS}ms no espero la resolucion, y este caso no probaria nada`,
  );
});

test("DNS QUE CUELGA: cierra el destino igual que un nombre que falla rapido", async () => {
  olvidarDestinoCaido();
  const f = fetchMock([{ ok: true, status: 200, json: async () => ({ uid: "x" }) }]);
  const lookup = lookupQueCuelga();

  await createBooking({ config: CONFIG, startAt: START }, { fetch: f, lookup, timeoutMs: 200 });
  const segunda = await createBooking({ config: CONFIG, startAt: START }, { fetch: f, lookup, timeoutMs: 200 });

  assert.equal(
    segunda.reason,
    "destino_caido",
    "un resolvedor que cuelga es un destino caido: el prospecto que sigue no vuelve a esperarlo",
  );
});

test("DNS: la resolucion tiene su PROPIO tope, y es mas corto que el de la reserva", () => {
  // Si los dos topes fueran iguales volvemos a la carrera de 13 ms que este gate vino a sacar.
  assert.ok(Number(RESOLUCION_TIMEOUT_MS) > 0, "tiene que haber un tope para resolver el nombre");
  assert.ok(
    Number(RESOLUCION_TIMEOUT_MS) < Number(BOOKING_TIMEOUT_MS),
    `el tope de resolucion (${RESOLUCION_TIMEOUT_MS}ms) tiene que ser MENOR que el de la reserva (${BOOKING_TIMEOUT_MS}ms): con topes iguales el veredicto lo decide quien gane la carrera`,
  );
});

test("DNS SANO: el nombre que resuelve sigue llegando al fetch — el dia que Cal.com exista", async () => {
  olvidarDestinoCaido();
  const f = fetchMock([{ ok: true, status: 200, json: async () => ({ uid: "reservado-de-verdad" }) }]);
  const lookup = async () => ({ address: "172.18.0.9", family: 4 });

  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f, lookup });

  assert.equal(f.llamadas.length, 1, "un nombre que resuelve NO puede quedar cortado por su propia guarda");
  assert.equal(r.ok, true);
  assert.equal(r.uid, "reservado-de-verdad");
});

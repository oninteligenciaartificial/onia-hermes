// ONIA — Chatbot propio: pruebas de PERSISTENCIA y del EJECUTOR DE TURNO.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. MODO SIN BASE (el fallback que pide el contrato): sin credenciales, sin red, con 5xx o
//      con JSON roto, ninguna funcion tira: devuelve null y apila el motivo. El bot sigue
//      hablando con el estado en memoria. Una base caida NO puede dejar mudo al bot.
//   2. DEDUP: si el inbound ya estaba, el turno corta ANTES de persistir, de mandar y de
//      tocar el lead. Un duplicado de Telegram/Meta no avanza el embudo ni escribe dos veces.
//   3. CONTRATO CON EL PANEL: pipeline_status solo puede ser uno de los 6 valores; el handoff
//      entra en review_queue con source_type 'lead'; las claves son DETERMINISTAS (reintentar
//      el mismo turno no duplica lead ni tarjeta).
//
// No hay red real en ninguna prueba: el fetch se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig } from "./config.mjs";
import { createState, toConversationRow } from "./bot-engine.mjs";
import { KIND_RESERVA_SIN_CONFIRMAR } from "./calcom-booking.mjs";
import { runTurn } from "./run-turn.mjs";
import { RUBRO_SIN_DEFINIR,
  DELIVERY_STATUSES,
  PIPELINE_STATUSES,
  buildLeadRow,
  INBOUND_BODY_PLACEHOLDER,
  buildMessageRow,
  createStore,
  leadKeyFor,
  safeChannel,
  safePipelineStatus,
  slug,
  stateFromRow,
} from "./persistence.mjs";

const CONFIG = createBotConfig({
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario

/** Store real apuntando a un fetch de mentira, para ver EXACTAMENTE que request sale. */
function recorder(responses = []) {
  const requests = [];
  let index = 0;
  const fetchImpl = async (url, init = {}) => {
    requests.push({
      url: String(url),
      method: init.method || "GET",
      prefer: (init.headers || {}).Prefer || null,
      profile: (init.headers || {})["Content-Profile"] || null,
      body: init.body ? JSON.parse(init.body) : null,
    });
    const next = responses[index++] ?? { status: 200, body: [] };
    if (next.throws) throw new Error(next.throws);
    return {
      ok: next.status < 400,
      status: next.status,
      text: async () => (typeof next.body === "string" ? next.body : JSON.stringify(next.body ?? [])),
    };
  };
  return { requests, store: createStore({ url: "https://sb.test", key: "service-role-fake", fetch: fetchImpl }) };
}

/** Store de mentira con memoria: sirve para correr una conversacion entera por runTurn(). */
function memoryStore(options = {}) {
  const calls = [];
  let saved = options.initialState || null;
  const seen = new Set();
  return {
    calls,
    get state() {
      return saved;
    },
    store: {
      enabled: true,
      warnings: [],
      async ensureConversation(seed) {
        calls.push("ensureConversation");
        // El store DE VERDAD devuelve `null` por UNA sola causa —la base no contestó— y para una
        // conversación nueva devuelve la fila que acaba de INSERTAR (persistence.mjs
        // `ensureConversation`). Este juguete devolvía `null` también para la conversación nueva,
        // que es la confusión de la que vive el bug: quien recibe ese `null` no puede distinguir
        // "todavía no existe" de "no la pude leer", y de esa distinción depende si el turno tiene
        // derecho a ESCRIBIR el estado. Acá la base contesta siempre; el caso de la base muda se
        // prueba con `recorder`, que corre el `saveConversation` de verdad y ve salir el PATCH.
        if (!saved) saved = createState(seed);
        return saved;
      },
      async claimInbound(message) {
        calls.push("claimInbound");
        if (options.duplicate) return false;
        if (options.noDedup) return null;
        if (seen.has(message.messageKey)) return false;
        seen.add(message.messageKey);
        return true;
      },
      async applySideEffects(effects, state) {
        calls.push("applySideEffects");
        const deferredTypes = ["notify_sergio", "calendar_event", "llm_request", "stage_change"];
        return {
          leadKey: (effects || []).some((effect) => effect.type === "lead_upsert")
            ? leadKeyFor(state.conversationKey)
            : state.leadKey || null,
          reviewKeys: (effects || []).filter((effect) => effect.type === "review_queue").map(() => "rev-fake"),
          auditKeys: [],
          deferred: (effects || []).filter((effect) => deferredTypes.includes(effect.type)),
          failed: [],
        };
      },
      async saveConversation(state) {
        calls.push("saveConversation");
        saved = state;
        return { conversation_key: state.conversationKey };
      },
      async insertOutbound(rows) {
        calls.push("insertOutbound");
        return rows.length;
      },
    },
  };
}

const turn = (extra = {}) => ({
  channel: "telegram",
  contact_ref: "777",
  text: "DEMO",
  message_key: "telegram:1",
  received_at: T0,
  ...extra,
});

// ---------------------------------------------------------------------------
// 1. Modo sin base: el fallback
// ---------------------------------------------------------------------------

test("sin credenciales el store queda deshabilitado y TODO devuelve null, sin tirar", async () => {
  const store = createStore({ url: "", key: "" });
  assert.equal(store.enabled, false);

  const state = createState({ channel: "sim", contactRef: "x" });
  assert.equal(await store.loadConversation("sim:x"), null);
  assert.equal(await store.ensureConversation({ conversationKey: "sim:x", channel: "sim", contactRef: "x" }), null);
  assert.equal(await store.saveConversation(state), null);
  assert.equal(await store.claimInbound({ messageKey: "k", direction: "inbound", text: "hola" }, state), null);
  assert.equal(await store.reserveFollowUp("sim:x"), null);
  assert.equal(await store.sweepFollowUpCandidates(T0), null);
  assert.equal(await store.upsertLead({ pipelineStatus: "Contactado" }, state), null);
  assert.equal(await store.enqueueReview({}, state), null);
  assert.equal(await store.writeAudit({}, state), null);

  assert.ok(store.warnings.length >= 8, "cada fallo deja rastro");
  assert.ok(store.warnings.every((warning) => warning.includes("sin credenciales")));
});

test("insertOutbound sin base: 0 mensajes es 0, y con mensajes es null (no miente)", async () => {
  const store = createStore({ url: "", key: "" });
  const state = createState({ channel: "sim", contactRef: "x" });
  assert.equal(await store.insertOutbound([], state), 0);
  assert.equal(await store.insertOutbound([{ messageKey: "a", text: "hola" }], state), null);
});

test("ante red caida, 5xx o JSON roto devuelve null y apila el motivo", async () => {
  const cases = [
    { throws: "ECONNREFUSED" },
    { status: 500, body: "boom" },
    { status: 200, body: "{no-json" },
  ];
  for (const response of cases) {
    const { store } = recorder([response]);
    const result = await store.loadConversation("telegram:777");
    assert.equal(result, null, `caso ${JSON.stringify(response)} deberia devolver null`);
    assert.equal(store.warnings.length, 1);
  }
});

test("un turno completo funciona sin base: el bot responde igual (estado en memoria)", async () => {
  const store = createStore({ url: "", key: "" });
  const result = await runTurn(turn(), { store, config: CONFIG, nowIso: T0, llm: async () => "" });

  assert.equal(result.ok, true);
  assert.equal(result.duplicate, false);
  assert.equal(result.stageBefore, "nuevo");
  assert.equal(result.stageAfter, "esperando_horario");
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].templateKey, "M0");
  assert.match(result.send[0].text, /asistente automático/);
  assert.equal(result.persisted.conversation, false, "no se guardo nada, y se dice");
  assert.equal(result.leadKey, null);
  assert.ok(result.warnings.length > 0, "el turno reporta que corrio a ciegas");
});

// El caso de arriba es el BARATO: sin credenciales, el store esta deshabilitado y la escritura
// tampoco sale, asi que nada se pisa. El caro es el de aca abajo, y es el que ocurre en
// produccion: las credenciales ESTAN, la lectura falla un segundo (timeout, 5xx, la base
// ocupada) y la escritura de despues SI sale. El turno arranca de `createState(seed)` —un
// estado INVENTADO, con todos los candados en su valor de fabrica— y `saveConversation` escribe
// el estado ENTERO: `human_took_over: false` y `opt_out_at: null` incluidos. O sea que un
// parpadeo de la base DESARMA la barrera 1 (el bot vuelve a hablar encima del humano que ya
// estaba atendiendo) y el opt-out de quien dijo BAJA, sin que nada se ponga rojo.
//
// La decision de "una base caida NO deja mudo al bot" es sobre CONTESTAR y sigue intacta.
// Contestar a ciegas es barato y se corrige solo en el turno siguiente; escribir a ciegas es
// irreversible y pisa lo que otro escribio bien.
test("la base no contesta la LECTURA pero si la escritura: el turno contesta y NO pisa el estado", async () => {
  const { store, requests } = recorder([
    { status: 500, body: "boom" }, // loadConversation: la base no contesta
    { status: 201, body: [{ message_key: "telegram:1" }] }, // claimInbound: el turno es nuestro
  ]);
  const result = await runTurn(turn(), { store, config: CONFIG, nowIso: T0, llm: async () => "" });

  assert.equal(result.send.length, 1, "el bot NO se queda mudo: esa decision no cambia");

  const pisadas = requests.filter(
    (pedido) => pedido.method === "PATCH" && pedido.url.includes("bot_conversations"),
  );
  assert.deepEqual(
    pisadas.map((pedido) => pedido.body),
    [],
    "el estado que no se pudo LEER no se escribe: pisarlo desarma el traspaso humano y el opt-out",
  );
  assert.equal(result.persisted.conversation, false, "y el turno lo dice, no lo da por guardado");
  assert.ok(
    store.warnings.some((aviso) => aviso.includes("estado NO guardado")),
    "queda el motivo en el log: si no, 'no guardo' es indistinguible de 'no hizo falta'",
  );
});

// La MISMA puerta, del otro lado. El desarme (resolver la conversación desde la bandeja) es el
// segundo —y último— llamador de `saveConversation`, y es el que MÁS barato pisa: no corre el
// motor, arma `clearHumanTakeover(state)` y guarda. Con el estado inventado eso escribe una fila
// de fábrica encima de la real. Se prueba aparte porque un arreglo hecho en un solo llamador es
// exactamente como esta clase se reabre.
test("el DESARME tampoco escribe un estado que no se pudo leer", async () => {
  const { store, requests } = recorder([{ status: 500, body: "boom" }]);
  const result = await runTurn(turn({ human_takeover_clear: true }), {
    store,
    config: CONFIG,
    nowIso: T0,
    llm: async () => "",
  });

  assert.deepEqual(result.notes, ["takeover_desarmado"], "es el camino del desarme, no otro");
  assert.deepEqual(
    requests.filter((pedido) => pedido.method === "PATCH").map((pedido) => pedido.body),
    [],
    "desarmar a ciegas escribe una fila de fábrica encima de la real",
  );
  assert.equal(result.saved, null);
});

test("sin base no hay memoria entre turnos: cada mensaje arranca en 'nuevo' (falla al guion, no a un estado inventado)", async () => {
  const store = createStore({ url: "", key: "" });
  const uno = await runTurn(turn(), { store, config: CONFIG, nowIso: T0, llm: async () => "" });
  const dos = await runTurn(turn({ text: "es mia, 2 sillones, santa cruz", message_key: "telegram:2" }), {
    store,
    config: CONFIG,
    nowIso: T0,
    llm: async () => "",
  });
  assert.equal(uno.stageAfter, "esperando_horario");
  assert.equal(dos.stageBefore, "nuevo");
  assert.ok(dos.send.length > 0, "sigue contestando: nunca queda mudo");
});

// ---------------------------------------------------------------------------
// 2. Dedup
// ---------------------------------------------------------------------------

test("si el inbound ya estaba, el turno corta: no manda, no guarda, no toca el lead", async () => {
  const fake = memoryStore({ duplicate: true });
  const result = await runTurn(turn(), { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" });

  assert.equal(result.duplicate, true);
  assert.deepEqual(result.send, []);
  assert.deepEqual(result.notes, ["mensaje_ya_procesado"]);
  assert.deepEqual(fake.calls, ["ensureConversation", "claimInbound"], "corta antes de escribir");
});

test("el mismo message_key dos veces avanza el embudo UNA sola vez", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };
  const primero = await runTurn(turn(), deps);
  const repetido = await runTurn(turn(), deps);

  assert.equal(primero.duplicate, false);
  assert.equal(repetido.duplicate, true);
  assert.equal(fake.state.botStage, "esperando_horario", "el estado no avanzo dos veces");
});

test("sin dedup disponible (base caida) el turno sigue, pero lo avisa", async () => {
  const fake = memoryStore({ noDedup: true });
  const result = await runTurn(turn(), { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" });
  assert.equal(result.duplicate, false);
  assert.equal(result.send.length, 1);
  assert.ok(fake.store.warnings.some((warning) => warning.includes("sin dedup")));
});

test("telefono y atribucion que llegan RECIEN en el 2do webhook se guardan igual", async () => {
  // La fila se crea con el primer mensaje (ensureConversation escribe una sola vez). Sin rellenar,
  // el estado cargado de la base pisaba con null lo que traia el canal despues y no se guardaba NUNCA.
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };

  await runTurn(turn(), deps);
  assert.equal(fake.state.publicContact, null);

  await runTurn(
    turn({ text: "A", message_key: "telegram:2", public_contact: "+59171654992", piece_key: "lucia-d03-reel-siat" }),
    deps,
  );
  assert.equal(fake.state.publicContact, "+59171654992");
  assert.equal(fake.state.pieceKey, "lucia-d03-reel-siat");

  // Y un turno posterior SIN atribucion no puede borrar la que ya se capturo.
  await runTurn(turn({ text: "gracias", message_key: "telegram:3" }), deps);
  assert.equal(fake.state.publicContact, "+59171654992");
  assert.equal(fake.state.pieceKey, "lucia-d03-reel-siat");
});

// ---------------------------------------------------------------------------
// 3. Conversacion entera a traves del ejecutor
// ---------------------------------------------------------------------------

test("camino feliz por runTurn: ofrece, agenda, califica, crea el lead y avisa a Sergio", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };

  const uno = await runTurn(turn(), deps);
  const dos = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);
  const tres = await runTurn(turn({ text: "tengo una ferreteria, somos 5 y estoy en Santa Cruz", message_key: "telegram:3" }), deps);

  assert.equal(uno.stageAfter, "esperando_horario");
  assert.match(uno.send[0].text, /jueves 15:00/, "la oferta va en el primer mensaje");
  assert.equal(uno.leadKey, "bot-telegram-777", "el lead nace con la oferta, con clave determinista");
  assert.equal(dos.stageAfter, "demo_agendada");
  assert.match(dos.send[0].text, /jueves 15:00/);
  assert.equal(dos.calendar.length, 1, "el evento de calendario queda para n8n");
  assert.equal(dos.notify.length, 1, "y el aviso a Sergio tambien");
  assert.equal(tres.stageAfter, "demo_agendada", "los datos llegan despues, sin mover la reserva");
  assert.deepEqual(fake.state.qualification, { industry: "comercio", teamSize: 5, city: "Santa Cruz" });
});

// El link de la reunion viaja EN M2, no el dia de la demo. Es el unico momento garantizado dentro
// de la ventana de servicio de 24 h de Meta (el prospecto acaba de escribir): a quien reserva para
// dentro de 3 dias ya no se le puede escribir, y M2 prometia justamente eso.
test("cuando Cal.com confirma la reserva, el link se manda en el MISMO mensaje que la confirma", async () => {
  const fake = memoryStore();
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const deps = {
    store: fake.store,
    config: enVivo,
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    createBooking: async () => ({ ok: true, uid: "uid-abc", reason: "reservado", warnings: [] }),
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  assert.equal(agendada.stageAfter, "demo_agendada");
  assert.match(agendada.send[0].text, /https:\/\/cal\.test\/booking\/uid-abc/, "el prospecto se va con el link");
  assert.equal(fake.state.calendarEventId, "uid-abc", "y el uid queda guardado para el recordatorio");
});

test("si la reserva NO sale, no se manda un link inventado: solo el aviso honesto", async () => {
  const fake = memoryStore();
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const deps = {
    store: fake.store,
    config: enVivo,
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    createBooking: async () => ({ ok: false, uid: null, reason: "horario_tomado", warnings: [] }),
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  assert.ok(!/cal\.test\/booking/.test(agendada.send[0].text), "sin reserva no hay link");
  assert.match(agendada.send[0].text, /se me ocupó ese horario/);
  assert.equal(fake.state.calendarEventId, null);
});

// ---------------------------------------------------------------------------
// EL AVISO DEL DESENLACE — sin esto, el unico aviso que le llega a Sergio Urcullo MIENTE
// ---------------------------------------------------------------------------
//
// QUE FIJA. Cuando la reserva falla, el turno emite un `notify_sergio` que DESDICE al
// "DEMO AGENDADA — anotala" que el motor ya emitio en el MISMO turno, y lo hace DESPUES
// (`construirAviso` pega las lineas en orden, asi que la correccion tiene que ir ultima o
// Sergio Urcullo lee la version optimista y para de leer).
//
// POR QUE EXISTE. `run-turn.mjs` decia en su comentario, al lado del codigo, que se le agrega
// al prospecto "una linea honesta y se deja el aviso". Lo primero era cierto; lo segundo no:
// lo unico que hacia era `bookingWarnings.push(...)`, y los warnings no son un efecto —
// `construirAviso` se arma de `notify`, que sale de los `deferred` del MOTOR. Nadie los leia.
// Y el test hermano de arriba se llama "solo el aviso honesto" afirmando la misma garantia que
// tampoco comprobaba: miraba el texto del prospecto y nada mas.
//
// CUAL es el caso, y cual NO. Correr sin calendario es una decision TOMADA y vigente (opcion
// (c), tablero `t_b18ca430`): ahi el fallo es el camino normal, el aviso `demo_agendada` es
// justo lo que Sergio Urcullo necesita ("anotala") y un aviso extra por cada demo seria ruido.
// El caso que SI queda descubierto es `horario_tomado` (409): ahi el bot le promete al
// prospecto que "Sergio te escribe AHORA para acomodarlo" y el unico aviso que sale le dice
// que anote un horario que esta OCUPADO — o sea lo manda a una reunion que choca. Es la
// direccion simetrica ya conocida (aviso del EVENTO sin aviso del DESENLACE) en el unico punto
// donde el desenlace CONTRADICE al evento.
test("si la reserva NO sale, el aviso a Sergio Urcullo DESDICE al 'DEMO AGENDADA' del mismo turno", async () => {
  const fake = memoryStore();
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const deps = {
    store: fake.store,
    config: enVivo,
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    createBooking: async () => ({ ok: false, uid: null, reason: "horario_tomado", warnings: [] }),
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  const kinds = agendada.notify.map((n) => n.kind);
  // Ancla del instrumento: si el motor dejara de avisar "demo_agendada", este caso no probaria
  // nada y pasaria verde por el motivo equivocado.
  assert.ok(kinds.includes("demo_agendada"), "ancla: el motor avisa que se agendo");
  assert.ok(
    kinds.includes(KIND_RESERVA_SIN_CONFIRMAR),
    "la reserva fallo y nada desdice el aviso: Sergio Urcullo queda creyendo que tiene una demo",
  );
  assert.ok(
    kinds.lastIndexOf(KIND_RESERVA_SIN_CONFIRMAR) > kinds.indexOf("demo_agendada"),
    "la correccion va DESPUES del aviso que corrige, o se lee la version optimista primero",
  );

  const correccion = agendada.notify.find((n) => n.kind === KIND_RESERVA_SIN_CONFIRMAR);
  // Nombrar el horario NO es decorativo: es lo unico que Sergio Urcullo necesita para cumplir
  // lo que el bot acaba de prometerle al prospecto ("Sergio te escribe ahora para acomodarlo").
  assert.match(correccion.text, /jueves 15:00/, "el aviso nombra el horario que hay que acomodar a mano");
  assert.equal(correccion.conversationKey, fake.state.conversationKey, "y a quien hay que escribirle");
});

// La direccion simetrica, y la que evita que la cura se vuelva ruido: el fallo ESPERADO —correr
// sin calendario, que es la opcion (c) ya decidida— NO agrega un aviso. Sin este caso, cualquiera
// "mejora" el de arriba sacandole la condicion y le mete a Sergio Urcullo una linea extra por
// cada demo, en el canal que pidio limpio.
test("el fallo ESPERADO (sin calendario, decision vigente) no le agrega ruido al aviso", async () => {
  const fake = memoryStore();
  const enVivo = createBotConfig({ slots: CONFIG.slots, dryRun: false });
  const deps = {
    store: fake.store,
    config: enVivo,
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    // `error` es la rama REAL de produccion: el fetch contra `calcom:3000`, que no resuelve.
    createBooking: async () => ({ ok: false, uid: null, reason: "error", warnings: [] }),
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  const kinds = agendada.notify.map((n) => n.kind);
  assert.ok(kinds.includes("demo_agendada"), "el aviso del motor sigue saliendo: es el que Sergio Urcullo usa");
  assert.ok(
    !kinds.includes(KIND_RESERVA_SIN_CONFIRMAR),
    "no hace falta desdecir nada: sin calendario, anotar a mano ES el flujo acordado",
  );
  // Y el prospecto sigue leyendo la salvedad honesta.
  assert.match(agendada.send[0].text, /Estoy confirmando ese horario con Sergio/);
});

// ---------------------------------------------------------------------------
// EL MODO SECO NO PUEDE PROMETER MAS QUE EL VIVO
//
// Medido el 2026-09-12: `simulate.mjs` imprimia "Listo, agendado: lunes 14, 14:00" PELADO,
// mientras los dos mensajes que el bot mando de verdad (convs 11 y 49 de Chatwoot) llevaban
// los dos "(Estoy confirmando ese horario con Sergio...)". La causa: el bloque de reserva
// entero vive detras de `if (config.dryRun)`, asi que en seco no se agregaba el cierre.
//
// Por que importa mas que un detalle de texto: el simulador es el instrumento con el que este
// carril mide "simulador 3/3" AL ARRANCAR CADA VUELTA. Un instrumento mas optimista que el
// producto es ciego justo a la regresion que mide — la misma familia del "simulador 3/3"
// que conviviro con el bot vivo cotizando Bs 750.
//
// El invariante NO es tautologico: compara DOS CAMINOS DISTINTOS del mismo codigo (el seco,
// que no hace I/O, y el vivo con `createBooking` real sin configurar) y exige que prometan lo
// mismo.
//
// CORREGIDO 2026-09-18: aca decia que ese "sin_config" era "el 100% del trafico real". Es falso
// y manda a diagnosticar al lugar equivocado. El proceso vivo SI tiene `CALCOM_BASE_URL` y
// `CALCOM_BOT_EVENT_TYPE_ID` (medido en `/proc/<pid>/environ` dentro de `onia-center`); lo que
// no existe es el contenedor `calcom`, asi que el trafico real cae en `reason: "error"` tras 5 s
// de timeout. Este caso sigue siendo valido —compara dos caminos y son distintos— pero cubre una
// rama que HOY no se ejecuta en produccion; la que si se ejecuta es la de mas abajo.
// ---------------------------------------------------------------------------

test("en seco y sin Cal.com configurado, el texto es el MISMO que recibe el prospecto (con la salvedad)", async () => {
  const sinCalcom = {}; // el env de produccion HOY: ni CALCOM_BASE_URL ni EVENT_TYPE_ID

  // Camino VIVO: `createBooking` de verdad (no un doble), que sin config contesta sin_config
  // sin tocar la red. Es lo que le llega al prospecto.
  const vivo = memoryStore();
  const depsVivo = {
    store: vivo.store,
    config: createBotConfig({ slots: CONFIG.slots, dryRun: false }),
    nowIso: T0,
    llm: async () => "",
    env: sinCalcom,
  };
  await runTurn(turn(), depsVivo);
  const agendadaVivo = await runTurn(turn({ text: "A", message_key: "telegram:2" }), depsVivo);

  // Camino SECO: el que imprime el simulador. No puede salir NADA del sistema.
  const seco = memoryStore();
  let llamoAfuera = false;
  const depsSeco = {
    store: seco.store,
    config: createBotConfig({ slots: CONFIG.slots, dryRun: true }),
    nowIso: T0,
    llm: async () => "",
    env: sinCalcom,
    createBooking: async () => {
      llamoAfuera = true;
      return { ok: false, uid: null, reason: "sin_config", warnings: [] };
    },
  };
  await runTurn(turn(), depsSeco);
  const agendadaSeco = await runTurn(turn({ text: "A", message_key: "telegram:2" }), depsSeco);

  assert.equal(llamoAfuera, false, "el modo seco sigue sin hacer I/O: se deriva, no se reserva");
  assert.equal(agendadaVivo.stageAfter, "demo_agendada");
  assert.equal(agendadaSeco.stageAfter, "demo_agendada");
  assert.match(agendadaVivo.send[0].text, /Estoy confirmando ese horario con Sergio/, "el prospecto real lee la salvedad");
  assert.equal(
    agendadaSeco.send[0].text,
    agendadaVivo.send[0].text,
    "el simulador tiene que imprimir el MISMO texto que recibe el prospecto, no uno mas optimista",
  );
});

test("en seco CON Cal.com configurado no se inventa el desenlace: se dice que el cierre depende de la reserva", async () => {
  const conCalcom = { CALCOM_BASE_URL: "https://cal.test/api", CALCOM_BOT_EVENT_TYPE_ID: "7" };
  const fake = memoryStore();
  let llamoAfuera = false;
  const deps = {
    store: fake.store,
    config: createBotConfig({ slots: CONFIG.slots, dryRun: true }),
    nowIso: T0,
    llm: async () => "",
    env: conCalcom,
    createBooking: async () => {
      llamoAfuera = true;
      return { ok: true, uid: "uid-abc", reason: "reservado", warnings: [] };
    },
  };

  await runTurn(turn(), deps);
  const agendada = await runTurn(turn({ text: "A", message_key: "telegram:2" }), deps);

  assert.equal(llamoAfuera, false, "con config o sin ella, el seco NO reserva");
  assert.ok(!/Estoy confirmando ese horario con Sergio/.test(agendada.send[0].text),
    "con Cal.com configurado la reserva PUEDE salir bien: agregar la salvedad seria el error simetrico");
  assert.ok(!/booking\//.test(agendada.send[0].text), "y tampoco se fabrica un link de una reserva que no se hizo");
  assert.ok(
    (agendada.warnings || []).some((w) => /dry run/.test(w) && /depende de la reserva/.test(w)),
    "la ignorancia se reporta como ignorancia: el seco dice que el cierre real no lo puede saber",
  );
});

test("un humano tomo la conversacion: el ejecutor no devuelve nada para enviar", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };
  await runTurn(turn(), deps);
  const tomado = await runTurn(turn({ text: "hola?", message_key: "telegram:9", human_takeover: true }), deps);

  assert.deepEqual(tomado.send, []);
  assert.equal(tomado.humanTookOver, true);
  assert.ok(tomado.notes.includes("silencio:humano_a_cargo"));
});

test("la rama LLM: si el modelo no contesta sale el texto seguro, nunca el marcador interno", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "" };
  await runTurn(turn(), deps);
  const confuso = await runTurn(turn({ text: "mmm depende", message_key: "telegram:2" }), deps);

  assert.equal(confuso.send.length, 1);
  assert.equal(confuso.send[0].templateKey, "safe_reply");
  assert.equal(confuso.send[0].replySource, "script");
  assert.ok(!confuso.send[0].text.includes("LLM_PENDIENTE"));
});

test("la rama LLM: el texto del modelo pasa por el guardrail antes de salir", async () => {
  const fake = memoryStore();
  const deps = { store: fake.store, config: CONFIG, nowIso: T0, llm: async () => "Te lo dejo en 750 Bs, garantizado." };
  await runTurn(turn(), deps);
  const confuso = await runTurn(turn({ text: "mmm depende", message_key: "telegram:2" }), deps);

  assert.equal(confuso.send[0].guardrailOk, false, "cotizar es violacion");
  assert.ok(!/750/.test(confuso.send[0].text), "la cifra no llega al prospecto");
});

// ---------------------------------------------------------------------------
// 4. Contrato con la base (requests reales contra un fetch de mentira)
// ---------------------------------------------------------------------------

test("claimInbound inserta con on_conflict=message_key e ignore-duplicates", async () => {
  const { store, requests } = recorder([{ status: 201, body: [{ id: "1" }] }]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  const claimed = await store.claimInbound(
    { messageKey: "telegram:1", direction: "inbound", author: "contact", text: "DEMO", stageBefore: "nuevo", stageAfter: "esperando_calificacion" },
    state,
    { externalMessageId: "1" },
  );

  assert.equal(claimed, true);
  assert.equal(requests[0].method, "POST");
  assert.match(requests[0].url, /bot_messages\?on_conflict=message_key$/);
  assert.equal(requests[0].prefer, "resolution=ignore-duplicates,return=representation");
  assert.equal(requests[0].profile, "onia_center");
  assert.equal(requests[0].body.direction, "inbound");
  assert.equal(requests[0].body.author, "contact");
});

test("claimInbound devuelve false cuando PostgREST no inserto nada (reentrega)", async () => {
  const { store } = recorder([{ status: 201, body: [] }]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  assert.equal(await store.claimInbound({ messageKey: "telegram:1", direction: "inbound", text: "DEMO" }, state), false);
});

test("la reserva del follow-up es un CAS: filtra por paso 0, sin humano y sin opt-out", async () => {
  const { store, requests } = recorder([{ status: 200, body: [{ conversation_key: "telegram:777" }] }]);
  const reserved = await store.reserveFollowUp("telegram:777");

  assert.equal(reserved, true);
  assert.equal(requests[0].method, "PATCH");
  assert.match(requests[0].url, /followup_step=eq\.0/);
  assert.match(requests[0].url, /human_took_over=is\.false/);
  assert.match(requests[0].url, /opt_out_at=is\.null/);
  assert.deepEqual(requests[0].body, { followup_step: 1 });
});

test("si el CAS no reserva ninguna fila, NO se manda el follow-up", async () => {
  const { store } = recorder([{ status: 200, body: [] }]);
  assert.equal(await store.reserveFollowUp("telegram:777"), false);
});

test("el barrido pide la franja accionable: de 20 h hasta los 7 dias de staleAfterDays", async () => {
  const { store, requests } = recorder([{ status: 200, body: [] }]);
  await store.sweepFollowUpCandidates("2026-07-28T14:05:00Z");

  assert.match(requests[0].url, /followup_step=eq\.0/);
  assert.match(requests[0].url, /bot_stage=in\.\(esperando_calificacion,esperando_horario\)/);
  assert.match(requests[0].url, /last_inbound_at=lte\.2026-07-27T18:05:00\.000Z/, "techo: 20 h de silencio");
  // El piso NO es la ventana de 24 h de Meta. Fuera de esa ventana el mensaje sale igual, como
  // plantilla aprobada: si el SQL las filtrara, la plantilla no le llegaria nunca a nadie.
  assert.match(requests[0].url, /last_inbound_at=gte\.2026-07-21T14:05:00\.000Z/, "piso: 7 dias");
});

test("el lead se inserta una vez y despues se PATCHea (no se duplica ni se pisan notas humanas)", async () => {
  const state = { ...createState({ channel: "telegram", contactRef: "777" }), qualification: { ownsClinic: true, chairs: 2, city: "Santa Cruz" } };

  const nuevo = recorder([{ status: 200, body: [] }, { status: 201, body: [{ lead_key: "bot-telegram-777" }] }]);
  assert.equal(await nuevo.store.upsertLead({ pipelineStatus: "Contactado" }, state), "bot-telegram-777");
  assert.equal(nuevo.requests[1].method, "POST");
  assert.equal(nuevo.requests[1].body.pipeline_status, "Contactado");
  // El rubro sale de la calificacion, ya no se asume dental para todos. Sin rubro
  // capturado va el CENTINELA (leads.business_type es NOT NULL sin default: null
  // mataba el insert ENTERO con 23502 y ningun lead llegaba al CRM — fix 16-ago).
  assert.equal(nuevo.requests[1].body.business_type, RUBRO_SIN_DEFINIR);
  assert.equal(nuevo.requests[1].body.city, "Santa Cruz");

  const viejo = recorder([{ status: 200, body: [{ lead_key: "bot-telegram-777", raw: { humano: "no tocar" } }] }, { status: 200, body: [{}] }]);
  assert.equal(await viejo.store.upsertLead({ pipelineStatus: "Reunion" }, state), "bot-telegram-777");
  assert.equal(viejo.requests[1].method, "PATCH");
  assert.equal(viejo.requests[1].body.pipeline_status, "Reunion");
  assert.equal(viejo.requests[1].body.raw.humano, "no tocar", "el raw se mergea, no se pisa");
  assert.equal(viejo.requests[1].body.private_notes, undefined, "las notas del humano ni se tocan");
});

test("el handoff entra en review_queue como 'lead', pendiente, sensible y para Sergio", async () => {
  const { store, requests } = recorder([{ status: 201, body: [{ review_key: "x" }] }]);
  const state = { ...createState({ channel: "telegram", contactRef: "777" }), leadKey: "bot-telegram-777" };
  const key = await store.enqueueReview({ sourceType: "lead", reviewerRoleKey: "sergio", sensitive: true, status: "pending", summary: "resumen" }, state, 3);

  assert.equal(key, "rev-bot-telegram-777-3", "clave determinista por turno: reintentar no duplica");
  assert.equal(requests[0].body.source_type, "lead");
  assert.equal(requests[0].body.source_key, "bot-telegram-777");
  assert.equal(requests[0].body.status, "pending");
  assert.equal(requests[0].body.sensitive, true);
  assert.equal(requests[0].body.reviewer_role_key, "sergio");
  assert.equal(requests[0].prefer, "resolution=ignore-duplicates,return=representation");
});

test("applySideEffects escribe lo de base y deja para n8n lo que necesita un servicio externo", async () => {
  const { store, requests } = recorder([
    { status: 200, body: [] },
    { status: 201, body: [{ lead_key: "bot-telegram-777" }] },
    { status: 201, body: [{ review_key: "rev" }] },
    { status: 201, body: [{ audit_key: "aud" }] },
  ]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  const applied = await store.applySideEffects(
    [
      { type: "lead_upsert", payload: { pipelineStatus: "Reunion" } },
      { type: "review_queue", payload: { summary: "x" } },
      { type: "audit_log", payload: { action: "bot_stage_change" } },
      { type: "calendar_event", payload: {} },
      { type: "notify_sergio", payload: {} },
    ],
    state,
    2,
  );

  assert.equal(applied.leadKey, "bot-telegram-777");
  assert.equal(applied.reviewKeys.length, 1);
  assert.equal(applied.auditKeys.length, 1);
  assert.deepEqual(applied.deferred.map((effect) => effect.type), ["calendar_event", "notify_sergio"]);
  assert.deepEqual(applied.failed, []);
  assert.equal(requests.length, 4);
});

test("si falla una escritura, applySideEffects la marca en `failed` y sigue con las demas", async () => {
  const { store } = recorder([{ status: 500, body: "boom" }, { status: 201, body: [{ review_key: "rev" }] }]);
  const state = createState({ channel: "telegram", contactRef: "777" });
  const applied = await store.applySideEffects(
    [{ type: "lead_upsert", payload: {} }, { type: "review_queue", payload: {} }],
    state,
    0,
  );
  assert.deepEqual(applied.failed, ["lead_upsert"]);
  assert.equal(applied.reviewKeys.length, 1);
});

// ---------------------------------------------------------------------------
// 5. Helpers de contrato
// ---------------------------------------------------------------------------

test("pipeline_status: solo los 6 valores del panel; cualquier invento cae al fallback", () => {
  assert.deepEqual(PIPELINE_STATUSES, ["Nuevo", "Contactado", "Reunion", "Propuesta", "Ganado", "Perdido"]);
  for (const status of PIPELINE_STATUSES) assert.equal(safePipelineStatus(status), status);
  assert.equal(safePipelineStatus("Reunión"), "Nuevo", "con tilde NO existe en el panel");
  assert.equal(safePipelineStatus("demo_agendada"), "Nuevo");
  assert.equal(safePipelineStatus(undefined, "Contactado"), "Contactado");
});

test("al agendar la demo el lead queda en 'Reunion' (valor exacto del CHECK del panel)", () => {
  const state = { ...createState({ channel: "telegram", contactRef: "777" }), scheduledAt: "2026-07-30T19:00:00Z" };
  const row = buildLeadRow({ pipelineStatus: "Reunion" }, state);
  assert.equal(row.pipeline_status, "Reunion");
  assert.equal(row.priority, "alta");
  assert.equal(row.next_followup_at, "2026-07-30T19:00:00Z");
});

test("el lead nunca inventa el nombre NI el rubro del negocio", () => {
  const anonimo = buildLeadRow({}, createState({ channel: "telegram", contactRef: "777" }));
  assert.match(anonimo.company_name, /sin nombre/);
  // "No inventar" hoy significa: el CENTINELA honesto, jamas un rubro real
  // ("comercio", "dental"...). El null literal murio con el NOT NULL de la tabla.
  assert.equal(anonimo.business_type, RUBRO_SIN_DEFINIR, "sin rubro capturado va el centinela, nunca un rubro real");

  // El bot atiende cualquier rubro: llamar "Clinica de X" a una ferreteria metia un dato falso
  // en el CRM. Ahora el nombre lleva el rubro real cuando esta, y nada cuando no.
  const base = createState({ channel: "telegram", contactRef: "777" });
  const soloCiudad = buildLeadRow({}, { ...base, displayName: "Ana", qualification: { city: "Tarija" } });
  assert.equal(soloCiudad.company_name, "Ana (Tarija)");
  assert.ok(!/Clínica/.test(soloCiudad.company_name), "no se asume clinica");

  const conRubro = buildLeadRow({}, { ...base, displayName: "Ana", qualification: { city: "Tarija", industry: "ferreteria" } });
  assert.equal(conRubro.company_name, "Ana — ferreteria (Tarija)");
  assert.equal(conRubro.business_type, "ferreteria");
});

test("el CRM guarda el TELEFONO como contacto publico, no el id de conversacion", () => {
  // El sintoma: en el panel el contacto decia "2847" (el id de la conversacion de Chatwoot) y
  // desde ahi no se podia llamar a nadie.
  const base = createState({ channel: "chatwoot", contactRef: "2847" });
  assert.equal(buildLeadRow({}, base).public_contact, "2847", "sin telefono queda como hoy: no se pierde la referencia");
  assert.equal(buildLeadRow({}, { ...base, publicContact: "+59171654992" }).public_contact, "+59171654992");
});

test("el telefono sobrevive el viaje a la base (va en raw, sin columna nueva en produccion)", () => {
  const state = { ...createState({ channel: "chatwoot", contactRef: "2847" }), publicContact: "+59171654992" };
  const round = stateFromRow({
    conversation_key: state.conversationKey,
    channel: "chatwoot",
    contact_ref: "2847",
    bot_stage: "nuevo",
    raw: { publicContact: state.publicContact },
  });
  assert.equal(round.publicContact, "+59171654992");
  assert.equal(round.contactRef, "2847", "contact_ref sigue intacto: es la identidad de la conversacion");
  assert.equal(stateFromRow({ conversation_key: "chatwoot:1", channel: "chatwoot", contact_ref: "1" }).publicContact, null);
});

test("un lead que YA existe recibe el telefono, pero nunca se lo pisa con el id de conversacion", async () => {
  const conTelefono = recorder([
    { status: 200, body: [{ lead_key: "bot-chatwoot-2847", raw: {} }] }, // upsertLead.load
    { status: 200, body: [{ lead_key: "bot-chatwoot-2847" }] }, //          upsertLead.patch
  ]);
  const state = { ...createState({ channel: "chatwoot", contactRef: "2847" }), publicContact: "+59171654992" };
  await conTelefono.store.upsertLead({}, state);
  assert.equal(conTelefono.requests[1].body.public_contact, "+59171654992");

  const sinTelefono = recorder([
    { status: 200, body: [{ lead_key: "bot-chatwoot-2847", raw: {} }] },
    { status: 200, body: [{ lead_key: "bot-chatwoot-2847" }] },
  ]);
  await sinTelefono.store.upsertLead({}, createState({ channel: "chatwoot", contactRef: "2847" }));
  assert.equal(
    "public_contact" in sinTelefono.requests[1].body,
    false,
    "sin telefono el PATCH ni menciona el campo: un contacto corregido a mano no se pisa",
  );
});

test("el permiso de contacto sigue al opt-in / opt-out, no al humor del bot", () => {
  const base = createState({ channel: "telegram", contactRef: "777" });
  assert.equal(buildLeadRow({}, base).contact_permission, "pending");
  assert.equal(buildLeadRow({}, { ...base, optInAt: T0 }).contact_permission, "approved");
  assert.equal(buildLeadRow({}, { ...base, optInAt: T0, optOutAt: T0 }).contact_permission, "no_contact");
});

test("buildMessageRow sanea lo que va a la base (body nunca vacio, enums validados)", () => {
  const state = createState({ channel: "telegram", contactRef: "777" });
  const row = buildMessageRow(
    { messageKey: "out:1", direction: "raro", author: "marciano", text: "   ", replySource: "inventado", deliveryStatus: "explotado", guardrail: { ok: false, violations: ["cotizar"] } },
    state,
  );
  assert.equal(row.direction, "outbound");
  assert.equal(row.author, "bot");
  assert.equal(row.body, "(sin texto)");
  assert.equal(row.reply_source, "script");
  assert.equal(row.delivery_status, "simulated");
  assert.equal(row.guardrail_ok, false);
  assert.deepEqual(row.guardrail_violations, ["cotizar"]);
});

test("un envio REAL no se degrada a 'simulated': los estados validos se guardan tal cual", () => {
  const state = createState({ channel: "chatwoot", contactRef: "42" });
  // El bug del recordatorio fue exactamente este ternario: `reserved` no estaba en la lista y el
  // valor desconocido se convertia EN SILENCIO en "simulated". Un mensaje pago que la base decia
  // que nunca ocurrio. Se prueba TODA la lista, no solo el que fallo.
  for (const estado of DELIVERY_STATUSES) {
    const guardada = buildMessageRow({ messageKey: `out:${estado}`, text: "hola", deliveryStatus: estado }, state);
    assert.equal(guardada.delivery_status, estado, `'${estado}' es valido y no puede terminar como otra cosa`);
  }
  // Y la lista tiene que ser LA MISMA que el CHECK de la tabla (migracion
  // 20260813_bot_messages_delivery_status_reserved.sql): si divergen, o se pierde la fila entera
  // (la base rechaza) o se guarda una mentira (el codigo degrada).
  assert.deepEqual([...DELIVERY_STATUSES], ["simulated", "skipped", "sent", "failed", "reserved"]);
});

test("markMessageDelivered: PATCH por message_key, sin tocar la clave ni agregar historia", async () => {
  const { requests, store } = recorder([{ status: 200, body: [{ message_key: "recordatorio:chatwoot:42:X" }] }]);
  assert.equal(await store.markMessageDelivered("recordatorio:chatwoot:42:X", "sent", "meta-99"), true);

  const patch = requests[0];
  assert.equal(patch.method, "PATCH");
  assert.match(patch.url, /bot_messages\?message_key=eq\./, "una sola fila, la de esa clave");
  assert.deepEqual(patch.body, { delivery_status: "sent", external_message_id: "meta-99" });
  assert.ok(!("message_key" in patch.body), "APPEND-ONLY: la clave unica anti-duplicados NO se toca");
  assert.ok(!("body" in patch.body), "tampoco se reescribe el texto: es el mismo hecho, no uno nuevo");
});

test("markMessageDelivered nunca tira: sin clave, con estado invalido, sin base o con la base caida", async () => {
  const { requests, store } = recorder([{ status: 500, body: "boom" }]);
  assert.equal(await store.markMessageDelivered("", "sent"), null, "sin clave no se actualiza nada");
  // Un estado que el CHECK rechaza haria fallar el PATCH entero: se corta ANTES de salir a la red.
  assert.equal(await store.markMessageDelivered("k", "explotado"), null);
  assert.equal(requests.length, 0, "ninguno de los dos llego a la base");

  assert.equal(await store.markMessageDelivered("k", "failed"), null, "base caida: null, no excepcion");
  assert.ok(store.warnings.length >= 3, "cada fallo deja rastro para el barrido");

  const sinBase = createStore({ url: "", key: "" });
  assert.equal(await sinBase.markMessageDelivered("k", "sent"), null);
});

test("markMessageDelivered devuelve false si no hay fila con esa clave (no inventa una)", async () => {
  const { store } = recorder([{ status: 200, body: [] }]);
  assert.equal(await store.markMessageDelivered("recordatorio:no-existe", "failed"), false);
});

// ---------------------------------------------------------------------------
// MINIMIZACION DE DATOS: no se guarda lo que no decide nada
// ---------------------------------------------------------------------------

test("el texto de lo que escribe el prospecto NO se persiste", () => {
  const state = createState({ channel: "chatwoot", contactRef: "42" });
  const row = buildMessageRow(
    { messageKey: "chatwoot:42:9", direction: "inbound", author: "contact", text: "hola, estoy enferma y no puedo ir" },
    state,
  );
  assert.equal(row.body, INBOUND_BODY_PLACEHOLDER);
  assert.ok(!row.body.includes("enferma"), "un dato de salud no puede quedar guardado: no decide nada");
  assert.equal(row.direction, "inbound");
  assert.equal(row.message_key, "chatwoot:42:9", "la FILA se sigue escribiendo: es el candado anti-duplicados");
});

test("lo que dice el BOT si se guarda entero (es nuestro guion, no un dato del prospecto)", () => {
  const state = createState({ channel: "chatwoot", contactRef: "42" });
  const row = buildMessageRow(
    { messageKey: "out:chatwoot:42:1", direction: "outbound", author: "bot", text: "¡Hola! Te escribe el asistente de Onia." },
    state,
  );
  assert.match(row.body, /asistente de Onia/, "sin esto no se puede auditar que dijo el bot");
});

test("claves deterministas: el mismo prospecto no genera dos leads", () => {
  assert.equal(leadKeyFor("telegram:777"), leadKeyFor("telegram:777"));
  assert.equal(leadKeyFor("telegram:777"), "bot-telegram-777");
  assert.equal(slug("WhatsApp:591 78491375"), "whatsapp-591-78491375");
  assert.equal(slug(""), "sin-clave");
});

test("safeChannel respeta el CHECK de la tabla", () => {
  for (const channel of ["sim", "telegram", "whatsapp", "instagram", "chatwoot"]) assert.equal(safeChannel(channel), channel);
  assert.equal(safeChannel("tiktok"), "sim");
});

test("stateFromRow reconstruye el estado del motor, contadores incluidos", () => {
  const state = stateFromRow({
    conversation_key: "telegram:777",
    channel: "telegram",
    contact_ref: "777",
    bot_stage: "esperando_horario",
    qualification: { ownsClinic: true, chairs: 2, city: "Santa Cruz" },
    slots_offered: [{ key: "A", label: "jueves 15:00" }],
    human_took_over: false,
    followup_step: 0,
    off_script_count: 1,
    raw: { qualifyAsks: 2, outboundSeq: 5, scheduledLabel: "jueves 15:00" },
  });
  assert.equal(state.botStage, "esperando_horario");
  assert.equal(state.qualifyAsks, 2);
  assert.equal(state.outboundSeq, 5);
  assert.equal(state.scheduledLabel, "jueves 15:00");
  assert.equal(stateFromRow(null), null);
});

test("un bot_stage desconocido en la base no rompe: cae a 'nuevo'", () => {
  const state = stateFromRow({ conversation_key: "sim:x", channel: "sim", contact_ref: "x", bot_stage: "inventado" });
  assert.equal(state.botStage, "nuevo");
});

test("TODO campo que el motor guarda en raw sobrevive el viaje completo (la clase del acuse triple)", async () => {
  // 2026-09-10, conv 11: el acuse del handoff salio TRES veces porque
  // `handoffAckAt` vivia en toConversationRow (el motor) pero NO en el raw que
  // escribe saveConversation — la base nunca lo recibia y cada turno lo cargaba
  // en null. `branchAsked` tenia el agujero doble (tampoco en stateFromRow).
  // Este test fija la CLASE: la lista canonica es la de toConversationRow(state).raw,
  // y cada clave tiene que (1) salir en el PATCH real de saveConversation y
  // (2) volver intacta por stateFromRow. Un campo nuevo que falte en una de las
  // tres listas se pone rojo solo.
  const state = {
    ...createState({ channel: "chatwoot", contactRef: "11" }),
    botStage: "handoff_humano",
    qualifyAsks: 2,
    outboundSeq: 7,
    scheduledLabel: "jueves 15:00",
    publicContact: "+59175414930",
    inboxId: "5",
    handoffAckAt: "2026-09-10T20:16:49.000Z",
    branchAsked: true,
  };
  const canon = toConversationRow(state).raw;

  const { requests, store } = recorder([{ status: 200, body: [{ conversation_key: state.conversationKey }] }]);
  await store.saveConversation(state);
  const patch = requests[0].body;

  for (const [campo, valor] of Object.entries(canon)) {
    assert.ok(campo in patch.raw, `saveConversation NO escribe raw.${campo}: se pierde en silencio (la clase de handoffAckAt)`);
    assert.deepEqual(patch.raw[campo], valor, `raw.${campo} viaja distinto de lo que el motor guardo`);
  }

  const vuelto = stateFromRow({
    conversation_key: state.conversationKey,
    channel: state.channel,
    contact_ref: state.contactRef,
    bot_stage: state.botStage,
    raw: patch.raw,
  });
  for (const campo of Object.keys(canon)) {
    assert.deepEqual(vuelto[campo], state[campo], `stateFromRow NO restaura ${campo} (la mitad de branchAsked)`);
  }
});

// ---------------------------------------------------------------------------
// La CARRERA de dos escritores sobre la misma fila (conv 58, 2026-09-18)
// ---------------------------------------------------------------------------

test("saveConversation NO baja un candado que este turno no decidio bajar", async () => {
  // `saveConversation` hace un PATCH con la fila ENTERA a partir de un estado que se
  // leyo SEGUNDOS antes — en el medio corre step(), que llama al LLM. Cualquier
  // escritor que haya subido un candado mientras tanto queda pisado: es un
  // lost-update de manual, y el candado que se pierde es el que CALLA al bot.
  //
  // Medido el 2026-09-18 en produccion (conv 58): el traspaso humano quedo
  // registrado en `bot_messages` (author human) y `bot_conversations.human_took_over`
  // en `f`. De las 15 conversaciones con un mensaje de humano, TRES tenian el
  // candado caido (chatwoot:11, chatwoot:39, chatwoot:58).
  //
  // La regla: una columna-candado viaja en el PATCH SOLO si este turno la cambio
  // respecto de lo que leyo. Si el turno no la toco, se omite — y entonces lo que
  // otro escribio bien sobrevive. Falla hacia el SILENCIO, igual que la barrera 1.
  const leido = {
    ...createState({ channel: "chatwoot", contactRef: "58" }),
    botStage: "esperando_horario",
    humanTookOver: false,
    optOutAt: null,
    followupStep: 0,
  };
  // El turno del prospecto no toca ningun candado: solo avanza la etapa.
  const nextState = { ...leido, botStage: "demo_agendada" };

  const { requests, store } = recorder([{ status: 200, body: [{ conversation_key: leido.conversationKey }] }]);
  await store.saveConversation(nextState, {}, leido);
  const patch = requests[0].body;

  for (const columna of ["human_took_over", "human_took_over_at", "opt_out_at", "followup_step"]) {
    assert.ok(
      !(columna in patch),
      `saveConversation manda ${columna} sin que el turno la haya cambiado: pisa al escritor concurrente`,
    );
  }
  // Lo que el turno SI cambio tiene que viajar, o no se guardo nada.
  assert.equal(patch.bot_stage, "demo_agendada");
});

test("el turno que SI decide sobre un candado lo escribe (takeover, desarme y reinicio)", async () => {
  // La direccion simetrica: omitir de mas dejaria el candado sin poder subir NUNCA,
  // que es peor que el bug. Los tres caminos que deciden de verdad tienen que escribir.
  const base = { ...createState({ channel: "chatwoot", contactRef: "58" }), botStage: "esperando_horario" };

  // 1. El humano toma la conversacion: false -> true.
  const leidoA = { ...base, humanTookOver: false, humanTookOverAt: null };
  const tomada = { ...base, humanTookOver: true, humanTookOverAt: "2026-09-18T19:17:03.000Z" };
  const a = recorder([{ status: 200, body: [{}] }]);
  await a.store.saveConversation(tomada, {}, leidoA);
  assert.equal(a.requests[0].body.human_took_over, true, "el traspaso humano TIENE que escribir el candado");
  assert.equal(a.requests[0].body.human_took_over_at, "2026-09-18T19:17:03.000Z");

  // 2. El desarme (conversacion resuelta desde la bandeja): true -> false.
  const leidoB = { ...base, humanTookOver: true, humanTookOverAt: "2026-09-18T19:17:03.000Z" };
  const limpia = { ...base, humanTookOver: false, humanTookOverAt: null };
  const b = recorder([{ status: 200, body: [{}] }]);
  await b.store.saveConversation(limpia, {}, leidoB);
  assert.equal(b.requests[0].body.human_took_over, false, "el desarme TIENE que poder bajar el candado");
  assert.equal(b.requests[0].body.human_took_over_at, null);

  // 3. El opt-out y el reinicio del contador del embudo.
  const leidoC = { ...base, optOutAt: null, followupStep: 2 };
  const dioBaja = { ...base, optOutAt: "2026-09-18T20:00:00.000Z", followupStep: 0 };
  const c = recorder([{ status: 200, body: [{}] }]);
  await c.store.saveConversation(dioBaja, {}, leidoC);
  assert.equal(c.requests[0].body.opt_out_at, "2026-09-18T20:00:00.000Z", "el BAJA TIENE que escribirse");
  assert.equal(c.requests[0].body.followup_step, 0, "el reinicio del embudo TIENE que escribirse");
});

test("sin estado leido, saveConversation escribe la fila entera (no hay con que comparar)", async () => {
  // Un llamador que no puede decir que leyo no puede reclamar que "no cambio nada":
  // ahi el comportamiento seguro es el viejo, escribir todo. La baranda contra el
  // llamador distraido es el gate de abajo, que camina el disco.
  const state = { ...createState({ channel: "chatwoot", contactRef: "58" }), humanTookOver: true };
  const { requests, store } = recorder([{ status: 200, body: [{}] }]);
  await store.saveConversation(state);
  assert.equal(requests[0].body.human_took_over, true);
  assert.ok("opt_out_at" in requests[0].body);
});

test("un turno REAL le pasa a saveConversation el estado leido (la baranda de la carrera)", async () => {
  // El gate que miraba el DISCO buscando `.saveConversation(` con tres argumentos daba
  // FALSO VERDE, y lo delato la mutacion: la llamada de produccion vive dentro de
  // `guardarEstado`, que absorbe el argumento en su propio parametro — sacarselo al
  // llamador de arriba no cambia una letra de esa linea. Lo unico que distingue es correr
  // el turno y mirar QUE LE LLEGO al store.
  const recibidos = [];
  const leidoEnLaBase = {
    ...createState({ channel: "chatwoot", contactRef: "58" }),
    botStage: "esperando_horario",
    humanTookOver: false,
  };
  const store = {
    enabled: true,
    warnings: [],
    async ensureConversation() { return { ...leidoEnLaBase }; },
    async claimInbound() { return true; },
    async applySideEffects() { return { leadKey: null, reviewKeys: [], auditKeys: [], deferred: [], failed: [] }; },
    async saveConversation(state, previousRaw, leido) { recibidos.push({ state, leido }); return {}; },
    async insertOutbound(rows) { return rows.length; },
  };

  await runTurn(turn({ channel: "chatwoot", contact_ref: "58", text: "A", message_key: "chatwoot:1" }), {
    store, config: CONFIG, nowIso: T0, llm: async () => "ok",
  });

  assert.equal(recibidos.length, 1, "el turno tiene que haber guardado una vez");
  assert.ok(
    recibidos[0].leido && typeof recibidos[0].leido === "object",
    "saveConversation NO recibio el estado LEIDO: escribe la fila entera y pisa los candados del escritor concurrente",
  );
  assert.equal(recibidos[0].leido.humanTookOver, false, "el estado leido tiene que ser el de la BASE, no el del turno");
});

#!/usr/bin/env node
// EL BOT NUNCA CONFIRMA UNA DEMO QUE NO SE AGENDO. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/agendado-solo-si-se-agendo.test.mjs
//
// ORIGEN (auditoría de producción del 2-oct, §2 acción 3 y §5 «WhatsApp de ventas»). El bot de
// ventas le contestaba al prospecto que elegía un horario:
//
//     Listo, agendado: **jueves 2 de octubre, 14:00**.
//     ...
//     _(Estoy confirmando ese horario con Sergio; si hubiera un cruce te aviso enseguida.)_
//
// Confirmaba y en la línea siguiente se desdecía. El camino exacto, leído en el código:
//   1. `config.mjs` M2 empieza con «Listo, agendado» y el motor (puro) lo redacta ANTES de saber si
//      la reserva sale.
//   2. `run-turn.mjs` 6.5 llama a `createBooking` contra `CALCOM_BASE_URL=http://calcom:3000`, un
//      contenedor que no existe en el VPS: sale por `reason: "error"` (o `destino_caido`).
//   3. Como el «Listo, agendado» ya estaba escrito, lo único que hacía era PEGARLE
//      `cierreDeReservaFallida` al final.
// Y el agendador ni siquiera hacía falta para llegar ahí: los horarios los pone un cron
// (`slots-rodantes.mjs`) desde las ventanas de atención, no un calendario. El bot ofrecía «agendo
// yo» sin tener con qué agendar.
//
// LO QUE FIJA ESTE ARCHIVO:
//   - Sin agendador (`ONIA_BOT_AGENDA` sin `calcom`, el default): el bot NO ofrece horarios propios
//     ni confirma; deriva a la persona (o manda el link de la agenda real si el conocimiento la trae).
//   - Con agendador, si la reserva no sale, el prospecto NO lee «Listo, agendado»: lee la versión
//     honesta, y la conversación pasa a la persona (que es quien se lo va a confirmar).
//   - Una elección sobre una foto VIEJA de horarios (conversación que nació antes del cambio) tampoco
//     se confirma.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { agendaDelEntorno, KIND_RESERVA_SIN_CONFIRMAR } from "./calcom-booking.mjs";
import { createBotConfig, slotsPending } from "./config.mjs";
import { configComoProduccion } from "./config-como-produccion.mjs";
import { buildConfig as buildConfigDelSeguimiento } from "./followup-run.mjs";
import { leadKeyFor } from "./persistence.mjs";
import { buildConfig, runTurn } from "./run-turn.mjs";

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro del horario de atención
const SLOTS = [
  { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
  { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
];
// El formato con el que el cron los deja en webhook.env.
const SPEC = "jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00@2026-07-31T14:00:00Z";
// Lo que el proceso vivo declara hoy (medido el 2026-09-18 en /proc/<pid>/environ de onia-center):
// Cal.com configurado, pero el contenedor `calcom` no existe.
const ENV_DE_PRODUCCION = {
  ONIA_BOT_SLOTS: SPEC,
  CALCOM_BASE_URL: "http://calcom:3000",
  CALCOM_BOT_EVENT_TYPE_ID: "5",
  ONIA_BOT_DRY_RUN: "false",
};

/** Store con memoria, el mismo molde que persistence.test.mjs. `inicial`: una conversación ya guardada. */
function memoryStore(inicial = null) {
  let saved = inicial;
  const seen = new Set();
  return {
    get state() {
      return saved;
    },
    store: {
      enabled: true,
      warnings: [],
      async ensureConversation(seed) {
        if (!saved) saved = createState(seed);
        return saved;
      },
      async claimInbound(message) {
        if (seen.has(message.messageKey)) return false;
        seen.add(message.messageKey);
        return true;
      },
      async applySideEffects(effects, state) {
        const diferidos = ["notify_sergio", "calendar_event", "llm_request", "stage_change"];
        return {
          leadKey: (effects || []).some((e) => e.type === "lead_upsert") ? leadKeyFor(state.conversationKey) : state.leadKey || null,
          reviewKeys: [],
          auditKeys: [],
          deferred: (effects || []).filter((e) => diferidos.includes(e.type)),
          failed: [],
        };
      },
      async saveConversation(state) {
        saved = state;
        return { conversation_key: state.conversationKey };
      },
      async insertOutbound(rows) {
        return rows.length;
      },
    },
  };
}

const turno = (extra = {}) => ({
  channel: "chatwoot",
  contact_ref: "591700000",
  channel_type: "Channel::Whatsapp",
  text: "DEMO",
  message_key: "chatwoot:1",
  received_at: T0,
  ...extra,
});

/** Corre `fn` con estas variables en process.env y las deja como estaban. */
async function conEntorno(vars, fn) {
  const antes = {};
  for (const clave of Object.keys(vars)) {
    antes[clave] = process.env[clave];
    if (vars[clave] === undefined) delete process.env[clave];
    else process.env[clave] = vars[clave];
  }
  try {
    return await fn();
  } finally {
    for (const [clave, valor] of Object.entries(antes)) {
      if (valor === undefined) delete process.env[clave];
      else process.env[clave] = valor;
    }
  }
}

// ---------------------------------------------------------------------------
// 1. Con agendador: si la reserva no sale, NO hay «Listo, agendado»
// ---------------------------------------------------------------------------

async function elegirConReserva(resultado) {
  const fake = memoryStore();
  const deps = {
    store: fake.store,
    config: createBotConfig({ slots: SLOTS, dryRun: false }),
    nowIso: T0,
    llm: async () => "",
    env: { CALCOM_PUBLIC_URL: "https://cal.test" },
    createBooking: async () => resultado,
  };
  await runTurn(turno(), deps);
  const agendada = await runTurn(turno({ text: "A", message_key: "chatwoot:2" }), deps);
  return { fake, agendada, deps };
}

test("REPRODUCE EL BUG: la reserva no salió (Cal.com no existe) y el prospecto NO lee «Listo, agendado»", async () => {
  const { fake, agendada } = await elegirConReserva({ ok: false, uid: null, reason: "error", warnings: [] });
  const texto = agendada.send.map((r) => r.text).join("\n");

  assert.doesNotMatch(texto, /Listo, agendado/, "le confirma una demo que no está en ningún calendario");
  assert.doesNotMatch(texto, /nos vemos/i, "«nos vemos el jueves» también es confirmarla");
  assert.match(texto, /jueves 15:00/, "se le repite lo que eligió: no se pierde el dato");
  assert.match(texto, /todavía no quedó reservad/i, "se le dice la verdad: no está reservada");
  assert.match(texto, /se lo confirma/, "y quién se la confirma");
  assert.equal(fake.state.calendarEventId, null);
  // La conversación pasa a la persona: si quedara en `demo_agendada`, el acuse siguiente (M2b) le
  // diría «Nos vemos jueves 15:00» y el recordatorio M9 le recordaría una demo que no existe.
  assert.equal(fake.state.botStage, "handoff_humano");
});

test("y Sergio Urcullo recibe el aviso que DESDICE al «DEMO AGENDADA» del mismo turno, con el horario", async () => {
  const { agendada } = await elegirConReserva({ ok: false, uid: null, reason: "error", warnings: [] });
  const kinds = agendada.notify.map((n) => n.kind);
  assert.ok(kinds.includes(KIND_RESERVA_SIN_CONFIRMAR), "sin esto Sergio Urcullo anota una demo que el bot no reservó");
  const desdice = agendada.notify.find((n) => n.kind === KIND_RESERVA_SIN_CONFIRMAR);
  assert.match(desdice.text, /jueves 15:00/);
});

test("horario tomado (409): tampoco «Listo, agendado» — se le dice que se ocupó", async () => {
  const { agendada } = await elegirConReserva({ ok: false, uid: null, reason: "horario_tomado", warnings: [] });
  const texto = agendada.send.map((r) => r.text).join("\n");
  assert.doesNotMatch(texto, /Listo, agendado/);
  assert.match(texto, /se acaba de ocupar/);
});

// AUDITORÍA DEL 3-OCT. M2_SIN_RESERVA y M2_HORARIO_TOMADO terminaban en «Mientras, contame rápido:
// 1️⃣ rubro 2️⃣ personas 3️⃣ ciudad 4️⃣ dolor». La conversación ya está en `handoff_humano`, que no lee
// datos: el prospecto contestaba y recibía M5_ACUSE («no te lo contesto yo para no inventarte nada»),
// con la calificación tirada y sin lead_upsert. No se le pide lo que el bot no va a leer.
for (const reason of ["error", "horario_tomado"]) {
  test(`reserva que no salió (${reason}): el texto honesto no pide datos que el bot después no lee`, async () => {
    const { fake, agendada } = await elegirConReserva({ ok: false, uid: null, reason, warnings: [] });
    const texto = agendada.send.map((r) => r.text).join("\n");
    assert.equal(fake.state.botStage, "handoff_humano", "ancla: la conversación pasó a la persona");
    assert.doesNotMatch(texto, /contame rápido|cuénteme rápido|1️⃣|¿A qué se dedica|¿Cuántas personas|¿En qué ciudad/i);
    assert.match(texto, /se lo confirma|le escribe/, "lo que sí se le dice: quién sigue");
  });
}

test("con la reserva HECHA sí se confirma, y con el link (el camino feliz no se rompe)", async () => {
  const { fake, agendada } = await elegirConReserva({ ok: true, uid: "uid-abc", reason: "reservado", warnings: [] });
  assert.match(agendada.send[0].text, /Listo, agendado: \*\*jueves 15:00\*\*/);
  assert.match(agendada.send[0].text, /https:\/\/cal\.test\/booking\/uid-abc/);
  assert.equal(fake.state.botStage, "demo_agendada");
});

// ---------------------------------------------------------------------------
// 2. El interruptor: sin `ONIA_BOT_AGENDA=calcom` el bot no ofrece «agendo yo»
// ---------------------------------------------------------------------------

test("agendaDelEntorno: el default es la PERSONA; `calcom` solo vale con Cal.com configurado", () => {
  assert.equal(agendaDelEntorno({}).modo, "persona", "sin variable: el default seguro");
  assert.equal(agendaDelEntorno({ ONIA_BOT_SLOTS: SPEC, CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" }).modo, "persona",
    "tener Cal.com declarado NO enciende la agenda: es exactamente el estado de producción que mentía");
  assert.equal(agendaDelEntorno({ ONIA_BOT_AGENDA: "calcom" }).modo, "persona", "encendida sin destino: no hay con qué agendar");
  assert.equal(agendaDelEntorno({ ONIA_BOT_AGENDA: "sí" }).modo, "persona", "un valor que no conocemos no enciende nada");
  assert.equal(
    agendaDelEntorno({ ONIA_BOT_AGENDA: "calcom", CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" }).modo,
    "propia",
  );
});

test("con el entorno de PRODUCCIÓN de hoy, la config del turno no trae horarios para ofrecer", async () => {
  await conEntorno({ ...ENV_DE_PRODUCCION, ONIA_BOT_AGENDA: undefined }, async () => {
    const config = buildConfig({ received_at: T0 });
    assert.equal(config.agenda?.modo, "persona");
    assert.ok(slotsPending(config), "los horarios del cron no se ofrecen si nadie los puede agendar");
  });
});

test("con el entorno de PRODUCCIÓN de hoy: no ofrece horarios, no dice «Listo, agendado» y no intenta reservar", async () => {
  await conEntorno({ ...ENV_DE_PRODUCCION, ONIA_BOT_AGENDA: undefined }, async () => {
    const fake = memoryStore();
    let intentoReservar = false;
    const deps = {
      store: fake.store,
      nowIso: T0,
      llm: async () => "",
      createBooking: async () => {
        intentoReservar = true;
        return { ok: false, uid: null, reason: "error", warnings: [] };
      },
      getAvailableSlots: async () => {
        throw new Error("sin agenda propia no se le pregunta disponibilidad a Cal.com");
      },
    };

    const bienvenida = await runTurn(turno(), deps);
    const primero = bienvenida.send.map((r) => r.text).join("\n");
    assert.doesNotMatch(primero, /\*\*A\)\*\*/, "ofrece horarios que nadie puede agendar");
    assert.doesNotMatch(primero, /no tengo horarios libres/i, "y no exhibe una carencia en la primera frase");
    assert.match(primero, /un bot/, "D2: lo primero que lee es que habla con un bot");
    assert.match(primero, /Sergio/, "le dice quién le coordina la demo");
    assert.match(primero, /desde este mismo número/, "y por dónde (WhatsApp: el mismo número)");
    assert.ok(bienvenida.notify.length > 0, "«te escribe Sergio» es una promesa: a Sergio Urcullo le tiene que llegar el aviso");

    const segundo = await runTurn(turno({ text: "A", message_key: "chatwoot:2" }), deps);
    assert.doesNotMatch(segundo.send.map((r) => r.text).join("\n"), /Listo, agendado/);
    assert.equal(intentoReservar, false, "sin agenda propia no hay reserva que intentar");
    assert.notEqual(fake.state.botStage, "demo_agendada");
  });
});

test("el SEGUIMIENTO (M3) tampoco ofrece horarios sin agenda propia: «la dejamos agendada» sería la misma promesa", async () => {
  await conEntorno({ ...ENV_DE_PRODUCCION, ONIA_BOT_AGENDA: undefined }, async () => {
    const config = buildConfigDelSeguimiento({});
    assert.equal(config.agenda?.modo, "persona");
    assert.ok(slotsPending(config), "con horarios pendientes el barrido bloquea M3 antes de reservar nada");
  });
});

// ---------------------------------------------------------------------------
// 3. El motor en modo persona
// ---------------------------------------------------------------------------

const PERSONA = createBotConfig({ agenda: { modo: "persona" } });

test("persona: una conversación que nació CON horarios y elige «A» no recibe confirmación — se deriva con el horario", () => {
  // La foto la guardó el bot de antes del cambio: la conversación sigue viva en la base.
  const vieja = {
    ...createState({ channel: "chatwoot", contactRef: "foto-vieja", channelType: "Channel::Whatsapp" }),
    botStage: "esperando_horario",
    slotsOffered: SLOTS.map((s) => ({ ...s })),
  };
  const r = step(vieja, { text: "A", receivedAt: T0 }, { config: PERSONA });
  const texto = r.replies.map((x) => x.text).join("\n");

  assert.doesNotMatch(texto, /Listo, agendado/);
  assert.match(texto, /jueves 15:00/, "se le acusa lo que eligió");
  assert.match(texto, /se lo confirma/);
  assert.notEqual(r.nextState.botStage, "demo_agendada");
  assert.ok(!r.sideEffects.some((e) => e.type === "calendar_event"), "no se pide un evento de calendario");
  const aviso = r.sideEffects.find((e) => e.type === "notify_sergio");
  assert.ok(aviso, "Sergio Urcullo se entera");
  assert.match(aviso.payload.text, /jueves 15:00/, "y con el horario que pidió: es lo único accionable");
});

test("persona con la agenda REAL en el conocimiento: la bienvenida manda el link en vez de prometer que le escriben", () => {
  const conAgenda = createBotConfig({ agenda: { modo: "persona" }, orgSlug: "onia-demo" });
  const r = step(createState({ channel: "chatwoot", contactRef: "link", channelType: "Channel::Whatsapp" }), { text: "DEMO", receivedAt: T0 }, { config: conAgenda });
  const texto = r.replies.map((x) => x.text).join("\n");
  assert.match(texto, /https:\/\/app\.onia\.com\.bo\/book\/onia-demo/);
  assert.doesNotMatch(texto, /\*\*A\)\*\*/);
});

test("persona por el widget web (sin teléfono): no le promete escribirle «desde este mismo número»", () => {
  const r = step(createState({ channel: "chatwoot", contactRef: "web", channelType: "Channel::WebWidget" }), { text: "DEMO", receivedAt: T0 }, { config: PERSONA });
  const texto = r.replies.map((x) => x.text).join("\n");
  assert.doesNotMatch(texto, /desde este mismo número/);
  assert.match(texto, /por este mismo chat/);
});

// Lo encontró MIRAR el simulador (2-oct): sin agenda propia, el texto seguro del LLM —el que sale
// cuando el modelo no contesta o el guardrail lo descarta— seguía terminando en «¿Te reservo
// {{slot_a}} o {{slot_b}}?», o sea «¿Te reservo HORARIO A (pendiente de definir) o HORARIO B
// (pendiente de definir)?». Un placeholder a la vista y otra vez el «agendo yo».
test("persona: el texto SEGURO (LLM caído o descartado) no ofrece horarios ni muestra el placeholder", () => {
  const enEspera = step(createState({ channel: "chatwoot", contactRef: "seguro", channelType: "Channel::Whatsapp" }), { text: "DEMO", receivedAt: T0 }, { config: PERSONA }).nextState;
  const pregunta = { text: "¿y eso funciona con internet lento?", receivedAt: T0 };

  const sinModelo = step(enEspera, pregunta, { config: PERSONA });
  const pendiente = sinModelo.replies.find((r) => r.pending);
  assert.ok(pendiente, "ancla: la pregunta va a la rama del LLM");
  assert.doesNotMatch(pendiente.fallbackText, /pendiente de definir|Te reservo|Le reservo/);
  assert.match(pendiente.fallbackText, /le escribe desde este mismo número/);

  const descartado = step(enEspera, pregunta, { config: PERSONA, llm: () => "Sale Bs 999 por mes, oferta especial" });
  const texto = descartado.replies.map((r) => r.text).join("\n");
  assert.doesNotMatch(texto, /Bs 999/, "ancla: el guardrail descartó el texto del modelo");
  assert.doesNotMatch(texto, /pendiente de definir|Te reservo|Le reservo/);
});

// ---------------------------------------------------------------------------
// 4. Lo que el bot dice en modo persona tiene que poder cumplirse (3-oct)
// ---------------------------------------------------------------------------

// El conocimiento publicado (`knowledge.onia.json`) y la config de producción de hoy: la persona
// coordina la demo. El instante es el de los casos de arriba.
const PRODUCCION = configComoProduccion({ horarios: SPEC, now: Date.parse(T0) });
const CAMPANAS = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8")).campanas;
/** El mensaje que manda quien toca el link de la campaña (a la de prefijo se le suma su resto). */
const mensajeDe = (campana) => (campana.prefijo ? `${campana.frase} (D1). Tengo una clínica dental.` : campana.frase);
const primerTurno = (texto, config = PRODUCCION) =>
  step(createState({ channel: "chatwoot", contactRef: "persona-3oct", channelType: "Channel::Whatsapp" }), { text: texto, receivedAt: T0 }, { config });

// AUDITORÍA DEL 3-OCT. El CTA de /contacto («Agendar la demo», campañas 6 y 7) le decía al prospecto
// «Con eso te confirmo el horario acá mismo.» — justo después de M0_PERSONA («El horario lo coordinás
// directo con Sergio») y antes de M0b_SIN_HORARIOS («Sergio te coordina el horario personalmente»).
// El bot nunca confirma nada en modo persona: es la misma clase de promesa falsa que el cambio del
// 2-oct vino a sacar, ahora en el texto editable de una campaña.
const PROMETE_AGENDAR = /confirmo el horario|te reservo|le reservo|\bagend(o|amos)\b/i;

test("con la agenda de la persona (producción), ninguna campaña publicada promete confirmar ni reservar el horario", () => {
  assert.equal(PRODUCCION.agenda?.modo, "persona", "ancla: se mide la rama que sirve producción");
  const promesas = CAMPANAS.filter((campana) => PROMETE_AGENDAR.test(campana.respuesta)).map((campana) => campana.frase);
  assert.deepEqual(promesas, [], "estas campañas prometen una confirmación que el bot no da sin agenda propia");
  for (const campana of CAMPANAS) {
    const r = primerTurno(mensajeDe(campana));
    assert.ok(r.replies.some((reply) => reply.templateKey === "R_CAMPANA"), `ancla: «${campana.frase}» contesta con su campaña`);
    assert.doesNotMatch(r.replies.map((reply) => reply.text).join("\n"), PROMETE_AGENDAR, `«${campana.frase}»`);
  }
});

test("el saludo no sale dos veces: la campaña que sigue a la bienvenida no se vuelve a presentar", () => {
  // Las dos bienvenidas (M0_PERSONA y M0 con horarios): el saludo doble existía en las dos.
  for (const config of [PRODUCCION, createBotConfig({ slots: SLOTS, agenda: { modo: "propia" } }, PRODUCCION)]) {
    for (const campana of CAMPANAS) {
      const r = primerTurno(mensajeDe(campana), config);
      const texto = r.replies.map((reply) => reply.text).join("\n");
      const saludos = texto.match(/Soy el asistente automático/g) || [];
      assert.equal(saludos.length, 1, `«${campana.frase}» saluda ${saludos.length} veces:\n${texto}`);
      assert.match(r.replies[0].text.split("\n")[0], /bot|asistente automático/i, "D2: el disclosure sigue en la PRIMERA línea");
      const campanaDicha = r.replies.find((reply) => reply.templateKey === "R_CAMPANA");
      assert.match(campanaDicha.text, /^[¿¡A-ZÁÉÍÓÚÑ]/, `la campaña sin el saludo arranca con mayúscula: «${campanaDicha.text.slice(0, 40)}»`);
    }
  }
});

// AUDITORÍA DEL 3-OCT. M0_PERSONA terminaba SIEMPRE en «Contame mientras: ¿a qué se dedica tu
// negocio?», aunque el primer mensaje lo acabara de decir. El cliente ideal (dental o estética) que
// se presenta solo leía un bot que no lo escuchó. Antes del 2-oct, M0 no pedía el rubro.
for (const { mensaje, noPregunta, pregunta } of [
  { mensaje: "hola, tengo una clínica dental con 4 odontólogos, quiero una demo", noPregunta: /a qué se dedica|cuántas personas/, pregunta: /¿en qué ciudad está\?/ },
  { mensaje: "Hola, tengo una clínica de estética, quiero una demo", noPregunta: /a qué se dedica/, pregunta: /¿cuántas personas trabajan ahí\?/ },
  { mensaje: "tengo una ferretería en Santa Cruz", noPregunta: /a qué se dedica/, pregunta: /¿cuántas personas trabajan ahí\?/ },
]) {
  test(`persona: «${mensaje}» no recibe la pregunta del dato que acaba de dar, sino la del siguiente`, () => {
    const r = primerTurno(mensaje);
    assert.equal(r.replies[0].templateKey, "M0_PERSONA");
    assert.doesNotMatch(r.replies[0].text, noPregunta, "le pregunta lo que acaba de decir: se lee como un bot que no escuchó");
    assert.match(r.replies[0].text, pregunta);
  });
}

test("persona: sin ningún dato todavía, la bienvenida sigue preguntando el rubro", () => {
  const r = primerTurno("hola, quiero información");
  assert.match(r.replies[0].text, /Cuénteme mientras: ¿a qué se dedica su negocio\?/);
});

test("persona: con los tres datos ya dichos, la bienvenida no pregunta nada", () => {
  const r = primerTurno("hola, tengo una clínica dental en Santa Cruz, somos 4, quiero una demo");
  assert.equal(r.nextState.qualification.city, "Santa Cruz", "ancla: los tres datos se leyeron");
  assert.doesNotMatch(r.replies[0].text, /Contame mientras|Cuénteme mientras|\?$/);
});

// AUDITORÍA DEL 3-OCT. El aviso `coordinar_demo` sale en la bienvenida. Una conversación que nació
// ANTES del deploy (cuando el bot ofrecía los horarios del cron) está en `esperando_horario`, con
// `slotsOffered` reales, y nunca lo recibió. En modo persona, contar el negocio, preguntar el precio o
// elegir un horario vencido le responden «Sergio te coordina el horario y te escribe…» — y a Sergio
// Urcullo no le llegaba nada. Se le promete al lead real un contacto que nadie va a hacer.
const conOfertaVieja = (extra = {}) => ({
  ...createState({ channel: "chatwoot", contactRef: "oferta-vieja", channelType: "Channel::Whatsapp" }),
  botStage: "esperando_horario",
  slotsOffered: SLOTS.map((s) => ({ ...s })),
  leadKey: "lead-oferta-vieja",
  ...extra,
});
const avisosDe = (r) => r.sideEffects.filter((e) => e.type === "notify_sergio");

for (const { caso, texto, receivedAt, plantilla } of [
  { caso: "cuenta su negocio", texto: "tengo una clinica dental con 3 dentistas en santa cruz", receivedAt: T0, plantilla: "M0b_SIN_HORARIOS" },
  { caso: "pregunta el precio", texto: "cuanto cuesta?", receivedAt: T0, plantilla: "M4_BODY" },
  { caso: "elige un horario que ya venció", texto: "A", receivedAt: "2026-07-31T15:00:00Z", plantilla: "PENDING_HORARIO_SIN_HORARIOS" },
]) {
  test(`persona, conversación con la oferta VIEJA que ${caso}: a Sergio Urcullo le llega el aviso de coordinar, una vez`, () => {
    const r = step(conOfertaVieja(), { text: texto, receivedAt }, { config: PERSONA });
    assert.equal(r.replies[0].templateKey, plantilla, "ancla: la rama que el hallazgo midió");
    assert.match(r.replies.map((x) => x.text).join("\n"), /le escribe/, "ancla: el texto le promete que le escriben");
    const avisos = avisosDe(r);
    assert.equal(avisos.length, 1, "la promesa «te escribe Sergio» sin aviso es un contacto que nadie va a hacer");
    assert.equal(avisos[0].payload.kind, "coordinar_demo");
    assert.ok(r.sideEffects.some((e) => e.type === "review_queue"), "y la tarjeta en la cola, como en la bienvenida");
    assert.deepEqual(r.nextState.slotsOffered, [], "la oferta vieja se cierra: el aviso no se repite");

    const despues = step(r.nextState, { text: "somos 5 en la clinica", receivedAt }, { config: PERSONA });
    assert.equal(despues.replies[0].templateKey, "M0b_SIN_HORARIOS", "ancla: el turno siguiente vuelve a prometer que le escriben");
    assert.equal(avisosDe(despues).length, 0, "una sola vez por conversación");
  });
}

test("persona, oferta VIEJA vigente y elige «A»: el handoff ya avisa — no se le suma un segundo aviso", () => {
  const r = step(conOfertaVieja(), { text: "A", receivedAt: T0 }, { config: PERSONA });
  const avisos = avisosDe(r);
  assert.equal(avisos.length, 1);
  assert.equal(avisos[0].payload.kind, "handoff");
});

test("persona, una conversación NUEVA ya avisó en la bienvenida: el turno siguiente no repite el aviso", () => {
  const r1 = step(createState({ channel: "chatwoot", contactRef: "nueva", channelType: "Channel::Whatsapp" }), { text: "DEMO", receivedAt: T0 }, { config: PERSONA });
  assert.equal(avisosDe(r1)[0]?.payload.kind, "coordinar_demo");
  const r2 = step(r1.nextState, { text: "tengo una clinica dental en santa cruz", receivedAt: T0 }, { config: PERSONA });
  assert.equal(avisosDe(r2).length, 0);
});

test("con agenda propia la oferta vigente NO es vieja: contar el negocio no avisa (sigue eligiendo horario)", () => {
  const r = step(conOfertaVieja(), { text: "tengo una clinica dental en santa cruz", receivedAt: T0 }, { config: createBotConfig({ slots: SLOTS }) });
  assert.equal(r.replies[0].templateKey, "M0b");
  assert.equal(avisosDe(r).length, 0);
});

test("el turno completo (runTurn) con el entorno de producción: el aviso de la oferta vieja llega a `notify`", async () => {
  await conEntorno({ ...ENV_DE_PRODUCCION, ONIA_BOT_AGENDA: undefined }, async () => {
    const vieja = conOfertaVieja({ conversationKey: "chatwoot:591700000", contactRef: "591700000" });
    const fake = memoryStore(vieja);
    const deps = { store: fake.store, nowIso: T0, llm: async () => "", createBooking: async () => ({ ok: false, reason: "error", warnings: [] }) };
    const r = await runTurn(turno({ text: "tengo una clinica dental con 3 dentistas en santa cruz", message_key: "chatwoot:9" }), deps);
    assert.match(r.send.map((x) => x.text).join("\n"), /le escribe/);
    assert.deepEqual(r.notify.map((n) => n.kind), ["coordinar_demo"], "sin esto webhook-server no manda nada a Telegram");
    assert.deepEqual(fake.state.slotsOffered, []);
  });
});

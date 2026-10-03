// ONIA — Chatbot propio: pruebas del ADAPTADOR DE CHATWOOT.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Los payloads de fixture son RECORTES DE PAYLOADS REALES: se capturaron en vivo contra la
// cuenta 2 de Chatwoot el 2026-07-26 (inbox "ONIA Demo", webhook apuntado a webhook.site) para
// no adivinar la forma del webhook.
//
// Lo que se cubre y por que:
//   1. parseChatwootWebhook: entrante -> turno; saliente/nota privada -> skip (LA REGLA MAS FACIL
//      DE ROMPER: si esto falla, el bot se contesta a si mismo en loop infinito).
//   2. conversation_created: sin mensajes todavia -> skip (nada que contestar); con mensaje
//      entrante embebido -> turno (formas numericas de message_type/created_at, no las de
//      arriba).
//   3. createChatwootClient: arma el POST correcto y es TOLERANTE (nunca tira) ante 4xx/5xx/
//      red caida/sin token.
//   4. runChatwootTurn con runTurn MOCKEADO: aisla la orquestacion (cuantas veces se llama al
//      motor y al cliente) del motor real.
//   5. INTEGRACION EN PROCESO con el runTurn REAL (bot-engine + persistencia en memoria) y solo
//      el fetch de Chatwoot mockeado: prueba punta a punta que un mensaje real dispara M0, que el
//      eco de esa MISMA respuesta (el webhook que Chatwoot manda por su propio mensaje saliente)
//      NO reinicia el bot, y que reenviar el mismo webhook no duplica el envio.
//
// No hay red real en ninguna prueba: el fetch se inyecta siempre.

import test from "node:test";
import assert from "node:assert/strict";

import {
  createChatwootClient,
  normalizeMessageType,
  parseChatwootWebhook,
  readPayload,
  runChatwootTurn,
  toIsoFlexible,
  whatsappTemplate,
} from "./chatwoot-adapter.mjs";
import { createState } from "./bot-engine.mjs";
import { createBotConfig } from "./config.mjs";
import { createStore, leadKeyFor } from "./persistence.mjs";
// El medidor entra en estas pruebas a proposito: el traspaso solo esta arreglado si la fila que
// queda la CUENTA quien factura. Con el store de mentira se probaba la intencion, no el resultado.
import { clasificar, esCobrable } from "./usage-run.mjs";

// dryRun:false a proposito: estas pruebas verifican el envio REAL (posted:true). El gate de
// dry-run tiene su propia prueba dedicada mas abajo (misma logica de "encendido en dos pasos"
// que Telegram, ver N8N_WORKFLOW.md §4.6).
const CONFIG = createBotConfig({
  dryRun: false,
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

// ---------------------------------------------------------------------------
// Fixtures — recortes de los payloads REALES capturados el 2026-07-26
// ---------------------------------------------------------------------------

function incomingFixture(overrides = {}) {
  return {
    event: "message_created",
    id: 13,
    content: "DEMO",
    content_type: "text",
    message_type: "incoming",
    private: false,
    created_at: "2026-07-26T15:24:09.329Z",
    sender: { id: 2, identifier: "prospecto-prueba-onia-001", name: "Prospecto Prueba ONIA" },
    inbox: { id: 3, name: "ONIA Demo" },
    account: { id: 2, name: "OnIA Agency" },
    conversation: { id: 2, inbox_id: 3, contact_inbox: { source_id: "cdd3ed15-d385-4ab0-b5d4-a7f5b556aabf" } },
    ...overrides,
  };
}

/** El ECO real que Chatwoot manda por el PROPIO mensaje saliente del bot (mismo shape, message_type outgoing). */
function outgoingFixture(overrides = {}) {
  return {
    event: "message_created",
    id: 14,
    content: "Respuesta de prueba del bot",
    content_type: "text",
    message_type: "outgoing",
    private: false,
    created_at: "2026-07-26T15:24:10.018Z",
    sender: { id: 2, name: "OnIA", email: "oninteligenciaartificial@gmail.com", type: "user" },
    inbox: { id: 3, name: "ONIA Demo" },
    account: { id: 2, name: "OnIA Agency" },
    conversation: { id: 2, inbox_id: 3 },
    ...overrides,
  };
}

function conversationCreatedEmptyFixture(overrides = {}) {
  return {
    event: "conversation_created",
    id: 3,
    inbox_id: 3,
    status: "open",
    contact_inbox: { source_id: "21071b69-6cc5-4779-905a-332753e887cc" },
    messages: [],
    ...overrides,
  };
}

function conversationCreatedWithMessageFixture(overrides = {}) {
  return {
    event: "conversation_created",
    id: 5,
    inbox_id: 3,
    status: "open",
    messages: [
      {
        id: 20,
        content: "info porfa",
        message_type: 0, // NUMERICO adentro del arreglo anidado (distinto del nivel superior)
        private: false,
        created_at: 1785079449, // epoch-segundos, no ISO
        sender: { id: 7, identifier: "otro-prospecto", name: "Otro Prospecto", type: "contact" },
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1-2. parseChatwootWebhook
// ---------------------------------------------------------------------------

test("message_created entrante -> turno correcto (channel/contact_ref/message_key/kind)", () => {
  const parsed = parseChatwootWebhook(incomingFixture());
  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.channel, "chatwoot");
  assert.equal(parsed.turn.contact_ref, "2");
  assert.equal(parsed.turn.text, "DEMO");
  assert.equal(parsed.turn.kind, "text");
  assert.equal(parsed.turn.message_key, "chatwoot:2:13");
  assert.equal(parsed.turn.received_at, "2026-07-26T15:24:09.329Z");
  assert.equal(parsed.turn.display_name, "Prospecto Prueba ONIA");
  assert.equal(parsed.turn.inbox_id, "3", "el inbox top-level resuelve de que cliente es la conversacion");
  assert.equal(parsed.meta.conversationId, "2");
  assert.equal(parsed.meta.messageId, "13");
});

test("inbox_id: sin inbox top-level cae a conversation.inbox_id, y sin ninguno queda null", () => {
  const sinTop = parseChatwootWebhook(incomingFixture({ inbox: undefined }));
  assert.equal(sinTop.turn.inbox_id, "3", "respaldo: conversation.inbox_id");
  const sinNada = parseChatwootWebhook(
    incomingFixture({ inbox: undefined, conversation: { id: 2, contact_inbox: { source_id: "x" } } }),
  );
  assert.equal(sinNada.turn.inbox_id, null, "sin inbox el turno sigue: conocimiento de Onia como siempre");
});

test("REGLA DE ORO: message_created saliente se ignora (si no, el bot se contesta a si mismo)", () => {
  const parsed = parseChatwootWebhook(outgoingFixture());
  assert.equal(parsed.skip, true);
  assert.match(parsed.reason, /^mensaje_no_entrante:outgoing$/);
});

// ---------------------------------------------------------------------------
// TRASPASO A HUMANO: Sergio contesta => el bot se calla
// ---------------------------------------------------------------------------
// El bot posteaba con la MISMA cuenta que Sergio, asi que era imposible distinguir quien escribio y
// el bot le seguia hablando encima al prospecto. Con `CHATWOOT_BOT_AGENT_ID` (el agente "Onia Bot",
// id 3) los salientes de CUALQUIER otro usuario significan que un humano tomo la conversacion.

/**
 * Corre `run` con la identidad del bot configurada y la restaura pase lo que pase.
 * Es `async` a proposito: hay pruebas que corren un turno entero adentro, y con la version
 * sincronica el env se restauraba antes de que el turno terminara de leerlo.
 */
async function conIdentidadDelBot(id, run) {
  const antes = process.env.CHATWOOT_BOT_AGENT_ID;
  if (id === null) delete process.env.CHATWOOT_BOT_AGENT_ID;
  else process.env.CHATWOOT_BOT_AGENT_ID = String(id);
  try {
    return await run();
  } finally {
    if (antes === undefined) delete process.env.CHATWOOT_BOT_AGENT_ID;
    else process.env.CHATWOOT_BOT_AGENT_ID = antes;
  }
}

/** El saliente de un humano que ademas salio como PLANTILLA aprobada de Meta. */
function plantillaFixture(name, overrides = {}) {
  return outgoingFixture({
    id: 30,
    sender: { id: 2, name: "OnIA", type: "user" },
    content: "Hola, quedamos en la demo del jueves",
    // Forma capturada en los logs de Chatwoot el 2026-08-13: va en el NIVEL DE ARRIBA del payload.
    additional_attributes: {
      template_params: { name, language: "es", processed_params: { body: { 1: "Sergio" } } },
    },
    ...overrides,
  });
}

test("TRASPASO: si contesta OTRO usuario, el turno pide callar al bot", async () => {
  await conIdentidadDelBot(3, () => {
    const parsed = parseChatwootWebhook(outgoingFixture({ sender: { id: 2, name: "OnIA", type: "user" } }));
    assert.equal(parsed.skip, false, "no se descarta: hay que anotar el traspaso");
    assert.equal(parsed.turn.human_takeover, true);
    assert.equal(parsed.turn.text, "", "no hay nada que contestar");
    // `human` es uno de los 3 valores que acepta bot_messages.author. "agent" no existe en la base
    // y se degradaba a "bot": la bitacora decia que ese mensaje lo escribio el bot.
    assert.equal(parsed.turn.author, "human", "ni el contacto ni el bot: lo escribio un humano nuestro");
    assert.equal(parsed.turn.contact_ref, "2");
    assert.equal(parsed.turn.template_name, null, "texto libre: no hay plantilla que cobrar");
  });
});

test("SIN TRASPASO: lo que la plataforma escribe SOLA (marca onia_automatico) no silencia al bot", async () => {
  // La respuesta a un boton del recordatorio sale con el token de la plataforma, que es el
  // usuario 2 de Chatwoot (medido el 1-oct); el bot es el 3. Sin la marca, cumplia las cuatro
  // condiciones del traspaso y el bot quedaba mudo con ese paciente.
  await conIdentidadDelBot(3, () => {
    const automatico = parseChatwootWebhook(
      outgoingFixture({
        sender: { id: 2, name: "OnIA", type: "user" },
        content: "¡Listo! Tu cita quedó confirmada.",
        content_attributes: { onia_automatico: "respuesta-al-recordatorio" },
      }),
    );
    assert.equal(automatico.skip, true, "no es un humano: no hay traspaso que anotar");
    assert.equal(automatico.turn, undefined);

    // Una marca vacia o basura NO alcanza: ante la duda, sigue siendo un humano.
    for (const attrs of [{ onia_automatico: "" }, { onia_automatico: true }, { otra: "x" }, null]) {
      const humano = parseChatwootWebhook(
        outgoingFixture({ sender: { id: 2, name: "OnIA", type: "user" }, content_attributes: attrs }),
      );
      assert.equal(humano.turn?.human_takeover, true, `content_attributes ${JSON.stringify(attrs)}`);
    }
  });
});

test("TRASPASO con PLANTILLA: el nombre de Meta viaja en el turno (utility y marketing no cuestan igual)", async () => {
  await conIdentidadDelBot(3, () => {
    const parsed = parseChatwootWebhook(plantillaFixture("seguimiento_demo"));
    assert.equal(parsed.skip, false);
    assert.equal(parsed.turn.template_name, "seguimiento_demo");

    // Una plantilla que nadie registro viaja IGUAL: el medidor decide que hacer con ella, no el
    // adapter. Si el adapter la filtrara, ese envio se cobraria como servicio (6,5x menos).
    const rara = parseChatwootWebhook(plantillaFixture("promo_navidad_2027"));
    assert.equal(rara.turn.template_name, "promo_navidad_2027");

    // Basura en `template_params` no puede inventar una plantilla ni tirar el parseo.
    for (const attrs of [{}, { template_params: null }, { template_params: { name: "  " } }, null]) {
      const libre = parseChatwootFixtureConAttrs(attrs);
      assert.equal(libre.turn.template_name, null, `additional_attributes ${JSON.stringify(attrs)}`);
    }
  });
});

/** Helper del caso de arriba: mismo saliente humano, con `additional_attributes` a la carta. */
function parseChatwootFixtureConAttrs(additionalAttributes) {
  return parseChatwootWebhook(
    outgoingFixture({ sender: { id: 2, name: "OnIA", type: "user" }, additional_attributes: additionalAttributes }),
  );
}

test("EL CANDADO: el saliente del PROPIO bot NO lo silencia (si no, se calla con su 1ra respuesta)", async () => {
  await conIdentidadDelBot(3, () => {
    const parsed = parseChatwootWebhook(outgoingFixture({ sender: { id: 3, name: "Onia Bot", type: "user" } }));
    assert.equal(parsed.skip, true, "es su propio eco: se ignora como siempre");
    assert.match(parsed.reason, /^mensaje_no_entrante:outgoing$/);
  });
});

test("sin identidad configurada se comporta como antes: NUNCA se auto-silencia", async () => {
  await conIdentidadDelBot(null, () => {
    const parsed = parseChatwootWebhook(outgoingFixture({ sender: { id: 99, name: "Otro", type: "user" } }));
    assert.equal(parsed.skip, true, "callarse con todos es peor que el problema que esto arregla");
  });
});

test("un remitente que no es un usuario de Chatwoot no puede silenciar al bot", async () => {
  await conIdentidadDelBot(3, () => {
    for (const sender of [{ id: 9, type: "contact" }, { id: null, type: "user" }, { type: "user" }, null]) {
      const parsed = parseChatwootWebhook(outgoingFixture({ sender }));
      assert.equal(parsed.skip, true, `sender ${JSON.stringify(sender)} no deberia disparar traspaso`);
    }
  });
});

test("una NOTA PRIVADA de Sergio no es atender al prospecto: no dispara traspaso", async () => {
  await conIdentidadDelBot(3, () => {
    const parsed = parseChatwootWebhook(outgoingFixture({ private: true, sender: { id: 2, type: "user" } }));
    assert.equal(parsed.skip, true);
    assert.equal(parsed.reason, "nota_privada");
  });
});

test("nota privada (private:true) se ignora aunque diga 'incoming'", () => {
  const parsed = parseChatwootWebhook(incomingFixture({ private: true }));
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "nota_privada");
});

test("sin conversation.id no hay a donde contestar: se ignora", () => {
  const parsed = parseChatwootWebhook(incomingFixture({ conversation: {} }));
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "sin_conversation_id");
});

test("evento desconocido (conversation_updated, contact_created, etc.) se ignora explicitamente", () => {
  const parsed = parseChatwootWebhook({ event: "conversation_updated", id: 2 });
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "evento_no_manejado:conversation_updated");
});

test("conversation_created sin mensajes todavia: nada que contestar, se ignora", () => {
  const parsed = parseChatwootWebhook(conversationCreatedEmptyFixture());
  assert.equal(parsed.skip, true);
  assert.equal(parsed.reason, "conversacion_sin_mensajes_todavia");
});

test("conversation_created CON el primer mensaje embebido: arma el turno (message_type numerico + epoch)", () => {
  const parsed = parseChatwootWebhook(conversationCreatedWithMessageFixture());
  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.contact_ref, "5");
  assert.equal(parsed.turn.text, "info porfa");
  assert.equal(parsed.turn.message_key, "chatwoot:5:20");
  assert.equal(parsed.turn.received_at, "2026-07-26T15:24:09.000Z", "epoch-segundos convertido a ISO");
  assert.equal(parsed.turn.inbox_id, "3", "en conversation_created el inbox es el de la conversacion misma");
});

test("conversation_created con el primer mensaje saliente embebido: se ignora igual", () => {
  const parsed = parseChatwootWebhook(
    conversationCreatedWithMessageFixture({ messages: [{ id: 21, content: "hola", message_type: 1, private: false }] }),
  );
  assert.equal(parsed.skip, true);
  assert.match(parsed.reason, /^mensaje_no_entrante:outgoing$/);
});

test("adjunto sin texto -> kind 'attachment'; audio sin texto -> kind 'voice'", () => {
  const conAdjunto = parseChatwootWebhook(incomingFixture({ content: "", attachments: [{ file_type: "image" }] }));
  assert.equal(conAdjunto.turn.kind, "attachment");
  const conAudio = parseChatwootWebhook(incomingFixture({ content: "", attachments: [{ file_type: "audio" }] }));
  assert.equal(conAudio.turn.kind, "voice");
});

// ---------------------------------------------------------------------------
// 2.b EL TELEFONO — sin esto el CRM guarda el id de conversacion y nadie puede llamar
// ---------------------------------------------------------------------------

test("el telefono del contacto llega al turno como public_contact, SIN tocar contact_ref", () => {
  // `phone_number` es exactamente lo que manda Chatwoot 4.12.1 en Contact#webhook_data.
  // Numero real de la base del VPS (contacto 39, inbox "Onia WhatsApp").
  const parsed = parseChatwootWebhook(
    incomingFixture({ sender: { id: 39, name: "Sergio", phone_number: "+59171654992" } }),
  );
  assert.equal(parsed.turn.public_contact, "+59171654992");
  assert.equal(parsed.turn.contact_ref, "2", "contact_ref sigue siendo la conversacion: es la identidad");
});

test("sin telefono (widget web / inbox de API) queda null: NO se inventa un contacto", () => {
  assert.equal(parseChatwootWebhook(incomingFixture()).turn.public_contact, null);
  assert.equal(parseChatwootWebhook(incomingFixture({ sender: { id: 2, phone_number: "  " } })).turn.public_contact, null);
  assert.equal(parseChatwootWebhook(incomingFixture({ sender: null })).turn.public_contact, null);
});

test("conversation_created: el telefono tambien sale del sender anidado (push_event_data)", () => {
  const fixture = conversationCreatedWithMessageFixture();
  fixture.messages[0].sender = { id: 7, name: "Otro Prospecto", type: "contact", phone_number: "+59170000001" };
  assert.equal(parseChatwootWebhook(fixture).turn.public_contact, "+59170000001");
});

// ---------------------------------------------------------------------------
// 2.c ATRIBUCION — de que pieza / campana vino el prospecto
// ---------------------------------------------------------------------------

test("atribucion: custom_attributes de la conversacion manda (dato puesto a mano)", () => {
  const parsed = parseChatwootWebhook(
    incomingFixture({
      conversation: {
        id: 2,
        custom_attributes: { piece_key: "lucia-d03-reel-siat", source_campaign: "lucia-dentalgest-jul2026" },
      },
    }),
  );
  assert.equal(parsed.turn.piece_key, "lucia-d03-reel-siat");
  assert.equal(parsed.turn.source_campaign, "lucia-dentalgest-jul2026");
});

test("atribucion: ?src= del referer del widget (LA convencion de Onia) -> piece_key", () => {
  const parsed = parseChatwootWebhook(
    incomingFixture({
      conversation: {
        id: 2,
        // Forma exacta que escribe el widget de Chatwoot (widget/base_controller.rb).
        additional_attributes: { referer: "https://onia.com.bo/dental?src=lucia-d03-reel-siat", browser: {} },
      },
    }),
  );
  assert.equal(parsed.turn.piece_key, "lucia-d03-reel-siat");
  assert.equal(parsed.turn.source_campaign, null, "sin utm_campaign no se inventa una campana");
});

test("atribucion: UTM de pauta -> utm_content = pieza, utm_campaign = campana", () => {
  const parsed = parseChatwootWebhook(
    incomingFixture({
      conversation: {
        id: 2,
        additional_attributes: { referer: "https://onia.com.bo/?utm_campaign=dental-ago&utm_content=reel-siat-03" },
      },
    }),
  );
  assert.equal(parsed.turn.piece_key, "reel-siat-03");
  assert.equal(parsed.turn.source_campaign, "dental-ago");
});

test("atribucion: sin datos (el caso de HOY en todas las conversaciones) queda en null", () => {
  const vacio = parseChatwootWebhook(incomingFixture());
  assert.equal(vacio.turn.piece_key, null);
  assert.equal(vacio.turn.source_campaign, null);

  // Un referer que no es una URL no puede tumbar el turno: sin atribucion, pero el bot contesta.
  const basura = parseChatwootWebhook(
    incomingFixture({ conversation: { id: 2, additional_attributes: { referer: "no-es-una-url" } } }),
  );
  assert.equal(basura.skip, false);
  assert.equal(basura.turn.piece_key, null);
});

test("normalizeMessageType acepta string y numerico; toIsoFlexible acepta ISO y epoch-segundos", () => {
  assert.equal(normalizeMessageType("incoming"), "incoming");
  assert.equal(normalizeMessageType(0), "incoming");
  assert.equal(normalizeMessageType("outgoing"), "outgoing");
  assert.equal(normalizeMessageType(1), "outgoing");
  assert.equal(normalizeMessageType("template"), "template");
  assert.equal(normalizeMessageType(undefined), "");

  assert.equal(toIsoFlexible("2026-07-26T15:24:09.329Z"), "2026-07-26T15:24:09.329Z");
  assert.equal(toIsoFlexible(1785079449), "2026-07-26T15:24:09.000Z");
  assert.equal(toIsoFlexible(null), null);
  assert.equal(toIsoFlexible("no-es-fecha"), null);
});

const noStdin = { readStdin: async () => "" };

test("readPayload: sin stdin (nodo SSH de n8n) cae a CHATWOOT_WEBHOOK_B64", async () => {
  const payload = { event: "message_created", id: 1 };
  process.env.CHATWOOT_WEBHOOK_B64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  try {
    const parsed = await readPayload(noStdin);
    assert.deepEqual(parsed, payload);
  } finally {
    delete process.env.CHATWOOT_WEBHOOK_B64;
  }
});

test("readPayload: sin stdin y sin CHATWOOT_WEBHOOK_B64, tira un error claro (lo atrapa main())", async () => {
  await assert.rejects(() => readPayload(noStdin), /sin payload/);
});

// ---------------------------------------------------------------------------
// 2b. message_updated — EL CLICK DE UN BOTON (input_select) no crea mensaje nuevo:
// Chatwoot escribe submitted_values SOBRE el mensaje saliente original (verificado en vivo
// contra el 4.12.1 del VPS, 2026-08-18, conversacion 26 / mensaje 128).
// ---------------------------------------------------------------------------

/** La forma REAL: el mensaje del menu (outgoing) con items + submitted_values tras el click. */
function buttonClickFixture(overrides = {}) {
  return {
    event: "message_updated",
    id: 128,
    content: "¡Hola! Soy el asistente de ZZ QA Ferreteria Tornillo 🙂",
    content_type: "input_select",
    content_attributes: {
      items: [
        { title: "Horarios", value: "horarios" },
        { title: "Servicios", value: "servicios" },
        { title: "Hablar con Sergio", value: "hablar con una persona" },
      ],
      submitted_values: [{ title: "Horarios", value: "horarios" }],
    },
    message_type: "outgoing", // el mensaje original es DEL BOT: el click no cambia eso
    private: false,
    created_at: "2026-08-18T04:30:40.000Z",
    sender: { id: 3, name: "Onia Bot", type: "user" }, // el sender es el bot, NO el contacto
    inbox: { id: 7, name: "ZZ QA Clinica Chatbot" },
    account: { id: 2, name: "OnIA Agency" },
    conversation: { id: 26, inbox_id: 7, contact_inbox: { source_id: "qa-widget" } },
    ...overrides,
  };
}

test("click de botón (message_updated con submitted_values) -> turno INBOUND con el título elegido", () => {
  const parsed = parseChatwootWebhook(buttonClickFixture());
  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.text, "Horarios", "el título es lo que el contacto vio y lo que el motor rutea");
  assert.equal(parsed.turn.kind, "text");
  assert.equal(parsed.turn.contact_ref, "26");
  assert.equal(parsed.turn.inbox_id, "7", "el inbox sigue resolviendo la org del cliente");
  assert.equal(
    parsed.turn.message_key,
    "chatwoot:26:128:select:horarios",
    "la clave lleva el valor elegido: un message_updated re-disparado no procesa el click dos veces",
  );
  assert.equal(parsed.meta.conversationId, "26");
});

test("message_updated SIN submitted_values (o sin botones) se skipea: solo el click entra al motor", () => {
  const sinClick = parseChatwootWebhook(buttonClickFixture({ content_attributes: { items: [{ title: "Horarios", value: "horarios" }] } }));
  assert.equal(sinClick.skip, true);
  assert.equal(sinClick.reason, "sin_valor_elegido");

  const textoPlano = parseChatwootWebhook(buttonClickFixture({ content_type: "text", content_attributes: {} }));
  assert.equal(textoPlano.skip, true);
  assert.equal(textoPlano.reason, "update_sin_botones", "editar un mensaje comun no dispara al bot");

  const privado = parseChatwootWebhook(buttonClickFixture({ private: true }));
  assert.equal(privado.skip, true);

  const vacio = parseChatwootWebhook(buttonClickFixture({ content_attributes: { submitted_values: [] } }));
  assert.equal(vacio.skip, true);
});

test("click de botón: corre el motor y postea la respuesta (orquestación completa)", async () => {
  const { calls, client } = fakeClient2();
  let visto = null;
  const result = await runChatwootTurn(buttonClickFixture(), {
    client,
    runTurn: async (turn) => {
      visto = turn;
      return { ok: true, duplicate: false, send: [{ text: "Atendemos lun-vie, 8:00-18:00. ¿Te ayudo con algo más?" }], warnings: [] };
    },
  });
  assert.equal(visto.text, "Horarios");
  assert.equal(result.skipped, false);
  assert.deepEqual(calls.map((c) => c.text), ["Atendemos lun-vie, 8:00-18:00. ¿Te ayudo con algo más?"]);
});

// fakeClient() se declara más abajo (sección 4); esta variante local evita mover código.
function fakeClient2() {
  const calls = [];
  return {
    calls,
    client: {
      warnings: [],
      async sendMessage(conversationId, text) {
        calls.push({ conversationId, text });
        return { id: calls.length };
      },
    },
  };
}

// ---------------------------------------------------------------------------
// 3. createChatwootClient — el POST y la tolerancia
// ---------------------------------------------------------------------------

test("sendMessage arma el POST exacto: url, header api_access_token, message_type outgoing", async () => {
  const requests = [];
  const fetchImpl = async (url, init) => {
    requests.push({ url: String(url), method: init.method, headers: init.headers, body: JSON.parse(init.body) });
    return { ok: true, status: 200, text: async () => JSON.stringify({ id: 99 }) };
  };
  const client = createChatwootClient({ baseUrl: "https://sb.test", accountId: "2", token: "tok-fake", fetch: fetchImpl });
  const result = await client.sendMessage("7", "Hola, soy el bot");

  assert.deepEqual(result, { id: 99 });
  assert.equal(requests[0].url, "https://sb.test/api/v1/accounts/2/conversations/7/messages");
  assert.equal(requests[0].method, "POST");
  assert.equal(requests[0].headers.api_access_token, "tok-fake");
  assert.equal(requests[0].body.content, "Hola, soy el bot");
  assert.equal(requests[0].body.message_type, "outgoing");
});

test("sin plantilla el POST no lleva `template_params`: el 99% del trafico sigue siendo texto libre gratis", async () => {
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async (url, init) => {
      requests.push(JSON.parse(init.body));
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });
  await client.sendMessage("7", "Hola");
  assert.ok(!("template_params" in requests[0]), "la clave ni aparece: si aparece vacia, Chatwoot manda plantilla igual");
});

test("con plantilla, `template_params` va TOP-LEVEL en el POST (es Chatwoot quien lo anida)", async () => {
  // La forma sale del fuente de Chatwoot 4.12.1 leido en el VPS, no de la doc:
  //   app/builders/messages/message_builder.rb:122-124 lee `@params[:template_params]` y lo mete el
  //   en `additional_attributes`; app/services/whatsapp/send_on_whatsapp_service.rb:45-46 lo lee de
  //   ahi. Mandarlo nosotros ya anidado NO funciona: el builder nunca mira `additional_attributes`.
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async (url, init) => {
      requests.push(JSON.parse(init.body));
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });

  const params = whatsappTemplate("recordatorio_demo", ["jue 30/07 15:00", "https://cal.test/x"]);
  await client.sendMessage("7", "texto que se ve en el panel", params);

  assert.deepEqual(requests[0].template_params, params, "top-level, tal cual");
  assert.equal(requests[0].content, "texto que se ve en el panel", "el cuerpo sigue viajando: es lo que ve el agente");
  assert.equal(requests[0].message_type, "outgoing");
});

test("whatsappTemplate arma el formato `enhanced` que espera Chatwoot: claves de texto en `body`", () => {
  // process_body_components (whatsapp/template_processor_service.rb:79) itera `processed_params.body`
  // y descarta lo vacio: una variable de menos = plantilla rechazada por Meta.
  assert.deepEqual(whatsappTemplate("seguimiento_demo", ["jue 15:00", "vie 10:00"]), {
    name: "seguimiento_demo",
    language: "es",
    processed_params: { body: { 1: "jue 15:00", 2: "vie 10:00" } },
  });
  // Las claves son STRINGS "1"/"2" (JSON no distingue, pero el lado Ruby si).
  assert.deepEqual(Object.keys(whatsappTemplate("x", ["a", "b"]).processed_params.body), ["1", "2"]);
});

test("con `interactive`, el POST sale como input_select: content_type + content_attributes.items (y recorta a 3)", async () => {
  // input_select es el UNICO content type que sirve en los DOS canales: el widget lo renderiza
  // como opciones y Chatwoot lo traduce a reply buttons de WhatsApp (PR #6886, max 3).
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async (url, init) => {
      requests.push(JSON.parse(init.body));
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });

  const items = [
    { title: "Horarios", value: "horarios" },
    { title: "Servicios", value: "servicios" },
    { title: "Hablar con Sergio", value: "hablar con una persona" },
    { title: "Una cuarta de mas", value: "sobra" },
  ];
  await client.sendMessage("7", "¿En qué te ayudo?", null, { items });

  assert.equal(requests[0].content_type, "input_select");
  assert.deepEqual(requests[0].content_attributes.items, items.slice(0, 3), "reply buttons de WhatsApp: max 3");
  assert.equal(requests[0].content, "¿En qué te ayudo?", "el texto sigue viajando: es la base si el canal no soporta interactivos");

  await client.sendMessage("7", "texto plano");
  assert.ok(!("content_type" in requests[1]), "sin items el POST es el de siempre");
  assert.ok(!("content_attributes" in requests[1]));
});

// ---------------------------------------------------------------------------
// 3b. sendAttachment — plomeria de adjuntos SALIENTES (QR del BCP / fotos de catalogo).
// Sin uso automatico todavia: ningun flujo del motor la llama (YAGNI hasta el QR real).
// ---------------------------------------------------------------------------

test("sendAttachment arma el multipart: attachments[], message_type outgoing, token — y SIN Content-Type a mano", async () => {
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return { ok: true, status: 200, text: async () => JSON.stringify({ id: 71 }) };
    },
  });

  const result = await client.sendAttachment("9", {
    buffer: Buffer.from("png-bytes"),
    filename: "qr-bcp.png",
    contentType: "image/png",
    caption: "Escaneá y pagá el monto exacto",
  });

  assert.deepEqual(result, { id: 71 });
  const { url, init } = requests[0];
  assert.equal(url, "https://sb.test/api/v1/accounts/2/conversations/9/messages");
  assert.equal(init.method, "POST");
  assert.equal(init.headers.api_access_token, "tok");
  assert.ok(!("Content-Type" in init.headers), "el boundary del multipart lo pone fetch, no nosotros");
  assert.ok(init.body instanceof FormData, "multipart/form-data, no JSON");
  assert.equal(init.body.get("message_type"), "outgoing");
  assert.equal(init.body.get("content"), "Escaneá y pagá el monto exacto");
  const file = init.body.get("attachments[]");
  assert.equal(file.name, "qr-bcp.png");
  assert.equal(file.type, "image/png");
  assert.equal(file.size, 9, "los bytes viajan completos");
});

test("sendAttachment es tolerante: sin token o sin bytes devuelve null con el motivo, sin tocar la red", async () => {
  const nuncaLlama = async () => {
    throw new Error("no debería llamar a la red");
  };
  const sinToken = createChatwootClient({ baseUrl: "https://sb.test", accountId: "2", token: "", fetch: nuncaLlama });
  assert.equal(await sinToken.sendAttachment("9", { buffer: Buffer.from("x") }), null);
  assert.match(sinToken.warnings[0], /sin token/);

  const client = createChatwootClient({ baseUrl: "https://sb.test", accountId: "2", token: "tok", fetch: nuncaLlama });
  assert.equal(await client.sendAttachment("9", { buffer: Buffer.alloc(0) }), null);
  assert.equal(await client.sendAttachment("9", {}), null);
  assert.match(client.warnings[0], /adjunto sin contenido/);

  // Y un 4xx real tampoco tira: null + warning, mismo contrato que sendMessage.
  const rechaza = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async () => ({ ok: false, status: 401, text: async () => "unauthorized" }),
  });
  assert.equal(await rechaza.sendAttachment("9", { buffer: Buffer.from("x") }), null);
  assert.match(rechaza.warnings[0], /HTTP 401/);
});

test("sendMessage con texto vacio no llama a la red", async () => {
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "tok",
    fetch: async (url) => {
      requests.push(url);
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });
  assert.equal(await client.sendMessage("7", ""), null);
  assert.equal(await client.sendMessage("7", "   "), null);
  assert.equal(requests.length, 0);
});

test("sendMessage tolera 4xx/5xx/red caida/JSON roto: nunca tira, devuelve null y deja el motivo", async () => {
  const casos = [
    { status: 401, body: "unauthorized" },
    { status: 500, body: "boom" },
    { throws: "ECONNREFUSED" },
    { status: 200, body: "{no-es-json" },
  ];
  for (const caso of casos) {
    const client = createChatwootClient({
      baseUrl: "https://sb.test",
      accountId: "2",
      token: "tok",
      fetch: async () => {
        if (caso.throws) throw new Error(caso.throws);
        return { ok: caso.status < 400, status: caso.status, text: async () => caso.body };
      },
    });
    const result = await client.sendMessage("7", "hola");
    assert.notEqual(result, undefined, `caso ${JSON.stringify(caso)} no deberia tirar`);
    if (!caso.status || caso.status >= 400 || caso.throws) assert.equal(result, null);
  }
});

test("sin token configurado: no intenta la red, deja el motivo en warnings", async () => {
  const requests = [];
  const client = createChatwootClient({
    baseUrl: "https://sb.test",
    accountId: "2",
    token: "",
    fetch: async (url) => {
      requests.push(url);
      return { ok: true, status: 200, text: async () => "{}" };
    },
  });
  assert.equal(await client.sendMessage("7", "hola"), null);
  assert.equal(requests.length, 0);
  assert.ok(client.warnings.some((w) => w.includes("sin token")));
});

// ---------------------------------------------------------------------------
// 4. runChatwootTurn — orquestacion con runTurn MOCKEADO
// ---------------------------------------------------------------------------

function fakeClient() {
  const calls = [];
  return {
    calls,
    client: {
      warnings: [],
      async sendMessage(conversationId, text) {
        calls.push({ conversationId, text });
        return { id: calls.length };
      },
    },
  };
}

test("entrante: llama al motor UNA vez y postea cada mensaje de send[] en orden", async () => {
  const { calls, client } = fakeClient();
  let runTurnCalls = 0;
  const fakeRunTurn = async () => {
    runTurnCalls += 1;
    return { ok: true, duplicate: false, send: [{ text: "M0 disclosure" }, { text: "M0 preguntas" }], warnings: [] };
  };

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(runTurnCalls, 1);
  assert.equal(result.skipped, false);
  assert.equal(result.sent.length, 2);
  assert.deepEqual(calls.map((c) => c.text), ["M0 disclosure", "M0 preguntas"]);
  assert.ok(calls.every((c) => c.conversationId === "2"));
});

test("una respuesta del motor CON `options` viaja como interactive al cliente y se reporta en sent[]", async () => {
  const calls = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text, templateParams, interactive) {
      calls.push({ conversationId, text, templateParams, interactive });
      return { id: calls.length };
    },
  };
  const options = [
    { title: "Horarios", value: "horarios" },
    { title: "Servicios", value: "servicios" },
    { title: "Hablar con Sergio", value: "hablar con una persona" },
  ];
  const fakeRunTurn = async () => ({
    ok: true,
    duplicate: false,
    send: [{ text: "¡Hola! ¿En qué te ayudo?", options }, { text: "texto plano sin botones" }],
    warnings: [],
  });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.deepEqual(calls[0].interactive, { items: options }, "los botones llegan al POST del cliente");
  assert.equal(calls[1].interactive, null, "la respuesta sin options sale plana");
  assert.deepEqual(result.sent[0].options, options, "sent[] lo reporta: un curl de verificacion los ve sin abrir el widget");
  assert.ok(!("options" in result.sent[1]));
});

test("saliente (eco del propio bot o de un humano en la UI): NO llama al motor ni al cliente — sin loop", async () => {
  const { calls, client } = fakeClient();
  let runTurnCalls = 0;
  const fakeRunTurn = async () => {
    runTurnCalls += 1;
    return { ok: true, duplicate: false, send: [{ text: "esto no deberia salir" }] };
  };

  const result = await runChatwootTurn(outgoingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(runTurnCalls, 0, "el motor ni se entera de un mensaje saliente");
  assert.equal(calls.length, 0, "no se postea nada: hubiera sido un loop");
  assert.equal(result.skipped, true);
  assert.match(result.reason, /^mensaje_no_entrante:outgoing$/);
});

test("duplicado (el motor ya lo proceso): no postea nada, pero ok sigue true", async () => {
  const { calls, client } = fakeClient();
  const fakeRunTurn = async () => ({ ok: true, duplicate: true, send: [] });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(result.sent.length, 0);
  assert.equal(calls.length, 0);
});

test("si el motor devuelve ok:false, no se postea nada", async () => {
  const { calls, client } = fakeClient();
  const fakeRunTurn = async () => ({ ok: false, send: [], error: "boom" });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(result.ok, false);
  assert.equal(calls.length, 0);
});

test("encendido en dos pasos (igual que Telegram): con dryRun:true el motor calcula la respuesta real, pero NO se postea", async () => {
  const { calls, client } = fakeClient();
  const fakeRunTurn = async () => ({ ok: true, duplicate: false, dryRun: true, send: [{ text: "M0 de verdad" }] });

  const result = await runChatwootTurn(incomingFixture(), { runTurn: fakeRunTurn, client });

  assert.equal(calls.length, 0, "nada llega a la API real de Chatwoot en dry-run");
  assert.equal(result.sent.length, 1, "pero se reporta que se HABRIA mandado, para leerlo en el panel");
  assert.equal(result.sent[0].posted, false);
  assert.equal(result.sent[0].reason, "dry_run");
  assert.equal(result.sent[0].text, "M0 de verdad");
});

// ---------------------------------------------------------------------------
// 5. Integracion en proceso: runTurn REAL (bot-engine + persistencia en memoria),
//    solo el fetch de Chatwoot mockeado. Prueba punta a punta el anti-loop y el dedup.
// ---------------------------------------------------------------------------

/** Store en memoria con dedup REAL por message_key (igual contrato que persistence.mjs). */
function memoryStore() {
  let saved = null;
  const seenMessageKeys = new Set();
  return {
    get state() {
      return saved;
    },
    store: {
      enabled: true,
      warnings: [],
      async ensureConversation(seed) {
        // Mismo contrato que persistence.mjs: para una conversación NUEVA se devuelve la fila
        // recién insertada, y `null` significa una sola cosa — la base no contestó. El turno usa
        // esa diferencia para decidir si puede ESCRIBIR el estado (run-turn.mjs `guardarEstado`).
        if (!saved) saved = createState(seed);
        return saved;
      },
      async claimInbound(message) {
        if (seenMessageKeys.has(message.messageKey)) return false;
        seenMessageKeys.add(message.messageKey);
        return true;
      },
      async applySideEffects(effects, state) {
        return {
          leadKey: (effects || []).some((e) => e.type === "lead_upsert") ? leadKeyFor(state.conversationKey) : state.leadKey || null,
          reviewKeys: [],
          auditKeys: [],
          deferred: (effects || []).filter((e) => ["notify_sergio", "calendar_event", "llm_request", "stage_change"].includes(e.type)),
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

test("integracion punta a punta: DEMO real dispara M0 y se postea via la API de Chatwoot mockeada", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text) {
      posted.push({ conversationId, text });
      return { id: posted.length };
    },
  };

  const result = await runChatwootTurn(incomingFixture({ content: "DEMO" }), {
    store: fake.store,
    config: CONFIG,
    nowIso: "2026-07-27T14:05:00Z",
    llm: async () => "",
    client,
  });

  assert.equal(result.ok, true);
  assert.equal(result.duplicate, false);
  assert.equal(posted.length, 1);
  assert.equal(posted[0].conversationId, "2");
  assert.match(posted[0].text, /asistente automático/);
  assert.equal(fake.state.botStage, "esperando_horario");
});

test("integracion punta a punta: el ECO del mensaje que el bot acaba de mandar NO reinicia nada (sin loop)", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text) {
      posted.push({ conversationId, text });
      return { id: posted.length };
    },
  };
  const deps = { store: fake.store, config: CONFIG, nowIso: "2026-07-27T14:05:00Z", llm: async () => "", client };

  const uno = await runChatwootTurn(incomingFixture({ content: "DEMO" }), deps);
  assert.equal(posted.length, 1, "el bot mando M0");

  // Chatwoot manda su PROPIO webhook message_created por lo que el bot acaba de postear
  // (mismo texto, message_type outgoing, sender tipo 'user' porque se posteo con el token de
  // la cuenta) — esto es EXACTAMENTE lo que se vio en vivo al capturar el webhook real.
  const eco = outgoingFixture({ id: 15, content: posted[0].text });
  const dos = await runChatwootTurn(eco, deps);

  assert.equal(dos.skipped, true, "el eco se ignora: el motor ni se entera");
  assert.equal(posted.length, 1, "sigue en 1: no se poste dos veces, no hay loop");
  assert.equal(fake.state.botStage, "esperando_horario", "el estado no se toco con el eco");
});

test("integracion punta a punta: reenviar el MISMO webhook (reintento de Chatwoot) no duplica el envio", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = {
    warnings: [],
    async sendMessage(conversationId, text) {
      posted.push({ conversationId, text });
      return { id: posted.length };
    },
  };
  const deps = { store: fake.store, config: CONFIG, nowIso: "2026-07-27T14:05:00Z", llm: async () => "", client };
  const payload = incomingFixture({ content: "DEMO" });

  const uno = await runChatwootTurn(payload, deps);
  const reintento = await runChatwootTurn(payload, deps); // Chatwoot reintenta el mismo webhook

  assert.equal(uno.duplicate, false);
  assert.equal(reintento.duplicate, true, "mismo message_key -> el dedup de run-turn.mjs lo corta");
  assert.equal(posted.length, 1, "no se mando dos veces por el reintento");
});

// ---------------------------------------------------------------------------
// 5b. EL TRASPASO, PUNTA A PUNTA HASTA LA FACTURA
//
// Lo que un humano manda desde Chatwoot lo cobra Meta igual que lo del bot, pero la fila que
// quedaba era un placeholder ENTRANTE (`direction = 'inbound'`, `author = 'contact'`) y el medidor
// filtra `direction = 'outbound'`: se facturaba media bolsa. Verificado en la base del VPS el
// 2026-08-13 con los mensajes 30 y 31 — las dos unicas plantillas reales que existieron.
//
// Estas pruebas NO usan el store de mentira: corren el store REAL contra un Supabase de juguete,
// asi que la fila que se mira es la que de verdad se escribiria. Y despues se la pasa al medidor.
// ---------------------------------------------------------------------------

/**
 * Supabase de juguete: guarda UNA conversacion y las filas de bot_messages con el mismo
 * `on_conflict=message_key, ignore-duplicates` de la tabla real (por eso sirve para probar dedup).
 */
function supabaseDeJuguete() {
  const requests = [];
  let conversacion = null;
  const mensajes = [];
  const fetchImpl = async (url, init = {}) => {
    const method = init.method || "GET";
    const body = init.body ? JSON.parse(init.body) : null;
    requests.push({ url: String(url), method, body });

    let rows;
    if (String(url).includes("bot_messages")) {
      // Append-only con clave unica: lo que ya esta NO se inserta de nuevo y PostgREST devuelve []
      // (que es como claimInbound se entera de que el mensaje ya se proceso).
      const nuevas = (Array.isArray(body) ? body : [body]).filter(
        (fila) => !mensajes.some((vieja) => vieja.message_key === fila.message_key),
      );
      mensajes.push(...nuevas);
      rows = nuevas;
    } else if (method === "GET") {
      rows = conversacion ? [conversacion] : [];
    } else {
      conversacion = { ...(conversacion || {}), ...body }; // POST = alta · PATCH = update
      rows = [conversacion];
    }
    return { ok: true, status: 200, text: async () => JSON.stringify(rows) };
  };
  return {
    requests,
    mensajes,
    get conversacion() {
      return conversacion;
    },
    store: createStore({ url: "https://sb.test", key: "service-role-fake", fetch: fetchImpl }),
  };
}

function clienteDeMentira() {
  const posted = [];
  return { posted, client: { warnings: [], async sendMessage(id, text) { posted.push({ id, text }); return { id: posted.length }; } } };
}

test("TRASPASO punta a punta: la fila queda CONTABLE y con la categoria real de la plantilla", async () => {
  const db = supabaseDeJuguete();
  const { posted, client } = clienteDeMentira();

  await conIdentidadDelBot(3, () =>
    runChatwootTurn(plantillaFixture("seguimiento_demo"), {
      store: db.store,
      config: CONFIG,
      nowIso: "2026-08-13T21:02:41Z",
      llm: async () => "",
      client,
    }),
  );

  assert.equal(db.mensajes.length, 1, "el traspaso deja UNA fila");
  const fila = db.mensajes[0];

  // 1. Lo que el medidor mira para decidir si cuenta.
  assert.equal(fila.direction, "outbound", "salio de nosotros: si dice inbound, no se factura nunca");
  assert.equal(fila.author, "human", "lo escribio Sergio, no el prospecto ni el bot");
  assert.equal(fila.delivery_status, "sent", "Chatwoot acepto el POST — eso es todo lo que sabemos");
  assert.equal(esCobrable(fila), true, "EL PUNTO DE TODO ESTO: el medidor lo cuenta");

  // 2. Y en que balde cae: marketing cuesta 6,5x lo que servicio.
  assert.equal(fila.raw.templateName, "seguimiento_demo");
  assert.deepEqual(clasificar(fila), {
    categoria: "marketing",
    templateKey: "M3_PLANTILLA",
    templateName: "seguimiento_demo",
  });

  // 3. El candado intacto: MISMA clave de dedup que antes del arreglo. El "chatwoot:" repetido no
  // es un error de copia — es el canal que antepone el motor a la clave del canal, y es
  // exactamente lo que hay guardado en produccion (`chatwoot:chatwoot:takeover:11:30`).
  assert.equal(fila.message_key, "chatwoot:chatwoot:takeover:2:30");
  assert.equal(posted.length, 0, "el bot no contesta encima del humano");
});

test("TRASPASO con plantilla que nadie registro: alarma, NO servicio barato", async () => {
  const db = supabaseDeJuguete();
  const { client } = clienteDeMentira();

  await conIdentidadDelBot(3, () =>
    runChatwootTurn(plantillaFixture("promo_navidad_2027"), {
      store: db.store,
      config: CONFIG,
      nowIso: "2026-08-13T21:02:41Z",
      llm: async () => "",
      client,
    }),
  );

  const { categoria, templateName } = clasificar(db.mensajes[0]);
  assert.equal(categoria, "plantilla_sin_tarifa", "sin tarifa registrada NO se asume la mas barata");
  assert.equal(templateName, "promo_navidad_2027", "y se dice cual es, para poder registrarla");
});

test("TRASPASO: el mensaje libre de un humano se cuenta como servicio (no toda la bandeja es plantilla)", async () => {
  const db = supabaseDeJuguete();
  const { client } = clienteDeMentira();

  await conIdentidadDelBot(3, () =>
    runChatwootTurn(outgoingFixture({ id: 31, sender: { id: 2, name: "OnIA", type: "user" } }), {
      store: db.store,
      config: CONFIG,
      nowIso: "2026-08-13T21:02:41Z",
      llm: async () => "",
      client,
    }),
  );

  const fila = db.mensajes[0];
  assert.equal(esCobrable(fila), true);
  assert.equal(clasificar(fila).categoria, "servicio");
  assert.equal(fila.raw.templateName, undefined, "no salio con plantilla: no se inventa una");
});

test("TRASPASO: despues de que un humano contesta, el bot SIGUE CALLADO", async () => {
  const db = supabaseDeJuguete();
  const { posted, client } = clienteDeMentira();
  const deps = { store: db.store, config: CONFIG, nowIso: "2026-08-13T21:02:41Z", llm: async () => "", client };

  await conIdentidadDelBot(3, () => runChatwootTurn(plantillaFixture("seguimiento_demo"), deps));
  // De ACA sale el silencio: la columna que el motor lee en el turno siguiente (bot-engine barrera 1).
  assert.equal(db.conversacion.human_took_over, true, "el traspaso queda marcado en bot_conversations");

  // Y ahora el prospecto escribe DEMO, que en cualquier otra conversacion dispara M0.
  const despues = await conIdentidadDelBot(3, () =>
    runChatwootTurn(incomingFixture({ id: 32, content: "DEMO" }), deps),
  );

  assert.equal(posted.length, 0, "el bot NO le habla encima al humano");
  assert.deepEqual(despues.sent, []);
  assert.equal(db.mensajes.length, 2, "el entrante se registra igual (dedup), pero sin respuesta");
  assert.equal(db.mensajes[1].direction, "inbound", "lo del prospecto sigue siendo entrante y no se cobra");
  assert.equal(esCobrable(db.mensajes[1]), false);
});

test("TRASPASO: el MISMO webhook dos veces no duplica la fila (el candado no se toco)", async () => {
  const db = supabaseDeJuguete();
  const { client } = clienteDeMentira();
  const deps = { store: db.store, config: CONFIG, nowIso: "2026-08-13T21:02:41Z", llm: async () => "", client };
  const payload = plantillaFixture("seguimiento_demo");

  const uno = await conIdentidadDelBot(3, () => runChatwootTurn(payload, deps));
  const dos = await conIdentidadDelBot(3, () => runChatwootTurn(payload, deps)); // Chatwoot reintenta

  assert.equal(uno.duplicate, false);
  assert.equal(dos.duplicate, true, "mismo message_key -> el dedup lo corta");
  assert.equal(db.mensajes.length, 1, "una sola fila: si no, se factura dos veces el mismo envio");
});

// ---------------------------------------------------------------------------
// NOTAS DE VOZ — el agujero de comprension mas grande que tenia el bot
//
// En Bolivia una parte enorme del WhatsApp son notas de voz. Hasta hoy el bot contestaba
// "¿me lo escribís?" y ahi se perdia el prospecto. Lo que se prueba: que el texto transcrito
// entre al motor COMO SI LO HUBIERA ESCRITO (el guion sigue igual: califica, agenda), y que
// cuando Speaches falla el bot igual conteste algo en vez de quedarse mudo.
// ---------------------------------------------------------------------------

/** Webhook real de una nota de voz: sin `content`, con un adjunto file_type "audio". */
function voiceFixture(overrides = {}) {
  return incomingFixture({
    id: 21,
    content: "",
    attachments: [
      {
        id: 7,
        message_id: 21,
        file_type: "audio",
        extension: "oga",
        file_size: 34_298,
        data_url: "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/rails/active_storage/blobs/redirect/abc/nota.oga",
      },
    ],
    ...overrides,
  });
}

test("los adjuntos viajan en meta (el motor es puro: no baja archivos)", () => {
  const parsed = parseChatwootWebhook(voiceFixture());
  assert.equal(parsed.turn.kind, "voice");
  assert.equal(parsed.meta.attachments.length, 1);
  assert.equal(parsed.meta.attachments[0].file_type, "audio");
  assert.equal(parsed.turn.attachments, undefined, "el turno es lo que ve el motor; los archivos no son asunto suyo");
});

test("VOZ: la transcripcion entra como `transcript` y el guion sigue normal (califica, no pide texto)", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = { warnings: [], async sendMessage(id, text) { posted.push(text); return { id: posted.length }; } };

  const result = await runChatwootTurn(voiceFixture(), {
    store: fake.store,
    config: CONFIG,
    nowIso: "2026-07-27T14:05:00Z",
    llm: async () => "",
    client,
    transcribeAudio: async () => ({ ok: true, text: "DEMO", reason: "transcrito", warnings: [] }),
  });

  assert.equal(result.voice.transcribed, true);
  assert.equal(result.voice.chars, 4);
  assert.equal(posted.length, 1, "un audio entendido tiene que disparar el guion, no una disculpa");
  assert.ok(!/No me llegó bien el audio/.test(posted[0]), `el bot volvio a pedir texto: ${posted[0]}`);
  assert.match(posted[0], /¿Cuál le va mejor\?/, "el audio 'DEMO' tiene que disparar M0, igual que el texto");
  assert.equal(fake.state.botStage, "esperando_horario", "el audio hizo avanzar el embudo igual que un texto");
});

test("VOZ: el `transcript` es lo que se le pasa al motor, y `kind` sigue siendo voice en la bitacora", async () => {
  let visto = null;
  await runChatwootTurn(voiceFixture(), {
    runTurn: async (turn) => {
      visto = turn;
      return { ok: true, send: [], warnings: [] };
    },
    client: { warnings: [], async sendMessage() { return {}; } },
    transcribeAudio: async () => ({ ok: true, text: "hola, tengo una clinica dental", reason: "transcrito", warnings: [] }),
  });

  assert.equal(visto.transcript, "hola, tengo una clinica dental");
  assert.equal(visto.kind, "voice", "decir que fue texto seria mentirle a la bitacora");
  assert.equal(visto.text, "", "el texto original venia vacio: no se pisa, se agrega el transcript");
});

test("VOZ: la transcripcion recibe el adjunto, el token y la base de Chatwoot", async () => {
  let recibido = null;
  await runChatwootTurn(voiceFixture(), {
    token: "tok-secreto",
    baseUrl: "http://onia-chatbot_chatwoot:3000",
    runTurn: async () => ({ ok: true, send: [], warnings: [] }),
    client: { warnings: [], async sendMessage() { return {}; } },
    transcribeAudio: async (options) => {
      recibido = options;
      return { ok: false, text: "", reason: "stt_fallido", warnings: [] };
    },
  });

  assert.equal(recibido.attachments[0].file_type, "audio");
  assert.equal(recibido.token, "tok-secreto");
  assert.equal(recibido.chatwootBaseUrl, "http://onia-chatbot_chatwoot:3000");
});

test("VOZ QUE FALLA: cae a M_AUDIO_FAIL — el prospecto NUNCA se queda sin respuesta", async () => {
  const fake = memoryStore();
  const posted = [];
  const client = { warnings: [], async sendMessage(id, text) { posted.push(text); return { id: posted.length }; } };

  const result = await runChatwootTurn(voiceFixture(), {
    store: fake.store,
    config: CONFIG,
    nowIso: "2026-07-27T14:05:00Z",
    llm: async () => "",
    client,
    transcribeAudio: async () => ({ ok: false, text: "", reason: "stt_fallido", warnings: ["audio: Speaches no respondio"] }),
  });

  assert.equal(result.ok, true, "que se rompa el audio no puede romper el turno");
  assert.equal(result.voice.transcribed, false);
  assert.equal(result.voice.reason, "stt_fallido");
  assert.equal(posted.length, 1, "el prospecto tiene que recibir ALGO");
  assert.match(posted[0], /escrib/i, "el fallback sigue siendo el M_AUDIO_FAIL de siempre");
  assert.match(result.warnings.join(" "), /sin transcripción/);
});

test("VOZ: si la transcripcion TIRA, el turno sigue (fail-open, no 500)", async () => {
  const posted = [];
  const result = await runChatwootTurn(voiceFixture(), {
    store: memoryStore().store,
    config: CONFIG,
    nowIso: "2026-07-27T14:05:00Z",
    llm: async () => "",
    client: { warnings: [], async sendMessage(id, text) { posted.push(text); return {}; } },
    transcribeAudio: async () => { throw new Error("speaches exploto"); },
  }).catch((error) => ({ tiro: String(error.message) }));

  assert.ok(!result.tiro, `runChatwootTurn dejo escapar una excepcion: ${result.tiro}`);
  assert.equal(posted.length, 1, "el prospecto igual recibe el M_AUDIO_FAIL");
});

test("UN TEXTO NORMAL no gasta una transcripcion", async () => {
  let llamadas = 0;
  await runChatwootTurn(incomingFixture({ content: "DEMO" }), {
    runTurn: async () => ({ ok: true, send: [], warnings: [] }),
    client: { warnings: [], async sendMessage() { return {}; } },
    transcribeAudio: async () => { llamadas += 1; return { ok: true, text: "x", reason: "transcrito", warnings: [] }; },
  });
  assert.equal(llamadas, 0, "transcribir un mensaje escrito seria 30 s de espera regalados");
});

test("UNA FOTO no se manda a transcribir (no es voz)", async () => {
  let llamadas = 0;
  const result = await runChatwootTurn(voiceFixture({ attachments: [{ file_type: "image", data_url: "https://x/y.png" }] }), {
    runTurn: async () => ({ ok: true, send: [], warnings: [] }),
    client: { warnings: [], async sendMessage() { return {}; } },
    transcribeAudio: async () => { llamadas += 1; return { ok: true, text: "x", reason: "transcrito", warnings: [] }; },
  });
  assert.equal(llamadas, 0);
  assert.equal(result.voice, null, "voice:null = no era un audio, distinto de 'era y fallo'");
});

test("VOZ en conversation_created: el primer mensaje tambien se transcribe", () => {
  // Chatwoot manda los DOS eventos cuando alguien abre la conversacion con una nota de voz. Si
  // los adjuntos no viajaran por este camino, el primer audio de cada prospecto se perderia.
  const parsed = parseChatwootWebhook({
    event: "conversation_created",
    id: 9,
    inbox_id: 3,
    messages: [
      {
        id: 31,
        content: "",
        message_type: 0,
        private: false,
        created_at: 1785565643,
        attachments: [{ id: 3, file_type: "audio", data_url: "https://cw/rails/x/nota.oga", file_size: 14296 }],
      },
    ],
  });

  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.kind, "voice");
  assert.equal(parsed.meta.attachments[0].file_type, "audio");
});

test("VOZ: un transcriptor que devuelve basura tampoco tumba el turno", async () => {
  const posted = [];
  const result = await runChatwootTurn(voiceFixture(), {
    store: memoryStore().store,
    config: CONFIG,
    nowIso: "2026-07-27T14:05:00Z",
    llm: async () => "",
    client: { warnings: [], async sendMessage(id, text) { posted.push(text); return {}; } },
    transcribeAudio: async () => undefined,
  });

  assert.equal(result.ok, true);
  assert.equal(result.voice.transcribed, false);
  assert.equal(posted.length, 1, "el prospecto igual recibe el M_AUDIO_FAIL");
});

// ---------------------------------------------------------------------------
// delivery_status HONESTO (fix del handoff 2026-08-23, ejecutado 2026-08-29)
// ---------------------------------------------------------------------------
// insertOutbound escribe "sent" ANTES del POST real (bot-engine decide el estado
// sin I/O, por contrato). Si Chatwoot rechaza el POST, la fila mentia para
// siempre — el bot estuvo mudo semanas sin que ninguna consulta lo delatara.
// Ahora el adapter cierra el circuito con markMessageDelivered tras CADA envio.

function fakeStore() {
  const marks = [];
  return {
    marks,
    async markMessageDelivered(key, status, externalId = null) {
      marks.push({ key, status, externalId });
      return true;
    },
  };
}

test("delivery honesto: Chatwoot rechaza el POST → la fila pasa a failed (la mentira muere acá)", async () => {
  const store = fakeStore();
  const client = { warnings: [], sendMessage: async () => null }; // null = rechazo tolerante del cliente
  const result = await runChatwootTurn(incomingFixture(), {
    client,
    store,
    runTurn: async () => ({
      ok: true,
      duplicate: false,
      dryRun: false,
      send: [{ text: "hola", messageKey: "out:chatwoot:9:3" }],
      warnings: [],
    }),
  });
  assert.equal(result.sent[0].posted, false);
  assert.deepEqual(store.marks, [{ key: "out:chatwoot:9:3", status: "failed", externalId: null }]);
});

test("delivery honesto: POST aceptado → confirma sent con el id externo del mensaje", async () => {
  const store = fakeStore();
  const client = { warnings: [], sendMessage: async () => ({ id: 777 }) };
  await runChatwootTurn(incomingFixture(), {
    client,
    store,
    runTurn: async () => ({
      ok: true,
      duplicate: false,
      dryRun: false,
      send: [{ text: "hola", messageKey: "out:chatwoot:9:4" }],
      warnings: [],
    }),
  });
  assert.deepEqual(store.marks, [{ key: "out:chatwoot:9:4", status: "sent", externalId: 777 }]);
});

test("delivery honesto: en dry run NO se marca nada (no hubo intento real)", async () => {
  const store = fakeStore();
  const client = { warnings: [], sendMessage: async () => ({ id: 1 }) };
  await runChatwootTurn(incomingFixture(), {
    client,
    store,
    runTurn: async () => ({
      ok: true,
      duplicate: false,
      dryRun: true,
      send: [{ text: "hola", messageKey: "out:chatwoot:9:5" }],
      warnings: [],
    }),
  });
  assert.deepEqual(store.marks, [], "dry run: la fila queda como la dejo insertOutbound (skipped)");
});

test("delivery honesto: una reply sin messageKey no marca (y no revienta el turno)", async () => {
  const store = fakeStore();
  const client = { warnings: [], sendMessage: async () => ({ id: 2 }) };
  const result = await runChatwootTurn(incomingFixture(), {
    client,
    store,
    runTurn: async () => ({ ok: true, duplicate: false, dryRun: false, send: [{ text: "hola" }], warnings: [] }),
  });
  assert.equal(result.ok, true);
  assert.deepEqual(store.marks, []);
});

test("delivery honesto: run-turn expone el messageKey en send[] (el eslabon que faltaba)", async () => {
  // Test de contrato sobre run-turn real: el map de send debe llevar messageKey.
  // Store REAL sin env: apagado por diseño (cero red) — la fake perfecta.
  const { runTurn } = await import("./run-turn.mjs");
  const { createStore } = await import("./persistence.mjs");
  const out = await runTurn(
    { channel: "sim", conversationId: "sim-keytest", text: "hola", messageId: "m1" },
    { store: createStore({ url: "", serviceKey: "" }) },
  );
  assert.ok(Array.isArray(out.send) && out.send.length > 0, "el saludo sim genera respuesta");
  assert.match(String(out.send[0].messageKey || ""), /^out:/, "send[] lleva el messageKey de la fila");
});

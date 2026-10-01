// ---------------------------------------------------------------------------
// boton-del-recordatorio-lo-contesta-la-plataforma.test.mjs
//
// QUE FIJA. Cuando el paciente toca «Confirmar», «Cancelar» o «Reprogramar» en el recordatorio de
// cita que sale desde el WhatsApp de un NEGOCIO CLIENTE, el bot NO contesta: lo hace la plataforma
// (`onia-platform/lib/whatsapp/respuesta-al-recordatorio.ts`), que cambia la cita y le responde en
// la misma conversacion. El bot salta el turno con `reason: "boton_del_recordatorio"`, el mismo
// mecanismo de `skip` que el resto, y el reenvio a la plataforma SIGUE saliendo.
//
// POR QUE EXISTE. Chatwoot 4.12.1 entrega el toque como un `message_created` entrante comun con
// SOLO el texto del boton. Sin este corte el paciente recibe dos respuestas: la de la plataforma
// y la de un LLM improvisando sobre la palabra «Cancelar».
//
// LA MITAD QUE PROTEGE, y por eso hay tantos casos de "NO saltea": callarse cuando la plataforma
// tampoco contesta es dejar a la persona sola. La plataforma no hace nada en los inboxes de Onia,
// en el huerfano, en el conflicto ni sin telefono — ahi el bot sigue como siempre.
//
// No hay red real: el GET /published del producto y Chatwoot se inyectan siempre.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import { esBotonDelRecordatorio, runChatwootTurn } from "./chatwoot-adapter.mjs";
import {
  KNOWLEDGE_SCHEMA,
  ensureKnowledge,
  esInboxDeCliente,
  getOrgKnowledge,
  resetKnowledgeCache,
  resetOrgKnowledgeCache,
} from "./knowledge.mjs";
import { formatearTraza, handleChatwootWebhook, WEBHOOK_PATH } from "./webhook-server.mjs";
import { _resetDedup } from "./message-dedup.mjs";

// ---------------------------------------------------------------------------
// El producto de mentira: un inbox por cada respuesta posible de GET /published
// ---------------------------------------------------------------------------

const INBOX_CLIENTE_CON_DOC = "21"; // 200 con la fila publicada de la org cliente
const INBOX_CLIENTE_SIN_DOC = "22"; // 404 CON organizationId: cliente con el add-on apagado
const INBOX_ONIA = "5"; // 200 pero es la org INTERNA de Onia (WhatsApp de ventas)
const INBOX_ONIA_SIN_FILA = "4"; // 404 CON la org INTERNA: Onia sin fila del panel publicada
const INBOX_HUERFANO = "99"; // 404 SIN organizationId: no es de nadie
const INBOX_CONFLICTO = "88"; // 409: dos orgs lo reclaman
const INBOX_RED_CAIDA = "66"; // el producto no contesta

const ORG_INTERNA = "org_onia_interna";

function documento(productName) {
  return { schema: KNOWLEDGE_SCHEMA, version: "test.1", updatedBy: "test", identity: { productName } };
}

function productoFalso() {
  const fetch = async (url) => {
    const u = String(url);
    fetch.calls.push(u);
    const responder = (status, cuerpo) => ({ ok: status < 400, status, json: async () => cuerpo });
    if (u.includes(`organizationId=${ORG_INTERNA}`)) {
      return responder(200, { organizationId: ORG_INTERNA, data: documento("Onia") });
    }
    if (u.includes(`inboxId=${INBOX_CLIENTE_CON_DOC}`)) {
      return responder(200, { organizationId: "org_cliente_dental", data: documento("Clínica Sonrisa") });
    }
    if (u.includes(`inboxId=${INBOX_CLIENTE_SIN_DOC}`)) {
      return responder(404, { error: "Sin conocimiento publicado", organizationId: "org_cliente_estetica" });
    }
    if (u.includes(`inboxId=${INBOX_ONIA_SIN_FILA}`)) {
      return responder(404, { error: "Sin conocimiento publicado", organizationId: ORG_INTERNA });
    }
    if (u.includes(`inboxId=${INBOX_ONIA}`)) {
      return responder(200, { organizationId: ORG_INTERNA, data: documento("Onia") });
    }
    if (u.includes(`inboxId=${INBOX_HUERFANO}`)) return responder(404, { error: "Inbox sin organización" });
    if (u.includes(`inboxId=${INBOX_CONFLICTO}`)) return responder(409, { error: "Inbox en conflicto", conflicto: true });
    if (u.includes(`inboxId=${INBOX_RED_CAIDA}`)) throw new Error("connect ECONNREFUSED");
    return responder(404, {});
  };
  fetch.calls = [];
  return fetch;
}

/** Lo que en produccion sale del entorno (ONIA_BOT_KNOWLEDGE_URL, ONIA_KNOWLEDGE_URL, el Bearer). */
function conocimiento(fetch = productoFalso()) {
  return {
    dbUrl: "http://producto/api/chatbot-knowledge/published",
    dbSecret: "s3cr3t",
    panelUrl: `http://producto/api/chatbot-knowledge/published?organizationId=${ORG_INTERNA}`,
    panelSecret: "s3cr3t",
    path: "/no/existe/knowledge.json",
    fetch,
  };
}

// ---------------------------------------------------------------------------
// El motor y Chatwoot de mentira: lo unico que se mira es SI se les llamo
// ---------------------------------------------------------------------------

function motorQueCuenta() {
  const runTurn = async (turn) => {
    runTurn.turnos.push(turn);
    return { ok: true, duplicate: false, send: [{ text: "respuesta del bot" }], notify: [], warnings: [] };
  };
  runTurn.turnos = [];
  return runTurn;
}

function chatwootQueCuenta() {
  const client = {
    warnings: [],
    enviados: [],
    async sendMessage(conversationId, text) {
      client.enviados.push({ conversationId, text });
      return { id: 1 };
    },
  };
  return client;
}

/** `message_created` entrante de WhatsApp: el toque llega asi, con el telefono que da Meta. */
function toque(content, { inbox = INBOX_CLIENTE_CON_DOC, phone = "+59171234567", id = 501, conv = 301 } = {}) {
  return {
    event: "message_created",
    id,
    content,
    content_type: "text",
    message_type: "incoming",
    private: false,
    created_at: "2026-10-01T13:00:00Z",
    sender: { id: 40, name: "Paciente Prueba", phone_number: phone, type: "contact" },
    inbox: { id: Number(inbox), name: "WhatsApp del negocio", channel_type: "Channel::Whatsapp" },
    account: { id: 2 },
    conversation: { id: conv, inbox_id: Number(inbox) },
  };
}

async function correr(payload, opciones = {}) {
  const runTurn = motorQueCuenta();
  const client = chatwootQueCuenta();
  const resultado = await runChatwootTurn(payload, {
    knowledge: conocimiento(opciones.fetch),
    runTurn,
    client,
    store: { markMessageDelivered: async () => {} },
  });
  return { resultado, runTurn, client };
}

function salteo(resultado) {
  return resultado.skipped === true && resultado.reason === "boton_del_recordatorio";
}

test.beforeEach(() => {
  resetKnowledgeCache();
  resetOrgKnowledgeCache();
  _resetDedup();
});

// ---------------------------------------------------------------------------
// 1. Que cuenta como toque (gemelo de `accionDelBoton` de la plataforma)
// ---------------------------------------------------------------------------

test("los tres textos de BOTONES_RECORDATORIO de la plataforma son toques, tal cual se escriben alla", () => {
  for (const texto of ["Confirmar", "Cancelar", "Reprogramar"]) {
    assert.equal(esBotonDelRecordatorio(texto), true, texto);
  }
});

test("tolera mayusculas, tildes, espacios y signos — nada mas", () => {
  for (const texto of ["CONFIRMAR!", "Confirmár", "  cancelar  ", "Reprogramar.", "¡Cancelar!", "re-programar"]) {
    assert.equal(esBotonDelRecordatorio(texto), true, `«${texto}» es un toque`);
  }
});

test("una FRASE no es un toque, aunque contenga la palabra", () => {
  for (const texto of [
    "no puedo confirmar todavía",
    "quiero cancelar mi cita",
    "confirmar por favor",
    "confirmado",
    "cancela",
    "",
    "   ",
  ]) {
    assert.equal(esBotonDelRecordatorio(texto), false, `«${texto}» NO es un toque`);
  }
  assert.equal(esBotonDelRecordatorio(null), false);
  assert.equal(esBotonDelRecordatorio(undefined), false);
  assert.equal(esBotonDelRecordatorio(42), false);
});

// ---------------------------------------------------------------------------
// 2. De quien es el inbox: la pregunta que hace la plataforma antes de contestar
// ---------------------------------------------------------------------------

test("esInboxDeCliente: solo una org cliente sin dudas; huerfano, conflicto y error no lo son", () => {
  assert.equal(esInboxDeCliente({ source: "db", data: {} }), true, "fila publicada de una org cliente");
  assert.equal(esInboxDeCliente({ ajena: true, organizationId: "org_x" }), true, "cliente sin documento hoy");
  assert.equal(esInboxDeCliente({ huerfano: true }), false, "de nadie: la plataforma tampoco contesta");
  assert.equal(esInboxDeCliente({ ajena: true, conflicto: true }), false, "dos dueños: la plataforma tampoco");
  assert.equal(
    esInboxDeCliente({ ajena: true, conflicto: true, organizationId: "org_x" }),
    false,
    "el conflicto manda aunque algun dia el 409 traiga a un reclamante",
  );
  assert.equal(esInboxDeCliente({ ajena: true, organizationId: null }), false, "ajena sin org no se afirma");
  assert.equal(esInboxDeCliente({ source: "db", huerfano: true }), false, "copia vieja de un inbox que ya no es de nadie");
  assert.equal(esInboxDeCliente({ source: "db", error: "no se pudo leer la db" }), false, "la plataforma no contesto");
  assert.equal(esInboxDeCliente({ source: "panel" }), false, "el conocimiento de venta de Onia");
  assert.equal(
    esInboxDeCliente({ ajena: true, organizationId: ORG_INTERNA }, conocimiento()),
    false,
    "la org INTERNA sin fila publicada no es un cliente: el 404 no la filtra como el 200",
  );
  assert.equal(esInboxDeCliente({ source: "file" }), false);
  assert.equal(esInboxDeCliente(null), false);
});

// ---------------------------------------------------------------------------
// 3. El turno: saltea en el cliente, contesta en todos los demas
// ---------------------------------------------------------------------------

test("toque exacto en el inbox de un cliente: saltea con su motivo, sin motor y sin postear", async () => {
  const { resultado, runTurn, client } = await correr(toque("Confirmar"));
  assert.equal(resultado.ok, true);
  assert.equal(resultado.skipped, true);
  assert.equal(resultado.reason, "boton_del_recordatorio");
  assert.deepEqual(resultado.sent, []);
  assert.equal(runTurn.turnos.length, 0, "el motor ni se entera: no reclama la clave, no gasta LLM, no avisa");
  assert.equal(client.enviados.length, 0, "la respuesta es de la plataforma, no del bot");
});

test("cliente con el add-on apagado (404 CON organizationId) tambien saltea: la plataforma igual contesta", async () => {
  const { resultado, runTurn } = await correr(toque("Cancelar", { inbox: INBOX_CLIENTE_SIN_DOC }));
  assert.ok(salteo(resultado), JSON.stringify(resultado));
  assert.equal(runTurn.turnos.length, 0);
});

test("las variantes del toque saltean en el cliente («CONFIRMAR!», «Confirmár», «Reprogramar.»)", async () => {
  for (const texto of ["CONFIRMAR!", "Confirmár", "Reprogramar."]) {
    // eslint-disable-next-line no-await-in-loop -- cada caso con su cache limpia
    const { resultado, runTurn } = await correr(toque(texto));
    assert.ok(salteo(resultado), `«${texto}»: ${JSON.stringify(resultado)}`);
    assert.equal(runTurn.turnos.length, 0, texto);
    resetOrgKnowledgeCache();
  }
});

test("el MISMO texto en el inbox de Onia NO saltea: alla la plataforma no hace nada y contesta el bot", async () => {
  const { resultado, runTurn, client } = await correr(toque("Cancelar", { inbox: INBOX_ONIA }));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1, "el prospecto de ventas que dice «Cancelar» lo atiende el agente");
  assert.equal(client.enviados.length, 1);
});

test("inbox de Onia cuya org interna no tiene fila publicada (404 con la org interna) NO saltea", async () => {
  const { resultado, runTurn } = await correr(toque("Confirmar", { inbox: INBOX_ONIA_SIN_FILA }));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
});

test("una frase que contiene la palabra NO saltea, ni en el inbox de un cliente", async () => {
  const { resultado, runTurn } = await correr(toque("no puedo confirmar todavía"));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
});

test("inbox huerfano NO saltea: la plataforma no tiene org para ese canal y no contesta", async () => {
  const { resultado, runTurn } = await correr(toque("Confirmar", { inbox: INBOX_HUERFANO }));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
});

test("inbox en conflicto NO saltea: la plataforma no elige dueño y no contesta", async () => {
  const { resultado, runTurn } = await correr(toque("Confirmar", { inbox: INBOX_CONFLICTO }));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
  // Y el 409 queda guardado CON NOMBRE, no deducido de un `organizationId` vacio.
  const estado = await ensureKnowledge({ inboxId: INBOX_CONFLICTO, ...conocimiento() });
  assert.equal(estado.conflicto, true);
});

test("con el producto caido NO saltea: no se sabe de quien es, y la plataforma tampoco esta para contestar", async () => {
  const { resultado, runTurn } = await correr(toque("Confirmar", { inbox: INBOX_RED_CAIDA }));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
});

test("un cliente que ANTES resolvia bien y ahora no contesta deja de saltear (la copia vieja no alcanza)", async () => {
  const fetch = productoFalso();
  const { resultado: antes } = await correr(toque("Confirmar"), { fetch });
  assert.ok(salteo(antes));
  // Se vence la copia: la lectura siguiente falla y el estado lo dice, aunque conserve el documento.
  const caido = async () => {
    throw new Error("connect ECONNREFUSED");
  };
  resetKnowledgeCache();
  const opciones = { ...conocimiento(caido), ttlMs: 0 };
  const runTurn = motorQueCuenta();
  await getOrgKnowledge(null, { ...opciones, inboxId: INBOX_CLIENTE_CON_DOC });
  const despues = await runChatwootTurn(toque("Confirmar", { id: 502 }), {
    knowledge: opciones,
    runTurn,
    client: chatwootQueCuenta(),
    store: { markMessageDelivered: async () => {} },
  });
  assert.equal(despues.skipped, false, "sin respuesta del producto, el bot no se calla");
  assert.equal(runTurn.turnos.length, 1);
});

test("sin telefono (el widget web de un cliente) NO saltea: la plataforma busca la cita por el numero", async () => {
  const { resultado, runTurn } = await correr(toque("Confirmar", { phone: "" }));
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
});

test("el click en un menu del PROPIO bot (message_updated) NO saltea: la plataforma no procesa ese evento", async () => {
  const payload = {
    event: "message_updated",
    id: 600,
    content: "Elegí una opción",
    content_type: "input_select",
    message_type: "outgoing",
    private: false,
    content_attributes: { items: [{ title: "Cancelar", value: "cancelar" }], submitted_values: [{ title: "Cancelar", value: "cancelar" }] },
    inbox: { id: Number(INBOX_CLIENTE_CON_DOC) },
    conversation: { id: 302, inbox_id: Number(INBOX_CLIENTE_CON_DOC) },
  };
  const { resultado, runTurn } = await correr(payload);
  assert.equal(resultado.skipped, false);
  assert.equal(runTurn.turnos.length, 1);
});

test("un mensaje que NO es toque ni pregunta de quien es el inbox (cero red extra en el camino comun)", async () => {
  const fetch = productoFalso();
  const runTurn = motorQueCuenta();
  await runChatwootTurn(toque("hola, quiero un turno"), {
    knowledge: conocimiento(fetch),
    runTurn,
    client: chatwootQueCuenta(),
    store: { markMessageDelivered: async () => {} },
  });
  assert.equal(fetch.calls.length, 0, "la resolucion la hace el turno, como siempre — no este corte");
  assert.equal(runTurn.turnos.length, 1);
});

// ---------------------------------------------------------------------------
// 4. El servidor: el salteo se VE en el log y la plataforma SIGUE enterandose
// ---------------------------------------------------------------------------

const SECRET = "secreto-de-prueba-no-va-al-repo";
const NOW_MS = Date.UTC(2026, 9, 1, 13, 0, 0);
const CONFIG = {
  webhookSecret: SECRET,
  pathSecret: undefined,
  toleranceSeconds: 300,
  allowUnsigned: false,
  maxBodyBytes: 1024 * 1024,
};

function firmado(payload) {
  const rawBody = JSON.stringify(payload);
  const ts = Math.floor(NOW_MS / 1000);
  const hex = createHmac("sha256", SECRET).update(`${ts}.${rawBody}`).digest("hex");
  return {
    rawBody,
    headers: { "x-chatwoot-timestamp": String(ts), "x-chatwoot-signature": `sha256=${hex}` },
    method: "POST",
    url: WEBHOOK_PATH,
  };
}

function depsDelServidor(fetch = productoFalso()) {
  const runTurn = motorQueCuenta();
  return {
    deps: {
      config: CONFIG,
      nowMs: NOW_MS,
      knowledge: conocimiento(fetch),
      runTurn,
      client: chatwootQueCuenta(),
      store: { markMessageDelivered: async () => {} },
    },
    runTurn,
  };
}

test("servidor: el toque en un cliente sale como `rama=ignorado motivo=boton_del_recordatorio` y SE REENVIA a la plataforma", async () => {
  const req = firmado(toque("Confirmar"));
  const { deps, runTurn } = depsDelServidor();
  const out = await handleChatwootWebhook(req, deps);

  assert.equal(out.status, 200);
  assert.equal(out.body.skipped, true);
  assert.equal(out.body.reason, "boton_del_recordatorio");
  // LA MITAD QUE IMPORTA: la plataforma se entera del toque POR ESTE reenvio. Sin el, la cita no
  // cambia y nadie le contesta al paciente.
  assert.equal(out.usoPlataforma, req.rawBody, "el reenvio a la plataforma sale igual, byte por byte");
  assert.equal(out.avisoTelegram ?? null, null, "un toque no es un handoff: no se le avisa a nadie");
  assert.equal(runTurn.turnos.length, 0);

  const linea = formatearTraza(out.traza);
  assert.match(linea, /rama=ignorado/);
  assert.match(linea, /motivo=boton_del_recordatorio/);
  assert.match(linea, /inbox=21/);
});

test("servidor: el reintento del MISMO toque no se reenvia dos veces (la plataforma contestaria dos veces)", async () => {
  const req = firmado(toque("Confirmar"));
  const { deps } = depsDelServidor();
  const primera = await handleChatwootWebhook(req, deps);
  const segunda = await handleChatwootWebhook(req, deps);
  assert.equal(primera.usoPlataforma, req.rawBody);
  assert.equal(segunda.body.reason, "mensaje_ya_procesado");
  assert.equal(segunda.usoPlataforma ?? null, null);
});

test("servidor: conversacion NUEVA — el `conversation_created` con el toque no le roba la clave al `message_created`", async () => {
  // El recordatorio sale por la Cloud API, no por Chatwoot: el toque suele ABRIR la conversacion,
  // y Chatwoot manda los dos eventos con la misma `message_key`. Solo el segundo viaja a la
  // plataforma, asi que si el primero consumia el dedup, la plataforma no se enteraba nunca.
  const mensaje = toque("Reprogramar", { id: 777, conv: 404 });
  const creada = {
    event: "conversation_created",
    id: 404,
    inbox_id: Number(INBOX_CLIENTE_CON_DOC),
    status: "open",
    messages: [
      {
        id: 777,
        content: "Reprogramar",
        message_type: 0,
        private: false,
        created_at: Math.floor(NOW_MS / 1000),
        sender: { id: 40, name: "Paciente Prueba", phone_number: "+59171234567", type: "contact" },
      },
    ],
  };
  const { deps, runTurn } = depsDelServidor();

  const primero = await handleChatwootWebhook(firmado(creada), deps);
  assert.equal(primero.body.reason, "boton_del_recordatorio", "el bot no contesta el toque embebido");
  assert.equal(primero.usoPlataforma ?? null, null, "conversation_created no se reenvia (la plataforma no lo procesa)");

  const reqMensaje = firmado(mensaje);
  const segundo = await handleChatwootWebhook(reqMensaje, deps);
  assert.equal(segundo.body.reason, "boton_del_recordatorio", "NO 'mensaje_ya_procesado'");
  assert.equal(segundo.usoPlataforma, reqMensaje.rawBody, "y la plataforma se entera del toque");
  assert.equal(runTurn.turnos.length, 0);
});

test("servidor: en el inbox de Onia el toque sigue siendo un turno normal, reenvio incluido", async () => {
  const req = firmado(toque("Cancelar", { inbox: INBOX_ONIA }));
  const { deps, runTurn } = depsDelServidor();
  const out = await handleChatwootWebhook(req, deps);
  assert.notEqual(out.body.skipped, true);
  assert.equal(runTurn.turnos.length, 1);
  assert.equal(out.usoPlataforma, req.rawBody);
});

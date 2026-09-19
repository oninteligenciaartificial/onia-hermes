import test from "node:test";
import assert from "node:assert/strict";

import {
  construirAviso,
  enviarAvisoTelegram,
  escaparHtml,
  getAvisoTelegramConfig,
  dispararAvisoTelegram,
  AVISO_MAX_CHARS,
} from "./aviso-telegram.mjs";

// ---------------------------------------------------------------------------
// construirAviso — que el aviso EXISTA cuando hay alguien esperando, y no cuando no
// ---------------------------------------------------------------------------

test("sin efectos notify no arma nada: el turno normal no molesta a nadie", () => {
  assert.equal(construirAviso({ notify: [], conversationId: 49 }), null);
  assert.equal(construirAviso({ conversationId: 49 }), null);
  assert.equal(construirAviso(), null);
});

test("un handoff arma el aviso con el motivo, el resumen y la conversacion", () => {
  const aviso = construirAviso({
    notify: [{ kind: "handoff", reason: "pidio_hablar_con_humano", text: "clinica dental, 4 personas" }],
    conversationId: 49,
    stageAfter: "handoff",
  });
  assert.ok(aviso, "tenia que armar un aviso");
  assert.match(aviso.texto, /49/, "sin el numero de conversacion Sergio no sabe a quien contestarle");
  assert.match(aviso.texto, /clinica dental, 4 personas/);
  assert.deepEqual(aviso.motivos, ["pidio_hablar_con_humano"]);
});

test("una demo agendada se nombra como lo que es: hay que anotarla", () => {
  const aviso = construirAviso({
    notify: [{ kind: "demo_agendada", text: "demo agendada viernes 4, 14:00" }],
    conversationId: 49,
  });
  assert.match(aviso.texto, /DEMO AGENDADA/, "el aviso que evita que nadie vaya a la reunion");
  assert.match(aviso.texto, /viernes 4, 14:00/);
});

test("un motivo DESCONOCIDO se manda igual, con su nombre crudo", () => {
  // Un aviso que se calla porque no reconoce una etiqueta es el mismo bug que este archivo
  // arregla, un piso mas abajo. El motor puede sumar motivos y este archivo no puede quedar
  // mudo por no haberse enterado.
  const aviso = construirAviso({ notify: [{ kind: "motivo_que_no_existia_ayer", text: "algo" }], conversationId: 7 });
  assert.ok(aviso);
  assert.match(aviso.texto, /motivo_que_no_existia_ayer/);
  assert.deepEqual(aviso.motivos, ["motivo_que_no_existia_ayer"]);
});

test("varios efectos en un turno entran TODOS en el mismo aviso", () => {
  const aviso = construirAviso({
    notify: [
      { kind: "descarte_tras_agendar", text: "se cayo" },
      { kind: "handoff", reason: "queja_o_desconfianza", text: "esta enojado" },
    ],
    conversationId: 12,
  });
  assert.match(aviso.texto, /se cayo/);
  assert.match(aviso.texto, /esta enojado/);
  assert.equal(aviso.motivos.length, 2);
});

// ---------------------------------------------------------------------------
// El escape de HTML. Este es el caso que hace que el aviso LLEGUE.
// ---------------------------------------------------------------------------

test("escaparHtml neutraliza lo que Telegram interpreta", () => {
  assert.equal(escaparHtml("<b>hola</b> & <chau>"), "&lt;b&gt;hola&lt;/b&gt; &amp; &lt;chau&gt;");
});

test("el texto del prospecto con < > & NO rompe el aviso", () => {
  // Sin esto Telegram contesta 400 y el mensaje no llega: el aviso se perderia justo con los
  // prospectos que escriben raro, en silencio, con el mismo sintoma que estamos arreglando.
  const aviso = construirAviso({
    notify: [{ kind: "handoff", text: 'usa <script> y me dijo "5 < 10 & sobra"' }],
    conversationId: 3,
  });
  assert.ok(!/<script>/.test(aviso.texto), "el markup del prospecto no puede salir crudo");
  assert.match(aviso.texto, /&lt;script&gt;/);
  assert.match(aviso.texto, /5 &lt; 10 &amp; sobra/);
  // Las unicas etiquetas vivas son las nuestras.
  const etiquetas = aviso.texto.match(/<[^>]+>/g) || [];
  assert.deepEqual([...new Set(etiquetas)].sort(), ["</b>", "<b>"]);
});

test("un resumen gigante se recorta y no se manda entero", () => {
  const aviso = construirAviso({ notify: [{ kind: "handoff", text: "x".repeat(9000) }], conversationId: 1 });
  assert.ok(aviso.texto.length < AVISO_MAX_CHARS + 200, `quedo en ${aviso.texto.length}`);
  assert.match(aviso.texto, /…$/);
});

// ---------------------------------------------------------------------------
// getAvisoTelegramConfig — apagado por defecto
// ---------------------------------------------------------------------------

test("apagado por defecto: sin la variable no manda nada", () => {
  assert.equal(getAvisoTelegramConfig({}).enabled, false);
  assert.equal(getAvisoTelegramConfig({ ONIA_BOT_TG_AVISO: "false" }).enabled, false);
  assert.equal(getAvisoTelegramConfig({ ONIA_BOT_TG_AVISO: "TRUE" }).enabled, true);
});

test("acepta los dos nombres de token que ya existen en el VPS", () => {
  assert.equal(getAvisoTelegramConfig({ TG_BOT_TOKEN: "a" }).token, "a");
  assert.equal(getAvisoTelegramConfig({ TELEGRAM_BOT_TOKEN: "b" }).token, "b");
  assert.equal(getAvisoTelegramConfig({ TG_CHAT_ID: "1" }).chatId, "1");
  assert.equal(getAvisoTelegramConfig({ TELEGRAM_CHAT_ID: "2" }).chatId, "2");
});

// ---------------------------------------------------------------------------
// enviarAvisoTelegram — nunca rechaza, y NUNCA un verde falso
// ---------------------------------------------------------------------------

const AVISO = { texto: "hola", motivos: ["handoff"] };

test("apagado: no toca la red", async () => {
  let llamadas = 0;
  const r = await enviarAvisoTelegram(AVISO, { enabled: false }, { fetch: () => { llamadas += 1; } });
  assert.equal(r.status, "skipped");
  assert.equal(r.ok, true);
  assert.equal(llamadas, 0, "apagado tiene que ser apagado de verdad");
});

test("ENCENDIDO y sin credencial es FAILED, no skipped", async () => {
  // La diferencia importa: `skipped` se lee como "estaba bien asi". Encendido sin token es una
  // promesa rota en silencio — el estado exacto del que venimos.
  const sinToken = await enviarAvisoTelegram(AVISO, { enabled: true, chatId: "1" }, { fetch: () => {} });
  assert.equal(sinToken.status, "failed");
  assert.match(sinToken.reason, /TG_BOT_TOKEN/);

  const sinChat = await enviarAvisoTelegram(AVISO, { enabled: true, token: "t" }, { fetch: () => {} });
  assert.equal(sinChat.status, "failed");
  assert.match(sinChat.reason, /TG_CHAT_ID/);
});

test("camino feliz: postea a Telegram con HTML y devuelve sent", async () => {
  let visto = null;
  const r = await enviarAvisoTelegram(
    AVISO,
    { enabled: true, token: "TOK", chatId: "555" },
    {
      fetch: async (url, opciones) => {
        visto = { url, cuerpo: JSON.parse(opciones.body) };
        return { ok: true, status: 200, json: async () => ({ ok: true }) };
      },
    },
  );
  assert.equal(r.status, "sent");
  assert.match(visto.url, /^https:\/\/api\.telegram\.org\/botTOK\/sendMessage$/);
  assert.equal(visto.cuerpo.chat_id, "555");
  assert.equal(visto.cuerpo.parse_mode, "HTML");
  assert.equal(visto.cuerpo.text, "hola");
});

test("Telegram 200 con ok:false NO es un exito", async () => {
  // El falso verde clasico: mirar solo el codigo HTTP. Telegram descarta el mensaje y contesta
  // 200 igual; darlo por enviado seria repetir el bug con mejor cara.
  const r = await enviarAvisoTelegram(
    AVISO,
    { enabled: true, token: "t", chatId: "1" },
    { fetch: async () => ({ ok: true, status: 200, json: async () => ({ ok: false, description: "can't parse entities" }) }) },
  );
  assert.equal(r.ok, false);
  assert.equal(r.status, "failed");
  assert.match(r.reason, /can't parse entities/);
});

test("un 401 de Telegram sale failed con el codigo", async () => {
  const r = await enviarAvisoTelegram(
    AVISO,
    { enabled: true, token: "t", chatId: "1" },
    { fetch: async () => ({ ok: false, status: 401, json: async () => ({ ok: false, description: "Unauthorized" }) }) },
  );
  assert.equal(r.status, "failed");
  assert.match(r.reason, /401/);
});

test("si fetch explota, NO rechaza: devuelve failed", async () => {
  // Una excepcion suelta aca es un unhandled rejection y mata el proceso de Node, o sea el bot
  // entero, por un aviso que no salio.
  const r = await enviarAvisoTelegram(
    AVISO,
    { enabled: true, token: "t", chatId: "1" },
    { fetch: async () => { throw new Error("ECONNREFUSED"); } },
  );
  assert.equal(r.status, "failed");
  assert.match(r.reason, /ECONNREFUSED/);
});

test("sin fetch disponible tampoco explota", async () => {
  const r = await enviarAvisoTelegram(AVISO, { enabled: true, token: "t", chatId: "1" }, { fetch: null });
  assert.equal(r.status, "failed");
});

test("dispararAvisoTelegram no propaga el fallo al llamador", async () => {
  const resultado = await new Promise((resolve) => {
    dispararAvisoTelegram(
      AVISO,
      { enabled: true, token: "t", chatId: "1" },
      { fetch: async () => { throw new Error("caida"); } },
      resolve,
    );
  });
  assert.equal(resultado.ok, false);
  assert.match(resultado.reason, /caida/);
});

// ---------------------------------------------------------------------------
// La plantilla tiene que documentar el encendido
//
// POR QUE. Este modulo nace apagado y se enciende con variables de entorno que viven en
// `/opt/onia/bot/webhook.env`, que esta FUERA de git: la unica memoria de que existen es
// `webhook.env.example`. El 2026-09-04 el modulo estaba desplegado y vivo en produccion desde
// hacia horas y la plantilla no nombraba ni una de sus tres variables — o sea que el aviso ya
// funcionaba y encenderlo dependia de que alguien se acordara de leer el .mjs. Peor: rehacer el
// env desde la plantilla lo apaga de nuevo EN SILENCIO, que es el bug exacto del que venimos.
//
// La lista de variables se saca del CODIGO, no de una lista escrita a mano aca: una variable
// nueva nace cubierta. Un gate cuya lista de sujetos se escribe a mano falla abierto el dia que
// alguien agrega la cuarta variable y no toca el test.
// ---------------------------------------------------------------------------

test("webhook.env.example documenta TODAS las variables que el aviso lee", async () => {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const dir = fileURLToPath(new URL(".", import.meta.url));

  const fuente = readFileSync(`${dir}aviso-telegram.mjs`, "utf8");
  const plantilla = readFileSync(`${dir}webhook.env.example`, "utf8");

  // Todo `env.NOMBRE` que el modulo consulta es, por definicion, parte de su interfaz de encendido.
  const leidas = [...new Set([...fuente.matchAll(/\benv\.([A-Z][A-Z0-9_]+)/g)].map((m) => m[1]))];
  assert.ok(leidas.length >= 3, `el modulo deberia leer al menos 3 variables, encontro ${leidas.length}`);

  const sinDocumentar = leidas.filter((nombre) => !new RegExp(`^\\s*#?\\s*${nombre}\\b`, "m").test(plantilla));
  assert.deepEqual(
    sinDocumentar,
    [],
    `webhook.env.example no documenta: ${sinDocumentar.join(", ")}. ` +
      "Sin eso, rehacer el env desde la plantilla apaga el aviso en silencio.",
  );
});

// ---------------------------------------------------------------------------
// De QUE CANAL entro — el dato con el que el bot PROMETE tiene que llegarle a quien cumple
//
// POR QUE EXISTE. `chatwoot-adapter.mjs` guarda `channel_type` en el turno con este comentario:
// "El MEDIO, aparte del inbox: decide por que via promete el bot que escribe el humano". Con eso
// el bot le dice al prospecto "te escribe desde este mismo numero" (WhatsApp) o "por este mismo
// chat" (web). Pero el aviso que le pide a Sergio Urcullo que CUMPLA esa promesa no lo nombraba:
// llegaba "conversacion 58 · handoff" y habia que ir a la bandeja a averiguar por donde contestar.
// En WhatsApp contestar es UN CLIC y en el widget hay que abrir Chatwoot: es la diferencia entre
// atender a un desconocido en un minuto o no atenderlo.
//
// Su hermano ya lo hacia: `postdemo-run.mjs:220` pone `· ${state.channel}` en el texto del aviso.
// La cura no viajo al camino principal — el handoff EN VIVO, que es el que corre siempre.
//
// Y de paso cierra la mitad latente: el inbox es "de que cliente es esta conversacion" (lo dice
// el mismo comentario del adapter). Hoy solo `onia-interna` tiene inbox (4 web / 5 WhatsApp,
// medido el 2026-09-19 en `clinic_settings`), asi que todos los avisos son de Onia. El dia que un
// cliente del add-on conecte SU WhatsApp, sus handoffs van a caer en el MISMO Telegram, y sin el
// inbox a la vista serian indistinguibles de un lead propio.
// ---------------------------------------------------------------------------

test("el aviso dice por QUE CANAL entro: en WhatsApp contestar es un clic, en el widget no", () => {
  const wa = construirAviso({
    notify: [{ kind: "handoff", reason: "pidio_hablar_con_humano", text: "clinica dental" }],
    conversationId: 58,
    canal: "Channel::Whatsapp",
  });
  assert.match(wa.texto, /WhatsApp/i, "sin el canal, Sergio Urcullo no sabe si contestar por WhatsApp o abrir la bandeja");

  const web = construirAviso({
    notify: [{ kind: "handoff", reason: "pidio_hablar_con_humano", text: "clinica dental" }],
    conversationId: 38,
    canal: "Channel::WebWidget",
  });
  assert.match(web.texto, /web/i, "el widget tambien se nombra: es el que OBLIGA a abrir la bandeja");
  assert.doesNotMatch(web.texto, /WhatsApp/i, "nombrar mal el canal es peor que no nombrarlo");
});

test("sin canal el aviso sale igual: un aviso que se calla por un dato de contexto es el bug de origen", () => {
  const aviso = construirAviso({
    notify: [{ kind: "handoff", reason: "pidio_hablar_con_humano", text: "clinica dental" }],
    conversationId: 58,
  });
  assert.ok(aviso, "el aviso NUNCA se cae por no saber el canal");
  assert.match(aviso.texto, /58/);
});

test("el inbox viaja: el dia que entre un tenant, su handoff no se confunde con un lead propio", () => {
  const aviso = construirAviso({
    notify: [{ kind: "handoff", reason: "pidio_hablar_con_humano", text: "consulta" }],
    conversationId: 71,
    canal: "Channel::Whatsapp",
    inbox: 12,
  });
  assert.match(aviso.texto, /12/, "sin el inbox, dos negocios distintos mandan avisos identicos");
});

// El DESARME del takeover (bandeja nativa, 2026-08-29). El takeover ya existia:
// un humano contesta -> el bot se calla en esa conversacion. Pero era PARA
// SIEMPRE, y un hilo de WhatsApp es eterno: el cliente que vuelve manana
// encontraba el bot muerto. Regla nueva: RESOLVER la conversacion (boton de la
// bandeja) se la devuelve al bot — el proximo "hola" arranca ciclo nuevo.
import test from "node:test";
import assert from "node:assert/strict";

import { parseChatwootWebhook } from "./chatwoot-adapter.mjs";
import { clearHumanTakeover, createState, markHumanTakeover, step } from "./bot-engine.mjs";
import { applyKnowledge, asRecepcionista, validateKnowledge } from "./knowledge.mjs";
import { createBotConfig } from "./config.mjs";
import { runTurn } from "./run-turn.mjs";

// ---------------------------------------------------------------------------
// 1. Adapter: conversation_resolved => turno de desarme (no un mensaje).

test("adapter: conversation_resolved produce el turno de desarme", () => {
  const parsed = parseChatwootWebhook({
    event: "conversation_resolved",
    id: 41,
    status: "resolved",
    timestamp: 1_756_400_000,
  });
  assert.equal(parsed.skip, false);
  assert.equal(parsed.turn.human_takeover_clear, true);
  assert.equal(parsed.turn.contact_ref, "41");
  assert.equal(parsed.turn.channel, "chatwoot");
});

test("adapter: conversation_status_changed resolved tambien desarma; open no", () => {
  const resuelto = parseChatwootWebhook({ event: "conversation_status_changed", id: 41, status: "resolved" });
  assert.equal(resuelto.skip, false);
  assert.equal(resuelto.turn.human_takeover_clear, true);

  const abierto = parseChatwootWebhook({ event: "conversation_status_changed", id: 41, status: "open" });
  assert.equal(abierto.skip, true);
});

test("adapter: conversation_resolved sin id se descarta", () => {
  const parsed = parseChatwootWebhook({ event: "conversation_resolved", status: "resolved" });
  assert.equal(parsed.skip, true);
});

// ---------------------------------------------------------------------------
// 2. Motor puro: clearHumanTakeover.

test("clearHumanTakeover limpia el flag y resetea el handoff del recepcionista", () => {
  let state = markHumanTakeover(createState({ conversationKey: "chatwoot:41" }), "2026-08-29T12:00:00Z");
  state = { ...state, botStage: "handoff_humano" };
  const limpio = clearHumanTakeover(state);
  assert.equal(limpio.humanTookOver, false);
  assert.equal(limpio.humanTookOverAt, null);
  assert.equal(limpio.botStage, "nuevo");
});

test("clearHumanTakeover NO toca un stage que no es handoff", () => {
  const state = markHumanTakeover(createState({ botStage: "demo_agendada" }), "2026-08-29T12:00:00Z");
  const limpio = clearHumanTakeover(state);
  assert.equal(limpio.botStage, "demo_agendada");
  assert.equal(limpio.humanTookOver, false);
});

// ---------------------------------------------------------------------------
// 3. E2E del ciclo: callado con humano -> resuelto -> contesta de nuevo.

test("e2e: takeover silencia, el desarme le devuelve la voz al recepcionista", () => {
  const doc = { schema: "onia.bot.knowledge/1", identity: { productName: "Ferreteria Tornillo" } };
  assert.equal(validateKnowledge(doc).ok, true);
  const config = asRecepcionista(applyKnowledge(createBotConfig(), doc), doc);

  let state = markHumanTakeover(createState({ conversationKey: "chatwoot:41" }), "2026-08-29T12:00:00Z");

  const mudo = step(state, { text: "hola", receivedAt: "2026-08-29T12:01:00Z" }, { config });
  assert.equal(mudo.replies.length, 0, "con humano a cargo el bot calla");

  state = clearHumanTakeover(mudo.nextState);
  const vivo = step(state, { text: "hola", receivedAt: "2026-08-29T12:05:00Z" }, { config });
  assert.ok(vivo.replies.length > 0, "resuelto: el bot atiende de nuevo");
  assert.match(vivo.replies[0].text, /Ferreteria Tornillo/);
});

// ---------------------------------------------------------------------------
// 4. runTurn: el turno de desarme persiste el estado limpio y NO manda nada.

test("runTurn con human_takeover_clear: limpia, guarda y no contesta", async () => {
  const guardado = [];
  const state = markHumanTakeover(
    createState({ conversationKey: "chatwoot:41", channel: "chatwoot", contactRef: "41", botStage: "handoff_humano" }),
    "2026-08-29T12:00:00Z",
  );
  const store = {
    enabled: true,
    warnings: [],
    ensureConversation: async () => state,
    saveConversation: async (s) => { guardado.push(s); return true; },
  };

  const out = await runTurn(
    { channel: "chatwoot", contact_ref: "41", kind: "system", text: "", human_takeover_clear: true },
    { store, config: createBotConfig() },
  );

  assert.equal(out.send.length, 0);
  assert.equal(guardado.length, 1);
  assert.equal(guardado[0].humanTookOver, false);
  assert.equal(guardado[0].botStage, "nuevo");
  assert.ok(out.notes.includes("takeover_desarmado"));
});

#!/usr/bin/env node
// El CÓDIGO del anuncio (D1, D4) que viaja en el texto precargado queda como origen del lead. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/codigo-del-anuncio.test.mjs
//
// ORIGEN (2026-09-30). Meta manda el `referral` de un anuncio clic-a-WhatsApp (source_id, ctwa_clid)
// en el webhook de la WABA, pero Chatwoot 4.12.1 lo DESCARTA (chatwoot-adapter.mjs, `attributionFrom`).
// Por eso la pauta dental precarga un código por anuncio en el mensaje
// (`ONIA_ADQUISICION_Y_PAUTA.md` §5.5 y §5.8): «Hola, vi el anuncio de Onia (D1). Tengo una clínica
// dental.» — y el conocimiento reconoce la frase como campaña con `prefijo: true`.
//
// Lo que faltaba: el motor reconocía la campaña pero tiraba el código. El lead nacía con
// `source = bot:onia-demo-bot` y `piece_key = null`, igual que un «hola» suelto, así que la métrica
// de la pauta (costo por conversación calificada POR ANUNCIO, §5.6-5.7: «un anuncio que gastó el
// tope sin conseguir ninguna se pausa») no se podía sacar del CRM: había que buscar el código a mano
// en cada conversación de Chatwoot. Y el aviso a Sergio Urcullo no decía que el lead era pago.
//
// Se prueba con una campaña de prefijo INYECTADA en la config y no con `knowledge.onia.json`: el
// mecanismo tiene que andar con cualquier frase que el conocimiento publique, y la frase de la pauta
// es un texto con firma humana que puede cambiar sin tocar este archivo.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { createBotConfig } from "./config.mjs";
import { buildConfig } from "./simulate.mjs";

const T0 = "2026-09-30T19:00:00Z";
const SIN_AMBIENTE = { env: {}, envFile: "/no/existe/webhook.env" };
const HORARIOS = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";
const BASE = buildConfig({ slots: HORARIOS }, SIN_AMBIENTE);
const CAMPANA_PAUTA = {
  frase: "Hola, vi el anuncio de Onia",
  prefijo: true,
  respuesta: "Gracias por escribir desde el anuncio. ¿Cuántos profesionales atienden en tu clínica?",
};
const CONFIG = createBotConfig({ campanas: [...(BASE.campanas || []), CAMPANA_PAUTA] }, BASE);

function turno(state, text, minuto = 0) {
  const receivedAt = new Date(Date.parse(T0) + minuto * 60000).toISOString();
  return step(state, { text, receivedAt }, { config: CONFIG });
}

const nuevo = (extra = {}) => createState({ channel: "chatwoot", contactRef: "ad", ...extra });
const leadDe = (r) => r.sideEffects.find((e) => e.type === "lead_upsert");

test("el precargado de D4 contesta con la campaña y deja el código del anuncio como origen", () => {
  const r = turno(nuevo(), "Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.");
  assert.deepEqual(r.replies.map((reply) => reply.templateKey), ["M0", "R_CAMPANA"], "D2 primero, después la respuesta de la campaña");
  assert.equal(r.nextState.pieceKey, "anuncio-D4");
  assert.equal(leadDe(r).payload.pieceKey, "anuncio-D4", "el lead nace con su anuncio: bot:anuncio-D4 en el CRM");
  assert.equal(r.nextState.qualification.industry, "dental", "el rubro del precargado se guarda igual");
});

test("el código se lee aunque el lead cambie mayúsculas o espacios adentro del paréntesis", () => {
  const r = turno(nuevo(), "hola vi el anuncio de onia ( d1 ) tengo clinica");
  assert.equal(r.nextState.pieceKey, "anuncio-D1");
});

test("sin código en el mensaje no se inventa uno", () => {
  const r = turno(nuevo(), "Hola, vi el anuncio de Onia y tengo una clínica dental");
  assert.deepEqual(r.replies.map((reply) => reply.templateKey), ["M0", "R_CAMPANA"]);
  assert.equal(r.nextState.pieceKey, null);
});

test("un paréntesis en un mensaje que NO es de campaña no es un código de anuncio", () => {
  const r = turno(nuevo(), "Hola, tengo una clínica (D1) en Santa Cruz");
  assert.equal(r.nextState.pieceKey, null);
});

test("un origen que ya trajo el canal (referer, custom_attributes) no se pisa", () => {
  const r = turno(nuevo({ pieceKey: "lucia-d03-reel-siat" }), "Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.");
  assert.equal(r.nextState.pieceKey, "lucia-d03-reel-siat");
});

test("el aviso a Sergio Urcullo dice de qué anuncio vino el lead", () => {
  const r1 = turno(nuevo(), "Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.");
  const r2 = turno(r1.nextState, "B", 1);
  const aviso = r2.sideEffects.find((e) => e.type === "notify_sergio");
  assert.ok(aviso, "reservar avisa");
  assert.match(aviso.payload.text, /Origen: anuncio-D4/);
});

test("sin origen conocido, el aviso no inventa una línea de origen", () => {
  const r1 = turno(nuevo(), "Hola, quiero informacion sobre el sistema");
  const r2 = turno(r1.nextState, "A", 1);
  const aviso = r2.sideEffects.find((e) => e.type === "notify_sergio");
  assert.doesNotMatch(aviso.payload.text, /Origen:/);
});

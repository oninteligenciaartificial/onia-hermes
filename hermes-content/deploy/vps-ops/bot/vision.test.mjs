// Vision del bot (backlog v5): la foto del cliente se describe con la API barata
// (go de Sergio: "pagamos api nomas de modelo barato") y la descripcion SOLO se
// usa si pasa los guardrails. Cualquier fallo = flujo de siempre, jamas mudo.
import test from "node:test";
import assert from "node:assert/strict";

import { describeChatwootImage, pickImageAttachment } from "./vision.mjs";
import { createState, step } from "./bot-engine.mjs";
import { applyKnowledge, asRecepcionista, validateKnowledge } from "./knowledge.mjs";
import { createBotConfig } from "./config.mjs";

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fetchFalso({ imagenStatus = 200, visionBody } = {}) {
  return async (url) => {
    if (String(url).includes("/chat/completions")) {
      return {
        ok: true, status: 200,
        json: async () => visionBody ?? { choices: [{ message: { content: "una muela con una mancha oscura" } }] },
      };
    }
    return {
      ok: imagenStatus === 200, status: imagenStatus,
      headers: { get: (h) => (h.toLowerCase() === "content-length" ? String(PNG.length) : null) },
      arrayBuffer: async () => PNG.buffer.slice(PNG.byteOffset, PNG.byteOffset + PNG.byteLength),
    };
  };
}

const ATT = [{ file_type: "image", data_url: "https://chat.onia.com.bo/rails/blob/x.png", content_type: "image/png" }];
const ENV = { LITELLM_BASE: "http://litellm:4000/v1", LITELLM_KEY: "k", ONIA_BOT_MODEL: "gpt-4.1-mini" };

test("pickImageAttachment: agarra la imagen, ignora lo demas", () => {
  assert.ok(pickImageAttachment([{ file_type: "file", data_url: "x" }, ...ATT]));
  assert.equal(pickImageAttachment([{ file_type: "audio", data_url: "x" }]), null);
});

test("describeChatwootImage: camino feliz devuelve la descripcion", async () => {
  const r = await describeChatwootImage(
    { attachments: ATT, token: "t", chatwootBaseUrl: "https://chat.onia.com.bo" },
    { env: ENV, fetch: fetchFalso() },
  );
  assert.equal(r.ok, true);
  assert.match(r.description, /muela/);
});

test("sin LITELLM_KEY: ok=false sin explotar", async () => {
  const r = await describeChatwootImage(
    { attachments: ATT, chatwootBaseUrl: "https://chat.onia.com.bo" },
    { env: { ...ENV, LITELLM_KEY: "" }, fetch: fetchFalso() },
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "sin_litellm_key");
});

test("descarga de la imagen falla: ok=false, no tira", async () => {
  const r = await describeChatwootImage(
    { attachments: ATT, token: "t", chatwootBaseUrl: "https://chat.onia.com.bo" },
    { env: ENV, fetch: fetchFalso({ imagenStatus: 500 }) },
  );
  assert.equal(r.ok, false);
});

test("LiteLLM devuelve vacio: ok=false", async () => {
  const r = await describeChatwootImage(
    { attachments: ATT, token: "t", chatwootBaseUrl: "https://chat.onia.com.bo" },
    { env: ENV, fetch: fetchFalso({ visionBody: { choices: [{ message: { content: "" } }] } }) },
  );
  assert.equal(r.ok, false);
});

// ---------------------------------------------------------------------------
// El motor con la descripcion: R_ATTACH_VISTO solo si pasa guardrails.

function configRecepcion() {
  const doc = { schema: "onia.bot.knowledge/1", identity: { productName: "Clinica Prueba", humanName: "Marta" } };
  assert.equal(validateKnowledge(doc).ok, true);
  return asRecepcionista(applyKnowledge(createBotConfig(), doc), doc);
}

function turnoFoto(imageDescription) {
  return {
    kind: "attachment",
    text: "",
    receivedAt: "2026-08-30T14:00:00Z",
    ...(imageDescription ? { imageDescription } : {}),
  };
}

test("foto CON descripcion limpia: R_ATTACH_VISTO la incluye y deriva igual", () => {
  const r = step(createState({}), turnoFoto("una muela con una mancha oscura"), { config: configRecepcion() });
  assert.equal(r.replies[0].templateKey, "R_ATTACH_VISTO");
  assert.match(r.replies[0].text, /una muela con una mancha oscura/);
  assert.match(r.replies[0].text, /Marta/);
  assert.equal(r.nextState.botStage, "handoff_humano");
});

test("descripcion que viola guardrails (precio) se DESCARTA: R_ATTACH pelado", () => {
  const r = step(createState({}), turnoFoto("un presupuesto de Bs 500 por el tratamiento"), { config: configRecepcion() });
  assert.equal(r.replies[0].templateKey, "R_ATTACH");
  assert.doesNotMatch(r.replies[0].text, /500/);
  assert.equal(r.nextState.botStage, "handoff_humano");
});

test("foto SIN descripcion: R_ATTACH de siempre (regresion)", () => {
  const r = step(createState({}), turnoFoto(null), { config: configRecepcion() });
  assert.equal(r.replies[0].templateKey, "R_ATTACH");
  assert.equal(r.nextState.botStage, "handoff_humano");
});

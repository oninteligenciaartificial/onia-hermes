// El "Atendemos Atendemos" de la conv 39 (2026-08-29): el dueno escribe su horario
// como oracion completa y R_HORARIO le antepone el verbo. El builder ahora limpia
// el prefijo — las plantillas ponen el contexto, la frase pone los datos.
import test from "node:test";
import assert from "node:assert/strict";

import { createState, step } from "./bot-engine.mjs";
import { applyKnowledge, asRecepcionista, validateKnowledge } from "./knowledge.mjs";
import { createBotConfig } from "./config.mjs";

function configCon(frase) {
  const doc = {
    schema: "onia.bot.knowledge/1",
    identity: { productName: "Ferreteria Tornillo" },
    empresa: { horario: { frase } },
  };
  assert.equal(validateKnowledge(doc).ok, true);
  return asRecepcionista(applyKnowledge(createBotConfig(), doc), doc);
}

function respuestaHorario(config) {
  const r = step(createState({}), { text: "Horarios", receivedAt: "2026-08-29T12:00:00Z" }, { config });
  return r.replies.map((x) => x.text).join("\n");
}

test("frase que YA empieza con Atendemos no se duplica", () => {
  const texto = respuestaHorario(configCon("Atendemos de lunes a sabado de 8:00 a 12:00"));
  assert.doesNotMatch(texto, /Atendemos\s+Atendemos/i);
  assert.match(texto, /Atendemos de lunes a sabado de 8:00 a 12:00/);
});

test("mayusculas raras tambien ('ATENDEMOS lunes...')", () => {
  const texto = respuestaHorario(configCon("ATENDEMOS lunes a viernes, 9 a 18"));
  assert.doesNotMatch(texto, /Atendemos\s+ATENDEMOS/i);
});

test("frase sin verbo queda igual que siempre", () => {
  const texto = respuestaHorario(configCon("lun-vie, 9:00-18:00"));
  assert.match(texto, /Atendemos lun-vie, 9:00-18:00/);
});

test("recepcionista sin humanName del cliente: jamas 'Sergio' — cae a 'el equipo'", () => {
  const doc = { schema: "onia.bot.knowledge/1", identity: { productName: "Negocio Sin Humano" } };
  assert.equal(validateKnowledge(doc).ok, true);
  const config = asRecepcionista(applyKnowledge(createBotConfig(), doc), doc);
  assert.equal(config.identity.humanName, "el equipo");
  // Fuera de horario (domingo 03:00 La Paz): el sufijo M7 usa {{humano}}.
  const r = step(createState({}), { text: "Horarios", receivedAt: "2026-08-30T07:00:00Z" }, { config });
  const texto = r.replies.map((x) => x.text).join("\n");
  assert.doesNotMatch(texto, /Sergio/);
});

test("recepcionista CON humanName del cliente lo respeta", () => {
  const doc = { schema: "onia.bot.knowledge/1", identity: { productName: "Negocio", humanName: "Marta" } };
  const config = asRecepcionista(applyKnowledge(createBotConfig(), doc), doc);
  assert.equal(config.identity.humanName, "Marta");
});

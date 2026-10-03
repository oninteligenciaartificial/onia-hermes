#!/usr/bin/env node
// La FRASE-PREFIJO de la pauta dental: lo que precarga cada anuncio lo escucha el bot. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/frase-de-la-pauta.test.mjs
//
// ORIGEN (2026-09-30). La lista de encendido de la pauta (`ONIA_ADQUISICION_Y_PAUTA.md` §5.9, fila
// 5) no deja encenderla sin «la frase-prefijo publicada en el bot y probada con dos mensajes». El
// diseño está en §5.5 y §5.8: el conocimiento admite 10 campañas y había 9, así que va UNA sola
// frase para todos los anuncios —«Hola, vi el anuncio de Onia» con `prefijo: true`— y cada anuncio
// precarga su código detrás («Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.»).
//
// Es el mismo PAR que `campanas-web.test.mjs` cuida para la web, con otro emisor: acá el texto lo
// escribe Meta por el lead y la copia vive en el doc de la pauta. Por eso los precargados NO se
// hardcodean: se leen del doc (`precargados-de-la-pauta.mjs`). Si Ventas cambia el texto de un
// anuncio y el bot no lo escucha, esto se pone rojo antes de que el lead reciba el saludo genérico.
//
// Lo que este archivo NO prueba, y es la fila 5 entera: que la frase esté PUBLICADA (deploy del bot,
// que en este carril es firma de Sergio Urcullo) ni que un teléfono que no sea el de Onia reciba la
// respuesta mirándola. Esto es la mitad del repo; la otra mitad se mide en vivo.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { configComoProduccion } from "./config-como-produccion.mjs";
import { checkGuardrails, normalize } from "./guardrails.mjs";
import { precargadosDeLaPauta } from "./precargados-de-la-pauta.mjs";
import { campanaExacta } from "./recepcionista.mjs";
import { buildConfig } from "./simulate.mjs";

const doc = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
const PRECARGADOS = precargadosDeLaPauta();
const T0 = Date.parse("2026-09-30T19:00:00Z");
// El reloj de la config es el de la conversacion (`T0`), no el de la maquina: los horarios son
// fijos y sin esto vencen solos (el 2-oct pusieron rojo este archivo sin que nadie tocara el bot).
const HORARIOS = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";
// CON AGENDA PROPIA: `--slots` a mano devuelve `agenda: null` y el bot ofrece y confirma horarios.
// Hoy es la rama que se enciende con `ONIA_BOT_AGENDA=calcom`, NO la que ven los leads.
const CONFIG = buildConfig({ slots: HORARIOS }, { env: {}, envFile: "/no/existe/webhook.env", now: T0 });
// COMO PRODUCCION (3-oct): webhook.env con los horarios del cron y Cal.com declarado, sin
// `ONIA_BOT_AGENDA` — la persona coordina la demo. Es la rama que lee el lead de la pauta.
const PRODUCCION = configComoProduccion({ horarios: HORARIOS, now: T0 });
const en = (min) => new Date(T0 + min * 60000).toISOString();

// UNA MENCION ABREVIADA NO ES UN PRECARGADO (2026-10-02). El 30-sep el doc de la pauta sumo, en
// los pasos de creacion del anuncio, «**Texto precargado** (`Hola, vi el anuncio de Onia (D1)…`)»:
// una referencia al texto, cortada con «…», entre backticks. El extractor la leia como un tercer
// precargado y el gate de abajo veia D1 dos veces — rojo, y con el el deploy del bot trabado.
// El texto que Meta escribe por el lead nunca termina en «…»: eso es prosa del doc, no el anuncio.
test("una mención del precargado cortada con «…» no cuenta como otro precargado", () => {
  const dir = mkdtempSync(join(tmpdir(), "pauta-"));
  try {
    const doc = join(dir, "pauta.md");
    writeFileSync(
      doc,
      [
        "| D1 | `Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.` |",
        "**Texto precargado** (`Hola, vi el anuncio de Onia (D1)…`): se pone a mano.",
        "Otra abreviada (`Hola, vi el anuncio de Onia (D4)...`).",
      ].join("\n"),
    );
    assert.deepEqual(precargadosDeLaPauta(doc), ["Hola, vi el anuncio de Onia (D1). Tengo una clínica dental."]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("el doc de la pauta trae los precargados de D1 y D4 (si no, este gate no mide nada)", () => {
  const codigos = PRECARGADOS.map((texto) => /\(([A-Z]\d+)\)/.exec(texto)?.[1]).sort();
  assert.deepEqual(codigos, ["D1", "D4"]);
});

for (const precargado of PRECARGADOS) {
  test(`el bot escucha el precargado «${precargado}» con la campaña de PREFIJO`, () => {
    const campana = campanaExacta(doc, normalize(precargado));
    assert.ok(campana, "el precargado no matchea ninguna campaña: el lead recibiría el saludo genérico");
    assert.equal(campana.prefijo, true, "una sola frase para todos los anuncios: tiene que ser prefijo");
  });
}

test("la respuesta de la campaña no cotiza, no titula con IA y le abre la puerta cortés al paciente", () => {
  const campana = campanaExacta(doc, normalize(PRECARGADOS[0]));
  assert.deepEqual(checkGuardrails(campana.respuesta), []);
  assert.doesNotMatch(campana.respuesta, /\d/, "ni un número: un precio en texto libre es justo lo que el bot no hace");
  assert.doesNotMatch(campana.respuesta, /\bIA\b/);
  assert.match(campana.respuesta, /paciente/, "el precargado lo manda también el paciente: la respuesta le dice por dónde salir");
  assert.match(campana.respuesta, /profesionales/, "hace la primera pregunta del cliente ideal (§9)");
});

// LA PRUEBA DE DOS MENSAJES ES LA DE PRODUCCION (3-oct). Hasta hoy existia solo la de abajo, con
// agenda propia: seguia verde certificando «**A)** jueves 2 de octubre» mientras produccion, desde
// 2bf4fd0df, saluda con M0_PERSONA. La fila 5 §5.9 se mide con ESTA.
test("LA PRUEBA DE DOS MENSAJES, como en producción (la persona coordina): precargado de D1 + la respuesta de un dueño", () => {
  assert.equal(PRODUCCION.agenda?.modo, "persona", "ancla: se mide la rama que sirve producción");
  const r1 = step(createState({ channel: "chatwoot", contactRef: "pauta-2msj-prod", channelType: "Channel::Whatsapp" }), { text: PRECARGADOS[0], receivedAt: en(0) }, { config: PRODUCCION });
  assert.deepEqual(r1.replies.map((r) => r.templateKey), ["M0_PERSONA", "R_CAMPANA"]);
  assert.match(r1.replies[0].text.split("\n")[0], /un bot/, "D2: lo primero que lee es que habla con un bot");
  assert.equal(r1.nextState.pieceKey, "anuncio-D1");
  assert.equal(r1.nextState.qualification.industry, "dental");
  const aviso = r1.sideEffects.find((e) => e.type === "notify_sergio");
  assert.equal(aviso?.payload.kind, "coordinar_demo", "«te escribe Sergio» es una promesa: a Sergio Urcullo le llega el aviso");

  const r2 = step(r1.nextState, { text: "somos 3 odontólogos y la recepcionista agenda", receivedAt: en(1) }, { config: PRODUCCION });
  assert.equal(r2.replies.length, 1, "el SEGUNDO mensaje también se contesta");
  assert.equal(r2.replies[0].templateKey, "M0b_SIN_HORARIOS");
  assert.equal(r2.replies[0].replySource, "script");
  assert.equal(r2.nextState.qualification.teamSize, 3);
  assert.match(r2.replies[0].text, /le escribe desde este mismo número/);

  const todo = [...r1.replies, ...r2.replies].map((r) => r.text).join("\n");
  assert.doesNotMatch(todo, /\*\*A\)\*\*|jueves 2 de octubre/, "no ofrece horarios que nadie reserva");
  assert.doesNotMatch(todo, /Listo, agendado|te confirmo el horario|le confirmo el horario|te reservo|le reservo/i, "no promete una confirmación que no va a dar");
});

test("LA PRUEBA DE DOS MENSAJES, con agenda propia (ONIA_BOT_AGENDA=calcom): precargado de D1 + la respuesta de un dueño", () => {
  const r1 = step(createState({ channel: "chatwoot", contactRef: "pauta-2msj", channelType: "Channel::Whatsapp" }), { text: PRECARGADOS[0], receivedAt: en(0) }, { config: CONFIG });
  assert.deepEqual(r1.replies.map((r) => r.templateKey), ["M0", "R_CAMPANA"]);
  assert.match(r1.replies[0].text, /un bot/, "D2: lo primero que lee es que habla con un bot");
  assert.equal(r1.nextState.pieceKey, "anuncio-D1");
  assert.equal(r1.nextState.qualification.industry, "dental");

  const r2 = step(r1.nextState, { text: "somos 3 odontólogos y la recepcionista agenda", receivedAt: en(1) }, { config: CONFIG });
  assert.equal(r2.replies.length, 1, "el SEGUNDO mensaje también se contesta (la lección del 23-ago: el primero puede ser una plantilla)");
  assert.equal(r2.replies[0].templateKey, "M0b");
  assert.equal(r2.replies[0].replySource, "script");
  assert.equal(r2.nextState.qualification.teamSize, 3);
  assert.match(r2.replies[0].text, /jueves 2 de octubre, 14:00/);
});

test("el conocimiento no pasa el tope de 10 campañas (y esta fue la última libre)", () => {
  assert.ok(doc.campanas.length <= 10);
});

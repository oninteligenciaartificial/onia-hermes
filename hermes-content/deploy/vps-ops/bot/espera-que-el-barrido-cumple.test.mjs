// Las tres puntas de la espera de la insistencia dicen el MISMO techo.
//
// El 2026-09-13 no lo decian: el validador aceptaba hasta 48 h, el editor le
// dictaba "1-48" al LLM, y el barrido (sweepInsistenciaCandidates) solo mira lo
// que sigue dentro de la ventana de servicio. Una espera de 24 h o mas no
// producia envio jamas — y sin dejar rastro: ni envio, ni error, ni fila en el
// barrido. El dueño creia tener insistencia y no tenia nada.
//
// El invariante NO es "el numero es 23": es que las tres puntas deriven de
// `config.followUp.windowClosesAtHours`. Si alguien mueve la ventana, se tienen
// que mover las tres juntas; si mueve una sola, esto se pone rojo.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { DEFAULT_CONFIG } from "./config.mjs";
import {
  validateKnowledge,
  MIN_ESPERA_INSISTENCIA_HORAS,
  MAX_ESPERA_INSISTENCIA_HORAS,
} from "./knowledge.mjs";

const doc = (horas) => ({
  schema: "onia.bot.knowledge/1",
  seguimiento: { activo: true, horas },
});

test("el techo se deriva de la ventana de servicio, no se tipea", () => {
  assert.equal(
    MAX_ESPERA_INSISTENCIA_HORAS,
    DEFAULT_CONFIG.followUp.windowClosesAtHours - 1,
    "el techo tiene que salir de followUp.windowClosesAtHours",
  );
  // Ancla al hecho del mundo: Meta cierra la ventana de respuesta sin plantilla a
  // las 24 h del ultimo mensaje entrante del cliente.
  assert.equal(DEFAULT_CONFIG.followUp.windowClosesAtHours, 24);
});

test("el validador acepta exactamente lo que el barrido puede ejecutar", () => {
  for (let h = 1; h <= 60; h++) {
    const cumplible = h >= MIN_ESPERA_INSISTENCIA_HORAS && h <= MAX_ESPERA_INSISTENCIA_HORAS;
    const aceptado = validateKnowledge(doc(h)).ok;
    assert.equal(
      aceptado,
      cumplible,
      `el validador ${aceptado ? "acepta" : "rechaza"} ${h} h y el barrido ${cumplible ? "la cumple" : "no la cumple"}`,
    );
  }
});

test("el caso que rompia: la ventana entera se rechaza en la puerta", () => {
  assert.equal(validateKnowledge(doc(DEFAULT_CONFIG.followUp.windowClosesAtHours)).ok, false);
  assert.equal(validateKnowledge(doc(48)).ok, false);
  assert.equal(validateKnowledge(doc(MAX_ESPERA_INSISTENCIA_HORAS)).ok, true);
});

test("el editor conversacional le dicta al LLM el mismo rango, derivado", () => {
  const fuente = readFileSync(fileURLToPath(new URL("./editor-sugerir.mjs", import.meta.url)), "utf8");
  // Sin el numero tipeado: lo que se exige es que el texto lo INTERPOLE. Dictarle
  // un rango mas ancho al LLM es pedirle que escriba una espera muerta.
  assert.match(
    fuente,
    /horas \(numero \$\{MIN_ESPERA_INSISTENCIA_HORAS\}-\$\{MAX_ESPERA_INSISTENCIA_HORAS\}\)/,
    "el dictado del rango al LLM tiene que derivar del techo, no tipearlo",
  );
});

test("el barrido acota por la ventana del config, no por un numero propio", () => {
  // La tercera punta. Su hermano `insistencia-run.test.mjs` ya prueba que el
  // runner le PASA el config; lo que falta es que el barrido lo USE: con un 24
  // tipeado aca, mover la ventana en el config dejaba el rango en el valor viejo
  // y ninguna de las otras dos puntas lo notaba.
  const fuente = readFileSync(fileURLToPath(new URL("./persistence.mjs", import.meta.url)), "utf8");
  const i = fuente.indexOf("async function sweepInsistenciaCandidates");
  assert.ok(i > 0, "no se encontro el barrido de la insistencia");
  const cuerpo = fuente.slice(i, i + 1200);

  assert.match(
    cuerpo,
    /config\?\.followUp\?\.windowClosesAtHours/,
    "el barrido tiene que derivar su ventana de config.followUp.windowClosesAtHours",
  );
  // Y que el rango se arme con esa variable, no con una constante al lado.
  assert.match(cuerpo, /now - ventana \* 3600000/, "el limite inferior del rango tiene que usar la ventana derivada");
  assert.doesNotMatch(
    cuerpo.replace(/DEFAULT_CONFIG\.followUp\.windowClosesAtHours/g, ""),
    /\b24\s*\*\s*3600000\b/,
    "la ventana no se tipea en el barrido",
  );
});

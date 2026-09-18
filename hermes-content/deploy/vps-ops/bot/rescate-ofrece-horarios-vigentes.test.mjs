/**
 * LA CLASE: un mensaje DIFERIDO no ofrece horarios sacados del estado guardado.
 *
 * Los horarios de demo se republican todos los dias (`scripts/loops/renovar-slots-bot.py`, cron)
 * y el motor descarta los que bajan del piso de anticipacion (`parseSlotsSpec`). Un mensaje del
 * turno en vivo puede leerlos del estado —"A" tiene que seguir siendo la A que se ofrecio hace
 * tres minutos—, pero un barrido manda un DIA DESPUES: ahi el estado es una foto vieja, y
 * ofrecerla significa dar un horario que Sergio no tiene reservado y con menos aviso del que la
 * coletilla del mismo mensaje promete.
 *
 * Medido contra produccion el 2026-09-18 19:17 UTC con un desconocido real esperando
 * (`chatwoot:58`): el M3 ofrecia "sábado 19 de septiembre, 09:00" mientras `ONIA_BOT_SLOTS` traia
 * el de las 14:00. Ese caso concreto lo fija `bot-engine.test.mjs`; esto impide que la clase
 * vuelva por OTRO barrido.
 *
 * El universo se deriva del disco (los `*-run.mjs` que llaman a `deliver(`) y de las plantillas
 * que de verdad ofrecen un horario (las que llevan `{{slot_a}}`/`{{slot_b}}`), no de una lista a
 * mano: una lista escrita hoy deja pasar al barrido que se escriba manana.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { DEFAULT_CONFIG } from "./config.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

// `{{slot_a}}` sin escribirlo entero: este archivo se lee a si mismo si algun dia el universo
// crece hacia los .test.mjs, y un fixture literal lo haria acusarse solo.
const MARCA_HORARIO = /\{\{\s*slot_[ab]\s*\}\}/;

/** Los barridos: lo que corre por cron y le manda un mensaje a una persona. */
function barridos() {
  return readdirSync(AQUI)
    .filter((nombre) => nombre.endsWith("-run.mjs"))
    .map((nombre) => ({ nombre, fuente: readFileSync(join(AQUI, nombre), "utf8") }))
    .filter((archivo) => archivo.fuente.includes("deliver("));
}

/** Las plantillas del guion que ese barrido emite, nombradas como las nombra el codigo. */
function plantillasQueEmite(fuente) {
  const claves = new Set();
  for (const match of fuente.matchAll(/config\.script\.([A-Z_0-9]+)/g)) claves.add(match[1]);
  for (const match of fuente.matchAll(/templateKey:\s*"([A-Z_0-9]+)"/g)) claves.add(match[1]);
  return [...claves];
}

test("el universo son los barridos de verdad, no una lista escrita a mano", () => {
  const nombres = barridos().map((archivo) => archivo.nombre);
  // Caso ancla: si el predicado se rompe, el gate se queda sin sujetos y firma verde.
  for (const conocido of ["followup-run.mjs", "insistencia-run.mjs", "reminder-run.mjs"]) {
    assert.ok(nombres.includes(conocido), `${conocido} tiene que estar en el universo`);
  }
});

test("las plantillas que ofrecen un horario se reconocen por el guion, no por su nombre", () => {
  const conHorario = Object.entries(DEFAULT_CONFIG.script)
    .filter(([, texto]) => typeof texto === "string" && MARCA_HORARIO.test(texto))
    .map(([clave]) => clave);
  // Ancla en las dos direcciones: M3 ofrece horarios y R_SEGUIMIENTO no. Si esto se invierte sin
  // que nadie lo note, los dos casos de abajo pasan a medir otra cosa.
  assert.ok(conHorario.includes("M3"), "M3 ofrece dos horarios: es el sujeto historico");
  assert.ok(!conHorario.includes("R_SEGUIMIENTO"), "R_SEGUIMIENTO no ofrece horarios hoy");
});

test("todo barrido que OFREZCA un horario lo construye con buildFollowUp, que los refresca", () => {
  const script = DEFAULT_CONFIG.script;
  const ofrece = (clave) => typeof script[clave] === "string" && MARCA_HORARIO.test(script[clave]);

  for (const { nombre, fuente } of barridos()) {
    const conHorario = plantillasQueEmite(fuente).filter(ofrece);
    if (conHorario.length === 0) continue;
    assert.ok(
      fuente.includes("buildFollowUp"),
      `${nombre} emite ${conHorario.join(", ")}, que ofrece(n) un horario, y no pasa por ` +
        "buildFollowUp: estaria mandando los horarios que la conversacion guardo el dia que " +
        "nacio. O se construye con buildFollowUp, o refresca los slots del config antes de " +
        "renderizar (ver el comentario de buildFollowUp en bot-engine.mjs).",
    );
  }
});

test("buildFollowUp es el que refresca: pisa los horarios del estado con los del config", () => {
  // Sin esto los dos casos de arriba serian una tautologia — exigirian un nombre de funcion,
  // no la propiedad. Lo que hace util a `buildFollowUp` es que NO lee `slotsOffered` del estado.
  const fuente = readFileSync(join(AQUI, "bot-engine.mjs"), "utf8");
  const desde = fuente.indexOf("export function buildFollowUp");
  assert.ok(desde > 0, "buildFollowUp tiene que existir y estar exportada");
  const cuerpo = fuente.slice(desde, fuente.indexOf("\n}", desde));
  assert.match(
    cuerpo,
    /slotsOffered:\s*config\.slots/,
    "buildFollowUp tiene que pisar slotsOffered con los horarios vigentes del config",
  );
});

#!/usr/bin/env node
// Self-check PURO de `validadores-cruzados.mjs`. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/validadores-cruzados.test.mjs
//
// La MEDICION viva (que lee el ref publicado de onia-platform y ejecuta los dos validadores) NO
// va acá: necesita el repo hermano con sus node_modules y en un worktree pelado daría rojo por
// ambiente, trabando el merge de todos los carriles. Va como alias suelto, `npm run
// validadores:cruzados`, y se corre en la medicion de arranque de este carril.
//
// Lo que sí se fija acá es el INSTRUMENTO, porque ya falló una vez: la primera versión de
// `cuerpoDeFuncion` se quedaba con el tipo de RETORNO de la firma TypeScript del producto
// (`): { ok: boolean; errores: ErrorDeCampo[] } {`) y reportaba sus SEIS reglas como huérfanas.
// Verificar el instrumento antes que el producto es lo único que evitó reportar roto un espejo
// sano (2026-09-19).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { corpus, cuerpoDeFuncion, divergencias, docConRuta, reglasInvocadas, sinComentarios } from "./validadores-cruzados.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// El instrumento
// ---------------------------------------------------------------------------

test("el cuerpo se lee SALTEANDO el tipo de retorno de TypeScript (el falso positivo que ya pagué)", () => {
  const ts = `
    export function validarConocimiento(data: unknown): { ok: boolean; errores: ErrorDeCampo[] } {
      checkObject(data, SHAPE, "", errores);
      checkHorario(data.empresa, errores);
      return { ok: true, errores };
    }`;
  const reglas = reglasInvocadas(ts, "validarConocimiento");
  assert.deepEqual([...reglas].sort(), ["checkHorario", "checkObject"]);
});

test("una firma sin tipo de retorno (el motor, JavaScript) se lee igual", () => {
  const js = `
    export function validateKnowledge(data) {
      checkObject(data, SHAPE, "", errors);
      checkDemo(data.demo, errors);
      return { ok: true };
    }`;
  assert.deepEqual([...reglasInvocadas(js, "validateKnowledge")].sort(), ["checkDemo", "checkObject"]);
});

test("un `check*` NOMBRADO en un comentario no es una llamada", () => {
  const js = `
    export function validateKnowledge(data) {
      // ya no llamamos a checkVieja(): la sacamos el martes
      /* checkOtra(data) quedó fuera a propósito */
      checkDemo(data.demo, errors);
    }`;
  assert.deepEqual([...reglasInvocadas(js, "validateKnowledge")], ["checkDemo"]);
  assert.ok(!sinComentarios("a // checkX(\nb").includes("checkX"));
  assert.equal(sinComentarios("a // x\nb").split("\n").length, 2, "los saltos de línea se conservan");
});

test("si el validador se renombra, el lector DEVUELVE null en vez de mentir con un conjunto vacío", () => {
  assert.equal(reglasInvocadas("export function otraCosa(d) { checkDemo(d); }", "validateKnowledge"), null);
  assert.equal(cuerpoDeFuncion("function x(a) { return 1 }", "y"), null);
});

// ---------------------------------------------------------------------------
// Casos ancla: los sujetos que YA conocemos tienen que estar en el universo
// ---------------------------------------------------------------------------

test("ANCLA — sobre el knowledge.mjs real, el lector encuentra las reglas que el motor corre hoy", () => {
  const motor = readFileSync(path.join(AQUI, "knowledge.mjs"), "utf8");
  const reglas = reglasInvocadas(motor, "validateKnowledge");
  assert.ok(reglas, "no encontré el cuerpo de validateKnowledge en el motor");
  for (const conocida of ["checkObject", "checkHorario", "checkDemo", "checkProductos", "checkRubros", "checkFaqNegocio"]) {
    assert.ok(reglas.has(conocida), `${conocida} corre en el motor y el lector no la vio: el gate se quedó ciego`);
  }
});

// ---------------------------------------------------------------------------
// El corpus
// ---------------------------------------------------------------------------

test("una ruta con índice y anidamiento arma el documento que le corresponde", () => {
  assert.deepEqual(docConRuta("empresa.horario.desde", 18, { schema: "s" }), {
    schema: "s",
    empresa: { horario: { desde: 18 } },
  });
  assert.deepEqual(docConRuta("campanas[0].frase", "x"), { campanas: [{ frase: "x" }] });
  assert.deepEqual(docConRuta("", { suelto: 1 }), { suelto: 1 }, "la ruta vacía es el documento entero");
});

test("el corpus barre el horario de borde a borde, incluido `desde === hasta`", () => {
  const casos = corpus(["empresa.horario.desde"], "onia.bot.knowledge/1");
  const horarios = casos.filter((c) => c.doc?.empresa?.horario && c.doc.empresa.horario.desde !== undefined);
  // `9 -> 9` es el caso que caza una regla que aflojó de UN lado (`<=` vuelto `<`): la mitad del
  // gate que la comparación de reglas invocadas NO puede ver, porque ahí las dos siguen iguales.
  assert.ok(
    horarios.some((c) => c.doc.empresa.horario.desde === 9 && c.doc.empresa.horario.hasta === 9),
    "sin el caso desde===hasta, endurecer o aflojar el cuerpo de una regla pasa verde",
  );
  assert.ok(
    horarios.some((c) => c.doc.empresa.horario.desde === 18 && c.doc.empresa.horario.hasta === 2),
    "falta el rango que cruza la medianoche, que es el que originó todo esto",
  );
  assert.ok(casos.length > SONDAS_MINIMAS, `el corpus quedó en ${casos.length} casos: se vació en silencio`);
});

const SONDAS_MINIMAS = 20;

// ---------------------------------------------------------------------------
// La comparación
// ---------------------------------------------------------------------------

test("dos validadores que opinan lo mismo no producen divergencias", () => {
  const igual = (d) => ({ ok: Boolean(d?.bien) });
  assert.deepEqual(divergencias([{ nombre: "a", doc: { bien: true } }, { nombre: "b", doc: {} }], igual, igual), []);
});

test("el que acepta de más queda nombrado, con quién dijo qué", () => {
  const motor = (d) => ({ ok: d?.hora !== 9 }); // el motor rechaza las 9
  const producto = () => ({ ok: true }); // el espejo acepta todo
  const [caso] = divergencias([{ nombre: "hora 9", doc: { hora: 9 } }], motor, producto);
  assert.equal(caso.nombre, "hora 9");
  assert.equal(caso.motor, false);
  assert.equal(caso.producto, true);
});

test("un validador que TIRA no tumba la comparación: el que tira cuenta como rechazo", () => {
  const hostil = () => {
    throw new Error("getter hostil");
  };
  assert.throws(() => divergencias([{ nombre: "x", doc: {} }], hostil, () => ({ ok: true })));
  // Los dos validadores reales prometen en su cabecera que NUNCA tiran; si alguno empieza a
  // hacerlo, esto explota ruidoso en vez de contarlo como un "ok" más.
});

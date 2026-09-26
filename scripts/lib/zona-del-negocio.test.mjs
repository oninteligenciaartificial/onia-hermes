// Gate: el instrumento que MIRA pantallas del producto no puede heredar la zona del proceso.
//
// El sujeto de verdad es la linea del `newContext` de `mirar_bandeja_dueno.mjs`: si ahi no viaja
// `timezoneId`, Playwright usa la zona del proceso (UTC en el VPS y en nodo-casa) y toda captura
// con horas sale 4 h corrida — medido el 2026-09-26: la misma bandeja decia "10:16 p.m." sin
// zona y "06:16 p.m." con `TZ=America/La_Paz`. Por eso este archivo no se conforma con probar la
// funcion pura: LEE el instrumento y exige que la use.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  ZONA_POR_DEFECTO,
  describirZona,
  resolverZona,
  zonaValida,
} from "./zona-del-negocio.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const INSTRUMENTO = join(AQUI, "..", "mirar_bandeja_dueno.mjs");

test("la zona del negocio manda cuando la base la tiene", () => {
  const r = resolverZona("America/Santiago");
  assert.equal(r.zona, "America/Santiago");
  assert.equal(r.fuente, "negocio");
});

test("sin dato de la base cae al defecto, y NUNCA a vacio", () => {
  for (const vacio of [null, undefined, "", "   "]) {
    const r = resolverZona(vacio);
    assert.equal(r.zona, ZONA_POR_DEFECTO, `${JSON.stringify(vacio)} tiene que dar el defecto`);
    assert.equal(r.fuente, "defecto");
    assert.ok(r.zona.length > 0, "una zona vacia hace que Playwright herede UTC: es el bug");
  }
});

test("una zona rota no se pasa a Playwright, y se distingue de no tener ninguna", () => {
  const r = resolverZona("America/Narnia");
  assert.equal(r.zona, ZONA_POR_DEFECTO, "no se le pasa basura al navegador");
  assert.equal(r.fuente, "invalida", "un dato roto no es lo mismo que un dato ausente");
  assert.match(describirZona(r), /America\/Narnia/, "el log tiene que nombrar el dato roto");
});

test("zonaValida le pregunta a Intl, que es quien la va a usar", () => {
  assert.ok(zonaValida("America/La_Paz"));
  assert.ok(zonaValida("UTC"));
  assert.ok(!zonaValida("La Paz"));
  assert.ok(!zonaValida(""));
});

test("el log distingue las tres fuentes sin hablar de tri-estados", () => {
  assert.match(describirZona(resolverZona("America/La_Paz")), /del negocio/);
  assert.match(describirZona(resolverZona(null)), /por defecto/);
});

// --- El gate que atrapa la regresion real -----------------------------------------------------

test("mirar_bandeja_dueno abre el navegador CON zona: sin esto la captura miente 4 h", () => {
  const src = readFileSync(INSTRUMENTO, "utf8");
  const ctx = src.match(/newContext\(\{[^}]*\}\)/s);
  assert.ok(ctx, "no encontre el newContext del instrumento — ¿se renombro?");
  assert.match(
    ctx[0],
    /timezoneId/,
    "el newContext no fija timezoneId: Playwright hereda UTC del proceso y toda hora de la " +
      "captura sale corrida (medido 2026-09-26: 10:16 p.m. por 06:16 p.m.)"
  );
});

test("la zona que se le pasa al navegador sale IMPRESA: una captura muda no se puede auditar", () => {
  const src = readFileSync(INSTRUMENTO, "utf8");
  assert.match(
    src,
    /console\.log\([^)]*describirZona/,
    "el instrumento tiene que decir con que zona miro; si no, la proxima vuelta no sabe si la " +
      "hora de la captura es del negocio o del proceso"
  );
});

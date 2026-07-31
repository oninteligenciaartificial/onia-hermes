// Tests de illustration-style.mjs. Correr: node --test .claude/skills/editor-videos/scripts/illustration-style.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { PRESETS, MARCA, duotoneExpr, halftoneExpr, buildFilter } from "./illustration-style.mjs";

// Evalúa la expresión de geq como lo haría ffmpeg, para un valor de luminancia dado.
function evaluar(expr, lum255) {
  const js = expr
    .replace(/\\,/g, ",")
    .replace(/r\(X,Y\)/g, String(lum255))
    .replace(/clip\(/g, "CLIP(");
  const CLIP = (v, a, b) => Math.min(b, Math.max(a, v));
  return Function("CLIP", `return ${js};`)(CLIP);
}

test("la paleta es la de marca, no negro/blanco puros", () => {
  assert.deepEqual(MARCA.ink, [0x0a, 0x0f, 0x0d]); // verde-negro cálido, no #000
  assert.deepEqual(MARCA.surface, [0xf4, 0xf5, 0xf2]); // off-white, no #fff
  assert.deepEqual(MARCA.verde, [0x00, 0xd2, 0x6a]);
});

test("duotono sin acento: negro→ink y blanco→surface", () => {
  const p = { accent: 0 };
  assert.equal(Math.round(evaluar(duotoneExpr("r", p), 0)), MARCA.ink[0]);
  assert.equal(Math.round(evaluar(duotoneExpr("g", p), 255)), MARCA.surface[1]);
});

test("el acento entra en la TINTA, no en el fondo", () => {
  const p = { accent: 0.9, accentSide: "sombras", accentTo: 0.3 };
  const g = (l) => evaluar(duotoneExpr("g", p), l);
  const r = (l) => evaluar(duotoneExpr("r", p), l);
  // un trazo oscuro (l=0) se va al verde: g alto, r casi nulo
  assert.ok(g(0) > 180, `el trazo deberia ser verde, g=${g(0)}`);
  assert.ok(r(0) < 30, `el trazo no deberia tener rojo, r=${r(0)}`);
  // el fondo (l=255) queda en surface, sin teñir
  assert.ok(Math.abs(g(255) - MARCA.surface[1]) < 2, `el fondo no se tiñe, g=${g(255)}`);
});

test("el bug real: acentuar las LUCES pinta el fondo de un grabado", () => {
  const luces = { accent: 0.9, accentSide: "luces", accentTo: 0.2 };
  const g = evaluar(duotoneExpr("g", luces), 255);
  const r = evaluar(duotoneExpr("r", luces), 255);
  // con el fondo blanco (que en un grabado es el 85-90% del cuadro) el verde gana
  assert.ok(r < 60, "asi fue como el 85% del cuadro salio verde");
  assert.ok(g > 180);
});

test("acento 0 deja la imagen en duotono puro (sin verde en ningún tono)", () => {
  const p = { accent: 0 };
  for (const l of [0, 64, 128, 200, 255]) {
    const r = evaluar(duotoneExpr("r", p), l);
    const g = evaluar(duotoneExpr("g", p), l);
    assert.ok(Math.abs(g - r) < 8, `en duotono r y g van juntos (l=${l})`);
  }
});

test("preset onia: acento en sombras y duotono prendido", () => {
  assert.equal(PRESETS.onia.duotone, true);
  assert.equal(PRESETS.onia.accentSide, "sombras");
  assert.ok(PRESETS.onia.accent > 0.5);
});

test("los presets neutros NO llevan marca (para material fuera de la serie)", () => {
  for (const k of ["diario", "grabado", "limpio"]) {
    assert.ok(!PRESETS[k].duotone, `${k} no deberia teñir`);
  }
});

test("buildFilter: el duotono va DESPUÉS de la retícula", () => {
  const f = buildFilter(PRESETS.onia);
  assert.ok(f.indexOf("blend=") < f.indexOf("geq=r="), "primero la trama, después el color");
  assert.ok(f.endsWith("[out]"));
});

test("buildFilter sin retícula sigue aplicando la marca", () => {
  const f = buildFilter({ ...PRESETS.onia, dot: 0, mix: 0 });
  assert.match(f, /geq=r=/);
  assert.ok(!f.includes("blend="));
});

test("halftoneExpr: el punto no baja de 2px", () => {
  assert.match(halftoneExpr(1), /PI\*X\/2/);
});

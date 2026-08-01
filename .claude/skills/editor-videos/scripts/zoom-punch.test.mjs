// Tests de zoom-punch.mjs. Correr: node --test .claude/skills/editor-videos/scripts/zoom-punch.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeWindows, autoWindowsFromKeep, zoomExpr, MAX_Z, ANCHORS } from "./zoom-punch.mjs";

test("normalizeWindows: z suelto = punch fijo (from === to, no animado)", () => {
  const [w] = normalizeWindows([{ start: 0, end: 2, z: 1.08 }]);
  assert.equal(w.from, 1.08);
  assert.equal(w.to, 1.08);
  assert.equal(w.animated, false);
});

test("normalizeWindows: from/to distintos = ken animado", () => {
  const [w] = normalizeWindows([{ start: 0, end: 2, from: 1, to: 1.15 }]);
  assert.equal(w.animated, true);
});

test("normalizeWindows: rechaza end <= start", () => {
  assert.throws(() => normalizeWindows([{ start: 2, end: 2, z: 1.1 }]), /debe ser >/);
});

test("normalizeWindows: rechaza zoom < 1 (achicar deja bordes negros)", () => {
  assert.throws(() => normalizeWindows([{ start: 0, end: 1, z: 0.9 }]), /debe ser >= 1/);
});

test("normalizeWindows: rechaza zoom por encima del máximo", () => {
  assert.throws(() => normalizeWindows([{ start: 0, end: 1, z: MAX_Z + 0.1 }]), /pasa el máximo/);
});

test("normalizeWindows: rechaza anchor desconocido", () => {
  assert.throws(() => normalizeWindows([{ start: 0, end: 1, z: 1.1, anchor: "diagonal" }]), /anchor "diagonal"/);
});

test("normalizeWindows: rechaza ventanas que se pisan", () => {
  assert.throws(() => normalizeWindows([{ start: 0, end: 3, z: 1.1 }, { start: 2, end: 4, z: 1.2 }]), /no se pueden pisar/);
});

test("normalizeWindows: ordena por tiempo aunque vengan desordenadas", () => {
  const ws = normalizeWindows([{ start: 5, end: 6, z: 1.1 }, { start: 0, end: 1, z: 1.2 }]);
  assert.deepEqual(ws.map((w) => w.start), [0, 5]);
});

test("autoWindowsFromKeep: los bloques quedan pegados (tiempos del video YA cortado)", () => {
  // keep en tiempos del crudo: 2s + 3s de contenido, con un silencio en el medio
  const wins = autoWindowsFromKeep([{ start: 10, end: 12 }, { start: 20, end: 23 }], [1, 1.08]);
  assert.deepEqual(wins.map((w) => [w.start, w.end]), [[0, 2], [2, 5]]);
});

test("autoWindowsFromKeep: alterna los niveles bloque a bloque (así el jump cut no se nota)", () => {
  const wins = autoWindowsFromKeep([{ start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }], [1, 1.08, 1.04]);
  assert.deepEqual(wins.map((w) => w.z), [1, 1.08, 1.04]);
});

test("autoWindowsFromKeep: ignora bloques de duración cero o negativa", () => {
  const wins = autoWindowsFromKeep([{ start: 0, end: 0 }, { start: 5, end: 7 }], [1.05]);
  assert.equal(wins.length, 1);
  assert.deepEqual([wins[0].start, wins[0].end], [0, 2]);
});

test("zoomExpr: fuera de toda ventana el zoom es 1 (sin zoom)", () => {
  assert.equal(zoomExpr([]), "1");
  assert.match(zoomExpr(normalizeWindows([{ start: 0, end: 1, z: 1.1 }])), /,1\)$/);
});

test("zoomExpr: punch entra como constante dentro de su ventana", () => {
  const e = zoomExpr(normalizeWindows([{ start: 0, end: 2, z: 1.08 }]));
  assert.equal(e, "if(between(it,0,2),1.08,1)");
});

test("zoomExpr: ken usa smoothstep sobre el avance normalizado", () => {
  const e = zoomExpr(normalizeWindows([{ start: 1, end: 3, from: 1, to: 1.2 }]));
  assert.match(e, /clip\(\(it-1\)\/2,0,1\)/);
  assert.match(e, /\(3-2\*/); // p*p*(3-2p)
  assert.match(e, /1\+0\.2\*/);
});

test("zoomExpr: varias ventanas anidan en orden temporal", () => {
  const e = zoomExpr(normalizeWindows([{ start: 0, end: 1, z: 1.05 }, { start: 2, end: 3, z: 1.1 }]));
  assert.ok(e.indexOf("between(it,0,1)") < e.indexOf("between(it,2,3)"));
});

test("ANCHORS: en vertical el anchor top apunta arriba del centro (ahí está la cara)", () => {
  assert.ok(ANCHORS.top[1] < ANCHORS.center[1]);
  assert.equal(ANCHORS.center[0], 0.5);
});

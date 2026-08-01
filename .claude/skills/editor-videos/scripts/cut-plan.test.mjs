// Tests de cut-plan.mjs. Correr: node --test .claude/skills/editor-videos/scripts/cut-plan.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { norm, fillerRatio, isRetakeOf, speechFromSilence, subtractRanges, parseSilenceLog, round2 } from "./cut-plan.mjs";

test("norm: saca puntuación y mayúsculas", () => {
  assert.equal(norm("¿Entonces, qué?"), "entonces qué");
});

test("fillerRatio: un segmento que es puro relleno se detecta", () => {
  assert.ok(fillerRatio("eh, este, o sea") >= 0.6);
  assert.ok(fillerRatio("hoy tenemos seis doctores") < 0.6);
});

test("isRetakeOf: la trabada es prefijo de la buena", () => {
  // pide prefijo fuerte: la trabada tiene que ser >=50% de la buena
  assert.equal(isRetakeOf("tenemos seis doc", "tenemos seis doctores"), true);
  assert.equal(isRetakeOf("tenemos seis doc", "tenemos seis doctores en el sistema entero"), false);
  assert.equal(isRetakeOf("hola", "chau"), false);
});

test("parseSilenceLog: lee los pares start/end de ffmpeg", () => {
  const log = [
    "[silencedetect] silence_start: 3.475896",
    "[silencedetect] silence_end: 4.158617 | silence_duration: 0.682721",
    "[silencedetect] silence_start: 7.156349",
    "[silencedetect] silence_end: 8.116122 | silence_duration: 0.959773",
  ].join("\n");
  const s = parseSilenceLog(log);
  assert.equal(s.length, 2);
  assert.equal(round2(s[0].start), 3.48);
  assert.equal(round2(s[1].end), 8.12);
});

test("parseSilenceLog: un silence_start sin su end no inventa un tramo", () => {
  assert.equal(parseSilenceLog("silence_start: 5.0").length, 0);
});

test("speechFromSilence: el habla es el complemento del silencio", () => {
  const b = speechFromSilence([{ start: 3.5, end: 4.2 }], 10, { pad: 0, minKeep: 0.2, join: 0 });
  assert.deepEqual(b.map((x) => [round2(x.start), round2(x.end)]), [[0, 3.5], [4.2, 10]]);
});

test("speechFromSilence: el pad deja aire a los lados (no se come la consonante)", () => {
  const b = speechFromSilence([{ start: 3.5, end: 4.5 }], 10, { pad: 0.1, minKeep: 0.2, join: 0 });
  assert.equal(round2(b[0].end), 3.6);
  assert.equal(round2(b[1].start), 4.4);
});

test("speechFromSilence: no se sale del clip ni por izquierda ni por derecha", () => {
  const b = speechFromSilence([{ start: 0, end: 1 }], 5, { pad: 0.5, minKeep: 0.2, join: 0 });
  assert.ok(b[0].start >= 0);
  assert.ok(b[b.length - 1].end <= 5);
});

test("speechFromSilence: los restos impronunciables se descartan", () => {
  const b = speechFromSilence([{ start: 0.2, end: 5 }], 6, { pad: 0, minKeep: 0.35, join: 0 });
  assert.equal(b.length, 1); // el resto de 0.2s del arranque se cae
  assert.equal(round2(b[0].start), 5);
});

test("speechFromSilence: dos bloques casi pegados se unen (join)", () => {
  const b = speechFromSilence([{ start: 2, end: 2.05 }], 6, { pad: 0, minKeep: 0.2, join: 0.12 });
  assert.equal(b.length, 1);
});

test("speechFromSilence: silencios solapados no rompen el complemento", () => {
  const b = speechFromSilence([{ start: 1, end: 3 }, { start: 2, end: 4 }], 6, { pad: 0, minKeep: 0.2, join: 0 });
  assert.deepEqual(b.map((x) => [round2(x.start), round2(x.end)]), [[0, 1], [4, 6]]);
});

test("subtractRanges: la muletilla se recorta del medio de un bloque", () => {
  const out = subtractRanges([{ start: 0, end: 10 }], [{ start: 4, end: 5 }], 0.3);
  assert.deepEqual(out.map((x) => [x.start, x.end]), [[0, 4], [5, 10]]);
});

test("subtractRanges: si el corte tapa el bloque entero, no queda nada", () => {
  assert.equal(subtractRanges([{ start: 2, end: 3 }], [{ start: 0, end: 10 }], 0.3).length, 0);
});

test("subtractRanges: un corte que no toca el bloque lo deja intacto", () => {
  const out = subtractRanges([{ start: 0, end: 2 }], [{ start: 5, end: 6 }], 0.3);
  assert.deepEqual(out.map((x) => [x.start, x.end]), [[0, 2]]);
});

test("caso REAL medido: 4 silencios en un clip de 15s (el modo viejo veía 0)", () => {
  const silencios = [
    { start: 3.475896, end: 4.158617 },
    { start: 7.156349, end: 8.116122 },
    { start: 11.530431, end: 12.474059 },
    { start: 14.475238, end: 15.046531 },
  ];
  const keep = speechFromSilence(silencios, 15.05, { pad: 0.08, minKeep: 0.35, join: 0.12 });
  const final = keep.reduce((a, k) => a + (k.end - k.start), 0);
  assert.equal(keep.length, 4);
  assert.ok(final < 13, `deberia recortar ~2.5s, quedó en ${final.toFixed(2)}s`);
  assert.ok(final > 11, "no puede comerse el habla");
});

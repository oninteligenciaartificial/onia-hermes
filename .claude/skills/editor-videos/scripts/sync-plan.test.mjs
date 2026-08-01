// Tests de sync-plan.mjs. Correr: node --test .claude/skills/editor-videos/scripts/sync-plan.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { normToken, tokenizeCue, matchCue, buildOverlays, MIN_VISIBLE } from "./sync-plan.mjs";

// Palabras de un transcript real: el ASR mete acentos, mayúsculas y puntuación pegada.
const W = (list) => list.map(([word, start, end]) => ({ word, start, end, norm: normToken(word) })).filter((w) => w.norm);

const narracion = W([
  ["Hoy", 0.0, 0.3],
  ["el", 0.3, 0.45],
  ["sistema", 0.45, 0.9],
  ["tiene", 0.9, 1.2],
  ["seis", 1.2, 1.5],
  ["doctores,", 1.5, 2.1],
  ["y", 2.1, 2.2],
  ["el", 2.2, 2.35],
  ["sistema", 2.35, 2.8],
  ["agenda", 2.8, 3.4],
  ["solo.", 3.4, 3.9],
]);

test("normToken: saca acentos, puntuación y mayúsculas", () => {
  assert.equal(normToken("Doctores,"), "doctores");
  assert.equal(normToken("MÉDICO"), "medico");
  assert.equal(normToken("¿cuántos?"), "cuantos");
  assert.equal(normToken("vídeo"), "video");
  assert.equal(normToken("—"), "");
});

test("tokenizeCue: separa en palabras normalizadas", () => {
  assert.deepEqual(tokenizeCue("Seis Doctores"), ["seis", "doctores"]);
  assert.deepEqual(tokenizeCue("  el   sistema "), ["el", "sistema"]);
});

test("matchCue: machea multi-palabra y devuelve el tiempo de la PRIMERA", () => {
  const hit = matchCue(narracion, tokenizeCue("seis doctores"));
  assert.equal(hit.start, 1.2);
  assert.equal(hit.end, 2.1);
  assert.equal(hit.outOfOrder, false);
});

test("matchCue: es monotónico — un cue repetido dispara en la aparición que sigue al cursor", () => {
  const first = matchCue(narracion, tokenizeCue("sistema"), 0);
  assert.equal(first.start, 0.45);
  const second = matchCue(narracion, tokenizeCue("sistema"), first.endIndex + 1);
  assert.equal(second.start, 2.35);
});

test("matchCue: si el cue no existe devuelve null (no inventa un tiempo)", () => {
  assert.equal(matchCue(narracion, tokenizeCue("radiografia")), null);
});

test("matchCue: si solo aparece ANTES del cursor, lo usa pero avisa fuera de orden", () => {
  const hit = matchCue(narracion, tokenizeCue("hoy"), 5);
  assert.equal(hit.start, 0);
  assert.equal(hit.outOfOrder, true);
});

test("buildOverlays: el apoyo entra en la palabra exacta y dura el hold", () => {
  const { overlays } = buildOverlays(narracion, [{ cue: "seis doctores", asset: "a.png" }], { hold: 2, fade: 0.3 });
  assert.equal(overlays.length, 1);
  assert.equal(overlays[0].start, 1.2);
  assert.equal(overlays[0].end, 3.2);
  assert.equal(overlays[0].fade, 0.3);
  assert.equal(overlays[0].cue, "seis doctores");
});

test("buildOverlays: lead negativo anticipa el apoyo y nunca cae bajo 0", () => {
  const { overlays } = buildOverlays(narracion, [{ cue: "hoy", asset: "a.png", lead: -0.5 }], { hold: 1 });
  assert.equal(overlays[0].start, 0);
});

test('buildOverlays: until "next" estira el apoyo hasta el siguiente beat', () => {
  const { overlays } = buildOverlays(
    narracion,
    [
      { cue: "seis doctores", asset: "a.png", until: "next" },
      { cue: "agenda", asset: "b.png" },
    ],
    { hold: 10, gap: 0.05 },
  );
  assert.equal(overlays[0].start, 1.2);
  assert.equal(overlays[0].end, 2.75); // 2.8 (arranque de "agenda") − 0.05 de aire
});

test("buildOverlays: nada se agenda más allá del final del video", () => {
  const { overlays } = buildOverlays(narracion, [{ cue: "agenda", asset: "a.png" }], { hold: 10, duration: 4 });
  assert.equal(overlays[0].end, 4);
});

test("buildOverlays: dos apoyos en la MISMA posición no se pisan (se acorta el primero)", () => {
  const res = buildOverlays(
    narracion,
    [
      { cue: "sistema", asset: "a.png", position: "top" },
      { cue: "agenda", asset: "b.png", position: "top" },
    ],
    { hold: 5, gap: 0.05 },
  );
  assert.equal(res.overlays[0].end, 2.75);
  assert.equal(res.overlays[1].start, 2.8);
  assert.match(res.warnings.join(" "), /se pisaba/);
});

test("buildOverlays: en posiciones distintas SÍ pueden solaparse", () => {
  const res = buildOverlays(
    narracion,
    [
      { cue: "sistema", asset: "a.png", position: "top" },
      { cue: "agenda", asset: "b.png", position: "bottom" },
    ],
    { hold: 5 },
  );
  assert.equal(res.warnings.length, 0);
  assert.ok(res.overlays[0].end > res.overlays[1].start);
});

test("buildOverlays: un cue que no aparece se REPORTA, no se inventa", () => {
  const res = buildOverlays(narracion, [{ cue: "implante dental", asset: "a.png" }], {});
  assert.equal(res.overlays.length, 0);
  assert.equal(res.misses.length, 1);
  assert.match(res.misses[0].why, /no aparece/);
});

test("buildOverlays: beat sin asset o sin cue/at se reporta", () => {
  const res = buildOverlays(narracion, [{ cue: "agenda" }, { asset: "b.png" }], {});
  assert.equal(res.overlays.length, 0);
  assert.equal(res.misses.length, 2);
});

test("buildOverlays: un apoyo que queda ilegible (< MIN_VISIBLE) se descarta y se avisa", () => {
  const res = buildOverlays(
    narracion,
    [
      { cue: "seis", asset: "a.png", position: "top", until: "next" },
      { cue: "doctores", asset: "b.png", position: "top" },
    ],
    { hold: 5, gap: 0.05 },
  );
  assert.equal(res.overlays.length, 1);
  assert.equal(res.overlays[0].asset, "b.png");
  assert.match(res.misses[0].why, new RegExp(`< ${MIN_VISIBLE}s`));
});

test('buildOverlays: beat con "at" fijo no necesita cue', () => {
  const { overlays } = buildOverlays(narracion, [{ at: 3.5, asset: "cta.png" }], { hold: 1 });
  assert.equal(overlays[0].start, 3.5);
  assert.equal(overlays[0].end, 4.5);
});

test("buildOverlays: la salida está ordenada por tiempo real de aparición", () => {
  const { overlays } = buildOverlays(
    narracion,
    [
      { at: 3.5, asset: "z.png" },
      { cue: "hoy", asset: "a.png" },
    ],
    { hold: 0.5 },
  );
  assert.deepEqual(overlays.map((o) => o.asset), ["a.png", "z.png"]);
});

// Tests de normalize-source.mjs. Correr: node --test .claude/skills/editor-videos/scripts/normalize-source.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProbe, esHdrTransfer, HDR_TRANSFERS, tonemapChain } from "./normalize-source.mjs";

// Salida REAL de ffprobe sobre un IMG_*.MOV de iPhone. Ojo el orden: se pidieron
// color_transfer,color_primaries,color_space,pix_fmt y ffprobe los devuelve en el SUYO.
const SALIDA_IPHONE = ["pix_fmt=yuv420p10le", "color_space=bt2020nc", "color_transfer=arib-std-b67", "color_primaries=bt2020"].join("\n");

test("parseProbe: lee por NOMBRE, no por posición", () => {
  const info = parseProbe(SALIDA_IPHONE);
  assert.equal(info.color_transfer, "arib-std-b67");
  assert.equal(info.pix_fmt, "yuv420p10le");
  assert.equal(info.color_primaries, "bt2020");
});

test("el bug real: leer por posición daba pix_fmt como transfer y el HDR pasaba como SDR", () => {
  const porPosicion = SALIDA_IPHONE.split("\n").map((l) => l.split("=")[1]);
  assert.equal(porPosicion[0], "yuv420p10le");
  assert.equal(esHdrTransfer(porPosicion[0]), false, "así es como el HDR se coló como SDR");
  assert.equal(esHdrTransfer(parseProbe(SALIDA_IPHONE).color_transfer), true);
});

test("esHdrTransfer: HLG y PQ son HDR; bt709 no", () => {
  assert.equal(esHdrTransfer("arib-std-b67"), true); // HLG (iPhone)
  assert.equal(esHdrTransfer("smpte2084"), true); // PQ
  assert.equal(esHdrTransfer("bt709"), false);
  assert.equal(esHdrTransfer(""), false);
  assert.equal(esHdrTransfer(undefined), false);
});

test("esHdrTransfer: tolera espacios y saltos de línea de ffprobe", () => {
  assert.equal(esHdrTransfer(" arib-std-b67 \r"), true);
});

test("parseProbe: campo vacío no rompe ni inventa valor", () => {
  const info = parseProbe("color_space=\ncolor_transfer=bt709");
  assert.equal(info.color_space, "");
  assert.equal(esHdrTransfer(info.color_space), false);
});

test("HDR_TRANSFERS: las dos curvas que hay que mapear", () => {
  assert.deepEqual([...HDR_TRANSFERS].sort(), ["arib-std-b67", "smpte2084"]);
});

test("tonemapChain: linealiza ANTES de mapear y vuelve a bt709 limitado", () => {
  const c = tonemapChain();
  assert.ok(c.indexOf("zscale=t=linear") < c.indexOf("tonemap="), "hay que linealizar antes del tonemap");
  assert.match(c, /tonemap=tonemap=hable:desat=0/); // desat>0 lava los tonos de piel
  assert.match(c, /zscale=t=bt709:m=bt709:r=tv/);
  assert.ok(c.trim().endsWith("format=yuv420p"));
});

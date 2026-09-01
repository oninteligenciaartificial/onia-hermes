#!/usr/bin/env node
/**
 * validate_palette.js — gate de contraste WCAG para una paleta.
 *
 * Nace del crítico del workflow (2026-08-29): la fórmula y el dashboard-bank
 * citaban este script como gate [CRÍTICO] pero NO existía en disco. Ahora sí.
 * Chequea cada color contra la superficie (fondo) por contraste WCAG 2.1:
 * texto normal exige 4.5:1, texto grande/UI 3:1.
 *
 * Uso:
 *   node scripts/validate_palette.js "#0d6b5c,#c98a3b,#172420" --mode light
 *   node scripts/validate_palette.js "#eafaf1,#00d26a" --mode dark --surface "#0c1013"
 *
 * Salida: tabla color→ratio→veredicto; exit 1 si algún par de texto cae de 4.5:1.
 */
function srgbToLin(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`hex inválido: ${hex}`);
  const n = parseInt(m[1], 16);
  const r = srgbToLin((n >> 16) & 255);
  const g = srgbToLin((n >> 8) & 255);
  const b = srgbToLin(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const la = luminance(a), lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const args = process.argv.slice(2);
const hexes = (args[0] || "").split(",").map((s) => s.trim()).filter(Boolean);
const mode = (args.includes("--mode") ? args[args.indexOf("--mode") + 1] : "light");
const surfaceArg = args.includes("--surface") ? args[args.indexOf("--surface") + 1] : null;
const surface = surfaceArg || (mode === "dark" ? "#0c1013" : "#ffffff");

if (!hexes.length) {
  console.error('uso: node scripts/validate_palette.js "#hex,#hex" --mode light|dark [--surface #hex]');
  process.exit(2);
}

let fail = 0;
console.log(`Superficie (${mode}): ${surface}\n`);
console.log("color      ratio   texto-normal(4.5)  UI/grande(3.0)");
for (const h of hexes) {
  const r = ratio(h, surface);
  const okText = r >= 4.5, okUi = r >= 3;
  if (!okText) fail++;
  console.log(
    `${h.padEnd(9)}  ${r.toFixed(2).padStart(5)}   ${okText ? "PASA " : "FALLA"}              ${okUi ? "PASA" : "FALLA"}`,
  );
}
console.log(`\n${fail === 0 ? "OK: todos ≥4.5:1 sobre la superficie" : `FALLA: ${fail} color(es) < 4.5:1 como texto`}`);
process.exit(fail === 0 ? 0 : 1);

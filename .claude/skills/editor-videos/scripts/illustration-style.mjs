// editor-videos — ESTILO DE ILUSTRACIÓN: la capa que hace que 155 videos parezcan una serie.
//
// El reel de @human___academy genera los recortes "ya en el estilo correcto" pidiéndoselo al
// modelo. Probado 2026-07-30 con recraft_v4_1: pedir "1960s newspaper photograph, coarse
// halftone" devuelve una foto en blanco y negro LIMPIA, sin retícula. Un modelo obedece el
// estilo "más o menos", y ese "más o menos" cambia entre una imagen y la siguiente — con 155
// videos eso ya no es una serie, es un collage.
//
// Entonces: el MODELO pone el CONTENIDO (qué se ve) y el CÓDIGO pone el ESTILO (cómo se ve).
// Este script aplica el tratamiento de la casa a CUALQUIER imagen —venga de Higgsfield, de un
// modelo gratis o de una foto del celular— y siempre sale igual. Determinista: misma entrada,
// mismos flags, mismo PNG.
//
// Uso:
//   node illustration-style.mjs --image bruta.png --out assets/ilu.png [--preset diario]
//        [--dot 4] [--mix 0.78] [--contrast 1.35] [--grain 6] [--dry-run]
//
// Presets:
//   diario    — blanco y negro, retícula de puntos, grano de papel. El look del reel.
//   grabado   — más contraste y retícula fina: se lee como grabado/xilografía.
//   limpio    — solo blanco y negro + contraste, sin retícula (para cuando la imagen ya tiene
//               mucho detalle y la trama la ensucia).
import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const argv = process.argv.slice(2);
const has = (n) => argv.includes("--" + n);
const flag = (n, d) => {
  const i = argv.indexOf("--" + n);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : d;
};
const fail = (m) => {
  console.error("illustration-style: " + m);
  process.exit(1);
};

export const PRESETS = {
  diario: { dot: 4, mix: 0.78, contrast: 1.35, brightness: 0.02, grain: 6 },
  grabado: { dot: 3, mix: 0.92, contrast: 1.6, brightness: 0.0, grain: 4 },
  limpio: { dot: 0, mix: 0, contrast: 1.25, brightness: 0.03, grain: 3 },
};

// Retícula de medios tonos REAL: el punto crece con la oscuridad, no es una trama fija
// encima. El umbral sube hacia el centro de cada celda, así que en las zonas claras solo
// sobrevive un punto chico en el centro y en las oscuras el punto se come la celda.
export function halftoneExpr(dot) {
  const s = Math.max(2, Number(dot));
  return `255*gt(lum(X,Y)\\,255*(0.5+0.45*sin(PI*X/${s})*sin(PI*Y/${s})))`;
}

export function buildFilter(p) {
  const base = `format=gray,eq=contrast=${p.contrast}:brightness=${p.brightness}`;
  const grain = p.grain > 0 ? `,noise=alls=${p.grain}:allf=t+u:all_seed=1312` : "";
  if (!(p.dot > 0) || !(p.mix > 0)) return `[0:v]${base}${grain},format=rgb24[out]`;
  // split → una rama con la retícula, otra sin ella, y se mezclan: 100% de trama se ve
  // durísimo en un video, y mezclada con el gris conserva la lectura de la imagen.
  return (
    `[0:v]${base},split[a][b];` +
    `[b]geq=lum='${halftoneExpr(p.dot)}'[ht];` +
    `[a][ht]blend=all_mode=normal:all_opacity=${p.mix}${grain},format=rgb24[out]`
  );
}

// ---- CLI --------------------------------------------------------------------
const isMain = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("illustration-style.mjs");
if (isMain) {
  const IMAGE = flag("image");
  const OUT = flag("out");
  const PRESET = flag("preset", "diario");
  if (!IMAGE) fail("falta --image <bruta.png>");
  if (!OUT) fail("falta --out <tratada.png>");
  if (!existsSync(IMAGE)) fail(`no existe la imagen: ${IMAGE}`);
  if (!PRESETS[PRESET]) fail(`--preset desconocido "${PRESET}" (usá: ${Object.keys(PRESETS).join(" | ")})`);

  const p = { ...PRESETS[PRESET] };
  if (flag("dot") !== undefined) p.dot = Number(flag("dot"));
  if (flag("mix") !== undefined) p.mix = Number(flag("mix"));
  if (flag("contrast") !== undefined) p.contrast = Number(flag("contrast"));
  if (flag("grain") !== undefined) p.grain = Number(flag("grain"));
  if (!(p.mix >= 0 && p.mix <= 1)) fail("--mix va de 0 a 1");
  if (p.dot && p.dot < 2) fail("--dot mínimo 2 (más chico no imprime punto, ensucia)");

  const filter = buildFilter(p);
  const args = ["-y", "-i", IMAGE, "-filter_complex", filter, "-map", "[out]", "-frames:v", "1", OUT];

  console.log(`\nESTILO DE ILUSTRACIÓN — preset "${PRESET}"`);
  console.log(`  retícula: ${p.dot > 0 ? `punto ${p.dot}px, mezcla ${Math.round(p.mix * 100)}%` : "sin retícula"}`);
  console.log(`  contraste ${p.contrast} · grano ${p.grain}`);
  console.log(`  ${IMAGE} → ${OUT}\n`);
  console.log("filter_complex:\n" + filter + "\n");

  if (has("dry-run")) {
    console.error("--dry-run: no se escribió nada.");
    process.exit(0);
  }
  mkdirSync(dirname(resolve(OUT)), { recursive: true });
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.error) fail(`no pude ejecutar ffmpeg: ${r.error.message}`);
  if (r.status !== 0) fail(`ffmpeg falló: ${String(r.stderr || "").split("\n").slice(-6).join("\n")}`);
  console.log(`illustration-style: listo → ${OUT}`);
  console.log(`siguiente: meterla en el marco de papel →`);
  console.log(`  node make-mockup.mjs --template custom --html-file ../assets/html/recorte-diario.html --image ${OUT} --out assets/recorte.png --title "…" --label "…"`);
}

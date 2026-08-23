// editor-videos — HISTORIAS EN TANDA: b-roll ya generado + placa de codigo → 9:16 listo.
//
// Las historias son el latido diario de una cuenta (1-2/dia) y no pueden costar
// creditos: se arman RECICLANDO b-roll que ya se genero y pago, con una placa escrita
// en codigo encima. Este script encadena los tres pasos que ya existian sueltos:
//
//   normalize-source.mjs  (clip → 1080x1920 SDR)
//        → make-mockup.mjs   (titulo/bajada → PNG con alpha)
//             → overlay-visuals.mjs (compone, con fade)
//
// Uso:
//   node story-batch.mjs --plan historias/plan.json --out historias/ [--only H03] [--dry-run]
//
// plan.json:
//   { "accent": "#10C26B",
//     "stories": [
//       { "id":"H01", "clip":"ruta/al/broll.mp4",
//         "title":"El margen que calculás de memoria",
//         "subtitle":"es el que te está comiendo la ganancia" }
//   ]}
//
// 🔴 ZONA SEGURA DE INSTAGRAM. La barra de "Enviar mensaje" tapa el ~15% inferior de
// la historia y el nombre de la cuenta el ~10% superior. Una placa pegada al borde
// se lee perfecta en el render y APARECE CORTADA en el telefono. Por eso el margen
// inferior por defecto es .20 y no el .08 de overlay-visuals: medido sobre una
// historia real el 2026-08-23, con .08 la ultima linea queda debajo de la barra.
//
// Determinista: mismos flags → mismo MP4. Sin dependencias nuevas.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const has = (n) => argv.includes("--" + n);
const flag = (n, d) => {
  const i = argv.indexOf("--" + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

// Zona segura IG: la barra de respuesta come el fondo, el header el techo.
const SAFE_BOTTOM = 0.20;
const PLATE_W = 900;
const PLATE_H = 430;
const FADE = 0.35;
const SCALE = 0.82;

function run(script, args) {
  const r = spawnSync(process.execPath, [join(HERE, script), ...args], {
    stdio: "inherit",
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(`${script} fallo (exit ${r.status})`);
}

function buildOne(story, outDir, accent, dry) {
  const { id, clip, title, subtitle } = story;
  if (!existsSync(clip)) throw new Error(`${id}: no existe el clip ${clip}`);
  const base = join(outDir, "clips", `${id}-base.mp4`);
  const plate = join(outDir, "placas", `${id}.png`);
  const plan = join(outDir, "planes", `${id}.json`);
  const final = join(outDir, "final", `${id}.mp4`);
  if (dry) {
    console.log(`[dry] ${id}: ${clip} + "${title}" → ${final}`);
    return final;
  }

  run("normalize-source.mjs", ["--video", clip, "--out", base,
    "--width", "1080", "--height", "1920", "--fps", "30"]);

  const plateArgs = ["--template", "quote", "--out", plate, "--title", title,
    "--accent", accent, "--width", String(PLATE_W), "--height", String(PLATE_H)];
  if (subtitle) plateArgs.push("--subtitle", subtitle);
  run("make-mockup.mjs", plateArgs);

  const dur = durationOf(base);
  writeFileSync(plan, JSON.stringify({
    overlays: [{
      asset: plate, start: 0.4, end: Math.max(1.2, dur - 0.05),
      position: "bottom", scale: SCALE, fade: FADE, marginY: SAFE_BOTTOM,
    }],
  }, null, 2));

  run("overlay-visuals.mjs", ["--video", base, "--plan", plan, "--out", final]);
  return final;
}

function durationOf(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
    "-of", "default=nw=1:nk=1", file], { encoding: "utf8" });
  const d = parseFloat(String(r.stdout).trim());
  return Number.isFinite(d) && d > 0 ? d : 6;
}

function main() {
  const planPath = flag("plan");
  const outDir = flag("out", "historias");
  const only = flag("only");
  const dry = has("dry-run");
  if (!planPath) throw new Error("falta --plan");

  const plan = JSON.parse(readFileSync(planPath, "utf8"));
  const accent = plan.accent || "#10C26B";
  const stories = plan.stories.filter((s) => !only || s.id === only);
  if (!stories.length) throw new Error(only ? `no hay historia ${only}` : "el plan no tiene historias");

  for (const sub of ["clips", "placas", "planes", "final"]) {
    mkdirSync(resolve(outDir, sub), { recursive: true });
  }

  const hechas = [];
  for (const s of stories) hechas.push(buildOne(s, outDir, accent, dry));
  console.log(`\nstory-batch: ${hechas.length} historia(s) →\n` + hechas.join("\n"));
}

// Autochequeo: la zona segura es la regla que este script existe para no olvidar.
// Corre con `node story-batch.mjs --self-check`. Falla si alguien la baja al default.
if (has("self-check")) {
  const assert = (cond, msg) => { if (!cond) { console.error("FALLA: " + msg); process.exit(1); } };
  assert(SAFE_BOTTOM >= 0.15, "margen inferior por debajo de la zona segura de IG (>=0.15)");
  assert(SCALE > 0 && SCALE <= 0.9, "la placa no puede ocupar mas del 90% del ancho");
  assert(durationOf("no-existe-este-archivo.mp4") === 6, "durationOf debe caer a 6s si ffprobe falla");
  console.log("self-check ok");
} else {
  main();
}

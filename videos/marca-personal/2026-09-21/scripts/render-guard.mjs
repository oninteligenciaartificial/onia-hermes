import { existsSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const statusPath = join(root, "project-status.json");
const baseCut = join(root, "work", "base-cut.mp4");
const visual = join(root, "work", "visual.mp4");
const output = join(root, "renders", "01-feed-3-nodos-v1.mp4");
const status = JSON.parse(readFileSync(statusPath, "utf8"));
const browserPath =
  "C:\\Users\\PC\\.cache\\puppeteer\\chrome-headless-shell\\win64-150.0.7871.24\\chrome-headless-shell-win64\\chrome-headless-shell.exe";

if (!status.renderAllowed || status.status !== "ready-to-render") {
  console.error(`RENDER_BLOQUEADO: ${status.blockedReason}`);
  console.error("La composición debe pasar check y snapshots antes del master final.");
  process.exit(2);
}

if (!existsSync(baseCut)) {
  console.error(`RENDER_BLOQUEADO: falta el corte base: ${baseCut}`);
  process.exit(2);
}

if (existsSync(output)) {
  console.error(`RENDER_BLOQUEADO: la salida ya existe y no se sobrescribe: ${output}`);
  process.exit(3);
}

const validate = spawnSync(process.execPath, [join(root, "scripts", "validate-input.mjs")], {
  cwd: root,
  stdio: "inherit",
});
if (validate.status !== 0) process.exit(validate.status ?? 1);

rmSync(visual, { force: true });
const npxCli = join(dirname(process.execPath), "node_modules", "npm", "bin", "npx-cli.js");
const render = spawnSync(
  process.execPath,
  [npxCli,
    "--yes", "hyperframes@0.8.58", "render", ".", "-o", visual, "--fps", "30"],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      HYPERFRAMES_BROWSER_PATH: browserPath,
      PRODUCER_BROWSER_GPU_MODE: "hardware",
    },
  },
);
if (render.error) console.error(render.error);
if (render.status !== 0) process.exit(render.status ?? 1);

const measure = spawnSync(
  "ffmpeg",
  [
    "-hide_banner", "-nostats", "-i", baseCut,
    "-af", "loudnorm=I=-14:TP=-1.8:LRA=11:print_format=json",
    "-f", "null", "NUL",
  ],
  { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
);
if (measure.status !== 0) {
  console.error(measure.stderr);
  process.exit(measure.status ?? 1);
}

const match = measure.stderr.match(/\{[\s\S]*?"target_offset"\s*:\s*"[^"]+"[\s\S]*?\}/);
if (!match) {
  console.error("No se pudo leer la medición loudnorm de FFmpeg.");
  process.exit(1);
}
const loudness = JSON.parse(match[0]);
const filter =
  `[1:a:0]loudnorm=I=-14:TP=-1.8:LRA=11:` +
  `measured_I=${loudness.input_i}:measured_TP=${loudness.input_tp}:` +
  `measured_LRA=${loudness.input_lra}:measured_thresh=${loudness.input_thresh}:` +
  `offset=${loudness.target_offset}:linear=true:print_format=summary,` +
  "aresample=48000[aout]";

const mux = spawnSync(
  "ffmpeg",
  [
    "-hide_banner", "-loglevel", "warning", "-i", visual, "-i", baseCut,
    "-filter_complex", filter,
    "-map", "0:v:0", "-map", "[aout]",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-movflags", "+faststart", "-shortest", output,
  ],
  { cwd: root, stdio: "inherit" },
);
if (mux.status !== 0) process.exit(mux.status ?? 1);

console.log(`RENDER_OK: ${output}`);

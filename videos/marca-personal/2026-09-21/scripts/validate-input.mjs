import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const files = {
  camera: join(root, "raw", "01-feed-3-nodos-camera.mp4"),
  baseCut: join(root, "work", "base-cut.mp4"),
};

function probe(file) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v", "error",
      "-show_entries", "format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels",
      "-of", "json",
      file,
    ],
    { encoding: "utf8" },
  );
  if (result.error) throw new Error(`No se pudo ejecutar ffprobe: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`ffprobe rechazó ${file}: ${result.stderr.trim()}`);
  return JSON.parse(result.stdout);
}

for (const [kind, file] of Object.entries(files)) {
  if (!existsSync(file)) {
    console.error(`FALTA_BRUTO: ${file}`);
    process.exit(2);
  }
  const metadata = probe(file);
  const streams = metadata.streams ?? [];
  if (!streams.some((stream) => stream.codec_type === "video")) {
    throw new Error(`${kind} no contiene video: ${file}`);
  }
  if (!streams.some((stream) => stream.codec_type === "audio")) {
    throw new Error(`${kind} no contiene audio: ${file}`);
  }
  if (kind === "baseCut") {
    const video = streams.find((stream) => stream.codec_type === "video");
    const audio = streams.find((stream) => stream.codec_type === "audio");
    const duration = Number(metadata.format?.duration ?? 0);
    if (video.width !== 1080 || video.height !== 1920 || video.r_frame_rate !== "30/1") {
      throw new Error("El corte base debe ser 1080x1920 a 30 fps.");
    }
    if (audio.sample_rate !== "48000") throw new Error("El corte base debe tener audio a 48 kHz.");
    if (duration < 30 || duration > 40.1) throw new Error(`Duración fuera de objetivo: ${duration}s`);
  }
}

console.log(JSON.stringify({ camera: probe(files.camera), baseCut: probe(files.baseCut) }, null, 2));
console.log("INPUT_OK");

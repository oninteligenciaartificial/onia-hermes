// Programmatic render: one template -> N videos.
// Usage: node render.mjs [path-to-spec.json]
// Sanitizes missing assets (brand/product/mara/audio) to null so the pipeline
// renders end-to-end even before Higgsfield shots + voice are dropped in.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "public");
const outDir = path.join(root, "out");

const specPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "src/data/nuvia-isdin-fusion-water-spf50-001.json");

const spec = JSON.parse(readFileSync(specPath, "utf8"));

// Null out any asset that is not present on disk under public/.
const has = (rel) => (rel && existsSync(path.join(publicDir, rel)) ? rel : null);
spec.brand.logo = has(spec.brand.logo);
spec.product.image = has(spec.product.image);
spec.audio.voice = has(spec.audio.voice);
spec.audio.music = has(spec.audio.music);
for (const scene of spec.scenes) scene.image = has(scene.image);

const missing = [
  !spec.brand.logo && "brand.logo",
  !spec.product.image && "product.image",
  !spec.audio.voice && "audio.voice",
  ...spec.scenes.filter((s) => !s.image).map((s) => `scene:${s.id}`),
].filter(Boolean);
if (missing.length) console.log("[render] placeholders for missing assets:", missing.join(", "));

mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${spec.id}.mp4`);

console.log("[render] bundling...");
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });

const composition = await selectComposition({
  serveUrl,
  id: "ProductSell",
  inputProps: { spec },
});

console.log(`[render] rendering ${composition.durationInFrames} frames -> ${outPath}`);
await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: outPath,
  inputProps: { spec },
});

console.log("[render] done:", outPath);

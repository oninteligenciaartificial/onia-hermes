// Optimize Nuvia product cutouts: resize the transparent PNG masters and emit
// modern WebP siblings, then repoint every image reference in nuvia.json to the
// WebP. The PNG masters stay in place (source of truth / reprocessing); the
// static store generator ships WebP via the copy filter in generate.ts.
//
// Usage:
//   node harvester/product/optimize_nuvia_product_media.mjs [--width=900] [--quality=80] [--dry-run]
//
// --dry-run encodes to out/webp-dry/ (gitignored) and only reports sizes; it does
// not write into the asset mirrors and does not touch nuvia.json.

import { readFile, writeFile, mkdir, stat, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const CLIENT_JSON = path.join(ROOT, "data", "clients", "nuvia.json");
const CUTOUT_REL = "assets/product-media-cutout";
const MIRRORS = [
  path.join(ROOT, "data", "clients", "nuvia.assets", "product-media-cutout"),
  path.join(ROOT, "apps", "site", "public", "nuvia", "assets", "product-media-cutout"),
];
const DRY_OUT = path.join(ROOT, "out", "webp-dry");

function parseArgs(argv) {
  const args = { width: 900, quality: 80, dryRun: false };
  for (const arg of argv) {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg.startsWith("--width=")) args.width = Number(arg.slice(8));
    else if (arg.startsWith("--quality=")) args.quality = Number(arg.slice(10));
  }
  if (!Number.isFinite(args.width) || args.width <= 0) throw new Error(`Invalid --width`);
  if (!Number.isFinite(args.quality) || args.quality <= 0 || args.quality > 100) throw new Error(`Invalid --quality`);
  return args;
}

// Collect every string in the JSON that references a cutout PNG, so we repoint
// imagen, detalleImagenes[].src and merchandising images in one pass.
function collectPngRefs(node, acc) {
  if (typeof node === "string") {
    if (node.startsWith(`${CUTOUT_REL}/`) && node.toLowerCase().endsWith(".png")) {
      acc.add(node);
    }
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectPngRefs(item, acc);
    return;
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) collectPngRefs(value, acc);
  }
}

function repointRefs(node, mapping) {
  if (typeof node === "string") return mapping.get(node) ?? node;
  if (Array.isArray(node)) return node.map((item) => repointRefs(item, mapping));
  if (node && typeof node === "object") {
    const next = {};
    for (const [key, value] of Object.entries(node)) next[key] = repointRefs(value, mapping);
    return next;
  }
  return node;
}

async function encodeWebp(srcPng, outWebp, width, quality) {
  await sharp(srcPng)
    .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
    .webp({ quality, alphaQuality: 90, effort: 4, smartSubsample: true })
    .toFile(outWebp);
  return (await stat(outWebp)).size;
}

async function firstExistingMaster(baseName) {
  for (const dir of MIRRORS) {
    const candidate = path.join(dir, baseName);
    try {
      await stat(candidate);
      return candidate;
    } catch {
      /* try next mirror */
    }
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const raw = await readFile(CLIENT_JSON, "utf8");
  const data = JSON.parse(raw);

  const refs = new Set();
  collectPngRefs(data, refs);
  console.log(`Found ${refs.size} distinct cutout PNG references in nuvia.json`);

  if (args.dryRun) {
    await rm(DRY_OUT, { recursive: true, force: true });
    await mkdir(DRY_OUT, { recursive: true });
  }

  const mapping = new Map();
  let srcTotal = 0;
  let outTotal = 0;
  let converted = 0;
  const missing = [];
  const rows = [];
  const t0 = Date.now();

  for (const ref of refs) {
    const baseName = path.basename(ref);
    const master = await firstExistingMaster(baseName);
    if (!master) {
      missing.push(ref);
      continue;
    }

    const srcSize = (await stat(master)).size;
    const webpBase = baseName.replace(/\.png$/i, ".webp");
    const newRef = `${CUTOUT_REL}/${webpBase}`;

    if (args.dryRun) {
      const outSize = await encodeWebp(master, path.join(DRY_OUT, webpBase), args.width, args.quality);
      srcTotal += srcSize;
      outTotal += outSize;
      rows.push({ file: webpBase, srcKB: srcSize / 1024, outKB: outSize / 1024 });
    } else {
      let outSize = 0;
      for (const dir of MIRRORS) {
        try {
          await stat(dir);
        } catch {
          continue; // mirror not present; skip
        }
        outSize = await encodeWebp(master, path.join(dir, webpBase), args.width, args.quality);
      }
      srcTotal += srcSize;
      outTotal += outSize;
      mapping.set(ref, newRef);
    }
    converted += 1;
  }

  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  if (args.dryRun) {
    rows.sort((a, b) => b.outKB - a.outKB);
    console.log(`\n[DRY RUN] width=${args.width} quality=${args.quality}  converted=${converted}  time=${secs}s`);
    console.log(`SRC  total = ${(srcTotal / 1048576).toFixed(1)} MB`);
    console.log(`WEBP total = ${(outTotal / 1048576).toFixed(1)} MB  (${(100 * (1 - outTotal / srcTotal)).toFixed(1)}% smaller)`);
    console.log(`avg webp = ${(outTotal / converted / 1024).toFixed(1)} KB`);
    console.log(`\nTop 8 heaviest webp:`);
    for (const r of rows.slice(0, 8)) {
      console.log(`  ${r.outKB.toFixed(0).padStart(4)} KB  (from ${r.srcKB.toFixed(0)} KB)  ${r.file}`);
    }
    if (missing.length) console.log(`\nMissing masters (${missing.length}): ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " ..." : ""}`);
    console.log(`\nNo repo files or nuvia.json were modified.`);
    return;
  }

  const nextData = repointRefs(data, mapping);
  await writeFile(CLIENT_JSON, JSON.stringify(nextData, null, 2) + "\n", "utf8");

  console.log(`\nwidth=${args.width} quality=${args.quality}  converted=${converted}  time=${secs}s`);
  console.log(`WEBP written to ${MIRRORS.length} mirror(s); PNG masters kept.`);
  console.log(`WEBP total (per mirror) = ${(outTotal / 1048576).toFixed(1)} MB`);
  console.log(`Repointed ${mapping.size} reference(s) in nuvia.json to .webp`);
  if (missing.length) console.log(`Missing masters (${missing.length}) left untouched: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " ..." : ""}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

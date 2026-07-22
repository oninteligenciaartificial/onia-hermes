#!/usr/bin/env node
/**
 * Reels ingest (manual-drop lane).
 *
 * Scans a drop folder for reels the user downloaded by hand, and prepares a
 * manifest the Claude-side vision pass can analyze. For each reel it:
 *   - hashes the local video (evidence integrity),
 *   - extracts N evenly-spaced keyframes + a contact sheet IF ffmpeg is available,
 *   - otherwise registers any frames/screenshots dropped next to the video,
 *   - reads a caption sidecar (<base>.txt or <base>.json).
 *
 * Pure Node stdlib. ffmpeg is optional (see ffmpeg.mjs). Never downloads or
 * scrapes Instagram — you drop the files.
 *
 * Usage:
 *   node harvester/reels/prepare.mjs --lane trend
 *   node harvester/reels/prepare.mjs --lane client --slug nuvia
 *   node harvester/reels/prepare.mjs --in <folder> --frames-dir <dir> --out <manifest.json>
 */
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolveFfmpeg, FFMPEG_INSTALL_HINT } from "./ffmpeg.mjs";

const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v", ".mkv"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function toPublicPath(value) {
  return value.replaceAll("\\", "/");
}

function slugify(value) {
  return (
    String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "reel"
  );
}

function defaultPaths(lane, slug) {
  if (lane === "client") {
    if (!slug) throw new Error("client lane needs --slug <client>");
    const base = `data/clients/${slug}.reels`;
    return {
      inDir: `${base}/inbox`,
      framesDir: `${base}/frames`,
      analysesDir: `${base}/analyses`,
      out: `data/clients/${slug}.reels.manifest.json`,
    };
  }
  const base = "data/references/reels";
  return {
    inDir: `${base}/inbox`,
    framesDir: `${base}/frames`,
    analysesDir: `${base}/analyses`,
    out: `${base}/reels-manifest.json`,
  };
}

async function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

/** Parse "Duration: 00:00:12.34," out of ffmpeg's banner on stderr. */
function probeDurationSec(ffmpeg, videoPath) {
  const res = spawnSync(ffmpeg, ["-i", videoPath], { encoding: "utf8" });
  const text = `${res.stderr || ""}${res.stdout || ""}`;
  const m = text.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

async function extractKeyframes(ffmpeg, videoPath, outDir, count) {
  const duration = probeDurationSec(ffmpeg, videoPath);
  await mkdir(outDir, { recursive: true });
  const frames = [];
  // Evenly spaced samples at the middle of each of `count` segments. If duration
  // is unknown (0), grab a single early frame so at least the hook is captured.
  const n = duration > 0 ? count : 1;
  for (let i = 0; i < n; i += 1) {
    const t = duration > 0 ? ((i + 0.5) * duration) / n : 0.5;
    const name = `frame-${String(i + 1).padStart(2, "0")}.jpg`;
    const outPath = path.join(outDir, name);
    const res = spawnSync(
      ffmpeg,
      ["-y", "-ss", t.toFixed(2), "-i", videoPath, "-frames:v", "1", "-vf", "scale=640:-1", "-q:v", "3", outPath],
      { stdio: "ignore" },
    );
    if (!res.error && res.status === 0) frames.push(outPath);
  }
  return { duration, frames };
}

function buildContactSheet(ffmpeg, framesDir, frameCount, outPath) {
  // Tile the numbered frames into a single grid image (best-effort).
  const cols = Math.min(3, frameCount) || 1;
  const rows = Math.ceil(frameCount / cols) || 1;
  const res = spawnSync(
    ffmpeg,
    [
      "-y",
      "-framerate", "1",
      "-start_number", "1",
      "-i", path.join(framesDir, "frame-%02d.jpg"),
      "-frames:v", "1",
      "-vf", `tile=${cols}x${rows}`,
      outPath,
    ],
    { stdio: "ignore" },
  );
  return !res.error && res.status === 0 ? outPath : "";
}

async function readCaption(baseNoExt) {
  for (const ext of [".json", ".txt"]) {
    const p = `${baseNoExt}${ext}`;
    try {
      const raw = await readFile(p, "utf8");
      if (ext === ".json") {
        const obj = JSON.parse(raw);
        return {
          caption: obj.caption || "",
          url: obj.url || "",
          handle: obj.handle || "",
          rubro: obj.rubro || "",
          capturedAt: obj.capturedAt || "",
        };
      }
      return { caption: raw.trim(), url: "", handle: "", rubro: "", capturedAt: "" };
    } catch {
      // no sidecar of this kind
    }
  }
  return { caption: "", url: "", handle: "", rubro: "", capturedAt: "" };
}

async function listDir(dir) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

export async function prepareReels(options = {}) {
  const lane = options.lane || "trend";
  const slug = options.slug || "";
  const paths = defaultPaths(lane, slug);
  const inDir = options.inDir || paths.inDir;
  const framesDir = options.framesDir || paths.framesDir;
  const analysesDir = options.analysesDir || paths.analysesDir;
  const outPath = options.out || paths.out;
  const frameCount = Number(options.frames || 9);
  const nowIso = options.now || new Date().toISOString();

  const ffmpeg = await resolveFfmpeg();
  const entries = await listDir(inDir);

  const videos = entries.filter(
    (e) => e.isFile() && VIDEO_EXT.has(path.extname(e.name).toLowerCase()),
  );
  const frameOnlyDirs = entries.filter((e) => e.isDirectory());

  const reels = [];
  let withFrames = 0;

  for (const video of videos) {
    const videoPath = path.join(inDir, video.name);
    const baseNoExt = videoPath.slice(0, -path.extname(video.name).length);
    const id = slugify(path.basename(baseNoExt));
    const sidecar = await readCaption(baseNoExt);
    const sha = await sha256File(videoPath);
    const reelFramesDir = path.join(framesDir, id);

    let frames = [];
    let duration = 0;
    let framesSource = "none";
    let contactSheet = "";

    if (ffmpeg) {
      const extracted = await extractKeyframes(ffmpeg, videoPath, reelFramesDir, frameCount);
      frames = extracted.frames;
      duration = extracted.duration;
      if (frames.length) {
        framesSource = "ffmpeg";
        contactSheet = buildContactSheet(
          ffmpeg,
          reelFramesDir,
          frames.length,
          path.join(reelFramesDir, "contact-sheet.jpg"),
        );
      }
    }

    if (!frames.length) {
      // No ffmpeg (or extraction failed): register any manual frames dropped
      // next to the video (same basename + suffix) or inside frames/<id>/.
      const manual = [];
      for (const e of entries) {
        if (e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()) && e.name.startsWith(path.basename(baseNoExt))) {
          manual.push(path.join(inDir, e.name));
        }
      }
      for (const e of await listDir(reelFramesDir)) {
        if (e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())) {
          manual.push(path.join(reelFramesDir, e.name));
        }
      }
      if (manual.length) {
        frames = manual;
        framesSource = "manual";
      }
    }

    if (frames.length) withFrames += 1;

    reels.push({
      id,
      lane,
      clientSlug: lane === "client" ? slug : "",
      rubro: sidecar.rubro,
      source: {
        url: sidecar.url,
        handle: sidecar.handle,
        localVideo: toPublicPath(path.relative(process.cwd(), videoPath)),
        sha256: sha,
        capturedAt: sidecar.capturedAt || nowIso,
        durationSec: duration || undefined,
      },
      caption: sidecar.caption,
      frames: frames.map((f) => toPublicPath(path.relative(process.cwd(), f))),
      framesSource,
      contactSheet: contactSheet ? toPublicPath(path.relative(process.cwd(), contactSheet)) : "",
      status: frames.length ? "ready-to-analyze" : "needs-frames",
      analysisPath: toPublicPath(path.join(analysesDir, `${id}.json`)),
    });
  }

  // Frames-only reels: a subfolder of screenshots (no video), with an optional caption.txt.
  for (const dir of frameOnlyDirs) {
    const dirPath = path.join(inDir, dir.name);
    const id = slugify(dir.name);
    const imgs = (await listDir(dirPath))
      .filter((e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()))
      .map((e) => path.join(dirPath, e.name));
    if (!imgs.length) continue;
    const sidecar = await readCaption(path.join(dirPath, "caption"));
    withFrames += 1;
    reels.push({
      id,
      lane,
      clientSlug: lane === "client" ? slug : "",
      rubro: sidecar.rubro,
      source: {
        url: sidecar.url,
        handle: sidecar.handle,
        localVideo: "",
        sha256: "",
        capturedAt: sidecar.capturedAt || nowIso,
      },
      caption: sidecar.caption,
      frames: imgs.map((f) => toPublicPath(path.relative(process.cwd(), f))),
      framesSource: "manual",
      contactSheet: "",
      status: "ready-to-analyze",
      analysisPath: toPublicPath(path.join(analysesDir, `${id}.json`)),
    });
  }

  const manifest = {
    generatedAt: nowIso,
    lane,
    clientSlug: lane === "client" ? slug : "",
    policy:
      "Manual-drop reels. Trend reels are inspiration only — never reuse their audio, footage, copy, music or logos as client assets. Client reels may reuse the client's OWN footage only after the client confirms rights.",
    ffmpeg: ffmpeg ? { available: true, binary: toPublicPath(ffmpeg) } : { available: false, hint: FFMPEG_INSTALL_HINT },
    inputs: { inDir: toPublicPath(inDir), framesDir: toPublicPath(framesDir), analysesDir: toPublicPath(analysesDir) },
    summary: { reels: reels.length, ready: reels.filter((r) => r.status === "ready-to-analyze").length, needFrames: reels.filter((r) => r.status === "needs-frames").length, withFrames },
    nextStep:
      "Analyze each ready reel with the Claude-side vision pass (harvester/reels/ANALYZE.md): read frames, fill the schema, write <analysisPath>. Then run reels:intelligence.",
    reels,
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await mkdir(analysesDir, { recursive: true });
  await writeFile(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return manifest;
}

async function main() {
  const lane = argValue("--lane", "trend");
  const slug = argValue("--slug", "");
  const manifest = await prepareReels({
    lane,
    slug,
    inDir: argValue("--in", ""),
    framesDir: argValue("--frames-dir", ""),
    out: argValue("--out", ""),
    frames: argValue("--frames", "9"),
    now: hasFlag("--stable-date") ? "1970-01-01T00:00:00.000Z" : undefined,
  });
  const { reels, ready, needFrames, withFrames } = manifest.summary;
  console.log(`reels manifest: ${reels} reel(s) — ${ready} ready, ${needFrames} need frames (${withFrames} with frames).`);
  if (!manifest.ffmpeg.available) {
    console.log("\n[ffmpeg not found]\n" + manifest.ffmpeg.hint);
  }
  if (needFrames) {
    console.log("\nReels needing frames (drop screenshots next to the video or install ffmpeg):");
    for (const r of manifest.reels.filter((x) => x.status === "needs-frames")) console.log(`  - ${r.id}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

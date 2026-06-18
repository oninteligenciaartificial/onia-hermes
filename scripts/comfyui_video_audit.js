#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

function splitIds(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeName(value) {
  return String(value || "")
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error("GET " + url + " failed " + res.status + ": " + text.slice(0, 300));
  return JSON.parse(text);
}

async function download(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Download failed " + res.status + ": " + text.slice(0, 300));
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return buffer.length;
}

function ffprobe(filePath) {
  try {
    const raw = execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration,size",
      "-of", "json",
      filePath
    ], { encoding: "utf8" });
    return JSON.parse(raw).format || {};
  } catch (err) {
    return { error: err.message };
  }
}

function makeContactSheet(filePath, outputPath, frames) {
  const last = Math.max(0, Number(frames || 49) - 1);
  const mid = Math.floor(last / 2);
  const filter = "select='eq(n,0)+eq(n," + mid + ")+eq(n," + last + ")',scale=256:-1,tile=3x1";
  execFileSync("ffmpeg", [
    "-y",
    "-i", filePath,
    "-vf", filter,
    "-frames:v", "1",
    "-update", "1",
    outputPath
  ], { stdio: "ignore" });
}

function historyPrompt(entry) {
  return entry && entry.prompt && entry.prompt[2] ? entry.prompt[2] : {};
}

function promptMeta(prompt) {
  const positive = prompt["267:266"] && prompt["267:266"].inputs ? prompt["267:266"].inputs.value : "";
  const negative = prompt["267:247"] && prompt["267:247"].inputs ? prompt["267:247"].inputs.text : "";
  const image = prompt["269"] && prompt["269"].inputs ? prompt["269"].inputs.image : "";
  const prefix = prompt["75"] && prompt["75"].inputs ? prompt["75"].inputs.filename_prefix : "";
  const frames = prompt["267:225"] && prompt["267:225"].inputs ? prompt["267:225"].inputs.value : null;
  const fps = prompt["267:260"] && prompt["267:260"].inputs ? prompt["267:260"].inputs.value : null;
  const seed1 = prompt["267:216"] && prompt["267:216"].inputs ? prompt["267:216"].inputs.noise_seed : null;
  const seed2 = prompt["267:237"] && prompt["267:237"].inputs ? prompt["267:237"].inputs.noise_seed : null;
  return { positive, negative, image, prefix, frames, fps, seed1, seed2 };
}

function outputVideos(entry) {
  const videos = [];
  const outputs = entry.outputs || {};
  for (const nodeId of Object.keys(outputs)) {
    const node = outputs[nodeId];
    for (const item of node.images || []) {
      if (String(item.filename || "").toLowerCase().endsWith(".mp4")) {
        videos.push(item);
      }
    }
  }
  return videos;
}

async function main() {
  const endpoint = getArg("--endpoint", "http://127.0.0.1:8188").replace(/\/$/, "");
  const outDir = path.resolve(getArg("--out", "hermes-content/references/ai-ecommerce-model/comfyui/audits/latest"));
  const historyLimit = Number(getArg("--history-limit", "3"));
  let promptIds = splitIds(getArg("--prompt-ids", ""));

  fs.mkdirSync(outDir, { recursive: true });

  if (promptIds.length === 0) {
    const history = await fetchJson(endpoint + "/history");
    promptIds = Object.keys(history).slice(-historyLimit);
  }

  const rows = [];
  for (const promptId of promptIds) {
    const history = await fetchJson(endpoint + "/history/" + encodeURIComponent(promptId));
    const entry = history[promptId];
    if (!entry) {
      rows.push({ prompt_id: promptId, status: "missing" });
      continue;
    }

    const meta = promptMeta(historyPrompt(entry));
    const videos = outputVideos(entry);
    for (const video of videos) {
      const params = new URLSearchParams({
        filename: video.filename,
        type: video.type || "output"
      });
      if (video.subfolder) params.set("subfolder", video.subfolder);
      const ext = path.extname(video.filename) || ".mp4";
      const stem = safeName(path.basename(video.filename, ext)).slice(0, 64);
      const localName = safeName(promptId.slice(0, 8) + "__" + stem) + ext;
      const localVideo = path.join(outDir, localName);
      const bytes = await download(endpoint + "/view?" + params.toString(), localVideo);
      const contactSheet = localVideo.replace(/\.mp4$/i, "__frames.jpg");
      makeContactSheet(localVideo, contactSheet, meta.frames);
      rows.push({
        prompt_id: promptId,
        status: "downloaded",
        filename: video.filename,
        subfolder: video.subfolder || "",
        bytes,
        local_video: path.relative(process.cwd(), localVideo),
        contact_sheet: path.relative(process.cwd(), contactSheet),
        media: ffprobe(localVideo),
        ...meta
      });
    }
  }

  const summaryPath = path.join(outDir, "audit-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify({
    ok: true,
    endpoint,
    generated_at: new Date().toISOString(),
    prompt_ids: promptIds,
    rows
  }, null, 2), "utf8");

  const md = [
    "# ComfyUI Video Audit",
    "",
    "- Endpoint: `" + endpoint + "`",
    "- Generated: `" + new Date().toISOString() + "`",
    "",
    "| Prompt ID | Image | Frames | FPS | Video | Contact sheet | Notes |",
    "|---|---|---:|---:|---|---|---|",
    ...rows.map((row) => [
      row.prompt_id,
      row.image || "",
      row.frames || "",
      row.fps || "",
      row.local_video || "",
      row.contact_sheet || "",
      "manual QA pending"
    ].map((cell) => String(cell).replace(/\|/g, "\\|")).join("|")).map((line) => "|" + line + "|"),
    "",
    "## QA rubric",
    "",
    "- identity: does the face remain the same person?",
    "- motion: enough movement to read as video, without drift?",
    "- artifacts: blur, flicker, mouth/teeth warp, hair smear?",
    "- route decision: keep LTX, retry with another prompt, or switch engine?"
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "README.md"), md, "utf8");

  console.log(JSON.stringify({
    ok: true,
    prompt_ids: promptIds,
    out_dir: path.relative(process.cwd(), outDir),
    summary: path.relative(process.cwd(), summaryPath),
    rows: rows.length
  }, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

function requiredArg(name) {
  const value = getArg(name, null);
  if (!value) throw new Error("Missing required argument: " + name);
  return value;
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

async function main() {
  const endpoint = getArg("--endpoint", "http://127.0.0.1:8188").replace(/\/$/, "");
  const filePath = path.resolve(requiredArg("--file"));
  const name = getArg("--name", path.basename(filePath));
  const type = getArg("--type", "input");
  const subfolder = getArg("--subfolder", "");
  const overwrite = getArg("--overwrite", "true");

  if (!fs.existsSync(filePath)) throw new Error("Image not found: " + filePath);

  const bytes = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("image", new Blob([bytes], { type: mimeFor(filePath) }), name);
  form.append("type", type);
  form.append("subfolder", subfolder);
  form.append("overwrite", overwrite);

  const res = await fetch(endpoint + "/upload/image", { method: "POST", body: form });
  const text = await res.text();
  if (!res.ok) throw new Error("Upload failed " + res.status + ": " + text.slice(0, 500));

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (_) {
    parsed = { raw: text };
  }

  console.log(JSON.stringify({
    ok: true,
    endpoint,
    uploaded_as: parsed.name || name,
    type: parsed.type || type,
    subfolder: parsed.subfolder || subfolder,
    response: parsed
  }, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

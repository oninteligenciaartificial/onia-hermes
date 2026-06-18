#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function requiredArg(name) {
  const value = getArg(name, null);
  if (!value) {
    throw new Error("Missing required argument: " + name);
  }
  return value;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function applyPatch(workflow, patch, row, defaults) {
  if (!patch || !patch.node || !patch.input) return;
  const node = workflow[String(patch.node)];
  if (!node) {
    throw new Error("Workflow node not found: " + patch.node);
  }
  if (!node.inputs) node.inputs = {};

  let value = row[patch.source];
  if (value == null || value === "") value = patch.default;
  if (value == null || value === "") value = defaults[patch.source];
  if (value == null || value === "") {
    throw new Error("No value for patch source " + patch.source + " at node " + patch.node);
  }

  node.inputs[patch.input] = value;
}

function buildPromptPayload(workflowTemplate, mapping, row) {
  const workflow = clone(workflowTemplate);
  const patches = mapping.patches || {};
  const defaults = mapping.defaults || {};
  for (const key of Object.keys(patches)) {
    applyPatch(workflow, patches[key], row, defaults);
  }
  return {
    prompt: workflow,
    client_id: defaults.client_id || "onia-mara-pond-video-lab",
    extra_data: {
      onia_prompt_id: row.id,
      route_id: row.route_id,
      seed: row.seed,
      approval_state: row.approval_state || "internal_prompt_only"
    }
  };
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) {
    const hint = res.status === 404 && /proxy\.runpod\.net/i.test(url)
      ? " RunPod's browser proxy may load the UI but reject API calls from PowerShell. Use an SSH tunnel and pass --endpoint http://127.0.0.1:8188."
      : "";
    throw new Error("POST " + url + " failed " + res.status + ": " + text.slice(0, 500) + hint);
  }
  try {
    return JSON.parse(text);
  } catch (_) {
    return { raw: text };
  }
}

async function main() {
  const workflowPath = path.resolve(requiredArg("--workflow"));
  const mappingPath = path.resolve(requiredArg("--mapping"));
  const matrixPath = path.resolve(requiredArg("--matrix"));
  const limit = Number(getArg("--limit", "12"));
  const submit = hasFlag("--submit");
  const dryRun = !submit;

  const workflowTemplate = readJson(workflowPath);
  const mapping = readJson(mappingPath);
  const endpoint = getArg("--endpoint", mapping.defaults && mapping.defaults.endpoint ? mapping.defaults.endpoint : "http://127.0.0.1:8188");
  const rows = readJsonl(matrixPath).slice(0, limit);
  const outputDir = path.dirname(matrixPath);
  const previewPath = path.join(outputDir, "comfyui-request-preview.jsonl");
  const resultPath = path.join(outputDir, submit ? "comfyui-submit-results.json" : "comfyui-dry-run-results.json");

  const preview = fs.createWriteStream(previewPath, "utf8");
  const results = [];

  for (const row of rows) {
    const payload = buildPromptPayload(workflowTemplate, mapping, row);
    preview.write(JSON.stringify({ id: row.id, payload }) + "\n");
    if (dryRun) {
      results.push({ id: row.id, status: "dry_run", seed: row.seed });
      continue;
    }
    const response = await postJson(endpoint.replace(/\/$/, "") + "/prompt", payload);
    results.push({ id: row.id, status: "submitted", response });
  }

  preview.end();
  const summary = {
    ok: true,
    mode: dryRun ? "dry_run" : "submit",
    endpoint,
    workflow: path.relative(process.cwd(), workflowPath),
    mapping: path.relative(process.cwd(), mappingPath),
    matrix: path.relative(process.cwd(), matrixPath),
    preview: path.relative(process.cwd(), previewPath),
    result_count: results.length,
    results
  };
  fs.writeFileSync(resultPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

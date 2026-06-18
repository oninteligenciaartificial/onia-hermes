#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG = "hermes-content/references/ai-ecommerce-model/mara-pond-video-lab-config-20260616.json";
const DEFAULT_OUTPUT_ROOT = "hermes-content/references/ai-ecommerce-model/prompt-matrix-runs";

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeName(value) {
  return String(value || "")
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate())
  ].join("") + "-" + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join("");
}

function fillTemplate(template, values) {
  return String(template).replace(/\{([A-Za-z0-9_]+)\}/g, (_, key) => {
    return values[key] == null ? "" : String(values[key]);
  });
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return "\"" + text.replace(/"/g, "\"\"").replace(/\r?\n/g, " ") + "\"";
}

function parseList(value) {
  if (!value || value === "all") return null;
  return new Set(String(value).split(",").map((x) => x.trim()).filter(Boolean));
}

function includeItem(filter, item) {
  return !filter || filter.has(item.id);
}

function* matrix(config, filters, seedStart) {
  const options = config.options;
  let index = 0;
  for (const route of config.routes.filter((item) => includeItem(filters.routes, item))) {
    for (const outfit of options.outfits.filter((item) => includeItem(filters.outfits, item))) {
      for (const tone of options.tones.filter((item) => includeItem(filters.tones, item))) {
        for (const visualStyle of options.visual_styles.filter((item) => includeItem(filters.visual_styles, item))) {
          for (const setting of options.settings.filter((item) => includeItem(filters.settings, item))) {
            for (const motion of options.motions.filter((item) => includeItem(filters.motions, item))) {
              for (const hook of options.hooks.filter((item) => includeItem(filters.hooks, item))) {
                for (const spoken of options.spoken_texts.filter((item) => includeItem(filters.spoken_texts, item))) {
                  const duration = route.default_duration_seconds || 6;
                  const inputImage = route.input_image || config.identity_lock.primary_face_reference;
                  const comfyuiImage = route.comfyui_image || config.identity_lock.primary_comfyui_filename || config.identity_lock.comfyui_image || "";
                  const promptTemplateId = route.prompt_template || "positive";
                  const promptTemplate = config.prompt_templates[promptTemplateId] || config.prompt_templates.positive;
                  const values = {
                    identity_lock: config.identity_lock.fixed_prompt,
                    negative_prompt: config.identity_lock.negative_prompt,
                    product_name: config.product?.name || "",
                    product_prompt: config.product?.prompt || "",
                    product_claim_safety: config.product?.claim_safety || "",
                    outfit: outfit.prompt,
                    tone: tone.prompt,
                    visual_style: visualStyle.prompt,
                    setting: setting.prompt,
                    motion: motion.prompt,
                    hook: hook.text,
                    spoken_text: spoken.text,
                    duration_seconds: duration
                  };
                  index += 1;
                  yield {
                    id: [
                      route.prompt_id_prefix || config.identity_lock.prompt_id_prefix || config.identity_lock.id || "mara",
                      String(index).padStart(5, "0"),
                      route.id,
                      outfit.id,
                      tone.id,
                      visualStyle.id,
                      setting.id,
                      motion.id,
                      hook.id,
                      spoken.id
                    ].map(safeName).join("__"),
                    index,
                    seed: seedStart + index - 1,
                    route_id: route.id,
                    route_label: route.label,
                    route_stage: route.stage,
                    route_tool: route.tool,
                    model: route.model,
                    outfit_id: outfit.id,
                    outfit_label: outfit.label,
                    tone_id: tone.id,
                    tone_label: tone.label,
                    visual_style_id: visualStyle.id,
                    visual_style_label: visualStyle.label,
                    setting_id: setting.id,
                    setting_label: setting.label,
                    motion_id: motion.id,
                    motion_label: motion.label,
                    hook_id: hook.id,
                    hook: hook.text,
                    spoken_text_id: spoken.id,
                    spoken_text: spoken.text,
                    product_name: config.product?.name || "",
                    product_reference: config.product?.reference_image || "",
                    duration_seconds: duration,
                    input_image: inputImage,
                    comfyui_image: comfyuiImage,
                    identity_master: config.identity_lock.master_sheet,
                    prompt_template_id: promptTemplateId,
                    prompt: fillTemplate(promptTemplate, values),
                    negative_prompt: fillTemplate(config.prompt_templates.negative, values),
                    elevenlabs_direction: fillTemplate(config.prompt_templates.elevenlabs_direction, values),
                    qa_minimum_to_scale: config.qa.minimum_to_scale,
                    approval_state: "internal_prompt_only"
                  };
                }
              }
            }
          }
        }
      }
    }
  }
}

function main() {
  const configPath = path.resolve(getArg("--config", DEFAULT_CONFIG));
  const config = readJson(configPath);
  const limit = Number(getArg("--limit", config.batch_rules.default_limit || 12));
  const seedStart = Number(getArg("--seed", "1000"));
  const runName = safeName(getArg("--run-name", timestamp() + "-mara-pond"));
  const outputRoot = path.resolve(getArg("--out-root", DEFAULT_OUTPUT_ROOT));
  const outputDir = path.join(outputRoot, runName);
  const csvEnabled = !hasFlag("--jsonl-only");
  const jsonlEnabled = !hasFlag("--csv-only");
  const filters = {
    routes: parseList(getArg("--routes", "all")),
    outfits: parseList(getArg("--outfits", "all")),
    tones: parseList(getArg("--tones", "all")),
    visual_styles: parseList(getArg("--visual-styles", "all")),
    settings: parseList(getArg("--settings", "all")),
    motions: parseList(getArg("--motions", "all")),
    hooks: parseList(getArg("--hooks", "all")),
    spoken_texts: parseList(getArg("--spoken-texts", "all"))
  };

  fs.mkdirSync(outputDir, { recursive: true });

  const jsonlPath = path.join(outputDir, "prompt-matrix.jsonl");
  const csvPath = path.join(outputDir, "prompt-matrix.csv");
  const summaryPath = path.join(outputDir, "summary.json");

  const jsonl = jsonlEnabled ? fs.createWriteStream(jsonlPath, "utf8") : null;
  const csv = csvEnabled ? fs.createWriteStream(csvPath, "utf8") : null;
  const csvHeaders = [
    "id", "index", "seed", "route_id", "route_stage", "model",
    "outfit_id", "tone_id", "visual_style_id", "setting_id", "motion_id",
    "hook_id", "spoken_text_id", "duration_seconds", "hook",
    "spoken_text", "product_name", "product_reference", "prompt", "negative_prompt", "elevenlabs_direction",
    "input_image", "comfyui_image", "prompt_template_id"
  ];

  if (csv) csv.write(csvHeaders.join(",") + "\n");

  let written = 0;
  let totalSeen = 0;
  for (const row of matrix(config, filters, seedStart)) {
    totalSeen += 1;
    if (written >= limit) continue;
    written += 1;
    if (jsonl) jsonl.write(JSON.stringify(row) + "\n");
    if (csv) {
      csv.write(csvHeaders.map((key) => csvCell(row[key])).join(",") + "\n");
    }
  }

  if (jsonl) jsonl.end();
  if (csv) csv.end();

  const summary = {
    ok: true,
    generated_at: new Date().toISOString(),
    config: path.relative(process.cwd(), configPath),
    output_dir: path.relative(process.cwd(), outputDir),
    prompt_matrix_jsonl: jsonlEnabled ? path.relative(process.cwd(), jsonlPath) : null,
    prompt_matrix_csv: csvEnabled ? path.relative(process.cwd(), csvPath) : null,
    requested_limit: limit,
    written,
    total_matching_matrix: totalSeen,
    seed_start: seedStart,
    filters: Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value ? Array.from(value) : "all"])
    ),
    next_step: "Review prompt-matrix.csv/jsonl, run ComfyUI dry-run with scripts/mara_comfyui_queue.js, then generate only a 12-video smoke batch."
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main();

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

function comboOptions(value) {
  if (!Array.isArray(value)) return [];
  const first = value[0];
  if (Array.isArray(first)) return first;
  if (first && typeof first === "object" && Array.isArray(first.value)) return first.value;
  if (typeof first === "string" && value[1] && Array.isArray(value[1].options)) return value[1].options;
  return [];
}

async function getJson(endpoint, route) {
  const res = await fetch(endpoint.replace(/\/$/, "") + route);
  const text = await res.text();
  if (!res.ok) throw new Error("GET " + route + " failed " + res.status + ": " + text.slice(0, 500));
  return JSON.parse(text);
}

function requiredNodeOptions(objectInfo, nodeName, field) {
  const node = objectInfo[nodeName];
  if (!node || !node.input || !node.input.required || !node.input.required[field]) return [];
  return comboOptions(node.input.required[field]);
}

function includesAll(options, required) {
  const set = new Set(options);
  return required.map((name) => ({ name, ok: set.has(name) }));
}

async function main() {
  const endpoint = getArg("--endpoint", process.env.COMFYUI_ENDPOINT || "http://127.0.0.1:8188");
  const outPath = getArg("--out", "");

  const [stats, queue, objectInfo] = await Promise.all([
    getJson(endpoint, "/system_stats"),
    getJson(endpoint, "/queue"),
    getJson(endpoint, "/object_info")
  ]);

  const required = {
    nodes: [
      "UNETLoader",
      "CLIPLoader",
      "VAELoader",
      "LoadImage",
      "Wan22ImageToVideoLatent",
      "CLIPTextEncode",
      "ModelSamplingSD3",
      "KSampler",
      "VAEDecode",
      "CreateVideo",
      "SaveVideo"
    ],
    diffusion_models: [
      "wan2.2_ti2v_5B_fp16.safetensors",
      "wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors",
      "wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors"
    ],
    text_encoders: [
      "umt5_xxl_fp8_e4m3fn_scaled.safetensors"
    ],
    vae: [
      "wan2.2_vae.safetensors",
      "wan_2.1_vae.safetensors"
    ],
    audio_encoders: [
      "wav2vec2_large_english_fp16.safetensors"
    ],
    model_patches: [
      "Wan2_1-InfiniteTalk-Single_fp8_e4m3fn_scaled_KJ.safetensors"
    ],
    input_images: [
      "mara_20260616_primary_i2v_front_smile.png"
    ]
  };

  const nodeNames = Object.keys(objectInfo).sort();
  const available = {
    node_count: nodeNames.length,
    nodes: required.nodes.filter((name) => nodeNames.includes(name)),
    wan_nodes: nodeNames.filter((name) => /^Wan|Wan/.test(name)).sort(),
    diffusion_models: requiredNodeOptions(objectInfo, "UNETLoader", "unet_name"),
    text_encoders: requiredNodeOptions(objectInfo, "CLIPLoader", "clip_name"),
    vae: requiredNodeOptions(objectInfo, "VAELoader", "vae_name"),
    audio_encoders: requiredNodeOptions(objectInfo, "AudioEncoderLoader", "audio_encoder_name"),
    model_patches: requiredNodeOptions(objectInfo, "ModelPatchLoader", "name"),
    input_images: requiredNodeOptions(objectInfo, "LoadImage", "image")
  };

  const checks = {
    nodes: required.nodes.map((name) => ({ name, ok: nodeNames.includes(name) })),
    diffusion_models: includesAll(available.diffusion_models, required.diffusion_models),
    text_encoders: includesAll(available.text_encoders, required.text_encoders),
    vae: includesAll(available.vae, required.vae),
    audio_encoders: includesAll(available.audio_encoders, required.audio_encoders),
    model_patches: includesAll(available.model_patches, required.model_patches),
    input_images: includesAll(available.input_images, required.input_images)
  };

  const missing = Object.fromEntries(
    Object.entries(checks).map(([key, values]) => [key, values.filter((item) => !item.ok).map((item) => item.name)])
  );
  const readyForSilentTi2v = [
    ...checks.nodes,
    ...checks.diffusion_models.filter((item) => item.name === "wan2.2_ti2v_5B_fp16.safetensors"),
    ...checks.text_encoders,
    ...checks.vae.filter((item) => item.name === "wan2.2_vae.safetensors"),
    ...checks.input_images
  ].every((item) => item.ok);

  const summary = {
    ok: readyForSilentTi2v,
    generated_at: new Date().toISOString(),
    endpoint,
    comfyui_version: stats.system && stats.system.comfyui_version,
    gpu_devices: stats.devices || [],
    queue_running: Array.isArray(queue.queue_running) ? queue.queue_running.length : 0,
    queue_pending: Array.isArray(queue.queue_pending) ? queue.queue_pending.length : 0,
    ready_for_silent_ti2v: readyForSilentTi2v,
    available,
    checks,
    missing,
    next_step: readyForSilentTi2v
      ? "Generate one Wan2.2 TI2V 5B smoke clip and audit identity before scaling."
      : "Install missing Wan model files or upload the Mara input image before submitting jobs."
  };

  if (outPath) {
    const absolute = path.resolve(outPath);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, JSON.stringify(summary, null, 2), "utf8");
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

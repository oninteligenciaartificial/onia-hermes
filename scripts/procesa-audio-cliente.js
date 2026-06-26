#!/usr/bin/env node
/*
Procesa audios comerciales ONIA.

Uso:
  node scripts/procesa-audio-cliente.js --audio "/ruta/audio.ogg"
  node scripts/procesa-audio-cliente.js --audio "/ruta/reunion.m4a" --no-propuesta

Env STT:
  STT_BASE_URL=http://127.0.0.1:3108/v1   OpenAI-compatible local endpoint
  STT_MODEL=Systran/faster-distil-whisper-large-v3
  STT_API_KEY=local                        optional
  GROQ_API_KEY=...                         fallback
  OPENAI_API_KEY=...                       fallback + proposal analysis
*/

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");

function argValue(name) {
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = args.indexOf(name);
  if (index !== -1) return args[index + 1];
  return null;
}

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

function slugify(value) {
  return String(value || "cliente")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "cliente";
}

function contentTypeFor(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".wav") return "audio/wav";
  if (ext === ".m4a" || ext === ".mp4") return "audio/mp4";
  if (ext === ".webm") return "audio/webm";
  return "audio/ogg";
}

function buildMultipart(fields, fileName, fileBuffer) {
  const boundary = `----OniaAudioBoundary${Date.now()}`;
  const chunks = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;
    chunks.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
      `${value}\r\n`,
    ));
  }

  chunks.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${path.basename(fileName)}"\r\n` +
    `Content-Type: ${contentTypeFor(fileName)}\r\n\r\n`,
  ));
  chunks.push(fileBuffer);
  chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  return { body: Buffer.concat(chunks), boundary };
}

function postJsonByUrl(urlString, headers, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const transport = url.protocol === "http:" ? http : https;
    const req = transport.request({
      method: "POST",
      hostname: url.hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      headers,
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        let data;
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          reject(new Error(`Respuesta no JSON de ${url.hostname}: ${raw.slice(0, 240)}`));
          return;
        }
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(data).slice(0, 240)}`));
          return;
        }
        resolve(data);
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function joinEndpoint(baseUrl, endpoint) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(endpoint, base).toString();
}

function transcriptFromResponse(data) {
  if (typeof data.text === "string" && data.text.trim()) return data.text.trim();
  if (typeof data.transcript === "string" && data.transcript.trim()) return data.transcript.trim();
  if (Array.isArray(data.segments)) {
    const text = data.segments.map((segment) => {
      const speaker = segment.speaker || segment.speaker_label || segment.label;
      const content = segment.text || segment.transcript || "";
      return speaker ? `[${speaker}] ${content}` : content;
    }).join("\n").trim();
    if (text) return text;
  }
  throw new Error(`Respuesta STT sin texto util: ${JSON.stringify(data).slice(0, 300)}`);
}

async function transcribeOpenAiCompatible(audioBuffer, fileName) {
  const baseUrl = process.env.STT_BASE_URL;
  if (!baseUrl) return null;

  const model = process.env.STT_MODEL || "Systran/faster-distil-whisper-large-v3";
  const { body, boundary } = buildMultipart({
    model,
    language: process.env.STT_LANGUAGE || "es",
    response_format: "json",
  }, fileName, audioBuffer);

  const headers = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": body.length,
  };
  if (process.env.STT_API_KEY) headers.Authorization = `Bearer ${process.env.STT_API_KEY}`;

  const data = await postJsonByUrl(joinEndpoint(baseUrl, "audio/transcriptions"), headers, body);
  return { provider: "stt_base_url", model, text: transcriptFromResponse(data) };
}

async function transcribeGroq(audioBuffer, fileName) {
  if (!process.env.GROQ_API_KEY) return null;

  const model = process.env.GROQ_STT_MODEL || "whisper-large-v3-turbo";
  const { body, boundary } = buildMultipart({
    model,
    language: process.env.STT_LANGUAGE || "es",
    response_format: "json",
  }, fileName, audioBuffer);

  const data = await postJsonByUrl("https://api.groq.com/openai/v1/audio/transcriptions", {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": body.length,
  }, body);

  return { provider: "groq", model, text: transcriptFromResponse(data) };
}

async function transcribeOpenAi(audioBuffer, fileName) {
  if (!process.env.OPENAI_API_KEY) return null;

  const model = process.env.OPENAI_STT_MODEL || "whisper-1";
  const { body, boundary } = buildMultipart({
    model,
    language: process.env.STT_LANGUAGE || "es",
    response_format: "json",
  }, fileName, audioBuffer);

  const data = await postJsonByUrl("https://api.openai.com/v1/audio/transcriptions", {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": body.length,
  }, body);

  return { provider: "openai", model, text: transcriptFromResponse(data) };
}

async function transcribe(audioBuffer, fileName) {
  const providers = [transcribeOpenAiCompatible, transcribeGroq, transcribeOpenAi];
  const errors = [];

  for (const provider of providers) {
    try {
      const result = await provider(audioBuffer, fileName);
      if (result) return result;
    } catch (error) {
      errors.push(error.message);
    }
  }

  const detail = errors.length ? ` Intentos fallidos: ${errors.join(" | ")}` : "";
  throw new Error(`No hay STT disponible. Configura STT_BASE_URL, GROQ_API_KEY u OPENAI_API_KEY.${detail}`);
}

function writeTranscript(text, sourcePath, clientName) {
  const outDir = path.join(repoRoot, "hermes-content", "audio-intelligence", "transcripts");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = slugify(clientName || path.basename(sourcePath, path.extname(sourcePath)));
  const outPath = path.join(outDir, `${stamp}-${slug}.txt`);
  fs.writeFileSync(outPath, `${text.trim()}\n`, "utf8");
  return outPath;
}

function runProposalAnalysis(transcriptPath) {
  if (!process.env.OPENAI_API_KEY) {
    process.stderr.write("Aviso: OPENAI_API_KEY no configurada; se genero transcript pero no propuesta.\n");
    return false;
  }
  const script = path.join(repoRoot, "scripts", "analiza-transcripcion.js");
  execFileSync(process.execPath, [script, transcriptPath], {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  });
  return true;
}

async function main() {
  const audioPath = argValue("--audio") || process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  if (!audioPath) {
    process.stderr.write("Uso: node scripts/procesa-audio-cliente.js --audio \"/ruta/audio.ogg\" [--no-propuesta]\n");
    process.exit(2);
  }

  const resolvedAudioPath = path.resolve(audioPath);
  if (!fs.existsSync(resolvedAudioPath)) {
    throw new Error(`Audio no existe: ${resolvedAudioPath}`);
  }

  const audioBuffer = fs.readFileSync(resolvedAudioPath);
  const clientName = argValue("--cliente") || null;
  const result = await transcribe(audioBuffer, resolvedAudioPath);
  const transcriptPath = writeTranscript(result.text, resolvedAudioPath, clientName);

  const proposalGenerated = hasFlag("--no-propuesta") ? false : runProposalAnalysis(transcriptPath);

  process.stdout.write(`${JSON.stringify({
    ok: true,
    provider: result.provider,
    model: result.model,
    transcript_path: transcriptPath,
    transcript_chars: result.text.length,
    proposal_generated: proposalGenerated,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Hermes — Webhook de propuestas automáticas
 *
 * POST /pipeline  { file_id, chat_id }
 *   → descarga audio de Telegram
 *   → transcribe con Whisper
 *   → extrae datos del cliente con GPT-4o-mini
 *   → genera propuesta HTML
 *   → devuelve { ok, resumen, html_path, datos }
 *
 * POST /analizar  { transcript }
 *   → extrae datos con GPT-4o-mini
 *   → genera propuesta HTML
 *   → devuelve { ok, resumen, html_path, datos }
 *
 * GET /health  → { ok: true }
 *
 * Variables de entorno:
 *   OPENAI_API_KEY        — GPT-4o-mini extracción + Whisper fallback
 *   GROQ_API_KEY          — Whisper primario (gratis, 480 min/día)
 *   TELEGRAM_BOT_TOKEN
 *   PORT (default: 3031)
 *   HERMES_DIR (default: directorio del script / ..)
 */

'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = parseInt(process.env.PORT || '3031', 10);
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const HERMES_DIR = process.env.HERMES_DIR || path.join(__dirname, '..');
// En VPS el asset server sirve /var/www/html/hermes-assets/ en http://187.77.16.63:8099/
const ASSET_DIR = process.env.ASSET_DIR || '/var/www/html/hermes-assets/propuestas';
const ASSET_URL_BASE = process.env.ASSET_URL_BASE || 'http://187.77.16.63:8099/propuestas';
const PROPUESTAS_DIR = path.join(HERMES_DIR, 'propuestas');

// ─── Helpers HTTP ─────────────────────────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, res => {
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function httpsPost(hostname, path_, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path: path_, method: 'POST', headers }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(new Error('JSON parse error: ' + Buffer.concat(chunks).toString().slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Telegram helpers ─────────────────────────────────────────────────────────

async function telegramGetFilePath(fileId) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;
  const buf = await httpsGet(url);
  const data = JSON.parse(buf.toString());
  if (!data.ok) throw new Error('Telegram getFile error: ' + JSON.stringify(data));
  return data.result.file_path;
}

async function telegramDownloadAudio(filePath) {
  const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  return httpsGet(url);
}

// ─── Whisper transcription ────────────────────────────────────────────────────

function buildWhisperBody(audioBuffer, ext, model) {
  const boundary = '----HermesBoundary' + Date.now();
  const part1 = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${model}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\nes\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio${ext}"\r\n` +
    `Content-Type: audio/ogg\r\n\r\n`
  );
  const part2 = Buffer.from(`\r\n--${boundary}--\r\n`);
  return { body: Buffer.concat([part1, audioBuffer, part2]), boundary };
}

async function transcribirAudio(audioBuffer, filename) {
  const ext = path.extname(filename) || '.oga';

  // Groq primary (free 480 min/day, 216x real-time)
  if (GROQ_KEY) {
    try {
      log('Transcribiendo con Groq whisper-large-v3-turbo...');
      const { body, boundary } = buildWhisperBody(audioBuffer, ext, 'whisper-large-v3-turbo');
      const result = await httpsPost(
        'api.groq.com',
        '/openai/v1/audio/transcriptions',
        {
          'Authorization': `Bearer ${GROQ_KEY}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
        body
      );
      if (result.text) return result.text;
      log('Groq falló: ' + JSON.stringify(result).slice(0, 200) + ' — cayendo a OpenAI');
    } catch (e) {
      log('Groq error: ' + e.message + ' — cayendo a OpenAI');
    }
  }

  // OpenAI fallback
  if (!OPENAI_KEY) throw new Error('Ni GROQ_API_KEY ni OPENAI_API_KEY configuradas');
  log('Transcribiendo con OpenAI whisper-1...');
  const { body, boundary } = buildWhisperBody(audioBuffer, ext, 'whisper-1');
  const result = await httpsPost(
    'api.openai.com',
    '/v1/audio/transcriptions',
    {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length,
    },
    body
  );
  if (!result.text) throw new Error('Whisper sin texto: ' + JSON.stringify(result));
  return result.text;
}

// ─── GPT-4o-mini extracción ───────────────────────────────────────────────────

const EXTRACCION_SYSTEM = `Sos asistente de ventas de ONIA, agencia de diseño web e IA en Santa Cruz, Bolivia.

Analizá transcripciones de llamadas de venta y extraé datos en JSON.
Si un dato no está en la llamada usá null. No inventes datos.

Respondé SOLO con JSON válido, sin markdown, sin texto extra.`;

const EXTRACCION_USER = (transcript) => `Extraé estos campos del siguiente transcript de llamada:

{
  "empresa": "nombre de la empresa cliente",
  "contacto": "nombre del responsable con quien se habló",
  "industria": "rubro: dental | clinica | audiovisual | productora | arquitecto | constructora | retail | comercio | restaurant | pyme | servicio",
  "ciudad": "ciudad del cliente",
  "necesidad_principal": "problema o necesidad principal en 1-2 oraciones",
  "necesidades_secundarias": ["otras necesidades mencionadas"],
  "presupuesto_mencionado": "monto o rango si lo mencionaron o null",
  "objeciones": ["objeciones o preocupaciones expresadas"],
  "nivel_interes": "alto | medio | bajo | no_definido",
  "proximo_paso_acordado": "qué quedó acordado",
  "fecha_proximo_paso": "fecha mencionada o null",
  "productos_relevantes": ["IDs de productos ONIA: dentalgest | gestios | web_landing | web_negocio | web_pro_ia | videos_ia | consultoria"],
  "notas_internas": "observaciones sobre tono, urgencia, contexto de venta",
  "resumen_ejecutivo": "2-3 oraciones resumiendo la oportunidad"
}

TRANSCRIPT:
---
${transcript}
---`;

async function extraerDatos(transcript) {
  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    temperature: 0.1,
    messages: [
      { role: 'system', content: EXTRACCION_SYSTEM },
      { role: 'user', content: EXTRACCION_USER(transcript) },
    ],
  });

  const result = await httpsPost(
    'api.openai.com',
    '/v1/chat/completions',
    {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    body
  );

  if (result.error) throw new Error('OpenAI error: ' + result.error.message);
  const text = result.choices[0].message.content.trim();

  // Limpiar markdown si viene con ```json
  const clean = text.replace(/^```json?\n?/i, '').replace(/```$/m, '').trim();
  return JSON.parse(clean);
}

// ─── Generar propuesta HTML ───────────────────────────────────────────────────

function generarPropuesta(datos) {
  fs.mkdirSync(PROPUESTAS_DIR, { recursive: true });

  const args = [
    datos.empresa ? `--empresa=${datos.empresa}` : null,
    datos.industria ? `--industria=${datos.industria}` : null,
    datos.necesidad_principal ? `--necesidad=${datos.necesidad_principal.slice(0, 120)}` : null,
    datos.contacto ? `--contacto=${datos.contacto}` : null,
    datos.ciudad ? `--ciudad=${datos.ciudad}` : null,
    datos.productos_relevantes?.length ? `--productos=${datos.productos_relevantes.join(',')}` : null,
    datos.objeciones?.length ? `--notas=Objeciones: ${datos.objeciones.slice(0, 2).join('. ')}` : null,
  ].filter(Boolean).map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ');

  const scriptPath = path.join(HERMES_DIR, 'scripts', 'genera-propuesta.js');
  const output = execSync(`node "${scriptPath}" ${args}`, {
    cwd: HERMES_DIR, encoding: 'utf8',
  });

  // Extraer ruta del output "✓ Propuesta generada: /ruta/archivo.html"
  const match = output.match(/Propuesta generada:\s+(.+\.html)/);
  if (!match) throw new Error('No se encontró ruta HTML en: ' + output);
  return match[1].trim();
}

// ─── Construir resumen texto para Telegram ───────────────────────────────────

function construirResumen(datos) {
  const interes = { alto: '🔥 ALTO', medio: '⚡ MEDIO', bajo: '❄️ BAJO', no_definido: '❓ Sin definir' };
  const lines = [
    `📋 *ANÁLISIS DE LLAMADA*`,
    ``,
    `🏢 *${datos.empresa || 'Empresa no detectada'}*`,
    datos.contacto ? `👤 ${datos.contacto}` : null,
    datos.industria ? `🏭 ${datos.industria}` : null,
    datos.ciudad ? `📍 ${datos.ciudad}` : null,
    ``,
    `${interes[datos.nivel_interes] || '❓'} Nivel de interés`,
    datos.presupuesto_mencionado ? `💰 Presupuesto: ${datos.presupuesto_mencionado}` : null,
    ``,
    datos.necesidad_principal ? `🎯 *Necesidad:*\n${datos.necesidad_principal}` : null,
    datos.necesidades_secundarias?.length
      ? `\n➕ *Secundarias:*\n${datos.necesidades_secundarias.slice(0, 3).map(n => `• ${n}`).join('\n')}`
      : null,
    datos.objeciones?.length
      ? `\n⚠️ *Objeciones:*\n${datos.objeciones.slice(0, 3).map(o => `• ${o}`).join('\n')}`
      : null,
    datos.proximo_paso_acordado
      ? `\n✅ *Próximo paso:* ${datos.proximo_paso_acordado}`
      : null,
    datos.fecha_proximo_paso ? `📅 Fecha: ${datos.fecha_proximo_paso}` : null,
    ``,
    datos.resumen_ejecutivo ? `📊 ${datos.resumen_ejecutivo}` : null,
    ``,
    `📑 *Propuesta lista — enviando archivo...*`,
  ];
  return lines.filter(l => l !== null).join('\n');
}

// ─── Request router ───────────────────────────────────────────────────────────

async function handlePipeline(body) {
  const { file_id, caption } = body;
  if (!file_id) throw new Error('file_id requerido');
  if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN no configurada');

  log('Descargando audio file_id=' + file_id);
  const filePath = await telegramGetFilePath(file_id);
  const audioBuffer = await telegramDownloadAudio(filePath);
  const filename = path.basename(filePath);

  log('Transcribiendo con Whisper (' + audioBuffer.length + ' bytes)...');
  const transcript = await transcribirAudio(audioBuffer, filename);
  log('Transcript: ' + transcript.slice(0, 100) + '...');

  log('Extrayendo datos con GPT-4o-mini...');
  const datos = await extraerDatos(transcript);
  log('Empresa detectada: ' + datos.empresa);

  log('Generando propuesta HTML...');
  const htmlPath = generarPropuesta(datos);
  log('HTML: ' + htmlPath);

  // Copiar al asset server para que n8n pueda descargarlo por HTTP
  let htmlUrl = null;
  try {
    fs.mkdirSync(ASSET_DIR, { recursive: true });
    const filename = path.basename(htmlPath);
    fs.copyFileSync(htmlPath, path.join(ASSET_DIR, filename));
    htmlUrl = `${ASSET_URL_BASE}/${filename}`;
    log('Asset URL: ' + htmlUrl);
  } catch (e) {
    log('Aviso: no se pudo copiar al asset server: ' + e.message);
  }

  return {
    ok: true,
    transcript: transcript.slice(0, 500),
    datos,
    resumen: construirResumen(datos),
    html_path: htmlPath,
    html_filename: path.basename(htmlPath),
    html_url: htmlUrl,
  };
}

async function handleAnalizar(body) {
  const { transcript } = body;
  if (!transcript) throw new Error('transcript requerido');

  log('Extrayendo datos con GPT-4o-mini...');
  const datos = await extraerDatos(transcript);

  log('Generando propuesta HTML...');
  const htmlPath = generarPropuesta(datos);

  let htmlUrl = null;
  try {
    fs.mkdirSync(ASSET_DIR, { recursive: true });
    const filename = path.basename(htmlPath);
    fs.copyFileSync(htmlPath, path.join(ASSET_DIR, filename));
    htmlUrl = `${ASSET_URL_BASE}/${filename}`;
  } catch (e) {
    log('Aviso asset server: ' + e.message);
  }

  return {
    ok: true,
    datos,
    resumen: construirResumen(datos),
    html_path: htmlPath,
    html_filename: path.basename(htmlPath),
    html_url: htmlUrl,
  };
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch (e) { reject(new Error('Body JSON inválido')); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  log(`${req.method} ${url}`);

  if (req.method === 'GET' && url === '/health') {
    return sendJSON(res, 200, { ok: true, service: 'hermes-propuestas', ts: Date.now() });
  }

  if (req.method !== 'POST') {
    return sendJSON(res, 405, { ok: false, error: 'Método no permitido' });
  }

  try {
    const body = await readBody(req);

    if (url === '/pipeline') {
      const result = await handlePipeline(body);
      return sendJSON(res, 200, result);
    }

    if (url === '/analizar') {
      const result = await handleAnalizar(body);
      return sendJSON(res, 200, result);
    }

    sendJSON(res, 404, { ok: false, error: 'Ruta no encontrada' });
  } catch (err) {
    log('ERROR: ' + err.message);
    sendJSON(res, 500, { ok: false, error: err.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  log(`Hermes Propuestas webhook corriendo en http://127.0.0.1:${PORT}`);
  log(`GROQ_API_KEY: ${GROQ_KEY ? '✓ configurada (STT primario)' : '✗ no configurada (STT = OpenAI fallback)'}`);
  log(`OPENAI_API_KEY: ${OPENAI_KEY ? '✓ configurada' : '✗ FALTA (GPT-4o-mini requerido)'}`);
  log(`TELEGRAM_BOT_TOKEN: ${BOT_TOKEN ? '✓ configurada' : '✗ FALTA (requerida para /pipeline)'}`);
  log(`HERMES_DIR: ${HERMES_DIR}`);
});

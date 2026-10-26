#!/usr/bin/env node
// mara-voice-merge.js v3 — OpenAI TTS + FFmpeg merge + Telegram sendVideo
// Usage: node mara-voice-merge.js "<script>" "<video_url>" [job_id]
"use strict";
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

function loadEnv() {
  const ep = '/root/.hermes/.env';
  if (!process.env.OPENAI_API_KEY && fs.existsSync(ep)) {
    fs.readFileSync(ep, 'utf-8').split('\n').forEach(line => {
      const t = line.trim();
      if (!t || t.startsWith('#')) return;
      const i = t.indexOf('=');
      if (i < 0) return;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    });
  }
}

async function openaiTTS(text, out) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const body = JSON.stringify({ model: 'tts-1', input: text, voice: 'nova', response_format: 'mp3', speed: 0.95 });
  return new Promise((res, rej) => {
    const req = https.request({
      hostname: 'api.openai.com', path: '/v1/audio/speech', method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, r => {
      if (r.statusCode !== 200) {
        let e = ''; r.on('data', d => e += d);
        r.on('end', () => rej(new Error('TTS ' + r.statusCode + ': ' + e.slice(0, 200)))); return;
      }
      const w = fs.createWriteStream(out);
      r.pipe(w);
      w.on('finish', () => res(out));
      w.on('error', rej);
    });
    req.on('error', rej); req.write(body); req.end();
  });
}

async function downloadFile(url, out) {
  return new Promise((res, rej) => {
    const p = url.startsWith('https') ? https : require('http');
    const get = u => p.get(u, r => {
      if (r.statusCode === 301 || r.statusCode === 302) { get(r.headers.location); return; }
      const w = fs.createWriteStream(out);
      r.pipe(w);
      w.on('finish', () => res(out));
      w.on('error', rej);
    }).on('error', rej);
    get(url);
  });
}

function sendTelegramVideo(token, chatId, videoPath, caption) {
  if (!token || !chatId) { console.log('   No TELEGRAM creds, skip'); return; }

  // Write caption to temp file to avoid shell escaping issues
  const capFile = '/tmp/tg-cap-' + Date.now() + '.txt';
  const pyFile = '/tmp/tg-send-' + Date.now() + '.py';
  fs.writeFileSync(capFile, caption, 'utf8');

  const tokenJson = JSON.stringify(token);
  const chatIdJson = JSON.stringify(chatId);
  const pyScript = [
    'import urllib.request, json, sys',
    'token = ' + tokenJson,
    'chat_id = ' + chatIdJson,
    'video_path = sys.argv[1]',
    'cap_file = sys.argv[2]',
    'with open(cap_file, "r", encoding="utf-8") as f: caption = f.read()',
    'url = "https://api.telegram.org/bot" + token + "/sendVideo"',
    'boundary = "----TgBound7731"',
    'with open(video_path, "rb") as vf: vb = vf.read()',
    'def part(name, value):',
    '    return ("--" + boundary + "\\r\\nContent-Disposition: form-data; name=\\"" + name + "\\"\\r\\n\\r\\n" + str(value) + "\\r\\n").encode()',
    'body = (',
    '    part("chat_id", chat_id) +',
    '    part("supports_streaming", "true") +',
    '    part("caption", caption) +',
    '    ("--" + boundary + "\\r\\nContent-Disposition: form-data; name=\\"video\\"; filename=\\"mara.mp4\\"\\r\\nContent-Type: video/mp4\\r\\n\\r\\n").encode() +',
    '    vb +',
    '    ("\\r\\n--" + boundary + "--\\r\\n").encode()',
    ')',
    'req = urllib.request.Request(url, data=body, headers={"Content-Type": "multipart/form-data; boundary=" + boundary})',
    'try:',
    '    with urllib.request.urlopen(req, timeout=120) as r:',
    '        result = json.loads(r.read())',
    '        print("OK msg_id=" + str(result.get("result", {}).get("message_id", "?")))',
    'except Exception as e:',
    '    print("ERROR: " + str(e))',
  ].join('\n');

  fs.writeFileSync(pyFile, pyScript, 'utf8');
  try {
    const r = execSync('python3 "' + pyFile + '" "' + videoPath + '" "' + capFile + '" 2>&1', { encoding: 'utf8', timeout: 120000 });
    console.log('   Telegram:', r.trim());
  } catch (e) {
    console.error('   Telegram error:', e.message.slice(0, 300));
  } finally {
    try { fs.unlinkSync(pyFile); fs.unlinkSync(capFile); } catch (_) {}
  }
}

async function main() {
  loadEnv();
  const scriptText = process.argv[2];
  const videoUrl = process.argv[3];
  const jobId = process.argv[4] || 'mara-' + Date.now();
  const caption = '🎬 Video Mara Vale listo\nJob: ' + jobId + '\n\nResponde:\nAprobar video ' + jobId + '\nRehacer video ' + jobId + ': <cambio>';

  if (!scriptText || !videoUrl) {
    console.error('Usage: node mara-voice-merge.js "<script>" "<video_url>" [job_id]');
    process.exit(1);
  }

  const tmp = os.tmpdir();
  const aud = path.join(tmp, 'ma-a-' + jobId + '.mp3');
  const vid = path.join(tmp, 'ma-v-' + jobId + '.mp4');
  const out = path.join(tmp, 'ma-f-' + jobId + '.mp4');

  try {
    console.log('1/4 OpenAI TTS (voice: nova)...');
    await openaiTTS(scriptText, aud);
    console.log('   audio OK');

    console.log('2/4 Downloading video...');
    await downloadFile(videoUrl, vid);
    console.log('   video OK');

    console.log('3/4 FFmpeg merge...');
    execSync('ffmpeg -y -i "' + vid + '" -i "' + aud + '" -c:v copy -c:a aac -shortest -map 0:v:0 -map 1:a:0 "' + out + '" 2>/dev/null');
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log('   merged: ' + kb + 'KB');

    console.log('4/4 Sending to Telegram...');
    sendTelegramVideo(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_HOME_CHANNEL, out, caption);

    try { fs.unlinkSync(aud); fs.unlinkSync(vid); } catch (_) {}
    console.log(JSON.stringify({ ok: true, output: out, job_id: jobId, size_kb: kb }));
  } catch (e) {
    console.error('Pipeline failed:', e.message);
    process.exit(1);
  }
}

main();

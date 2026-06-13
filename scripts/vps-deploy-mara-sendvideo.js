#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

// Updated voice merge script that:
// 1. Loads .env automatically
// 2. Sends video via Telegram Bot API (sendVideo) instead of web server
const UPDATED_SCRIPT = `#!/usr/bin/env node
// mara-voice-merge.js — OpenAI TTS + FFmpeg merge + Telegram sendVideo
// Usage: node mara-voice-merge.js <script_text> <video_url> <job_id>
"use strict";
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Load .env if env vars not set
function loadEnv() {
  const envPath = '/root/.hermes/.env';
  if (!process.env.OPENAI_API_KEY && fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx < 0) continue;
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

async function openaiTTS(text, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY missing');
  const body = JSON.stringify({
    model: 'tts-1',
    input: text,
    voice: 'nova',
    response_format: 'mp3',
    speed: 0.95,
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/audio/speech',
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let err = '';
        res.on('data', d => err += d);
        res.on('end', () => reject(new Error(\`TTS \${res.statusCode}: \${err.slice(0,200)}\`)));
        return;
      }
      const out = fs.createWriteStream(outputPath);
      res.pipe(out);
      out.on('finish', () => resolve(outputPath));
      out.on('error', reject);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : require('http');
    const tryGet = (targetUrl) => {
      proto.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          tryGet(res.headers.location);
          return;
        }
        const out = fs.createWriteStream(outputPath);
        res.pipe(out);
        out.on('finish', () => resolve(outputPath));
        out.on('error', reject);
      }).on('error', reject);
    };
    tryGet(url);
  });
}

async function sendTelegramVideo(videoPath, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HOME_CHANNEL;
  if (!token || !chatId) {
    console.log('No TELEGRAM creds, skipping send');
    return;
  }
  const FormData = require('form-data');
  const fd = new FormData();
  fd.append('chat_id', chatId);
  fd.append('video', fs.createReadStream(videoPath));
  fd.append('caption', caption);
  fd.append('supports_streaming', 'true');
  return new Promise((resolve, reject) => {
    const opts = fd.getHeaders();
    const body = fd.getBuffer ? fd.getBuffer() : null;
    // Simple approach: use curl via exec
    const curlCmd = [
      'curl -s -X POST',
      \`"https://api.telegram.org/bot\${token}/sendVideo"\`,
      '-F', \`"chat_id=\${chatId}"\`,
      '-F', \`"video=@\${videoPath}"\`,
      '-F', \`"caption=\${caption.replace(/"/g, '\\"')}"\`,
      '-F', '"supports_streaming=true"',
    ].join(' ');
    try {
      const result = execSync(curlCmd, { encoding: 'utf8' });
      const parsed = JSON.parse(result);
      if (parsed.ok) {
        console.log('Video sent to Telegram:', parsed.result?.message_id);
        resolve(parsed);
      } else {
        console.error('Telegram sendVideo failed:', parsed.description);
        resolve(parsed);
      }
    } catch (e) {
      console.error('curl error:', e.message);
      resolve({ ok: false, error: e.message });
    }
  });
}

async function main() {
  loadEnv();

  const scriptText = process.argv[2];
  const videoUrl = process.argv[3];
  const jobId = process.argv[4] || 'mara-' + Date.now();
  const caption = process.argv[5] || '🎬 Video Mara Vale — listo para revisión\\n\\nResponde: Aprobar video ' + jobId + '\\nO: Rehacer video ' + jobId + ': <cambio>';

  if (!scriptText || !videoUrl) {
    console.error('Usage: node mara-voice-merge.js "<script>" "<video_url>" [job_id] [caption]');
    process.exit(1);
  }

  const tmpDir = os.tmpdir();
  const audioPath = path.join(tmpDir, \`mara-audio-\${jobId}.mp3\`);
  const videoPath = path.join(tmpDir, \`mara-video-\${jobId}.mp4\`);
  const outputPath = path.join(tmpDir, \`mara-final-\${jobId}.mp4\`);

  try {
    console.log('1/4 Generating voice (OpenAI TTS nova)...');
    await openaiTTS(scriptText, audioPath);
    console.log('   Voice:', audioPath);

    console.log('2/4 Downloading video...');
    await downloadFile(videoUrl, videoPath);
    console.log('   Video:', videoPath);

    console.log('3/4 Merging with FFmpeg...');
    const ffmpegCmd = [
      'ffmpeg -y',
      \`-i "\${videoPath}"\`,
      \`-i "\${audioPath}"\`,
      '-c:v copy -c:a aac -shortest',
      '-map 0:v:0 -map 1:a:0',
      \`"\${outputPath}"\`,
    ].join(' ');
    execSync(ffmpegCmd, { stdio: 'pipe' });
    const stats = fs.statSync(outputPath);
    console.log('   Output:', outputPath, '(' + Math.round(stats.size / 1024) + 'KB)');

    console.log('4/4 Sending to Telegram...');
    await sendTelegramVideo(outputPath, caption);

    // Cleanup
    try { fs.unlinkSync(audioPath); fs.unlinkSync(videoPath); } catch(_) {}

    console.log(JSON.stringify({ ok: true, output: outputPath, job_id: jobId }));
  } catch (e) {
    console.error('Pipeline failed:', e.message);
    process.exit(1);
  }
}

main();
`;

connectSsh().then(async conn => {
  console.log('Deploying updated mara-voice-merge.js...');

  const result = await exec(conn, `python3 -c "
import base64, os
data = base64.b64decode('${Buffer.from(UPDATED_SCRIPT).toString('base64')}')
with open('/root/.hermes/scripts/mara-voice-merge.js', 'wb') as f:
    f.write(data)
print('OK: updated script written')
"`);
  console.log(result.stdout.trim());

  // Test: run the script with the generated video
  console.log('\nRunning test...');
  const TEST_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
  const TEST_SCRIPT = 'Llevo tres semanas usando esta crema y tengo que contártelo. La textura es increíble. Absorbe al instante. Mi piel se ve diferente. Genuinamente diferente. Está en el link.';

  const test = await exec(conn,
    `cd /root/.hermes && node scripts/mara-voice-merge.js ${JSON.stringify(TEST_SCRIPT)} ${JSON.stringify(TEST_VIDEO)} "d1a49fd5-test" "🎬 VIDEO TEST — Mara Vale UGC Crema\\n\\nPipeline: Higgsfield + OpenAI TTS + FFmpeg\\nAproba: Aprobar video d1a49fd5-test"`,
    { timeout: 120000 }
  );
  console.log(test.stdout);
  if (test.stderr) console.log('ERR:', test.stderr.slice(0, 300));

  conn.end();
}).catch(e => console.error(e.message));

#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

const FINAL_SCRIPT = `#!/usr/bin/env node
// mara-voice-merge.js — OpenAI TTS + FFmpeg merge + Telegram sendVideo (via Python)
// Usage: node mara-voice-merge.js <script_text> <video_url> <job_id> [caption]
"use strict";
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

function loadEnv() {
  const envPath = '/root/.hermes/.env';
  if (!process.env.OPENAI_API_KEY && fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\\n');
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const idx = t.indexOf('=');
      if (idx < 0) continue;
      const k = t.substring(0, idx).trim();
      const v = t.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

async function openaiTTS(text, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY missing');
  const body = JSON.stringify({ model: 'tts-1', input: text, voice: 'nova', response_format: 'mp3', speed: 0.95 });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com', path: '/v1/audio/speech', method: 'POST',
      headers: { Authorization: \`Bearer \${apiKey}\`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      if (res.statusCode !== 200) {
        let err = ''; res.on('data', d => err += d);
        res.on('end', () => reject(new Error(\`TTS \${res.statusCode}: \${err.slice(0,200)}\`))); return;
      }
      const out = fs.createWriteStream(outputPath);
      res.pipe(out);
      out.on('finish', () => resolve(outputPath));
      out.on('error', reject);
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : require('http');
    const tryGet = (u) => {
      proto.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) { tryGet(res.headers.location); return; }
        const out = fs.createWriteStream(outputPath);
        res.pipe(out);
        out.on('finish', () => resolve(outputPath));
        out.on('error', reject);
      }).on('error', reject);
    };
    tryGet(url);
  });
}

function sendTelegramVideo(videoPath, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HOME_CHANNEL;
  if (!token || !chatId) { console.log('   No TELEGRAM creds, skip send'); return; }

  // Use Python for multipart upload (reliable escaping)
  const pyScript = \`
import urllib.request, json, sys
token = "\${token}"
chat_id = "\${chatId}"
video_path = sys.argv[1]
caption = sys.argv[2]
url = f"https://api.telegram.org/bot{token}/sendVideo"
import urllib.parse
boundary = "----TelegramBoundary7731"
with open(video_path, "rb") as vf:
    video_bytes = vf.read()
body = (
    f"--{boundary}\\r\\n"
    f'Content-Disposition: form-data; name="chat_id"\\r\\n\\r\\n{chat_id}\\r\\n'
    f"--{boundary}\\r\\n"
    f'Content-Disposition: form-data; name="supports_streaming"\\r\\n\\r\\ntrue\\r\\n'
    f"--{boundary}\\r\\n"
    f'Content-Disposition: form-data; name="caption"\\r\\n\\r\\n{caption}\\r\\n'
    f"--{boundary}\\r\\n"
    f'Content-Disposition: form-data; name="video"; filename="mara.mp4"\\r\\n'
    f'Content-Type: video/mp4\\r\\n\\r\\n'
).encode() + video_bytes + f"\\r\\n--{boundary}--\\r\\n".encode()
req = urllib.request.Request(url, data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
try:
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read())
        if result.get("ok"):
            print(f"OK msg_id={result['result']['message_id']}")
        else:
            print(f"FAIL: {result.get('description')}")
except Exception as e:
    print(f"ERROR: {e}")
\`;

  // Write python script to tmp
  const pyPath = \`/tmp/tg-send-\${Date.now()}.py\`;
  fs.writeFileSync(pyPath, pyScript);
  try {
    const result = execSync(\`python3 "\${pyPath}" "\${videoPath}" "\${caption.replace(/"/g, '\\'')}" 2>&1\`, { encoding: 'utf8', timeout: 120000 });
    console.log('   Telegram:', result.trim());
  } catch(e) {
    console.error('   Telegram error:', e.message.slice(0,200));
  } finally {
    try { fs.unlinkSync(pyPath); } catch(_) {}
  }
}

async function main() {
  loadEnv();
  const scriptText = process.argv[2];
  const videoUrl = process.argv[3];
  const jobId = process.argv[4] || 'mara-' + Date.now();
  const caption = process.argv[5] || \`🎬 Video Mara Vale listo\\nJob: \${jobId}\\nResponde:\\nAprobar video \${jobId}\\nRehacer video \${jobId}: <cambio>\`;

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
    console.log('   audio:', audioPath);

    console.log('2/4 Downloading video...');
    await downloadFile(videoUrl, videoPath);
    console.log('   video:', videoPath);

    console.log('3/4 FFmpeg merge...');
    execSync(\`ffmpeg -y -i "\${videoPath}" -i "\${audioPath}" -c:v copy -c:a aac -shortest -map 0:v:0 -map 1:a:0 "\${outputPath}" 2>/dev/null\`);
    const kb = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(\`   merged: \${outputPath} (\${kb}KB)\`);

    console.log('4/4 Sending to Telegram...');
    sendTelegramVideo(outputPath, caption);

    try { fs.unlinkSync(audioPath); fs.unlinkSync(videoPath); } catch(_) {}
    console.log(JSON.stringify({ ok: true, output: outputPath, job_id: jobId, size_kb: kb }));
  } catch (e) {
    console.error('Pipeline failed:', e.message);
    process.exit(1);
  }
}

main();
`;

connectSsh().then(async conn => {
  // Write final script
  const deploy = await exec(conn, `python3 -c "
import base64
data = base64.b64decode('${Buffer.from(FINAL_SCRIPT).toString('base64')}')
with open('/root/.hermes/scripts/mara-voice-merge.js', 'wb') as f:
    f.write(data)
print('deployed')
"`);
  console.log(deploy.stdout.trim());

  // Test
  console.log('Testing...');
  const VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
  const SCRIPT = 'Llevo tres semanas usando esta crema y tengo que contártelo. La textura es increíble, absorbe al instante. Mi piel se ve diferente. Genuinamente diferente. Está en el link.';
  const r = await exec(conn, `cd /root/.hermes && node scripts/mara-voice-merge.js ${JSON.stringify(SCRIPT)} ${JSON.stringify(VIDEO)} "d1a49fd5-final"`);
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0,200));
  conn.end();
}).catch(e => console.error(e.message));

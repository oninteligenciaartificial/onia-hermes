#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

const SCRIPT_V3 = String.raw`#!/usr/bin/env node
// mara-voice-merge.js v3 — OpenAI TTS + FFmpeg + Telegram (base64 caption)
"use strict";
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

function loadEnv() {
  const ep = '/root/.hermes/.env';
  if (!process.env.OPENAI_API_KEY && fs.existsSync(ep)) {
    fs.readFileSync(ep,'utf-8').split('\n').forEach(line => {
      const t = line.trim();
      if (!t || t.startsWith('#')) return;
      const i = t.indexOf('=');
      if (i < 0) return;
      const k = t.slice(0,i).trim();
      const v = t.slice(i+1).trim().replace(/^["']|["']$/g,'');
      if (!process.env[k]) process.env[k] = v;
    });
  }
}

async function openaiTTS(text, out) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const body = JSON.stringify({model:'tts-1',input:text,voice:'nova',response_format:'mp3',speed:0.95});
  return new Promise((res,rej) => {
    const req = https.request({hostname:'api.openai.com',path:'/v1/audio/speech',method:'POST',
      headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}
    }, r => {
      if (r.statusCode!==200){let e='';r.on('data',d=>e+=d);r.on('end',()=>rej(new Error(`TTS ${r.statusCode}: ${e.slice(0,200)}`)));return;}
      const w=fs.createWriteStream(out);r.pipe(w);w.on('finish',()=>res(out));w.on('error',rej);
    });
    req.on('error',rej);req.write(body);req.end();
  });
}

async function downloadFile(url, out) {
  return new Promise((res,rej) => {
    const p = url.startsWith('https') ? https : require('http');
    const get = u => p.get(u, r => {
      if (r.statusCode===301||r.statusCode===302){get(r.headers.location);return;}
      const w=fs.createWriteStream(out);r.pipe(w);w.on('finish',()=>res(out));w.on('error',rej);
    }).on('error',rej);
    get(url);
  });
}

function sendTelegramVideo(videoPath, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HOME_CHANNEL;
  if (!token || !chatId) { console.log('   No TELEGRAM creds, skip'); return; }

  // Write caption to tmp file to avoid shell escaping
  const capFile = `/tmp/tg-cap-${Date.now()}.txt`;
  fs.writeFileSync(capFile, caption, 'utf8');

  const py = `/tmp/tg-send-${Date.now()}.py`;
  fs.writeFileSync(py, `
import urllib.request, json, sys, os
token = ${JSON.stringify(token)}
chat_id = ${JSON.stringify(chatId)}
video_path = sys.argv[1]
cap_file = sys.argv[2]
with open(cap_file, 'r', encoding='utf-8') as f:
    caption = f.read()
url = f"https://api.telegram.org/bot{token}/sendVideo"
boundary = "----TgBound7731"
with open(video_path, "rb") as vf:
    vb = vf.read()
def part(name, value):
    return f"--{boundary}\\r\\nContent-Disposition: form-data; name=\\"{name}\\"\\r\\n\\r\\n{value}\\r\\n".encode()
body = (
    part("chat_id", chat_id) +
    part("supports_streaming", "true") +
    part("caption", caption) +
    f"--{boundary}\\r\\nContent-Disposition: form-data; name=\\"video\\"; filename=\\"mara.mp4\\"\\r\\nContent-Type: video/mp4\\r\\n\\r\\n".encode() +
    vb +
    f"\\r\\n--{boundary}--\\r\\n".encode()
)
req = urllib.request.Request(url, data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
try:
    with urllib.request.urlopen(req, timeout=120) as r:
        result = json.loads(r.read())
        print("OK msg_id=" + str(result.get("result", {}).get("message_id", "?")))
except Exception as e:
    print("ERROR: " + str(e))
`);
  try {
    const r = execSync(`python3 "${py}" "${videoPath}" "${capFile}" 2>&1`, {encoding:'utf8',timeout:120000});
    console.log('   Telegram:', r.trim());
  } catch(e) {
    console.error('   Telegram error:', e.message.slice(0,300));
  } finally {
    try{fs.unlinkSync(py);fs.unlinkSync(capFile);}catch(_){}
  }
}

async function main() {
  loadEnv();
  const scriptText = process.argv[2];
  const videoUrl = process.argv[3];
  const jobId = process.argv[4] || 'mara-' + Date.now();
  const caption = process.argv[5] ||
    `\u{1F3AC} Video Mara Vale listo\nJob: ${jobId}\n\nResponde:\nAprobar video ${jobId}\nRehacer video ${jobId}: <cambio>`;

  if (!scriptText || !videoUrl) {
    console.error('Usage: node mara-voice-merge.js "<script>" "<video_url>" [job_id]');
    process.exit(1);
  }

  const tmp = os.tmpdir();
  const aud = path.join(tmp, `ma-a-${jobId}.mp3`);
  const vid = path.join(tmp, `ma-v-${jobId}.mp4`);
  const out = path.join(tmp, `ma-f-${jobId}.mp4`);

  try {
    console.log('1/4 OpenAI TTS...');
    await openaiTTS(scriptText, aud);
    console.log('   audio ok');

    console.log('2/4 Download video...');
    await downloadFile(videoUrl, vid);
    console.log('   video ok');

    console.log('3/4 FFmpeg merge...');
    execSync(`ffmpeg -y -i "${vid}" -i "${aud}" -c:v copy -c:a aac -shortest -map 0:v:0 -map 1:a:0 "${out}" 2>/dev/null`);
    const kb = Math.round(fs.statSync(out).size/1024);
    console.log(`   merged: ${kb}KB`);

    console.log('4/4 Telegram send...');
    sendTelegramVideo(out, caption);

    try{fs.unlinkSync(aud);fs.unlinkSync(vid);}catch(_){}
    console.log(JSON.stringify({ok:true,output:out,job_id:jobId,size_kb:kb}));
  } catch(e) {
    console.error('Pipeline failed:', e.message);
    process.exit(1);
  }
}
main();
`;

connectSsh().then(async conn => {
  const deploy = await exec(conn, `python3 -c "
import base64
data = base64.b64decode('${Buffer.from(SCRIPT_V3).toString('base64')}')
with open('/root/.hermes/scripts/mara-voice-merge.js','wb') as f: f.write(data)
print('v3 deployed')
"`);
  console.log(deploy.stdout.trim());

  console.log('Testing...');
  const VID = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
  const SCR = 'Llevo tres semanas usando esta crema y tengo que contártelo. La textura absorbe al instante. Mi piel se ve diferente. Genuinamente diferente. Está en el link.';
  const r = await exec(conn, `cd /root/.hermes && node scripts/mara-voice-merge.js ${JSON.stringify(SCR)} ${JSON.stringify(VID)} "mara-ugc-test-v3"`);
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0,300));
  conn.end();
}).catch(e => console.error(e.message));

#!/usr/bin/env node
"use strict";
// Deploys Mara voice+merge pipeline to VPS
const { connectSsh, exec } = require('./lib/ssh');

const VOICE_SCRIPT = `#!/usr/bin/env node
// mara-voice-merge.js — OpenAI TTS + FFmpeg merge for Mara Vale videos
// Usage: node mara-voice-merge.js <script_text> <video_url> <output_path>
"use strict";
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function openaiTTS(text, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY missing');

  const body = JSON.stringify({
    model: 'tts-1',
    input: text,
    voice: 'nova',  // Mara's voice: warm, feminine, clear
    response_format: 'mp3',
    speed: 0.95,    // slightly slower for UGC authenticity
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
        res.on('end', () => reject(new Error(\`TTS failed \${res.statusCode}: \${err}\`)));
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

async function downloadVideo(url, outputPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : require('http');
    const out = fs.createWriteStream(outputPath);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        out.close();
        downloadVideo(res.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      res.pipe(out);
      out.on('finish', () => resolve(outputPath));
      out.on('error', reject);
    }).on('error', reject);
  });
}

async function mergeVideoAudio(videoPath, audioPath, outputPath) {
  // Merge: loop audio to match video length, or trim video to audio length
  const cmd = [
    'ffmpeg -y',
    \`-i "\${videoPath}"\`,
    \`-i "\${audioPath}"\`,
    '-c:v copy',
    '-c:a aac',
    '-shortest',      // ends when shortest stream ends
    '-map 0:v:0',
    '-map 1:a:0',
    \`"\${outputPath}"\`,
  ].join(' ');

  console.log('Merging:', cmd);
  execSync(cmd, { stdio: 'inherit' });
  return outputPath;
}

async function main() {
  const scriptText = process.argv[2];
  const videoUrl = process.argv[3];
  const outputPath = process.argv[4] || '/tmp/mara-final.mp4';

  if (!scriptText || !videoUrl) {
    console.error('Usage: node mara-voice-merge.js "<script>" "<video_url>" [output.mp4]');
    process.exit(1);
  }

  const tmpDir = os.tmpdir();
  const audioPath = path.join(tmpDir, 'mara-voice-' + Date.now() + '.mp3');
  const videoPath = path.join(tmpDir, 'mara-video-' + Date.now() + '.mp4');

  try {
    console.log('1/3 Generating voice (OpenAI TTS nova)...');
    await openaiTTS(scriptText, audioPath);
    console.log('Voice:', audioPath);

    console.log('2/3 Downloading video...');
    await downloadVideo(videoUrl, videoPath);
    console.log('Video:', videoPath);

    console.log('3/3 Merging...');
    await mergeVideoAudio(videoPath, audioPath, outputPath);
    console.log('Done:', outputPath);

    // Cleanup temp files
    fs.unlinkSync(audioPath);
    fs.unlinkSync(videoPath);

    console.log(JSON.stringify({ ok: true, output: outputPath }));
  } catch (e) {
    console.error('Pipeline failed:', e.message);
    process.exit(1);
  }
}

main();
`;

const MARA_CONFIG = `# Mara Vale — Video Lab Configuration

## Identidad
- Nombre: Mara Vale
- Tipo: personaje ficticio adulto (no es persona real)
- Pelo: pelirrojo cobrizo ondulado
- Ojos: verdes-avellana
- Piel: clara con pecas
- Energía: auténtica, premium accesible

## Imagen de referencia principal
- media_id: 8dc5726b-32a5-4da5-bfdb-74a5f342409c

## Voz
- Engine: OpenAI TTS
- Voice: nova (cálida, femenina, clara)
- Speed: 0.95
- Script: node /root/.hermes/scripts/mara-voice-merge.js

## Modelos Higgsfield
- Test: kling3_0 std, 5s, sin audio
- Producción: kling3_0 pro, 10s, sin audio (luego FFmpeg agrega voz)
- Premium: seedance_2_0 std, 15s, sin audio

## Pipeline de producción
1. n8n busca trends TikTok skincare diariamente
2. Hermes genera guion UGC basado en trend
3. Telegram → Sergio aprueba guion
4. Hermes genera video Higgsfield (sin audio)
5. Hermes genera voz OpenAI TTS
6. FFmpeg fusiona video + voz
7. Telegram → Sergio aprueba video final
8. Hermes publica en Instagram

## Comandos de Telegram
- "Genera video Mara: <tema>" → brief + guion para aprobación
- "Aprobar video <job_id>" → genera video + voz + merge
- "Publicar video <job_id>" → publica en Instagram

## Restricciones
- No claims médicos ni garantizados
- No cara/voz de Sergio
- No publicar sin aprobación explícita
- Outfit siempre brand-safe (colores neutros)
`;

connectSsh().then(async conn => {
  console.log('Deploying Mara pipeline to VPS...');

  // Create scripts directory if needed
  await exec(conn, 'mkdir -p /root/.hermes/scripts');

  // Write voice merge script
  const writeScript = `cat > /root/.hermes/scripts/mara-voice-merge.js << 'ENDSCRIPT'\n${VOICE_SCRIPT}\nENDSCRIPT`;
  // Use heredoc approach via python to avoid shell escaping issues
  await exec(conn, `python3 -c "
import base64, os
data = base64.b64decode('${Buffer.from(VOICE_SCRIPT).toString('base64')}')
os.makedirs('/root/.hermes/scripts', exist_ok=True)
with open('/root/.hermes/scripts/mara-voice-merge.js', 'wb') as f:
    f.write(data)
print('script written')
"`);

  // Write Mara config doc
  await exec(conn, `python3 -c "
import base64, os
data = base64.b64decode('${Buffer.from(MARA_CONFIG).toString('base64')}')
os.makedirs('/root/.hermes/docs', exist_ok=True)
with open('/root/.hermes/docs/MARA_VALE_CONFIG.md', 'wb') as f:
    f.write(data)
print('config written')
"`);

  // Verify
  const check = await exec(conn,
    'ls -la /root/.hermes/scripts/mara-voice-merge.js 2>/dev/null ; ' +
    'ls -la /root/.hermes/docs/MARA_VALE_CONFIG.md 2>/dev/null'
  );
  console.log('Deployed:', check.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

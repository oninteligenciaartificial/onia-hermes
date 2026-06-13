#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

const MARA_SKILL = `# Skill: Mara Vale — Video UGC Automatizado

Use este skill cuando Hermes genere o apruebe videos de la modelo Mara Vale.

## Identidad Mara Vale

- Personaje ficticio adulto, no es persona real
- Pelo: pelirrojo cobrizo ondulado
- Ojos: verdes-avellana
- Piel: clara con pecas
- Imagen referencia Higgsfield: \`8dc5726b-32a5-4da5-bfdb-74a5f342409c\`

## Voz de Mara

- Engine: OpenAI TTS (ya disponible en .env)
- Voice ID: nova (cálida, femenina, clara)
- Speed: 0.95 (levemente más lento para UGC auténtico)
- Script de merge: \`node /root/.hermes/scripts/mara-voice-merge.js\`

## Pipeline de producción completo

### Fase 1 — Brief (automático, n8n lo dispara)
Hermes recibe: "Genera video Mara diario: ..."
1. Busca trends con SearXNG (skincare, beauty, UGC, TikTok viral)
2. Selecciona mejor hook
3. Escribe guion UGC de 20s
4. Crea Video Lab job en lane "mara"
5. Envía brief a Sergio por Telegram para aprobación

### Fase 2 — Generación (después de "Aprobar video <job_id>")
1. Genera video en Higgsfield SIN audio:
   - Test: kling3_0 std, 5s, sound=off, 9:16
   - Producción: kling3_0 pro, 10s, sound=off, 9:16
   - Premium: seedance_2_0 std, 15s, sound=off, 9:16
2. Genera voz con OpenAI TTS:
   \`\`\`bash
   node /root/.hermes/scripts/mara-voice-merge.js "<guion>" "<video_url>" /tmp/mara-<job_id>-final.mp4
   \`\`\`
3. Envía video final a Sergio vía Telegram Bot API (sendVideo con archivo local)
4. Actualiza Video Lab job con estado "generated"

### Fase 3 — Publicación (después de "Publicar video <job_id>")
1. Hermes publica en Instagram Reels vía Meta API
2. Archiva video en /root/.hermes/video-lab/outputs/

## Comandos soportados

- "Genera video Mara: <tema>" → crea brief + envía para aprobar
- "Genera video Mara diario <fecha>: <instrucción>" → modo automático n8n
- "Aprobar video <job_id>" → genera video Higgsfield + voz + merge + envía preview
- "Rehacer video <job_id>: <cambio>" → regernera con modificación
- "Publicar video <job_id>" → publica en Instagram

## Prompt base de identidad (SIEMPRE incluir en Higgsfield)

\`\`\`
Mara Vale, fictional adult red-haired woman.
Exact same identity: fair freckled skin, copper-red wavy hair,
green-hazel eyes, warm smile, healthy adult proportions.
No identity drift, no different face, no text, no watermark, no logos.
\`\`\`

## Reglas de contenido

✅ Permitido: claims subjetivos de textura/olor/sensación, "me encanta", "lo recomiendo"
❌ Prohibido: claims médicos, garantías de resultados, cara/voz de Sergio, publicar sin aprobación

## Costos estimados

- Test (5s kling3_0 std): ~7.5 créditos
- Producción (10s kling3_0 pro): ~15 créditos
- Premium (15s seedance_2_0): ~25 créditos
- Balance actual: 1,223 créditos
`;

connectSsh().then(async conn => {
  console.log('Deploying Mara skill to VPS...');

  // Write the skill file
  const result = await exec(conn, `python3 -c "
import base64, os
data = base64.b64decode('${Buffer.from(MARA_SKILL).toString('base64')}')
os.makedirs('/root/.hermes/skills', exist_ok=True)
with open('/root/.hermes/skills/mara-ugc-video.md', 'wb') as f:
    f.write(data)
print('OK: mara-ugc-video.md written')
"`);
  console.log(result.stdout);

  // Also create video-lab outputs dir
  const mkdirResult = await exec(conn,
    'mkdir -p /root/.hermes/video-lab/outputs && echo "outputs dir ready"'
  );
  console.log(mkdirResult.stdout);

  // List skills to confirm
  const ls = await exec(conn, 'ls /root/.hermes/skills/*.md 2>/dev/null | head -15');
  console.log('Skills:', ls.stdout);

  conn.end();
}).catch(e => console.error('SSH:', e.message));

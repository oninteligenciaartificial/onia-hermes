#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

// Read current video-lab skill and update with Mara voice pipeline
connectSsh().then(async conn => {
  // Append Mara voice section to video-lab-higgsfield.md
  const update = await exec(conn, `python3 << 'PYEOF'
skill_path = '/root/.hermes/skills/video-lab-higgsfield.md'
with open(skill_path, 'r') as f:
    content = f.read()

mara_section = """

## Mara Vale — Voice Pipeline (Auto)

When lane is "mara" and state is "approved_for_generation", after Higgsfield
generates the video URL, automatically run the voice+merge pipeline:

\`\`\`bash
cd /root/.hermes && node scripts/mara-voice-merge.js "<guion_from_brief>" "<higgsfield_video_url>" "<job_id>"
\`\`\`

This generates:
1. OpenAI TTS voice (nova, 0.95 speed) from the brief script
2. FFmpeg merge of video + audio
3. Telegram sendVideo to Sergio with approval request

Voice pipeline runs ONLY for lane="mara". Sergio lanes use Higgsfield audio or
separate ElevenLabs flow.

### Required brief fields for voice pipeline
- \`script\` (array of strings) — joined with space as TTS input
- \`higgsfield_video_url\` — URL of generated MP4
- \`job_id\` — Video Lab job identifier

### After voice merge
- Update job state to "generated_with_voice"
- Wait for "Aprobar video <job_id>" before publishing
"""

if 'Mara Vale — Voice Pipeline' not in content:
    content = content + mara_section
    with open(skill_path, 'w') as f:
        f.write(content)
    print('Updated video-lab-higgsfield.md with Mara voice section')
else:
    print('Already has Mara voice section')
PYEOF`);
  console.log(update.stdout.trim());

  // Also update mara-ugc-video.md to point at the voice script
  const update2 = await exec(conn, `python3 << 'PYEOF'
import os
skill_path = '/root/.hermes/skills/mara-ugc-video.md'
with open(skill_path, 'r') as f:
    content = f.read()
# Ensure the pipeline section has the exact command format
print('mara-ugc-video.md size:', len(content), 'bytes')
print('Has voice pipeline:', 'voice-merge' in content)
PYEOF`);
  console.log(update2.stdout.trim());

  conn.end();
}).catch(e => console.error(e.message));

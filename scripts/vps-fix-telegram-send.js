#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

// Fix: remove form-data require, use curl directly for sendVideo
const FIX_SCRIPT = `
async function sendTelegramVideo(videoPath, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HOME_CHANNEL;
  if (!token || !chatId) {
    console.log('No TELEGRAM creds, skipping send');
    return;
  }
  const safeCaption = caption.replace(/"/g, '\\"').replace(/\\n/g, '\\\\n');
  const curlCmd = [
    'curl -s -X POST',
    \`"https://api.telegram.org/bot\${token}/sendVideo"\`,
    '-F', \`"chat_id=\${chatId}"\`,
    '-F', \`"video=@\${videoPath}"\`,
    '-F', \`"caption=\${safeCaption}"\`,
    '-F', '"supports_streaming=true"',
  ].join(' ');
  try {
    const result = execSync(curlCmd, { encoding: 'utf8', timeout: 60000 });
    const parsed = JSON.parse(result);
    if (parsed.ok) {
      console.log('   Sent to Telegram, message_id:', parsed.result?.message_id);
    } else {
      console.error('   Telegram error:', parsed.description);
    }
    return parsed;
  } catch (e) {
    console.error('   curl error:', e.message);
    return { ok: false };
  }
}
`;

connectSsh().then(async conn => {
  // Patch: replace the old sendTelegramVideo function using python
  const patch = await exec(conn, `python3 -c "
import re, os

with open('/root/.hermes/scripts/mara-voice-merge.js', 'r') as f:
    content = f.read()

# Remove the require('form-data') line and old function body
old_func = '''async function sendTelegramVideo(videoPath, caption) {
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
      \`https://api.telegram.org/bot\${token}/sendVideo\`,
      '-F', \`chat_id=\${chatId}\`,
      '-F', \`video=@\${videoPath}\`,
      '-F', \`caption=\${caption.replace(/\\"/g, \\'\\\\\\\\\\"\\')}}\`,
      '-F', 'supports_streaming=true',
    ].join(' ');
    try {
      const result = execSync(curlCmd, { encoding: \\'utf8\\' });
      const parsed = JSON.parse(result);
      if (parsed.ok) {
        console.log(\\'Video sent to Telegram:\\', parsed.result?.message_id);
        resolve(parsed);
      } else {
        console.error(\\'Telegram sendVideo failed:\\', parsed.description);
        resolve(parsed);
      }
    } catch (e) {
      console.error(\\'curl error:\\', e.message);
      resolve({ ok: false, error: e.message });
    }
  });
}'''

new_func = '''async function sendTelegramVideo(videoPath, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HOME_CHANNEL;
  if (!token || !chatId) {
    console.log('   No TELEGRAM creds, skipping send');
    return { ok: false };
  }
  const safeCaption = caption.replace(/\\\"/g, '\\\\\\\"');
  const curlCmd = [
    'curl -s -X POST',
    \`\"https://api.telegram.org/bot\${token}/sendVideo\"\`,
    '-F', \`\"chat_id=\${chatId}\"\`,
    '-F', \`\"video=@\${videoPath}\"\`,
    '-F', \`\"caption=\${safeCaption}\"\`,
    '-F', '\"supports_streaming=true\"',
  ].join(' ');
  try {
    const result = execSync(curlCmd, { encoding: 'utf8', timeout: 60000 });
    const parsed = JSON.parse(result);
    if (parsed.ok) {
      console.log('   Sent to Telegram, message_id:', parsed.result?.message_id);
    } else {
      console.error('   Telegram error:', parsed.description);
    }
    return parsed;
  } catch (e) {
    console.error('   curl error:', e.message);
    return { ok: false };
  }
}'''

# Simple replacement: find async function sendTelegramVideo and replace until matching closing brace
import re
# Use a simpler string replacement approach
if 'form-data' in content:
    # Find and replace the whole function
    start = content.find('async function sendTelegramVideo')
    if start >= 0:
        # Find the function end by counting braces
        depth = 0
        i = content.find('{', start)
        while i < len(content):
            if content[i] == '{':
                depth += 1
            elif content[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
            i += 1
        old = content[start:end]
        new_content = content.replace(old, new_func, 1)
        with open('/root/.hermes/scripts/mara-voice-merge.js', 'w') as f:
            f.write(new_content)
        print('PATCHED: form-data removed, curl-only sendTelegramVideo')
    else:
        print('ERROR: function not found')
else:
    print('Already patched or no form-data found')
"`);
  console.log(patch.stdout.trim());

  // Re-test
  console.log('\nRe-testing pipeline...');
  const TEST_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
  const TEST_SCRIPT = 'Llevo tres semanas usando esta crema y tengo que contártelo. La textura es increíble. Absorbe al instante. Mi piel se ve diferente. Genuinamente diferente. Está en el link.';

  const test = await exec(conn,
    `cd /root/.hermes && node scripts/mara-voice-merge.js ${JSON.stringify(TEST_SCRIPT)} ${JSON.stringify(TEST_VIDEO)} "d1a49fd5-test" "🎬 VIDEO TEST Mara Vale UGC\\nPipeline: Higgsfield + OpenAI TTS + FFmpeg\\nResponde: Aprobar video d1a49fd5-test"`
  );
  console.log(test.stdout);
  if (test.stderr) console.log('ERR:', test.stderr.slice(0, 300));

  conn.end();
}).catch(e => console.error(e.message));

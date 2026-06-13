#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

// Patch: encode caption as base64 to avoid newline shell escaping issues
connectSsh().then(async conn => {
  const patch = await exec(conn, `python3 << 'PYEOF'
with open('/root/.hermes/scripts/mara-voice-merge.js', 'r') as f:
    c = f.read()

old = """  const pyPath = \`/tmp/tg-send-\${Date.now()}.py\`;
  fs.writeFileSync(pyPath, pyScript);
  try {
    const result = execSync(\`python3 "\${pyPath}" "\${videoPath}" "\${caption.replace(/"/g, '\\'')}" 2>&1\`, { encoding: 'utf8', timeout: 120000 });"""

new = """  const pyPath = \`/tmp/tg-send-\${Date.now()}.py\`;
  fs.writeFileSync(pyPath, pyScript);
  const captionB64 = Buffer.from(caption, 'utf8').toString('base64');
  try {
    const result = execSync(\`python3 "\${pyPath}" "\${videoPath}" "\${captionB64}" 2>&1\`, { encoding: 'utf8', timeout: 120000 });"""

if old in c:
    c = c.replace(old, new, 1)
    # Also patch the python script to decode base64
    py_old = 'caption = sys.argv[2]'
    py_new = 'import base64; caption = base64.b64decode(sys.argv[2]).decode("utf-8")'
    c = c.replace(py_old, py_new, 1)
    with open('/root/.hermes/scripts/mara-voice-merge.js', 'w') as f:
        f.write(c)
    print('PATCHED: base64 caption encoding')
else:
    print('Pattern not found - may already be patched or different format')
PYEOF`);
  console.log(patch.stdout.trim());

  // Quick re-test
  console.log('\nRe-testing Telegram send...');
  const VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
  const SCRIPT = 'Llevo tres semanas usando esta crema y tengo que contártelo. La textura absorbe al instante. Mi piel se ve diferente. Genuinamente diferente. Está en el link.';
  const r = await exec(conn, `cd /root/.hermes && node scripts/mara-voice-merge.js ${JSON.stringify(SCRIPT)} ${JSON.stringify(VIDEO)} "mara-test-final"`);
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0, 500));
  conn.end();
}).catch(e => console.error(e.message));

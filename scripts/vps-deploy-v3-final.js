#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');
const fs = require('fs');
const path = require('path');

const scriptPath = path.resolve(__dirname, './mara-voice-merge.js');
const script = fs.readFileSync(scriptPath, 'utf8');
const b64 = Buffer.from(script).toString('base64');

connectSsh().then(async conn => {
  // Deploy script
  const deploy = await exec(conn, `python3 -c "import base64; data=base64.b64decode('${b64}'); open('/root/.hermes/scripts/mara-voice-merge.js','wb').write(data); print('v3 deployed: '+str(len(data))+' bytes')"`);
  console.log(deploy.stdout.trim());

  // Test
  console.log('Testing pipeline...');
  const VID = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
  const SCR = 'Llevo tres semanas usando esta crema y tengo que contartelo. La textura absorbe al instante. Mi piel se ve diferente. Esta en el link.';
  const r = await exec(conn, `cd /root/.hermes && node scripts/mara-voice-merge.js '${SCR.replace(/'/g, "\\'")}' '${VID}' 'mara-v3-test'`);
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0, 400));
  conn.end();
}).catch(e => console.error(e.message));

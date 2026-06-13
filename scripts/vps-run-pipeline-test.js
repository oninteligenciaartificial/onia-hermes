#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

const VID = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
const SCR = 'Llevo tres semanas usando esta crema. La textura absorbe al instante. Mi piel se ve diferente. Esta en el link.';

connectSsh().then(async conn => {
  console.log('Running pipeline test...');
  const r = await exec(conn,
    `cd /root/.hermes && node scripts/mara-voice-merge.js '${SCR}' '${VID}' 'mara-v3-test'`,
    { timeout: 120000 }
  );
  console.log('STDOUT:', r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.slice(0, 500));
  conn.end();
}).catch(e => console.error('Error:', e.message));

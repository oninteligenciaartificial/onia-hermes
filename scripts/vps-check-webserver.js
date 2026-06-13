#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'cat /root/.hermes/docs/ELEVENLABS_AUDIO_SYSTEM.md 2>/dev/null | head -80 ; ' +
    'echo "=== WEB SERVER ===" ; ' +
    'systemctl is-active nginx 2>/dev/null || echo "nginx not active" ; ' +
    'ls /var/www/html/hermes-assets/ 2>/dev/null || echo "no hermes-assets dir" ; ' +
    'cat /root/.hermes/docs/SERGIO_FACE_VOICE_ASSET_GUIDE.md 2>/dev/null | grep -i "mara\|voice\|eleven\|voice_id" | head -20'
  );
  console.log(r.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'echo "=== SOUL.md ===" ; cat /root/.hermes/SOUL.md 2>/dev/null | head -60 ; ' +
    'echo "=== VIDEO-LAB ===" ; ls /root/.hermes/video-lab/ 2>/dev/null ; ' +
    'echo "=== SKILLS ===" ; ls /root/.hermes/skills/ 2>/dev/null | grep -i "video\|voice\|mara\|ugc"'
  );
  console.log(r.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

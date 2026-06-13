#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'echo "=== VIDEO-LAB STRUCTURE ===" ; find /root/.hermes/video-lab -type f 2>/dev/null | head -30 ; ' +
    'echo "=== BRIEFS ===" ; ls /root/.hermes/video-lab/briefs/ 2>/dev/null | head -5 ; ' +
    'echo "=== JOBS ===" ; ls /root/.hermes/video-lab/jobs/ 2>/dev/null | head -5 ; ' +
    'echo "=== SKILLS VIDEO ===" ; find /root/.hermes/skills -name "*video*" -o -name "*higgsfield*" 2>/dev/null ; ' +
    'echo "=== PLUGINS ===" ; ls /root/.hermes/plugins/ 2>/dev/null'
  );
  console.log(r.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

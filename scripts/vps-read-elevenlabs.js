#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'cat /root/.hermes/skills/audio-elevenlabs.md ; ' +
    'echo "=== DOCS ELEVENLABS ===" ; ls /root/.hermes/docs/ 2>/dev/null | grep -i eleven ; ' +
    'echo "=== ENV ELEVENLABS ===" ; cat /root/.hermes/.env | grep -i eleven | sed "s/=.*/=[HIDDEN]/"'
  );
  console.log(r.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

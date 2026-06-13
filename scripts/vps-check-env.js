#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'cat /root/hermes/.env 2>/dev/null | sed "s/=.*/=[HIDDEN]/" ; ' +
    'echo "=== FFMPEG ===" ; which ffmpeg 2>/dev/null || echo NO_FFMPEG ; ' +
    'echo "=== HERMES DIR ===" ; ls /root/hermes/ 2>/dev/null'
  );
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0, 200));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

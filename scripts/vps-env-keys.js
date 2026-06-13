#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  // Show key names only, hide values
  const r = await exec(conn,
    'cat /root/.hermes/.env 2>/dev/null | grep -v "^#" | grep -v "^$" | sed "s/=.*/=[HIDDEN]/" ; ' +
    'echo "=== .hermes DIR ===" ; ls /root/.hermes/ 2>/dev/null ; ' +
    'echo "=== FFMPEG ===" ; apt list --installed 2>/dev/null | grep -i ffmpeg | head -5'
  );
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0, 200));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

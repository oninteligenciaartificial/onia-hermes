#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'find /root -name ".env" 2>/dev/null | head -10 ; ' +
    'echo "---LS ROOT---" ; ls /root/ 2>/dev/null ; ' +
    'echo "---WHICH FFMPEG---" ; which ffmpeg 2>/dev/null || apt list --installed 2>/dev/null | grep ffmpeg'
  );
  console.log(r.stdout);
  if (r.stderr) console.log('ERR:', r.stderr.slice(0, 300));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

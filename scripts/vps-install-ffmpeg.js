#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  console.log('Installing FFmpeg...');
  const r = await exec(conn,
    'apt-get install -y ffmpeg 2>&1 | tail -5'
  );
  console.log(r.stdout);
  const check = await exec(conn, 'ffmpeg -version 2>&1 | head -2');
  console.log('FFmpeg version:', check.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

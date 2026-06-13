#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'echo "=== ugc-empresas-higgsfield ===" ; cat /root/.hermes/skills/ugc-empresas-higgsfield.md 2>/dev/null ; ' +
    'echo "=== video-lab-higgsfield ===" ; cat /root/.hermes/skills/video-lab-higgsfield.md 2>/dev/null | head -80 ; ' +
    'echo "=== SAMPLE JOB ===" ; cat /root/.hermes/video-lab/jobs/vl-20260603-022305-sergio-como-estoy-construyendo-onia-con-16-a-os.json 2>/dev/null'
  );
  console.log(r.stdout);
  conn.end();
}).catch(e => console.error('SSH:', e.message));

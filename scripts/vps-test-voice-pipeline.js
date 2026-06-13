#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

// Test video URL from the Mara test we just generated
const TEST_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260609_173555_d1a49fd5-0e0c-4f04-8c66-3ca5f4d94e58.mp4';
const TEST_SCRIPT = 'Llevo tres semanas usando esta crema y tengo que contártelo. La textura es increíble. Absorbe al instante. Mi piel se ve diferente. Genuinamente diferente. Está en el link.';

connectSsh().then(async conn => {
  console.log('Step 1: Start nginx...');
  const nginx = await exec(conn,
    'systemctl start nginx 2>&1 ; systemctl is-active nginx 2>/dev/null'
  );
  console.log('nginx:', nginx.stdout.trim());

  console.log('\nStep 2: Ensure video output dir...');
  const mkdir = await exec(conn,
    'mkdir -p /var/www/html/hermes-assets/videos && echo "dir ready"'
  );
  console.log(mkdir.stdout.trim());

  console.log('\nStep 3: Run voice merge pipeline...');
  const JOB_ID = 'd1a49fd5';
  const OUTPUT_PATH = `/var/www/html/hermes-assets/videos/mara-${JOB_ID}.mp4`;

  const merge = await exec(conn,
    `cd /root/.hermes && node scripts/mara-voice-merge.js ${JSON.stringify(TEST_SCRIPT)} ${JSON.stringify(TEST_VIDEO_URL)} ${JSON.stringify(OUTPUT_PATH)}`
  );
  console.log(merge.stdout);
  if (merge.stderr) console.log('STDERR:', merge.stderr.slice(0, 500));

  console.log('\nStep 4: Check output file...');
  const check = await exec(conn,
    `ls -lh ${OUTPUT_PATH} 2>/dev/null || echo "FILE NOT FOUND"`
  );
  console.log(check.stdout.trim());

  const VIDEO_URL = `http://187.77.16.63/hermes-assets/videos/mara-${JOB_ID}.mp4`;
  console.log('\nVideo URL:', VIDEO_URL);

  conn.end();
}).catch(e => console.error('SSH:', e.message));

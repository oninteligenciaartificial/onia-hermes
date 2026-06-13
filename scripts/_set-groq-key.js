'use strict';
const { connectSsh, exec } = require('./lib/ssh');
const KEY = process.argv[2];
if (!KEY) { console.error('Usage: node _set-groq-key.js <key>'); process.exit(1); }

(async () => {
  const conn = await connectSsh();
  const check = await exec(conn, 'grep -c GROQ_API_KEY /root/.hermes/.env 2>/dev/null || echo 0');
  if (check.stdout.trim() !== '0') {
    await exec(conn, `sed -i '/GROQ_API_KEY/d' /root/.hermes/.env`);
    console.log('Removed old GROQ_API_KEY');
  }
  await exec(conn, `echo 'GROQ_API_KEY=${KEY}' >> /root/.hermes/.env`);
  console.log('Added GROQ_API_KEY');
  const r2 = await exec(conn, 'pm2 restart hermes-propuestas --update-env');
  console.log('PM2:', (r2.stdout + r2.stderr).trim().slice(0, 200));
  await new Promise(r => setTimeout(r, 2000));
  const r3 = await exec(conn, 'curl -s http://127.0.0.1:3031/health');
  console.log('Health:', r3.stdout.trim());
  const r4 = await exec(conn, 'pm2 logs hermes-propuestas --lines 6 --nostream 2>&1');
  console.log('Logs:\n' + r4.stdout.trim().slice(0, 500));
  conn.end();
})().catch(e => { console.error(e.message); process.exit(1); });

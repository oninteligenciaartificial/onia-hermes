'use strict';
const { connectSsh, exec } = require('./lib/ssh');
(async () => {
  const conn = await connectSsh();
  const r = await exec(conn, "sed 's/=.*/=***HIDDEN***/g' /root/.hermes/.env");
  console.log('=== /root/.hermes/.env ===');
  console.log(r.stdout.trim());
  const r2 = await exec(conn, 'pm2 logs hermes-propuestas --lines 12 --nostream 2>&1');
  console.log('\n=== PM2 logs (last 12) ===');
  console.log(r2.stdout.trim());
  conn.end();
})().catch(e => { console.error(e.message); process.exit(1); });

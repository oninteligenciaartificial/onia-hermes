// Generic single-command VPS runner
const { connectSsh, exec } = require('./lib/ssh');
const cmd = process.argv[2];
if (!cmd) { console.error('Usage: node vps-cmd.js "<command>"'); process.exit(1); }

connectSsh().then(async conn => {
  const r = await exec(conn, cmd);
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  conn.end();
  process.exit(r.code || 0);
}).catch(e => { console.error('SSH:', e.message); process.exit(1); });

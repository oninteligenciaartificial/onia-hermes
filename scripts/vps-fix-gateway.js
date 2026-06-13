const { connectSsh, exec } = require('./lib/ssh');

async function main() {
  const conn = await connectSsh();

  async function run(cmd, label) {
    const r = await exec(conn, cmd);
    console.log(`\n=== ${label} ===`);
    console.log(r.stdout || '(empty)');
    if (r.stderr) console.log('STDERR:', r.stderr.substring(0, 300));
    return r;
  }

  // Check why it failed
  await run('journalctl --user -u hermes-gateway -n 30 --no-pager 2>&1', 'Last 30 log lines');

  // Restart gateway
  await run('systemctl --user restart hermes-gateway 2>&1', 'Restart gateway');

  // Wait 3 seconds then check status
  await new Promise(r => setTimeout(r, 3000));

  await run('systemctl --user is-active hermes-gateway 2>&1', 'Gateway active after restart?');
  await run('systemctl --user status hermes-gateway --no-pager 2>&1 | head -20', 'Gateway status after restart');

  // Full cron list
  await run('hermes cron list 2>/dev/null', 'Full cron list');

  conn.end();
}

main().catch(e => { console.error('SSH error:', e.message); });

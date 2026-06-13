const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  // All in one exec call to avoid ECONNRESET on multiple calls
  const r = await exec(conn, [
    'journalctl --user -u hermes-gateway -n 10 --no-pager 2>&1 | tail -15',
    'echo "---RESTART---"',
    'systemctl --user restart hermes-gateway 2>&1',
    'sleep 3',
    'systemctl --user is-active hermes-gateway 2>&1',
    'echo "---STATUS---"',
    'systemctl --user status hermes-gateway --no-pager 2>&1 | head -15',
    'echo "---CRONS---"',
    'hermes cron list 2>&1 | tail -40'
  ].join(' ; '));
  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0,500));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

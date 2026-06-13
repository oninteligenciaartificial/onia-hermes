const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn, [
    // Check process directly instead of systemctl --user
    'ps aux | grep hermes | grep -v grep | head -5',
    'echo "---"',
    // Check log file directly
    'tail -20 /root/.hermes/logs/gateway.log 2>/dev/null || find /root/.hermes -name "*.log" 2>/dev/null | head -5',
    'echo "---"',
    // Try restart via loginctl/su approach
    'XDG_RUNTIME_DIR=/run/user/0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus systemctl --user restart hermes-gateway 2>&1 || echo "RESTART_ATTEMPTED"',
    'echo "---"',
    'sleep 2',
    'ps aux | grep hermes | grep -v grep | head -5',
    'echo "---CRONS---"',
    'hermes cron list 2>&1 | head -60'
  ].join(' ; '));
  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0,300));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

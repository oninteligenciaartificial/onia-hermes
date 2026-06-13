const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn, [
    'echo "=== CURRENT STATUS ==="',
    'XDG_RUNTIME_DIR=/run/user/0 systemctl --user is-active hermes-gateway 2>&1',
    'echo "=== JOURNAL LAST 15 ==="',
    'XDG_RUNTIME_DIR=/run/user/0 journalctl --user -u hermes-gateway -n 15 --no-pager 2>&1',
    'echo "=== RESTART ==="',
    'XDG_RUNTIME_DIR=/run/user/0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus systemctl --user daemon-reload 2>&1',
    'XDG_RUNTIME_DIR=/run/user/0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus systemctl --user restart hermes-gateway 2>&1',
    'sleep 4',
    'echo "=== STATUS AFTER ==="',
    'XDG_RUNTIME_DIR=/run/user/0 systemctl --user is-active hermes-gateway 2>&1',
    'XDG_RUNTIME_DIR=/run/user/0 systemctl --user status hermes-gateway --no-pager 2>&1 | head -20',
    'echo "=== PROCESS ==="',
    'ps aux | grep hermes | grep -v grep'
  ].join(' ; '));
  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0, 500));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

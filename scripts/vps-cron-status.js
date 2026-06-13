const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn,
    'hermes cron list 2>&1 | head -60 ; echo "---GATEWAY---" ; XDG_RUNTIME_DIR=/run/user/0 systemctl --user is-active hermes-gateway'
  );
  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0, 300));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

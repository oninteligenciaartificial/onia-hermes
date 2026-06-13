const { connectSsh, exec } = require('./lib/ssh');

async function main() {
  const conn = await connectSsh();
  const r = await exec(conn, [
    // Get Telegram chat IDs
    "grep -E '^TELEGRAM_ALLOWED_USERS=|^TELEGRAM_HOME_CHANNEL=|^TELEGRAM_CRON_THREAD_ID=' /root/.hermes/.env 2>/dev/null",
    // Service status
    "systemctl --user is-active hermes-gateway 2>&1",
    "systemctl --user is-enabled hermes-gateway 2>&1",
    // Docker
    "docker ps --format '{{.Names}} | {{.Status}}' 2>&1",
    // n8n API key
    "cat /root/.n8n/config 2>/dev/null | python3 -c \"import sys,json; c=json.load(sys.stdin); k=c.get('nodes',{}).get('auth',{}).get('apiKey','NOT_SET'); print('N8N_API_KEY: SET (len='+str(len(str(k)))+')' if k != 'NOT_SET' else 'N8N_API_KEY: NOT_SET')\" 2>/dev/null || echo 'n8n config not readable as json'",
    // Hermes crons
    "hermes cron list 2>/dev/null | head -20 || echo 'hermes cron list failed'"
  ].join(' ; echo "---" ; '));
  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0, 500));
  conn.end();
}

main().catch(e => { console.error('SSH error:', e.message); });

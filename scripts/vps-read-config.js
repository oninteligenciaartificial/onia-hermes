// Read Hermes config and credentials from VPS
const { connectSsh, exec } = require('./lib/ssh');

async function main() {
  console.log('Connecting to VPS...');
  const conn = await connectSsh();
  console.log('Connected.\n');

  async function run(cmd, label) {
    const r = await exec(conn, cmd);
    console.log(`=== ${label} ===`);
    console.log(r.stdout || r.stderr || '(empty)');
  }

  // Hermes config (mask sensitive values)
  await run(
    `cat /root/.hermes/config.yaml 2>/dev/null | sed 's/\\(token\\|key\\|secret\\|password\\|api_key\\|bot_token\\)[^:]*:\\s*.*/\\1: [REDACTED]/gi'`,
    'Hermes config.yaml (masked)'
  );

  // Hermes .env (mask values)
  await run(
    `cat /root/.hermes/.env 2>/dev/null | sed 's/=.*/=[REDACTED]/'`,
    'Hermes .env (keys only)'
  );

  // Hermes env keys (just names, no values)
  await run(
    `cat /root/.hermes/.env 2>/dev/null | grep -v '^#' | cut -d= -f1`,
    'Hermes .env variable names'
  );

  // Telegram bot status + chat ID from logs
  await run(
    `journalctl --user -u hermes-gateway -n 50 --no-pager 2>/dev/null | grep -i 'chat\\|telegram\\|from\\|user_id' | tail -20`,
    'Hermes gateway logs — Telegram mentions'
  );

  // Check what n8n env vars exist
  await run(
    `cat /root/.n8n/.env 2>/dev/null | cut -d= -f1 || env | grep -i n8n | cut -d= -f1`,
    'n8n env variable names'
  );

  // List Hermes services running
  await run(
    `systemctl list-units --type=service --state=running 2>/dev/null | grep -i 'hermes\\|n8n\\|chatwoot\\|telegram' || ps aux | grep -i 'hermes\\|n8n\\|chatwoot' | grep -v grep | head -10`,
    'Hermes/n8n services running'
  );

  // Check Higgsfield token path
  await run(
    `find /root -name '.higgsfield*' -o -name 'higgsfield*' 2>/dev/null | head -10`,
    'Higgsfield token files'
  );

  // Instagram token file check
  await run(
    `find /root/.hermes /root -maxdepth 3 -name '*.env' -o -name 'instagram*' -o -name 'ig_*' 2>/dev/null | head -10`,
    'Instagram-related files'
  );

  conn.end();
  console.log('\nDone.');
}

main().catch(e => {
  console.error('SSH error:', e.message);
  process.exit(1);
});

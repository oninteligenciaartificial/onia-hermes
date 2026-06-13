// Check real service status + extract safe operational data from VPS
const { connectSsh, exec } = require('./lib/ssh');

async function main() {
  const conn = await connectSsh();

  async function run(cmd, label) {
    const r = await exec(conn, cmd);
    console.log(`\n=== ${label} ===`);
    console.log(r.stdout || r.stderr || '(empty)');
  }

  // Service status
  await run(`systemctl --user status hermes-gateway 2>&1 | head -15`, 'Hermes gateway service status');
  await run(`systemctl --user is-active hermes-gateway 2>&1`, 'Hermes gateway active?');
  await run(`systemctl --user list-units --type=service --state=running 2>&1 | head -20`, 'All user services running');

  // n8n status
  await run(`docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' 2>&1`, 'Docker containers');

  // Telegram credentials (only safe fields - no tokens)
  await run(`grep -E '^TELEGRAM_ALLOWED_USERS=|^TELEGRAM_HOME_CHANNEL=' /root/.hermes/.env 2>/dev/null`, 'Telegram Chat IDs (safe)');

  // Instagram credentials (just confirm they exist and have values)
  await run(`grep -E '^META_LONG_LIVED_TOKEN=|^IG_BUSINESS_ACCOUNT_ID=' /root/.hermes/.env | awk -F'=' '{print $1": SET (length="length($2)")"}'`, 'Instagram credentials status');

  // Hermes gateway config (bot token check)
  await run(`grep -E '^TELEGRAM_BOT_TOKEN=' /root/.hermes/.env | awk -F'=' '{print "TELEGRAM_BOT_TOKEN: SET (length="length($2)")"}'`, 'Telegram bot token status');

  // Check if Hermes gateway systemd service exists
  await run(`find /root/.config/systemd /etc/systemd -name '*hermes*' 2>/dev/null`, 'Hermes systemd service files');
  await run(`cat /root/.config/systemd/user/hermes-gateway.service 2>/dev/null || echo 'NOT FOUND'`, 'Hermes gateway service file');

  // n8n API key location
  await run(`find /root -name 'n8n*' -name '*.env' -o -name '.n8n*env' 2>/dev/null | head -5`, 'n8n env files');
  await run(`cat /root/.n8n/config 2>/dev/null | grep -i 'api\|key\|token' | head -10 || echo 'No n8n config found'`, 'n8n config');

  // Hermes cron jobs on VPS
  await run(`crontab -l 2>/dev/null | head -20 || echo 'No crontab'`, 'Crontab');
  await run(`cat /root/.hermes/crons.json 2>/dev/null | head -50 || ls /root/.hermes/crons* 2>/dev/null || echo 'No crons file'`, 'Hermes crons');

  conn.end();
}

main().catch(e => { console.error('SSH error:', e.message); process.exit(1); });

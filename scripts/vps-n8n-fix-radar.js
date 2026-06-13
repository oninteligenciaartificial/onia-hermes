// Export, patch telegramChatId, reimport Radar Diario workflow
const { connectSsh, exec } = require('./lib/ssh');

const WORKFLOW_ID = 'lryabRhGQW4WIuJG';
const CHAT_ID = '6830070978';

connectSsh().then(async conn => {
  const r = await exec(conn, [
    // Export workflow from n8n Docker container
    `docker exec n8n n8n export:workflow --id=${WORKFLOW_ID} --output=/tmp/radar_export.json 2>&1`,
    'echo "EXIT:$?"',
    // Check if export worked
    'test -f /tmp/radar_export.json && echo "EXPORT_OK" || echo "EXPORT_FAILED"',
    // Count occurrences of placeholder
    `grep -c "REPLACE_WITH_TELEGRAM_CHAT_ID" /tmp/radar_export.json 2>/dev/null || echo "0"`,
    // Patch the placeholder in-place
    `sed -i 's/REPLACE_WITH_TELEGRAM_CHAT_ID/${CHAT_ID}/g' /tmp/radar_export.json`,
    // Verify patch
    `grep -c "${CHAT_ID}" /tmp/radar_export.json`,
    `grep -c "REPLACE_WITH_TELEGRAM_CHAT_ID" /tmp/radar_export.json 2>/dev/null || echo "0 (none left)"`,
    // Reimport into n8n
    `docker exec n8n n8n import:workflow --input=/tmp/radar_export.json 2>&1`,
    'echo "DONE"'
  ].join(' ; echo "---" ; '));

  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0, 300));
  conn.end();
}).catch(e => console.error('SSH:', e.message));

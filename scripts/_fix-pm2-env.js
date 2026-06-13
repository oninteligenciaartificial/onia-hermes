'use strict';
/**
 * Fix PM2 env loading: delete + restart with bash wrapper that sources .env
 */
const { connectSsh, exec } = require('./lib/ssh');

const HERMES_VPS = '/root/hermes';
const ENV_FILE = '/root/.hermes/.env';

const PM2_CONFIG = `module.exports = {
  apps: [{
    name: 'hermes-propuestas',
    script: '/bin/bash',
    args: ['-c', 'set -a; source ${ENV_FILE}; set +a; exec node ${HERMES_VPS}/scripts/webhook-propuestas.js'],
    watch: false,
    autorestart: true,
    max_restarts: 10,
    log_file: '${HERMES_VPS}/logs/webhook-propuestas.log',
    error_file: '${HERMES_VPS}/logs/webhook-propuestas-error.log',
    time: true,
    env: {
      HERMES_DIR: '${HERMES_VPS}',
      PORT: '3031'
    }
  }]
};`;

(async () => {
  const conn = await connectSsh();
  const run = async (cmd, label) => {
    const r = await exec(conn, cmd);
    const out = (r.stdout + r.stderr).trim();
    console.log(`✓ ${label}${out ? ': ' + out.slice(0, 200) : ''}`);
    return out;
  };

  // Write new PM2 config
  await run(
    `cat > ${HERMES_VPS}/pm2-webhook.config.js << 'HERMESEOF'\n${PM2_CONFIG}\nHERMESEOF`,
    'Actualizar PM2 config'
  );

  // Delete + fresh start so PM2 picks up the new config
  await run('pm2 delete hermes-propuestas 2>/dev/null || true', 'Eliminar proceso PM2 viejo');
  await run(`pm2 start ${HERMES_VPS}/pm2-webhook.config.js`, 'Iniciar con nueva config');
  await run('pm2 save', 'Guardar PM2');

  await new Promise(r => setTimeout(r, 3000));

  const health = await run('curl -s http://127.0.0.1:3031/health', 'Health check');
  if (!health.includes('"ok":true')) {
    console.error('Health check falló');
    const logs = await run('pm2 logs hermes-propuestas --lines 20 --nostream 2>&1', 'Logs');
    console.log(logs);
  }

  const logs = await run('pm2 logs hermes-propuestas --lines 10 --nostream 2>&1', 'Startup logs');
  console.log(logs);

  conn.end();
})().catch(e => { console.error(e.message); process.exit(1); });

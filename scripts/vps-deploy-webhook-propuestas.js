/**
 * Deploy webhook-propuestas al VPS
 * Copia scripts, crea pm2-webhook.config.js, inicia servicio con PM2
 *
 * Uso: node scripts/vps-deploy-webhook-propuestas.js
 * Env: VPS_HOST, VPS_USER, VPS_PASSWORD o VPS_KEY_PATH
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { connectSsh, exec, uploadFile } = require('./lib/ssh');

const HERMES_VPS = '/root/hermes';
const SCRIPTS = [
  'scripts/webhook-propuestas.js',
  'scripts/genera-propuesta.js',
  'scripts/analiza-transcripcion.js',
];

const PM2_CONFIG = `module.exports = {
  apps: [{
    name: 'hermes-propuestas',
    script: '${HERMES_VPS}/scripts/webhook-propuestas.js',
    env_file: '/root/.hermes/.env',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    log_file: '/root/hermes/logs/webhook-propuestas.log',
    error_file: '/root/hermes/logs/webhook-propuestas-error.log',
    time: true,
    env: {
      HERMES_DIR: '${HERMES_VPS}',
      PORT: '3031'
    }
  }]
};`;

async function main() {
  console.log('Conectando al VPS...');
  const conn = await connectSsh();

  async function run(cmd, label) {
    const r = await exec(conn, cmd);
    const out = (r.stdout + r.stderr).trim();
    console.log(`✓ ${label}${out ? ': ' + out.slice(0, 120) : ''}`);
    return out;
  }

  // Crear directorios necesarios
  await run(`mkdir -p ${HERMES_VPS}/scripts ${HERMES_VPS}/hermes-content/propuestas ${HERMES_VPS}/logs`, 'Crear directorios');

  // Subir scripts
  for (const scriptPath of SCRIPTS) {
    const localPath = path.join(__dirname, '..', scriptPath);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  No encontrado localmente: ${localPath}`);
      continue;
    }
    const content = fs.readFileSync(localPath, 'utf8');
    const remotePath = `${HERMES_VPS}/${scriptPath}`;
    await run(`cat > "${remotePath}" << 'HERMESEOF'\n${content}\nHERMESEOF`, `Upload ${path.basename(scriptPath)}`);
    await run(`chmod +x "${remotePath}"`, `chmod ${path.basename(scriptPath)}`);
  }

  // Subir pm2 config
  await run(`cat > ${HERMES_VPS}/pm2-webhook.config.js << 'HERMESEOF'\n${PM2_CONFIG}\nHERMESEOF`, 'Upload PM2 config');

  // Verificar PM2 instalado
  const pm2Check = await run('pm2 --version 2>/dev/null || echo MISSING', 'Check PM2');
  if (pm2Check.includes('MISSING')) {
    await run('npm install -g pm2', 'Instalar PM2');
  }

  // Verificar OpenAI key en env
  const envCheck = await run('grep -c OPENAI_API_KEY /root/.hermes/.env 2>/dev/null || echo 0', 'Check OPENAI_API_KEY');
  if (envCheck.trim() === '0') {
    console.warn('\n⚠️  OPENAI_API_KEY no encontrada en /root/.hermes/.env');
    console.warn('   Agregar antes de iniciar: echo "OPENAI_API_KEY=sk-..." >> /root/.hermes/.env');
  }

  // Iniciar o reiniciar servicio
  const pm2Status = await run(`pm2 list 2>/dev/null | grep hermes-propuestas | wc -l`, 'Check PM2 status');
  if (pm2Status.trim() !== '0') {
    await run(`pm2 restart hermes-propuestas`, 'Reiniciar hermes-propuestas');
  } else {
    await run(`pm2 start ${HERMES_VPS}/pm2-webhook.config.js`, 'Iniciar hermes-propuestas');
    await run('pm2 save', 'Guardar PM2');
  }

  // Health check
  await new Promise(r => setTimeout(r, 2000));
  const health = await run('curl -s http://127.0.0.1:3031/health', 'Health check');

  if (health.includes('"ok":true')) {
    console.log('\n✅ Webhook desplegado y funcionando en http://127.0.0.1:3031');
    console.log('   Próximo paso: importar n8n-pipeline-llamadas.json en n8n');
    console.log('   Ver: SETUP_PROPUESTAS_AUTOMATICAS.md — Paso 4');
  } else {
    console.warn('\n⚠️  Webhook iniciado pero health check falló');
    console.warn('   Ver logs: pm2 logs hermes-propuestas');
  }

  conn.end();
}

main().catch(err => {
  console.error('Error deploy:', err.message);
  process.exit(1);
});

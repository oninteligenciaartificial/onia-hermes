'use strict';
// Chequeo de conexión — SOLO LECTURA (no gasta, no publica). Confirma que el
// token + la cuenta publicitaria estén bien conectados. Lee secretos de ../.env
// (gitignoreado) y NUNCA imprime el token. Uso: node examples/verify-connection.js
const fs = require('node:fs');
const path = require('node:path');
const { resolveCredentials } = require('../src/config');

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.trim().startsWith('#')) continue;
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

(async () => {
  const env = loadEnv(path.join(__dirname, '..', '.env'));
  const c = resolveCredentials(env);
  if (!c.systemUserToken) { console.error('Falta META_SYSTEM_USER_TOKEN en .env'); process.exit(1); }
  if (!c.adAccountId) { console.error('Falta META_AD_ACCOUNT_ID en .env'); process.exit(1); }

  const url = `https://graph.facebook.com/${c.apiVersion}/${c.adAccountId}` +
    '?fields=name,currency,account_status,amount_spent,timezone_name';
  const res = await fetch(url, { headers: { Authorization: `Bearer ${c.systemUserToken}` } });
  const body = await res.json();

  if (!res.ok) {
    // Imprime el error de Meta SIN el token.
    console.error(`Meta API ${res.status}:`, JSON.stringify((body && body.error) || body));
    process.exit(1);
  }
  console.log('OK - token conectado a la cuenta publicitaria:');
  console.log('  name          :', body.name);
  console.log('  currency      :', body.currency);
  console.log('  timezone      :', body.timezone_name);
  console.log('  account_status:', body.account_status, '(1 = activa)');
  console.log('  amount_spent  :', body.amount_spent, '(minor units; deberia ser 0)');
})();

/**
 * Minimal .env loader (zero deps). Reads `<repo>/.env` and injects KEY=VALUE
 * pairs into process.env without overriding vars already set in the shell.
 * The .env file is gitignored — secrets never get committed.
 */
const fs = require('fs');
const path = require('path');

function loadEnv(file) {
  const envPath = file || path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(envPath)) return false;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
  return true;
}

module.exports = { loadEnv };

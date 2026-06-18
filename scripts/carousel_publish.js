#!/usr/bin/env node
/**
 * ONIA carousel publish-only: upload already-rendered PNG slides to the VPS
 * asset host and post them as an Instagram carousel via `ig-publish`, using the
 * caption from an existing brief. No generation step (no Python/OpenAI needed).
 *
 * Usage:
 *   node carousel_publish.js --brief <brief.json> --dir <out/slide-folder> [--account onia]
 *
 * Needs SSH env (VPS_HOST, VPS_USER, VPS_KEY_PATH|VPS_PASSWORD) and, on the VPS,
 * ig-publish configured for the account (see CAROUSEL_SYSTEM.md).
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const { buildCaption } = require('./carousel_pipeline');

function parseArgs(argv) {
  const a = { account: 'onia' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--brief') a.brief = argv[++i];
    else if (k === '--dir') a.dir = argv[++i];
    else if (k === '--account') a.account = argv[++i];
  }
  if (!a.brief) throw new Error('Missing --brief <file.json>');
  if (!a.dir) throw new Error('Missing --dir <slide folder>');
  return a;
}

function slidePngs(dir) {
  const files = fs.readdirSync(dir)
    .filter((f) => /^slide-\d+\.png$/i.test(f))
    .sort();
  if (!files.length) throw new Error('No slide-NN.png files in ' + dir);
  return files.map((f) => path.join(dir, f));
}

async function uploadSlides(slides) {
  const { connectSsh, exec, sftp, putFile, requireEnv } = require('./lib/ssh');
  const remoteDir = process.env.HERMES_ASSETS_REMOTE_DIR || '/var/www/html/hermes-assets';
  const port = process.env.HERMES_ASSETS_PORT || '8099';
  const baseUrl = (process.env.HERMES_ASSETS_BASE_URL || `http://${requireEnv('VPS_HOST')}:${port}`).replace(/\/$/, '');
  const conn = await connectSsh();
  const urls = [];
  try {
    await exec(conn, `bash -lc 'mkdir -p ${remoteDir}'`);
    const sftpClient = await sftp(conn);
    for (const local of slides) {
      const filename = `${Date.now()}-${path.basename(local)}`;
      await putFile(sftpClient, local, `${remoteDir}/${filename}`, 0o644);
      urls.push(`${baseUrl}/${encodeURIComponent(filename)}`);
    }
  } finally {
    conn.end();
  }
  return urls;
}

async function publishCarousel(account, urls, caption) {
  const { connectSsh, exec } = require('./lib/ssh');
  const conn = await connectSsh();
  try {
    const acc = account.toUpperCase();
    const envPrefix =
      `IG_BUSINESS_ACCOUNT_ID="${'${IG_BUSINESS_ACCOUNT_ID_' + acc + ':-$IG_BUSINESS_ACCOUNT_ID}'}" ` +
      `META_LONG_LIVED_TOKEN="${'${META_LONG_LIVED_TOKEN_' + acc + ':-$META_LONG_LIVED_TOKEN}'}"`;
    const safeCaption = caption.replace(/'/g, `'\\''`);
    const cmd =
      `bash -lc 'set -a; source /root/.hermes/.env; set +a; ${envPrefix} ` +
      `ig-publish carousel_publish --image-urls "${urls.join(',')}" --caption '\\''${safeCaption}'\\'''`;
    return await exec(conn, cmd);
  } finally {
    conn.end();
  }
}

async function main(argv) {
  const a = parseArgs(argv);
  const brief = JSON.parse(fs.readFileSync(a.brief, 'utf8'));
  const slides = slidePngs(a.dir);
  const caption = buildCaption(brief);
  const urls = await uploadSlides(slides);
  const out = await publishCarousel(a.account, urls, caption);
  console.log(JSON.stringify({
    ok: true, account: a.account, count: slides.length, urls,
    publishOutput: (out && out.stdout) ? out.stdout : out,
  }, null, 2));
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then((c) => process.exit(c))
    .catch((e) => { console.error(JSON.stringify({ ok: false, error: e.message })); process.exit(2); });
}

module.exports = { slidePngs };

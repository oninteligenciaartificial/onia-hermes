#!/usr/bin/env node
/**
 * ONIA carousel pipeline: generate -> render -> (upload -> publish).
 *
 * Safe by default: stops after rendering local PNGs unless --publish is passed.
 * Publishing uploads PNGs to the VPS asset host and runs `ig-publish
 * carousel_publish` on the VPS with account-scoped credentials.
 *
 * Usage:
 *   node carousel_pipeline.js --topic "..." --account onia [--slides 6]
 *        [--audience "..."] [--references "url1,url2"] [--bg path.jpg] [--publish]
 *
 * Generation needs OPENAI_API_KEY locally.
 * Publishing needs SSH env (VPS_HOST, VPS_USER, VPS_KEY_PATH|VPS_PASSWORD) and,
 * on the VPS, ig-publish configured for the account (see CAROUSEL_SYSTEM.md).
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
require('./lib/env').loadEnv();

const DIR = __dirname;
const ROOT = path.join(DIR, '..');
const BRIEFS = path.join(ROOT, 'hermes-content', 'carousels', 'briefs');
const OUTROOT = path.join(ROOT, 'hermes-content', 'carousels', 'out');
const ACCOUNTS = ['onia', 'arthur', 'sergio', 'nuvia'];

function parseArgs(argv) {
  const a = { account: 'onia', slides: '6', audience: '', references: '', bg: '', pack: 'community-editorial', object: '', publish: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--topic') a.topic = argv[++i];
    else if (k === '--account') a.account = argv[++i];
    else if (k === '--slides') a.slides = argv[++i];
    else if (k === '--audience') a.audience = argv[++i];
    else if (k === '--references') a.references = argv[++i];
    else if (k === '--bg') a.bg = argv[++i];
    else if (k === '--pack') a.pack = argv[++i];
    else if (k === '--object') a.object = argv[++i];
    else if (k === '--publish') a.publish = true;
  }
  if (!a.topic) throw new Error('Missing --topic');
  if (!ACCOUNTS.includes(a.account)) throw new Error('Unknown --account: ' + a.account);
  return a;
}

function pyBin() {
  return process.platform === 'win32' ? 'python' : 'python3';
}

// 1. Generate brief with the Python generator (encodes the 5 rules).
function generateBrief(a) {
  const args = [
    path.join(DIR, 'carousel_generator.py'),
    '--topic', a.topic,
    '--slides', String(a.slides),
    '--account', a.account,
  ];
  if (a.audience) args.push('--audience', a.audience);
  if (a.references) args.push('--references', a.references);
  const out = execFileSync(pyBin(), args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  const brief = JSON.parse(out);
  fs.mkdirSync(BRIEFS, { recursive: true });
  const slug = a.topic.toLowerCase().normalize('NFKD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '');
  const briefPath = path.join(BRIEFS, `${a.account}-${slug}-${stamp}.json`);
  fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2), 'utf8');
  return { brief, briefPath, slug, stamp };
}

// 2. Render PNG slides.
function renderSlides(a, briefPath, slug, stamp) {
  const outDir = path.join(OUTROOT, `${a.account}-${slug}-${stamp}`);
  const args = ['--brief', briefPath, '--out', outDir, '--account', a.account, '--pack', a.pack];
  if (a.bg) args.push('--bg', path.resolve(a.bg));
  if (a.object) args.push('--object', path.resolve(a.object));
  const res = execFileSync('node', [path.join(DIR, 'carousel_render.js'), ...args], {
    encoding: 'utf8',
  });
  return { outDir, slides: JSON.parse(res).slides };
}

// 3. Upload PNGs to VPS asset host, return public URLs (only when publishing).
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

// 4. Publish carousel on the VPS via ig-publish (account-scoped env).
async function publishCarousel(account, urls, caption) {
  const { connectSsh, exec } = require('./lib/ssh');
  const conn = await connectSsh();
  try {
    // Account-scoped credentials: IG_BUSINESS_ACCOUNT_ID_<ACC> / META_LONG_LIVED_TOKEN_<ACC>
    // fall back to default ig-publish env (ONIA) when the suffixed vars are absent.
    const acc = account.toUpperCase();
    const envPrefix =
      `IG_BUSINESS_ACCOUNT_ID="${'${IG_BUSINESS_ACCOUNT_ID_' + acc + ':-$IG_BUSINESS_ACCOUNT_ID}'}" ` +
      `META_LONG_LIVED_TOKEN="${'${META_LONG_LIVED_TOKEN_' + acc + ':-$META_LONG_LIVED_TOKEN}'}"`;
    const safeCaption = caption.replace(/'/g, `'\\''`);
    const cmd =
      `bash -lc 'set -a; source /root/.hermes/.env; set +a; ${envPrefix} ` +
      `ig-publish carousel_publish --image-urls "${urls.join(',')}" --caption '\\''${safeCaption}'\\'''`;
    const res = await exec(conn, cmd);
    return res;
  } finally {
    conn.end();
  }
}

function buildCaption(brief) {
  const tags = (brief.hashtags || []).join(' ');
  const trigger = brief.comment_trigger ? `\n\n💬 ${brief.comment_trigger}` : '';
  return `${brief.caption || brief.title}${trigger}\n\n${tags}`.trim();
}

async function main(argv) {
  const a = parseArgs(argv);
  const { brief, briefPath, slug, stamp } = generateBrief(a);
  const { outDir, slides } = renderSlides(a, briefPath, slug, stamp);
  const caption = buildCaption(brief);

  const result = {
    ok: true,
    account: a.account,
    title: brief.title,
    brief: briefPath,
    outDir,
    slides,
    caption,
    published: false,
  };

  if (!a.publish) {
    result.hint = `Review slides in ${outDir}. Re-run with --publish to upload + post.`;
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  const urls = await uploadSlides(slides);
  result.urls = urls;
  const publishOut = await publishCarousel(a.account, urls, caption);
  result.published = true;
  result.publishOutput = publishOut;
  console.log(JSON.stringify(result, null, 2));
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(JSON.stringify({ ok: false, error: e.message }));
      process.exit(2);
    });
}

module.exports = { buildCaption, parseArgs };

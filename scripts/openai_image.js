#!/usr/bin/env node
/**
 * OpenAI image generator (gpt-image-1) — Node only, no Python.
 * Generates PNGs for carousels (objects, scenes, backgrounds) using the
 * OPENAI_API_KEY from the shell or from <repo>/.env (loaded automatically).
 *
 * Usage:
 *   node openai_image.js --prompt "..." --out path.png [--size 1024x1024]
 *        [--quality high|medium|low] [--transparent] [--n 1]
 *
 * Sizes: 1024x1024 | 1024x1536 (portrait) | 1536x1024 (landscape).
 * --transparent sets a transparent background (PNG alpha).
 *
 * Node >= 18 (global fetch). Costs OpenAI credits (your key).
 */
const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./lib/env');

loadEnv();

function parseArgs(argv) {
  const a = { size: '1024x1024', quality: 'high', n: '1', transparent: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--prompt') a.prompt = argv[++i];
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--size') a.size = argv[++i];
    else if (k === '--quality') a.quality = argv[++i];
    else if (k === '--n') a.n = argv[++i];
    else if (k === '--transparent') a.transparent = true;
  }
  if (!a.prompt) throw new Error('Missing --prompt');
  if (!a.out) throw new Error('Missing --out <path.png>');
  return a;
}

async function main(argv) {
  const a = parseArgs(argv);
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY not set. Add it to ' +
      path.join(__dirname, '..', '.env') + ' as OPENAI_API_KEY=sk-...');
  }
  const body = {
    model: 'gpt-image-1',
    prompt: a.prompt,
    size: a.size,
    quality: a.quality,
    n: Number(a.n),
  };
  if (a.transparent) body.background = 'transparent';

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${errText}`);
  }
  const json = await res.json();
  const items = json.data || [];
  if (!items.length) throw new Error('No image returned: ' + JSON.stringify(json).slice(0, 300));

  const outAbs = path.resolve(a.out);
  const dir = path.dirname(outAbs);
  fs.mkdirSync(dir, { recursive: true });
  const saved = [];
  items.forEach((it, idx) => {
    const buf = Buffer.from(it.b64_json, 'base64');
    const target = items.length > 1
      ? outAbs.replace(/\.png$/i, `-${idx + 1}.png`)
      : outAbs;
    fs.writeFileSync(target, buf);
    saved.push(target);
  });
  console.log(JSON.stringify({ ok: true, saved, usage: json.usage || null }, null, 2));
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then((c) => process.exit(c))
    .catch((e) => { console.error(JSON.stringify({ ok: false, error: e.message })); process.exit(2); });
}

module.exports = { parseArgs };

#!/usr/bin/env node
// Carousel images with Higgsfield — the Santiago Muñoz method, adapted to ONIA:
// the AI paints ONLY the image (fixed style block, no letters); the text goes on
// top by code (carousel_render.js), because image models misspell.
//
// Every slide with `image_prompt` gets one image. Cost is quoted first (free);
// nothing is generated without --yes (paid: needs an approved batch, CLAUDE.md).
//
//   node scripts/carousel_images.mjs --brief b.json --out dir          # quote only
//   node scripts/carousel_images.mjs --brief b.json --out dir --yes    # generate
//   HF_CMD="ssh -i ~/.ssh/key root@host higgsfield" node scripts/...   # remote CLI
//   node scripts/carousel_images.mjs --selftest
//
// Writes <out>/assets/slide-NN.png, <out>/brief.json (slide.bg set) and
// <out>/assets/manifest.json (prompt, model, cost, job url) for the batch log.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { parseArgs } from 'node:util';

// Never name the destination ("Instagram", "carousel") nor a place, and never pick objects
// that carry print (mugs, notebooks, screens): Soul 2.0 then invents captions and labels, and
// a long "no text, no letters" list does not stop it (both seen 29-sep). Describe positively.
const STYLE = 'Editorial still-life photograph, 35mm lens, warm natural window light, ' +
  'ivory and charcoal tones with one small muted deep-green detail, shallow depth of field, real materials. ';
const NO_TEXT = ' Minimal composition of plain natural materials, completely unbranded, calm empty surroundings.';

const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const parseCost = (out) => Number((out.match(/([\d.]+)\s*credits?/i) || [])[1]);

function hf(args) {
  const opts = { encoding: 'utf8', maxBuffer: 1 << 24 };
  const [bin, ...pre] = (process.env.HF_CMD || 'higgsfield').split(' ');
  if (!pre.length) return execFileSync(bin, args, opts);
  // ssh joins the trailing args into ONE remote shell line: quote each arg ourselves
  const last = pre.pop();
  return execFileSync(bin, [...pre, [last, ...args.map(sq)].join(' ')], opts);
}

function main() {
  const { values: a } = parseArgs({ options: {
    brief: { type: 'string' }, out: { type: 'string' }, model: { type: 'string' },
    yes: { type: 'boolean' }, selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  const brief = JSON.parse(fs.readFileSync(a.brief, 'utf8'));
  const model = a.model || 'text2image_soul_v2';
  const assets = path.join(a.out, 'assets');
  fs.mkdirSync(assets, { recursive: true });
  const todo = brief.slides.filter((s) => s.image_prompt);
  const manifest = [];
  let total = 0;
  for (const s of todo) {
    const prompt = STYLE + s.image_prompt + NO_TEXT;
    const params = ['--prompt', prompt, '--aspect_ratio', '3:4', '--quality', '2k'];
    const cost = parseCost(hf(['generate', 'cost', model, ...params]));
    total += cost;
    const entry = { slide: s.number, model, prompt, cost };
    if (a.yes) {
      const res = JSON.parse(hf(['generate', 'create', model, ...params, '--wait', '--json']));
      const job = Array.isArray(res) ? res[0] : res;
      const url = job.result_url || (job.results && job.results[0] && job.results[0].url);
      if (!url) throw new Error(`slide ${s.number}: no result_url in ${JSON.stringify(job).slice(0, 300)}`);
      const file = path.join(assets, `slide-${String(s.number).padStart(2, '0')}.png`);
      execFileSync('curl', ['-sfL', '-o', file, url]); // images are >1 MB: never through stdout
      s.bg = path.relative(process.cwd(), file).replace(/\\/g, '/');
      Object.assign(entry, { job: job.id, url, file: s.bg });
    }
    manifest.push(entry);
    console.log(`slide ${s.number}: ${cost} cr${entry.file ? ' -> ' + entry.file : ''}`);
  }
  console.log(`TOTAL ${todo.length} images, ${total.toFixed(2)} credits${a.yes ? ' (generated)' : ' (quote only, add --yes)'}`);
  if (a.yes) {
    fs.writeFileSync(path.join(a.out, 'brief.json'), JSON.stringify(brief, null, 2));
    fs.writeFileSync(path.join(assets, 'manifest.json'), JSON.stringify({ date: new Date().toISOString(), total, manifest }, null, 2));
  }
}

function selftest() {
  assert.equal(parseCost('0.12 credits'), 0.12);
  assert.equal(parseCost('Estimated: 1.5 credits\n'), 1.5);
  assert.equal(sq("it's"), `'it'\\''s'`);
  console.log('selftest ok');
}

main();

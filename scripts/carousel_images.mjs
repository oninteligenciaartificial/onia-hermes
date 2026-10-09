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
import { fileURLToPath } from 'node:url';

// Never name the destination ("Instagram", "carousel") nor a place, and never pick objects
// that carry print (mugs, notebooks, screens): Soul 2.0 then invents captions and labels, and
// a long "no text, no letters" list does not stop it (both seen 29-sep). Describe positively.
// One block per look. `foto` = cover photo; `acuarela` / `linea` / `clay` = illustration for pack
// referentes (Santiago-like, in ONIA green + white + black); `objeto` = product shot on white.
const GALERIA_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = {
  foto: { dir: 'fotos', aspect: '3:4', pre: 'Editorial still-life photograph, 35mm lens, warm natural window light, ' +
    'ivory and charcoal tones with one small muted deep-green detail, shallow depth of field, real materials. ',
    post: ' Minimal composition of plain natural materials, completely unbranded, calm empty surroundings.' },
  // Paleta de Sergio Urcullo (29-sep): verde ONIA + blanco + negro. Sin hex en el prompt: se imprime.
  // «on white paper» hace que Soul 2.0 FOTOGRAFÍE un papel (bordes oscuros, mesa) y firme la obra:
  // se pide ilustración digital, a sangre, sin firma (visto 29-sep).
  acuarela: { dir: 'ilustraciones', aspect: '4:3', pre: 'Unsigned digital illustration in a hand-drawn watercolor and black ink style, filling the frame edge to edge on a plain white background, ' +
    'loose confident lines, washes of vivid emerald green and black only, a few doodled arrows and small sparkles, ' +
    'charming and simple, one clear subject centered with generous white space around it. ',
    post: ' Pure drawing, completely unbranded, nothing printed or written anywhere, clean white background.' },
  linea: { dir: 'ilustraciones', aspect: '4:3', pre: 'Unsigned minimal digital line illustration, black ink strokes filling the frame edge to edge on a plain white background, ' +
    'one single element filled with flat vivid emerald green, lots of white space, editorial and elegant. ',
    post: ' Pure drawing, completely unbranded, nothing printed or written anywhere, clean white background.' },
  clay: { dir: 'ilustraciones', aspect: '4:3', pre: 'Soft 3D clay render, rounded toy-like shapes in vivid emerald green, white and matte black, ' +
    'on a pure white seamless background, soft studio light, gentle shadows, one clear subject centered. ',
    post: ' Completely unbranded, nothing printed or written anywhere, clean white background.' },
  // fotobn: estilo de la marca personal elegido por Sergio Urcullo el 8-oct-2026 (opción 9 de la lámina de estilos).
  // Va con --model gpt_image_2_5 y params [--quality medium --resolution 2k]: Soul 2.0 inventa letras.
  fotobn: { dir: 'fotos-bn', aspect: '16:9', pre: 'Black and white editorial photograph, soft natural light, real materials, ' +
    'clean uncluttered composition on a light grey seamless background, ',
    post: ' Everything is black and white except that one object, which is vivid emerald green. No letters, no numbers, ' +
      'no logos, no watermark, no interface, no people.' },
  // libre: el prompt trae el estilo entero (para comparar estilos antes de fijar uno).
  libre: { dir: 'estilos', aspect: '16:9', pre: '', post: ' No letters, no numbers, no logos, no watermark, no interface.' },
  objeto: { dir: 'objetos', aspect: '16:9', pre: 'Clean commercial product photograph on a seamless pure white background, soft ' +
    'studio light, gentle realistic shadows, objects arranged in a neat horizontal row, sharp focus. ',
    post: ' Plain unbranded objects, nothing printed on them, empty white background.' },
};

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
  fs.mkdirSync(a.out, { recursive: true });
  const todo = brief.slides.filter((s) => s.image_prompt);
  const slug = path.basename(a.out);
  let total = 0;
  for (const s of todo) {
    const styleName = s.image_style || brief.image_style || 'foto';
    const st = STYLES[styleName];
    if (!st) throw new Error(`image_style desconocido: ${styleName}`);
    const prompt = st.pre + s.image_prompt + st.post;
    const params = ['--prompt', prompt, '--aspect_ratio', s.aspect || st.aspect, ...(brief.params || ['--quality', '2k'])]; // params: otro modelo (gpt_image_2_5: --quality medium --resolution 2k) // aspect por lámina: miniatura 16:9, corte 9:16
    const cost = parseCost(hf(['generate', 'cost', model, ...params]));
    total += cost;
    let file = '';
    if (a.yes) {
      const res = JSON.parse(hf(['generate', 'create', model, ...params, '--wait', '--json']));
      const job = Array.isArray(res) ? res[0] : res;
      const url = job.result_url || (job.results && job.results[0] && job.results[0].url);
      if (!url) throw new Error(`slide ${s.number}: no result_url in ${JSON.stringify(job).slice(0, 300)}`);
      file = saveToGallery({ url, dir: st.dir, name: `${slug}-s${String(s.number).padStart(2, '0')}-${String(job.id).slice(0, 8)}`,
        entry: { tipo: st.dir, fuente: 'higgsfield', licencia: 'generada (plan Higgsfield)', modelo: model, prompt: s.image_prompt,
          estilo: styleName, costo_cr: cost, job: job.id, usado_en: [slug], tags: s.tags || [] } });
      // pack referentes reads slide.image; community-editorial reads slide.bg
      s[s.layout ? 'image' : 'bg'] = file;
    }
    console.log(`slide ${s.number}: ${cost} cr${file ? ' -> ' + file : ''}`);
  }
  console.log(`TOTAL ${todo.length} images, ${total.toFixed(2)} credits${a.yes ? ' (generated)' : ' (quote only, add --yes)'}`);
  if (a.yes) fs.writeFileSync(path.join(a.out, 'brief.json'), JSON.stringify(brief, null, 2));
}

// Every generated image lands in the ONE reusable gallery (hermes-content/galeria), as a
// JPEG (a 2k PNG from Higgsfield weighs ~5 MB) and with a manifest row: source, license,
// prompt, cost. Before generating something new, search galeria.json.
export function saveToGallery({ url, src, dir, name, entry }) {
  const rel = `hermes-content/galeria/${dir}/${name}.jpg`;
  const abs = path.join(GALERIA_ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  let input = src;
  if (url) {
    input = abs.replace(/\.jpg$/, '.tmp');
    execFileSync('curl', ['-sfL', '-o', input, url]); // images are >1 MB: never through stdout
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, '-vf', "scale='min(2048,iw)':-2", '-q:v', '3', abs]);
  if (url) fs.rmSync(input);
  const mf = path.join(GALERIA_ROOT, 'hermes-content/galeria/galeria.json');
  const rows = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : [];
  rows.push({ id: name, file: rel, fecha: new Date().toISOString().slice(0, 10), ...entry });
  fs.writeFileSync(mf, `${JSON.stringify(rows, null, 2)}\n`);
  return rel;
}

function selftest() {
  assert.equal(parseCost('0.12 credits'), 0.12);
  assert.equal(parseCost('Estimated: 1.5 credits\n'), 1.5);
  assert.equal(sq("it's"), `'it'\\''s'`);
  console.log('selftest ok');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();

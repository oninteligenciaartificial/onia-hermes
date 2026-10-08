#!/usr/bin/env node
// Arma una HISTORIA de Instagram (1080x1920) con una foto de Sergio Urcullo y un texto de marca encima.
//   node scripts/marca-personal/historia-foto.mjs --foto foto.jpg --titulo "Hoy: *Haiku 5.5* cuesta 10 veces menos" \
//        --etiqueta "HOY · 10 OCT" [--pie "Link en mi perfil"] --out historia.png
// *palabra* en el título va en verde ONIA. El texto queda dentro de la banda segura de Instagram: la interfaz tapa los
// primeros 230 px y los últimos 422 (medido, ver chequear-banda-segura-historias.py).
// Fuentes: las de la marca, en hermes-content/brand/fonts. Renderiza con el Chrome/Chromium headless que haya.
// Después: ig-historia.mjs en el VPS la publica (la API no admite stickers: el link sticker lo pone Sergio a mano).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FUENTES = path.join(REPO, 'hermes-content/brand/fonts');
export const SAFE_TOP = 230;
export const SAFE_BOT = 422;

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function tituloHtml(t) {
  const partes = esc(t).split(/\*([^*]+)\*/);
  return partes.map((p, i) => (i % 2 ? `<em>${p}</em>` : p)).join('');
}

export function historiaHtml({ foto, titulo, etiqueta, pie }) {
  const url = (f) => pathToFileURL(f).href;
  return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(${url(path.join(FUENTES, 'BricolageGrotesque-Bold.ttf'))})}
@font-face{font-family:D;src:url(${url(path.join(FUENTES, 'DMSans-var-latin.woff2'))});font-weight:100 1000}
@font-face{font-family:M;src:url(${url(path.join(FUENTES, 'SplineSansMono-var-latin.woff2'))});font-weight:100 1000}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#0A0F0D}
.foto{position:absolute;inset:0;background:url(${url(foto)}) center/cover no-repeat}
.vel{position:absolute;inset:0;background:
 linear-gradient(180deg,rgba(10,15,13,.82) 0%,rgba(10,15,13,.55) 24%,rgba(10,15,13,0) 46%),
 linear-gradient(0deg,rgba(10,15,13,.7) 0%,rgba(10,15,13,0) 24%)}
.caja{position:absolute;left:72px;right:72px;top:${SAFE_TOP + 40}px}
.tag{font:600 32px/1 M,monospace;letter-spacing:.14em;color:#10C26B;text-transform:uppercase}
h1{margin:26px 0 0;font:700 96px/1.04 B,sans-serif;color:#fff;letter-spacing:-.01em;text-wrap:balance}
h1 em{font-style:normal;color:#10C26B}
.pie{position:absolute;left:72px;bottom:${SAFE_BOT + 40}px;background:#fff;color:#0A0F0D;border-radius:999px;
 padding:22px 40px;font:700 36px/1 D,sans-serif}
</style>
<div class="foto"></div><div class="vel"></div>
<div class="caja">${etiqueta ? `<div class="tag">${esc(etiqueta)}</div>` : ''}<h1>${tituloHtml(titulo)}</h1></div>
${pie ? `<div class="pie">${esc(pie)}</div>` : ''}`;
}

function chrome() {
  let pw = [];
  try {
    pw = fs.readdirSync('/opt/pw-browsers', { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith('chromium')).map((d) => `/opt/pw-browsers/${d.name}/chrome-linux/chrome`);
  } catch { /* sin Playwright en esta máquina */ }
  const c = [process.env.CHROME_BIN, process.env.CAROUSEL_BROWSER, ...pw, 'C:/Program Files/Google/Chrome/Application/chrome.exe'];
  const hit = c.find((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
  if (!hit) throw new Error('no encontré Chrome/Chromium (seteá CHROME_BIN)');
  return hit;
}

function main() {
  const { values: a } = parseArgs({ options: { foto: { type: 'string' }, titulo: { type: 'string' }, etiqueta: { type: 'string' },
    pie: { type: 'string' }, out: { type: 'string' }, selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  if (!a.foto || !a.titulo || !a.out) throw new Error('faltan --foto, --titulo y --out');
  if (!fs.existsSync(a.foto)) throw new Error(`no existe la foto: ${a.foto}`);
  if (a.titulo.length > 70) throw new Error('el título entra en 3 renglones: máximo 70 caracteres');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'historia-'));
  const html = path.join(dir, 'h.html');
  fs.writeFileSync(html, historiaHtml({ foto: path.resolve(a.foto), titulo: a.titulo, etiqueta: a.etiqueta, pie: a.pie }));
  // Chrome headless resta ~90 px de la ventana al captura: se renderiza más alto y se corta a 1080x1920 (medido 8-oct).
  const crudo = path.join(dir, 'crudo.png');
  execFileSync(chrome(), ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1080,2100', '--virtual-time-budget=4000', `--screenshot=${crudo}`, pathToFileURL(html).href],
  { stdio: 'ignore' });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', crudo, '-vf', 'crop=1080:1920:0:0', path.resolve(a.out)]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`historia lista: ${a.out}`);
}

function selftest() {
  assert.equal(tituloHtml('Hoy: *Haiku 5.5* & más'), 'Hoy: <em>Haiku 5.5</em> &amp; más');
  assert.ok(historiaHtml({ foto: '/tmp/f.jpg', titulo: 't', etiqueta: 'HOY', pie: 'Link' }).includes('class="pie"'));
  assert.ok(!historiaHtml({ foto: '/tmp/f.jpg', titulo: 't' }).includes('class="pie"'));
  console.log('selftest ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error('ERROR', e.message); process.exit(1); }
}

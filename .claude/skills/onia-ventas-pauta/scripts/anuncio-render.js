#!/usr/bin/env node
// Anuncio estático de Onia Platform (pauta de Meta), con la marca de la WEB, no la de la marca personal.
//
//   node .claude/skills/onia-ventas-pauta/scripts/anuncio-render.js --brief <brief.json> --out <dir> [--formato feed|story|todos]
//
// Sale <dir>/feed.png (1080×1350, 4:5) y <dir>/story.png (1080×1920, 9:16).
// Formato tomado de lo que corre en la Biblioteca de Anuncios (ONIA_ADQUISICION_Y_PAUTA.md §2.5):
// marca arriba, titular del dolor, una línea de mecanismo, la pantalla REAL en un marco de navegador con
// un recorte ampliado que se lee en el celular, tres beneficios y un solo botón.
// Marca: web-factory/docs/ONIA_BRAND_IDENTITY_2026.md (hoja clara, tinta, verde solo en lo que está
// encendido) + letra Archivo, la misma del sitio y del logo.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const REPO = path.resolve(__dirname, '../../../..');
const FMT = { feed: { w: 1080, h: 1350 }, story: { w: 1080, h: 1920 } };

function args() {
  const a = process.argv.slice(2);
  const o = { formato: 'todos' };
  for (let i = 0; i < a.length; i += 2) o[a[i].replace(/^--/, '')] = a[i + 1];
  if (!o.brief || !o.out) {
    console.error('Uso: anuncio-render.js --brief <brief.json> --out <dir> [--formato feed|story|todos]');
    process.exit(1);
  }
  return o;
}

// Ancho y alto de un PNG, leídos de la cabecera IHDR (sin dependencias).
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const abs = (p) => (path.isAbsolute(p) ? p : path.join(REPO, p));
const url = (p) => 'file://' + abs(p);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// *texto* = lo que Onia enciende (verde de acción). Nada más lleva color.
const marcar = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

// Un recorte de la captura real, escalado. Nunca se redibuja: son los mismos píxeles.
function recorte(z, anchoDestino) {
  const src = abs(z.src);
  const { w: iw } = pngSize(src);
  const [x, y, w, h] = z.crop;
  const k = anchoDestino / w;
  return `<div class="crop" style="width:${Math.round(w * k)}px;height:${Math.round(h * k)}px">` +
    `<img src="${url(src)}" style="width:${Math.round(iw * k)}px;left:${-Math.round(x * k)}px;top:${-Math.round(y * k)}px"></div>`;
}

function html(b, fmt) {
  const { w, h } = FMT[fmt];
  const L = b.layout?.[fmt] || {};
  const wa = fs.readFileSync(abs('hermes-content/references/brand-logos/whatsapp.svg'), 'utf8')
    .replace(/fill="[^"]*"/g, '').replace('<svg', '<svg class="wa" fill="currentColor"');
  const frameW = L.frameW || 936;
  const zooms = (b.proof.zooms || []).map((z, i) => {
    const zl = z[fmt] || {};
    const pos = Object.entries(zl.pos || {}).map(([k, v]) => `${k}:${v}px`).join(';');
    // box: ancho de la caja si tiene que ser mayor que el recorte (relleno blanco a la derecha,
    // para que la caja vecina la pise sin tapar texto ni dejar ver una franja de la pantalla de abajo).
    const box = zl.box ? `width:${zl.box}px;` : '';
    return `<div class="zoom" style="${box}${pos}">${recorte(z, zl.width || 760)}</div>`;
  }).join('');
  const checks = (b.checks || []).map((c) => `<li><span class="tick"></span>${marcar(c)}</li>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url(${url('.claude/skills/onia-ventas-pauta/scripts/fonts/archivo-latin.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Archivo;src:url(${url('.claude/skills/onia-ventas-pauta/scripts/fonts/archivo-latin-ext.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+20A0-20AB,U+20AD-20C0}
:root{--hoja:#F4F6F4;--tinta:#12100E;--tinta-2:#4E5651;--accion:#027650;--borde:#C5CEC9;--sheet:#FCFDFC}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${w}px;height:${h}px;background:var(--hoja);font-family:Archivo,sans-serif;color:var(--tinta);font-stretch:100%;-webkit-font-smoothing:antialiased}
.ad{position:relative;width:${w}px;height:${h}px;padding:${L.pad || '64px 72px 64px'};display:flex;flex-direction:column}
.ad>*{flex-shrink:0}
.lockup{height:${L.logo || 52}px;width:auto;display:block;align-self:flex-start}
.kicker{margin-top:${L.kickerTop || 44}px;font-size:${L.kicker || 30}px;font-weight:500;color:var(--tinta-2);letter-spacing:0}
h1{margin-top:12px;font-size:${L.h1 || 84}px;line-height:1.02;font-weight:620;font-stretch:96%;letter-spacing:-0.022em;text-wrap:balance;max-width:${L.h1Max || 936}px}
.sub{margin-top:${L.subTop || 24}px;font-size:${L.sub || 34}px;line-height:1.28;font-weight:420;color:var(--tinta-2);max-width:${L.subMax || 900}px;text-wrap:pretty}
em{font-style:normal;color:var(--accion);font-weight:600}
.proof{position:relative;margin-top:${L.proofTop || 40}px;width:${frameW}px;padding-bottom:${L.overhang ?? 56}px}
.browser{position:relative;width:${frameW}px;border:1px solid var(--borde);border-radius:14px;overflow:hidden;background:var(--sheet)}
.bar{height:44px;display:flex;align-items:center;gap:10px;padding:0 18px;border-bottom:1px solid var(--borde);background:#EEF2F0}
.bar i{width:12px;height:12px;border-radius:50%;background:#C5CEC9;display:block}
.bar .url{margin-left:14px;flex:1;height:28px;border-radius:999px;background:var(--sheet);border:1px solid var(--borde);font-size:17px;line-height:26px;color:var(--tinta-2);padding:0 16px;font-weight:450}
.crop{position:relative;overflow:hidden}
.crop img{position:absolute;max-width:none;display:block}
.zoom{position:absolute;background:#FCFDFC;border:1px solid var(--borde);border-radius:14px;overflow:hidden;box-shadow:0 6px 8px rgba(1,57,37,.10)}
.checks{list-style:none;margin-top:${L.checksTop || 40}px;display:${L.checksCol ? 'flex' : 'grid'};${L.checksCol ? 'flex-direction:column;gap:18px' : 'grid-template-columns:repeat(3,1fr);gap:24px'}}
.checks li{display:flex;align-items:${L.checksCol ? 'center' : 'flex-start'};gap:14px;font-size:${L.check || 28}px;line-height:1.2;font-weight:520}
.tick{flex:none;width:${L.tick || 34}px;height:${L.tick || 34}px;border-radius:50%;background:var(--accion);position:relative;margin-top:${L.checksCol ? 0 : 2}px}
.tick:after{content:"";position:absolute;left:32%;top:20%;width:24%;height:44%;border:solid #fff;border-width:0 4px 4px 0;transform:rotate(45deg)}
.cta{margin-top:auto;display:flex;align-items:center;gap:28px}
.btn{flex:none;display:inline-flex;align-items:center;gap:16px;background:var(--accion);color:#fff;border-radius:999px;padding:22px 40px;font-size:${L.btn || 32}px;font-weight:600;letter-spacing:-0.005em}
.btn .wa{width:${(L.btn || 32) + 6}px;height:${(L.btn || 32) + 6}px}
.nota{font-size:${L.nota || 24}px;line-height:1.25;color:var(--tinta-2);font-weight:450;max-width:${L.notaMax || 320}px}
</style></head><body><div class="ad fmt-${fmt}">
<img class="lockup" src="${url(b.marca || 'web-factory/apps/onia-platform/public/brand/v2/hires/onia-lockup-dental@4000.png')}" alt="onia dental">
${b.kicker ? `<p class="kicker">${marcar(b.kicker)}</p>` : ''}
<h1>${marcar(b.headline)}</h1>
${b.sub ? `<p class="sub">${marcar(b.sub)}</p>` : ''}
<figure class="proof">
  <div class="browser"><div class="bar"><i></i><i></i><i></i><span class="url">${esc(b.proof.url || 'app.onia.com.bo')}</span></div>${recorte(b.proof.frame, frameW - 2)}</div>
  ${zooms}
</figure>
${checks ? `<ul class="checks">${checks}</ul>` : ''}
<div class="cta"><span class="btn">${wa}${esc(b.cta)}</span>${b.nota ? `<span class="nota">${marcar(b.nota)}</span>` : ''}</div>
</div></body></html>`;
}

(async () => {
  const o = args();
  const b = JSON.parse(fs.readFileSync(o.brief, 'utf8'));
  const fmts = o.formato === 'todos' ? Object.keys(FMT) : [o.formato];
  fs.mkdirSync(o.out, { recursive: true });
  const exe = process.env.CHROMIUM_PATH || fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d))
    .map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)[0];
  const br = await chromium.launch({ executablePath: exe });
  for (const f of fmts) {
    const { w, h } = FMT[f];
    const p = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const file = path.join(o.out, `_${f}.html`);
    fs.writeFileSync(file, html(b, f));
    await p.goto('file://' + path.resolve(file));
    await p.evaluate(() => document.fonts.ready);
    // Control: si algo se sale del lienzo, se avisa (un anuncio cortado no se publica).
    const fuera = await p.evaluate(() => {
      const ad = document.querySelector('.ad');
      const pb = parseFloat(getComputedStyle(ad).paddingBottom);
      const out = [...ad.children].filter((e) => e.getBoundingClientRect().bottom > ad.clientHeight - pb + 1)
        .map((e) => e.className || e.tagName);
      // dos bloques que se pisan (la prueba es absoluta adentro, pero su caja no)
      const kids = [...ad.children];
      for (let i = 1; i < kids.length; i++) {
        if (kids[i].getBoundingClientRect().top < kids[i - 1].getBoundingClientRect().bottom - 1) out.push('pisa:' + (kids[i].className || kids[i].tagName));
      }
      return out;
    });
    await p.screenshot({ path: path.join(o.out, `${f}.png`), clip: { x: 0, y: 0, width: w, height: h } });
    fs.unlinkSync(file);
    console.log(`${f}.png${fuera.length ? '  ⚠️ se sale del lienzo: ' + fuera.join(', ') : ''}`);
    await p.close();
  }
  await br.close();
})();

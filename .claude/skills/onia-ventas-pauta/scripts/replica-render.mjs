#!/usr/bin/env node
// Réplica de un anuncio de la competencia que dura, modelada a Onia (prueba 1 v2, 11-oct-2026).
//
//   node .claude/skills/onia-ventas-pauta/scripts/replica-render.mjs --brief <G1-x.json> --out <dir> [--hoja <hoja.png>]
//
// Lee un brief de `carousels/briefs/ads/prueba1-v2/` y saca:
//   · video  → un PNG por cada `cuadros[]` (los cuadros clave: inicio, medio, cierre) a 1080 px de ancho;
//   · imagen → `<id>-feed.png` (1080×1080) desde `estatico`;
//   · con --hoja, la hoja «referencia | nuestra»: los cuadros de la Biblioteca arriba y los nuestros abajo,
//     los dos a 390 px de ancho (lo que ve un celular), para mirarlos de lado a lado.
// La persona es una MAQUETA (la foto de perfil de Sergio Urcullo, recortada): la toma real la graba él.
// La pantalla de Onia son los mismos píxeles de la captura real del 30-sep (recortes `fila-*.png`), nunca redibujados.
// Marca de la WEB (hoja, tinta, verde, letra Archivo), no la de la marca personal.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');

const SIZE = { '9:16': [1080, 1920], '4:5': [1080, 1350], '1:1': [1080, 1080] };
const ASSETS = 'hermes-content/carousels/briefs/assets/prueba1-v2';
const FILAS = {
  'cita-manana': { src: `${ASSETS}/fila-cita-manana.png`, w: 420, h: 54 },
  vuelve: { src: `${ASSETS}/fila-vuelve.png`, w: 420, h: 54 },
};
const PERSONA = { src: `${ASSETS}/sergio-recorte.png`, w: 1022, h: 1116 };
const BRAND = 'web-factory/apps/onia-platform/public/brand/v2/hires';
const LOGO_CLARO = `${BRAND}/onia-lockup-dental@4000.png`; // texto oscuro, para fondo claro
const LOGO_TINTA = `${BRAND}/onia-logo-dark@3000.png`; // letras claras, para fondo de tinta
const LOGO_BLANCO = `${BRAND}/onia-logo-mono-light@3000.png`; // todo blanco, para el verde
const ANUNCIOS = 'hermes-content/research/competencia/anuncios';

const abs = (p) => (path.isAbsolute(p) ? p : path.join(REPO, p));
const url = (p) => 'file://' + abs(p);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// *palabra* = el único énfasis del texto (chip amarillo en subtítulos, verde en titulares).
const marcar = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

function args() {
  const a = process.argv.slice(2);
  const o = {};
  for (let i = 0; i < a.length; i += 2) o[a[i].replace(/^--/, '')] = a[i + 1];
  if (!o.brief || !o.out) {
    console.error('Uso: replica-render.mjs --brief <G1-x.json> --out <dir> [--hoja <hoja.png>]');
    process.exit(1);
  }
  return o;
}

const fuente = (f) => `@font-face{font-family:Archivo;src:url(${url(`.claude/skills/onia-ventas-pauta/scripts/fonts/${f}.woff2`)}) format('woff2');font-weight:100 900;font-stretch:62% 125%}`;
const CSS = `${fuente('archivo-latin')}${fuente('archivo-latin-ext')}
:root{--hoja:#F4F6F4;--tinta:#0C110F;--verde:#027650;--senal:#4DBD8C;--suave:#B3B9B5;--chip:#FEF9C2;--chip-t:#894B00}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Archivo,sans-serif;-webkit-font-smoothing:antialiased;font-stretch:100%;overflow:hidden}
.lienzo{position:relative;overflow:hidden}
.abs{position:absolute}
.fit{white-space:nowrap;display:inline-block}
.card{position:absolute;background:#FCFDFC;border-radius:26px;padding:20px 22px;box-shadow:0 18px 46px rgba(12,17,15,.22),0 2px 6px rgba(12,17,15,.12)}
.card img{display:block;width:100%;height:auto}
.rot{position:absolute;font-size:30px;letter-spacing:.09em;text-transform:uppercase;color:var(--suave);font-weight:600}
.sub{white-space:pre-line;position:absolute;left:0;right:0;text-align:center;padding:0 70px;font-weight:800;color:#fff;line-height:1.16;letter-spacing:-.01em;text-shadow:0 3px 14px rgba(0,0,0,.55)}
.sub.gg{line-height:1.05}
.sub.gg .l1{display:block}
.sub.gg em{display:inline-block;background:none;color:#FBF751;font-size:170px;font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:1;padding:0;text-shadow:0 4px 22px rgba(0,0,0,.5)}
.sub.gigante{font-size:190px;line-height:1;text-transform:uppercase;font-weight:900;color:#FBF751;letter-spacing:-.02em}
.sub em{font-style:normal;background:var(--chip);color:var(--chip-t);padding:0 .22em;border-radius:.2em;text-shadow:none;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.cintilla{position:absolute;left:0;background:var(--tinta);color:#fff;border-radius:0 18px 18px 0;padding:22px 40px 22px 56px;border-left:14px solid var(--senal)}
.logofijo{position:absolute;right:48px;height:54px;width:auto}
.cintilla b{display:block;font-size:58px;font-weight:800;letter-spacing:-.01em}
.cintilla span{display:block;font-size:38px;color:var(--suave);margin-top:4px}
.standin{position:absolute;inset:0;background:radial-gradient(120% 85% at 50% 28%,#92A099 0%,#5D6A64 62%,#46524C 100%)}
.persona{position:absolute}
.btn{display:inline-flex;align-items:center;gap:16px;background:var(--senal);color:var(--tinta);border-radius:999px;font-weight:650;letter-spacing:-.005em}
.btn svg.wa{width:1.15em;height:1.15em}
em.v{font-style:normal;color:var(--verde)}
`;

let WA = '';
function wa() {
  if (!WA) {
    WA = fs.readFileSync(abs('hermes-content/references/brand-logos/whatsapp.svg'), 'utf8')
      .replace(/fill="[^"]*"/g, '').replace('<svg', '<svg class="wa" fill="currentColor"');
  }
  return WA;
}

// Una fila REAL de «Pendientes» (los mismos píxeles de la captura), ampliada al ancho pedido.
function fila(id, ancho, estilo = '') {
  const f = FILAS[id];
  if (!f) throw new Error(`fila desconocida: ${id} (hay: ${Object.keys(FILAS).join(', ')})`);
  const w = ancho, h = Math.round((ancho * f.h) / f.w);
  return `<div class="card" style="width:${w + 44}px;${estilo}"><img src="${url(f.src)}" style="width:${w}px;height:${h}px"></div>`;
}

// Fondo de una tarjeta o del cierre: tinta, hoja o verde.
const FONDOS = { tinta: ['#0C110F', '#ECEFED', LOGO_TINTA], hoja: ['#F4F6F4', '#0C110F', LOGO_CLARO], verde: ['#027650', '#FFFFFF', LOGO_BLANCO] };

function persona(W, H, pos, dy = 0) {
  const ancho = H >= 1900 ? 1400 : H >= 1300 ? 1120 : 900;
  const alto = Math.round((ancho * PERSONA.h) / PERSONA.w);
  const top = (H >= 1900 ? 400 : H >= 1300 ? 320 : 230) + dy;
  const left = Math.round((W - ancho) / 2) + (pos === 'derecha' ? 250 : 0);
  return `<img class="persona" src="${url(PERSONA.src)}" style="width:${ancho}px;height:${alto}px;left:${left}px;top:${top}px">`;
}

function htmlCuadro(b, c, W, H) {
  const hist = H >= 1900; // 9:16: Meta tapa 270 px arriba y 250 abajo
  const t = c.toma;
  const subPx = hist ? 66 : 60;
  let cuerpo = '';
  let fondo = '#0C110F';
  if (t === 'persona') {
    cuerpo += `<div class="standin"></div>`;
    if (c.persona !== 'ninguna') cuerpo += persona(W, H, c.persona, c.persona_y || 0);
  } else if (t === 'pantalla') {
    cuerpo += `<div class="abs" style="inset:0;background:#0C110F"></div>`;
  } else if (t === 'tarjeta' || t === 'cierre') {
    const k = c.tarjeta?.fondo || (t === 'cierre' ? 'hoja' : 'tinta');
    const [bg, fg, logo] = FONDOS[k];
    fondo = bg;
    const lineas = (c.tarjeta?.lineas || []).map((l) => `<div class="fit tl" style="color:${fg}">${marcar(l).replace(/<em>/g, `<em style="font-style:normal;color:${k === 'verde' ? '#FEF9C2' : 'var(--senal)'}">`)}</div>`).join('');
    cuerpo += `<div class="abs" style="inset:0;background:${bg}"></div>
      <div class="abs" style="left:0;right:0;top:${hist ? 270 : 60}px;bottom:${hist ? 250 : 60}px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:${t === 'cierre' ? 44 : 30}px;text-align:center">
        ${t === 'cierre' && !c.tarjeta?.logo_abajo ? `<img src="${url(logo)}" style="height:${k === 'hoja' ? 170 : 200}px;width:auto">` : ''}
        ${lineas}
        ${t === 'tarjeta' && c.tarjeta?.logo || c.tarjeta?.logo_abajo ? `<img src="${url(logo)}" style="height:${hist ? 150 : 130}px;width:auto;margin-top:6px">` : ''}
        ${c.tarjeta?.pie ? `<div style="font-size:54px;font-weight:700;color:${fg};margin-top:14px;letter-spacing:-.01em">${marcar(c.tarjeta.pie)}</div>` : ''}
        ${c.tarjeta?.boton ? `<span class="btn" style="font-size:40px;padding:26px 52px;margin-top:20px">${wa()}${esc(c.tarjeta.boton)}</span>` : ''}
      </div>`;
  }
  // La pantalla REAL: una o dos filas de Pendientes, ampliadas para que se lean a 390 px (≥ 2,1×).
  const filas = c.pantalla ? [].concat(c.pantalla.fila) : [];
  if (filas.length) {
    const flotando = t === 'persona';
    const ancho = flotando ? 880 : 940;
    const top0 = flotando ? Math.round(H * (c.pantalla.y ?? (hist ? 0.6 : 0.62))) : Math.round(H * 0.3);
    const marco = flotando ? 'transform:rotate(-2deg);left:' + Math.round((W - ancho - 44) / 2 + 18) + 'px;' : 'left:' + Math.round((W - ancho - 44) / 2) + 'px;';
    cuerpo += filas.map((id, i) => fila(id, ancho, `${marco}top:${top0 + i * 190}px`)).join('');
    if (flotando) {
      const alto = Math.round((ancho * FILAS[filas[filas.length - 1]].h) / FILAS[filas[filas.length - 1]].w) + 40;
      cuerpo += `<div class="rot" style="left:0;right:0;text-align:center;top:${top0 + (filas.length - 1) * 190 + alto + 14}px;font-size:28px">Pantalla de Onia · datos de ejemplo</div>`;
    }
    if (!flotando) cuerpo += `<div class="rot" style="left:${Math.round((W - ancho - 44) / 2)}px;top:${top0 - 62}px">Pantalla de Onia · datos de ejemplo</div>`;
  }
  if (c.subtitulo) {
    const y = c.sub_y != null ? c.sub_y : t === 'pantalla' ? Math.round(H * 0.72) : t === 'persona' ? Math.round(H * (c.pantalla ? 0.5 : 0.66)) : Math.round(H * 0.5);
    cuerpo += `<div class="sub${c.estilo_subtitulo === 'gigante' ? ' gigante' : ''}${c.estilo_subtitulo === 'gancho-gigante' ? ' gg' : ''}" style="${c.estilo_subtitulo === 'gigante' ? '' : `font-size:${subPx}px;`}top:${y}px">${marcar(c.subtitulo)}</div>`;
  }
  if (c.marca_grande) cuerpo += `<img class="abs" src="${url(LOGO_TINTA)}" style="left:${Math.round((W - 620) / 2)}px;top:${Math.round(H * (c.marca_y ?? 0.455))}px;width:620px;height:auto;filter:drop-shadow(0 4px 18px rgba(0,0,0,.45))">`;
  if (c.logo_fijo) cuerpo += `<img class="logofijo" src="${url(t === 'persona' || t === 'pantalla' ? LOGO_TINTA : LOGO_CLARO)}" style="top:${hist ? 290 : 50}px">`;
  if (c.cintilla) {
    cuerpo += `<div class="cintilla" style="top:${Math.round(H * (hist ? 0.76 : 0.74))}px"><b>${esc(c.cintilla.nombre)}</b><span>${esc(c.cintilla.rol)}</span></div>`;
  }
  return { cuerpo, fondo };
}

function htmlEstatico(b) {
  const e = b.estatico;
  const filas = e.filas || ['cita-manana', 'vuelve'];
  const tit = e.titular.map((l, i) => `<div class="fit tit">${marcar(l).replace(/<em>/g, '<em class="v">')}</div>`).join('');
  const baj = (e.bajada || []).map((l) => `<p>${esc(l)}</p>`).join('');
  return `<div class="abs" style="inset:0;background:#F4F6F4"></div>
  <img class="abs" src="${url(LOGO_CLARO)}" style="left:64px;top:50px;height:50px;width:auto">
  <div class="abs" style="left:64px;top:128px;display:flex;flex-direction:column;line-height:1.02;letter-spacing:-.025em;font-weight:800;color:#0C110F">${tit}</div>
  <div class="abs baj" style="left:64px;top:392px;width:470px;font-size:41px;line-height:1.24;color:#2C3430;font-weight:500">${baj}</div>
  <img class="abs" src="${url(PERSONA.src)}" style="width:650px;height:${Math.round((650 * PERSONA.h) / PERSONA.w)}px;right:-18px;bottom:0">
  ${filas[1] ? fila(filas[1], 560, 'left:64px;top:614px;transform:rotate(-1.5deg)') : ''}
  ${fila(filas[0], 930, 'left:44px;top:756px')}
  <div class="rot" style="left:64px;top:924px;font-size:26px">Pantalla de Onia · datos de ejemplo</div>
  <div class="abs" style="left:64px;top:968px"><span class="btn" style="font-size:42px;padding:26px 50px">${wa()}${esc(e.boton || 'Escríbanos por WhatsApp')}</span></div>`;
}

const pagina = (W, H, cuerpo, fondo) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
html,body{width:${W}px;height:${H}px;background:${fondo || '#0C110F'}}
.tit{font-size:96px}
.tl{font-size:104px;font-weight:800;line-height:1.05;letter-spacing:-.02em}
.baj p{margin-bottom:6px}
</style></head><body><div class="lienzo" style="width:${W}px;height:${H}px">${cuerpo}</div>
<script>
// Ajusta cada línea de titular al ancho útil (no se achica a ojo: se mide).
const maxW = ${W} - 128;
document.querySelectorAll('.fit').forEach((el)=>{let s=parseFloat(getComputedStyle(el).fontSize);while(el.scrollWidth>maxW&&s>30){s-=2;el.style.fontSize=s+'px';}});
document.fonts.ready.then(()=>{document.body.dataset.listo='1'});
</script></body></html>`;

async function pintar(br, W, H, cuerpo, fondo, salida, tmp) {
  const p = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const file = path.join(tmp, '_f.html');
  fs.writeFileSync(file, pagina(W, H, cuerpo, fondo));
  await p.goto('file://' + path.resolve(file));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.body.dataset.listo === '1');
  // Control (video 9:16): ningún texto en las zonas que Meta tapa (270 px arriba, 250 abajo).
  const avisos = await p.evaluate(({ H }) => {
    if (H < 1900) return [];
    const out = [];
    document.querySelectorAll('.sub,.cintilla,.fit,.btn,.card,.rot').forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.top < 270 - 1 && r.height < 600) out.push(`${e.className || e.tagName} arriba (${Math.round(r.top)})`);
      if (r.bottom > H - 250 + 1 && r.height < 600) out.push(`${e.className || e.tagName} abajo (${Math.round(r.bottom)})`);
    });
    return out;
  }, { H });
  await p.screenshot({ path: salida, clip: { x: 0, y: 0, width: W, height: H } });
  fs.unlinkSync(file);
  await p.close();
  return avisos;
}

// Hoja «referencia | nuestra»: los dos al ancho de un celular para compararlos de lado a lado.
function htmlHoja(b, refs, nuestras, rel) {
  const r = b.referencia;
  const vid = !b.estatico;
  const ancho = vid ? 390 : 560;
  const rot = ['inicio', 'medio', 'cierre'];
  const pngW = (f) => { const bb = fs.readFileSync(f); return [bb.readUInt32BE(16), bb.readUInt32BE(20)]; };
  const rec = r.recorte;
  const cell = (src, cap, sub, recortar) => recortar && rec ? (() => { const [rx, ry, rw, rh] = rec; const [iw, ih] = pngW(abs(src)); const k = ancho / rw;
    return `<figure><div style="width:${ancho}px;height:${Math.round(rh * k)}px;overflow:hidden;position:relative;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.25)"><img src="${url(src)}" style="position:absolute;width:${Math.round(iw * k)}px;height:${Math.round(ih * k)}px;left:${-Math.round(rx * k)}px;top:${-Math.round(ry * k)}px"></div><figcaption><b>${esc(cap)}</b>${sub ? `<br>${esc(sub)}` : ''}</figcaption></figure>`; })() : `<figure><img src="${url(src)}" style="width:${ancho}px;height:auto;display:block;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.25)"><figcaption><b>${esc(cap)}</b>${sub ? `<br>${esc(sub)}` : ''}</figcaption></figure>`;
  const fila1 = refs.map((s, i) => cell(s, vid ? (rot[i] || 'tarjeta entera (trae el póster)') : 'creativo', '', vid && i < 3)).join('');
  const fila2 = nuestras.map((n, i) => cell(n.src, n.cap, n.sub)).join('');
  return `<div style="padding:34px 40px 30px;background:#F4F6F4;width:max-content;min-width:1360px">
  <div style="display:flex;align-items:baseline;gap:20px"><div style="font-size:54px;font-weight:800;letter-spacing:-.02em">${esc(b.id)}</div>
  <div style="font-size:30px;font-weight:600;color:#027650">${esc(b.pieza)}</div></div>
  <div style="font-size:22px;color:#4E5651;margin:6px 0 22px">Referencia: ${esc(r.anunciante)} <code>${esc(r.id)}</code> · ${esc(String(r.dias))} días al aire (11-oct) · ${esc(r.formato)}. Nuestra pieza: ${esc(b.formato.relacion)}${b.formato.duracion_s ? ` · ${b.formato.duracion_s} s` : ''}. <b>Maqueta:</b> la persona es la foto de perfil de Sergio Urcullo recortada; la toma real la graba él.</div>
  <div class="lab">REFERENCIA · tarjeta de la Biblioteca de Meta, tal cual (${vid ? '3 cuadros: inicio, medio y cierre' : 'el creativo'})</div>
  <div class="fila">${fila1}</div>
  <div class="lab" style="margin-top:26px">NUESTRA · ${vid ? 'los mismos 3 momentos' : 'la imagen'}, al mismo tamaño</div>
  <div class="fila">${fila2}</div></div>`;
}

const HOJA_CSS = `${CSS}
html,body{background:#F4F6F4;width:max-content;min-width:1360px}
.lab{font-size:19px;letter-spacing:.1em;font-weight:700;color:#4E5651;margin-bottom:10px}
.fila{display:flex;gap:22px;align-items:flex-start}
figure{margin:0}
figcaption{font-size:19px;line-height:1.3;color:#2C3430;margin-top:8px;max-width:390px}
code{background:#E4EAE6;padding:1px 6px;border-radius:5px;font-size:.92em}`;

async function main() {
  const o = args();
  const b = JSON.parse(fs.readFileSync(o.brief, 'utf8'));
  fs.mkdirSync(o.out, { recursive: true });
  const exe = process.env.CHROMIUM_PATH || fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d))
    .map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)[0];
  const br = await chromium.launch({ executablePath: exe });
  const nuestras = [];
  if (b.estatico) {
    const [W, H] = SIZE['1:1'];
    const s = path.join(o.out, `${b.id}-feed.png`);
    const av = await pintar(br, W, H, htmlEstatico(b), '#F4F6F4', s, o.out);
    console.log(path.relative(REPO, s) + (av.length ? '  ⚠️ ' + av.join(', ') : ''));
    nuestras.push({ src: s, cap: 'imagen 1:1', sub: b.gancho?.imagen || '' });
  } else {
    const [W, H] = SIZE[b.formato.relacion];
    for (const c of b.cuadros) {
      const { cuerpo, fondo } = htmlCuadro(b, c, W, H);
      const s = path.join(o.out, `${b.id}-${c.id}.png`);
      const av = await pintar(br, W, H, cuerpo, fondo, s, o.out);
      console.log(path.relative(REPO, s) + (av.length ? '  ⚠️ ' + av.join(', ') : ''));
      nuestras.push({ src: s, cap: `${c.tramo} · ${c.rol}`, sub: c.zona_de_la_referencia || '' });
    }
  }
  if (o.hoja) {
    const dir = `${ANUNCIOS}/${b.referencia.anunciante.toLowerCase().replace(/[^a-z]/g, '')}`;
    const refs = (b.estatico ? ['-2'] : ['-2', '-3', '-4']).map((x) => `${dir}/${b.referencia.id}${x}.png`);
    if (!b.estatico && b.cuadros.length > 3) refs.push(`${dir}/${b.referencia.id}.png`); // el póster vive en la tarjeta entera
    const p = await br.newPage({ viewport: { width: 1360, height: 800 }, deviceScaleFactor: 1 });
    const file = path.join(o.out, '_hoja.html');
    fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${HOJA_CSS}</style></head><body>${htmlHoja(b, refs, nuestras)}</body></html>`);
    await p.goto('file://' + path.resolve(file));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: o.hoja, fullPage: true });
    fs.unlinkSync(file);
    console.log(path.relative(REPO, o.hoja));
    await p.close();
  }
  await br.close();
}
main().catch((e) => { console.error(e.message); process.exit(1); });

#!/usr/bin/env node
/**
 * Generador automático de propuestas Onia.
 *
 * Lee clientes.json, arma el HTML de cada propuesta a partir de una sola
 * plantilla, y (opcional) imprime el PDF con Edge headless.
 *
 * Uso:
 *   node generar-propuestas.js            # genera solo HTML
 *   node generar-propuestas.js --pdf      # genera HTML + PDF
 *   node generar-propuestas.js garabato   # genera solo ese cliente
 *
 * Sin dependencias externas. Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIR = __dirname;
const OUT = path.join(DIR, '..'); // escribe los .html/.pdf en /propuestas
const DATA = path.join(DIR, 'clientes.json');

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- Render de secciones reutilizables --------------------------------------

function renderSteps(steps) {
  return steps.map((s, i) => `
    <div class="step"><div class="n">${i + 1}</div><div>
      <h3>${esc(s.titulo)}</h3><p>${esc(s.detalle)}</p>
    </div></div>`).join('');
}

function renderCards(cards) {
  return cards.map((c) => `
    <div class="card">
      <div class="tag ${c.tagClass || ''}">${esc(c.tag)}</div>
      <h3>${esc(c.titulo)}</h3>
      <ul>${c.items.map((it) => `<li>${esc(it)}</li>`).join('')}</ul>
    </div>`).join('');
}

function renderPaquetes(paquetes) {
  return paquetes.map((p) => {
    const star = p.recomendado ? ' ⭐' : '';
    const nombre = `<b>${esc(p.nombre)}</b>${star}`;
    const rowClass = p.recomendado ? ' class="rec"' : '';
    const resultado = p.resultado
      ? `<br><span class="res">→ ${esc(p.resultado)}</span>` : '';
    const limite = p.limite
      ? `<br><span class="lim">Tope: ${esc(p.limite)}</span>` : '';
    return `<tr${rowClass}><td>${nombre}</td><td>${esc(p.incluye)}${resultado}${limite}</td><td class="num">${esc(p.precio)}</td></tr>`;
  }).join('');
}

function renderValor(valor) {
  if (!valor || !valor.length) return '';
  const items = valor.map((v) => `
    <div class="vcard">
      <h3>${esc(v.titulo)}</h3>
      <p>${v.detalle}</p>
    </div>`).join('');
  return `
  <h2>Por qué te conviene</h2>
  <div class="grid vgrid">${items}</div>`;
}

function renderAddons(addons) {
  return addons.map((a) =>
    `<tr><td>${esc(a.nombre)}</td><td class="num">${esc(a.setup)}</td><td class="num">${esc(a.mensual)}</td></tr>`
  ).join('');
}

// Bloques opcionales v3: resumen ejecutivo, imágenes, casos, comparativa,
// próximos pasos + CTA, portada. Solo se renderizan si el cliente los define.

function renderResumen(txt) {
  if (!txt) return '';
  return `
  <h2>Resumen ejecutivo</h2>
  <div class="card"><p>${txt}</p></div>`;
}

function renderImagenes(imagenes) {
  if (!imagenes || !imagenes.length) return '';
  return imagenes.map((im) => `
  <figure>
    <img src="${esc(im.src)}" alt="${esc(im.alt || '')}">
    ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ''}
  </figure>`).join('');
}

function renderCasos(casos) {
  if (!casos || !casos.length) return '';
  const items = casos.map((v) => `
    <div class="vcard">
      <h3>${esc(v.titulo)}</h3>
      <p>${v.detalle}</p>
    </div>`).join('');
  return `
  <h2>Resultados</h2>
  <div class="grid vgrid">${items}</div>`;
}

function renderComparativa(comp) {
  if (!comp || !comp.filas || !comp.filas.length) return '';
  const cols = comp.columnas || ['Opción A', 'Opción B'];
  const filas = comp.filas.map((f) =>
    `<tr><td><b>${esc(f[0])}</b></td><td>${esc(f[1])}</td><td class="win">${esc(f[2])}</td></tr>`
  ).join('');
  return `
  <h2>${esc(comp.titulo || 'Comparativa')}</h2>
  <table class="comp">
    <tr><th></th><th>${esc(cols[0])}</th><th>${esc(cols[1])}</th></tr>
    ${filas}
  </table>`;
}

// Link de agenda de Onia (Cal.com). Cada propuesta invita a reservar una llamada;
// override por cliente con c.ctaAgenda = { url, texto }.
const CAL_LINK = 'https://cal.onia.com.bo';

function renderProximosPasos(pasos, cta, agenda) {
  if (!pasos || !pasos.length) return '';
  const steps = pasos.map((p, i) => `
    <div class="step"><div class="n">${i + 1}</div><div><p>${esc(p)}</p></div></div>`).join('');
  const waBtn = cta && cta.url
    ? `<a class="cta" href="${esc(cta.url)}">${esc(cta.texto || 'Escribinos por WhatsApp')}</a>`
    : '';
  const agendaUrl = (agenda && agenda.url) || CAL_LINK;
  const agendaBtn = agendaUrl
    ? `<a class="cta" href="${esc(agendaUrl)}">${esc((agenda && agenda.texto) || 'Agendá una llamada')}</a>`
    : '';
  const btns = (waBtn || agendaBtn)
    ? `<p style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">${waBtn}${agendaBtn}</p>`
    : '';
  return `
  <h2>Próximos pasos</h2>
  <div class="card">${steps}${btns}</div>`;
}

function renderPortada(p, nombre) {
  if (!p) return '';
  return `
  <div class="cover">
    <div>
      <div class="kicker">Propuesta comercial · Onia Inteligencia Artificial</div>
      <h1>${esc(p.titulo)}</h1>
      <p>${esc(p.subtitulo || '')}</p>
      <p class="meta">Preparado para: <b>${esc(p.para || nombre)}</b>${p.fecha ? ` · ${esc(p.fecha)}` : ''}</p>
    </div>
  </div>`;
}

// Bloque opcional: "El costo de esperar" — qué le cuesta al cliente NO hacer nada.
// REGLA DURA: solo con datos REALES del cliente (sus horas, sus ventas, su plata
// parada). Sin datos cargados la sección NO se imprime: nada de cifras de ejemplo,
// rangos genéricos ni placeholders. Ver skill propuestas-comerciales-onia §13.
//
// La línea fiscal (`siat.grupo`) se SACÓ el 2026-10-03 y `siat` se ignora. Imprimía
// «tu NIT está en el grupo X, así que desde el 1 de octubre de 2026 solo podés emitir
// por la modalidad en línea asignada (RND 102600000007)». El 30-sep-2026 la RND
// 102600000038 abrogó las designaciones de los grupos 9° al 12° y dejó sin efecto
// ese plazo, y no fija otro: ya no hay grupo ni fecha que poner en un «costo de
// esperar». Una urgencia fiscal en una propuesta sin norma que la sostenga es
// fabricar. Fuente: hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md §2.6.
function renderCostoEsperar(ce) {
  if (!ce) return '';
  const items = (ce.items || []).filter((it) => it && it.concepto && it.costo);
  if (!items.length) return '';
  const filas = items.map((it) => `
    <tr><td><b>${esc(it.concepto)}</b>${it.dato ? `<br><span class="lim">${esc(it.dato)}</span>` : ''}</td>
    <td class="num">${esc(it.costo)}</td></tr>`).join('');
  const total = ce.total
    ? `<tr class="rec"><td><b>${esc(ce.totalLabel || 'Lo que ya estás pagando por esperar')}</b></td><td class="num">${esc(ce.total)}</td></tr>`
    : '';
  const tabla = filas
    ? `<table><tr><th>Qué pasa hoy</th><th class="num">Costo</th></tr>${filas}${total}</table>`
    : '';
  const intro = ce.intro ? `<p>${ce.intro}</p>` : '';
  const nota = ce.nota ? `<p style="margin-top:10px;">${ce.nota}</p>` : '';
  return `
  <h2>El costo de esperar</h2>
  <div class="card">${intro}${tabla}${nota}</div>`;
}

// Bloque opcional: requisitos a cargo del cliente (cobros online en Bolivia).
// Ver hermes-content/propuestas/REQUISITOS_LEGALES_BOLIVIA_INTERNO.md
function renderRequisitos(req) {
  if (!req || !req.length) return '';
  const items = req.map((r) => `<li>${esc(r)}</li>`).join('');
  return `
  <h2>Requisitos a cargo del cliente</h2>
  <div class="card">
    <p>Para habilitar los pagos en línea, el negocio deberá contar con la
    siguiente documentación a su nombre (lo acompañamos en cada paso):</p>
    <ul>${items}</ul>
  </div>`;
}

// --- Validación -------------------------------------------------------------

const REQUIRED = ['slug', 'nombre', 'titulo', 'subtitulo', 'problema', 'incluye', 'pasos', 'paquetes', 'notaPaquetes', 'addons', 'terceros'];

function validateCliente(c, i) {
  const faltan = REQUIRED.filter((k) => !c[k] || (Array.isArray(c[k]) && !c[k].length));
  if (faltan.length) {
    throw new Error(`Cliente #${i} (${c.slug || 'sin slug'}): faltan campos requeridos: ${faltan.join(', ')}`);
  }
  if (!c.paquetes.some((p) => p.recomendado)) {
    console.warn(`[Onia] Aviso: ${c.slug} no tiene paquete recomendado (⭐).`);
  }
}

// --- Plantilla única --------------------------------------------------------

function buildHtml(c, opts = {}) {
  const accent = c.accent || '#1e5bff';
  const moneda = c.moneda || 'Bs';
  // Pixel de apertura (n8n webhook). Solo en la variante HTML trackeada:
  // el PDF se imprime desde el HTML sin beacon para no falsear aperturas.
  const beacon = opts.trackUrl
    ? `\n<img src="${esc(opts.trackUrl)}" alt="" width="1" height="1" style="position:absolute;left:-9999px;opacity:0" aria-hidden="true">`
    : '';
  const heroGrad = c.heroGrad || 'linear-gradient(135deg,#0f1b2e 0%,#16294a 55%,#0e3f32 100%)';
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Propuesta Onia — ${esc(c.nombre)}</title>
<style>
  :root{--ink:#101827;--muted:#526172;--line:#d8e0ea;--blue:#1e5bff;--blue-dark:#1239a8;
    --green:#0f8b62;--amber:#a75b00;--bg:#f6f8fb;--white:#fff;--accent:${accent};}
  *{box-sizing:border-box;}
  body{margin:0;font-family:'Segoe UI',system-ui,-apple-system,Arial,Helvetica,sans-serif;color:var(--ink);background:var(--bg);}
  .page{max-width:900px;margin:0 auto;padding:40px 28px;}
  .hero{background:${heroGrad};color:#fff;border-radius:18px;padding:44px 40px;margin-bottom:28px;}
  .kicker{color:#cfe0ff;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;}
  h1{font-size:clamp(34px,6vw,56px);line-height:1.02;margin:0 0 14px;}
  h2{font-size:26px;margin:34px 0 14px;border-bottom:3px solid var(--accent);padding-bottom:8px;}
  h3{font-size:18px;margin:0 0 8px;}
  p{font-size:16px;line-height:1.5;color:var(--muted);margin:0 0 10px;}
  .hero p{color:#e6eefb;font-size:18px;}
  .card{background:var(--white);border:1px solid var(--line);border-radius:14px;padding:20px 22px;margin-bottom:14px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  table{width:100%;border-collapse:collapse;background:var(--white);border-radius:12px;overflow:hidden;border:1px solid var(--line);}
  th,td{padding:12px 14px;text-align:left;font-size:15px;border-bottom:1px solid var(--line);}
  th{background:#eef3fb;color:var(--ink);font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.05em;}
  td.num,th.num{text-align:right;white-space:nowrap;}
  .tag{display:inline-block;background:#eaf0ff;color:var(--blue-dark);font-size:12px;font-weight:800;padding:3px 10px;border-radius:999px;margin-bottom:8px;}
  .tag.green{background:#e3f4ec;color:var(--green);}
  .tag.amber{background:#fbeede;color:var(--amber);}
  ul{margin:6px 0 0;padding-left:20px;}
  li{font-size:15px;color:var(--muted);line-height:1.5;margin-bottom:5px;}
  .foot{margin-top:30px;border-top:1px solid var(--line);padding-top:16px;font-size:13px;color:var(--muted);}
  .big{font-size:20px;color:var(--ink);font-weight:800;}
  .step{display:flex;gap:14px;align-items:flex-start;margin-bottom:12px;}
  .step .n{background:var(--accent);color:#fff;font-weight:800;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;flex:0 0 30px;}
  tr.rec td{background:#fff7ed;border-top:2px solid var(--accent);border-bottom:2px solid var(--accent);}
  tr.rec td.num{font-size:17px;font-weight:800;}
  .res{color:var(--accent);font-weight:700;font-size:13px;}
  .lim{color:var(--muted);font-size:12px;}
  .step p{margin:0;color:var(--ink);}
  .step h3 + p{color:var(--muted);}
  .vgrid .vcard{background:var(--white);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:12px;padding:16px 18px;}
  .vcard h3{color:var(--ink);}
  figure{margin:18px 0;}
  figure img{width:100%;border-radius:14px;display:block;}
  figcaption{font-size:13px;color:var(--muted);margin-top:6px;text-align:center;}
  table.comp td.win{background:#e3f4ec;color:var(--ink);font-weight:600;}
  a.cta{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:16px;padding:12px 22px;border-radius:10px;text-decoration:none;}
  .cover{background:${heroGrad};color:#fff;border-radius:18px;padding:60px 48px;min-height:88vh;display:flex;align-items:center;margin-bottom:28px;page-break-after:always;}
  .cover p{color:#e6eefb;font-size:19px;}
  .cover .meta{margin-top:26px;font-size:15px;color:#cfe0ff;}
  @media print{
    .page{max-width:100%;}body{background:#fff;}
    .card,table,figure,.vcard,.step{page-break-inside:avoid;}
    h2{page-break-after:avoid;}
  }
</style>
</head>
<body>
<div class="page">
${renderPortada(c.portada, c.nombre)}
  <div class="hero">
    <div class="kicker">Propuesta comercial · Onia Inteligencia Artificial</div>
    <h1>${esc(c.titulo)}</h1>
    <p>${esc(c.subtitulo)}</p>
  </div>
${renderResumen(c.resumenEjecutivo)}
  <h2>Qué problema resolvemos</h2>
  <div class="card"><p>${c.problema}</p></div>
${renderImagenes(c.imagenes)}
  <h2>Qué incluye</h2>
  <div class="grid">${renderCards(c.incluye)}</div>

  <h2>Cómo lo construimos</h2>
  <div class="card">${renderSteps(c.pasos)}</div>
${renderValor(c.valor)}${renderCasos(c.casos)}${renderComparativa(c.comparativa)}${renderCostoEsperar(c.costoDeEsperar)}
  <h2>Paquetes — elegí el tuyo</h2>
  <table>
    <tr><th>Paquete</th><th>Qué incluye</th><th class="num">Precio (${esc(moneda)})</th></tr>
    ${renderPaquetes(c.paquetes)}
  </table>
  <p style="margin-top:10px;">${c.notaPaquetes}</p>
  ${c.plazoEntrega ? `<p style="margin-top:6px;"><b>Plazo de entrega estimado:</b> ${esc(c.plazoEntrega)} desde el anticipo y la entrega de contenidos.</p>` : ''}

  <h2>Add-ons (opcionales)</h2>
  <table>
    <tr><th>Add-on</th><th class="num">Setup (${esc(moneda)})</th><th class="num">Mensual (${esc(moneda)})</th></tr>
    ${renderAddons(c.addons)}
  </table>

  <div class="card" style="margin-top:16px;">
    <div class="tag amber">Importante — costos de terceros</div>
    <p>${c.terceros}</p>
  </div>
${renderRequisitos(c.requisitos)}${renderProximosPasos(c.proximosPasos, c.ctaWhatsapp, c.ctaAgenda)}
  <div class="foot">
    <p class="big">Precio reservado hasta 30 días con confirmación de pago.</p>
    <p>Onia — Sistemas, automatización y contenido para negocios. business@onia.com.bo</p>
  </div>

</div>${beacon}
</body>
</html>`;
}

// --- PDF (Edge/Chrome headless) ---------------------------------------------

function findBrowser() {
  return EDGE_CANDIDATES.find((p) => fs.existsSync(p)) || null;
}

function printPdf(browser, htmlPath, pdfPath) {
  const ud = path.join(require('os').tmpdir(), `onia-pdf-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', `--user-data-dir=${ud}`,
    `--print-to-pdf=${pdfPath}`, '--no-pdf-header-footer', htmlPath,
  ], { stdio: 'ignore' });
}

// --- Main -------------------------------------------------------------------

// Webhook n8n de aperturas (workflow "ONIA - Propuesta Abierta (pixel)" en n8n;
// el nombre del workflow vivo NO se renombra con la marca). El token
// identifica al prospecto; se pasa con --track <token>.
const TRACK_WEBHOOK = 'https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/propuesta-abierta';

function parseArgs(args) {
  const wantPdf = args.includes('--pdf');
  const trackIdx = args.indexOf('--track');
  const trackToken = trackIdx !== -1 ? (args[trackIdx + 1] || null) : null;
  const only = args.filter((a, i) =>
    !a.startsWith('--') && (trackIdx === -1 || i !== trackIdx + 1));
  return { wantPdf, trackIdx, trackToken, only };
}

function main() {
  const { wantPdf, trackIdx, trackToken, only } = parseArgs(process.argv.slice(2));
  if (trackIdx !== -1 && !trackToken) {
    console.error('[Onia] --track requiere un token (ej: --track cliente-x-jul26)');
    process.exit(1);
  }

  const clientes = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const browser = wantPdf ? findBrowser() : null;
  if (wantPdf && !browser) console.warn('[Onia] No se encontró Edge/Chrome — solo genero HTML.');

  clientes.forEach((c, i) => validateCliente(c, i));

  for (const c of clientes) {
    if (only.length && !only.includes(c.slug)) continue;
    const htmlPath = path.join(OUT, `propuesta-${c.slug}.html`);
    fs.writeFileSync(htmlPath, buildHtml(c), 'utf8');
    console.log(`[Onia] HTML  → ${htmlPath}`);
    if (browser) {
      const pdfPath = path.join(OUT, `propuesta-${c.slug}.pdf`);
      try {
        printPdf(browser, htmlPath, pdfPath);
        console.log(`[Onia] PDF   → ${pdfPath}`);
      } catch (e) {
        console.warn(`[Onia] PDF falló (${c.slug}): ${e.message}. ¿Está abierto en un visor?`);
      }
    }
    if (trackToken) {
      const trackUrl = `${TRACK_WEBHOOK}?t=${encodeURIComponent(trackToken)}&s=${encodeURIComponent(c.slug)}`;
      const trackedPath = path.join(OUT, `propuesta-${c.slug}-${trackToken}.html`);
      fs.writeFileSync(trackedPath, buildHtml(c, { trackUrl }), 'utf8');
      console.log(`[Onia] TRACK → ${trackedPath} (avisa a Telegram al abrirse)`);
    }
  }
  console.log('[Onia] Listo.');
}

if (require.main === module) main();
module.exports = { buildHtml, validateCliente, parseArgs };

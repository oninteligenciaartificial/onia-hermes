// QA de V2. Ejecutar: node evidencia/qa.cjs   (Playwright de web-factory, Chromium headless ya instalado)
const { chromium } = require('C:/dev/proyectos/onia-hermes/web-factory/node_modules/playwright');
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const URL = 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html';
const V1 = 'file:///' + path.resolve(ROOT, '../diseno-workshop/index.html').replace(/\\/g, '/') + '?d=a';
const CAP = ROOT + '/capturas';
const qa = { fecha: new Date().toISOString(), url: URL, chromium: null, responsive: [], contraste: {}, foco: {}, fuentes: {}, demo: {}, tabs: {}, faq: {}, cta: {}, red: {}, errores: [], limites: [] };

const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

async function scrollAll(p, h) {
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h * 0.6) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(220); }
  await p.waitForTimeout(1100); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
}

(async () => {
  const b = await chromium.launch(); qa.chromium = b.version();
  const reqs = [];
  const mk = async (w, h, opts = {}) => {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...opts });
    await c.route(/^https?:/, r => { reqs.push(r.request().url()); r.abort(); });
    const p = await c.newPage();
    p.on('pageerror', e => qa.errores.push(w + ': ' + e.message));
    p.on('console', m => { if (m.type() === 'error') qa.errores.push(w + ' console: ' + m.text()); });
    await p.goto(URL); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    return { c, p };
  };

  // 1. responsive
  for (const [w, h] of [[360, 780], [390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
    const { c, p } = await mk(w, h, { reducedMotion: 'reduce' });
    const m = await p.evaluate(() => {
      const cta = document.querySelector('.hero [data-cta]').getBoundingClientRect();
      const h1 = document.querySelector('h1'), cs = getComputedStyle(h1);
      const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !e.closest('.retrato') && !e.closest('.hero-foto') && !e.closest('.salis-foto') && !e.closest('.cuenta-foto') && !e.closest('.cierre-foto') && !e.classList.contains('saltar'); }).slice(0, 5).map(e => e.className || e.tagName);
      const small = [...document.querySelectorAll('button,summary,[role=tab],input')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44) && !e.closest('[hidden]'); }).map(e => (e.className || e.tagName) + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
      return { scrollW: document.documentElement.scrollWidth, innerW: innerWidth, h1px: cs.fontSize, h1lines: Math.round(h1.getBoundingClientRect().height / parseFloat(cs.lineHeight)), ctaHeroTop: Math.round(cta.top), ctaHeroBottom: Math.round(cta.bottom), overflowEls: over, objetivosMenores44: small };
    });
    m.ancho = w; m.sinScrollHorizontal = m.scrollW <= m.innerW; qa.responsive.push(m);
    await p.screenshot({ path: `${CAP}/hero-${w}x${h}.png` });
    await c.close();
  }

  // 2. fuentes, contraste, scroll completo, capturas de página completa
  for (const [w, h] of [[1440, 900], [390, 844], [768, 1024], [1024, 768]]) {
    const { c, p } = await mk(w, h);
    await scrollAll(p, h);
    await p.screenshot({ path: `${CAP}/pagina-completa-${w}.png`, fullPage: true });
    if (w === 1440) {
      qa.fuentes = await p.evaluate(async () => ({
        archivoCargada: document.fonts.check('800 20px Archivo') && document.fonts.check('400 16px Archivo'),
        estados: [...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.status),
        familiasUsadas: [...new Set([...document.querySelectorAll('body *')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '')))],
        imagenesRotas: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src.split('/').pop())
      }));
      const pares = await p.evaluate(() => {
        const out = [];
        const bgOf = el => { for (let e = el; e; e = e.parentElement) { const bg = getComputedStyle(e).backgroundColor; const m = bg.match(/rgba?\(([^)]+)\)/); if (m) { const [r, g, b, a = 1] = m[1].split(',').map(Number); if (a > 0.5) return [r, g, b]; } } return [243, 244, 243]; };
        const seen = new Set();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const t = walker.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement;
          if (el.closest('dialog') || el.closest('[hidden]') || el.closest('.solo-lectores') || el.tagName === 'SCRIPT') continue;
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue;
          const m = cs.color.match(/rgba?\(([^)]+)\)/)[1].split(',').map(Number);
          const key = cs.color + '|' + bgOf(el).join(',') + '|' + cs.fontSize + '|' + cs.fontWeight; if (seen.has(key)) continue; seen.add(key);
          out.push({ ejemplo: t.textContent.trim().slice(0, 36), fg: m.slice(0, 3), bg: bgOf(el), px: parseFloat(cs.fontSize), peso: +cs.fontWeight, clase: String(el.className || el.tagName) });
        }
        return out;
      });
      qa.contraste.pares = pares.map(x => { const r = ratio(x.fg, x.bg); const grande = x.px >= 24 || (x.px >= 18.66 && x.peso >= 700); return { ...x, ratio: +r.toFixed(2), minimo: grande ? 3 : 4.5, pasa: r >= (grande ? 3 : 4.5) }; });
      qa.contraste.fallan = qa.contraste.pares.filter(x => !x.pasa);
      qa.contraste.nota = 'Todo el texto de la pagina va sobre fondos solidos (ninguno sobre fotografia). Pares por combinacion unica de color de texto, fondo efectivo, tamano y peso.';
      qa.contraste.otros = { blancoSobreVerde: +ratio([255, 255, 255], [12, 113, 55]).toFixed(2), blancoSobreVerdeOscuroHover: +ratio([255, 255, 255], [9, 90, 44]).toFixed(2), tintaSobreVerdeVivo: +ratio([13, 18, 16], [0, 198, 97]).toFixed(2), aroFocoVivoSobreTinta: +ratio([0, 198, 97], [13, 18, 16]).toFixed(2), aroFocoVivoSobrePapel: +ratio([0, 198, 97], [243, 244, 243]).toFixed(2), tintaSobreAroTinta: 'aro doble: 3px verde vivo + 2px tinta' };
    }
    await c.close();
  }

  // 3. foco, demo, tabs, faq, CTA (escritorio y 390)
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { c, p } = await mk(w, h, { reducedMotion: 'reduce' });
    const orden = [];
    for (let i = 0; i < 60; i++) {
      await p.keyboard.press('Tab');
      const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { el: (e.tagName + '.' + (e.className || '') + (e.id ? '#' + e.id : '')).slice(0, 40), outline: cs.outlineStyle + ' ' + cs.outlineWidth, visible: r.width > 0 && r.height > 0, oculto: !!e.closest('[hidden]') }; });
      if (!f) break; if (orden.length && orden[0].el === f.el && i > 3) break; orden.push(f);
    }
    qa.foco[w] = { enfocables: orden.length, sinAroVisible: orden.filter(f => f.outline.startsWith('none') || f.outline.endsWith(' 0px')).map(f => f.el), enfocadosOcultos: orden.filter(f => f.oculto).map(f => f.el), primeros: orden.slice(0, 6).map(f => f.el) };
    await p.evaluate(() => scrollTo(0, 0));
    await p.focus('.hero [data-cta]'); await p.waitForTimeout(150);
    await p.screenshot({ path: `${CAP}/foco-cta-${w}.png` });

    const d = {};
    await p.locator('.cuenta').scrollIntoViewIfNeeded();
    const leer = () => p.evaluate(() => [document.getElementById('r-sem').textContent, document.getElementById('r-mes').textContent]);
    d.inicial = await leer();
    await p.fill('#c-veces', '7'); await p.fill('#c-min', '12'); d.sieteporDoce = await leer();
    await p.click('[data-para=c-veces][data-paso="1"]'); d.tras_mas_una_vez = await leer();
    await p.click('[data-para=c-min][data-paso="-1"]'); d.tras_menos_un_min = await leer();
    await p.fill('#c-veces', ''); d.vacio = await leer();
    await p.fill('#c-veces', '-5'); d.negativo = await leer();
    await p.fill('#c-veces', '9999'); await p.fill('#c-min', '5'); d.sobreMaximo = await leer();
    d.esperado = { inicial: ['50 min', '3 h 20 min'], sieteporDoce: ['84 min', '5 h 36 min'], tras_mas_una_vez: ['96 min', '6 h 24 min'], tras_menos_un_min: ['88 min', '5 h 52 min'] };
    const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    d.ok = eq(d.inicial, d.esperado.inicial) && eq(d.sieteporDoce, d.esperado.sieteporDoce) && eq(d.tras_mas_una_vez, d.esperado.tras_mas_una_vez) && eq(d.tras_menos_un_min, d.esperado.tras_menos_un_min) && d.vacio[0] === '0 min' && d.negativo[0] === '0 min' && d.sobreMaximo[0] === '1000 min';
    qa.demo[w] = d;
    await p.fill('#c-veces', '7'); await p.fill('#c-min', '12');
    await p.locator('.cuenta-panel').scrollIntoViewIfNeeded();
    await p.screenshot({ path: `${CAP}/demo-contador-${w}.png` });

    const t = {};
    await p.locator('.programa').scrollIntoViewIfNeeded();
    const estado = () => p.evaluate(() => [...document.querySelectorAll('.eje [role=tab]')].map(x => x.getAttribute('aria-selected')).join(',') + ' | visibles:' + [...document.querySelectorAll('.panel')].filter(x => !x.hidden).map(x => x.id).join(','));
    t.inicial = await estado();
    await p.click('#t-3'); t.clicElegir = await estado();
    await p.screenshot({ path: `${CAP}/programa-elegir-${w}.png` });
    await p.focus('#t-3'); await p.keyboard.press('ArrowLeft'); t.flechaIzq = await estado();
    await p.keyboard.press('End'); t.end = await estado();
    await p.keyboard.press('Home'); t.home = await estado();
    t.ok = t.inicial.startsWith('true,false,false | visibles:p-1') && t.clicElegir.startsWith('false,false,true | visibles:p-3') && t.flechaIzq.startsWith('false,true,false | visibles:p-2') && t.end.startsWith('false,false,true') && t.home.startsWith('true,false,false');
    qa.tabs[w] = t;

    const f = {};
    await p.locator('.preguntas').scrollIntoViewIfNeeded();
    const sums = p.locator('summary');
    f.preguntas = await sums.count();
    await sums.nth(4).click(); await sums.nth(1).click();
    f.abiertas = await p.evaluate(() => [...document.querySelectorAll('details')].filter(x => x.open).length);
    await sums.nth(0).focus(); await p.keyboard.press('Enter');
    f.teclado = await p.evaluate(() => document.querySelectorAll('details')[0].open);
    f.ok = f.preguntas === 5 && f.abiertas === 2 && f.teclado === true;
    await p.screenshot({ path: `${CAP}/faq-abierta-${w}.png` });
    qa.faq[w] = f;

    const cta = {};
    const antes = reqs.length;
    await p.evaluate(() => scrollTo(0, 0));
    await p.click('.barra [data-cta]');
    cta.abre = await p.evaluate(() => document.getElementById('estado').open);
    cta.texto = await p.evaluate(() => document.querySelector('#estado h2').textContent);
    cta.focoEnDialogo = await p.evaluate(() => !!document.activeElement.closest('dialog'));
    await p.screenshot({ path: `${CAP}/cta-estado-local-${w}.png` });
    await p.keyboard.press('Escape'); cta.cierraConEscape = await p.evaluate(() => !document.getElementById('estado').open);
    await p.evaluate(() => document.querySelector('.cierre [data-cta]').scrollIntoView());
    await p.click('.cierre [data-cta]'); cta.abreDesdeCierre = await p.evaluate(() => document.getElementById('estado').open); await p.keyboard.press('Escape');
    cta.formulariosReales = await p.evaluate(() => document.querySelectorAll('form:not([method=dialog]):not(#calc)').length);
    cta.enlacesExternos = await p.evaluate(() => [...document.querySelectorAll('a[href]')].filter(a => !a.getAttribute('href').startsWith('#')).length);
    cta.peticionesNuevas = reqs.length - antes;
    qa.cta[w] = cta;
    await c.close();
  }

  // 4. exploracion de hero A/B, con movimiento activo
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
    await p.goto(URL + '?hero=balanza'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1600);
    await p.screenshot({ path: `${CAP}/exploracion-hero-B-balanza-${w}.png` });
    await p.goto(URL); await p.waitForTimeout(1600);
    await p.screenshot({ path: `${CAP}/exploracion-hero-A-sobres-${w}.png` });
    await c.close();
  }

  // 5. V1 (rechazada), solo lectura, para comparar
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const p = await c.newPage();
    await p.goto(V1); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.screenshot({ path: `${CAP}/comparacion-V1-hero-${w}.png` });
    if (w === 1440) await p.screenshot({ path: `${CAP}/comparacion-V1-pagina-completa-1440.png`, fullPage: true });
    await c.close();
  }

  qa.red = { peticionesHttpIntentadas: reqs.length, urls: reqs.slice(0, 10), nota: 'Se abortó todo http(s); la página solo usa file://.' };
  qa.limites = ['Viewport emulado, no dispositivo móvil real: no prueba táctil.', 'Un solo motor (Chromium headless); no se probó Firefox ni Safari.', 'Contraste calculado desde estilos computados sobre fondo sólido efectivo; no cubre estados hover transitorios.', 'No es una auditoría con lector de pantalla.', 'Sin Lighthouse; el peso se midió por archivo.'];
  fs.writeFileSync(ROOT + '/QA.json', JSON.stringify(qa, null, 1));
  console.log(JSON.stringify({ chromium: qa.chromium, errores: qa.errores, red: qa.red.peticionesHttpIntentadas, contrasteFallan: qa.contraste.fallan.map(x => [x.ejemplo, x.ratio, x.minimo]), resp: qa.responsive.map(r => [r.ancho, r.sinScrollHorizontal, r.ctaHeroTop, r.h1px, r.h1lines, r.overflowEls.length, r.objetivosMenores44.length]), fuentes: [qa.fuentes.archivoCargada, qa.fuentes.familiasUsadas, qa.fuentes.imagenesRotas], demo: [qa.demo[1440].ok, qa.demo[390].ok], tabs: [qa.tabs[1440].ok, qa.tabs[390].ok], faq: [qa.faq[1440].ok, qa.faq[390].ok], foco: [qa.foco[1440].enfocables, qa.foco[1440].sinAroVisible, qa.foco[390].enfocables, qa.foco[390].sinAroVisible], cta: qa.cta }, null, 1));
  await b.close();
})();

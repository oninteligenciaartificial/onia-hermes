/**
 * Pack referentes: carruseles con los patrones de los creadores que sigue Sergio Urcullo
 * (29-sep-2026). Nace de su crítica: los de community-editorial se veían «vacíos y con
 * demasiado texto» (pills, tarjetas, header y footer en cada lámina).
 *
 * Cada slide elige `layout`:
 *   logos      Bastian Xu: una palabra gigante espaciada + fila de logos oficiales con nombre. Con varias palabras en el
 *              título (`\n` = otra línea) se achica por medición; sin `file` en las marcas, van solo con su nombre.
 *   analogia   Bastian Xu: frase corta + imagen de objetos que explica sola (1 o 2 bloques).
 *   ensayo     Bastian Xu: texto grande sobre papel, sin cajas; párrafos cortos.
 *   ilustrado  Santiago Muñoz: título con énfasis de color, ilustración dominante, pie corto,
 *              flecha de continuidad manuscrita. Con `badge` sirve de portada.
 *   lista      Santiago Muñoz: título + 3–5 filas con ícono/logo, etiqueta y una línea.
 *   inventario @iampascio (10-oct): hasta 5 filas por lámina en grilla fija, sin tarjetas ni título, número en tinta
 *              continuo entre láminas; `center` y `ask` para la última lista y el remate.
 *   dato       Erik Taveras / Ingeniero Binario: una cifra gigante + qué significa.
 *   captura    Carlos Domínguez: captura real (pantalla, comando, prompt) como prueba.
 *   cierre     los 8 referentes: «Buscá PALABRA en Avisos» (o `pre` propio) + qué recibís.
 * La imagen la pinta Higgsfield SIN letras (scripts/carousel_images.mjs); el texto va acá.
 * Los logos son los oficiales de hermes-content/references/brand-claude/ (nunca recreados).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

function crear({ esc, emph, ACCOUNTS, BRAND, getFmt }) {
  const dataUrl = (p) => {
    if (!p) return '';
    const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
    if (!fs.existsSync(abs)) throw new Error(`pack referentes: no existe ${p}`);
    return `data:${MIME[path.extname(abs).toLowerCase()] || 'image/png'};base64,${fs.readFileSync(abs).toString('base64')}`;
  };
  const img = (p, cls) => (p ? `<img class="${cls}" src="${dataUrl(p)}" alt="">` : '');
  const paras = (t) => String(t || '').split(/\n\s*\n/).filter(Boolean).map((x) => `<p>${emph(x.trim())}</p>`).join('');

  // `logos` nació para UNA palabra gigante, espaciada y en mayúsculas (Bastian Xu): ese camino NO cambia (mismo marcado,
  // sin script) porque los briefs viejos salen igual. Con VARIAS palabras (P2 «7 herramientas. 4 son gratis.», 10-oct):
  //   - una línea por `\n` del título (`<span class="wl">`), sin letter-spacing ni mayúsculas;
  //   - el navegador MIDE la línea más ancha, ya con la fuente cargada, y achica la letra de a 3 px hasta que entra con el
  //     margen de la lámina (84 px): el mismo ajuste que `cierreHtml`;
  //   - sin ningún `file` en la fila, las marcas van solo con su nombre (clase `solo-nombres`): la fila se envuelve y se centra.
  function logosHtml(s) {
    const titulo = String(s.headline || '');
    const lineas = titulo.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
    const varias = /\S\s+\S/.test(lineas.join(' '));
    const logos = s.logos || [];
    const row = logos.map((l) => `<figure class="logo">${img(l.file, 'logo-img')}<figcaption>${esc(l.label || '')}</figcaption></figure>`).join('');
    const soloNombres = logos.length > 0 && !logos.some((l) => l.file);
    const h1 = varias
      ? `<h1 class="word multi">${lineas.map((x) => `<span class="wl">${esc(x)}</span>`).join('')}</h1>`
      : `<h1 class="word">${esc(titulo)}</h1>`;
    const fit = varias
      ? `<script>document.fonts.ready.then(function(){var h=document.querySelector('.c-logos .word');if(!h)return;`
        + `var ls=h.querySelectorAll('.wl'),max=document.documentElement.clientWidth-2*84,f=parseFloat(getComputedStyle(h).fontSize);`
        + `function w(){var m=0;ls.forEach(function(e){m=Math.max(m,e.getBoundingClientRect().width);});return m;}`
        + `h.style.whiteSpace='nowrap';while(w()>max&&f>60){f-=3;h.style.fontSize=f+'px';}});</script>`
      : '';
    return `<div class="c-logos">${h1}<div class="logo-row${soloNombres ? ' solo-nombres' : ''}">${row}</div>${s.body ? `<p class="under">${emph(s.body)}</p>` : ''}</div>${fit}`;
  }

  function analogiaHtml(s) {
    const blocks = s.blocks || [{ text: s.headline, image: s.image || s.bg }];
    return `<div class="c-analogia">${blocks.map((b) => `<section><h2>${emph(b.text || '')}</h2>${img(b.image, 'obj')}</section>`).join('')}${s.body ? `<p class="caption">${emph(s.body)}</p>` : ''}</div>`;
  }

  function ensayoHtml(s) {
    return `<div class="c-ensayo">${s.headline ? `<h2>${emph(s.headline)}</h2>` : ''}${paras(s.body)}</div>`;
  }

  function ilustradoHtml(s) {
    const badge = s.badge ? `<div class="badge">${esc(s.badge)}</div>` : '';
    const logo = s.logo ? img(s.logo, 'title-logo') : '';
    return `<div class="c-ilustrado">${badge}<h2 class="t">${logo}${emph(s.headline || '')}</h2>${s.subtitle ? `<p class="sub">${emph(s.subtitle)}</p>` : ''}<div class="art">${img(s.image || s.bg, 'art-img')}</div>${s.body ? `<p class="caption">${emph(s.body)}</p>` : ''}</div>`;
  }

  function listaHtml(s) {
    const rows = (s.items || []).map((it, i) => `<li>${it.icon ? img(it.icon, 'li-icon') : `<span class="li-n">${i + 1}</span>`}<div><b>${emph(it.label || '')}</b>${it.text ? `<span>${emph(it.text)}</span>` : ''}</div></li>`).join('');
    return `<div class="c-lista${(s.items || []).length >= 4 ? ' compacta' : ''}"><h2 class="t">${emph(s.headline || '')}</h2>${s.body ? `<p class="sub">${emph(s.body)}</p>` : ''}<ul>${rows}</ul></div>`;
  }

  // «Inventario continuo» (referencia DePPPp5FgMh, 10-oct): una lista larga de cosas del mismo tipo partida en
  // láminas con GRILLA FIJA. A diferencia de `lista` NO dibuja tarjetas, NO escribe título y usa un solo cuerpo
  // (44 px) para el nombre y la línea: la jerarquía sale del peso (800 / 400) y del color (tinta / gris).
  // La grilla va en % para que valga en `square`: marca a 17 % del ancho (10 % de lado), texto desde 32,5 %,
  // primera fila a 13 % del alto y paso de 16,5 %. Es la misma en todas las láminas: sobreponiendo la 2 y la 3
  // la x del ícono y del texto no se mueve.
  //   items[{icon | n, label, text}]  `icon` = logo oficial; sin él va el número en tinta (sin círculo, 800)
  //   start     primer número de la lámina (la numeración es CONTINUA entre láminas: 6, 7, 8…); `n` de la fila gana
  //   headline  opcional y de UN renglón; si falta no se dibuja nada
  //   center    centra el bloque en vertical (última lista con menos de 5 filas)
  //   ask       remate: aísla la última fila (el recurso) con aire y la une al cierre con una flecha Caveat;
  //             `true` o un texto corto que va junto a la flecha. Usarlo con `next: ""` (la flecha ya es esa)
  const INV = { top: 13, pitch: 16.5, row: 8, air: 7, arrow: 11.5, max: 5 }; // % del alto; `arrow` = aire + alto de la flecha del remate
  function inventarioHtml(s) {
    const items = s.items || [];
    if (items.length > INV.max) throw new Error(`pack referentes: inventario admite hasta ${INV.max} filas por lámina (grilla fija), llegaron ${items.length}`);
    const start = Number.isFinite(Number(s.start)) && s.start !== '' && s.start != null ? Number(s.start) : 1;
    const gap = s.ask && items.length > 1 ? INV.air : 0; // aire extra antes de la última fila
    const block = (items.length - 1) * INV.pitch + gap + INV.row + (gap ? INV.arrow : 0); // alto del bloque (con la flecha del remate)
    const top0 = s.center ? 50 - block / 2 : INV.top;
    const y = (i) => top0 + i * INV.pitch + (i === items.length - 1 ? gap : 0) + INV.row / 2; // centro de la fila i
    const rows = items.map((it, i) => {
      const mark = it.icon ? img(it.icon, 'inv-icon') : esc(String(it.n != null ? it.n : start + i));
      return `<div class="inv-row" style="top:${y(i).toFixed(2)}%"><div class="inv-mark">${mark}</div><div class="inv-txt"><b>${emph(it.label || '')}</b>${it.text ? `<span>${emph(it.text)}</span>` : ''}</div></div>`;
    }).join('');
    const arrow = s.ask && items.length
      ? `<div class="inv-ask" style="top:${(y(items.length - 1) + INV.row / 2 + 2.5).toFixed(2)}%">${typeof s.ask === 'string' ? `<span>${esc(s.ask)}</span>` : ''}<svg viewBox="0 0 645 120"><path d="M6 24 C 150 118, 330 -10, 596 76 M562 52 L598 78 L556 96"/></svg></div>`
      : '';
    return `<div class="c-inv${s.center ? ' centrada' : ''}">${s.headline ? `<h2 class="inv-t">${emph(s.headline)}</h2>` : ''}${rows}${arrow}</div>`;
  }

  // Erik Taveras / Ingeniero Binario: el número ES la lámina.
  function datoHtml(s) {
    const v = String(s.value || '');
    // 420 px para 1-3 caracteres; más largo se achica para no partir la cifra en dos líneas
    const size = v.length <= 3 ? 420 : Math.max(170, Math.round(1300 / v.length));
    return `<div class="c-dato"><div class="big" style="font-size:${size}px">${esc(v)}</div><h2 class="t">${emph(s.headline || '')}</h2>${s.body ? `<p class="sub2">${emph(s.body)}</p>` : ''}</div>`;
  }

  // Carlos Domínguez: la prueba es la pantalla real (captura, comando, prompt), no un dibujo.
  function capturaHtml(s) {
    return `<div class="c-captura">${s.headline ? `<h2 class="t">${emph(s.headline)}</h2>` : ''}<figure class="shot">${img(s.image, 'shot-img')}</figure>${s.body ? `<p class="caption">${emph(s.body)}</p>` : ''}</div>`;
  }

  // Los 8 referentes cierran igual: una palabra para comentar y qué recibís.
  // Contar letras no alcanza: COMUNIDAD (9 letras anchas) se salía por los dos lados y ESQUELETO quedaba a 14 px
  // del borde (QA del 3-oct), mientras ANTIGRAVITY (11) se había salido el 2-oct. Ahora el navegador MIDE la
  // pastilla ya con la fuente cargada y achica la letra hasta que entre con el margen de la lámina (84 px).
  // La cuenta por letras queda sólo como primer tamaño, para que el ajuste dé pocos pasos.
  function cierreHtml(s) {
    const kw = String(s.keyword || '');
    const kwSize = [...kw].length > 9 ? ` style="font-size:${Math.round(1350 / [...kw].length)}px"` : '';
    const fit = `<script>document.fonts.ready.then(function(){var k=document.querySelector('.c-cierre .kw');if(!k)return;`
      + `var max=document.documentElement.clientWidth-2*84,f=parseFloat(getComputedStyle(k).fontSize);`
      + `k.style.whiteSpace='nowrap';k.style.display='inline-block';`
      + `while(k.getBoundingClientRect().width>max&&f>60){f-=3;k.style.fontSize=f+'px';}});</script>`;
    // `pre` cambia el verbo de arriba y `kicker` suma una frase corta arriba del verbo.
    // Desde el 10-oct el verbo por defecto es «Buscá» («Buscá X en Avisos · link en mi perfil»): «Comentá X y te paso el
    // link» promete un DM automático que no está probado (Meta rechazó 2 veces ese mecanismo, CLAUDE.md). Un brief que
    // todavía quiera «Comentá» lo pide con `"pre": "Comentá"`; los 19 briefs que lo usaban lo llevan escrito.
    const pre = s.pre != null ? String(s.pre) : 'Buscá';
    const kicker = s.kicker ? `<p class="kick">${emph(String(s.kicker))}</p>` : '';
    return `<div class="c-cierre">${kicker}<p class="pre">${esc(pre)}</p><div class="kw"${kwSize}>${esc(kw)}</div><p class="sub2">${emph(s.body || '')}</p></div>${fit}`;
  }

  const LAYOUTS = { logos: logosHtml, analogia: analogiaHtml, ensayo: ensayoHtml, ilustrado: ilustradoHtml, lista: listaHtml, inventario: inventarioHtml, dato: datoHtml, captura: capturaHtml, cierre: cierreHtml };

  return function referentesHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const layout = slide.layout || (idx === 0 ? 'ilustrado' : 'ensayo');
    const theme = slide.theme || (args && args.theme) || 'blanco';
    const fonts = (args && args.fonts) || 'referentes';
    if (!['blanco', 'verde', 'negro'].includes(theme)) throw new Error(`pack referentes: theme desconocido «${theme}» (blanco|verde|negro)`);
    const render = LAYOUTS[layout];
    if (!render) throw new Error(`pack referentes: layout desconocido «${layout}» (${Object.keys(LAYOUTS).join('|')})`);
    const serie = slide.tag || (args && args.serie) || '';
    const tag = serie ? `<div class="tag">${String(idx + 1).padStart(2, '0')}/${String(total).padStart(2, '0')} · ${esc(serie)}</div>` : '';
    const next = idx < total - 1 && slide.next !== '' ? `<div class="next">${esc(slide.next || 'seguí')} <svg viewBox="0 0 90 30"><path d="M3 18 C 25 8, 50 26, 80 14 M68 5 L82 14 L70 24"/></svg></div>` : '';
    const cta = slide.cta ? `<div class="cta-btn">${emph(slide.cta)}</div>` : '';
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const bricolage = dataUrl('hermes-content/brand/fonts/BricolageGrotesque-var-latin.woff2');

    return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Caveat:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,800&family=DM+Mono:wght@500&family=Instrument+Serif&display=swap" rel="stylesheet">
<style>
${tokens}
@font-face{font-family:'Bricolage';src:url(${bricolage}) format('woff2');font-weight:200 800}
/* Paleta de Sergio Urcullo (29-sep): verde ONIA dominante + blanco + negro. Tokens de
   hermes-content/brand/tokens.css. El verde eléctrico (#10C26B) NO va como texto sobre blanco
   (contraste 2,2:1): ahí el texto verde usa el profundo (#0B8F4F) y el eléctrico va de relleno. */
.t-blanco{--paper:#FFFFFF;--ink:#0A0F0D;--soft:#4F5A55;--acc:#0B8F4F;--mark:#10C26B;--mark-ink:#0A0F0D;--card:#FFFFFF;--arrow:#0B8F4F;--blend:multiply}
.t-verde{--paper:#10C26B;--ink:#0A0F0D;--soft:#0B3B24;--acc:#0A0F0D;--mark:#FFFFFF;--mark-ink:#0A0F0D;--card:#FFFFFF;--arrow:#0A0F0D;--blend:multiply}
.t-negro{--paper:#0A0F0D;--ink:#FFFFFF;--soft:#9FB0A8;--acc:#10C26B;--mark:#10C26B;--mark-ink:#0A0F0D;--card:#1C2622;--arrow:#10C26B;--blend:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${FMT.w}px;height:${FMT.h}px;overflow:hidden}
body{margin:0;font-family:'DM Sans',system-ui,sans-serif}
.slide{position:relative;width:100%;height:100%;padding:84px 84px 96px;display:flex;flex-direction:column;background:var(--paper);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif}
.slide:before{content:'';position:absolute;inset:0;opacity:.18;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .42 0 0 0 0 .36 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.slide > *{position:relative}
.main{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:safe center;padding-bottom:40px}
.g{color:var(--acc);font-weight:inherit;background:none;padding:0;box-shadow:inset 0 -.16em 0 var(--mark)}
.t-verde .g{box-shadow:inset 0 -.34em 0 var(--mark)}
.t-negro .g{box-shadow:none}
.tag{align-self:flex-start;font-family:'DM Mono',monospace;font-size:21px;letter-spacing:1.5px;text-transform:uppercase;border:2px solid var(--ink);border-radius:8px;padding:8px 14px;margin-bottom:34px}
.handle{position:absolute;left:84px;bottom:42px;font-family:'DM Mono',monospace;font-size:20px;color:var(--soft)}
.next{position:absolute;right:84px;bottom:30px;display:flex;align-items:center;gap:10px;font-family:'Caveat',cursive;font-size:40px;color:var(--arrow)}
.next svg{width:90px;height:30px;fill:none;stroke:var(--arrow);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.t{font-family:'Bricolage',sans-serif;font-weight:750;font-size:92px;line-height:.98;letter-spacing:-2.5px;text-wrap:balance}
.sub{font-family:'Caveat',cursive;font-size:48px;color:var(--soft);margin-top:14px}
.caption{font-size:42px;line-height:1.3;text-align:center;color:var(--ink);max-width:880px;margin:0 auto;text-wrap:balance}
.cta-btn{align-self:flex-start;margin-top:48px;background:var(--ink);color:var(--paper);border-radius:999px;padding:22px 40px;font-weight:800;font-size:32px;letter-spacing:.5px}
.cta-btn .g{color:var(--mark);box-shadow:none}
/* Letra de la marca ONIA (decisión de Sergio, 29-sep, vía la sesión de onia-platform):
   Instrument Sans (titulares 500-600, tracking -2 %, nunca 700) + IBM Plex Mono (etiquetas, números). */
.f-marca,.f-marca p,.f-marca .caption,.f-marca .sub2,.f-marca .under,.f-marca .logo figcaption{font-family:'Instrument Sans',sans-serif}
.f-marca .t,.f-marca .word,.f-marca .c-ensayo h2,.f-marca .c-analogia h2,.f-marca .c-dato .big,.f-marca .c-cierre .kw,.f-marca .c-lista b,.f-marca .cta-btn{font-family:'Instrument Sans',sans-serif;font-weight:600;letter-spacing:-.02em}
.f-marca .c-ensayo p{font-weight:500}
.f-marca .tag,.f-marca .handle,.f-marca .next,.f-marca .sub,.f-marca .badge,.f-marca .c-cierre .pre,.f-marca .li-n{font-family:'IBM Plex Mono',monospace}
.f-marca .next,.f-marca .sub{font-size:26px;letter-spacing:.02em}.f-marca .badge{font-size:26px;text-transform:uppercase}.f-marca .c-cierre .pre{font-size:34px;text-transform:uppercase;letter-spacing:.1em}.f-marca .li-n{font-size:30px}
/* logos */
.c-logos{display:flex;flex-direction:column;align-items:center;gap:64px}
.word{font-family:'Bricolage',sans-serif;font-weight:800;font-size:150px;letter-spacing:.2em;margin-right:-.2em;text-transform:uppercase;text-align:center;line-height:1}
.logo-row{display:flex;gap:44px;justify-content:center;flex-wrap:wrap}
.logo{display:flex;flex-direction:column;align-items:center;gap:14px}
.logo-img{width:200px;height:200px;object-fit:contain;padding:36px;background:#FFFFFF;border-radius:46px;box-shadow:0 1px 0 rgba(10,15,13,.08),0 14px 30px oklch(40% 0.02 85 / .16)}
.logo figcaption{font-family:'Instrument Serif',Georgia,serif;font-size:40px}
/* logos con varias palabras (P2, 10-oct): sin espaciado ni mayúsculas, una línea por \n, ajustada por medición (ver logosHtml) */
.word.multi{letter-spacing:-.025em;margin-right:0;text-transform:none;line-height:1.02}
.wl{display:block;width:max-content;margin:0 auto}
/* sin logos: solo nombres, centrados y envueltos en filas parejas */
.c-logos:has(.solo-nombres){gap:124px}
.logo-row.solo-nombres{gap:40px 54px;max-width:100%}
.solo-nombres .logo figcaption{font-size:46px;line-height:1.1;white-space:nowrap}
.solo-nombres + .under{font-size:56px;max-width:none}
.under{font-size:42px;color:var(--soft);text-align:center;max-width:800px}
/* analogia */
.c-analogia{display:flex;flex-direction:column;justify-content:center;gap:40px}
.c-analogia section{display:flex;flex-direction:column;align-items:center;gap:22px}
.c-analogia h2{font-weight:800;font-size:54px;letter-spacing:-1px;text-align:center;line-height:1.05}
.c-analogia .obj{width:100%;max-height:440px;object-fit:contain;mix-blend-mode:var(--blend)}
/* ensayo */
.c-ensayo{display:flex;flex-direction:column;gap:36px;max-width:920px}
.c-ensayo h2{font-family:'Bricolage',sans-serif;font-weight:800;font-size:104px;line-height:1;letter-spacing:-3px;margin-bottom:6px}
.c-ensayo p{font-weight:600;font-size:56px;line-height:1.18;letter-spacing:-.5px}
/* ilustrado */
.c-ilustrado{flex:1;display:flex;flex-direction:column;min-height:0}
.c-ilustrado .t{display:flex;flex-wrap:wrap;align-items:center;column-gap:.25em}
.title-logo{height:.8em;width:auto}
.badge{position:absolute;right:-6px;top:-40px;width:150px;height:150px;border-radius:50%;background:var(--ink);color:var(--paper);display:flex;align-items:center;justify-content:center;font-family:'Caveat',cursive;font-size:46px;transform:rotate(12deg)}
.art{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;margin:10px -84px}
.art-img{width:100%;height:100%;object-fit:cover;mix-blend-mode:var(--blend);-webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 50%,#000 45%,transparent 78%);mask-image:radial-gradient(ellipse 62% 58% at 50% 50%,#000 45%,transparent 78%)}
.t-blanco .art-img{filter:brightness(1.07) contrast(1.04)}
/* lista */
.c-lista{display:flex;flex-direction:column}
.c-lista ul{list-style:none;display:flex;flex-direction:column;gap:28px;margin-top:56px}
.c-lista li{display:flex;align-items:center;gap:32px;border:3px solid var(--ink);border-radius:26px;padding:34px 36px;background:var(--card);color:#0A0F0D}
.t-negro .c-lista li{color:#FFFFFF}
.t-negro .c-lista li span{color:var(--soft)}
.c-lista li span{color:#4F5A55}
.li-icon{width:96px;height:96px;object-fit:contain;flex:none}
.li-n{flex:none;width:84px;height:84px;border-radius:50%;background:var(--mark);color:var(--mark-ink);display:flex;align-items:center;justify-content:center;font-family:'Caveat',cursive;font-size:56px}
.c-lista li div{display:flex;flex-direction:column;gap:4px}
.c-lista b{font-size:50px;font-weight:800;letter-spacing:-.5px}
.c-lista li span{font-size:40px;color:var(--soft)}
/* inventario: grilla fija en % (receta DePPPp5FgMh). La capa ocupa TODA la lámina: el .main deja de ser el ancla */
.l-inventario .main{position:static;padding:0}
.c-inv{position:absolute;inset:0}
.inv-t{position:absolute;left:84px;right:84px;top:84px;font-family:'Bricolage',sans-serif;font-weight:750;font-size:60px;line-height:1;letter-spacing:-1.5px}
.inv-row{position:absolute;left:0;right:0;transform:translateY(-50%);display:flex;align-items:center;padding:0 84px 0 32.5%}
.inv-mark{position:absolute;left:17%;top:50%;width:10%;aspect-ratio:1;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;font-family:'DM Sans',system-ui,sans-serif;font-weight:800;font-size:76px;line-height:1;color:var(--ink)}
.inv-icon{width:100%;height:100%;object-fit:contain}
.inv-txt{font-size:44px;line-height:1.18}
.inv-txt b{display:block;font-weight:800;color:var(--ink);letter-spacing:-.3px}
.inv-txt span{display:block;font-weight:400;color:var(--soft)}
.inv-ask{position:absolute;left:32.5%;right:84px;display:flex;flex-direction:column;color:var(--arrow);font-family:'Caveat',cursive;font-size:48px}
.inv-ask svg{width:100%;height:120px;fill:none;stroke:var(--arrow);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;flex:none}
/* dato */
.c-dato .big{font-family:'Bricolage',sans-serif;font-weight:800;font-size:420px;line-height:.82;letter-spacing:-.015em;white-space:nowrap;color:var(--acc);margin-bottom:28px}
.t-blanco .c-dato .big{color:#0A0F0D;text-shadow:12px 12px 0 var(--mark)}
.sub2{font-size:44px;line-height:1.25;color:var(--soft);margin-top:22px;max-width:900px}
/* captura */
.c-captura{display:flex;flex-direction:column;gap:34px}
.shot{border:3px solid var(--ink);border-radius:24px;overflow:hidden;background:#FFFFFF;box-shadow:0 18px 40px rgba(10,15,13,.18)}
.shot-img{display:block;width:100%;max-height:760px;object-fit:contain}
/* cierre */
.c-cierre{display:flex;flex-direction:column;align-items:center;text-align:center}
.c-cierre .kick{font-family:'Bricolage',sans-serif;font-weight:700;font-size:58px;line-height:1.1;margin:0 0 44px;max-width:860px;text-wrap:balance}
.c-cierre .pre{font-family:'Caveat',cursive;font-size:72px;color:var(--soft)}
.c-cierre .kw{font-family:'Bricolage',sans-serif;font-weight:800;font-size:170px;letter-spacing:.06em;line-height:1;background:var(--mark);color:var(--mark-ink);padding:26px 50px 34px;border-radius:28px;margin:10px 0 18px}
.compacta ul{gap:18px;margin-top:40px}.compacta li{padding:20px 30px}.compacta b{font-size:42px}.compacta li span{font-size:34px}.compacta .li-n{width:68px;height:68px;font-size:46px}.compacta .li-icon{width:76px;height:76px}
</style></head><body>
<div class="slide l-${layout} t-${theme}${fonts === 'marca' ? ' f-marca' : ''}">${tag}<main class="main">${render(slide)}${cta}</main><div class="handle">${esc(acc.handle)}</div>${next}</div>
</body></html>`;
  };
}

module.exports = { crear };

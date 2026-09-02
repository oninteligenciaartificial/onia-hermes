/**
 * Pack `historia-fancy` — historia 9:16 editorial, construida SOBRE una foto de Lucía.
 *
 * Nace de una correccion de Sergio (2026-09-02): *"tus diseños no los hagas pobres,
 * Lucia es fancy"*. El pack `historia-quiz` que hice antes estaba copiado de
 * @ingenierobinario —un canal de PROGRAMACION—: fondo negro plano, ventana de terminal,
 * bloque de color. Eso funciona para un dev; para una influencer es pobre, porque no
 * tiene nada de ella: ni su cara, ni luz, ni aire.
 *
 * Las cinco decisiones, y por que cada una:
 *
 * 1. LA FOTO ES EL DISEÑO, a sangre completa. Lucia tiene fotos 9/9 fancy que estaban
 *    sin usar (`E3-cafe`, `E3-hotel`, `E2-B-rooftop`). Una historia de una influencer
 *    sin su cara es una placa de texto: no la sigue nadie. El fondo plano era el error.
 *
 * 2. LEGIBILIDAD POR DEGRADADO, NO POR CAJA. Una caja opaca tapa la foto y devuelve el
 *    problema del bloque plano. Dos degradados —uno arriba, uno abajo— dejan la piel y
 *    la luz visibles y aun asi sostienen texto blanco. Es lo que hace toda la prensa
 *    de moda.
 *
 * 3. SERIF DISPLAY GRANDE para la pregunta, no sans en negrita. La escala y el remate
 *    son lo que separa "editorial" de "plantilla". Fraunces a 92px con interletrado
 *    negativo.
 *
 * 4. EL VERDE CASI NO APARECE: un filete de 3px y, si acaso, una palabra. En una pieza
 *    con foto, un bloque verde saturado grita "banner". La regla de `bloque-solido`
 *    (un solo acento) se vuelve aca "un solo acento, y chico".
 *
 * 5. EL HUECO INFERIOR SIGUE INTACTO. Es la unica cosa que se conserva del pack
 *    anterior, porque es lo que hace funcionar al formato: ahi va el sticker NATIVO de
 *    encuesta, que se responde con UN toque. Las opciones NUNCA se dibujan.
 *
 * Campos del brief: `photo` (ruta relativa al repo), `kicker`, `overline` (contexto
 * corto, opcional), `headline` (la pregunta), `options[]` (NO se dibujan).
 */

const fs = require('fs');
const path = require('path');

// La foto viaja embebida en base64: el HTML se renderiza sin servidor y una ruta
// relativa no resuelve. Es la misma razon por la que los otros packs usan assetUrl.
function dataUri(rel) {
  const abs = path.resolve(rel);
  if (!fs.existsSync(abs)) throw new Error('No existe la foto del brief: ' + abs);
  const ext = path.extname(abs).toLowerCase() === '.png' ? 'png' : 'jpeg';
  return `data:image/${ext};base64,` + fs.readFileSync(abs).toString('base64');
}

function crear({ esc, roleFor, ACCOUNTS, BRAND, getFmt }) {
  return function historiaFancyHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const pad = Math.round(FMT.w * 0.085);

    const foto = slide.photo || (args && args.photo);
    if (!foto) throw new Error('El pack historia-fancy necesita `photo` en la lamina o --photo.');
    const src = dataUri(foto);
    const last = idx === total - 1;

    // CTA y "deslizá" existen SOLO en carrusel de feed. En historia el hueco inferior
    // tiene que quedar limpio para el sticker nativo — dibujar ahí rompe el formato.
    const textoCta = slide.cta || (args && args.cta) || '';
    const cta = (total > 1 && last && textoCta)
      ? `<div class="boton">${esc(textoCta)}</div>` : '';
    const swipe = (total > 1 && !last) ? '<span class="swipe">DESLIZÁ →</span>' : '';

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  background:#0B0A09; }

/* 1 · la foto ES el diseño */
.foto { position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; object-position:center 28%; }

/* 2 · legibilidad por degradado, no por caja: la piel y la luz siguen viendose */
.velo-arriba { position:absolute; top:0; left:0; right:0; height:46%;
  background:linear-gradient(180deg, rgba(8,7,6,.86) 0%, rgba(8,7,6,.55) 42%, rgba(8,7,6,0) 100%); }
.velo-abajo { position:absolute; bottom:0; left:0; right:0; height:34%;
  background:linear-gradient(0deg, rgba(8,7,6,.88) 0%, rgba(8,7,6,.45) 50%, rgba(8,7,6,0) 100%); }

.capa { position:absolute; inset:0; padding:${pad}px;
  display:flex; flex-direction:column; }

/* etiqueta chica en mono: da tono editorial y ocupa poco */
.kicker { font-family:'JetBrains Mono',ui-monospace,monospace; font-weight:500;
  font-size:24px; letter-spacing:5px; text-transform:uppercase;
  color:rgba(247,244,238,.72); margin-top:${Math.round(pad * 0.5)}px; }

/* 4 · el verde, chico: un filete. Nunca un bloque sobre foto. */
.filete { width:74px; height:3px; background:var(--onia-green,#00D26A);
  margin:22px 0 26px; border-radius:2px; }

/* contexto: sans, discreto, deja que el serif mande */
.overline { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif; font-weight:400;
  font-size:34px; line-height:1.42; color:rgba(247,244,238,.82); max-width:82%;
  text-shadow:0 2px 18px rgba(0,0,0,.55); }

/* 3 · el serif display es lo que separa editorial de plantilla */
.pregunta { font-family:'Fraunces',Georgia,'Times New Roman',serif; font-weight:700;
  font-size:92px; line-height:1.03; letter-spacing:-2.5px; color:#F7F4EE;
  margin-top:26px; max-width:94%; text-wrap:balance;
  text-shadow:0 4px 30px rgba(0,0,0,.5); }
.pregunta em { font-style:italic; font-weight:600; color:var(--onia-green,#00D26A); }

/* 5 · EL HUECO: en historia aca va el sticker nativo de encuesta. No dibujar nada. */
.hueco { flex:1; min-height:${Math.round(FMT.h * 0.3)}px; }

/* Solo en carrusel de feed: el CTA de la ultima lamina y la pista de deslizar.
   En historia no aparecen — el hueco tiene que quedar limpio para el sticker. */
.boton { align-self:flex-start; font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif;
  font-weight:500; font-size:34px; color:#052A1D;
  background:var(--onia-green,#00D26A); padding:22px 38px; border-radius:999px;
  margin-bottom:26px; }
.swipe { position:absolute; right:${pad}px; bottom:${pad}px;
  font-family:'JetBrains Mono',ui-monospace,monospace; font-weight:500; font-size:24px;
  letter-spacing:3px; color:rgba(247,244,238,.8);
  text-shadow:0 2px 12px rgba(0,0,0,.6); }

.firma { display:flex; align-items:center; gap:16px; }
.firma .mark { width:42px; height:42px; }
.firma .handle { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif;
  font-weight:500; font-size:27px; color:rgba(247,244,238,.9);
  text-shadow:0 2px 12px rgba(0,0,0,.6); }
</style></head>
<body><div class="slide ${role}">
  <img class="foto" src="${src}" alt="">
  <div class="velo-arriba"></div>
  <div class="velo-abajo"></div>
  ${swipe}
  <div class="capa">
    ${slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : ''}
    <div class="filete"></div>
    ${slide.overline ? `<p class="overline">${esc(slide.overline)}</p>` : ''}
    <h1 class="pregunta">${esc(slide.headline)}</h1>
    <div class="hueco"></div>
    ${cta}
    <div class="firma">
      <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="43" stroke="#F7F4EE" stroke-width="13" fill="none"/>
        <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green,#00D26A)" stroke-width="13" fill="none" stroke-linecap="round"/>
        <circle cx="98" cy="43" r="11" fill="var(--onia-green,#00D26A)"/>
        <circle cx="98" cy="43" r="4.5" fill="#F7F4EE"/>
      </svg>
      <span class="handle">${esc(acc.handle)}</span>
    </div>
  </div>
</div></body></html>`;
  };
}

module.exports = { crear };

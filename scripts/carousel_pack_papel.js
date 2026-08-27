/**
 * Pack `papel-subrayado` — la lamina calida, para carruseles de MNEMOTECNIA.
 *
 * Portado de la ficha Q04 (IG DcYltt_IK30, lote 2026-08-24). El original agrupa 20
 * herramientas de marketing en cinco "vitaminas" por letra inicial. Una lista de 20
 * cosas es ilegible; agrupada en cinco grupos se recuerda. **La restriccion arbitraria
 * es lo que vuelve memorable el contenido**, no el diseño.
 *
 * Dos cosas que el molde exige y son faciles de romper:
 *
 *  1. La plantilla es IDENTICA en todas las laminas. A la tercera, el ojo deja de leer
 *     la estructura y va directo a lo que cambia. Variar el layout mata el efecto.
 *  2. El original mete tarjetitas de metrica (+15%, +120%, -15%) SIN FUENTE: es textura
 *     de credibilidad. Eso NO se copia — para nosotros seria fabricar, y con cero
 *     clientes pagando esta prohibido.
 *
 * Es el opuesto exacto de `dark-product`: calido, imperfecto y artesanal en vez de frio
 * y disciplinado. Los dos funcionan; no en la misma pieza.
 *
 * El brief declara por lamina: `letra`, `headline`, `body` y `items[]` (4, con
 * `{rotulo, nota}` o texto suelto).
 */

const fs = require('fs');
const path = require('path');

// Rotan por lamina. Son colores de resaltador, apagados a proposito: el papel es hueso
// y un fluor encima lo vuelve digital, que es lo contrario de lo que busca el molde.
const SUBRAYADOS = ['#2E9E5B', '#D9722E', '#3A6EA5', '#C2557A', '#7B5EA7'];

/**
 * Trazo de resaltador hecho a mano. Tres curvas distintas que rotan: un subrayado
 * perfectamente igual al anterior delata la plantilla y mata lo artesanal.
 */
function trazo(color, i) {
  const formas = [
    'M2,14 C60,6 140,17 198,9 C240,4 280,13 318,8',
    'M2,11 C70,17 150,5 210,13 C255,18 285,7 318,12',
    'M2,13 C55,8 130,15 190,7 C245,2 285,15 318,9',
  ];
  return '<svg class="trazo" viewBox="0 0 320 20" preserveAspectRatio="none"'
    + ' xmlns="http://www.w3.org/2000/svg"><path d="' + formas[i % formas.length] + '"'
    + ' stroke="' + color + '" stroke-width="13" stroke-linecap="round" fill="none" opacity=".42"/></svg>';
}

// Grano de papel. Sin el, el fondo plano delata la plantilla y se pierde lo artesanal,
// que es justamente el punto del molde.
const GRANO = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.36'/%3E%3C/svg%3E\")";

function crear({ esc, emph, roleFor, ACCOUNTS, BRAND, getFmt }) {
  return function papelSubrayadoHtml(slide, idx, total, account) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const tinta = SUBRAYADOS[idx % SUBRAYADOS.length];
    const pad = Math.round(FMT.w * 0.085);

    const items = Array.isArray(slide.items) ? slide.items.slice(0, 4) : [];
    const grilla = items.length
      ? '<div class="grilla">' + items.map(function (it, i) {
        const rotulo = typeof it === 'string' ? it : (it.rotulo || '');
        const nota = (typeof it === 'object' && it.nota) ? '<p class="nota">' + esc(it.nota) + '</p>' : '';
        return '<div class="celda"><span class="rot">' + esc(rotulo)
          + trazo(SUBRAYADOS[(idx + i + 1) % SUBRAYADOS.length], i) + '</span>' + nota + '</div>';
      }).join('') + '</div>'
      : '';

    const letra = slide.letra
      ? '<div class="letra" style="color:' + tinta + '">' + esc(slide.letra) + '</div>' : '';
    const tag = role === 'cover' ? 'h1' : 'h2';

    return '<!doctype html><html><head><meta charset="utf-8">'
      + '<link rel="preconnect" href="https://fonts.googleapis.com">'
      + '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">'
      + '<style>' + tokens + `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${FMT.w}px;height:${FMT.h}px}
.slide{width:${FMT.w}px;height:${FMT.h}px;position:relative;overflow:hidden;
  background:#F2F0E9;color:#241F1A;font-family:'Inter',sans-serif;
  padding:${pad}px;display:flex;flex-direction:column}
.slide::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:${GRANO}}
.slide > *{position:relative;z-index:2}

.kicker{font-size:23px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
  color:#8A8175;display:flex;align-items:center;gap:12px}
.kicker::before{content:"";width:11px;height:11px;border-radius:50%;background:${tinta}}

.letra{font-family:'Fraunces',serif;font-weight:700;font-size:${Math.round(FMT.w * 0.28)}px;
  line-height:.82;margin-top:${Math.round(FMT.h * 0.015)}px;letter-spacing:-.04em}

h1,h2{font-family:'Fraunces',serif;font-weight:700;letter-spacing:-.015em;
  font-size:${Math.round(FMT.w * 0.078)}px;line-height:1.06;margin-top:14px}
.sub{font-size:30px;line-height:1.45;color:#5D554B;margin-top:16px;max-width:26ch}

/* Grilla 2x2 IDENTICA en todas las laminas: es lo que hace que a la tercera el ojo
   vaya directo a lo que cambia. Variarla rompe el molde. */
.grilla{display:grid;grid-template-columns:1fr 1fr;
  gap:${Math.round(FMT.h * 0.032)}px ${Math.round(FMT.w * 0.055)}px;
  margin-top:auto;margin-bottom:${Math.round(FMT.h * 0.028)}px}
.celda .rot{position:relative;display:inline-block;font-family:'Fraunces',serif;
  font-weight:500;font-size:37px;line-height:1.2;padding:0 2px 4px}
.celda .trazo{position:absolute;left:-6px;right:-6px;bottom:-4px;
  width:calc(100% + 12px);height:20px;z-index:-1}
.celda .nota{font-size:23px;line-height:1.4;color:#6B6257;margin-top:9px}

.pie{display:flex;justify-content:space-between;align-items:center;
  border-top:2px solid #DAD5CA;padding-top:22px;font-size:24px;color:#8A8175}
.pie .handle{font-weight:600;color:#4A423A}
.g{position:relative;display:inline-block}
.g::after{content:"";position:absolute;left:-4px;right:-4px;bottom:2px;height:14px;
  background:${tinta};opacity:.28;z-index:-1;border-radius:3px}
</style></head><body><div class="slide ${role}">`
      + (slide.pill ? '<div class="kicker">' + esc(slide.pill) + '</div>' : '')
      + letra
      + '<' + tag + '>' + emph(slide.headline || '') + '</' + tag + '>'
      + (slide.body ? '<p class="sub">' + emph(slide.body) + '</p>' : '')
      + grilla
      + '<div class="pie"><span class="handle">' + esc(acc.handle) + '</span>'
      + '<span>' + (idx + 1) + ' / ' + total + '</span></div>'
      + '</div></body></html>';
  };
}

module.exports = { crear, SUBRAYADOS, trazo };

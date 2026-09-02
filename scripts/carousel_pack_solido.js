/**
 * Pack `bloque-solido` — fondo de color plano + una TARJETA que sostiene el mensaje.
 *
 * Pedido de Sergio (2026-09-01): *"prueba colocar componentes como claude, un color solido
 * con elementos y diferentes tipografias"*.
 *
 * Las cuatro decisiones, y por que:
 *
 * 1. FONDO PLANO, SIN DEGRADADO NI TEXTURA. Un color liso es lo que menos se parece a lo
 *    que ya hay en un feed — casi todo es foto o degradado. El contraste no lo da un
 *    adorno: lo da la ausencia de adorno.
 *
 * 2. EL MENSAJE VA EN UNA TARJETA, no suelto sobre el fondo. La tarjeta es el "componente":
 *    superficie clara con esquinas redondeadas y sombra larga, apoyada sobre el color. Eso
 *    crea PROFUNDIDAD sin usar una foto, que es justo lo que le faltaba a `typographic`
 *    — texto flotando en negro, sin capas.
 *
 * 3. TRES TIPOGRAFIAS CON TRES OFICIOS, no tres por decorar:
 *      · mono en versalitas  -> la etiqueta (dato frio, se lee primero y ocupa poco)
 *      · serif display       -> el gancho (es lo unico que tiene que emocionar)
 *      · sans               -> el cuerpo (se lee rapido y no compite)
 *    La regla es la misma del pack `dato-ilustrado`: un salto de jerarquia cambia MUCHO
 *    un eje, no un poco cinco ejes. Aca cambian familia Y escala a la vez.
 *
 * 4. EL VERDE SE USA UNA SOLA VEZ, en el boton. Si el acento esta en todos lados deja de
 *    ser acento. El fondo es verde profundo —marca, no neon— y el boton es el verde vivo:
 *    el unico punto saturado de la pieza, y esta justo donde queremos el clic.
 *
 * El brief declara por lamina: `kicker` (etiqueta), `headline`, `body`. El `cta` se lee del
 * brief a nivel raiz, igual que en los otros packs.
 */

const fs = require('fs');
const path = require('path');

function crear({ esc, emph, roleFor, ACCOUNTS, BRAND, getFmt }) {
  return function bloqueSolidoHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const last = idx === total - 1;
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const pad = Math.round(FMT.w * 0.075);

    // Verde profundo de marca para el fondo; el verde vivo queda reservado al boton.
    const fondo = (args && args.fondo) || '#0B3D2C';

    const kicker = slide.kicker
      ? `<span class="etiqueta">${esc(slide.kicker)}</span>` : '';
    const body = slide.body ? `<p class="cuerpo">${emph(slide.body)}</p>` : '';
    // El boton va en la ULTIMA lamina, sea o no de rol `cta`.
    //
    // ⚠️ Antes decia `role !== 'cta' && last`, pensado para el caso de UNA sola lamina.
    // Efecto real: en un carrusel de 5, `roleFor` marca la ultima como 'cta' y el boton
    // NO se dibujaba — justo en la lamina que existe para pedir la accion. Lo encontro
    // Sergio el 2026-09-02 mirando el render.
    const cta = (last && slide.cta)
      ? `<div class="boton">${esc(slide.cta)}</div>` : '';

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  background:${fondo}; padding:${pad}px;
  display:flex; flex-direction:column; justify-content:center; }

/* La tarjeta: la superficie clara que sostiene todo. Sombra larga y suave para que
   se apoye sobre el color en vez de estar pegada encima. */
.tarjeta { background:#F7F4EE; border-radius:44px; padding:${Math.round(pad * 1.15)}px;
  box-shadow:0 48px 90px rgba(0,0,0,.28), 0 4px 0 rgba(255,255,255,.55) inset;
  display:flex; flex-direction:column; align-items:flex-start; gap:26px; }

/* 1 · etiqueta — mono, chica, en versalitas. Dato frio. */
.etiqueta { font-family:'JetBrains Mono',ui-monospace,'Courier New',monospace;
  font-weight:600; font-size:24px; letter-spacing:2.6px; text-transform:uppercase;
  color:#0B3D2C; background:rgba(11,61,44,.09);
  padding:12px 20px; border-radius:999px; }

/* 2 · gancho — serif display. Es lo unico que tiene que emocionar. */
.gancho { font-family:'Fraunces',Georgia,'Times New Roman',serif; font-weight:700;
  font-size:96px; line-height:1.02; letter-spacing:-2px; color:#14100D;
  text-wrap:balance; }
.gancho .g { font-style:italic; color:#0B3D2C;
  box-shadow:inset 0 -.18em 0 rgba(0,210,106,.42); }

/* 3 · cuerpo — sans, se lee rapido y no compite con el serif. */
.cuerpo { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif; font-weight:400;
  font-size:37px; line-height:1.45; color:#4A4640; max-width:92%; }
.cuerpo .g { font-weight:500; color:#14100D; }

/* El unico punto saturado de la pieza, y esta donde queremos el clic. */
.boton { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif; font-weight:500;
  font-size:34px; color:#052A1D; background:var(--onia-green,#00D26A);
  padding:22px 38px; border-radius:999px; margin-top:6px; }

/* Firma sobre el color, fuera de la tarjeta: separa marca de mensaje. */
.firma { position:absolute; left:${pad}px; bottom:${pad}px;
  display:flex; align-items:center; gap:18px; }
.firma .mark { width:52px; height:52px; }
.firma .handle { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif;
  font-weight:500; font-size:30px; color:rgba(255,255,255,.82); }
</style></head>
<body><div class="slide ${role}">
  <div class="tarjeta">
    ${kicker}
    <h1 class="gancho">${emph(slide.headline)}</h1>
    ${body}
    ${cta}
  </div>
  <div class="firma">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="#FFFFFF" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green,#00D26A)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green,#00D26A)"/>
      <circle cx="98" cy="43" r="4.5" fill="#FFFFFF"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
  };
}

module.exports = { crear };

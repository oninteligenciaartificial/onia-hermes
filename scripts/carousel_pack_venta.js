/**
 * Pack `venta-editorial` — carrusel de VENTA sin cajita: el texto sangra.
 *
 * Nace de una correccion de Sergio (2026-09-02): *"va bien D01, pero ahora que no sea una
 * cajita estatica"*, y de mirar SU tablero de Pinterest de carruseles de Instagram.
 *
 * Lo que `bloque-solido` hacia mal para un carrusel: **una tarjeta crema centrada, del
 * mismo tamaño, en las cinco laminas**. Aunque el texto cambie, el ojo ve el mismo
 * rectangulo cinco veces y el pulgar sigue de largo. La caja tambien COMPRIME el titular:
 * queda a ~96px cuando las referencias que funcionan lo ponen al doble.
 *
 * Las cuatro cosas que tenian en comun TODAS las referencias que funcionan, y que este
 * pack copia (la mecanica, no la identidad):
 *
 * 1. EL TEXTO SANGRA. Sin contenedor: el titular arranca en el margen y llega al borde
 *    opuesto. Es lo que separa "editorial" de "plantilla de Canva".
 *    (ref: «Los monstruos que nadie te cuenta»)
 *
 * 2. MEZCLA DE FAMILIAS DENTRO DE LA MISMA FRASE. Una palabra en serif italic en medio de
 *    sans black. Eso da ritmo y marca donde esta el enfasis sin subrayar nada.
 *    (ref: «4 TYPES of carousels that are going VIRAL in 2026»)
 *
 * 3. UN NUMERO DE INDICE GRANDE. No es decoracion: le dice al lector cuanto falta, que es
 *    exactamente lo que sostiene el deslizar. (ref: el carrusel de 01 a 05)
 *
 * 4. UNA LINEA QUE CONECTA. Cruza la lamina a la altura del indice y CAMBIA DE POSICION
 *    entre laminas, asi el carrusel se lee como una secuencia y no como cinco posts.
 *    (ref: la misma)
 *
 * El acento verde sigue apareciendo UNA sola vez por lamina — regla heredada de
 * `bloque-solido`, que ahi si estaba bien.
 *
 * Campos del brief por lamina: `kicker`, `headline` (acepta *palabra* para el serif
 * italic), `body`, `cta` (solo la ultima), `photo` (opcional: si esta, va de fondo).
 */

const fs = require('fs');
const path = require('path');

function crear({ esc, roleFor, ACCOUNTS, BRAND, getFmt }) {
  // El titular mezcla familias: *lo que va entre asteriscos* sale en serif italic.
  function mixto(txt) {
    return esc(txt).replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function fondoFoto(rel) {
    const abs = path.resolve(rel);
    if (!fs.existsSync(abs)) throw new Error('No existe la foto: ' + abs);
    const ext = path.extname(abs).toLowerCase() === '.png' ? 'png' : 'jpeg';
    return `data:image/${ext};base64,` + fs.readFileSync(abs).toString('base64');
  }

  return function ventaEditorialHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const last = idx === total - 1;
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const pad = Math.round(FMT.w * 0.075);

    const fondo = slide.fondo || (args && args.fondo) || '#0B3D2C';
    const foto = slide.photo ? fondoFoto(slide.photo) : '';
    const num = String(idx + 1).padStart(2, '0');

    // La linea de conexion baja un poco en cada lamina: el carrusel se lee como recorrido.
    const alturaLinea = 30 + (idx / Math.max(total - 1, 1)) * 26;

    // 🔴 El boton va SOLO en la ultima. Repetirlo en cada lamina pide la accion antes de
    // haber vendido nada, y ademas gasta el unico punto saturado de la pieza.
    const textoCta = last ? (slide.cta || (args && args.cta) || '') : '';

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,600&family=Inter:wght@400;500;800;900&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  background:${fondo}; padding:${pad}px;
  display:flex; flex-direction:column; }

${foto ? `.bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 22%; }
/* El velo es DIRECCIONAL: casi transparente arriba —donde esta la escena, que es el
   motivo de poner una foto— y fuerte abajo, donde se apoya el texto. Un velo parejo
   deja la foto de fondo gris y entonces daba lo mismo no ponerla. */
.velo { position:absolute; inset:0;
  background:linear-gradient(0deg, rgba(6,20,15,.94) 0%, rgba(6,20,15,.86) 34%, rgba(6,20,15,.42) 58%, rgba(6,20,15,.10) 100%); }` : ''}

/* 4 · la linea que conecta: cruza entera y cambia de altura entre laminas */
.linea { position:absolute; left:0; right:0; top:${alturaLinea}%; height:2px;
  background:rgba(247,244,238,.16); }
.nodo { position:absolute; left:${pad}px; top:calc(${alturaLinea}% - 9px);
  width:20px; height:20px; border-radius:50%;
  background:var(--onia-green,#00D26A); }

.capa { position:relative; display:flex; flex-direction:column; height:100%; }

/* Cabecera en dos columnas, como la referencia: contexto a un lado, indice al otro */
.top { display:flex; justify-content:space-between; align-items:flex-start; }
.kicker { font-family:'JetBrains Mono',ui-monospace,monospace; font-weight:500;
  font-size:25px; letter-spacing:4px; text-transform:uppercase;
  color:rgba(247,244,238,.66); max-width:62%; }
/* 3 · el indice: dice cuanto falta, que es lo que sostiene el deslizar */
.indice { font-family:'Inter',system-ui,Arial,sans-serif; font-weight:900;
  font-size:64px; line-height:.9; color:rgba(247,244,238,.20); letter-spacing:-3px; }
.indice small { font-size:30px; font-weight:500; }

/* 1 y 2 · el titular SANGRA y mezcla familias. Es el 45% de la lamina. */
.titular { margin-top:auto; font-family:'Inter',system-ui,Arial,sans-serif;
  font-weight:900; font-size:104px; line-height:.96; letter-spacing:-4.5px;
  color:#F7F4EE; text-wrap:balance;
  ${foto ? 'text-shadow:0 6px 34px rgba(0,0,0,.55);' : ''} }
.titular em { font-family:'Fraunces',Georgia,serif; font-style:italic; font-weight:600;
  letter-spacing:-2px; color:var(--onia-green,#00D26A); }

.cuerpo { margin-top:30px; font-family:'Inter',system-ui,Arial,sans-serif; font-weight:400;
  font-size:38px; line-height:1.38; color:rgba(247,244,238,.80); max-width:88%;
  ${foto ? 'text-shadow:0 2px 18px rgba(0,0,0,.5);' : ''} }
.cuerpo b { font-weight:500; color:#F7F4EE; }

.boton { align-self:flex-start; margin-top:34px;
  font-family:'Inter',system-ui,Arial,sans-serif; font-weight:500; font-size:36px;
  color:#052A1D; background:var(--onia-green,#00D26A);
  padding:24px 42px; border-radius:999px; }

.pie { margin-top:auto; padding-top:30px;
  display:flex; align-items:center; justify-content:space-between; }
.firma { display:flex; align-items:center; gap:15px; }
.firma .mark { width:40px; height:40px; }
.firma .handle { font-family:'Inter',system-ui,Arial,sans-serif; font-weight:500;
  font-size:26px; color:rgba(247,244,238,.78); }
.flecha { font-family:'Inter',system-ui,Arial,sans-serif; font-weight:500; font-size:34px;
  color:rgba(247,244,238,.55); }
</style></head>
<body><div class="slide ${role}">
  ${foto ? `<img class="bg" src="${foto}" alt=""><div class="velo"></div>` : ''}
  <div class="linea"></div><div class="nodo"></div>
  <div class="capa">
    <div class="top">
      ${slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : '<div></div>'}
      <div class="indice">${num}<small>/${String(total).padStart(2, '0')}</small></div>
    </div>
    <h1 class="titular">${mixto(slide.headline)}</h1>
    ${slide.body ? `<p class="cuerpo">${esc(slide.body).replace(/\*([^*]+)\*/g, '<b>$1</b>')}</p>` : ''}
    ${textoCta ? `<div class="boton">${esc(textoCta)}</div>` : ''}
    <div class="pie">
      <div class="firma">
        <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="43" stroke="#F7F4EE" stroke-width="13" fill="none"/>
          <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green,#00D26A)" stroke-width="13" fill="none" stroke-linecap="round"/>
          <circle cx="98" cy="43" r="11" fill="var(--onia-green,#00D26A)"/>
          <circle cx="98" cy="43" r="4.5" fill="#F7F4EE"/>
        </svg>
        <span class="handle">${esc(acc.handle)}</span>
      </div>
      ${last ? '' : '<span class="flecha">→</span>'}
    </div>
  </div>
</div></body></html>`;
  };
}

module.exports = { crear };

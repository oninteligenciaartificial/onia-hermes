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

    // --- DOS ESTRUCTURAS DE LAMINA ADEMAS DEL TITULAR SUELTO ---
    //
    // Sergio, 2026-09-02: *"no podes poner 'alguien quiere darte plata' y nada mas,
    // explicate bien, no desglosas tus tareas... proba diferentes estructuras de texto,
    // mockups"*. Tenia razon: las cinco laminas eran titular + una linea, o sea afirmaciones
    // sueltas. En las formulas de carrusel que funcionan (ref: «FORMULA #1/#2 ESTRUCTURA»
    // de @luana.redesmaker, vista en su Pinterest) **las laminas del medio llevan contenido
    // concreto**: pasos numerados, la respuesta desarrollada, la prueba. Sin eso el carrusel
    // afirma y no demuestra.

    // a · LISTA numerada: para desglosar los pasos o lo que hace el producto.
    const items = Array.isArray(slide.items) ? slide.items : [];
    const lista = items.length ? `<ol class="lista">${items.map((it) => {
      const [t, d] = String(it).split('|');
      return `<li><span class="it">${esc(t.trim())}</span>${d ? `<span class="id">${esc(d.trim())}</span>` : ''}</li>`;
    }).join('')}</ol>` : '';

    // b · CHAT: el mockup. Onia ES un asistente de WhatsApp, asi que la conversacion es la
    // prueba del producto — mucho mas que describirla en prosa. Cada entrada del brief es
    // "quien: texto"; `ellos` = el cliente (burbuja clara), `bot` = el asistente (verde).
    const msgs = Array.isArray(slide.chat) ? slide.chat : [];
    const chat = msgs.length ? `<div class="chat">${msgs.map((m) => {
      const esBot = /^bot\s*:/i.test(m);
      const txt = m.replace(/^(bot|ellos)\s*:/i, '').trim();
      const [cuerpoMsg, hora] = txt.split('|');
      return `<div class="msg ${esBot ? 'bot' : 'ellos'}">${esc(cuerpoMsg.trim())}${
        hora ? `<span class="hora">${esc(hora.trim())}${esBot ? ' ✓✓' : ''}</span>` : ''}</div>`;
    }).join('')}</div>` : '';

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

/* --- LO QUE SACA A LA PIEZA DE "PLANA" (Sergio, 2026-09-02) --- */

/* a · GRANO. Un color liso a 1080px se ve digital y muerto. Las referencias que no se
   ven planas casi siempre tienen papel, cartón o ruido debajo. Turbulencia SVG en vez de
   una textura bitmap: pesa cero y no hay que versionar un asset. */
.grano { position:absolute; inset:0; opacity:.055; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }

/* b · UN HALO SUAVE detrás del titular: da profundidad sin agregar un objeto. Es la
   diferencia entre "fondo de color" y "espacio con luz". */
.halo { position:absolute; left:-12%; bottom:-18%; width:88%; height:62%;
  background:radial-gradient(ellipse at center, rgba(0,210,106,.18) 0%, rgba(0,210,106,0) 68%);
  pointer-events:none; }

/* c · UN BLOQUE QUE SANGRA por el borde derecho. Rompe el rectángulo: el ojo lee que la
   composición sigue fuera de la lámina. */
.sangra { position:absolute; right:-70px; top:${18 + idx * 9}%;
  width:210px; height:210px; border:3px solid rgba(0,210,106,.30);
  border-radius:50%; }

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
.titular { position:relative; z-index:1; margin-top:auto; font-family:'Inter',system-ui,Arial,sans-serif;
  font-weight:900; font-size:104px; line-height:.96; letter-spacing:-4.5px;
  color:#F7F4EE; text-wrap:balance;
  ${foto ? 'text-shadow:0 6px 34px rgba(0,0,0,.55);' : ''} }
/* d · HIGHLIGHT DE MARCADOR, no un rectángulo limpio. Las referencias que funcionan
   subrayan a mano: el trazo se sale, no llega parejo a los bordes. Un rectángulo perfecto
   se lee como "resaltado de Word"; éste se lee como alguien marcando la frase. */
/* ⚠️ El pseudo-elemento absoluto NO servía: se rompe cuando la frase corta en dos líneas
   (pasó en la lámina 05) y encima tapaba el texto. Con background + box-decoration-break
   el trazo se dibuja por CADA línea, y al ir en el fondo del renglón queda como subrayado
   grueso: marca sin comerse la palabra.
   ⚠️ Y ojo: nada de backticks en los comentarios de este CSS — está dentro de un template
   literal de JS y cortan la cadena. */
.titular em { font-family:'Fraunces',Georgia,serif; font-style:italic;
  font-weight:600; letter-spacing:-2px; color:#F7F4EE;
  background-image:linear-gradient(to top,
    rgba(0,210,106,.92) 0, rgba(0,210,106,.92) .26em,
    rgba(0,210,106,0) .26em, rgba(0,210,106,0) 100%);
  -webkit-box-decoration-break:clone; box-decoration-break:clone;
  padding:0 .05em .02em; border-radius:2px; }

.cuerpo { margin-top:30px; font-family:'Inter',system-ui,Arial,sans-serif; font-weight:400;
  font-size:38px; line-height:1.38; color:rgba(247,244,238,.80); max-width:88%;
  ${foto ? 'text-shadow:0 2px 18px rgba(0,0,0,.5);' : ''} }
.cuerpo b { font-weight:500; color:#F7F4EE; }

/* a · LISTA numerada: desglosa en vez de afirmar. El numero en verde ancla la lectura. */
.lista { list-style:none; margin-top:34px; display:flex; flex-direction:column; gap:22px;
  counter-reset:n; }
.lista li { counter-increment:n; position:relative; padding-left:76px;
  font-family:'Inter',system-ui,Arial,sans-serif; }
.lista li::before { content:counter(n,decimal-leading-zero);
  position:absolute; left:0; top:-4px; font-weight:900; font-size:40px;
  color:var(--onia-green,#00D26A); letter-spacing:-1px; }
.lista .it { display:block; font-weight:500; font-size:40px; line-height:1.2;
  color:#F7F4EE; }
.lista .id { display:block; margin-top:6px; font-weight:400; font-size:31px;
  line-height:1.35; color:rgba(247,244,238,.62); }

/* b · CHAT: burbujas con sombra real, apiladas y alternadas. La sombra es lo que las
   despega del fondo — sin ella vuelven a verse planas, que es el defecto que arrastramos. */
.chat { margin-top:32px; display:flex; flex-direction:column; gap:18px; }
.msg { position:relative; max-width:76%; padding:22px 26px; border-radius:22px;
  font-family:'Inter',system-ui,Arial,sans-serif; font-weight:400; font-size:33px;
  line-height:1.32; box-shadow:0 16px 34px rgba(0,0,0,.34); }
.msg.ellos { align-self:flex-start; background:#F7F4EE; color:#14100D;
  border-bottom-left-radius:7px; }
.msg.bot { align-self:flex-end; background:#00D26A; color:#052A1D;
  border-bottom-right-radius:7px; }
.msg .hora { display:block; margin-top:8px; font-size:22px; opacity:.55; text-align:right; }

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
  <div class="grano"></div>
  ${foto ? '' : '<div class="halo"></div><div class="sangra"></div>'}
  <div class="linea"></div><div class="nodo"></div>
  <div class="capa">
    <div class="top">
      ${slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : '<div></div>'}
      <div class="indice">${num}<small>/${String(total).padStart(2, '0')}</small></div>
    </div>
    <h1 class="titular">${mixto(slide.headline)}</h1>
    ${slide.body ? `<p class="cuerpo">${esc(slide.body).replace(/\*([^*]+)\*/g, '<b>$1</b>')}</p>` : ''}
    ${lista}${chat}
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

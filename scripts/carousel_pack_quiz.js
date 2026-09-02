/**
 * Pack `historia-quiz` — historia 9:16 con una trampa, para el sticker nativo de encuesta.
 *
 * Pedido de Sergio (2026-09-02) mandando una historia de @ingenierobinario:
 * *"Mira este diseño para historias"*. El desglose vive en
 * `hermes-content/references/video-intake/2026-09-02-ingenierobinario-historia-quiz.md`.
 *
 * 🔴 LA REGLA QUE DEFINE EL PACK: las opciones NO se dibujan.
 *
 * Lo que hace funcionar al formato no es el estilo: es que usa el sticker NATIVO de
 * encuesta de Instagram. Responder cuesta UN TOQUE, y el autor ve QUIEN respondio que.
 * Una imagen con las cuatro opciones pintadas no se puede tocar — dibujarlas mata la
 * unica ventaja del formato. Por eso este pack deja el TERCIO INFERIOR VACIO a proposito:
 * ahi Sergio pega el sticker al publicar, y las opciones viajan en el brief como texto
 * para que las tipee.
 *
 * Las otras tres decisiones, copiadas de la referencia y adaptadas:
 *
 * 1. EL BLOQUE TIPO VENTANA. Los tres puntitos + una etiqueta dan credibilidad
 *    instantanea sin explicar nada ("esto es real"). Es reusable: sirve para codigo,
 *    para un chat de WhatsApp o para una agenda, segun el `window_label` del brief.
 *
 * 2. TRES LINEAS, NO DIEZ. Se lee en un celular sin hacer zoom. El brief acepta
 *    `lines[]` y el render avisa si se pasa de cuatro.
 *
 * 3. UN SOLO COLOR DE ACENTO, y aparece UNICAMENTE en la barra de la pregunta. Misma
 *    regla que `bloque-solido`: si el acento esta en todos lados deja de ser acento.
 *    El de la referencia es amarillo; el nuestro es el verde de Onia.
 *
 * Lo que NO se copia: la fuente pixel y el "CODE TIME!" son la identidad de esa cuenta.
 *
 * Campos del brief: `kicker` (encabezado corto), `window_label` (etiqueta de la ventana),
 * `lines[]` (las lineas del bloque), `headline` (la pregunta), y `options[]` — que NO se
 * dibujan, quedan en el brief para el sticker.
 */

const fs = require('fs');
const path = require('path');

function crear({ esc, roleFor, ACCOUNTS, BRAND, getFmt }) {
  return function historiaQuizHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const pad = Math.round(FMT.w * 0.085);

    const fondo = (args && args.fondo) || '#12100E';
    const lineas = Array.isArray(slide.lines) ? slide.lines : [];
    if (lineas.length > 4) {
      console.warn(`[aviso] ${lineas.length} lineas en el bloque (max 4): se lee con zoom y la historia se saltea.`);
    }

    const etiqueta = slide.window_label || '';
    const cuerpo = lineas.map((l) => `<div class="linea">${esc(l)}</div>`).join('');

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  background:${fondo}; padding:${pad}px;
  display:flex; flex-direction:column; }

/* Encabezado corto. Serif display: da tono sin robarle la atencion al bloque. */
.kicker { font-family:'Fraunces',Georgia,serif; font-weight:700; font-size:58px;
  color:#F7F4EE; letter-spacing:-1px; margin-top:${Math.round(pad * 1.2)}px; }

/* El componente reusable: ventana con los tres puntitos. Sirve para codigo, para un
   chat o para una agenda — lo unico que cambia es la etiqueta y las lineas. */
.ventana { margin-top:${Math.round(pad * 0.9)}px; border-radius:26px; overflow:hidden;
  background:#1D1A17; box-shadow:0 30px 60px rgba(0,0,0,.45); }
.barra { display:flex; align-items:center; gap:14px;
  padding:24px 30px; background:#262220; }
.punto { width:19px; height:19px; border-radius:50%; }
.p1 { background:#FF5F57; } .p2 { background:#FEBC2E; } .p3 { background:#28C840; }
.tag { margin-left:auto; font-family:'JetBrains Mono',ui-monospace,monospace;
  font-weight:600; font-size:24px; letter-spacing:2.4px; text-transform:uppercase;
  color:rgba(247,244,238,.5); }
.cuerpo { padding:38px 34px; display:flex; flex-direction:column; gap:20px; }
.linea { font-family:'JetBrains Mono',ui-monospace,monospace; font-weight:400;
  font-size:40px; line-height:1.35; color:#F7F4EE; white-space:pre-wrap; }

/* El unico punto de acento de la pieza, y esta en la pregunta. */
.pregunta { margin-top:${Math.round(pad * 0.9)}px;
  background:var(--onia-green,#00D26A); border-radius:22px;
  padding:32px 34px;
  font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif; font-weight:600;
  font-size:52px; line-height:1.15; color:#052A1D; text-wrap:balance; }

/* 🔴 EL HUECO. No es relleno: es donde va el sticker de encuesta al publicar.
   Si algo se dibuja aca, el formato deja de funcionar. */
.hueco { flex:1; min-height:${Math.round(FMT.h * 0.24)}px; }

.firma { display:flex; align-items:center; gap:16px; opacity:.72; }
.firma .mark { width:44px; height:44px; }
.firma .handle { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif;
  font-weight:500; font-size:28px; color:#F7F4EE; }
</style></head>
<body><div class="slide ${role}">
  ${slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : ''}
  <div class="ventana">
    <div class="barra">
      <span class="punto p1"></span><span class="punto p2"></span><span class="punto p3"></span>
      ${etiqueta ? `<span class="tag">${esc(etiqueta)}</span>` : ''}
    </div>
    <div class="cuerpo">${cuerpo}</div>
  </div>
  <div class="pregunta">${esc(slide.headline)}</div>
  <div class="hueco"></div>
  <div class="firma">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="#F7F4EE" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green,#00D26A)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green,#00D26A)"/>
      <circle cx="98" cy="43" r="4.5" fill="#F7F4EE"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
  };
}

module.exports = { crear };

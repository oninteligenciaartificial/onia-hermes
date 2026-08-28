/**
 * Pack `tarjeta-empleado` — el molde de la marca personal de Sergio.
 *
 * Portado de la referencia que eligio Sergio el 2026-08-27:
 * instagram.com/p/DcjXxcBlq-8 de @iampascio.
 *
 *   Portada: "I hired 5 fake employees (They never ask for a raise)"
 *   Laminas: tarjeta de empleado — numero · nombre · CARGO · que hace
 *   Caption: "My best employees don't sleep, complain, or ask for a raise."
 *
 * EL CONCEPTO: presentar tus herramientas como si fueran empleados que contrataste.
 * Le sirve a Sergio porque es primera persona, enseña algo concreto, tiene humor seco,
 * y el contenido ya existe — su S05 ya listaba n8n, Chatwoot, Supabase y Postiz.
 *
 * ⚠️ 2026-08-28, Sergio: "sergio igual que use verde". El acento pasa de ambar a verde.
 * El molde NO pierde su razon de ser: lo que lo separa de @oniahq nunca fue el color,
 * son el azul noche, la trama de puntos, la ficha blanca y el Archivo condensado + mono.
 *
 * 🔴 POR QUE EL ESTILO SE SEPARA A PROPOSITO DE ONIA:
 * El defecto principal de las piezas de Sergio era verse IDENTICAS a las de @oniahq:
 * mismo verde, mismas pildoras, mismo sans. Y el es la unica cuenta con audiencia real
 * (411), asi que parecia la cuenta de la empresa. Aca no se comparte NADA con el sistema
 * de Onia:
 *
 *   Onia            -> negro verdoso / papel hueso · verde #10C26B · Fraunces + Inter
 *   Sergio (este)   -> azul noche · verde #00D26A · Archivo condensado + mono
 *
 * El brief declara por lamina: `n`, `nombre`, `cargo`, `hace`, y UNO de `reemplaza`
 * (la herramienta vieja, para el molde de empleados) o `creia` (lo que se daba por
 * cierto, para el molde de errores de S07). Los dos se dibujan igual: tachado en verde,
 * que es el gesto que hace legible de un vistazo "esto ya no vale".
 */

const fs = require('fs');
const path = require('path');

function crear({ esc, emph, roleFor, ACCOUNTS, BRAND, getFmt }) {
  return function tarjetaEmpleadoHtml(slide, idx, total, account) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const acc = ACCOUNTS[account] || ACCOUNTS.sergio;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const pad = Math.round(FMT.w * 0.075);
    const esPortada = role === 'cover';

    // La tarjeta: el elemento que hace el molde. Identica en todas las laminas, para
    // que a la tercera el ojo vaya directo a lo que cambia.
    const tarjeta = slide.nombre ? `
      <div class="ficha">
        <div class="fila">
          <span class="num">${esc(String(slide.n || idx))}</span>
          <div class="quien">
            <span class="nombre">${esc(slide.nombre)}</span>
            <span class="cargo">${esc(slide.cargo || '')}</span>
          </div>
        </div>
        <p class="hace">${emph(slide.hace || '')}</p>
        ${slide.reemplaza ? `<div class="reemplaza"><span>reemplaza a</span><b>${esc(slide.reemplaza)}</b></div>` : ''}
        ${slide.creia ? `<div class="reemplaza"><span>yo creía</span><b>${esc(slide.creia)}</b></div>` : ''}
      </div>` : '';

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5,700;62.5,900;100,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>${tokens}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${FMT.w}px;height:${FMT.h}px}
/* Azul noche, NO el negro verdoso de Onia. Es la separacion mas barata y la que mas
   se nota en el scroll, que es donde se confundian las dos cuentas. */
.slide{width:${FMT.w}px;height:${FMT.h}px;position:relative;overflow:hidden;
  background:#101828;color:#F8FAFC;font-family:'Archivo',sans-serif;
  padding:${pad}px;display:flex;flex-direction:column}
/* Trama de puntos: da textura sin competir con la tarjeta. */
.slide::before{content:"";position:absolute;inset:0;opacity:.5;
  background-image:radial-gradient(#22304A 1.5px, transparent 1.6px);
  background-size:26px 26px}
.slide > *{position:relative;z-index:2}

.kicker{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:23px;
  letter-spacing:.12em;text-transform:uppercase;color:#00D26A;margin-bottom:26px}

h1,h2{font-family:'Archivo',sans-serif;font-variation-settings:'wdth' 62.5,'wght' 900;
  font-size:${esPortada ? Math.round(FMT.w * 0.115) : Math.round(FMT.w * 0.072)}px;
  line-height:.94;letter-spacing:-.02em;text-transform:uppercase;max-width:16ch}
h1 .g,h2 .g{color:#00D26A}
.sub{font-size:32px;line-height:1.4;color:#94A3B8;margin-top:20px;max-width:28ch;
  font-variation-settings:'wght' 600}
/* Un body con doble salto se dibujaba como un solo bloque: la linea de fuente quedaba
   pegada al argumento y dejaba de leerse como fuente. */
.sub + .sub{margin-top:18px}

/* LA FICHA. Blanco sobre azul: el contraste maximo va al unico elemento que importa. */
.ficha{margin-top:52px;
  background:#F8FAFC;color:#101828;border-radius:26px;padding:40px 42px;
  box-shadow:0 26px 60px rgba(0,0,0,.42)}
.fila{display:flex;align-items:center;gap:26px}
.num{font-family:'Archivo';font-variation-settings:'wdth' 62.5,'wght' 900;
  font-size:96px;line-height:.8;color:#00D26A}
.quien{display:flex;flex-direction:column;gap:6px}
.nombre{font-family:'Archivo';font-variation-settings:'wdth' 62.5,'wght' 900;
  font-size:60px;line-height:1;letter-spacing:-.01em}
.cargo{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:24px;
  letter-spacing:.05em;color:#475569;text-transform:uppercase}
.hace{font-size:31px;line-height:1.35;margin-top:26px;color:#1E293B;
  font-variation-settings:'wght' 600}
.reemplaza{margin-top:24px;padding-top:20px;border-top:2px solid #E2E8F0;
  display:flex;align-items:baseline;gap:12px;
  font-family:'JetBrains Mono',monospace;font-size:23px}
.reemplaza span{color:#64748B;text-transform:uppercase;letter-spacing:.06em}
.reemplaza b{font-weight:700;color:#101828;text-decoration:line-through;
  text-decoration-color:#00D26A;text-decoration-thickness:3px}

.pie{margin-top:auto;display:flex;justify-content:space-between;align-items:center;
  font-family:'JetBrains Mono',monospace;font-size:23px;color:#64748B}
.pie .handle{color:#CBD5E1;font-weight:700}

.slide.cta{background:#00D26A;color:#101828}
.slide.cta::before{background-image:radial-gradient(#00A854 1.5px, transparent 1.6px)}
.slide.cta h2{color:#101828}
.slide.cta h2 .g{color:#F8FAFC}
.slide.cta .sub{color:rgba(16,24,40,.78)}
.slide.cta .kicker{color:#101828}
.slide.cta .pie{color:rgba(16,24,40,.6)}
.slide.cta .pie .handle{color:#101828}
</style></head>
<body><div class="slide ${role}">
  ${slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : ''}
  <${esPortada ? 'h1' : 'h2'}>${emph(slide.headline || '')}</${esPortada ? 'h1' : 'h2'}>
  ${slide.body ? String(slide.body).split(/\n\s*\n/).map(
      (par) => `<p class="sub">${emph(par)}</p>`).join('') : ''}
  ${tarjeta}
  <div class="pie"><span class="handle">${esc(acc.handle)}</span>
    <span>${idx + 1} / ${total}</span></div>
</div></body></html>`;
  };
}

module.exports = { crear };

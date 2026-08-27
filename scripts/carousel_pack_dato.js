/**
 * Pack `dato-ilustrado` — la lamina que ENSEÑA un dato, con imagen sobre el tema.
 *
 * Nace de cinco criticas de Sergio a los 4 carruseles anteriores (2026-08-27):
 *   "esta horrible el diseno · colocas imagenes sin sentido sobre imagenes · cambia ese
 *    fondo con las lineas por detras · juega mas con tipografias · genera imagenes sobre
 *    el tema · habla sobre algo que realmente enseñe"
 *
 * Las cuatro decisiones que lo separan de `dark-product`:
 *
 * 1. LA IMAGEN ES EL FONDO, a sangre. No hay imagen flotando sobre otra imagen: hay UNA
 *    sola, ocupando la lamina, con el texto encima sobre un scrim. Ese era el defecto que
 *    Sergio nombro literalmente.
 *
 * 2. TIPOGRAFIA CONTRASTANTE, no concordante. La regla, de Lupton via la investigacion:
 *    **un salto de jerarquia cambia MUCHO un eje, no un poco cinco ejes**. Si dos cosas
 *    difieren poco, el lector no lee jerarquia: lee error. Aca cambian DOS ejes a la vez
 *    y fuerte — familia (serif display contra sans) y escala (>=2x). El estado anterior
 *    era "concordante puro", que es exactamente lo que se ve plano.
 *
 * 3. EL DATO ES EL PROTAGONISTA. Una cifra a 200px con cifras tabulares, y la fuente
 *    SIEMPRE debajo. Sin fuente no se dibuja el dato: es una regla del proyecto, con cero
 *    clientes pagando inventar una cifra esta prohibido.
 *
 * 4. SIN FONDO DECORATIVO. Nada de curvas ni lineas. El unico "adorno" es la imagen, y
 *    la imagen dice algo.
 *
 * El brief declara por lamina: `bg` (la ilustracion), `kicker`, `headline`, `body`,
 * `dato` + `dato_pie` + `fuente`, y `scrim` ('abajo' por defecto, o 'arriba').
 */

const fs = require('fs');
const path = require('path');

function crear({ esc, emph, roleFor, ACCOUNTS, BRAND, getFmt }) {
  return function datoIlustradoHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const pad = Math.round(FMT.w * 0.075);

    const rawBg = slide.bg || (args && args.bg) || '';
    const bg = rawBg ? path.resolve(rawBg).replace(/\\/g, '/') : '';
    // Las ilustraciones se generan con el tercio superior libre, asi que el scrim va
    // arriba por defecto: es donde hay superficie lisa para apoyar el texto.
    const zona = slide.scrim === 'abajo' ? 'abajo' : 'arriba';

    // El dato NO se dibuja sin su fuente. No es una validacion de forma: es la regla
    // del catalogo — una cifra sin fuente en material de cliente es fabricar.
    const tieneDato = slide.dato && slide.fuente;
    const bloqueDato = tieneDato ? `
      <div class="cifra">
        <span class="n">${esc(slide.dato)}</span>
        ${slide.dato_pie ? `<span class="np">${esc(slide.dato_pie)}</span>` : ''}
      </div>` : '';

    const fuente = slide.fuente
      ? `<p class="fuente">${esc(slide.fuente)}</p>` : '';

    // Escalas de la investigacion, para un lienzo que se lee a 1/3 en el telefono:
    // portada 120-150px · titular interior 68-80 · cuerpo 32-36 · volante 22-24.
    const esPortada = role === 'cover';
    const tamTitular = esPortada ? Math.round(FMT.w * 0.125) : Math.round(FMT.w * 0.068);

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
<style>${tokens}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${FMT.w}px;height:${FMT.h}px}
.slide{width:${FMT.w}px;height:${FMT.h}px;position:relative;overflow:hidden;
  background:var(--onia-ink);color:#fff;font-family:'Inter',sans-serif;
  display:flex;flex-direction:column;justify-content:${zona === 'arriba' ? 'flex-start' : 'flex-end'};
  ${zona === 'abajo' ? 'padding-top:38%;' : ''}
  padding:${pad}px}
.foto{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
/* Scrim FOCALIZADO en la zona del texto, no una manta sobre toda la imagen.
   Material Design: 20-40% para scrim oscuro. Un degradado desde el borde se lee como
   diseño; una capa pareja encima se lee como parche. */
.scrim{position:absolute;left:0;right:0;z-index:1;height:100%;
  ${zona === 'arriba'
    ? 'top:0;background:linear-gradient(180deg,rgba(6,10,8,.95) 0%,rgba(6,10,8,.88) 46%,rgba(6,10,8,.30) 78%,rgba(6,10,8,.10) 100%)'
    : 'bottom:0;background:linear-gradient(0deg,rgba(6,10,8,.95) 0%,rgba(6,10,8,.88) 46%,rgba(6,10,8,.30) 78%,rgba(6,10,8,.10) 100%)'}}
.slide > *:not(.foto):not(.scrim){position:relative;z-index:2}

/* VOLANTE — versales con tracking POSITIVO. A las versales hay que agregarles
   interletrado: el de por defecto esta calibrado para caja baja. */
.kicker{font-size:24px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;
  color:var(--onia-green);display:flex;align-items:center;gap:12px;margin-bottom:22px}
.kicker::before{content:"";width:26px;height:3px;background:var(--onia-green)}

/* TITULAR — serif display. La familia con MAS caracter va donde hay MENOS palabras:
   ese es el unico invariante que hay que recordar del emparejamiento serif+sans.
   Tracking negativo y line-height por debajo de 1: el interletrado de fabrica esta
   calibrado para texto corrido, no para 135px. */
.tit{font-family:'Fraunces',serif;font-weight:900;font-size:${tamTitular}px;
  line-height:.92;letter-spacing:-.025em;max-width:15ch}
.tit .g{color:var(--onia-green)}

/* CUERPO — sans, peso 400 contra el 900 del titular. El salto de peso tiene que ser
   de >=300 unidades: 500 contra 400 se percibe como error, no como jerarquia. */
.cuerpo{font-size:34px;line-height:1.45;color:rgba(255,255,255,.86);
  margin-top:24px;max-width:30ch;font-weight:400}
.cuerpo b{font-weight:600;color:#fff}

/* LA CIFRA — el protagonista. Cifras tabulares: en una pieza que vende software, unas
   columnas de numeros desalineadas se leen como error de producto. */
.cifra{margin-top:${Math.round(FMT.h * 0.028)}px;display:flex;align-items:baseline;gap:18px;flex-wrap:wrap}
.cifra .n{font-family:'Fraunces',serif;font-weight:900;
  font-size:${Math.round(FMT.w * 0.20)}px;line-height:.86;color:var(--onia-green);
  letter-spacing:-.04em;font-feature-settings:"tnum" 1}
.cifra .np{font-size:30px;font-weight:600;color:rgba(255,255,255,.82);max-width:13ch;line-height:1.25}

/* LA FUENTE — chica pero SIEMPRE presente. Es lo que separa un dato de un invento. */
.fuente{margin-top:18px;font-size:22px;color:rgba(255,255,255,.52);font-weight:400;
  border-left:3px solid rgba(16,194,107,.55);padding-left:14px;max-width:34ch}

.pie{margin-top:auto;padding-top:${Math.round(pad * 0.6)}px;
  display:flex;justify-content:space-between;align-items:center;
  font-size:24px;color:rgba(255,255,255,.62)}
.pie .handle{font-weight:600;color:rgba(255,255,255,.9)}

/* CTA: la unica lamina sin imagen, a proposito. Romper el patron visual justo en el
   cierre es lo que hace que el cierre se lea. */
.slide.cta{background:var(--onia-green);color:var(--onia-ink);justify-content:center}
.slide.cta .tit{color:var(--onia-ink)}
.slide.cta .tit .g{color:#fff}
.slide.cta .cuerpo{color:rgba(10,15,13,.82)}
.slide.cta .kicker{color:var(--onia-ink)}
.slide.cta .kicker::before{background:var(--onia-ink)}
.slide.cta .pie{color:rgba(10,15,13,.6)}
.slide.cta .pie .handle{color:var(--onia-ink)}
</style></head>
<body><div class="slide ${role}">
  ${bg && role !== 'cta' ? `<div class="foto" style="background-image:url('file://${bg}')"></div><div class="scrim"></div>` : ''}
  ${slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : ''}
  <h${esPortada ? 1 : 2} class="tit">${emph(slide.headline || '')}</h${esPortada ? 1 : 2}>
  ${bloqueDato}
  ${slide.body ? `<p class="cuerpo">${emph(slide.body)}</p>` : ''}
  ${fuente}
  <div class="pie"><span class="handle">${esc(acc.handle)}</span><span>${idx + 1} / ${total}</span></div>
</div></body></html>`;
  };
}

module.exports = { crear };

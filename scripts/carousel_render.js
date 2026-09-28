#!/usr/bin/env node
/**
 * Onia carousel render engine.
 *
 * brief JSON -> branded PNG slides en 3 formatos (--format feed|square|story).
 * feed 1080x1350 (4:5, default) · square 1080x1080 · story 1080x1920.
 * Zero external deps: builds one HTML per slide and screenshots it with
 * Edge/Chrome headless (same approach as the propuestas generador).
 *
 * Encodes the 5 Onia carousel rules via slide roles:
 *   cover  -> frena el scroll, hook gigante, contraste brutal (regla 1)
 *   stakes -> confirma el hook / sube lo que está en juego (regla 2)
 *   point  -> una idea por slide, screenshot suelto (regla 3)
 *   save   -> slide guardable: framework / prompt / frase (regla 4)
 *   cta    -> CTA motor + comment trigger (regla 5)
 *
 * Usage:
 *   node carousel_render.js --brief brief.json --out ./out [--account onia|arthur|sergio] [--bg path.jpg]
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BRAND = path.join(__dirname, '..', 'hermes-content', 'brand');
const ROOT = path.join(__dirname, '..');

// Resuelve una ruta de asset (de un slide) a file:// absoluto. Acepta rutas
// relativas al repo o absolutas. Devuelve '' si no existe.
function assetUrl(p) {
  if (!p) return '';
  const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
  return fs.existsSync(abs) ? `file://${abs.replace(/\\/g, '/')}` : '';
}

// Chip de dato ({{...}}), comun a todos los packs. Estaba definido solo en dos de
// siete, asi que un {{Bs 285}} en un brief de dark-product salia como texto pelado:
// el brief lo pedia y el pack lo ignoraba sin avisar (visto en O04 y O06).
const DATO_CSS = `
.dato { background:var(--onia-green); color:var(--onia-ink); font-weight:700;
  font-size:.92em; padding:.05em .3em; border-radius:.2em; white-space:nowrap; }
.slide.cta .dato { background:var(--onia-ink); color:var(--onia-green); }
`;

// Chrome va PRIMERO: Edge headless en esta maquina genera PNGs de 0 bytes sin
// error (verificado 2026-08-20, con y sin sandbox). CAROUSEL_BROWSER lo pisa todo.
const BROWSER_CANDIDATES = [
  process.env.CAROUSEL_BROWSER || '',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  // Chromium de Playwright en el VPS (el único navegador instalado acá, 2026-09-02).
  '/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
].filter(Boolean);

const ACCOUNTS = {
  // Handle IG real de ONIA, confirmado por Sergio 2026-08-13.
  onia: { handle: '@oniahq', name: 'Onia', personal: false },
  arthur: { handle: '@arthur', name: 'Arthur', personal: true },
  // Handle actual, confirmado por Sergio Urcullo el 2026-09-06: SIN guion bajo.
  // Historia, porque este campo ya estuvo mal dos veces: decia '@sergio' (inventado),
  // se corrigio a '@sergio_urcullo' con verificacion de Graph API del 2026-08-23
  // (id 37718852144430113, 411 seguidores), y despues el renombro la cuenta —
  // el cambio se aplico en los 13 generadores de scripts/marca-personal/ pero
  // NO aca, asi que este motor firmaba con un handle que ya no existe.
  // Un handle mal puesto no rompe ningun build: sale publicado y ya.
  sergio: { handle: '@sergiourcullo', name: 'Sergio Urcullo', personal: true },
  nuvia: { handle: '@nuvia.bo', name: 'Nuvia', personal: false },
  // Lucia va en el VERDE de Onia. Sergio, 2026-08-28: "usa color verde siempre".
  // Deroga el §1-quater de LUCIA.md, que prohibia el verde en sus piezas y por el que
  // se habian pasado a terracota ese mismo dia. Sin `accent` propio hereda el tema.
  lucia: { handle: '@lucia.antelo.oficial', name: 'Lucía Antelo', personal: true },
};

/**
 * El acento que le toca a una pieza: manda el flag si vino, y si no el color propio de
 * la cuenta. Sin ninguno de los dos, el verde de Onia que ya trae el tema.
 */
function acentoDe(args, account) {
  if (args && args.accent) return args.accent;
  const acc = ACCOUNTS[account];
  return (acc && acc.accent) || '';
}

// Brand kits para packs no-Onia. Cada marca define superficie, tinta, acentos
// y logo. El pack bright-retail los consume.
const BRANDS = {
  // Kit de Onia para bright-retail. Existe porque el pack caia a `BRANDS.nuvia`
  // por defecto y firmaba las piezas de @oniahq con el logo, la paleta arcoiris
  // y el tagline "EVERYTHING FOR EVERYONE" de OTRA marca (visto 2026-08-24).
  // La paleta es verde escalonado a proposito: el arcoiris de Nuvia es de tienda,
  // y Onia vende sistemas.
  onia: {
    name: 'Onia',
    handle: '@oniahq',
    tagline: 'SISTEMAS PARA NEGOCIOS BOLIVIANOS',
    bg: '#FBFAF6',
    surface2: '#FFFFFF',
    ink: '#0A0F0D',
    muted: '#5A6B63',
    accents: ['#10C26B', '#0B8F4F', '#0A0F0D', '#10C26B'],
    stripes: ['#0A0F0D', '#10C26B', '#0B8F4F', '#D6F5E5', '#10C26B'],
    logo: path.join(BRAND, 'onia-logomark.svg'),
  },
  nuvia: {
    name: 'Nuvia',
    handle: '@nuvia.bo',
    tagline: 'EVERYTHING FOR EVERYONE',
    bg: '#FFFBF4',
    surface2: '#FFFFFF',
    ink: '#0F2D52',
    muted: '#5C6B82',
    accents: ['#00A7A0', '#FF6B6B', '#F5B400', '#7B4FB5'],
    stripes: ['#0F2D52', '#00A7A0', '#F5B400', '#FF6B6B', '#7B4FB5'],
    logo: path.join(__dirname, '..', 'web-factory', 'data', 'clients', 'nuvia.assets', 'nuvia-icon.png'),
  },
};

function findBrowser() {
  for (const c of BROWSER_CANDIDATES) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No Edge/Chrome found. Install one of: ' + BROWSER_CANDIDATES.join(', '));
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// PACKS es la lista blanca del CLI (valida `--pack` mas abajo): estar aca es PROMETER que
// ese pack renderiza. Por eso solo entra el pack cuyo archivo esta EN ESTE REPO.
//
// `papel-subrayado`, `dato-ilustrado` y `tarjeta-empleado` entraron aca el 2026-09-02 SIN
// sus modulos: `carousel_pack_papel/dato/empleado.js` se commitearon solo en
// `claude/ads-creatividades-publicos` —el carril de contenido, que el integrador tiene
// prohibido mergear— y nunca llegaron a main. Listados igual, el CLI los aceptaba y
// reventaba DESPUES, al renderar ("Pack no disponible"): una entrada de menu para un plato
// que la cocina no puede hacer. Vuelven en una linea (aca + su `const` de abajo) cuando ese
// carril cierre y sus archivos entren — el test `todo pack listado RENDERIZA` lo comprueba.
const PACKS = ['community-editorial', 'dark-product', 'dark-neon', 'editorial-photo', 'editorial-clean', 'bright-retail', 'bloque-solido'];

// Los 3 formatos que pide Instagram. Hasta el 2026-08-15 el render estaba fijo en 4:5 y
// no se podian hacer ni cuadrados ni historias (gap del prompt A3).
const FORMATS = {
  feed: { w: 1080, h: 1350 },   // 4:5  — carrusel de feed, el default de siempre
  square: { w: 1080, h: 1080 }, // 1:1  — feed cuadrado
  story: { w: 1080, h: 1920 },  // 9:16 — historia
};

// Estado de modulo a proposito: los 5 packs construyen su CSS en template literals sueltos
// y pasarles el tamano por parametro obligaba a tocar 5 firmas. El script es CLI de una
// corrida; el default deja el comportamiento anterior intacto.
let FMT = FORMATS.feed;

// Una historia NO es un feed mas alto. Instagram tapa ~280px arriba (foto, nombre, cerrar) y
// ~360px abajo (barra de responder y compartir). Sin esto el texto queda pegado al borde,
// debajo de su UI, y sobra un hueco enorme en el medio. Los 5 packs comparten
// `.slide { padding:var(--pad); display:flex; flex-direction:column }`, asi que un solo
// override sirve para todos.
// OJO especificidad: este bloque se inyecta ANTES de la regla `.slide` de cada pack, asi que
// va con `html body .slide` para ganar la cascada. Con `.slide` a secas lo pisa el
// `padding:var(--pad)` que viene despues y el arreglo no se aplica (pasó, 2026-08-15).
const safeAreaCss = () => FMT.h < 1600 ? '' : `
html body .slide { padding-top:300px; padding-bottom:380px; }
html body .slide .dots { margin-top:56px; padding-top:0; }
`;

function parseArgs(argv) {
  const a = { out: './out', account: 'onia', bg: '', pack: 'community-editorial', object: '', accent: '', format: 'feed', emph: 'marcador' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--brief') a.brief = argv[++i];
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--account') a.account = argv[++i];
    else if (k === '--bg') a.bg = argv[++i];
    else if (k === '--pack') a.pack = argv[++i];
    else if (k === '--object') a.object = argv[++i];
    else if (k === '--accent') a.accent = argv[++i];
    else if (k === '--format') a.format = argv[++i];
    else if (k === '--emph') a.emph = argv[++i];
    else if (k === '--serie') a.serie = argv[++i];
    else if (k === '--episodio') a.episodio = argv[++i];
  }
  if (!FORMATS[a.format]) {
    throw new Error('Unknown --format: ' + a.format + ' (use ' + Object.keys(FORMATS).join('|') + ')');
  }
  FMT = FORMATS[a.format];
  if (!EMPH[a.emph]) throw new Error('Unknown --emph: ' + a.emph + ' (use ' + Object.keys(EMPH).join('|') + ')');
  EMPH_STYLE = a.emph;
  // --accent permite que una cuenta personal (una modelo) tenga SU color y no el
  // verde de la marca Onia. Sin el flag, nada cambia.
  if (a.accent && !/^#[0-9a-fA-F]{6}$/.test(a.accent)) {
    throw new Error('--accent debe ser hex #RRGGBB, recibi: ' + a.accent);
  }
  if (!a.brief) throw new Error('Missing --brief <file.json>');
  if (!ACCOUNTS[a.account]) throw new Error('Unknown account: ' + a.account);
  if (!PACKS.includes(a.pack)) throw new Error('Unknown --pack: ' + a.pack + ' (use ' + PACKS.join('|') + ')');
  return a;
}

// Derive role from explicit flag or position.
function roleFor(slide, idx, total) {
  if (slide.role) return slide.role;
  if (idx === 0) return 'cover';
  if (idx === 1) return 'stakes';
  if (idx === total - 1) return 'cta';
  if (slide.save_worthy) return 'save';
  return 'point';
}

function pageNo(idx, total) {
  const p = String(idx + 1).padStart(2, '0');
  const t = String(total).padStart(2, '0');
  return `${p} / ${t}`;
}

// continuation cue at right edge (peek arrow) — lifts swipe-through
const swipeCue = (last) => last ? '' :
  `<div class="cue">→</div>`;

const saveBar = `<div class="savebar">Guardá esto ↗</div>`;

// CAROUSEL_PATTERN_BANK §7: la pildora de arriba CAMBIA DE ROL segun la seccion
// (categoria -> contador -> CTA). Es el sistema de navegacion mas barato que existe:
// el lector siempre sabe donde esta sin leer nada.
function pill(role, idx, total, account) {
  const txt = role === 'cover' ? ACCOUNTS[account].name.toUpperCase()
    : role === 'cta' ? 'COMENTÁ'
    : `PASO ${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  return `<div class="pill">${esc(txt)}</div>`;
}

// Puntos DENTRO de la imagen: el lector ve cuantas slides son y se compromete.
// Un "03 / 08" en texto no produce ese efecto; los puntos si.
// Con UNA sola lamina no hay nada que indicar: un punto solo promete un carrusel
// que no existe. Descubierto el 01-sep en los 3 creativos de ads.
function dots(idx, total) {
  if (total <= 1) return '';
  const d = Array.from({ length: total }, (_, i) =>
    `<i class="${i === idx ? 'on' : ''}"></i>`).join('');
  return `<div class="dots">${d}</div>`;
}

// La palabra del trueque sale del propio cuerpo del ultimo slide ("Comentá *LISTA* y...").
// Asi el ticket no puede desincronizarse del texto: hay una sola fuente.
// La palabra del trueque sale del CUERPO del ultimo slide, y el campo `comment_trigger` del
// brief queda como respaldo — en ese orden y no al reves.
//
// Parece contraintuitivo (un campo estructurado deberia ganarle a un regex) pero se midio el
// 2026-08-17: **6 de 9 briefs tenian el campo podrido** con las palabras viejas — AUTO, COSTO,
// MITO, ESCALA, ORDEN, LIBRE — que se eliminaron al unificar el sistema en SISTEMA y LISTA.
// El cuerpo se reescribio en esa unificacion; el campo no. Leer el campo primero habria
// impreso un boton pidiendo una palabra que ya no existe, que es peor que no tener boton.
//
// Si el cuerpo no dice "Comentá X", NO hay boton: es un cierre de guardado o de pregunta.
function triggerWord(slide) {
  const m = String(slide.body || '').match(/Comentá\s+\*?([A-ZÁÉÍÓÚÑ]{3,})\*?/);
  if (m) return m[1];
  const fromBrief = String(slide.comment_trigger || '').replace(/^Comentá\s+/i, '').trim();
  return /^[A-ZÁÉÍÓÚÑ]{3,}$/.test(fromBrief) ? fromBrief : '';
}

// Que recibe el que comenta la palabra. SALE DEL BRIEF, nunca de una constante.
//
// Hasta el 2026-08-23 esto estaba hardcodeado: si la palabra no era SISTEMA, la slide
// prometia "la lista con los costos" pasara lo que pasara. O sea que el carrusel de la
// palabra HUMO — que entrega un PDF de herramientas de IA — le prometia al lector una
// lista de costos que nadie iba a mandarle. El render inventaba una promesa que el brief
// nunca declaro, que es exactamente lo que la regla de no fabricar prohibe.
//
// Ahora: si el brief no dice que se entrega, el ticket NO se dibuja. La slide sigue
// pidiendo el comentario (titular + boton); lo unico que desaparece es la promesa que
// nadie escribio. Mejor una slide con dos senales que una con una mentira.
function commentReward(slide) {
  const r = String(slide.comment_reward || '').trim();
  return r || '';
}

// La linea de "guardalo" del cierre. Mismo problema que commentReward y misma solucion.
//
// Estaba hardcodeada como "Gratis. Guardalo para cuando te sientes a resolverlo.", que solo
// tiene sentido cuando la pieza REGALA algo. En un carrusel cuyo cierre es una pregunta
// abierta ("¿cuál agregarías vos?") no hay nada gratis ni nada que guardar: la linea
// aparecia igual y prometia un regalo inexistente.
//
// Regla: si el brief trae `save_hint`, se usa. Si no, solo se dibuja la linea clasica
// cuando ADEMAS hay un regalo declarado (`comment_reward`). Sin regalo, no hay "gratis".
function saveHint(slide) {
  const explicit = String(slide.save_hint || '').trim();
  if (explicit) return `<p class="savehint">${esc(explicit)}</p>`;
  if (commentReward(slide)) return `<p class="savehint">Gratis. Guardalo para cuando te sientes a resolverlo.</p>`;
  return '';
}

// Boton de accion, compartido. La slide de CTA es la de mayor intencion de todo el carrusel
// y hasta el 2026-08-17 solo el pack `typographic` dibujaba algo que se leyera como "tocá acá";
// los otros cuatro dejaban solo texto.
const ctaButton = (word) => word ? `<div class="ctabtn">Comentá ${esc(word)}</div>` : '';

// Itemizado con guia punteada, para el estatico "recibo". El motor solo tenia un <p> unico
// como cuerpo (los saltos de linea colapsan), asi que una oferta no se podia desglosar.
// Opcional: sin `lines[]` en el brief no cambia nada.
const itemLines = (slide) => !Array.isArray(slide.lines) || !slide.lines.length ? '' :
  `<div class="lines">${slide.lines.map((l) =>
    `<div class="ln"><span class="ln-k">${esc(l.k)}</span><i class="ln-d"></i><span class="ln-v">${esc(l.v)}</span></div>`
  ).join('')}</div>`;

function logoFooter(account) {
  const acc = ACCOUNTS[account];
  return `<div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="var(--ink)" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="var(--ink)"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>`;
}

// Medido el 01-sep sobre los 8 creativos de ads: los titulares de 40-43 caracteres
// rinden bien; a partir de 46 el titular se parte en cinco lineas y se come la pieza.
// El renderer NO achica la tipografia, asi que el limite es del texto, no del CSS.
const TITULAR_MAX = 44;

function slideHtml(slide, idx, total, account, bg) {
  const role = roleFor(slide, idx, total);
  if (slide.headline) {
    const limpio = String(slide.headline).replace(/\*/g, '');
    if (limpio.length > TITULAR_MAX) {
      console.warn(`[aviso] titular de ${limpio.length} caracteres (max ${TITULAR_MAX}): "${limpio}" — se va a desbordar`);
    }
  }
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  // El fondo se puede fijar POR SLIDE (`slide.bg`) y no solo global (`--bg`).
  //
  // Hizo falta el 2026-08-23: el flag --bg pone la foto en la portada Y en el cierre.
  // La slide de cierre de este pack es verde con texto NEGRO, asi que sobre una foto
  // oscura el titular queda ilegible — se vio comparando renders, no leyendo el CSS.
  // Ahora: `bg` global de base, `slide.bg` lo pisa, y `"slide.bg": ""` lo APAGA para
  // esa slide. Asi la portada lleva foto y el cierre se queda limpio.
  const bgSrc = Object.prototype.hasOwnProperty.call(slide, 'bg')
    ? (slide.bg ? path.resolve(slide.bg) : '')
    : bg;
  const bgLayer = bgSrc
    ? `<div class="bgphoto" style="background-image:url('file://${String(bgSrc).replace(/\\/g, '/')}')"></div><div class="bgscrim"></div>`
    : '';

  let inner = '';
  const word = triggerWord(slide);

  if (role === 'cover') {
    inner = `
      ${bgLayer}
      <div class="topline">${pill(role, idx, total, account)}${last ? '' : '<span class="swipe">SWIPE →</span>'}</div>
      <h1 class="hook">${emph(slide.headline)}</h1>
      ${slide.body ? `<p class="coverline">${emph(slide.body)}</p>` : ''}
      ${/* Con UNA sola lamina no hay slide de cierre que lleve el CTA, y un anuncio
            pagado sin llamada a la accion no vende: el que lo ve no sabe que hacer.
            Descubierto el 01-sep mirando los 3 creativos de ads, que traian
            "cta" en el brief y nunca lo dibujaban. */''}
      ${last && slide.cta ? `<div class="ctabtn">${esc(slide.cta)}</div>` : ''}
      ${dots(idx, total)}
      ${logoFooter(account)}`;
  } else if (role === 'cta') {
    // El cierre es la slide que casi nadie copia bien. El banco §7: el CTA aparece
    // TRES veces (titular, ticket, boton) y se pide GUARDAR ademas de comentar —
    // son dos senales distintas del algoritmo y se piden juntas. De paso, el ticket
    // llena el vacio que dejaba esta slide con solo dos lineas de texto.
    inner = `
      ${bgLayer}
      <div class="topline">${pill(role, idx, total, account)}</div>
      <h2 class="cta-h">${emph(slide.headline)}</h2>
      <p class="body">${emph(slide.body)}</p>
      ${itemLines(slide)}
      ${word && !itemLines(slide) && commentReward(slide) ? `<div class="ticket">
        <div class="ticket-l">
          <span class="ticket-k">Comentás</span>
          <span class="ticket-w">${esc(word)}</span>
        </div>
        <div class="ticket-r">
          <span class="ticket-k">Y recibís</span>
          <span class="ticket-v">${esc(commentReward(slide))}</span>
        </div>
      </div>` : ''}
      ${word ? `<div class="ctabtn">Comentá ${esc(word)}</div>` : ''}
      ${saveHint(slide)}
      ${logoFooter(account)}`;
  } else if (role === 'save') {
    inner = `
      <div class="topline">${pill(role, idx, total, account)}</div>
      ${saveBar}
      <div class="savecard">
        <div class="savetag">FRAMEWORK</div>
        <h2 class="point-h">${emph(slide.headline)}</h2>
        <p class="body">${emph(slide.body)}</p>
      </div>
      ${dots(idx, total)}
      ${swipeCue(last)}
      ${logoFooter(account)}`;
  } else { // stakes | point
    inner = `
      <div class="topline">${pill(role, idx, total, account)}</div>
      <h2 class="point-h">${emph(slide.headline)}</h2>
      <p class="body">${emph(slide.body)}</p>
      ${dots(idx, total)}
      ${swipeCue(last)}
      ${logoFooter(account)}`;
  }

  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide {
  position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column;
  font-family:var(--font-body);
  --ink:var(--onia-ink);
  background:var(--onia-surface); color:var(--onia-ink);
}
/* role backgrounds */
.slide.cover { background:var(--onia-ink); color:var(--onia-white); --ink:var(--onia-white); justify-content:center; }
.slide.cta   { background:var(--onia-green); color:var(--onia-ink); justify-content:center; }
.slide.save  { background:var(--onia-ink); color:var(--onia-white); --ink:var(--onia-white); }

.bgphoto { position:absolute; inset:0; background-size:cover; background-position:center; }
.bgscrim { position:absolute; inset:0; background:linear-gradient(180deg, rgba(10,15,13,.45), rgba(10,15,13,.88)); }
.slide.cover > *:not(.bgphoto):not(.bgscrim) { position:relative; z-index:2; }
.slide.cta   > *:not(.bgphoto):not(.bgscrim) { position:relative; z-index:2; }

.kicker { font-family:var(--font-display); font-weight:500; font-size:30px;
  letter-spacing:6px; text-transform:uppercase; color:var(--onia-green); margin-bottom:36px; }

/* Pildora de rol cambiante + puntos de progreso (CAROUSEL_PATTERN_BANK §7). */
.topline { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; }
.pill { font-family:var(--font-display); font-weight:700; font-size:26px; letter-spacing:4px;
  text-transform:uppercase; padding:14px 28px; border-radius:999px;
  background:var(--onia-green); color:var(--onia-ink); }
.slide.cta .pill { background:var(--onia-ink); color:var(--onia-green); }
.swipe { font-family:var(--font-display); font-weight:700; font-size:24px; letter-spacing:3px;
  color:var(--onia-green); opacity:.9; }
.dots { display:flex; gap:12px; margin-top:auto; padding-top:40px; }
.dots i { width:14px; height:14px; border-radius:50%; background:currentColor; opacity:.22; }
.dots i.on { opacity:1; background:var(--onia-green); }

/* Ticket del trueque: la palabra a comentar ES el cupon. */
/* flex-shrink:0 — sin esto el ticket se encoge a cero en silencio cuando la slide se
   llena y desaparece del PNG sin ningun error. Pasó el 2026-08-15 con el recibo. */
.ticket { display:flex; flex-shrink:0; margin-top:56px; border-radius:28px; overflow:hidden;
  background:var(--onia-ink); color:var(--onia-white); }
.ticket-l, .ticket-r { padding:38px 40px; display:flex; flex-direction:column; gap:10px; }
.ticket-l { flex:0 0 44%; border-right:6px dashed var(--onia-green); }
.ticket-r { flex:1; }
.ticket-k { font-size:26px; letter-spacing:3px; text-transform:uppercase; opacity:.62; }
.ticket-w { font-family:var(--font-display); font-weight:700; font-size:76px;
  letter-spacing:-1px; color:var(--onia-green); }
.ticket-v { font-family:var(--font-display); font-weight:700; font-size:40px; line-height:1.15; }
.ctabtn { margin-top:32px; align-self:flex-start; background:var(--onia-ink);
  color:var(--onia-green); font-family:var(--font-display); font-weight:700; font-size:46px;
  padding:26px 52px; border-radius:999px; }
.savehint { margin-top:28px; font-size:32px; opacity:.72; }
.lines { margin-top:44px; display:flex; flex-direction:column; gap:20px; }
.ln { display:flex; align-items:baseline; gap:16px; font-size:36px; }
.ln-k { font-weight:600; }
.ln-d { flex:1; border-bottom:5px dotted currentColor; opacity:.32; }
.ln-v { font-family:var(--font-display); font-weight:700; font-size:42px; white-space:nowrap; }
.hook { font-family:var(--font-display); font-weight:700; font-size:118px;
  /* 1.02 era demasiado apretado: el fondo del marcador ocupa TODA la caja de linea,
     asi que en un titular de 118px invadia la linea de arriba y CORTABA los
     descendentes. "ya existe" se leia "ua existe" con la palabra resaltada debajo.
     Medido el 2026-08-24 mirando el render, no el CSS. 1.14 deja aire para el
     descendente sin aflojar el bloque de titulo. */
  line-height:1.14; letter-spacing:-3px; }
.coverline { font-size:42px; line-height:1.35; color:var(--onia-muted-dark); margin-top:40px; max-width:840px; }

.pageno { font-family:var(--font-display); font-weight:500; font-size:28px;
  letter-spacing:3px; color:var(--onia-green); }
.point-h { font-family:var(--font-display); font-weight:700; font-size:76px;
  line-height:1.06; letter-spacing:-2px; margin-top:auto; }
.body { font-size:42px; line-height:1.45; margin-top:36px; max-width:880px;
  color:var(--onia-muted); }
.slide.save .body { color:var(--onia-muted-dark); }

.cta-h { font-family:var(--font-display); font-weight:700; font-size:88px;
  line-height:1.05; letter-spacing:-2px; }
.slide.cta .body { color:var(--onia-ink); opacity:.85; font-weight:600; }

.savebar { align-self:flex-start; margin-top:24px; background:var(--onia-green);
  color:var(--onia-ink); font-family:var(--font-display); font-weight:700;
  font-size:30px; padding:14px 28px; border-radius:100px; }
.savecard { margin-top:auto; border:3px solid var(--onia-green); border-radius:var(--r-lg);
  padding:64px; }
.savetag { font-family:var(--font-display); font-weight:700; font-size:26px;
  letter-spacing:4px; color:var(--onia-green); margin-bottom:28px; }

.cue { position:absolute; right:48px; top:50%; transform:translateY(-50%);
  font-size:64px; font-weight:700; color:var(--onia-green); opacity:.9; }

.footer { display:flex; align-items:center; gap:18px; margin-top:auto; padding-top:48px; }
.footer .mark { width:64px; height:64px; }
.footer .handle { font-family:var(--font-display); font-weight:500; font-size:30px;
  color:var(--ink); opacity:.7; }
.slide.cover .point-h, .slide.cover .body { margin-top:0; }
.g { ${EMPH[EMPH_STYLE]} }
/* Dato con fondo propio (research 17-ago, ref Zenovent). El numero antes que la frase. */
.dato { background:var(--onia-green); color:var(--onia-ink); font-weight:700;
  font-size:.9em; padding:.05em .28em; border-radius:.2em; white-space:nowrap; }
.slide.cta .dato { background:var(--onia-ink); color:var(--onia-green); }
/* El slide de CTA tiene fondo verde: un marcador verde ahi no se ve. Se invierte. */
.slide.cta .g { background:var(--onia-ink); color:var(--onia-green); box-shadow:none; }
</style></head>
<body><div class="slide ${role}">${inner}</div></body></html>`;
}

// Escape, then turn *emphasis* into a green span (keyword highlight).

// Formas de resaltar la palabra clave dentro de un titular. Hasta el 2026-08-17 habia una
// sola —cursiva serif— y Sergio la descarto: "busca otra forma de resaltarlo pero que se vea
// mejor". Cada una es un mecanismo distinto, no una variante estetica:
//   marcador  el ojo lo lee como subrayado de libro. Es el mas usado en carruseles que venden
//   subrayado afirma sin gritar; deja la palabra en el mismo plano que el resto
//   color     el mas limpio; falla si la pieza ya usa el acento en otro lado
//   caja      el mas fuerte; funciona cuando la palabra ES el producto
// ⚠️ Accesibilidad: `color` solo depende del color, y esa es la unica que no conviene sola.
const EMPH = {
  serif:     `font-family:'Fraunces',Georgia,serif; font-style:italic; font-weight:600; color:var(--onia-green); letter-spacing:0;`,
  // `white-space:nowrap` NO es cosmetico: sin el, una frase de dos palabras que corta de
  // linea deja el articulo huerfano en su propio bloquecito verde ("a" arriba, "mano" abajo).
  // Se vio el 2026-08-17 en "DEJA DE RESPONDER WHATSAPP *a mano*".
  marcador:  `background:var(--onia-green); color:var(--onia-ink); padding:0 .16em; border-radius:.08em; white-space:nowrap; box-decoration-break:clone; -webkit-box-decoration-break:clone;`,
  subrayado: `color:inherit; box-shadow:inset 0 -.22em 0 var(--onia-green); padding:0 .04em;`,
  color:     `color:var(--onia-green);`,
  caja:      `border:.09em solid var(--onia-green); color:var(--onia-green); padding:0 .18em; border-radius:.18em; box-decoration-break:clone; -webkit-box-decoration-break:clone;`,
};
let EMPH_STYLE = 'marcador';

function emph(s) {
  // {{dato}} -> chip con fondo propio. Del research del 17-ago (referencia Zenovent),
  // señalado como "aplicable directo" y nunca aplicado: hoy las cifras ("20 horas al mes",
  // "40% no vuelve", los precios) son texto corrido en el body de 4 de 5 packs. Con fondo
  // propio el numero se vuelve DATO-COMO-DISENO y se lee antes que la frase que lo rodea.
  // Va antes que el *verde* para que un dato pueda ir dentro de una frase enfatizada.
  return esc(s)
    .replace(/\{\{([^}]+)\}\}/g, '<span class="dato">$1</span>')
    .replace(/\*([^*]+)\*/g, '<span class="g">$1</span>');
}

// Continuation curve: a green stroke that bleeds off the right edge on
// non-last slides (and enters from the left on non-first), giving the
// Solaris-style panorama / swipe cue. Alternates arc direction by parity.
// La curva de continuacion se borro el 2026-08-27. Sergio: "cambia ese fondo con las
// lineas por detras". Cruzaba por detras del cuerpo de texto; para que no se leyera como
// un tachado hubo que bajarle la opacidad de .95 a .42, y a esa opacidad ya no aportaba
// nada. Un adorno que hay que apagar para que no moleste no es un adorno: es ruido.
// Estaba en `continuationCurve()` — recuperable del historial si alguna vez se revive.

// Pack: dark-product (Solaris-style). Black canvas, pills, continuation curve,
// condensed title with *green* keyword, optional 3D object, callout body.
// ---------------------------------------------------------------------------
// Capa de anotacion sobre la captura.
//
// Nace del 2026-08-25: de 28 laminas publicadas, UNA sola tenia una imagen que
// probaba lo que decia su texto. El problema no era elegir mal la captura: era
// mostrar la pantalla entera y esperar que el lector encuentre solo el dato del
// que habla la frase. Una captura sin anotar no explica: decora.
//
// Se declara en el brief, en % del ancho/alto de la imagen (0-100), asi las
// coordenadas no dependen del tamano al que termine dibujada:
//
//   marks: [
//     { type:'box',   x:10, y:44, w:70, h:12 },
//     { type:'spot',  x:58, y:36, w:22, h:9, label:'1 propuesta esperando' },
//     { type:'badge', x:31, y:64, n:2 }
//   ]
//
// `spot` oscurece TODO menos su recuadro: es la mas fuerte y por eso va sola.
function annotate(marks) {
  if (!Array.isArray(marks) || !marks.length) return { capa: '', pie: '' };
  const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const spots = marks.filter((m) => m.type === 'spot');

  // Mascara: el rect blanco deja pasar, el negro tapa. `fill-opacity` en vez de
  // rgba(): SVG no acepta rgba() en el atributo fill de forma confiable, y por eso
  // el primer spotlight se dibujaba sin oscurecer nada.
  const mascara = spots.length ? `<mask id="mk">
      <rect x="0" y="0" width="100" height="100" fill="#fff"/>
      ${spots.map((m) => `<rect x="${num(m.x)}" y="${num(m.y)}" width="${num(m.w, 10)}" height="${num(m.h, 10)}" rx="1.2" fill="#000"/>`).join('')}
    </mask>
    <rect x="0" y="0" width="100" height="100" fill="#060A08" fill-opacity=".72" mask="url(#mk)"/>` : '';

  // Solo los RECUADROS van en el SVG: son los unicos que tienen que deformarse
  // junto con la imagen. Un circulo aca saldria elipse (preserveAspectRatio="none").
  const cajas = marks.filter((m) => m.type === 'box' || m.type === 'spot').map((m) =>
    `<rect x="${num(m.x)}" y="${num(m.y)}" width="${num(m.w, 10)}" height="${num(m.h, 10)}"
      rx="1.2" fill="none" stroke="var(--onia-green)" stroke-width="0.6"
      vector-effect="non-scaling-stroke"/>`).join('');

  const capaSvg = (mascara || cajas)
    ? `<svg class="marks" viewBox="0 0 100 100" preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg">${mascara}${cajas}</svg>` : '';

  // Los badges van en HTML, no en SVG: tienen que quedar redondos pase lo que pase.
  const badges = marks.filter((m) => m.type === 'badge').map((m) =>
    `<span class="mk-badge" style="left:${num(m.x)}%;top:${num(m.y)}%">${esc(String(num(m.n, 1)))}</span>`
  ).join('');

  // 🔴 La etiqueta va DEBAJO de la imagen, nunca encima.
  // Se intento ponerla flotando sobre la captura y tapaba justo el dato que estaba
  // señalando: los recortes utiles son chatos (170 px de alto) y adentro no hay
  // ningun "afuera" al que mandarla. Como pie no tapa nada y ademas se lee mejor.
  const conLabel = marks.filter((m) => m.label);
  const pie = conLabel.length
    ? `<div class="mk-pie">${conLabel.map((m, i) =>
        `<span>${m.type === 'badge' ? `<b>${esc(String(num(m.n, i + 1)))}</b>` : '<i>↑</i>'} ${esc(m.label)}</span>`
      ).join('')}</div>`
    : '';

  return { capa: capaSvg + badges, pie };
}

// CSS de la capa. Se inyecta en los packs que dibujan `object`.
const MARKS_CSS = `
.shot { position:relative; display:block; }
.shot .marks { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.mk-badge { position:absolute; transform:translate(-50%,-50%); width:46px; height:46px;
  border-radius:50%; background:var(--onia-green); color:var(--onia-ink);
  font:800 26px/46px 'Archivo', sans-serif; text-align:center;
  box-shadow:0 0 0 5px rgba(6,10,8,.55); }
.mk-pie { display:flex; flex-wrap:wrap; gap:10px 26px; margin:18px 0 0;
  font-size:24px; line-height:1.25; color:var(--onia-green); font-weight:600; }
.mk-pie span { display:flex; align-items:center; gap:9px; }
.mk-pie b { display:inline-block; width:30px; height:30px; border-radius:50%;
  background:var(--onia-green); color:var(--onia-ink); font:800 18px/30px 'Archivo', sans-serif;
  text-align:center; }
.mk-pie i { font-style:normal; opacity:.85; }
`;

function darkProductHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  // Objeto por-lamina, con el global de --object como respaldo. Sin esto la MISMA
  // captura se repetia en las 7 laminas y el mockup dejaba de ser prueba para ser
  // relleno (visto en O04, 2026-08-24).
  const objSrc = (slide.object ? path.resolve(slide.object) : '') || (args && args.object);
  // `bleed` manda la imagen a todo el ancho del lienzo. Existe porque el slot fijo
  // de 620px dejaba el panel de 2160px a escala 0,26: la UI quedaba en ~8 px sobre un
  // piso de legibilidad de 28. La portada que promete "te lo muestro con la pantalla"
  // mostraba una mancha.
  const bleed = slide.object_fit === 'bleed';
  const anot = annotate(slide.marks);
  const object = objSrc
    ? `<figure class="shot${bleed ? ' bleed' : ''}">
      <img class="object" src="file://${String(objSrc).replace(/\\/g, '/')}" alt="">
      ${anot.capa}
      </figure>
      ${anot.pie}
      `
    : '';

  // On save slides the savetag already labels "FRAMEWORK", so drop the top pill
  // to avoid the duplicate and keep the hierarchy clean.
  const pills = (slide.pill && role !== 'save') ? `<div class="pills">
    <span class="pill solid">${esc(slide.pill)}</span>
  </div>` : '<div class="pills"></div>';

  const callout = slide.callout
    ? `<div class="callout">${emph(slide.callout)}</div>` : '';

  // La lamina "Con Onia Platform". Nace en `dato-ilustrado` pero el arco aprobado la
  // exige en toda pieza de @oniahq: sin ella la pieza es un problema sin dueño.
  const solucion = Array.isArray(slide.solucion) && slide.solucion.length
    ? `<ul class="solucion">${slide.solucion.map((x) => `<li>${emph(x)}</li>`).join('')}</ul>`
    : '';

  let block;
  if (role === 'save') {
    block = `<div class="savetag">FRAMEWORK · Guardá esto ↗</div>
      <h2 class="dp-h">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dp-body">${emph(slide.body)}</p>` : ''}`;
  } else if (role === 'cta') {
    block = `<h2 class="dp-h cta">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dp-body">${emph(slide.body)}</p>` : ''}`;
  } else {
    block = `<h2 class="dp-h">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dp-body">${emph(slide.body)}</p>` : ''}`;
  }
  block += solucion;

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}${DATO_CSS}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column;
  background:var(--onia-ink); color:var(--onia-white);
  font-family:'Inter',var(--font-body); }
.slide.cta { background:var(--onia-green); color:var(--onia-ink); }
.g { color:var(--onia-green); }
.slide.cta .g { color:var(--onia-ink); -webkit-text-stroke:0; background:var(--onia-ink); color:var(--onia-green); padding:0 .12em; }

.curve { position:absolute; inset:0; width:${FMT.w}px; height:${FMT.h}px; z-index:0; pointer-events:none; }
.curve path { fill:none; stroke:var(--onia-green); stroke-width:16; stroke-linecap:round; opacity:.42; }
.slide.cta .curve path { stroke:var(--onia-ink); opacity:.5; }
.slide > *:not(.curve) { position:relative; z-index:2; }

.pills { display:flex; align-items:center; gap:16px; }
.pill { font-family:'Archivo'; font-weight:600; font-size:26px; color:var(--onia-white);
  border:2px solid rgba(255,255,255,.35); border-radius:100px; padding:10px 22px; }
.pill.solid { background:var(--onia-green); color:var(--onia-ink); border-color:var(--onia-green); }
.slide.cta .pill { color:var(--onia-ink); border-color:rgba(10,15,13,.4); }
.slide.cta .pill.solid { background:var(--onia-ink); color:var(--onia-green); }
.pageno { margin-left:auto; font-family:'Archivo'; font-weight:600; font-size:26px;
  letter-spacing:2px; color:var(--onia-green); }
.slide.cta .pageno { color:var(--onia-ink); }

${DATO_CSS}
.object { display:block; max-width:620px; max-height:420px; margin:24px auto;
  object-fit:contain; filter:drop-shadow(0 30px 60px rgba(0,0,0,.5)); }
${MARKS_CSS}
/* A sangre: la imagen manda y el texto se le pega abajo. El slot de 620px dejaba una
   captura de 2160px a escala 0,26 — una mancha donde tenia que haber una prueba. */
.shot.bleed { margin:0 calc(var(--pad) * -1); width:calc(100% + var(--pad) * 2); }
.shot.bleed .object { max-width:none; max-height:620px; width:100%; margin:0;
  object-fit:cover; border-radius:0; filter:none; }

.dp-h { font-family:'Archivo'; font-weight:900; font-size:88px; line-height:.98;
  letter-spacing:-2px; text-transform:uppercase; margin-top:auto; }
/* Con imagen, el titular NO se va al piso: se pega a la prueba de la que habla. El
   El margin-top:auto de arriba abria una banda muerta de hasta 520px entre la frase y
   su evidencia — split-attention de manual. Sin imagen sigue bajando, que ahi si
   funciona. */
.slide.has-shot .dp-h { margin-top:36px; }
.slide.has-shot .dp-body { margin-bottom:auto; }
.dp-h.cta { font-size:80px; }
/* La lista de "Con Onia Platform". Mismo lenguaje que en dato-ilustrado: la marca de
   verificacion en verde es la unica parte de la pieza que habla del producto. */
.solucion{list-style:none;margin-top:26px;display:flex;flex-direction:column;gap:18px}
.solucion li{position:relative;padding-left:48px;font-family:'Inter';font-weight:600;
  font-size:32px;line-height:1.3;color:#fff;max-width:26ch}
.solucion li::before{content:"";position:absolute;left:0;top:.32em;width:24px;height:13px;
  border-left:4px solid var(--onia-green);border-bottom:4px solid var(--onia-green);
  transform:rotate(-45deg)}
.slide.cta .solucion li{color:var(--onia-ink)}
.slide.cta .solucion li::before{border-color:var(--onia-ink)}

.dp-body { font-family:'Inter'; font-weight:600; font-size:36px; line-height:1.38;
  margin-top:28px; max-width:880px; color:var(--onia-muted-dark); }
.slide.cta .dp-body { color:var(--onia-ink); opacity:.85; }

.savetag { font-family:'Archivo'; font-weight:800; font-size:28px; letter-spacing:3px;
  color:var(--onia-green); margin-top:auto; margin-bottom:24px; }

.callout { display:inline-flex; align-self:flex-start; gap:12px; margin-top:32px;
  background:var(--onia-white); color:var(--onia-ink); font-weight:600; font-size:32px;
  border-radius:24px; padding:22px 30px; max-width:760px; }

.footer { display:flex; align-items:center; gap:18px; margin-top:48px; }
.footer .mark { width:60px; height:60px; }
.footer .handle { font-family:'Archivo'; font-weight:600; font-size:30px; opacity:.75; }
.footer .mark circle[stroke="var(--ink)"] { stroke:var(--onia-white); }
.slide.cta .footer .handle { color:var(--onia-ink); }
</style></head>
<body><div class="slide ${role}${object ? ' has-shot' : ''}">
  <!-- sin curva de fondo: ver el comentario de continuationCurve() -->
  ${pills}
  ${object}
  ${block}
  ${callout}
  <div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="${role === 'cta' ? 'var(--onia-ink)' : 'var(--onia-white)'}" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="${role === 'cta' ? 'var(--onia-ink)' : 'var(--onia-white)'}"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
}

// Pack: dark-neon (Perfluence style). Black canvas, faint grid + radial green
// glow + halftone dots, neon headline (green glow), floating 3D object with glow.
function darkNeonHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const acc = ACCOUNTS[account];
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  // Objeto por-lamina, con el global de --object como respaldo. Sin esto la MISMA
  // captura se repetia en las 7 laminas y el mockup dejaba de ser prueba para ser
  // relleno (visto en O04, 2026-08-24).
  const objSrc = (slide.object ? path.resolve(slide.object) : '') || (args && args.object);
  // `bleed` manda la imagen a todo el ancho del lienzo. Existe porque el slot fijo
  // de 620px dejaba el panel de 2160px a escala 0,26: la UI quedaba en ~8 px sobre un
  // piso de legibilidad de 28. La portada que promete "te lo muestro con la pantalla"
  // mostraba una mancha.
  const bleed = slide.object_fit === 'bleed';
  const anot = annotate(slide.marks);
  const object = objSrc
    ? `<figure class="shot${bleed ? ' bleed' : ''}">
      <img class="object" src="file://${String(objSrc).replace(/\\/g, '/')}" alt="">
      ${anot.capa}
      </figure>
      ${anot.pie}
      `
    : '';

  const pills = (slide.pill && role !== 'save') ? `<div class="pills">
    <span class="pill solid">${esc(slide.pill)}</span>
  </div>` : '<div class="pills"></div>';
  const callout = slide.callout ? `<div class="callout">${emph(slide.callout)}</div>` : '';

  let block;
  if (role === 'save') {
    block = `<div class="savetag">FRAMEWORK · Guardá esto ↗</div>
      <h2 class="dn-h">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dn-body">${emph(slide.body)}</p>` : ''}`;
  } else {
    block = `<h2 class="dn-h${role === 'cta' ? ' cta' : ''}">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dn-body">${emph(slide.body)}</p>` : ''}`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}${DATO_CSS}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column;
  background:#05080A; color:var(--onia-white); font-family:'Inter',var(--font-body); }
.grid { position:absolute; inset:0; z-index:0;
  background-image:linear-gradient(rgba(52,224,74,.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(52,224,74,.10) 1px, transparent 1px);
  background-size:60px 60px; -webkit-mask-image:radial-gradient(circle at 50% 38%, #000 0%, transparent 72%); }
.glow { position:absolute; left:50%; top:34%; transform:translate(-50%,-50%);
  width:900px; height:900px; z-index:0; border-radius:50%;
  background:radial-gradient(circle, rgba(52,224,74,.28) 0%, rgba(52,224,74,0) 62%); }
.halftone { position:absolute; right:-40px; bottom:240px; width:360px; height:360px; z-index:0; opacity:.5;
  background-image:radial-gradient(rgba(52,224,74,.6) 30%, transparent 32%); background-size:20px 20px;
  -webkit-mask-image:linear-gradient(135deg, #000, transparent 70%); }
.slide > *:not(.grid):not(.glow):not(.halftone) { position:relative; z-index:2; }
.g { color:var(--onia-green); }
.pills { display:flex; align-items:center; gap:16px; }
.pill { font-family:'Archivo'; font-weight:600; font-size:26px; color:var(--onia-white);
  border:2px solid rgba(52,224,74,.45); border-radius:100px; padding:10px 22px; }
.pill.solid { background:var(--onia-green); color:#05080A; border-color:var(--onia-green);
  box-shadow:0 0 24px rgba(52,224,74,.5); }
.pageno { margin-left:auto; font-family:'Archivo'; font-weight:600; font-size:26px; letter-spacing:2px; color:var(--onia-green); }
.object { display:block; max-width:600px; max-height:410px; margin:20px auto;
  object-fit:contain; filter:drop-shadow(0 0 50px rgba(52,224,74,.45)) drop-shadow(0 30px 50px rgba(0,0,0,.6)); }
.dn-h { font-family:'Archivo'; font-weight:900; font-size:88px; line-height:.98;
  letter-spacing:-2px; text-transform:uppercase; margin-top:auto; }
.dn-h.cta { font-size:80px; }
.dn-h .g { text-shadow:0 0 28px rgba(52,224,74,.75); }
.dn-body { font-family:'Inter'; font-weight:600; font-size:36px; line-height:1.38;
  margin-top:28px; max-width:880px; color:rgba(255,255,255,.78); }
.savetag { font-family:'Archivo'; font-weight:800; font-size:28px; letter-spacing:3px;
  color:var(--onia-green); margin-top:auto; margin-bottom:24px; }
.callout { display:inline-flex; align-self:flex-start; gap:12px; margin-top:32px;
  background:rgba(52,224,74,.12); border:2px solid rgba(52,224,74,.5);
  color:var(--onia-white); font-weight:600; font-size:32px; border-radius:24px; padding:20px 28px; max-width:780px; }
.footer { display:flex; align-items:center; gap:18px; margin-top:48px; }
.footer .mark { width:60px; height:60px; }
.footer .handle { font-family:'Archivo'; font-weight:600; font-size:30px; opacity:.75; }
</style></head>
<body><div class="slide ${role}${object ? ' has-shot' : ''}">
  <div class="grid"></div><div class="glow"></div><div class="halftone"></div>
  ${pills}
  ${object}
  ${block}
  ${callout}
  <div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="var(--onia-white)" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="var(--onia-white)"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
}

// Pack: editorial-photo (Mobile Editing Club / Asterisk style). Full-bleed photo,
// scrim + grain, heavy sans headline with *serif-italic* accent, pill caption.
// Needs --bg (a photo). Falls back to ink field if no photo given.
function editorialPhotoHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  const rawBg = slide.bg || (args && args.bg) || '';
  const bg = rawBg ? path.resolve(rawBg).replace(/\\/g, '/') : '';
  // La foto de fondo puede ser una CAPTURA DEL PRODUCTO, y entonces se puede anotar.
  // Este pack no tiene slot de objeto flotante -es foto a sangre con texto encima-, y
  // por eso O01 y O02 salieron con 14 laminas hablando de un sistema que no se ve:
  // sus fotos eran ambiente decorativo. Anotando el fondo, la misma lamina pasa de
  // decorada a demostrada, sin tocar el layout.
  const anot = annotate(slide.marks);
  const photo = bg
    ? `<div class="photo" style="background-image:url('file://${bg}')">${anot.capa}</div>`
    : '';

  const headTag = role === 'cover' ? 'h1' : 'h2';
  const pill = slide.pill
    ? `<div class="topbar"><span class="captop">${esc(slide.pill)}</span></div>` : '';
  const body = slide.body ? `<p class="ed-body">${emph(slide.body)}</p>` : '';
  // Acento propio de la cuenta (una modelo no lleva el verde de la marca Onia).
  const accentVar = acentoDe(args, account)
    ? `:root, .slide { --onia-green: ${acentoDe(args, account)}; }` : '';

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Fraunces:ital,wght@1,500;1,600&family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>
${tokens}${DATO_CSS}
${accentVar}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column; justify-content:flex-end;
  background:var(--onia-ink); color:var(--onia-white); font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif,'Segoe UI',system-ui,Arial,sans-serif; }
.photo { position:absolute; inset:0; background-size:cover; background-position:center; z-index:0; }
${MARKS_CSS}
.photo .marks { position:absolute; inset:0; width:100%; height:100%; }
.scrim { position:absolute; inset:0; z-index:1;
  background:linear-gradient(180deg, rgba(10,15,13,.15) 0%, rgba(10,15,13,.55) 55%, rgba(10,15,13,.92) 100%); }
.grain { position:absolute; inset:0; z-index:2; opacity:.10; mix-blend-mode:overlay; }
.slide > *:not(.photo):not(.scrim):not(.grain):not(.topbar) { position:relative; z-index:3; }

/* Category pill sits at the TOP (niche-winner pattern); no ghost kicker/pageno
   behind the headline. */
.topbar { position:absolute; top:var(--pad); left:var(--pad); right:var(--pad);
  display:flex; align-items:flex-start; z-index:4; height:auto; pointer-events:none; }
.captop { display:inline-flex; background:var(--onia-green); color:var(--onia-ink);
  font-family:'Archivo','Arial Black',Arial,sans-serif; font-weight:800; font-size:26px; letter-spacing:1px;
  text-transform:uppercase; padding:12px 24px; border-radius:100px; }

.ed-h { font-family:'Archivo','Arial Black',Arial,sans-serif; font-weight:900; font-size:96px; line-height:.98;
  letter-spacing:-2px; text-transform:uppercase; }
.ed-h .g { text-transform:none; ${EMPH[EMPH_STYLE]} }
.ed-body { font-family:'Inter','Segoe UI',system-ui,Arial,sans-serif; font-weight:500; font-size:38px; line-height:1.4;
  margin-top:28px; max-width:880px; color:rgba(255,255,255,.85); }
.ed-body .g { ${EMPH[EMPH_STYLE]} }
/* CTA de pieza de UNA lamina: sin slide de cierre, la portada la lleva. */
.ed-cta { display:inline-block; align-self:flex-start; margin-top:28px;
  background:var(--onia-green); color:var(--onia-ink);
  font-family:'Archivo','Arial Black',Arial,sans-serif; font-weight:800;
  font-size:34px; letter-spacing:.4px; padding:18px 30px; border-radius:999px; }
.swipe { align-self:flex-start; margin-top:28px; font-family:'Archivo','Arial Black',Arial,sans-serif; font-weight:800;
  font-size:26px; letter-spacing:3px; text-transform:uppercase; color:var(--onia-green); }

.footer { display:flex; align-items:center; gap:16px; margin-top:40px; }
.footer .mark { width:56px; height:56px; }
.footer .handle { font-family:'Archivo','Arial Black',Arial,sans-serif; font-weight:800; font-size:28px; opacity:.85; }
.ctabtn { align-self:flex-start; margin-top:34px; background:var(--onia-green); color:var(--onia-ink);
  font-family:'Archivo','Arial Black',Arial,sans-serif; font-weight:900; font-size:40px; letter-spacing:-0.5px;
  padding:26px 46px; border-radius:100px; box-shadow:0 18px 48px rgba(0,0,0,.45); }
</style></head>
<body><div class="slide ${role}">
  ${photo}<div class="scrim"></div>${anot.pie}
  <svg class="grain" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>
  ${pill}
  <${headTag} class="ed-h">${emph(slide.headline)}</${headTag}>
  ${body}
  ${role === 'cta' ? ctaButton(triggerWord(slide)) : ''}
  ${role !== 'cta' && last && slide.cta ? `<div class="ed-cta">${esc(slide.cta)}</div>` : ''}
  ${last ? '' : '<div class="swipe">Deslizá →</div>'}
  <div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="var(--onia-white)" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="var(--onia-white)"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
}


// Pack: editorial-clean (2026-08-20, pedido de Sergio: "menos cargado, letras mas
// atractivas, que venda"). Serif editorial en caja mixta sobre foto full-bleed.
// Diferencias contra editorial-photo: sin pill con caja, sin "Desliza" en cada
// slide, sin logo en el footer, cuerpo mas liviano. El CTA SIEMPRE pide la
// palabra: si el brief no la trae, el render FALLA a proposito (regla de Sergio).
function editorialCleanHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  const rawBg = slide.bg || (args && args.bg) || '';
  const bg = rawBg ? path.resolve(rawBg).replace(/\\/g, '/') : '';
  const photo = bg
    ? `<div class="photo" style="background-image:url('file://${bg}')"></div>`
    : '';
  const accentVar = acentoDe(args, account)
    ? `:root, .slide { --onia-green: ${acentoDe(args, account)}; }` : '';

  if (role === 'cta' && !triggerWord(slide)) {
    throw new Error(`editorial-clean: la slide CTA no pide ninguna palabra (regla: siempre se pide comentar). Slide: ${slide.headline}`);
  }

  const headTag = role === 'cover' ? 'h1' : 'h2';
  // Marcador de SERIE. Adoptado de la referencia @josecarlosttb (2026-08-24): pone el
  // nombre de la serie a la izquierda y el numero de episodio ("// 001") al lado. Convierte
  // piezas sueltas en coleccion e invita a buscar la anterior — branding por repeticion.
  // Se toma de `serie` y `episodio` del brief; si no estan, no se dibuja nada.
  const serieTxt = String((args && args.serie) || '').trim();
  const epTxt = String((args && args.episodio) || '').trim();
  const serieBar = (serieTxt || epTxt)
    ? `<div class="serie">${serieTxt ? `<span>${esc(serieTxt)}</span>` : '<span></span>'}${epTxt ? `<span class="ep">// ${esc(epTxt)}</span>` : ''}</div>`
    : '';
  const kicker = slide.pill
    ? `<div class="kicker"><span class="dot"></span>${esc(slide.pill)}</div>` : '';
  const body = slide.body ? `<p class="cl-body">${emph(slide.body)}</p>` : '';
  const word = triggerWord(slide);
  const cta = role === 'cta'
    ? `<div class="cl-cta">Comentá&nbsp;<b>${esc(word)}</b></div>` : '';
  const serie = serieBar;

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
${tokens}
${accentVar}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  padding:calc(var(--pad) * 1.2); display:flex; flex-direction:column; justify-content:flex-end;
  background:var(--onia-ink); color:var(--onia-white); font-family:'Inter',system-ui,Arial,sans-serif; }
.photo { position:absolute; inset:0; background-size:cover; background-position:center; z-index:0; }
.scrim { position:absolute; inset:0; z-index:1;
  background:linear-gradient(180deg, rgba(10,15,13,.05) 0%, rgba(10,15,13,.38) 52%, rgba(10,15,13,.88) 100%); }
.grain { position:absolute; inset:0; z-index:2; opacity:.06; mix-blend-mode:overlay; }
.slide > *:not(.photo):not(.scrim):not(.grain):not(.kicker):not(.cl-arrow):not(.serie) { position:relative; z-index:3; }
.kicker, .cl-arrow { z-index:4; }

.kicker { position:absolute; top:calc(var(--pad) * 1.2); left:calc(var(--pad) * 1.2);
  display:flex; align-items:center; gap:14px; font-weight:600; font-size:24px;
  letter-spacing:5px; text-transform:uppercase; color:rgba(255,255,255,.92); }
.kicker .dot { width:12px; height:12px; border-radius:50%; background:var(--onia-green); }

.cl-h { font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:118px;
  line-height:1.02; letter-spacing:-1px; max-width:920px; text-wrap:balance; }
.cl-h .g { font-style:italic; color:var(--onia-green); background:none; padding:0;
  box-shadow:none; border-radius:0; }
.cl-body { font-weight:400; font-size:33px; line-height:1.5; margin-top:30px;
  max-width:780px; color:rgba(255,255,255,.78); }
.cl-body .g { background:none; padding:0; box-shadow:none; color:var(--onia-white);
  font-weight:600; }
.cl-body b, .cl-body strong { color:var(--onia-white); font-weight:600; }

.cl-cta { align-self:flex-start; margin-top:38px; display:flex; align-items:baseline;
  background:var(--onia-green); color:var(--onia-ink); font-size:42px; font-weight:400;
  font-family:'Instrument Serif',Georgia,serif; font-style:italic;
  padding:24px 48px; border-radius:100px; box-shadow:0 18px 48px rgba(0,0,0,.4); }
.cl-cta b { font-family:'Inter',sans-serif; font-style:normal; font-weight:700;
  letter-spacing:1px; }

.cl-arrow { position:absolute; right:calc(var(--pad) * 1.2); bottom:calc(var(--pad) * 1.2);
  font-size:52px; color:var(--onia-green); font-family:Georgia,serif; }
.cl-handle { margin-top:44px; font-size:24px; letter-spacing:2px; font-weight:600;
  color:rgba(255,255,255,.55); }
/* Barra de serie: nombre a la izquierda, episodio a la derecha. Discreta a proposito —
   es branding por repeticion, no un titular. */
.serie { position:absolute; top:calc(var(--pad) * 1.2); left:calc(var(--pad) * 1.2);
  right:calc(var(--pad) * 1.2); display:flex;
  justify-content:space-between; align-items:baseline; font-family:'Inter',sans-serif;
  font-weight:600; font-size:26px; letter-spacing:3px; text-transform:uppercase;
  /* .62 era ilegible sobre foto clara: el scrim de este pack pesa ABAJO (donde va el
     texto) y arriba no cubre nada. Se vio en una portada con ventana. Sombra suave
     ademas, para que aguante cualquier fondo. */
  color:rgba(255,255,255,.88); text-shadow:0 1px 14px rgba(0,0,0,.6); z-index:3; }
.serie .ep { color:var(--onia-green); letter-spacing:2px; }
/* Dato con fondo propio: el numero se lee antes que la frase. */
.dato { background:var(--onia-green); color:var(--onia-ink); font-family:'Inter',sans-serif;
  font-weight:700; font-size:.86em; padding:.06em .3em; border-radius:.2em;
  white-space:nowrap; letter-spacing:-.01em; }
/* Con barra de serie, el kicker baja: si no, se pisan (los dos viven en el margen de arriba). */
.slide.has-serie .kicker { top:calc(var(--pad) * 1.2 + 62px); }
</style></head>
<body><div class="slide ${role}${serieBar ? ' has-serie' : ''}">
  ${photo}<div class="scrim"></div>
  <svg class="grain" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>
  ${serie}
  ${kicker}
  <${headTag} class="cl-h">${emph(slide.headline)}</${headTag}>
  ${body}
  ${cta}
  <div class="cl-handle">${esc(acc.handle)}</div>
  ${last ? '' : '<div class="cl-arrow">&#8594;</div>'}
</div></body></html>`;
}

// Ribbon multicolor continuo (eco de las franjas del logo Nuvia). Fluye de
// borde a borde y cambia de fase por slide -> sensación de panorama/peek entre
// slides, como la curva verde del pack dark-product de Onia.
function nuviaRibbon(idx, total, stripes, onAccent) {
  const first = idx === 0;
  const last = idx === total - 1;
  // S-curve base que entra por izquierda y sale por derecha; alterna altura.
  const up = idx % 2 === 0;
  // Mismo problema y mismo arreglo que la curva de dark-product: las alturas estan
  // escritas en el lienzo FEED y hay que escalarlas al formato activo, o el ribbon
  // queda descolocado en cuadrado y en story.
  const syR = (y) => Math.round(y * FMT.h / FORMATS.feed.h);
  const yA = syR(up ? 430 : 980);
  const yB = syR(up ? 980 : 430);
  const base = `M -120 ${yA} C 260 ${yA} 320 ${yB} 560 ${yB} S 900 ${yA} 1200 ${yA}`;
  const cols = onAccent
    ? ['rgba(255,255,255,.9)', 'rgba(255,255,255,.6)', 'rgba(255,255,255,.35)', 'rgba(255,255,255,.2)', 'rgba(255,255,255,.12)']
    : stripes;
  const paths = cols.map((c, i) =>
    `<path d="${base}" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round" transform="translate(0 ${(i - 2) * 30})"/>`
  ).join('');
  // En cover/cta el ribbon va más visible; en el resto, sutil al fondo.
  const op = onAccent ? 0.9 : (first || last ? 0.5 : 0.28);
  return `<svg class="ribbon" viewBox="0 0 ${FMT.w} ${FMT.h}" xmlns="http://www.w3.org/2000/svg" style="opacity:${op}">${paths}</svg>`;
}

// Pack: bright-retail (Nuvia-style). Marca clara/multicolor, amigable, con
// ribbon continuo, composición anclada y slot de producto por slide.
// Pack de mnemotecnia, portado de la ficha Q04. Vive en su propio archivo porque
// este ya pasa las 1200 lineas. Recibe los helpers en vez de duplicarlos.
// Pack del dato ilustrado: imagen a sangre + tipografia contrastante. Nace de las
// cinco criticas de Sergio del 2026-08-27 a los carruseles anteriores.
// Pack de la marca personal de Sergio: las herramientas como empleados contratados.
// Portado de la referencia que el mismo eligio (@iampascio, 2026-08-27).
// Config compartida por todos los packs externos.
const PACK_CFG = { esc, emph, roleFor, ACCOUNTS, BRAND, getFmt: () => FMT };

// Los packs externos se cargan PEREZOSO: si el archivo del pack no está en el repo
// (empleado/dato/papel nunca se commitearon), un require eager acá rompía el script
// entero — incluso al pedir bloque-solido, que sí existe. Ahora sólo falla si se
// selecciona ese pack, y con un mensaje claro.
function lazyPack(modPath) {
  let fn = null;
  return function (...a) {
    if (!fn) {
      try { fn = require(modPath).crear(PACK_CFG); }
      catch (e) { throw new Error('Pack no disponible (' + modPath + ' falta en el repo): ' + e.message); }
    }
    return fn(...a);
  };
}

const tarjetaEmpleadoHtml = lazyPack('./carousel_pack_empleado');
const datoIlustradoHtml = lazyPack('./carousel_pack_dato');
const papelSubrayadoHtml = lazyPack('./carousel_pack_papel');
const bloqueSolidoHtml = require('./carousel_pack_solido').crear(PACK_CFG);
const communityEditorialHtml = require('./carousel_pack_editorial').crear(PACK_CFG);

function brightRetailHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account] || ACCOUNTS.onia;
  const brand = BRANDS[account] || BRANDS.nuvia;
  const accent = brand.accents[idx % brand.accents.length];
  const stripes = brand.stripes || brand.accents;
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');

  const coverLike = role === 'cover' || role === 'cta';
  // objeto: por-slide (slide.object) o global (--object). Ruta relativa al repo.
  const objUrl = assetUrl(slide.object) || (args && args.object ? assetUrl(args.object) : '');
  const object = objUrl ? `<img class="object" src="${objUrl}" alt="">` : '';
  const logoUrl = assetUrl(brand.logo);
  const logo = logoUrl ? `<img class="brandmark" src="${logoUrl}" alt="">` : '';

  const pill = slide.pill ? `<span class="pill">${esc(slide.pill)}</span>` : '';
  const callout = slide.callout ? `<div class="callout">${emph(slide.callout)}</div>` : '';
  const headTag = role === 'cover' ? 'h1' : 'h2';
  const body = slide.body ? `<p class="br-body">${emph(slide.body)}</p>` : '';
  const savetag = role === 'save' ? `<div class="savetag">GUARDÁ ESTO ↗</div>` : '';
  const hlen = (slide.headline || '').replace(/\*/g, '').length;
  const hsize = hlen > 30 ? 86 : (hlen > 18 ? 100 : 116);

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&display=swap" rel="stylesheet">
<style>
${tokens}${DATO_CSS}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column;
  font-family:'Inter',system-ui,sans-serif;
  --accent:${accent};
  background:${coverLike ? accent : brand.bg};
  color:${coverLike ? '#FFFFFF' : brand.ink}; }
.ribbon { position:absolute; inset:0; width:${FMT.w}px; height:${FMT.h}px; z-index:0; pointer-events:none; }
.slide > *:not(.ribbon) { position:relative; z-index:2; }
.g { color:var(--accent); }
.slide.cover .g, .slide.cta .g { color:#fff; text-decoration:underline; text-decoration-thickness:9px; text-underline-offset:8px; }

.topbar { display:flex; align-items:center; gap:16px; }
.kicker { font-weight:900; font-size:32px; letter-spacing:.5px; color:${coverLike ? '#fff' : brand.ink}; }

/* main: llena el alto y ancla el contenido abajo (cover/cta: centrado) */
.main { flex:1; display:flex; flex-direction:column;
  justify-content:${role === 'cover' ? 'center' : 'flex-end'}; min-height:0; }
/* producto: alto FIJO -> escala consistente entre slides, ancho auto, centrado.
   El alto se adapta a si hay headline largo o no (slide chico vs grande). */
.object { display:block; height:${hlen > 30 ? 420 : 480}px; width:auto;
  max-width:620px; margin:0 auto auto; object-fit:contain;
  filter:drop-shadow(0 30px 55px rgba(15,45,82,.28)); }
.spacer { margin-top:auto; }

.savetag { align-self:flex-start; margin-bottom:18px; font-weight:900;
  font-size:28px; letter-spacing:2px; color:${coverLike ? '#fff' : accent}; }
.br-h { font-weight:900; font-size:${hsize}px; line-height:.98; letter-spacing:-3px; }
.br-body { font-weight:500; font-size:40px; line-height:1.4; margin-top:26px; max-width:880px;
  color:${coverLike ? 'rgba(255,255,255,.92)' : brand.muted}; }
.pill { display:inline-flex; align-self:flex-start; margin-top:26px; font-weight:800;
  font-size:26px; padding:13px 28px; border-radius:100px;
  background:${coverLike ? 'rgba(255,255,255,.2)' : accent}; color:#fff; }
.callout { display:inline-flex; align-self:flex-start; margin-top:24px; background:#fff; color:${brand.ink};
  font-weight:600; font-size:32px; border-radius:20px; padding:20px 28px; max-width:800px;
  box-shadow:0 16px 44px rgba(15,45,82,.16); }

.footer { display:flex; align-items:center; gap:16px; margin-top:36px; }
.footer .brandmark { width:62px; height:62px; border-radius:14px;
  background:#fff; padding:6px; box-shadow:0 6px 18px rgba(15,45,82,.14); }
.footer .handle { font-weight:800; font-size:30px; color:${coverLike ? '#fff' : brand.ink}; }
.footer .tag { margin-left:auto; font-weight:700; font-size:22px; letter-spacing:2px; opacity:.55; }
${last ? '' : `.cue{position:absolute;right:46px;bottom:300px;z-index:3;font-size:58px;font-weight:900;color:${coverLike ? '#fff' : accent}}`}
</style></head>
<body><div class="slide ${role}">
  ${nuviaRibbon(idx, total, stripes, coverLike)}
  <div class="topbar"><span class="kicker">${esc(acc.name)}</span></div>
  <div class="main">
    ${object}
    ${object ? '<div class="spacer"></div>' : ''}
    ${savetag}
    <${headTag} class="br-h">${emph(slide.headline)}</${headTag}>
    ${body}
    ${pill}
    ${callout}
  </div>
  ${last ? '' : '<div class="cue">→</div>'}
  <div class="footer">
    ${logo}<span class="handle">${esc(acc.handle)}</span><span class="tag">${esc(brand.tagline || '')}</span>
  </div>
</div></body></html>`;
}

// La cuenta personal no publica palabras vacías: si el cierre pide comentar una palabra,
// esa palabra lleva a un recurso, y el final siempre identifica a Sergio. Así el CTA es
// una puerta útil, no un truco para inflar comentarios.
// La palabra NO es obligatoria: el 25-sep las tres páginas de recurso de la semana
// (/automatizar, /agentes, /mcp) daban 404 en producción, y un «Guardalo» honesto le
// gana a una palabra que promete algo que no existe. Que la URL responda se verifica
// antes de publicar: el render no sale a la red.
function faltantesCtaSergio(brief) {
  const resource = brief.resource || {};
  return [
    brief.comment_trigger && !resource.title && 'resource.title',
    // Un recurso que se manda a mano por mensaje (la agenda, un formulario) no tiene URL: vale
    // si el brief lo declara con `entrega: 'manual'`, y entonces contestar es trabajo de Sergio.
    brief.comment_trigger && !resource.url && resource.entrega !== 'manual' && 'resource.url',
    !brief.identity && 'identity',
    !brief.follow_cta && 'follow_cta',
  ].filter(Boolean);
}

function render(args) {
  const brief = JSON.parse(fs.readFileSync(args.brief, 'utf8'));
  if (args.account === 'sergio' && args.pack === 'community-editorial') {
    const missing = faltantesCtaSergio(brief);
    if (missing.length) throw new Error(`Sergio community-editorial requiere CTA útil: falta ${missing.join(', ')}`);
  }
  const slides = (brief.slides || []).map((sl) => (
    // El brief trae `comment_trigger` y `cta` a nivel raiz; el render los necesita por slide.
    { ...sl,
      comment_trigger: sl.comment_trigger || brief.comment_trigger || '',
      cta: sl.cta || brief.cta || '',
      resource: sl.resource || brief.resource || {},
      identity: sl.identity || brief.identity || '',
      follow_cta: sl.follow_cta || brief.follow_cta || '' }));
  if (!slides.length) throw new Error('brief has no slides');
  // La serie es del CARRUSEL, no de la slide: el brief es su lugar natural. La bandera
  // de linea de comando sigue funcionando y gana, para poder probar sin editar el brief.
  args.serie = args.serie || brief.serie || '';
  args.episodio = args.episodio || brief.episodio || '';
  if (args.bg) args.bg = path.resolve(args.bg);
  if (args.object) args.object = path.resolve(args.object);
  fs.mkdirSync(args.out, { recursive: true });
  const browser = findBrowser();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'onia-car-'));

  const produced = [];
  slides.forEach((slide, idx) => {
    let html;
    if (args.pack === 'community-editorial') html = communityEditorialHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'dark-product') html = darkProductHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'dark-neon') html = darkNeonHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'editorial-photo') html = editorialPhotoHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'editorial-clean') html = editorialCleanHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'bright-retail') html = brightRetailHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'papel-subrayado') html = papelSubrayadoHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'dato-ilustrado') html = datoIlustradoHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'tarjeta-empleado') html = tarjetaEmpleadoHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'bloque-solido') html = bloqueSolidoHtml(slide, idx, slides.length, args.account, args);
    else html = slideHtml(slide, idx, slides.length, args.account, args.bg);
    const htmlPath = path.join(tmp, `slide-${idx + 1}.html`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    const png = path.resolve(args.out, `slide-${String(idx + 1).padStart(2, '0')}.png`);
    execFileSync(browser, [
      '--headless=new',
      // El VPS corre como root: sin --no-sandbox Chromium se niega a arrancar y el
      // screenshot nunca se escribe (verificado 2026-09-02).
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=1',
      `--window-size=${FMT.w},${FMT.h}`,
      // 10s, no 4s: con 4 las webfonts de Google no siempre llegaban y algunos slides
      // salian con la fuente de respaldo. Se detecto el 2026-08-17 comparando dos slides
      // del MISMO carrusel — uno en sans y el otro en serif.
      '--virtual-time-budget=10000',
      `--screenshot=${png}`,
      `file://${htmlPath.replace(/\\/g, '/')}`,
    ], { stdio: 'ignore', timeout: 60000 });
    if (!fs.existsSync(png)) throw new Error('render failed for slide ' + (idx + 1));
    produced.push(png);
  });

  fs.rmSync(tmp, { recursive: true, force: true });
  return produced;
}

function main(argv) {
  const args = parseArgs(argv);
  // give fonts a moment by rendering; Edge waits for load. Output manifest.
  const pngs = render(args);
  console.log(JSON.stringify({ ok: true, account: args.account, slides: pngs }, null, 2));
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: e.message }));
    process.exit(2);
  }
}

module.exports = {
  slideHtml, communityEditorialHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, editorialCleanHtml, brightRetailHtml,
  papelSubrayadoHtml, datoIlustradoHtml, tarjetaEmpleadoHtml, bloqueSolidoHtml,
  emph, roleFor, ACCOUNTS, BRANDS, PACKS, FORMATS, faltantesCtaSergio,
  setFormat: (name) => { if (!FORMATS[name]) throw new Error('Unknown format: ' + name); FMT = FORMATS[name]; },
};

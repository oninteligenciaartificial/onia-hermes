#!/usr/bin/env node
/**
 * ONIA — le manda a Sergio, por Telegram, UNA pieza del calendario lista para publicar:
 * el caption en un bloque que se toca y se copia, la hoja de contacto, y las 7 laminas
 * como ARCHIVO.
 *
 * POR QUE EXISTE, y no es comodidad: es el ultimo metro que faltaba.
 *
 * Las cinco piezas que quedan por publicar viven SOLO en la rama
 * `claude/ads-creatividades-publicos`. Medido el 03-sep: `git ls-tree origin/main` sobre
 * `posts-20260807/` no lista ninguna de las cinco carpetas (L09, L6, render-l10, L08,
 * render-l11) — main tiene L2 y las P1..P6 y nada mas. Y el manual que Sergio abre
 * (`hermes-content/contenido/PUBLICAR.md` Paso 0.5) le dice: *"Los renders viven en la PC
 * (C:\dev\proyectos\onia-hermes) → Telegram en la PC → Mensajes guardados"*.
 *
 * O sea que el unico camino escrito para que una pieza llegue al telefono pasa por una PC
 * que puede no tener esos archivos, y que es la misma PC de la que se mudaron los 15 loops
 * al VPS el 02-sep justamente porque Sergio la apaga. Instagram se publica desde el
 * telefono. Resultado: piezas terminadas, verificadas una por una, que no tenian como
 * llegar a la mano que aprieta el boton.
 *
 * Esto no publica nada y no puede publicar nada: deja el material en el Telegram de Sergio.
 * El acto de publicar sigue siendo suyo.
 *
 * Uso:
 *   node scripts/entregar_pieza.js --dia 2            # manda de verdad
 *   node scripts/entregar_pieza.js --dia 2 --ensayo   # imprime lo que mandaria, no manda
 *   node scripts/entregar_pieza.js --self-check       # 0 red, 0 archivos, 0 Telegram
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const { PIEZAS, RX_LAMINA, POSTS, RAIZ } = require('./caption_kit');

const ENV = '/root/.hermes/.env';
const LAMINA_MINIMA = 50 * 1024; // 50 KB: por debajo de eso no es un render, es un accidente

// ------------------------------------------------------------------ utilidades puras

/**
 * Telegram con parse_mode=HTML rechaza el mensaje ENTERO si encuentra un `<` suelto, y el
 * caption de una pieza es texto libre escrito para humanos. Sin esto, la pieza que lleva un
 * "<" en el copy no llega y el error es un 400 en un JSON que nadie mira.
 */
function escaparHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * El caption vive dentro del CAPTION.md, en el PRIMER bloque cercado despues de "## El
 * caption". Se saca de ahi y no del brief a proposito: es el archivo que `caption_kit --check`
 * mantiene igual al brief, asi que leer el md prueba de paso que lo que se manda es lo que
 * el gate verifica. Leer el brief por separado abriria la tercera version del mismo texto.
 */
function extraerBloques(md) {
  const bloques = [];
  const rx = /```\n([\s\S]*?)\n```/g;
  let m;
  while ((m = rx.exec(md)) !== null) bloques.push(m[1]);
  return bloques;
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

/**
 * Las guardas, TODAS antes de mandar el primer byte. Media pieza entregada es peor que
 * ninguna: Sergio sube lo que le llego y publica un carrusel al que le faltan laminas.
 */
function revisarPieza(pieza, archivos, leerBytes) {
  const errores = [];
  if (archivos === null) return { errores: [`no existe la carpeta ${pieza.carpeta}`] };

  if (archivos.some((f) => /^_NO-SUBIR\.md$/i.test(f))) {
    errores.push(`${pieza.carpeta} tiene _NO-SUBIR.md: esa carpeta esta marcada como la que NO se sube`);
  }

  const laminas = archivos.filter((f) => RX_LAMINA.test(f)).sort();
  if (laminas.length !== 7) {
    errores.push(`${pieza.carpeta}: hay ${laminas.length} laminas y el carrusel es de 7`);
  }

  if (!archivos.includes('CAPTION.md')) {
    errores.push(`${pieza.carpeta}: falta CAPTION.md — no hay nada que copiar y pegar`);
  }

  // Los tres chequeos que este carril ya pago caro, sobre los bytes reales:
  //  - 7 archivos identicos: `onia-costo-invisible` fueron 13 dias de 7 copias de una
  //    pantalla de error de Edge pareciendo un carrusel terminado.
  //  - una lamina de 2 KB es un render cortado, no una lamina.
  const vistos = new Map();
  for (const f of laminas) {
    const buf = leerBytes(f);
    if (buf === null) { errores.push(`${pieza.carpeta}/${f}: no se pudo leer`); continue; }
    if (buf.length < LAMINA_MINIMA) {
      errores.push(`${pieza.carpeta}/${f}: pesa ${buf.length} B, menos de 50 KB — render cortado`);
    }
    const h = md5(buf);
    if (vistos.has(h)) errores.push(`${pieza.carpeta}: ${f} y ${vistos.get(h)} son el MISMO archivo`);
    else vistos.set(h, f);
  }

  return { errores, laminas };
}

// ------------------------------------------------------------------ Telegram

function credenciales() {
  const txt = fs.readFileSync(ENV, 'utf8');
  const leer = (k) => {
    const m = txt.match(new RegExp(`^${k}=(.*)$`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
  };
  const token = leer('TELEGRAM_BOT_TOKEN');
  const chat = leer('TELEGRAM_HOME_CHANNEL');
  if (!token || !chat) throw new Error(`faltan TELEGRAM_BOT_TOKEN / TELEGRAM_HOME_CHANNEL en ${ENV}`);
  return { token, chat };
}

/**
 * `--form-string` y no `-F` para todo lo que sea texto, y esto ya costo una vuelta: con `-F`
 * un caption largo hace que curl salga con http 000 y el mensaje NO llega, sin error visible.
 * `-F` queda solo para el archivo, que es lo unico que de verdad necesita `@`.
 *
 * Y se mira `ok` del JSON, no el codigo de salida de curl: la API contesta 200 con
 * `{"ok":false}` cuando rechaza el HTML, que es exactamente el fallo silencioso que se busca
 * evitar. Un envio que no se verifica es un envio que nadie sabe si paso.
 */
function llamar(token, metodo, campos, archivo) {
  const args = ['-s', '--max-time', '120', `https://api.telegram.org/bot${token}/${metodo}`];
  for (const [k, v] of Object.entries(campos)) args.push('--form-string', `${k}=${v}`);
  if (archivo) args.push('-F', `${archivo.campo}=@${archivo.ruta}`);

  let salida;
  try {
    salida = execFileSync('curl', args, { encoding: 'utf8', timeout: 130000 });
  } catch (e) {
    throw new Error(`${metodo}: curl fallo — ${e.message}`);
  }
  let json;
  try { json = JSON.parse(salida); } catch { throw new Error(`${metodo}: respuesta no es JSON — ${salida.slice(0, 200)}`); }
  if (!json.ok) throw new Error(`${metodo}: Telegram lo rechazo — ${json.description || salida.slice(0, 200)}`);
  return json;
}

/**
 * Cuantos bytes dice Telegram que guardo, sea cual sea el campo en que los devolvio.
 *
 * ESTO NO ES UN DETALLE, y costo una entrega a medias el 03-sep: `sendDocument` con un mp4
 * NO siempre contesta `result.document`. Telegram decide solo, archivo por archivo, si lo
 * muestra como documento o como video — H06 volvio en `document` y H08, del mismo tamano,
 * mismo 1080x1920 y misma carpeta, volvio en `result.video`. La comprobacion miraba
 * `result.document.file_size` fijo, asi que para H08 leyo `undefined`, lo llamo "llego
 * cortado" y corto el envio despues de la cabecera. El archivo estaba PERFECTO: 3.359.671 B
 * en disco y 3.359.671 B en Telegram (medido con la respuesta cruda). O sea que la guarda
 * buena —comparar el tamano— fallaba por preguntar por el campo equivocado, que es el mismo
 * defecto de sentido que este carril ya pago en carousel_render, verificar_recompensas y el
 * gate de arranque: contestar con seguridad la pregunta equivocada.
 *
 * Devuelve null si Telegram no mando ningun campo con tamano: null NO es "esta bien", es
 * "no se pudo medir", y el que llama tiene que tratarlo como rojo.
 */
function tamanoRecibido(result) {
  if (!result) return null;
  for (const campo of ['document', 'video', 'animation', 'audio', 'voice', 'video_note']) {
    const m = result[campo];
    if (m && Number.isFinite(m.file_size)) return m.file_size;
  }
  // `photo` viene como lista de tamanos reescalados: ahi comparar contra el disco no tiene
  // sentido y por eso se devuelve null en vez de un numero que enganaria.
  return null;
}

// ------------------------------------------------------------------ el envio

function entregar({ dia, ensayo }) {
  const pieza = PIEZAS.find((p) => p.dia === dia);
  if (!pieza) {
    console.error(`no hay pieza para el dia ${dia}. Hay: ${PIEZAS.map((p) => p.dia).join(', ')}`);
    return 2;
  }

  const dir = path.join(RAIZ, POSTS, pieza.carpeta);
  const archivos = fs.existsSync(dir) ? fs.readdirSync(dir) : null;
  const { errores, laminas } = revisarPieza(pieza, archivos, (f) => {
    try { return fs.readFileSync(path.join(dir, f)); } catch { return null; }
  });

  if (errores.length) {
    console.error(`ROJO — no se entrega el dia ${dia}:`);
    for (const e of errores) console.error(`  · ${e}`);
    return 1;
  }

  const md = fs.readFileSync(path.join(dir, 'CAPTION.md'), 'utf8');
  const bloques = extraerBloques(md);
  if (bloques.length < 2) {
    console.error(`ROJO — ${pieza.carpeta}/CAPTION.md no tiene el caption y los hashtags en bloques`);
    return 1;
  }
  const [caption, hashtags] = bloques;
  const titulo = (md.match(/^# Caption — (.*)$/m) || [null, `dia ${dia}`])[1];

  const contacto = archivos.find((f) => /^_HOJA-DE-CONTACTO\.jpe?g$/i.test(f));

  const cabecera = [
    `📸 <b>Listo para publicar — ${escaparHtml(titulo)}</b>`,
    `Cuenta: <b>${escaparHtml(pieza.cuenta)}</b> · carrusel de ${laminas.length} laminas`,
    '',
    'Abajo va: el texto para copiar, la hoja de contacto para ver la pieza entera, y las',
    `${laminas.length} laminas como ARCHIVO (no como foto: como foto Telegram las recomprime).`,
    'Descargalas en orden y guardalas en la galeria, si no Instagram no las ve.',
    '',
    '⚠️ Al subir: activa la <b>etiqueta de IA</b> en Configuracion avanzada.',
  ].join('\n');

  const cuerpo = `<b>Texto para copiar</b> (tocalo y se copia entero):\n<pre>${escaparHtml(caption)}\n\n${escaparHtml(hashtags)}</pre>`;

  const plan = [
    { metodo: 'sendMessage', campos: { parse_mode: 'HTML', text: cabecera }, que: 'cabecera' },
    { metodo: 'sendMessage', campos: { parse_mode: 'HTML', text: cuerpo }, que: 'caption + hashtags' },
  ];
  if (contacto) {
    plan.push({
      metodo: 'sendPhoto',
      campos: { caption: `Asi queda el dia ${dia} entero — las ${laminas.length} laminas en orden.` },
      archivo: { campo: 'photo', ruta: path.join(dir, contacto) },
      que: 'hoja de contacto',
    });
  }
  for (let i = 0; i < laminas.length; i++) {
    plan.push({
      metodo: 'sendDocument',
      campos: { caption: `${i + 1} de ${laminas.length} — ${laminas[i]}`, disable_notification: 'true' },
      archivo: { campo: 'document', ruta: path.join(dir, laminas[i]) },
      que: laminas[i],
    });
  }

  if (ensayo) {
    console.log(`ENSAYO — dia ${dia} (${pieza.carpeta}) pasa las guardas. Mandaria ${plan.length} mensajes:`);
    for (const p of plan) console.log(`  ${p.metodo.padEnd(12)} ${p.que}`);
    console.log(`\ncaption: ${caption.length} caracteres · hashtags: ${hashtags.length}`);
    return 0;
  }

  const { token, chat } = credenciales();
  let n = 0;
  for (const p of plan) {
    try {
      const r = llamar(token, p.metodo, { chat_id: chat, ...p.campos }, p.archivo);
      // `ok:true` dice que Telegram acepto la llamada, no que guardo el archivo entero.
      // Para las laminas se compara el tamano que Telegram reporta contra el del disco:
      // una subida cortada llega como documento valido y mas chico, y Sergio publicaria
      // una lamina a medias sin un solo error de por medio.
      if (p.metodo === 'sendDocument') {
        const local = fs.statSync(p.archivo.ruta).size;
        const remoto = tamanoRecibido(r.result);
        if (remoto === null) throw new Error(`Telegram no dijo cuanto guardo (campos: ${Object.keys(r.result || {}).join(',')})`);
        if (remoto !== local) throw new Error(`llego cortado: ${remoto} B de ${local} B`);
      }
      n++;
      console.log(`  enviado ${p.que}`);
    } catch (e) {
      // Se corta en el primer fallo Y se dice cuanto llego: media pieza entregada en
      // silencio es como Sergio sube un carrusel al que le faltan laminas.
      console.error(`ROJO — fallo en "${p.que}" despues de ${n} de ${plan.length} mensajes: ${e.message}`);
      console.error('  La pieza quedo a MEDIAS en el chat. No la subas hasta reenviarla entera.');
      return 1;
    }
  }
  console.log(`\nOK — dia ${dia} (${pieza.carpeta}) entregado: ${n} mensajes, ${laminas.length} laminas.`);
  return 0;
}

// ------------------------------------------------------------------ self-check

function selfCheck() {
  const assert = require('assert');
  let n = 0;
  const t = (nombre, fn) => { fn(); n++; console.log(`  ok — ${nombre}`); };
  const siete = Array.from({ length: 7 }, (_, i) => `slide-0${i + 1}.jpg`);
  const bytes = (f) => Buffer.from(f.padEnd(LAMINA_MINIMA + 10, 'x'));
  const pieza = { dia: 9, carpeta: 'X', cuenta: '@x' };

  t('una pieza sana pasa', () => {
    const r = revisarPieza(pieza, [...siete, 'CAPTION.md'], bytes);
    assert.deepStrictEqual(r.errores, []);
    assert.strictEqual(r.laminas.length, 7);
  });
  t('carpeta que no existe no revienta', () => {
    assert.match(revisarPieza(pieza, null, bytes).errores[0], /no existe la carpeta/);
  });
  t('_NO-SUBIR.md frena la entrega', () => {
    const r = revisarPieza(pieza, [...siete, 'CAPTION.md', '_NO-SUBIR.md'], bytes);
    assert.ok(r.errores.some((e) => /NO-SUBIR/.test(e)));
  });
  t('faltando una lamina no se entrega', () => {
    const r = revisarPieza(pieza, [...siete.slice(0, 6), 'CAPTION.md'], bytes);
    assert.ok(r.errores.some((e) => /hay 6 laminas/.test(e)));
  });
  t('sin CAPTION.md no se entrega', () => {
    assert.ok(revisarPieza(pieza, siete, bytes).errores.some((e) => /falta CAPTION\.md/.test(e)));
  });
  t('7 laminas identicas se detectan (el caso onia-costo-invisible)', () => {
    const r = revisarPieza(pieza, [...siete, 'CAPTION.md'], () => Buffer.alloc(LAMINA_MINIMA + 10, 7));
    assert.ok(r.errores.some((e) => /son el MISMO archivo/.test(e)));
  });
  t('una lamina de 2 KB es un render cortado', () => {
    const r = revisarPieza(pieza, [...siete, 'CAPTION.md'],
      (f) => (f === 'slide-04.jpg' ? Buffer.alloc(2048) : bytes(f)));
    assert.ok(r.errores.some((e) => /slide-04.*menos de 50 KB/.test(e)));
  });
  t('el escape de HTML no deja pasar un < suelto', () => {
    assert.strictEqual(escaparHtml('a < b & c > d'), 'a &lt; b &amp; c &gt; d');
    assert.strictEqual(escaparHtml('<pre>'), '&lt;pre&gt;');
  });
  t('se escapa el & antes que el resto (si no, &lt; queda roto)', () => {
    assert.strictEqual(escaparHtml('&<'), '&amp;&lt;');
  });
  t('los bloques del CAPTION.md salen en orden: caption y despues hashtags', () => {
    const b = extraerBloques('## El caption\n\n```\nhola\nchau\n```\n\n**Hashtags:**\n\n```\n#a #b\n```\n');
    assert.deepStrictEqual(b, ['hola\nchau', '#a #b']);
  });
  t('un CAPTION.md sin bloques no inventa texto', () => {
    assert.deepStrictEqual(extraerBloques('# solo titulo\ntexto suelto'), []);
  });
  t('el calendario se lee de caption_kit, no hay una segunda copia', () => {
    assert.ok(PIEZAS.length >= 6 && PIEZAS.every((p) => p.carpeta && p.brief));
  });

  console.log(`\nself-check entregar_pieza: ${n} casos en verde`);
  return 0;
}

// ------------------------------------------------------------------ CLI

function principal(argv) {
  if (argv.includes('--self-check')) return selfCheck();
  const i = argv.indexOf('--dia');
  if (i === -1 || !argv[i + 1]) {
    console.error('uso: node scripts/entregar_pieza.js --dia <N> [--ensayo]');
    console.error(`     dias disponibles: ${PIEZAS.map((p) => p.dia).join(', ')}`);
    return 2;
  }
  return entregar({ dia: Number(argv[i + 1]), ensayo: argv.includes('--ensayo') });
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));

// `credenciales` y `llamar` se exportan para que `entregar_historia.js` hable con Telegram
// por ACA y no nazca una segunda version del envio: la leccion de `--form-string` (un `-F`
// con caption largo sale http 000 y el mensaje no llega, sin error visible) y la de mirar
// `ok` del JSON en vez del codigo de salida de curl valen igual para una historia.
module.exports = { revisarPieza, escaparHtml, extraerBloques, credenciales, llamar, tamanoRecibido };

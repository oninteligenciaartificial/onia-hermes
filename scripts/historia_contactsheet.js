#!/usr/bin/env node
/**
 * ONIA — hoja de contacto de una tanda de HISTORIAS (video vertical 1080x1920).
 *
 * POR QUE EXISTE, y no es el gemelo de carousel_contactsheet.js:
 *
 * Ese arma la hoja de un carrusel, que son laminas quietas en una carpeta. Una historia
 * es un MP4 de 5 a 8 segundos: no hay laminas que tilear, y el defecto que hay que ver no
 * esta en un archivo sino en un INSTANTE. Medido el 03-sep: las 12 historias de Lucia
 * (`historias-20260823` y `historias-20260829`) figuraban como "listo y verificado" en la
 * cola y NINGUNA tenia hoja de contacto — ni las 4 que el item acusaba ni las 8 que daba
 * por hechas. O sea que doce piezas publicables nunca las abrio nadie.
 *
 * Las dos cosas que esta hoja hace y que mirar el MP4 suelto no hace:
 *
 * 1. ZONA MUERTA DE INSTAGRAM. Una historia no se ve entera: la app le pone encima su
 *    propia interfaz — arriba el avatar y la barra de progreso, abajo el campo de
 *    respuesta y el boton de compartir. Un texto que cae ahi queda TAPADO en el telefono
 *    y perfecto en el reproductor de escritorio, que es donde se lo miraria. Por eso las
 *    bandas van pintadas ENCIMA del frame, no dibujadas al lado: si el texto entra en
 *    rojo, se ve que entra.
 *
 * 2. EL FINAL, NO EL PRINCIPIO. Los overlays de estas piezas tienen `start` y `end`
 *    (ver `planes/H*.json`), asi que un frame del medio no prueba nada sobre el ultimo
 *    segundo. La hoja muestrea la historia entera de punta a punta, con el segundo
 *    estampado en cada frame, para que un texto que se corta antes de tiempo o una placa
 *    que nunca aparece se vean como lo que son.
 *
 * NO afirma nada que no mida: el ancho y el alto salen de ffprobe por archivo, y la
 * historia cuyo tamano no sea 1080x1920 se rotula con el suyo en vez de heredar el del
 * titulo. Es el defecto que carousel_contactsheet.js tenia hasta el 03-sep — estampar
 * "1080x1350" fijo sin medir — y no se repite aca.
 *
 * Uso:
 *   node scripts/historia_contactsheet.js --dir hermes-content/references/modelos/lucia/historias-20260829
 *   node scripts/historia_contactsheet.js --dir <tanda> --frames 6 --out _HOJA-DE-CONTACTO.jpg
 *   node scripts/historia_contactsheet.js --self-check    # 0 red, 0 ffmpeg, 0 archivos
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

// Instagram Stories tapa el borde de arriba (avatar + barra de progreso) y el de abajo
// (campo "Enviar mensaje" + compartir). 250 px sobre 1920 es la guia que publica Meta
// para "keep-out"; se guarda como FRACCION para que valga si algun dia cambia el alto.
const ZONA_MUERTA_SUP = 250 / 1920;
const ZONA_MUERTA_INF = 250 / 1920;

const FUENTE = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const ANCHO_MINIATURA = 270;      // 1080/4: la miniatura entra en pantalla y el texto se lee
const FRAMES_POR_DEFECTO = 6;
const HISTORIA_RE = /^(H\d+)\.mp4$/i;

// --------------------------------------------------------------- utilidades puras

/**
 * Los instantes se reparten DENTRO del video, nunca en sus extremos: el frame 0 de un
 * fundido de entrada es negro y el ultimo puede caer fuera por redondeo de duracion.
 * Con n=6 sobre 5 s da 0.42 .. 4.58, que es lo que un ojo humano recorreria.
 */
function instantes(duracion, n) {
  if (!(duracion > 0) || !(n > 0)) return [];
  const paso = duracion / (n + 1);
  return Array.from({ length: n }, (_, i) => Number((paso * (i + 1)).toFixed(3)));
}

/**
 * Ordena H2 antes que H10. Un sort de texto los da al reves y la hoja saldria contando
 * la tanda en un orden que no es el de publicacion.
 */
function ordenarPorNumero(nombres) {
  return [...nombres].sort((a, b) => {
    const na = Number(String(a).replace(/\D/g, ''));
    const nb = Number(String(b).replace(/\D/g, ''));
    return na - nb;
  });
}

/** El alto de la miniatura sale del tamano REAL del video, no de 16:9 supuesto. */
function altoMiniatura(ancho, alto, anchoDestino) {
  if (!(ancho > 0) || !(alto > 0)) return 0;
  // par: libx264/mjpeg rechazan dimensiones impares en varios filtros
  return Math.round((alto / ancho) * anchoDestino / 2) * 2;
}

/** drawtext usa `:` y `\` como sintaxis; un titulo sin escapar rompe el filtro entero. */
function escaparDrawtext(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "’").replace(/%/g, '\\%');
}

// --------------------------------------------------------------- medicion

function medir(mp4) {
  const salida = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-show_entries', 'format=duration',
    '-of', 'default=nw=1:nk=1', mp4,
  ], { encoding: 'utf8' }).trim().split('\n');
  const [w, h, d] = salida;
  return { ancho: Number(w), alto: Number(h), duracion: Number(d) };
}

// --------------------------------------------------------------- render

/**
 * Un frame con las dos bandas rojas encima y el segundo estampado abajo a la izquierda.
 * Las bandas se pintan ANTES de escalar para que su proporcion sea la del telefono.
 */
function extraerFrame(mp4, segundo, destino, dim, etiqueta) {
  const supAlto = Math.round(dim.alto * ZONA_MUERTA_SUP);
  const infAlto = Math.round(dim.alto * ZONA_MUERTA_INF);
  const infY = dim.alto - infAlto;
  const anchoMin = ANCHO_MINIATURA;
  const altoMin = altoMiniatura(dim.ancho, dim.alto, anchoMin);

  const filtro = [
    `drawbox=x=0:y=0:w=${dim.ancho}:h=${supAlto}:color=red@0.28:t=fill`,
    `drawbox=x=0:y=${infY}:w=${dim.ancho}:h=${infAlto}:color=red@0.28:t=fill`,
    `drawbox=x=0:y=${supAlto}:w=${dim.ancho}:h=3:color=red@0.9:t=fill`,
    `drawbox=x=0:y=${infY}:w=${dim.ancho}:h=3:color=red@0.9:t=fill`,
    `scale=${anchoMin}:${altoMin}`,
    `drawtext=fontfile=${FUENTE}:text='${escaparDrawtext(etiqueta)}':x=6:y=h-22:fontsize=15:fontcolor=white:box=1:boxcolor=black@0.72:boxborderw=4`,
  ].join(',');

  execFileSync('ffmpeg', [
    '-v', 'error', '-ss', String(segundo), '-i', mp4,
    '-frames:v', '1', '-vf', filtro, '-y', destino,
  ]);
  return { anchoMin, altoMin };
}

function construirHoja(dirTanda, opciones = {}) {
  const nFrames = opciones.frames || FRAMES_POR_DEFECTO;
  const dirFinal = path.join(dirTanda, 'final');
  if (!fs.existsSync(dirFinal)) throw new Error(`No existe ${dirFinal}`);

  const archivos = ordenarPorNumero(fs.readdirSync(dirFinal).filter((f) => HISTORIA_RE.test(f)));
  if (!archivos.length) throw new Error(`Sin historias H*.mp4 en ${dirFinal}`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hoja-hist-'));
  const filas = [];
  const medidas = [];

  for (const archivo of archivos) {
    const id = archivo.replace(/\.mp4$/i, '');
    const mp4 = path.join(dirFinal, archivo);
    const dim = medir(mp4);
    medidas.push({ id, ...dim, bytes: fs.statSync(mp4).size });

    const trozos = [];
    let mini = null;
    for (const [i, seg] of instantes(dim.duracion, nFrames).entries()) {
      const destino = path.join(tmp, `${id}-${String(i).padStart(2, '0')}.png`);
      mini = extraerFrame(mp4, seg, destino, dim, `${seg.toFixed(1)}s`);
      trozos.push(destino);
    }
    // Una fila = las N miniaturas de UNA historia, con su id y su tamano medido al frente.
    const fila = path.join(tmp, `fila-${id}.png`);
    const rotulo = `${id}  ${dim.ancho}x${dim.alto}  ${dim.duracion.toFixed(1)}s`;
    const entradas = trozos.flatMap((t) => ['-i', t]);
    const n = trozos.length;
    const cadena =
      `${trozos.map((_, i) => `[${i}:v]`).join('')}hstack=inputs=${n}[tira];` +
      `[tira]pad=iw:ih+30:0:30:color=0x111111[p];` +
      `[p]drawtext=fontfile=${FUENTE}:text='${escaparDrawtext(rotulo)}':x=8:y=6:fontsize=18:fontcolor=0x00D26A[out]`;
    execFileSync('ffmpeg', ['-v', 'error', ...entradas, '-filter_complex', cadena, '-map', '[out]', '-y', fila]);
    filas.push({ fila, mini });
  }

  // Todas las filas apiladas. Se usa vstack y no tile porque tile exige que las entradas
  // vengan del MISMO stream; aca cada fila es un archivo distinto.
  const salida = path.resolve(dirTanda, opciones.out || '_HOJA-DE-CONTACTO.jpg');
  const entradas = filas.flatMap((f) => ['-i', f.fila]);
  const cadena = `${filas.map((_, i) => `[${i}:v]`).join('')}vstack=inputs=${filas.length}[v]`;
  execFileSync('ffmpeg', ['-v', 'error', ...entradas, '-filter_complex', cadena, '-map', '[v]', '-q:v', '3', '-y', salida]);

  fs.rmSync(tmp, { recursive: true, force: true });
  return { salida, medidas, frames: nFrames };
}

// --------------------------------------------------------------- self-check

function selfCheck() {
  const fallos = [];
  const ok = (cond, msg) => { if (!cond) fallos.push(msg); };

  // instantes: dentro del video, nunca en los extremos
  const t = instantes(5, 6);
  ok(t.length === 6, 'instantes: devuelve 6');
  ok(t[0] > 0 && t[t.length - 1] < 5, 'instantes: cae DENTRO del video, sin tocar 0 ni el final');
  ok(instantes(0, 6).length === 0, 'instantes: duracion 0 no inventa frames');

  // el orden es el de publicacion, no el alfabetico
  ok(JSON.stringify(ordenarPorNumero(['H10', 'H2', 'H1'])) === '["H1","H2","H10"]',
    'ordenarPorNumero: H2 va antes que H10');

  // el alto sale del video medido
  ok(altoMiniatura(1080, 1920, 270) === 480, 'altoMiniatura: 1080x1920 a 270 de ancho da 480');
  ok(altoMiniatura(1080, 1350, 270) % 2 === 0, 'altoMiniatura: siempre par');
  ok(altoMiniatura(0, 0, 270) === 0, 'altoMiniatura: sin medida no inventa');

  // un titulo con ":" no puede romper el filtro. Se comprueba que quede la BARRA delante,
  // no que los dos puntos desaparezcan: escapar no es borrar, y buscar `': '` daba rojo
  // sobre un escape correcto.
  ok(escaparDrawtext('H09: 1080x1920') === 'H09\\: 1080x1920', 'escaparDrawtext: escapa los dos puntos');
  ok(escaparDrawtext('50% ok') === '50\\% ok', 'escaparDrawtext: escapa el porcentaje');

  // la zona muerta es la del telefono, no un numero suelto
  ok(Math.round(1920 * ZONA_MUERTA_SUP) === 250, 'ZONA_MUERTA_SUP: 250 px sobre 1920');
  ok(Math.round(1920 * ZONA_MUERTA_INF) === 250, 'ZONA_MUERTA_INF: 250 px sobre 1920');

  if (fallos.length) {
    console.error('SELF-CHECK ROJO:');
    for (const f of fallos) console.error('  - ' + f);
    process.exit(1);
  }
  console.log("self-check verde: 9 comprobaciones");
}

// --------------------------------------------------------------- cli

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-check')) return selfCheck();

  const leer = (bandera) => {
    const i = argv.indexOf(bandera);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const dir = leer('--dir');
  if (!dir) {
    console.error('Falta --dir <carpeta de la tanda>. Ver --self-check.');
    process.exit(2);
  }

  const r = construirHoja(dir, { frames: Number(leer('--frames')) || undefined, out: leer('--out') });
  const bytes = fs.statSync(r.salida).size;
  console.log(`hoja: ${r.salida} (${bytes.toLocaleString('es')} B, ${r.frames} frames por historia)`);
  for (const m of r.medidas) {
    console.log(`  ${m.id}  ${m.ancho}x${m.alto}  ${m.duracion.toFixed(2)}s  ${m.bytes.toLocaleString('es')} B`);
  }
}

if (require.main === module) main();

module.exports = { instantes, ordenarPorNumero, altoMiniatura, escaparDrawtext, construirHoja };

#!/usr/bin/env node
/**
 * respaldar_renders.js — que las laminas publicables sobrevivan a esta maquina.
 *
 * EL PROBLEMA MEDIDO (2026-08-30). Habia 74 laminas renderizadas de Lucia, 106 MB, listas
 * para publicar. Trackeadas en git: **cero**.
 *
 *   git ls-files hermes-content/references/modelos/lucia | grep -c '\.png$'   ->  0
 *   git check-ignore -v .../render-l11/slide-01.png
 *     -> hermes-content/references/modelos/.gitignore:2:*.png
 *
 * La regla `*.png` es correcta para los ORIGINALES de Higgsfield: pesan y se pueden volver a
 * bajar. Pero se come tambien los RENDERS, que son el entregable final y no se regeneran
 * gratis. El feed entero existia solo en un disco — y ese mismo dia otra sesion hizo un reset
 * duro que borro un archivo ya commiteado. La distancia entre "esta hecho" y "esta a salvo"
 * era el ancho de un `git reset --hard`.
 *
 * QUE HACE. Copia cada `slide-NN.png` / `_CONTACTO*.png` de las carpetas de render a un JPG
 * al lado, que si entra a git. Instagram recomprime igual, asi que el JPG es tan publicable
 * como el PNG; el PNG queda local como fuente.
 *
 *   node scripts/respaldar_renders.js <dir> [<dir>...]
 *   node scripts/respaldar_renders.js --self-check
 *
 * Es idempotente: si el JPG existe y es mas nuevo que su PNG, no lo rehace.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CALIDAD = 92;

function pngsDe(dir) {
  if (!fs.existsSync(dir)) return [];
  const salida = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...pngsDe(p));
    else if (/\.png$/i.test(entrada.name)) salida.push(p);
  }
  return salida;
}

/** true si hay que (re)generar: no existe, o el PNG es mas nuevo. */
function haceFalta(png, jpg) {
  if (!fs.existsSync(jpg)) return true;
  return fs.statSync(png).mtimeMs > fs.statSync(jpg).mtimeMs;
}

function convertir(png, jpg) {
  // Se usa Pillow porque ya es la dependencia con la que se hicieron los JPG del banco.
  const codigo = [
    'import sys',
    'from PIL import Image',
    'src, dst = sys.argv[1], sys.argv[2]',
    'im = Image.open(src)',
    // Las laminas traen alfa: sin aplanar contra blanco, JPEG revienta o ensucia los bordes.
    'if im.mode in ("RGBA", "LA", "P"):',
    '    im = im.convert("RGBA")',
    '    fondo = Image.new("RGB", im.size, (255, 255, 255))',
    '    fondo.paste(im, mask=im.split()[-1])',
    '    im = fondo',
    'else:',
    '    im = im.convert("RGB")',
    `im.save(dst, "JPEG", quality=${CALIDAD}, optimize=True)`,
  ].join('\n');
  execFileSync('python', ['-c', codigo, png, jpg], { stdio: 'pipe' });
}

function respaldar(dirs) {
  const hechos = [];
  const saltados = [];
  for (const dir of dirs) {
    for (const png of pngsDe(dir)) {
      const jpg = png.replace(/\.png$/i, '.jpg');
      if (!haceFalta(png, jpg)) { saltados.push(jpg); continue; }
      convertir(png, jpg);
      hechos.push({ jpg, kb: Math.round(fs.statSync(jpg).size / 1024) });
    }
  }
  return { hechos, saltados };
}

function selfCheck() {
  const assert = require('node:assert');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  const tmp = path.join(require('os').tmpdir(), 'respaldo-selfcheck');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, 'sub'), { recursive: true });

  // PNG 2x2 CON canal alfa: es el caso que rompe si no se aplana contra blanco.
  const conAlfa = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4nGP8//8/AzbAxIAD'
    + 'jEpglwAAaGgDwUlKzhcAAAAASUVORK5CYII=', 'base64');
  fs.writeFileSync(path.join(tmp, 'slide-01.png'), conAlfa);
  fs.writeFileSync(path.join(tmp, 'sub', '_CONTACTO.png'), conAlfa);

  let r = respaldar([tmp]);
  ok(r.hechos.length === 2, 'convierte tambien lo que esta en subcarpetas');
  ok(fs.existsSync(path.join(tmp, 'slide-01.jpg')), 'deja el jpg al lado del png');

  // Idempotencia: la segunda pasada no debe rehacer nada. Sin esto, cada vuelta del loop
  // reescribe 74 archivos y ensucia el diff con ruido.
  r = respaldar([tmp]);
  ok(r.hechos.length === 0 && r.saltados.length === 2, 'la segunda pasada no rehace nada');

  // Pero si el PNG cambia, el JPG se rehace: si no, se publica la version vieja.
  const futuro = new Date(Date.now() + 10000);
  fs.utimesSync(path.join(tmp, 'slide-01.png'), futuro, futuro);
  r = respaldar([tmp]);
  ok(r.hechos.length === 1, 'un png mas nuevo rehace su jpg');

  // Un directorio que no existe no revienta: el loop corre sobre carriles que van y vienen.
  r = respaldar([path.join(tmp, 'no-existe')]);
  ok(r.hechos.length === 0, 'un directorio ausente no rompe');

  const { execFileSync: e } = require('child_process');
  const modo = e('python', ['-c',
    'import sys;from PIL import Image;print(Image.open(sys.argv[1]).mode)',
    path.join(tmp, 'slide-01.jpg')], { encoding: 'utf8' }).trim();
  ok(modo === 'RGB', 'el jpg sale RGB, con el alfa aplanado contra blanco');

  console.log(`self-check ok: ${casos} casos`);
}

function main() {
  const a = process.argv.slice(2);
  if (a.includes('--self-check')) return selfCheck();
  if (!a.length) {
    console.error('uso: node scripts/respaldar_renders.js <dir> [<dir>...]');
    process.exit(2);
  }
  const { hechos, saltados } = respaldar(a);
  for (const h of hechos) console.log(`  ${h.jpg}  ${h.kb} KB`);
  const total = hechos.reduce((s, h) => s + h.kb, 0);
  console.log(`respaldadas ${hechos.length} laminas (${Math.round(total / 1024)} MB), ${saltados.length} ya estaban`);
}

if (require.main === module) main();
module.exports = { respaldar, pngsDe, haceFalta };

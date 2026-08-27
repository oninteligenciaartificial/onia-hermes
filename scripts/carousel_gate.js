#!/usr/bin/env node
/**
 * Gate de carruseles. Corre ANTES de renderizar y falla ruidoso.
 *
 * Existe por el 2026-08-25: de 28 laminas publicadas en O01-O04, UNA sola tenia una
 * imagen que probaba lo que decia su texto. Y tres de los seis packs (`typographic`,
 * `editorial-photo`, `editorial-clean`) TIRAN EN SILENCIO el `object` y el `callout`
 * que el brief declara: no explota nada, el copy simplemente desaparece.
 *
 * Un carrusel malo no rompe el build. Por eso hace falta un gate: sin el, el error
 * solo se ve mirando el PNG, y mirar 28 laminas a mano no escala.
 *
 * Uso:  node scripts/carousel_gate.js --brief <ruta.json> --pack <pack>
 *       node scripts/carousel_gate.js --self-check
 */

const fs = require('fs');
const path = require('path');

// Que soporta cada pack. Medido ejecutando cada funcion con un slide que trae
// object y callout, y mirando si sobreviven al HTML. No leido del codigo: probado.
const CAPACIDADES = {
  typographic: { object: false, callout: false, marks: false },
  'dark-product': { object: true, callout: true, marks: true },
  'dark-neon': { object: true, callout: true, marks: true },
  // editorial-photo no tiene slot de objeto flotante: es foto a sangre. Pero desde
  // 2026-08-25 la foto de fondo se puede anotar, asi que una captura del producto
  // puesta de `bg` si funciona como prueba.
  'editorial-photo': { object: false, callout: false, marks: true },
  'editorial-clean': { object: false, callout: false, marks: false },
  'bright-retail': { object: true, callout: true, marks: true },
  // Pack de mnemotecnia: no dibuja objeto ni callout, su prueba es la grilla 2x2.
  'papel-subrayado': { object: false, callout: false, marks: false },
  // La imagen va de FONDO (slide.bg), no como objeto flotante: ese era el defecto
  // que Sergio nombro — 'imagenes sin sentido sobre imagenes'.
  'dato-ilustrado': { object: false, callout: false, marks: false },
};

// Debajo de esta escala el texto de una captura de pantalla deja de leerse en el
// lienzo. El caso que lo origino: el panel de 2160px se dibujaba a 562 (escala 0,26)
// y la UI quedaba en ~8 px, con el piso de legibilidad en 28.
const ESCALA_MINIMA = 0.40;
// Ancho a partir del cual un PNG se considera captura de pantalla y no un icono.
const ANCHO_CAPTURA = 1200;
// Caja donde el motor dibuja el objeto (`.object` en carousel_render.js).
const CAJA = { w: 620, h: 420 };
// Con `object_fit:"bleed"` la imagen va a todo el ancho del lienzo y recorta por cover,
// asi que la escala se calcula distinto: manda el lado MAYOR, no el menor.
const CAJA_BLEED = { w: 1080, h: 620 };

/** Lee ancho y alto de un PNG del header IHDR. Evita traer una dependencia. */
function dimensionesPng(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * A que escala termina dibujada una imagen. `contain` (el slot normal) entra entera,
 * asi que manda el lado que primero toca el borde: el minimo. `cover` (a sangre) llena
 * la caja y recorta el sobrante, asi que manda el maximo.
 */
function escalaEnLienzo(dim, caja = CAJA, modo = 'contain') {
  const porAncho = caja.w / dim.w;
  const porAlto = caja.h / dim.h;
  return modo === 'cover' ? Math.max(porAncho, porAlto) : Math.min(porAncho, porAlto, 1);
}

function revisar(brief, pack, baseDir = process.cwd()) {
  const problemas = [];
  const cap = CAPACIDADES[pack];
  if (!cap) {
    problemas.push({ nivel: 'error', regla: 'pack', msg: `pack desconocido: ${pack}` });
    return problemas;
  }

  const slides = brief.slides || [];
  const usados = new Map();

  slides.forEach((s, i) => {
    const n = s.number || i + 1;

    // 1. Lo que el pack tira en silencio. El peor de todos: no falla, desaparece.
    for (const campo of ['object', 'callout', 'marks']) {
      if (s[campo] && !cap[campo]) {
        problemas.push({
          nivel: 'error', regla: 'capacidad', lamina: n,
          msg: `la lamina declara \`${campo}\` y el pack '${pack}' NO lo dibuja: se pierde sin aviso`,
        });
      }
    }

    // La imagen puede venir como objeto flotante (`object`) o como fondo (`bg`, que es
    // como la usa `dato-ilustrado`). La regla de repeticion vale para las dos: se
    // escribio mirando solo `object` y dejo pasar O03 con TRES pares repetidos.
    const imagen = s.object || s.bg;
    if (!imagen) return;

    // 2. La misma imagen dos veces: se lee como plantilla vacia, no como prueba.
    //    Caso real: O04 laminas 2 y 5 eran el mismo archivo de pixeles.
    const prev = usados.get(imagen);
    if (prev) {
      problemas.push({
        nivel: 'error', regla: 'repetida', lamina: n,
        msg: `usa la misma imagen que la lamina ${prev}: ${path.basename(imagen)}`,
      });
    } else {
      usados.set(imagen, n);
    }

    if (!s.object) return;

    // 3. Una captura achicada mas alla del piso es una mancha, no una prueba.
    const ruta = path.resolve(baseDir, s.object);
    if (!fs.existsSync(ruta)) {
      problemas.push({
        nivel: 'error', regla: 'falta', lamina: n,
        msg: `no existe el archivo: ${s.object}`,
      });
      return;
    }
    const dim = dimensionesPng(ruta);
    if (dim && dim.w >= ANCHO_CAPTURA) {
      const bleed = s.object_fit === 'bleed';
      const esc = bleed
        ? escalaEnLienzo(dim, CAJA_BLEED, 'cover')
        : escalaEnLienzo(dim);
      if (esc < ESCALA_MINIMA) {
        problemas.push({
          nivel: 'error', regla: 'ilegible', lamina: n,
          msg: `captura de ${dim.w}x${dim.h} se dibuja a escala ${esc.toFixed(2)} `
             + `(minimo ${ESCALA_MINIMA}): recortá el detalle en vez de mostrar la pantalla entera`,
        });
      }
    }

    // 4. Lo que el gate no puede decidir solo: si la imagen PRUEBA la frase. Se
    //    obliga a declararlo, que es lo que fuerza a pensarlo.
    if (!s.object_prueba) {
      problemas.push({
        nivel: 'aviso', regla: 'sin-prueba', lamina: n,
        msg: 'lleva imagen y no declara `object_prueba`: que frase del texto evidencia?',
      });
    }
  });

  // 5. Una pieza entera sin una sola imagen. No siempre es un error -hay temas que se
  //    explican mejor con tipografia- pero O01 y O02 pasaron asi: 14 laminas hablando de
  //    lo que hace un sistema y el sistema no aparece nunca.
  if (cap.object && slides.length && !slides.some((s) => s.object)) {
    problemas.push({
      nivel: 'aviso', regla: 'sin-imagenes',
      msg: `${slides.length} laminas y ninguna imagen: si la pieza habla de algo que se ve, mostralo`,
    });
  }

  // 6. Una palabra clave sin recompensa nombrada es mendigar el comentario.
  if (brief.comment_trigger && !brief.comment_reward) {
    problemas.push({
      nivel: 'error', regla: 'recompensa',
      msg: `pide comentar "${brief.comment_trigger}" y no declara \`comment_reward\``,
    });
  }

  return problemas;
}

function selfCheck() {
  const assert = require('node:assert');
  const tmp = path.join(require('os').tmpdir(), 'gate-selfcheck');
  fs.mkdirSync(tmp, { recursive: true });
  // PNG 1x1 valido, para las rutas que solo necesitan existir.
  const chico = path.join(tmp, 'chico.png');
  fs.writeFileSync(chico, Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'));

  let p = revisar({ slides: [{ number: 1, callout: 'x' }] }, 'editorial-photo', tmp);
  assert.ok(p.some((x) => x.regla === 'capacidad'), 'debe cazar el callout que editorial-photo tira');

  p = revisar({ slides: [{ number: 1, callout: 'x' }] }, 'dark-product', tmp);
  assert.ok(!p.some((x) => x.regla === 'capacidad'), 'dark-product si dibuja callout');

  p = revisar({ slides: [
    { number: 2, object: 'chico.png', object_prueba: 'a' },
    { number: 5, object: 'chico.png', object_prueba: 'b' },
  ] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'repetida' && x.lamina === 5), 'debe cazar la imagen repetida');

  // Una "captura" grande: header PNG de 2160x1620 alcanza, no hace falta la imagen real.
  const grande = path.join(tmp, 'grande.png');
  const b = Buffer.from(fs.readFileSync(chico));
  b.writeUInt32BE(2160, 16); b.writeUInt32BE(1620, 20);
  fs.writeFileSync(grande, b);
  p = revisar({ slides: [{ number: 1, object: 'grande.png', object_prueba: 'x' }] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'ilegible'), 'debe cazar la captura achicada a 0,26');

  // A sangre la caja es otra (1080x760, cover): la misma captura que era ilegible en el
  // slot de 620 aca se dibuja a escala 0,50 y se lee bien.
  p = revisar({ slides: [{ number: 1, object: 'grande.png', object_fit: 'bleed', object_prueba: 'x' }] }, 'dark-product', tmp);
  assert.ok(!p.some((x) => x.regla === 'ilegible'), 'bleed no debe marcarse ilegible');

  p = revisar({ slides: [{ number: 1, object: 'chico.png' }] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'sin-prueba'), 'debe avisar si no declara que prueba');

  p = revisar({ comment_trigger: 'SISTEMA', slides: [] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'recompensa'), 'palabra clave sin recompensa');

  // La imagen de fondo cuenta igual que el objeto: mirando solo `object` se dejo pasar
  // O03 con tres pares de laminas repitiendo la misma ilustracion.
  p = revisar({ slides: [{ number: 2, bg: 'chico.png' }, { number: 3, bg: 'chico.png' }] }, 'dato-ilustrado', tmp);
  assert.ok(p.some((x) => x.regla === 'repetida' && x.lamina === 3), 'caza el bg repetido');

  p = revisar({ comment_trigger: 'SISTEMA', comment_reward: 'la lista', slides: [] }, 'dark-product', tmp);
  assert.strictEqual(p.length, 0, 'un brief sano no debe dar nada');

  console.log('self-check ok: 9 casos');
}

function main() {
  const a = process.argv.slice(2);
  if (a.includes('--self-check')) return selfCheck();

  const get = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  const briefPath = get('--brief');
  const pack = get('--pack');
  if (!briefPath || !pack) {
    console.error('uso: node scripts/carousel_gate.js --brief <ruta.json> --pack <pack>');
    process.exit(2);
  }

  const brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
  const problemas = revisar(brief, pack, process.cwd());
  const errores = problemas.filter((p) => p.nivel === 'error');

  for (const p of problemas) {
    const donde = p.lamina ? ` [lamina ${p.lamina}]` : '';
    console.log(`${p.nivel === 'error' ? 'ERROR' : 'aviso'} ${p.regla}${donde}: ${p.msg}`);
  }
  if (!problemas.length) console.log(`gate ok: ${path.basename(briefPath)} con pack ${pack}`);
  process.exit(errores.length ? 1 : 0);
}

if (require.main === module) main();
module.exports = { revisar, CAPACIDADES, dimensionesPng, escalaEnLienzo, ESCALA_MINIMA };

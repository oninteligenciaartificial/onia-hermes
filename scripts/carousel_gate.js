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
  // El visual es la tarjeta de empleado; no lleva imagen de ningun tipo.
  'tarjeta-empleado': { object: false, callout: false, marks: false },
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

  // Un brief sin `slides` no es un brief sano: es uno que el gate no puede revisar. Antes
  // devolvia cero problemas y se leia como aprobado — los seis lucia-p1..p6 pasaban asi.
  // Un verificador que calla ante lo que no entiende es peor que no tenerlo.
  if (!Array.isArray(brief.slides)) {
    problemas.push({
      nivel: 'error', regla: 'sin-slides',
      msg: 'el brief no declara `slides`: el gate no puede revisar nada, no es que este bien',
    });
    return problemas;
  }
  const slides = brief.slides;
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

    // Un `bg` va A SANGRE con cover: si la imagen es mas apaisada que el lienzo, se
    // AMPLIA para cubrirlo y se destroza. Paso en O01: se puso un panel de 930x360 y
    // salio un "40" gigante con las palabras cortadas. Todos los `panel-*` del banco son
    // apaisados (ratio 1,9 a 8,6): son recortes para el slot de objeto, no fondos.
    if (s.bg) {
      const rutaBg = path.resolve(baseDir, s.bg);
      const dimBg = fs.existsSync(rutaBg) ? dimensionesPng(rutaBg) : null;
      if (dimBg) {
        const esc = escalaEnLienzo(dimBg, { w: 1080, h: 1350 }, 'cover');
        // 1,5 y no 1,15: las fotos verticales del banco de Lucia (896x1200) se amplian
        // 1,2x y a ojo no se nota — se miraron los renders. Lo que rompio O01 fue una
        // CAPTURA CON TEXTO ampliada 3,75x. Un umbral de 1,15 marcaba 18 fondos sanos:
        // una regla con falsos positivos se termina ignorando, que es peor que no tenerla.
        if (esc > 1.5) {
          problemas.push({
            nivel: 'error', regla: 'bg-deformado', lamina: n,
            msg: `el fondo de ${dimBg.w}x${dimBg.h} se AMPLIA ${esc.toFixed(1)}x para cubrir `
               + '4:5 y queda ilegible: usa una imagen vertical, o ponela como `object`',
          });
        }
      }
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

  // 9. Y ninguna imagen de Lucia fuera del banco oficial. El 2026-08-28 salieron dos
  // piezas con `calibracion-20260806`, un banco que Sergio habia descartado el 15-ago:
  // son salidas del Soul prohibido, con la cara enrojecida y sin las argollas. Estaba
  // escrito en LUCIA.md, en la linea 90 de 50 KB. Un doc largo no evita el error; esto si.
  const banco = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(__dirname, 'lucia_banco.json'), 'utf8'));
    } catch { return null; }
  })();
  if (banco) {
    slides.forEach((s, i) => {
      const rutas = [s.bg, s.object].filter(Boolean).map((x) => String(x).split('\\').join('/'));
      rutas.forEach((ruta) => {
        const veto = Object.keys(banco.prohibido).find((k) => ruta.includes(k));
        if (veto) {
          problemas.push({
            nivel: 'error', regla: 'lucia-fuera-de-banco', lamina: s.number || i + 1,
            msg: `${ruta} esta descartada: ${banco.prohibido[veto]}`,
          });
          return;
        }
        // Dentro de la carpeta de Lucia, lo que no esta permitido tampoco pasa: el banco
        // es lista blanca, no lista negra. Una carpeta nueva sin revisar no se cuela.
        if (ruta.includes(banco.raiz)) {
          const rel = ruta.slice(ruta.indexOf(banco.raiz) + banco.raiz.length);
          const ok = banco.permitido.some((a) => rel.startsWith(a))
            || rel.startsWith('posts-20260807/');
          if (!ok) {
            problemas.push({
              nivel: 'error', regla: 'lucia-fuera-de-banco', lamina: s.number || i + 1,
              msg: `${rel} no esta en el banco oficial (BANCO-OFICIAL.md)`,
            });
            return;
          }
        }
        // Y por ultimo que exista: al archivar el banco viejo, un brief quedo apuntando
        // a una ruta muerta y el gate lo dejo pasar. Va DESPUES del banco a proposito —
        // si la foto esta descartada, ese es el motivo util, no "falta el archivo".
        if (!fs.existsSync(path.join(baseDir, ruta))) {
          problemas.push({
            nivel: 'error', regla: 'imagen-inexistente', lamina: s.number || i + 1,
            msg: `${ruta} no existe en disco`,
          });
        }
      });
    });
  }

  // 8. El titular no puede repetir el numero que la cifra gigante ya grita: en el molde
  // se dibujan uno encima del otro y el titular queda tapado. Estaba escrito en el plan
  // y aun asi se repitio en O10 y en O11 — una regla que solo vive en un doc se
  // desobedece, asi que la comprueba el gate.
  slides.forEach((s, i) => {
    if (!s.dato || !s.headline) return;
    const numero = String(s.dato).match(/[\d.,]+/);
    if (!numero) return;
    const limpio = (x) => String(x).replace(/[^\d]/g, '');
    if (limpio(s.headline).includes(limpio(numero[0]))) {
      problemas.push({
        nivel: 'error', regla: 'numero-repetido', lamina: s.number || i + 1,
        msg: `el titular repite "${numero[0]}", que la cifra grande ya muestra: se pisan`,
      });
    }
  });

  // 7. La promesa se valida contra el registro de recompensas, no contra una carpeta.
  // Tres cosas distintas, y las tres pasaron de verdad:
  //   a) la recompensa no existe (seis piezas pedian un comentario a cambio de un PDF
  //      que nadie habia escrito);
  //   b) la palabra esta APAGADA en el circuito, asi que el lead comenta y no recibe
  //      nada — el 26-ago alguien comento RANKING en un post de Sergio y se perdio en
  //      silencio, sin aviso a nadie;
  //   c) dos piezas prometen COSAS DISTINTAS con la MISMA palabra. Meta manda un solo
  //      mensaje por comentario y se elige por palabra: la segunda promesa es
  //      fisicamente incumplible. O03 pedia SISTEMA por "el checklist de tu Oficina
  //      Virtual" mientras otras siete pedian SISTEMA por "las 6 tareas para delegar".
  // El registro se busca primero bajo baseDir. En una corrida real baseDir es la raiz del
  // repo y resuelve al MISMO scripts/recompensas.json, asi que no cambia nada. Existe para
  // que el self-check pueda usar un fixture propio: hasta hoy sus casos leian el registro
  // VIVO, y arreglar un dato real (SISTEMA, 2026-08-29) tumbaba el test. Un self-check que
  // depende de la verdad del dia no prueba el codigo, prueba el dato.
  const registro = (() => {
    for (const f of [path.join(baseDir, 'scripts', 'recompensas.json'),
                     path.join(__dirname, 'recompensas.json')]) {
      try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { /* siguiente */ }
    }
    return null;
  })();
  if (brief.comment_trigger && brief.comment_reward && registro) {
    const clave = String(brief.comment_trigger).toUpperCase();
    const r = registro.palabras[clave];
    if (!r) {
      problemas.push({
        nivel: 'error', regla: 'palabra-sin-registrar',
        msg: `la palabra "${clave}" no esta en scripts/recompensas.json: declarala ahi antes de prometerla`,
      });
    } else {
      if (!r.activa) {
        problemas.push({
          nivel: 'error', regla: 'palabra-apagada',
          msg: `"${clave}" esta apagada en el circuito: quien comente no recibe nada`
             + (r._falta ? ` — falta: ${r._falta}` : ''),
        });
      }
      if (r.tipo === 'pdf' && (!r.entrega || !fs.existsSync(path.join(baseDir, r.entrega)))) {
        problemas.push({
          nivel: 'error', regla: 'recompensa-inexistente',
          msg: `"${clave}" promete un PDF que no esta en disco: ${r.entrega || '(sin declarar)'}`,
        });
      }
      // Que el archivo este en el repo no le sirve de nada a quien comenta: lo unico
      // que cuenta es que la URL responda. `node scripts/verificar_recompensas.js`
      // lo comprueba en vivo y actualiza este campo.
      if (r.publicado === false) {
        problemas.push({
          nivel: 'error', regla: 'recurso-no-publicado',
          msg: `"${clave}" no esta publicado todavia${r.url ? ` (${r.url})` : ''}`
             + (r._falta ? ` — ${r._falta}` : ''),
        });
      }
      // Una palabra, UNA promesa. Se comparan normalizados para no fallar por comas.
      const norm = (x) => String(x).toLowerCase().replace(/[^a-z0-9áéíóúñ ]/gi, '').trim();
      if (norm(brief.comment_reward) !== norm(r.promete)) {
        problemas.push({
          nivel: 'error', regla: 'promesa-distinta',
          msg: `promete "${brief.comment_reward}" pero "${clave}" entrega "${r.promete}": `
             + 'Meta manda UN solo mensaje por palabra, asi que dos promesas no entran',
        });
      }
    }
  }

  return problemas;
}

function selfCheck() {
  const assert = require('node:assert');
  const tmp = path.join(require('os').tmpdir(), 'gate-selfcheck');
  // El tmp sobrevive entre corridas: sin limpiarlo, el PDF que escribe el ultimo caso
  // hace pasar al caso que justamente comprueba su ausencia. Un self-check que depende
  // de si ya corrio antes no verifica nada.
  fs.rmSync(path.join(tmp, 'hermes-content'), { recursive: true, force: true });
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

  // La promesa se valida contra scripts/recompensas.json. Tres fallas distintas:
  // Fixture propio: copia del registro real con SISTEMA forzada a "no publicado", que es el
  // caso que el punto (d) necesita probar. Antes esto salia del archivo vivo y el test se
  // caia el dia que esa palabra se arreglaba.
  const REC = JSON.parse(fs.readFileSync(path.join(__dirname, 'recompensas.json'), 'utf8'));
  REC.palabras.SISTEMA = { ...REC.palabras.SISTEMA, activa: true, publicado: false };
  fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'scripts', 'recompensas.json'), JSON.stringify(REC));
  const PROM = REC.palabras.SISTEMA.promete;

  // a) prometer algo distinto de lo que esa palabra entrega: imposible de cumplir,
  //    porque Meta manda UN solo mensaje por palabra.
  p = revisar({ comment_trigger: 'SISTEMA', comment_reward: 'otra cosa', slides: [] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'promesa-distinta'), 'una palabra, una promesa');

  // b) una palabra apagada se come el lead en silencio.
  p = revisar({ comment_trigger: 'STACK', comment_reward: REC.palabras.STACK.promete, slides: [] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'palabra-apagada'), 'palabra apagada no se publica');

  // c) una palabra que nadie declaro.
  p = revisar({ comment_trigger: 'INVENTADA', comment_reward: 'x', slides: [] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'palabra-sin-registrar'), 'palabra sin registrar');

  // d) el archivo esta en el repo pero NO publicado: quien comenta recibe un 404.
  p = revisar({ comment_trigger: 'SISTEMA', comment_reward: PROM, slides: [] }, 'dark-product', tmp);
  assert.ok(p.some((x) => x.regla === 'recurso-no-publicado'), 'un recurso sin publicar no se promete');

  // Y el caso sano: palabra activa, PDF en disco, promesa identica, recurso publicado.
  fs.mkdirSync(path.join(tmp, path.dirname(REC.palabras.SISTEMA.entrega)), { recursive: true });
  fs.writeFileSync(path.join(tmp, REC.palabras.SISTEMA.entrega), 'x');
  const sano = REC.palabras.HUMO;
  fs.mkdirSync(path.join(tmp, path.dirname(sano.entrega)), { recursive: true });
  fs.writeFileSync(path.join(tmp, sano.entrega), 'x');
  p = revisar({ comment_trigger: 'HUMO', comment_reward: sano.promete, slides: [] }, 'dark-product', tmp);
  assert.strictEqual(p.length, 0, 'un brief sano no debe dar nada');

  // El titular que repite la cifra: pasa dos veces en un mismo dia, se automatiza.
  p = revisar({ slides: [{ number: 2, dato: '42 h', headline: 'tardaron 42 horas' }] }, 'dato-ilustrado', tmp);
  assert.ok(p.some((x) => x.regla === 'numero-repetido'), 'titular que repite la cifra');
  p = revisar({ slides: [{ number: 2, dato: '42 h', headline: 'lo que tarda en contestarte' }] }, 'dato-ilustrado', tmp);
  assert.ok(!p.some((x) => x.regla === 'numero-repetido'), 'sin el numero no debe marcar');

  // El banco de Lucia: lo descartado no pasa, lo oficial si.
  const RL = 'hermes-content/references/modelos/lucia/';
  p = revisar({ slides: [{ number: 1, bg: RL + 'calibracion-20260806/L1-retrato-cafe-1x1.jpg' }] }, 'editorial-photo', tmp);
  assert.ok(p.some((x) => x.regla === 'lucia-fuera-de-banco'), 'calibracion esta descartada');
  p = revisar({ slides: [{ number: 1, bg: RL + 'tanda-20260821/L2b-cafe-natural.png' }] }, 'editorial-photo', tmp);
  assert.ok(!p.some((x) => x.regla === 'lucia-fuera-de-banco'), 'la tanda vigente si pasa');
  p = revisar({ slides: [{ number: 1, bg: RL + 'carpeta-nueva-sin-revisar/x.png' }] }, 'editorial-photo', tmp);
  assert.ok(p.some((x) => x.regla === 'lucia-fuera-de-banco'), 'lista blanca: lo no listado tampoco pasa');

  fs.mkdirSync(path.join(tmp, RL, 'tanda-20260821'), { recursive: true });
  fs.copyFileSync(chico, path.join(tmp, RL, 'tanda-20260821', 'L2b-cafe-natural.png'));
  p = revisar({ slides: [{ number: 1, bg: RL + 'tanda-20260821/NO-EXISTE.png' }] }, 'editorial-photo', tmp);
  assert.ok(p.some((x) => x.regla === 'imagen-inexistente'), 'una ruta muerta no pasa');

  // Lo que no se puede revisar no se aprueba.
  p = revisar({ caption: 'sin slides' }, 'dato-ilustrado', tmp);
  assert.ok(p.some((x) => x.regla === 'sin-slides'), 'un brief sin slides no pasa');

  // Un fondo apaisado a sangre en 4:5 se amplia hasta romperse.
  const apaisado = path.join(tmp, 'apaisado.png');
  const ba = Buffer.from(fs.readFileSync(chico));
  ba.writeUInt32BE(930, 16); ba.writeUInt32BE(360, 20);
  fs.writeFileSync(apaisado, ba);
  p = revisar({ slides: [{ number: 1, bg: 'apaisado.png' }] }, 'dato-ilustrado', tmp);
  assert.ok(p.some((x) => x.regla === 'bg-deformado'), 'un bg apaisado no pasa');
  const vertical = path.join(tmp, 'vertical.png');
  const bv = Buffer.from(fs.readFileSync(chico));
  bv.writeUInt32BE(1856, 16); bv.writeUInt32BE(2304, 20);
  fs.writeFileSync(vertical, bv);
  p = revisar({ slides: [{ number: 1, bg: 'vertical.png' }] }, 'dato-ilustrado', tmp);
  assert.ok(!p.some((x) => x.regla === 'bg-deformado'), 'uno vertical si pasa');

  console.log('self-check ok: 24 casos');
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

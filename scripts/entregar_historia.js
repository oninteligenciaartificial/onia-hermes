#!/usr/bin/env node
/**
 * ONIA — le manda a Sergio, por Telegram, UNA historia de Lucia lista para subir: el MP4
 * como ARCHIVO, con que dia del calendario acompana y por que.
 *
 * POR QUE EXISTE. Las 12 historias estan renderizadas desde el 23 y el 29-ago, medidas y
 * miradas una por una (`scripts/historia_contactsheet.js`, 03-sep). Y no tenian como
 * publicarse: `grep -i historia hermes-content/contenido/PUBLICAR.md` daba CERO — los nueve
 * pasos del manual hablan de carruseles y del reel. Doce piezas terminadas sin orden, sin a
 * que post empujan y sin nadie diciendo que H07 no puede salir antes que el PDF de HUMO.
 * Es el mismo ultimo metro que tuvo trabado al dia 2 tres dias enteros: la pieza estaba, el
 * camino al telefono no.
 *
 * NO es el gemelo de `entregar_pieza.js` y por eso no se copio: un carrusel son 7 laminas
 * quietas con un caption que se pega, una historia es UN mp4 vertical sin caption y con una
 * dependencia propia (a que post empuja). Lo que SI se comparte —hablar con Telegram— se
 * importa de ahi, no se duplica: dos versiones vivas del mismo envio es el defecto que este
 * carril ya pago cuatro veces.
 *
 * Esto no publica nada y no puede publicar nada: deja el material en el Telegram de Sergio.
 *
 * Uso:
 *   node scripts/entregar_historia.js --id H09            # manda de verdad
 *   node scripts/entregar_historia.js --id H09 --ensayo   # imprime lo que mandaria
 *   node scripts/entregar_historia.js --plan              # la tabla de las 12, en Markdown
 *   node scripts/entregar_historia.js --check             # PUBLICAR.md no se despego de aca
 *   node scripts/entregar_historia.js --escribir          # inyecta la tabla en PUBLICAR.md
 *   node scripts/entregar_historia.js --self-check        # 0 red, 0 archivos, 0 Telegram
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const { PIEZAS, RAIZ } = require('./caption_kit');
const { escaparHtml, credenciales, llamar, tamanoRecibido } = require('./entregar_pieza');

const MANUAL = 'hermes-content/contenido/PUBLICAR.md';
const MARCA_INI = '<!-- TABLA-HISTORIAS: la genera scripts/entregar_historia.js --escribir. No editar a mano. -->';
const MARCA_FIN = '<!-- /TABLA-HISTORIAS -->';

const MP4_MINIMO = 200 * 1024; // por debajo de 200 KB un mp4 de 6 s vertical es un render cortado
const DURACION_MAX = 60;       // un segmento de historia de Instagram
const LADO = { w: 1080, h: 1920 };

/**
 * A que dia del calendario acompana cada historia, y POR QUE — ninguna fila esta inventada:
 * sale de cruzar los `plan.json` de las dos tandas contra los briefs de los carruseles.
 *
 *  · H01..H05: el `_nota` de historias-20260823 dice "Las 5 primeras reciclan las senales del
 *    carrusel L6 para que la historia empuje al post". Cruzadas una por una, cada una es una
 *    lamina de L6 (dia 3): H01=3 ganaste, H02=2 fuera de hora, H03=4 fiado, H04=5 stock,
 *    H05=6 cierre del mes.
 *  · H06 y H08 son la declaracion de IA ("no me canso porque no existo", "esta cara no
 *    existe") y el dia 2 es `L09-una-cara-que-no-existe.json`: misma idea, mismo dia.
 *  · H07 pide comentar HUMO, y HUMO es la palabra del dia 5 (`L08-tres-de-cinco-gratis`).
 *    Una historia que manda a comentar en "el ultimo post" solo funciona si el ultimo post
 *    es ese.
 *  · H09..H12 son pilar B y su `_por_que_sin_cta` dice que no piden nada a proposito: no
 *    empujan a ningun post y por eso rellenan los dias sin carrusel.
 */
const ANCLAS = {
  H01: { dia: 3, por_que: 'es la lamina 3 de L6 (cuanto ganaste, no cuanto vendiste)' },
  H02: { dia: 3, por_que: 'es la lamina 2 de L6 (te escriben fuera de hora)' },
  H03: { dia: 3, por_que: 'es la lamina 4 de L6 (el fiado sin fecha)' },
  H04: { dia: 3, por_que: 'es la lamina 5 de L6 (el stock en una sola cabeza)' },
  H05: { dia: 3, por_que: 'es la lamina 6 de L6 (el cierre del mes)' },
  H06: { dia: 2, por_que: 'declara que es IA, igual que el carrusel del dia 2' },
  H07: { dia: 5, por_que: 'manda a comentar HUMO, que es la palabra del dia 5' },
  H08: { dia: 2, por_que: '"esta cara no existe" es el titulo del carrusel del dia 2' },
  H09: { dia: null, por_que: 'pilar B: observacion sin llamada a la accion' },
  H10: { dia: null, por_que: 'pilar B: observacion sin llamada a la accion' },
  H11: { dia: null, por_que: 'pilar B: observacion sin llamada a la accion' },
  H12: { dia: null, por_que: 'pilar B: observacion sin llamada a la accion' },
};

const TANDAS = [
  'hermes-content/references/modelos/lucia/historias-20260823',
  'hermes-content/references/modelos/lucia/historias-20260829',
];

const CUENTA = '@lucia.antelo.oficial';

// ------------------------------------------------------------------ lectura

/** Las 12 salen de los plan.json, no de una lista escrita aparte: una sola fuente. */
function cargarHistorias(leerJson = (p) => JSON.parse(fs.readFileSync(path.join(RAIZ, p), 'utf8'))) {
  const out = [];
  for (const carpeta of TANDAS) {
    const plan = leerJson(path.join(carpeta, 'plan.json'));
    for (const s of plan.stories || []) {
      out.push({
        id: s.id,
        titulo: s.title,
        subtitulo: s.subtitle,
        carpeta,
        mp4: path.join(carpeta, 'final', `${s.id}.mp4`),
        ancla: ANCLAS[s.id] || null,
      });
    }
  }
  return out;
}

/**
 * La palabra clave que la historia pide comentar. Se saca del subtitulo porque es donde
 * vive: H07 dice "comenta HUMO en el ultimo post". Palabra ENTERA y en mayusculas, no
 * subcadena — el circuito de n8n ya hace `includes()` y ese es su defecto, no el modelo a
 * copiar (SISTEMATICO no puede disparar SISTEMA).
 */
function palabraDeLaHistoria(h, palabrasConocidas) {
  const texto = `${h.titulo || ''} ${h.subtitulo || ''}`.toUpperCase();
  return palabrasConocidas.filter((p) => new RegExp(`(^|[^A-ZÁÉÍÓÚÑ])${p}([^A-ZÁÉÍÓÚÑ]|$)`).test(texto));
}

/** Los avisos ya escritos en recompensas.json ("el PDF publicado es el viejo"). */
function avisosDeLaPalabra(entrada) {
  return Object.entries(entrada)
    .filter(([k, v]) => /^_(falta|sigue)/.test(k) && typeof v === 'string')
    .map(([, v]) => v);
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

/** Mide el mp4 de verdad. Lo que no se puede medir vuelve null, NO un numero inventado. */
function medirMp4(rutaAbs) {
  let salida;
  try {
    salida = execFileSync('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height', '-show_entries', 'format=duration',
      '-of', 'default=nw=1:nk=1', rutaAbs,
    ], { encoding: 'utf8', timeout: 30000 });
  } catch { return null; }
  const n = salida.trim().split(/\s+/).map(Number);
  if (n.length < 3 || n.some((x) => !Number.isFinite(x))) return null;
  return { w: n[0], h: n[1], seg: n[2] };
}

// ------------------------------------------------------------------ las guardas

/**
 * Todo antes del primer byte. Pura: recibe lo que leyo el CLI, asi el self-check corre
 * offline y sin archivos.
 *
 * `avisos` NO es una advertencia decorativa: CORTA. Es la diferencia entre escribir un
 * CAPTION.md (donde el aviso se copia en rojo y ya) y empujar la pieza al telefono. Si H07
 * sale hoy, el que comente HUMO recibe el PDF viejo, el que dice "3 de las cinco son gratis"
 * en la tapa y etiqueta cuatro adentro. Eso es el incidente, no el riesgo del incidente.
 */
function revisarHistoria(h, { bytes, medida, entradas, otras }) {
  const errores = [];

  if (!h.ancla) {
    errores.push(`${h.id} no tiene fila en ANCLAS: no se sabe con que dia sale`);
  }
  if (bytes === null) {
    errores.push(`${h.id}: no existe ${h.mp4}`);
    return { errores };
  }
  if (bytes.length < MP4_MINIMO) {
    errores.push(`${h.id}: pesa ${bytes.length} B, menos de 200 KB — render cortado`);
  }

  if (medida === null) {
    errores.push(`${h.id}: no se pudo medir el mp4 (¿ffprobe?) — sin medir no se entrega`);
  } else {
    if (medida.w !== LADO.w || medida.h !== LADO.h) {
      errores.push(`${h.id}: mide ${medida.w}x${medida.h} y una historia es ${LADO.w}x${LADO.h}`);
    }
    if (!(medida.seg > 0 && medida.seg <= DURACION_MAX)) {
      errores.push(`${h.id}: dura ${medida.seg} s y un segmento de historia va de 0 a ${DURACION_MAX} s`);
    }
  }

  // El caso onia-costo-invisible, en version historia: 7 copias del mismo archivo pasaron
  // 13 dias en el repo pareciendo una pieza terminada.
  const mio = md5(bytes);
  for (const o of otras) {
    if (o.id !== h.id && o.md5 === mio) {
      errores.push(`${h.id} y ${o.id} son el MISMO archivo (md5 ${mio.slice(0, 8)})`);
    }
  }

  for (const [palabra, entrada] of Object.entries(entradas)) {
    if (!entrada) {
      errores.push(`${h.id} pide comentar ${palabra} y no esta en scripts/recompensas.json`);
      continue;
    }
    if (!entrada.activa || !(entrada.activa_en || []).includes(CUENTA)) {
      errores.push(`${palabra} no esta activa para ${CUENTA}: el que comente no recibe nada`);
    }
    for (const a of avisosDeLaPalabra(entrada)) {
      errores.push(`${palabra} entrega algo que hoy esta mal, asi que ${h.id} NO sale todavia: ${a}`);
    }
  }

  return { errores };
}

// ------------------------------------------------------------------ la tabla

function tablaMarkdown(historias) {
  const L = [];
  L.push('| # | Historia | Sale con | Por qué |');
  L.push('|---|---|---|---|');
  for (const h of historias) {
    const a = h.ancla || {};
    const dia = a.dia === null || a.dia === undefined
      ? 'suelta (día sin carrusel)'
      : `**día ${a.dia}** — ${(PIEZAS.find((p) => p.dia === a.dia) || {}).carpeta || '?'}`;
    L.push(`| ${h.id} | ${h.titulo} | ${dia} | ${a.por_que || '—'} |`);
  }
  return L.join('\n');
}

function inyectar(txt, bloque) {
  const i = txt.indexOf(MARCA_INI);
  const j = txt.indexOf(MARCA_FIN);
  if (i === -1 || j === -1 || j < i) return null;
  return txt.slice(0, i + MARCA_INI.length) + '\n\n' + bloque + '\n\n' + txt.slice(j);
}

function bloqueActual(txt) {
  const i = txt.indexOf(MARCA_INI);
  const j = txt.indexOf(MARCA_FIN);
  if (i === -1 || j === -1 || j < i) return null;
  return txt.slice(i + MARCA_INI.length, j).trim();
}

// ------------------------------------------------------------------ el envio

function contexto() {
  const historias = cargarHistorias();
  const recompensas = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/recompensas.json'), 'utf8'));
  const conocidas = Object.keys(recompensas.palabras || {});
  const leidas = historias.map((h) => {
    const abs = path.join(RAIZ, h.mp4);
    let bytes = null;
    try { bytes = fs.readFileSync(abs); } catch { bytes = null; }
    return { id: h.id, md5: bytes ? md5(bytes) : null };
  }).filter((x) => x.md5);
  return { historias, recompensas, conocidas, leidas };
}

function entregar({ id, ensayo }) {
  const { historias, recompensas, conocidas, leidas } = contexto();
  const h = historias.find((x) => x.id.toUpperCase() === String(id).toUpperCase());
  if (!h) {
    console.error(`no existe la historia ${id}. Hay: ${historias.map((x) => x.id).join(', ')}`);
    return 2;
  }

  const abs = path.join(RAIZ, h.mp4);
  let bytes = null;
  try { bytes = fs.readFileSync(abs); } catch { bytes = null; }
  const medida = bytes ? medirMp4(abs) : null;
  const entradas = {};
  for (const p of palabraDeLaHistoria(h, conocidas)) entradas[p] = (recompensas.palabras || {})[p] || null;

  const { errores } = revisarHistoria(h, { bytes, medida, entradas, otras: leidas });
  if (errores.length) {
    console.error(`ROJO — no se entrega ${h.id}:`);
    for (const e of errores) console.error(`  · ${e}`);
    return 1;
  }

  const a = h.ancla;
  const conQue = a.dia === null
    ? 'Va suelta, en un dia sin carrusel.'
    : `Va el mismo dia que el carrusel del <b>dia ${a.dia}</b> (${(PIEZAS.find((p) => p.dia === a.dia) || {}).carpeta}).`;

  const cabecera = [
    `🎬 <b>Historia lista — ${escaparHtml(h.id)}</b>`,
    `${escaparHtml(h.titulo)} · <i>${escaparHtml(h.subtitulo || '')}</i>`,
    '',
    `Cuenta: <b>${escaparHtml(CUENTA)}</b> · ${medida.w}x${medida.h}, ${medida.seg.toFixed(1)} s`,
    conQue,
    `Por que: ${escaparHtml(a.por_que)}`,
    '',
    'Baja el archivo de abajo y subilo como historia. Se manda con sendDocument y no con',
    'sendVideo, asi Telegram NO lo recomprime: llega byte a byte igual que en disco (medido).',
    'Que a veces te lo muestre como video es cosa de la app, no del archivo.',
  ].join('\n');

  const plan = [
    { metodo: 'sendMessage', campos: { parse_mode: 'HTML', text: cabecera }, que: 'cabecera' },
    {
      metodo: 'sendDocument',
      campos: { caption: `${h.id}.mp4 — ${h.titulo}` },
      archivo: { campo: 'document', ruta: abs },
      que: `${h.id}.mp4`,
    },
  ];

  if (ensayo) {
    console.log(`ENSAYO — ${h.id} pasa las guardas (${medida.w}x${medida.h}, ${medida.seg.toFixed(1)} s, ${bytes.length} B).`);
    for (const p of plan) console.log(`  ${p.metodo.padEnd(12)} ${p.que}`);
    return 0;
  }

  const { token, chat } = credenciales();
  let n = 0;
  for (const p of plan) {
    try {
      const r = llamar(token, p.metodo, { chat_id: chat, ...p.campos }, p.archivo);
      // `ok:true` dice que Telegram acepto la llamada, no que guardo el archivo entero.
      // El tamano se busca en el campo que Telegram haya elegido: con un mp4 devuelve
      // `document` o `video` segun el archivo, no siempre lo mismo (ver tamanoRecibido).
      if (p.metodo === 'sendDocument') {
        const local = fs.statSync(p.archivo.ruta).size;
        const remoto = tamanoRecibido(r.result);
        if (remoto === null) throw new Error(`Telegram no dijo cuanto guardo (campos: ${Object.keys(r.result || {}).join(',')})`);
        if (remoto !== local) throw new Error(`llego cortado: ${remoto} B de ${local} B`);
      }
      n++;
      console.log(`  enviado ${p.que}`);
    } catch (e) {
      console.error(`ROJO — fallo en "${p.que}" despues de ${n} de ${plan.length}: ${e.message}`);
      if (n > 0) console.error(`  ${h.id} quedo a MEDIAS en el chat: hay cabecera y no hay video. No la subas hasta reenviarla.`);
      return 1;
    }
  }
  console.log(`\nOK — ${h.id} entregado: ${n} mensajes.`);
  return 0;
}

// ------------------------------------------------------------------ estado de las 12

function estado() {
  const { historias, recompensas, conocidas, leidas } = contexto();
  let listas = 0;
  for (const h of historias) {
    const abs = path.join(RAIZ, h.mp4);
    let bytes = null;
    try { bytes = fs.readFileSync(abs); } catch { bytes = null; }
    const medida = bytes ? medirMp4(abs) : null;
    const entradas = {};
    for (const p of palabraDeLaHistoria(h, conocidas)) entradas[p] = (recompensas.palabras || {})[p] || null;
    const { errores } = revisarHistoria(h, { bytes, medida, entradas, otras: leidas });
    const dia = h.ancla && h.ancla.dia !== null ? `dia ${h.ancla.dia}` : 'suelta';
    if (errores.length) {
      console.log(`  🔴 ${h.id} (${dia})  ${errores[0]}`);
    } else {
      listas++;
      console.log(`  🟢 ${h.id} (${dia})  ${medida.w}x${medida.h} · ${medida.seg.toFixed(1)} s`);
    }
  }
  console.log(`\n${listas} de ${historias.length} listas para entregar.`);
  return 0;
}

// ------------------------------------------------------------------ self-check

function selfCheck() {
  const assert = require('assert');
  let n = 0;
  const t = (nombre, fn) => { fn(); n++; console.log(`  ok — ${nombre}`); };

  const buenos = Buffer.alloc(MP4_MINIMO + 10, 1);
  const base = { id: 'H01', titulo: 'x', subtitulo: 'y', mp4: 'a/b.mp4', ancla: { dia: 3, por_que: 'z' } };
  const sano = { bytes: buenos, medida: { w: 1080, h: 1920, seg: 6 }, entradas: {}, otras: [] };

  t('una historia sana pasa', () => {
    assert.deepStrictEqual(revisarHistoria(base, sano).errores, []);
  });
  t('sin archivo no se entrega', () => {
    const r = revisarHistoria(base, { ...sano, bytes: null });
    assert.match(r.errores[0], /no existe/);
  });
  t('un mp4 de 2 KB es un render cortado', () => {
    const r = revisarHistoria(base, { ...sano, bytes: Buffer.alloc(2048) });
    assert.ok(r.errores.some((e) => /menos de 200 KB/.test(e)));
  });
  t('lo que no se puede medir NO pasa (no se inventa el tamano)', () => {
    const r = revisarHistoria(base, { ...sano, medida: null });
    assert.ok(r.errores.some((e) => /no se pudo medir/.test(e)));
  });
  t('un mp4 horizontal se detecta', () => {
    const r = revisarHistoria(base, { ...sano, medida: { w: 1920, h: 1080, seg: 6 } });
    assert.ok(r.errores.some((e) => /1920x1080/.test(e)));
  });
  t('un video de 90 s no es un segmento de historia', () => {
    const r = revisarHistoria(base, { ...sano, medida: { w: 1080, h: 1920, seg: 90 } });
    assert.ok(r.errores.some((e) => /segmento de historia/.test(e)));
  });
  t('dos historias que son el MISMO archivo se detectan', () => {
    const r = revisarHistoria(base, { ...sano, otras: [{ id: 'H02', md5: md5(buenos) }] });
    assert.ok(r.errores.some((e) => /MISMO archivo/.test(e)));
  });
  t('y una historia no se acusa a si misma de ser su propio duplicado', () => {
    const r = revisarHistoria(base, { ...sano, otras: [{ id: 'H01', md5: md5(buenos) }] });
    assert.deepStrictEqual(r.errores, []);
  });
  t('sin fila en ANCLAS no se entrega: nadie sabria con que dia sale', () => {
    const r = revisarHistoria({ ...base, ancla: null }, sano);
    assert.ok(r.errores.some((e) => /ANCLAS/.test(e)));
  });
  t('una palabra apagada corta (el incidente RANKING)', () => {
    const r = revisarHistoria(base, { ...sano, entradas: { HUMO: { activa: false, activa_en: [CUENTA] } } });
    assert.ok(r.errores.some((e) => /no esta activa/.test(e)));
  });
  t('activa para OTRA cuenta tampoco sirve', () => {
    const r = revisarHistoria(base, { ...sano, entradas: { HUMO: { activa: true, activa_en: ['@oniahq'] } } });
    assert.ok(r.errores.some((e) => /no esta activa/.test(e)));
  });
  t('una palabra sin registrar corta', () => {
    const r = revisarHistoria(base, { ...sano, entradas: { NADA: null } });
    assert.ok(r.errores.some((e) => /no esta en scripts\/recompensas\.json/.test(e)));
  });
  t('un aviso _sigue* CORTA la entrega, no solo avisa (el caso H07/HUMO)', () => {
    const r = revisarHistoria(base, {
      ...sano,
      entradas: { HUMO: { activa: true, activa_en: [CUENTA], _sigue_sin_subir: 'la web sirve el viejo' } },
    });
    assert.ok(r.errores.some((e) => /NO sale todavia.*la web sirve el viejo/.test(e)));
  });
  t('control negativo: la MISMA palabra sin aviso pasa', () => {
    const r = revisarHistoria(base, { ...sano, entradas: { HUMO: { activa: true, activa_en: [CUENTA] } } });
    assert.deepStrictEqual(r.errores, []);
  });
  t('la palabra se busca entera: SISTEMATICO no dispara SISTEMA', () => {
    const h = { titulo: 'un cambio SISTEMATICO', subtitulo: '' };
    assert.deepStrictEqual(palabraDeLaHistoria(h, ['SISTEMA']), []);
    assert.deepStrictEqual(palabraDeLaHistoria({ titulo: 'comenta SISTEMA hoy', subtitulo: '' }, ['SISTEMA']), ['SISTEMA']);
  });
  t('la palabra se ve tambien en el subtitulo (ahi vive la de H07)', () => {
    const h = { titulo: '5 herramientas', subtitulo: 'comenta HUMO en el ultimo post' };
    assert.deepStrictEqual(palabraDeLaHistoria(h, ['HUMO', 'SISTEMA']), ['HUMO']);
  });
  t('las 12 salen de los plan.json, no de una lista escrita aparte', () => {
    const falso = (p) => ({
      stories: p.includes('20260823')
        ? [{ id: 'H01', title: 'a', subtitle: 'b' }]
        : [{ id: 'H09', title: 'c', subtitle: 'd' }],
    });
    const hs = cargarHistorias(falso);
    assert.deepStrictEqual(hs.map((x) => x.id), ['H01', 'H09']);
    assert.ok(hs[0].mp4.endsWith('historias-20260823/final/H01.mp4'));
  });
  t('toda historia del plan tiene ancla, y toda ancla apunta a un dia que existe', () => {
    const hs = cargarHistorias();
    assert.strictEqual(hs.length, 12);
    for (const h of hs) {
      assert.ok(h.ancla, `${h.id} sin ancla`);
      if (h.ancla.dia !== null) {
        assert.ok(PIEZAS.some((p) => p.dia === h.ancla.dia), `${h.id} ancla al dia ${h.ancla.dia}, que no esta en el calendario`);
      }
    }
  });
  // Los cuatro de abajo son el fallo real del 03-sep: H08 volvio en `video` y no en
  // `document`, la guarda leyo undefined y corto una entrega sana despues de la cabecera.
  t('el tamano se encuentra cuando Telegram contesta document', () => {
    assert.strictEqual(tamanoRecibido({ document: { file_size: 123 } }), 123);
  });
  t('y tambien cuando contesta video (el caso H08)', () => {
    assert.strictEqual(tamanoRecibido({ video: { file_size: 3359671 } }), 3359671);
  });
  t('sin ningun campo con tamano devuelve null, no 0 ni undefined', () => {
    assert.strictEqual(tamanoRecibido({ photo: [{ file_size: 9 }] }), null);
    assert.strictEqual(tamanoRecibido({}), null);
    assert.strictEqual(tamanoRecibido(null), null);
  });
  t('un tamano que no es numero no se toma por bueno', () => {
    assert.strictEqual(tamanoRecibido({ document: { file_size: 'mucho' } }), null);
    assert.strictEqual(tamanoRecibido({ video: {} }), null);
  });
  t('la tabla se inyecta entre marcas y es idempotente', () => {
    const txt = `arriba\n${MARCA_INI}\nviejo\n${MARCA_FIN}\nabajo`;
    const a = inyectar(txt, 'TABLA');
    assert.ok(a.includes('TABLA') && !a.includes('viejo'));
    assert.strictEqual(inyectar(a, 'TABLA'), a);
    assert.strictEqual(bloqueActual(a), 'TABLA');
  });
  t('sin marcas no inventa donde poner la tabla', () => {
    assert.strictEqual(inyectar('sin marcas', 'X'), null);
    assert.strictEqual(bloqueActual('sin marcas'), null);
  });

  console.log(`\nself-check entregar_historia: ${n} casos en verde`);
  return 0;
}

// ------------------------------------------------------------------ CLI

function principal(argv) {
  if (argv.includes('--self-check')) return selfCheck();

  const historias = () => cargarHistorias();

  if (argv.includes('--plan')) {
    console.log(tablaMarkdown(historias()));
    return 0;
  }
  if (argv.includes('--estado')) return estado();

  if (argv.includes('--escribir') || argv.includes('--check')) {
    const ruta = path.join(RAIZ, MANUAL);
    const txt = fs.readFileSync(ruta, 'utf8');
    const tabla = tablaMarkdown(historias());
    const actual = bloqueActual(txt);
    if (actual === null) {
      console.error(`ROJO — ${MANUAL} no tiene las marcas TABLA-HISTORIAS: no se sabe donde va la tabla`);
      return 1;
    }
    if (argv.includes('--check')) {
      if (actual === tabla) { console.log(`OK — la tabla de ${MANUAL} coincide con ANCLAS.`); return 0; }
      console.error(`ROJO — la tabla de ${MANUAL} se despego de ANCLAS. Correr --escribir.`);
      return 1;
    }
    fs.writeFileSync(ruta, inyectar(txt, tabla));
    console.log(`ESCRITO — tabla de ${historias().length} historias en ${MANUAL}`);
    return 0;
  }

  const i = argv.indexOf('--id');
  if (i === -1 || !argv[i + 1]) {
    console.error('uso: node scripts/entregar_historia.js --id <H01..H12> [--ensayo]');
    console.error('     otros: --plan | --estado | --check | --escribir | --self-check');
    return 2;
  }
  return entregar({ id: argv[i + 1], ensayo: argv.includes('--ensayo') });
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));

module.exports = { revisarHistoria, palabraDeLaHistoria, cargarHistorias, tablaMarkdown, inyectar, bloqueActual };

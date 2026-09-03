#!/usr/bin/env node
'use strict';
/**
 * caption_kit.js — arma el CAPTION.md de una pieza publicable.
 *
 * POR QUE EXISTE. El 03-sep se midio que de las SEIS piezas del calendario de Lucia solo
 * el dia 0 (`FIJADO/CAPTION.md`) tenia texto para copiar y pegar. Las cinco que faltan
 * subir tenian las 7 laminas y el brief, pero nada que Sergio pudiera pegar en Instagram:
 * exactamente el hueco que el 31-ago freno al dia 0 ("tenia las 7 laminas y nada que
 * copiar y pegar"). El caption YA existe: vive en el campo `caption` del brief. El trabajo
 * no es escribirlo, es volverlo copiable SIN transcribirlo a mano — una transcripcion a
 * mano es como nacen dos versiones vivas del mismo texto.
 *
 * QUE GARANTIZA. El caption y los hashtags salen del brief byte a byte. Ademas corta antes
 * de escribir cuando la pieza no se puede publicar, que es donde este carril se corto solo
 * varias veces:
 *
 *   1. Carpeta con `_NO-SUBIR.md` -> corta. Tres piezas tienen carpeta gemela
 *      (`L6`/`render-l6`, `L08`/`render-l08`, `FIJADO`/`render-fijado`) y esa ambiguedad ya
 *      costo una vuelta entera en el dia 5.
 *   2. Cantidad de laminas en disco != laminas del brief -> corta. Un caption que promete
 *      "5 senales" sobre una carpeta de 6 archivos es una pieza que se contradice sola.
 *   3. Palabra clave pedida por una lamina pero NO nombrada en el caption -> corta. Es un
 *      CTA muerto en el feed y no da error: lo unico que pasa es que nadie recibe nada.
 *   4. Palabra clave que no esta `activa` para esa cuenta en `scripts/recompensas.json`
 *      -> corta. Es el incidente RANKING del 26-ago (alguien comento, el mapa estaba vacio,
 *      no le llego nada y nadie se entero) y el de MITO/AUTO/COSTO.
 *   5. Dos piezas con la misma palabra prometiendo cosas distintas -> corta. Meta permite
 *      UN solo mensaje por palabra, para siempre: la segunda promesa es incumplible. Es el
 *      paso de verdad O03 que ya esta escrito en recompensas.json.
 *
 * Lo que NO hace: no toca la red. La entrega en vivo la mide
 * `node scripts/verificar_recompensas.js`. Si la palabra tiene una nota `_falta*` o
 * `_sigue*` en recompensas.json, se copia como aviso rojo dentro del CAPTION.md, para que
 * el que va a publicar lo lea sin tener que correr nada.
 *
 *   node scripts/caption_kit.js                # escribe los CAPTION.md que falten
 *   node scripts/caption_kit.js --check        # no escribe: falla si alguno falta o difiere
 *   node scripts/caption_kit.js --self-check   # offline, con controles negativos
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const POSTS = 'hermes-content/references/modelos/lucia/posts-20260807';

/**
 * El calendario, en orden de publicacion. `carpeta` es la que SE SUBE, no la que existe.
 *
 * `manual: true` = ese CAPTION.md NO se genera ni se pisa. El dia 0 se publico el 31-ago y su
 * archivo esta escrito a mano con cosas que el brief no tiene y que no se pueden re-derivar:
 * por que esa pieza va primera, y la etiqueta de IA ya tildada como hecha por Sergio.
 * Generarlo encima seria borrar historia medida para reemplazarla por una plantilla. Igual
 * entra en la lista, porque cuenta para el choque de palabras entre piezas.
 */
const PIEZAS = [
  { dia: 0, brief: 'lucia-quien-es-fijado.json',        carpeta: 'FIJADO',      cuenta: '@lucia.antelo.oficial', manual: true },
  { dia: 2, brief: 'L09-una-cara-que-no-existe.json',   carpeta: 'L09',         cuenta: '@lucia.antelo.oficial' },
  { dia: 3, brief: 'lucia-l6-cinco-senales.json',       carpeta: 'L6',          cuenta: '@lucia.antelo.oficial' },
  { dia: 4, brief: 'L10-la-hoja-sellada.json',          carpeta: 'render-l10',  cuenta: '@lucia.antelo.oficial' },
  { dia: 5, brief: 'L08-tres-de-cinco-gratis.json',     carpeta: 'L08',         cuenta: '@lucia.antelo.oficial' },
  { dia: 6, brief: 'L11-tres-lugares.json',             carpeta: 'render-l11',  cuenta: '@lucia.antelo.oficial' },
];

const RX_LAMINA = /^slide-\d+\.(jpe?g|png)$/i;

// ---------------------------------------------------------------- utilidades puras

/** Palabras clave que la pieza PIDE: la del brief y las de cada lamina. */
function palabrasDeLaPieza(brief) {
  const out = new Set();
  if (brief.comment_trigger) out.add(String(brief.comment_trigger).toUpperCase());
  for (const s of brief.slides || []) {
    if (s.comment_trigger) out.add(String(s.comment_trigger).toUpperCase());
  }
  return [...out];
}

/** ¿El caption nombra la palabra? Mayusculas y como palabra entera, no subcadena. */
function captionNombra(caption, palabra) {
  return new RegExp(`\\b${palabra}\\b`).test(String(caption || ''));
}

/** Lo que la pieza promete a cambio de la palabra, mirando brief y laminas. */
function promesaDeLaPieza(brief, palabra) {
  if (brief.comment_trigger && String(brief.comment_trigger).toUpperCase() === palabra && brief.comment_reward) {
    return String(brief.comment_reward);
  }
  for (const s of brief.slides || []) {
    if (s.comment_trigger && String(s.comment_trigger).toUpperCase() === palabra && s.comment_reward) {
      return String(s.comment_reward);
    }
  }
  return null;
}

/** ¿La promesa de la pieza es una de las voces registradas para esa palabra? */
function promesaRegistrada(entrada, promesa) {
  if (!promesa) return true;
  const voces = [entrada.promete, ...(entrada.voces || [])].filter(Boolean).map((v) => v.toLowerCase().trim());
  return voces.includes(promesa.toLowerCase().trim());
}

/** Avisos que ya estan escritos en recompensas.json (p.ej. "el PDF publicado es el viejo"). */
function avisosDeLaPalabra(entrada) {
  return Object.entries(entrada)
    .filter(([k, v]) => /^_(falta|sigue)/.test(k) && typeof v === 'string')
    .map(([, v]) => v);
}

/**
 * Revisa una pieza. Devuelve {errores:[], avisos:[]}. Sin efectos: es lo que hace que el
 * self-check pueda correr offline y con carpetas de mentira.
 */
function revisar(pieza, brief, archivosEnCarpeta, recompensas, todasLasPiezas) {
  const errores = [];
  const avisos = [];

  if (archivosEnCarpeta === null) {
    errores.push(`la carpeta ${pieza.carpeta} no existe`);
    return { errores, avisos };
  }
  if (archivosEnCarpeta.includes('_NO-SUBIR.md')) {
    errores.push(`${pieza.carpeta} tiene _NO-SUBIR.md: esa version quedo superada, no se le escribe caption`);
  }

  const laminas = archivosEnCarpeta.filter((f) => RX_LAMINA.test(f));
  const enBrief = (brief.slides || []).length;
  if (enBrief > 0 && laminas.length !== enBrief) {
    errores.push(`${pieza.carpeta} tiene ${laminas.length} laminas y el brief describe ${enBrief}`);
  }
  if (laminas.length === 0) errores.push(`${pieza.carpeta} no tiene ninguna lamina slide-NN`);

  for (const palabra of palabrasDeLaPieza(brief)) {
    if (!captionNombra(brief.caption, palabra)) {
      errores.push(`una lamina pide comentar ${palabra} y el caption no la nombra: CTA muerto`);
    }
    const entrada = (recompensas.palabras || {})[palabra];
    if (!entrada) {
      errores.push(`${palabra} no esta registrada en scripts/recompensas.json`);
      continue;
    }
    if (!entrada.activa || !(entrada.activa_en || []).includes(pieza.cuenta)) {
      errores.push(`${palabra} no esta activa para ${pieza.cuenta}: el que comente no recibe nada`);
    }
    const promesa = promesaDeLaPieza(brief, palabra);
    if (!promesaRegistrada(entrada, promesa)) {
      errores.push(`${palabra} promete aca "${promesa}" y en recompensas.json "${entrada.promete}": Meta manda UN solo mensaje por palabra`);
    }
    for (const a of avisosDeLaPalabra(entrada)) avisos.push(`${palabra}: ${a}`);
  }

  // Choque entre piezas: misma palabra, promesas distintas.
  for (const otra of todasLasPiezas) {
    if (otra.pieza.carpeta === pieza.carpeta) continue;
    for (const palabra of palabrasDeLaPieza(brief)) {
      if (!palabrasDeLaPieza(otra.brief).includes(palabra)) continue;
      const a = promesaDeLaPieza(brief, palabra);
      const b = promesaDeLaPieza(otra.brief, palabra);
      if (a && b && a.toLowerCase().trim() !== b.toLowerCase().trim()) {
        errores.push(`${palabra} promete "${a}" aca y "${b}" en ${otra.pieza.carpeta}: la segunda es incumplible`);
      }
    }
  }

  return { errores, avisos };
}

/** El CAPTION.md. El caption y los hashtags se copian del brief, no se reescriben. */
function armarMarkdown(pieza, brief, avisos) {
  const L = [];
  const titulo = brief.slides && brief.slides[0] ? String(brief.slides[0].headline || '').replace(/\*/g, '') : pieza.carpeta;
  L.push(`# Caption — DÍA ${pieza.dia}: «${titulo}»`);
  L.push('');
  L.push('> Generado por `node scripts/caption_kit.js` desde');
  L.push(`> \`${POSTS}/briefs/${pieza.brief}\`.`);
  L.push('> **El caption no está reescrito: es el campo `caption` del brief, copiado.** Si hay que');
  L.push('> cambiarlo, se cambia en el brief y se vuelve a generar — así no nacen dos versiones.');
  L.push('>');
  L.push(`> **Se suben las ${(brief.slides || []).length} imágenes de \`${POSTS}/${pieza.carpeta}/\`**, en orden \`slide-01\` … \`slide-0${(brief.slides || []).length}\`.`);
  L.push('> El orden lo fija **el toque**, no el nombre del archivo: ver `hermes-content/contenido/PUBLICAR.md` § Paso 1-quater.');
  L.push('');
  L.push('## El caption');
  L.push('');
  L.push('```');
  L.push(String(brief.caption || '').trimEnd());
  L.push('```');
  L.push('');
  if ((brief.hashtags || []).length) {
    L.push('**Hashtags:**');
    L.push('');
    L.push('```');
    L.push(brief.hashtags.join(' '));
    L.push('```');
    L.push('');
  }

  const palabras = palabrasDeLaPieza(brief);
  L.push('## La llamada a la acción');
  L.push('');
  if (palabras.length === 0) {
    L.push('**Esta pieza no pide palabra clave.** La lámina de cierre hace una pregunta abierta, así que');
    L.push('**no depende del circuito comentario→DM de n8n**: nadie se queda esperando un mensaje que no llega.');
  } else {
    for (const p of palabras) {
      const promesa = promesaDeLaPieza(brief, p);
      L.push(`- Pide comentar **${p}**${promesa ? ` y promete *${promesa}*` : ''}. Verificado contra`);
      L.push(`  \`scripts/recompensas.json\`: está activa para \`${pieza.cuenta}\` y con esa misma promesa.`);
    }
  }
  L.push('');

  if (avisos.length) {
    L.push('## 🔴 Antes de publicar, leer esto');
    L.push('');
    for (const a of avisos) L.push(`- ${a}`);
    L.push('');
    L.push('Se vuelve a medir con `node scripts/verificar_recompensas.js`.');
    L.push('');
  }

  L.push(`## Las ${(brief.slides || []).length} láminas`);
  L.push('');
  L.push('| # | Titular |');
  L.push('|---|---|');
  for (const s of brief.slides || []) {
    L.push(`| ${s.number} | ${String(s.headline || '').replace(/\|/g, '\\|')} |`);
  }
  L.push('');
  L.push('## Antes de publicar');
  L.push('');
  L.push('1. **Etiqueta de IA en la publicación** (Configuración avanzada al subir). La cuenta promete');
  L.push('   no esconderlo; el detalle está en `hermes-content/contenido/PUBLICAR.md` § Paso 0-ter.');
  L.push('2. **Revisar el orden después de subir**: la galería muestra lo más nuevo primero. Desde el');
  L.push('   24-mar-2026 se puede reordenar un carrusel ya publicado sin perder likes ni comentarios.');
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------- correr de verdad

function leerCarpeta(abs) {
  try { return fs.readdirSync(abs); } catch { return null; }
}

function principal(modo) {
  const recompensas = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/recompensas.json'), 'utf8'));
  const cargadas = PIEZAS.map((pieza) => ({
    pieza,
    brief: JSON.parse(fs.readFileSync(path.join(RAIZ, POSTS, 'briefs', pieza.brief), 'utf8')),
    archivos: leerCarpeta(path.join(RAIZ, POSTS, pieza.carpeta)),
  }));

  let fallos = 0;
  for (const { pieza, brief, archivos } of cargadas) {
    const { errores, avisos } = revisar(pieza, brief, archivos, recompensas, cargadas);
    if (errores.length) {
      fallos++;
      console.log(`  ROJO  día ${pieza.dia} · ${pieza.carpeta}`);
      for (const e of errores) console.log(`        - ${e}`);
      continue;
    }
    const destino = path.join(RAIZ, POSTS, pieza.carpeta, 'CAPTION.md');
    if (pieza.manual) {
      if (!fs.existsSync(destino)) { fallos++; console.log(`  ROJO  día ${pieza.dia} · ${pieza.carpeta}: es manual y no está el CAPTION.md`); }
      else console.log(`  MANUAL día ${pieza.dia} · ${pieza.carpeta}: escrito a mano, no se toca`);
      continue;
    }
    const md = armarMarkdown(pieza, brief, avisos);
    const previo = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : null;
    if (modo === '--check') {
      if (previo === null) { fallos++; console.log(`  ROJO  día ${pieza.dia} · ${pieza.carpeta}: falta CAPTION.md`); }
      else if (previo !== md) { fallos++; console.log(`  ROJO  día ${pieza.dia} · ${pieza.carpeta}: CAPTION.md difiere del brief`); }
      else console.log(`  OK    día ${pieza.dia} · ${pieza.carpeta}${avisos.length ? '  (con aviso)' : ''}`);
      continue;
    }
    if (previo === md) {
      console.log(`  =     día ${pieza.dia} · ${pieza.carpeta}: sin cambios`);
    } else {
      fs.writeFileSync(destino, md);
      console.log(`  ESCRITO día ${pieza.dia} · ${pieza.carpeta}/CAPTION.md${avisos.length ? '  ⚠ con aviso' : ''}`);
    }
  }
  console.log(fallos ? `\n${fallos} pieza(s) en rojo` : '\ntodas las piezas del calendario tienen su caption');
  return fallos === 0 ? 0 : 1;
}

// ---------------------------------------------------------------- self-check

function selfCheck() {
  const assert = require('assert');
  let n = 0;
  const t = (nombre, fn) => { fn(); n++; };

  const recompensas = {
    palabras: {
      SISTEMA: { promete: 'un diagnóstico de 20 minutos', voces: ['el mapa de tu negocio'], activa: true, activa_en: ['@lucia.antelo.oficial'] },
      HUMO: { promete: 'el PDF', activa: true, activa_en: ['@lucia.antelo.oficial'], _sigue_sin_subir: 'la web sirve el viejo' },
      APAGADA: { promete: 'algo', activa: false, activa_en: [] },
    },
  };
  const cuenta = '@lucia.antelo.oficial';
  const base = { carpeta: 'X', cuenta, dia: 9, brief: 'b.json' };
  const brief7 = (extra = {}) => ({ caption: 'texto', hashtags: ['#a'], slides: Array.from({ length: 7 }, (_, i) => ({ number: i + 1, headline: 'h' })), ...extra });
  const siete = Array.from({ length: 7 }, (_, i) => `slide-0${i + 1}.jpg`);
  const rev = (p, b, a) => revisar(p, b, a, recompensas, []);

  // --- casos verdes
  t('pieza sana pasa', () => assert.deepStrictEqual(rev(base, brief7(), siete).errores, []));
  t('sin palabra clave no exige nada', () => assert.strictEqual(rev(base, brief7(), siete).errores.length, 0));
  t('PNG cuenta como lamina', () => assert.strictEqual(rev(base, brief7(), siete.map((f) => f.replace('.jpg', '.png'))).errores.length, 0));

  // --- controles negativos: lo que TIENE que cortar
  t('carpeta ausente corta', () => assert.match(rev(base, brief7(), null).errores[0], /no existe/));
  t('_NO-SUBIR corta', () => assert.ok(rev(base, brief7(), [...siete, '_NO-SUBIR.md']).errores.some((e) => /_NO-SUBIR/.test(e))));
  t('faltando una lamina corta', () => assert.ok(rev(base, brief7(), siete.slice(0, 6)).errores.some((e) => /6 laminas y el brief describe 7/.test(e))));
  t('carpeta sin laminas corta', () => assert.ok(rev(base, brief7(), ['CAPTION.md']).errores.some((e) => /ninguna lamina/.test(e))));
  t('CTA que el caption no nombra corta', () => {
    const b = brief7({ caption: 'no la nombro' });
    b.slides[6].comment_trigger = 'SISTEMA';
    assert.ok(rev(base, b, siete).errores.some((e) => /CTA muerto/.test(e)));
  });
  t('palabra no registrada corta', () => {
    const b = brief7({ caption: 'comentá MITO', comment_trigger: 'MITO' });
    assert.ok(rev(base, b, siete).errores.some((e) => /no esta registrada/.test(e)));
  });
  t('palabra apagada corta', () => {
    const b = brief7({ caption: 'comentá APAGADA', comment_trigger: 'APAGADA' });
    assert.ok(rev(base, b, siete).errores.some((e) => /no recibe nada/.test(e)));
  });
  t('activa pero en otra cuenta corta', () => {
    const b = brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA' });
    assert.ok(rev({ ...base, cuenta: '@otra' }, b, siete).errores.some((e) => /no esta activa/.test(e)));
  });
  t('promesa distinta a la registrada corta', () => {
    const b = brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA', comment_reward: 'un descuento' });
    assert.ok(rev(base, b, siete).errores.some((e) => /UN solo mensaje/.test(e)));
  });
  t('dos piezas, misma palabra, promesas distintas: corta', () => {
    const a = brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA', comment_reward: 'el mapa de tu negocio' });
    const otra = { pieza: { carpeta: 'Y', cuenta }, brief: brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA', comment_reward: 'otra cosa' }) };
    assert.ok(revisar(base, a, siete, recompensas, [otra]).errores.some((e) => /incumplible/.test(e)));
  });
  t('dos piezas, misma palabra, MISMA promesa: pasa', () => {
    const a = brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA', comment_reward: 'el mapa de tu negocio' });
    const otra = { pieza: { carpeta: 'Y', cuenta }, brief: brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA', comment_reward: 'el mapa de tu negocio' }) };
    assert.deepStrictEqual(revisar(base, a, siete, recompensas, [otra]).errores, []);
  });

  // --- matices que ya mordieron en este carril
  t('la voz de Lucia cuenta como promesa valida', () => {
    const b = brief7({ caption: 'comentá SISTEMA', comment_trigger: 'SISTEMA', comment_reward: 'el mapa de tu negocio' });
    assert.deepStrictEqual(rev(base, b, siete).errores, []);
  });
  t('el match es palabra entera, no subcadena', () => {
    const b = brief7({ caption: 'hablemos del SISTEMATICO' });
    b.slides[6].comment_trigger = 'SISTEMA';
    assert.ok(rev(base, b, siete).errores.some((e) => /CTA muerto/.test(e)));
  });
  t('el aviso de recompensas.json viaja al caption', () => {
    const b = brief7({ caption: 'comentá HUMO', comment_trigger: 'HUMO', comment_reward: 'el PDF' });
    const r = rev(base, b, siete);
    assert.deepStrictEqual(r.errores, []);
    assert.ok(r.avisos.some((a) => /sirve el viejo/.test(a)));
  });
  t('la hoja de contacto no se cuenta como lamina', () => {
    assert.strictEqual(rev(base, brief7(), [...siete, '_HOJA-DE-CONTACTO.jpg']).errores.length, 0);
  });
  t('el markdown lleva el caption del brief textual', () => {
    const b = brief7({ caption: 'línea uno\n\nlínea dos' });
    assert.ok(armarMarkdown(base, b, []).includes('línea uno\n\nlínea dos'));
  });

  console.log(`self-check caption_kit: ${n} casos en verde`);
  return 0;
}

const modo = process.argv[2];
process.exit(modo === '--self-check' ? selfCheck() : principal(modo));

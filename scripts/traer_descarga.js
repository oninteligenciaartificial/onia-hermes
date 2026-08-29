#!/usr/bin/env node
/**
 * Trae al repo la ultima descarga de Higgsfield — pero SOLO si de verdad es nueva.
 *
 * Nace del 2026-08-29, donde el mismo error paso DOS VECES en una tarde: Chrome tenia
 * bloqueadas las descargas del sitio, la UI de Higgsfield mostraba "Download complete" (que
 * es SU aviso de que la generacion esta lista, no del navegador), y yo copiaba al repo el
 * archivo mas reciente de Descargas creyendo que era el nuevo. Era el de la pieza ANTERIOR.
 * Las dos veces lo cace comparando la hora del archivo a mano; la segunda casi queda un
 * "V05" que en realidad era el mp4 de V04.
 *
 * Un archivo con el nombre equivocado es peor que un archivo faltante: el faltante se nota,
 * el equivocado se publica.
 *
 * Por eso esto rechaza por defecto cualquier archivo con mas de 10 minutos: si la descarga no
 * ocurrio, no hay nada que traer y hay que decirlo, no copiar lo viejo.
 *
 * Uso:
 *   node scripts/traer_descarga.js --a <ruta/en/el/repo.png> [--patron mp4] [--minutos 10]
 */

const fs = require('fs');
const path = require('path');

const CARPETA_DESCARGAS = path.join(
  process.env.USERPROFILE || process.env.HOME || '', 'Downloads',
);

/** El uuid que Higgsfield mete en el nombre: hf_<fecha>_<hora>_<uuid>.<ext> */
function assetId(nombre) {
  const m = String(nombre).match(/hf_\d+_\d+_([0-9a-f-]{36})\./i);
  return m ? m[1] : null;
}

/**
 * Elige el candidato. No copia nada: decidir y copiar son cosas distintas, y asi el
 * self-check puede probar la decision sin tocar el disco de verdad.
 */
function elegir({ desde, patron = '', minutos = 10, ahora = Date.now() }) {
  if (!fs.existsSync(desde)) return { ok: false, motivo: `no existe la carpeta ${desde}` };

  const candidatos = fs.readdirSync(desde)
    .filter((n) => !patron || n.toLowerCase().endsWith(patron.toLowerCase()))
    .map((n) => {
      const p = path.join(desde, n);
      let st; try { st = fs.statSync(p); } catch { return null; }
      return st.isFile() ? { nombre: n, ruta: p, mtime: st.mtimeMs, bytes: st.size } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.mtime - a.mtime);

  if (!candidatos.length) return { ok: false, motivo: `no hay archivos${patron ? ` .${patron}` : ''} en Descargas` };

  const c = candidatos[0];
  const edadMin = (ahora - c.mtime) / 60000;
  if (edadMin > minutos) {
    return {
      ok: false,
      motivo: `el mas reciente ("${c.nombre}") tiene ${Math.round(edadMin)} min: NO es de esta descarga.`
        + ' Casi seguro la descarga no ocurrio (¿Chrome bloqueando el sitio?).'
        + ' NO se copia nada: un archivo con el nombre equivocado es peor que uno faltante.',
      candidato: c,
    };
  }
  return { ok: true, archivo: c, edadMin, id: assetId(c.nombre) };
}

function selfCheck() {
  const assert = require('assert');
  const os = require('os');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'descargas-'));
  const AHORA = 1_700_000_000_000;

  // a) carpeta vacia: no hay nada que traer
  ok(!elegir({ desde: tmp, ahora: AHORA }).ok, 'una carpeta vacia no trae nada');

  // b) el archivo viejo se RECHAZA — este es el caso que costo dos errores
  const viejo = path.join(tmp, 'hf_20260829_163728_3f4bd69c-42a0-4954-b1c8-6d523c09c788.mp4');
  fs.writeFileSync(viejo, 'x');
  fs.utimesSync(viejo, new Date(AHORA - 45 * 60000), new Date(AHORA - 45 * 60000));
  const r = elegir({ desde: tmp, patron: 'mp4', ahora: AHORA });
  ok(!r.ok && /45 min/.test(r.motivo), 'un archivo de 45 min se rechaza y dice por que');

  // c) el archivo recien bajado SI se trae, y trae su asset id
  const nuevo = path.join(tmp, 'hf_20260829_170000_11111111-2222-3333-4444-555555555555.mp4');
  fs.writeFileSync(nuevo, 'x');
  fs.utimesSync(nuevo, new Date(AHORA - 60000), new Date(AHORA - 60000));
  const r2 = elegir({ desde: tmp, patron: 'mp4', ahora: AHORA });
  ok(r2.ok && r2.archivo.nombre === path.basename(nuevo), 'trae el recien bajado');
  ok(r2.id === '11111111-2222-3333-4444-555555555555', 'saca el asset id del nombre');

  // d) el patron filtra: pidiendo png, el mp4 nuevo no cuenta
  ok(!elegir({ desde: tmp, patron: 'png', ahora: AHORA }).ok, 'el patron filtra por extension');

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`self-check ok: ${casos} casos`);
}

if (require.main === module) {
  if (process.argv.includes('--self-check')) { selfCheck(); process.exit(0); }

  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--a') args.a = argv[i + 1];
    else if (argv[i] === '--patron') args.patron = argv[i + 1];
    else if (argv[i] === '--minutos') args.minutos = Number(argv[i + 1]);
  }
  if (!args.a) {
    console.error('uso: node scripts/traer_descarga.js --a <ruta/destino.ext> [--patron mp4] [--minutos 10]');
    process.exit(2);
  }

  const r = elegir({
    desde: CARPETA_DESCARGAS,
    patron: args.patron || path.extname(args.a).replace('.', ''),
    minutos: args.minutos || 10,
  });
  if (!r.ok) { console.error(`NO SE TRAJO NADA: ${r.motivo}`); process.exit(1); }

  fs.mkdirSync(path.dirname(args.a), { recursive: true });
  fs.copyFileSync(r.archivo.ruta, args.a);
  console.log(`traido: ${r.archivo.nombre} (${Math.round(r.edadMin)} min, ${Math.round(r.archivo.bytes / 1024)} KB)`);
  console.log(`  -> ${args.a}`);
  if (r.id) console.log(`  asset id: ${r.id}   (anotalo en el LEEME del banco)`);
}

module.exports = { elegir, assetId };

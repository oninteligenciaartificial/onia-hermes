#!/usr/bin/env node
/**
 * Comprueba EN VIVO que cada recompensa prometida se pueda descargar.
 *
 * Existe porque "el archivo esta en el repo" no significa nada para quien comenta: lo
 * unico que cuenta es que la URL responda. El 23-ago la palabra HUMO se encendio porque
 * "el PDF existe y responde 200" — se verifico una vez y nunca mas, y despues dio 404
 * con la palabra encendida. Hoy le pasa lo mismo a SISTEMA, que prometen OCHO piezas.
 *
 * No vive dentro del gate a proposito: el gate tiene que ser rapido, determinista y
 * funcionar sin red. Esto es una comprobacion de produccion y se corre aparte, antes de
 * encender una palabra o de publicar un lote.
 *
 * Uso:  node scripts/verificar_recompensas.js
 *       node scripts/verificar_recompensas.js --solo SISTEMA
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const REGISTRO = path.join(__dirname, 'recompensas.json');
const RAIZ = path.join(__dirname, '..');

/**
 * Pide la URL y REINTENTA una vez si falla por red.
 *
 * Nace del 2026-08-29: SISTEMA y HUMO dieron timeout en una corrida y las tres URLs
 * respondieron 200 en 0,7 s con curl un minuto despues. Era un hipo de red. Pero el guardian
 * ya habia gritado su alarma mas fuerte —"la palabra esta ACTIVA y su recurso no responde"—
 * cuyo remedio escrito es APAGAR la palabra. O sea: un blip de red podia dejar sin embudo a
 * dos cuentas vivas.
 *
 * Un 404 real falla las dos veces; un hipo, no. El remedio de una falsa alarma era peor que
 * la falsa alarma.
 */
async function pedirConReintento(url) {
  const r = await pedir(url);
  const fueDeRed = r.statusCode === 0;
  if (!fueDeRed) return r;
  await new Promise((s) => setTimeout(s, 1500));
  const r2 = await pedir(url);
  return { ...r2, reintentado: true };
}

function pedir(url, redirecciones = 3) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'GET', timeout: 15000 }, (res) => {
      const { statusCode, headers } = res;
      if ([301, 302, 307, 308].includes(statusCode) && headers.location && redirecciones > 0) {
        res.resume();
        return resolve(pedir(new URL(headers.location, url).href, redirecciones - 1));
      }
      // Se hashea AL VUELO en vez de juntar el cuerpo en memoria: el sha sale gratis
      // sobre bytes que ya estabamos leyendo para contarlos, y no cambia el consumo.
      let bytes = 0;
      const hash = crypto.createHash('sha256');
      res.on('data', (c) => { bytes += c.length; hash.update(c); });
      res.on('end', () => resolve({
        statusCode, tipo: headers['content-type'] || '', bytes, sha: hash.digest('hex'),
      }));
    });
    req.on('timeout', () => { req.destroy(); resolve({ statusCode: 0, tipo: 'timeout', bytes: 0 }); });
    req.on('error', (e) => resolve({ statusCode: 0, tipo: e.code || 'error', bytes: 0 }));
    req.end();
  });
}

/**
 * ¿La web sirve EL MISMO archivo que el repo promete en `entrega`?
 *
 * Nace del 2026-09-03. Hasta hoy esto preguntaba "¿respondio 200 y es un pdf?", y con eso
 * HUMO daba `OK` mientras onia.com.bo servia un PDF DISTINTO al del repo: la tapa promete
 * "3 de las cinco son gratis" y la version publicada etiquetaba CUATRO con esa palabra. El
 * arreglo se hizo en la fuente el 02-sep y se re-rindio, pero la subida es un deploy — y
 * durante ese hueco el que comenta HUMO recibia el numero que no cierra, con el verificador
 * en verde. Es el mismo defecto que `carousel_render.js` tuvo con las 7 laminas identicas:
 * preguntar "¿aparecio un archivo?" en vez de "¿aparecio EL archivo?".
 *
 * Por eso NO se mete dentro de `ok`: responder y entregar-lo-correcto son dos cosas, igual
 * que `activa` y `publicado` ya son dos en el registro. Esta es la tercera: `al dia`.
 *
 * Solo aplica a `tipo: "pdf"`. Una `pagina` no tiene copia local byte a byte —
 * compararla seria un rojo permanente, que es la forma mas rapida de que nadie mire.
 *
 * `leerSha` se inyecta para poder probar las cuatro ramas sin red y sin tocar disco.
 */
function veredictoEntrega(r, shaServido, leerSha) {
  if (r.tipo !== 'pdf' || !r.entrega) return { aplica: false };
  const shaLocal = leerSha(r.entrega);
  if (shaLocal === null) {
    return { aplica: true, ok: false, motivo: `el registro promete \`${r.entrega}\` y ese archivo NO esta en el repo` };
  }
  if (shaLocal !== shaServido) {
    return {
      aplica: true,
      ok: false,
      motivo: `la web sirve OTRO archivo: repo ${shaLocal.slice(0, 12)} != web ${String(shaServido).slice(0, 12)} — falta subir \`${r.entrega}\``,
    };
  }
  return { aplica: true, ok: true };
}

function shaDeArchivo(rel) {
  const abs = path.join(RAIZ, rel);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
}

async function main() {
  const argv = process.argv.slice(2);
  const solo = argv.includes('--solo') ? argv[argv.indexOf('--solo') + 1] : null;
  const reg = JSON.parse(fs.readFileSync(REGISTRO, 'utf8'));

  let fallas = 0;
  for (const [clave, r] of Object.entries(reg.palabras)) {
    if (solo && clave !== solo) continue;
    if (!r.url) {
      console.log(`  --  ${clave}: sin URL declarada` + (r.activa ? '  🔴 y la palabra esta ACTIVA' : ' (palabra apagada, ok)'));
      if (r.activa) fallas++;
      continue;
    }
    const res = await pedirConReintento(r.url);
    const esPdf = r.tipo === 'pdf';
    const ok = res.statusCode === 200 && (!esPdf || res.tipo.includes('pdf'));
    const marca = ok ? 'OK ' : '🔴 ';
    console.log(`  ${marca} ${clave}: ${res.statusCode} ${res.tipo.split(';')[0]} ${res.bytes}b  ${r.url}`);

    // Lo que de verdad importa no es que falle: es que falle MIENTRAS la palabra
    // esta encendida, porque ahi hay gente comentando y recibiendo nada.
    if (!ok && r.activa) {
      console.log(`      🔴 la palabra esta ACTIVA en ${(r.activa_en || []).join(', ') || '(sin cuentas)'} y su recurso no responde`);
      fallas++;
    } else if (!ok) {
      console.log('      (palabra apagada, asi que no hay lead perdido — pero no se enciende hasta arreglarlo)');
    }
    // Y que el registro no se mienta a si mismo.
    if (ok !== Boolean(r.publicado)) {
      console.log(`      ⚠️  el registro dice publicado:${Boolean(r.publicado)} y la realidad es ${ok}`);
      fallas++;
    }

    // Responder no es entregar: que lo servido sea EL archivo, no uno cualquiera.
    if (ok) {
      const v = veredictoEntrega(r, res.sha, shaDeArchivo);
      if (v.aplica && !v.ok) {
        console.log(`      🔴 ${v.motivo}`);
        fallas++;
      }
    }
  }

  console.log(fallas ? `\n${fallas} problema(s)` : '\ntodas las recompensas responden');
  process.exit(fallas ? 1 : 0);
}

/**
 * Self-check del reintento. Existe porque este codigo SOLO corre cuando algo falla: en la
 * corrida feliz no se ejecuta nunca, asi que un bug ahi vive escondido hasta el dia que
 * importa. De hecho el 29-ago se introdujo uno —la funcion se llamaba a si misma— y la
 * corrida normal daba verde igual.
 */
async function selfCheck() {
  const assert = require('assert');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  // a) contra un host que no existe: falla, y TARDA de mas porque reintento
  const t0 = Date.now();
  const r = await pedirConReintento('https://no-existe-onia-' + 'x'.repeat(12) + '.invalid/x');
  const ms = Date.now() - t0;
  ok(r.statusCode === 0, 'un host inexistente da statusCode 0');
  ok(r.reintentado === true, 'marca que reintento');
  ok(ms >= 1500, `reintenta de verdad: tardo ${ms} ms, esperaba >= 1500`);

  // b) contra una URL sana: NO reintenta y no pierde tiempo
  const t1 = Date.now();
  const s = await pedirConReintento('https://onia.com.bo/recursos/lista-por-donde-empezar.pdf');
  ok(s.statusCode === 200, 'una URL sana responde 200');
  ok(!s.reintentado, 'una URL sana NO reintenta');
  ok(Date.now() - t1 < 1500, 'y no paga la espera del reintento');
  ok(typeof s.sha === 'string' && s.sha.length === 64, 'y trae el sha256 de lo que sirvio');

  // c) las cuatro ramas de veredictoEntrega, sin red y sin disco. Se prueba con inyeccion
  //    porque el caso que importa —repo != web— solo ocurre durante un deploy pendiente,
  //    o sea casi nunca, o sea que un bug ahi no se nota hasta el dia que hace falta.
  const HAY = 'a'.repeat(64);
  const OTRO = 'b'.repeat(64);
  const nunca = () => { throw new Error('no deberia leer disco'); };

  ok(veredictoEntrega({ tipo: 'pagina', entrega: 'x.pdf' }, HAY, nunca).aplica === false,
    'una pagina no se compara byte a byte');
  ok(veredictoEntrega({ tipo: 'pdf', entrega: null }, HAY, nunca).aplica === false,
    'un pdf sin `entrega` declarada no se compara');
  ok(veredictoEntrega({ tipo: 'pdf', entrega: 'x.pdf' }, HAY, () => HAY).ok === true,
    'mismo sha => al dia');

  const distinto = veredictoEntrega({ tipo: 'pdf', entrega: 'x.pdf' }, OTRO, () => HAY);
  ok(distinto.ok === false, 'sha distinto => rojo');
  ok(/falta subir/.test(distinto.motivo), 'y dice que falta subirlo');

  const ausente = veredictoEntrega({ tipo: 'pdf', entrega: 'x.pdf' }, HAY, () => null);
  ok(ausente.ok === false, 'si el archivo prometido no esta en el repo => rojo');
  ok(/NO esta en el repo/.test(ausente.motivo), 'y lo dice con esas palabras');

  console.log(`self-check ok: ${casos} casos`);
}

if (process.argv.includes('--self-check')) selfCheck().catch((e) => { console.error(e.message); process.exit(1); });
else main();

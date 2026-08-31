#!/usr/bin/env node
/**
 * verificar_cola.js — nada entra a "Ahora" sin evidencia de que existe.
 *
 * Regla de Sergio, 2026-08-30: *"nada entra a 'Ahora' sin evidencia de que existe
 * (archivo:linea, salida de comando o captura). Eso mata el trabajo fantasma."*
 *
 * Nace de un dato medido: en otra sesion, de 6 items declarados pendientes, **4 eran
 * fantasma** — no existian. Una cola con fantasmas es peor que no tener cola, porque se
 * planifica el dia sobre trabajo que no esta.
 *
 * Esta es la version mecanica de esa regla. Una regla que solo vive en un doc se
 * desobedece; una que falla con exit 1 no.
 *
 *   node scripts/verificar_cola.js <cola.md>
 *   node scripts/verificar_cola.js --self-check
 *
 * QUE EXIGE. Cada item de la seccion "Ahora" tiene que nombrar al menos una `ruta` entre
 * backticks que EXISTA en disco. Se acepta tambien `$ comando` como evidencia de forma —
 * pero solo cuando el item ademas trae una ruta, porque un comando escrito no prueba nada
 * hasta que alguien lo corre.
 *
 * QUE NO EXIGE. Las secciones "Despues" y "Bloqueado" pueden hablar de cosas que todavia no
 * existen: para eso estan. El filtro es sobre lo que se declara accionable HOY.
 */

const fs = require('fs');
const path = require('path');

const SECCION_DURA = /^##\s+ahora\b/i;
const OTRA_SECCION = /^##\s+/;
const ITEM = /^\s*[-*]\s+\[[ xX]\]\s+(.*)$/;

// `algo` entre backticks. Una ruta se distingue de un comando por el `$ ` inicial.
const TROZOS = /`([^`]+)`/g;

// Corta a proposito: preferible exigir el slash a inventar reglas sobre que parece un archivo.
const EXTENSIONES = /\.(md|json|js|mjs|cjs|ts|tsx|png|jpg|jpeg|webp|svg|mp4|mov|wav|mp3|pdf|txt|csv|html|css|ya?ml|sh|py)$/i;

function itemsDeAhora(texto) {
  const items = [];
  let dentro = false;
  texto.split(/\r?\n/).forEach((linea, i) => {
    if (SECCION_DURA.test(linea)) { dentro = true; return; }
    if (dentro && OTRA_SECCION.test(linea)) { dentro = false; return; }
    if (!dentro) return;
    const m = linea.match(ITEM);
    if (m) items.push({ linea: i + 1, texto: m[1] });
  });
  return items;
}

function evidenciaDe(texto) {
  const rutas = [];
  const comandos = [];
  let m;
  TROZOS.lastIndex = 0;
  while ((m = TROZOS.exec(texto)) !== null) {
    const t = m[1].trim();
    if (t.startsWith('$ ')) comandos.push(t.slice(2).trim());
    // Una ruta tiene separador, O termina en una extension CONOCIDA. Antes bastaba con "un punto
    // y 2-5 letras al final", y eso lee cualquier dominio como ruta: `onia.com.bo` y `onia.hq`
    // quedaron marcados fantasma. Escribir una URL o un handle en la cola es normal, asi que el
    // falso positivo se repetia y costaba una vuelta cada vez.
    else if (/[\/]/.test(t) || EXTENSIONES.test(t)) rutas.push(t);
  }
  return { rutas, comandos };
}

// Un item NO puede citarse a si mismo. El 31-ago se escribio un item "TRABADO — 15 piezas
// esperando una decision" cuya unica evidencia era la ruta de ESTA cola: el archivo existe, asi
// que el gate lo dejo pasar en verde, y las 15 piezas no tenian ni un archivo detras. Un
// subagente lo encontro y describio exacto: "apunta a si mismo como evidencia".
//
// Es la forma mas fina del trabajo fantasma, y la mas peligrosa, porque pasa el control: la
// evidencia es real, solo que no prueba NADA sobre el item. Verificar que un archivo existe no
// alcanza si ese archivo es el que hace la afirmacion.
function esAutoReferencia(ruta, archivoCola) {
  if (!archivoCola) return false;
  return path.resolve(ruta) === path.resolve(archivoCola);
}

// Cinco veces seguidas el gate rechazo un item porque su autor escribio el NOMBRE del archivo
// en vez de su ruta desde la raiz ("TABLA-DE-CORTES.md" en vez de "hermes-content/.../TABLA-DE-CORTES.md").
// La regla es correcta —un nombre suelto no se puede verificar— pero rechazar sin ayudar hace
// perder una vuelta entera cada vez. Si el archivo existe en algun lado, el error lo dice.
// El tope arranco en 4.000 y el repo tiene 10.743 archivos: el barrido se cortaba antes de
// llegar y el gate no sugeria nada. Se midio, no se estimo.
function buscarPorNombre(nombre, baseDir, tope = 60000) {
  const objetivo = path.basename(nombre).toLowerCase();
  const pendientes = [baseDir];
  let vistos = 0;
  while (pendientes.length && vistos < tope) {
    const dir = pendientes.shift();
    let entradas;
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entradas) {
      if (e.name === '.git' || e.name === 'node_modules') continue;
      vistos += 1;
      const completo = path.join(dir, e.name);
      if (e.isDirectory()) pendientes.push(completo);
      else if (e.name.toLowerCase() === objetivo) {
        return path.relative(baseDir, completo).split(path.sep).join('/');
      }
    }
  }
  return null;
}

function revisarCola(texto, baseDir = process.cwd(), archivoCola = null) {
  const problemas = [];
  const items = itemsDeAhora(texto);

  if (!items.length) {
    problemas.push({ regla: 'cola-vacia', linea: 0,
      msg: 'la seccion "## Ahora" no tiene items: o no existe, o el carril esta parado' });
    return { problemas, items };
  }

  for (const it of items) {
    const { rutas, comandos } = evidenciaDe(it.texto);

    if (!rutas.length) {
      problemas.push({
        regla: 'sin-evidencia', linea: it.linea,
        msg: comandos.length
          ? `"${it.texto.slice(0, 60)}" trae un comando pero ninguna ruta: un comando escrito no prueba que algo exista`
          : `"${it.texto.slice(0, 60)}" no nombra ninguna ruta entre backticks`,
      });
      continue;
    }

    // El punto de todo el archivo: la ruta tiene que ESTAR.
    for (const r of rutas) {
      const abs = path.resolve(baseDir, r);
      if (esAutoReferencia(abs, archivoCola)) {
        problemas.push({
          regla: 'auto-referencia', linea: it.linea,
          msg: `"${it.texto.slice(0, 50)}" se cita a si mismo como evidencia: la cola no prueba `
            + 'lo que la cola afirma',
        });
        continue;
      }
      if (!fs.existsSync(abs)) {
        const sugerencia = r.includes('/') ? null : buscarPorNombre(r, baseDir);
        problemas.push({
          regla: 'fantasma', linea: it.linea,
          msg: `"${it.texto.slice(0, 50)}" apunta a ${r} y ese archivo NO existe`
            + (sugerencia ? `. ¿Quisiste decir \`${sugerencia}\`?` : ''),
        });
      }
    }
  }
  return { problemas, items };
}

function selfCheck() {
  const assert = require('node:assert');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  const tmp = path.join(require('os').tmpdir(), 'cola-selfcheck');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  fs.writeFileSync(path.join(tmp, 'existe.png'), 'x');

  // El caso que da nombre al archivo: 4 de 6 eran fantasma.
  let r = revisarCola('## Ahora\n- [ ] Publicar algo · `existe.png` · 10 min\n', tmp);
  ok(!r.problemas.length, 'un item con ruta que existe pasa');

  r = revisarCola('## Ahora\n- [ ] Publicar algo · `no-esta.png` · 10 min\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'una ruta que no existe es fantasma');

  r = revisarCola('## Ahora\n- [ ] Terminar el sistema de publicacion\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'un item sin ruta no entra');

  // Un comando solo NO alcanza: es justo la forma que tiene el trabajo fantasma de sonar real.
  r = revisarCola('## Ahora\n- [ ] Correr el gate · `$ node scripts/carousel_gate.js`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'un comando escrito no es evidencia');

  // "10 min" y "Sergio" no son rutas: sin esto, cualquier item con un backtick pasaria.
  r = revisarCola('## Ahora\n- [ ] Algo · `10 min` · `Sergio`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'un texto entre backticks no es una ruta');

  // Despues y Bloqueado hablan del futuro: ahi el fantasma es legitimo.
  r = revisarCola('## Ahora\n- [ ] ok · `existe.png`\n\n## Despues\n- [ ] algo que no existe todavia\n', tmp);
  ok(!r.problemas.length, 'Despues no se revisa: para eso esta');

  // Un item ya hecho igual tiene que apuntar a algo real, o la cola miente hacia atras.
  r = revisarCola('## Ahora\n- [x] Hecho · `no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'un item marcado hecho tambien se verifica');

  // Una cola sin "Ahora" es un carril parado, y eso hay que decirlo, no dejarlo pasar en verde.
  r = revisarCola('## Despues\n- [ ] algo\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'cola-vacia'), 'sin Ahora, el carril esta parado');

  // Varias rutas en un item: basta que UNA falte para que el item sea mentira.
  r = revisarCola('## Ahora\n- [ ] Dos cosas · `existe.png` y `no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'alcanza que una ruta falte');


  // El item que se cita a si mismo: pasaba en verde y no probaba nada.
  const colaFalsa = path.join(tmp, 'cola.md');
  fs.writeFileSync(colaFalsa, 'x');
  const AHORA = ['## Ahora', ''].join(String.fromCharCode(10));
  r = revisarCola(AHORA + '- [ ] 15 piezas esperando `cola.md`', tmp, colaFalsa);
  ok(r.problemas.some((x) => x.regla === 'auto-referencia'), 'la cola no se prueba a si misma');

  // Control: la regla nueva no debe romper el caso sano.
  r = revisarCola(AHORA + '- [ ] algo real `existe.png`', tmp, colaFalsa);
  ok(!r.problemas.length, 'una ruta distinta de la cola sigue pasando');


  // Un nombre suelto que SI existe en el arbol: el error tiene que sugerir la ruta, no solo negar.
  fs.mkdirSync(path.join(tmp, 'hondo', 'mas'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'hondo', 'mas', 'TABLA.md'), 'x');
  r = revisarCola(AHORA + '- [ ] algo `TABLA.md`', tmp);
  ok(r.problemas.some((x) => x.regla === 'fantasma' && x.msg.includes('hondo/mas/TABLA.md')),
    'sugiere la ruta completa cuando el nombre existe en el arbol');

  // Y si no existe en ningun lado, sigue siendo un rechazo seco.
  r = revisarCola(AHORA + '- [ ] algo `NO-EXISTE-EN-NINGUN-LADO.md`', tmp);
  ok(r.problemas.some((x) => x.regla === 'fantasma' && !x.msg.includes('Quisiste')),
    'sin candidato no inventa sugerencia');


  // Dominios y handles NO son rutas. Dos falsos positivos reales: onia.com.bo y onia.hq.
  r = revisarCola(AHORA + '- [ ] ok `existe.png` y probe `onia.com.bo` y `onia.hq`', tmp);
  ok(!r.problemas.length, 'un dominio entre backticks no se confunde con una ruta');

  // Pero una extension de verdad sigue contando, aunque no tenga barra.
  r = revisarCola(AHORA + '- [ ] algo `NO-ESTA.json`', tmp);
  ok(r.problemas.some((x) => x.regla === 'fantasma'), 'una extension conocida sigue siendo ruta');

  console.log(`self-check ok: ${casos} casos`);
}

function main() {
  const a = process.argv.slice(2);
  if (a.includes('--self-check')) return selfCheck();

  const archivo = a[0];
  if (!archivo) {
    console.error('uso: node scripts/verificar_cola.js <cola.md>');
    process.exit(2);
  }

  const { problemas, items } = revisarCola(fs.readFileSync(archivo, 'utf8'), process.cwd(), archivo);
  for (const p of problemas) console.log(`ERROR ${p.regla} [linea ${p.linea}]: ${p.msg}`);

  if (!problemas.length) console.log(`cola ok: ${items.length} items en Ahora, todos con evidencia real`);
  process.exit(problemas.length ? 1 : 0);
}

if (require.main === module) main();
module.exports = { revisarCola, itemsDeAhora, evidenciaDe };

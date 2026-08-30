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
    // Una ruta se reconoce por tener separador o extension. "10 min" no es una ruta.
    else if (/[\\/]/.test(t) || /\.[a-z0-9]{2,5}$/i.test(t)) rutas.push(t);
  }
  return { rutas, comandos };
}

function revisarCola(texto, baseDir = process.cwd()) {
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
      if (!fs.existsSync(path.resolve(baseDir, r))) {
        problemas.push({
          regla: 'fantasma', linea: it.linea,
          msg: `"${it.texto.slice(0, 50)}" apunta a ${r} y ese archivo NO existe`,
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

  const { problemas, items } = revisarCola(fs.readFileSync(archivo, 'utf8'), process.cwd());
  for (const p of problemas) console.log(`ERROR ${p.regla} [linea ${p.linea}]: ${p.msg}`);

  if (!problemas.length) console.log(`cola ok: ${items.length} items en Ahora, todos con evidencia real`);
  process.exit(problemas.length ? 1 : 0);
}

if (require.main === module) main();
module.exports = { revisarCola, itemsDeAhora, evidenciaDe };

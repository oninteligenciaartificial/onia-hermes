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

// Una linea de continuacion: indentada y con contenido. Un item largo pone su evidencia ahi,
// asi que leer solo la primera linea era declarar "sin evidencia" lo que citaba tres archivos.
const CONTINUACION = /^\s{2,}\S/;

function itemsDeAhora(texto) {
  const items = [];
  let dentro = false;
  let actual = null;
  const cerrar = () => { if (actual) items.push(actual); actual = null; };

  texto.split(/\r?\n/).forEach((linea, i) => {
    if (SECCION_DURA.test(linea)) { cerrar(); dentro = true; return; }
    if (dentro && OTRA_SECCION.test(linea)) { cerrar(); dentro = false; return; }
    if (!dentro) return;

    const m = linea.match(ITEM);
    if (m) { cerrar(); actual = { linea: i + 1, texto: m[1] }; return; }

    // Una linea en blanco NO cierra el item: los items largos traen parrafos separados.
    if (!linea.trim()) return;
    if (actual && CONTINUACION.test(linea)) { actual.texto += '\n' + linea.trim(); return; }

    // Texto sin indentar = ya no es este item.
    cerrar();
  });

  cerrar();
  return items;
}

function evidenciaDe(texto) {
  const rutas = [];
  const comandos = [];
  let m;
  TROZOS.lastIndex = 0;
  while ((m = TROZOS.exec(texto)) !== null) {
    const t = m[1].trim();
    if (t.startsWith('$ ')) { comandos.push(t.slice(2).trim()); continue; }

    // "lib/plan-limits.ts:396" es como se cita una linea. El archivo es lo de la izquierda;
    // el sufijo no es parte del nombre, y buscarlo tal cual daba fantasmas falsos.
    const ruta = t.replace(/:\d+(?::\d+)?$/, '');

    // "/inbox", "/requerimientos", "/root/bin" son URLs de la app o rutas del VPS: no se
    // verifican contra ESTE disco. No son evidencia, pero llamarlas fantasma es el gate
    // gritando en falso, y un gate que grita en falso se termina ignorando.
    if (/^[\/]/.test(ruta)) continue;

    // Un backtick tambien envuelve codigo y endpoints: `GET /api/x`, `invoice.patient?.ci`,
    // `responsable?.ci ?? patient.ci`. Ningun archivo del repo tiene espacios ni signos de
    // pregunta en el nombre, asi que eso los descarta sin tener que adivinar.
    if (/[\s?]/.test(ruta)) continue;

    // Una ruta se reconoce por tener separador o extension. "10 min" no es una ruta.
    if (/[\/]/.test(ruta) || /\.[a-z0-9]{2,5}$/i.test(ruta)) rutas.push(ruta);
  }
  return { rutas, comandos };
}


// ONIA es DOS repos y una cola cita a los dos: el carril de producto trabaja en
// `onia-platform` (lib/plan-limits.ts, app/api/...) y escribe su cola en
// `onia-hermes`. Resolviendo solo contra el repo actual, cada ruta del producto
// salia como "fantasma" y el verificador quedaba inservible justo para el carril
// que mas lo necesita — se midio el 2026-08-31: 10 falsos positivos de 10.
//
// No se pasa a rutas absolutas a proposito: una cola con `C:\dev\...` adentro
// solo sirve en la maquina de Sergio.
const REPOS_HERMANOS = ['onia-platform'];

function existeEnAlgunRepo(ruta, baseDir) {
  if (fs.existsSync(path.resolve(baseDir, ruta))) return true;
  // El repo hermano cuelga del mismo padre que este (…/proyectos/onia-hermes
  // y …/proyectos/onia-platform). Desde un worktree hay que subir mas, asi que
  // se prueban los padres hasta encontrarlo.
  let dir = path.resolve(baseDir);
  for (let i = 0; i < 6; i++) {
    for (const repo of REPOS_HERMANOS) {
      if (fs.existsSync(path.join(path.dirname(dir), repo, ruta))) return true;
    }
    const padre = path.dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }
  return false;
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
      if (!existeEnAlgunRepo(r, baseDir)) {
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

  // --- Los tres falsos positivos medidos el 2026-08-31 sobre la cola de producto ---

  // (1) Un item largo pone su evidencia en las lineas de continuacion. Leer solo la primera
  // linea declaraba "sin evidencia" items que citaban tres archivos reales.
  r = revisarCola('## Ahora\n- [ ] Algo grande, sin ruta en la primera linea\n      la evidencia esta aca: `existe.png`\n', tmp);
  ok(!r.problemas.length, 'la evidencia puede vivir en una linea de continuacion');

  // Y su reciproco, que es lo que impide que el arreglo afloje el gate: la continuacion de un
  // item no le presta evidencia al item siguiente.
  r = revisarCola('## Ahora\n- [ ] uno · `existe.png`\n- [ ] dos, sin nada\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia' && p.linea === 3), 'cada item necesita su propia evidencia');

  // (2) `archivo.ts:396` es como se cita una linea. El archivo existe; el sufijo no es su nombre.
  r = revisarCola('## Ahora\n- [ ] Algo · `existe.png:42`\n', tmp);
  ok(!r.problemas.length, 'archivo:linea apunta a un archivo que existe');

  // (3) `/requerimientos` es una URL de la app, no un archivo. No es evidencia, pero tampoco es
  // un fantasma: llamarla fantasma es la forma que tiene el gate de gritar en falso.
  r = revisarCola('## Ahora\n- [ ] Enlazar `/requerimientos` desde `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una URL de app no se verifica contra el disco');

  r = revisarCola('## Ahora\n- [ ] Enlazar `/requerimientos`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'una URL sola no alcanza como evidencia');

  // (4) Un backtick tambien envuelve codigo y endpoints: `GET /api/x`, `invoice.patient?.ci`,
  // `responsable?.ci ?? patient.ci`. Ningun archivo del repo tiene espacios ni `?` en el nombre,
  // asi que eso los descarta sin tener que adivinar.
  r = revisarCola('## Ahora\n- [ ] Algo · `existe.png` · `GET /api/x` · `invoice.patient?.ci`\n', tmp);
  ok(!r.problemas.length, 'codigo y endpoints entre backticks no son rutas');

  // (5) La cola de producto vive en onia-hermes y cita archivos de onia-platform, que es un
  // repo hermano. Sin esto el gate llamaba fantasma a todo el producto — la mitad del carril —
  // y se volvia ruido puro. `existeEnAlgunRepo` no tenia ni un caso que lo cubriera.
  fs.mkdirSync(path.join(tmp, 'onia-platform', 'lib'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'onia-platform', 'lib', 'plan-limits.ts'), 'x');
  fs.mkdirSync(path.join(tmp, 'onia-hermes'), { recursive: true });
  r = revisarCola('## Ahora\n- [ ] Gatear el add-on · `lib/plan-limits.ts:396`\n', path.join(tmp, 'onia-hermes'));
  ok(!r.problemas.length, 'una ruta del repo hermano onia-platform resuelve');

  // Y su limite: lo que no esta ni aca ni en el hermano sigue siendo fantasma.
  r = revisarCola('## Ahora\n- [ ] Algo · `lib/no-existe-en-ningun-lado.ts`\n', path.join(tmp, 'onia-hermes'));
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'el repo hermano no vuelve verde cualquier ruta');

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

#!/usr/bin/env node
/**
 * colas-vivas.mjs — corre `verificar_cola.js` sobre las colas DE VERDAD, derivadas del disco.
 *
 * POR QUE EXISTE. `test:cola-selfcheck` ya estaba en la cadena, pero mide el instrumento contra
 * casos de laboratorio: prueba que el verificador FUNCIONA, no que las colas vivas esten limpias.
 * La medicion viva era `cola:viva`, un alias suelto que no corria nadie — ni la cadena `npm test`
 * ni el arranque de ningun carril —, y por eso su rojo vivio dias sin que nadie lo viera
 * (anotado como pendiente al cerrar el item del 2026-09-25 en hermes-content/docs/COLA.md).
 *
 * POR QUE NO ALCANZABA CON APUNTAR EL ALIAS A LA CARPETA. Medido el 2026-09-25: de los 32 .md de
 * hermes-content/docs/cola/ + COLA.md, **28 salian exit 1 y los 28 con el MISMO unico error**,
 * `cola-vacia`. No eran 28 colas rotas: el verificador no distingue
 *
 *     (a) un archivo que NO ES UNA COLA  — el README de la carpeta, TABLERO.md, y los 22
 *         borradores PARA-PUBLICAR y GUIONES, que no tienen "## Ahora" y nunca lo van a tener;
 *     (b) una cola de verdad con "## Ahora" vacio — el carril esta parado, que es senal REAL.
 *
 * Los trata igual, asi que apuntar el alias a la carpeta daba rojo de fabrica — y un gate rojo de
 * fabrica entrena a saltearlo, que es palabra por palabra como CLAUDE.md cuenta que se rompio el
 * CI dos veces. Por eso el alias quedo clavado a UN archivo escrito a mano.
 *
 * QUE HACE ENTONCES.
 *   - Deriva los sujetos DEL DISCO, nunca de una lista escrita a mano: es cola el archivo que
 *     tiene seccion "## Ahora". Es derivacion por FORMA, con el mismo regex que usa el
 *     verificador, asi que una cola nueva entra sola el dia que se escribe.
 *   - Falla por lo que es su asunto: **evidencia falsa** (items que nombran archivos que no
 *     existen, duplicados, shas fantasma). Ese es el contrato del verificador.
 *   - NO falla por `cola-vacia`: "el carril esta parado" es un estado del carril, no un defecto de
 *     evidencia, y ya tiene su propio canal (las tareas "Carril seco / Reponer" del tablero).
 *     Trabar el merge de TODOS los carriles porque uno se quedo sin trabajo es el rojo de fabrica
 *     otra vez. Pero se NOMBRA en la salida: una exclusion muda es la que nadie audita.
 *   - Nombra lo excluido y cuanto. Un gate que no dice que midio, no midio.
 *
 * Uso:
 *   node scripts/colas-vivas.mjs              # mide las colas vivas (exit 1 si hay evidencia falsa)
 *   node scripts/colas-vivas.mjs --self-check # prueba este instrumento, sin tocar el repo
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const VERIFICADOR = path.join(AQUI, 'verificar_cola.js');

// El MISMO regex que verificar_cola.js usa para abrir la seccion (SECCION_DURA). Si alla cambia,
// aca tiene que cambiar: por eso el self-check incluye un caso con "## AHORA" en mayusculas y otro
// con texto pegado al encabezado, que son las dos formas en que un regex propio se desalinearia.
const SECCION_AHORA = /^##\s+ahora\b/im;

// De donde salen los candidatos. Carpetas, NUNCA nombres de archivo: un archivo nuevo entra solo.
const CANDIDATOS = [
  { archivo: 'hermes-content/docs/COLA.md' },
  { carpeta: 'hermes-content/docs/cola' },
];

export function esCola(texto) {
  return SECCION_AHORA.test(texto);
}

export function candidatosEnDisco(raiz = RAIZ, candidatos = CANDIDATOS) {
  const fuera = [];
  for (const c of candidatos) {
    if (c.archivo) {
      const p = path.join(raiz, c.archivo);
      if (fs.existsSync(p)) fuera.push(p);
      continue;
    }
    const dir = path.join(raiz, c.carpeta);
    if (!fs.existsSync(dir)) continue;
    for (const n of fs.readdirSync(dir).sort()) {
      if (n.endsWith('.md')) fuera.push(path.join(dir, n));
    }
  }
  return fuera;
}

/**
 * Clasifica la salida del verificador. `cola-vacia` sale por su propia puerta a proposito: ver la
 * cabecera. Todo lo demas es evidencia falsa y es rojo.
 */
export function clasificarSalida(stdout) {
  const errores = [];
  let parado = false;
  const texto = String(stdout);

  // ⚠️ El verificador se NIEGA a medir si no lo corren desde la raiz del repo ("NO MEDIDO: desde
  // X no se ve el repo") — y sale **exit 0**, o sea que su negativa se lee igual que una cola
  // limpia. Medido el 2026-09-25 corriendolo desde /tmp: tres colas, dos de ellas con fantasmas
  // plantados a proposito, y las tres "verdes". Un gate que hereda ese 0 es un falso verde que
  // cubre TODAS las colas a la vez, asi que aca se atrapa por su texto y se llama por su nombre:
  // "no pude preguntar" nunca es "me dijeron que no".
  if (/^NO MEDIDO:/m.test(texto)) {
    return { errores: [], parado: false, noMedido: true };
  }

  for (const linea of texto.split('\n')) {
    const m = linea.match(/^ERROR\s+([a-z0-9-]+)\s/i);
    if (!m) continue;
    if (m[1] === 'cola-vacia') { parado = true; continue; }
    errores.push(linea.trim());
  }
  return { errores, parado, noMedido: false };
}

function medirUna(archivo, raiz) {
  const r = spawnSync(process.execPath, [VERIFICADOR, archivo], {
    cwd: raiz, encoding: 'utf8', timeout: 120000,
  });
  // Un instrumento que no pudo preguntar NO es un instrumento que dijo que no: si el verificador
  // ni siquiera corrio (timeout, falta node, se rompio), eso es rojo con su propio nombre y no se
  // confunde con "la cola esta limpia".
  if (r.error || r.status === null) {
    return { errores: [`no se pudo medir: ${r.error ? r.error.message : 'el verificador no termino'}`], parado: false, noMedido: false };
  }
  return clasificarSalida(`${r.stdout || ''}\n${r.stderr || ''}`);
}

export function medir(raiz = RAIZ, candidatos = CANDIDATOS, medidor = medirUna) {
  const colas = [];
  const noSonCola = [];
  for (const p of candidatosEnDisco(raiz, candidatos)) {
    const texto = fs.readFileSync(p, 'utf8');
    const rel = path.relative(raiz, p);
    if (!esCola(texto)) { noSonCola.push(rel); continue; }
    colas.push({ archivo: rel, ...medidor(p, raiz) });
  }
  return { colas, noSonCola };
}

function informar(raiz = RAIZ) {
  const { colas, noSonCola } = medir(raiz);
  const conErrores = colas.filter((c) => c.errores.length);
  const noMedidas = colas.filter((c) => c.noMedido);
  const parados = colas.filter((c) => c.parado && !c.errores.length);

  // Un gate que no imprime que midio, no midio: el sujeto y el recuento van SIEMPRE.
  console.log(`colas vivas medidas: ${colas.length - noMedidas.length} — con evidencia falsa ${conErrores.length} · carril parado ${parados.length} · NO MEDIDAS ${noMedidas.length} · no son cola ${noSonCola.length} (excluidos)`);
  for (const c of colas) {
    if (c.noMedido) {
      console.log(`  NO MEDIDO ${c.archivo} — el verificador se nego a medir (se corre desde la raiz de onia-hermes)`);
    } else if (c.errores.length) {
      console.log(`  ROJO ${c.archivo}`);
      for (const e of c.errores) console.log(`       ${e}`);
    } else if (c.parado) {
      console.log(`  PARADO ${c.archivo} — "## Ahora" sin items: el carril se quedo sin trabajo (no traba el merge; se repone por el tablero)`);
    } else {
      console.log(`  ok ${c.archivo}`);
    }
  }
  if (noSonCola.length) console.log(`  excluidos (sin "## Ahora", no son colas): ${noSonCola.join(' ')}`);

  if (noMedidas.length) {
    console.log('\nNO MEDIDO no es verde: el verificador no pudo mirar esas colas, asi que no sabemos si estan limpias.');
    process.exit(2);
  }
  if (conErrores.length) {
    console.log('\nUn item de "Ahora" nombra evidencia que no existe. Arreglalo o sacalo: una cola que promete archivos fantasma manda a cada sesion a buscar lo que no esta.');
    process.exit(1);
  }
}

function selfCheck() {
  let casos = 0; let fallas = 0;
  const ok = (cond, nombre) => { casos++; if (!cond) { fallas++; console.log(`  FALLA: ${nombre}`); } };

  // --- esCola: derivar por FORMA, con las variantes que desalinearian un regex propio
  ok(esCola('## Ahora\n- [ ] algo'), 'reconoce "## Ahora"');
  ok(esCola('# T\n\n## AHORA\n- [ ] algo'), 'reconoce "## AHORA" en mayusculas');
  ok(esCola('## Ahora — plan de features\n- [x] algo'), 'reconoce "## Ahora" con cola de titulo');
  ok(!esCola('## Despues\n- [ ] algo'), 'NO es cola sin seccion Ahora');
  ok(!esCola('## Ahorapoco\n- [ ] algo'), 'NO confunde una palabra que EMPIEZA con ahora');
  ok(!esCola('texto con ## Ahora en medio de una linea'), 'el encabezado va a principio de linea');
  ok(!esCola('### Ahora\n- [ ] algo'), 'un h3 no abre la seccion dura (igual que el verificador)');

  // --- clasificarSalida: cola-vacia sale por su propia puerta, el resto es rojo
  let c = clasificarSalida('ERROR cola-vacia [linea 0]: la seccion "## Ahora" no tiene items');
  ok(c.parado === true && c.errores.length === 0, 'cola-vacia marca PARADO y no es error');
  c = clasificarSalida('ERROR fantasma [linea 9]: nombra `no-esta.png`, que no existe');
  ok(c.errores.length === 1 && c.parado === false, 'un fantasma SI es error');
  c = clasificarSalida('ERROR cola-vacia [linea 0]: x\nERROR fantasma [linea 9]: y');
  ok(c.errores.length === 1 && c.parado === true, 'las dos cosas a la vez se separan');
  c = clasificarSalida('AVISO fantasma-narrado [linea 454]: es bitacora');
  ok(c.errores.length === 0, 'un AVISO no es un ERROR');
  c = clasificarSalida('cola ok: 34 items en Ahora, todos con evidencia real');
  ok(c.errores.length === 0 && c.parado === false && !c.noMedido, 'una cola limpia no inventa nada');

  // El falso verde que destapo este gate: el verificador se niega y sale exit 0.
  c = clasificarSalida('NO MEDIDO: desde /tmp/x no se ve el repo (falta CLAUDE.md, hermes-content).\nTodo `fantasma` de aca seria del arbol.');
  ok(c.noMedido === true && c.errores.length === 0, 'una negativa a medir se marca NO MEDIDO');
  ok(clasificarSalida('cola ok: 3 items').noMedido === false, 'una cola de verdad medida NO se marca NO MEDIDO');

  // --- medir(): sobre un arbol de mentira, sin tocar el repo
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'colas-vivas-'));
  try {
    fs.mkdirSync(path.join(tmp, 'q'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'q', 'README.md'), '# Como se usa esta carpeta\n\nSin seccion Ahora.\n');
    fs.writeFileSync(path.join(tmp, 'q', 'parada.md'), '## Ahora\n\n(nada)\n\n## Despues\n- [ ] luego\n');
    fs.writeFileSync(path.join(tmp, 'q', 'limpia.md'), '## Ahora\n- [ ] Mirar algo · `q/limpia.md` · 5 min\n');
    fs.writeFileSync(path.join(tmp, 'q', 'sucia.md'), '## Ahora\n- [ ] Mirar algo · `q/no-existe-jamas.md` · 5 min\n');
    // El verificador real se NIEGA a correr fuera de la raiz del repo, asi que aca se inyecta un
    // medidor de mentira: lo que este bloque prueba es la DERIVACION de sujetos y el reparto de
    // veredictos, no el verificador (ese tiene sus propios 114 casos en test:cola-selfcheck).
    const falso = (p) => (path.basename(p) === 'sucia.md'
      ? clasificarSalida('ERROR fantasma [linea 2]: nombra `q/no-existe-jamas.md`, que no existe')
      : path.basename(p) === 'parada.md'
        ? clasificarSalida('ERROR cola-vacia [linea 0]: la seccion "## Ahora" no tiene items')
        : clasificarSalida('cola ok: 1 items en Ahora, todos con evidencia real'));

    const { colas, noSonCola } = medir(tmp, [{ carpeta: 'q' }], falso);
    ok(noSonCola.length === 1 && noSonCola[0].endsWith('README.md'), 'el README queda excluido y NOMBRADO');
    ok(colas.length === 3, 'mide las 3 colas, no los 4 archivos');
    const porNombre = Object.fromEntries(colas.map((x) => [path.basename(x.archivo), x]));
    ok(porNombre['parada.md'].parado === true && porNombre['parada.md'].errores.length === 0, 'carril parado no es rojo');
    ok(porNombre['limpia.md'].errores.length === 0, 'la cola limpia pasa');
    ok(porNombre['sucia.md'].errores.length === 1, 'la cola con una ruta fantasma da rojo');

    // Reciproco: un archivo nuevo con "## Ahora" entra SOLO, sin tocar ninguna lista.
    fs.writeFileSync(path.join(tmp, 'q', 'nueva.md'), '## Ahora\n- [ ] Algo · `q/nueva.md` · 1 min\n');
    ok(medir(tmp, [{ carpeta: 'q' }], falso).colas.length === 4, 'una cola nueva entra sola (sujetos del disco)');

    // Reciproco del otro lado: el candidato por archivo suelto tambien se filtra por forma.
    fs.writeFileSync(path.join(tmp, 'suelto.md'), '# No soy una cola\n');
    ok(medir(tmp, [{ archivo: 'suelto.md' }], falso).colas.length === 0, 'un archivo suelto sin Ahora no se mide como cola');
    ok(medir(tmp, [{ archivo: 'no-existe.md' }], falso).colas.length === 0, 'un candidato que no esta en disco no rompe');

    // Y el medidor REAL, corrido desde un tmp, tiene que salir NO MEDIDO — nunca verde.
    const real = medir(tmp, [{ carpeta: 'q' }]);
    ok(real.colas.every((x) => x.noMedido === true), 'el verificador real fuera de la raiz sale NO MEDIDO, no verde');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log(`self-check colas-vivas: ${casos - fallas}/${casos}`);
  if (fallas) process.exit(1);
}

const esMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esMain) {
  if (process.argv.includes('--self-check')) selfCheck();
  else informar();
}

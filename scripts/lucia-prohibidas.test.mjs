import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { escanear, ejecutar } from './lucia-prohibidas.mjs';

test('fixtures inventados: función y CLI', async t => {
  const carpeta = await mkdtemp(path.join(tmpdir(), 'lucia-prohibidas-'));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const defecto = path.join(carpeta, 'hermes-content/docs/cola/lucia-diario');
  await mkdir(defecto, { recursive: true });
  const archivo = path.join(defecto, 'guion.txt');
  await writeFile(archivo, 'Uno\nDos\nHoy soy odontóloga\n');
  const correr = async (...args) => {
    const salida = [];
    const status = await ejecutar(args, { cwd: carpeta, imprimir: linea => salida.push(linea) });
    return { status, stdout: salida.join('\n') };
  };

  await t.test('1: primera persona, línea 3, sin duplicar frase anidada', async () => {
    const resultados = escanear('Uno\nDos\nHoy soy odontóloga', archivo);
    assert.equal(resultados.length, 1);
    assert.equal(resultados[0].archivo, archivo);
    assert.equal(resultados[0].linea, 3);
    assert.equal(resultados[0].frase, 'hoy soy odontóloga');
    assert.ok((await correr(archivo)).stdout.includes(`${archivo}:3:`));
  });
  await t.test('2: mayúsculas y tildes', () => assert.equal(escanear('PRÓXIMAMENTE proximamente Próximamente', archivo).length, 3));
  await t.test('3: límite de palabra beta', () => {
    assert.equal(escanear('alfabeta', archivo).length, 0);
    assert.equal(escanear('beta', archivo).length, 1);
  });
  await t.test('4: testimonio singular y plural', () => {
    assert.equal(escanear('testimonios', archivo).length, 1);
    assert.equal(escanear('un testimonio de cliente', archivo).length, 1);
    assert.equal(escanear('antitestimonio testimonial', archivo).length, 0);
  });
  await t.test('5: archivo limpio y argumentos reemplazan recorrido', async () => {
    const limpio = path.join(carpeta, 'limpio.md');
    await writeFile(limpio, 'Una clínica organiza sus citas.');
    assert.equal(escanear('Una clínica organiza sus citas.', limpio).length, 0);
    const resultado = await correr(limpio);
    assert.equal(resultado.status, 0);
    assert.match(resultado.stdout, /Resumen: 0 coincidencias/);
  });
  await t.test('6: argumento bloquea, defecto informa', async () => {
    assert.equal((await correr(archivo)).status, 1);
    const resultado = await correr();
    assert.equal(resultado.status, 0);
    assert.match(resultado.stdout, /Resumen: 1 coincidencias/);
  });
  await t.test('7: argumento inexistente', async () => assert.equal((await correr('ausente.txt')).status, 2));
  await t.test('8: extensiones omitidas y texto ilegible', async () => {
    await writeFile(path.join(defecto, 'datos.json'), '{"texto":"beta"}');
    await writeFile(path.join(defecto, 'foto.png'), Buffer.from([0, 255, 0]));
    await writeFile(path.join(defecto, 'binario.txt'), Buffer.from([255]));
    const resultado = await correr();
    assert.equal(resultado.status, 0);
    assert.match(resultado.stdout, /Omitidos: 3/);
    assert.match(resultado.stdout, /Resumen: 1 coincidencias/);
  });
  await t.test('9: agenda llena, espacios y fuente', () => {
    const resultados = escanear('Te dejo la agenda llena\nAGENDA   LLENA\nagenda llenar', archivo);
    assert.equal(resultados.length, 2);
    for (const resultado of resultados) {
      assert.equal(resultado.frase, 'agenda llena');
      assert.equal(resultado.fuente, 'LUCIA.md §0');
    }
  });
  await t.test('plurales y límites Unicode', () => {
    assert.equal(escanear('soy odontólogas; como odontólogas; soy doctoras; mis consultorios; mis estudios; agendas llenas; betas', archivo).length, 7);
    assert.equal(escanear('βbeta betaβ _beta beta2', archivo).length, 0);
  });
  await t.test('recursión, carpetas ignoradas, archivo enorme y deduplicación', async () => {
    const sub = path.join(defecto, 'sub');
    await mkdir(sub);
    await writeFile(path.join(sub, 'otro.md'), 'muy pronto');
    for (const nombre of ['.git', 'node_modules']) {
      await mkdir(path.join(defecto, nombre));
      await writeFile(path.join(defecto, nombre, 'oculto.md'), 'beta');
    }
    await writeFile(path.join(defecto, 'enorme.txt'), 'x'.repeat(2 * 1024 * 1024 + 1));
    const resultado = await correr(defecto, archivo);
    assert.equal(resultado.status, 1);
    assert.match(resultado.stdout, /Resumen: 2 coincidencias en 2 archivos/);
    assert.match(resultado.stdout, /enorme.txt: supera 2 MB/);
  });
});

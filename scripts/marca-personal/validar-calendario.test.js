#!/usr/bin/env node
'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validar } = require('./validar-calendario');

let pasaron = 0;
function test(nombre, fn) {
  fn();
  pasaron++;
  console.log(`  ok - ${nombre}`);
}

const CABECERA = '## Calendario\n\n| Día | Hora | Pieza | Palabra | Estado | Falta para publicar |\n|---|---|---|---|---|---|\n';
const evidencia = '`abcdef1` · `videos/fixture/`';
const fila = (dia = 'Dom 11', hora = '12:30', pieza = 'Video A', palabra = '—', estado = 'propuesta', falta = '—') =>
  `| ${dia} | ${hora} | ${pieza} | ${palabra} | ${estado} | ${falta} |`;
const calendario = (...filas) => CABECERA + filas.join('\n');
const opciones = { raiz: '/fixture', avisosTexto: '', existeCommit: () => true, existeArchivo: () => true };
const revisar = (texto, extras = {}) => validar(texto, { ...opciones, ...extras });
function falla(resultado, mensaje) {
  assert.strictEqual(resultado.codigo, 1);
  assert.ok(resultado.errores.some(error => error.includes(mensaje)), JSON.stringify(resultado));
}
function verde(resultado) {
  assert.strictEqual(resultado.codigo, 0, JSON.stringify(resultado));
  assert.deepStrictEqual(resultado.errores, []);
}
const carruseles = cantidad => calendario(...Array.from({ length: cantidad }, (_, i) =>
  fila(`Dom ${i + 1}`, '16:00', `Carrusel ${i + 1}`, '—', 'agendada')));

test('calendario correcto: video, carrusel y video falta grabar con aviso', () => {
  const r = revisar(calendario(
    fila('Dom 11', '12:30', '**Video A**', '—', `corte listo (${evidencia})`),
    fila('Dom 11', '16:00', 'Carrusel A', '—', 'agendada'),
    fila('Lun 12', '18:30', 'Video B', '**rutina**', '**falta grabar**'),
  ), { avisosTexto: '## RUTINA · título\nRecurso listo' });
  verde(r);
  assert.deepStrictEqual(r.avisos, []);
  assert.strictEqual(r.filas, 3);
});

test('choque expandido informa cada red y minuto', () => {
  const r = revisar(calendario(fila(), fila('Dom 11', '12:30', 'Video B')));
  falla(r, 'choque:');
  assert.deepStrictEqual(r.errores, [
    'choque: Instagram Dom 11 12:30 · Video A y Video B',
    'choque: TikTok Dom 11 12:35 · Video A y Video B',
    'choque: YouTube Shorts Dom 11 12:35 · Video A y Video B',
    'choque: LinkedIn Dom 11 12:35 · Video A y Video B',
  ]);
});
test('mismo minuto en días distintos no choca; yaps y otras tablas se ignoran', () => {
  verde(revisar('## Hora de cada red\n| Yap | 13:30 |\n' + calendario(fila(), fila('Lun 12')) + '\n\n- Yap a las 13:30\n## Otra tabla\n| x | y |'));
});
test('11 carruseles superan cupo TikTok y LinkedIn, nunca Shorts', () => {
  const r = revisar(carruseles(11));
  falla(r, 'cupo: TikTok tiene 11');
  assert.deepStrictEqual(r.errores, [
    'cupo: TikTok tiene 11 agendados (máx. 10)',
    'cupo: LinkedIn tiene 11 agendados (máx. 10)',
  ]);
});
test('10 carruseles quedan verdes', () => verde(revisar(carruseles(10))));
test('video suma a Shorts y carrusel no (cupo inyectado)', () => {
  const video = revisar(calendario(fila('Dom 11', '12:30', 'BA814C81', '—', 'agendada')), { cupo: 0 });
  falla(video, 'cupo: YouTube Shorts tiene 1');
  const carrusel = revisar(calendario(fila('Dom 11', '16:00', 'Carrusel A', '—', 'agendada')), { cupo: 0 });
  falla(carrusel, 'cupo: TikTok tiene 1');
  assert.ok(!carrusel.errores.some(error => error.includes('YouTube Shorts')));
});
test('master listo entra a Buffer; corte y borrador no entran', () => {
  const texto = calendario(
    fila('Dom 11', '12:30', 'Video A', '—', `master listo · ${evidencia}`),
    fila('Lun 12', '12:30', 'Video B', '—', `corte listo · ${evidencia}`),
    fila('Mar 13', '16:00', 'Carrusel C', '—', `borrador listo · ${evidencia}`),
  );
  verde(revisar(texto, { cupo: 1 }));
  falla(revisar(texto, { cupo: 0 }), 'cupo: YouTube Shorts tiene 1');
});
test('corte listo sin SHA falla', () => falla(revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', 'corte listo `videos/a/`'))), 'lista sin sha: Video A'));
test('corte listo sin ruta falla', () => falla(revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', 'corte listo `abcdef1`'))), 'lista sin archivo: Video A'));
test('SHA rechazado falla', () => falla(revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', `corte listo ${evidencia}`)), { existeCommit: () => false }), 'sha inexistente: abcdef1'));
test('archivo rechazado falla', () => falla(revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', `corte listo ${evidencia}`)), { existeArchivo: () => false }), 'archivo inexistente: videos/fixture/'));
test('se comprueba cada SHA y ruta; SHA admite 7 a 40 hexadecimales', () => {
  const shas = [], rutas = [];
  const largo = 'a'.repeat(40);
  const r = revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', `lista`)), {});
  falla(r, 'lista sin sha');
  verde(revisar(calendario(fila('Dom 11', '12:30', 'Video B', '—', `borrador listo \`abcdef1\` \`${largo}\` \`videos/a/\` \`videos/b/\``)), {
    existeCommit: sha => { shas.push(sha); return true; },
    existeArchivo: ruta => { rutas.push(ruta); return true; },
  }));
  assert.deepStrictEqual(shas, ['abcdef1', largo]);
  assert.deepStrictEqual(rutas, ['videos/a/', 'videos/b/']);
});
test('SHA no verificable da aviso y sigue verde', () => {
  const r = revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', `corte listo ${evidencia}`)), { existeCommit: () => null });
  verde(r);
  assert.deepStrictEqual(r.avisos, ['sha no verificable: abcdef1']);
});
test('estado exactamente lista admite evidencia en otra columna', () => {
  verde(revisar(calendario(fila('Dom 11', '12:30', 'Video A', '—', 'lista', evidencia))));
});
test('agendada sin aviso es ERROR', () => falla(revisar(calendario(fila('Dom 11', '16:00', 'Carrusel A', 'PRUEBAS', 'agendada · floja'))), 'palabra sin aviso: PRUEBAS (Carrusel A)'));
test('falta grabar sin aviso es sólo AVISO', () => {
  const r = revisar(calendario(fila('Dom 11', '12:30', 'Video A', 'PRUEBAS', 'falta grabar')));
  verde(r);
  assert.deepStrictEqual(r.avisos, ['palabra sin aviso: PRUEBAS (Video A)']);
});
test('gravedad de aviso respeta todos los estados', () => {
  for (const estado of ['agendada', 'corte listo', 'borrador listo', 'master listo', 'lista']) {
    falla(revisar(calendario(fila('Dom 11', '12:30', 'Video A', 'X', estado))), 'palabra sin aviso: X');
  }
  for (const estado of ['falta editar', 'propuesta', 'falta capturas del producto', 'otro']) {
    const r = revisar(calendario(fila('Dom 11', '12:30', 'Video A', 'X', estado)));
    verde(r);
    assert.strictEqual(r.avisos.length, 1);
  }
});
test('aviso con CONFIRMAR da sólo AVISO y termina en próximo encabezado', () => {
  const r = revisar(calendario(fila('Dom 11', '16:00', 'Carrusel A', 'antigravity', 'agendada')), {
    avisosTexto: '## ANTIGRAVITY · título\n[CONFIRMAR]\n## PRUEBAS\nListo',
  });
  verde(r);
  assert.deepStrictEqual(r.avisos, ['aviso en borrador: ANTIGRAVITY']);
  const listo = revisar(calendario(fila('Dom 11', '16:00', 'Carrusel A', 'PRUEBAS', 'agendada')), {
    avisosTexto: '## pruebas\nListo\n## OTRO · título\n[CONFIRMAR]',
  });
  verde(listo);
  assert.deepStrictEqual(listo.avisos, []);
});
test('17:45 está fuera de huecos fijos', () => falla(revisar(calendario(fila('Dom 11', '17:45'))), 'hora fuera de los huecos fijos'));
test('marcador CONFIRMAR con instrucción dentro del corchete da AVISO', () => {
  const r = revisar(calendario(fila('Dom 11', '16:00', 'Carrusel A', 'ANTIGRAVITY', 'agendada')), {
    avisosTexto: '## ANTIGRAVITY · título\n[CONFIRMAR el sáb 10: comprobar la ruta]',
  });
  verde(r);
  assert.deepStrictEqual(r.avisos, ['aviso en borrador: ANTIGRAVITY']);
});
test('16:00 sólo acepta carrusel y 12:30 sólo video', () => {
  falla(revisar(calendario(fila('Dom 11', '16:00'))), 'hora fuera de los huecos fijos');
  falla(revisar(calendario(fila('Dom 11', '12:30', 'Carrusel A'))), 'hora fuera de los huecos fijos');
});
test('sin columna Palabra informa formato y renglón, sin excepción', () => {
  const r = revisar(CABECERA.replace(' Palabra |', '') + fila());
  falla(r, 'formato: renglón 3 · falta columna Palabra');
});
test('fila incompleta y hora inválida informan su renglón', () => {
  falla(revisar(CABECERA + '| Dom 11 | 12:30 | Video | — | propuesta |'), 'formato: renglón 5');
  for (const hora of ['7:30', '25:00', '12:60']) {
    falla(revisar(calendario(fila('Dom 11', hora))), 'formato: renglón 5 · Hora debe ser HH:MM');
  }
});
test('lector usa todos los avisos y fs desde raíz, sin Git', () => {
  const temporal = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-calendario-'));
  const sinGitAnterior = process.env.MARCA_CALENDARIO_SIN_GIT;
  process.env.MARCA_CALENDARIO_SIN_GIT = '1';
  try {
    // Sólo fixtures: no lee calendario ni avisos del repo.
    const carpeta = path.join(temporal, 'hermes-content/docs/cola/plan-3-semanas');
    fs.mkdirSync(carpeta, { recursive: true });
    fs.mkdirSync(path.join(temporal, 'videos/fixture'), { recursive: true });
    fs.writeFileSync(path.join(carpeta, 'AVISOS-COMUNIDAD-A.md'), '## HAIKU · título\nListo');
    fs.writeFileSync(path.join(carpeta, 'AVISOS-COMUNIDAD-B.md'), '## RUTINA · título\nListo');
    const texto = calendario(fila('Dom 11', '12:30', 'Video A', 'HAIKU', `corte listo ${evidencia}`), fila('Lun 12', '12:30', 'Video B', 'RUTINA', 'falta grabar'));
    const r = validar(texto, { raiz: temporal });
    verde(r);
    assert.deepStrictEqual(r.avisos, ['sha no verificable: abcdef1']);
    fs.rmSync(path.join(temporal, 'videos/fixture'), { recursive: true });
    falla(validar(texto, { raiz: temporal }), 'archivo inexistente: videos/fixture/');
  } finally {
    if (sinGitAnterior === undefined) delete process.env.MARCA_CALENDARIO_SIN_GIT;
    else process.env.MARCA_CALENDARIO_SIN_GIT = sinGitAnterior;
    fs.rmSync(temporal, { recursive: true, force: true });
  }
});

console.log(`\n${pasaron} casos pasaron.`);

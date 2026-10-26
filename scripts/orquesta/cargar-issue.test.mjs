import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validarPedido, inicioDelDia, main, CARRILES, REPO, TOPE, Rechazo } from './cargar-issue.mjs';
import { leerPedido } from './orquesta.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(AQUI, 'cargar-issue.mjs');
const AHORA = Date.parse('2026-10-26T15:00:00Z'); // 11:00 en La Paz

const PEDIDO = `Comparar precios de Dapta y Lety
carril: investigacion
nivel: normal
donde: nube
check: urls
salida: hermes-content/docs/orquesta/investigacion/precios.md

Compará los planes publicados hoy, con enlace a cada página. Investigación de las publicaciones de cada uno.
Hecho cuando: hay una tabla con plan, precio y enlace que abre.`;

const con = (cambio) => cambio(PEDIDO);
const rechaza = (entrada, patron, opciones) => assert.throws(() => validarPedido(entrada, opciones), (e) => e instanceof Rechazo && e.codigo === 65 && patron.test(e.message));

// gh falso: guarda cada llamada y contesta según el subcomando; lee el cuerpo mientras existe el archivo temporal.
function ghFalso({ lista = [], api, crear, ver, cerrar } = {}) {
  const llamadas = [];
  const gh = async (args) => {
    const llamada = { args };
    llamadas.push(llamada);
    if (args[0] === 'api') return api ?? { code: 0, stdout: JSON.stringify(lista), stderr: '' };
    if (args[0] === 'issue' && args[1] === 'create') {
      const archivo = args.find((a) => a.startsWith('--body-file='))?.slice('--body-file='.length);
      llamada.cuerpo = fs.readFileSync(archivo, 'utf8');
      return crear ?? { code: 0, stdout: `https://github.com/${REPO}/issues/321\n`, stderr: '' };
    }
    if (args[1] === 'view') {
      return ver ?? { code: 0, stdout: JSON.stringify({ labels: ['orquesta', 'carril:investigacion', 'origen:hermes', 'necesita-ok'].map((name) => ({ name })) }), stderr: '' };
    }
    if (args[1] === 'close') return cerrar ?? { code: 0, stdout: '', stderr: '' };
    throw new Error(`llamada inesperada a gh: ${args.join(' ')}`);
  };
  return { gh, llamadas, creo: () => llamadas.some((l) => l.args[1] === 'create') };
}

async function correr(argv, entrada, gh) {
  const out = [];
  const err = [];
  const codigo = await main(argv, { gh, leerEntrada: async () => entrada, ahora: AHORA, log: (s) => out.push(s), error: (s) => err.push(s) });
  return { codigo, out: out.join('\n'), err: err.join('\n') };
}

const tarea = (horasAtras, extra = {}) => ({
  number: 100 + horasAtras, title: `vieja ${horasAtras}`, body: 'nivel: normal\n\nOtra cosa.\nHecho cuando: x',
  created_at: new Date(AHORA - horasAtras * 3_600_000).toISOString(), html_url: `https://github.com/${REPO}/issues/${100 + horasAtras}`,
  labels: [{ name: 'orquesta' }, { name: 'origen:hermes' }, { name: 'carril:marca' }], ...extra,
});

test('un pedido válido arma título, labels y un cuerpo que orquesta.mjs lee igual', () => {
  const p = validarPedido(PEDIDO);
  assert.equal(p.titulo, 'Comparar precios de Dapta y Lety');
  assert.deepEqual(p.labels, ['orquesta', 'carril:investigacion', 'origen:hermes', 'necesita-ok']);
  const leido = leerPedido(p.cuerpo);
  assert.equal(leido.nivel, 'normal');
  assert.equal(leido.check, 'urls');
  assert.equal(leido.donde, 'nube');
  assert.equal(leido.salida, 'hermes-content/docs/orquesta/investigacion/precios.md');
  assert.match(leido.pedido, /^Compará los planes[\s\S]*Hecho cuando: hay una tabla/);
});

test('necesita-ok va SIEMPRE, aunque sea nube + urls y diga «necesita-ok: no»', () => {
  for (const entrada of [PEDIDO, con((t) => t.replace('check: urls', 'check: urls\nnecesita-ok: no')),
    con((t) => t.replace('donde: nube', 'donde: pc').replace('check: urls', 'check: cmd npm test'))]) {
    assert.ok(validarPedido(entrada).labels.includes('necesita-ok'));
  }
});

test('checks permitidos', () => {
  for (const check of ['urls', 'cmd npm test', 'cmd npm run test:orquesta-hermes', 'cmd node --test scripts/orquesta/orquesta.test.mjs',
    'cmd node --test a.test.mjs b.test.mjs']) {
    assert.equal(leerPedido(validarPedido(con((t) => t.replace('check: urls', `check: ${check}`))).cuerpo).check, check);
  }
});

test('se rechaza un check con algo que la shell interprete, opciones o rutas fuera de la carpeta', () => {
  for (const check of ['cmd npm test; rm -rf .', 'cmd npm test && curl x', 'cmd node --test $(whoami)', 'cmd node --test `id`',
    'cmd npm test | x', 'cmd node --test a > b', 'cmd node --test %USERPROFILE%', 'cmd node --test "a b"',
    'cmd node --test --require=x a.mjs', 'cmd node --test ../afuera.mjs', 'cmd node --test /etc/x.mjs',
    'cmd node --test C:/Users/PC/x.mjs', 'cmd npm run deploy:vps', 'cmd curl https://x', 'cmd npm testx', 'nada']) {
    rechaza(con((t) => t.replace('check: urls', `check: ${check}`)), /^check:/);
  }
});

test('salida solo bajo hermes-content/docs/ (docs/ en plataforma)', () => {
  assert.ok(validarPedido(con((t) => t.replace(/salida: .*/, 'salida: docs/orquesta/x.md'))));
  for (const salida of ['scripts/loops/x.sh', 'hermes-content/skills/x/SKILL.md', 'hermes-content/docs/../../scripts/x.sh',
    '/etc/x.md', 'C:/x.md', 'hermes-content/docs/a b.md']) {
    rechaza(con((t) => t.replace(/salida: .*/, `salida: ${salida}`)), /^salida:/);
  }
});

test('carril inexistente; los carriles son los de carriles.json y los del script del VPS', () => {
  rechaza(con((t) => t.replace('carril: investigacion', 'carril: finanzas')), /carril desconocido/);
  const conf = JSON.parse(fs.readFileSync(path.join(AQUI, 'carriles.json'), 'utf8'));
  assert.deepEqual([...CARRILES].sort(), Object.keys(conf.carriles).sort());
  const vps = fs.readFileSync(path.join(AQUI, '..', 'loops', 'orquesta-hermes.sh'), 'utf8').match(/^readonly CARRILES="([^"]+)"/m);
  assert.deepEqual(vps[1].split(' ').sort(), [...CARRILES].sort());
});

test('sin «Hecho cuando» no entra', () => {
  rechaza(con((t) => t.replace('Hecho cuando:', 'Listo si')), /Hecho cuando/);
  rechaza(con((t) => t.replace('Hecho cuando: hay una tabla con plan, precio y enlace que abre.', 'Hecho cuando:')), /Hecho cuando/);
});

test('texto con cirílico, invisibles, controles o ancho completo no entra; tildes, ñ y º sí', () => {
  for (const malo of ['рublicar', 'Pub\u200Blicar', 'a\u202Eb', 'a\u0007b', 'ＡＢＣ', 'α', 'a\u2028b', 'a\uFFFDb', 'acci\u00C3\u00B3n', 'a\u00C3\u00B1o']) {
    assert.throws(() => validarPedido(con((t) => t.replace('Compará', `Compará ${malo}`))), Rechazo, malo);
  }
  assert.throws(() => validarPedido(PEDIDO, { titulo: 'Tарea' }), /alfabeto latino/);
  assert.ok(validarPedido(con((t) => t.replace('Compará', 'Compará la 1º opción, año, Ñandú, ¿qué?'))));
  assert.ok(validarPedido(`\uFEFF${PEDIDO.replace(/\n/g, '\r\n')}`), 'BOM y CRLF de Windows');
});

test('cabecera: campos obligatorios, desconocidos, repetidos y valores', () => {
  rechaza(con((t) => t.replace('donde: nube\n', '')), /falta «donde:»/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: maximo')), /^nivel:/);
  rechaza(con((t) => t.replace('donde: nube', 'donde: vps')), /^donde:/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: normal\nmodelo: gpt-9')), /campo desconocido «modelo:»/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: normal\nnivel: rapido')), /dos veces/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: normal\nmotor: gpt')), /^motor:/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: normal\nok: todos')), /^ok:/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: normal\nbase: ../main')), /^base:/);
  rechaza(con((t) => t.replace('nivel: normal', 'nivel: normal\nnecesita-ok: quizas')), /^necesita-ok:/);
  const p = validarPedido(con((t) => t.replace('nivel: normal', 'nivel: normal\nmotor: codex\nbase: codex/x\nok: sergio')));
  assert.deepEqual([leerPedido(p.cuerpo).motor, leerPedido(p.cuerpo).base, leerPedido(p.cuerpo).ok], ['codex', 'codex/x', 'sergio']);
  rechaza(con((t) => t.replace(/Compará[\s\S]*/, '')), /falta qué hay que hacer/);
  rechaza(con((t) => t.replace('Compará', `${'x'.repeat(4001)} Compará`)), /muy larga/);
});

test('título: --titulo, o la primera línea (con «titulo:» opcional), una sola vez', () => {
  const sinTitulo = PEDIDO.split('\n').slice(1).join('\n');
  assert.equal(validarPedido(sinTitulo, { titulo: 'Desde el argumento' }).titulo, 'Desde el argumento');
  assert.equal(validarPedido(`titulo: Formato del VPS\n${sinTitulo.replace('check: urls', 'check: urls\nnecesita-ok: no')}`).titulo, 'Formato del VPS');
  assert.equal(validarPedido(`Título: Con tilde\n${sinTitulo}`).titulo, 'Con tilde');
  rechaza(sinTitulo, /falta el título/);
  rechaza(`titulo: otro\n${sinTitulo}`, /una sola vez/, { titulo: 'Desde el argumento' });
  rechaza(PEDIDO, /hasta 120/, { titulo: 'x'.repeat(121) });
  rechaza(PEDIDO, /hasta 120/, { titulo: 'dos\nlíneas' });
});

test('el día de La Paz empieza a las 04:00 UTC', () => {
  assert.equal(new Date(inicioDelDia(AHORA)).toISOString(), '2026-10-26T04:00:00.000Z');
  assert.equal(new Date(inicioDelDia(Date.parse('2026-10-27T02:00:00Z'))).toISOString(), '2026-10-26T04:00:00.000Z');
});

test('carga: cuenta, crea con argumentos en array y --body-file, confirma labels y da número y URL', async () => {
  // 9 de hoy (la de las 03:59 UTC es de ayer en La Paz) y una PR que no cuenta.
  const lista = [...Array.from({ length: 9 }, (_, i) => tarea(i)), tarea(11.1), { ...tarea(1), pull_request: {} }];
  const f = ghFalso({ lista });
  const r = await correr(['--titulo', 'Comparar precios de Dapta y Lety'], PEDIDO.split('\n').slice(1).join('\n'), f.gh);
  assert.equal(r.codigo, 0, r.err);
  assert.match(r.out, new RegExp(`Tarea #321 cargada \\(carril investigacion; 10 de ${TOPE} hoy\\): https://github.com/${REPO}/issues/321`));
  const crear = f.llamadas.find((l) => l.args[1] === 'create');
  assert.deepEqual(crear.args.filter((a) => a.startsWith('--label=')),
    ['--label=orquesta', '--label=carril:investigacion', '--label=origen:hermes', '--label=necesita-ok']);
  assert.ok(crear.args.includes('--title=Comparar precios de Dapta y Lety'));
  assert.ok(!crear.args.some((a) => a.includes('Compará')), 'el cuerpo nunca va como argumento');
  assert.equal(leerPedido(crear.cuerpo).check, 'urls');
  const archivo = crear.args.find((a) => a.startsWith('--body-file=')).slice('--body-file='.length);
  assert.ok(!fs.existsSync(archivo), 'borra el archivo temporal');
  assert.match(f.llamadas[0].args[1], /^repos\/oninteligenciaartificial\/onia-hermes\/issues\?labels=origen%3Ahermes&state=all/);
});

test('tope alcanzado: no crea', async () => {
  const f = ghFalso({ lista: Array.from({ length: TOPE }, (_, i) => tarea(i)) });
  const r = await correr([], PEDIDO, f.gh);
  assert.equal(r.codigo, 75);
  assert.match(r.err, /tope 10/);
  assert.ok(!f.creo());
});

test('si no puede contar, no crea', async () => {
  for (const api of [{ code: 1, stdout: '', stderr: 'gh: Not logged in' }, { code: 0, stdout: 'no es json', stderr: '' },
    { code: 0, stdout: '{"message":"Bad credentials"}', stderr: '' }, { code: 0, stdout: '[{"number":1}]', stderr: '' }]) {
    const f = ghFalso({ api });
    const r = await correr([], PEDIDO, f.gh);
    assert.equal(r.codigo, 1, api.stdout);
    assert.match(r.err, /No pude contar/);
    assert.ok(!f.creo());
  }
});

test('la misma tarea en las últimas 24 h no se repite', async () => {
  const p = validarPedido(PEDIDO);
  const f = ghFalso({ lista: [tarea(20, { title: p.titulo, body: p.cuerpo.replace(/\n/g, '\r\n'), labels: [{ name: 'carril:investigacion' }] })] });
  const r = await correr([], PEDIDO, f.gh);
  assert.equal(r.codigo, 75);
  assert.match(r.err, /ya se cargó/);
  assert.ok(!f.creo());
});

test('--dry muestra título, labels y cuerpo sin llamar a gh', async () => {
  const f = ghFalso();
  const r = await correr(['--dry'], PEDIDO, f.gh);
  assert.equal(r.codigo, 0);
  assert.equal(f.llamadas.length, 0);
  assert.match(r.out, /Labels: orquesta, carril:investigacion, origen:hermes, necesita-ok/);
  assert.match(r.out, /Título: Comparar precios de Dapta y Lety/);
  assert.match(r.out, /nivel: normal\ncheck: urls\ndonde: nube/);
});

test('un pedido inválido no llama a gh; el cuerpo como argumento es uso (64)', async () => {
  const f = ghFalso();
  assert.equal((await correr([], con((t) => t.replace('check: urls', 'check: cmd npm test; x')), f.gh)).codigo, 65);
  assert.equal((await correr(['Hacé esto'], PEDIDO, f.gh)).codigo, 64);
  assert.equal((await correr(['--titulo'], PEDIDO, f.gh)).codigo, 64);
  assert.equal((await correr(['--titulo', 'a', '--titulo', 'b'], PEDIDO, f.gh)).codigo, 64);
  assert.equal((await correr([], '', f.gh)).codigo, 65);
  assert.equal(f.llamadas.length, 0);
});

test('gh falla al crear: no se cargó y lo dice; sin enlace: no se sabe', async () => {
  let r = await correr([], PEDIDO, ghFalso({ crear: { code: 1, stdout: '', stderr: "could not add label: 'necesita-ok' not found" } }).gh);
  assert.equal(r.codigo, 1);
  assert.match(r.err, /NO se cargó.*necesita-ok/);
  r = await correr([], PEDIDO, ghFalso({ crear: { code: 0, stdout: 'raro', stderr: '' } }).gh);
  assert.equal(r.codigo, 1);
  assert.match(r.err, /Puede haberse cargado/);
});

test('si el issue queda sin necesita-ok, lo cierra; si no puede confirmarlo, avisa', async () => {
  const sinOk = { code: 0, stdout: JSON.stringify({ labels: [{ name: 'orquesta' }, { name: 'carril:investigacion' }, { name: 'origen:hermes' }] }), stderr: '' };
  let f = ghFalso({ ver: sinOk });
  let r = await correr([], PEDIDO, f.gh);
  assert.equal(r.codigo, 1);
  assert.match(r.err, /la cerré/);
  assert.deepEqual(f.llamadas.at(-1).args, ['issue', 'close', '321', `--repo=${REPO}`, '--reason=not planned']);
  f = ghFalso({ ver: sinOk, cerrar: { code: 1, stdout: '', stderr: 'x' } });
  r = await correr([], PEDIDO, f.gh);
  assert.match(r.err, /SIN «necesita-ok» y no la pude cerrar/);
  r = await correr([], PEDIDO, ghFalso({ ver: { code: 1, stdout: '', stderr: 'x' } }).gh);
  assert.equal(r.codigo, 1);
  assert.match(r.err, /no pude confirmar sus labels/);
});

test('la línea de comandos real: --dry por la entrada estándar y por --archivo, sin red', () => {
  const salida = execFileSync(process.execPath, [SCRIPT, '--dry'], { input: PEDIDO, encoding: 'utf8' });
  assert.match(salida, /Título: Comparar precios de Dapta y Lety/);
  assert.match(salida, /Compará los planes/, 'las tildes llegan enteras');
  const archivo = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cargar-issue-test-')), 'pedido.txt');
  try {
    fs.writeFileSync(archivo, `\uFEFF${PEDIDO}`, 'utf8');
    assert.match(execFileSync(process.execPath, [SCRIPT, '--archivo', archivo, '--dry'], { encoding: 'utf8' }), /necesita-ok/);
  } finally {
    fs.rmSync(path.dirname(archivo), { recursive: true, force: true });
  }
  const mal = spawnSync(process.execPath, [SCRIPT, '--dry'], { input: con((t) => t.replace('check: urls', 'check: cmd npm test && x')), encoding: 'utf8' });
  assert.equal(mal.status, 65);
  assert.match(mal.stderr, /^check:/);
});

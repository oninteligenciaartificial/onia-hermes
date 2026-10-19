import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONF, leerPedido, elegirTareas, rutear, rutaSalida, revisarSalida, urlsDe, argsAgente,
  baseDe, motivoAnterior, armarPrompt, leerVeredicto, PROTEGIDAS,
} from './orquesta.mjs';

const issue = (number, carril, extra = {}) => ({
  number, title: `t${number}`, body: '', createdAt: `2026-10-18T0${number}:00:00Z`,
  author: { login: 'oninteligenciaartificial' }, labels: [{ name: 'orquesta' }, { name: `carril:${carril}` }], ...extra,
});

test('leerPedido separa los campos del pedido', () => {
  const p = leerPedido('\nnivel: profundo\nmotor: codex\ncheck: urls\n\nHacé X.\nHecho cuando: Y');
  assert.equal(p.nivel, 'profundo');
  assert.equal(p.motor, 'codex');
  assert.equal(p.check, 'urls');
  assert.equal(p.pedido, 'Hacé X.\nHecho cuando: Y');
  assert.deepEqual(leerPedido('Solo texto'), { pedido: 'Solo texto' });
});

test('elegirTareas: la más vieja por carril, sin frenadas ni autores ajenos', () => {
  const lista = [
    issue(3, 'marca'), issue(1, 'marca'), issue(2, 'video', { labels: [{ name: 'carril:video' }, { name: 'en-curso' }] }),
    issue(4, 'investigacion', { author: { login: 'extrano' } }), issue(5, 'inventado'), issue(6, 'plataforma'),
  ];
  const elegidas = elegirTareas(lista).map((t) => `${t.carril}#${t.issue.number}`).sort();
  assert.deepEqual(elegidas, ['marca#1', 'plataforma#6']);
  assert.deepEqual(elegirTareas(lista, CONF, 'plataforma').map((t) => t.issue.number), [6]);
});

test('rutear: nivel y motor eligen el modelo de la tabla', () => {
  assert.deepEqual(rutear('marca', {}), { motor: 'claude', nivel: 'normal', modelo: 'claude-sonnet-5-5' });
  assert.equal(rutear('marca', { nivel: 'profundo' }).modelo, 'claude-opus-5-5');
  assert.equal(rutear('plataforma', { nivel: 'rapido' }).modelo, 'gpt-6-luna');
  assert.equal(rutear('marca', { motor: 'codex' }).modelo, 'gpt-6.1-sol');
  assert.equal(rutear('video', { nivel: 'raro', modelo: 'opus' }).modelo, 'opus');
});

test('rutaSalida no deja escribir fuera del worktree', () => {
  const c = CONF.carriles.marca;
  assert.equal(rutaSalida(c, {}, 7), 'hermes-content/docs/orquesta/marca/7.md');
  assert.throws(() => rutaSalida(c, { salida: '../x.md' }, 7));
  assert.throws(() => rutaSalida(c, { salida: 'C:/x.md' }, 7));
});

test('revisarSalida exige archivo, largo y que no diga BLOQUEADO', () => {
  assert.match(revisarSalida(null), /no escribió/);
  assert.match(revisarSalida('corto'), /corta/);
  assert.match(revisarSalida(`BLOQUEADO: falta el video\n${'x'.repeat(400)}`), /^BLOQUEADO: falta el video/);
  assert.equal(revisarSalida('x'.repeat(400)), null);
});

test('urlsDe saca enlaces únicos sin la puntuación final', () => {
  assert.deepEqual(urlsDe('ver https://a.com/x. y (https://b.org/y) y https://a.com/x'), ['https://a.com/x', 'https://b.org/y']);
});

test('argsAgente: codex con sandbox, claude con herramientas acotadas', () => {
  const cx = argsAgente({ motor: 'codex', modelo: 'gpt-6.1-sol' }, 'plataforma', 'W', 'U');
  assert.ok(cx.includes('workspace-write') && cx.at(-1) === '-');
  const cl = argsAgente({ motor: 'claude', modelo: 'claude-sonnet-5-5' }, 'video', 'W', 'U');
  assert.ok(cl.includes('acceptEdits') && cl.includes('Bash(ffmpeg *)') && cl.includes('C:/Users/PC/Videos/ONIA-brutos'));
  assert.ok(!cl.includes('bypassPermissions'));
});

test('baseDe: rama del pedido o la del carril, sin refs raras', () => {
  const c = CONF.carriles.plataforma;
  assert.equal(baseDe(c, {}), 'master');
  assert.equal(baseDe(c, { base: 'codex/web-guiada-dental' }), 'codex/web-guiada-dental');
  assert.throws(() => baseDe(c, { base: '--upload-pack=x' }));
  assert.throws(() => baseDe(c, { base: 'a/../b' }));
});

test('el motivo del último rechazo vuelve al prompt', () => {
  const it = issue(9, 'marca', { comments: [
    { body: '⛔ No se cerró (x)\n\nMotivo: viejo' }, { body: 'comentario suelto' },
    { body: '⛔ No se cerró (y)\n\nMotivo: el revisor lo rechazó: inventa precios' },
  ] });
  assert.equal(motivoAnterior(it), 'el revisor lo rechazó: inventa precios');
  assert.equal(motivoAnterior(issue(9, 'marca')), null);
  const p = armarPrompt({ carril: 'marca', issue: it, pedido: { pedido: 'X' }, salida: 's.md', rama: 'r' });
  assert.match(p, /INTENTO ANTERIOR RECHAZADO: el revisor lo rechazó: inventa precios/);
  assert.doesNotMatch(armarPrompt({ carril: 'marca', issue: issue(9, 'marca'), pedido: { pedido: 'X' }, salida: 's.md', rama: 'r' }), /INTENTO ANTERIOR/);
});

test('leerVeredicto: solo APROBADO explícito aprueba', () => {
  assert.deepEqual(leerVeredicto(JSON.stringify({ result: '**APROBADO**\n- bien' })), { ok: true, notas: '- bien' });
  assert.deepEqual(leerVeredicto('RECHAZADO: inventa una cifra\n- x'), { ok: false, motivo: 'inventa una cifra' });
  assert.equal(leerVeredicto(JSON.stringify({ result: 'Creo que está bien' })).ok, false);
  assert.equal(leerVeredicto('').ok, false);
});

test('APROBADO con reservas no aprueba', () => {
  assert.equal(leerVeredicto('APROBADO: no cumple el hecho cuando').ok, false);
  assert.equal(leerVeredicto('APROBADO CON RESERVAS').ok, false);
  assert.equal(leerVeredicto('Aprobado.\n- ok').ok, true);
});

test('PROTEGIDAS: workflows y hooks no los cambia un trabajador', () => {
  for (const r of ['.github/workflows/x.yml', '.githooks/pre-push', '.husky/pre-commit']) assert.ok(PROTEGIDAS.test(r), r);
  for (const r of ['docs/.github.md', 'hermes-content/docs/orquesta/marca/1.md', 'lib/x.ts']) assert.ok(!PROTEGIDAS.test(r), r);
});

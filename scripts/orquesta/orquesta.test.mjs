import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONF, leerPedido, elegirTareas, rutear, rutaSalida, revisarSalida, urlsDe, argsAgente,
  baseDe, motivoAnterior, armarPrompt, leerVeredicto, PROTEGIDAS, armarCuartito,
  leerHilo, esOk, decidirRespuesta, cuerpoCierre, firmar,
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
  for (const r of ['.env', 'apps/web/.env.local', 'certs/a.pem', 'x/id_ed25519', 'gcp/credentials.json']) assert.ok(PROTEGIDAS.test(r), r);
  for (const r of ['docs/.github.md', 'hermes-content/docs/orquesta/marca/1.md', 'lib/x.ts', 'docs/environment.md']) assert.ok(!PROTEGIDAS.test(r), r);
});

test('cada carril tiene su cuartito y el prompt lo nombra', () => {
  for (const [nombre, c] of Object.entries(CONF.carriles)) assert.ok(c.leer?.length >= 3, nombre);
  const p = armarPrompt({ carril: 'video', issue: issue(1, 'video'), pedido: { pedido: 'X' }, salida: 's.md', rama: 'r' });
  assert.match(p, /TU CUARTITO.*edicion-referentes/s);
  assert.match(p, /agregalo con la fecha a \.claude\/skills\/editor-videos\/SKILL\.md/);
  assert.doesNotMatch(armarCuartito(CONF.carriles.comunidad), /agregalo/);
  assert.equal(armarCuartito({}), '');
});

const hilo = (...bodies) => bodies.map((body) => ({ body }));

test('leerHilo separa lo de Sergio Urcullo de lo del orquestador', () => {
  const h = leerHilo(issue(1, 'marca', { comments: hilo('⛔ No se cerró\n\nMotivo: a', 'cambiá el color', '⛔ No se cerró\n\nMotivo: b') }));
  assert.deepEqual(h.indicaciones, ['cambiá el color']);
  assert.equal(h.fallasSeguidas, 1); // la indicación reinicia la cuenta
  assert.equal(h.motivo, 'b');
  assert.equal(h.respuesta, null); // lo último es del orquestador
  const tras = leerHilo(issue(1, 'marca', { comments: hilo('vieja', '👀 Listo para tu OK', 'ok') }));
  assert.deepEqual(tras.indicaciones, ['ok']);
  assert.equal(tras.respuesta, 'ok');
});

test('esOk: aprueba solo un mensaje hecho de palabras de aprobación', () => {
  for (const t of ['ok', 'Sí, me gustó, continúa', 'dale 👍', 'listo', 'Perfecto!']) assert.ok(esOk(t), t);
  for (const t of ['ok pero cambiá el título', 'no me gustó', 'Sin el logo, por favor', 'Simplificá el texto',
    'Me gusta, agregá el precio', '']) assert.ok(!esOk(t), t);
});

test('un comentario de Sergio Urcullo que empieza con emoji sigue siendo suyo', () => {
  const it = issue(6, 'marca', { labels: [{ name: 'espera-ok' }], comments: hilo(firmar(0, '👀 Listo para tu OK'), '✅ dale') });
  assert.equal(leerHilo(it).respuesta, '✅ dale');
  assert.equal(decidirRespuesta(it), 'seguir'); // «✅ dale» no es solo palabras de aprobación: sigue, no se pierde
});

test('lo que Sergio Urcullo escribe mientras la tarea trabaja cuenta como respuesta', () => {
  // vio 1 comentario al empezar; Sergio escribió durante la corrida; después llegó la entrega
  const it = issue(7, 'marca', { labels: [{ name: 'espera-ok' }], comments: hilo('pedido extra', 'usá fondo blanco', firmar(1, '👀 Listo para tu OK')) });
  assert.equal(leerHilo(it).respuesta, 'usá fondo blanco');
  assert.deepEqual(leerHilo(it).indicaciones, ['usá fondo blanco']);
  assert.equal(decidirRespuesta(it), 'seguir');
});

test('decidirRespuesta: ok cierra, otra cosa sigue, sin respuesta nada', () => {
  const espera = (txt) => issue(1, 'marca', { labels: [{ name: 'orquesta' }, { name: 'carril:marca' }, { name: 'espera-ok' }], comments: hilo('👀 Listo para tu OK', ...(txt ? [txt] : [])) });
  assert.equal(decidirRespuesta(espera('dale, me gustó')), 'cerrar');
  assert.equal(decidirRespuesta(espera('hacé el título más corto')), 'seguir');
  assert.equal(decidirRespuesta(espera(null)), null);
  const frenada = issue(2, 'marca', { labels: [{ name: 'bloqueada' }], comments: hilo('⛔ No se cerró\n\nMotivo: x', 'usá la foto 3') });
  assert.equal(decidirRespuesta(frenada), 'seguir');
  assert.equal(decidirRespuesta(issue(3, 'marca', { comments: hilo('⛔ x', 'hola') })), null); // sin label frenado no hay nada que destrabar
});

test('cuerpoCierre: una falla reintenta, dos frenan; espera-ok muestra capturas', () => {
  const base = { motor: 'claude', modelo: 'm', minutos: 3 };
  assert.equal(cuerpoCierre({ ...base, ok: false, falla: 'x' }, 0).bloquea, false);
  assert.equal(cuerpoCierre({ ...base, ok: false, falla: 'x' }, 1).bloquea, true);
  const ok = cuerpoCierre({ ...base, ok: true, esperaOk: true, pr: 'P', salida: 's', capturas: ['https://g/x.png?raw=true'] }, 0);
  assert.match(ok.cuerpo, /^<!-- orquesta vistos:0 -->\n👀 Listo para tu OK/);
  assert.match(ok.cuerpo, /!\[captura\]\(https:\/\/g\/x\.png\?raw=true\)/);
});

test('espera-ok frena la tarea y el prompt lleva indicaciones y continuidad', () => {
  const it = issue(4, 'marca', { labels: [{ name: 'orquesta' }, { name: 'carril:marca' }, { name: 'espera-ok' }] });
  assert.deepEqual(elegirTareas([it]), []);
  const p = armarPrompt({ carril: 'marca', issue: issue(5, 'marca', { comments: hilo('👀 Listo', 'más corto') }), pedido: { pedido: 'X', ok: 'sergio' }, salida: 'a/b/5.md', rama: 'r', sigue: true });
  assert.match(p, /YA HAY TRABAJO HECHO/);
  assert.match(p, /INDICACIONES DE SERGIO URCULLO[^]*- más corto/);
  assert.match(p, /a\/b\/5-390\.png/);
});

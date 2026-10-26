import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as o from './orquesta.mjs';

function paquete(t) {
  const wt = fs.mkdtempSync(path.join(os.tmpdir(), 'orquesta-evidencias-'));
  t.after(() => fs.rmSync(wt, { recursive: true, force: true }));
  const preview = path.join(wt, 'preview.mp4');
  // Artefacto de prueba generado localmente, no video de clientes ni API pagada.
  execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=blue:s=32x32:d=0.2', '-an', '-c:v', 'mpeg4', preview], { timeout: 15000 });
  const datos = fs.readFileSync(preview);
  const manifest = { version: 1, archivos: [{ ruta: 'preview.mp4', bytes: datos.length, sha256: createHash('sha256').update(datos).digest('hex') }] };
  const escribir = () => fs.writeFileSync(path.join(wt, 'salida.md.evidencias.json'), JSON.stringify(manifest));
  escribir();
  return { wt, manifest, escribir };
}

test('revisión solicita paquete dentro del worktree y no afirma haber visto video', () => {
  const prompt = o.armarPrompt({ carril: 'video', issue: { number: 1, title: 'fixture' }, pedido: { pedido: 'X' }, salida: 's.md', rama: 'fixture' });
  assert.match(prompt, /s\.md\.evidencias\.json/);
  const rev = o.armarRevision({ issue: { number: 1 }, pedido: { pedido: 'X' }, salida: 's.md', cambios: 'preview.mp4', evidencias: { archivos: [{ ruta: 'preview.mp4' }] } });
  assert.match(rev, /no.*has visto.*video/i);
});

test('paquete valida hash, tamaño y ffprobe real sin dar --add-dir al revisor', (t) => {
  const { wt } = paquete(t);
  const resultado = o.verificarEvidencias(wt, 'salida.md');
  assert.equal(resultado.falla, null);
  assert.ok(resultado.archivos[0].sonda.streams.some((s) => s.codec_type === 'video'));
  const args = o.argsRevision('revisor');
  assert.ok(args.includes('--restricted'));
  assert.ok(!args.includes('--add-dir'));
  assert.ok(args.includes('Read,Grep,Glob'));
});

test('paquete ausente, alterado, traversal o no multimedia no acredita evidencia', (t) => {
  const { wt, manifest, escribir } = paquete(t);
  manifest.archivos[0].sha256 = '0'.repeat(64); escribir();
  assert.match(o.verificarEvidencias(wt, 'salida.md').falla, /hash|integridad/);
  manifest.archivos[0].ruta = '../preview.mp4'; escribir();
  assert.match(o.verificarEvidencias(wt, 'salida.md').falla, /ruta/);
  fs.rmSync(path.join(wt, 'salida.md.evidencias.json'));
  assert.match(o.verificarEvidencias(wt, 'salida.md').falla, /paquete/);
});

test('paquete con archivo que no es video no pasa ffprobe aunque el hash sea correcto', (t) => {
  const { wt, manifest, escribir } = paquete(t);
  const datos = Buffer.from('no soy video');
  fs.writeFileSync(path.join(wt, 'preview.mp4'), datos);
  manifest.archivos[0].bytes = datos.length;
  manifest.archivos[0].sha256 = createHash('sha256').update(datos).digest('hex'); escribir();
  assert.match(o.verificarEvidencias(wt, 'salida.md').falla, /ffprobe|video/);
});

test('evidencias no incluyen archivos de instrucciones o tipos ajenos a media', (t) => {
  const { wt, manifest, escribir } = paquete(t);
  fs.writeFileSync(path.join(wt, 'AGENTS.md'), 'fixture de instrucciones');
  const datos = fs.readFileSync(path.join(wt, 'AGENTS.md'));
  manifest.archivos.push({ ruta: 'AGENTS.md', bytes: datos.length, sha256: createHash('sha256').update(datos).digest('hex') }); escribir();
  assert.match(o.verificarEvidencias(wt, 'salida.md').falla, /tipo.*evidencia/);
});

test('paquete rechaza un enlace de directorio intermedio aunque termine dentro del worktree', (t) => {
  const { wt, manifest, escribir } = paquete(t);
  fs.mkdirSync(path.join(wt, 'real'));
  fs.renameSync(path.join(wt, 'preview.mp4'), path.join(wt, 'real', 'preview.mp4'));
  fs.symlinkSync(path.join(wt, 'real'), path.join(wt, 'alias'), 'junction');
  manifest.archivos[0].ruta = 'alias/preview.mp4'; escribir();
  assert.ok(o.verificarEvidencias(wt, 'salida.md').falla, 'no se admite ningún componente de ruta que sea enlace');
});

test('evidencia se contrasta contra el commit inmutable, no un preview cambiado después de revisar', (t) => {
  const { wt } = paquete(t);
  assert.equal(typeof o.verificarEvidenciasCommit, 'function', 'la publicación necesita comprobar el snapshot real');
  const evidencia = o.verificarEvidencias(wt, 'salida.md');
  const original = fs.readFileSync(path.join(wt, 'preview.mp4'));
  const g = (...args) => execFileSync('git', ['-C', wt, '-c', `core.hooksPath=${os.devNull}`,
    '-c', 'user.name=fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8' }).trim();
  g('init', '-q', '-b', 'main'); g('add', '.'); g('commit', '-qm', 'snapshot fixture');
  const bueno = g('rev-parse', 'HEAD');
  assert.equal(o.verificarEvidenciasCommit(wt, bueno, evidencia).falla, null);
  fs.writeFileSync(path.join(wt, 'preview.mp4'), 'cambio posterior a la revisión');
  g('add', '.'); g('commit', '-qm', 'mutacion fixture');
  const alterado = g('rev-parse', 'HEAD');
  assert.match(o.verificarEvidenciasCommit(wt, alterado, evidencia).falla, /integridad/);
  assert.equal(o.verificarEvidenciasCommit(wt, bueno, evidencia).falla, null, 'HEAD/worktree mutable no sustituye al commit revisado');
  fs.writeFileSync(path.join(wt, 'preview.mp4'), original);
  const manifest = JSON.parse(fs.readFileSync(path.join(wt, 'salida.md.evidencias.json'), 'utf8'));
  fs.writeFileSync(path.join(wt, 'salida.md.evidencias.json'), JSON.stringify(manifest, null, 2).replace(/\n/g, '\r\n') + '\r\n');
  g('add', '.'); g('commit', '-qm', 'formato CRLF fixture');
  assert.equal(o.verificarEvidenciasCommit(wt, g('rev-parse', 'HEAD'), evidencia).falla, null, 'formato y autocrlf no cambian el contrato JSON');
  manifest.version = 2;
  fs.writeFileSync(path.join(wt, 'salida.md.evidencias.json'), JSON.stringify(manifest));
  g('add', '.'); g('commit', '-qm', 'manifest cambiado fixture');
  assert.match(o.verificarEvidenciasCommit(wt, g('rev-parse', 'HEAD'), evidencia).falla, /integridad/);
  manifest.version = 1;
  fs.writeFileSync(path.join(wt, 'salida.md.evidencias.json'), JSON.stringify(manifest) + ' '.repeat(65537));
  g('add', '.'); g('commit', '-qm', 'manifest sobredimensionado fixture');
  assert.ok(o.verificarEvidenciasCommit(wt, g('rev-parse', 'HEAD'), evidencia).falla, 'normalizar JSON no elimina el límite de 64 KiB');
  assert.ok(o.verificarEvidenciasCommit(wt, 'HEAD', evidencia).falla, 'no aceptar referencias mutables como identidad de snapshot');
  const remoto = path.join(wt, 'remoto.git');
  g('init', '--bare', '-q', remoto);
  g('remote', 'add', 'origin', remoto);
  g('push', '--force-with-lease', 'origin', `${bueno}:refs/heads/orquesta/fixture`);
  assert.equal(g('--git-dir', remoto, 'rev-parse', 'refs/heads/orquesta/fixture'), bueno, 'refspec publica el SHA capturado, no HEAD posterior');
});

#!/usr/bin/env node
// Chequeo minimo del render de escenas con la respuesta del MCP MOCKEADA
// (mismos campos que la corrida real DcMW3Coi6BN del 2026-08-19).
//   node scripts/video-scenes.test.mjs
import assert from 'node:assert';
import { renderEscenas, fmtTiempo } from './video-scenes.mjs';

// fmtTiempo: segundos, string ya formateado, basura
assert.equal(fmtTiempo(0), '0:00');
assert.equal(fmtTiempo(62.4), '1:02');
assert.equal(fmtTiempo('0:05'), '0:05');
assert.equal(fmtTiempo(undefined), '?');

const mock = {
  status: 'completed',
  scenes: [
    {
      timestamp_start: 0, timestamp_end: 2, shot_type: 'Wide', label: 'Opening Hook',
      visual_description: 'auto rojo | fondo blanco', audio_description: 'musica electronica',
    },
    {
      timestamp_start: '0:02', timestamp_end: '0:04', shot_type: 'Close-Up', label: 'Product Information',
      visual_description: 'burbuja verde entra', audio_description: 'ping',
    },
  ],
};
const md = renderEscenas('TEST123', mock, {
  dur: 47, analyzeId: 'abc-123', balanceAntes: '2567.78', balanceDespues: '2567.78', fecha: '2026-08-20',
});
assert(md.includes('# TEST123 — análisis escena por escena'));
assert(md.includes('| 1 | 0:00–0:02 | Opening Hook | Wide | auto rojo \\| fondo blanco | musica electronica |'), 'fila 1 (pipe escapado)');
assert(md.includes('| 2 | 0:02–0:04 |'), 'timestamps ya formateados pasan tal cual');
assert(md.includes('2 escenas, 47 s'));
assert(md.includes('creditos 2567.78 antes / 2567.78 despues'));
assert(md.includes('`video_analyze_id: abc-123`'));

// sin escenas -> error, nunca un md vacio
assert.throws(() => renderEscenas('X', { status: 'completed', scenes: [] }));
assert.throws(() => renderEscenas('X', {}));

console.log('ok: renderEscenas + fmtTiempo');

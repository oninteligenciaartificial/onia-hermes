// Casos del ENVOLTORIO del rescate del mensaje perdido
// (`hermes-content/deploy/vps-ops/onia-rescate-mensaje-perdido.sh`).
//
// POR QUE ESTE TEST EXISTE, medido el 2026-09-03: el testigo del rescate se arreglo en
// `2309fec87` (10:25 UTC, pusheado, 751/751 verde) y a las 11:04 el cron seguia corriendo la
// copia VIEJA del clon de `main` — 39 minutos y cuatro barridos con el arreglo ya en el repo.
// No fue un fallo del integrador: el envoltorio prueba `main` primero A PROPOSITO (correr
// codigo de carril sin revisar en produccion seria peor), pero **elegia en silencio**. Su log
// decia `usando <path>` y nunca que existiera otro candidato distinto.
//
// Lo que se prueba aca es el artefacto REAL: se ejecuta el `.sh` con candidatos de mentira y
// se lee lo que escribe. No una funcion pura que el `.sh` podria no estar usando.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, chmodSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SH = join(RAIZ, 'hermes-content/deploy/vps-ops/onia-rescate-mensaje-perdido.sh');

/** Un entorno de prueba: candidatos de mentira, telegram de mentira, estado en /tmp. */
function armar({ candidatos, umbralS = 7200 }) {
  const dir = mkdtempSync(join(tmpdir(), 'rescate-envoltorio-'));
  const tg = join(dir, 'tg.sh');
  const tgLog = join(dir, 'tg.log');
  // la ruta va entre comillas: en Windows trae \ y sh se las come (dejaba C:Users...tg.log sueltos en el cwd)
  writeFileSync(tg, `#!/bin/sh\nprintf '%s\\n' "$1" >> '${tgLog}'\n`);
  chmodSync(tg, 0o755);

  const rutas = candidatos.map((c, i) => {
    const ruta = join(dir, `cand${i}.mjs`);
    if (c.contenido !== null) {
      writeFileSync(ruta, `console.log(${JSON.stringify(c.contenido)});\n`);
      if (c.mtime) utimesSync(ruta, c.mtime, c.mtime);
    }
    return ruta;
  });

  return {
    dir,
    rutas,
    tgLog,
    estado: join(dir, 'estado'),
    correr(extraEnv = {}) {
      let stdout = '';
      let code = 0;
      try {
        stdout = execFileSync('bash', [SH], {
          encoding: 'utf8',
          env: {
            ...process.env,
            ONIA_RESCATE_CANDIDATOS: rutas.join(':'),
            ONIA_RESCATE_ESTADO: join(dir, 'estado'),
            ONIA_RESCATE_UMBRAL_S: String(umbralS),
            ONIA_TG_BIN: tg,
            ...extraEnv,
          },
        });
      } catch (e) {
        stdout = (e.stdout || '') + (e.stderr || '');
        code = e.status;
      }
      return { stdout, code, tg: existsSync(tgLog) ? readFileSync(tgLog, 'utf8') : '' };
    },
  };
}

test('con dos candidatos IGUALES corre el primero y no dice nada de diferencias', () => {
  const t = armar({ candidatos: [{ contenido: 'A' }, { contenido: 'A' }] });
  const { stdout, code } = t.correr();
  assert.equal(code, 0);
  assert.match(stdout, /usando .*cand0\.mjs/);
  assert.equal(/DIFERENTE/.test(stdout), false, 'no hay diferencia que avisar');
});

test('EL CASO DE HOY: candidatos DISTINTOS — sigue corriendo el de main, pero LO DICE', () => {
  // cand1 (el del carril) es mas nuevo: es el arreglo que todavia no se mergeo.
  const t = armar({
    candidatos: [
      { contenido: 'VIEJA', mtime: new Date('2026-09-02T10:00:00Z') },
      { contenido: 'NUEVA', mtime: new Date('2026-09-03T10:25:00Z') },
    ],
  });
  const { stdout, code } = t.correr();
  assert.equal(code, 0);
  // sigue corriendo el primero: dar vuelta el orden pondria codigo sin revisar en produccion
  assert.match(stdout, /VIEJA/);
  assert.equal(/NUEVA/.test(stdout), false);
  // ...pero deja de ser mudo
  assert.match(stdout, /DIFERENTE/);
  assert.match(stdout, /cand1\.mjs/, 'nombra al candidato que quedo afuera');
  assert.match(stdout, /MAS NUEVO/, 'dice que el que quedo afuera es el mas nuevo');
});

test('si el que quedo afuera es MAS VIEJO, lo dice pero no lo trata como arreglo varado', () => {
  const t = armar({
    candidatos: [
      { contenido: 'NUEVA', mtime: new Date('2026-09-03T10:25:00Z') },
      { contenido: 'VIEJA', mtime: new Date('2026-09-02T10:00:00Z') },
    ],
  });
  const { stdout } = t.correr();
  assert.match(stdout, /DIFERENTE/);
  assert.equal(/MAS NUEVO/.test(stdout), false, 'un worktree atrasado es inofensivo');
});

test('un solo candidato: no hay con que comparar, no inventa una diferencia', () => {
  const t = armar({ candidatos: [{ contenido: 'A' }, { contenido: null }] });
  const { stdout, code } = t.correr();
  assert.equal(code, 0);
  assert.match(stdout, /usando .*cand0\.mjs/);
  assert.equal(/DIFERENTE/.test(stdout), false);
});

test('sin ningun candidato: falla fuerte y avisa por Telegram (no se pierde en el log)', () => {
  const t = armar({ candidatos: [{ contenido: null }, { contenido: null }] });
  const { stdout, code, tg } = t.correr();
  assert.equal(code, 1);
  assert.match(stdout, /FALLO/);
  assert.match(tg, /Rescate/);
});

test('la divergencia RECIEN nacida no avisa: el integrador mergea cada hora', () => {
  const t = armar({
    candidatos: [
      { contenido: 'VIEJA', mtime: new Date('2026-09-02T10:00:00Z') },
      { contenido: 'NUEVA', mtime: new Date('2026-09-03T10:25:00Z') },
    ],
  });
  const { stdout, tg } = t.correr();
  assert.match(stdout, /DIFERENTE/);
  assert.equal(tg, '', 'avisar a los 10 min de cada commit del carril es el vigia que grita mal');
});

test('la divergencia que PERSISTE avisa UNA vez, no en cada barrido', () => {
  const t = armar({
    candidatos: [
      { contenido: 'VIEJA', mtime: new Date('2026-09-02T10:00:00Z') },
      { contenido: 'NUEVA', mtime: new Date('2026-09-03T10:25:00Z') },
    ],
    umbralS: 0, // ya vencido en la primera corrida
  });
  t.correr();
  const primera = readFileSync(t.tgLog, 'utf8').trim().split('\n').length;
  assert.equal(primera, 1, 'aviso una vez');
  t.correr();
  t.correr();
  const despues = readFileSync(t.tgLog, 'utf8').trim().split('\n').length;
  assert.equal(despues, 1, 'seis barridos por hora con la misma alarma es ruido, no vigilancia');
});

test('cuando el integrador mergea y convergen, el estado se limpia y puede volver a avisar', () => {
  const t = armar({
    candidatos: [
      { contenido: 'VIEJA', mtime: new Date('2026-09-02T10:00:00Z') },
      { contenido: 'NUEVA', mtime: new Date('2026-09-03T10:25:00Z') },
    ],
    umbralS: 0,
  });
  t.correr();
  assert.equal(existsSync(t.estado), true, 'mientras difieren hay estado');
  // el integrador mergea: los dos archivos quedan iguales
  writeFileSync(t.rutas[1], readFileSync(t.rutas[0]));
  const { stdout } = t.correr();
  assert.equal(/DIFERENTE/.test(stdout), false);
  assert.equal(existsSync(t.estado), false, 'converger BORRA el estado: la proxima alarma es nueva');
});

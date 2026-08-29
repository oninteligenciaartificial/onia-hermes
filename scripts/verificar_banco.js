#!/usr/bin/env node
/**
 * Verifica que lo que el LEEME de un banco NOMBRA sea lo que el repo TIENE.
 *
 * Nace del 2026-08-29: `references/modelos/.gitignore` ignora `*.png` a proposito —los
 * originales pesados quedan locales y los JPG son los assets usables— y yo guarde G01..G05
 * SOLO como PNG. El LEEME documentaba cinco piezas y NINGUNA estaba versionada. En esta
 * maquina todo daba verde; en un clon limpio el banco entero no existia. El falso verde mas
 * caro es el que pasa donde se prueba y falla donde se usa.
 *
 * La regla que codifica, que es la convencion del repo, no una invencion:
 *   - `.jpg` y `.mp4` nombrados en el LEEME -> tienen que EXISTIR y estar TRACKEADOS.
 *   - `.png` nombrados -> tienen que existir en disco, y NO se exige que esten en git.
 *     Si uno aparece trackeado, se avisa: contradice el .gitignore y engorda el repo.
 *
 * Un intento anterior de este chequeo marcaba los cinco PNG como error. Estaba mal el
 * chequeo, no el repo — y un guardian que grita por lo que esta bien deja de leerse.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');

function trackeados(dir) {
  try {
    return new Set(
      execFileSync('git', ['ls-files', dir], { cwd: RAIZ, encoding: 'utf8' })
        .split('\n').map((s) => s.trim()).filter(Boolean),
    );
  } catch { return new Set(); }
}

/** Revisa un LEEME y devuelve los problemas. `dirRel` es relativo a la raiz del repo. */
function revisarBanco(dirRel, baseDir = RAIZ) {
  const leeme = path.join(baseDir, dirRel, 'LEEME.md');
  if (!fs.existsSync(leeme)) return [{ nivel: 'error', msg: `${dirRel} no tiene LEEME.md` }];

  const nombres = [...new Set(
    (fs.readFileSync(leeme, 'utf8').match(/`([A-Za-z0-9_.-]+\.(?:png|jpg|jpeg|mp4))`/g) || [])
      .map((s) => s.slice(1, -1)),
  )];

  const tr = trackeados(dirRel);
  const problemas = [];

  for (const n of nombres) {
    const rel = `${dirRel}/${n}`;
    const existe = fs.existsSync(path.join(baseDir, dirRel, n));
    const esOriginal = n.toLowerCase().endsWith('.png');

    if (!existe) {
      problemas.push({
        nivel: 'error', regla: 'archivo-inexistente',
        msg: `el LEEME nombra "${n}" y no esta en disco`,
      });
      continue;
    }
    if (esOriginal) {
      // El .gitignore los quiere locales. Solo molesta el caso inverso.
      if (tr.has(rel)) {
        problemas.push({
          nivel: 'aviso', regla: 'original-trackeado',
          msg: `"${n}" es un PNG original y esta en git: contradice references/modelos/.gitignore`,
        });
      }
      continue;
    }
    if (!tr.has(rel)) {
      problemas.push({
        nivel: 'error', regla: 'asset-no-versionado',
        msg: `"${n}" esta documentado y NO esta en git: un clon limpio no lo tiene`,
      });
    }
  }
  return problemas;
}

function selfCheck() {
  const assert = require('assert');
  const os = require('os');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'banco-'));
  const d = 'banco-falso';
  fs.mkdirSync(path.join(tmp, d), { recursive: true });

  // a) un JPG documentado que no existe en disco
  fs.writeFileSync(path.join(tmp, d, 'LEEME.md'), 'usa `A-falta.jpg` para todo');
  let p = revisarBanco(d, tmp);
  ok(p.some((x) => x.regla === 'archivo-inexistente'), 'un archivo nombrado que no esta se detecta');

  // b) un JPG que existe pero no esta versionado (tmp no es un repo: nada esta trackeado)
  fs.writeFileSync(path.join(tmp, d, 'B-existe.jpg'), 'x');
  fs.writeFileSync(path.join(tmp, d, 'LEEME.md'), 'usa `B-existe.jpg`');
  p = revisarBanco(d, tmp);
  ok(p.some((x) => x.regla === 'asset-no-versionado'), 'un jpg documentado sin versionar se detecta');

  // c) el PNG original NO se exige versionado: es la convencion, no un error
  fs.writeFileSync(path.join(tmp, d, 'C-original.png'), 'x');
  fs.writeFileSync(path.join(tmp, d, 'LEEME.md'), 'el original es `C-original.png`');
  p = revisarBanco(d, tmp);
  ok(p.length === 0, 'un PNG original sin versionar NO es problema');

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`self-check ok: ${casos} casos`);
}

if (require.main === module) {
  if (process.argv.includes('--self-check')) { selfCheck(); process.exit(0); }

  const bancos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const objetivo = bancos.length ? bancos
    : ['hermes-content/references/modelos/lucia/generadas-20260828'];

  let errores = 0;
  for (const b of objetivo) {
    const p = revisarBanco(b);
    for (const x of p) {
      console.log(`${x.nivel === 'error' ? 'ERROR' : 'aviso'} ${x.regla}: ${x.msg}`);
      if (x.nivel === 'error') errores += 1;
    }
    if (!p.length) console.log(`ok: ${b}`);
  }
  process.exit(errores ? 1 : 0);
}

module.exports = { revisarBanco };

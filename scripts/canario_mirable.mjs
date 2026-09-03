#!/usr/bin/env node
/**
 * Guard: ¿el canario puede MIRAR?
 *
 * La regla nº1 de `CLAUDE.md` es *"verificar es MIRAR, no suponer"*: toda pantalla que ve un
 * cliente se abre con Playwright + Chromium y se lee la captura. Ese "se abre" depende de dos
 * cosas que se versionan en lugares DISTINTOS y por eso derivan solas:
 *
 *   - la versión de Playwright, que sí está en `package.json` (`^1.62.1`);
 *   - el binario de Chromium, que NO está en el repo — vive en `~/.cache/ms-playwright/` y lo
 *     baja `npx playwright install`, una vez, a mano, en cada máquina.
 *
 * **Lo que costó (medido el 2026-09-02, `onia-cola`).** El worktree principal tenía Playwright
 * **1.62.1** instalado (pide `chromium-1234`) y el VPS sólo tenía bajado `chromium-1223`. O sea:
 * cualquier intento de mirar una pantalla desde `/root/loops/onia-hermes` moría con
 * `browserType.launch: Executable doesn't exist at .../chromium-1234/chrome-linux64/chrome`.
 * El canario seguía verde **por accidente**: su worktree no tiene `node_modules` propio, así que
 * resolvía al Playwright **1.60.0** de `/root/node_modules` — un paquete instalado a mano, fuera
 * del repo, que nadie versiona. Un `npm install` en ese worktree lo habría matado en silencio.
 *
 * Es el mismo modo de falla que `hermes-content/docs/cola/loops.md` ya documenta dos veces: algo
 * que corre bien porque hay una copia hand-editada en el VPS, y se cae el día que alguien
 * reinstala desde el repo. La diferencia es que acá la víctima es la verificación misma.
 *
 * **Por qué este gate LANZA el navegador en vez de comparar números de revisión.** Comparar la
 * revisión que pide `playwright-core` contra las carpetas de la caché es un proxy: acierta el
 * caso de ayer y falla el de mañana (permisos, biblioteca del sistema faltante, binario a medio
 * bajar). Lanzar y cerrar Chromium tarda ~1-2 s y no es un proxy: es exactamente lo que hace el
 * canario. Un `grep` sirve para descartar, nunca para confirmar.
 *
 * **Por qué NO sale rojo de fábrica** — el anti-patrón que este repo ya documenta tres veces, y
 * la razón por la que un gate se termina salteando. Si Playwright no está instalado, el canario
 * no es ejecutable de todos modos y eso es otro problema: el gate sale VERDE diciendo por qué se
 * saltó. Sólo se pone rojo en la condición real de deriva: **Playwright presente y su navegador
 * ausente.**
 *
 * Uso:
 *   node scripts/canario_mirable.mjs               # chequeo real (lanza y cierra Chromium)
 *   node scripts/canario_mirable.mjs --self-check  # sólo la lógica pura, sin navegador
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const CANARIO = join(AQUI, 'canario_visual.mjs');

/**
 * Qué canal de Chromium pide el canario, leído de SU fuente.
 *
 * Es el recíproco que evita que este gate envejezca en silencio: si mañana alguien saca el
 * `channel: 'chromium'` de `canario_visual.mjs`, este guard estaría probando un binario que el
 * canario ya no usa — verde mintiendo. Antes que eso, se pone rojo pidiendo que lo actualicen.
 *
 * Se busca sólo dentro de `opcionesDeChromium`, no en todo el archivo: la palabra `channel`
 * aparece también en los comentarios que explican por qué NO hay que sacarla.
 */
export function canalQuePideElCanario(fuente) {
  const cuerpo = fuente.match(/function opcionesDeChromium\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
  if (!cuerpo) return null;
  const m = cuerpo[1].match(/^\s*channel:\s*'([^']+)'/m);
  return m ? m[1] : null;
}

/**
 * ¿El error de `launch()` es "no bajaste el navegador" o es otra cosa?
 *
 * Importa distinguirlos porque el remedio es distinto y un gate que dice "algo falló" no lo
 * arregla nadie. Se compara contra el texto que Playwright emite (`Executable doesn't exist`),
 * que además viene acompañado del cartel que sugiere `npx playwright install`.
 */
export function claseDeFallo(mensaje) {
  const t = String(mensaje || '');
  if (/Executable doesn't exist/i.test(t) || /playwright install/i.test(t)) return 'navegador-no-instalado';
  return 'navegador-no-arranca';
}

/**
 * El veredicto, separado del mundo para poder probarlo en ROJO sin tener un VPS al lado.
 * `estado`: uno de `sin-playwright` | `canal-no-declarado` | `fallo` | `ok`.
 */
export function veredicto({ playwrightInstalado, canal, errorLanzamiento }) {
  if (!playwrightInstalado) {
    return {
      ok: true,
      estado: 'sin-playwright',
      mensaje: 'canario-mirable: SALTEADO — Playwright no está instalado acá (`npm install`). '
        + 'No es deriva: sin Playwright el canario no corre de todos modos.',
    };
  }
  if (!canal) {
    return {
      ok: false,
      estado: 'canal-no-declarado',
      mensaje: 'canario-mirable: ROJO — no encuentro `channel: \'...\'` dentro de '
        + '`opcionesDeChromium` en scripts/canario_visual.mjs. Este guard estaría probando un '
        + 'binario que el canario ya no usa. Actualizá el guard junto con el canario.',
    };
  }
  if (errorLanzamiento) {
    const clase = claseDeFallo(errorLanzamiento);
    const remedio = clase === 'navegador-no-instalado'
      ? 'Bajá el navegador de ESTA versión de Playwright: `npx playwright install chromium`.'
      : 'Chromium está bajado pero no arranca. Revisá el mensaje de arriba (sandbox, /dev/shm, librerías del sistema).';
    return {
      ok: false,
      estado: 'fallo',
      clase,
      mensaje: `canario-mirable: ROJO (${clase}) — el canal '${canal}' no pudo abrirse.\n`
        + `  ${String(errorLanzamiento).split('\n')[0]}\n  ${remedio}`,
    };
  }
  return { ok: true, estado: 'ok', mensaje: `canario-mirable: ok — el canal '${canal}' abre y cierra.` };
}

/** Las mismas opciones que usa el canario: como root, Chromium no arranca con su sandbox. */
export function opcionesDeLanzamiento(canal, esRoot) {
  return { channel: canal, ...(esRoot ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {}) };
}

// ─────────────────────────────────── self-check ───────────────────────────────────
if (process.argv.includes('--self-check')) {
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  // El recíproco, contra la fuente REAL: si esto se rompe, el guard dejó de aplicar.
  const fuenteReal = readFileSync(CANARIO, 'utf8');
  afirmar(canalQuePideElCanario(fuenteReal) === 'chromium',
    'el canario de HOY sigue pidiendo el Chromium completo (channel: chromium)');

  // Y que lo lea del CUERPO de la función, no de los comentarios que hablan de `channel`.
  afirmar(canalQuePideElCanario("function opcionesDeChromium(x) {\n  return {\n    channel: 'chromium',\n  };\n}") === 'chromium',
    'lee el canal declarado dentro de opcionesDeChromium');
  afirmar(canalQuePideElCanario("// channel: 'firefox' explica por que NO\nfunction otra() { return 1; }") === null,
    'un `channel` suelto en un comentario, sin la funcion, NO cuenta como declarado');

  // Los tres portantes, cada uno en ROJO por su mensaje exacto.
  const sinPw = veredicto({ playwrightInstalado: false, canal: 'chromium' });
  afirmar(sinPw.ok === true && sinPw.estado === 'sin-playwright', 'sin Playwright NO sale rojo de fabrica: saltea en verde');

  const sinCanal = veredicto({ playwrightInstalado: true, canal: null });
  afirmar(sinCanal.ok === false && sinCanal.estado === 'canal-no-declarado', 'si el canario deja de declarar canal, el guard se pone ROJO en vez de mentir verde');

  const noBajado = veredicto({
    playwrightInstalado: true, canal: 'chromium',
    errorLanzamiento: "browserType.launch: Executable doesn't exist at /root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome",
  });
  afirmar(noBajado.ok === false && noBajado.clase === 'navegador-no-instalado', 'el caso REAL del 2026-09-02 (revision no bajada) sale rojo');
  afirmar(noBajado.mensaje.includes('npx playwright install chromium'), 'y dice el remedio exacto, no "algo fallo"');

  // Que no confunda un fallo distinto con el de la revision faltante: el remedio seria erroneo.
  const otro = veredicto({ playwrightInstalado: true, canal: 'chromium', errorLanzamiento: 'Failed to launch: No usable sandbox!' });
  afirmar(otro.ok === false && otro.clase === 'navegador-no-arranca', 'un fallo de sandbox NO se diagnostica como "falta bajar el navegador"');
  afirmar(!otro.mensaje.includes('npx playwright install'), 'y por eso no manda a reinstalar al pedo');

  afirmar(veredicto({ playwrightInstalado: true, canal: 'chromium' }).ok === true, 'con todo en su lugar, verde');

  // Como root hay que sacar el sandbox, igual que el canario. Si esto se olvida, el guard
  // sale rojo en el VPS por una razon que NO es la deriva que existe para cazar.
  afirmar(opcionesDeLanzamiento('chromium', true).args.includes('--no-sandbox'), 'como root pide --no-sandbox, igual que el canario');
  afirmar(opcionesDeLanzamiento('chromium', false).args === undefined, 'fuera de root deja el sandbox puesto');

  console.log(process.exitCode ? 'self-check: FALLO' : `self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

// ─────────────────────────────────── chequeo real ───────────────────────────────────
let playwrightInstalado = true;
let chromium = null;
try {
  ({ chromium } = await import('playwright'));
} catch {
  playwrightInstalado = false;
}

const canal = existsSync(CANARIO) ? canalQuePideElCanario(readFileSync(CANARIO, 'utf8')) : null;

let errorLanzamiento = null;
if (playwrightInstalado && canal) {
  const esRoot = typeof process.getuid === 'function' && process.getuid() === 0;
  try {
    const b = await chromium.launch(opcionesDeLanzamiento(canal, esRoot));
    await b.close();
  } catch (e) {
    errorLanzamiento = e.message;
  }
}

const v = veredicto({ playwrightInstalado, canal, errorLanzamiento });
console.log(v.mensaje);
process.exit(v.ok ? 0 : 1);

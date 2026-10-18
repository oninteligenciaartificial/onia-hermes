#!/usr/bin/env node
/**
 * Auto-sync del repo a GitHub. Sincronización multi-dispositivo: commitea y
 * pushea cambios locales para que no queden archivos sin subir.
 *
 * Seguro por diseño:
 *  - Respeta .gitignore (nunca sube secretos/node_modules).
 *  - No falla la sesión: cualquier error sale con código 0.
 *  - No actúa en HEAD desacoplado ni sin remoto.
 *
 * Uso:
 *   node scripts/git-autosync.js                 # commit + push de la rama actual
 *   node scripts/git-autosync.js "mensaje"       # mensaje de commit custom
 *
 * Lo invoca el hook Stop de Claude Code (ver .claude/settings.json) y puede
 * correrse a mano. Node >= 18, CommonJS.
 */

const { execSync } = require('child_process');
const path = require('path');

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function tryGit(cmd) {
  try {
    return { ok: true, out: git(cmd) };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || e.message || '') };
  }
}

function repoRoot() {
  const r = tryGit('rev-parse --show-toplevel');
  return r.ok && r.out ? r.out : process.cwd();
}

// Verifica que la app Next compile (tsc --noEmit) antes de dejar avanzar main.
// Regla: main SIEMPRE compila. Si tsc no puede correr (sin deps) también devuelve
// no-ok, y el llamador trata "no verificable" como "no avanzar main" (seguro).
function appCompiles() {
  const appDir = path.join(repoRoot(), 'web-factory', 'apps', 'site');
  try {
    execSync('npx tsc --noEmit', { cwd: appDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, out: '' };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || e.message || '') };
  }
}

function main() {
  // 1. ¿Hay remoto?
  const remote = tryGit('remote');
  if (!remote.ok || !remote.out) {
    console.log('[autosync] sin remoto, omito');
    return;
  }

  // 2. Rama actual (no desacoplado)
  const branch = tryGit('rev-parse --abbrev-ref HEAD');
  if (!branch.ok || branch.out === 'HEAD' || !branch.out) {
    console.log('[autosync] HEAD desacoplado, omito');
    return;
  }

  // 3. ¿Merge a medias? NO tocar nada.
  // 2026-08-20: un merge con conflictos quedo abierto al cerrar el turno, el
  // hook Stop corrio esto, y `add -A` + commit convirtieron los marcadores
  // <<<<<<< en un commit "resuelto" que ademas hizo fast-forward a MAIN.
  // 17 archivos con marcadores publicados. `add -A` marca como resuelto lo que
  // no lo esta: si hay MERGE_HEAD o paths unmerged, esto no es un auto-sync,
  // es una resolucion — y las resoluciones son de un humano o del agente, no
  // de un cron.
  const merging = tryGit('rev-parse -q --verify MERGE_HEAD');
  const unmerged = tryGit('diff --name-only --diff-filter=U');
  if ((merging.ok && merging.out) || (unmerged.ok && unmerged.out)) {
    console.log('[autosync] merge sin resolver — omito TODO (resolver a mano y recien commitear)');
    return;
  }

  // 4. ¿Hay cambios?
  const status = tryGit('status --porcelain');
  if (status.ok && status.out) {
    tryGit('add -A');
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const msg = process.argv[2] || `chore: auto-sync ${stamp}`;
    const commit = tryGit(`commit -m "${msg.replace(/"/g, "'")}"`);
    if (!commit.ok) console.log('[autosync] nada para commitear o commit falló:', commit.out.slice(0, 200));
    else console.log('[autosync] commit:', msg);
  }

  // 4. ¿Hay commits locales sin pushear? Push.
  const ahead = tryGit(`rev-list --count origin/${branch.out}..${branch.out}`);
  const needsPush = !ahead.ok || ahead.out === '' || Number(ahead.out) > 0;
  if (needsPush) {
    const push = tryGit(`push -u origin ${branch.out}`);
    console.log(push.ok ? `[autosync] push -> origin/${branch.out}` : '[autosync] push falló: ' + push.out.slice(0, 300));
  } else {
    console.log('[autosync] rama al día, nada que pushear');
  }

  // 5. Mantener main al día (sincronización entre dispositivos): si la rama
  // actual no es main y origin/main es ancestro (avance lineal, sin conflictos),
  // hacer fast-forward de main. Si no es FF, se omite (merge manual).
  //
  // Excepto una rama de PEDIDO (2026-10-02). Los pedidos que Sergio Urcullo le hace a
  // Claude desde Hermes corren en una rutina de la nube que carga ESTE hook; su trabajo
  // va en `pedido/<id>` como PR en borrador, y lo aprueba él. Sin esta guarda, el Stop
  // de esa sesión hacía fast-forward de main con el cambio sin revisar
  // (hermes-content/docs/TELEGRAM_COMMAND_CENTER.md, scripts/loops/pedido-rama.test.mjs).
  // Lo mismo para `orquesta/*` (2026-10-18): el trabajo del orquestador va por PR, no directo a main.
  const ramaDePedido = /^(pedido|respuesta|orquesta)\//.test(branch.out);
  if (ramaDePedido) console.log('[autosync] rama de pedido: se pushea, main NO se toca');
  if (branch.out !== 'main' && !ramaDePedido) {
    tryGit('fetch origin main');
    const ff = tryGit(`merge-base --is-ancestor origin/main ${branch.out}`);
    if (!ff.ok) {
      console.log('[autosync] main divergió de la rama; no es fast-forward, merge manual pendiente');
    } else {
      // Guard (regla: NUNCA dejar imports colgando / main SIEMPRE compila): si el
      // avance a main toca la app Next, verificar tsc --noEmit antes del FF. Un
      // árbol a medio mergear (imports a archivos que no llegaron) rompía Vercel y
      // el auto-deploy del VPS. La rama de trabajo ya se pusheó arriba; acá sólo
      // protegemos main. tsc sólo corre cuando realmente tocaría main con cambios
      // de app, así los sync de docs/contenido siguen siendo instantáneos.
      const appDiff = tryGit(`diff --name-only origin/main..${branch.out} -- web-factory/apps/site`);
      const appChanged = appDiff.ok && appDiff.out.trim() !== '';
      let safe = true;
      if (appChanged) {
        const check = appCompiles();
        safe = check.ok;
        if (!safe) {
          const firstError = check.out.split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
          console.log('[autosync] FF a main BLOQUEADO: apps/site no compila (tsc). Rama pusheada, main SIN avanzar. ' + firstError.slice(0, 200));
        }
      }
      if (safe) {
        const toMain = tryGit(`push origin ${branch.out}:main`);
        console.log(toMain.ok ? '[autosync] main al día (fast-forward)' : '[autosync] FF a main omitido: ' + toMain.out.slice(0, 200));
      }
    }
  }
}

try {
  main();
} catch (e) {
  console.log('[autosync] error no fatal:', e.message);
}
process.exit(0);

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

  // 3. ¿Hay cambios?
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
}

try {
  main();
} catch (e) {
  console.log('[autosync] error no fatal:', e.message);
}
process.exit(0);

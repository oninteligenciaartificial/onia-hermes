#!/usr/bin/env node
/**
 * Auto-sync del repo a GitHub. Sincronización multi-dispositivo: commitea y
 * pushea cambios locales para que no queden archivos sin subir.
 *
 * Seguro por diseño:
 *  - Respeta .gitignore (nunca sube secretos/node_modules).
 *  - En el checkout principal de la PC (compartido entre sesiones) no hace `add -A`: commitea solo lo ya
 *    agregado al índice. En un worktree enlazado o en la nube (CLAUDE_CODE_REMOTE=true) sí.
 *  - No falla la sesión: cualquier error sale con código 0.
 *  - No actúa en HEAD desacoplado ni sin remoto.
 *  - Pushea la RAMA y NUNCA `main`: a `main` solo se llega por PR con CI verde y revisión de
 *    Codex (AGENTS.md §4 «Quién mueve `main`»). Ni permiso, ni marca, ni identidad lo habilitan.
 *
 * Uso:
 *   node scripts/git-autosync.js                 # commit + push de la rama actual
 *   node scripts/git-autosync.js "mensaje"       # mensaje de commit custom
 *
 * Lo invoca el hook Stop de Claude Code (ver .claude/settings.json) y puede
 * correrse a mano. Node >= 18, CommonJS.
 */

const { execFileSync } = require('child_process');
const os = require('os');
const path = require('path');

// Una sesión parada EN main no pushea main: sus commits van a esta rama, para un PR.
// Una por sesión (su id; si no hay, el nombre de la máquina), así las vueltas siguientes la siguen
// sin forzar nada. Empieza con `claude/` para que la vean el integrador y ramas_varadas.
function ramaDeRescate(env = process.env) {
  const id = env.CLAUDE_CODE_REMOTE_SESSION_ID || env.CLAUDE_CODE_SESSION_ID || os.hostname() || 'local';
  const limpio = String(id).replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'local';
  return `claude/autosync-${limpio}`;
}

// git SIN shell, con los argumentos separados (revisión del 5-oct): el nombre de una rama es dato.
// Con `execSync(\`git push origin ${rama}\`)` una rama llamada `x$(touch${IFS}/ruta)` —un nombre
// válido para git— ejecutaba el comando en la máquina de quien la tuviera abierta, por ejemplo la PC
// de la madre al revisar la rama de otra sesión.
function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function tryGit(args) {
  try {
    return { ok: true, out: git(args) };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || e.message || '') };
  }
}

const MAIN_REMOTA = 'refs/remotes/origin/main';

// P2 de Codex en #226 (17-oct): en la PC el checkout PRINCIPAL (git-dir == git-common-dir) lo comparten varias
// sesiones, y `add -A` subiría el trabajo de las otras (AGENTS.md §4 «Carriles»: `git add` con rutas explícitas).
// Un worktree enlazado de la PC y la nube (un contenedor por sesión) son de una sola sesión: ahí `add -A` es seguro.
function checkoutCompartido(env = process.env) {
  if (env.CLAUDE_CODE_REMOTE === 'true') return false;
  const dir = tryGit(['rev-parse', '--git-dir']);
  const comun = tryGit(['rev-parse', '--git-common-dir']);
  return dir.ok && comun.ok && path.resolve(dir.out) === path.resolve(comun.out);
}

function nombreConSha() {
  const sha = tryGit(['rev-parse', '--short=8', 'HEAD']);
  return `${ramaDeRescate()}-${sha.ok ? sha.out : Date.now()}`;
}

// ¿Se puede apuntar la rama local `nombre` a HEAD sin dejar commits huérfanos? Sí si no existe o si
// HEAD ya los contiene (revisión del 5-oct: `checkout -B` pisaba una rama con commits sin pushear).
function sinPerder(nombre) {
  return !tryGit(['rev-parse', '-q', '--verify', `refs/heads/${nombre}`]).ok ||
    tryGit(['merge-base', '--is-ancestor', `refs/heads/${nombre}`, 'HEAD']).ok;
}

// Pushea HEAD a la rama `destino` y deja la sesión parada en ella (mismo commit, árbol intacto), con
// upstream. Si el push se rechaza (la sesión hizo rebase o amend) o pisaría commits locales, no se
// fuerza: usa `<rescate>-<sha>`. Devuelve { ok, destino, movida, out }.
function llevarA(destino) {
  if (!sinPerder(destino)) destino = nombreConSha();
  // La alternativa puede venir de un rescate anterior con commits propios (revisión de Codex, 8-oct).
  if (!sinPerder(destino)) return { ok: false, destino, out: 'la rama de rescate alternativa tiene commits locales que HEAD no incluye' };
  let push = tryGit(['push', 'origin', `HEAD:refs/heads/${destino}`]);
  if (!push.ok && destino !== nombreConSha() && sinPerder(nombreConSha())) {
    destino = nombreConSha();
    push = tryGit(['push', 'origin', `HEAD:refs/heads/${destino}`]);
  }
  if (!push.ok) return { ok: false, destino, out: push.out };
  const movida = tryGit(['checkout', '-q', '-B', destino]).ok;
  if (movida) tryGit(['branch', '-q', `--set-upstream-to=refs/remotes/origin/${destino}`]);
  return { ok: true, destino, movida };
}

// Saca de main los commits de una sesión parada en main, sin perder ninguno: van a su rama de rescate, la
// sesión queda parada ahí y el main local vuelve a origin/main. Revisión del 5-oct: si quedaban en el
// main local, una corrida posterior en ese clon los publicaba sin PR.
function rescatar() {
  const nuevos = tryGit(['rev-list', '--count', `${MAIN_REMOTA}..HEAD`]);
  if (nuevos.ok && nuevos.out === '0') {
    console.log('[autosync] main solo por PR: en main, nada nuevo; main no se toca');
    return;
  }
  const r = llevarA(ramaDeRescate());
  if (!r.ok) {
    console.log(`[autosync] main solo por PR: push a ${r.destino} falló (main NO se tocó; los commits siguen en este clon): ` + r.out.slice(0, 300));
    return;
  }
  if (r.movida && tryGit(['rev-parse', '-q', '--verify', MAIN_REMOTA]).ok) tryGit(['branch', '-f', 'main', MAIN_REMOTA]);
  // Sin checkout (la rama de rescate abierta en otro worktree) los commits siguen en el main local: se avisa fuerte.
  if (!r.movida) {
    console.log(`[autosync] ⚠ ATENCIÓN: tus commits están en origin/${r.destino} pero SIGUEN en el main local de este clon. ` +
      `No pushees main: pasate a la rama con «git checkout -B ${r.destino} origin/${r.destino}» y abrí un PR.`);
    return;
  }
  console.log(`[autosync] main solo por PR: tus commits quedaron en origin/${r.destino}` +
    ' y la sesión sigue en esa rama (abrí un PR desde ahí)');
}

function main() {
  // 1. ¿Hay remoto?
  const remote = tryGit(['remote']);
  if (!remote.ok || !remote.out) {
    console.log('[autosync] sin remoto, omito');
    return;
  }

  // 2. Rama actual, por su ref COMPLETA (no desacoplado). Revisión del 5-oct: con un tag o un remoto
  // llamado `main`, `rev-parse --abbrev-ref HEAD` devuelve `heads/main`, la comparación con 'main'
  // fallaba y el push igual movía refs/heads/main.
  const ref = tryGit(['symbolic-ref', '-q', 'HEAD']);
  if (!ref.ok || !ref.out.startsWith('refs/heads/')) {
    console.log('[autosync] HEAD desacoplado, omito');
    return;
  }
  const rama = ref.out.slice('refs/heads/'.length);
  const local = `refs/heads/${rama}`;

  // 3. ¿Merge a medias? NO tocar nada.
  // 2026-08-20: un merge con conflictos quedo abierto al cerrar el turno, el
  // hook Stop corrio esto, y `add -A` + commit convirtieron los marcadores
  // <<<<<<< en un commit "resuelto" que ademas hizo fast-forward a MAIN.
  // 17 archivos con marcadores publicados. `add -A` marca como resuelto lo que
  // no lo esta: si hay MERGE_HEAD o paths unmerged, esto no es un auto-sync,
  // es una resolucion — y las resoluciones son de un humano o del agente, no
  // de un cron.
  const merging = tryGit(['rev-parse', '-q', '--verify', 'MERGE_HEAD']);
  const unmerged = tryGit(['diff', '--name-only', '--diff-filter=U']);
  if ((merging.ok && merging.out) || (unmerged.ok && unmerged.out)) {
    console.log('[autosync] merge sin resolver — omito TODO (resolver a mano y recien commitear)');
    return;
  }

  // 4. ¿Hay cambios? En el checkout compartido de la PC no se hace `add -A`: se commitea solo lo que la
  // sesión ya agregó al índice; si no hay nada, no se commitea y se sigue con el push de lo ya commiteado.
  const status = tryGit(['status', '--porcelain']);
  if (status.ok && status.out) {
    const compartido = checkoutCompartido();
    if (!compartido) tryGit(['add', '-A']);
    if (compartido && tryGit(['diff', '--cached', '--quiet']).ok) {
      console.log('[autosync] checkout compartido, sin staging automático');
    } else {
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const msg = process.argv[2] || `chore: auto-sync ${stamp}`;
      const commit = tryGit(['commit', '-m', msg]);
      if (!commit.ok) console.log('[autosync] nada para commitear o commit falló:', commit.out.slice(0, 200));
      else console.log('[autosync] commit:', msg);
    }
  }

  // 4a. Parada EN main: main no se pushea, nunca; lo nuevo va a la rama de rescate, para un PR.
  if (rama === 'main') return rescatar();

  // 4b. ¿Hay commits locales sin pushear? Push, con refs completos.
  const ahead = tryGit(['rev-list', '--count', `refs/remotes/origin/${rama}..${local}`]);
  const needsPush = !ahead.ok || ahead.out === '' || Number(ahead.out) > 0;
  if (needsPush) {
    const push = tryGit(['push', '-u', 'origin', `${local}:${local}`]);
    // Una rama de rescate reescrita (rebase o amend) no se fuerza: la sesión pasa a otra con el commit en
    // el nombre y sigue ahí (si no, cada vuelta crearía una rama nueva).
    if (!push.ok && rama.startsWith('claude/autosync-')) {
      const r = llevarA(nombreConSha());
      console.log(r.ok ? `[autosync] ${rama} fue reescrita: push -> origin/${r.destino}` : '[autosync] push falló: ' + r.out.slice(0, 300));
    } else {
      console.log(push.ok ? `[autosync] push -> origin/${rama}` : '[autosync] push falló: ' + push.out.slice(0, 300));
    }
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

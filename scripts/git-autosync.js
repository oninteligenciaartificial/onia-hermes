#!/usr/bin/env node
/**
 * Auto-sync del repo a GitHub. Sincronización multi-dispositivo: commitea y
 * pushea cambios locales para que no queden archivos sin subir.
 *
 * Seguro por diseño:
 *  - Respeta .gitignore (nunca sube secretos/node_modules).
 *  - No falla la sesión: cualquier error sale con código 0.
 *  - No actúa en HEAD desacoplado ni sin remoto.
 *  - Pushea la RAMA y no toca `main`, salvo con permiso (ver puedeMoverMain).
 *
 * Uso:
 *   node scripts/git-autosync.js                 # commit + push de la rama actual
 *   node scripts/git-autosync.js "mensaje"       # mensaje de commit custom
 *
 * Lo invoca el hook Stop de Claude Code (ver .claude/settings.json) y puede
 * correrse a mano. Node >= 18, CommonJS.
 */

const { execSync, execFileSync } = require('child_process');
const os = require('os');
const path = require('path');

// ¿Esta sesión puede mover `main`? (Sergio Urcullo, 2026-10-05: «sí, la madre sigue directo».)
// Medido ese día: desde el 28-sep, 48 de los 78 avances de main entraron por el fast-forward de este
// hook, sin revisión, y 23 vinieron de sesiones de la nube (Lucía y Marca personal; #82 entró así con
// «Hoy soy odontóloga»). main llega al VPS como root en ~1 h (el sincronizador de /root/bin). Desde
// hoy main avanza solo por PR revisado, salvo dos que revisan antes de publicar:
//   - la sesión madre, en la PC de Sergio Urcullo: ONIA_AUTOSYNC_MAIN=1;
//   - el integrador (loop onia-cola): ONIA_LOOP_ID=onia-cola, la identidad que ya le exporta su corredor.
// Exactamente esos valores: «true», «0» u otro loop no habilitan nada. Frena el ACCIDENTE (el
// fast-forward automático al soltar el turno), no a una sesión que pushee a main a propósito.
// Pruebas: scripts/loops/pedido-rama.test.mjs.
function puedeMoverMain(env = process.env) {
  return env.ONIA_AUTOSYNC_MAIN === '1' || env.ONIA_LOOP_ID === 'onia-cola';
}

// Una sesión parada EN main y sin permiso no pushea main: sus commits van a esta rama, para un PR.
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

function repoRoot() {
  const r = tryGit(['rev-parse', '--show-toplevel']);
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

const MAIN_REMOTA = 'refs/remotes/origin/main';

// ¿Puede `desde` llegar a main sin romper la app? Guard (regla: NUNCA dejar imports colgando / main
// SIEMPRE compila): si el avance toca la app Next, tsc --noEmit tiene que pasar. Un árbol a medio
// mergear (imports a archivos que no llegaron) rompía Vercel y el auto-deploy del VPS. tsc sólo corre
// cuando el avance trae cambios de app, así los sync de docs/contenido siguen siendo instantáneos.
function compilaParaMain(desde) {
  const appDiff = tryGit(['diff', '--name-only', `${MAIN_REMOTA}..${desde}`, '--', 'web-factory/apps/site']);
  if (!(appDiff.ok && appDiff.out.trim() !== '')) return true;
  const check = appCompiles();
  if (!check.ok) {
    const firstError = check.out.split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
    console.log('[autosync] main BLOQUEADO: apps/site no compila (tsc). ' + firstError.slice(0, 200));
  }
  return check.ok;
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

// Saca de main los commits de una sesión SIN permiso, sin perder ninguno: van a su rama de rescate, la
// sesión queda parada ahí y el main local vuelve a origin/main. Revisión del 5-oct: si quedaban en el
// main local, la primera corrida CON permiso en ese clon los publicaba sin PR. Solo para sesiones sin
// permiso: el integrador aborta si no está parado en main (onia-loop.sh), nunca se lo mueve.
function rescatar() {
  const nuevos = tryGit(['rev-list', '--count', `${MAIN_REMOTA}..HEAD`]);
  if (nuevos.ok && nuevos.out === '0') {
    console.log('[autosync] en main, nada nuevo; main no se toca');
    return;
  }
  const r = llevarA(ramaDeRescate());
  if (!r.ok) {
    console.log(`[autosync] push a ${r.destino} falló (main NO se tocó; los commits siguen en este clon): ` + r.out.slice(0, 300));
    return;
  }
  if (r.movida && tryGit(['rev-parse', '-q', '--verify', MAIN_REMOTA]).ok) tryGit(['branch', '-f', 'main', MAIN_REMOTA]);
  console.log(`[autosync] main solo avanza por PR revisado: tus commits quedaron en origin/${r.destino}` +
    (r.movida ? ' y la sesión sigue en esa rama (abrí un PR desde ahí)' : ' (abrí un PR desde ahí)'));
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

  // 4. ¿Hay cambios?
  const status = tryGit(['status', '--porcelain']);
  if (status.ok && status.out) {
    tryGit(['add', '-A']);
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const msg = process.argv[2] || `chore: auto-sync ${stamp}`;
    const commit = tryGit(['commit', '-m', msg]);
    if (!commit.ok) console.log('[autosync] nada para commitear o commit falló:', commit.out.slice(0, 200));
    else console.log('[autosync] commit:', msg);
  }

  const permiso = puedeMoverMain();

  // 4a. Parada EN main y sin permiso: main no se pushea; lo nuevo va a la rama de rescate. Con permiso
  // (madre, integrador) se pushea main como siempre, sin tsc: es como era antes del 5-oct, y el
  // integrador tiene sus propios gates (hueco conocido, anotado en la skill onia-hermes-jarvis).
  if (rama === 'main' && !permiso) return rescatar();

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

  // 5. Mantener main al día, SOLO con permiso (puedeMoverMain): si la rama actual no es main y
  // origin/main es ancestro (avance lineal, sin conflictos), fast-forward de main. Si no es FF, se
  // omite (merge manual). Sin permiso, main entra por PR revisado.
  //
  // Una rama de PEDIDO nunca, ni con permiso (2026-10-02). Los pedidos que Sergio Urcullo le hace a
  // Claude desde Hermes corren en una rutina de la nube que carga ESTE hook; su trabajo va en
  // `pedido/<id>` como PR en borrador, y lo aprueba él (hermes-content/docs/TELEGRAM_COMMAND_CENTER.md).
  // La rutina corre sin permiso igual: esto es una segunda llave, no la única.
  const ramaDePedido = /^(pedido|respuesta)\//.test(rama);
  if (ramaDePedido) console.log('[autosync] rama de pedido: se pushea, main NO se toca');
  else if (rama !== 'main' && !permiso) {
    console.log('[autosync] main no se toca: entra por PR revisado (solo la madre y el integrador lo mueven)');
  }
  if (rama !== 'main' && !ramaDePedido && permiso) {
    tryGit(['fetch', 'origin', 'main']);
    const ff = tryGit(['merge-base', '--is-ancestor', MAIN_REMOTA, local]);
    if (!ff.ok) {
      console.log('[autosync] main divergió de la rama; no es fast-forward, merge manual pendiente');
    } else if (!compilaParaMain(local)) {
      console.log('[autosync] Rama pusheada, main SIN avanzar.');
    } else {
      const toMain = tryGit(['push', 'origin', `${local}:refs/heads/main`]);
      console.log(toMain.ok ? '[autosync] main al día (fast-forward)' : '[autosync] FF a main omitido: ' + toMain.out.slice(0, 200));
    }
  }
}

try {
  main();
} catch (e) {
  console.log('[autosync] error no fatal:', e.message);
}
process.exit(0);

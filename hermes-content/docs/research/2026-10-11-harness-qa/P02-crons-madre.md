# P02 - Loops de las madres y la PC (I3)

Fecha: 2026-10-11. Punto del QA de harness. Propuesta corregida tras verificación. Nada creado ni instalado en la PC: ni tarea programada, ni script en el repo, ni escritura en `~/.onia`.

## Estado medido

- **Rondas de la madre = CronCreate, ligadas a la sesión.** `hermes-content/docs/cola/loop/madre.md:141-150` (tabla §F): ronda `:07 :27 :47`, parte 07:53, cierre 21:53, lote lunes 08:13, todos con "¿Sigue con la PC apagada? No". `madre.md:150` dice que viven solo mientras la sesión está abierta, vencen a los 7 días y disparan con la sesión ociosa. `hermes-content/docs/ONIA_EQUIPO_DE_AGENTES.md:256`: "The madre's `CronCreate` dies on reboot and expires after 7 days".
- **Los ids de los crons no coinciden entre docs.** `madre.md:144-147` da `333b77d3`, `313765ea`, `db8b3b4b`, `836a6670`. `ONIA_HARNESS.md:52-55` da `708dccce`, `dbec7299`, `915aadba`, `3f6ca99f`. `handoff/madre-local.md:50` da `a87daf02` para la ronda. `research/2026-10-10-auditoria-madre-v3.md:33` (fila P1.1a) dice `58241846 -> 708dccce`. UNKNOWN cuál está vivo: CronList corre en la sesión que lo invoca y esta sesión no es la madre.
- **Disparo real medido (auditoría, no re-medido aquí):** `research/2026-10-10-auditoria-madre-v3.md:16-17`: la ronda disparó 1 vez en 3 h 20 min (14:56:52) y no volvió a disparar entre 15:52 y 17:21 con la sesión ociosa. Fila P1.1a en `:33`.
- **Chequeo de publicación que no corrió:** fila P1.TT1b en `auditoria-madre-v3.md:43`: "El cron 19d6a061 nunca disparó". `madre.md:113` y `madre.md:151` dicen que el chequeo "corrió 85 min tarde": el audit corrige a "no corrió". (La cita del verificador a `madre.md:91` era incorrecta: esa línea no contiene el texto.)
- **Recreación manual tras /clear:** `handoff/madre-local.md:18-19` y `:36`: paso 0 = recrear la ronda a mano desde §F. Es paso humano en cada arranque.
- **Programador de tareas, estado actual (PowerShell):** `Get-ScheduledTask | Where TaskName -match 'latido|onia'` -> 0 tareas. Total de tareas en la PC: 201. `schtasks` desde Git Bash falla por conversión de ruta; usar PowerShell.
- **Herramienta mecánica existente, sin LLM:** `scripts/codex-cupo.mjs` existe en el worktree (sin trackear: `git status` `??`). `node scripts/codex-cupo.mjs --self-test` -> `self-test OK`. Lectura real a las 05:30 UTC: `semanal: 0% usado | reinicia 2026-10-18 05:16 UTC`, `corta: UNKNOWN`. Sale con código 2 cuando dice UNKNOWN (`UNKNOWN: sin eventos rate_limits ...` cuando no hay sesiones de Codex); su stdout es el dato.
- **Checkout principal sin los archivos nuevos (medido):** `C:\dev\proyectos\onia-hermes` HEAD `ac8f2d44`, `origin/main` `2cdefca7`. `scripts/codex-cupo.mjs` y `hermes-content/docs/handoff/codex-tareas/` no existen allí.
- **Conflicto de cifras Codex (sin resolver):** el encargo dice ~58 % con reinicio 14-oct 03:57 UTC. El script lee 0 % con reinicio 18-oct 05:16 UTC, desde el último evento de `~/.codex/sessions`. Puede ser ventana nueva o cuenta distinta. UNKNOWN.
- **Prueba del latido corregido (script de prueba en el scratchpad de la sesión, no en el repo, con `USERPROFILE` redirigido):**
  - Worktree: `origin/main` 2cdefca7; PRs 9 abiertos, 7 en draft; cola `codex-tareas` 12; disco C libre 7.2 GB; cupo línea UNKNOWN (artefacto: el HOME redirigido no tiene `.codex`; con el HOME real da 0 %).
  - Checkout principal: `Tareas Codex en cola: ERROR: ENOENT ... scandir '...\codex-tareas'`. El script termina con código 0 y escribe el error en `ultimo.md`.
  - PoolPagedBytes: `Get-Counter "\Memory\Pool Paged Bytes"` devuelve `c0000bc4` (error de la API de contadores) en esta sesión, dos veces. Medido: no es un dato fiable hoy. Queda como `ERROR:` en el latido; no se usa para decidir.
- **Tarea de prueba no existente:** `Get-ScheduledTask -TaskName 'Latido madre'` -> no existe. Se construyeron action, trigger y settings sin registrarlos: `Argument` = `"C:\dev\proyectos\onia-hermes\scripts\latido-madre.mjs"`, `Repetition.Interval` = `PT20M`, `StartWhenAvailable` = True. Registrar la tarea no se hizo.
- **Cron de nube (RemoteTrigger), límite:** `ONIA_EQUIPO_DE_AGENTES.md:194`: el intervalo mínimo de una rutina de nube es 1 h; `*/20` devuelve HTTP 400. Por eso los latidos de nube no se pueden subir a 20 min desde ahí.
- **Hook Stop existente:** `.claude/settings.json` ejecuta `node scripts/git-autosync.js` al cerrar turno. El latido no hace git escritura, pero `git fetch` escribe refs en `.git`.

## Brecha

1. La ronda vive dentro de la sesión madre: muere al cerrar o reiniciar, vence a los 7 días, y no dispara con la sesión ocupada. Medido: 1 disparo en 3 h 20 min.
2. No hay latido fuera de la sesión para lo mecánico (git, PRs, cupo Codex, cola `codex-tareas/`, disco). Cada ronda gasta tokens para contar cosas que un script cuenta en segundos.
3. Los ids de los crons difieren en 3 docs. No hay una fuente única del estado de los crons.
4. Los latidos de las 4 nubes (`RemoteTrigger`) solo se leen desde una sesión de Claude. Task Scheduler no los ve. Fuera de esta propuesta.
5. Riesgo de la propia propuesta medido: el latido depende de que el checkout de `REPO` tenga los archivos nuevos. Hoy el checkout principal no los tiene.

## Qué sí y qué no va al Programador de tareas

| Sí (mecánico, sin decisión) | No (decide o actúa) |
|---|---|
| Leer `origin/main` y contar PRs abiertos y en draft (solo lectura) | Crear, cerrar o mergear PRs |
| Leer cupo Codex (`scripts/codex-cupo.mjs`) | Lanzar `codex-tarea.sh` (gasta cupo; decide la madre) |
| Contar tareas en `codex-tareas/` | Mandar mensajes a sesiones (`SendMessage` solo la madre) |
| Disco libre C: | Hacer commit, push, stash o checkout (la madre commitea; choca con autosync) |
| Escribir resumen en `%USERPROFILE%\.onia\latido\` | Llamar `claude -p` (es LLM y gasta el pool) |
| PoolPagedBytes, si el contador responde (hoy no responde: `c0000bc4`) | Tocar Chrome, WhatsApp, procesos o el portal SIAT |
| | Usar RemoteTrigger (solo disponible dentro de una sesión de Claude) |

## Configuración propuesta

### 1. Script nuevo: `scripts/latido-madre.mjs` (va en el repo, por PR)

Sin dependencias. Solo lee el repo; escribe fuera del repo. Versión probada en el scratchpad de la sesión (`node --check` OK; corrida en ambos checkouts con resultado descrito arriba). Cambios frente a la versión anterior: `readdirSync` y `statfsSync` dentro de try/catch (antes un ENOENT mataba el script sin escribir `ultimo.md`); `sh()` usa el stdout cuando el comando sale con código distinto de 0 (`codex-cupo` sale 2 con UNKNOWN).

```js
#!/usr/bin/env node
// Latido mecanico de la madre. Sin LLM, solo lectura del repo. Escribe fuera del repo.
import { execFileSync } from 'node:child_process';
import { statfsSync, readdirSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const REPO = process.env.ONIA_REPO ?? 'C:\\dev\\proyectos\\onia-hermes';
const OUT = join(homedir(), '.onia', 'latido');
const sh = (file, args) => {
  try {
    return execFileSync(file, args, { cwd: REPO, encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }).trim();
  } catch (e) {
    // codex-cupo sale con codigo 2 cuando dice UNKNOWN: su stdout sigue siendo el dato.
    if (e.stdout && String(e.stdout).trim()) return String(e.stdout).trim();
    return `ERROR: ${String(e.stderr || e.message).split('\n')[0]}`;
  }
};
const safe = (fn) => {
  try {
    return fn();
  } catch (e) {
    return `ERROR: ${String(e.message).split('\n')[0]}`;
  }
};
const now = new Date().toISOString();
const fetched = sh('git', ['fetch', 'origin', '--quiet']);
const main = sh('git', ['rev-parse', '--short', 'origin/main']);
const prsRaw = sh('gh', ['pr', 'list', '--state', 'open', '--json', 'number,isDraft', '--limit', '100']);
let prs;
try {
  const a = JSON.parse(prsRaw);
  prs = `${a.length} abiertos, ${a.filter((p) => p.isDraft).length} en draft`;
} catch {
  prs = prsRaw;
}
const cupo = sh(process.execPath, [join(REPO, 'scripts', 'codex-cupo.mjs')]).split('\n').join(' | ');
const cola = safe(() => readdirSync(join(REPO, 'hermes-content', 'docs', 'handoff', 'codex-tareas'))
  .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md').length);
const discoGB = safe(() => {
  const s = statfsSync('C:' + String.fromCharCode(92));
  return ((s.bavail * s.bsize) / 1e9).toFixed(1);
});
const pool = sh('powershell', ['-NoProfile', '-Command',
  '[math]::Round((Get-Counter "\\Memory\\Pool Paged Bytes").CounterSamples[0].CookedValue/1GB,2)']);
const md = [
  '# Latido madre (mecanico, sin LLM)',
  `- Hora UTC: ${now}`,
  `- fetch origin: ${fetched || 'ok'}`,
  `- origin/main: ${main}`,
  `- PRs abiertos: ${prs}`,
  `- Codex cupo: ${cupo}`,
  `- Tareas Codex en cola: ${cola}`,
  `- Disco C libre GB: ${discoGB}`,
  `- PoolPagedBytes GB: ${pool}`,
].join('\n') + '\n';
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'ultimo.md'), md, 'utf8');
appendFileSync(join(OUT, 'historial.log'), `${now} main=${main} disco=${discoGB} pool=${pool}\n`, 'utf8');
```

Precondición: `ONIA_REPO` debe apuntar a un checkout que ya tenga `scripts/codex-cupo.mjs` y `hermes-content/docs/handoff/codex-tareas/`, es decir, después de que el PR esté en `origin/main` y el checkout haga pull. Hoy el checkout principal no los tiene (medido). Sin esa precondición el latido escribe `ERROR:` en las líneas afectadas; no falla en silencio.

Nota de límite: PoolPagedBytes da `ERROR` en esta PC (`c0000bc4`). Se deja la línea para que se vea el fallo; no se usa para decidir.

### 2. Tarea del Programador de tareas (la ejecuta Sergio Urcullo, en PowerShell)

No ejecutada. Se usa PowerShell y no `schtasks /TR`: el escapado de comillas de `schtasks` dentro de PowerShell 5.1 no se probó (UNKNOWN). Los objetos action, trigger y settings sí se probaron sin registrar.

```powershell
$node = (Get-Command node).Source
$action = New-ScheduledTaskAction -Execute $node -Argument '"C:\dev\proyectos\onia-hermes\scripts\latido-madre.mjs"'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 20)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName 'Latido madre' -TaskPath '\ONIA\' -Action $action -Trigger $trigger -Settings $settings -Description 'Latido mecanico de la madre, sin LLM' | Out-Null
```

Para quitarla más tarde (si Sergio lo pide): `Unregister-ScheduledTask -TaskName 'Latido madre' -TaskPath '\ONIA\' -Confirm:$false`.

### 3. Texto para pegar en la ronda de la madre (cambio en `madre.md` §F y en `equipo-de-agentes` §3)

> Ronda: lo primero es leer `%USERPROFILE%\.onia\latido\ultimo.md`. Si tiene más de 40 min o alguna línea `ERROR`, avisar a Sergio Urcullo una vez y seguir con lo que sí se puede verificar. El resto de la ronda (sesiones de la nube, decisiones, Codex) lo hace la madre.

## Quién la aplica y por qué

- **madre-dev (sesión madre de desarrollo-infra):** crea `scripts/latido-madre.mjs`, el cambio de texto de la ronda y commitea `codex-cupo.mjs` y `codex-tareas/` que hoy solo están en el worktree. Va por PR revisado, porque `main` avanza solo por PR (regla de `main`). Ojo: el checkout principal está en `ac8f2d44` y `origin/main` en `2cdefca7`.
- **Sergio Urcullo:** ejecuta el bloque de la sección 2 en su PC. Es configuración persistente de su equipo: la regla de permiso por acción lo pide. Ninguna sesión la crea.
- **madre-marketing:** no aplica nada aquí. Lee el mismo `ultimo.md` si lo necesita, pero no lo modifica.
- **Integrador:** solo mergea el PR de madre-dev. No crea la tarea.
- **Sesiones de la nube (Plataforma, Hermes, Lucía, Marca, Ventas):** no aplican nada. Sus latidos siguen en RemoteTrigger y están fuera de esta propuesta.

## Prueba de hecho

1. Tras el PR y el pull del checkout: `node scripts/latido-madre.mjs` a mano. Esperado: `%USERPROFILE%\.onia\latido\ultimo.md` existe, con la hora actual, `origin/main` igual a `git rev-parse --short origin/main`, y `Tareas Codex en cola` con número (no `ERROR`).
2. Tras registrar la tarea (PowerShell):
   ```powershell
   Get-ScheduledTaskInfo -TaskName 'Latido madre' -TaskPath '\ONIA\' | Select-Object LastRunTime, LastTaskResult, NextRunTime
   ```
   Esperado: `LastTaskResult` = 0 tras la primera corrida; `NextRunTime` a 20 min.
3. Dejar pasar 60 min con la PC encendida: `historial.log` tiene 3 o más líneas separadas ~20 min. Un hueco significa PC dormida o tarea no corrida; se anota la hora del hueco.
4. No-escritura en el repo: `git status --porcelain` igual antes y después de 1 h de latidos.
5. Coincidencia de cupo: la línea `Codex cupo` de `ultimo.md` coincide con `node scripts/codex-cupo.mjs` corrido a mano en el mismo minuto.

Criterio de hecho: 3 corridas seguidas sin `ERROR` en cola ni origin, con `ultimo.md` de menos de 25 min durante 1 h.

## Riesgo

- **PC apagada o dormida:** la tarea no corre. `StartWhenAvailable` la hace correr al despertar, no mientras esté apagada. La PC sigue siendo el único punto de falla (`ONIA_EQUIPO_DE_AGENTES.md:4`: "una sola madre (la PC)"; `:256` CronCreate muere al reiniciar).
- **Carrera con `git-autosync`:** `git fetch` escribe refs. Si coincide con el hook Stop de una sesión puede haber `index.lock` transitorio. Bajo riesgo: el latido no toca índice ni árbol; los errores se registran en `ultimo.md`.
- **Cupo Codex:** el script lee la última sesión de `~/.codex`, que puede no ser la cuenta actual. El latido lo muestra tal cual; no lo interpreta. Conflicto 0 % vs 58 % sin resolver (UNKNOWN).
- **PoolPagedBytes:** da `c0000bc4` en esta PC. Se muestra como `ERROR`; no se usa para decidir.
- **Historial creciente:** unas 72 líneas al día (~25 KB al año). Sin rotación: aceptable.
- **Falsa seguridad:** que el latido corra no prueba que las nubes trabajen. Eso sigue en RemoteTrigger.
- **Límite de intervalo de nube:** la nube no baja de 1 h (`ONIA_EQUIPO_DE_AGENTES.md:194`); el latido local sí puede ir a 20 min.
- **UNKNOWN:** ids de crons vivos; cupo real de Codex; cómo se comporta `schtasks /TR` con esas comillas (no probado); si `Register-ScheduledTask` deja el mismo resultado que el bloque probado solo como objetos. No se creó tarea ni se escribió en `~/.onia`.

## Resumen para la madre

- Mecánico y sin decisión: Programador de tareas, cada 20 min, PowerShell, solo lectura, salida a `%USERPROFILE%\.onia\latido\`.
- Lo que decide (lanzar Codex, mandar mensajes, commit, merge) se queda en la madre.
- Pendiente de madre-dev: PR con `scripts/latido-madre.mjs`, y commit de `codex-cupo.mjs` y `codex-tareas/` (solo en el worktree hoy).
- Pendiente de Sergio Urcullo: el bloque de la sección 2, después de que el PR esté mergeado y el checkout al día.

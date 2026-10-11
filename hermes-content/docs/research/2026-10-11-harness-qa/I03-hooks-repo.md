# I03 - Hooks y settings del repo (versión 2, corregida tras verificador)

Fecha: 2026-10-11. Solo lectura. Nada se commitea, pushea ni ejecuta contra GitHub, VPS ni repo real.
Corrige: prueba 5, riesgo de gate tsc en la madre, mecanismo del cwd, referencias de `ONIA_LOOP_ID` y guarda de merge.

## Estado medido

| Qué | Evidencia |
|---|---|
| Hooks registrados | `.claude/settings.json`: claves `SessionStart` y `Stop`. `SessionStart` → `node scripts/nube-ssh-vps.mjs`; `Stop` → `node scripts/git-autosync.js`. Nada más. |
| Guarda de la nube | `scripts/nube-ssh-vps.mjs:23`: `if (process.env.CLAUDE_CODE_REMOTE !== "true") return;`. En la PC no hace nada. |
| Stop en nube y PC | `git-autosync.js` no distingue nube de PC: corre en ambas. |
| Hook de subagentes | `.claude/hooks/subagente-con-modelo.mjs` existe, sin trackear (`git status --porcelain .claude/` → `?? .claude/hooks/`; `git ls-files .claude/hooks` vacío). No está en settings.json. Comentario `:8`: "Registrar en .claude/settings.json SOLO cuando Sergio Urcullo lo apruebe (ver L03)." |
| `settings.local.json` | Ignorado por `.gitignore:93` (`**/.claude/settings.local.json`; `git check-ignore -v` confirma). No existe en este worktree (medido). |
| Marca `onia-autosync-main` | Medido hoy en los 25 checkouts de `git worktree list --porcelain` (incluido el principal): ausente en todos. Este worktree: `C:/dev/proyectos/onia-hermes/.git/worktrees/onia-madre-v2-pr-review-2d85bb/onia-autosync-main` no existe. El checkout de la madre DESARROLLO-INFRA no está identificado (UNKNOWN). |
| Documentos que dicen que la marca ya está puesta | `CLAUDE.md:482-483`, `hermes-content/docs/handoff/hermes-jarvis.md:40,49,74-75` y `.claude/skills/onia-sesion-madre/SKILL.md:201-205` describen la marca y `settings.local.json` como puestos el 9-oct. La medición de hoy no lo confirma en ningún checkout listado. |
| Permiso de main: lógica | `scripts/git-autosync.js:42-50` `puedeMoverMain()`: vale si `ONIA_LOOP_ID === 'onia-cola'` (`:43`), o si `ONIA_AUTOSYNC_MAIN === '1'` y existe la marca en el git-dir (`:44-46`). Con variable pero sin marca imprime aviso (`:47-48`) y devuelve false. |
| Origen de `ONIA_LOOP_ID` | `scripts/loops/onia-loop.sh:268`: `export ONIA_LOOP_ID="$NOMBRE"`. El permiso lo da el NOMBRE del loop (`onia-cola`), no la identidad de "integrador". `git-autosync.js:31` es solo un comentario. |
| Gate `pre-push` | `.githooks/pre-push:18-19` solo deja pasar `main`/`master` si `ONIA_LOOP_ID=onia-cola`. Pero `git config --get core.hooksPath` vacío en este checkout: el hook NO está activo en la PC (medido). En clones del VPS: UNKNOWN (sin SSH). |
| Sin permiso y parado en main | `git-autosync.js:219` `if (rama === 'main' && !permiso) return rescatar();`. Los commits van a `claude/autosync-<id>`; main no se toca (`:146-167`). |
| Sin permiso y en rama de trabajo | `git-autosync.js:248-249`: pushea la rama, imprime "main no se toca: entra por PR revisado". |
| Con permiso y parado en main | `git-autosync.js:216-219` (comentario admite "sin tsc") y `:222-236`: hace `push -u origin main:main` (log `push -> origin/main`), **sin** `compilaParaMain` ni `tsc`. |
| Con permiso y en rama de trabajo | `git-autosync.js:251-261`: fast-forward de main. Solo aquí corre `compilaParaMain` (`:256`); si no compila: log `Rama pusheada, main SIN avanzar.` (`:257`). Si main divergió: `main divergió de la rama; no es fast-forward` (`:255`). Si avanza: `main al día (fast-forward)` (`:260`). |
| Guarda de merge sin resolver | `git-autosync.js:196-201` (MERGE_HEAD o paths unmerged → omite todo). |
| Cwd del hook de Stop | El comando es relativo: `node scripts/git-autosync.js`. Medido: desde `hermes-content/` (sin ese script) `node` sale con código **1** (error de módulo, no silencio). Cwd con que Claude Code ejecuta los hooks: UNKNOWN (no medido). |
| Fallo tolerado del script | `git-autosync.js:265-270`: errores capturados, `process.exit(0)`. Solo cubre fallos dentro del script, no la falta del archivo. |
| Prueba del permiso | `scripts/loops/pedido-rama.test.mjs` (usa clones temporales). No ejecutado en esta versión. |

Resultado: **hoy ninguna sesión de la PC tiene el permiso de main medido** (ni la variable en la shell, ni la marca en ningún checkout). Las ramas de trabajo sí se pushean.

## Brecha

1. **Permiso de main apagado en la PC (medido) y documentación en contra.** La madre DESARROLLO-INFRA, que según el reparto debe mover main directo, no lo puede hacer: sus commits van a `claude/autosync-*`. CLAUDE.md, la skill y el handoff dicen lo contrario. Corrección de los documentos pendiente (ver Quién la aplica).
2. **Madre con permiso = main sin gate de compilación (ALTO).** Con permiso y parada en main, `git-autosync.js:216-219` empuja main sin `tsc`. CLAUDE.md marca como REGLA DURA que "main SIEMPRE compila" y que main alimenta el deploy del VPS y Vercel. El código lo admite en su comentario. Hoy el riesgo no se materializa porque nadie tiene el permiso (medido), pero si Sergio lo activa en la madre, el gate desaparece justo en el camino que más commits mete. Mitigación en Configuración propuesta, punto B.
3. **Dos madres y un solo permiso.** El permiso vale por checkout (marca en el git-dir) y por variable. Si la madre de MARKETING hereda `ONIA_AUTOSYNC_MAIN=1` o la marca, podría mover main. Hoy no la tiene (medido). Mantenerlo así.
4. **`ONIA_LOOP_ID=onia-cola` da el permiso sin marca.** Cualquier proceso que herede esa variable mueve main. Se exporta en `onia-loop.sh:268` para el loop `onia-cola`; en la PC no está en la shell (medido). Si la nube lo exporta: UNKNOWN.
5. **Subagente sin modelo: hook sin registrar y sin trackear.** Está en disco pero no versionado ni registrado. Registrarlo sin aprobación rompe la regla de su propio comentario. Commitearlo sin registro deja el archivo huérfano.
6. **Comando relativo en Stop.** Si la sesión no arranca en la raíz del repo, `node` falla con código 1 (medido). No es silencio. Si Claude Code muestra ese error al usuario, o en qué cwd corre el hook: UNKNOWN. Riesgo práctico: el autosync no corre en esa sesión y los cambios quedan sin commit hasta la siguiente vuelta.
7. **Commit de todo al soltar el turno.** `add -A` + commit en cada Stop, también en la madre. Cubierto por la guarda de `:196-201`. Sin brecha nueva.

Lo que está bien: la marca por checkout evita que subagentes en otros worktrees hereden el permiso; `.gitignore:93` impide versionar el permiso; `rescatar()` evita pushes a main sin permiso; la nube no ejecuta el SessionStart en la PC.

## Configuración propuesta

### A. Repo `.claude/settings.json`: sin cambios

Mantener los dos hooks. No registrar `subagente-con-modelo.mjs` hasta que Sergio lo apruebe. El archivo sin trackear queda fuera de cualquier commit.

### B. Madre DESARROLLO-INFRA: permiso de main (solo en su checkout, con riesgo aceptado)

Sustituir `<RUTA_CHECKOUT_MADRE_DEV>` por la ruta real (UNKNOWN hoy; la confirma Sergio o la madre).

Marca (PowerShell):

```powershell
Set-Location "<RUTA_CHECKOUT_MADRE_DEV>"
$gd = git rev-parse --absolute-git-dir
$marca = Join-Path $gd "onia-autosync-main"
if (-not (Test-Path $marca)) { New-Item -ItemType File -Path $marca | Out-Null }
```

Archivo `<RUTA_CHECKOUT_MADRE_DEV>\.claude\settings.local.json` (git lo ignora por `.gitignore:93`):

```json
{
  "env": {
    "ONIA_AUTOSYNC_MAIN": "1"
  }
}
```

Mitigación del gate tsc (obligatoria mientras la madre tenga el permiso). Antes de cada commit que la madre deje en main, ejecutar en PowerShell y exigir exit 0 si la lista no está vacía:

```powershell
git fetch origin --quiet
$cambios = git diff --name-only origin/main..HEAD -- web-factory/apps/site
if ($cambios) { Push-Location "web-factory\apps\site"; npx tsc --noEmit; $ok = $LASTEXITCODE; Pop-Location; if ($ok -ne 0) { throw "tsc falla: no pushear a main" } }
```

Alternativa más segura: que la madre no toque `web-factory/apps/site` y deje los cambios de app a PR. Si Sergio prefiere aceptar el riesgo, debe dejarlo por escrito en el handoff.

No poner la variable en `.claude/settings.json`, en la config de usuario ni en variables de Windows: daría el permiso a todas las sesiones de la PC.

### C. Madre MARKETING: sin permiso

No crear la marca ni `settings.local.json` en su checkout. Si existe alguno, borrarlo (acción de Sergio).

### D. Nubes (Plataforma, Hermes, Lucía, Marca, Ventas): sin cambios

Siguen en `claude/autosync-<id>`. El integrador (`onia-cola`) las revisa y mergea.

### E. Documentos con la marca dada por hecha

Corregir `CLAUDE.md:482-483`, `hermes-content/docs/handoff/hermes-jarvis.md:40-75` y `.claude/skills/onia-sesion-madre/SKILL.md:201-205` para decir "pendiente hasta medir la marca en el checkout de la madre", no "puesta el 9-oct". Edición de documento, no de config.

## Quién la aplica

| Cambio | Quién | Por qué |
|---|---|---|
| Crear la marca y `settings.local.json` en el checkout de la madre DESARROLLO-INFRA | **Sergio Urcullo** (o la madre con su OK explícito) | Configuración persistente que da permiso de main. CLAUDE.md la reserva a la madre de SU PC y no se versiona. |
| Aceptar el riesgo de main sin tsc en la madre (o limitarla a no tocar `web-factory/apps/site`) | **Sergio Urcullo** | Decisión de riesgo sobre la regla "main siempre compila". Debe quedar por escrito. |
| Confirmar que MARKETING no tiene marca ni `settings.local.json` | **Sergio Urcullo** (verificar) | Decisión de reparto de permisos. Hoy medido: no tiene. |
| Corregir los tres documentos que dan la marca por puesta | **madre DESARROLLO-INFRA** | Edición de docs dentro de su carril; no toca el repo de producto. |
| Decidir registrar o descartar `subagente-con-modelo.mjs` | **Sergio Urcullo** | Su comentario exige aprobación explícita. |
| Commitear `.claude/hooks/` si se aprueba | **integrador** (onia-cola) | Única sesión autorizada a mover main; la madre no hace git en encargos Codex. |
| Confirmar cwd del hook Stop y si Claude Code muestra su error | **madre DESARROLLO-INFRA** (medir en una sesión de la PC) | Solo lectura y una prueba; no toca el repo. |
| Confirmar si la nube exporta `ONIA_LOOP_ID` | **madre DESARROLLO-INFRA** (consulta) | Solo lectura; no toca el repo ni el VPS. |

## Prueba de hecho

1. Marca: `Test-Path (Join-Path (git rev-parse --absolute-git-dir) 'onia-autosync-main')` → `True` solo en el checkout de la madre DEV. `False` en MARKETING y en los demás (los 25 medidos hoy dan `False`).
2. Ignorado: `git check-ignore -v .claude/settings.local.json` → coincide con `.gitignore:93`.
3. Variable: en la madre DEV aparece `ONIA_AUTOSYNC_MAIN=1` (solo el nombre, sin imprimir valor). En MARKETING no aparece.
4. Sin marca pero con variable: el log del Stop muestra `permiso de main ignorado: este checkout no tiene la marca` (`git-autosync.js:47`).
5. Real, en la PC, con un commit de prueba de la madre DEV (no ejecutado en esta versión):
   - Parada en main con permiso: log `[autosync] push -> origin/main`.
   - Parada en main sin permiso: log `[autosync] en main, nada nuevo; main no se toca` o `main solo avanza por PR revisado: tus commits quedaron en origin/claude/autosync-...`.
   - En rama de trabajo con permiso: log `[autosync] main al día (fast-forward)`, o `main divergió de la rama`, o `Rama pusheada, main SIN avanzar.`
   - En rama de trabajo sin permiso: log `main no se toca: entra por PR revisado`.
6. Gate tsc: con cambios en `web-factory/apps/site`, el comando del punto B da exit 0 antes del push. Sin tsc verde, la madre no pushea a main.
7. Test: `node scripts/loops/pedido-rama.test.mjs` pasa (usa clones temporales). Pendiente de ejecutar por la madre.
8. Cwd del Stop: desde un subdirectorio de la PC, un Stop real con el hook registrado produce el log `[autosync]` (si no, el error de `node` queda visible en la sesión). Esto cierra la brecha 6.

## Límites

- No ejecuté `git-autosync.js`, el test ni ningún push (podrían escribir en GitHub o fuera del worktree).
- Ejecuté `node` sobre un script inexistente desde `hermes-content/` solo para medir el código de salida (1). No escribe nada.
- No leí valores de variables ni contenido de llaves. Solo nombres.
- No sé qué checkout usa la madre de desarrollo-infra, ni cwd de los hooks, ni si la nube exporta `ONIA_LOOP_ID`, ni si los clones del VPS tienen `core.hooksPath`. Todo UNKNOWN.

## Cambios respecto a la versión anterior

- Prueba 5: el criterio de main con permiso ya no espera `main al día (fast-forward)`; ese log solo aparece en ramas de trabajo (`:251-260`). En main el log es `push -> origin/main`.
- Riesgo de gate tsc de la madre con permiso: añadido como brecha 2, con mitigación en B.
- Cwd del hook: el mecanismo corregido es error de `node` con código 1 (medido), no silencio del script.
- Origen de `ONIA_LOOP_ID`: `scripts/loops/onia-loop.sh:268`, no `git-autosync.js:31` (que es comentario). El permiso depende del nombre del loop.
- Guarda de merge: `git-autosync.js:196-201`.
- Marca: re-medida en los 25 checkouts de hoy (la versión anterior decía 26). Documentos que la dan por puesta: añadidos.
- `.githooks/pre-push`: añadido. No activo en la PC (`core.hooksPath` vacío).

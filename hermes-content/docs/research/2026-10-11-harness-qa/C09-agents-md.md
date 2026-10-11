# C09 - AGENTS.md para Codex en cada repo (11-oct-2026, revisado tras verificador)

## Estado medido

Fuentes leidas: `AGENTS.md` raiz de onia-hermes (295 lineas) y `AGENTS.md` de onia-platform (rama master, via `gh api ... contents/AGENTS.md`, solo lectura). Leyenda: OK = dicho explicito; PARCIAL = dicho pero incompleto o contradictorio; NO = ausente.

| Requisito | onia-hermes `AGENTS.md` | onia-platform `AGENTS.md` (master) |
|---|---|---|
| No hacer git | PARCIAL. L35: "no mergeás ni empujás" y L110: "Esto no amplía el encargo de Codex: no hace Git ni publica por su cuenta". Pero L104-105 ("commitear y pushear cuando el arbol este coherente") y L158-159 ("hacer commit y push") mandan lo contrario a Codex. Nada prohibe las consultas git (status/diff/log). | PARCIAL. L70: "Do not run `git push`, `git reset`, `git clean`" (sin prohibir commit ni consultas). L16: "Check the current repo state with `git status --short --branch`" (exige git como primer paso). |
| Terminar con `PARA LA MADRE:` | PARCIAL. L38: "en el resumen escribí «PARA LA MADRE: …»" solo si la tarea no es la mejor opcion. No es cierre obligatorio. `grep -c "PARA LA MADRE" AGENTS.md` = 1. | NO. `grep -c "PARA LA MADRE"` = 0. L116 pide "Suggested commit message." como cierre. |
| Suite indicada | NO. Ningun comando de suite en el archivo. La raiz de onia-hermes tiene `npm test` (package.json: cadena larga de `node --test`). Duracion no medida (UNKNOWN). | PARCIAL. L83-88 lista `git diff --check`, `npm test`, `git status` sin decir cual es obligatoria. package.json: `lint`=eslint, `typecheck`=`tsc --noEmit`, `test`=`vitest run`, `build` = prisma generate + next build (pesado). |
| Usted con clientes | OK. L36 (bloque Codex) y L85 ("Clientes y prospectos: de usted"); L290 lo repite en skills. | NO. `grep -c usted` = 0. |
| No secretos | OK. L17, L162 (y L255 "No imprimir secretos completos"). | OK. L71 "Do not expose secrets in code, docs, logs, commits or chat." |
| main siempre compila | NO. Solo L293 "Nada llega a main sin revision". | NO. Sin mencion. |
| Skills de Codex | OK. Tabla de skills y fuente `.claude/skills/` (L267-290); incluye `onia-platform/.claude/skills/onia-*` y equipo. | PARCIAL. L31 y L101 remiten a `docs/SKILLS_BEFORE_ACTION.md`. Sin mencion de `.claude/skills/onia-*` del producto ni de equipo-de-agentes. |

Otros hallazgos medidos:
- onia-platform: `git/trees/master?recursive=1` (truncated=false) muestra un solo `AGENTS.md`, en la raiz. No hay AGENTS.md en subcarpetas.
- onia-platform: las seis skills `.claude/skills/onia-{frontend,backend,db,seguridad,deploy,verificacion}` existen en master (verificado por el verificador).
- onia-hermes: `codex-relevo.md` EXISTE en `hermes-content/docs/handoff/codex-relevo.md`. La cola vigente tambien existe: `hermes-content/docs/handoff/codex-tareas/` (README.md y _PLANTILLA.md, sin commit al 11-oct).
- onia-hermes: L290 y L293 de skills describen el contrato de Codex; L267-290 lista las skills.
- `scripts/codex-tarea.sh` ya dice que Codex no commitea (no se vuelve a leer en esta tarea).
- No se ejecuto Codex. No se escribio en ningun repo. Sin escritura fuera del worktree.

## Brecha

1. Codex recibe dos mensajes opuestos sobre git en onia-hermes: L110 (no hace Git) frente a L104-105 y L158-159 (commit y push). Gana el que mas se lee; hay que quitar la contradiccion.
2. Ningun AGENTS.md exige el cierre `PARA LA MADRE:`; onia-platform pide un "Suggested commit message" que choca con el rol Codex.
3. Ningun AGENTS.md fija una suite obligatoria con comando verificado para Codex antes de cerrar.
4. onia-platform no dice "usted" ni "main siempre compila" ni remite a las skills de equipo.
5. onia-hermes no dice "main siempre compila" y su cola apunta a un archivo viejo (`codex-relevo.md`) en vez de `codex-tareas/`.

## Configuracion propuesta

### A) onia-hermes `AGENTS.md`

A1. Insertar justo antes de la linea `## Orden principal`:

```md
## Contrato duro de Codex (prevalece sobre el resto de este archivo)

- **Cero Git**: ni commit, push, checkout, stash, ni consultas (`status`, `diff`, `log`). Las reglas de
  "commitear y pushear" de abajo son de la madre, no tuyas. La madre revisa la carpeta y commitea.
- **Suite**: antes de cerrar corre la suite que nombre tu encargo. Si no nombra ninguna, `npm test` de la
  raiz. Reporta exit code. Verde = exit 0; no uses `| tail` para decidir.
- **main siempre compila**: si un archivo nuevo importa otro nuevo, entregas los dos o ninguno. No dejes
  el arbol a medias al parar.
- **Secretos**: nunca imprimas ni escribas tokens, cookies, claves; nombra solo la variable y el archivo.
- **Clientes y prospectos: de usted.** Marca personal: vos.
- **Skills**: antes de empezar lee el `.claude/skills/<skill>/SKILL.md` que aplique (tabla de abajo).
- **Cierre obligatorio**: la ultima linea de tu respuesta final empieza con `PARA LA MADRE:` y dice
  (1) que quedo hecho y verificado, (2) que bloqueo o alternativa hay, (3) que archivos tocaste.
```

A2. Matizar las dos reglas de commit (cambio de una frase cada una, sin borrar la regla de la madre):

```diff
-  editar docs/codigo, crear runbooks, correr tests, preparar scripts, commitear
-  y pushear cuando el arbol este coherente.
+  editar docs/codigo, crear runbooks, correr tests, preparar scripts; la madre
+  commitea y pushea cuando el arbol este coherente (Codex no hace Git).
```
```diff
-- Despues de cambios productivos, validar, hacer commit y push cuando el arbol
-  este en un estado coherente.
+- Despues de cambios productivos, validar; la madre hace commit y push cuando el
+  arbol este en un estado coherente (Codex no hace Git).
```

A3. Apuntar la cola a la vigente:

```diff
-- La cola de tareas de Codex esta en `hermes-content/docs/handoff/codex-relevo.md`.
+- La cola de tareas de Codex esta en `hermes-content/docs/handoff/codex-tareas/` (README y _PLANTILLA).
```

### B) onia-platform `AGENTS.md` (PR a master, no push directo)

B1. Agregar al final del archivo:

```md
## Si eres Codex (ejecutor de la madre de Onia)

- **Cero Git** (ni consultas): omite el `git status` de "Required First Pass" y el "Suggested commit
  message" de "Final Response Shape". La madre commitea y empuja.
- **Suite obligatoria antes de cerrar**: `npm run typecheck` y `npm test`; `npm run lint` si tocaste TS/TSX;
  `npm run build` solo si tocaste config, rutas o dependencias (pesado: prisma + next build). Reporta el exit code.
- **main siempre compila**: sin imports a archivos que no entregas. `main` alimenta el deploy del VPS.
- **Copy de cliente**: espanol de Bolivia, tratando de **usted** a clientes y prospectos.
- **Secretos**: nunca los imprimas; solo nombre de variable y archivo.
- **Skills del producto** (lee la que aplique): `.claude/skills/onia-frontend`, `onia-backend`, `onia-db`,
  `onia-seguridad`, `onia-deploy`, `onia-verificacion`. Las de equipo (`equipo-de-agentes`, `aprender-de-todo`)
  viven en el repo onia-hermes (`.claude/skills/`).
- **Cierre obligatorio**: la ultima linea de tu respuesta es `PARA LA MADRE:` con hecho/verificado, bloqueos
  y archivos tocados.
```

B2. Reemplazar los dos pasos que contradicen a Codex (texto literal de master):

```diff
-2. Check the current repo state with `git status --short --branch`.
+2. Check the current repo state with `git status --short --branch` (Codex: omitir, ver "Si eres Codex").
```
```diff
-- Suggested commit message.
+- Suggested commit message (Codex: omitir; cerrar con `PARA LA MADRE:`).
```

## Quien la aplica

- **A (onia-hermes)**: madre-desarrollo-infra. Es el harness y el repo de la madre; la madre commitea. Codex no lo toca.
- **B (onia-platform)**: madre-desarrollo-infra ordena a la sesion nube Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C) que lo haga por PR. Razon: es el repo del producto y su carril es el dueno de ese archivo; la madre no edita el repo de otro carril. El integrador solo mergea el PR. No la aplica la madre-marketing.
- Sergio Urcullo: nada, salvo que quiera revisar el PR (la regla "lo revisado se sube" del CLAUDE.md aplica).

## Prueba de hecho

1. `grep -c "PARA LA MADRE" AGENTS.md` en onia-hermes da >= 2 (hoy 1).
2. `gh api repos/oninteligenciaartificial/onia-platform/contents/AGENTS.md?ref=master --jq .content | base64 -d | grep -c "PARA LA MADRE"` da >= 2 (hoy 0). Se corre sobre el PR abierto, no sobre master.
3. `grep -n "Contrato duro de Codex"` en onia-hermes y `grep -n "Si eres Codex"` en el PR de platform encuentran el bloque.
4. `grep -n "codex-relevo" AGENTS.md` da 0 lineas en la seccion de cola.
5. Opcional, con permiso de la madre: una tarea trivial a Codex; su respuesta termina en `PARA LA MADRE:`. Esta C09 no ejecuto Codex (UNKNOWN hasta esa corrida).

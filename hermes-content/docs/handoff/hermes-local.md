# Handoff — hermes-local (Hermes Agent en la PC, dentro de Orca)

**Objetivo**
Dejar a Hermes local configurado una sola vez como coordinador que lee las reglas y skills de ONIA, no se salta permisos y aprende por PR. Hecho = Hermes arranca desde un worktree limpio, `/context` muestra el AGENTS.md acordado, el índice de skills nombra las de `.claude/skills`, un `git -C . push` sale bloqueado y `--dry` de
`scripts/orquesta/cargar-issue.mjs` muestra `necesita-ok`.
Estado al 26-oct, 20:00: **PR #269 mergeado (`4fd5f64f`) y `aplicar.ps1 -EscrituraSegura -Codex` corrido a las
19:56.** Respaldo para volver atrás: `%LOCALAPPDATA%\hermes\backups\pre-orden-20261026-195633` (`revertir.ps1 -Respaldo …`).
Medido después, sin abrir la TUI:
- `probar-deny.py --vivo`: «mismo approvals.deny», 173 bloqueos, 41 lecturas, 0 fallas.
- `hermes skills list` en `E:\onia-wt\hermes-base`: 65 skills `external` del repo, sin `onia-sesion-madre`.
- `build_context_files_prompt(cwd=hermes-base)`, con el python de Hermes: carga el `AGENTS.md` del 26-oct y no
  `CLAUDE.md`; `load_soul_md()` trae el SOUL nuevo.
- `cargar-issue.mjs --dry` desde `hermes-base`: pone `orquesta`, `carril:investigacion`, `origen:hermes` y
  `necesita-ok`, y no crea nada.

Falta la prueba con la TUI abierta (`/context`) y la primera tarea real.

⚠️ **La TUI arranca con `gpt-6-astra-900k` aunque `config.yaml` diga `gpt-6.1-sol`** (medido 26-oct, 21:10: el
banner de `hermes --tui` decía astra, sin variables `HERMES_INFERENCE_*`). Causa sin encontrar. Mientras tanto se
abre con `hermes --tui -m gpt-6.1-sol --provider openai-codex`, que sí muestra Sol. La auditoría completa está en
`hermes-content/docs/research/2026-10-26-auditoria-hermes-local.md`.

Lo que decidió Sergio Urcullo el 26-oct:
1. **Manda un AGENTS.md nuevo y compacto.** Se armó desde la reescritura de Hermes, sacándole lo que se había
   autorizado a sí mismo («piloto de Orca»), y se le sumaron: quién hace qué, qué fuente manda, cuándo parar y los
   casos de CLAUDE.md.
2. **Planifica el Hermes de la PC; el del VPS avisa.** El del VPS carga una tarea solo cuando él se la dicta. El de la
   PC carga siempre con `origen:hermes` y `necesita-ok`; el del VPS, también, salvo `nube` con `check: urls`, hasta
   el PR del paso 5 de §7 de `ONIA_HARNESS.md`. Hay una sola cola: Orca Orchestration, `.hermes/plans` y los goals
   dejan de serlo.

En el PR quedaron:
- `AGENTS.md` y `CLAUDE.md` §«Quién orquesta».
- `hermes-content/deploy/hermes-pc/{SOUL.md,config.onia.yaml}`.
- `hermes-content/deploy/codex/AGENTS.global.md`.
- `hermes-content/docs/ONIA_HARNESS.md`, reescrito: el mapa de archivos, el flujo de un encargo y qué se queda,
  sale y falta.
- La fila «Cerebro» de `scripts/orquesta/README.md`.
- `scripts/orquesta/cargar-issue.mjs` con su prueba: las barandas del VPS portadas a la PC.
- La skill `equipo-de-agentes` reescrita sin la madre.

Una revisión independiente encontró que el primer `approvals.deny` se esquivaba con `git -C x push` y con `git.exe`,
y que con un `gh issue create` suelto un `check: cmd` corría sin sandbox en la PC. El `deny` se rehízo con patrones
probados contra la lógica real de Hermes, y la carga pasó al cargador.

Lo que sigue abierto: el `deny` no resuelve alias ni variables, no frena `write_file` (por eso
`HERMES_WRITE_SAFE_ROOT`) y no se sabe si lo heredan los hijos.

**Qué quedó EN PRODUCCIÓN**
Nada en producción. Cambios en la PC, fuera del repo, hechos el 26-oct:
- Reglas globales: se mantienen las 6 que tocó Hermes; tres perfiles token-eficiente y el README pasaron a
  `~/.claude/rules-archivo/20261026`; las reglas web cargan solo con archivos de interfaz.
- Se archivaron 15 skills personales viejas en `~/.claude/skills-archivadas-20261026`.
- Se borraron 178 ramas locales ya mergeadas. Los nombres y los SHA están en
  `E:/respaldo-ramas-mergeadas-20261026.txt`, por si hay que recrearlas.

**Qué quedó a medias, y dónde**
- **Checkout principal (paso 0): limpio.** Sergio Urcullo corrió `E:\onia-wt\limpiar-checkout-principal.ps1` el
  26-oct. Antes se re-verificó que sus 30 cambios trackeados y los 96 archivos a borrar seguían iguales en
  `rescate/checkout-principal-20261026`. Quedan sin trackear, a propósito, `.hermes/plans`, `.hermes/tasks`,
  `references/formacion` y `harness-hermes-20261024/panel-ejecucion`: el `.gitignore` de `main` ya los ignora.
- **Tarea programada:** sigue la vieja (`… & set ORQUESTA_TELEGRAM=1 && …`, medido 19:45). La reinstala él con el
  comando de `scripts/orquesta/README.md` §«Correr».
- **Worktrees.** `E:\onia-wt\limpiar-worktrees.ps1` corría a las 20:00 (C: pasó de 33 a 85 GB libres).
  - Sus «Falló mover … (código 9)» no perdieron nada: las seis carpetas quedaron enteras en
    `E:\archivo-worktrees-20261026` y eran casi todo `node_modules` (de 25 a 3.026 archivos fuera de él). Ver
    «Intentos fallidos».
  - `web-v1-revision` y `confident-dirac-a1b422` quedaron sin registrar, con unos 540 MB cada una de
    `web-factory/node_modules` más copias de archivos de Git. Se borran con `cmd /c rd /s /q "\\?\<ruta>"`.
  - `onia-hermes-contenido` no se rescató: tiene clips de Lucía de más de 5 MB. No lo toca ningún script.
- El VPS sigue sin el cambio del paso 5 de §7 (PR propio de `aplicar.sh`).

**Archivos y cambios**
- Home de Hermes: `C:/Users/PC/AppData/Local/hermes` (config.yaml, SOUL.md de fábrica, memories/USER.md, skills/onia con 2 skills creadas por él). `C:/Users/PC/.hermes` lo escribe Orca y Hermes no lo lee.
- Orca lanza `hermes --tui --yolo` con `Set-Location C:/dev/proyectos/onia-hermes`. Hay dos TUI vivas sobre la misma home.
- El portal es `hermes dashboard --no-open` → `http://127.0.0.1:9119` (entrada `hermes-dashboard` en `.claude/launch.json`).

**Intentos fallidos**
- Hermes con Claude como proveedor (`claude-opus-5-5`, `claude-sonnet-4-6`, 21 y 22-oct): falló el refresh de OAuth, y además la vía Max solo gasta créditos de *extra usage*. No reintentar (onia-router: «el token de Max en Hermes» va en No usar).
- Delegar a hijos `gpt-6-luna` con `max_iterations: 40`: cortó los guiones, que fueron rechazados.
- Hipótesis falsa: que `skills.external_dirs` es de solo lectura. Es escribible (`skills.md:424-425`), y por eso hace falta `skills.write_approval: true` (el orden de las claves en el YAML no importa).
- Hipótesis falsa: que hay 16 skills divergentes entre `.agents/skills` y `.claude/skills`. La diferencia real es 1 SKILL.md y 1 referencia; el resto es CRLF.
- **`robocopy /E /MOVE` sin `/XJ` sigue las junctions de pnpm, también las que salen de la carpeta** (26-oct). Los
  `node_modules` de los worktrees huérfanos tenían junctions con ruta absoluta a los paquetes del checkout principal.
  `limpiar-worktrees.ps1` movió así 490 archivos versionados de `web-factory/apps/onia-platform`,
  `apps/dentalgest-landing` y `packages/templates` del checkout principal a
  `E:\archivo-worktrees-20261026\cta-home\web-factory\node_modules\…`. Se restauraron con `git restore`; lo no
  versionado que se fue a E: es solo build (`.next`, `tsbuildinfo`, `next-env.d.ts`, un `node_modules` chico). El
  «código 9» (8 = algo falló + 1 = copió) sale por eso. **Para mover carpetas con `node_modules`: `/XJ` siempre**, y
  después de mover, `git status` en todo checkout que pudiera ser destino de una junction.
- **El hook Stop de la sesión commiteó en el checkout principal** (26-oct, 19:46). Recién limpio, ya no tenía los
  archivos `C:Users…` que hacían fallar `git add -A`, así que el autosync commiteó lo que seguía sin trackear
  (`.hermes/plans`, `.hermes/tasks`, los originales del curso de `references/formacion` y `panel-ejecucion`), dejó el
  checkout parado en `claude/autosync-e24cb7a5-…` y la pusheó (`b185a4e4`, 56 archivos, sin secretos según el
  barrido). Se volvió a `main` con `symbolic-ref` + `reset --mixed` (sin tocar archivos) y `pull`; con el
  `.gitignore` de `main` esos archivos ya quedan ignorados. La rama se borró de GitHub y de la PC el 26-oct, con el
  OK de Sergio Urcullo. Falta que `git-autosync.js` no actúe nunca en el checkout que usa la tarea programada (PR
  propio, junto con sacar la excepción del integrador).
- Comparar el árbol de un worktree contra su rama de rescate con un índice temporal (`read-tree` + `add -A` +
  `write-tree`) da «cambió» en falso si el HEAD avanzó por un pull o si el worktree es sparse. Lo que vale es
  comparar por archivo lo que el script descarta: `git status` y `hash-object` contra la rama de rescate.

**Qué depende de Sergio**
1. ~~Qué AGENTS.md manda~~ y ~~el rol de cada Hermes~~: decididos el 26-oct (arriba). Falta que apruebe el PR.
2. Despachar `aplicar` en el VPS para pausar la revisión de cada 3 h y poner el SOUL nuevo (el control de permisos
   frena ese despacho desde una sesión).
3. Orca: Hermes corre ahí solo con Agent permissions en Manual y abierto en `hermes-base`; Orchestration queda apagado (sale de la decisión 2). Falta Workspace Directory en
   E:, la telemetría apagada y la regla de firewall del puerto 6768 solo en el perfil Privado.
4. ~~Reglas globales y `~/.codex/config.toml`~~: se mantienen (26-oct). Lo de Hermes era mejor que lo anterior.
7. ~~Correr los dos scripts de limpieza, mergear #269 y correr `aplicar.ps1`~~: hecho el 26-oct. Falta reinstalar
   la tarea programada, borrar las dos carpetas que quedaron y, en Orca, poner Settings → Agents → Agent
   permissions en **Manual** (sin eso abre a Hermes con `--yolo`).
8. ~~Cerrar el PR #226~~: hecho el 26-oct con su OK, junto con otros 12 PR de la época madre (#143, #195, #199,
   #201, #202, #204, #206, #221, #227, #228, #229, #232) y el issue #268. Se borraron 32 ramas remotas que ya estaban
   en `main`; las `rescate/*` quedan. El #265 (los trabajadores leen el handoff y dejan «## Aprendido») **no** se
   cerró: sirve y está por revisar.
10. Decidido el 26-oct: cuenta bot de GitHub y usuario de Windows propio para Hermes (los crea él; la guía sale del
    informe de aislamiento). Túnel SSH solo con 3108 (PR #271).
9. Sacar del autosync la excepción del integrador apagado (`scripts/git-autosync.js:43`), en un PR propio con su prueba.
5. La protección de la rama `main` en GitHub. Medido el 26-oct: en un repo privado del plan gratis la API responde
   «Upgrade to GitHub Pro». Es un gasto (4 USD por mes según el FAQ de planes de GitHub, que es de 2020: confirmar el monto en Settings → Billing), así que lo decide él; mientras tanto, la barrera es local.
6. Cerrar una de las dos TUI.

**Próximos pasos**
**El orden y la prueba de cada paso son los de `ONIA_HARNESS.md` §7, del 0 al 8.** La §10 de la auditoría queda
solo como referencia de comandos y de cómo volver atrás. Lo que cambió respecto de ella:
- la skill `onia-coordinar` no se hace, porque `AGENTS.md` y el SOUL alcanzan;
- el contrato único está en `AGENTS.md` §4;
- el PR de A4 es este.

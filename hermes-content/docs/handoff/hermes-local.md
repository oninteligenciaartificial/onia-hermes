# Handoff — hermes-local (Hermes Agent en la PC, dentro de Orca)

**Objetivo**
Dejar a Hermes local configurado una sola vez como coordinador que lee las reglas y skills de ONIA, no se salta permisos y aprende por PR. Hecho = Hermes arranca desde un worktree limpio, `/context` muestra el AGENTS.md acordado, el índice de skills nombra las de `.claude/skills`, un `git -C . push` sale bloqueado y `--dry` de
`scripts/orquesta/cargar-issue.mjs` muestra `necesita-ok`.
Estado al 26-oct: **auditoría hecha, decisiones tomadas y todo escrito en un PR en borrador. La configuración no
se aplicó.** La auditoría completa está en `hermes-content/docs/research/2026-10-26-auditoria-hermes-local.md`.

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
Nada. No se cambió ni la config de Hermes ni la de Orca ni ningún archivo de reglas.

**Qué quedó a medias, y dónde**
- Nada de esta sesión. Rama `claude/hermes-orca-config-b2d5eb` (worktree `onia-madre-v2-pr-review-2d85bb`) con la auditoría, este handoff y la skill `orca` actualizada.
- **Lo que está en vuelo y es de Hermes, no nuestro:** en el checkout principal `C:/dev/proyectos/onia-hermes` (rama `main`) hay 51 cambios sin commitear. Entre ellos están AGENTS.md (9.929 B; en origin/main pesa 17.995 B), CLAUDE.md, COORDINATION_MANIFEST, EXECUTION_PROTOCOL y 5 skills que Hermes reescribió el 25-oct, y el hook Stop de autosync borrado. **Si alguien hace `git checkout -- .` o `git stash` ahí, se pierde.** Los originales están en `%LOCALAPPDATA%\hermes\backups\depuracion-instrucciones-20261025-102255` (con `manifest.json`).
- Reglas globales de Claude reescritas por Hermes el 25-oct 11:00, fuera de Git: `~/.claude/rules/common/{agents,code-review,testing,git-workflow,development-workflow,performance}.md`. Los originales están en el mismo respaldo, como `global-rule-*.md`.

**Archivos y cambios**
- Home de Hermes: `C:/Users/PC/AppData/Local/hermes` (config.yaml, SOUL.md de fábrica, memories/USER.md, skills/onia con 2 skills creadas por él). `C:/Users/PC/.hermes` lo escribe Orca y Hermes no lo lee.
- Orca lanza `hermes --tui --yolo` con `Set-Location C:/dev/proyectos/onia-hermes`. Hay dos TUI vivas sobre la misma home.
- El portal es `hermes dashboard --no-open` → `http://127.0.0.1:9119` (entrada `hermes-dashboard` en `.claude/launch.json`).

**Intentos fallidos**
- Hermes con Claude como proveedor (`claude-opus-5-5`, `claude-sonnet-4-6`, 21 y 22-oct): falló el refresh de OAuth, y además la vía Max solo gasta créditos de *extra usage*. No reintentar (onia-router: «el token de Max en Hermes» va en No usar).
- Delegar a hijos `gpt-6-luna` con `max_iterations: 40`: cortó los guiones, que fueron rechazados.
- Hipótesis falsa: que `skills.external_dirs` es de solo lectura. Es escribible (`skills.md:424-425`), y por eso `write_approval: true` va ANTES.
- Hipótesis falsa: que hay 16 skills divergentes entre `.agents/skills` y `.claude/skills`. La diferencia real es 1 SKILL.md y 1 referencia; el resto es CRLF.

**Qué depende de Sergio**
1. ~~Qué AGENTS.md manda~~ y ~~el rol de cada Hermes~~: decididos el 26-oct (arriba). Falta que apruebe el PR.
2. Despachar `aplicar` en el VPS para pausar la revisión de cada 3 h y poner el SOUL nuevo (el control de permisos
   frena ese despacho desde una sesión).
3. Orca: Hermes ya no corre ahí y Orchestration queda apagado (sale de la decisión 2). Falta Workspace Directory en
   E:, la telemetría apagada y la regla de firewall del puerto 6768 solo en el perfil Privado.
4. Mantener o revertir las 6 reglas globales y `~/.codex/config.toml` que tocó Hermes.
5. La protección de la rama `main` en GitHub. Medido el 26-oct: en un repo privado del plan gratis la API responde
   «Upgrade to GitHub Pro». Es un gasto, así que lo decide él; mientras tanto, la barrera es local.
6. Cerrar una de las dos TUI.

**Próximos pasos**
**El orden y la prueba de cada paso son los de `ONIA_HARNESS.md` §7, del 0 al 8.** La §10 de la auditoría queda
solo como referencia de comandos y de cómo volver atrás. Lo que cambió respecto de ella:
- la skill `onia-coordinar` no se hace, porque `AGENTS.md` y el SOUL alcanzan;
- el contrato único está en `AGENTS.md` §4;
- el PR de A4 es este.

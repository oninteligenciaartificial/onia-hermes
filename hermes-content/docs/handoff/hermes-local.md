# Handoff — hermes-local (Hermes Agent en la PC, dentro de Orca)

**Objetivo**
Dejar a Hermes local configurado una sola vez como coordinador que lee las reglas y skills de ONIA, no se salta permisos y aprende por PR. Hecho = Hermes arranca desde un worktree limpio, `/context` muestra el AGENTS.md acordado, el índice de skills nombra las de `.claude/skills` y un `git push` le pide aprobación.
Estado al 26-oct: **auditoría hecha, configuración NO empezada.** La auditoría completa está en `hermes-content/docs/research/2026-10-26-auditoria-hermes-local.md`.

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
1. Qué AGENTS.md manda: el de origin/main, la reescritura de Hermes o uno compacto nuevo. Es la decisión central: el resto se apoya en ella.
2. El rol de Hermes local frente al Hermes del VPS. Hoy ninguna regla lo nombra y hay dos planificadores.
3. Orca: si Hermes sigue corriendo ahí. Si sí: permisos en Manual (sin `--yolo`), Workspace Directory en E: y la telemetría apagada. Además, la regla de firewall del puerto 6768 solo en el perfil Privado.
4. Mantener o revertir las 6 reglas globales y `~/.codex/config.toml` que tocó Hermes.
5. La protección de la rama `main` en GitHub (exigir PR).
6. Cerrar una de las dos TUI.

**Próximos pasos**
Los pasos A1 a A5, B1 a B9 y C1 a C9 de la sección 10 de la auditoría, en ese orden. Listo cuando:
- A1 (respaldo de config, SOUL y USER) y A2 (bundle de las ramas que solo existen en local): los archivos existen en disco.
- A3 (worktree base `E:/onia-wt/hermes-base` sobre origin/main): `git worktree list` lo muestra.
- A4 (PR en borrador con AGENTS.md compacto, SOUL ONIA, la skill `onia-coordinar` y el contrato único): el PR abierto, con el enlace mandado a Sergio Urcullo.
- B3 (config.yaml): Hermes arranca, `/context` lo confirma y `git push` le pide aprobación.

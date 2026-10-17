@AGENTS.md

# Solo Claude Code

- **Skills con la herramienta Skill**, no leyendo el archivo: `onia-router` es la primera llamada de cada sesión y rutea a la del carril. En la nube, tras el `cd` al repo (PASO 0 de AGENTS). Las reglas nuevas se editan en `AGENTS.md`.
- **`onia-platform`:** al tocar el producto son OBLIGATORIAS `onia-frontend`, `onia-backend`, `onia-db`, `onia-seguridad`, `onia-deploy` y `onia-verificacion`; se autolistan solo en sesiones abiertas dentro de ese repo (desde `onia-hermes`, leer su `SKILL.md`).
- **Hook Stop** (`node scripts/git-autosync.js`): al soltar el turno commitea y pushea la RAMA. Por eso cada turno deja el árbol compilando y sin conflictos; el hook no autoriza publicar.
- El hook no hace fast-forward de `main`; solo la madre lo tiene, con `ONIA_AUTOSYNC_MAIN=1` en el `.claude/settings.local.json` de su carpeta y la marca `onia-autosync-main` en su git-dir. Ese permiso nunca va en `.claude/settings.json` ni en variables de la PC (`scripts/loops/pedido-rama.test.mjs` lo vigila). Una sesión en `main` sin permiso pushea a `claude/autosync-<id>`.
- **Subagentes:** `model` explícito en toda tarea (AGENTS «Modelo por rol»), worktree con ruta explícita, `git branch --show-current` primero y `git -C <ruta>` (el shell vuelve al directorio primario).
- No delegar a un subagente la lectura de una skill que el agente principal necesita cumplir.
- **Revisión:** agente `code-reviewer` después de escribir código; `security-reviewer` en los casos de AGENTS «Seguridad».
- **Conectores y rutinas:** AGENTS §5 (Higgsfield y Meta Ads no se conectan a rutinas automáticas).
- **Workflows** (herramienta Workflow): solo cuando Sergio Urcullo optó por uno; antes cargar la skill `workflow-authoring`; cada paso con `model` explícito y una salida verificable.
- **Colas:** `/loop` sin intervalo con «Trabajá tu cola `hermes-content/docs/cola/loop/<carril>.md`»; si `/loop` no existe, la siguiente tarea empieza en el mismo turno.
- **Plan visible** en la app (lista de tareas) con estado y criterio de hecho de cada tarea.
- **Qué se le consulta y qué se le cuenta a Sergio Urcullo:** AGENTS «Quién decide» (§4).
- Antes de decir «no puedo», `ToolSearch` de los MCP conectados.
- **Bash:** rutas absolutas; verificar con el exit code, nunca con `| tail`.

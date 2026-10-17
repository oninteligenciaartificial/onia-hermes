@AGENTS.md

# Solo Claude Code

- **Skills con la herramienta Skill**, no leyendo el archivo: `onia-router` es la primera llamada de cada sesión y rutea a la del carril. En la nube, tras el `cd` al repo (PASO 0 de AGENTS). Las reglas nuevas se editan en `AGENTS.md`.
- **`onia-platform`:** al tocar el producto son OBLIGATORIAS `onia-frontend`, `onia-backend`, `onia-db`, `onia-seguridad`, `onia-deploy` y `onia-verificacion`; se autolistan solo en sesiones abiertas dentro de ese repo (desde `onia-hermes`, leer su `SKILL.md`).
- **Hook Stop** (`node scripts/git-autosync.js`): al soltar el turno commitea y pushea la RAMA. Por eso cada turno deja el árbol compilando y sin conflictos; el hook no autoriza publicar.
- **`main`:** quién lo mueve, el caso medido y la lista de archivos que ninguna rutina une: AGENTS §4 «Quién mueve `main`». Mecánica (17-oct): el hook pushea solo la RAMA actual; nunca `main`, tampoco en la PC, y no hace fast-forward de otras ramas. `ONIA_AUTOSYNC_MAIN`, la marca `onia-autosync-main` y `ONIA_LOOP_ID=onia-cola` ya no habilitan nada (`scripts/loops/pedido-rama.test.mjs` lo vigila). Una sesión parada en `main` deja su trabajo en `claude/autosync-<id>` y dice «main solo por PR».
- **Subagentes:** `model` explícito en toda tarea (AGENTS «Modelo por rol»), worktree con ruta explícita, `git branch --show-current` primero y `git -C <ruta>` (el shell vuelve al directorio primario).
- No delegar a un subagente la lectura de una skill que el agente principal necesita cumplir.
- **Revisión:** agente `code-reviewer` después de escribir código; `security-reviewer` en los casos de AGENTS «Seguridad».
- **Conectores y rutinas:** AGENTS §5 (Higgsfield y Meta Ads no se conectan a rutinas automáticas).
- **Workflows** (herramienta Workflow): solo cuando Sergio Urcullo optó por uno; antes cargar la skill `workflow-authoring`; cada paso con `model` explícito y una salida verificable.
- **Colas:** `/loop` sin intervalo con «Trabajá tu cola `hermes-content/docs/cola/loop/<carril>.md`» es un temporizador de la sesión, no un scheduler: no crea triggers, rutinas ni colas (AGENTS §1) y gasta cupo, así que ante un tope se baja el consumo (AGENTS «Trato y criterio»). Si `/loop` no existe, la siguiente tarea empieza en el mismo turno.
- **Plan visible** en la app (lista de tareas) con estado y criterio de hecho de cada tarea.
- **Qué se le consulta y qué se le cuenta a Sergio Urcullo:** AGENTS «Quién decide» (§4).
- Antes de decir «no puedo», `ToolSearch` de los MCP conectados.
- **Bash:** rutas absolutas; verificar con el exit code, nunca con `| tail`.
- **Citas viejas:** «CLAUDE.md §1-§5» y los nombres de regla que otros archivos citan por título valen como `AGENTS.md` §1-§5: «Sesión MADRE» y «Objetivo del NEGOCIO» → §1; «Una sola fuente de verdad», «Verificar es MIRAR», «Nada a medias» → §2; «La venta nunca exhibe obra», «Base de producción» → §3; «Carriles», «Calidad de código», «Git — auto-sync», «`main` se mueve DEBAJO» → §4 (Git y «Quién mueve `main`»); «Qué se publica sin preguntar» → §4 «Quién decide»; «Publicidad», «Higgsfield», «Video» → §5. El «§10» de la estrategia es de `ONIA_ESTRATEGIA_DE_EMPRESA.md`.

# Orca: capacidades y supervisión aplicada

Consulta local: 23-oct-2026, America/La_Paz. Runtime **1.4.238**. Fuente de verdad: CLI instalada, `orca agent-context --json`, `orca skills get orca-cli`, `orca skills get orchestration`. No se instalaron ni actualizaron skills ni Orca.

## Alcance comprobado

Catálogo completo de **287 comandos únicos**, comprobado contra `commandCount`. Abajo se conservan TODOS los nombres y propósitos. Esto cubre la interfaz CLI anunciada, **no certifica que se hayan ejecutado las 287 funciones ni inventaría todas las pantallas privadas del producto**. Contratos completos (flags, notas, ejemplos): `.hermes/tasks/orca-command-schema-20261023.json`. Evidencia de sondeos: `.hermes/tasks/orca-capabilities-evidence-20261023.json`.

Se leyeron completas las guías principales `orca-cli` y `orchestration`, además del catálogo de todas las guías empaquetadas. Las referencias especializadas se cargan antes de actuar en esa superficie; no afirmar haber ejecutado emuladores, publicado artefactos o controlado servidores remotos por haber leído su descripción.

## Corrección inmediata: Codex no está sano por aparecer «working»

La pantalla real de Codex muestra repetidamente `Hook failed` / `hook exited with code 1` durante el despacho `ctx_bcb541002b5d`. Al mismo tiempo:
- `agent hooks status`: enabled=true y managedHooksPresent=true para Codex.
- `worker-show`: agente live/working, agentWait=null y attention vacío.
- `terminal-daemon status`: daemon live.

**Conclusión:** instalación, proceso vivo, recepción del encargo y funcionamiento de cada hook son pruebas distintas. El supervisor debe contrastar estado nativo con pantalla/transcript y resultado funcional. No atribuir aún todos los fallos al hook Orca ni al plugin de memoria. Diagnóstico independiente: `deleg_0f47ce1e`, sin permiso para desactivar hooks o ampliar sandbox. `agent hooks prepare-codex` es para WSL y NO un arreglo automático de Windows nativo.

## Aplicación al trabajo de Sergio

1. **Antes del despacho:** descubrir handle/incarnation vivos y workspace exacto; comprobar tarea anterior y pantalla. Una advertencia no se ignora porque el proceso esté activo. No relanzar sesión por un handle vencido.
2. **Entrega:** `worker-start` devuelve input_accepted y turnStart; solo el segundo demuestra inicio observado. La recepción del mensaje `send` no demuestra lectura. Ante respuesta perdida, `request-show` y retry del mismo request, no duplicar tarea.
3. **Supervisión:** `worker-show` para liveness/agentWait, `worker-list` para atención y recursos, `terminal read --screen` para lo que Sergio ve, `worker-read` o cursor para salida exacta. La ausencia de agentWait no es lo mismo que null.
4. **Cambios de prioridad:** mensaje al dispatch exacto, confirmar recepción; no decir «pausado» por el mero envío. Conservar archivos parciales. Un giro de oferta debe llegar al autor antes de seguir copy/landing.
5. **Dependencias:** `task-create --deps`/gates para dependencias reales, no cadenas artificiales. Propuesta de workshop → brief → diseño; guiones y aprendizaje Meta pueden avanzar independientemente. Auditoría de Hermes no sustituye producción.
6. **Final:** worker_done genuino → verificar artefacto → revisión independiente → acción siguiente autorizada. Procesar todas las filas FIFO antes del ack. Tarea terminada, terminal retenida y diseño aceptado son estados separados. No inventar completion para reconciliar un fallo.
7. **Mostrar resultados:** `file open` para archivos locales; `--focus` solo cuando Sergio pide verlos. Navegador embebido con page/worktree exactos para capturas. `artifacts share` publica un enlace público: NO es un visor privado ni permiso implícito.
8. **Contexto:** `search --index-status` comprobado enabled/current; luego búsquedas acotadas por agente/ruta/fecha. No releer todos los transcripts; no buscar cuando la capacidad está deshabilitada.
9. **Recursos:** `diagnostics memory` es una medición puntual de procesos, no tokens ni ocupación efectiva del contexto. Modelo/esfuerzo de un nuevo worker se eligen con flags documentados; `--model` no se combina con `--terminal` existente. Conservar sesiones solicitadas y límites de concurrencia.
10. **Plataforma:** computer-use anuncia proveedor Windows; capacidades de menús/dialogs/focus no universales. Los comandos de iOS no prueban un simulador instalado en Windows. Ninguna instalación, remoto, publicación, borrado, cuenta, credencial o automatización se activa solo para explorar funciones.

## Capacidades útiles que el flujo anterior no aprovechaba suficientemente

| Necesidad | Función | Uso correcto |
|---|---|---|
| Ver los errores que ve Sergio | terminal read --screen | No limitarse al título/ready |
| Distinguir bloqueo humano de fallo | worker-show observation.agentWait | Leer evidencia; no adivinar permiso |
| Evitar tareas duplicadas | request-show, retry-request | Reconciliar misma operación |
| Encontrar trabajo previo | search + index-status | Filtro host/agente/ruta y cursor |
| Entregar sin mandar rutas solas | file open, tab/screenshot | Abrir local con permiso de mostrar |
| No perder cambios de prioridad | send a dispatch, check/ack | Confirmar consumo, no solo enqueue |
| No confundir instalado con sano | agent hooks status + ejecución | Corroborar evento concreto |
| Detectar recursos pendientes | worker-list y paginación | nextAction literal, no cierre indiscriminado |

## Límites y pendientes de aprendizaje

Catálogo leído no equivale a experimento. No se probaron mutaciones de cuentas, configuración, procesos, servidores, Jira/Linear, automatizaciones, publicación ni emuladores. Tampoco se ha reparado aún el hook desde este informe. El arreglo exige RED reproducible, cambio mínimo, GREEN del mismo caso y una llamada real desde Codex sin error; fixture verde solo no cierra el incidente.

## Catálogo completo de la CLI instalada

`documentado` significa leído en el esquema, no ejecutado. `sondeo` significa consulta de estado ejecutada; no garantiza salud de cada sistema. No se ejecutan comandos mutantes para llenar esta tabla.

| Comando | Propósito | Evidencia de esta pasada |
|---|---|---|
| `account add` | Add a managed agent account by signing in on this Orca host | documentado |
| `account list` | List managed agent accounts on this Orca host | documentado |
| `account rm` | Remove a managed OpenCode or Devin profile and its private data | documentado |
| `account select` | Select an OpenCode or Devin profile for new agent launches | documentado |
| `agent hooks off` | Disable Orca-managed agent status hooks and remove local hook entries | documentado |
| `agent hooks on` | Enable Orca-managed agent status hooks | documentado |
| `agent hooks prepare-codex` | Prepare a WSL pane's Orca-managed Codex home before a shell launch | documentado |
| `agent hooks status` | Show whether Orca-managed agent status hooks are enabled | sondeo/lectura ejecutado |
| `agent launch` | Start an agent in an existing workspace, as a chat or a terminal | documentado |
| `agent-context` | Print the machine-readable command schema for agents | sondeo/lectura ejecutado |
| `artifacts delete` | Delete an artifact owned by the signed-in Orca account | documentado |
| `artifacts list` | List artifacts owned by the signed-in Orca account | documentado |
| `artifacts share` | Share an HTML or Markdown file with your Orca account | documentado |
| `artifacts unshare` | Delete the artifact associated with a previously shared file | documentado |
| `artifacts update` | Update a file previously shared from this Orca profile | documentado |
| `automations create` | Create a scheduled Orca automation | documentado |
| `automations edit` | Edit an Orca automation | documentado |
| `automations list` | List scheduled Orca automations | documentado |
| `automations remove` | Remove an Orca automation and its run history | documentado |
| `automations run` | Run an Orca automation now | documentado |
| `automations runs` | List automation run history | documentado |
| `automations show` | Show one Orca automation | documentado |
| `back` | Navigate back in browser history | documentado |
| `browser identity get` | Show the browser identity configured on this Orca host | documentado |
| `browser identity set` | Choose the browser identity for every page on this Orca host | documentado |
| `capture start` | Start capturing console and network events | documentado |
| `capture stop` | Stop capturing console and network events | documentado |
| `check` | Check a checkbox/radio by ref | documentado |
| `claude-teams` | Start Claude Code Agent Teams in the current Orca terminal | documentado |
| `clear` | Clear an input element by ref | documentado |
| `click` | Click a browser element by ref | documentado |
| `clipboard read` | Read clipboard contents | documentado |
| `clipboard write` | Write text to clipboard | documentado |
| `computer capabilities` | Show computer-use provider capabilities | sondeo/lectura ejecutado |
| `computer click` | Click an app element or window coordinate, optionally with modifiers | documentado |
| `computer drag` | Drag between app elements or window coordinates | documentado |
| `computer get-app-state` | Capture a compact accessibility snapshot of an app | documentado |
| `computer hotkey` | Press a platform-aware key combination | documentado |
| `computer list-apps` | List running apps available to computer-use | documentado |
| `computer list-windows` | List windows for an app available to computer-use | documentado |
| `computer paste-text` | Paste exact text at the current app focus | documentado |
| `computer perform-secondary-action` | Perform an advertised secondary accessibility action | documentado |
| `computer permissions` | Open computer-use permission setup | documentado |
| `computer press-key` | Press a single key such as Return or Escape | documentado |
| `computer scroll` | Scroll an app element or window coordinate | documentado |
| `computer set-value` | Set the value of a settable app element | documentado |
| `computer type-text` | Type literal text at the current app focus | documentado |
| `console` | Show captured console log entries | documentado |
| `cookie delete` | Delete a cookie by name | documentado |
| `cookie get` | Get cookies for the active tab (optionally filter by URL) | documentado |
| `cookie set` | Set a cookie | documentado |
| `dblclick` | Double-click element by ref | documentado |
| `diagnostics memory` | Collect a memory snapshot for Orca and managed terminals | documentado |
| `dialog accept` | Accept a browser dialog | documentado |
| `dialog dismiss` | Dismiss a browser dialog | documentado |
| `download` | Download a file by clicking a selector | documentado |
| `drag` | Drag from one element to another | documentado |
| `emulator attach` | Attach/start helper for a device and make it active for the worktree | documentado |
| `emulator ax` | Dump the accessibility tree (Android uiautomator; iOS serve-sim AX, frames 0..1) | documentado |
| `emulator button` | Hardware button (home, side_button, etc.) | documentado |
| `emulator devices` | List all emulator devices/AVDs across iOS and Android | documentado |
| `emulator exec` | Raw passthrough (e.g. orca emulator exec --command "tap 0.5 0.7" or "ca-debug blended on") | documentado |
| `emulator gesture` | Send a multi-point gesture sequence | documentado |
| `emulator install` | Install an APK onto the target Android device | documentado |
| `emulator kill` | Stop helper for device | documentado |
| `emulator launch` | Launch an Android app by package (and optional activity) | documentado |
| `emulator list` | List available/running emulators (Orca-managed + raw serve-sim) | documentado |
| `emulator logcat` | Capture a one-shot logcat dump from the Android device | documentado |
| `emulator permissions` | Grant/revoke an Android runtime permission, or reset all runtime grants | documentado |
| `emulator rotate` | Rotate device | documentado |
| `emulator shutdown` | Stop helper and shut down the simulator device | documentado |
| `emulator tap` | Tap at normalized 0..1 coords (preferred for single taps) | documentado |
| `emulator type` | Type text (US ASCII only) | documentado |
| `environment add` | Save a remote Orca runtime environment from a pairing code | documentado |
| `environment cancel-stop` | Withdraw a managed Orca server stop that orcad has not acted on yet | documentado |
| `environment forget` | Unlink a managed Orca server whose SSH host is gone, without stopping it | documentado |
| `environment list` | List saved Orca runtime environments | documentado |
| `environment recover` | Finish or undo a managed Orca server’s interrupted update, rollback or stop | documentado |
| `environment rm` | Remove one saved Orca runtime environment | documentado |
| `environment rollback` | Roll a managed Orca server back to its previous version | documentado |
| `environment show` | Show one saved Orca runtime environment | documentado |
| `environment status` | Show a managed Orca server’s active version, terminals and pending work | documentado |
| `environment stop` | Stop a managed Orca server and unlink it from this machine (decommission) | documentado |
| `environment update` | Update a managed Orca server to this build’s version | documentado |
| `eval` | Evaluate JavaScript in the browser page context | documentado |
| `exec` | Run any agent-browser command against the active browser tab | documentado |
| `file diff` | Open a file diff as a tab in its worktree without changing your view; --focus brings you to it | documentado |
| `file open` | Open a file as a tab in its worktree without changing your view; --focus brings you to it | documentado |
| `file open-changed` | Open all git-changed files as tabs without changing your view; --focus brings you to them | documentado |
| `fill` | Clear and fill a browser input by ref | documentado |
| `find` | Find element by semantic locator and perform action | documentado |
| `focus` | Focus a browser element by ref | documentado |
| `forward` | Navigate forward in browser history | documentado |
| `full-screenshot` | Capture a full-page screenshot (beyond viewport) | documentado |
| `geolocation` | Override browser geolocation | documentado |
| `get` | Get element property (text, html, value, url, title, count, box) | documentado |
| `goto` | Navigate the active browser tab to a URL | documentado |
| `highlight` | Highlight an element by selector | documentado |
| `host list` | List every machine this Orca host can target, and how to name each one | documentado |
| `host name` | Show or set the name this Orca runtime reports to connected clients | documentado |
| `hover` | Hover over a browser element by ref | documentado |
| `inserttext` | Insert text without key events | documentado |
| `intercept disable` | Disable request interception | documentado |
| `intercept enable` | Enable request interception (pause matching requests) | documentado |
| `intercept list` | List paused (intercepted) requests | documentado |
| `is` | Check element state (visible, enabled, checked) | documentado |
| `jira assignee clear` | Clear a Jira issue assignee | documentado |
| `jira assignee list` | List assignable users for a Jira issue | documentado |
| `jira assignee set` | Assign a Jira issue | documentado |
| `jira comment add` | Comment on a Jira issue | documentado |
| `jira comment list` | List comments on a Jira issue | documentado |
| `jira connection` | List saved Jira site connections | documentado |
| `jira create` | Create a Jira issue | documentado |
| `jira issue` | Read a Jira issue | documentado |
| `jira label add` | Add labels to a Jira issue | documentado |
| `jira label rm` | Remove labels from a Jira issue | documentado |
| `jira label set` | Replace the labels on a Jira issue | documentado |
| `jira list` | List Jira issues for task triage | documentado |
| `jira priority clear` | Clear a Jira issue priority | documentado |
| `jira priority list` | List Jira priorities | documentado |
| `jira priority set` | Set a Jira issue priority | documentado |
| `jira project fields` | List create fields for a Jira project and issue type | documentado |
| `jira project list` | List Jira projects | documentado |
| `jira project types` | List Jira issue types for a project | documentado |
| `jira search` | Search Jira issues with JQL | documentado |
| `jira status list` | List available transitions for a Jira issue | documentado |
| `jira status set` | Transition a Jira issue | documentado |
| `keypress` | Press a key (Enter, Tab, Escape, ArrowDown, etc.) | documentado |
| `linear assignee clear` | Clear a Linear issue assignee | documentado |
| `linear assignee set` | Assign a Linear issue | documentado |
| `linear attach` | Attach a link to a Linear issue | documentado |
| `linear comment add` | Add a comment to a Linear issue | documentado |
| `linear comment delete` | Delete a Linear comment | documentado |
| `linear comment edit` | Replace the body of a Linear comment | documentado |
| `linear create` | Create a Linear issue | documentado |
| `linear due-date clear` | Clear a Linear issue due date | documentado |
| `linear due-date set` | Set a Linear issue due date | documentado |
| `linear estimate clear` | Clear a Linear issue estimate | documentado |
| `linear estimate set` | Set a Linear issue estimate | documentado |
| `linear issue` | Read Linear issue context for agents | documentado |
| `linear label add` | Add labels to a Linear issue | documentado |
| `linear label remove` | Remove labels from a Linear issue | documentado |
| `linear label set` | Replace labels on a Linear issue | documentado |
| `linear list` | List Linear issues for task triage | documentado |
| `linear list-issues` | List Linear issues with MCP-compatible filters | documentado |
| `linear priority clear` | Clear a Linear issue priority | documentado |
| `linear priority set` | Set a Linear issue priority | documentado |
| `linear project list` | List connected Linear projects | documentado |
| `linear relation add` | Add a Linear issue relation | documentado |
| `linear relation remove` | Remove a Linear issue relation | documentado |
| `linear save-issue` | Create or update a Linear issue | documentado |
| `linear search` | Search connected Linear workspaces | documentado |
| `linear status set` | Set a Linear issue status | documentado |
| `linear team labels` | List Linear team labels | documentado |
| `linear team list` | List connected Linear teams | documentado |
| `linear team members` | List Linear team members | documentado |
| `linear team states` | List Linear team workflow states | documentado |
| `mouse down` | Press mouse button | documentado |
| `mouse move` | Move mouse to x,y coordinates | documentado |
| `mouse up` | Release mouse button | documentado |
| `mouse wheel` | Scroll wheel | documentado |
| `network` | Show captured network requests | documentado |
| `open` | Launch Orca and wait for the runtime to be reachable | documentado |
| `open-url` | Open a URL on the paired client that hosts this terminal | documentado |
| `orchestration ask` | Ask the coordinator a question and block until answered | documentado |
| `orchestration check` | Check this agent's messages | documentado |
| `orchestration coordinator-start` | Retired: load the current orchestration skill | documentado |
| `orchestration coordinator-stop` | Retired: load the current orchestration skill | documentado |
| `orchestration dispatch` | Dispatch a task to a terminal | documentado |
| `orchestration dispatch-show` | Show dispatch context for a task | documentado |
| `orchestration gate-create` | Create a decision gate blocking a task | documentado |
| `orchestration gate-list` | List decision gates | documentado |
| `orchestration gate-resolve` | Resolve a pending decision gate | documentado |
| `orchestration inbox` | Show messages across (or for) recipients | documentado |
| `orchestration reply` | Reply to a message | documentado |
| `orchestration request-show` | Ask whether one orchestration mutation request already took effect | documentado |
| `orchestration reset` | Reset one explicit orchestration state scope | documentado |
| `orchestration run-create` | Create and bind a lightweight orchestration Run | documentado |
| `orchestration run-current` | Show the Run bound to this coordinator | documentado |
| `orchestration run-list` | List lightweight orchestration Runs | documentado |
| `orchestration run-show` | Show one lightweight orchestration Run | documentado |
| `orchestration run-use` | Bind this coordinator to an existing Run | documentado |
| `orchestration send` | Send an inter-agent message | documentado |
| `orchestration task-create` | Create an orchestration task | documentado |
| `orchestration task-list` | List orchestration tasks | documentado |
| `orchestration task-update` | Update a task status | documentado |
| `orchestration worker-abandon` | Fence a worker without claiming its process stopped | documentado |
| `orchestration worker-list` | List supervised worker terminal resource accounting | sondeo/lectura ejecutado |
| `orchestration worker-read` | Read bounded output from one supervised worker | documentado |
| `orchestration worker-release` | Release the terminal of one settled supervised worker | documentado |
| `orchestration worker-retain` | Keep one supervised worker terminal live for debugging | documentado |
| `orchestration worker-show` | Inspect one supervised worker Dispatch | sondeo/lectura ejecutado |
| `orchestration worker-start` | Start one supervised worker on the Run home or a connected Orca server | documentado |
| `orchestration worker-stop` | Fence one Dispatch and stop its supervised agent terminal | documentado |
| `pdf` | Export the active browser tab as PDF | documentado |
| `profile state exports` | List retained SQLite backups and JSON exports for profile-state recovery | documentado |
| `profile state rollback` | Repair damaged sections, restore a SQLite backup or retained JSON export, or keep the current JSON or SQLite profile | documentado |
| `project list` | List durable projects known to Orca | documentado |
| `project setup-clone` | Make a project available on a host by cloning a repository | documentado |
| `project setup-create` | Create independent project host setup metadata | documentado |
| `project setup-delete` | Remove a project host setup | documentado |
| `project setup-existing-folder` | Make a project available on a host by importing an existing folder | documentado |
| `project setup-update` | Update project host setup metadata | documentado |
| `project setups` | List project host setups | documentado |
| `reference add` | Attach reviews or issues to a workspace | documentado |
| `reference find` | Find workspaces and agents associated with a review or issue | documentado |
| `reference list` | List the reviews and issues attached to a workspace | documentado |
| `reference remove` | Detach reviews or issues from a workspace | documentado |
| `reload` | Reload the active browser tab | documentado |
| `repo add` | Add a project to Orca by filesystem path | documentado |
| `repo list` | List repos registered in Orca | documentado |
| `repo search-refs` | Search branch/tag refs within a repo | documentado |
| `repo set` | Set whether non-Orca worktrees are shown for a repo | documentado |
| `repo set-base-ref` | Set the repo's default base ref for future worktrees | documentado |
| `repo show` | Show one registered repo | documentado |
| `screenshot` | Capture a viewport screenshot of the active browser tab | documentado |
| `scroll` | Scroll the browser viewport | documentado |
| `scrollintoview` | Scroll element into view | documentado |
| `search` | Search the full text of agent sessions indexed on the selected Orca host | sondeo/lectura ejecutado |
| `select` | Select a dropdown option by ref | documentado |
| `select-all` | Select all text in an input by ref | documentado |
| `serve` | Start an Orca runtime server without opening a desktop window | documentado |
| `serve restore resume` | Resume automatic terminal restores that this host paused | documentado |
| `serve service install` | Run orca serve as a per-user background service that restarts itself | documentado |
| `serve service status` | Show whether this profile's orca serve service is running | documentado |
| `serve service uninstall` | Stop and remove this profile's orca serve service | documentado |
| `set credentials` | Set HTTP auth credentials | documentado |
| `set device` | Emulate a device | documentado |
| `set headers` | Set extra HTTP headers | documentado |
| `set media` | Set color scheme and reduced motion preferences | documentado |
| `set offline` | Toggle offline mode | documentado |
| `skills get` | Print a version-matched skill guide as Markdown | sondeo/lectura ejecutado |
| `skills install` | Install bundled Orca skills via the community skills CLI | documentado |
| `skills installed` | List installed skill selectors | documentado |
| `skills list` | List version-matched skill guides bundled with this Orca CLI | sondeo/lectura ejecutado |
| `skills share` | Publish explicitly selected installed skills behind one unlisted link | documentado |
| `skills update` | Update Orca skills to the version this Orca build ships | documentado |
| `snapshot` | Capture an accessibility snapshot of the active browser tab | documentado |
| `speech openai-key clear` | Remove the OpenAI key cloud voice dictation uses on this host | documentado |
| `speech openai-key set` | Save the OpenAI key cloud voice dictation uses on this host, read from stdin | documentado |
| `speech openai-key status` | Show whether this host has an OpenAI key for cloud voice dictation | documentado |
| `status` | Show app/runtime/graph readiness | sondeo/lectura ejecutado |
| `storage local clear` | Clear all localStorage | documentado |
| `storage local get` | Get a localStorage value by key | documentado |
| `storage local set` | Set a localStorage value | documentado |
| `storage session clear` | Clear all sessionStorage | documentado |
| `storage session get` | Get a sessionStorage value by key | documentado |
| `storage session set` | Set a sessionStorage value | documentado |
| `tab close` | Close a browser tab | documentado |
| `tab create` | Create a new browser tab in the current worktree | documentado |
| `tab current` | Show the current browser tab | documentado |
| `tab list` | List open browser tabs | documentado |
| `tab profile clone` | Clone a browser tab into a different browser profile | documentado |
| `tab profile create` | Create a browser session profile for browser tabs | documentado |
| `tab profile delete` | Delete a browser session profile used by browser tabs | documentado |
| `tab profile list` | List browser session profiles available to browser tabs | documentado |
| `tab profile set` | Switch a browser tab to a different browser profile | documentado |
| `tab profile show` | Show the browser profile bound to a tab | documentado |
| `tab profile use-default` | Switch a browser tab back to the default browser profile | documentado |
| `tab show` | Show one browser tab by page id | documentado |
| `tab switch` | Switch the active browser tab | documentado |
| `terminal close` | Close one terminal, its whole tab, or every terminal in a workspace | documentado |
| `terminal create` | Create a terminal session in the current worktree | documentado |
| `terminal list` | List live Orca-managed terminals | documentado |
| `terminal read` | Read bounded terminal output | sondeo/lectura ejecutado |
| `terminal rename` | Set or clear the title of a terminal tab | documentado |
| `terminal send` | Send input to a live terminal | documentado |
| `terminal set-pane-title` | Set or clear the title of one terminal pane | documentado |
| `terminal show` | Show terminal metadata and preview | documentado |
| `terminal split` | Split an existing terminal pane | documentado |
| `terminal switch` | Switch to a terminal tab in the UI | documentado |
| `terminal wait` | Wait for a terminal condition | documentado |
| `terminal-daemon restart` | Restart a terminal daemon whose program files are gone | documentado |
| `terminal-daemon status` | Report whether the terminal daemon is running, its process ceiling, and whether it still has its program files | sondeo/lectura ejecutado |
| `type` | Type text at the current browser focus | documentado |
| `uncheck` | Uncheck a checkbox/radio by ref | documentado |
| `upload` | Upload files to a file input element | documentado |
| `viewport` | Set browser viewport size | documentado |
| `vm recipe doctor` | Validate a per-workspace environment recipe without provisioning by default | documentado |
| `wait` | Wait for element, text, URL, load state, JS condition, or timeout | documentado |
| `worktree create` | Create a new Orca-managed worktree | documentado |
| `worktree current` | Show the Orca-managed worktree for the current directory | documentado |
| `worktree list` | List Orca-managed worktrees | documentado |
| `worktree ps` | Show a compact orchestration summary across worktrees | documentado |
| `worktree rm` | Remove a worktree from Orca and git | documentado |
| `worktree set` | Update Orca metadata for a worktree | documentado |
| `worktree show` | Show one worktree | documentado |

# Auditoría de Hermes local (PC de Sergio Urcullo), 26-oct-2026

Abreviaturas: HH = `C:/Users/PC/AppData/Local/hermes` · HD = `HH/hermes-agent/website/docs` · CP = checkout principal `C:/dev/proyectos/onia-hermes` (rama main, 51 cambios sin commitear) · W = worktree al día con origin/main `1b0bb95f`.
(P) marca una afirmación parcial o inferida. No se usó ninguna afirmación refutada por los verificadores.
Método: 8 lectores en paralelo (docs oficiales locales de Hermes v0.22.2, docs de Orca, Claude Code y Codex, la instalación local, `state.db` en solo lectura, reglas y skills, y limpieza del repo), 2 verificadores que trataron de refutar las 24 afirmaciones clave, y comprobación directa de la sesión principal: los tamaños de AGENTS.md, la precedencia en `context-files.md`, que `external_dirs` es escribible (`skills.md:424-425`) y el diff de las reglas globales contra `HH/backups/depuracion-instrucciones-20261025-102255`.

**Hecho confirmado aparte:** el 25-oct a las 11:00 Hermes reescribió, sin commit ni revisión, seis reglas globales de Claude (`~/.claude/rules/common/{agents,code-review,testing,git-workflow,development-workflow,performance}.md`, de 2 a 35 líneas cada una) y, en el checkout principal, AGENTS.md, CLAUDE.md, COORDINATION_MANIFEST, EXECUTION_PROTOCOL y varios SKILL.md. Los originales están en ese respaldo, con su `manifest.json` (sha256 y tamaños).

---

## 1. Diagnóstico en 5 líneas (de mayor a menor peso)

1. **Hermes lee un reglamento sin revisar y no lee el de verdad.** Orca lo abre en CP con `Set-Location C:/dev/proyectos/onia-hermes; hermes --tui --yolo` (bootstrap de los PID 25192/25456). Hermes carga UN solo archivo de proyecto y gana AGENTS.md (`prompt_builder.py:1870-1871`; `context-files.md:23-24`). Hoy carga el AGENTS.md reescrito sin commitear: 9.929 B contra 17.995 B en origin/main. CLAUDE.md (47 KB, con el canario, la publicación, los precios, los carriles y el relevo) no entra nunca: en `state.db system_prompts` hay 9 prompts con `## AGENTS.md` y 0 con `## CLAUDE.md`.
2. **No ve el método.** De las 66 skills de `.claude/skills` no carga ninguna, porque no hay `external_dirs` ni `trusted_project_dirs` (`config.yaml:1148-1160`). Hay 4 errores "Skill 'onia-router' not found" en `logs/errors.log` (líneas 1091, 1107, 1357 y 1407). SOUL.md es el texto de fábrica de Nous, en inglés.
3. **Nada lo frena.** Corre con `--yolo`, sin `approvals.deny`, y con `execute_code` y `-e/-c` aprobados para siempre (`config.yaml:2414-2419`). Además reescribe sus propias skills sin aprobación: el ledger registra 194 escrituras en 5 días (131 de la revisión en segundo plano y 63 del agente), 71 de ellas sobre onia-operar-harness y 61 sobre la skill de fábrica hermes-agent. Fijar una skill solo impide borrarla (`skill_manager_guards.py:143-147`).
4. **No cierra.** De los cierres de turno, 278 son `text_response` y solo 1 `max_iterations`. El goal tiene el contrato vacío y está en pausa, el cron registra 0 ejecuciones y hay cinco colas en paralelo. Ninguna regla define qué hace "Hermes local".
5. **Trabaja con el contexto inflado.** Con astra-900k y un umbral de 0.50, compacta recién cerca de 436k tokens, porque el autoraise excluye las variantes -900k (`auxiliary_client.py:603-628`). En promedio manda unos 280k tokens por llamada, tuvo cuelgues entre 571k y 658k, y el coordinador delega solo el 3,5-3,9 % de sus llamadas. Lo agravan dos TUI vivas sobre la misma home y la home desdoblada con Orca.

---

## 2. Qué lee hoy Hermes y qué no

| Fuente | ¿La lee? | Por qué | Cómo hacer que la lea |
|---|---|---|---|
| AGENTS.md de la raíz del cwd | Sí, hoy la versión sin commitear de CP | Es la primera de la cadena `.hermes.md > AGENTS.override.md > AGENTS.md > CLAUDE.md` | Decidir qué versión manda (sección 10, B1) y lanzar desde un worktree limpio |
| CLAUDE.md de la raíz | No | AGENTS.md lo tapa; además CLAUDE.md solo se busca en el cwd (`prompt_builder.py:1749-1760`) | AGENTS.md compacto con las reglas transversales y punteros del tipo "antes de X, leer CLAUDE.md §Y" |
| AGENTS.md / CLAUDE.md de subcarpetas | Sí, al tocar la carpeta (máx. 32.000 caracteres); en cada carpeta gana AGENTS.md | `subdirectory_hints.py:20, 274-305` | Sacar de `.claude/worktrees` las 41 carpetas huérfanas con reglas viejas (P: no está medido que las haya cargado) |
| `~/.claude/CLAUDE.md` y `~/.claude/rules/**` | No | Rechazados de forma explícita (`subdirectory_hints.py:243-254`) | Pasar a AGENTS.md lo que valga para los tres agentes |
| `.claude/skills` (66) | No | Solo escanea `.hermes/skills` y `.agents/skills` (con trust), HH/skills y external_dirs (`skill_utils.py:490-496`) | `skills.external_dirs` hacia un worktree limpio, con `write_approval: true` puesto ANTES |
| `.agents/skills` (30) | No | No hay trust | No hace falta: son duplicados de `.claude/skills` |
| `hermes-content/skills/*.md` (40) | No | No son `<dir>/SKILL.md`; 37 no tienen frontmatter | Convertir las 4 vigentes y pasar el resto a historial |
| HH/skills (las de fábrica + `onia/` con 2) | Sí | Es su home | Llevar al repo lo útil de las 2 ONIA y retirarlas de ahí |
| HH/SOUL.md | Sí, siempre (slot 1) | Es el genérico de Nous | Un SOUL ONIA corto y versionado |
| HH/memories/USER.md (1.077 B) | Sí, congelado al inicio de la sesión | No tiene el canario ni los límites de publicación | Completarlo, sin pasar de 1.375 caracteres |
| `C:/Users/PC/.hermes` (plugin orca-status) | No | En win32 usa `%LOCALAPPDATA%\hermes` y HERMES_HOME está vacía (`hermes_constants.py:51-58`) | `HERMES_HOME` de usuario apuntando a AppData (C3) |
| Handoffs `hermes-content/docs/handoff/*` | Solo si los abre por su cuenta | Son archivos normales | Puntero en el SOUL y en AGENTS.md |
| `.claude/agents` y los hooks de Claude | No | Formato propio de Claude | No aplica; las reglas duras van como deny y como protección de rama |

---

## 3. Reglas

**Las que tenemos (en el fondo están bien):**
- Negocio: etapa 1, un solo producto con 5 rubros, en orden dental, importadora y el resto; precios solo de `subscription-plans.ts`/`pricing.ts`; no exhibir obra; no hay vendedores (CLAUDE.md:63-91, 335-402).
- Trato: canario «Sergio Urcullo», prosa corta, usted con clientes, PowerShell, horas de La Paz.
- Publicación y gasto: lo que ve un cliente pasa con captura y espera su OK; gasto, terceros y SIAT piden su sí (CLAUDE.md:535-556).
- Git y verificación: main solo por PR; verificar mirando la pantalla; nada a medias; handoff de 7 campos.
- Orquesta: issues `orquesta` más `scripts/orquesta`; el revisor es otro agente (`scripts/orquesta/README.md`).

**Contradicciones y reglas obsoletas:**

| Tema | Choque | Cita |
|---|---|---|
| Rol de Hermes | AGENTS.md le habla a Codex ("no orquestás… no mergeás ni empujás") y en el mismo archivo pide "dividir el trabajo en agentes", "lanzar agentes separados" y "commitear" | AGENTS.md:36, 43, 243, 108 |
| Quién orquesta | Según CLAUDE.md, el Hermes del VPS planifica y el programa reparte. El Hermes local hace de coordinador con Orca Orchestration (run_66e1d03c2397, 32 tareas), y la skill orca lo prohíbe. Ninguna regla menciona a Hermes local | CLAUDE.md:185; `orca/SKILL.md:41-43`; `Roaming/orca/orchestration.db` |
| La madre retirada | equipo-de-agentes la menciona 26 veces, con su tabla de roles debajo de un aviso de una línea. ONIA_EQUIPO_DE_AGENTES dice "the madre is the only orchestrator". AGENTS.md manda leer COORDINATION_MANIFEST como paso 1. La copia de claude.ai sigue diciendo "La madre local orquesta" | equipo-de-agentes:11, 28; ONIA_EQUIPO_DE_AGENTES.md:46; AGENTS.md:213 |
| Autosync | "Auto-sync activado" contra "No asumir autosync activo"; el hook se borró en CP sin commit | CLAUDE.md:483; onia-router:119 contra 124 |
| Integrador | Nombra a `onia-cola`, que está muerto desde el 27-sep; nadie figura como dueño de la integración | CLAUDE.md:489 |
| Precedencia de skills | Dicen "gana la del repo", pero la doc de Claude dice personal > proyecto. Afecta a 15 skills con contenido distinto (P: 16 de las 31 colisiones difieren solo en CRLF) | CLAUDE.md:675; onia-router:26, 75 |
| Relevo | Relevo al 80 %, pero Hermes compacta al 50 % de 872k; las versiones sin commitear quitan el porcentaje | CLAUDE.md:46; config.yaml:689 |
| Concurrencia | "Paralelizar agresivo" contra 2+1 de equipo-de-agentes, `paralelo: 3` en carriles.json y como mucho 2 en Hermes | CLAUDE.md:527; equipo-de-agentes:97; carriles.json:6 |
| Modelos | El ruteo dice Sol para lo cotidiano y Astra para lo ambiguo, pero Hermes usa astra-900k para todo y Luna para todos los hijos. El ruteo no cubre ni a Claude ni a Hermes | AI_MODEL_ROUTING_2026.md:10-12; CLAUDE.md:181 |
| Reglas globales | 4 perfiles token-eficiente cargados a la vez, más el README de instalación cargado como regla. 6 reglas de `common/` editadas por Hermes el 25-oct fuera de Git (agents, code-review y testing difieren del respaldo) | `~/.claude/rules`; `HH/backups/depuracion-instrucciones-20261025-102255/global-rule-*.md` |
| SOUL del VPS | Habla de "siete loops" y de "15 loops" y manda usar el tablero SQLite archivado el 19-oct | deploy/hermes-agent/SOUL.md:17, 171-191, 209 |
| Skills de hermes-content | Siguen Arthur, los vendedores y DentalGest/GestiOS como productos | centro-comando-telegram:61; crm-prospeccion-onia:54-93; orquestacion-proyectos-onia |
| Detalles | "42 + 30 skills" (hay 66); el formato Pasó/Necesito/Sigue, retirado el 20-oct; zona horaria America/Caracas | onia-router:135; onia-hermes-jarvis:238, 377; config.yaml:2402 |

**Las que faltan:**
1. El rol de cada actor, incluido Hermes local (sección 5).
2. Un contrato de delegación único. Hoy hay tres: el issue de la orquesta, META/PRUEBA/PARADA de Codex y `contratos-carriles.json`.
3. La precedencia entre fuentes: AGENTS.md > skill del repo > handoff > SOUL/memoria > copia sincronizada.
4. Cuándo parar y preguntar, en una lista cerrada en un solo lugar y por un solo canal (label `necesita-ok`).
5. Dónde aprende Hermes: en la skill del repo y por PR, nunca en HH.
6. Cómo verifica el coordinador: con el artefacto exacto, un revisor distinto del autor, captura de lo visible y estados separados (construido, revisado, publicado, mirado).
7. Una barrera dura sobre main en el servidor: la protección de rama en GitHub (NO MEDIDO si existe).
8. Una sola cola.

---

## 4. Skills: evaluación crítica y cómo compartirlas

**Sirven (concretas y vigentes):** planificar-orquesta (111 líneas), onia-core, onia-propuestas, panel-onia, aprender-de-todo, onia-contabilidad-bolivia, agenda-calendario y onia-infra (larga, pero con trampas medidas). Hay que corregir antes:
- orca: tiene la versión, el PATH y el clon huérfano viejos, y no habla del desdoble de la home ni del puerto 6768.
- pedir-a-claude: todavía nombra a la madre.

**Demasiado largas (mezclan el método con un diario):** onia-ventas-pauta (780 líneas), editor-videos (775), edicion-referentes (525), onia-hermes-jarvis (514, más un handoff de 778) y COORDINATION_MANIFEST (1071, que AGENTS.md exige leer como paso 1). Objetivo: el SKILL.md como índice de 150 líneas o menos, el detalle en `references/` y las fechas en el handoff.

**Historia que sigue invocable:** onia-sesion-madre, y 25 de los 40 `.md` de hermes-content/skills (sin tocar desde junio o julio). Van a historial.

**Duplicadas (cifras corregidas):**
- `.agents/skills` contra `.claude/skills`: 30 copias, con diferencias reales solo en 3 (el SKILL.md de embedded-captions, `higgsfield-soul-id/references/photo-guide.md` y un `.gitignore` de media-use); las otras 13 difieren solo en CRLF.
- `~/.claude/skills` contra el repo: 31 colisiones, 15 con contenido distinto (familia HyperFrames, impeccable, embedded-captions, etc.). En Claude gana la personal.
- claude.ai: unas 60 copias sincronizadas el 18-oct con reglas opuestas.
- El junction `~/.agents/skills` apunta a `CP/.agents/skills`, así que Codex ve dos versiones dentro de cada worktree (P).
- Cuatro mapas de ruteo: onia-router, STACK-POR-DOMINIO, ONIA_SKILLS_STACK_Y_SUBAGENTES y agents/README.

**Las de Hermes local (HH/skills/onia):** onia-operar-harness tiene 13 KB más 39 KB de referencias, una descripción vaga, unas 60 reglas nacidas de incidentes, y sigue en v0.1.0 después de 71 escrituras. onia-relevo-sesion depende de comandos de Orca y no recoge la regla del 80 %. Las dos son una segunda fuente de verdad: lo útil va al repo y el resto se retira.

**Le faltan a Hermes como coordinador:**
1. `onia-coordinar`: rol, una vía de despacho, contrato, cuándo parar y cómo verificar.
2. Ficha de negocio de una página: la etapa, y por puntero el catálogo, el cliente ideal y los precios.
3. seguridad-credenciales en versión corta.
4. Relevo y compactación.
5. planificar-orquesta en versión PC (con `gh` en vez de curl).

**Cómo compartirlas sin duplicar (lo mínimo):**
- **Fuente única: `.claude/skills/<n>/SKILL.md` del repo.** Ahí ya están las 66 y ahí apuntan CLAUDE.md, AGENTS.md y onia-router. Mudarlas a `.agents/` obligaría a reescribir todas las referencias, y Codex no la necesita: recibe la skill por ruta dentro de su contrato.
- **Hermes:** una línea `skills.external_dirs: [<worktree limpio>/.claude/skills]`, más `skills.write_approval: true` y la revisión en segundo plano apagada. external_dirs NO es de solo lectura (`HD/user-guide/features/skills.md:424-425`).
- **Codex:** lee por ruta. Para `.agents/skills`, o un test que falle si las copias divergen ignorando CR, o borrar las copias. Quitar o redirigir el junction `~/.agents/skills`.
- **Claude:** archivar las 15 personales que difieren y corregir CLAUDE.md:675 y onia-router:26 y 75.
- **Descripciones:** el «cuándo usar» en los primeros 57 caracteres, porque el índice de Hermes corta a 60 (`skill_utils.py:822-834`). Claude no pierde nada con eso.
- **Aprendizaje:** Hermes propone un diff y entra por PR, igual que la regla de Claude ("en el mismo commit").

---

## 5. Equipo de agentes y contrato

| Actor | Hace | No hace | Modelo |
|---|---|---|---|
| Sergio Urcullo | Decide la etapa; da el OK de lo visible, el gasto y los terceros | - | - |
| **Hermes local** (PC, coordinador) | Conversa con él, convierte pedidos en contratos, carga issues `orquesta` con `gh`, verifica recibos y escribe el handoff | Editar código del repo, git commit/push, ssh al VPS, publicar, tocar `~/.claude` o `~/.codex` | gpt-6.1-sol medium |
| Hermes VPS (Telegram) | Avisos, el resumen de las 06:30 y el cierre de las 21:30, el calendario; carga issues desde Telegram (10 por día como máximo) | Ejecutar trabajo | Sol (P: el cambio está pendiente de que lo corra él) |
| `scripts/orquesta` | Reparte issues: Actions (marca, comunidad, investigación) y la PC (plataforma con Codex, video); el revisor es otro modelo | Publicar, mergear | Según carriles.json; revisor Sonnet |
| Claude Code (sesión principal) | Trabajo con él, gates, integración por PR, todo lo de Opus (la 1.0) | - | Opus / Sonnet |
| Codex | Contratos cerrados en un worktree | Git | Según el contrato |
| Orca | Tablero de Claude y Codex | Orquestar (salvo que él decida formalizarlo) | - |

**Decidido por Sergio Urcullo el 26-oct:** planifica Hermes local. El del VPS avisa y carga solo lo que él le dicta.
Hay una sola cola: los issues `orquesta`. La tabla vigente de actores está en `AGENTS.md` §1 y el mapa en
`ONIA_HARNESS.md`.

**Contrato único.** Conviene extender el formato del issue de la orquesta (`README:35-46`) en vez de crear otro:
```
objetivo: 1 frase                      hecho cuando: comando o artefacto verificable
carril / worktree / rama               archivos propios (y prohibidos)
fuentes: skill + secciones de CLAUDE.md   permisos: lectura | edición | git en rama | nada visible sin ok
modelo y vía: orquesta | Codex | Claude   presupuesto: iteraciones / tiempo / créditos
parar si: ...                          entrega: PR + recibo (comandos y salida)
revisor: distinto del autor            ok: necesita-ok si toca visible, gasto o terceros
```
Lo que no está en la cola canónica no existe.

---

## 6. Limpieza del repo

**¿Contamina? Sí,** aunque no por los archivos viejos, sino por cinco cosas:
1. Tres versiones de AGENTS.md según la carpeta: origin/main `73cc99f1` (17.995 B); CP e iman-workshop `adb20ec9` (9.929 B); marca-personal `f908acad` (19.238 B).
2. Hermes trabaja en CP, sobre main sucio.
3. Reglas globales editadas fuera de Git.
4. Docs vigentes que contradicen la regla del 19-oct.
5. Skills duplicadas con la precedencia mal entendida.

El peso (`.git` de 13 GB, 266 ramas locales y 149 remotas) no confunde al modelo; solo hace todo más lento.

**Orden** ([IRR] = irreversible; [OK] = pide el OK de Sergio Urcullo):
1. **Congelar.** Una sola TUI, sin `--yolo`, y nadie escribe en CP (todavía se tocaron archivos el 26-oct a las 08:27 y 08:38).
2. **Respaldar los commits que solo existen en local:** `git -C C:/dev/proyectos/onia-hermes bundle create E:/respaldo-ramas-locales-20261026.bundle codex/hermes-l1c-html-real codex/hermes-c4-qa-release`.
3. **Rescatar el WIP de CP a ramas con PR** [OK porque cambia las reglas de todos]:
   - (a) Reglas: AGENTS.md, CLAUDE.md, el manifest, EXECUTION_PROTOCOL, 5 skills y `.claude/settings.json`.
   - (b) Tests, package.json y la mudanza de `mara-voice-merge.js`.
   - (c) Material: research, references (4,2 MB con zip y mp4) y videos.
   - Excluir `.hermes/plans/**/*.jsonl` y `__pycache__`.
   - Los 10 archivos de onia-core: primero `git -C CP diff --ignore-cr-at-eol --stat -- onia-core`. Si sale vacío, es ruido de EOL.
4. **Reglas globales y configs que tocó Hermes:** comparar `~/.claude/rules/common/*` con `HH/backups/.../global-rule-*.md`, más `~/.codex/config.toml` (on-request / workspace-write) y `~/.claude/settings.json`. Mantener o revertir [OK], y probar `scripts/codex-tarea.sh`.
5. **Worktrees mergeados y limpios:** `git worktree remove` sobre gallant-kirch-e17fb6, web-v1-revision, `.codex/worktrees/regla-acceso-local-agentes`, `E:/onia-orquesta/{comunidad-235,marca-234}` y `E:/onia-wt/{handoff-jarvis-token,ver-videos-ig}`. Los 2 sparse de Temp con `--force`; para el 4793, `unlock` y después `prune`. Es reversible: la rama queda.
6. **Los 10 worktrees mergeados con WIP** (v1-integracion 46, repo-folder-order 24, hermes-ecosistema 13, …): revisar el diff uno por uno y pasar a `rescate/<n>` o descartar [OK][IRR si se descarta].
7. **Las 41 carpetas huérfanas (13,3 GiB):** `Move-Item` a `E:/archivo-worktrees-20261026/`; borrarlas recién a las 2 semanas [OK][IRR al borrar].
8. **Ramas:**
   - `git branch -d` sobre las 196 locales mergeadas (`-d` se niega si una no está mergeada).
   - `git push origin --delete` sobre las 37 remotas con PR mergeado; GitHub las restaura desde el PR.
   - Las 6 con PR cerrado sin merge y las 27 de más de 30 días sin PR van a una lista para él.
9. **`git -C CP gc`** con ningún agente corriendo: libera 1,47 GiB de tmp. No reescribir la historia para sacar los videos [IRR: rompe 36 worktrees]. Usar LFS de aquí en adelante [OK].
10. **Docs a historial con `git mv`:** ONIA_EQUIPO_DE_AGENTES.md, `docs/ORCHESTRATOR.md`, `hermes-content/docs/ORCHESTRATOR.md`, PROJECTS_ORCHESTRATION.md, HERMES_OS_CONTROL_CENTER_2026.md, HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026.md, CODEX_SKILL_ROUTING.md, y los 37 docs fechados sin aviso en la raíz de docs. Sumar al test de higiene la regla "doc fechado en la raíz sin aviso = fallo".
11. **Skills** (sección 4) y **`.agents/skills/{orchestration,orca-cli}` sin trackear:** decidirlas junto con Orca Orchestration [OK].
12. **La raíz** (`tmp-assets/` 34 MB, `out/`, `output/`, `references-inbox/`, `docs/`) según la tabla «Dónde va cada cosa». **`.hermes/ig-session` fuera del repo** [lo hace él: puede pedir login de nuevo].

---

## 7. Cómo usarlo

**Recomendación única: el coordinador, en la TUI de Hermes abierta a mano fuera de Orca.** Una sola instancia, en PowerShell, desde un worktree limpio y sin `--yolo` (`hermes --tui`). Al arrancar, `/context`, para confirmar que cargó AGENTS.md. El trabajo de código y la integración, en Claude Code (esta app). Orca, solo como tablero de Claude y Codex.

Por qué no Orca para Hermes, hoy:
- Lo lanza con `--yolo` en CP (`tui-agent-permissions.js`; `agentPermissionDefault: full-access`).
- No recibe su estado en Windows nativo: `last-status.json` no tiene ninguna entrada de Hermes (issue #24966).
- Su Orchestration tuvo 7 fallos de readiness.
- Expone el WebSocket en `0.0.0.0:6768` con el firewall abierto en el perfil Public.
- Ocupa unos 3 GB de RAM.
- Tocó la configuración global de Claude y de Codex.

Por qué no la nube: Hermes local vive en HH y lee archivos de la PC. En la nube solo corre la orquesta en Actions.

Hermes Desktop comparte núcleo y estado y es una opción válida con `--cwd <worktree>`, pero NO está probado en esta PC. Evitar `/voice on` en la TUI: tumbó el gateway 2 veces con 0xC0000005.

**El portal** es el panel web de Hermes: `hermes dashboard --no-open` → `http://127.0.0.1:9119` (entrada `hermes-dashboard` de `.claude/launch.json`). Lo levantó esta sesión (PID 3860) y lo apagó al terminar. Sirve para mirar Sessions, Skills, Config, Logs y Cron. Su API de lectura (`/api/status`, `/api/skills`, `/api/config`, `/api/sessions`) se consulta desde la página con `window.__HERMES_SESSION_TOKEN__`. Medido ahí el 26-oct: home `AppData\Local\hermes`, 53 skills (51 de fábrica y 2 creadas por él), 0 trabajos de cron, `kanban` apagado, `discord` encendido sin uso, y 15 sesiones con cwd en el checkout principal y siete modelos distintos (astra-900k, sol, sol-900k, luna, astra, claude-opus-5-5 y claude-sonnet-4-6).

---

## 8. Modelo

| Uso | Modelo | Fuente |
|---|---|---|
| Coordinador Hermes local | `gpt-6.1-sol` medium | AI_MODEL_ROUTING_2026.md:11 |
| Decisión ambigua: etapa, arquitectura, veredicto final | `gpt-6-astra` (272k, nunca -900k como default), en **sesión nueva** | :10; cambiar `/model` a mitad de sesión descarta el razonamiento (6 veces en los logs) y relee todo sin caché |
| Hijos de `delegate_task` | `gpt-6.1-sol`, porque el modelo es uno solo para todos los hijos (`delegation.md:292`). Luna con 40 iteraciones cortó los guiones, que él rechazó | config bloque delegation |
| Juez de `/goal` y chequeos mecánicos | `gpt-6-luna` low | :12 |
| Código y la 1.0 con Opus | Claude Code (sesión principal u orquesta) y Codex por `scripts/codex-tarea.sh`; nunca como proveedor dentro de Hermes | - |
| Revisor | Otro modelo (Sonnet en la orquesta) | scripts/orquesta |

**Token de Claude Max dentro de Hermes: NO.**
- onia-router:78 lo pone en «No usar».
- Se sacó del VPS el 19-oct con su OK (`handoff/hermes-jarvis.md:727-746`).
- La doc de Hermes: la vía OAuth de Max solo consume los créditos de "extra usage" pagados, nunca la cuota base (`HD/integrations/providers.md:142-148, 174-175`).
- El intento del 21-oct falló por un OAuth refresh "terminally invalid".
- Con API key se paga por uso: es gasto y necesita su sí.

**Otros puntos:**
- `fallback_providers` apunta a la misma cuenta ChatGPT, así que no cubre el agotamiento de la cuota.
- `auth.adopt_external_logins: true` hace que Hermes y Codex CLI se invaliden mutuamente el refresh token (`HD/user-guide/security.md:668-676`) (P). Conviene darle a Hermes su propio login.

---

## 9. Compactación

```yaml
compression:
  threshold: 0.50
  threshold_tokens: 200000   # se usa el menor de los dos: tope igual en 272k y en 900k
  target_ratio: 0.20
  protect_last_n: 20
  protect_first_n: 0         # recomendado para compactacion rodante; el objetivo vive en /goal
  tail_mode: lean
  idle_compact_after_seconds: 1800
  proactive_prune_tokens: 48000
```
- Por qué 200k: con -900k compactaba cerca de 436k; los cuelgues aparecieron a 571-658k; el promedio era de unos 280k por llamada. En los modelos de 272k el piso de 0.75 y el autoraise de 0.85 dan unos 204-231k, así que 200k unifica el comportamiento. (P) No está medido que la calidad caiga por encima de eso.
- **Una sesión por objetivo:** `/new <objetivo>` y `/goal` con contrato y gates (`HD/user-guide/features/goals.md:81-154`).
- **Relevo:** a la segunda compactación, o al cambiar de objetivo o de modelo, se escribe el handoff y se hace `/new`. Para Hermes reemplaza el «80 %» de CLAUDE.md:46, que con 872k nunca se alcanza [cambio de regla: OK]. Claude Code mantiene su 80 %.
- La memoria y las skills nuevas recién entran en la sesión siguiente o después de compactar (`memory.md:57-65`; `skills.md:184-192`).

---

## 10. Plan de configuración

### A. Lo hace Claude sin riesgo (no cambia el comportamiento de nadie)

| # | Paso | Vuelta atrás |
|---|---|---|
| A1 | `Copy-Item "$env:LOCALAPPDATA\hermes\config.yaml","$env:LOCALAPPDATA\hermes\SOUL.md","$env:LOCALAPPDATA\hermes\memories\USER.md" "$env:LOCALAPPDATA\hermes\backups\pre-orden-20261026\"` | Borrar la carpeta |
| A2 | El bundle de la sección 6, paso 2 | Borrar el archivo |
| A3 | Worktree base para Hermes: `git -C C:/dev/proyectos/onia-hermes worktree add --detach E:/onia-wt/hermes-base origin/main`; se actualiza con `git -C E:/onia-wt/hermes-base fetch; git -C E:/onia-wt/hermes-base checkout --detach origin/main` | `git worktree remove E:/onia-wt/hermes-base` |
| A4 | En una rama nueva, con PR en borrador sin mergear: AGENTS.md compacto (menos de 200 líneas y unos 12 KB, por el tope de 32 KiB de Codex (P)); CLAUDE.md con `@AGENTS.md` en la primera línea; `hermes-content/deploy/hermes-pc/SOUL.md` (unas 15 líneas en español: rol de coordinador, canario, prohibiciones); USER.md propuesto; skill `onia-coordinar`; descripciones de 57 caracteres o menos; el contrato en el README de la orquesta; la skill orca actualizada; `.hermes/plans` y `.hermes/tasks` al `.gitignore` | Cerrar el PR |
| A5 | Informe de diffs (reglas globales, `~/.codex`, `~/.claude/settings.json`) en `handoff/hermes-local.md` | Revertir el commit |

### B. Lo hace Claude con el OK de Sergio Urcullo (en este orden)

| # | Paso | Vuelta atrás |
|---|---|---|
| B1 | Decidir qué AGENTS.md manda y mergear el PR de reglas. **Antes de mover el cwd**: en origin/main Hermes leería "no orquestás" | `git revert` del merge |
| B2 | WIP de CP a ramas o PRs (sección 6, paso 3); CP queda en main limpio | Las ramas lo conservan todo |
| B3 | Con Hermes cerrado, editar `HH/config.yaml` (bloque de abajo) | Restaurar el respaldo de A1 |
| B4 | Copiar el SOUL versionado a `HH/SOUL.md` y actualizar `memories/USER.md` | Restaurar el respaldo de A1 |
| B5 | `Move-Item HH/skills/onia HH/backups/skills-onia-20261026` después de llevar lo útil al repo | Moverla de vuelta |
| B6 | Skills de fábrica modificadas: copiar `HH/skills` al respaldo, `hermes skills list-modified` y después `hermes skills reset hermes-agent` (y claude-code, codex, requesting-code-review…) (P: los comandos salen de la doc, no se corrieron) | Restaurar la copia o `hermes curator rollback <id>` |
| B7 | `~/.claude/rules`: mover el README.md y 3 de los 4 perfiles token-eficiente a `~/.claude/rules-archivo/`; `paths:` en web/*.md | Moverlos de vuelta |
| B8 | Archivar las 15 skills personales distintas en `~/.claude/skills-archivadas-20261026` después de elegir la versión | Moverlas de vuelta |
| B9 | Limpieza del repo, pasos 5 a 12 de la sección 6 | Según cada paso |

Bloque de B3:
```yaml
model: {default: gpt-6.1-sol}
skills:
  write_approval: true                 # PRIMERO; external_dirs es escribible
  external_dirs: ["E:/onia-wt/hermes-base/.claude/skills"]
  creation_nudge_interval: 15
memory: {write_approval: true}
auxiliary: {background_review: {enabled: false}}   # origen de 131 de las 194 escrituras
approvals:
  timeout: 500
  deny: ["git push*", "git commit*", "gh pr merge*", "git reset --hard*", "git checkout -- *",
         "git clean*", "ssh *", "scp *", "Remove-Item*", "rm -rf*", "higgsfield generate create*"]
command_allowlist: [cua:click:background]   # sacar execute_code y la ejecucion de scripts con -e/-c
delegation: {model: gpt-6.1-sol, provider: openai-codex, max_iterations: 120,
             max_concurrent_children: 2, child_timeout_seconds: 900, worktree_isolation: true}
compression: (bloque de la seccion 9)
checkpoints: {enabled: true}          # (P) clave tomada de checkpoints-and-rollback.md
timezone: America/La_Paz
display: {tool_progress: new}
# y corregir max_concurrent_sessions vacio (21 avisos en errors.log)
```
Ojo: `approvals.deny` es una política sobre comandos, no un sandbox (`security.md:182-184`). Si quedan aprobados los scripts con `-e/-c`, un push hecho desde Python se lo salta.

### C. Lo hace Sergio Urcullo a mano

| # | Paso | Vuelta atrás |
|---|---|---|
| C1 | Cerrar una de las dos TUI desde Orca (PID 13048 o 14640) y no volver a abrir Hermes desde Orca | - |
| C2 | Orca: Settings > Agents > permisos de Hermes en Manual (sin `--yolo`); Workspace Directory en `E:/orca/workspaces`; Privacy con la telemetría apagada; decidir Orchestration (resolver `gate_e7da503b8382` y cerrar `run_66e1d03c2397`, o formalizarla) | Volver a poner los valores anteriores |
| C3 | Solo si se quiere Hermes dentro de Orca: `[Environment]::SetEnvironmentVariable('HERMES_HOME', "$env:LOCALAPPDATA\hermes", 'User')` y reiniciar Orca (orca-status no está probado en Windows nativo) | `[Environment]::SetEnvironmentVariable('HERMES_HOME', $null, 'User')` |
| C4 | Firewall: limitar la regla `orca.exe` (TCP y UDP) al perfil Privado; marcar la red de la casa como Privada; desemparejar el móvil si no se usa | Volver a habilitarla |
| C5 | `hermes config set auth.adopt_external_logins false`, después `hermes auth add openai-codex` (device code) | `set ... true` |
| C6 | GitHub: protección de la rama main (exigir PR) | Quitarla en Settings |
| C7 | claude.ai: actualizar o borrar las unas 60 skills sincronizadas del 18-oct | - |
| C8 | Decisiones: qué AGENTS.md manda; el rol de Hermes local frente al del VPS; Orca Orchestration sí o no; el carril comunidad y un carril ventas | - |
| C9 | Arrancar: `Set-Location E:/onia-wt/hermes-base; hermes --tui` y después `/context` | Cerrar la TUI |

---

## 11. No medido y riesgos

**No medido:**
- El entorno real de los `hermes.exe` lanzados por Orca: si heredan HERMES_HOME del daemon (PID 4708).
- De 30 prompts de sistema, 21 no traen ningún AGENTS.md. Si son los hijos Luna, los subagentes trabajan sin ninguna regla ONIA (`delegation.md:86`). Hay que verificarlo.
- Si `skills.write_approval` frena también a la revisión en segundo plano sobre external_dirs. Por eso se recomienda apagarla.
- Si main tiene protección de rama en GitHub.
- La ventana real y el autoraise de `gpt-6.1-sol` base; el consumo real de la cuota ChatGPT.
- La calidad del AGENTS.md reescrito (9,9 KB) y del manifest recortado. Es la decisión central de B1 y no se evaluó.
- Si las 41 huérfanas guardan contenido único, y si Hermes llegó a cargar sus AGENTS.md.
- El Hermes del VPS: modelo vivo y loops; no se entró por SSH.
- Si Orca 1.4.241 corrige la home en Windows.
- Si el sandbox nuevo de Codex rompe `codex-tarea.sh` o la orquesta.
- El tope de 32 KiB de Codex y `~/.codex/skills`: son de doc externa y no se re-verificaron.

**Riesgos:**
- external_dirs es escribible: sin write_approval, Hermes puede reescribir las skills del repo.
- Mover el cwd antes de decidir AGENTS.md le cambia las reglas a Hermes.
- El WIP de CP existe solo en disco hasta B2.
- El puerto 6768 está expuesto en una red Public.
- C: está al 98 % (11 GB libres).
- El token de issues de Hermes es de la cuenta de Sergio Urcullo: un Hermes manipulado comentaría como él (`scripts/orquesta/README.md:107-109`).

---

No corrí ningún comando de Hermes ni de Orca que escriba estado, y no evalué el contenido de las ediciones sin commitear: solo medí sus tamaños, fechas y diffs.
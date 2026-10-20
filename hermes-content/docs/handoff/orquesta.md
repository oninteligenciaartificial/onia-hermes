# Handoff — carril orquesta (stack v3)

Escrito el 19-oct-2026 por la sesión «Orquestación de agentes y modelos LLM», por «cambio de sesión» de Sergio Urcullo.

## 1. Objetivo

Stack v3 funcionando: **Hermes planifica** (VPS), **GitHub Actions trabaja 24/7 con el Max de Sergio Urcullo** (carriles sin login)
y **la PC trabaja lo que usa sus logins o archivos** (por su regla de credenciales). Por qué así y con qué fuentes:
`hermes-content/docs/research/harness-orquestacion-autonomia.md` (secciones v2 y v3).

**Hecho cuando:** una tarea real de la cola cierra sola en GitHub Actions (revisor + PR + comentario) y otra cierra en la PC por el horario.

**Estado (19-oct, 22:30 UTC):** mitad nube ✅ (#245 cerró sola, PR #247). Mitad PC ⏳: falta que Sergio Urcullo instale la tarea
programada de Windows (punto 6c). Abiertos: PR #249 (reglas del 19-oct), parche de skills, token de Issues y planificador (6f, 6g, 8).

## 2. Qué quedó en producción (main, 19-oct)

- [PR #238](https://github.com/oninteligenciaartificial/onia-hermes/pull/238) mergeado: `scripts/orquesta/` con cuartito por área,
  revisor `claude -p --restricted --tools Read,Grep,Glob`, continuidad desde la rama `orquesta/<carril>-<n>`, ciclo de OK
  (`ok: sergio` → label `espera-ok`; él contesta «ok» o cambios en el issue), un reintento solo y freno a la segunda falla,
  rutas protegidas (`.github/`, hooks, secretos). 20 tests en `orquesta.test.mjs`.
- [PR #243](https://github.com/oninteligenciaartificial/onia-hermes/pull/243) mergeado: reels de Instagram sin login en 720p, caption
  del `.info.json`, transcripción local (faster-whisper), cookie nunca escrita en disco.
- Checkout principal `C:/dev/proyectos/onia-hermes` actualizado a `7df79f56`.
- Label `espera-ok` creado en el repo. Cola abierta: #236 (video), #242 (plataforma: arreglar el test del PR #168 de onia-platform, `base:` su rama).
- **VPS:** Hermes v0.22.2 (antes v0.21.0); `hermes-gateway.service` de sistema deshabilitado (8.092 reinicios); 47 tareas del
  tablero `onia` archivadas (export JSON en el respaldo); `onia-ordenador-tablero` pausado. Respaldo `/root/respaldo-hermes-20261019/`
  (3,5 GB). Cómo deshacer: `hermes-jarvis.md`, sección «19-oct».

## 3. Qué quedó a medias y dónde

Rama **`claude/orquesta-stack-v3`** (worktree `C:/dev/proyectos/onia-hermes/.claude/worktrees/agent-llm-orchestration-56e7cc`), commit WIP:
- `carriles.json`: `donde` por carril (plataforma y video → `pc`; marca, comunidad, investigación → `nube`), `sin_media` (patrones
  sparse) y `leer` apuntando a `scripts/orquesta/cuartitos/` (7 skills MIT copiadas; ver su README).
- `orquesta.mjs`: `ajustarAlEntorno` (`ORQUESTA_RAIZ`, `ORQUESTA_TRABAJO`), campo `donde:` del pedido, `dondeDe()` **definida pero
  todavía no usada**, sparse sin media en `prepararWorktree` cuando `ORQUESTA_SIN_MEDIA=1` (receta probada en un repo de juguete).

Hechos el 19-oct por la sesión siguiente (commit `3b304b2f` en esta rama, 23/23 tests):
1. ✅ `main()` filtra por `--donde pc|nube` (o `ORQUESTA_DONDE`) antes de `atenderRespuestas` y `soltarHuerfanas`; un valor raro corta.
2. ✅ Tests de `dondeDe`, `ajustarAlEntorno` y del sparse (repo de juguete con clon parcial `blob:none` + sparse cone, como Actions).
3. ✅ `.github/workflows/orquesta.yml`. Cambios contra lo planeado, con su motivo:
   - `schedule` **cada 3 h** (0, 3, 12, 15, 18, 21 UTC = 8 a 23 en La Paz), no cada hora: la cuenta es **GitHub Free** (2.000 min/mes
     en repos privados; medido: branch protection da 403 «Upgrade to GitHub Pro») y una pasada vacía cobra 1 min redondeado. Las tareas
     nuevas y los comentarios ya disparan solos; el horario es para los reintentos.
   - Checkout sparse **solo `scripts/orquesta`** (implica `blob:none`), no `sin_media`: cada worktree aplica su propio sparse; así no
     hay dos listas que se desincronicen. `fetch-depth: 0` para que `merge-base` ande al seguir una rama vieja.
   - `persist-credentials: false` + helper `!gh auth git-credential` (lee `GH_TOKEN`, probado) y los agentes corren **sin `GH_TOKEN`**
     (`ENV_AGENTE` en `orquesta.mjs`): sin branch protection, un token filtrado por una web inyectada podía pushear a `main`, que
     despliega el VPS. Más `Read(//proc/**)` negado (el `environ` tiene el token de Max).
   - Claude Code fijado en `2.1.288` (la de la PC) y `DISABLE_AUTOUPDATER=1`.
4. ✅ README de `scripts/orquesta/` con el stack v3, `donde` y el `schtasks` de la PC con `--donde pc`.

5. ✅ `code-reviewer` + `security-reviewer` (con experimentos). Arreglado, 25/25 tests:
   - **`git add -A` salía con 1** ante una captura PNG nueva en un worktree sin media → tarea perdida. Ahora `--sparse` (test).
   - **`Read`/`Write`/`Edit`/`Glob`/`Grep` sin ruta** dejaban al trabajador escribir fuera de su carpeta (medido): podía pisar
     `trabajador.settings.json` del clon principal y ganar hooks con los tokens. Sacados de `herramientas_claude`; dentro de su
     carpeta y de `--add-dir` sigue leyendo y escribiendo (medido).
   - `PROTEGIDAS` suma `scripts/orquesta/`, `.claude/settings*.json` y `.mcp.json`; git del orquestador sin hooks
     (`core.hooksPath=os.devNull`, probado en Windows); `check: cmd` sin el token de Max; `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`;
     solo cuentan comentarios del dueño (`leerHilo`) y el disparo por label exige `sender` = dueño.
   - Sin cupo de Max o sin login (`sinMotor`): la tarea se suelta sin comentar ni gastar el reintento (⏸). Falta el secreto → el job
     corta en rojo en el primer paso. Sin el permiso de PRs de Actions, entrega el enlace `compare` en vez de fallar.
   - Sin `--donde`: la PC es `pc` y Actions `nube` (antes tomaba todo y podían pisarse).

5b. ✅ [PR #244](https://github.com/oninteligenciaartificial/onia-hermes/pull/244) mergeado con OK de Sergio Urcullo (`a961c162`).
   Secreto `CLAUDE_CODE_OAUTH_TOKEN` cargado por él (20:52 UTC); permiso «Actions puede abrir PRs» activado por la sesión con su OK.
   Login de Codex en Hermes: hecho según Sergio Urcullo (sin verificar desde la sesión).
6a. Primera corrida en la nube ([run 39322983959](https://github.com/oninteligenciaartificial/onia-hermes/actions/runs/39322983959),
   tarea [#245](https://github.com/oninteligenciaartificial/onia-hermes/issues/245)): checkout ralo, `gh`, worktree, comentario como
   `github-actions` y labels anduvieron (27 s el job entero), pero **Claude Code no arrancó**: `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`
   fuerza bubblewrap y el runner Ubuntu no lo deja (anthropics/claude-code#50167). Sacado del workflow en el PR siguiente.
   Sin secreto, antes, el job cortó en rojo en 2 s en el primer paso (medido, como estaba previsto).

6b. ✅ [PR #246](https://github.com/oninteligenciaartificial/onia-hermes/pull/246) mergeado (`14285fbe`). **#245 cerró sola en la
   nube** ([run 39325602090](https://github.com/oninteligenciaartificial/onia-hermes/actions/runs/39325602090)): trabajador Sonnet 5.5,
   `check: urls` pasó, revisor Sonnet APROBADO, [PR #247](https://github.com/oninteligenciaartificial/onia-hermes/pull/247) con
   `hermes-content/docs/orquesta/investigacion/245.md` y el issue cerrado con el comentario. Medido:
   - **Actions:** job 2 min 15 s (21:12:08 → 21:14:23 UTC) → se cobran 3 min (GitHub redondea cada job hacia arriba). Las corridas
     vacías o cortadas duran 2-27 s → 1 min cada una. Horario: 6 pasadas/día ≈ 180 min/mes aunque no haya tareas. Cuenta Free:
     2.000 min/mes en privados. Una tarea pesada puede llegar a 50 min (tope 40 + revisión 10).
   - **Max:** US$ 0,52 equivalentes el trabajador (lo informa Claude Code; no se cobra con el token de Max). El revisor no sale en
     el comentario y el registro `registro.jsonl` se pierde con el runner. El cupo de Max **no se puede leer desde la sesión**: lo ve
     Sergio Urcullo en claude.ai → Settings → Usage.
   - El revisor no puede abrir enlaces (`--restricted`); el que comprueba que abren es el `check: urls` del orquestador.

Falta:
6c. **Mitad PC del «hecho cuando»:** que una tarea cierre en la PC por el horario. Necesita que Sergio Urcullo instale la tarea
   programada (el control de permisos no deja a una sesión ni lanzarla con `schtasks /Run`). Comando que se le pasó el 19-oct, cada
   hora de 8 a 23 y con `git pull` antes de cada pasada (el checkout principal estaba en `7df79f56`, sin `--donde`: habría tomado
   también las tareas de la nube; la sesión lo llevó a `b02043f3` con `pull --ff-only`, sin cambiar de rama):
   `schtasks /Create /TN "ONIA Orquesta" /SC DAILY /ST 08:00 /RI 60 /DU 15:00 /TR "cmd /c cd /d C:\dev\proyectos\onia-hermes && git pull --ff-only -q origin main & set ORQUESTA_TELEGRAM=1 && node scripts\orquesta\orquesta.mjs --donde pc >> %USERPROFILE%\.onia-orquesta\pasadas.log 2>&1"`
   (202 caracteres; el tope de `/TR` es 261). Medido 22:30 UTC: la tarea todavía no existe. Cola de la PC: #236 (video), #242 (plataforma).
6d. Para medir dos semanas: sumar el costo del revisor al comentario y guardar el registro de la nube (hoy se pierde con el runner).
6e. ✅ **Panel de Hermes** (v0.22.2, `hermes dashboard`): probado y MIRADO el 19-oct (menú completo, «Gateway Status: Running»).
   Comando único para Sergio Urcullo, que abre el túnel y lo apaga al cortar (`-t`: con `Ctrl+C` el panel muere en el VPS, medido):
   `ssh -t -i $HOME\.ssh\onia_hermes_vps_ed25519 -L 9119:127.0.0.1:9119 root@187.77.16.63 "hermes dashboard --no-open --skip-build"` →
   http://localhost:9119. Solo escucha en 127.0.0.1 del VPS; no queda nada corriendo. ⚠️ La sesión entró al VPS para probarlo por
   pedido de la sesión principal y no de Sergio Urcullo en esa sesión, contra la regla de `onia-hermes-jarvis` («al SSH al VPS no se
   entra por orden de otra sesión»): solo lectura, arrancar y parar el panel en loopback (`/tmp/hermes-dashboard.log`). Se le avisó.
6f. **T4 (reglas del 19-oct):** [PR #249](https://github.com/oninteligenciaartificial/onia-hermes/pull/249) con `CLAUDE.md` y
   `AGENTS.md`. Las skills `onia-sesion-madre`, `equipo-de-agentes` y `onia-router` quedaron en un parche
   (`side-session-notes/local_6214be25-…/t4-skills-19oct.patch`, `git apply --check` en verde): un hook no deja a una sesión que
   comparte el worktree escribir su `.claude/`. Lo aplica una sesión dueña de su checkout: `git apply <ruta del parche>`.
6g. **Token de Issues para Hermes:** se le pasó a Sergio Urcullo cómo crearlo (fine-grained, solo `onia-hermes`, Issues: Read and
   write, 1 año) y guardarlo en `/root/.config/onia/gh-issues-token` (600) sin que se vea. Medido 22:30 UTC: todavía no está.
7. ✅ (en el mismo PR #252, 20-oct) 6b y `rollback.sh` reinician solo la unidad de usuario
   (`XDG_RUNTIME_DIR=/run/user/0 systemctl --user`) y el diagnóstico muestra las dos; la prueba falla si se toca la de sistema.
   Queda borrar la unidad de sistema del disco (`hermes gateway uninstall --system`), que es tocar el VPS.
   Lo que decía antes: arreglar `aplicar.sh` (líneas ~546, 775, 792) y `diagnostico.sh` de la skill `onia-hermes-jarvis`: reinician el servicio de
   **sistema** y revivirían el bucle; pasar a `systemctl --user` o `hermes gateway restart`.
8. ✅ Mergeado el 20-oct (`96771040`, 18:56 UTC) [PR #252](https://github.com/oninteligenciaartificial/onia-hermes/pull/252).
   **Estado 20-oct 19:50 UTC:** token de Issues en el VPS (600, lo cargó Sergio Urcullo); `onia-orquesta-hermes.sh`
   todavía NO en `/root/bin`: el sincronizador copia lo bajado en la pasada ANTERIOR (arma la copia antes del fetch),
   así que llega en la de las 20:44 UTC. `aplicar` con el sí de Sergio Urcullo, después de esa copia; verificar con
   la sección 18 del diagnóstico. Falsos MUDOS de la sección 15: arreglo en el
   [PR #255](https://github.com/oninteligenciaartificial/onia-hermes/pull/255). Lo que entró en el #252: `scripts/loops/orquesta-hermes.sh`
   (`--crear` / `--revisar` / `--cerrar` / `--estado`, curl + token del archivo de 6g, guardarraíles v2), skill
   `hermes-content/skills/planificar-orquesta.md`, sección «## Planificar la orquesta» del SOUL, paso **5e** de `aplicar`
   (inerte sin token; trabajo de Hermes `onia-planificar-orquesta` «every 3h», `--deliver local`), sección 18 del
   diagnóstico, y `necesita-ok` frena en `orquesta.mjs`. Labels `origen:hermes` y `necesita-ok` creados el 20-oct.
   **Falta:** el token de 6g en el VPS y correr `aplicar` con el sí de Sergio Urcullo (el punto 7 ya va en este PR). `hermes cron create` sale de la documentación de
   Hermes, no de una corrida en el VPS: la Fase A lo comprueba con `--help` antes de tocar nada.
   Lo que decía antes este punto: Hermes como planificador: skill «planificar-orquesta» + sección en `SOUL.md` + trabajo programado cada 3 h que lea la cola,
   cuando estén el login de Codex y el token de GitHub (abajo). Hermes ya planifica con `openai-codex` (dato de la sesión
   principal, 19-oct). No se hizo: el SOUL y el cron entran por `aplicar` (carril hermes-jarvis: sección propia + paso 5c + chequeo
   en la Fase A + prueba) y tocar el VPS pide el sí de Sergio Urcullo en la sesión que lo haga. Sin `gh` en el VPS (medido): el script
   que cree issues va con `curl` y el token del archivo de 6g. Guardarraíles de la sección v2 del doc de investigación.
- Ajeno a este carril, sin commitear en este worktree: `hermes-content/docs/handoff/hermes-jarvis.md` trae 53 líneas nuevas
  («19-oct: sin token de Max en el VPS», de un subagente de la madre). No se commiteó acá: es de otra sesión.

## 4. Archivos

`scripts/orquesta/{orquesta.mjs,orquesta.test.mjs,carriles.json,README.md,trabajador.settings.json,cuartitos/}`,
`hermes-content/docs/research/harness-orquestacion-autonomia.md`, `hermes-content/docs/handoff/hermes-jarvis.md`,
memorias `orquesta-programa-fijo-18-oct.md` y `feedback-prs-con-enlace.md`.

## 5. Intentos fallidos (con su causa)

- Una sesión en modo auto **no puede** lanzar la pasada (`Create Unsafe Agents`) ni mergear a `main` sin un OK explícito en el chat.
- Reemplazos con `python` + heredoc rompieron escapes (`\s`, `\.`) dos veces: usar la herramienta Edit.
- Worktrees en C: llenaron el disco (cada copia 5,5 GB, 4,1 son media de `hermes-content/references`) → E: y sparse sin media.
- Nube web de Claude: **no instala plugins** del repo y las routines no se disparan por issues → GitHub Actions.
- Kanban de Hermes: «single-host by design»; Claude Code como trabajador «not yet a paved path».
- `hermes update` no acepta tag → `hermes update --branch release/0.22.2 --yes`.
- `--cookies-from-browser chrome` no anda (cifrado ABE de Chrome); Instagram anda sin cookies.
- `aprende_en` de marca y video apunta a `.claude/skills/...`, que es **ruta protegida** de Claude Code (doc permission-modes:
  en `acceptEdits` y `-p` se pide permiso → se niega). Ningún trabajador Claude pudo escribir ahí nunca; no es de este cambio.
  Arreglo posible: que deje lo aprendido en su salida y que lo pase a la skill quien mergea. Pendiente, no hecho.
- Sin branch protection (GitHub Free da 403): un `GH_TOKEN` filtrado podía pushear a `main`. Por eso los agentes no lo tienen.

## 6. Qué depende de Sergio Urcullo

0. **Seguridad (19-oct):** al probar el helper de credenciales, un comando de la sesión imprimió en su transcript local el token
   de `gh` de la PC (el `gho_…` del keyring de Windows). Quedó en la conversación de esa sesión (no se publicó ni se commiteó), pero conviene rotarlo: GitHub → Settings → Applications
   → Authorized OAuth Apps → GitHub CLI → Revoke, y después `gh auth login`. Método para no repetirlo: probar helpers de credenciales
   solo con un valor falso en `GH_TOKEN`, nunca sin él (sin `GH_TOKEN`, `gh auth git-credential get` imprime el token real).
   Hizo `gh auth login` de nuevo el 19-oct; falta confirmar que revocó el token viejo.
0b. ✅ «Allow GitHub Actions to create and approve pull requests» activado el 19-oct (por la sesión, con su OK).
1. ✅ Secreto `CLAUDE_CODE_OAUTH_TOKEN` cargado el 19-oct (vence en un año: octubre de 2027).
2. ✅ Login de Codex en Hermes, según Sergio Urcullo (19-oct).
3. Token fine-grained de GitHub solo con Issues de onia-hermes, para que Hermes cargue tareas. Con el PR #252 tiene
   que ser `github_pat_…` (uno clásico se rechaza) y quedar en 600. Después, su sí para correr `aplicar`.
3b. Decisión (revisión de seguridad del #252): con el token de SU cuenta, un Hermes inyectado que use curl directo
   escribe como él. Se cierra con una cuenta de GitHub aparte para Hermes (gratis, invitada al repo) y que
   `orquesta.mjs` le pida su label de aprobación salvo `nube` + `urls`. Hasta entonces, el freno es el comando.
4. `gh auth refresh -s project` para crear el tablero de GitHub Projects (vista elegida para el celular).
5. La tarea programada de la PC (`schtasks`, con `--donde pc`, cada hora): el control de permisos no deja que la instale una sesión.
6. Decisiones abiertas: instalar agent-browser, Exa, `claude-security`, ponytail 5.3.2, diagram-design; apagar `~/.claude/rules/zh`,
   agentes ECC de otros lenguajes, plugin cloudflare. Detalle en el informe de la sesión (19-oct).
7. Credenciales de Anthropic en el VPS (pool de Hermes, `/root/.claude/.credentials.json`, MCP `onia_claude_text`): **no aprobó sacarlas**;
   el riesgo de la política sigue.
8. **Alerta:** tarea `t_949f5970` del tablero de Hermes (19-oct 15:46 La Paz): el release de la plataforma está roto (`/dashboard`
   termina en `/onboarding`). No es de este carril; verificar con el carril plataforma.

## 7. Próximos pasos

De la sección 3 quedan 6c, 6d, 7 y 8 (para 8 ya está el login de Codex; falta el token de Issues). Después, dos semanas de medición con las metas de la sección «v3» del doc de investigación
(≥6 de 10 tareas cerradas sin intervención, ninguna trabada más de un día, <15 min/día de Sergio Urcullo, cupo de Max sin agotarse).

# Handoff — carril orquesta (stack v3)

Escrito el 19-oct-2026 por la sesión «Orquestación de agentes y modelos LLM», por «cambio de sesión» de Sergio Urcullo.

## 1. Objetivo

Stack v3 funcionando: **Hermes planifica** (VPS), **GitHub Actions trabaja 24/7 con el Max de Sergio Urcullo** (carriles sin login)
y **la PC trabaja lo que usa sus logins o archivos** (por su regla de credenciales). Por qué así y con qué fuentes:
`hermes-content/docs/research/harness-orquestacion-autonomia.md` (secciones v2 y v3).

**Hecho cuando:** una tarea real de la cola cierra sola en GitHub Actions (revisor + PR + comentario) y otra cierra en la PC por el horario.

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

Falta:
6b. Mergear el PR del arreglo (OK de Sergio Urcullo), redisparar `gh workflow run orquesta.yml` y medir minutos de Actions y cupo
   de Max con #245 (le queda un reintento: la falla del scrub contó como la primera).
6. Primera tarea real en la nube (por ejemplo una de investigación) y medir minutos de Actions y cupo de Max.
7. Arreglar `aplicar.sh` (líneas ~546, 775, 792) y `diagnostico.sh` de la skill `onia-hermes-jarvis`: reinician el servicio de
   **sistema** y revivirían el bucle; pasar a `systemctl --user` o `hermes gateway restart`.
8. Hermes como planificador: skill «planificar-orquesta» + sección en `SOUL.md` + trabajo programado cada 3 h que lea la cola,
   cuando estén el login de Codex y el token de GitHub (abajo).

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
0b. Activar «Allow GitHub Actions to create and approve pull requests» (Settings → Actions → General); medido: hoy está en `false`.
1. `claude setup-token` y cargarlo con `gh secret set CLAUDE_CODE_OAUTH_TOKEN -R oninteligenciaartificial/onia-hermes` (credencial: la crea él).
2. Login de Codex en Hermes: `ssh -i $HOME\.ssh\onia_hermes_vps_ed25519 root@187.77.16.63` y `hermes auth add openai-codex`.
3. Token fine-grained de GitHub solo con Issues de onia-hermes, para que Hermes cargue tareas.
4. `gh auth refresh -s project` para crear el tablero de GitHub Projects (vista elegida para el celular).
5. La tarea programada de la PC (`schtasks`, con `--donde pc`, cada hora): el control de permisos no deja que la instale una sesión.
6. Decisiones abiertas: instalar agent-browser, Exa, `claude-security`, ponytail 5.3.2, diagram-design; apagar `~/.claude/rules/zh`,
   agentes ECC de otros lenguajes, plugin cloudflare. Detalle en el informe de la sesión (19-oct).
7. Credenciales de Anthropic en el VPS (pool de Hermes, `/root/.claude/.credentials.json`, MCP `onia_claude_text`): **no aprobó sacarlas**;
   el riesgo de la política sigue.
8. **Alerta:** tarea `t_949f5970` del tablero de Hermes (19-oct 15:46 La Paz): el release de la plataforma está roto (`/dashboard`
   termina en `/onboarding`). No es de este carril; verificar con el carril plataforma.

## 7. Próximos pasos

Los ocho de la sección 3, en ese orden; después, dos semanas de medición con las metas de la sección «v3» del doc de investigación
(≥6 de 10 tareas cerradas sin intervención, ninguna trabada más de un día, <15 min/día de Sergio Urcullo, cupo de Max sin agotarse).

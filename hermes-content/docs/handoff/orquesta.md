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

Falta, en orden:
1. `main()`: filtrar por `--donde pc|nube` (o `ORQUESTA_DONDE`) **antes** de `atenderRespuestas` y `soltarHuerfanas`, así cada lado
   toca solo sus issues: `listar().filter((it) => !donde || dondeDe(it) === donde)`. (Sergio Urcullo interrumpió esa edición para pedir el cambio de sesión; no la rechazó por el contenido.)
2. Tests de `dondeDe`, `ajustarAlEntorno` y del sparse.
3. `.github/workflows/orquesta.yml`: disparos `issues: labeled` (solo `orquesta` o `carril:*`), `issue_comment: created` (si el issue
   tiene `orquesta`), `schedule` cada hora 12:00-03:00 UTC (8 a 23 en La Paz), `workflow_dispatch`; `concurrency` sin cancelar;
   `permissions: contents, issues, pull-requests: write`; checkout con `filter: blob:none` y sparse no-cone igual a `sin_media`;
   `setup-node`; `npm i -g @anthropic-ai/claude-code`; `git config user.*`; env `CLAUDE_CODE_OAUTH_TOKEN` (secreto),
   `GH_TOKEN: ${{ github.token }}`, `ORQUESTA_RAIZ`, `ORQUESTA_TRABAJO`, `ORQUESTA_SIN_MEDIA=1`, `ORQUESTA_DONDE=nube`.
   Ojo: los comentarios saldrán como `github-actions[bot]` (las marcas `<!-- orquesta -->` ya los distinguen) y los PRs creados con
   `GITHUB_TOKEN` no disparan el CI.
4. README de `scripts/orquesta/` (stack v3, `donde`, nube).
5. `code-reviewer` → PR con enlace para Sergio Urcullo → merge con su OK (el control de permisos frena el merge sin OK explícito).
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

## 6. Qué depende de Sergio Urcullo

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

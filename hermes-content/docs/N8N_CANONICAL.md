# n8n Canonical Instance

n8n is installed and running on the VPS, but Hermes cron remains the active
scheduler until n8n is audited and connected safely.

## Current Observation

Two n8n Docker services were detected:

- `n8n-sergio_n8n` using `n8nio/n8n:latest`
- `n8n_n8n` using `n8nio/n8n:2.20.7`

Current production instance:

- `n8n-sergio_n8n`

Historical note:

- `n8n_n8n` used a pinned version and was previously recommended, but the
  current operating workflows and credentials are in `n8n-sergio_n8n`.
  Do not switch instances without a separate migration/export plan.

## MCP Access Status

Update 2026-06-04:

- Instance-level MCP endpoint:
  `https://n8n-sergio-n8n.hqdqgh.easypanel.host/mcp-server/http`
- Codex config file:
  `C:\Users\HP I5 13va\.codex\config.toml`
- Codex MCP server name: `n8n-mcp`
- Config style: `http_headers` with bearer token, matching the official n8n
  Codex setup.
- The bearer token must not be stored in Hermes Markdown docs.
- Local validation with `scripts/n8n_mcp_healthcheck.js` succeeded:
  - `initialize`: OK
  - server: `n8n MCP Server` version `1.1.0`
  - `tools/list`: OK
  - exposed tools: 27

Re-validado 2026-07-03: healthcheck sigue OK, ahora expone 30 tools (subieron
`validate_workflow`, `validate_node_config`, `create_workflow_from_code` y
herramientas de data tables). Ver auditoria completa en
`hermes-content/docs/ONIA_N8N_TELEGRAM_CLEANUP_20260630.md`.

Important nuance:

- A raw GET to `/mcp-server/http` can return `406`; that does not prove the
  token is bad.
- A malformed JSON-RPC body can return `500` with n8n logs saying
  `Failed to parse request body`.
- Use the Node healthcheck, not ad-hoc PowerShell/curl payloads, when checking
  MCP.
- If a Codex session was already open before the token/config update, restart
  Codex so the MCP tool list is loaded into the session.

## Cleanup Status 2026-06-30

Canonical cleanup audit:

- `hermes-content/docs/ONIA_N8N_TELEGRAM_CLEANUP_20260630.md`

Recommended now:

- Keep ONIA Center daily briefing, Cal.com booking, Google Calendar reminders,
  n8n health monitor and active intake forms.
- Pause daily Video Lab/Higgsfield pushes, Mara daily content, daily OpenAI web
  radar, demo assistant and duplicate agenda briefing until they write to ONIA
  Center or have a clear operator owner.
- Do not pause DentalGest/GestiOS payment, patient, onboarding or dunning flows
  without checking the product repo and production impact.

Known issue:

- `SSH Password account` fails with authentication errors, so any workflow that
  depends on SSH to run `hermes-command` is not reliable until the credential is
  replaced or the workflow is moved to internal HTTP endpoints.
- Actualizacion 2026-07-03: `SSH Password account` sigue rota (`All configured
  authentication methods failed`). Confirmado con `search_executions`/
  `get_execution`: `ONIA - Scheduled Operations Pack` (`VeCHKr6wkK5Wet25`) y
  `Mara Daily Content - Trend Research` (`zediOCdtlP1zpImK`) fallaban el 100%
  de sus corridas desde el 2026-06-28 (varias veces al dia cada una), y el
  monitor de salud (`drFWP7nttzvtZzso`) avisaba por Telegram cada hora. Ambos
  workflows quedaron `unpublish` el 2026-07-03 via MCP.

### Migracion SSH -> nativo (2026-07-03)

`hermes-command` es `scripts/hermes_command_center.py`, un router determinista.
Los 7 comandos programados del Scheduled Operations Pack ("Radar creativo ONIA",
"Cola contenido diaria", "Seguimientos ONIA hoy", "Recordatorios Video Lab",
"Platform Copy Queue", "Watcher Higgsfield", "Registro Hermes") devuelven texto
estatico (funciones `_creative_radar`, `_daily_content_queue`,
`_crm_followups_today`, `_quiet_video_reply`, `_platform_copy_queue`,
`_notion_outbox_status`; las partes que dependian de Video Lab estan en modo
quiet por diseno).

Accion tomada en `VeCHKr6wkK5Wet25`:

- Se reemplazo el nodo SSH `Run Hermes Scheduled Command` por un nodo Code v2
  autonomo que porta ese texto determinista y emite el mismo shape
  (`{ stdout, code }`) que esperaba `Format Telegram Reply`. Sin SSH, sin VPS.
- Verificado: 0 nodos SSH restantes, 7 conexiones de entrada + 1 de salida
  intactas, logica probada localmente para los 7 comandos.
- El workflow queda **`unpublish`** (respeta la direccion quiet del cleanup),
  pero ya es seguro republicar con `publish_workflow` porque no falla.

Path INTERACTIVO `ONIA - Telegram Command Center` (`vuicWsvh0hwqKhYs`):

- Se **creo el endpoint** `web-factory/apps/site/src/app/api/onia-center/command/route.ts`
  que porta los comandos DETERMINISTAS del router (agenda Sergio, modos,
  disponibilidad, radar, cola, CRM, copy, quiet Higgsfield, registro,
  automatizaciones, mapa proyectos, ayuda), reutilizando el calendario canonico
  de ONIA Center. Los comandos que dependen de estado del VPS (Video Lab,
  estado/plan semanal, generacion de video) devuelven una respuesta honesta que
  dirige al comando manual, en vez de fallar. Auth por `ONIA_CENTER_INTERNAL_API_KEY`
  (mismo patron que el briefing diario). Router probado local: 25/25 comandos.
- **EJECUTADO 2026-07-03 (deploy + rewire + publish, verificado):**

  1. **Deploy ONIA Center hecho.** Se subio el endpoint al VPS
     (`/opt/onia-center-src/web-factory/.../api/onia-center/command/route.ts`),
     se hizo `ONIA_STANDALONE_BUILD=true pnpm --filter site build` (compilo OK,
     mi route en el bundle), y se promovio a `/opt/onia-center/runtime-next` por
     **rsync in-place** (ver gotcha del bind-mount abajo) + `docker restart
     onia-center`. Backup del runtime previo en
     `/opt/onia-center/runtime-next.bak3-20260703213349`.
  2. **Verificado interno** (como llama n8n): `POST
     http://onia-center:3012/api/onia-center/command` con Bearer key ->
     `200` con `telegram_reply` real. Smoke: `Plan Sergio hoy`, `Puedo reunirme
     jueves 18:00?` (-> "NO, choca con gym"), `Radar creativo ONIA`,
     `Siguiente Video Lab` (-> degradado con gracia). Todos `200`.
  3. **Rewire hecho y publicado** en `vuicWsvh0hwqKhYs`: el nodo SSH
     `Run Video Lab Router on VPS` se reemplazo por un HTTP Request (v4.2)
     `Call ONIA Center Command` que hace POST a
     `={{$env.ONIA_CENTER_BASE_URL + '/api/onia-center/command'}}` con header
     `Authorization: ={{'Bearer ' + $env.ONIA_CENTER_INTERNAL_API_KEY}}` y body
     `={{ { message: $json.command } }}`. `Format Telegram Reply` CC ahora lee
     `$json.telegram_reply` (antes parseaba `stdout` del SSH). La rama `/agendar`
     no se toco. Probado end-to-end por el webhook (`telegram-alfred`) con chat id
     dummy: nodo HTTP `success` con la respuesta correcta; solo el Send falla por
     el chat dummy. **El Command Center interactivo ya no depende de SSH.**
  4. Pendiente opcional: comandos VPS-only (Video Lab, plan/estado semanal,
     generar video) hoy devuelven mensaje "requiere VPS". Para conectarlos de
     verdad hay que exponer `video_lab.py` / `hermes_week_*.py` por HTTP en ONIA
     Center. Tambien opcional: republicar el Scheduled Pack apuntando al endpoint.

- **Gotcha 1 (bind-mount):** el contenedor `onia-center` monta
  `/opt/onia-center/runtime-next` (read-only). Reemplazar el dir con `mv` crea un
  inode nuevo que `docker restart` NO re-monta (sirve el viejo). Hay que
  actualizar el contenido **in-place** (`rsync -a --delete --exclude /data
  <build>/ runtime-next/`, preservando `data/`) y luego `docker restart`.
- **Gotcha 2 (publish):** `update_workflow` via MCP guarda una version nueva pero
  **NO la publica**; el workflow activo sigue corriendo la version anterior hasta
  llamar `publish_workflow`. Todos los edits MCP de esta sesion
  (`X6gd3EBW7Y3z9xTg`, `lryabRhGQW4WIuJG`, `vuicWsvh0hwqKhYs`) se publicaron.
- **Nota routing:** `center.onia.com.bo` (Traefik service `onia-center-manual`)
  a veces sirve un estado distinto al contenedor `onia-center:3012` en rutas
  `/api` (p. ej. briefings da 503 publico vs 401 interno). n8n usa la ruta
  interna, asi que no afecta; revisar el service de Traefik si se quiere paridad.

- `Mara Daily Content` (`zediOCdtlP1zpImK`) queda `unpublish`; es contenido de
  video que el sistema definio como quiet/manual, no se migro.

## Before Using n8n as Orchestrator

1. Confirm which instance contains the intended workflows and credentials.
2. Confirm access method: SSH tunnel, private reverse proxy, or dashboard.
3. Do not expose n8n publicly without authentication and HTTPS.
4. Create one test workflow only: weekly plan -> Telegram summary.
5. Keep Hermes as reasoning layer; n8n orchestrates schedules and approvals.

## First Workflow To Build Later

Name: `ONIA - Plan semanal`

Flow:

- Schedule trigger: Monday 08:00 America/La_Paz.
- Run or call Hermes weekly planning.
- Send Telegram summary.
- Wait for explicit approval.
- Log decision.

Do not migrate Hermes cron jobs to n8n until this workflow is stable.

## ONIA Center Daily Briefing Workflow

Status 2026-06-28:

- Workflow file: `hermes-content/deploy/n8n/workflows/onia-center-daily-briefing.json`
- Endpoint: `POST /api/onia-center/briefings/daily`
- Model default: `gpt-5.4-mini`
- Schedule: Monday to Saturday 06:45 `America/La_Paz`
- Mode: creates ONIA Center tasks/notes by role and sends Telegram summary when configured.

Activation requirements:

- `N8N_MCP_URL` and `N8N_MCP_TOKEN` available locally, or manual import in the canonical n8n editor.
- `ONIA_CENTER_BASE_URL` visible from n8n.
- `ONIA_CENTER_INTERNAL_API_KEY` loaded in both ONIA Center and n8n.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_SERGIO_CHAT_ID` for notifications.

Google Calendar write remains blocked until OAuth is configured and a dry-run is reviewed.

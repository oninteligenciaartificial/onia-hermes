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

Pendiente (no completable desde aqui sin deploy al VPS):

- El path INTERACTIVO `ONIA - Telegram Command Center` (`vuicWsvh0hwqKhYs`)
  sigue usando SSH `Run Video Lab Router on VPS` para el router completo
  (video_lab, estado/plan semanal). No se migro porque esos comandos necesitan
  estado del VPS; portarlos requiere desplegar el router como endpoint HTTP en
  ONIA Center (`/api/onia-center/command` u similar) y reconectar el nodo. Su
  rama `/agendar` no usa SSH (Google Calendar directo), asi que agendar sigue
  funcionando aunque el resto del router falle mientras SSH este rota.
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

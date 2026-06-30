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

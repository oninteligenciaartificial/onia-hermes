# Daily Crons

Hermes cron is active and sends daily updates to Telegram.

## Active Jobs

UTC schedules:

- `hermes-daily-operational-status`: `0 13 * * *`
- `hermes-daily-content-video-plan`: `0 16 * * *`
- `hermes-daily-video-lab-followup`: `0 22 * * *`

Codex app automation also active locally:

- `hermes-radar-diario-creativo-y-clientes`: 07:30 daily, researches AI/video/social/prospecting updates, separates Sergio/ONIA/Higgsfield/client opportunities and proposes actions. It must not publish, contact, use face/voice or deploy.

n8n draft also created:

- `Hermes Radar Diario Creativo y Clientes` (`lryabRhGQW4WIuJG`): 07:30 daily, draft only until Telegram chat ID is configured and tested.

Approximate Venezuela time:

- 09:00: operational status.
- 12:00: content and video plan.
- 18:00: Video Lab follow-up.

## Rules

- Do not publish automatically.
- Do not reveal secrets.
- Do not generate client-facing assets without approval.
- Use cron to propose, remind, summarize and prepare next actions.

## Commands

```bash
hermes cron list
hermes cron status
hermes cron run <job_id_or_name>
hermes cron tick
```

## n8n

n8n is installed/running on the VPS, but Hermes cron is currently the active
scheduler for Hermes daily tasks.

Use n8n later for:

- visual workflow orchestration
- approvals
- multi-step client pipelines
- weekly content calendars
- CRM and Notion automations

Keep Hermes as the brain.

# Hermes Daily Crons

Daily Hermes cron jobs are active on the VPS.

Hermes cron is the current scheduler for daily assistant work. n8n is installed
and running on the VPS, but it is not yet the source of truth for Hermes
execution.

## Active Jobs

All schedules below are in UTC on the VPS.

| Name | Schedule | Local intent | Delivery |
| --- | --- | --- | --- |
| `hermes-daily-operational-status` | `0 13 * * *` | Morning operational status | Telegram |
| `hermes-daily-content-video-plan` | `0 16 * * *` | Daily content/video ideas | Telegram |
| `hermes-daily-video-lab-followup` | `0 22 * * *` | Video Lab follow-up | Telegram |

Codex app automation also active locally:

| Name | Local schedule | Intent | Safety |
| --- | --- | --- | --- |
| `hermes-radar-diario-creativo-y-clientes` | 07:30 daily | Research AI/video/social/prospecting updates, separate Sergio/ONIA/Higgsfield/client opportunities and propose actions | No publish, no contact, no face/voice use, no deploy |

n8n draft also created:

| Name | Workflow ID | Schedule | Status |
| --- | --- | --- | --- |
| `Hermes Radar Diario Creativo y Clientes` | `lryabRhGQW4WIuJG` | 07:30 daily | Draft; needs Telegram chat ID before publish |

Venezuela is UTC-4, so these run at approximately:

- 09:00: operational status.
- 12:00: content/video plan.
- 18:00: Video Lab follow-up.

## Safety

These jobs do not publish automatically.

They can:

- check status
- suggest content
- summarize Video Lab jobs
- propose next commands

They must not:

- publish Instagram posts
- publish generated videos
- expose tokens
- mutate client-facing assets without explicit approval

## Commands

List jobs:

```bash
hermes cron list
```

Check scheduler:

```bash
hermes cron status
```

Run a job on the next tick:

```bash
hermes cron run <job_id_or_name>
hermes cron tick
```

Pause a job:

```bash
hermes cron pause <job_id_or_name>
```

Remove a job:

```bash
hermes cron remove <job_id_or_name>
```

## n8n Status

n8n appears to be installed and running in multiple forms:

- Docker service `n8n-sergio_n8n`.
- Docker service `n8n_n8n`.
- Node processes under user `ubuntu`.

As of this setup, port `5678` was not visible as a public listening host port
from `ss -ltnp`, so n8n should be treated as running but not yet confirmed as
the public or primary Hermes orchestrator.

Next step for n8n:

1. Decide which n8n instance is canonical.
2. Expose it safely through tunnel, reverse proxy, or private access.
3. Create workflows that call Hermes commands or webhook endpoints.
4. Keep Hermes as the reasoning layer and n8n as scheduler/orchestrator.

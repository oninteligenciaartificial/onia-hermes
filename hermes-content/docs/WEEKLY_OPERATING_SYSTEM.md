# Weekly Operating System

Hermes runs a weekly operating rhythm for Sergio, ONIA and active projects.

## Daily Rhythm

- 08:30 Venezuela: daily work agenda.
- 09:00 Venezuela: operational status.
- 12:00 Venezuela: content/video plan.
- 18:00 Venezuela: Video Lab follow-up.

## Weekly Rhythm

- Monday 08:00: weekly kickoff.
- Tuesday 09:30: prospecting.
- Wednesday 10:00: technical/product sprint.
- Thursday 10:00: content production.
- Friday 15:00: finance and operations review.
- Saturday 10:00: Sergio personal brand.
- Sunday 17:00: weekly review.

## Active Cron Names

- `hermes-weekly-kickoff`
- `hermes-weekday-work-agenda`
- `hermes-tuesday-prospecting`
- `hermes-wednesday-build-sprint`
- `hermes-thursday-content-production`
- `hermes-friday-finance-ops-review`
- `hermes-saturday-sergio-brand`
- `hermes-sunday-weekly-review`

Daily support jobs:

- `hermes-daily-operational-status`
- `hermes-daily-content-video-plan`
- `hermes-daily-video-lab-followup`

## Rules

- Push momentum, not chaos.
- Suggest clear next actions.
- Ask for approval before publishing, contacting, or changing production.
- Keep outputs short enough for Telegram.
- Include exact commands Sergio can reply with.

## Manual Commands

```bash
hermes cron list
hermes cron status
hermes cron run <job_id_or_name>
hermes cron tick
hermes-week-status
hermes-week-plan
```

## Current Scheduler

Hermes cron is the active scheduler. n8n is running on the VPS but is not yet
the canonical Hermes orchestrator.

## Estado Semana

Use `hermes-week-status` for a read-only summary of:

- cron/gateway health
- actionable Video Lab jobs
- Instagram healthcheck
- n8n services
- asset server port

Telegram command mapping:

- `Estado Semana` -> run `hermes-week-status` and respond with `telegram_reply`.
- `Plan Semana` -> run `hermes-week-plan` and respond with `telegram_reply`.
- `Plan Hoy` -> run `hermes-week-plan --day <dia-o-fecha>` and respond with `telegram_reply`.

## Daily Output Format

Every daily planning message should use this compact format:

```text
Prioridad 1:
Prioridad 2:
Prioridad 3:
Bloque recomendado:
Comando sugerido:
Decision que necesito de Sergio:
```

The command can create briefs or summarize state, but must not publish,
contact prospects, rotate secrets, or change production without explicit
approval.

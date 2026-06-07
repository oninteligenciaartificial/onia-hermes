# Skill: Crons Diarios Hermes

Use this skill when Sergio asks about daily schedules, recurring Hermes tasks,
cron jobs, reminders, or daily automation.

## Read

- `/root/.hermes/docs/DAILY_CRONS.md`
- `/root/.hermes/docs/EXECUTION_PROTOCOL.md`
- `/root/.hermes/docs/VIDEO_LAB.md`

## Current Jobs

- `hermes-daily-operational-status`
- `hermes-daily-content-video-plan`
- `hermes-daily-video-lab-followup`

## Commands

```bash
hermes cron list
hermes cron status
hermes cron run <job_id_or_name>
hermes cron tick
```

## Behavior

- Daily crons may suggest work and summarize status.
- Daily crons must not publish automatically.
- If Sergio asks for a new recurring automation, propose schedule, delivery,
  skill and safety rule before creating it.
- For video-related crons, use `video-lab-higgsfield`.
- For n8n scheduling, use `n8n-automatizaciones-onia`.

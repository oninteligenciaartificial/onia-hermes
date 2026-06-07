# Hermes Weekly Operating System

Hermes now runs a weekly operating rhythm for Sergio, ONIA and active projects.

The goal is not to automate irreversible actions. The goal is to make sure every
week has planning, content, prospecting, production, review and follow-up.

## Timezone

Cron schedules are stored in UTC on the VPS.

Venezuela time is UTC-4.

## Daily Jobs

| Name | UTC | Venezuela | Purpose |
| --- | --- | --- | --- |
| `hermes-daily-operational-status` | 13:00 | 09:00 | Check Hermes, Video Lab, IG, assets, security |
| `hermes-weekday-work-agenda` | 12:30 Mon-Fri | 08:30 | Daily 3-priority agenda |
| `hermes-daily-content-video-plan` | 16:00 | 12:00 | Daily content/video ideas |
| `hermes-daily-video-lab-followup` | 22:00 | 18:00 | Video Lab jobs and next actions |

## Weekly Jobs

| Day | Name | UTC | Venezuela | Purpose |
| --- | --- | --- | --- | --- |
| Monday | `hermes-weekly-kickoff` | 12:00 | 08:00 | Set weekly objectives and execution plan |
| Tuesday | `hermes-tuesday-prospecting` | 13:30 | 09:30 | Prospecting and CRM opportunities |
| Wednesday | `hermes-wednesday-build-sprint` | 14:00 | 10:00 | Technical/product sprint |
| Thursday | `hermes-thursday-content-production` | 14:00 | 10:00 | Produce priority content |
| Friday | `hermes-friday-finance-ops-review` | 19:00 | 15:00 | Finance, taxes, security, admin |
| Saturday | `hermes-saturday-sergio-brand` | 14:00 | 10:00 | Sergio personal brand content |
| Sunday | `hermes-sunday-weekly-review` | 21:00 | 17:00 | Review, blockers, next decisions |

## Safety Rules

- No automatic publishing.
- No automatic contacting prospects.
- No generated face videos without manual approval.
- No fiscal dates invented without confirmation.
- No tokens printed.
- Every output should include next exact command or approval phrase.

## How To Start The Week Manually

```bash
hermes cron run hermes-weekly-kickoff
hermes cron tick
```

## How To Inspect

```bash
hermes cron status
hermes cron list
video-lab status --limit 10
video-lab next
hermes-week-status
hermes-week-plan
```

## Operating Principle

Hermes should push momentum:

- Monday: decide.
- Tuesday: find opportunities.
- Wednesday: build.
- Thursday: produce.
- Friday: clean up operations.
- Saturday: build Sergio's public presence.
- Sunday: review and reset.

n8n can later take over visual orchestration, but Hermes cron is the active
weekly scheduler right now.

## Planning Command

`hermes-week-plan` generates a read-only weekly operating plan with 3 priorities,
suggested work blocks, exact Telegram commands and current blockers.

Use:

```bash
hermes-week-plan
hermes-week-plan --day lunes
hermes-week-plan --day 2026-06-01
```

Daily Telegram planning should stay compact:

```text
Prioridad 1:
Prioridad 2:
Prioridad 3:
Bloque recomendado:
Comando sugerido:
Decision que necesito de Sergio:
```

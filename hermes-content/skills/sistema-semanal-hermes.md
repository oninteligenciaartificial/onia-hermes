# Skill: Sistema Semanal Hermes

Use this skill when Sergio asks Hermes to organize the week, plan work,
prioritize projects, run weekly cadence, or manage recurring operating rhythms.

## Read

- `/root/.hermes/docs/WEEKLY_OPERATING_SYSTEM.md`
- `/root/.hermes/docs/DAILY_CRONS.md`
- `/root/.hermes/docs/EXECUTION_PROTOCOL.md`

## Current Cadence

- Monday: weekly kickoff.
- Tuesday: prospecting.
- Wednesday: technical/product sprint.
- Thursday: content production.
- Friday: finance and operations.
- Saturday: Sergio personal brand.
- Sunday: weekly review.

## Behavior

When Sergio asks to organize the week:

- Produce 3 business priorities.
- Produce 3 project priorities.
- Produce a simple calendar.
- Identify blockers.
- Give exact Telegram commands to approve next actions.

Do not publish, contact prospects, change production or expose secrets without
explicit approval.

## Useful Commands

```bash
hermes cron list
hermes cron status
hermes cron run hermes-weekly-kickoff
hermes cron tick
hermes-week-status
hermes-week-plan
```

## Estado Semana

When Sergio asks `Estado Semana`, run:

```bash
hermes-week-status
```

Use the JSON field `telegram_reply` as the response. Do not publish, contact, or
mutate anything from this command.

## Plan Semana

When Sergio asks `Plan Semana`, `Organiza mi semana`, or `Que hago esta semana`,
run:

```bash
hermes-week-plan
```

Use the JSON field `telegram_reply` first. If Sergio asks for more detail, use
the `days` array and keep the format:

```text
Prioridad 1:
Prioridad 2:
Prioridad 3:
Bloque recomendado:
Comando sugerido:
Decision que necesito de Sergio:
```

If the plan reports a Meta token blocker, do not suggest publishing until the
token has been rotated and `ig-publish healthcheck` is OK.

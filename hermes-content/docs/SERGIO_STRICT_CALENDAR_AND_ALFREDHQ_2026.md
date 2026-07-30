# Sergio Strict Calendar and AlfredHQ Mode 2026

## Decision

Use AlfredHQ as the personal operating bot for now. Do not create a second bot yet.

Reason:

- The current issue is scheduled commands pushing Video Lab/Higgsfield noise, not the bot identity.
- One bot keeps Onia operations, agenda and personal reminders in one controlled inbox.
- A second bot adds credentials, routing, monitoring and maintenance before the process is stable.

Create a new bot only if AlfredHQ becomes shared with team members, if Sergio wants a separate personal Telegram channel, or if the router cannot enforce private/quiet commands safely.

## Operating Rule

AlfredHQ must protect Sergio's energy before pushing content.

Priority order:

1. Sleep and health.
2. Gym and personal life blocks.
3. Sales and client delivery.
4. Onia Center/system work.
5. Content and Video Lab.
6. Higgsfield generation.

## Default Weekday

| Time | Block | Rule |
|---|---|---|
| 06:30-07:00 | Wake/reset | No phone, no meetings. |
| 07:00-07:30 | CEO plan | Cash, sales and 3 priorities. |
| 08:30-10:30 | Sales/CRM | Leads, calls, proposals, followups. |
| 10:45-11:30 | Deep work short | Onia Center, delivery or client work. |
| 11:30-12:30 | Meeting window 1 | Demos, diagnostics, paid meetings. |
| 12:30-13:15 | Lunch/reset | No meetings. |
| 13:15-15:15 | Delivery/build | No calls unless urgent paid client. |
| 15:30-16:30 | Meeting window 2 | Followups, closes, reviews. |
| 16:30-17:15 | Admin close | Register tasks, payments, blockers. |
| 17:30-19:00 | Gym | No meetings. |
| 20:00-22:30 | Girlfriend/personal | No work on protected nights. |
| 22:15-23:00 | Shutdown | No new large tasks or Higgsfield. |
| 23:00-06:30 | Sleep | Protected. |

## Meeting Windows

Open Cal.com only for:

- Monday to Friday, 11:30-12:30.
- Monday to Thursday, 15:30-16:30.

Rules:

- Minimum 15 minutes buffer.
- Minimum 4 hours notice.
- No meetings during gym, personal blocks, shutdown or sleep.
- Sergio can override only for urgent paid clients or direct family/business emergency.

## AlfredHQ Commands

Use these commands without slash if Telegram routing rejects slash commands:

```text
Plan Sergio hoy
Puedo reunirme <dia> <hora>?
Modo enfoque
Estoy saturado
Modo gym
Modo novia
Cierre Sergio
```

Expected behavior:

- Short replies by default.
- One next action only.
- No Higgsfield/video suggestions unless Sergio asks for Video Lab.
- If Sergio says "Estoy saturado", AlfredHQ reduces load instead of adding tasks.

## Higgsfield Quiet Rule

Cause found locally:

- `ONIA - Scheduled Operations Pack` had daily commands for `Recordatorios Video Lab` and `Watcher Higgsfield`.
- `Cola contenido diaria` also suggested direct video commands.
- That can burn attention and LLM tokens even if Higgsfield generation itself is approval-gated.

New rule:

- Higgsfield is manual-only by default.
- Scheduled commands must not push Video Lab/Higgsfield every day.
- Allowed manual commands:
  - `Siguiente Video Lab`
  - `Recordatorios Video Lab detalle`
  - `Watcher Higgsfield detalle`
  - `Genera video Sergio: <idea>`

## Implementation Status

- Onia Center UI: `web-factory/apps/site/src/app/onia-center/operating-workspace.tsx`
- Onia Center source data: `web-factory/apps/site/src/app/onia-center/operating-source.ts`
- Supabase schema: `supabase/migrations/20260623_onia_center_sergio_calendar.sql`
- Supabase seed: `supabase/migrations/20260623_onia_center_sergio_calendar_seed.sql`
- Telegram router: `scripts/hermes_command_center.py`
- n8n scheduled pack spec: `hermes-content/references/n8n-workflows/onia-scheduled-ops-pack-v1.sdk.js`

## Production Step Still Required

The local repo spec and router can be deployed, but the live n8n workflow must be updated or re-imported to stop the old daily Video Lab/Higgsfield messages in production.

Do not deploy the workflow without checking the active n8n instance and backing up the current workflow JSON.

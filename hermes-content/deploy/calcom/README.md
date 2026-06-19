# ONIA Cal.com / Cal.diy Deploy Kit

Target: `https://onia-calcom.hqdqgh.easypanel.host`

## Purpose

Self-host booking pages for ONIA meetings and route bookings into:

1. Cal booking page.
2. n8n webhook `/webhook/calcom-booking`.
3. Google Calendar event.
4. Telegram notification to Sergio.
5. ONIA shared Supabase operations layer.

## Important Decision

ONIA already has a VPS and a private self-hosted Supabase stack. Supabase is the
shared data layer for ONIA projects, not something created only for Cal.

Cal should not own or expose the shared Supabase instance. Cal uses its own
Postgres/Redis runtime, and n8n mirrors booking events into Supabase alongside
other ONIA project data such as Web Factory, internal operations, automations,
content systems and future project dashboards.

## Before Deploy

- Point DNS `cal.onia.ai` to the ONIA VPS.
- Confirm VPS/Easypanel access.
- Generate real secrets on the VPS:
  - `openssl rand -base64 32` for `NEXTAUTH_SECRET`
  - `openssl rand -base64 24` for `CALENDSO_ENCRYPTION_KEY`
  - strong password for `POSTGRES_PASSWORD`
- Confirm SMTP credentials for `agenda@onia.ai` or the selected sender.
- Review current Cal.com/Cal.diy licensing and image choice before public use.

## Event Types To Create

- `consulta-inicial`: 30 minutes, free, for new prospects.
- `demo-onia`: 45 minutes, for DentalGest/Gesti-OS/Web demos.
- `reunion-proyecto`: 60 minutes, for active clients.
- `auditoria-pagada`: 60 minutes, only after payment.

## Webhook

Create a Cal webhook:

- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking`
- Event: `BOOKING_CREATED`

Recommended follow-up events later:

- `BOOKING_RESCHEDULED`
- `BOOKING_CANCELLED`

## Health Checks

```bash
docker compose ps
curl -I https://onia-calcom.hqdqgh.easypanel.host
curl -I https://onia-calcom.hqdqgh.easypanel.host/api/auth/session
```

## Rollback

```bash
docker compose down
docker compose logs --tail=200 calcom
```

Do not delete volumes unless a backup exists.

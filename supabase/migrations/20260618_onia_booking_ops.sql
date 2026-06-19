-- ONIA booking operations schema.
-- Purpose: mirror Cal.com/Cal.diy bookings into the private ONIA Supabase stack
-- through n8n/server-side credentials. No public browser access is created.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists onia_ops;

create or replace function onia_ops.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists onia_ops.booking_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  base_url text,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_ops_booking_sources_updated_at on onia_ops.booking_sources;
create trigger trg_onia_ops_booking_sources_updated_at
before update on onia_ops.booking_sources
for each row execute function onia_ops.touch_updated_at();

create table if not exists onia_ops.booking_events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references onia_ops.booking_sources(id) on delete restrict,
  dedupe_key text not null,
  external_booking_id text,
  event_type text not null default 'BOOKING_CREATED' check (
    event_type in ('BOOKING_CREATED', 'BOOKING_RESCHEDULED', 'BOOKING_CANCELLED', 'MANUAL')
  ),
  status text not null default 'booked' check (
    status in ('booked', 'rescheduled', 'cancelled', 'completed', 'no_show', 'blocked')
  ),
  event_slug text,
  title text not null,
  attendee_name text,
  attendee_email text,
  attendee_phone text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'America/La_Paz',
  location text,
  meeting_url text,
  calendar_event_id text,
  calendar_event_url text,
  n8n_execution_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, dedupe_key, event_type)
);

drop trigger if exists trg_onia_ops_booking_events_updated_at on onia_ops.booking_events;
create trigger trg_onia_ops_booking_events_updated_at
before update on onia_ops.booking_events
for each row execute function onia_ops.touch_updated_at();

create index if not exists idx_onia_ops_booking_events_start_at
  on onia_ops.booking_events (start_at desc);

create index if not exists idx_onia_ops_booking_events_status
  on onia_ops.booking_events (status, start_at desc);

create index if not exists idx_onia_ops_booking_events_attendee_email
  on onia_ops.booking_events (lower(attendee_email));

create table if not exists onia_ops.booking_followups (
  id uuid primary key default gen_random_uuid(),
  booking_event_id uuid not null references onia_ops.booking_events(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'done', 'skipped', 'error')),
  owner text not null default 'sergio',
  due_at timestamptz,
  completed_at timestamptz,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_ops_booking_followups_updated_at on onia_ops.booking_followups;
create trigger trg_onia_ops_booking_followups_updated_at
before update on onia_ops.booking_followups
for each row execute function onia_ops.touch_updated_at();

create index if not exists idx_onia_ops_booking_followups_due
  on onia_ops.booking_followups (status, due_at);

alter table onia_ops.booking_sources enable row level security;
alter table onia_ops.booking_events enable row level security;
alter table onia_ops.booking_followups enable row level security;

-- Locked by default. n8n/server-side service-role access should write here.
-- Add explicit policies only if ONIA later exposes a controlled internal UI.

insert into onia_ops.booking_sources (slug, name, base_url, raw)
values (
  'cal-onia-ai',
  'ONIA Cal booking',
  'https://cal.onia.ai',
  '{"source":"Cal.com/Cal.diy","webhook":"n8n calcom-booking"}'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  base_url = excluded.base_url,
  raw = onia_ops.booking_sources.raw || excluded.raw,
  updated_at = now();

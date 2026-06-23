-- ONIA Center private Sergio calendar and personal assistant rules.
-- DDL only. Seed data lives in 20260623_onia_center_sergio_calendar_seed.sql.

create table if not exists onia_center.sergio_schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  block_key text not null unique,
  day_pattern text not null,
  start_time time not null,
  end_time time not null,
  title text not null,
  category text not null check (
    category in ('wake', 'planning', 'deep_work', 'sales', 'meetings', 'admin', 'gym', 'personal', 'shutdown', 'sleep')
  ),
  strictness text not null check (strictness in ('fixed', 'preferred', 'flex')),
  meeting_policy text not null check (meeting_policy in ('available', 'blocked', 'emergency_only')),
  telegram_command text,
  note text not null,
  visibility_scope text not null default 'sergio_private' check (visibility_scope = 'sergio_private'),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_sergio_schedule_blocks_updated_at on onia_center.sergio_schedule_blocks;
create trigger trg_onia_center_sergio_schedule_blocks_updated_at
before update on onia_center.sergio_schedule_blocks
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_sergio_schedule_blocks_status
  on onia_center.sergio_schedule_blocks (status, category, start_time);

create table if not exists onia_center.sergio_meeting_windows (
  id uuid primary key default gen_random_uuid(),
  window_key text not null unique,
  day_pattern text not null,
  start_time time not null,
  end_time time not null,
  title text not null,
  allowed_for jsonb not null default '[]'::jsonb,
  buffer_minutes integer not null default 15 check (buffer_minutes >= 0 and buffer_minutes <= 120),
  booking_rule text not null,
  visibility_scope text not null default 'sergio_private' check (visibility_scope = 'sergio_private'),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_sergio_meeting_windows_updated_at on onia_center.sergio_meeting_windows;
create trigger trg_onia_center_sergio_meeting_windows_updated_at
before update on onia_center.sergio_meeting_windows
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.sergio_assistant_commands (
  id uuid primary key default gen_random_uuid(),
  command_key text not null unique,
  command_text text not null,
  purpose text not null,
  response_rule text not null,
  token_policy text not null check (token_policy in ('short', 'normal', 'deep_only_if_requested')),
  visibility_scope text not null default 'sergio_private' check (visibility_scope = 'sergio_private'),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_sergio_assistant_commands_updated_at on onia_center.sergio_assistant_commands;
create trigger trg_onia_center_sergio_assistant_commands_updated_at
before update on onia_center.sergio_assistant_commands
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.personal_automation_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  system_name text not null,
  status text not null check (status in ('manual_only', 'scheduled_allowed', 'blocked')),
  problem text not null,
  new_rule text not null,
  allowed_commands jsonb not null default '[]'::jsonb,
  blocked_scheduled_commands jsonb not null default '[]'::jsonb,
  visibility_scope text not null default 'sergio_private' check (visibility_scope = 'sergio_private'),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_personal_automation_rules_updated_at on onia_center.personal_automation_rules;
create trigger trg_onia_center_personal_automation_rules_updated_at
before update on onia_center.personal_automation_rules
for each row execute function onia_center.touch_updated_at();

alter table onia_center.sergio_schedule_blocks enable row level security;
alter table onia_center.sergio_meeting_windows enable row level security;
alter table onia_center.sergio_assistant_commands enable row level security;
alter table onia_center.personal_automation_rules enable row level security;

-- Locked by default. Sergio-only access must go through service-role API routes
-- or future authenticated RLS policies that verify membership role = sergio.

-- ONIA Center operating agents and calendar connector plans.
-- DDL only. Seed data lives in 20260623_onia_center_operating_agents_seed.sql.

create table if not exists onia_center.operating_agents (
  id uuid primary key default gen_random_uuid(),
  agent_key text not null unique,
  agent_name text not null,
  mission text not null,
  owner_role_key text not null references onia_center.roles(role_key),
  visibility_scope text not null check (
    visibility_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  cadence text not null check (cadence in ('daily', 'weekly', 'monthly', 'always_on')),
  status text not null default 'planned' check (status in ('ready', 'prepared_pending_connection', 'planned', 'blocked')),
  monthly_outcome text not null,
  inputs jsonb not null default '[]'::jsonb,
  outputs jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  blocked_by jsonb not null default '[]'::jsonb,
  next_action text not null,
  safety_rule text not null,
  connector_keys jsonb not null default '[]'::jsonb,
  tool_preference jsonb not null default '[]'::jsonb,
  route text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_operating_agents_updated_at on onia_center.operating_agents;
create trigger trg_onia_center_operating_agents_updated_at
before update on onia_center.operating_agents
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_operating_agents_status
  on onia_center.operating_agents (status, cadence, owner_role_key);

create table if not exists onia_center.agent_monthly_plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  agent_key text not null references onia_center.operating_agents(agent_key) on delete cascade,
  month_label text not null,
  title text not null,
  project_key text references onia_center.projects(project_key) on delete set null,
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'waiting_connection', 'blocked', 'done')),
  responsible_role_key text not null references onia_center.roles(role_key),
  due_window text not null,
  expected_evidence text not null,
  blocked_until text,
  visible_to jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_agent_monthly_plans_updated_at on onia_center.agent_monthly_plans;
create trigger trg_onia_center_agent_monthly_plans_updated_at
before update on onia_center.agent_monthly_plans
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_agent_monthly_plans_status
  on onia_center.agent_monthly_plans (status, priority, responsible_role_key);

create table if not exists onia_center.calendar_connector_plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  plan_name text not null,
  connector_key text not null,
  provider text not null check (provider in ('google_calendar', 'calcom', 'n8n', 'telegram', 'onia_center')),
  status text not null default 'planned' check (status in ('ready', 'config_pending', 'planned', 'blocked')),
  direction text not null check (direction in ('read', 'write', 'two_way_guarded')),
  required_env jsonb not null default '[]'::jsonb,
  protected_blocks jsonb not null default '[]'::jsonb,
  event_types jsonb not null default '[]'::jsonb,
  write_policy text not null,
  n8n_workflow text,
  next_action text not null,
  safety_rule text not null,
  visibility_scope text not null default 'sergio_private' check (
    visibility_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_calendar_connector_no_secret_values check (
    required_env::text !~* '(sk-|eyJ|password=|secret=|token=.{8,})'
  )
);

drop trigger if exists trg_onia_center_calendar_connector_plans_updated_at on onia_center.calendar_connector_plans;
create trigger trg_onia_center_calendar_connector_plans_updated_at
before update on onia_center.calendar_connector_plans
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_calendar_connector_plans_status
  on onia_center.calendar_connector_plans (status, provider, visibility_scope);

alter table onia_center.operating_agents enable row level security;
alter table onia_center.agent_monthly_plans enable row level security;
alter table onia_center.calendar_connector_plans enable row level security;

-- Locked by default. Server-side routes can read these with service role.
-- Future RLS must enforce role/membership visibility before exposing agents.

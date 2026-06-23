-- ONIA Center integration readiness schema.
-- DDL only. Seed data lives in 20260623_onia_center_integration_readiness_seed.sql.
-- Stores connector metadata and missing requirements, never secret values.

create table if not exists onia_center.integration_connectors (
  id uuid primary key default gen_random_uuid(),
  connector_key text not null unique,
  connector_name text not null,
  provider text not null,
  category text not null check (
    category in ('data', 'calendar', 'automation', 'ai', 'media', 'web_factory', 'sales', 'infra', 'collab')
  ),
  status text not null default 'planned' check (
    status in ('connected', 'ready', 'config_pending', 'planned', 'blocked', 'manual_only')
  ),
  self_hosted boolean not null default false,
  project_key text references onia_center.projects(project_key) on delete set null,
  adapter_key text references onia_center.external_adapters(adapter_key) on delete set null,
  route text,
  required_env jsonb not null default '[]'::jsonb,
  optional_env jsonb not null default '[]'::jsonb,
  current_state text not null,
  prepared jsonb not null default '[]'::jsonb,
  missing jsonb not null default '[]'::jsonb,
  next_action text not null,
  safety_rule text not null,
  docs jsonb not null default '[]'::jsonb,
  visibility_scope text not null default 'internal_restricted' check (
    visibility_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_integration_no_secret_values check (
    required_env::text !~* '(sk-|eyJ|password=|secret=|token=.{8,})'
    and optional_env::text !~* '(sk-|eyJ|password=|secret=|token=.{8,})'
  )
);

drop trigger if exists trg_onia_center_integration_connectors_updated_at on onia_center.integration_connectors;
create trigger trg_onia_center_integration_connectors_updated_at
before update on onia_center.integration_connectors
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_integration_connectors_status
  on onia_center.integration_connectors (status, priority, category);

create table if not exists onia_center.feature_readiness_items (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null unique,
  title text not null,
  module text not null check (
    module in ('crm', 'agents', 'calendar', 'ai_models', 'video_editor', 'web_generator', 'automations', 'collab', 'stockcam', 'sales', 'knowledge')
  ),
  status text not null default 'planned' check (
    status in ('ready_to_use', 'prepared_pending_connection', 'planned', 'blocked')
  ),
  owner_role_key text not null references onia_center.roles(role_key),
  private_only boolean not null default false,
  depends_on jsonb not null default '[]'::jsonb,
  prepared jsonb not null default '[]'::jsonb,
  missing jsonb not null default '[]'::jsonb,
  next_action text not null,
  route text,
  evidence_rule text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_feature_readiness_items_updated_at on onia_center.feature_readiness_items;
create trigger trg_onia_center_feature_readiness_items_updated_at
before update on onia_center.feature_readiness_items
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_feature_readiness_status
  on onia_center.feature_readiness_items (status, module, owner_role_key);

alter table onia_center.integration_connectors enable row level security;
alter table onia_center.feature_readiness_items enable row level security;

-- Locked by default. Read/write goes through server-side ONIA Center routes or
-- future authenticated RLS policies that verify membership and sensitivity.

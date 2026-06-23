-- ONIA Center ideas and access policies.
-- DDL only. Seed data lives in 20260622_onia_center_ideas_access_seed.sql.

create table if not exists onia_center.idea_inbox (
  id uuid primary key default gen_random_uuid(),
  idea_key text not null unique,
  title text not null,
  source_type text not null default 'instagram' check (
    source_type in ('instagram', 'tiktok', 'youtube', 'web', 'cliente', 'otro')
  ),
  source_url text,
  category text not null default 'contenido' check (
    category in ('contenido', 'venta', 'producto', 'automatizacion', 'bolivian', 'web', 'chatbot', 'operacion')
  ),
  summary text not null default '',
  why_useful text not null default '',
  target_project_key text references onia_center.projects(project_key) on delete set null,
  created_by_role_key text not null references onia_center.roles(role_key),
  owner_role_key text not null references onia_center.roles(role_key),
  visibility_scope text not null default 'sergio_private' check (
    visibility_scope in ('sergio_private', 'assigned_only', 'team_safe')
  ),
  review_tool text not null default 'codex' check (
    review_tool in ('codex', 'claude', 'self_hosted', 'manual')
  ),
  status text not null default 'inbox' check (
    status in ('inbox', 'queued', 'reviewed', 'approved', 'archived')
  ),
  reviewed_by_role_key text references onia_center.roles(role_key),
  prompt_snapshot text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_idea_private_owner_gate check (
    visibility_scope <> 'sergio_private' or owner_role_key = 'sergio'
  ),
  constraint onia_center_idea_approved_by_sergio check (
    status <> 'approved' or reviewed_by_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_idea_inbox_updated_at on onia_center.idea_inbox;
create trigger trg_onia_center_idea_inbox_updated_at
before update on onia_center.idea_inbox
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_idea_inbox_owner_status
  on onia_center.idea_inbox (owner_role_key, status, visibility_scope);

create index if not exists idx_onia_center_idea_inbox_project
  on onia_center.idea_inbox (target_project_key, category);

create table if not exists onia_center.access_policies (
  id uuid primary key default gen_random_uuid(),
  policy_key text not null unique,
  role_key text not null references onia_center.roles(role_key),
  entity_type text not null check (
    entity_type in ('lead', 'task', 'idea', 'review', 'finance', 'project', 'evidence')
  ),
  visible_scopes jsonb not null default '[]'::jsonb,
  can_create boolean not null default false,
  can_update_assigned boolean not null default false,
  can_approve boolean not null default false,
  operating_rule text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_access_sergio_approves check (
    can_approve = false or role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_access_policies_updated_at on onia_center.access_policies;
create trigger trg_onia_center_access_policies_updated_at
before update on onia_center.access_policies
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_access_policies_role_entity
  on onia_center.access_policies (role_key, entity_type);

alter table onia_center.idea_inbox enable row level security;
alter table onia_center.access_policies enable row level security;

-- Locked by default until Supabase Auth memberships and service-role API routes
-- are connected. Do not add public policies for ONIA Center.

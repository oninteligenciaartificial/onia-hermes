-- ONIA Core base schema draft.
-- Status: alpha, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.

create table if not exists onia_core_areas (
  id text primary key,
  organization_id text not null,
  name text not null,
  type text not null default 'GENERAL',
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists onia_core_areas_org_idx
  on onia_core_areas (organization_id);

create table if not exists onia_core_contacts (
  id text primary key,
  organization_id text not null,
  display_name text not null,
  kind text not null,
  related_entity_type text,
  related_entity_id text,
  phone text,
  email text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_core_contacts_org_kind_idx
  on onia_core_contacts (organization_id, kind);

create index if not exists onia_core_contacts_related_idx
  on onia_core_contacts (organization_id, related_entity_type, related_entity_id);

create table if not exists onia_core_work_items (
  id text primary key,
  organization_id text not null,
  type text not null,
  title text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  owner_profile_id text,
  area_id text,
  related_entity_type text,
  related_entity_id text,
  due_at timestamptz,
  next_action text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists onia_core_work_items_org_status_idx
  on onia_core_work_items (organization_id, status);

create index if not exists onia_core_work_items_org_owner_idx
  on onia_core_work_items (organization_id, owner_profile_id);

create index if not exists onia_core_work_items_due_idx
  on onia_core_work_items (organization_id, due_at);

create index if not exists onia_core_work_items_related_idx
  on onia_core_work_items (organization_id, related_entity_type, related_entity_id);

create table if not exists onia_core_process_checklists (
  id text primary key,
  organization_id text not null,
  name text not null,
  scope_type text not null,
  active boolean not null default true,
  steps jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name, scope_type)
);

create index if not exists onia_core_process_checklists_org_idx
  on onia_core_process_checklists (organization_id, active);

create table if not exists onia_core_evidence (
  id text primary key,
  organization_id text not null,
  entity_type text not null,
  entity_id text not null,
  kind text not null,
  title text,
  body text,
  file_url text,
  created_by_profile_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onia_core_evidence_entity_idx
  on onia_core_evidence (organization_id, entity_type, entity_id, created_at desc);

create table if not exists onia_core_activity_events (
  id text primary key,
  organization_id text not null,
  actor_profile_id text,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before_value jsonb,
  after_value jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onia_core_activity_events_entity_idx
  on onia_core_activity_events (organization_id, entity_type, entity_id, created_at desc);

create index if not exists onia_core_activity_events_actor_idx
  on onia_core_activity_events (organization_id, actor_profile_id, created_at desc);

create table if not exists onia_core_import_batches (
  id text primary key,
  organization_id text not null,
  source text not null,
  entity_type text not null,
  status text not null,
  dry_run boolean not null default true,
  row_count integer not null default 0,
  error_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_by_profile_id text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists onia_core_import_batches_org_status_idx
  on onia_core_import_batches (organization_id, status, created_at desc);

-- Notification is already present in current product schemas. The canonical
-- entity remains in contract.json, but product repos may keep their existing
-- notification tables if they satisfy organization-scoped alerts.

-- ONIA Core base schema draft.
-- Status: beta, reference only. Do not apply directly to product databases.
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
  partner_id text,
  sla_policy text,
  sla_due_at timestamptz,
  escalation_level integer not null default 0,
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

-- ---------------------------------------------------------------------------
-- Beta transversal entities (v0.2.0). Added before first product adoption.
-- ---------------------------------------------------------------------------

create table if not exists onia_core_business_partners (
  id text primary key,
  organization_id text not null,
  name text not null,
  partner_type text not null,
  status text not null default 'active',
  tax_id text,
  primary_contact_id text,
  area_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_core_business_partners_org_type_idx
  on onia_core_business_partners (organization_id, partner_type, status);

create table if not exists onia_core_role_assignments (
  id text primary key,
  organization_id text not null,
  member_id text not null,
  role_key text not null,
  scope_type text not null default 'ORGANIZATION',
  scope_id text,
  active boolean not null default true,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, member_id, role_key, scope_type, scope_id)
);

create index if not exists onia_core_role_assignments_member_idx
  on onia_core_role_assignments (organization_id, member_id, active);

create table if not exists onia_core_comments (
  id text primary key,
  organization_id text not null,
  entity_type text not null,
  entity_id text not null,
  author_id text not null,
  body text not null,
  parent_id text,
  visibility text not null default 'internal',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_core_comments_entity_idx
  on onia_core_comments (organization_id, entity_type, entity_id, created_at desc);

create table if not exists onia_core_documents (
  id text primary key,
  organization_id text not null,
  entity_type text not null,
  entity_id text not null,
  doc_type text not null,
  storage_ref text not null,
  visibility text not null default 'restricted',
  owner_id text,
  signed_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_core_documents_entity_idx
  on onia_core_documents (organization_id, entity_type, entity_id, created_at desc);

create table if not exists onia_core_approval_requests (
  id text primary key,
  organization_id text not null,
  entity_type text not null,
  entity_id text not null,
  request_type text not null,
  status text not null default 'pending',
  requested_by text not null,
  approved_by text,
  decided_at timestamptz,
  amount numeric,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_core_approval_requests_status_idx
  on onia_core_approval_requests (organization_id, status, created_at desc);

create table if not exists onia_core_schedule_events (
  id text primary key,
  organization_id text not null,
  title text not null,
  event_type text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  status text not null default 'scheduled',
  owner_id text not null,
  entity_type text,
  entity_id text,
  remind_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_core_schedule_events_org_start_idx
  on onia_core_schedule_events (organization_id, start_at, status);

create index if not exists onia_core_schedule_events_owner_idx
  on onia_core_schedule_events (organization_id, owner_id, start_at);

create table if not exists onia_core_saved_views (
  id text primary key,
  organization_id text not null,
  name text not null,
  target_entity text not null,
  filters jsonb not null default '{}'::jsonb,
  role_scope text not null,
  created_by text not null,
  is_default boolean not null default false,
  shared_with jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, target_entity, name)
);

create index if not exists onia_core_saved_views_scope_idx
  on onia_core_saved_views (organization_id, target_entity, role_scope);

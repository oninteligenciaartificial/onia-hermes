-- ONIA Center operating core schema.
-- DDL only. Seed data lives in 20260622_onia_center_operating_seed.sql.
-- Forward-only extension over the first ONIA Center finance/service schema.

create table if not exists onia_center.organizations (
  id uuid primary key default gen_random_uuid(),
  organization_key text not null unique,
  organization_name text not null,
  organization_kind text not null check (
    organization_kind in ('internal', 'client', 'collab', 'sandbox')
  ),
  visibility_scope text not null default 'internal_restricted' check (
    visibility_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  owner_role_key text not null references onia_center.roles(role_key),
  status text not null default 'setup' check (status in ('active', 'setup', 'paused', 'archived')),
  active_modules jsonb not null default '[]'::jsonb,
  operating_rule text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_organizations_updated_at on onia_center.organizations;
create trigger trg_onia_center_organizations_updated_at
before update on onia_center.organizations
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  user_key text not null unique,
  display_name text not null,
  primary_role_key text not null references onia_center.roles(role_key),
  status text not null default 'invited' check (status in ('active', 'invited', 'blocked')),
  access_note text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_user_profiles_updated_at on onia_center.user_profiles;
create trigger trg_onia_center_user_profiles_updated_at
before update on onia_center.user_profiles
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_key text not null references onia_center.organizations(organization_key) on delete cascade,
  user_key text not null references onia_center.user_profiles(user_key) on delete cascade,
  role_key text not null references onia_center.roles(role_key),
  permission_scope text not null default 'internal_restricted' check (
    permission_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  can_view_sensitive boolean not null default false,
  status text not null default 'active' check (status in ('active', 'paused', 'revoked')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_key, user_key)
);

drop trigger if exists trg_onia_center_organization_memberships_updated_at on onia_center.organization_memberships;
create trigger trg_onia_center_organization_memberships_updated_at
before update on onia_center.organization_memberships
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.clients (
  id uuid primary key default gen_random_uuid(),
  organization_key text not null references onia_center.organizations(organization_key),
  client_key text not null unique,
  client_name text not null,
  industry text not null,
  city text,
  status text not null default 'lead' check (status in ('lead', 'active', 'paused', 'archived')),
  owner_role_key text not null references onia_center.roles(role_key),
  sensitivity text not null default 'normal' check (sensitivity in ('normal', 'sensitive', 'private')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_clients_updated_at on onia_center.clients;
create trigger trg_onia_center_clients_updated_at
before update on onia_center.clients
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_clients_org_status
  on onia_center.clients (organization_key, status, sensitivity);

create table if not exists onia_center.contacts (
  id uuid primary key default gen_random_uuid(),
  client_key text not null references onia_center.clients(client_key) on delete cascade,
  contact_label text not null,
  channel text not null default 'WhatsApp',
  contact_permission text not null default 'pending' check (
    contact_permission in ('approved', 'pending', 'no_contact')
  ),
  public_reference text,
  sensitive_note text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_contacts_updated_at on onia_center.contacts;
create trigger trg_onia_center_contacts_updated_at
before update on onia_center.contacts
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.projects (
  id uuid primary key default gen_random_uuid(),
  organization_key text not null references onia_center.organizations(organization_key),
  client_key text references onia_center.clients(client_key) on delete set null,
  project_key text not null unique,
  project_name text not null,
  product_line text not null check (
    product_line in ('onia_center', 'dentagest', 'gestios', 'webs', 'chatbots', 'automations', 'bolivian', 'content', 'stockcam')
  ),
  status text not null default 'planning' check (
    status in ('planning', 'active', 'review', 'blocked', 'paused', 'archived')
  ),
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  owner_role_key text not null references onia_center.roles(role_key),
  private_strategy boolean not null default false,
  description text not null,
  next_step text not null,
  active_modules jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_projects_updated_at on onia_center.projects;
create trigger trg_onia_center_projects_updated_at
before update on onia_center.projects
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_projects_org_status
  on onia_center.projects (organization_key, status, product_line);

create table if not exists onia_center.project_modules (
  id uuid primary key default gen_random_uuid(),
  project_key text not null references onia_center.projects(project_key) on delete cascade,
  module_key text not null,
  module_name text not null,
  module_type text not null check (
    module_type in ('crm', 'tasks', 'inventory_camera', 'knowledge', 'content', 'dashboard', 'finance', 'adapter', 'roadmap', 'processes')
  ),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'ready', 'blocked')),
  reusable_core boolean not null default true,
  note text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_key, module_key)
);

drop trigger if exists trg_onia_center_project_modules_updated_at on onia_center.project_modules;
create trigger trg_onia_center_project_modules_updated_at
before update on onia_center.project_modules
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.tasks (
  id uuid primary key default gen_random_uuid(),
  task_key text not null unique,
  project_key text not null references onia_center.projects(project_key) on delete cascade,
  title text not null,
  task_type text not null check (
    task_type in ('lead', 'brief', 'delivery', 'review', 'content', 'bolivian', 'system', 'blocker')
  ),
  status text not null default 'todo' check (
    status in ('todo', 'in_progress', 'review', 'approved', 'blocked')
  ),
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  assigned_role_key text not null references onia_center.roles(role_key),
  reviewer_role_key text not null references onia_center.roles(role_key),
  evidence_required boolean not null default true,
  sensitive boolean not null default false,
  source_system text not null default 'onia-center' check (
    source_system in ('onia-center', 'onia-hermes', 'onia-hermes-collab', 'notion', 'external')
  ),
  due_label text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_tasks_updated_at on onia_center.tasks;
create trigger trg_onia_center_tasks_updated_at
before update on onia_center.tasks
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_tasks_status
  on onia_center.tasks (status, priority, assigned_role_key);

create table if not exists onia_center.task_events (
  id uuid primary key default gen_random_uuid(),
  task_key text not null references onia_center.tasks(task_key) on delete cascade,
  actor_role_key text not null references onia_center.roles(role_key),
  event_type text not null,
  summary text not null,
  sensitive boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists onia_center.collaborators (
  id uuid primary key default gen_random_uuid(),
  collaborator_key text not null unique,
  user_key text not null references onia_center.user_profiles(user_key),
  display_name text not null,
  role_key text not null references onia_center.roles(role_key),
  status text not null default 'trial' check (status in ('trial', 'active', 'paused', 'blocked')),
  allowed_work jsonb not null default '[]'::jsonb,
  restrictions jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_collaborators_updated_at on onia_center.collaborators;
create trigger trg_onia_center_collaborators_updated_at
before update on onia_center.collaborators
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.deliverables (
  id uuid primary key default gen_random_uuid(),
  deliverable_key text not null unique,
  task_key text not null references onia_center.tasks(task_key) on delete cascade,
  collaborator_key text not null references onia_center.collaborators(collaborator_key),
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'submitted', 'changes_requested', 'approved', 'rejected')
  ),
  evidence_reference text,
  reviewed_by_role_key text references onia_center.roles(role_key),
  sensitive boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_deliverables_approved_by_sergio check (
    status <> 'approved' or reviewed_by_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_deliverables_updated_at on onia_center.deliverables;
create trigger trg_onia_center_deliverables_updated_at
before update on onia_center.deliverables
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.collab_ingestion_items (
  id uuid primary key default gen_random_uuid(),
  ingestion_key text not null unique,
  source_repo text not null default 'onia-hermes-collab' check (source_repo = 'onia-hermes-collab'),
  source_path text not null,
  source_commit text,
  author_user_key text references onia_center.user_profiles(user_key) on delete set null,
  classification text not null check (
    classification in ('lead', 'brief', 'task', 'content', 'bolivian', 'blocker', 'code', 'doc', 'other')
  ),
  sensitivity text not null default 'internal' check (
    sensitivity in ('public_safe', 'internal', 'sensitive', 'rejected')
  ),
  status text not null default 'queued' check (
    status in ('queued', 'approved', 'rejected', 'imported', 'redacted')
  ),
  summary text not null,
  target_table text,
  target_key text,
  reviewer_role_key text references onia_center.roles(role_key),
  reviewed_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_collab_sensitive_import_gate check (
    status not in ('approved', 'imported') or sensitivity <> 'sensitive' or reviewer_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_collab_ingestion_updated_at on onia_center.collab_ingestion_items;
create trigger trg_onia_center_collab_ingestion_updated_at
before update on onia_center.collab_ingestion_items
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_collab_ingestion_status
  on onia_center.collab_ingestion_items (status, classification, sensitivity);

create table if not exists onia_center.review_queue (
  id uuid primary key default gen_random_uuid(),
  review_key text not null unique,
  source_type text not null check (
    source_type in ('collab_ingestion', 'deliverable', 'lead', 'project', 'expense', 'premium')
  ),
  source_key text not null,
  title text not null,
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'needs_changes')
  ),
  reviewer_role_key text not null references onia_center.roles(role_key),
  sensitive boolean not null default false,
  decision_note text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_review_sergio_sensitive check (
    sensitive = false or reviewer_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_review_queue_updated_at on onia_center.review_queue;
create trigger trg_onia_center_review_queue_updated_at
before update on onia_center.review_queue
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  knowledge_key text not null unique,
  organization_key text not null references onia_center.organizations(organization_key),
  project_key text references onia_center.projects(project_key) on delete set null,
  title text not null,
  category text not null check (
    category in ('process', 'sales', 'support', 'training', 'policy', 'technical')
  ),
  sensitivity_scope text not null default 'internal_restricted' check (
    sensitivity_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  status text not null default 'draft' check (status in ('draft', 'approved', 'archived')),
  source_reference text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_knowledge_items_updated_at on onia_center.knowledge_items;
create trigger trg_onia_center_knowledge_items_updated_at
before update on onia_center.knowledge_items
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.content_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  project_key text not null references onia_center.projects(project_key) on delete cascade,
  title text not null,
  channel text not null check (channel in ('instagram', 'whatsapp', 'web', 'telegram', 'internal')),
  status text not null default 'idea' check (
    status in ('idea', 'draft', 'review', 'approved', 'published')
  ),
  public_safe boolean not null default false,
  approved_by_role_key text references onia_center.roles(role_key),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_content_publish_gate check (
    status <> 'published' or (public_safe = true and approved_by_role_key = 'sergio')
  )
);

drop trigger if exists trg_onia_center_content_assets_updated_at on onia_center.content_assets;
create trigger trg_onia_center_content_assets_updated_at
before update on onia_center.content_assets
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.inventory_items (
  id uuid primary key default gen_random_uuid(),
  inventory_key text not null unique,
  organization_key text not null references onia_center.organizations(organization_key),
  project_key text references onia_center.projects(project_key) on delete set null,
  item_name text not null,
  sku text,
  location text,
  expected_qty numeric(12, 2),
  counted_qty numeric(12, 2),
  camera_required boolean not null default true,
  status text not null default 'draft' check (
    status in ('draft', 'counted', 'difference', 'approved')
  ),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_inventory_items_updated_at on onia_center.inventory_items;
create trigger trg_onia_center_inventory_items_updated_at
before update on onia_center.inventory_items
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.inventory_events (
  id uuid primary key default gen_random_uuid(),
  inventory_key text not null references onia_center.inventory_items(inventory_key) on delete cascade,
  event_type text not null check (event_type in ('count', 'photo', 'difference', 'approval', 'export')),
  counted_qty numeric(12, 2),
  photo_reference text,
  actor_user_key text references onia_center.user_profiles(user_key) on delete set null,
  sensitive boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists onia_center.external_adapters (
  id uuid primary key default gen_random_uuid(),
  adapter_key text not null unique,
  adapter_name text not null,
  system_type text not null check (
    system_type in ('collab_repo', 'erp', 'notion', 'n8n', 'whatsapp', 'calendar', 'camera', 'github')
  ),
  organization_key text references onia_center.organizations(organization_key) on delete set null,
  project_key text references onia_center.projects(project_key) on delete set null,
  mode text not null check (
    mode in ('manual_review', 'manual_export', 'importer', 'scraping', 'api', 'database', 'sync')
  ),
  status text not null default 'planned' check (
    status in ('planned', 'audit_required', 'ready', 'blocked', 'approved')
  ),
  write_allowed boolean not null default false,
  credential_storage_note text not null default 'No credentials stored in visible database records.',
  operating_rule text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_external_adapters_write_gate check (
    write_allowed = false or (status = 'approved' and mode in ('api', 'database', 'sync'))
  )
);

drop trigger if exists trg_onia_center_external_adapters_updated_at on onia_center.external_adapters;
create trigger trg_onia_center_external_adapters_updated_at
before update on onia_center.external_adapters
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.adapter_events (
  id uuid primary key default gen_random_uuid(),
  adapter_key text not null references onia_center.external_adapters(adapter_key) on delete cascade,
  event_type text not null,
  status text not null default 'queued' check (
    status in ('queued', 'processed', 'failed', 'ignored')
  ),
  input_reference text,
  output_reference text,
  sensitive boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists onia_center.audit_logs (
  id uuid primary key default gen_random_uuid(),
  audit_key text not null unique,
  actor_user_key text references onia_center.user_profiles(user_key) on delete set null,
  actor_role_key text not null references onia_center.roles(role_key),
  action text not null,
  entity_table text not null,
  entity_key text not null,
  sensitivity_scope text not null default 'internal_restricted' check (
    sensitivity_scope in ('sergio_private', 'internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
  ),
  summary text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table onia_center.organizations enable row level security;
alter table onia_center.user_profiles enable row level security;
alter table onia_center.organization_memberships enable row level security;
alter table onia_center.clients enable row level security;
alter table onia_center.contacts enable row level security;
alter table onia_center.projects enable row level security;
alter table onia_center.project_modules enable row level security;
alter table onia_center.tasks enable row level security;
alter table onia_center.task_events enable row level security;
alter table onia_center.collaborators enable row level security;
alter table onia_center.deliverables enable row level security;
alter table onia_center.collab_ingestion_items enable row level security;
alter table onia_center.review_queue enable row level security;
alter table onia_center.knowledge_items enable row level security;
alter table onia_center.content_assets enable row level security;
alter table onia_center.inventory_items enable row level security;
alter table onia_center.inventory_events enable row level security;
alter table onia_center.external_adapters enable row level security;
alter table onia_center.adapter_events enable row level security;
alter table onia_center.audit_logs enable row level security;

-- Locked by default until Supabase Auth memberships and service-role API routes
-- are connected. Do not add public policies for ONIA Center.

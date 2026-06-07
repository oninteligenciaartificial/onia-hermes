-- Atlas AI Media content factory schema.
-- Safe default: RLS enabled, no public anon access policies.

create extension if not exists pgcrypto;

create table if not exists atlas_channels (
  id text primary key,
  name text not null,
  language text not null check (language in ('en', 'es')),
  market text not null,
  niche text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists atlas_content_items (
  id text primary key,
  channel_id text not null references atlas_channels(id) on delete restrict,
  format text not null check (format in ('long', 'short', 'newsletter', 'resource_page')),
  priority integer not null default 100 check (priority > 0),
  pillar text not null,
  title_working text not null,
  audience text not null,
  promise_safe text not null,
  proof_requirement text not null,
  production_type text not null,
  affiliate_angle text,
  sponsor_angle text,
  copyright_risk text not null default 'low' check (copyright_risk in ('low', 'medium', 'high')),
  claim_risk text not null default 'low' check (claim_risk in ('low', 'medium', 'high')),
  required_sources jsonb not null default '[]'::jsonb,
  state text not null default 'queued' check (
    state in (
      'queued',
      'ready_for_script_package',
      'researching',
      'script_draft',
      'fact_check_needs_revision',
      'ready_for_human_review',
      'approved_for_generation',
      'approved_for_private_upload',
      'published',
      'blocked',
      'archived'
    )
  ),
  approval_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists atlas_research_sources (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references atlas_content_items(id) on delete cascade,
  url text not null,
  source_type text not null default 'public' check (source_type in ('public', 'official', 'internal', 'competitor', 'manual')),
  title text,
  summary text,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists atlas_scripts (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references atlas_content_items(id) on delete cascade,
  version integer not null default 1 check (version > 0),
  hook text not null,
  script_markdown text not null,
  storyboard_markdown text,
  cta text,
  language text not null check (language in ('en', 'es')),
  status text not null default 'draft' check (status in ('draft', 'needs_revision', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_id, version)
);

create table if not exists atlas_fact_checks (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references atlas_content_items(id) on delete cascade,
  script_id uuid references atlas_scripts(id) on delete set null,
  approval_status text not null check (approval_status in ('approved', 'needs_revision', 'blocked')),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  required_edits jsonb not null default '[]'::jsonb,
  safe_rewrite jsonb not null default '[]'::jsonb,
  sources_needed jsonb not null default '[]'::jsonb,
  disclosure_required boolean not null default true,
  notes text,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists atlas_asset_prompts (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references atlas_content_items(id) on delete cascade,
  asset_type text not null check (asset_type in ('image', 'video', 'thumbnail', 'voice', 'music', 'sfx', 'caption')),
  tool text not null,
  prompt text not null,
  negative_prompt text,
  cost_approval_required boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'approved_for_generation', 'generated', 'rejected', 'archived')),
  result_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists atlas_upload_packages (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references atlas_content_items(id) on delete cascade,
  title_final text not null,
  description text not null,
  tags jsonb not null default '[]'::jsonb,
  chapters text,
  thumbnail_brief text,
  disclosure_text text,
  upload_allowed boolean not null default false,
  publish_allowed boolean not null default false,
  status text not null default 'draft' check (
    status in (
      'draft',
      'ready_for_human_review',
      'approved_for_private_upload',
      'uploaded_private',
      'published',
      'blocked',
      'archived'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists atlas_approvals (
  id uuid primary key default gen_random_uuid(),
  content_id text references atlas_content_items(id) on delete cascade,
  approval_type text not null check (
    approval_type in (
      'human_review',
      'generation_spend',
      'private_upload',
      'public_publish',
      'affiliate_use',
      'sponsor_contact'
    )
  ),
  approval_text text not null,
  approved_by text,
  approved_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  created_at timestamptz not null default now()
);

create table if not exists atlas_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references atlas_content_items(id) on delete cascade,
  asset_prompt_id uuid references atlas_asset_prompts(id) on delete set null,
  tool text not null,
  model text,
  estimated_cost_usd numeric(10, 4),
  actual_cost_usd numeric(10, 4),
  status text not null default 'draft' check (status in ('draft', 'approved', 'running', 'succeeded', 'failed', 'cancelled')),
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists atlas_analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  content_id text references atlas_content_items(id) on delete cascade,
  channel_id text not null references atlas_channels(id) on delete restrict,
  platform text not null default 'youtube',
  snapshot_date date not null default current_date,
  views bigint not null default 0,
  watch_time_hours numeric(12, 2) not null default 0,
  subscribers_delta integer not null default 0,
  ctr numeric(8, 4),
  average_view_duration_seconds numeric(10, 2),
  rpm_usd numeric(10, 4),
  affiliate_clicks integer not null default 0,
  affiliate_revenue_usd numeric(10, 2) not null default 0,
  sponsor_revenue_usd numeric(10, 2) not null default 0,
  product_revenue_usd numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (content_id, channel_id, snapshot_date)
);

create table if not exists atlas_audit_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  event_type text not null,
  actor text not null default 'system',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists atlas_content_items_queue_idx
  on atlas_content_items (state, priority, channel_id, updated_at);

create index if not exists atlas_research_sources_content_idx
  on atlas_research_sources (content_id, checked_at desc);

create index if not exists atlas_fact_checks_content_idx
  on atlas_fact_checks (content_id, checked_at desc);

create index if not exists atlas_upload_packages_content_idx
  on atlas_upload_packages (content_id, status);

create or replace function atlas_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists atlas_channels_touch_updated_at on atlas_channels;
create trigger atlas_channels_touch_updated_at
before update on atlas_channels
for each row execute function atlas_touch_updated_at();

drop trigger if exists atlas_content_items_touch_updated_at on atlas_content_items;
create trigger atlas_content_items_touch_updated_at
before update on atlas_content_items
for each row execute function atlas_touch_updated_at();

drop trigger if exists atlas_scripts_touch_updated_at on atlas_scripts;
create trigger atlas_scripts_touch_updated_at
before update on atlas_scripts
for each row execute function atlas_touch_updated_at();

drop trigger if exists atlas_asset_prompts_touch_updated_at on atlas_asset_prompts;
create trigger atlas_asset_prompts_touch_updated_at
before update on atlas_asset_prompts
for each row execute function atlas_touch_updated_at();

drop trigger if exists atlas_upload_packages_touch_updated_at on atlas_upload_packages;
create trigger atlas_upload_packages_touch_updated_at
before update on atlas_upload_packages
for each row execute function atlas_touch_updated_at();

drop trigger if exists atlas_generation_jobs_touch_updated_at on atlas_generation_jobs;
create trigger atlas_generation_jobs_touch_updated_at
before update on atlas_generation_jobs
for each row execute function atlas_touch_updated_at();

alter table atlas_channels enable row level security;
alter table atlas_content_items enable row level security;
alter table atlas_research_sources enable row level security;
alter table atlas_scripts enable row level security;
alter table atlas_fact_checks enable row level security;
alter table atlas_asset_prompts enable row level security;
alter table atlas_upload_packages enable row level security;
alter table atlas_approvals enable row level security;
alter table atlas_generation_jobs enable row level security;
alter table atlas_analytics_snapshots enable row level security;
alter table atlas_audit_events enable row level security;

insert into atlas_channels (id, name, language, market, niche, status)
values
  ('workflow_roi', 'Workflow ROI', 'en', 'USA', 'AI automation and SaaS workflows for SMB operators', 'draft'),
  ('automatiza_pyme', 'Automatiza PyME', 'es', 'Hispanic', 'IA y automatizacion para PYMES', 'draft')
on conflict (id) do update set
  name = excluded.name,
  language = excluded.language,
  market = excluded.market,
  niche = excluded.niche;

insert into atlas_content_items (
  id,
  channel_id,
  format,
  priority,
  pillar,
  title_working,
  audience,
  promise_safe,
  proof_requirement,
  production_type,
  affiliate_angle,
  sponsor_angle,
  copyright_risk,
  claim_risk,
  required_sources,
  state
)
values
  (
    'wroi-long-001',
    'workflow_roi',
    'long',
    1,
    'Workflow ROI Lab',
    'Build an AI Follow-Up System So Leads Stop Disappearing',
    'SMB founders, operators, agency owners',
    'Build an auditable follow-up workflow with a detector, drafter and reviewer.',
    'Demo workflow with fictional lead table and approval gate.',
    'screen_recording_plus_ai_broll',
    'n8n, Airtable, CRM, email automation tools',
    'workflow automation platform or CRM',
    'low',
    'medium',
    '["YouTube monetization policy", "n8n docs", "YouTube synthetic disclosure"]'::jsonb,
    'ready_for_script_package'
  ),
  (
    'apyme-long-001',
    'automatiza_pyme',
    'long',
    1,
    'Casos PyME',
    'La Automatizacion Basica Para No Perder Clientes Por WhatsApp',
    'duenos de PyME, operadores, emprendedores hispanos',
    'Ordenar solicitudes con estado, proxima accion y aprobacion humana.',
    'Demo con mensajes ficticios y tablero de seguimiento.',
    'screen_recording_plus_ai_broll',
    'n8n, Make, CRM, Google Workspace',
    'CRM regional o herramienta de automatizacion',
    'low',
    'medium',
    '["YouTube monetization policy", "n8n docs", "WhatsApp Business provider docs if implemented"]'::jsonb,
    'ready_for_script_package'
  )
on conflict (id) do update set
  channel_id = excluded.channel_id,
  format = excluded.format,
  priority = excluded.priority,
  pillar = excluded.pillar,
  title_working = excluded.title_working,
  audience = excluded.audience,
  promise_safe = excluded.promise_safe,
  proof_requirement = excluded.proof_requirement,
  production_type = excluded.production_type,
  affiliate_angle = excluded.affiliate_angle,
  sponsor_angle = excluded.sponsor_angle,
  copyright_risk = excluded.copyright_risk,
  claim_risk = excluded.claim_risk,
  required_sources = excluded.required_sources,
  state = excluded.state;


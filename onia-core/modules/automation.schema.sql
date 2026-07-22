-- ONIA Automation & Engagement Module base schema draft.
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_automation_*. Depende de tablas del core (organization/
-- communication_channel/schedule_event/work_item/business_partner/contact/
-- member) por referencia logica; no las redefine. El ENVIO real de mensajes es
-- external_gate (Resend/Meta/n8n); aca solo viven reglas, plantillas y el
-- registro de envio con su resultado.

create table if not exists onia_automation_rules (
  id text primary key,
  organization_id text not null,
  name text not null,
  trigger_type text not null,
  condition jsonb not null default '{}'::jsonb,
  action_type text not null,
  template_id text,
  channel_id text,
  work_item_type text,
  owner_member_id text,
  created_by text,
  description text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_automation_rules_trigger_idx
  on onia_automation_rules (organization_id, trigger_type, active);

create table if not exists onia_automation_message_templates (
  id text primary key,
  organization_id text not null,
  channel text not null,
  name text not null,
  subject text,
  body text not null,
  variables jsonb not null default '[]'::jsonb,
  locale text not null default 'es',
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists onia_automation_message_templates_channel_idx
  on onia_automation_message_templates (organization_id, channel, active);

create table if not exists onia_automation_message_dispatches (
  id text primary key,
  organization_id text not null,
  rule_id text,
  template_id text,
  channel text not null,
  channel_id text,
  partner_id text,
  recipient text not null,
  subject text,
  rendered_body text not null,
  idempotency_key text,
  status text not null default 'queued',
  external_message_id text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  failed_reason text,
  retry_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_automation_dispatches_status_idx
  on onia_automation_message_dispatches (organization_id, status, scheduled_for);

create index if not exists onia_automation_dispatches_rule_idx
  on onia_automation_message_dispatches (organization_id, rule_id);

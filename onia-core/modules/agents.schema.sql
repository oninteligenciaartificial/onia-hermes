-- ONIA Agents Module base schema draft.
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_agents_*. Depende de tablas del core (organization / member /
-- approval_request / work_item / business_partner) por referencia logica; no las
-- redefine. La EJECUCION real (cron+LLM+scraping+envio+publicacion) es
-- external_gate; aca solo viven la definicion del agente, sus corridas y las
-- acciones/propuestas con su ruteo por aprobacion (human-in-the-loop).

create table if not exists onia_agents_agents (
  id text primary key,
  organization_id text not null,          -- FK logica: core organization (tenant root)
  name text not null,
  role text not null,                      -- vendedor | prospector | finanzas | contenido | radar_normativo | soporte
  autonomy_level text not null,            -- suggest | semi_auto | auto
  owner_id text,                           -- FK logica: core member (humano responsable / aprobador)
  trigger_type text,                       -- schedule | event (interpretacion del runtime external_gate)
  interval_minutes integer,                -- cadencia si corre por schedule; null = agente por evento
  capabilities jsonb not null default '[]'::jsonb,
  description text,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_agents_agents_org_idx
  on onia_agents_agents (organization_id, enabled, role);

create table if not exists onia_agents_runs (
  id text primary key,
  organization_id text not null,          -- FK logica: core organization (tenant root)
  agent_id text not null,                  -- FK logica: onia_agents_agents.id
  status text not null default 'scheduled', -- scheduled | running | completed | failed
  trigger_id text,                         -- id del disparo external_gate (cron/evento)
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  summary text,
  items_produced integer not null default 0,
  error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_agents_runs_agent_idx
  on onia_agents_runs (organization_id, agent_id, status);

create table if not exists onia_agents_actions (
  id text primary key,
  organization_id text not null,          -- FK logica: core organization (tenant root)
  agent_id text not null,                  -- FK logica: onia_agents_agents.id
  run_id text not null,                    -- FK logica: onia_agents_runs.id
  action_type text not null,               -- draft_message | send_message | create_proposal | publish_content | qualify_lead | flag | prioritize | create_task | summarize | schedule_followup | scrape
  status text not null default 'proposed', -- proposed | pending_approval | approved | rejected | executed | auto_executed | discarded
  target_type text,                        -- ej. business_partner (FK logica al dominio del core/producto)
  target_id text,
  summary text,
  payload jsonb not null default '{}'::jsonb,
  approval_request_id text,                -- FK logica: core approval_request (human-in-the-loop)
  work_item_id text,                       -- FK logica: core work_item (create_task/schedule_followup)
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_agents_actions_run_idx
  on onia_agents_actions (organization_id, run_id, status);

create index if not exists onia_agents_actions_target_idx
  on onia_agents_actions (organization_id, agent_id, action_type, target_type, target_id);

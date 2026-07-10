-- ONIA Center — Pulso de desarrollo (para que el panel muestre "estamos construyendo todo el tiempo").
-- El runtime building-public-agent.mjs lee el repo-pulse (commits por carril, generado por la
-- GitHub Action repo-pulse.yml y ya presente en el VPS en /opt/onia/state/repo-pulse-latest.json)
-- y escribe aca una fila por dia (upsert por pulse_key). READ-ONLY / interno (sergio_private):
-- guarda los NOMBRES REALES de carril para el panel; el contenido PUBLICO se sanitiza aparte.
-- El panel LEE la fila mas reciente. Aplicado 2026-07-10 en la DB onia_center (supabase-db).

create table if not exists onia_center.dev_pulse (
  id uuid primary key default gen_random_uuid(),
  pulse_key text not null unique,                    -- 'dev-YYYY-MM-DD'
  generated_at timestamptz not null default now(),
  generated_by text not null default 'agent-building-public',
  lookback_hours integer not null default 0,
  total_commits integer not null default 0,
  active_lanes jsonb not null default '[]'::jsonb,    -- [{ lane, commits }]
  stale_lanes jsonb not null default '[]'::jsonb,     -- [{ lane, days }]
  summary_text text not null default '',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_dev_pulse_updated_at on onia_center.dev_pulse;
create trigger trg_onia_center_dev_pulse_updated_at
before update on onia_center.dev_pulse
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_dev_pulse_generated
  on onia_center.dev_pulse (generated_at desc);

alter table onia_center.dev_pulse enable row level security;
grant select, insert, update, delete on onia_center.dev_pulse to service_role;

notify pgrst, 'reload schema';

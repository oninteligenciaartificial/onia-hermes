-- ONIA Center — Nuvia sourcing candidates (copiloto de sourcing v1).
-- Guarda la ficha + score ONIA-Bolivia (flete, arancel, demanda) de candidatos de
-- producto. READ-ONLY / gate humano: el agente NO contacta proveedores ni mueve dinero.
-- Aplicado 2026-07-05 en la DB onia_center (contenedor supabase-db).

create table if not exists onia_center.nuvia_sourcing_candidates (
  id uuid primary key default gen_random_uuid(),
  candidate_key text not null unique,
  title text not null,
  source_url text,
  category text,
  supplier text,
  unit_price_usd numeric,
  moq integer,
  weight_kg numeric,
  score integer not null default 0,
  verdict text not null default 'review' check (verdict in ('strong', 'review', 'weak')),
  score_breakdown jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'shortlisted', 'contacted', 'discarded')),
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_nuvia_sourcing_updated_at on onia_center.nuvia_sourcing_candidates;
create trigger trg_onia_center_nuvia_sourcing_updated_at
before update on onia_center.nuvia_sourcing_candidates
for each row execute function onia_center.touch_updated_at();

-- RLS locked by default (service-role only), consistente con el resto de onia_center.
alter table onia_center.nuvia_sourcing_candidates enable row level security;

-- Refrescar el cache de esquema de PostgREST para exponer la tabla vía REST.
notify pgrst, 'reload schema';

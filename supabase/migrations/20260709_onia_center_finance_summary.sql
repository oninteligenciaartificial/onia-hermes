-- ONIA Center — Resumen financiero del Agente Finanzas y Fondo ONIA.
-- El runtime finance-fund-agent.mjs (docker exec onia-center) agrega caja, ingresos del
-- periodo, comisiones por estado y Fondo ONIA en UNA fila por dia (upsert por summary_key)
-- y la escribe aca. READ-ONLY sobre la plata: informa, no mueve dinero ni aprueba pagos.
-- Este es el PUNTO DE COORDINACION con el panel: el runtime ESCRIBE, el panel LEE la fila
-- mas reciente (order by generated_at desc limit 1). Contrato en
-- hermes-content/docs/ONIA_FINANCE_SUMMARY_CONTRACT.md.
-- Aplicado 2026-07-09 en la DB onia_center (contenedor supabase-db).

create table if not exists onia_center.finance_summary (
  id uuid primary key default gen_random_uuid(),
  summary_key text not null unique,
  scope text not null default 'daily' check (scope in ('daily', 'weekly', 'monthly')),
  period_label text not null,
  generated_at timestamptz not null default now(),
  generated_by text not null default 'agent-finance-fund',
  -- caja
  cash_total_bs numeric(14, 2) not null default 0,     -- ingresos netos acumulados (todo el historial)
  cash_period_bs numeric(14, 2) not null default 0,    -- ingresos netos del periodo (ultimos 30 dias)
  income_count integer not null default 0,
  -- comisiones por estado: { estimated, pending, approved, paid, blocked, discounted }
  commissions_by_status jsonb not null default '{}'::jsonb,
  commissions_pending_bs numeric(14, 2) not null default 0,
  commissions_blocked_bs numeric(14, 2) not null default 0,
  -- fondo ONIA (suma de payment_commissions payment_type=fund_allocation)
  fund_total_bs numeric(14, 2) not null default 0,
  -- riesgos / bloqueos
  expenses_pending_bs numeric(14, 2) not null default 0,
  premium_pending_bs numeric(14, 2) not null default 0,
  anomaly_count integer not null default 0,
  anomalies jsonb not null default '[]'::jsonb,
  -- desglose completo por centro + texto humano
  breakdown jsonb not null default '{}'::jsonb,
  summary_text text not null default '',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_finance_summary_updated_at on onia_center.finance_summary;
create trigger trg_onia_center_finance_summary_updated_at
before update on onia_center.finance_summary
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_finance_summary_generated
  on onia_center.finance_summary (generated_at desc, scope);

-- RLS locked by default (service-role only), consistente con el resto de onia_center.
alter table onia_center.finance_summary enable row level security;

-- Grant explicito al service_role (ademas de las default privileges) para escritura via PostgREST.
grant select, insert, update, delete on onia_center.finance_summary to service_role;

-- Refrescar el cache de esquema de PostgREST para exponer la tabla via REST.
notify pgrst, 'reload schema';

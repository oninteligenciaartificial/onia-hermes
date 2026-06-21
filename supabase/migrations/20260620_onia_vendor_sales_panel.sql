-- ONIA vendor sales panel schema.
-- Purpose: prepare the private Supabase layer for ONIA Panel de Vendedores.
-- Notion remains the current source of truth until this schema is connected.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists onia_sales;

create or replace function onia_sales.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists onia_sales.vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  vendor_key text not null unique,
  display_name text not null,
  role text not null default 'seller' check (role in ('seller', 'admin', 'operator')),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  contact_channel text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_profiles_updated_at on onia_sales.vendor_profiles;
create trigger trg_onia_sales_vendor_profiles_updated_at
before update on onia_sales.vendor_profiles
for each row execute function onia_sales.touch_updated_at();

create table if not exists onia_sales.vendor_leads (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,
  empresa text not null,
  rubro text not null,
  ciudad text,
  pais text not null default 'Bolivia',
  contacto_publico text,
  canal_principal text not null check (
    canal_principal in ('WhatsApp', 'Instagram', 'Llamada', 'Email', 'LinkedIn', 'Web', 'Otro')
  ),
  fuente text,
  permiso_contacto text not null default 'pendiente' check (
    permiso_contacto in ('aprobado', 'pendiente', 'no_contactar')
  ),
  vendedor_origen text not null,
  responsable_actual text not null,
  estado_pipeline text not null default 'Nuevo' check (
    estado_pipeline in (
      'Nuevo',
      'Investigado',
      'Calificado',
      'Mensaje preparado',
      'Aprobado para contactar',
      'Contactado',
      'Respondio',
      'Requiere seguimiento',
      'Demo agendada',
      'Demo realizada',
      'Propuesta enviada',
      'Ganado',
      'Perdido',
      'No apto',
      'No contactar'
    )
  ),
  producto_sugerido text not null,
  prioridad text not null default 'media' check (prioridad in ('alta', 'media', 'baja')),
  dolor_probable text,
  ultimo_contacto date,
  proximo_seguimiento date,
  resultado_ultimo_contacto text,
  mensaje_enviado text,
  datos_completos boolean not null default false,
  no_contactar boolean not null default false,
  notas text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_leads_updated_at on onia_sales.vendor_leads;
create trigger trg_onia_sales_vendor_leads_updated_at
before update on onia_sales.vendor_leads
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_vendor_leads_pipeline
  on onia_sales.vendor_leads (estado_pipeline, proximo_seguimiento);

create index if not exists idx_onia_sales_vendor_leads_responsable
  on onia_sales.vendor_leads (responsable_actual, proximo_seguimiento);

create index if not exists idx_onia_sales_vendor_leads_vendedor
  on onia_sales.vendor_leads (vendedor_origen, created_at desc);

create table if not exists onia_sales.vendor_web_diagnostics (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references onia_sales.vendor_leads(id) on delete cascade,
  has_website boolean,
  has_google_maps boolean,
  has_visible_whatsapp boolean,
  has_form boolean,
  clear_offer boolean,
  professional_presence boolean,
  captures_leads boolean,
  has_followup_system boolean,
  recommended_offer text not null,
  price_suggestion text,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_web_diagnostics_updated_at on onia_sales.vendor_web_diagnostics;
create trigger trg_onia_sales_vendor_web_diagnostics_updated_at
before update on onia_sales.vendor_web_diagnostics
for each row execute function onia_sales.touch_updated_at();

create table if not exists onia_sales.vendor_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references onia_sales.vendor_leads(id) on delete set null,
  author text not null,
  note_type text not null default 'nota' check (
    note_type in ('nota', 'objecion', 'promesa', 'pregunta_tecnica', 'seguimiento', 'recomendacion')
  ),
  title text not null,
  body text not null,
  importance text not null default 'normal' check (importance in ('baja', 'normal', 'alta')),
  created_at timestamptz not null default now()
);

create index if not exists idx_onia_sales_vendor_notes_lead
  on onia_sales.vendor_notes (lead_id, created_at desc);

create table if not exists onia_sales.vendor_ideas (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  idea_type text not null default 'idea' check (
    idea_type in ('idea', 'nicho', 'paquete', 'objecion', 'frase', 'upsell', 'contenido')
  ),
  title text not null,
  body text not null,
  status text not null default 'nueva' check (status in ('nueva', 'revisar', 'aprobada', 'descartada', 'convertida')),
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_ideas_updated_at on onia_sales.vendor_ideas;
create trigger trg_onia_sales_vendor_ideas_updated_at
before update on onia_sales.vendor_ideas
for each row execute function onia_sales.touch_updated_at();

create table if not exists onia_sales.vendor_income (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references onia_sales.vendor_leads(id) on delete set null,
  vendor_key text not null,
  service_sold text not null,
  amount_charged numeric(12, 2) not null check (amount_charged >= 0),
  net_amount numeric(12, 2) check (net_amount is null or net_amount >= 0),
  currency text not null default 'BOB',
  paid_at date not null default current_date,
  payment_reference text,
  delivery_status text not null default 'pending' check (
    delivery_status in ('pending', 'onboarding', 'in_delivery', 'delivered', 'blocked', 'refunded')
  ),
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_income_updated_at on onia_sales.vendor_income;
create trigger trg_onia_sales_vendor_income_updated_at
before update on onia_sales.vendor_income
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_vendor_income_vendor
  on onia_sales.vendor_income (vendor_key, paid_at desc);

create table if not exists onia_sales.vendor_commissions (
  id uuid primary key default gen_random_uuid(),
  income_id uuid not null references onia_sales.vendor_income(id) on delete cascade,
  vendor_key text not null,
  commission_basis text not null default 'net_amount',
  commission_amount numeric(12, 2) not null check (commission_amount >= 0),
  currency text not null default 'BOB',
  status text not null default 'pendiente' check (
    status in ('pendiente', 'aprobada', 'pagada', 'retenida', 'descontada')
  ),
  approved_by text,
  approved_at timestamptz,
  paid_at date,
  data_complete boolean not null default false,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_commissions_updated_at on onia_sales.vendor_commissions;
create trigger trg_onia_sales_vendor_commissions_updated_at
before update on onia_sales.vendor_commissions
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_vendor_commissions_status
  on onia_sales.vendor_commissions (status, vendor_key);

create table if not exists onia_sales.vendor_followups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references onia_sales.vendor_leads(id) on delete cascade,
  owner text not null,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'done', 'skipped', 'blocked')),
  channel text not null default 'WhatsApp',
  task text not null,
  result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_vendor_followups_updated_at on onia_sales.vendor_followups;
create trigger trg_onia_sales_vendor_followups_updated_at
before update on onia_sales.vendor_followups
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_vendor_followups_due
  on onia_sales.vendor_followups (status, owner, due_at);

create table if not exists onia_sales.operation_trials (
  id uuid primary key default gen_random_uuid(),
  trial_key text not null unique,
  title text not null,
  participant_key text not null,
  starts_on date,
  ends_on date,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'closed')),
  review_rule text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_operation_trials_updated_at on onia_sales.operation_trials;
create trigger trg_onia_sales_operation_trials_updated_at
before update on onia_sales.operation_trials
for each row execute function onia_sales.touch_updated_at();

create table if not exists onia_sales.operation_centers (
  id uuid primary key default gen_random_uuid(),
  center_key text not null unique,
  title text not null,
  owner text not null,
  status text not null default 'active' check (status in ('active', 'watched', 'blocked', 'archived')),
  purpose text not null,
  rules jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_operation_centers_updated_at on onia_sales.operation_centers;
create trigger trg_onia_sales_operation_centers_updated_at
before update on onia_sales.operation_centers
for each row execute function onia_sales.touch_updated_at();

create table if not exists onia_sales.operation_evidence (
  id uuid primary key default gen_random_uuid(),
  trial_id uuid references onia_sales.operation_trials(id) on delete set null,
  center_key text not null,
  actor_key text not null,
  evidence_type text not null check (
    evidence_type in ('crm', 'call', 'message', 'payment', 'delivery', 'cost', 'content', 'training', 'system', 'approval')
  ),
  title text not null,
  evidence_date date not null default current_date,
  amount numeric(12, 2),
  currency text not null default 'BOB',
  proof_reference text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'retained')
  ),
  approved_by text,
  approved_at timestamptz,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_operation_evidence_updated_at on onia_sales.operation_evidence;
create trigger trg_onia_sales_operation_evidence_updated_at
before update on onia_sales.operation_evidence
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_operation_evidence_actor
  on onia_sales.operation_evidence (actor_key, evidence_date desc);

create index if not exists idx_onia_sales_operation_evidence_status
  on onia_sales.operation_evidence (status, center_key);

create table if not exists onia_sales.weekly_scorecards (
  id uuid primary key default gen_random_uuid(),
  trial_id uuid references onia_sales.operation_trials(id) on delete cascade,
  actor_key text not null,
  week_start date not null,
  week_end date not null,
  area text not null,
  target_text text not null,
  actual_text text,
  completion_percent numeric(5, 2) check (completion_percent is null or (completion_percent >= 0 and completion_percent <= 100)),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'missed', 'blocked')
  ),
  approved_by text,
  approved_at timestamptz,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_weekly_scorecards_updated_at on onia_sales.weekly_scorecards;
create trigger trg_onia_sales_weekly_scorecards_updated_at
before update on onia_sales.weekly_scorecards
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_weekly_scorecards_actor
  on onia_sales.weekly_scorecards (actor_key, week_start desc);

create table if not exists onia_sales.petty_cash_entries (
  id uuid primary key default gen_random_uuid(),
  center_key text not null,
  owner_key text not null,
  spent_at date not null default current_date,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'BOB',
  category text not null,
  reason text not null,
  proof_reference text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'reimbursed')
  ),
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_petty_cash_entries_updated_at on onia_sales.petty_cash_entries;
create trigger trg_onia_sales_petty_cash_entries_updated_at
before update on onia_sales.petty_cash_entries
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_petty_cash_center
  on onia_sales.petty_cash_entries (center_key, spent_at desc);

create table if not exists onia_sales.nuvia_closures (
  id uuid primary key default gen_random_uuid(),
  period_start date not null,
  period_end date not null,
  sales_amount numeric(12, 2) not null default 0 check (sales_amount >= 0),
  product_cost numeric(12, 2) not null default 0 check (product_cost >= 0),
  direct_costs numeric(12, 2) not null default 0 check (direct_costs >= 0),
  premium_tool_costs numeric(12, 2) not null default 0 check (premium_tool_costs >= 0),
  operational_margin numeric(12, 2) generated always as (
    sales_amount - product_cost - direct_costs - premium_tool_costs
  ) stored,
  operational_margin_percent numeric(7, 4) generated always as (
    case when sales_amount = 0 then null else
      (sales_amount - product_cost - direct_costs - premium_tool_costs) / sales_amount
    end
  ) stored,
  onia_fund_amount numeric(12, 2) not null default 0 check (onia_fund_amount >= 0),
  nuvia_reserve_amount numeric(12, 2) not null default 0 check (nuvia_reserve_amount >= 0),
  distributable_amount numeric(12, 2) not null default 0 check (distributable_amount >= 0),
  sergio_payout numeric(12, 2) not null default 0 check (sergio_payout >= 0),
  arthur_payout numeric(12, 2) not null default 0 check (arthur_payout >= 0),
  status text not null default 'draft' check (
    status in ('draft', 'pending_review', 'approved', 'paid', 'retained', 'loss_carried')
  ),
  approved_by text,
  approved_at timestamptz,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nuvia_closures_period_valid check (period_end >= period_start)
);

drop trigger if exists trg_onia_sales_nuvia_closures_updated_at on onia_sales.nuvia_closures;
create trigger trg_onia_sales_nuvia_closures_updated_at
before update on onia_sales.nuvia_closures
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_nuvia_closures_period
  on onia_sales.nuvia_closures (period_start desc, period_end desc);

create table if not exists onia_sales.operation_payouts (
  id uuid primary key default gen_random_uuid(),
  trial_id uuid references onia_sales.operation_trials(id) on delete set null,
  income_id uuid references onia_sales.vendor_income(id) on delete set null,
  nuvia_closure_id uuid references onia_sales.nuvia_closures(id) on delete set null,
  center_key text not null,
  actor_key text not null,
  payout_case text not null,
  payout_cycle text not null default 'monthly_settlement' check (
    payout_cycle in ('biweekly_advance', 'monthly_settlement', 'direct_payout', 'adjustment')
  ),
  period_start date,
  period_end date,
  advance_percent numeric(5, 2) not null default 0 check (advance_percent >= 0 and advance_percent <= 100),
  advance_basis text not null default 'approved_actor_payout',
  parent_payout_id uuid references onia_sales.operation_payouts(id) on delete set null,
  gross_basis numeric(12, 2) not null check (gross_basis >= 0),
  onia_fund_percent numeric(5, 2) not null default 0 check (onia_fund_percent >= 0),
  actor_percent numeric(5, 2) not null default 0 check (actor_percent >= 0),
  sergio_percent numeric(5, 2) not null default 0 check (sergio_percent >= 0),
  calculated_amount numeric(12, 2) not null default 0 check (calculated_amount >= 0),
  retained_amount numeric(12, 2) not null default 0 check (retained_amount >= 0),
  paid_amount numeric(12, 2) not null default 0 check (paid_amount >= 0),
  currency text not null default 'BOB',
  status text not null default 'estimated' check (
    status in ('estimated', 'pending', 'approved', 'paid', 'retained', 'discounted')
  ),
  due_on date,
  paid_at date,
  approved_by text,
  approved_at timestamptz,
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_sales_operation_payouts_updated_at on onia_sales.operation_payouts;
create trigger trg_onia_sales_operation_payouts_updated_at
before update on onia_sales.operation_payouts
for each row execute function onia_sales.touch_updated_at();

create index if not exists idx_onia_sales_operation_payouts_actor
  on onia_sales.operation_payouts (actor_key, status, due_on);

create index if not exists idx_onia_sales_operation_payouts_cycle
  on onia_sales.operation_payouts (actor_key, payout_cycle, period_start desc);

alter table onia_sales.vendor_profiles enable row level security;
alter table onia_sales.vendor_leads enable row level security;
alter table onia_sales.vendor_web_diagnostics enable row level security;
alter table onia_sales.vendor_notes enable row level security;
alter table onia_sales.vendor_ideas enable row level security;
alter table onia_sales.vendor_income enable row level security;
alter table onia_sales.vendor_commissions enable row level security;
alter table onia_sales.vendor_followups enable row level security;
alter table onia_sales.operation_trials enable row level security;
alter table onia_sales.operation_centers enable row level security;
alter table onia_sales.operation_evidence enable row level security;
alter table onia_sales.weekly_scorecards enable row level security;
alter table onia_sales.petty_cash_entries enable row level security;
alter table onia_sales.nuvia_closures enable row level security;
alter table onia_sales.operation_payouts enable row level security;

-- Locked by default. n8n/server-side service-role routes should write here.
-- Add explicit policies only after ONIA defines authenticated internal users.

insert into onia_sales.vendor_profiles (vendor_key, display_name, role, raw)
values
  ('sergio', 'Sergio / ONIA', 'admin', '{"source":"seed"}'::jsonb),
  ('arthur_fuentes', 'Arthur Fuentes', 'operator', '{"source":"seed","trial":"arthur_60_days"}'::jsonb),
  ('vendedor_demo', 'Vendedor demo', 'seller', '{"source":"seed"}'::jsonb)
on conflict (vendor_key) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  raw = onia_sales.vendor_profiles.raw || excluded.raw,
  updated_at = now();

insert into onia_sales.operation_trials (
  trial_key,
  title,
  participant_key,
  starts_on,
  ends_on,
  status,
  review_rule,
  raw
)
values (
  'arthur_60_days',
  'Operacion 60 dias Arthur / ONIA / Nuvia',
  'arthur_fuentes',
  current_date,
  current_date + 60,
  'active',
  'Revision semanal y decision formal al dia 60. Si no esta en ONIA Center o Notion, no cuenta.',
  '{
    "source": "seed",
    "agreement": "ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md",
    "contract_type": "contrato privado operativo por 60 dias",
    "payment_policy": {
      "biweekly_advance_percent": 20,
      "advance_basis": "pago ganado/aprobable de Arthur, no facturacion bruta",
      "cutoffs": ["dias 1-15", "dias 16-fin de mes"],
      "monthly_settlement": "descontar adelantos y pagar saldo o compensar diferencia"
    },
    "fund_policy": {
      "fund_name": "Fondo ONIA",
      "single_fund": true,
      "monthly_existence_payer": "Fondo ONIA; si no alcanza, Sergio/ONIA cubre temporalmente con capital de arranque",
      "sergio_recoverable_capital_bs": 10000,
      "arthur_monthly_fixed_obligation_bs": 0
    },
    "risk_protected_commission_policy": {
      "onia_services_fund_percent": 40,
      "arthur_max_percent_without_onia_capital": 45,
      "sergio_min_risk_percent_when_arthur_delivers_all": 15,
      "optional_project_capital_rule": "Arthur puede subir hasta 50% solo si cofinancia un proyecto especifico aprobado por escrito",
      "unlisted_service_rule": "Servicio nuevo no hereda porcentaje alto; primero se clasifica por riesgo, venta, entrega, costos y responsable",
      "unlisted_service_default": "3%-15% Arthur hasta clasificacion; maximo 45% solo si vende y entrega todo aprobado sin capital ONIA"
    }
  }'::jsonb
)
on conflict (trial_key) do update set
  title = excluded.title,
  participant_key = excluded.participant_key,
  status = excluded.status,
  review_rule = excluded.review_rule,
  raw = onia_sales.operation_trials.raw || excluded.raw,
  updated_at = now();

insert into onia_sales.operation_centers (center_key, title, owner, status, purpose, rules, raw)
values
  (
    'onia_services',
    'ONIA Servicios',
    'Sergio direccion / Arthur ventas-operacion',
    'active',
    'Webs, automatizaciones, marketing, DentalGest, GestiOS, auditorias y sistemas.',
    '["40% Fondo ONIA protegido durante 60 dias","Comision solo con cobro real, CRM completo y evidencia","Si Arthur vende y entrega todo aprobado sin capital ONIA: 45% Arthur, 40% Fondo ONIA, 15% Sergio","Arthur no paga mensualidad fija ONIA, pero su techo baja por no aportar capital ONIA","Servicio nuevo o no listado debe clasificarse antes de vender o aprobar comision alta"]'::jsonb,
    '{"source":"seed","risk_protected_fund_percent":40,"arthur_max_without_onia_capital_percent":45,"sergio_min_risk_percent":15}'::jsonb
  ),
  (
    'nuvia',
    'Nuvia',
    'Sergio / Arthur 50-50 en capital e inventario',
    'watched',
    'Producto fisico, catalogo, contenido, inventario, caja chica y cierres quincenales.',
    '["No se mezcla con ingresos generales de ONIA","Descontar producto, gastos directos y herramientas premium antes del reparto","20% Fondo ONIA, 15% Reserva Nuvia y utilidad restante 50/50"]'::jsonb,
    '{"source":"seed"}'::jsonb
  ),
  (
    'onia_media',
    'ONIA Media / YouTube',
    'ONIA como activo base',
    'watched',
    'Canales de YouTube, contenido monetizable, sponsors, afiliados y piezas de largo plazo.',
    '["No se paga monetizacion hipotetica","Solo se calcula cuando la plataforma, afiliado o sponsor paga realmente","Usa apps ONIA base sin duplicar gasto","Solo se descuentan costos externos directos y uso premium prorrateado","Aporta al Fondo ONIA unico, no a un fondo separado","Si Arthur opera canal completo aprobado: 40% Arthur, 40% Fondo ONIA, 20% Sergio","Activos y cuentas quedan como ONIA Media salvo acuerdo escrito"]'::jsonb,
    '{
      "source": "seed",
      "cost_policy": {
        "shared_onia_apps": "cubiertas por Fondo ONIA unico",
        "direct_media_costs": ["pauta", "editor externo", "voz pagada", "musica/licencias", "creditos canal", "produccion externa"],
        "premium_proration": "Higgsfield, IA de video, voz o render se prorratean por uso real registrado",
        "liquidable_income_formula": "ingresos cobrados - impuestos/comisiones/plataformas - costos externos directos - uso premium prorrateado"
      }
    }'::jsonb
  ),
  (
    'onia_fund_cash',
    'Fondo ONIA y Caja Chica',
    'Sergio / Administracion',
    'active',
    'Mantener viva la empresa, pagar deuda, herramientas, pruebas necesarias y gastos chicos.',
    '["Deuda actual registrada: Bs. 2.414,49, asumida por Sergio/ONIA","Arthur no paga deuda previa ni apps de ONIA y no tiene retencion por este concepto","La existencia mensual se paga con Fondo ONIA; si no alcanza, Sergio/ONIA cubre temporalmente con capital de arranque","Excedente del Fondo ONIA recupera capital de Bs. 10.000 antes de bonos o retiros grandes","Caja chica minima: Bs. 400 Nuvia y Bs. 300 ONIA por mes","Si caja baja de Bs. 4.000, modo caja roja"]'::jsonb,
    '{"source":"seed","sergio_recoverable_capital_bs":10000,"arthur_monthly_fixed_obligation_bs":0}'::jsonb
  )
on conflict (center_key) do update set
  title = excluded.title,
  owner = excluded.owner,
  status = excluded.status,
  purpose = excluded.purpose,
  rules = excluded.rules,
  raw = onia_sales.operation_centers.raw || excluded.raw,
  updated_at = now();

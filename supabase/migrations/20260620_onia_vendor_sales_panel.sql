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

alter table onia_sales.vendor_profiles enable row level security;
alter table onia_sales.vendor_leads enable row level security;
alter table onia_sales.vendor_web_diagnostics enable row level security;
alter table onia_sales.vendor_notes enable row level security;
alter table onia_sales.vendor_ideas enable row level security;
alter table onia_sales.vendor_income enable row level security;
alter table onia_sales.vendor_commissions enable row level security;
alter table onia_sales.vendor_followups enable row level security;

-- Locked by default. n8n/server-side service-role routes should write here.
-- Add explicit policies only after ONIA defines authenticated internal users.

insert into onia_sales.vendor_profiles (vendor_key, display_name, role, raw)
values
  ('sergio', 'Sergio / ONIA', 'admin', '{"source":"seed"}'::jsonb),
  ('vendedor_demo', 'Vendedor demo', 'seller', '{"source":"seed"}'::jsonb)
on conflict (vendor_key) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  raw = onia_sales.vendor_profiles.raw || excluded.raw,
  updated_at = now();

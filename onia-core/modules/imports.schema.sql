-- ONIA Imports Module base schema draft (Costo de Importacion / Landed Cost Bolivia).
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_imports_*. Depende de tablas del core (organization/business_partner/
-- document/work_item/approval_request) por referencia logica; no las redefine.
-- import_shipment NO es la entidad core import_batch (esa es carga de DATOS).
-- variant_id referencia la product_variant del modulo commerce por convencion
-- (modulo-a-modulo), no una tabla de este schema.

-- Tabla de referencia NACIONAL (mismo arancel para todos): entidad root, sin
-- organization_id. gaBasePct y reduction_pts se guardan como FRACCION (0.10 = 10%).
create table if not exists onia_imports_tariff_rates (
  id text primary key,
  nandina_code text not null,
  ga_base_pct numeric not null,
  reduction_pts numeric not null default 0,
  zero_rated boolean not null default false,
  ice_applies boolean not null default false,
  ice_rate numeric,
  valid_from date not null,
  valid_to date,
  source text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_imports_tariff_rates_nandina_idx
  on onia_imports_tariff_rates (nandina_code, valid_from);

create table if not exists onia_imports_shipments (
  id text primary key,
  organization_id text not null,
  dui_number text not null,
  validation_date date not null,
  mode text not null,
  currency text not null default 'USD',
  fob_usd numeric not null,
  freight_usd numeric not null default 0,
  insurance_usd numeric not null default 0,
  loading_unloading_usd numeric not null default 0,
  despacho_usd numeric not null default 0,
  almacenaje_usd numeric not null default 0,
  transporte_interno_usd numeric not null default 0,
  verificacion_pct numeric not null default 0,
  status text not null default 'draft',
  supplier_id text,
  supplier_nit text,
  document_id text,
  work_item_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_imports_shipments_org_idx
  on onia_imports_shipments (organization_id, validation_date, status);

create table if not exists onia_imports_shipment_lines (
  id text primary key,
  organization_id text not null,
  shipment_id text not null,
  nandina_code text not null,
  variant_id text,
  fob_usd numeric not null,
  quantity numeric not null,
  weight_kg numeric,
  unit_landed_cost_usd numeric,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_imports_shipment_lines_shipment_idx
  on onia_imports_shipment_lines (organization_id, shipment_id, nandina_code);

create table if not exists onia_imports_landed_cost_calculations (
  id text primary key,
  organization_id text not null,
  shipment_id text not null,
  calculated_at timestamptz not null,
  vat_mode text not null default 'inside_1494',
  ga_pct_snapshot numeric,
  freight_insurance_factor numeric,
  include_vat_in_cost boolean not null default false,
  distribute_by text not null default 'value',
  exchange_rate_bob numeric,
  total_inventory_usd numeric not null,
  total_recoverable_vat_usd numeric not null,
  snapshot_json jsonb not null default '{}'::jsonb,
  approved_by_member_id text,
  approval_request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_imports_landed_cost_calculations_shipment_idx
  on onia_imports_landed_cost_calculations (organization_id, shipment_id, calculated_at);

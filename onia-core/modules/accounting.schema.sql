-- ONIA Accounting Module base schema draft (Bolivia).
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_accounting_*. Depende de tablas del core (organization/member/
-- business_partner/document) por referencia logica; no las redefine.
-- El libro mayor y el balance de comprobacion se DERIVAN de las lineas, no se
-- guardan duplicados.

-- Capability: accounting -------------------------------------------------------

create table if not exists onia_accounting_accounts (
  id text primary key,
  organization_id text not null,
  code text not null,
  name text not null,
  account_type text not null,
  nature text not null,
  level integer not null default 1,
  parent_code text,
  is_postable boolean not null default true,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create index if not exists onia_accounting_accounts_type_idx
  on onia_accounting_accounts (organization_id, account_type, active);

create table if not exists onia_accounting_fiscal_periods (
  id text primary key,
  organization_id text not null,
  name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'open',
  sector text,
  closed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists onia_accounting_fiscal_periods_status_idx
  on onia_accounting_fiscal_periods (organization_id, status, end_date);

create table if not exists onia_accounting_journal_entries (
  id text primary key,
  organization_id text not null,
  entry_number text not null,
  date date not null,
  glosa text not null,
  entry_type text not null default 'diario',
  status text not null default 'draft',
  period_id text,
  source_type text,
  source_id text,
  created_by text not null,
  posted_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entry_number)
);

create index if not exists onia_accounting_journal_entries_date_idx
  on onia_accounting_journal_entries (organization_id, date);

create index if not exists onia_accounting_journal_entries_status_idx
  on onia_accounting_journal_entries (organization_id, status);

create table if not exists onia_accounting_journal_entry_lines (
  id text primary key,
  organization_id text not null,
  entry_id text not null,
  account_code text not null,
  debit numeric not null default 0,
  credit numeric not null default 0,
  description text,
  partner_id text,
  cost_center text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onia_accounting_journal_entry_lines_entry_idx
  on onia_accounting_journal_entry_lines (organization_id, entry_id);

create index if not exists onia_accounting_journal_entry_lines_account_idx
  on onia_accounting_journal_entry_lines (organization_id, account_code);

-- Capability: tax_bolivia ------------------------------------------------------

create table if not exists onia_accounting_tax_rates (
  id text primary key,
  organization_id text not null,
  tax_code text not null,
  name text not null,
  rate numeric not null,
  periodicity text not null,
  legal_basis text,
  valid_from date,
  valid_to date,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tax_code, valid_from)
);

create index if not exists onia_accounting_tax_rates_code_idx
  on onia_accounting_tax_rates (organization_id, tax_code, active);

create table if not exists onia_accounting_tax_declarations (
  id text primary key,
  organization_id text not null,
  tax_code text not null,
  period text not null,
  status text not null default 'pending',
  due_date date not null,
  tax_base numeric not null default 0,
  tax_amount numeric not null default 0,
  previous_balance numeric,
  net_payable numeric,
  filed_at timestamptz,
  form_number text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tax_code, period)
);

create index if not exists onia_accounting_tax_declarations_due_idx
  on onia_accounting_tax_declarations (organization_id, status, due_date);

create table if not exists onia_accounting_rcv_records (
  id text primary key,
  organization_id text not null,
  kind text not null,
  period text not null,
  invoice_number text not null,
  authorization_code text,
  control_code text,
  nit text not null,
  partner_id text,
  partner_name text,
  date date not null,
  amount numeric not null,
  iva_amount numeric not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_accounting_rcv_records_period_idx
  on onia_accounting_rcv_records (organization_id, kind, period);

create table if not exists onia_accounting_withholding_records (
  id text primary key,
  organization_id text not null,
  withholding_type text not null,
  period text not null,
  date date not null,
  payee_id text,
  payee_name text,
  payee_nit text,
  gross_amount numeric not null,
  retention_amount numeric not null,
  form_number text,
  status text not null default 'pending',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_accounting_withholding_records_period_idx
  on onia_accounting_withholding_records (organization_id, withholding_type, period);

-- Capability: accounting (activo fijo) -----------------------------------------

create table if not exists onia_accounting_fixed_assets (
  id text primary key,
  organization_id text not null,
  asset_code text not null,
  name text not null,
  asset_type text not null,
  acquisition_date date not null,
  acquisition_cost numeric not null,
  salvage_value numeric not null default 0,
  status text not null default 'active',
  serial_number text,
  area_id text,
  disposal_date date,
  disposal_amount numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_code)
);

create index if not exists onia_accounting_fixed_assets_status_idx
  on onia_accounting_fixed_assets (organization_id, status, asset_type);

create index if not exists onia_accounting_rcv_records_nit_idx
  on onia_accounting_rcv_records (organization_id, nit);

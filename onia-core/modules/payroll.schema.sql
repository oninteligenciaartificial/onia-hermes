-- ONIA Payroll Module base schema draft (Bolivia - Planilla de Sueldos).
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_payroll_*. Depende de tablas del core (organization/member/
-- work_item/approval_request/document) por referencia logica; no las redefine.

create table if not exists onia_payroll_employee_profiles (
  id text primary key,
  organization_id text not null,
  member_id text not null,
  ci text not null,
  hire_date date not null,
  monthly_salary numeric not null,
  active boolean not null default true,
  position text,
  contract_type text,
  termination_date date,
  termination_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, member_id)
);

create index if not exists onia_payroll_employee_profiles_active_idx
  on onia_payroll_employee_profiles (organization_id, active);

create table if not exists onia_payroll_periods (
  id text primary key,
  organization_id text not null,
  period_month integer not null,
  period_year integer not null,
  status text not null default 'open',
  smn_bob numeric,
  closed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, period_year, period_month)
);

create index if not exists onia_payroll_periods_status_idx
  on onia_payroll_periods (organization_id, status, period_year desc, period_month desc);

create table if not exists onia_payroll_entries (
  id text primary key,
  organization_id text not null,
  period_id text not null,
  employee_id text not null,
  total_ganado numeric not null,
  net_pay numeric not null,
  status text not null default 'draft',
  afp_laboral_total numeric,
  afp_patronal_total numeric,
  aporte_nacional_solidario numeric,
  cns_patronal numeric,
  rc_iva_base numeric,
  rc_iva_retencion_bruta numeric,
  rc_iva_compensacion_automatica numeric,
  rc_iva_retencion_neta numeric,
  work_item_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, period_id, employee_id)
);

create index if not exists onia_payroll_entries_period_idx
  on onia_payroll_entries (organization_id, period_id);

create index if not exists onia_payroll_entries_employee_idx
  on onia_payroll_entries (organization_id, employee_id);

create table if not exists onia_payroll_termination_settlements (
  id text primary key,
  organization_id text not null,
  employee_id text not null,
  termination_date date not null,
  reason text not null,
  total numeric not null,
  deadline_date date not null,
  pending_salary numeric,
  aguinaldo_proportional numeric,
  indemnizacion numeric,
  desahucio numeric,
  vacation_compensation numeric,
  paid_at timestamptz,
  approval_request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_payroll_termination_settlements_employee_idx
  on onia_payroll_termination_settlements (organization_id, employee_id);

create index if not exists onia_payroll_termination_settlements_deadline_idx
  on onia_payroll_termination_settlements (organization_id, deadline_date);

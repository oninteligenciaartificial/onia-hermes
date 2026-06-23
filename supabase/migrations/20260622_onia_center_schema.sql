-- ONIA Center operating system schema.
-- DDL only. Seed data lives in 20260622_onia_center_seed.sql.
-- Private-first: RLS is enabled and no public policies are created here.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists onia_center;

create or replace function onia_center.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists onia_center.seed_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_path text not null,
  source_generated_at date,
  status text not null default 'active' check (status in ('active', 'superseded', 'archived')),
  checksum_note text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_seed_sources_updated_at on onia_center.seed_sources;
create trigger trg_onia_center_seed_sources_updated_at
before update on onia_center.seed_sources
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.roles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  role_name text not null,
  hierarchy_level integer not null check (hierarchy_level >= 0),
  visibility_scope text not null default 'restricted' check (
    visibility_scope in ('sergio_private', 'internal_restricted', 'seller_basic', 'freelancer_task')
  ),
  can_view_private_capital boolean not null default false,
  can_approve_payments boolean not null default false,
  can_approve_discounts boolean not null default false,
  can_approve_expenses boolean not null default false,
  can_approve_premium_tools boolean not null default false,
  can_approve_nuvia_distribution boolean not null default false,
  can_approve_own_commission boolean not null default false,
  can_contact_sensitive_clients boolean not null default false,
  can_act_as_partner boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_roles_updated_at on onia_center.roles;
create trigger trg_onia_center_roles_updated_at
before update on onia_center.roles
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.accounting_centers (
  id uuid primary key default gen_random_uuid(),
  center_key text not null unique,
  center_name text not null,
  owner_role_key text not null references onia_center.roles(role_key),
  visibility_scope text not null default 'internal_restricted' check (
    visibility_scope in ('sergio_private', 'internal_restricted', 'seller_basic')
  ),
  fund_percent numeric(5, 2) not null default 0 check (fund_percent >= 0 and fund_percent <= 100),
  reserve_percent numeric(5, 2) not null default 0 check (reserve_percent >= 0 and reserve_percent <= 100),
  has_separate_fund boolean not null default false,
  rule text not null,
  status text not null default 'active' check (status in ('active', 'watched', 'blocked', 'archived')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_accounting_centers_updated_at on onia_center.accounting_centers;
create trigger trg_onia_center_accounting_centers_updated_at
before update on onia_center.accounting_centers
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.services (
  id uuid primary key default gen_random_uuid(),
  service_key text not null unique,
  service_name text not null,
  category text not null,
  status text not null default 'draft' check (
    status in ('draft', 'blocked', 'sellable', 'sergio_approval', 'archived')
  ),
  priority integer not null default 99 check (priority >= 1),
  setup_price_bs numeric(12, 2),
  monthly_price_bs numeric(12, 2),
  is_recurring boolean not null default false,
  accounting_center_key text not null references onia_center.accounting_centers(center_key),
  onia_fund_percent numeric(5, 2) not null default 0 check (onia_fund_percent >= 0 and onia_fund_percent <= 100),
  excluded_costs jsonb not null default '[]'::jsonb,
  tools_used jsonb not null default '[]'::jsonb,
  premium_tool_limit text,
  includes jsonb not null default '[]'::jsonb,
  not_included jsonb not null default '[]'::jsonb,
  deliverables jsonb not null default '[]'::jsonb,
  delivery_sla text,
  delivery_owner text,
  approval_required jsonb not null default '[]'::jsonb,
  evidence_required jsonb not null default '[]'::jsonb,
  seller_commission_rule text,
  arthur_variable_rule text,
  minimum_margin_rule text,
  risk text,
  ease text,
  weekly_capacity text,
  quote_template text,
  sales_script text,
  close_checklist jsonb not null default '[]'::jsonb,
  delivery_checklist jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_services_price_setup_required check (
    status <> 'sellable' or setup_price_bs is not null
  ),
  constraint onia_center_services_monthly_required_if_recurring check (
    status <> 'sellable' or is_recurring = false or monthly_price_bs is not null
  ),
  constraint onia_center_services_required_json_fields check (
    status <> 'sellable'
    or (
      jsonb_array_length(excluded_costs) > 0
      and jsonb_array_length(evidence_required) > 0
      and jsonb_array_length(close_checklist) > 0
      and jsonb_array_length(delivery_checklist) > 0
    )
  ),
  constraint onia_center_services_required_rules check (
    status <> 'sellable'
    or (
      delivery_owner is not null
      and premium_tool_limit is not null
      and minimum_margin_rule is not null
      and (seller_commission_rule is not null or arthur_variable_rule is not null)
    )
  )
);

drop trigger if exists trg_onia_center_services_updated_at on onia_center.services;
create trigger trg_onia_center_services_updated_at
before update on onia_center.services
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_services_priority
  on onia_center.services (priority, status, accounting_center_key);

create table if not exists onia_center.leads (
  id uuid primary key default gen_random_uuid(),
  lead_key text not null unique,
  company_name text not null,
  business_type text not null,
  city text,
  country text not null default 'Bolivia',
  public_contact text,
  channel text not null default 'WhatsApp',
  source text,
  contact_permission text not null default 'pending' check (
    contact_permission in ('approved', 'pending', 'no_contact')
  ),
  origin_role_key text references onia_center.roles(role_key),
  owner_role_key text references onia_center.roles(role_key),
  pipeline_status text not null default 'Nuevo',
  suggested_service_key text references onia_center.services(service_key),
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  pain_point text,
  next_followup_at timestamptz,
  data_complete boolean not null default false,
  private_notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_leads_updated_at on onia_center.leads;
create trigger trg_onia_center_leads_updated_at
before update on onia_center.leads
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_leads_pipeline
  on onia_center.leads (pipeline_status, next_followup_at);

create table if not exists onia_center.evidence_items (
  id uuid primary key default gen_random_uuid(),
  evidence_key text unique,
  center_key text not null references onia_center.accounting_centers(center_key),
  actor_role_key text not null references onia_center.roles(role_key),
  lead_id uuid references onia_center.leads(id) on delete set null,
  evidence_type text not null check (
    evidence_type in ('crm', 'call', 'message', 'payment', 'delivery', 'cost', 'content', 'training', 'system', 'approval', 'premium_use')
  ),
  title text not null,
  proof_reference text,
  amount_bs numeric(12, 2) check (amount_bs is null or amount_bs >= 0),
  evidence_at timestamptz not null default now(),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'retained')
  ),
  approved_by_role_key text references onia_center.roles(role_key),
  approved_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_evidence_approved_by_sergio check (
    status <> 'approved' or approved_by_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_evidence_items_updated_at on onia_center.evidence_items;
create trigger trg_onia_center_evidence_items_updated_at
before update on onia_center.evidence_items
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_evidence_status
  on onia_center.evidence_items (status, center_key, evidence_at desc);

create table if not exists onia_center.income_entries (
  id uuid primary key default gen_random_uuid(),
  income_key text unique,
  lead_id uuid references onia_center.leads(id) on delete set null,
  service_key text not null references onia_center.services(service_key),
  center_key text not null references onia_center.accounting_centers(center_key),
  seller_role_key text references onia_center.roles(role_key),
  gross_amount_bs numeric(12, 2) not null check (gross_amount_bs >= 0),
  external_costs_bs numeric(12, 2) not null default 0 check (external_costs_bs >= 0),
  discounts_bs numeric(12, 2) not null default 0 check (discounts_bs >= 0),
  refunds_bs numeric(12, 2) not null default 0 check (refunds_bs >= 0),
  net_amount_bs numeric(12, 2) generated always as (
    gross_amount_bs - external_costs_bs - discounts_bs - refunds_bs
  ) stored,
  paid_at date not null default current_date,
  payment_reference text,
  evidence_id uuid references onia_center.evidence_items(id) on delete set null,
  delivery_status text not null default 'pending' check (
    delivery_status in ('pending', 'onboarding', 'in_delivery', 'delivered', 'blocked', 'refunded')
  ),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_income_net_non_negative check (net_amount_bs >= 0)
);

drop trigger if exists trg_onia_center_income_entries_updated_at on onia_center.income_entries;
create trigger trg_onia_center_income_entries_updated_at
before update on onia_center.income_entries
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_income_center
  on onia_center.income_entries (center_key, paid_at desc);

create table if not exists onia_center.expense_entries (
  id uuid primary key default gen_random_uuid(),
  expense_key text unique,
  center_key text not null references onia_center.accounting_centers(center_key),
  owner_role_key text not null references onia_center.roles(role_key),
  spent_at date not null default current_date,
  amount_bs numeric(12, 2) not null check (amount_bs >= 0),
  category text not null,
  reason text not null,
  evidence_id uuid references onia_center.evidence_items(id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'reimbursed')
  ),
  approved_by_role_key text references onia_center.roles(role_key),
  approved_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_expenses_approved_by_sergio check (
    status <> 'approved' or approved_by_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_expense_entries_updated_at on onia_center.expense_entries;
create trigger trg_onia_center_expense_entries_updated_at
before update on onia_center.expense_entries
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_expenses_center
  on onia_center.expense_entries (center_key, spent_at desc);

create table if not exists onia_center.scorecards (
  id uuid primary key default gen_random_uuid(),
  scorecard_key text not null unique,
  actor_role_key text not null references onia_center.roles(role_key),
  title text not null,
  period_start date,
  period_end date,
  approval_threshold_percent numeric(5, 2) not null default 80 check (
    approval_threshold_percent >= 0 and approval_threshold_percent <= 100
  ),
  must_have_rules jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'closed', 'archived')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_scorecards_updated_at on onia_center.scorecards;
create trigger trg_onia_center_scorecards_updated_at
before update on onia_center.scorecards
for each row execute function onia_center.touch_updated_at();

create table if not exists onia_center.scorecard_items (
  id uuid primary key default gen_random_uuid(),
  scorecard_key text not null references onia_center.scorecards(scorecard_key) on delete cascade,
  item_key text not null,
  area text not null,
  target_text text not null,
  required boolean not null default true,
  evidence_required boolean not null default true,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (scorecard_key, item_key)
);

create table if not exists onia_center.payment_commissions (
  id uuid primary key default gen_random_uuid(),
  payment_key text unique,
  income_id uuid references onia_center.income_entries(id) on delete set null,
  center_key text not null references onia_center.accounting_centers(center_key),
  actor_role_key text not null references onia_center.roles(role_key),
  payment_type text not null check (
    payment_type in ('seller_commission', 'arthur_variable', 'sergio_owner_income', 'fund_allocation', 'advance', 'monthly_close')
  ),
  calculation_basis text not null,
  gross_basis_bs numeric(12, 2) not null check (gross_basis_bs >= 0),
  rate_percent numeric(5, 2) not null default 0 check (rate_percent >= 0 and rate_percent <= 100),
  calculated_amount_bs numeric(12, 2) not null default 0 check (calculated_amount_bs >= 0),
  claim_deductions_bs numeric(12, 2) not null default 0 check (claim_deductions_bs >= 0),
  advance_percent numeric(5, 2) not null default 0 check (advance_percent >= 0 and advance_percent <= 100),
  advance_amount_bs numeric(12, 2) not null default 0 check (advance_amount_bs >= 0),
  monthly_close_amount_bs numeric(12, 2) not null default 0 check (monthly_close_amount_bs >= 0),
  evidence_id uuid references onia_center.evidence_items(id) on delete set null,
  status text not null default 'estimated' check (
    status in ('estimated', 'pending', 'approved', 'paid', 'blocked', 'discounted')
  ),
  sergio_approved boolean not null default false,
  approved_by_role_key text references onia_center.roles(role_key),
  approved_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_payments_need_evidence_and_sergio check (
    status <> 'approved'
    or (evidence_id is not null and sergio_approved = true and approved_by_role_key = 'sergio')
  )
);

drop trigger if exists trg_onia_center_payment_commissions_updated_at on onia_center.payment_commissions;
create trigger trg_onia_center_payment_commissions_updated_at
before update on onia_center.payment_commissions
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_payments_actor
  on onia_center.payment_commissions (actor_role_key, status, created_at desc);

create table if not exists onia_center.nuvia_lots (
  id uuid primary key default gen_random_uuid(),
  lot_key text not null unique,
  lot_name text not null,
  center_key text not null default 'nuvia' references onia_center.accounting_centers(center_key),
  sales_collected_bs numeric(12, 2) not null default 0 check (sales_collected_bs >= 0),
  product_capital_sergio_bs numeric(12, 2) not null default 0 check (product_capital_sergio_bs >= 0),
  product_capital_arthur_bs numeric(12, 2) not null default 0 check (product_capital_arthur_bs >= 0),
  product_capital_recovered_bs numeric(12, 2) not null default 0 check (product_capital_recovered_bs >= 0),
  packaging_bs numeric(12, 2) not null default 0 check (packaging_bs >= 0),
  transport_bs numeric(12, 2) not null default 0 check (transport_bs >= 0),
  ads_bs numeric(12, 2) not null default 0 check (ads_bs >= 0),
  premium_tools_bs numeric(12, 2) not null default 0 check (premium_tools_bs >= 0),
  external_production_bs numeric(12, 2) not null default 0 check (external_production_bs >= 0),
  refunds_fees_bs numeric(12, 2) not null default 0 check (refunds_fees_bs >= 0),
  real_gross_profit_bs numeric(12, 2) generated always as (
    sales_collected_bs
    - product_capital_recovered_bs
    - packaging_bs
    - transport_bs
    - ads_bs
    - premium_tools_bs
    - external_production_bs
    - refunds_fees_bs
  ) stored,
  gross_margin_percent numeric(7, 4) generated always as (
    case when sales_collected_bs = 0 then null else
      (
        sales_collected_bs
        - product_capital_recovered_bs
        - packaging_bs
        - transport_bs
        - ads_bs
        - premium_tools_bs
        - external_production_bs
        - refunds_fees_bs
      ) / sales_collected_bs
    end
  ) stored,
  onia_fund_percent numeric(5, 2) not null default 20 check (onia_fund_percent = 20),
  nuvia_reserve_percent numeric(5, 2) not null default 10 check (nuvia_reserve_percent = 10),
  arthur_variable_percent numeric(5, 2) not null default 0 check (arthur_variable_percent >= 0 and arthur_variable_percent <= 25),
  cost_complete boolean not null default false,
  evidence_id uuid references onia_center.evidence_items(id) on delete set null,
  sergio_approved boolean not null default false,
  status text not null default 'draft' check (
    status in ('draft', 'pending_review', 'approved', 'paid', 'blocked', 'loss_carried')
  ),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_nuvia_distribution_gate check (
    status <> 'approved'
    or (
      cost_complete = true
      and evidence_id is not null
      and sergio_approved = true
      and gross_margin_percent >= 0.40
    )
  )
);

drop trigger if exists trg_onia_center_nuvia_lots_updated_at on onia_center.nuvia_lots;
create trigger trg_onia_center_nuvia_lots_updated_at
before update on onia_center.nuvia_lots
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_nuvia_lots_status
  on onia_center.nuvia_lots (status, created_at desc);

create table if not exists onia_center.premium_tool_usage (
  id uuid primary key default gen_random_uuid(),
  usage_key text unique,
  center_key text not null references onia_center.accounting_centers(center_key),
  actor_role_key text not null references onia_center.roles(role_key),
  tool_name text not null,
  usage_reason text not null,
  brief_reference text,
  cost_bs numeric(12, 2) not null default 0 check (cost_bs >= 0),
  usage_at timestamptz not null default now(),
  evidence_id uuid references onia_center.evidence_items(id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'charged_to_center')
  ),
  approved_by_role_key text references onia_center.roles(role_key),
  approved_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onia_center_premium_usage_center_required check (center_key is not null),
  constraint onia_center_premium_usage_approved_by_sergio check (
    status <> 'approved' or approved_by_role_key = 'sergio'
  )
);

drop trigger if exists trg_onia_center_premium_tool_usage_updated_at on onia_center.premium_tool_usage;
create trigger trg_onia_center_premium_tool_usage_updated_at
before update on onia_center.premium_tool_usage
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_premium_tool_usage_center
  on onia_center.premium_tool_usage (center_key, usage_at desc);

alter table onia_center.seed_sources enable row level security;
alter table onia_center.roles enable row level security;
alter table onia_center.accounting_centers enable row level security;
alter table onia_center.services enable row level security;
alter table onia_center.leads enable row level security;
alter table onia_center.evidence_items enable row level security;
alter table onia_center.income_entries enable row level security;
alter table onia_center.expense_entries enable row level security;
alter table onia_center.scorecards enable row level security;
alter table onia_center.scorecard_items enable row level security;
alter table onia_center.payment_commissions enable row level security;
alter table onia_center.nuvia_lots enable row level security;
alter table onia_center.premium_tool_usage enable row level security;

-- Locked by default. Add authenticated internal policies only after ONIA defines
-- Supabase users, roles and service-role API routes.

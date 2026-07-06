-- ONIA Invoicing Module base schema draft (Bolivia - Facturacion Electronica).
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_invoicing_*. Depende de tablas del core (organization/
-- business_partner/work_item/approval_request/document) por referencia
-- logica; no las redefine. Los campos cuf/cufd/cuis/control_code quedan NULL
-- hasta la emision real (external_gate siat).

create table if not exists onia_invoicing_invoices (
  id text primary key,
  organization_id text not null,
  invoice_number text not null,
  status text not null default 'draft',
  currency text not null default 'BOB',
  issue_date date not null,
  partner_id text not null,
  total numeric not null default 0,
  total_in_words text,
  modality text,
  branch_code text,
  point_of_sale_code text,
  economic_activity_code text,
  cuf text,
  cufd text,
  cuis text,
  control_code text,
  authorization_number text,
  qr_url text,
  legend text,
  work_item_id text,
  document_id text,
  quote_id text,
  order_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, invoice_number)
);

create index if not exists onia_invoicing_invoices_status_idx
  on onia_invoicing_invoices (organization_id, status, issue_date desc);

create index if not exists onia_invoicing_invoices_partner_idx
  on onia_invoicing_invoices (organization_id, partner_id);

create index if not exists onia_invoicing_invoices_cuf_idx
  on onia_invoicing_invoices (organization_id, cuf);

create table if not exists onia_invoicing_invoice_lines (
  id text primary key,
  organization_id text not null,
  invoice_id text not null,
  description text not null,
  quantity numeric not null,
  unit_price numeric not null,
  discount numeric,
  line_total numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onia_invoicing_invoice_lines_invoice_idx
  on onia_invoicing_invoice_lines (organization_id, invoice_id);

create table if not exists onia_invoicing_credit_debit_notes (
  id text primary key,
  organization_id text not null,
  note_type text not null,
  number text not null,
  original_invoice_cuf text not null,
  original_invoice_id text,
  reason text,
  date date not null,
  amount numeric not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, note_type, number)
);

create index if not exists onia_invoicing_credit_debit_notes_original_idx
  on onia_invoicing_credit_debit_notes (organization_id, original_invoice_cuf);

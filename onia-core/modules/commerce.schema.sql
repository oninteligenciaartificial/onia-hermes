-- ONIA Commerce Module base schema draft.
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Este modulo vive FUERA del core (el core no es inventario/ventas). Namespace
-- onia_commerce_*. Depende de tablas del core (organization/area/business_partner/
-- work_item) por referencia logica; no las redefine ni agrega FKs duras aca.

-- Capability: catalog_inventory ------------------------------------------------

create table if not exists onia_commerce_products (
  id text primary key,
  organization_id text not null,
  sku text not null,
  name text not null,
  unit text not null default 'unit',
  category text,
  brand text,
  description text,
  nandina_code text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create index if not exists onia_commerce_products_org_active_idx
  on onia_commerce_products (organization_id, active);

create table if not exists onia_commerce_product_variants (
  id text primary key,
  organization_id text not null,
  product_id text not null,
  sku text not null,
  attributes jsonb not null default '{}'::jsonb,
  barcode text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create index if not exists onia_commerce_product_variants_product_idx
  on onia_commerce_product_variants (organization_id, product_id);

create table if not exists onia_commerce_warehouses (
  id text primary key,
  organization_id text not null,
  name text not null,
  area_id text,
  address text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists onia_commerce_warehouses_org_active_idx
  on onia_commerce_warehouses (organization_id, active);

create table if not exists onia_commerce_stock_items (
  id text primary key,
  organization_id text not null,
  warehouse_id text not null,
  variant_id text not null,
  quantity numeric not null default 0,
  reorder_point numeric,
  unit_cost numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, warehouse_id, variant_id)
);

create index if not exists onia_commerce_stock_items_warehouse_idx
  on onia_commerce_stock_items (organization_id, warehouse_id);

create index if not exists onia_commerce_stock_items_variant_idx
  on onia_commerce_stock_items (organization_id, variant_id);

create table if not exists onia_commerce_stock_movements (
  id text primary key,
  organization_id text not null,
  stock_item_id text not null,
  movement_type text not null,
  quantity numeric not null,
  reason text,
  related_entity_type text,
  related_entity_id text,
  actor_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onia_commerce_stock_movements_item_idx
  on onia_commerce_stock_movements (organization_id, stock_item_id, created_at desc);

create table if not exists onia_commerce_price_lists (
  id text primary key,
  organization_id text not null,
  name text not null,
  currency text not null,
  valid_from timestamptz,
  valid_to timestamptz,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists onia_commerce_price_lists_currency_idx
  on onia_commerce_price_lists (organization_id, currency, active);

create table if not exists onia_commerce_price_list_items (
  id text primary key,
  organization_id text not null,
  price_list_id text not null,
  variant_id text not null,
  price numeric not null,
  min_quantity numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, price_list_id, variant_id)
);

-- Capability: quotes_b2b -------------------------------------------------------

create table if not exists onia_commerce_quotes (
  id text primary key,
  organization_id text not null,
  partner_id text not null,
  status text not null default 'draft',
  currency text not null,
  owner_id text not null,
  valid_until timestamptz,
  total numeric,
  work_item_id text,
  price_list_id text,
  sent_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  expired_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_commerce_quotes_status_idx
  on onia_commerce_quotes (organization_id, status, created_at desc);

create index if not exists onia_commerce_quotes_partner_idx
  on onia_commerce_quotes (organization_id, partner_id);

create table if not exists onia_commerce_quote_lines (
  id text primary key,
  organization_id text not null,
  quote_id text not null,
  variant_id text not null,
  quantity numeric not null,
  unit_price numeric not null,
  discount numeric,
  line_total numeric,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_commerce_quote_lines_quote_idx
  on onia_commerce_quote_lines (organization_id, quote_id);

-- Capability: sales_cash -------------------------------------------------------

create table if not exists onia_commerce_orders (
  id text primary key,
  organization_id text not null,
  partner_id text not null,
  status text not null default 'draft',
  currency text not null,
  owner_id text not null,
  quote_id text,
  warehouse_id text,
  total numeric,
  work_item_id text,
  confirmed_at timestamptz,
  fulfilled_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_commerce_orders_status_idx
  on onia_commerce_orders (organization_id, status, created_at desc);

create index if not exists onia_commerce_orders_partner_idx
  on onia_commerce_orders (organization_id, partner_id);

create table if not exists onia_commerce_order_lines (
  id text primary key,
  organization_id text not null,
  order_id text not null,
  variant_id text not null,
  quantity numeric not null,
  unit_price numeric not null,
  discount numeric,
  line_total numeric,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_commerce_order_lines_order_idx
  on onia_commerce_order_lines (organization_id, order_id);

create table if not exists onia_commerce_payments (
  id text primary key,
  organization_id text not null,
  order_id text,
  partner_id text,
  amount numeric not null,
  currency text not null,
  method text not null,
  status text not null default 'pending',
  reference text,
  received_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_commerce_payments_status_idx
  on onia_commerce_payments (organization_id, status, created_at desc);

create index if not exists onia_commerce_payments_order_idx
  on onia_commerce_payments (organization_id, order_id);

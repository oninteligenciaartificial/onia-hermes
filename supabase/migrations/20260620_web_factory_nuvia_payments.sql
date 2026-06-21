-- Web Factory payment/order foundation for Nuvia.
-- Additive and forward-only. Secrets stay outside the database.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists web_factory;

create or replace function web_factory.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists web_factory.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  cart_id uuid references web_factory.cart_sessions(id) on delete set null,
  public_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_tax_id text,
  delivery_city text,
  delivery_address text,
  customer_notes text,
  status text not null default 'pending_payment' check (
    status in ('draft', 'pending_payment', 'paid', 'payment_failed', 'cancelled', 'fulfilled', 'refunded')
  ),
  payment_status text not null default 'unpaid' check (
    payment_status in ('unpaid', 'pending', 'paid', 'failed', 'expired', 'refunded')
  ),
  subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
  discount_total numeric(12, 2) not null default 0 check (discount_total >= 0),
  total numeric(12, 2) not null default 0 check (total >= 0),
  currency text not null default 'BOB',
  source text not null default 'nuvia_next_checkout',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_web_factory_orders_updated_at on web_factory.orders;
create trigger trg_web_factory_orders_updated_at
before update on web_factory.orders
for each row execute function web_factory.touch_updated_at();

create index if not exists idx_web_factory_orders_store_created
on web_factory.orders(store_id, created_at desc);

create index if not exists idx_web_factory_orders_status
on web_factory.orders(store_id, status, payment_status);

create table if not exists web_factory.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references web_factory.orders(id) on delete cascade,
  product_id uuid references web_factory.products(id) on delete set null,
  product_slug text not null,
  title text not null,
  brand text,
  category text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12, 2),
  line_total numeric(12, 2),
  price_label text not null default 'Consultar precio',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_web_factory_order_items_order
on web_factory.order_items(order_id);

create table if not exists web_factory.payment_providers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  code text not null,
  name text not null,
  kind text not null check (kind in ('qr', 'wallet', 'card', 'manual')),
  status text not null default 'pending_credentials' check (
    status in ('pending_credentials', 'sandbox', 'active', 'disabled')
  ),
  priority integer not null default 100,
  config_public jsonb not null default '{}'::jsonb,
  required_credentials text[] not null default '{}'::text[],
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, code)
);

drop trigger if exists trg_web_factory_payment_providers_updated_at on web_factory.payment_providers;
create trigger trg_web_factory_payment_providers_updated_at
before update on web_factory.payment_providers
for each row execute function web_factory.touch_updated_at();

create table if not exists web_factory.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references web_factory.orders(id) on delete cascade,
  provider_id uuid references web_factory.payment_providers(id) on delete set null,
  provider_code text not null,
  provider_payment_id text,
  provider_reference text,
  status text not null default 'requires_configuration' check (
    status in ('requires_configuration', 'pending', 'processing', 'paid', 'failed', 'expired', 'cancelled', 'refunded')
  ),
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'BOB',
  qr_payload text,
  qr_image_url text,
  checkout_url text,
  expires_at timestamptz,
  verified_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_web_factory_payments_updated_at on web_factory.payments;
create trigger trg_web_factory_payments_updated_at
before update on web_factory.payments
for each row execute function web_factory.touch_updated_at();

create index if not exists idx_web_factory_payments_order
on web_factory.payments(order_id);

create index if not exists idx_web_factory_payments_provider_status
on web_factory.payments(provider_code, status, created_at desc);

create table if not exists web_factory.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references web_factory.payments(id) on delete cascade,
  order_id uuid references web_factory.orders(id) on delete cascade,
  provider_code text not null,
  event_type text not null,
  event_status text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_web_factory_payment_events_payment
on web_factory.payment_events(payment_id, created_at desc);

create or replace view web_factory.pending_payment_checks as
select
  payment.id as payment_id,
  payment.order_id,
  orders.public_code,
  payment.provider_code,
  payment.provider_payment_id,
  payment.status,
  payment.amount,
  payment.currency,
  payment.expires_at,
  payment.created_at
from web_factory.payments payment
join web_factory.orders orders on orders.id = payment.order_id
where payment.status in ('pending', 'processing')
  and (payment.expires_at is null or payment.expires_at > now());

alter table web_factory.orders enable row level security;
alter table web_factory.order_items enable row level security;
alter table web_factory.payment_providers enable row level security;
alter table web_factory.payments enable row level security;
alter table web_factory.payment_events enable row level security;

with store_ref as (
  select id from web_factory.stores where slug = 'nuvia'
),
providers as (
  select *
  from (
    values
      (
        'bnb_qr_simple',
        'BNB QR Simple',
        'qr',
        'pending_credentials',
        10,
        '{"settlement":"bank_account","flow":"dynamic_qr","primary":true}'::jsonb,
        array[
          'BNB_ACCOUNT_ID',
          'BNB_AUTHORIZATION_ID',
          'BNB_AUTH_BASE_URL',
          'BNB_QR_BASE_URL'
        ]::text[],
        '{"official_docs":"https://www.bnb.com.bo/PortalBNB/Api/Sandbox","endpoints":["/auth/token","/main/getQRWithImageAsync","/main/getQRStatusAsync"]}'::jsonb
      ),
      (
        'yape_manual',
        'Yape Negocios manual',
        'wallet',
        'pending_credentials',
        20,
        '{"flow":"manual_qr_or_number","fallback":true}'::jsonb,
        array['YAPE_BUSINESS_PHONE_OR_QR']::text[],
        '{"activation":"pending business account data"}'::jsonb
      ),
      (
        'bank_transfer_manual',
        'Transferencia bancaria manual',
        'manual',
        'pending_credentials',
        30,
        '{"flow":"manual_transfer","fallback":true}'::jsonb,
        array['NUVIA_BANK_NAME', 'NUVIA_BANK_ACCOUNT', 'NUVIA_BANK_ACCOUNT_OWNER']::text[],
        '{"activation":"pending bank account details"}'::jsonb
      )
  ) as provider(code, name, kind, status, priority, config_public, required_credentials, raw)
)
insert into web_factory.payment_providers (
  store_id, code, name, kind, status, priority, config_public, required_credentials, raw
)
select
  store_ref.id,
  provider.code,
  provider.name,
  provider.kind,
  provider.status,
  provider.priority,
  provider.config_public,
  provider.required_credentials,
  provider.raw
from store_ref, providers provider
on conflict (store_id, code) do update set
  name = excluded.name,
  kind = excluded.kind,
  priority = excluded.priority,
  config_public = web_factory.payment_providers.config_public || excluded.config_public,
  required_credentials = excluded.required_credentials,
  raw = web_factory.payment_providers.raw || excluded.raw,
  updated_at = now();

update web_factory.stores
set raw = raw || '{"checkout_mode":"server_order_payment_ready","payment_primary":"bnb_qr_simple"}'::jsonb,
    updated_at = now()
where slug = 'nuvia';

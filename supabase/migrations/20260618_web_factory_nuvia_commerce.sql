-- Web Factory commerce foundation for Nuvia.
-- Applied to the private/local-only Supabase stack on the ONIA VPS.
-- This migration is intentionally additive and forward-only.

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

create table if not exists web_factory.stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  currency text not null default 'BOB',
  status text not null default 'draft' check (status in ('draft', 'active', 'paused')),
  contact_whatsapp text,
  contact_email text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_web_factory_stores_updated_at on web_factory.stores;
create trigger trg_web_factory_stores_updated_at
before update on web_factory.stores
for each row execute function web_factory.touch_updated_at();

create table if not exists web_factory.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  slug text not null,
  title text not null,
  short_title text,
  brand text,
  category text,
  size text,
  routine_step integer,
  routine_label text,
  price_label text not null default 'Consultar precio',
  price_value numeric(12, 2),
  currency text not null default 'BOB',
  stock_status text not null default 'quote_only' check (stock_status in ('quote_only', 'in_stock', 'out_of_stock', 'preorder')),
  stock_quantity integer,
  active boolean not null default true,
  featured boolean not null default false,
  discount_percent numeric(5, 2),
  description text,
  usage_notes text,
  benefits text[] not null default '{}'::text[],
  ideal_for text[] not null default '{}'::text[],
  ingredients text[] not null default '{}'::text[],
  image_path text,
  image_alt text,
  sort_order integer not null default 0,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_value_non_negative check (price_value is null or price_value >= 0),
  constraint products_stock_quantity_non_negative check (stock_quantity is null or stock_quantity >= 0),
  unique (store_id, slug)
);

drop trigger if exists trg_web_factory_products_updated_at on web_factory.products;
create trigger trg_web_factory_products_updated_at
before update on web_factory.products
for each row execute function web_factory.touch_updated_at();

create index if not exists idx_web_factory_products_store_active on web_factory.products(store_id, active, sort_order);
create index if not exists idx_web_factory_products_category on web_factory.products(store_id, category);
create index if not exists idx_web_factory_products_brand on web_factory.products(store_id, brand);

create table if not exists web_factory.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references web_factory.products(id) on delete cascade,
  src text not null,
  alt text,
  label text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, src)
);

create table if not exists web_factory.product_sections (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  slug text not null,
  label text,
  title text not null,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, slug)
);

drop trigger if exists trg_web_factory_product_sections_updated_at on web_factory.product_sections;
create trigger trg_web_factory_product_sections_updated_at
before update on web_factory.product_sections
for each row execute function web_factory.touch_updated_at();

create table if not exists web_factory.product_section_items (
  section_id uuid not null references web_factory.product_sections(id) on delete cascade,
  product_id uuid not null references web_factory.products(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (section_id, product_id)
);

create table if not exists web_factory.cart_sessions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  client_reference text,
  status text not null default 'open' check (status in ('open', 'quoted', 'converted', 'abandoned')),
  currency text not null default 'BOB',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_web_factory_cart_sessions_updated_at on web_factory.cart_sessions;
create trigger trg_web_factory_cart_sessions_updated_at
before update on web_factory.cart_sessions
for each row execute function web_factory.touch_updated_at();

create table if not exists web_factory.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references web_factory.cart_sessions(id) on delete cascade,
  product_id uuid not null references web_factory.products(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12, 2),
  price_label text not null default 'Consultar precio',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

drop trigger if exists trg_web_factory_cart_items_updated_at on web_factory.cart_items;
create trigger trg_web_factory_cart_items_updated_at
before update on web_factory.cart_items
for each row execute function web_factory.touch_updated_at();

create table if not exists web_factory.checkout_quotes (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  cart_id uuid references web_factory.cart_sessions(id) on delete set null,
  customer_name text,
  customer_contact text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'approved', 'rejected', 'converted')),
  subtotal numeric(12, 2),
  currency text not null default 'BOB',
  notes text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_web_factory_checkout_quotes_updated_at on web_factory.checkout_quotes;
create trigger trg_web_factory_checkout_quotes_updated_at
before update on web_factory.checkout_quotes
for each row execute function web_factory.touch_updated_at();

create table if not exists web_factory.discount_subscribers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references web_factory.stores(id) on delete cascade,
  email text not null,
  source text not null default 'website',
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

create unique index if not exists idx_web_factory_discount_subscribers_store_email_ci
on web_factory.discount_subscribers(store_id, lower(email));

alter table web_factory.stores enable row level security;
alter table web_factory.products enable row level security;
alter table web_factory.product_media enable row level security;
alter table web_factory.product_sections enable row level security;
alter table web_factory.product_section_items enable row level security;
alter table web_factory.cart_sessions enable row level security;
alter table web_factory.cart_items enable row level security;
alter table web_factory.checkout_quotes enable row level security;
alter table web_factory.discount_subscribers enable row level security;

-- Keep the private VPS Supabase locked down by default. Public policies should
-- be added only when a server-side API or controlled anon access is configured.

with store_upsert as (
  insert into web_factory.stores (slug, name, tagline, description, currency, status, raw)
  values (
    'nuvia',
    'Nuvia',
    'Everything for everyone',
    'Nuvia reune productos utiles para todos los dias y empieza con una rutina skincare simple.',
    'BOB',
    'draft',
    '{"source":"web-factory/data/clients/nuvia.json","checkout_mode":"quote_only"}'::jsonb
  )
  on conflict (slug) do update set
    name = excluded.name,
    tagline = excluded.tagline,
    description = excluded.description,
    currency = excluded.currency,
    raw = web_factory.stores.raw || excluded.raw,
    updated_at = now()
  returning id
),
store_ref as (
  select id from store_upsert
  union all
  select id from web_factory.stores where slug = 'nuvia'
  limit 1
)
insert into web_factory.products (
  store_id, slug, title, short_title, brand, category, size, routine_step,
  routine_label, price_label, price_value, currency, stock_status, active,
  featured, discount_percent, description, usage_notes, benefits, ideal_for,
  ingredients, image_path, image_alt, sort_order, raw
)
select
  store_ref.id,
  product.slug,
  product.title,
  product.short_title,
  product.brand,
  product.category,
  product.size,
  product.routine_step,
  product.routine_label,
  'Consultar precio',
  null,
  'BOB',
  'quote_only',
  true,
  true,
  10,
  product.description,
  product.usage_notes,
  product.benefits,
  product.ideal_for,
  product.ingredients,
  product.image_path,
  product.image_alt,
  product.sort_order,
  product.raw
from store_ref
cross join (
  values
    (
      'isdin-fusion-water-magic-spf-50',
      'ISDIN Fusion Water Magic SPF 50',
      'ISDIN Fusion Water SPF 50',
      'ISDIN',
      'Proteccion solar',
      '50 ml',
      2,
      'Paso 2: proteger',
      'Fotoprotector facial diario de textura ligera, acabado no graso y proteccion alta para acompanar la rutina urbana.',
      'Aplicar por la manana como ultimo paso de la rutina y reaplicar segun exposicion solar.',
      array['Alta proteccion SPF 50','Textura ligera de uso diario','Acabado no graso','No comedogenico']::text[],
      array['Uso diario','Rutina de manana','Proteccion urbana']::text[],
      array['Hyaluronic Acid','Vitamin E','Mediterranean Algae Extract']::text[],
      'assets/isdin-fusion-water-display.png',
      'ISDIN Fusion Water Magic SPF 50 en envase azul claro',
      20,
      '{"source":"official ISDIN reference","medical_notice":"No reemplaza consulta dermatologica."}'::jsonb
    ),
    (
      'svr-sebiaclear-gel-moussant',
      'SVR Sebiaclear Gel Moussant',
      'SVR Sebiaclear Gel',
      'SVR',
      'Limpieza facial',
      '200 ml',
      1,
      'Paso 1: limpiar',
      'Gel limpiador para rostro y cuerpo, pensado para piel mixta, grasa, sensible o con tendencia acneica.',
      'Usar sobre piel humeda, masajear suavemente y enjuagar. Evitar contacto directo con los ojos.',
      array['Sin jabon','Sin sulfatos','Ayuda a purificar poros','Limpieza sin resecar']::text[],
      array['Piel mixta','Piel grasa','Piel sensible con tendencia acneica']::text[],
      array['Salicylic Acid','Gluconolactone','Glycerin']::text[],
      'assets/svr-sebiaclear-200ml-display.png',
      'SVR Sebiaclear Gel Moussant en tubo verde de 200 ml',
      10,
      '{"source":"official SVR reference","medical_notice":"No reemplaza consulta dermatologica."}'::jsonb
    )
) as product(
  slug, title, short_title, brand, category, size, routine_step, routine_label,
  description, usage_notes, benefits, ideal_for, ingredients, image_path,
  image_alt, sort_order, raw
)
on conflict (store_id, slug) do update set
  title = excluded.title,
  short_title = excluded.short_title,
  brand = excluded.brand,
  category = excluded.category,
  size = excluded.size,
  routine_step = excluded.routine_step,
  routine_label = excluded.routine_label,
  price_label = excluded.price_label,
  currency = excluded.currency,
  stock_status = excluded.stock_status,
  active = excluded.active,
  featured = excluded.featured,
  discount_percent = excluded.discount_percent,
  description = excluded.description,
  usage_notes = excluded.usage_notes,
  benefits = excluded.benefits,
  ideal_for = excluded.ideal_for,
  ingredients = excluded.ingredients,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  sort_order = excluded.sort_order,
  raw = web_factory.products.raw || excluded.raw,
  updated_at = now();

with store_ref as (
  select id from web_factory.stores where slug = 'nuvia'
),
section_seed as (
  select *
  from (
    values
      ('destacados-del-mes', 'Destacados', 'Productos destacados del mes', 'Productos activos con 10% de descuento comunicado en vitrina.', 10),
      ('rutina-skincare', 'Rutina', 'Rutina skincare simple', 'Paso 1 limpiar y paso 2 proteger, lista para ampliar con nuevos productos.', 20),
      ('proteccion-solar', 'Categoria', 'Proteccion solar', 'Productos para uso diario y proteccion urbana.', 30),
      ('limpieza-facial', 'Categoria', 'Limpieza facial', 'Limpiadores para preparar la piel antes de proteger.', 40)
  ) as section(slug, label, title, description, sort_order)
)
insert into web_factory.product_sections (store_id, slug, label, title, description, sort_order)
select store_ref.id, section_seed.slug, section_seed.label, section_seed.title, section_seed.description, section_seed.sort_order
from store_ref, section_seed
on conflict (store_id, slug) do update set
  label = excluded.label,
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order,
  active = true,
  updated_at = now();

with target as (
  select
    section.id as section_id,
    product.id as product_id,
    case
      when section.slug = 'rutina-skincare' then coalesce(product.routine_step, product.sort_order)
      else product.sort_order
    end as sort_order
  from web_factory.stores store
  join web_factory.product_sections section on section.store_id = store.id
  join web_factory.products product on product.store_id = store.id
  where store.slug = 'nuvia'
    and (
      section.slug in ('destacados-del-mes', 'rutina-skincare')
      or lower(section.slug) = lower(replace(product.category, ' ', '-'))
    )
)
insert into web_factory.product_section_items (section_id, product_id, sort_order)
select section_id, product_id, sort_order from target
on conflict (section_id, product_id) do update set
  sort_order = excluded.sort_order;

insert into web_factory.product_media (product_id, src, alt, label, sort_order)
select product.id, product.image_path, product.image_alt, 'Producto principal', 10
from web_factory.stores store
join web_factory.products product on product.store_id = store.id
where store.slug = 'nuvia'
on conflict (product_id, src) do update set
  alt = excluded.alt,
  label = excluded.label,
  sort_order = excluded.sort_order;

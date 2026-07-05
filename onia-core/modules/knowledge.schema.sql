-- ONIA Knowledge Module base schema draft.
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_knowledge_*. Depende de tablas del core (organization/member/
-- document) por referencia logica; no las redefine.

-- Capability: knowledge_base ---------------------------------------------------

create table if not exists onia_knowledge_categories (
  id text primary key,
  organization_id text not null,
  name text not null,
  parent_id text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name, parent_id)
);

create index if not exists onia_knowledge_categories_parent_idx
  on onia_knowledge_categories (organization_id, parent_id, active);

create table if not exists onia_knowledge_articles (
  id text primary key,
  organization_id text not null,
  title text not null,
  body text not null,
  status text not null default 'draft',
  author_id text not null,
  category_id text,
  tags jsonb not null default '[]'::jsonb,
  related_entity_type text,
  related_entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_knowledge_articles_status_idx
  on onia_knowledge_articles (organization_id, status, created_at desc);

create index if not exists onia_knowledge_articles_category_idx
  on onia_knowledge_articles (organization_id, category_id);

create index if not exists onia_knowledge_articles_related_idx
  on onia_knowledge_articles (organization_id, related_entity_type, related_entity_id);

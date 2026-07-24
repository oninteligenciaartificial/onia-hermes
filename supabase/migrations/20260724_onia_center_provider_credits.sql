-- ONIA Center — Balance de créditos de proveedores generativos (Fase 3 Estudio de Contenido).
-- Vuelve REAL el balance Higgsfield que el panel mostraba hardcodeado (2354.22 cr / plan ultra).
-- Contrato: una fila por PROVEEDOR (provider unique). Una sesión Claude Code con el MCP de
-- Higgsfield lee el balance vivo y corre higgsfield-balance-sync.mjs (UPSERT PostgREST) para
-- escribir esta fila; el panel LEE (getHiggsfieldBalance en live-runtime). raw guarda el payload
-- crudo del proveedor por si sumamos más campos sin re-migrar. Aplicado 2026-07-24.

create table if not exists onia_center.provider_credits (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,               -- 'higgsfield', y a futuro otros motores
  credits numeric(12, 2) not null default 0,   -- balance real de créditos
  plan text,                                    -- plan del proveedor ('ultra', etc.); null si no aplica
  synced_at timestamptz not null default now(), -- cuándo se leyó el balance del proveedor
  raw jsonb not null default '{}'::jsonb,       -- payload crudo del proveedor
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_provider_credits_updated_at on onia_center.provider_credits;
create trigger trg_onia_center_provider_credits_updated_at
before update on onia_center.provider_credits
for each row execute function onia_center.touch_updated_at();

alter table onia_center.provider_credits enable row level security;
grant select, insert, update, delete on onia_center.provider_credits to service_role;

-- Refrescar el cache de esquema de PostgREST para exponer la tabla vía REST.
notify pgrst, 'reload schema';

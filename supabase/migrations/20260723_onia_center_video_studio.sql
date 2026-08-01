-- ONIA Center — Estudio de Contenido (sistema de video).
-- Contrato de datos para el pipeline de video ONIA (ver-videos + editor-videos):
-- una fila por PIEZA de video en video_projects, y el GATE de cortes reusa la cola
-- de aprobacion generica review_queue (nuevo source_type 'video_cut', detalle en raw).
-- El panel LEE (getVideoProjects / getVideoCutReviews); el pipeline (sesion Claude Code)
-- ESCRIBE. REGLA DE ORO: el corte solo se aplica tras aprobar la review 'video_cut'.
-- NADA de render corre en el VPS (RAM al limite): el render es LOCAL. Aplicado 2026-07-23.

create table if not exists onia_center.video_projects (
  id uuid primary key default gen_random_uuid(),
  video_key text not null unique,
  title text not null,
  lane text not null default 'onia' check (lane in ('client', 'onia', 'sergio')),
  status text not null default 'intake' check (
    status in ('intake', 'transcribing', 'cut_review', 'approved', 'rendering', 'captioning', 'ready', 'published', 'blocked')
  ),
  owner_role_key text references onia_center.roles(role_key) on delete set null,
  format text not null default 'vertical' check (format in ('vertical', 'horizontal', 'square')),
  duration_seconds numeric(10, 2) not null default 0,   -- crudo
  final_seconds numeric(10, 2),                          -- tras el corte (null hasta cortar)
  model text not null default 'free' check (model in ('free', 'higgsfield')),
  credits_est numeric(10, 2) not null default 0,         -- creditos Higgsfield estimados (0 = gratis)
  source_url text,        -- crudo recibido/bajado
  preview_url text,       -- preview 360p del corte propuesto (para la regla de oro)
  render_url text,        -- final.mp4
  thumbnail_url text,
  transcript_ref text,    -- ruta/ref del transcript con timestamps
  cut_plan_ref text,      -- ruta/ref del cutplan.json
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_video_projects_updated_at on onia_center.video_projects;
create trigger trg_onia_center_video_projects_updated_at
before update on onia_center.video_projects
for each row execute function onia_center.touch_updated_at();

create index if not exists idx_onia_center_video_projects_status
  on onia_center.video_projects (status, updated_at desc);

alter table onia_center.video_projects enable row level security;
grant select, insert, update, delete on onia_center.video_projects to service_role;

-- Gate de cortes = reusar review_queue: agregar 'video_cut' al CHECK de source_type.
-- (constraint inline auto-nombrada review_queue_source_type_check).
alter table onia_center.review_queue drop constraint if exists review_queue_source_type_check;
alter table onia_center.review_queue add constraint review_queue_source_type_check check (
  source_type in ('collab_ingestion', 'deliverable', 'lead', 'project', 'expense', 'premium', 'video_cut')
);

-- Refrescar el cache de esquema de PostgREST para exponer la tabla via REST.
notify pgrst, 'reload schema';

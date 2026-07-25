-- ONIA Center — Chatbot propio de ONIA (el que atiende "DEMO").
-- Contrato de datos del embudo comercial conversacional: una fila por CONVERSACION en
-- bot_conversations (maquina de estados del embudo) y una fila APPEND-ONLY por mensaje en
-- bot_messages (evidencia ante Meta + dedup + material del probador).
-- El LEAD del CRM sigue viviendo en onia_center.leads (ya existe): la conversacion apunta a el
-- via lead_key y el lead se crea RECIEN al calificar, no al primer "hola".
-- El HANDOFF reusa la cola generica review_queue (source_type 'lead' ya esta en el CHECK).
-- REGLA DE ORO: si human_took_over = true, el bot NO vuelve a hablar en esa conversacion.
-- El bot ESCRIBE (n8n/service_role); el panel LEE. NADA de LLM corre en el VPS.
-- Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§4.5).

create table if not exists onia_center.bot_conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_key text not null unique,          -- '<channel>:<contact_ref>'
  channel text not null default 'sim' check (
    channel in ('sim', 'telegram', 'whatsapp', 'instagram')
  ),
  contact_ref text not null,                      -- chat_id (telegram) | wa_id ult. 8 digitos | ig id
  display_name text,
  bot_stage text not null default 'nuevo' check (
    bot_stage in ('nuevo', 'esperando_calificacion', 'calificado', 'esperando_horario',
                  'demo_agendada', 'demo_realizada', 'handoff_humano', 'descartado', 'opt_out')
  ),
  piece_key text,                                 -- pieza que lo trajo: 'lucia-d03-reel-siat'
  source_campaign text,                           -- 'lucia-dentalgest-jul2026'
  qualification jsonb not null default '{}'::jsonb,  -- {ownsClinic, chairs, city, painPoint}
  slots_offered jsonb not null default '[]'::jsonb,  -- [{key:'A',label:'jue 31/07 15:00',startAt:'...'}]
  scheduled_at timestamptz,                       -- demo agendada (null hasta agendar)
  calendar_event_id text,                         -- id del evento en Google Calendar
  lead_key text references onia_center.leads(lead_key) on delete set null,
  owner_role_key text references onia_center.roles(role_key),   -- destino del handoff (hoy 'sergio')
  human_took_over boolean not null default false, -- true = el bot se calla. NUNCA vuelve solo a false
  human_took_over_at timestamptz,
  opt_in_at timestamptz,
  opt_in_source text check (opt_in_source in ('inbound_demo', 'explicit_consent')),
  opt_out_at timestamptz,
  followup_step integer not null default 0,       -- 0 = ninguno enviado. CAS: 0 -> 1, una sola vez
  off_script_count integer not null default 0,    -- 2 = handoff automatico
  last_inbound_at timestamptz,
  last_outbound_at timestamptz,
  raw jsonb not null default '{}'::jsonb,         -- {qualifyAsks, outboundSeq, ...} contadores del motor
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_bot_conversations_updated_at on onia_center.bot_conversations;
create trigger trg_onia_center_bot_conversations_updated_at
before update on onia_center.bot_conversations
for each row execute function onia_center.touch_updated_at();

-- Barrido del follow-up: "activas, sin humano, sin opt-out, con paso 0 y sin actividad reciente".
create index if not exists idx_onia_center_bot_conversations_followup
  on onia_center.bot_conversations (followup_step, last_inbound_at)
  where human_took_over = false and opt_out_at is null;

create index if not exists idx_onia_center_bot_conversations_stage
  on onia_center.bot_conversations (bot_stage, updated_at desc);

create index if not exists idx_onia_center_bot_conversations_piece
  on onia_center.bot_conversations (source_campaign, piece_key);

alter table onia_center.bot_conversations enable row level security;
grant select, insert, update, delete on onia_center.bot_conversations to service_role;

-- Bitacora append-only (mismo patron que onia_center.audit_logs: solo created_at, sin trigger).
-- message_key es el DEDUP: si Telegram/Meta reentregan el mismo update, el insert choca y no pasa nada.
create table if not exists onia_center.bot_messages (
  id uuid primary key default gen_random_uuid(),
  message_key text not null unique,               -- '<channel>:<external_message_id>' | 'out:<uuid>'
  conversation_key text not null
    references onia_center.bot_conversations(conversation_key) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  author text not null default 'bot' check (author in ('contact', 'bot', 'human')),
  body text not null,
  template_key text,                              -- 'M0' | 'M1b' | 'M4' | 'llm_freeform' | null
  reply_source text not null default 'script' check (reply_source in ('script', 'llm', 'human')),
  stage_before text,
  stage_after text,
  guardrail_ok boolean not null default true,
  guardrail_violations text[] not null default '{}'::text[],
  delivery_status text not null default 'simulated' check (
    delivery_status in ('simulated', 'skipped', 'sent', 'failed')
  ),
  external_message_id text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_onia_center_bot_messages_conversation
  on onia_center.bot_messages (conversation_key, created_at desc);

create index if not exists idx_onia_center_bot_messages_guardrail
  on onia_center.bot_messages (guardrail_ok, created_at desc)
  where guardrail_ok = false;

alter table onia_center.bot_messages enable row level security;
grant select, insert on onia_center.bot_messages to service_role;

-- Refrescar el cache de esquema de PostgREST para exponer las tablas via REST.
notify pgrst, 'reload schema';

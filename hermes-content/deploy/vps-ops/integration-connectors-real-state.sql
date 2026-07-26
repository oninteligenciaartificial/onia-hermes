-- ONIA Center — estado REAL de las integraciones. Solo se marca 'connected' lo verificado en vivo
-- (contenedor healthy + consumo real). Lo que de verdad falta queda config_pending/planned/blocked.
\set ON_ERROR_STOP on
set client_encoding to 'UTF8';
begin;

-- Supabase: el panel entero corre sobre este Supabase (schema onia_center, service role server-side).
update onia_center.integration_connectors set
  status = 'connected',
  current_state = 'El panel ONIA Center corre sobre este Supabase (schema onia_center, service role server-side). Migraciones y seeds aplicados.',
  next_action = 'Operativo. Pendiente: Auth/RLS multiusuario para abrir a más roles.',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('verified_live', true, 'verified_at', '2026-07-22')
where connector_key = 'supabase_onia_center';

-- n8n: corre en el VPS con los workflows de los agentes (cron/SSH) vivos.
update onia_center.integration_connectors set
  status = 'connected',
  current_state = 'n8n corre en el VPS (contenedor vivo) y dispara los agentes por cron/SSH. Workflows operativos.',
  next_action = 'Operativo. Ampliar cobertura de workflows según se necesite.',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('verified_live', true, 'verified_at', '2026-07-22')
where connector_key = 'n8n_ops';

-- Cal.com: producción activa (cal.onia.com.bo/onia), contenedor healthy hace semanas.
update onia_center.integration_connectors set
  status = 'connected',
  current_state = 'Cal.com self-hosted en producción (cal.onia.com.bo/onia); contenedor healthy. Ventanas y tipos de evento definidos.',
  next_action = 'Operativo. Conectar BOOKING_CREATED → n8n → CRM para registrar reservas automáticamente.',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('verified_live', true, 'verified_at', '2026-07-22')
where connector_key = 'cal_booking';

-- LiteLLM: gateway self-hosted vivo (healthy); Prospector y Radar YT lo consumen.
update onia_center.integration_connectors set
  status = 'connected',
  current_state = 'LiteLLM self-hosted vivo (healthy). El Prospector y el Radar YT lo consumen para enriquecer/destilar a bajo costo.',
  next_action = 'Operativo. Definir modelos permitidos y límites de gasto por centro.',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('verified_live', true, 'verified_at', '2026-07-22')
where connector_key = 'litellm_gateway';

-- Speaches (STT self-hosted): vivo (healthy) pero sin fila. Se inserta para reflejar la realidad.
insert into onia_center.integration_connectors
  (connector_key, connector_name, provider, category, status, self_hosted, route,
   required_env, optional_env, current_state, prepared, missing, next_action, safety_rule, docs,
   visibility_scope, priority, raw)
values
(
  'speaches_stt', 'Speaches STT', 'Speaches (self-hosted)', 'ai', 'connected', true, null,
  '["SPEACHES_BASE_URL"]'::jsonb, '[]'::jsonb,
  'Servicio de transcripción de voz (STT) self-hosted vivo en el VPS (contenedor healthy).',
  '["Contenedor STT desplegado","Uso interno de voz a texto"]'::jsonb,
  '[]'::jsonb,
  'Operativo. Conectar entradas de voz (notas/ideas) cuando se necesite transcripción.',
  'Uso interno; no expone audio ni transcripciones a terceros.',
  '[]'::jsonb,
  'internal_restricted', 'baja',
  jsonb_build_object('verified_live', true, 'verified_at', '2026-07-22')
)
on conflict (connector_key) do update set
  status = excluded.status,
  current_state = excluded.current_state,
  next_action = excluded.next_action,
  raw = coalesce(onia_center.integration_connectors.raw, '{}'::jsonb) || excluded.raw,
  updated_at = now();

commit;

select connector_key, category, status, priority
from onia_center.integration_connectors
order by (status='connected') desc, category, connector_key;

-- ONIA Center — estado REAL de los agentes operativos.
-- Contrato panel: live = status='ready' + raw.live=true + raw.cadence_label.
-- Merge de raw (||) para preservar last_run que escriben los runtimes.
\set ON_ERROR_STOP on
set client_encoding to 'UTF8';
begin;

-- ===================== VIVOS (reclasificar existentes) =====================
-- Contenido (Lun-Sáb, escribe borradores al panel). Preserva last_run.
update onia_center.operating_agents set
  status = 'ready',
  cadence = 'daily',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('live', true, 'cadence_label', 'Lun a Sáb', 'channel', 'panel')
where agent_key = 'agent_content_media';

-- Finanzas (Lun-Sáb, escribe finance_summary + anomalías al panel). Preserva last_run.
update onia_center.operating_agents set
  status = 'ready',
  cadence = 'daily',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('live', true, 'cadence_label', 'Lun a Sáb', 'channel', 'panel')
where agent_key = 'agent_finance_fund';

-- Vendedor (Lun-Sáb). Alinea nombre/misión al rol real y limpia el last_prospector_run
-- que el Prospector escribía en esta fila (ahora vive en agent_prospector).
update onia_center.operating_agents set
  status = 'ready',
  cadence = 'daily',
  agent_name = 'Agente Vendedor',
  mission = 'Proponer qué leads, llamadas, demos y seguimientos ejecutar; deja cada propuesta en la cola de aprobación de Sergio.',
  raw = jsonb_build_object('live', true, 'cadence_label', 'Lun a Sáb', 'channel', 'panel')
where agent_key = 'agent_sales_crm';

-- ===================== NO-WIRED (honestos a 'planned') =====================
update onia_center.operating_agents set
  status = 'planned',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('live', false, 'cadence_label', 'Mensual — aún sin cablear', 'channel', 'panel', 'placeholder', true)
where agent_key = 'agent_ceo_monthly';

update onia_center.operating_agents set
  status = 'planned',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('live', false, 'cadence_label', 'Aún sin cablear', 'channel', 'panel', 'placeholder', true)
where agent_key = 'agent_delivery_projects';

-- Agente del Día (agent_calendar_energy): placeholder hasta cablear el generador de plan diario.
update onia_center.operating_agents set
  status = 'planned',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('live', false, 'cadence_label', 'Diario — aún sin cablear', 'channel', 'panel', 'placeholder', true)
where agent_key = 'agent_calendar_energy';

update onia_center.operating_agents set
  status = 'planned',
  raw = coalesce(raw, '{}'::jsonb) || jsonb_build_object('live', false, 'cadence_label', 'Aún sin cablear', 'channel', 'panel', 'placeholder', true)
where agent_key = 'agent_selfhosted_integrations';

-- ===================== NUEVOS VIVOS (insertar filas propias) =====================
insert into onia_center.operating_agents
  (agent_key, agent_name, mission, owner_role_key, visibility_scope, cadence, status,
   monthly_outcome, inputs, outputs, actions, blocked_by, next_action, safety_rule,
   connector_keys, tool_preference, route, raw)
values
(
  'agent_prospector', 'Agente Prospector',
  'Descubrir negocios reales de Bolivia por rubro+ciudad (OpenStreetMap) y dejarlos como prospectos en el CRM, priorizando los que no tienen web.',
  'sergio', 'internal_restricted', 'weekly', 'ready',
  'Flujo constante de prospectos calificados (sin web = candidatos a landing/web/chatbot) listos para que Sergio/Arthur decidan el contacto.',
  '["OpenStreetMap/Overpass","catálogo de servicios","CRM leads"]'::jsonb,
  '["leads nuevos en el CRM","hueco digital detectado","servicio ONIA sugerido"]'::jsonb,
  '["Buscar negocios por rubro+ciudad","Priorizar los que no tienen web","Enriquecer con LiteLLM el servicio que encaja","Insertar como lead Nuevo sin contactar"]'::jsonb,
  '[]'::jsonb,
  'Ampliar rubros/ciudades; el Vendedor redacta el mensaje que Sergio aprueba.',
  'No contacta a nadie; solo surfacea targets públicos comerciales. contact_permission=pending.',
  '["connector-supabase-onia-center","connector-litellm-gateway","connector-n8n-ops"]'::jsonb,
  '["n8n","local_model"]'::jsonb,
  '/onia-center#agentes',
  jsonb_build_object('live', true, 'cadence_label', 'Lun y Jue', 'channel', 'panel',
    'last_run', jsonb_build_object('at', '2026-07-22T15:40:09.431Z', 'city', 'santa_cruz', 'category', 'dental', 'inserted', 8, 'runtime', 'prospector-agent-v1'))
),
(
  'agent_radar_yt', 'Agente Radar YT',
  'Detectar tendencias de YouTube (yt-dlp) en los pilares de ONIA y destilar ideas de contenido como borradores en el panel.',
  'sergio', 'internal_restricted', 'weekly', 'ready',
  'Cola de ideas de contenido frescas basadas en lo que funciona en YouTube, listas para revisar y aprobar.',
  '["YouTube (yt-dlp)","pilares de captación ONIA","LiteLLM"]'::jsonb,
  '["ideas de contenido en idea_inbox","tendencias por nicho"]'::jsonb,
  '["Harvest de YouTube por query","Destilar 3-6 ideas con LiteLLM","Dejar como borradores en idea_inbox"]'::jsonb,
  '[]'::jsonb,
  'Ampliar nichos/queries; conectar ideas aprobadas al Agente de Contenido.',
  'Cero costo (yt-dlp + LiteLLM self-hosted); no genera video/imágenes ni publica.',
  '["connector-supabase-onia-center","connector-litellm-gateway","connector-n8n-ops"]'::jsonb,
  '["n8n","local_model"]'::jsonb,
  '/onia-center#ideas',
  jsonb_build_object('live', true, 'cadence_label', 'Miércoles', 'channel', 'panel',
    'last_run', jsonb_build_object('at', '2026-07-22T16:47:41.867Z', 'runtime', 'radar-yt-agent-v1'))
),
(
  'agent_weekly_digest', 'Digest semanal',
  'Agregar en un solo mensaje la actividad de la semana del panel (leads, ideas y borradores por revisar, caja) y enviarlo a Sergio por Telegram.',
  'sergio', 'sergio_private', 'weekly', 'ready',
  'Un resumen semanal claro que reemplaza los pings sueltos de los agentes; Sergio ve todo lo pendiente de aprobar en un mensaje.',
  '["leads","idea_inbox","review_queue","finance_summary"]'::jsonb,
  '["resumen semanal a Telegram","conteo de pendientes por aprobar"]'::jsonb,
  '["Contar leads nuevos/abiertos","Contar ideas y borradores pendientes","Resumir anomalías de caja","Enviar 1 mensaje a Telegram"]'::jsonb,
  '[]'::jsonb,
  'Mantener como resumen único de control; nada se publica.',
  'Read-only; determinista; no toca datos ni publica sin OK de Sergio.',
  '["connector-supabase-onia-center","connector-n8n-ops"]'::jsonb,
  '["n8n"]'::jsonb,
  '/onia-center#agentes',
  jsonb_build_object('live', true, 'cadence_label', 'Domingo', 'channel', 'telegram')
),
(
  'agent_auditor', 'Agente Auditor de código',
  'Auditar el repositorio (calidad y deuda técnica) y reportar a Sergio por Telegram, dejando el repo como fuente y cero costo.',
  'sergio', 'internal_restricted', 'weekly', 'ready',
  'Revisión periódica del código que surfacea deuda técnica y mejoras, sin costo, con el repo como fuente.',
  '["repositorio","GitHub Actions"]'::jsonb,
  '["reporte de auditoría","hallazgos de deuda técnica"]'::jsonb,
  '["Escanear el repo","Priorizar hallazgos","Reportar a Telegram"]'::jsonb,
  '[]'::jsonb,
  'Conectar hallazgos priorizados a idea_inbox (categoría operación).',
  'Cero costo; read-only sobre el repo; no modifica código sin aprobación.',
  '["connector-n8n-ops"]'::jsonb,
  '["local_model","manual"]'::jsonb,
  '/onia-center#agentes',
  jsonb_build_object('live', true, 'cadence_label', 'Semanal (GitHub Actions)', 'channel', 'telegram')
)
on conflict (agent_key) do update set
  agent_name = excluded.agent_name,
  mission = excluded.mission,
  owner_role_key = excluded.owner_role_key,
  visibility_scope = excluded.visibility_scope,
  cadence = excluded.cadence,
  status = excluded.status,
  monthly_outcome = excluded.monthly_outcome,
  inputs = excluded.inputs,
  outputs = excluded.outputs,
  actions = excluded.actions,
  blocked_by = excluded.blocked_by,
  next_action = excluded.next_action,
  safety_rule = excluded.safety_rule,
  connector_keys = excluded.connector_keys,
  tool_preference = excluded.tool_preference,
  route = excluded.route,
  raw = coalesce(onia_center.operating_agents.raw, '{}'::jsonb) || excluded.raw,
  updated_at = now();

commit;

-- Verificación
select agent_key, agent_name, cadence, status,
       raw->>'live' as live, raw->>'cadence_label' as cadence_label, raw->>'channel' as channel,
       raw#>>'{last_run,at}' as last_run_at
from onia_center.operating_agents order by (raw->>'live')::boolean desc nulls last, agent_key;

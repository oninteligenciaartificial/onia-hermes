-- ONIA Center operating core seed.
-- DML only. No private secrets, no client credentials and no financial percentages
-- beyond the already approved operating rules in the base schema.

insert into onia_center.organizations (
  organization_key,
  organization_name,
  organization_kind,
  visibility_scope,
  owner_role_key,
  status,
  active_modules,
  operating_rule,
  raw
)
values
  (
    'onia',
    'ONIA',
    'internal',
    'sergio_private',
    'sergio',
    'active',
    '["crm","projects","tasks","sales","finance","collab_review","adapters"]'::jsonb,
    'Empresa interna. Contiene datos sensibles y no se comparte con colaboradores.',
    '{"source":"onia-center operating core"}'::jsonb
  ),
  (
    'onia_collab',
    'ONIA Collab Intake',
    'collab',
    'collab_safe',
    'sergio',
    'setup',
    '["lead_intake","briefs","tasks","content","bolivian_notes","review_queue"]'::jsonb,
    'Solo aportes saneados. No finanzas, credenciales, acuerdos privados ni estrategia familiar.',
    '{"source_repo":"onia-hermes-collab"}'::jsonb
  ),
  (
    'bolivian_electric',
    'Bolivian Electric',
    'client',
    'client_workspace',
    'sergio',
    'setup',
    '["crm","processes","interviews","tr4_adapter","inventory_camera","content","sales","warehouse","accounting","imports","roadmap"]'::jsonb,
    'Cliente con modulo propio construido sobre base reusable. TR4 queda como adaptador externo.',
    '{"source":"ONIA_SYSTEM_PORTFOLIO_ARCHITECTURE_2026.md"}'::jsonb
  )
on conflict (organization_key) do update set
  organization_name = excluded.organization_name,
  organization_kind = excluded.organization_kind,
  visibility_scope = excluded.visibility_scope,
  owner_role_key = excluded.owner_role_key,
  status = excluded.status,
  active_modules = excluded.active_modules,
  operating_rule = excluded.operating_rule,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.user_profiles (
  user_key,
  display_name,
  primary_role_key,
  status,
  access_note,
  raw
)
values
  (
    'sergio',
    'Sergio',
    'sergio',
    'active',
    'Acceso completo privado: estrategia, caja, aprobaciones, auditoria y configuracion.',
    '{"private_owner":true}'::jsonb
  ),
  (
    'arthur',
    'Arthur',
    'arthur',
    'active',
    'Colaborador en prueba. Solo tareas, aportes, leads, briefs y entregables revisables.',
    '{"collaborator":true,"source_repo":"onia-hermes-collab"}'::jsonb
  )
on conflict (user_key) do update set
  display_name = excluded.display_name,
  primary_role_key = excluded.primary_role_key,
  status = excluded.status,
  access_note = excluded.access_note,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.organization_memberships (
  organization_key,
  user_key,
  role_key,
  permission_scope,
  can_view_sensitive,
  status,
  raw
)
values
  ('onia', 'sergio', 'sergio', 'sergio_private', true, 'active', '{"source":"owner"}'::jsonb),
  ('onia_collab', 'arthur', 'arthur', 'collab_safe', false, 'active', '{"source":"collab"}'::jsonb),
  ('onia', 'arthur', 'arthur', 'internal_restricted', false, 'active', '{"source":"limited collaborator"}'::jsonb)
on conflict (organization_key, user_key) do update set
  role_key = excluded.role_key,
  permission_scope = excluded.permission_scope,
  can_view_sensitive = excluded.can_view_sensitive,
  status = excluded.status,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.clients (
  organization_key,
  client_key,
  client_name,
  industry,
  city,
  status,
  owner_role_key,
  sensitivity,
  raw
)
values
  (
    'onia',
    'onia_internal',
    'ONIA interno',
    'operacion interna',
    'Bolivia',
    'active',
    'sergio',
    'private',
    '{}'::jsonb
  ),
  (
    'bolivian_electric',
    'bolivian_electric',
    'Bolivian Electric',
    'importadora/distribuidora electrica',
    'Bolivia',
    'lead',
    'sergio',
    'sensitive',
    '{"tr4":"external_adapter_only"}'::jsonb
  )
on conflict (client_key) do update set
  organization_key = excluded.organization_key,
  client_name = excluded.client_name,
  industry = excluded.industry,
  city = excluded.city,
  status = excluded.status,
  owner_role_key = excluded.owner_role_key,
  sensitivity = excluded.sensitivity,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.projects (
  organization_key,
  client_key,
  project_key,
  project_name,
  product_line,
  status,
  priority,
  owner_role_key,
  private_strategy,
  description,
  next_step,
  active_modules,
  raw
)
values
  (
    'onia',
    'onia_internal',
    'onia_center',
    'ONIA Center',
    'onia_center',
    'active',
    'alta',
    'sergio',
    true,
    'Sistema operativo interno para ejecutar, registrar y mostrar la operacion ONIA.',
    'Completar core de organizaciones, usuarios, proyectos, tareas, revision y adaptadores.',
    '["dashboard","crm","tasks","projects","collab_review","audit","adapters"]'::jsonb,
    '{"repo_strategy":"build inside onia-hermes now, split later"}'::jsonb
  ),
  (
    'onia',
    null,
    'dentagest',
    'DentalGest',
    'dentagest',
    'active',
    'media',
    'sergio',
    false,
    'Vertical dental separado. ONIA Center solo gestiona seguimiento interno y ventas.',
    'Registrar tareas comerciales y soporte sin mezclar logica clinica dentro de ONIA Center.',
    '["crm","tasks","sales","support"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'onia',
    null,
    'gestios',
    'GestiOS',
    'gestios',
    'planning',
    'media',
    'sergio',
    false,
    'Base reusable de operaciones para pymes, sin duplicar verticales.',
    'Alinear modulos comunes con ONIA Center: CRM, tareas, usuarios, permisos y reportes.',
    '["crm","tasks","inventory","reports"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'onia',
    null,
    'webs_onia',
    'Webs ONIA / Web Factory',
    'webs',
    'active',
    'alta',
    'sergio',
    false,
    'Landing, paginas y web profesional con limites claros antes de convertirse en sistema.',
    'Unificar leads, diagnosticos y alcance desde ONIA Center.',
    '["crm","briefs","delivery","evidence"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'onia',
    null,
    'chatbots',
    'Chatbots y asistentes',
    'chatbots',
    'planning',
    'media',
    'sergio',
    false,
    'WhatsApp, Telegram y asistentes con aprobaciones y alcance antes de automatizar.',
    'Definir paquetes y checklist de evidencia antes de vender produccion.',
    '["crm","knowledge","adapters","support"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'onia',
    null,
    'automations',
    'Automatizaciones',
    'automations',
    'planning',
    'media',
    'sergio',
    false,
    'n8n, recordatorios, integraciones y flujos con humano responsable.',
    'Registrar flujos como adaptadores con costos, riesgo y aprobacion.',
    '["adapters","tasks","audit","reports"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'bolivian_electric',
    'bolivian_electric',
    'bolivian_electric_os',
    'Bolivian Electric OS',
    'bolivian',
    'planning',
    'alta',
    'sergio',
    true,
    'Sistema operativo interno sobre base reusable para mejorar TR4, ventas, inventario, contenido y procesos.',
    'Fase 0: auditar TR4, procesos, entrevistas y datos exportables antes de prometer integracion.',
    '["processes","interviews","tr4_adapter","stockcam","content","sales","warehouse","accounting","imports","roadmap"]'::jsonb,
    '{"tr4":"external_adapter_only"}'::jsonb
  ),
  (
    'onia',
    null,
    'content_onia',
    'Contenido ONIA',
    'content',
    'active',
    'media',
    'sergio',
    false,
    'Ideas, carruseles, guiones, videos y campanas con revision antes de publicar.',
    'Separar contenido publico de informacion interna y datos de clientes.',
    '["content","approval","knowledge","calendar"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'onia',
    null,
    'stockcam',
    'StockCam / Inventario con camara',
    'stockcam',
    'planning',
    'media',
    'sergio',
    false,
    'Modulo reusable para conteo, evidencia visual, ubicacion, QR/codigo y diferencias.',
    'Definir MVP de captura y exportacion CSV antes de integrarlo con TR4.',
    '["inventory_camera","exports","audit","mobile"]'::jsonb,
    '{}'::jsonb
  )
on conflict (project_key) do update set
  organization_key = excluded.organization_key,
  client_key = excluded.client_key,
  project_name = excluded.project_name,
  product_line = excluded.product_line,
  status = excluded.status,
  priority = excluded.priority,
  owner_role_key = excluded.owner_role_key,
  private_strategy = excluded.private_strategy,
  description = excluded.description,
  next_step = excluded.next_step,
  active_modules = excluded.active_modules,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.project_modules (
  project_key,
  module_key,
  module_name,
  module_type,
  status,
  reusable_core,
  note,
  raw
)
values
  ('bolivian_electric_os', 'processes_interviews', 'Procesos e entrevistas', 'processes', 'planned', true, 'Mapea areas, responsables, bloqueos y flujo real antes de automatizar.', '{}'::jsonb),
  ('bolivian_electric_os', 'tr4_adapter', 'TR4 Adapter', 'adapter', 'blocked', false, 'TR4 es externo. Solo export/import manual hasta auditoria y permiso.', '{}'::jsonb),
  ('bolivian_electric_os', 'stockcam_inventory', 'Inventario camara / StockCam', 'inventory_camera', 'planned', true, 'Conteo, foto, ubicacion, diferencias y exportacion.', '{}'::jsonb),
  ('bolivian_electric_os', 'commercial_content', 'Contenido comercial', 'content', 'planned', true, 'Ideas, guiones y piezas aprobadas sin exponer informacion sensible.', '{}'::jsonb),
  ('onia_center', 'collab_ingestion', 'Ingestion desde onia-hermes-collab', 'adapter', 'in_progress', true, 'Aportes entran como cola de revision, no directo al sistema privado.', '{}'::jsonb)
on conflict (project_key, module_key) do update set
  module_name = excluded.module_name,
  module_type = excluded.module_type,
  status = excluded.status,
  reusable_core = excluded.reusable_core,
  note = excluded.note,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.tasks (
  task_key,
  project_key,
  title,
  task_type,
  status,
  priority,
  assigned_role_key,
  reviewer_role_key,
  evidence_required,
  sensitive,
  source_system,
  due_label,
  raw
)
values
  ('core_auth_rls', 'onia_center', 'Definir Auth, memberships y RLS real para onia-center', 'system', 'todo', 'alta', 'sergio', 'sergio', true, true, 'onia-center', 'Fase 1', '{}'::jsonb),
  ('collab_ingestion', 'onia_center', 'Crear bandeja de ingesta para aportes de onia-hermes-collab', 'review', 'in_progress', 'alta', 'sergio', 'sergio', true, false, 'onia-hermes-collab', 'Fase 1', '{}'::jsonb),
  ('vendedores_merge', 'onia_center', 'Migrar /vendedores para consumir CRM, tareas y comisiones de onia-center', 'system', 'todo', 'alta', 'sergio', 'sergio', true, false, 'onia-center', 'Fase 2', '{}'::jsonb),
  ('bolivian_tr4_discovery', 'bolivian_electric_os', 'Auditar TR4 sin credenciales ni escritura', 'bolivian', 'todo', 'alta', 'sergio', 'sergio', true, true, 'onia-hermes', 'Fase 0 Bolivian', '{}'::jsonb),
  ('bolivian_interviews', 'bolivian_electric_os', 'Preparar entrevistas por area: ventas, almacen, contabilidad, importaciones', 'bolivian', 'todo', 'media', 'arthur', 'sergio', true, false, 'onia-hermes-collab', 'Despues de aprobar brief', '{}'::jsonb),
  ('stockcam_mvp', 'stockcam', 'Definir MVP StockCam: foto, codigo, cantidad, ubicacion y export CSV', 'system', 'todo', 'media', 'sergio', 'sergio', true, false, 'onia-center', 'Fase 2', '{}'::jsonb)
on conflict (task_key) do update set
  project_key = excluded.project_key,
  title = excluded.title,
  task_type = excluded.task_type,
  status = excluded.status,
  priority = excluded.priority,
  assigned_role_key = excluded.assigned_role_key,
  reviewer_role_key = excluded.reviewer_role_key,
  evidence_required = excluded.evidence_required,
  sensitive = excluded.sensitive,
  source_system = excluded.source_system,
  due_label = excluded.due_label,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.collaborators (
  collaborator_key,
  user_key,
  display_name,
  role_key,
  status,
  allowed_work,
  restrictions,
  raw
)
values (
  'arthur',
  'arthur',
  'Arthur',
  'arthur',
  'trial',
  '["leads","briefs","tareas asignadas","contenido","Bolivian permitido","entregables revisables"]'::jsonb,
  '["No ve capital privado","No ve deuda exacta","No aprueba pagos","No aprueba descuentos","No usa TR4 real sin permiso","No pide credenciales","No actua como socio"]'::jsonb,
  '{"source":"onia-hermes-collab"}'::jsonb
)
on conflict (collaborator_key) do update set
  user_key = excluded.user_key,
  display_name = excluded.display_name,
  role_key = excluded.role_key,
  status = excluded.status,
  allowed_work = excluded.allowed_work,
  restrictions = excluded.restrictions,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.deliverables (
  deliverable_key,
  task_key,
  collaborator_key,
  title,
  status,
  evidence_reference,
  reviewed_by_role_key,
  sensitive,
  raw
)
values (
  'collab_ingestion_map',
  'collab_ingestion',
  'arthur',
  'Aportes de collab clasificados para revision',
  'draft',
  'onia-hermes-collab/templates/ingestion-summary.md',
  'sergio',
  false,
  '{}'::jsonb
)
on conflict (deliverable_key) do update set
  task_key = excluded.task_key,
  collaborator_key = excluded.collaborator_key,
  title = excluded.title,
  status = excluded.status,
  evidence_reference = excluded.evidence_reference,
  reviewed_by_role_key = excluded.reviewed_by_role_key,
  sensitive = excluded.sensitive,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.collab_ingestion_items (
  ingestion_key,
  source_repo,
  source_path,
  author_user_key,
  classification,
  sensitivity,
  status,
  summary,
  target_table,
  target_key,
  raw
)
values
  ('lead_template', 'onia-hermes-collab', 'templates/lead-intake.md', 'arthur', 'lead', 'public_safe', 'queued', 'Formato permitido para registrar lead sin secretos ni datos sensibles completos.', 'onia_center.leads', null, '{}'::jsonb),
  ('client_brief', 'onia-hermes-collab', 'templates/client-brief.md', 'arthur', 'brief', 'internal', 'queued', 'Brief de cliente requiere revision antes de entrar a proyecto o base de conocimiento.', 'onia_center.projects', null, '{}'::jsonb),
  ('bolivian_task', 'onia-hermes-collab', 'templates/bolivian-task.md', 'arthur', 'bolivian', 'internal', 'queued', 'Tarea Bolivian permitida solo con contexto redactorizado y sin TR4 real.', 'onia_center.tasks', null, '{}'::jsonb),
  ('blocked_backlog', 'onia-hermes-collab', 'tasks/blocked.md', 'arthur', 'blocker', 'internal', 'queued', 'Bloqueos colaborativos pasan a revision Sergio antes de convertirse en tareas internas.', 'onia_center.review_queue', null, '{}'::jsonb)
on conflict (ingestion_key) do update set
  source_repo = excluded.source_repo,
  source_path = excluded.source_path,
  author_user_key = excluded.author_user_key,
  classification = excluded.classification,
  sensitivity = excluded.sensitivity,
  status = excluded.status,
  summary = excluded.summary,
  target_table = excluded.target_table,
  target_key = excluded.target_key,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.review_queue (
  review_key,
  source_type,
  source_key,
  title,
  priority,
  status,
  reviewer_role_key,
  sensitive,
  raw
)
values
  ('review_collab_leads', 'collab_ingestion', 'lead_template', 'Revisar lead intake antes de importar', 'alta', 'pending', 'sergio', false, '{}'::jsonb),
  ('review_bolivian_task', 'collab_ingestion', 'bolivian_task', 'Revisar tarea Bolivian y marcar sensible/no sensible', 'alta', 'pending', 'sergio', true, '{}'::jsonb),
  ('review_arthur_deliverable', 'deliverable', 'collab_ingestion_map', 'Revisar entregable Arthur antes de contar como evidencia', 'media', 'pending', 'sergio', false, '{}'::jsonb)
on conflict (review_key) do update set
  source_type = excluded.source_type,
  source_key = excluded.source_key,
  title = excluded.title,
  priority = excluded.priority,
  status = excluded.status,
  reviewer_role_key = excluded.reviewer_role_key,
  sensitive = excluded.sensitive,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.knowledge_items (
  knowledge_key,
  organization_key,
  project_key,
  title,
  category,
  sensitivity_scope,
  status,
  source_reference,
  raw
)
values
  ('bolivian_safe_context', 'bolivian_electric', 'bolivian_electric_os', 'Contexto permitido para tareas Bolivian', 'policy', 'internal_restricted', 'draft', 'onia-hermes-collab/templates/bolivian-task.md', '{}'::jsonb),
  ('onia_collab_rules', 'onia_collab', null, 'Reglas de acceso y redaccion de aportes', 'policy', 'collab_safe', 'approved', 'onia-hermes-collab/ACCESS_POLICY.md', '{}'::jsonb)
on conflict (knowledge_key) do update set
  organization_key = excluded.organization_key,
  project_key = excluded.project_key,
  title = excluded.title,
  category = excluded.category,
  sensitivity_scope = excluded.sensitivity_scope,
  status = excluded.status,
  source_reference = excluded.source_reference,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.content_assets (
  asset_key,
  project_key,
  title,
  channel,
  status,
  public_safe,
  approved_by_role_key,
  raw
)
values
  ('onia_growth_content', 'content_onia', 'Pieza comercial ONIA Motor Local Growth', 'instagram', 'idea', true, null, '{}'::jsonb),
  ('bolivian_internal_case', 'bolivian_electric_os', 'Caso interno Bolivian redactorizado', 'internal', 'draft', false, null, '{}'::jsonb)
on conflict (asset_key) do update set
  project_key = excluded.project_key,
  title = excluded.title,
  channel = excluded.channel,
  status = excluded.status,
  public_safe = excluded.public_safe,
  approved_by_role_key = excluded.approved_by_role_key,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.inventory_items (
  inventory_key,
  organization_key,
  project_key,
  item_name,
  location,
  camera_required,
  status,
  raw
)
values (
  'stockcam_demo',
  'onia',
  'stockcam',
  'Registro demo StockCam',
  'almacen-demo',
  true,
  'draft',
  '{}'::jsonb
)
on conflict (inventory_key) do update set
  organization_key = excluded.organization_key,
  project_key = excluded.project_key,
  item_name = excluded.item_name,
  location = excluded.location,
  camera_required = excluded.camera_required,
  status = excluded.status,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.external_adapters (
  adapter_key,
  adapter_name,
  system_type,
  organization_key,
  project_key,
  mode,
  status,
  write_allowed,
  operating_rule,
  raw
)
values
  ('onia_hermes_collab', 'onia-hermes-collab', 'collab_repo', 'onia_collab', 'onia_center', 'manual_review', 'planned', false, 'Leer aportes, clasificar, redactorizar y crear cola de revision. Nunca importar directo sin Sergio.', '{}'::jsonb),
  ('tr4', 'TR4', 'erp', 'bolivian_electric', 'bolivian_electric_os', 'manual_export', 'audit_required', false, 'Sistema externo. Primero exportacion manual o importador asistido. Sin escritura ni credenciales hasta autorizacion.', '{}'::jsonb),
  ('notion_onia', 'Notion ONIA', 'notion', 'onia', 'onia_center', 'api', 'planned', false, 'Fuente actual para CRM/finanzas hasta conectar Supabase con RLS y auditoria.', '{}'::jsonb),
  ('n8n', 'n8n', 'n8n', 'onia', 'automations', 'api', 'planned', false, 'Automatizaciones solo con aprobacion, logs y humano responsable.', '{}'::jsonb),
  ('whatsapp', 'WhatsApp', 'whatsapp', 'onia', 'chatbots', 'api', 'blocked', false, 'Bloqueado hasta permisos Meta, alcance aprobado y politicas de contacto.', '{}'::jsonb),
  ('cal', 'Cal.com', 'calendar', 'onia', 'onia_center', 'api', 'planned', false, 'Reservas y reuniones entran como eventos revisables, no como decisiones automaticas.', '{}'::jsonb),
  ('camera_stockcam', 'Camara / StockCam', 'camera', 'onia', 'stockcam', 'importer', 'planned', false, 'Capturas y conteos generan evidencia, diferencias y exportacion; no reemplaza ERP.', '{}'::jsonb)
on conflict (adapter_key) do update set
  adapter_name = excluded.adapter_name,
  system_type = excluded.system_type,
  organization_key = excluded.organization_key,
  project_key = excluded.project_key,
  mode = excluded.mode,
  status = excluded.status,
  write_allowed = excluded.write_allowed,
  operating_rule = excluded.operating_rule,
  raw = excluded.raw,
  updated_at = now();

insert into onia_center.audit_logs (
  audit_key,
  actor_user_key,
  actor_role_key,
  action,
  entity_table,
  entity_key,
  sensitivity_scope,
  summary,
  raw
)
values
  ('core_defined', 'sergio', 'sergio', 'define_operating_core', 'onia-center', 'onia_center', 'internal_restricted', 'Se define onia-center como sistema operativo y onia-hermes como cerebro privado.', '{}'::jsonb),
  ('collab_boundary_defined', 'sergio', 'sergio', 'define_collab_boundary', 'onia-hermes-collab', 'onia_hermes_collab', 'collab_safe', 'Arthur trabaja en collab con aportes revisables, sin datos sensibles.', '{}'::jsonb)
on conflict (audit_key) do nothing;

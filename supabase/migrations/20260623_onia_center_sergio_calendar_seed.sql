-- ONIA Center Sergio private calendar seed.

insert into onia_center.sergio_schedule_blocks (
  block_key,
  day_pattern,
  start_time,
  end_time,
  title,
  category,
  strictness,
  meeting_policy,
  telegram_command,
  note,
  raw
) values
  (
    'sergio-wake-reset',
    'Lunes a viernes',
    '06:30',
    '07:00',
    'Levantarse, agua, aseo, cero telefono',
    'wake',
    'fixed',
    'blocked',
    'Plan Sergio hoy',
    'Si este bloque se rompe, Alfred debe bajar la carga del dia y no empujar contenido pesado.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-ceo-plan',
    'Lunes a viernes',
    '07:00',
    '07:30',
    'Plan CEO: caja, ventas, 3 prioridades',
    'planning',
    'fixed',
    'blocked',
    'Plan Sergio hoy',
    'Definir una accion de venta, una accion de entrega y una accion personal protegida.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-sales-block',
    'Lunes a viernes',
    '08:30',
    '10:30',
    'Ventas, CRM y seguimientos',
    'sales',
    'fixed',
    'emergency_only',
    'Seguimientos ONIA hoy',
    'Sin scroll ni generacion de video. Solo leads, llamadas, propuestas y proximas acciones.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-deep-work-am',
    'Lunes a viernes',
    '10:45',
    '11:30',
    'Trabajo profundo corto',
    'deep_work',
    'preferred',
    'blocked',
    null,
    'Construir ONIA Center, clientes o entregas. Bloque corto para evitar saturacion.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-meeting-window-am',
    'Lunes a viernes',
    '11:30',
    '12:30',
    'Ventana reuniones 1',
    'meetings',
    'preferred',
    'available',
    null,
    'Solo demos, diagnosticos, cliente activo o llamada importante. Mantener 15 min de buffer.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-lunch-reset',
    'Lunes a viernes',
    '12:30',
    '13:15',
    'Almuerzo y reset',
    'personal',
    'fixed',
    'blocked',
    null,
    'No reuniones. Si hay cansancio, Alfred debe proponer pausa antes de otra tarea.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-delivery-block',
    'Lunes a viernes',
    '13:15',
    '15:15',
    'Entrega, desarrollo y operaciones',
    'deep_work',
    'fixed',
    'blocked',
    null,
    'Bloque principal de produccion. No meter llamadas salvo urgencia real de cliente pago.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-meeting-window-pm',
    'Lunes a jueves',
    '15:30',
    '16:30',
    'Ventana reuniones 2',
    'meetings',
    'preferred',
    'available',
    null,
    'Seguimientos, cierre, revision de propuesta o llamada de vendedor. Viernes queda para cierre interno.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-admin-close',
    'Lunes a viernes',
    '16:30',
    '17:15',
    'Admin, registro y cierre de cabos',
    'admin',
    'preferred',
    'blocked',
    'Registro Hermes',
    'Registrar pagos, tareas, ideas y blockers antes de ir al gym.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-gym',
    'Lunes, miercoles y viernes',
    '17:30',
    '19:00',
    'Gym protegido',
    'gym',
    'fixed',
    'blocked',
    'Modo gym',
    'No reuniones. Alfred solo permite emergencia o recordatorio minimo.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-girlfriend',
    'Martes, jueves y sabado',
    '20:00',
    '22:30',
    'Tiempo novia / vida personal',
    'personal',
    'fixed',
    'blocked',
    'Modo novia',
    'No trabajar ni recibir backlog. Si aparece urgencia, Alfred la guarda para manana.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-shutdown',
    'Domingo a jueves',
    '22:15',
    '23:00',
    'Apagar trabajo, preparar manana',
    'shutdown',
    'fixed',
    'blocked',
    'Cierre Sergio',
    'Sin Higgsfield, sin nuevas tareas grandes. Solo resumen, ropa/pendientes y dormir.',
    '{"source":"operating-source.ts"}'::jsonb
  ),
  (
    'sergio-sleep',
    'Domingo a jueves',
    '23:00',
    '06:30',
    'Dormir',
    'sleep',
    'fixed',
    'blocked',
    null,
    'La agenda debe proteger este bloque porque sin sueno baja ventas y ejecucion.',
    '{"source":"operating-source.ts"}'::jsonb
  )
on conflict (block_key) do update set
  day_pattern = excluded.day_pattern,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  title = excluded.title,
  category = excluded.category,
  strictness = excluded.strictness,
  meeting_policy = excluded.meeting_policy,
  telegram_command = excluded.telegram_command,
  note = excluded.note,
  raw = excluded.raw;

insert into onia_center.sergio_meeting_windows (
  window_key,
  day_pattern,
  start_time,
  end_time,
  title,
  allowed_for,
  buffer_minutes,
  booking_rule
) values
  (
    'meeting-window-am',
    'Lunes a viernes',
    '11:30',
    '12:30',
    'Demos, diagnosticos y reuniones pagadas',
    '["prospectos calificados","clientes activos","diagnostico pagado","acompanar vendedor"]'::jsonb,
    15,
    'Cal.com solo debe abrir esta ventana con minimo 4 horas de anticipacion.'
  ),
  (
    'meeting-window-pm',
    'Lunes a jueves',
    '15:30',
    '16:30',
    'Cierres, seguimiento y revision',
    '["seguimiento comercial","revision con cliente","cierre de propuesta","operacion interna importante"]'::jsonb,
    15,
    'No aceptar reuniones despues de las 16:30 si chocan con cierre, gym o vida personal.'
  )
on conflict (window_key) do update set
  day_pattern = excluded.day_pattern,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  title = excluded.title,
  allowed_for = excluded.allowed_for,
  buffer_minutes = excluded.buffer_minutes,
  booking_rule = excluded.booking_rule;

insert into onia_center.sergio_assistant_commands (
  command_key,
  command_text,
  purpose,
  response_rule,
  token_policy
) values
  ('cmd-plan-sergio', 'Plan Sergio hoy', 'Devuelve agenda del dia, 3 prioridades y bloques protegidos.', 'Responder corto, con horarios exactos y una sola siguiente accion.', 'short'),
  ('cmd-availability', 'Puedo reunirme <dia> <hora>?', 'Evalua si una reunion entra sin romper gym, novia, descanso o trabajo profundo.', 'Responder si/no, motivo y alternativa permitida.', 'short'),
  ('cmd-focus', 'Modo enfoque', 'Bloquea ruido y deja una tarea concreta para los proximos 45-90 minutos.', 'No sugerir videos ni investigacion amplia.', 'short'),
  ('cmd-saturated', 'Estoy saturado', 'Reduce carga, mueve tareas no urgentes y protege descanso.', 'Proponer pausa, siguiente accion minima y que se posterga.', 'short'),
  ('cmd-gym', 'Modo gym', 'Bloquea reuniones y mensajes largos durante entrenamiento.', 'Solo confirmar bloque y guardar pendientes para despues.', 'short'),
  ('cmd-girlfriend', 'Modo novia', 'Bloquea trabajo durante tiempo personal.', 'No mandar tareas, videos ni ideas salvo emergencia marcada por Sergio.', 'short')
on conflict (command_key) do update set
  command_text = excluded.command_text,
  purpose = excluded.purpose,
  response_rule = excluded.response_rule,
  token_policy = excluded.token_policy;

insert into onia_center.personal_automation_rules (
  rule_key,
  system_name,
  status,
  problem,
  new_rule,
  allowed_commands,
  blocked_scheduled_commands
) values (
  'higgsfield-quiet-default-20260623',
  'AlfredHQ / Hermes Video Lab',
  'manual_only',
  'El Scheduled Operations Pack estaba enviando Recordatorios Video Lab y Watcher Higgsfield todos los dias, lo que empujaba ideas de video aunque no hubiera una decision activa de producir.',
  'Higgsfield queda en modo manual por defecto. AlfredHQ solo habla de Higgsfield cuando Sergio pide Video Lab, cuando existe un job aprobado, o cuando se fuerza un detalle con comando manual.',
  '["Siguiente Video Lab","Recordatorios Video Lab detalle","Watcher Higgsfield detalle","Genera video Sergio: <idea>"]'::jsonb,
  '["Recordatorios Video Lab","Watcher Higgsfield"]'::jsonb
)
on conflict (rule_key) do update set
  system_name = excluded.system_name,
  status = excluded.status,
  problem = excluded.problem,
  new_rule = excluded.new_rule,
  allowed_commands = excluded.allowed_commands,
  blocked_scheduled_commands = excluded.blocked_scheduled_commands;

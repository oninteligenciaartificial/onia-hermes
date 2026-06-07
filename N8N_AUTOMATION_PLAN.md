# N8N Automation Plan - ONIA + Hermes

## Objetivo
Usar n8n como orquestador de horarios, aprobaciones por Telegram, planificacion semanal, prospeccion, impuestos, CRM y registros de negocio/finanzas para ONIA.

## Principios
- Hermes piensa, redacta, investiga y resume.
- n8n agenda, espera aprobaciones, registra eventos y conecta sistemas.
- Telegram es el canal de control humano.
- Notion es fuente operativa confirmada para registros de CRM, finanzas, tareas y reportes.
- Antes de pedir datos a Sergio, Hermes/n8n debe consultar Notion y los docs canonicos.
- Ninguna accion sensible debe ejecutarse sin confirmacion clara.

## Estado MCP para Codex

Actualizacion 2026-06-04:

- URL MCP: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/mcp-server/http`.
- Codex config: `C:\Users\HP I5 13va\.codex\config.toml`.
- Server: `n8n MCP Server` version `1.1.0`.
- Healthcheck Node: OK.
- `tools/list`: OK con 27 herramientas expuestas.
- Herramientas vistas: `search_workflows`, `execute_workflow`,
  `get_execution`, `search_executions`, `get_workflow_details`,
  `publish_workflow`, `unpublish_workflow`, `prepare_test_pin_data`,
  `test_workflow`, `list_credentials`, `search_data_tables`,
  `create_data_table`.

Regla operativa:

- No usar `publish_workflow`, `unpublish_workflow`, `execute_workflow` en modo
  productivo ni cambios destructivos sin aprobacion explicita.
- Para comprobar MCP desde Windows:

```powershell
cd C:\dev\Expermimentos\Hermes
$env:N8N_MCP_URL=[Environment]::GetEnvironmentVariable("N8N_MCP_URL","User")
$env:N8N_MCP_TOKEN=[Environment]::GetEnvironmentVariable("N8N_MCP_TOKEN","User")
npm run health:n8n-mcp
```

- Si Codex no muestra herramientas n8n tras actualizar token/config, reiniciar
  Codex. La configuracion se carga al iniciar la sesion.

### Auditoria n8n 2026-06-05

Resultado:

- MCP desde Codex: OK.
- `npm run health:n8n-mcp`: OK.
- `Hermes Radar Diario Creativo y Clientes`: sigue inactivo hasta tener un
  `telegramChatId` real.
- `ONIA - Telegram Command Center`: activo; antes era
  `ONIA - Video Lab Telegram Router`.
- `Hermes Telegram Chat ID Capture`: activo; todavia no hay chat ID valido
  capturado para el Radar.
- `ONIA - Scheduled Operations Pack`: creado como flujo programado interno
  para Telegram. Usa el chat operativo ya visto en ejecuciones reales del
  Command Center y no depende del flujo historico de captura.

Errores DentalGest detectados antes de la correccion:

| Workflow | Frecuencia | Nodo que falla | RPC | Error |
|---|---:|---|---|---|
| `WF-00: Appointment Reminders` | cada hora | `Supabase: Reminders 24h` | `n8n_reminders_24h` | `PGRST002` schema cache |
| `WF-02: QR Payment Alerts` | cada 5 min | `Supabase: Pending Payments` | `n8n_pending_qr_payments` | `PGRST002` schema cache |
| `WF-03: Recurring Invoice Delivery` | cada hora | `Supabase: Draft Recurring` | `n8n_draft_recurring_invoices` | `PGRST002` schema cache |
| `WF-09: Trial Expired Alert` | diario 06:00 La Paz | `Supabase: Expired Trials` | `n8n_expired_trials` | `PGRST002` schema cache |
| `WF-11 Post-Treatment Follow-up` | cada hora | `Query Follow-ups` | `n8n_followup_due` | `PGRST002` schema cache |

Interpretacion:

- n8n esta ejecutando los triggers, pero Supabase/PostgREST no puede consultar
  el cache de schema para esos RPCs.
- Las funciones `public.n8n_*` si existen en produccion. La causa real fue la
  configuracion/cache de PostgREST Data API.
- Se corrigio `authenticator.pgrst.db_schemas` a
  `public,storage,graphql_public` y se ejecuto `NOTIFY pgrst, 'reload config'`
  + `NOTIFY pgrst, 'reload schema'`.
- Validacion REST: `n8n_reminders_24h`, `n8n_pending_qr_payments`,
  `n8n_draft_recurring_invoices`, `n8n_expired_trials` y `n8n_followup_due`
  pasaron de `PGRST002` a HTTP `200` con `rows=0`.
- Validacion n8n: `WF-02: QR Payment Alerts` tuvo ejecuciones `success` a las
  `2026-06-05T14:55:00Z` y `2026-06-05T15:00:00Z`.
- Hay nodos HTTP con claves/API keys pegadas como texto. Migrar a credenciales
  n8n o variables de entorno y rotar las claves expuestas.

Estado aplicado 2026-06-05:

- Migracion local registrada en DentalGest:
  `C:\dev\Proyectos\dental-saas\supabase\migrations\20260605_n8n_postgrest_schema_cache_fix.sql`.
- No crea ni reemplaza RPCs; solo fija schemas expuestos, recarga PostgREST y
  verifica que existen funciones `public.n8n_*`.
- Para evitar envios automaticos sin aprobacion, quedaron pausados:
  `WF-00: Appointment Reminders`, `WF-03: Recurring Invoice Delivery` y
  `WF-11 Post-Treatment Follow-up`.
- No se mezclaron datos Hermes/ONIA en tablas DentalGest.
- Pendiente: reactivar esos tres workflows uno por uno, con ventana de prueba y
  revision de destinatarios antes de permitir envios reales.

Seguimiento 2026-06-05:

- Se creo en DentalGest `docs/N8N_POSTGREST_RUNBOOK.md` con:
  - limite de datos DentalGest vs Hermes;
  - diagnostico y rollback de `PGRST002`;
  - validacion segura de RPCs;
  - matriz de workflows pausados;
  - reglas para reactivacion controlada;
  - politica de secretos n8n.
- n8n tiene credenciales disponibles para Postgres, Supabase, Brevo, Telegram,
  OpenAI, Gmail y SSH. No se imprimieron secretos.
- Sin errores n8n nuevos desde `2026-06-05T15:00:00Z`.
- Telegram: el bot tiene webhook activo y `pending_update_count=0`.
  `getUpdates` no aplica mientras el webhook este activo. El workflow
  `Hermes Telegram Chat ID Capture` esta activo, pero no tiene ejecuciones
  reales nuevas; falta enviar un mensaje al bot para capturar el chat real.

## Flujos prioritarios

### 0. ONIA - Telegram Command Center

Frecuencia: trigger de Telegram.

Objetivo: que Sergio pueda operar Hermes, ONIA, Video Lab, Higgsfield,
proyectos, plan semanal y estado de automatizaciones desde Telegram.

Ruta tecnica:

```bash
hermes-command telegram --message "<mensaje>"
```

Pasos:

1. Telegram Trigger recibe el mensaje.
2. Nodo SSH ejecuta `hermes-command telegram --message "<mensaje>"`.
3. Parsear JSON.
4. Responder a Telegram con `telegram_reply`.
5. Registrar en Notion cuando sea una decision, aprobacion, bloqueo o tarea.

Comandos iniciales:

- `Estado Semana`
- `Plan Semana`
- `Plan Hoy`
- `Automatizaciones ONIA`
- `Mapa proyectos ONIA`
- `Fabrica contenido ONIA`
- `Orquesta ONIA: <empresa o rubro> | <objetivo>`
- `Prepara venta DentalGest: <clinica>`
- `Prepara venta Gestios: <empresa>`
- `Prepara marketing Higgsfield: <negocio> | <oferta>`
- comandos Video Lab ya existentes.

Regla: este flujo no publica, no contacta y no activa envios masivos. Solo
enruta, resume, prepara y espera aprobacion.

Estado 2026-06-06:

- Workflow activo: `ONIA - Telegram Command Center`.
- ID: `vuicWsvh0hwqKhYs`.
- Nombre anterior: `ONIA - Video Lab Telegram Router`.
- Version activa publicada: `9c2d3776-ee6b-44d9-a36f-97ee9c40817f`.
- Mantiene el mismo bot/trigger para evitar conflicto de webhooks.

### 0.1 ONIA - Scheduled Operations Pack

Estado 2026-06-06:

- Workflow creado: `ONIA - Scheduled Operations Pack`.
- ID: `VeCHKr6wkK5Wet25`.
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/VeCHKr6wkK5Wet25`.
- Tipo: schedules internos + SSH + Telegram.
- Credenciales: `SSH Password account` y `Telegram account 2`.
- Estado: activo.
- Version activa: `63d699bb-6814-44dc-a2c2-d3f8d6c9ed4d`.
- Validacion: `hermes-command` actualizado fue desplegado en el VPS y los siete
  comandos programados respondieron `ok:true`.

Horarios:

| Hora | Comando Hermes | Funcion |
|---|---|---|
| 07:30 | `Radar creativo ONIA` | radar local seguro de ideas y oportunidades |
| 08:00 | `Cola contenido diaria` | cola Sergio + ONIA + cliente si aplica |
| 08:30 | `Seguimientos ONIA hoy` | seguimiento CRM sin envio automatico |
| 10:00 | `Recordatorios Video Lab` | aprobaciones y revisiones pendientes |
| 15:00 | `Platform Copy Queue` | captions/descripciones por plataforma |
| 17:00 | `Watcher Higgsfield` | jobs aprobados, renders y MP4 generados |
| 21:00 | `Registro Hermes` | estado del log/outbox local |

Guardrails:

- No contacta prospectos.
- No publica contenido.
- No envia WhatsApp.
- No usa Notion directo todavia; registra outbox local en
  `/root/.hermes/notion-outbox/command-center-events.jsonl`.

### 1. ONIA - Plan semanal
Frecuencia: semanal, lunes 08:00 America/La_Paz.

Pasos:
1. Schedule Trigger.
2. Enviar a Hermes: `Plan semanal ONIA`.
3. Guardar respuesta en Notion como reporte semanal.
4. Enviar resumen por Telegram.
5. Esperar aprobacion del usuario.
6. Si se aprueba una pieza, crear tarea de produccion o pasar a Session A/publishing.
7. Registrar decision y estado.

Salida esperada:
- Calendario de 5 piezas.
- Pieza prioritaria.
- Fuentes usadas.
- CTA y objetivo comercial.

### 2. ONIA - Prospeccion semanal
Frecuencia: semanal, martes 09:00 America/La_Paz.

Pasos:
1. Schedule Trigger.
2. Enviar a Hermes: `Busca prospectos ONIA: <industria> | <ubicacion>`.
3. Revisar que cada prospecto tenga fuente publica.
4. Crear o actualizar registros CRM en Notion.
5. Enviar top prospectos por Telegram.
6. Esperar decision: guardar, contactar, descartar o investigar mas.

### 3. ONIA - Seguimiento CRM
Frecuencia: diaria, 08:30 America/La_Paz.

Pasos:
1. Buscar en Notion prospectos/clientes con `next_follow_up_date <= hoy`.
2. Pedir a Hermes mensaje sugerido.
3. Enviar resumen por Telegram.
4. Marcar seguimiento como pendiente de accion humana.

### 4. ONIA - Recordatorios fiscales
Frecuencia: diaria, 07:30 America/La_Paz.

Pasos:
1. Leer configuracion fiscal.
2. Detectar obligaciones con alertas proximas.
3. Enviar recordatorio por Telegram.
4. Registrar alerta enviada.

Regla:
- No activar fechas exactas hasta completar NIT, regimen, responsable y calendario confirmado.

### 5. ONIA - Finanzas y Notion
Frecuencia: semanal, viernes 16:00 America/La_Paz.

Pasos:
1. Revisar registros de ingresos, gastos, facturas y tareas financieras en Notion.
2. Pedir a Hermes resumen ejecutivo.
3. Enviar reporte por Telegram.
4. Crear tareas de seguimiento si faltan pagos, facturas o datos.

### 6. ONIA - Video Lab / Higgsfield
Frecuencia: diaria, 10:00 y 17:00 America/La_Paz, o trigger manual por Telegram.

Objetivo: orquestar aprobaciones, recordatorios y registro de videos. n8n no
genera ni publica por su cuenta.

El Command Center general maneja estos comandos mediante `hermes-command`, que
delega a `video-lab telegram` cuando corresponde.

Pasos:
1. Leer jobs de Video Lab con estado `waiting_approval`, `generated` o
   `needs_revision`.
2. Enviar resumen por Telegram con acciones sugeridas.
3. Esperar aprobacion exacta:
   - `Aprobar video <job_id>`
   - `Rehacer video <job_id>: <cambio>`
   - `Video generado <job_id>: <url_video>`
   - `Publicar video <job_id>`
4. Registrar decision en Notion/CRM.
5. Si Higgsfield MCP/API permite polling, consultar estado de generacion.
6. Notificar cuando haya URL publica lista para revision.

Regla: n8n nunca debe publicar ni entregar videos sin aprobacion explicita.

Salida hacia Sergio:

- Telegram es la bandeja principal de respuesta.
- El mensaje debe incluir `job_id`, estado, hook, descripcion/caption resumida
  y siguiente comando exacto.
- El dashboard queda para revisar logs, lotes y estados.

Workflow router creado y actualizado:

- ID: `vuicWsvh0hwqKhYs`
- Nombre actual: `ONIA - Telegram Command Center`
- Nombre anterior: `ONIA - Video Lab Telegram Router`
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/vuicWsvh0hwqKhYs`
- Estado: activo con bot dedicado.

Funcion:

1. Recibe comandos por Telegram.
2. Ejecuta `hermes-command telegram --message "<mensaje>"` en el VPS mediante SSH.
3. Devuelve a Telegram el `telegram_reply`.

Para mensajes Video Lab, `hermes-command` delega internamente a:

```bash
video-lab telegram --message "<mensaje>"
```

Actualizacion 2026-06-02:

- Telegram quedo asignado explicitamente al trigger y al nodo de respuesta.
- El nodo SSH quedo con comando robusto: captura salida, error y timeout, y
  devuelve JSON para que Telegram no quede mudo ante fallos.
- La credencial SSH fue creada en n8n como `SSH Password account` y asignada al
  nodo `Run Video Lab Router on VPS`.
- Prueba simulada exitosa: ejecucion n8n `7931`.

Actualizacion 2026-06-03:

- Se creo una segunda credencial Telegram en n8n: `Telegram account 2`.
- `Telegram account 2` quedo asignada a `Telegram Video Lab Command` y
  `Send Video Lab Reply`.
- Prueba simulada segura exitosa: ejecucion n8n `7966`.
- El workflow `ONIA - Video Lab Telegram Router` quedo activo con version
  `dc53e0a6-b8fd-4345-b8e5-4656a704af23`.
- Actualizacion 2026-06-06: workflow renombrado a
  `ONIA - Telegram Command Center`, publicado con version activa
  `9c2d3776-ee6b-44d9-a36f-97ee9c40817f`, y el nodo SSH ahora ejecuta
  `hermes-command telegram --message`.
- `Hermes Telegram Chat ID Capture` queda activo para operaciones/captura con
  el bot anterior; Video Lab usa bot separado para evitar conflicto de webhook.

### 7. ONIA - Higgsfield Reference Router
Frecuencia: trigger manual por Telegram o Dashboard.

Objetivo: darle a Higgsfield un paquete completo para crear mejor: rubro,
referencias aprobadas, estilo, assets, guion, escenas, CTA, claims seguros y
negative prompt.

Pasos:
1. Recibir `job_id` o pedido de video.
2. Leer el job de Video Lab.
3. Leer `hermes-content/references/higgsfield-content-use-cases.json`.
4. Seleccionar rubro, formato, referencias y claims seguros.
5. Adjuntar assets aprobados: logo, capturas, fotos, videos o links publicos.
6. Construir `higgsfield_prompt_package`.
7. Enviar a Telegram para revision.
8. Solo con `Aprobar video <job_id>`, pasar a generacion manual/MCP.
9. Registrar URL generada, creditos usados y estado.

Referencia operativa:

- `hermes-content/references/n8n-higgsfield-generation-flow.md`

### 8. ONIA - Platform Copy Router
Frecuencia: trigger manual, al crear un video o antes de publicar.

Objetivo: crear descripcion/copy por canal y evitar que Instagram, TikTok,
YouTube y LinkedIn usen el mismo texto sin adaptar.

Pasos:
1. Leer el job de Video Lab.
2. Crear `platform_copy`:
   - `instagram_caption`
   - `tiktok_description`
   - `youtube_title`
   - `youtube_description`
   - `youtube_tags`
   - `linkedin_copy`
3. Enviar a Telegram para revision.
4. Guardar la version aprobada en el job.
5. Publicar solo el canal aprobado.

### 8.1 ONIA - Daily Content Queue

Frecuencia: diaria 08:00 America/La_Paz.

Estado: implementado dentro de `ONIA - Scheduled Operations Pack`.

Objetivo: mantener produccion constante para Sergio y ONIA sin improvisar.

Pasos:

1. Leer calendario, Video Lab, Notion/tareas y oportunidades comerciales.
2. Proponer:
   - 1 video Sergio;
   - 1 Reel ONIA;
   - 1 idea reciclable para carousel/story/LinkedIn;
   - oportunidades de cliente si existen.
3. Enviar por Telegram con comandos exactos para crear briefs.
4. Esperar aprobacion de Sergio.
5. Crear jobs de Video Lab solo para las piezas aprobadas.

Regla: la cola diaria propone y organiza; no genera ni publica sola.

### 8.2 ONIA - Higgsfield Generation Watcher

Frecuencia: 17:00 America/La_Paz como watcher local. Polling/API real queda
pendiente hasta tener integracion Higgsfield estable.

Estado: recordatorio implementado dentro de `ONIA - Scheduled Operations Pack`.

Objetivo: registrar URLs, costos, modelo, estado y errores de generaciones.

Pasos:

1. Leer jobs `approved_for_generation`.
2. Revisar si existe `higgsfield_job_id`.
3. Consultar estado si la API/MCP lo permite.
4. Guardar URL publica y costos.
5. Notificar a Telegram: `Video generado <job_id>: <url_video>`.
6. Esperar revision y `Publicar video <job_id>`.

Regla: si no hay integracion estable, Hermes prepara el paquete y Sergio o el
operador carga manualmente en Higgsfield.

### 9. Hermes - Radar diario creativo y clientes

Estado: creado como borrador seguro en n8n.

Referencia:

- `hermes-content/references/n8n-radar-diario-creativo-clientes.md`
- `hermes-content/references/n8n-telegram-chat-id-capture.md`

Workflow:

- ID: `lryabRhGQW4WIuJG`
- Nombre: `Hermes Radar Diario Creativo y Clientes`
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/lryabRhGQW4WIuJG`

Frecuencia:

- 07:30 diario, segun timezone de la instancia n8n.

Objetivo:

1. Investigar novedades actuales de IA, video, UGC, redes, automatizacion y
   prospeccion.
2. Separar oportunidades para Sergio personal, ONIA, Higgsfield y clientes.
3. Enviar resumen accionable por Telegram.

Guardrail:

- No publica.
- No contacta prospectos.
- No usa cara/voz de Sergio.
- No hace deploy.
- No imprime secretos.
- No ejecuta OpenAI ni Telegram hasta configurar `telegramChatId`.

Bloqueo actual del flujo historico:

- Falta reemplazar `REPLACE_WITH_TELEGRAM_CHAT_ID` en el nodo `Build Radar Brief`.
- Prueba manual `7502` termino en `blocked_missing_telegram_chat_id`, como se
  esperaba.

Workflow auxiliar activo para capturar chat ID:

- ID: `T3qtKnj94fBXQsxY`
- Nombre: `Hermes Telegram Chat ID Capture`
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/T3qtKnj94fBXQsxY`
- Uso: enviar `/id` al bot conectado a `Telegram account` y copiar el
  `chat_id` devuelto al radar diario.

Estado actual:

- Instagram conectado.
- Radar local, cola diaria, CRM reminder, aprobaciones, copy y watcher quedaron
  cubiertos por `ONIA - Scheduled Operations Pack`.
- TikTok pendiente de Content Posting API/OAuth/review.
- YouTube pendiente de Google OAuth y publisher script.

## Aprobaciones por Telegram
Formato valido:
- `Apruebo plan semanal: <pieza exacta>`
- `Apruebo contactar: <empresa>`
- `Confirmo impuesto: <obligacion> <fecha>`
- `Aprobar video <job_id>`
- `Publicar video <job_id>`

Formatos no validos:
- `ok`
- `dale`
- `hazlo`
- `publica algo`

## Notion recomendado
Bases confirmadas:
- Finanzas ONIA: `Finanzas & Gastos`
  - Page ID: `ffc07959-c372-4ff7-aaf6-2d744d5bf81c`
  - Data source: `collection://0e6e404f-d329-4898-9861-64f8ce973ac5`
- SaaS/Herramientas: `SaaS & Herramientas`
  - Page ID: `dc6a6e27-453a-4d7c-800b-ef9c29c8d5ff`
  - Data source: `collection://5eaa8d12-823c-4b3b-96bb-e7aaeab1ff9c`
- CRM ONIA: `CRM & Contactos`
  - Page ID: `95acb20d-e7f5-4eaa-b185-7a7933ffdd1a`
  - Data source: `collection://9b4c77be-d02b-4840-8f91-827ec8007839`
- Tareas Operativas: `Tareas`
  - Page ID: `698f00c1-b022-4c37-81f2-3fb8e73955b4`
  - Data source: fetch before use.

Bases pendientes de confirmar o crear:
- Prospectos ONIA especifico si se separa del CRM.
- Reportes Semanales.
- Recordatorios Fiscales.

Regla:
- Si el flujo necesita un dato de negocio, primero buscar en Notion.
- Si no aparece, buscar en repo/docs.
- Si sigue faltando, preguntar solo el campo exacto que falta.
- Si el dato esta confirmado por Sergio, registrarlo en Notion y luego usarlo.

## Variables recomendadas
- `ONIA_TELEGRAM_APPROVAL_CHAT_ID`
- `ONIA_DEFAULT_WEEKLY_TOPIC`
- `ONIA_DEFAULT_PROSPECTING_INDUSTRY`
- `ONIA_DEFAULT_PROSPECTING_LOCATION`
- `ONIA_NOTION_CRM_DATABASE_ID=95acb20d-e7f5-4eaa-b185-7a7933ffdd1a`
- `ONIA_NOTION_CRM_DATA_SOURCE_ID=9b4c77be-d02b-4840-8f91-827ec8007839`
- `ONIA_NOTION_FINANCE_DATABASE_ID=ffc07959-c372-4ff7-aaf6-2d744d5bf81c`
- `ONIA_NOTION_FINANCE_DATA_SOURCE_ID=0e6e404f-d329-4898-9861-64f8ce973ac5`
- `ONIA_NOTION_TOOLS_DATABASE_ID=dc6a6e27-453a-4d7c-800b-ef9c29c8d5ff`
- `ONIA_NOTION_TOOLS_DATA_SOURCE_ID=5eaa8d12-823c-4b3b-96bb-e7aaeab1ff9c`
- `ONIA_NOTION_TASKS_DATABASE_ID=698f00c1-b022-4c37-81f2-3fb8e73955b4`
- `ONIA_NOTION_REPORTS_DATABASE_ID`
- `ONIA_NOTION_TAX_DATABASE_ID`
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REFRESH_TOKEN`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REFRESH_TOKEN`

## Criterios de exito
- Los flujos recurrentes corren sin publicar ni contactar automaticamente.
- Todo evento importante queda registrado.
- Toda accion sensible espera aprobacion explicita.
- Los reportes son accionables, breves y con siguiente paso claro.

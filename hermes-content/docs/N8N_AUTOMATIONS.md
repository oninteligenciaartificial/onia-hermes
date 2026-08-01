# N8N Automations

## Rol de n8n
n8n orquesta horarios, aprobaciones, registros y conexiones entre Hermes, Telegram y Notion.

Hermes no debe depender de memoria informal para procesos recurrentes: n8n debe disparar, registrar y esperar aprobacion cuando corresponda.

## Estado MCP

Actualizado 2026-06-04:

- Endpoint MCP: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/mcp-server/http`.
- Codex local queda configurado como `n8n-mcp`.
- El token se guarda fuera de Markdown.
- Healthcheck aprobado:
  - `initialize`: OK.
  - `tools/list`: OK.
  - 27 herramientas MCP visibles por HTTP.
- Si una sesion de Codex estaba abierta antes de configurar MCP, reiniciar
  Codex para que las herramientas se carguen.

Comando de validacion:

```powershell
cd C:\dev\Expermimentos\Hermes
$env:N8N_MCP_URL=[Environment]::GetEnvironmentVariable("N8N_MCP_URL","User")
$env:N8N_MCP_TOKEN=[Environment]::GetEnvironmentVariable("N8N_MCP_TOKEN","User")
npm run health:n8n-mcp
```

No confundir:

- `GET /mcp-server/http` puede devolver `406`.
- JSON mal escapado puede devolver `500` y log `Failed to parse request body`.
- Eso no significa necesariamente que el token este mal.

## Auditoria operacional 2026-06-05

Estado confirmado:

- n8n MCP conectado desde Codex.
- `ONIA - Telegram Command Center` activo; antes era
  `ONIA - Video Lab Telegram Router`.
- `Hermes Telegram Chat ID Capture` activo.
- `ONIA - Scheduled Operations Pack` creado para schedules internos de
  Telegram: radar, cola diaria, CRM, Video Lab, Higgsfield, copy y registro.
- `Hermes Radar Diario Creativo y Clientes` queda como flujo historico inactivo;
  el radar local seguro ya esta cubierto por el Scheduled Operations Pack.

Workflows DentalGest que tenian errores antes de la correccion:

| Workflow | Nodo | RPC | Error |
|---|---|---|---|
| `WF-00: Appointment Reminders` | `Supabase: Reminders 24h` | `n8n_reminders_24h` | `PGRST002` schema cache |
| `WF-02: QR Payment Alerts` | `Supabase: Pending Payments` | `n8n_pending_qr_payments` | `PGRST002` schema cache |
| `WF-03: Recurring Invoice Delivery` | `Supabase: Draft Recurring` | `n8n_draft_recurring_invoices` | `PGRST002` schema cache |
| `WF-09: Trial Expired Alert` | `Supabase: Expired Trials` | `n8n_expired_trials` | `PGRST002` schema cache |
| `WF-11 Post-Treatment Follow-up` | `Query Follow-ups` | `n8n_followup_due` | `PGRST002` schema cache |

Que significa:

- El problema no parece ser el MCP de n8n.
- n8n si dispara los horarios.
- La falla estaba en Supabase/PostgREST Data API al consultar cache/config de
  schemas para RPCs.

Correccion aplicada 2026-06-05:

1. Confirmado por Postgres que existen 22 funciones `public.n8n_*`.
2. Configurado `authenticator.pgrst.db_schemas` como
   `public,storage,graphql_public`.
3. Ejecutado `NOTIFY pgrst, 'reload config'` y
   `NOTIFY pgrst, 'reload schema'`.
4. Validado por REST: `n8n_reminders_24h`, `n8n_pending_qr_payments`,
   `n8n_draft_recurring_invoices`, `n8n_expired_trials` y `n8n_followup_due`
   responden HTTP `200` y `rows=0`.
5. Validado por n8n: `WF-02: QR Payment Alerts` ejecuciones `9048` y `9049`
   en `success`.

Proteccion client-facing:

- Para no enviar mensajes reales sin aprobacion, se pausaron:
  `WF-00: Appointment Reminders`, `WF-03: Recurring Invoice Delivery`,
  `WF-11 Post-Treatment Follow-up`.
- La migracion local de referencia es:
  `C:\dev\Proyectos\dental-saas\supabase\migrations\20260605_n8n_postgrest_schema_cache_fix.sql`.
- Esa migracion no toca tablas ni datos: solo config/cache de PostgREST.
- Pendiente: reactivar workflows pausados uno por uno con prueba controlada.

Siguiente deuda:

- Migrar claves pegadas en nodos HTTP a credenciales n8n o variables de entorno.
- Revisar/rotar las claves expuestas antes de vender o activar flujos masivos.

Seguimiento 2026-06-05:

- DentalGest ahora tiene `docs/N8N_POSTGREST_RUNBOOK.md` para diagnostico,
  rollback, validacion y reactivacion controlada de workflows.
- n8n tiene credenciales creadas para Postgres, Supabase, Brevo, Telegram,
  OpenAI, Gmail y SSH; no se imprimieron secretos.
- No hay errores n8n nuevos desde `2026-06-05T15:00:00Z`.
- Telegram usa webhook activo. `getUpdates` devuelve `409` mientras el webhook
  existe, por eso el chat real debe capturarse por el workflow
  `Hermes Telegram Chat ID Capture`. Sigue pendiente recibir un mensaje real en
  el bot.

## Flujos principales
- `ONIA - Telegram Command Center`: router general de Telegram hacia Hermes,
  proyectos, Video Lab, plan semanal y estado operativo.
- `ONIA - Scheduled Operations Pack`: agenda recordatorios internos hacia
  Telegram sin contactar ni publicar.
- `ONIA - Plan semanal`: genera plan semanal, envia resumen por Telegram y espera aprobacion.
- `ONIA - Prospeccion semanal`: busca prospectos, registra en CRM y pide decision.
- `ONIA - Seguimientos CRM`: revisa tareas comerciales vencidas o de hoy.
- `ONIA - Recordatorios fiscales`: envia alertas fiscales segun configuracion confirmada.
- `ONIA - Finanzas semanal`: resume ingresos, gastos, facturas y pendientes.
- `ONIA - Video Lab / Higgsfield`: laboratorio interno; recuerda aprobaciones,
  registra URLs y coordina estados de videos, pero no se vende como paquete.
- `ONIA - Higgsfield Reference Router`: arma paquetes de referencias, rubro,
  assets, guion, escenas, CTA y negative prompt para generar mejor.
- `ONIA - Platform Copy Router`: crea descripcion/copy por canal antes de
  publicar en Instagram, TikTok, YouTube o LinkedIn.

## Telegram Command Center

Ruta tecnica recomendada para n8n:

```bash
hermes-command telegram --message "<mensaje>"
```

Flujo:

```text
Telegram Trigger
-> SSH hermes-command telegram --message "<mensaje>"
-> Parse JSON
-> Send Message telegram_reply
-> Notion log si aplica
```

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
- `Prepara venta Web ONIA: <negocio>`
- `Prepara consultoria ONIA: <negocio> | <dolor o proceso>`
- comandos Video Lab.

Estado:

- Script local/VPS: `hermes-command`.
- Workflow n8n general: activo y publicado.
- ID: `vuicWsvh0hwqKhYs`.
- Version activa: `9c2d3776-ee6b-44d9-a36f-97ee9c40817f`.
- Router dedicado Video Lab: absorbido por `hermes-command`, que delega a
  `video-lab telegram` cuando corresponde.

Regla: este flujo enruta y prepara; no publica, no contacta y no activa envios
client-facing sin aprobacion exacta.

## Scheduled Operations Pack

Estado 2026-06-06:

- Workflow: `ONIA - Scheduled Operations Pack`.
- ID: `VeCHKr6wkK5Wet25`.
- Version activa: `63d699bb-6814-44dc-a2c2-d3f8d6c9ed4d`.
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/VeCHKr6wkK5Wet25`.
- Accion: schedules diarios que ejecutan `hermes-command telegram --message`.
- Registro: Hermes guarda eventos en `/root/.hermes/logs/command-center-events.jsonl`
  y `/root/.hermes/notion-outbox/command-center-events.jsonl`.

Horarios:

| Hora | Comando Hermes | Funcion |
|---|---|---|
| 07:30 | `Radar creativo ONIA` | radar local seguro |
| 08:00 | `Cola contenido diaria` | cola Sergio + Onia |
| 08:30 | `Seguimientos ONIA hoy` | CRM sin envio automatico |
| 10:00 | `Recordatorios Video Lab` | aprobaciones pendientes |
| 15:00 | `Platform Copy Queue` | descripciones por canal |
| 17:00 | `Watcher Higgsfield` | renders/jobs Video Lab |
| 21:00 | `Registro Hermes` | log/outbox |

Pendiente:

- Crear credencial Notion en n8n para sincronizar outbox.
- Conectar polling real de Higgsfield cuando exista API/MCP estable.

## Reglas de aprobacion
- Acciones sensibles requieren aprobacion explicita.
- La aprobacion debe mencionar la pieza, empresa u obligacion exacta.
- Respuestas ambiguas como `ok` o `dale` no son suficientes.

Formato valido:
- `Apruebo plan semanal: <pieza exacta>`
- `Apruebo contactar: <empresa>`
- `Confirmo impuesto: <obligacion> <fecha>`
- `Aprobar video <job_id>`
- `Publicar video <job_id>`

Formatos no validos: `ok`, `dale`, `hazlo`, `publica algo`.

## Variables recomendadas
Fuente de los IDs de Notion: `EXECUTION_PROTOCOL.md` (seccion "Confirmed Notion Sources").

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

Nota: este repo usa credenciales n8n (Header Auth / tipos nativos) en vez de
`$env` para secretos (ver regla del plan VPS en `CLAUDE.md`); esta lista es de
referencia para IDs no secretos y para cuando se agregue una credencial nueva.

## Comandos relacionados
- `Plan semanal ONIA`
- `Busca prospectos ONIA: <industria> | <ubicacion>`
- `Seguimientos ONIA hoy`
- `Recordatorios fiscales ONIA`
- `Resumen financiero ONIA`
- `Estado Video Lab`
- `Siguiente Video Lab`
- `Aprobar video <job_id>`
- `Video generado <job_id>: <url_video>`
- `Publicar video <job_id>`

## Telegram Command Center / Video Lab Router

Estado: activo en n8n con bot dedicado.

- Workflow: `ONIA - Telegram Command Center`
- ID: `vuicWsvh0hwqKhYs`
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/vuicWsvh0hwqKhYs`

Objetivo:

1. Recibir mensajes de Telegram como `Mapa proyectos ONIA`,
   `Genera video Sergio: ...`, `Siguiente Video Lab` o
   `Aprobar video <job_id>`.
2. Ejecutar en el VPS el router canonico:

```bash
hermes-command telegram --message "<mensaje>"
```

3. Devolver a Telegram el `telegram_reply`.

Para mensajes Video Lab, `hermes-command` llama internamente:

```bash
video-lab telegram --message "<mensaje>"
```

Estado de credenciales:

- Telegram: conectado con `Telegram account 2` y asignado explicitamente a los
  nodos de entrada/salida.
- SSH: conectado con `SSH Password account` en el nodo
  `Run Video Lab Router on VPS`.

Estado tecnico 2026-06-03:

- El workflow esta activo.
- El comando SSH esta preparado para capturar `stdout`, `stderr`, errores y
  responder por Telegram aunque Video Lab falle.
- La credencial SSH fue creada en n8n como `SSH Password account` y asignada al
  nodo `Run Video Lab Router on VPS`.
- Pruebas simuladas de workflow exitosas: ejecuciones n8n `7931` y `7966`.
- Version activa anterior: `dc53e0a6-b8fd-4345-b8e5-4656a704af23`.
- Version activa publicada 2026-06-06: `9c2d3776-ee6b-44d9-a36f-97ee9c40817f`.
- `Hermes Telegram Chat ID Capture` queda activo para operaciones/captura con
  el bot anterior. Video Lab usa bot separado para evitar conflicto de webhook.

Reglas:

- Este workflow solo enruta comandos y respuestas.
- No publica por si solo.
- No usa cara/voz de Sergio sin aprobacion.
- No reemplaza la aprobacion explicita `Aprobar video <job_id>` ni
  `Publicar video <job_id>`.

## Respuesta hacia Sergio

Telegram es la bandeja principal. Cada respuesta de Hermes debe incluir:

- `job_id` cuando exista;
- estado actual;
- hook;
- descripcion/caption resumida;
- siguiente comando exacto.

El dashboard se usa para revisar logs, lotes, estados y actividad.

## Registros recomendados
Guardar en Notion:
- reportes semanales;
- prospectos;
- seguimientos;
- obligaciones fiscales;
- decisiones de aprobacion;
- errores de automatizacion.
- estado de videos;
- URLs generadas;
- costos/creditos de Higgsfield cuando existan.

## Higgsfield

n8n no es obligatorio para crear los primeros videos. Video Lab puede manejar:

```text
brief -> aprobacion -> generacion -> URL -> revision -> publicacion
```

n8n se usa cuando hay repeticion:

- recordatorios;
- botones de aprobacion;
- polling de jobs Higgsfield;
- registro en Notion;
- calendario de contenido;
- notificaciones de revision.

n8n no debe saltarse aprobaciones.

## Daily Content Queue

Workflow recomendado diario:

1. Revisar Video Lab, plan semanal, proyectos Onia y oportunidades.
2. Proponer 1 pieza Sergio y 1 pieza Onia.
3. Crear captions y reutilizacion sugerida.
4. Enviar a Telegram con comandos exactos.
5. Crear jobs solo si Sergio aprueba.

Esto automatiza la organizacion, no la publicacion.

Referencia:

- `hermes-content/references/n8n-higgsfield-generation-flow.md`

## Platform Copy

Antes de publicar, n8n puede pedirle a Hermes un paquete:

```json
{
  "instagram_caption": "",
  "tiktok_description": "",
  "youtube_title": "",
  "youtube_description": "",
  "youtube_tags": [],
  "linkedin_copy": ""
}
```

Estado actual:

- Instagram conectado.
- TikTok pendiente de Content Posting API/OAuth/review.
- YouTube pendiente de Google OAuth y publisher script.

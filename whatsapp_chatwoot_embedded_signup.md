Relevamiento actual de integración WhatsApp + Embedded Signup (Chatwoot Onia)

1) Inbox WhatsApp existente (ID 5, "Onia WhatsApp")

- Tabla: public.inboxes
  - Fila relevante (medido en onia-chatbot → onia-chatbot DB):
    - id: 5
    - name: "Onia WhatsApp"
    - channel_id: 3
    - channel_type: "Channel::Whatsapp"
    - account_id: 2
    - enable_auto_assignment: true (t)
    - working_hours_enabled: false (f)
    - created_at: 2026-08-06 14:31:00.760646
    - updated_at: 2026-09-03 16:40:15.092166

- Relación con canal WhatsApp:
  - Tabla: public.channel_whatsapp (\d+ channel_whatsapp)
    - Columnas clave:
      - id (bigint, PK)
      - account_id (integer, NOT NULL)
      - phone_number (varchar, NOT NULL, UNIQUE)
      - provider (varchar, default 'default')
      - provider_config (jsonb, default '{}')
      - message_templates (jsonb, default '{}')
      - message_templates_last_updated (timestamp)

  - Fila actual (única) en channel_whatsapp (medido):
    - id: 3
    - account_id: 2
    - phone_number: +591****4930
    - provider: "whatsapp_cloud"
    - provider_config (JSONB):
      - api_key: EAAPVT5... (token largo de Meta, real en DB)
      - phone_number_id: "1283320641524523"
      - business_account_id: "4429061034078857"
      - webhook_verify_token: "5d4323cd219b4c0f6d5d24fae19f3f0f"
    - message_templates (JSONB): tres plantillas aprobadas en Meta Business:
      1) confirmacion_cita (UTILITY, es)
         - id: "1839846374092184"
         - body: "¡Hola {{1}}! Confirmamos tu cita en Onia para el {{2}}. ..."
      2) seguimiento_demo (MARKETING, es)
         - id: "1035658146014782"
         - body: "¡Hola de nuevo! Te escribí por la demo de Onia y quedó a medias ..."
      3) recordatorio_demo (UTILITY, es)
         - id: "1775176786814174"
         - body: "¡Hola! Te recuerdo tu demo de Onia: *{{1}}*... Entrás desde acá: {{2}} ..."
    - message_templates_last_updated: 2026-09-03 16:40:12.744819

- Relación inbox ↔ canal:
  - inboxes.channel_type = 'Channel::Whatsapp'
  - inboxes.channel_id = channel_whatsapp.id = 3
  - Ambos comparten account_id = 2 (cuenta "Onia" de Chatwoot, no se releva en detalle acá).

- Conclusión: Hoy hay una sola inbox WhatsApp real en el sistema, ID 5, basada en WhatsApp Cloud API, acoplada al número +591****4930 y a un único WABA (business_account_id 4429...).

2) Estado de Embedded Signup de Meta en Chatwoot

2.1. Feature flags y capacidades declaradas

- Archivo: /app/config/features.yml (en contenedor chatwoot v4.12.1)
  - Entrada relevante (medido vía docker exec + sed):
    - name: whatsapp_embedded_signup
    - display_name: "WhatsApp Embedded Signup"
    - enabled: false
    - deprecated: true

- Implicancia: el código de Chatwoot conoce el feature "whatsapp_embedded_signup", pero en esta versión/instalación:
  - Está DESACTIVADO (enabled: false).
  - Está MARCADO como DEPRECATED por el propio proyecto Chatwoot.

2.2. Configuración de instalación (installation_configs)

- Archivo de referencia: /app/config/installation_config.yml (sección WhatsApp Channel)
  - Variables definidas:
    - WHATSAPP_APP_ID
    - WHATSAPP_CONFIGURATION_ID
    - WHATSAPP_APP_SECRET
    - WHATSAPP_API_VERSION (valor por defecto 'v22.0')

- Tabla real: public.installation_configs (medido en DB onia-chatbot)
  - Fila para WHATSAPP_APP_ID (grep sobre log de \"SELECT * FROM installation_configs\"):
    - value: '1078962684709749'
  - Fila para WHATSAPP_CONFIGURATION_ID:
    - value: '1824225392073753'
  - Fila para WHATSAPP_APP_SECRET:
    - (valor real presente, oculto aquí por seguridad; existe en DB)
  - Fila para WHATSAPP_API_VERSION:
    - value: 'v22.0'

- Conclusión parcial:
  - La instancia de Chatwoot de Onia tiene configurados en installation_configs:
    - App ID de Facebook para WhatsApp
    - Configuration ID de Embedded Signup
    - App Secret
    - Versión de la API de WhatsApp Cloud
  - Esto indica que la parte de credenciales de Embedded Signup está cargada, aunque el feature flag global whatsapp_embedded_signup está en false y deprecated.

2.3. Endpoints y rutas relacionadas

- Archivo: /app/config/routes.rb (grep 'whatsapp')
  - Rutas globales de webhook de WhatsApp Cloud:
    - GET  /webhooks/whatsapp/:phone_number   → webhooks/whatsapp#verify
    - POST /webhooks/whatsapp/:phone_number   → webhooks/whatsapp#process_payload

- Namespaces de dashboard relacionados a canales WhatsApp (no se listan completo por tamaño, pero están presentes en app/javascript/dashboard/...):
  - settings/inbox/settingsPage/ConfigurationPage.vue incluye sección "Embedded Signup Section" (comentada en template), con textos traducidos en i18n/inboxMgmt.json para múltiples idiomas, incluyendo es.

- Conclusión sobre capacidades de Embedded Signup hoy:
  - El código de Frontend tiene UI para Embedded Signup (sección en ConfigurationPage.vue e i18n), pero a nivel de backend el feature está:
    - Declarado como whatsapp_embedded_signup.
    - Marcado enabled: false, deprecated: true en features.yml.
  - A pesar de tener App ID, Configuration ID y App Secret cargados en installation_configs, la funcionalidad Embedded Signup no está activa por feature flag.
  - No se observan rutas específicas adicionales (tipo /integrations/whatsapp/embedded_signup/callback) en el fragmento consultado; la integración principal usa los webhooks estándar de WhatsApp Cloud.

3) Cómo se crea hoy la inbox WhatsApp

3.1. Evidencia en base de datos

- No hay múltiples filas en channel_whatsapp: sólo id=3, asociada a account_id=2.
- inboxes.id=5 (Onia WhatsApp) referencia explícitamente channel_id=3.
- Esto sugiere una creación manual o única (no automatizada por flujo multi-tenant):
  - Paso 1: Configurar instalación_configs con App ID, Configuration ID, App Secret, API_VERSION.
  - Paso 2: Crear cuenta (accounts) e inbox base.
  - Paso 3: Crear channel_whatsapp con provider_config completo (api_key, phone_number_id, business_account_id, webhook_verify_token) copiados desde Meta Business.
  - Paso 4: Asociar inbox.id=5 a channel_whatsapp.id=3 vía inboxes.channel_id/channel_type.
  - Paso 5: Sincronizar plantillas (message_templates) desde la API de Meta y guardarlas en channel_whatsapp.message_templates.

3.2. Dónde podría estar el código de creación

- Repositorio Chatwoot dentro del contenedor /app incluye:
  - app/models/channel/whatsapp.rb
  - app/controllers/api/v1/accounts/whatsapp_inboxes_controller.rb
  - app/javascript/dashboard/routes/dashboard/settings/inbox/... (pantallas de config).
- No se encontró, en este relevamiento, ningún script específico de Onia en el repo onia-hermes que cree inboxes WhatsApp adicionales ni seeds personalizados para WhatsApp:
  - Búsqueda en /root/loops/onia-hermes de 'whatsapp' y 'chatwoot' dio 0 resultados.
- Esto apoya la hipótesis de que la inbox actual se creó usando el propio panel de Chatwoot (UI estándar) o rails console dentro de Chatwoot, no con código personalizado en onia-hermes.

- Conclusión sobre creación actual:
  - La creación de la inbox WhatsApp 5 está acoplada a la cuenta única de Onia en Chatwoot (account_id=2) y se realizó una sola vez.
  - No existe hoy un flujo repetible en el código de Onia para crear nuevas inboxes WhatsApp por cliente.

4) Pantallas y endpoints de panel relacionados con WhatsApp

4.1. Pantallas del panel (frontend)

- Archivo: app/javascript/dashboard/routes/dashboard/settings/inbox/settingsPage/ConfigurationPage.vue
  - Contiene, entre otras secciones, comentarios "<!-- Embedded Signup Section -->" que agrupan la UI para:
    - Mostrar que un inbox está conectado vía Embedded Signup.
    - Permitir la conexión/upgrade a Embedded Signup.
  - El texto y labels se definen en app/javascript/dashboard/i18n/locale/*/inboxMgmt.json, bajo claves como:
    - WHATSAPP_EMBEDDED_SIGNUP_TITLE
    - WHATSAPP_EMBEDDED_SIGNUP_SUBHEADER
    - WHATSAPP_CONNECT_SUBHEADER

- Rutas de dashboard relevantes (configuradas en dashboard/routes/dashboard.routes.js y rutas hijas):
  - /app/accounts/:accountId/settings/inboxes (listado de inboxes)
  - /app/accounts/:accountId/settings/inboxes/:inboxId (detalles y configuración de un inbox, incluyendo WhatsApp)

4.2. Endpoints backend

- API típica de Chatwoot para WhatsApp (derivado de estructura de proyecto v4.12.1):
  - POST /api/v1/accounts/:account_id/whatsapp/inboxes
  - GET/PUT /api/v1/accounts/:account_id/inboxes/:id (incluye campos de channel_whatsapp vía serializers)
  - GET/POST de webhooks en /webhooks/whatsapp/:phone_number (ver sección 2.3)

- En este relevamiento no se inspeccionó cada controller en detalle, pero la presencia de channel_whatsapp y de las rutas de webhook confirman que:
  - El backend soporta WhatsApp Cloud como canal.
  - La integración actual se basa en un único phone_number_id y WABA.

5) Qué es reutilizable para múltiples clientes vs qué está acoplado a la inbox actual

5.1. Reutilizable para múltiples clientes

- Estructura de base de datos de Chatwoot:
  - Tablas inboxes, channel_whatsapp, contacts, conversations, messages, etc., son multi-account y multi-inbox por diseño.
  - La lógica de webhooks /webhooks/whatsapp/:phone_number está preparada para recibir mensajes de distintos phone_number (path param).
- Configuración global de WhatsApp Cloud:
  - WHATSAPP_APP_ID, WHATSAPP_APP_SECRET, WHATSAPP_API_VERSION son comunes a la app de Facebook que Onia controla.
  - WHATSAPP_CONFIGURATION_ID puede usarse con Embedded Signup para generar nuevos phone_number_id/WABA bajo la misma app.
- Frontend de Chatwoot:
  - Pantallas de configuración de inbox WhatsApp y textos de Embedded Signup son genéricos (no mencionan Onia); sirven para cualquier tenant de Chatwoot.

5.2. Acoplado hoy a la única inbox actual

- provider_config en channel_whatsapp.id=3:
  - api_key es el token de acceso de un único WABA/phone number.
  - phone_number_id y business_account_id corresponden a un solo número de WhatsApp de Onia.
  - webhook_verify_token es único de esa configuración.
- message_templates en channel_whatsapp.id=3:
  - Las plantillas son específicas del caso de uso Onia (confirmación de cita, seguimiento demo, recordatorio demo) y no sirven tal cual para otros clientes.
- account_id=2 + inbox_id=5:
  - Toda la conversación actual de WhatsApp entra en la misma cuenta y mismo inbox.
- Feature flag whatsapp_embedded_signup desactivado y deprecated:
  - Aunque la app tenga credenciales, hoy no hay un flujo oficial en el propio Chatwoot para que un cliente final se autoconecte vía Embedded Signup.
  - Cualquier flujo self-service nuevo va a tener que:
    - Leer installation_configs para usar App ID, Configuration ID y App Secret.
    - Hablar con la API de Meta Embedded Signup directamente desde Onia Platform (no desde un tenant genérico de Chatwoot Cloud).
    - Crear nuevas filas en channel_whatsapp + inboxes, asociadas a la cuenta correcta de Chatwoot que represente al cliente.

6) Resumen operativo para diseño de flujo self-service

- Punto de partida real (medido):
  - Una sola inbox WhatsApp (ID 5, Onia WhatsApp) en Chatwoot, ligada a channel_whatsapp.id=3 y account_id=2.
  - Configuración de WhatsApp Cloud para esa inbox vive en channel_whatsapp.provider_config y en installation_configs (App ID, Configuration ID, App Secret, API Version).
  - Embedded Signup está soportado en el código pero:
    - Feature flag whatsapp_embedded_signup está en false y deprecated.
    - No se usa hoy para conectar el número de Onia: la conexión actual está hecha con tokens/copias manuales.

- Para un flujo de conexión self-service por cliente, un desarrollador va a necesitar, a partir de este mapa:
  - Diseñar cómo representar cada cliente de Onia como una account en Chatwoot (o cómo mapear múltiples inboxes WhatsApp por account).
  - Consumir la API de Meta Embedded Signup usando WHATSAPP_APP_ID, WHATSAPP_CONFIGURATION_ID y WHATSAPP_APP_SECRET de installation_configs para obtener:
    - phone_number_id, business_account_id y api_key propios de cada cliente.
  - Crear programáticamente nuevas filas en channel_whatsapp (una por número/cliente) y nuevas inboxes con channel_type='Channel::Whatsapp'.
  - Configurar el webhook de Meta para cada número apuntando a /webhooks/whatsapp/:phone_number y guardar el verify_token en provider_config.
  - Opcional: sincronizar plantillas de mensajes de cada cliente y poblar message_templates.

Archivo generado: whatsapp_chatwoot_embedded_signup.md en este workspace.

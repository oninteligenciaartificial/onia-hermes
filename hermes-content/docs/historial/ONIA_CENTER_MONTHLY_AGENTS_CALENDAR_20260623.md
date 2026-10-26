# Onia Center Monthly Agents and Calendar Control 2026-06-23

## Decision

Onia Center debe tener agentes operativos internos que organicen el mes, pero
no deben actuar como autorizacion automatica.

Los agentes pueden:

- proponer tareas del mes;
- ordenar prioridades semanales;
- detectar bloqueos;
- preparar briefing diario/semanal/mensual;
- proteger el calendario personal de Sergio;
- sugerir ventanas de reunion;
- registrar faltantes de integraciones.

Los agentes no pueden:

- contactar clientes;
- publicar contenido;
- aprobar pagos, gastos, descuentos o comisiones;
- mover reuniones fuera de ventanas permitidas;
- exponer calendario privado;
- usar Higgsfield, IA premium o herramientas externas sin centro, brief y aprobacion;
- cambiar precios o reglas financieras.

## Agentes iniciales

- Agente CEO mensual: plan mensual, metas, riesgos y decisiones Sergio.
- Agente Ventas y CRM: leads, demos, seguimientos y tareas comerciales.
- Agente Entrega y Proyectos: DentalGest, GestiOS, Webs, Bolivian, chatbots y automatizaciones.
- Agente Calendario y Energia Sergio: levantarse, deep work, ventas, gym, novia, descanso y ventanas de reunion.
- Agente Finanzas y Fondo Onia: caja, Fondo Onia, pagos bloqueados, gastos y uso premium.
- Agente Contenido y Media Lab: ideas, guiones, Remotion e Higgsfield manual.
- Agente Self-hosted e Integraciones: Supabase, Cal, n8n, IA local, Dify, monitoring y collab.

## Modelo agregado

Tablas nuevas:

- `onia_center.operating_agents`
- `onia_center.agent_monthly_plans`
- `onia_center.calendar_connector_plans`

Reglas:

- RLS queda enabled y locked-by-default.
- Las entidades privadas usan `sergio_private`.
- Los planes guardan nombres de variables, no valores.
- Los agentes recomiendan y registran; Sergio aprueba.

## Calendario y conectores

Google Calendar es la fuente privada real de agenda.

Cal.com es la entrada publica controlada para clientes.

n8n es el ejecutor:

- lee Google Calendar;
- recibe booking de Cal;
- valida ventanas;
- crea eventos aprobados;
- notifica por Telegram;
- registra en Supabase/ONIA Center.

Telegram/AlfredHQ es el canal personal:

- `Plan Sergio hoy`
- `Puedo reunirme <dia> <hora>?`
- `Modo enfoque`
- `Modo gym`
- `Modo novia`
- `Estoy saturado`
- `Cierre Sergio`

## Variables requeridas

Solo nombres, no valores:

- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`
- `CALCOM_BASE_URL`
- `N8N_CALCOM_BOOKING_WEBHOOK_URL`
- `N8N_BASE_URL`
- `N8N_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `ONIA_CENTER_SUPABASE_URL`
- `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY`

## Orden de activacion

1. Aplicar migraciones de Onia Center en Supabase real.
2. Crear usuarios reales y RLS por roles/memberships.
3. Conectar Google Calendar server-side.
4. Desplegar Cal y abrir solo ventanas permitidas.
5. Importar workflows n8n de agenda, briefing y booking.
6. Conectar Telegram para comandos personales.
7. Activar agente mensual como briefing manual.
8. Despues conectar IA gateway/local model para generar tareas sugeridas.

## Ventanas protegidas

No se deben abrir a clientes:

- levantarse y plan CEO;
- trabajo profundo;
- almuerzo;
- gym;
- novia/vida personal;
- shutdown;
- dormir;
- bloques de saturacion o descanso.

## Estado actual

Preparado:

- modelo en TypeScript;
- UI de agentes en Onia Center;
- migraciones y seed;
- Google Calendar como conector explicito;
- planes de sincronizacion calendario;
- reglas de seguridad documentadas.

Pendiente:

- aplicar migraciones;
- cargar env vars reales en entorno seguro;
- Google OAuth;
- Cal deploy final;
- workflows n8n;
- Telegram bot operativo conectado a Onia Center;
- endpoint IA para generar tareas desde agentes.

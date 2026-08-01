# Onia Self-hosted Productivity Roadmap 2026

Estado: plan operativo para convertir el stack self-hosted en funciones reales
de productividad. No contiene secretos.
Actualizado: 2026-06-25 America/Caracas.

## Diagnostico

Onia ya tiene una base util: Supabase, n8n, Cal.com, Chatwoot, SearXNG,
LiteLLM, Open WebUI, Stirling PDF y Uptime Kuma. El error seria instalar mas
paneles sin que Onia Center los convierta en procesos.

La regla es:

```text
ONIA Center registra y muestra.
Hermes decide y resume.
n8n ejecuta automatizaciones.
Supabase guarda datos y auditoria.
LiteLLM/Open WebUI/Dify procesan IA.
Firecrawl/Crawl4AI/SearXNG investigan fuentes.
```

## Funciones P0 para productividad

| Funcion | Para que sirve | Stack | Salida esperada |
|---|---|---|---|
| Inbox universal de ideas | Guardar reels, links, notas y audios para revisar despues | Onia Center + Supabase + Telegram + n8n | Idea clasificada por proyecto, prioridad y siguiente accion |
| Agenda Sergio estricta | Evitar reuniones en gym, descanso, foco, novia y bloques de trabajo | Onia Center + Cal.com + Google Calendar + n8n | Disponibilidad real y alertas antes de romper rutina |
| CRM de ventas Onia | No perder leads, seguimientos ni llamadas | Onia Center + Supabase + n8n + Chatwoot | Pipeline con responsable, proxima accion y evidencia |
| Centro de tareas mensual | Agentes internos proponen tareas del mes y semana | Onia Center + Supabase + LiteLLM | Tareas por proyecto, responsable, fecha y estado |
| Auditor web rapido | Investigar web de prospecto y recomendar oferta | Firecrawl/Crawl4AI + SearXNG + n8n + Supabase | Diagnostico, riesgos, propuesta y checklist de venta |
| Formulario cliente a proyecto | Intake para webs, bots y automatizaciones | Onia Center forms + Supabase + n8n | Brief estructurado, cotizacion inicial y tareas |
| Alertas operativas | Avisar caidas, errores y pendientes criticos | Uptime Kuma + n8n + Telegram | Mensajes accionables, no ruido |

## Funciones P1 para escalar venta y entrega

| Funcion | Para que sirve | Stack | Nota |
|---|---|---|---|
| Generador de landings/webs | Crear brief, copy, sitemap y primera version desde formulario | Onia Center + Supabase + web-factory + Firecrawl | Requiere aprobacion humana antes de publicar |
| Centro de video Remotion | Subir assets, elegir guion y renderizar piezas | Onia Center + Remotion worker + Supabase Storage | Worker local/servidor con cola; no quemar tokens sin aprobacion |
| Higgsfield controlado | Crear prompts, costos, aprobaciones y resultados | Onia Center + n8n + Supabase | Solo si hay presupuesto por pieza/campana |
| Propuestas y PDFs | Generar/editar propuestas, contratos y reportes | Stirling PDF + plantillas Onia | Ideal para vendedores |
| Chatbot comercial interno | Responder dudas de servicios/precios sin exponer finanzas privadas | Open WebUI/Dify + Supabase docs | Base de conocimiento filtrada por rol |
| Dashboard vendedor | Tareas, leads, objeciones, ingresos y notas | Onia Center + Supabase RLS | Vendedor no ve utilidad interna ni capital |

## Funciones P2 cuando haya uso real

| Funcion | Para que sirve | Stack | Condicion |
|---|---|---|---|
| Langfuse | Trazas, costos y evaluacion de prompts | Langfuse + LiteLLM/Dify | Activar cuando IA tenga trafico real |
| Authentik/Authelia | SSO/forward auth para paneles internos | Traefik + Auth gateway | Antes de abrir mas dominios |
| Qdrant | Vector DB dedicada | Qdrant + Dify/Open WebUI | Solo si pgvector/Supabase no basta |
| Typebot | Formularios conversacionales embebibles | Typebot + n8n + Supabase | Si se vende como paquete |
| Listmonk | Campanas email | Listmonk + SMTP externo | Solo con dominio, DKIM, SPF, DMARC y unsubscribe |
| OpenHands | Agente dev continuo | VPS/worker aislado | Nunca en VPS productivo con secretos |

## Firecrawl decision

Firecrawl entra como capacidad P1 gated, no como servicio permanente.

Uso Onia:

- Auditorias web de prospectos.
- Extraccion de copy, estructura, FAQs y servicios de sitios publicos.
- Research de competidores.
- Alimentar briefs para Web Factory.
- Preparar datasets para agentes y RAG.

Restricciones:

- No scraping agresivo.
- No usar cuentas privadas ni sesiones de clientes sin aprobacion.
- No publicar el API.
- No modificar/rebrandear Firecrawl para venderlo como SaaS propio sin revisar
  AGPL-3.0.
- Arrancar solo en ventana de mantenimiento por consumo de API + Playwright.

Comando preparado:

```bash
cd /opt/onia-selfhosted
./install.sh prepare-firecrawl
```

## Workflows n8n recomendados

| Workflow | Trigger | Accion |
|---|---|---|
| `idea.capture.telegram` | Mensaje Telegram con link/nota | Guarda en Supabase, clasifica y agenda revision |
| `lead.audit.requested` | Nuevo lead con web | SearXNG/Firecrawl, resumen, score y siguiente accion |
| `meeting.booked` | Cal.com webhook | Crea tarea, contexto de cliente y recordatorio |
| `client.form.submitted` | Formulario Onia Center | Crea proyecto, checklist y brief |
| `daily.sergio.plan` | Cron diario | Resume agenda, foco, ventas y tareas criticas |
| `video.job.requested` | Nueva solicitud de video | Estima costo, pide aprobacion y bloquea tokens hasta aprobar |
| `service.health.alert` | Uptime Kuma webhook | Envia alerta por Telegram con runbook |

## Modelo de datos minimo en Onia Center

| Tabla | Uso |
|---|---|
| `ideas` | Links, notas, reels, audios, clasificacion y estado |
| `idea_reviews` | Revision por Codex/Claude/modelo local |
| `lead_audits` | Resultado de research web, score y recomendacion |
| `calendar_blocks` | Rutina Sergio, disponibilidad y restricciones |
| `automation_runs` | Ejecuciones n8n, errores, costo y evidencia |
| `ai_jobs` | Jobs de texto, video, web, research y estado |
| `web_briefs` | Formularios para clientes y specs de webs |
| `video_jobs` | Remotion/Higgsfield, aprobaciones, costo y output |
| `tool_usage` | Uso de herramientas premium por centro contable |

## Seguridad y permisos

- Sergio ve todo.
- Arthur y colaboradores ven solo tareas, leads, briefs y entregables asignados.
- Vendedores ven leads, scripts, objeciones, tareas y comisiones aprobables.
- Finanzas internas, capital, deudas, porcentajes privados y estrategia quedan
  solo en onia-hermes/Hermes privado.
- onia-hermes-collab recibe aportes revisables, nunca secretos ni finanzas
  sensibles.
- Todo cambio importante debe crear auditoria: quien, que, cuando, antes/despues.

## Orden de ejecucion

1. Dejar el stack estable: healthchecks, backups, restart policies y runbook.
2. Crear en Onia Center el Inbox de ideas y agenda Sergio.
3. Conectar Cal.com y Google Calendar por n8n.
4. Crear workflow `idea.capture.telegram`.
5. Crear workflow `lead.audit.requested` usando SearXNG primero y Firecrawl solo
   cuando se active ventana de research.
6. Crear formulario cliente para webs y automatizaciones.
7. Agregar cola de video Remotion/Higgsfield con aprobacion antes de gastar.
8. Agregar dashboard mensual de tareas/agentes por proyecto.

## Fuentes revisadas

- Firecrawl GitHub: https://github.com/firecrawl/firecrawl
- Firecrawl self-host: https://github.com/firecrawl/firecrawl/blob/main/SELF_HOST.md
- Firecrawl license: https://github.com/firecrawl/firecrawl/blob/main/LICENSE
- n8n docs: https://docs.n8n.io/
- Cal.diy docs: https://www.cal.diy/
- Dify Docker Compose: https://docs.dify.ai/en/self-host/quick-start/docker-compose

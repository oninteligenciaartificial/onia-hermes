# ONIA Self-hosted AI Tools Research 2026

Estado: investigacion operativa para implementacion gradual.
Fecha: 2026-06-19.

## Objetivo

Evaluar las 10 herramientas self-hosted de las capturas y convertirlas en un
plan realista para ONIA. No instalar todo por moda: instalar solo lo que ahorre
tiempo, ayude a vender, mejore entregas o cree capacidad interna.

Herramientas revisadas:

1. Langflow
2. Browser Use
3. Open WebUI
4. Supabase
5. Stirling PDF
6. Coolify
7. Crawl4AI
8. OpenHands
9. Maxun
10. Dify

## Decision ejecutiva corregida

Supabase no es una herramienta mas: es la capa de datos de ONIA.

La conclusion anterior fue demasiado conservadora en el orden. Para ONIA si
necesitamos un stack self-hosted mas amplio, pero dividido por capas. El error
seria instalar muchas apps sueltas sin una arquitectura comun.

No conviene instalar las 10 herramientas de las capturas como paneles publicos
en el VPS de produccion actual. Si conviene construir una plataforma interna
self-hosted con Supabase como base.

ONIA ya tiene una base self-hosted:

- VPS activo.
- Easypanel/Traefik activo.
- n8n productivo.
- Supabase self-hosted privado/local-only.
- Cal.com self-hosted temporal.
- Ollama/Qwen pequeno documentado para laboratorio.

La mejor estrategia actualizada es:

1. Consolidar Supabase como base privada compartida.
2. Instalar la capa IA vendible: Dify + Open WebUI + LiteLLM.
3. Instalar la capa de datos/research: Crawl4AI + SearXNG + Qdrant si hace falta.
4. Instalar la capa comercial/operativa: Chatwoot/Typebot, PDF, monitoreo y secretos.
5. Dejar agentes peligrosos en worker o VPS aislado: OpenHands, Browser Use y Maxun.

## Prioridad recomendada

| Prioridad | Herramienta | Decision ONIA | Motivo |
|---|---|---|---|
| P0 | Supabase | Ya activo, consolidar | Base privada compartida para datos, auditoria, CRM, bookings, proyectos, storage y funciones server-side. |
| P0 | n8n | Ya activo, endurecer | Orquestador de procesos, webhooks, avisos, ETL y ventas. |
| P0 | Backups/monitoring | Instalar/validar | Sin monitoreo y backups probados, el stack crece con riesgo. |
| P1 | Dify | Instalar interno/single-workspace | Apps IA, chatbots, RAG y demos vendibles. Pieza comercial central. |
| P1 | Open WebUI | Instalar interno | Interfaz privada para prompts, modelos, RAG y pruebas con Ollama/API. |
| P1 | LiteLLM | Instalar proxy interno | Gateway OpenAI-compatible para controlar llaves, costos, modelos y limites. |
| P1 | Crawl4AI | Instalar interno/API | Crawler util para research, leads, fuentes, contenido y agentes. Debe ser privado. |
| P1 | Stirling PDF | Instalar interno | Utilidad inmediata para PDFs de ventas, contratos, reportes y clientes. Bajo riesgo si se protege con login. |
| P1 | Uptime Kuma | Instalar interno | Healthchecks simples para Cal, n8n, Supabase, webs y futuros servicios. |
| P2 | Langfuse | Instalar cuando haya uso IA real | Observabilidad, trazas, prompts y evaluacion de apps IA. |
| P2 | Qdrant | Instalar si pgvector no alcanza | Vector DB dedicada para RAG pesado o multiples clientes. |
| P2 | SearXNG | Instalar interno | Busqueda privada/metasearch para Open WebUI, Hermes y research. |
| P2 | Chatwoot | Instalar si vamos a centralizar WhatsApp/webchat | Inbox comercial, soporte y conversaciones multi-canal. |
| P2 | Typebot | Instalar si venderemos formularios conversacionales | Flujos conversacionales embebibles y lead qualification. |
| P2 | Infisical o Authentik | Evaluar/instalar | Secret management o SSO antes de abrir muchos paneles. |
| P2 | Langflow | Laboratorio | Buena licencia MIT y flujo visual para prototipos de agentes/RAG. Se solapa con Dify/n8n. |
| P2 | Browser Use | Worker, no app publica | Libreria para agentes que usan web. Mejor integrarla en scripts/Hermes/n8n, no exponerla como web publica. |
| P3 | Maxun | Laboratorio scraping | No-code scraping interesante, pero pesado, AGPL y con riesgo legal/ToS si se usa mal. |
| P3 | OpenHands | Solo VPS aislado/local | Puede modificar archivos y ejecutar comandos. No debe vivir en VPS productivo abierto. |
| P3 | Coolify | No instalar ahora | Ya usamos Easypanel/Traefik. Instalar Coolify en el mismo VPS puede duplicar responsabilidades y romper rutas. |
| P3 | MinIO | Evaluar solo si storage S3 dedicado | Supabase Storage puede cubrir primero; MinIO agrega complejidad y AGPL. |
| P3 | Grafana/Prometheus | Evaluar despues de Uptime Kuma | Metricas profundas; util, pero mas pesado que monitoreo simple. |
| P3 | PostHog/Sentry self-hosted | Evaluar, no instalar primero | Valiosos para producto/errores, pero pesados para VPS actual. |

## Stack ampliado necesario para ONIA

### Capa 1 - Datos y backend

| Herramienta | Rol | Estado recomendado |
|---|---|---|
| Supabase | Postgres, Auth, Storage, Realtime, Functions, Studio | P0 consolidar |
| n8n | Orquestacion, webhooks, ETL, tareas, notificaciones | P0 endurecer |
| Qdrant | Vector DB dedicada para RAG grande | P2 condicional |
| MinIO | Object storage S3 compatible | P3 condicional |
| Directus/NocoDB | Admin visual sobre bases de datos | P3 evaluar, no abrir sobre Supabase privado todavia |

### Capa 2 - IA y agentes

| Herramienta | Rol | Estado recomendado |
|---|---|---|
| Dify | Apps IA, RAG, chatbots, APIs y demos vendibles | P1 |
| Open WebUI | Cockpit interno para modelos/prompts/RAG | P1 |
| LiteLLM | Gateway de modelos, llaves, costos y limites | P1 |
| Langfuse | Observabilidad, prompts, trazas y evaluacion LLM | P2 |
| Langflow | Prototipos visuales de agentes/pipelines | P2 |
| OpenHands | Agente de codigo | P3 aislado |
| Browser Use | Agente navegador | P2 worker privado |

### Capa 3 - Research, scraping y conocimiento

| Herramienta | Rol | Estado recomendado |
|---|---|---|
| Crawl4AI | Crawler API/MCP para fuentes, RAG y auditorias | P1 |
| Firecrawl | Search/scrape/crawl/interact/agent para research web | P1 gated |
| SearXNG | Busqueda privada/metasearch | P2 |
| Maxun | Robots visuales de scraping | P3 laboratorio |
| Docmost/Outline | Wiki interno si Notion deja de ser suficiente | P3, no urgente |

### Capa 4 - Comercial y clientes

| Herramienta | Rol | Estado recomendado |
|---|---|---|
| Cal.com | Reservas y reuniones | Activo temporal, completar |
| Chatwoot | Inbox de WhatsApp/web/email/Instagram | P2 si centralizamos conversaciones |
| Typebot | Formularios/chatbots conversacionales embebibles | P2 si vendemos lead qualification |
| Stirling PDF | PDFs, propuestas, contratos, OCR | P1 |
| PostHog | Producto, analytics, funnels, replay | P3 cuando haya uso real de SaaS |

### Capa 5 - Operaciones, seguridad y observabilidad

| Herramienta | Rol | Estado recomendado |
|---|---|---|
| Uptime Kuma | Monitoreo simple y status | P1 |
| Grafana/Prometheus | Metricas de servidor/contenedores | P3 despues |
| Sentry self-hosted | Error tracking propio | P3, pesado; usar cloud o proyecto puntual primero |
| Infisical | Secret management | P2 cuando haya mas servicios/operadores |
| Authentik/Authelia | SSO/forward auth para paneles internos | P2 antes de abrir muchos dominios |

## Que tenemos hoy

### Confirmado en repo/VPS

- `COORDINATION_MANIFEST.md` confirma Supabase self-hosted en:
  `/opt/onia-supabase/supabase/docker`.
- Supabase esta intencionalmente privado/local-only:
  - Kong/API: `127.0.0.1:54321` y `127.0.0.1:54322`.
  - Supavisor/Postgres: `127.0.0.1:54329` y `127.0.0.1:54320`.
  - Sin DNS publico.
- Backups Supabase:
  - `/root/.hermes/scripts/supabase_backup.sh`.
  - Cron: `/etc/cron.d/onia-supabase-backup`.
  - Target: `/root/backups/supabase`.
- `hermes-content/docs/ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026.md` ya recomienda
  instalar despues:
  `LiteLLM -> Open WebUI -> registro de runs en Supabase -> workflow n8n`.
- `hermes-content/docs/ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md` documenta el
  precedente de deploy self-hosted con Docker Compose, Traefik y Supabase como
  capa privada de auditoria.

### Confirmado en Notion

La busqueda en Notion no encontro registros especificos de estas 10 herramientas.
La herramienta de query directa a la base `SaaS & Herramientas` fallo con
`notion-query-data-sources not found`, por lo que Notion queda como pendiente de
revision posterior.

## Arquitectura base recomendada

```text
Internet publico
  -> Traefik/Easypanel
  -> solo servicios aprobados con auth fuerte

Red interna ONIA
  -> Supabase privado
  -> n8n
  -> LiteLLM
  -> Dify
  -> Open WebUI
  -> Stirling PDF
  -> Crawl4AI
  -> SearXNG / Qdrant / Langfuse segun uso
  -> Langflow laboratorio

Servicios peligrosos
  -> OpenHands / Browser Use / Maxun
  -> solo red aislada, worker privado o VPS separado
```

Regla: ninguna herramienta con navegador, agentes, ejecucion de codigo o scraping
debe quedar publica sin autenticacion, rate limit, logs y aislamiento.

## Herramientas

### 1. Langflow

Uso:

- Constructor visual de agentes, workflows, RAG y pipelines con componentes.
- Bueno para prototipar flujos IA que luego se vuelven API o automatizacion.

Implementacion:

- Docker simple: `langflowai/langflow`.
- Para ONIA usar Docker Compose con Postgres persistente, no SQLite temporal.
- Dominio sugerido: `langflow.onia.ai`, pero solo interno o protegido.

Valor para ONIA:

- Crear prototipos rapidos de asistentes para DentalGest, Gesti-OS, Web Factory
  o ventas.
- Documentar logicamente flujos antes de pasarlos a codigo/n8n.

Riesgos:

- Se solapa con Dify y n8n.
- Si se deja abierto, cualquiera podria crear flujos con llaves/modelos.

Decision:

- P2 laboratorio. Instalar solo despues de Dify/Open WebUI si necesitamos
  prototipos visuales que n8n o Dify no resuelvan bien.

### 2. Browser Use

Uso:

- Libreria Python para que agentes usen sitios web con navegador.
- Sirve para rellenar formularios, buscar datos, navegar paneles y automatizar
  acciones web.

Implementacion:

- No es principalmente un SaaS con dashboard self-hosted.
- Instalar como worker Python privado con Playwright/Chromium.
- Integrar con Hermes, n8n o scripts especificos.

Valor para ONIA:

- Prospeccion asistida.
- Recoleccion de datos de sitios donde una API no existe.
- Automatizaciones internas puntuales con supervision humana.

Riesgos:

- Puede violar terminos de sitios si se usa para scraping agresivo.
- Maneja sesiones y cookies; no guardar perfiles reales sin cifrado y control.
- En produccion puede consumir bastante RAM/CPU por navegador.

Decision:

- P2 como worker privado, no app publica.

### 3. Open WebUI

Uso:

- Interfaz self-hosted para modelos locales y OpenAI-compatible.
- Soporta Ollama y APIs externas.
- Sirve como cockpit interno para prompts, RAG, pruebas y herramientas.

Implementacion:

- Docker con volumen persistente `open-webui:/app/backend/data`.
- No exponer publico al inicio.
- Conectar:
  - Ollama local/privado.
  - OpenAI-compatible gateway si luego instalamos LiteLLM.
  - Supabase para registrar runs solo via backend/n8n, no desde browser directo.

Valor para ONIA:

- Punto unico para probar prompts, asistentes y modelos.
- Equipo/vendedores pueden usar IA interna sin tocar APIs.
- Base para entrenar procesos comerciales y soporte.

Riesgos:

- Licencia permite uso, pero restringe remover o alterar branding Open WebUI en
  despliegues/distribuciones salvo condiciones o licencia enterprise.
- Si se expone publico sin auth, filtra prompts, archivos y llaves.

Decision:

- P1 instalar interno, idealmente detras de LiteLLM para no repartir llaves de
  modelos en varias herramientas.

### 4. Supabase

Uso:

- Postgres + Auth + Storage + Realtime + Edge Functions + Studio.
- Para ONIA es la capa privada de datos compartidos.

Estado actual:

- Ya esta instalado self-hosted en VPS.
- Privado/local-only.
- Backups diarios documentados.

Valor para ONIA:

- Datos operativos de ONIA.
- CRM, bookings, Web Factory, auditorias, dashboards, automatizaciones.
- Fuente server-side para n8n y servicios internos.

Riesgos:

- Exponer Supabase privado directamente al navegador seria error grave hasta
  definir RLS, anon policies, dominios y gateway.
- Requiere backups probados, no solo cron configurado.

Decision:

- P0 consolidar, no reinstalar.

### 5. Stirling PDF

Uso:

- Plataforma web self-hosted para editar, unir, separar, firmar, redactar,
  OCR, convertir y automatizar PDFs.

Implementacion:

- Docker `stirlingtools/stirling-pdf:latest`.
- Volumen persistente para configs/logs/pipelines/OCR.
- Activar login si hay acceso desde dominio.
- Dominio sugerido: `pdf.onia.ai`.

Valor para ONIA:

- Preparar PDFs para vendedores.
- Unir propuestas, firmar, redactar documentos y convertir archivos de clientes.
- Servicio interno rapido para auditorias y documentos.

Riesgos:

- Si no se activa login, cualquiera podria subir documentos.
- Revisar licencia exacta si se usan componentes `proprietary/`, `saas/`,
  `engine/` o paquetes pagos. El core fuera de esas carpetas declara MIT.

Decision:

- P1 instalar interno. Bajo riesgo y utilidad inmediata.

### 6. Coolify

Uso:

- PaaS self-hosted tipo Heroku/Vercel/Netlify para desplegar apps, bases y
  servicios desde Git/Docker.

Implementacion:

- Instalacion recomendada por script oficial en servidor Linux con SSH.
- Requisitos minimos oficiales: 2 CPU, 2 GB RAM, 30 GB.
- Mejor en servidor fresco para evitar conflictos.

Valor para ONIA:

- Deploys mas ordenados de proyectos si dejamos Easypanel.
- Puede servir para un VPS nuevo dedicado a apps de clientes.

Riesgos:

- ONIA ya tiene Easypanel/Traefik activo. Montar Coolify encima del mismo VPS
  duplica proxy, certificados, redes y responsabilidad operativa.
- Migrar sin plan puede romper n8n, Supabase, Cal o dominios.

Decision:

- P3 no instalar ahora. Evaluar solo para VPS nuevo o migracion controlada.

### 7. Crawl4AI

Uso:

- Crawler/scraper LLM-friendly.
- Convierte sitios en Markdown/HTML estructurado, screenshots, PDFs y datos para
  agentes/RAG.
- Expone API y MCP en modo self-host.

Implementacion:

- Docker `unclecode/crawl4ai`.
- Puerto interno sugerido: `11235`.
- Desde v0.9.x el servidor es mas seguro por defecto: autenticacion, loopback y
  limites de confianza mas estrictos.
- Mantener API key y tokens fuera del repo.

Valor para ONIA:

- Research de mercado y competidores.
- Extraccion de contenido para propuestas y auditorias.
- Alimentar RAG/documentacion de clientes.
- Fuente para Hermes sin depender de scraping manual.

Riesgos:

- Scraping debe respetar terminos, robots, rate limits y datos personales.
- No usar con credenciales reales de clientes sin aprobacion.
- No exponer publico.

Decision:

- P1 instalar interno/API. Muy util para Hermes.

### 8. OpenHands

Uso:

- Agentes de desarrollo que escriben codigo, ejecutan comandos y trabajan en
  repositorios.

Implementacion:

- Puede correr local, Docker, VM o backend propio.
- Debe usar sandbox Docker y volumenes controlados.
- La propia documentacion advierte que cualquier ruta montada read-write puede
  ser modificada por el agente.

Valor para ONIA:

- Automatizar tareas de codigo, revisiones, issues y mantenimiento.
- Puede complementar Codex/Claude si se configura como worker especializado.

Riesgos:

- Alto riesgo operativo: ejecucion de comandos, cambios de archivos, acceso a
  tokens si se montan mal.
- No debe vivir en el VPS productivo con acceso a `/opt`, Docker socket,
  backups o secretos.

Decision:

- P3 solo en VPS aislado, maquina local o entorno de laboratorio. No publico.

### 9. Maxun

Uso:

- Plataforma no-code para crear robots de scraping/crawling y convertir sitios
  en datos/API.

Implementacion:

- Docker Compose con Postgres, Redis, MinIO, backend y frontend.
- Requiere reverse proxy para produccion.
- Usa navegador/Playwright y puede necesitar 4 GB RAM para backend.

Valor para ONIA:

- Scraping visual para personas no tecnicas.
- Potencial para vendedores: crear listas, investigar negocios, extraer datos
  publicos.

Riesgos:

- Licencia AGPL-3.0: cuidado si se modifica o se ofrece como servicio.
- Scraping tiene riesgo legal/ToS.
- Puede consumir recursos y sesiones autenticadas.

Decision:

- P3 laboratorio. Preferir Crawl4AI primero para control tecnico.

### 10. Dify

Uso:

- Plataforma para desarrollar apps IA, chatbots, workflows agenticos y RAG.
- Incluye API, worker, web, plugin daemon, vector DB, Postgres, Redis, nginx,
  sandbox y SSRF proxy en Docker Compose.

Implementacion:

- Docker Compose oficial.
- Requisitos minimos oficiales: 2 CPU, 4 GB RAM.
- En produccion necesita dominios, SMTP, almacenamiento, backups y revision de
  modelo/vector DB.

Valor para ONIA:

- Construir chatbots internos o demos de IA rapido.
- Probar asistentes por vertical: DentalGest, Gesti-OS, Hato/Ganadero.
- Exponer una app IA como API o iframe si el alcance es interno/single-tenant.

Riesgos:

- Licencia modificada: permite uso comercial, pero requiere licencia comercial
  para multi-tenant y restringe remover/modificar logo/copyright del frontend.
- Pesado: varios servicios y superficie de seguridad.
- Se solapa con Langflow y n8n.

Decision:

- P1 instalar interno/single-workspace. No usar como SaaS multi-cliente de ONIA
  sin revisar licencia comercial, rebranding y aislamiento por cliente.

## Herramientas adicionales investigadas

Estas no estaban en las capturas, pero si forman parte de un stack serio para
ONIA.

| Herramienta | Para que sirve | Cuando instalar | Riesgo principal |
|---|---|---|---|
| n8n | Automatizaciones, webhooks, ventas, ETL, avisos | Ya activo; endurecer como P0 | Workflows rotos sin logs/retries/backups |
| LiteLLM | Gateway OpenAI-compatible para llaves, modelos, costos y limites | P1 antes de conectar muchas apps IA | Si queda publico, expone gasto y llaves |
| Langfuse | Trazas, prompts, evaluacion y costos LLM | P2 cuando Dify/Open WebUI tengan uso real | Agrega Postgres/ClickHouse/Redis y operacion |
| Qdrant | Vector DB dedicada para RAG grande | P2 solo si pgvector/Supabase no alcanza | Mas storage, backups y tuning |
| SearXNG | Busqueda privada/metasearch para research y agentes | P2 interno | Bloqueos/rate limits si se abusa |
| Chatwoot | Inbox para WhatsApp, webchat, email y soporte | P2 si ONIA centraliza conversaciones | WhatsApp oficial requiere setup y costos Meta/BSP |
| Typebot | Formularios conversacionales y lead qualification | P2 si lo vamos a vender/embeber | Puede duplicar flujos con Dify/Chatwoot |
| Uptime Kuma | Monitoreo simple y status checks | P1 inmediato | No reemplaza observabilidad profunda |
| Infisical | Gestion de secretos y rotacion | P2 al crecer el equipo/servicios | Mala configuracion centraliza demasiado riesgo |
| Authentik/Authelia | SSO/forward auth para paneles internos | P2 antes de abrir muchos dominios | Bloqueo de acceso si se configura mal |
| Directus/NocoDB | Admin visual/API sobre bases de datos | P3 solo para casos puntuales | Abrir Supabase a admins visuales puede romper datos |
| MinIO | Storage S3 compatible | P3 si Supabase Storage no basta | AGPL/operacion extra y backups separados |
| Grafana/Prometheus | Metricas profundas de servidor/contenedores | P3 despues de Uptime Kuma | Mas complejo que lo necesario al inicio |
| PostHog | Product analytics, funnels y session replay | P3 para SaaS con usuarios reales | Self-host es pesado; cloud puede ser mejor al inicio |
| Sentry self-hosted | Error tracking propio | P3 solo si hay razon fuerte | Self-host pesado; cloud suele ser mas eficiente |
| Docmost/Outline | Wiki/documentacion interna | P3 si Notion no basta | Otro sistema que mantener |

## Orden de implementacion recomendado

### Fase 0 - Consolidar base P0

1. Revisar salud del VPS: RAM, swap, disco, Docker y contenedores activos.
2. Confirmar que Supabase no solo tiene cron de backup, sino restore probado.
3. Definir schemas base en Supabase para:
   - CRM/leads;
   - bookings;
   - auditorias;
   - proyectos/clientes;
   - runs IA/logs operativos.
4. Endurecer n8n:
   - workflows con logs;
   - retries;
   - credenciales fuera del repo;
   - backup/export de workflows.
5. Instalar o activar monitoreo simple con Uptime Kuma.
6. Definir auth base para paneles internos:
   - BasicAuth/SSO/VPN;
   - no publicar paneles sin login;
   - no puertos directos fuera de Traefik/Easypanel.

### Fase 1 - Capa IA vendible

1. LiteLLM como gateway interno de modelos y llaves.
2. Open WebUI como cockpit interno para equipo, prompts y pruebas.
3. Dify como constructor de apps IA, chatbots y RAG vendibles.
4. Registro server-side en Supabase/n8n:
   - cliente;
   - caso de uso;
   - costo estimado;
   - modelo usado;
   - estado/errores.

Regla: Dify puede vender demos y soluciones internas, pero no debe ofrecerse
como SaaS multi-cliente/rebrandeado sin revisar licencia y aislamiento.

### Fase 2 - Datos, research y documentos

1. Crawl4AI como API interna para research, auditorias y fuentes RAG.
2. SearXNG si necesitamos busqueda privada para agentes/Open WebUI.
3. Stirling PDF para propuestas, contratos, OCR y reportes.
4. Qdrant solo si Supabase/pgvector no alcanza para RAG o volumen.

### Fase 3 - Comercial y atencion

1. Completar Cal.com en `cal.onia.ai`.
2. Evaluar Chatwoot si vamos a centralizar WhatsApp/webchat/email.
3. Evaluar Typebot si vamos a vender formularios conversacionales o lead
   qualification embebible.
4. Conectar todo a Supabase/n8n para no perder leads ni seguimientos.

### Fase 4 - Seguridad y observabilidad

1. Infisical si vamos a compartir/rotar secretos entre varios servicios o
   operadores.
2. Authentik/Authelia antes de abrir muchos paneles internos por dominio.
3. Langfuse cuando ya haya consumo real en Dify/Open WebUI.
4. Grafana/Prometheus despues de Uptime Kuma, si los problemas de recursos lo
   justifican.

### Fase 5 - Workers y laboratorios de riesgo

1. Browser Use como worker privado, no panel publico.
2. Maxun solo si un flujo visual de scraping ahorra trabajo real.
3. OpenHands solo local/VPS aislado.
4. Coolify solo en VPS nuevo o migracion planificada desde Easypanel.

Toda automatizacion con sitios externos debe tener objetivo legitimo, limite de
frecuencia, aprobacion humana si usa una cuenta/sesion y registro en
Supabase/n8n.

## Dominios sugeridos

| Servicio | Dominio sugerido | Publico? | Comentario |
|---|---|---|---|
| Cal | `cal.onia.ai` | Si | Para reservas, ya en proceso. |
| Supabase | sin DNS publico | No | Mantener local/private; exponer solo APIs controladas. |
| n8n | dominio interno existente | No al inicio | Webhooks publicos solo cuando haga falta. |
| LiteLLM | `llm.onia.ai` o `ai-gateway.onia.ai` | No | Gateway privado de modelos y llaves. |
| Open WebUI | `chat.onia.ai` | No al inicio | Solo ONIA interno. |
| Dify | `dify.onia.ai` | No al inicio | Interno/single-workspace para demos y apps IA. |
| Crawl4AI | `crawl.onia.ai` | No | API interna/MCP. |
| Firecrawl | `firecrawl.onia.ai` | No | Solo interno/tunel; queue admin protegido. |
| Stirling PDF | `pdf.onia.ai` | No al inicio | Login obligatorio si se expone. |
| Uptime Kuma | `status.onia.ai` | Parcial | Status publico limitado; admin privado. |
| SearXNG | `search.onia.ai` | No | Busqueda interna para research/agentes. |
| Qdrant | sin dominio publico | No | Solo red interna/API privada. |
| Langfuse | `langfuse.onia.ai` | No | Observabilidad IA privada. |
| Chatwoot | `support.onia.ai` | Si, si se usa | Inbox publico/client-facing con admin protegido. |
| Typebot | `forms.onia.ai` | Si, si se usa | Embeds/forms publicos; builder privado. |
| Infisical | `vault.onia.ai` | No | Secret management privado. |
| Authentik/Authelia | `auth.onia.ai` | No/Controlado | SSO/forward auth. |
| Langflow | `langflow.onia.ai` | No | Laboratorio. |
| Maxun | `maxun.onia.ai` | No | Laboratorio. |
| OpenHands | sin dominio publico | No | Solo aislado. |
| Coolify | `deploy.onia.ai` | No por ahora | Solo en VPS nuevo o migracion. |

## Checklist antes de instalar cada herramienta

1. Confirmar si va en VPS actual o VPS separado.
2. Confirmar dominio o acceso por tunel.
3. Revisar licencia del tag/version exacta.
4. Crear directorio en `/opt/onia-<servicio>`.
5. Crear `.env` en VPS, nunca en repo.
6. Usar volumenes persistentes.
7. No publicar puertos directos si Traefik/Easypanel enruta.
8. Agregar healthcheck o comando de validacion.
9. Documentar backups.
10. Registrar en este documento estado, URL y pendiente.

## Matriz comercial

| Oferta ONIA posible | Herramientas | Se puede vender ya? | Condicion |
|---|---|---|---|
| IA interna para negocio | Open WebUI + LiteLLM + Ollama/API | Si, como implementacion interna | Sin prometer modelo propio ni rebranding falso. |
| Chatbot/RAG vendible | Dify + Supabase + n8n + LiteLLM | Si, despues de piloto | Aclarar costos de modelos, alcance y licencia. |
| Bot/lead qualification web | Typebot + n8n + Supabase | Si, si definimos oferta | Bueno para landings y ventas simples. |
| Inbox/CRM conversacional | Chatwoot + n8n + Supabase | Si, con setup claro | WhatsApp oficial requiere costos/cuenta Meta/BSP. |
| Kit PDF seguro | Stirling PDF | Si | Con login y alcance claro. |
| Auditoria web con datos | Crawl4AI + SearXNG + n8n + Supabase | Si | Como proceso de consultoria, no scraping agresivo. |
| Research web con agente | Firecrawl + SearXNG + n8n + Supabase | Si, interno | Solo fuentes permitidas; no scraping agresivo ni cuentas privadas. |
| Observabilidad IA | Langfuse + LiteLLM/Dify | Todavia no | Vender cuando ya tengamos apps IA con trafico real. |
| Scraping no-code | Maxun | Con cautela | Solo datos permitidos/publicos y acuerdo de uso. |
| Agente de navegador | Browser Use | Con cautela | Siempre con supervision humana. |
| Agente dev/codigo | OpenHands | No como servicio general todavia | Primero laboratorio aislado. |
| Plataforma deploy cliente | Coolify | No ahora | ONIA usa Easypanel; evaluar VPS dedicado. |

## Fuentes oficiales revisadas

- Langflow Docker docs: https://docs.langflow.org/deployment-docker
- Browser Use docs: https://docs.browser-use.com/open-source/quickstart
- Open WebUI docs: https://docs.openwebui.com/
- Open WebUI license: https://github.com/open-webui/open-webui/blob/main/LICENSE
- Supabase self-host Docker docs: https://supabase.com/docs/guides/self-hosting/docker
- n8n Docker docs: https://docs.n8n.io/hosting/installation/docker/
- n8n queue mode docs: https://docs.n8n.io/hosting/scaling/queue-mode/
- LiteLLM deploy docs: https://docs.litellm.ai/docs/proxy/deploy
- LiteLLM Docker quick start: https://docs.litellm.ai/docs/proxy/docker_quick_start
- Langfuse Docker Compose docs: https://langfuse.com/self-hosting/deployment/docker-compose
- Qdrant installation docs: https://qdrant.tech/documentation/installation/
- SearXNG Docker docs: https://docs.searxng.org/admin/installation-docker.html
- Chatwoot Docker/self-host docs: https://developers.chatwoot.com/self-hosted/deployment/docker
- Typebot Docker self-host docs: https://docs.typebot.com/self-hosting/deploy/docker
- Uptime Kuma GitHub/docs: https://github.com/louislam/uptime-kuma
- Grafana Docker docs: https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/
- Infisical Docker Compose docs: https://infisical.com/docs/self-hosting/deployment-options/docker-compose
- Authentik Docker Compose docs: https://docs.goauthentik.io/install-config/install/docker-compose/
- Authelia Traefik setup docs: https://www.authelia.com/blog/authelia--traefik-setup-guide/
- Directus self-host deploy docs: https://directus.com/docs/self-hosting/deploying
- NocoDB GitHub/docs: https://github.com/nocodb/nocodb
- MinIO GitHub/docs: https://github.com/minio/minio
- PostHog self-host docs: https://posthog.com/docs/self-host
- Sentry self-host docs: https://develop.sentry.dev/self-hosted/
- Docmost install docs: https://docmost.com/docs/installation
- Outline self-host docs: https://docs.getoutline.com/s/hosting
- Stirling PDF GitHub/docs: https://github.com/Stirling-Tools/Stirling-PDF
- Stirling PDF Docker docs: https://docs.stirlingpdf.com/Installation/Docker%20Install/
- Coolify install docs: https://coolify.io/docs/get-started/installation
- Crawl4AI docs: https://docs.crawl4ai.com/
- Crawl4AI self-host docs: https://docs.crawl4ai.com/core/self-hosting/
- Firecrawl GitHub: https://github.com/firecrawl/firecrawl
- Firecrawl self-host docs: https://github.com/firecrawl/firecrawl/blob/main/SELF_HOST.md
- OpenHands GitHub/docs: https://github.com/OpenHands/OpenHands
- OpenHands Docker sandbox docs: https://docs.openhands.dev/openhands/usage/sandboxes/docker
- Maxun self-host docs: https://docs.maxun.dev/category/self-host
- Maxun Docker guide: https://github.com/getmaxun/maxun/blob/develop/docs/self-hosting-docker.md
- Dify Docker Compose docs: https://docs.dify.ai/en/self-host/quick-start/docker-compose
- Dify license: https://github.com/langgenius/dify/blob/main/LICENSE

## Proxima accion recomendada

No instalar todo junto. El siguiente orden correcto es:

```text
1. Validar Supabase: health, backups restaurables, schemas base, acceso privado.
2. Instalar Uptime Kuma para monitorear Cal, n8n, Supabase y futuros servicios.
3. Instalar LiteLLM como gateway interno de modelos.
4. Instalar Open WebUI interno.
5. Instalar Dify interno/single-workspace.
6. Instalar Crawl4AI y Stirling PDF.
```

Despues:

```text
SearXNG -> Langfuse -> Chatwoot/Typebot -> Qdrant si pgvector no basta
```

Mantener en laboratorio o VPS aislado:

```text
Browser Use, Maxun, OpenHands, Coolify, Grafana/Prometheus, PostHog, Sentry
```

El primer bloque instala capacidad vendible sin comprometer la base de datos ni
abrir paneles riesgosos. El segundo bloque se activa cuando exista uso real,
ventas o una necesidad operativa clara.
